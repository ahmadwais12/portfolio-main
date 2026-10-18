-- Super Admin role on public.users, removal of public.analytics_admins,
-- missing relationships/columns/tables, and Storage bucket rules.
-- Run once in Supabase Dashboard -> SQL Editor. Safe to re-run.

begin;

-- ─────────────────────────────────────────────────────────────
-- 1. users: role column (only role that exists is 'Super Admin')
-- ─────────────────────────────────────────────────────────────

alter table public.users add column if not exists role text;

alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role is null or role = 'Super Admin');

-- Deleting an Auth account must also delete its profile row.
alter table public.users
  drop constraint if exists users_id_fkey,
  add constraint users_id_fkey foreign key (id) references auth.users (id) on delete cascade;

create index if not exists users_role_idx on public.users (role) where role is not null;

-- Every Auth account gets a public.users row.
insert into public.users (id, email, display_name, avatar_url)
select au.id, au.email, coalesce(au.raw_user_meta_data ->> 'full_name', ''), au.raw_user_meta_data ->> 'avatar_url'
from auth.users au
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The very first account becomes Super Admin; later accounts start with no role.
  perform pg_advisory_xact_lock(hashtext('public.users.super_admin_bootstrap'));

  insert into public.users (id, email, display_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    case when exists (select 1 from public.users where role = 'Super Admin') then null else 'Super Admin' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.users set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Carry existing dashboard admins over before the allowlist table is dropped.
do $$
begin
  if to_regclass('public.analytics_admins') is not null then
    update public.users u
    set role = 'Super Admin'
    from public.analytics_admins a
    where a.user_id = u.id;
  end if;
end;
$$;

-- If nobody is Super Admin yet and there is exactly one account, promote it.
do $$
begin
  if not exists (select 1 from public.users where role = 'Super Admin')
     and (select count(*) from public.users) = 1 then
    update public.users set role = 'Super Admin';
  end if;
end;
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'Super Admin'
  );
$$;

-- Kept under its old name because the dashboard and analytics RPCs call it.
create or replace function public.is_analytics_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_super_admin();
$$;

revoke all on function public.is_super_admin() from public;
revoke all on function public.is_analytics_admin() from public;
grant execute on function public.is_super_admin() to anon, authenticated;
grant execute on function public.is_analytics_admin() to anon, authenticated;

-- Signed-in users may edit their own name/avatar; only a Super Admin may change roles,
-- and the last Super Admin cannot be demoted (prevents locking everyone out).
create or replace function public.guard_user_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and not public.is_super_admin() then
      raise exception 'Only a Super Admin can change user roles' using errcode = '42501';
    end if;
    if old.role = 'Super Admin'
       and not exists (select 1 from public.users where role = 'Super Admin' and id <> old.id) then
      raise exception 'Cannot remove the last Super Admin' using errcode = '42501';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists users_guard_role on public.users;
create trigger users_guard_role
  before update on public.users
  for each row execute function public.guard_user_role();

alter table public.users enable row level security;

drop policy if exists "Users read own row" on public.users;
create policy "Users read own row" on public.users
  for select to authenticated using (id = auth.uid() or public.is_super_admin());

drop policy if exists "Users update own row" on public.users;
create policy "Users update own row" on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

drop policy if exists "Super admin deletes users" on public.users;
create policy "Super admin deletes users" on public.users
  for delete to authenticated using (public.is_super_admin());

revoke insert, update on public.users from anon, authenticated;
grant update (display_name, avatar_url, role) on public.users to authenticated;

-- ─────────────────────────────────────────────────────────────
-- 2. Remove public.analytics_admins
-- ─────────────────────────────────────────────────────────────

-- Abort (nothing is changed) if another function still reads the old table directly.
do $$
declare
  refs text;
begin
  select string_agg(p.oid::regprocedure::text, ', ')
  into refs
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prosrc ilike '%analytics_admins%';

  if refs is not null then
    raise exception 'These functions still reference analytics_admins; change them to call public.is_super_admin() first: %', refs;
  end if;
end;
$$;

