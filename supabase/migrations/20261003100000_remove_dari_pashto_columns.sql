-- The portfolio is English-only. Remove obsolete Dari (prs) and Pashto (ps)
-- content columns while preserving the English values and base content columns.
begin;

alter table public.portfolio_profile
  drop column if exists full_name_prs,
  drop column if exists full_name_ps,
  drop column if exists title_prs,
  drop column if exists title_ps,
  drop column if exists bio_prs,
  drop column if exists bio_ps,
  drop column if exists location_prs,
  drop column if exists location_ps,
  drop column if exists email_prs,
  drop column if exists email_ps,
  drop column if exists phone_prs,
  drop column if exists phone_ps,
  drop column if exists years_experience_prs,
  drop column if exists years_experience_ps,
  drop column if exists projects_completed_prs,
  drop column if exists projects_completed_ps,
  drop column if exists technologies_prs,
  drop column if exists technologies_ps;

alter table public.portfolio_projects
  drop column if exists title_prs,
  drop column if exists title_ps,
  drop column if exists description_prs,
  drop column if exists description_ps,
  drop column if exists long_description_prs,
  drop column if exists long_description_ps,
  drop column if exists category_prs,
  drop column if exists category_ps,
  drop column if exists tags_prs,
  drop column if exists tags_ps;

alter table public.portfolio_skills
  drop column if exists name_prs,
  drop column if exists name_ps,
  drop column if exists category_prs,
  drop column if exists category_ps;

alter table public.portfolio_resume_items
  drop column if exists title_prs,
  drop column if exists title_ps,
  drop column if exists organization_prs,
  drop column if exists organization_ps,
  drop column if exists description_prs,
  drop column if exists description_ps,
  drop column if exists period_prs,
  drop column if exists period_ps,
  drop column if exists type_label_prs,
  drop column if exists type_label_ps;

alter table public.portfolio_services
  drop column if exists title_prs,
  drop column if exists title_ps,
  drop column if exists description_prs,
  drop column if exists description_ps,
  drop column if exists features_prs,
  drop column if exists features_ps;

alter table public.portfolio_testimonials
  drop column if exists name_prs,
  drop column if exists name_ps,
  drop column if exists role_prs,
  drop column if exists role_ps,
  drop column if exists company_prs,
  drop column if exists company_ps,
  drop column if exists content_prs,
  drop column if exists content_ps;

alter table public.portfolio_social_links
  drop column if exists label_prs,
  drop column if exists label_ps,
  drop column if exists sub_prs,
  drop column if exists sub_ps;

alter table public.portfolio_settings
  drop column if exists launcher_text_prs,
  drop column if exists launcher_text_ps;

commit;
