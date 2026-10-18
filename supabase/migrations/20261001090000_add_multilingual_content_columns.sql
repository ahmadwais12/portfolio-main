-- Add English, Dari, and Pashto fields for editable text displayed on the website.
-- Existing columns are kept for backward compatibility. The English fields are
-- initialized from those columns; Dari (prs) and Pashto (ps) remain NULL until translated.
-- Safe to re-run.
-- The other schema tables are intentionally unchanged: SEO audits and analytics
-- are generated records, users are admin account data, and contact messages must
-- remain in the language in which visitors submitted them.

begin;

-- Profile text
alter table public.portfolio_profile
  add column if not exists full_name_en text,
  add column if not exists full_name_prs text,
  add column if not exists full_name_ps text,
  add column if not exists title_en text,
  add column if not exists title_prs text,
  add column if not exists title_ps text,
  add column if not exists bio_en text,
  add column if not exists bio_prs text,
  add column if not exists bio_ps text,
  add column if not exists location_en text,
  add column if not exists location_prs text,
  add column if not exists location_ps text,
  add column if not exists email_en text,
  add column if not exists email_prs text,
  add column if not exists email_ps text,
  add column if not exists phone_en text,
  add column if not exists phone_prs text,
  add column if not exists phone_ps text,
  add column if not exists years_experience_en text,
  add column if not exists years_experience_prs text,
  add column if not exists years_experience_ps text,
  add column if not exists projects_completed_en text,
  add column if not exists projects_completed_prs text,
  add column if not exists projects_completed_ps text,
  add column if not exists technologies_en text,
  add column if not exists technologies_prs text,
  add column if not exists technologies_ps text;

update public.portfolio_profile
set full_name_en = full_name where full_name_en is null;
update public.portfolio_profile
set title_en = title where title_en is null;
update public.portfolio_profile
set bio_en = bio where bio_en is null;
update public.portfolio_profile
set location_en = location where location_en is null;
update public.portfolio_profile
set email_en = email where email_en is null;
update public.portfolio_profile
set phone_en = phone where phone_en is null;
update public.portfolio_profile
set years_experience_en = years_experience where years_experience_en is null;
update public.portfolio_profile
set projects_completed_en = projects_completed where projects_completed_en is null;
update public.portfolio_profile
set technologies_en = technologies where technologies_en is null;

-- Projects
alter table public.portfolio_projects
  add column if not exists title_en text,
  add column if not exists title_prs text,
  add column if not exists title_ps text,
  add column if not exists description_en text,
  add column if not exists description_prs text,
  add column if not exists description_ps text,
  add column if not exists long_description_en text,
  add column if not exists long_description_prs text,
  add column if not exists long_description_ps text,
  add column if not exists category_en text,
  add column if not exists category_prs text,
  add column if not exists category_ps text,
  add column if not exists tags_en text[],
  add column if not exists tags_prs text[],
  add column if not exists tags_ps text[];

update public.portfolio_projects set title_en = title where title_en is null;
update public.portfolio_projects set description_en = description where description_en is null;
update public.portfolio_projects set long_description_en = long_description where long_description_en is null;
update public.portfolio_projects set category_en = category where category_en is null;
update public.portfolio_projects set tags_en = tags where tags_en is null;

-- Skills
alter table public.portfolio_skills
  add column if not exists name_en text,
  add column if not exists name_prs text,
  add column if not exists name_ps text,
  add column if not exists category_en text,
  add column if not exists category_prs text,
  add column if not exists category_ps text;

update public.portfolio_skills set name_en = name where name_en is null;
update public.portfolio_skills set category_en = category where category_en is null;

-- Resume / experience
alter table public.portfolio_resume_items
  add column if not exists title_en text,
  add column if not exists title_prs text,
  add column if not exists title_ps text,
  add column if not exists organization_en text,
  add column if not exists organization_prs text,
  add column if not exists organization_ps text,
  add column if not exists description_en text,
  add column if not exists description_prs text,
  add column if not exists description_ps text,
  add column if not exists period_en text,
  add column if not exists period_prs text,
  add column if not exists period_ps text,
  add column if not exists type_label_en text,
  add column if not exists type_label_prs text,
  add column if not exists type_label_ps text;

update public.portfolio_resume_items set title_en = title where title_en is null;
update public.portfolio_resume_items set organization_en = organization where organization_en is null;
update public.portfolio_resume_items set description_en = description where description_en is null;
update public.portfolio_resume_items set period_en = period where period_en is null;
update public.portfolio_resume_items set type_label_en = type where type_label_en is null;

-- Services, including each item in the displayed feature list
alter table public.portfolio_services
  add column if not exists title_en text,
  add column if not exists title_prs text,
  add column if not exists title_ps text,
  add column if not exists description_en text,
  add column if not exists description_prs text,
  add column if not exists description_ps text,
  add column if not exists features_en text[],
  add column if not exists features_prs text[],
  add column if not exists features_ps text[];

update public.portfolio_services set title_en = title where title_en is null;
update public.portfolio_services set description_en = description where description_en is null;
update public.portfolio_services set features_en = features where features_en is null;

-- Testimonials
alter table public.portfolio_testimonials
  add column if not exists name_en text,
  add column if not exists name_prs text,
  add column if not exists name_ps text,
  add column if not exists role_en text,
  add column if not exists role_prs text,
  add column if not exists role_ps text,
  add column if not exists company_en text,
  add column if not exists company_prs text,
  add column if not exists company_ps text,
  add column if not exists content_en text,
  add column if not exists content_prs text,
  add column if not exists content_ps text;

update public.portfolio_testimonials set name_en = name where name_en is null;
update public.portfolio_testimonials set role_en = role where role_en is null;
update public.portfolio_testimonials set company_en = company where company_en is null;
update public.portfolio_testimonials set content_en = content where content_en is null;

-- Social link labels and captions
alter table public.portfolio_social_links
  add column if not exists label_en text,
  add column if not exists label_prs text,
  add column if not exists label_ps text,
  add column if not exists sub_en text,
  add column if not exists sub_prs text,
  add column if not exists sub_ps text;

update public.portfolio_social_links set label_en = label where label_en is null;
update public.portfolio_social_links set sub_en = sub where sub_en is null;

-- Launcher text is used in the browser title. Logo paths remain shared across languages.
alter table public.portfolio_settings
  add column if not exists launcher_text_en text,
  add column if not exists launcher_text_prs text,
  add column if not exists launcher_text_ps text;

update public.portfolio_settings
set launcher_text_en = extra ->> 'launcherText'
where launcher_text_en is null
  and coalesce(extra ->> 'launcherText', '') <> '';

commit;