-- Policies on other tables (including storage.objects) that used the allowlist.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where tablename <> 'analytics_admins'
      and (coalesce(qual, '') || ' ' || coalesce(with_check, '')) ilike '%analytics_admins%'
  loop
    execute format('drop policy %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end;
$$;

drop table if exists public.analytics_admins;

-- ─────────────────────────────────────────────────────────────
-- 3. Missing relationships, columns and tables
-- ─────────────────────────────────────────────────────────────

-- Analytics: removing a visitor/session removes its child rows.
alter table public.analytics_sessions
  drop constraint if exists analytics_sessions_visitor_id_fkey,
  add constraint analytics_sessions_visitor_id_fkey
    foreign key (visitor_id) references public.analytics_visitors (id) on delete cascade;

alter table public.analytics_page_views
  drop constraint if exists analytics_page_views_visitor_id_fkey,
  add constraint analytics_page_views_visitor_id_fkey
    foreign key (visitor_id) references public.analytics_visitors (id) on delete cascade,
  drop constraint if exists analytics_page_views_session_id_fkey,
  add constraint analytics_page_views_session_id_fkey
    foreign key (session_id) references public.analytics_sessions (id) on delete cascade;

alter table public.analytics_events
  drop constraint if exists analytics_events_visitor_id_fkey,
  add constraint analytics_events_visitor_id_fkey
    foreign key (visitor_id) references public.analytics_visitors (id) on delete cascade,
  drop constraint if exists analytics_events_session_id_fkey,
  add constraint analytics_events_session_id_fkey
    foreign key (session_id) references public.analytics_sessions (id) on delete cascade;

-- Portfolio content: record which user last edited each row, and keep updated_at current.
create or replace function public.portfolio_touch_row()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := (select u.id from public.users u where u.id = auth.uid());
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'portfolio_profile', 'portfolio_projects', 'portfolio_skills', 'portfolio_resume_items',
    'portfolio_services', 'portfolio_testimonials', 'portfolio_social_links', 'portfolio_settings'
  ]
  loop
    execute format('alter table public.%I add column if not exists updated_by uuid', t);
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_updated_by_fkey');
    execute format(
      'alter table public.%I add constraint %I foreign key (updated_by) references public.users (id) on delete set null',
      t, t || '_updated_by_fkey');
    execute format('create index if not exists %I on public.%I (updated_by)', t || '_updated_by_idx', t);

    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format(
      'create trigger %I before insert or update on public.%I for each row execute function public.portfolio_touch_row()',
      t || '_touch', t);
  end loop;
end;
$$;

-- Contact form messages (the site form currently only simulates sending).
create table if not exists public.portfolio_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  read_at timestamptz,
  handled_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_contact_messages_created_at_idx
  on public.portfolio_contact_messages (created_at desc);
create index if not exists portfolio_contact_messages_handled_by_idx
  on public.portfolio_contact_messages (handled_by);

alter table public.portfolio_contact_messages enable row level security;

drop policy if exists "Anyone can send a contact message" on public.portfolio_contact_messages;
create policy "Anyone can send a contact message" on public.portfolio_contact_messages
  for insert to anon, authenticated
  with check (status = 'new' and read_at is null and handled_by is null);

drop policy if exists "Super admin manages contact messages" on public.portfolio_contact_messages;
create policy "Super admin manages contact messages" on public.portfolio_contact_messages
  for all to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

grant insert on public.portfolio_contact_messages to anon, authenticated;
grant select, update, delete on public.portfolio_contact_messages to authenticated;

-- Row level security for portfolio content: public reads what is published, Super Admin writes.
do $$
declare
  t text;
  visible text;
begin
  foreach t in array array[
    'portfolio_profile', 'portfolio_projects', 'portfolio_skills', 'portfolio_resume_items',
    'portfolio_services', 'portfolio_testimonials', 'portfolio_social_links', 'portfolio_settings'
  ]
  loop
    visible := case
      when t in ('portfolio_profile', 'portfolio_settings') then 'true'
      when t = 'portfolio_social_links' then 'enabled'
      else 'published'
    end;

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', 'Public reads ' || t, t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (%s or public.is_super_admin())',
      'Public reads ' || t, t, visible);

    execute format('drop policy if exists %I on public.%I', 'Super admin writes ' || t, t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin())',
      'Super admin writes ' || t, t);
  end loop;
end;
$$;

alter table public.portfolio_seo_audits enable row level security;
drop policy if exists "Super admin manages portfolio_seo_audits" on public.portfolio_seo_audits;
create policy "Super admin manages portfolio_seo_audits" on public.portfolio_seo_audits
  for all to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Analytics tables are written only through the security-definer tracking RPCs.
do $$
declare
  t text;
begin
  foreach t in array array[
    'analytics_visitors', 'analytics_sessions', 'analytics_page_views',
    'analytics_events', 'analytics_bots', 'analytics_rate_limits'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', 'Super admin reads ' || t, t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_super_admin())',
      'Super admin reads ' || t, t);
  end loop;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 4. Storage buckets
--    portfolio-assets: project/testimonial images, logo, resume PDF
--    profile-images:   profile/avatar photos
--    Folders are optional path prefixes and are created on upload.
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-assets', 'portfolio-assets', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('profile-images', 'profile-images', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve files by URL without a select policy, so anonymous visitors cannot list them.
drop policy if exists "Super admin reads portfolio files" on storage.objects;
create policy "Super admin reads portfolio files" on storage.objects
  for select to authenticated
  using (bucket_id in ('portfolio-assets', 'profile-images') and public.is_super_admin());

drop policy if exists "Super admin uploads portfolio files" on storage.objects;
create policy "Super admin uploads portfolio files" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('portfolio-assets', 'profile-images') and public.is_super_admin());

drop policy if exists "Super admin updates portfolio files" on storage.objects;
create policy "Super admin updates portfolio files" on storage.objects
  for update to authenticated
  using (bucket_id in ('portfolio-assets', 'profile-images') and public.is_super_admin())
  with check (bucket_id in ('portfolio-assets', 'profile-images') and public.is_super_admin());

drop policy if exists "Super admin deletes portfolio files" on storage.objects;
create policy "Super admin deletes portfolio files" on storage.objects
  for delete to authenticated
  using (bucket_id in ('portfolio-assets', 'profile-images') and public.is_super_admin());

commit;
