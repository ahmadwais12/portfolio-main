-- Portfolio content seed.
-- Run after the base schema and 20261001090000_add_multilingual_content_columns.sql.
-- Safe to rerun: existing settings and social link records are preserved.
--
-- The UI copy is the current English text in src/components. Dari (prs) and
-- Pashto (ps) are intentionally empty until translations are provided.
-- Projects, skills, resume entries, services, testimonials, analytics,
-- contact messages, and admin users have no legitimate static records to seed.

begin;

do $preflight$
begin
  if to_regclass('public.portfolio_settings') is null
     or to_regclass('public.portfolio_social_links') is null then
    raise exception 'Run the base Supabase schema before supabase/seed.sql';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_settings'
      and column_name in ('launcher_text_en', 'launcher_text_prs', 'launcher_text_ps')
    group by table_schema, table_name
    having count(*) = 3
  ) or not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_social_links'
      and column_name in ('label_en', 'label_prs', 'label_ps', 'sub_en', 'sub_prs', 'sub_ps')
    group by table_schema, table_name
    having count(*) = 6
  ) then
    raise exception 'Run the multilingual content migration before supabase/seed.sql';
  end if;
end
$preflight$;

-- Preserve existing extra settings and existing UI translations on reruns.
insert into public.portfolio_settings (id, launcher_text_en, launcher_text_prs, launcher_text_ps, extra)
values (
  'main',
  'Portfolio',
  '',
  '',
  jsonb_build_object(
    'uiTranslations', $ui_translations$
{
  "hero.available": {"en": "Available for new projects", "prs": "", "ps": ""},
  "hero.firstNameGreeting": {"en": "Hi, I'm {name}", "prs": "", "ps": ""},
  "hero.introWithName": {"en": "Welcome to my {highlight}", "prs": "", "ps": ""},
  "hero.titleFallback": {"en": "Crafting fast, accessible and beautiful digital experiences as a {title}.", "prs": "", "ps": ""},
  "hero.scroll": {"en": "Scroll", "prs": "", "ps": ""},
  "hero.scrollToAbout": {"en": "Scroll to about section", "prs": "", "ps": ""},
  "hero.yearsExperience": {"en": "Years experience", "prs": "", "ps": ""},
  "hero.projectsDone": {"en": "Projects done", "prs": "", "ps": ""},
  "hero.technologies": {"en": "Technologies", "prs": "", "ps": ""},
  "hero.greeting": {"en": "Hi, I’m", "prs": "", "ps": ""},
  "hero.iAm": {"en": "I’m a", "prs": "", "ps": ""},
  "hero.intro": {"en": "Welcome to my portfolio", "prs": "", "ps": ""},
  "hero.viewWork": {"en": "View My Work", "prs": "", "ps": ""},
  "hero.contact": {"en": "Contact Me", "prs": "", "ps": ""},
  "hero.downloadCv": {"en": "Download CV", "prs": "", "ps": ""},
  "nav.home": {"en": "Home", "prs": "", "ps": ""},
  "nav.about": {"en": "About", "prs": "", "ps": ""},
  "nav.skills": {"en": "Skills", "prs": "", "ps": ""},
  "nav.services": {"en": "Services", "prs": "", "ps": ""},
  "nav.projects": {"en": "Projects", "prs": "", "ps": ""},
  "nav.resume": {"en": "Resume", "prs": "", "ps": ""},
  "nav.testimonials": {"en": "Testimonials", "prs": "", "ps": ""},
  "nav.contact": {"en": "Contact", "prs": "", "ps": ""},
  "nav.hireMe": {"en": "Hire Me", "prs": "", "ps": ""},
  "nav.mainNavigation": {"en": "Main navigation", "prs": "", "ps": ""},
  "nav.closeMenu": {"en": "Close menu", "prs": "", "ps": ""},
  "nav.openMenu": {"en": "Open menu", "prs": "", "ps": ""},
  "nav.switchToLightTheme": {"en": "Switch to light theme", "prs": "", "ps": ""},
  "language.select": {"en": "Select language", "prs": "", "ps": ""},
  "nav.switchToDarkTheme": {"en": "Switch to dark theme", "prs": "", "ps": ""},
  "about.eyebrow": {"en": "Get to know me", "prs": "", "ps": ""},
  "about.title": {"en": "About", "prs": "", "ps": ""},
  "about.pageTitle": {"en": "About Me", "prs": "", "ps": ""},
  "about.highlight": {"en": "Me", "prs": "", "ps": ""},
  "about.description": {"en": "A little about who I am and what I do.", "prs": "", "ps": ""},
  "about.whoIAm": {"en": "Who I am", "prs": "", "ps": ""},
  "about.im": {"en": "I'm {name}", "prs": "", "ps": ""},
  "about.profilePhoto": {"en": "Profile photo", "prs": "", "ps": ""},
  "about.bioFallback": {"en": "Add your bio from the dashboard to introduce yourself here.", "prs": "", "ps": ""},
  "about.yearsExperience": {"en": "Years Experience", "prs": "", "ps": ""},
  "about.projectsCompleted": {"en": "Projects Completed", "prs": "", "ps": ""},
  "about.technologies": {"en": "Technologies", "prs": "", "ps": ""},
  "about.yearsOfExperience": {"en": "Years of experience", "prs": "", "ps": ""},
  "about.email": {"en": "Email", "prs": "", "ps": ""},
  "about.phone": {"en": "Phone", "prs": "", "ps": ""},
  "about.location": {"en": "Location", "prs": "", "ps": ""},
  "about.workTogether": {"en": "Let’s work together", "prs": "", "ps": ""},
  "about.downloadCv": {"en": "Download CV", "prs": "", "ps": ""},
  "skills.title": {"en": "Skills", "prs": "", "ps": ""},
  "skills.my": {"en": "My", "prs": "", "ps": ""},
  "skills.pageTitle": {"en": "My Skills", "prs": "", "ps": ""},
  "skills.eyebrow": {"en": "Technical arsenal", "prs": "", "ps": ""},
  "skills.description": {"en": "Technologies and tools I use to bring ideas to life.", "prs": "", "ps": ""},
  "skills.emptyTitle": {"en": "No skills yet", "prs": "", "ps": ""},
  "skills.emptyDescription": {"en": "Skills added from the dashboard will appear here.", "prs": "", "ps": ""},
  "skills.categories": {"en": "Categories", "prs": "", "ps": ""},
  "skills.averageProficiency": {"en": "Avg. proficiency", "prs": "", "ps": ""},
  "skills.yearsExperience": {"en": "Years experience", "prs": "", "ps": ""},
  "skills.technologiesCount": {"en": "{count} technologies", "prs": "", "ps": ""},
  "services.title": {"en": "Services", "prs": "", "ps": ""},
  "services.pageTitle": {"en": "My Services", "prs": "", "ps": ""},
  "services.eyebrow": {"en": "What I offer", "prs": "", "ps": ""},
  "services.description": {"en": "End-to-end help to design, build and launch products your users will love.", "prs": "", "ps": ""},
  "services.emptyTitle": {"en": "No services yet", "prs": "", "ps": ""},
  "services.emptyDescription": {"en": "Services added from the dashboard will appear here.", "prs": "", "ps": ""},
  "services.ctaTitle": {"en": "Have a project in mind?", "prs": "", "ps": ""},
  "services.ctaDescription": {"en": "Let's talk about how I can help bring it to life.", "prs": "", "ps": ""},
  "services.ctaButton": {"en": "Start a project", "prs": "", "ps": ""},
  "services.ctaStartProject": {"en": "Start a project", "prs": "", "ps": ""},
  "services.my": {"en": "My", "prs": "", "ps": ""},
  "projects.title": {"en": "Projects", "prs": "", "ps": ""},
  "projects.pageTitle": {"en": "Featured Projects", "prs": "", "ps": ""},
  "projects.eyebrow": {"en": "Portfolio showcase", "prs": "", "ps": ""},
  "projects.description": {"en": "A selection of recent work and personal projects.", "prs": "", "ps": ""},
  "projects.emptyTitle": {"en": "No projects yet", "prs": "", "ps": ""},
  "projects.emptyDescription": {"en": "Projects added from the dashboard will appear here.", "prs": "", "ps": ""},
  "projects.viewProject": {"en": "View Project", "prs": "", "ps": ""},
  "projects.featured": {"en": "Featured", "prs": "", "ps": ""},
  "projects.all": {"en": "All", "prs": "", "ps": ""},
  "projects.category": {"en": "Category", "prs": "", "ps": ""},
  "projects.techStack": {"en": "Tech Stack", "prs": "", "ps": ""},
  "projects.toolsCount": {"en": "{count} tools", "prs": "", "ps": ""},
  "projects.status": {"en": "Status", "prs": "", "ps": ""},
  "projects.completed": {"en": "Completed", "prs": "", "ps": ""},
  "projects.viewSourceOnGithub": {"en": "View source on GitHub", "prs": "", "ps": ""},
  "projects.viewCode": {"en": "View Code", "prs": "", "ps": ""},
  "projects.aboutProject": {"en": "About this project", "prs": "", "ps": ""},
  "projects.viewDetails": {"en": "View Details", "prs": "", "ps": ""},
  "projects.titlePrefix": {"en": "Featured", "prs": "", "ps": ""},
  "resume.eyebrow": {"en": "My journey", "prs": "", "ps": ""},
  "resume.title": {"en": "Resume & Experience", "prs": "", "ps": ""},
  "resume.titlePrefix": {"en": "Resume &", "prs": "", "ps": ""},
  "resume.highlight": {"en": "Experience", "prs": "", "ps": ""},
  "resume.download": {"en": "Download Resume", "prs": "", "ps": ""},
  "resume.pageTitle": {"en": "Resume & Experience", "prs": "", "ps": ""},
  "resume.description": {"en": "My professional journey, education and certifications.", "prs": "", "ps": ""},
  "resume.emptyTitle": {"en": "No resume entries yet", "prs": "", "ps": ""},
  "resume.emptyDescription": {"en": "Work, education and certifications added from the dashboard will appear here.", "prs": "", "ps": ""},
  "resume.work": {"en": "Work", "prs": "", "ps": ""},
  "resume.education": {"en": "Education", "prs": "", "ps": ""},
  "resume.certification": {"en": "Certification", "prs": "", "ps": ""},
  "resume.certifications": {"en": "Certifications", "prs": "", "ps": ""},
  "resume.totalEntries": {"en": "Total entries", "prs": "", "ps": ""},
  "resume.all": {"en": "All", "prs": "", "ps": ""},
  "testimonials.eyebrow": {"en": "Kind words", "prs": "", "ps": ""},
  "testimonials.title": {"en": "Testimonials", "prs": "", "ps": ""},
  "testimonials.titlePrefix": {"en": "Client", "prs": "", "ps": ""},
  "testimonials.pageTitle": {"en": "Client Testimonials", "prs": "", "ps": ""},
  "testimonials.description": {"en": "Don’t just take my word for it. Here’s what people say about working with me.", "prs": "", "ps": ""},
  "testimonials.emptyTitle": {"en": "No testimonials yet", "prs": "", "ps": ""},
  "testimonials.emptyDescription": {"en": "Testimonials added from the dashboard will appear here.", "prs": "", "ps": ""},
  "contact.eyebrow": {"en": "Let’s talk", "prs": "", "ps": ""},
  "contact.title": {"en": "Get In", "prs": "", "ps": ""},
  "contact.highlight": {"en": "Touch", "prs": "", "ps": ""},
  "contact.pageTitle": {"en": "Get In Touch", "prs": "", "ps": ""},
  "contact.description": {"en": "Have a project in mind? Let’s build something amazing together.", "prs": "", "ps": ""},
  "contact.name": {"en": "Name", "prs": "", "ps": ""},
  "contact.namePlaceholder": {"en": "Your name", "prs": "", "ps": ""},
  "contact.emailPlaceholder": {"en": "your@email.com", "prs": "", "ps": ""},
  "contact.email": {"en": "Email", "prs": "", "ps": ""},
  "contact.phone": {"en": "Phone", "prs": "", "ps": ""},
  "contact.location": {"en": "Location", "prs": "", "ps": ""},
  "contact.formTitle": {"en": "Send a Message", "prs": "", "ps": ""},
  "contact.subject": {"en": "Subject", "prs": "", "ps": ""},
  "contact.subjectPlaceholder": {"en": "How can I help?", "prs": "", "ps": ""},
  "contact.message": {"en": "Message", "prs": "", "ps": ""},
  "contact.messagePlaceholder": {"en": "Tell me about your project...", "prs": "", "ps": ""},
  "contact.sending": {"en": "Sending...", "prs": "", "ps": ""},
  "contact.sendMessage": {"en": "Send Message", "prs": "", "ps": ""},
  "contact.sent": {"en": "Message sent! I’ll get back to you soon.", "prs": "", "ps": ""},
  "contact.availableForWork": {"en": "Available for Work", "prs": "", "ps": ""},
  "contact.opportunities": {"en": "Open to freelance & full-time opportunities", "prs": "", "ps": ""},
  "contact.connectWithMe": {"en": "Connect With Me", "prs": "", "ps": ""},
  "footer.quickLinks": {"en": "Quick Links", "prs": "", "ps": ""},
  "footer.status": {"en": "Status", "prs": "", "ps": ""},
  "footer.availableForWork": {"en": "Available for Work", "prs": "", "ps": ""},
  "footer.opportunities": {"en": "Open to new opportunities", "prs": "", "ps": ""},
  "footer.findMeOn": {"en": "Find Me On", "prs": "", "ps": ""},
  "footer.rights": {"en": "All rights reserved.", "prs": "", "ps": ""},
  "footer.madeWith": {"en": "Made with", "prs": "", "ps": ""},
  "footer.backToTop": {"en": "Back to top", "prs": "", "ps": ""},
  "footer.craftedWith": {"en": "Crafted with", "prs": "", "ps": ""},
  "footer.andPassion": {"en": "and passion", "prs": "", "ps": ""},
  "footer.in": {"en": "in", "prs": "", "ps": ""},
  "footer.designingExperiences": {"en": "Designing and building modern, fast and accessible web experiences.", "prs": "", "ps": ""}
}
$ui_translations$::jsonb
  )
)
on conflict (id) do update
set launcher_text_en = coalesce(nullif(public.portfolio_settings.launcher_text_en, ''), excluded.launcher_text_en),
    launcher_text_prs = coalesce(public.portfolio_settings.launcher_text_prs, excluded.launcher_text_prs),
    launcher_text_ps = coalesce(public.portfolio_settings.launcher_text_ps, excluded.launcher_text_ps),
    extra = coalesce(public.portfolio_settings.extra, '{}'::jsonb)
      || jsonb_build_object(
        'uiTranslations',
        coalesce(excluded.extra -> 'uiTranslations', '{}'::jsonb)
          || coalesce(public.portfolio_settings.extra -> 'uiTranslations', '{}'::jsonb)
      );

-- Existing UI defaults from src/lib/store.ts. URLs are left blank by design.
insert into public.portfolio_social_links
  (id, label, label_en, label_prs, label_ps, icon, sub, sub_en, sub_prs, sub_ps, url, color, enabled, sort_order)
values
  ('github', 'GitHub', 'GitHub', '', '', 'github', 'View my repos', 'View my repos', '', '', '', '#6e7681', true, 0),
  ('linkedin', 'LinkedIn', 'LinkedIn', '', '', 'linkedin', 'Let''s connect', 'Let''s connect', '', '', '', '#0a66c2', true, 1),
  ('x', 'X', 'X', '', '', 'x', 'Follow updates', 'Follow updates', '', '', '', '#1d9bf0', true, 2),
  ('instagram', 'Instagram', 'Instagram', '', '', 'instagram', 'Behind the scenes', 'Behind the scenes', '', '', '', '#e1306c', true, 3),
  ('facebook', 'Facebook', 'Facebook', '', '', 'facebook', 'Stay in touch', 'Stay in touch', '', '', '', '#1877f2', true, 4),
  ('youtube', 'YouTube', 'YouTube', '', '', 'youtube', 'Watch my videos', 'Watch my videos', '', '', '', '#ff0033', true, 5),
  ('tiktok', 'TikTok', 'TikTok', '', '', 'tiktok', 'Short clips', 'Short clips', '', '', '', '#fe2c55', true, 6),
  ('whatsapp', 'WhatsApp', 'WhatsApp', '', '', 'whatsapp', 'Chat with me', 'Chat with me', '', '', '', '#25d366', true, 7),
  ('telegram', 'Telegram', 'Telegram', '', '', 'telegram', 'Message me', 'Message me', '', '', '', '#2aabee', true, 8),
  ('discord', 'Discord', 'Discord', '', '', 'discord', 'Join my server', 'Join my server', '', '', '', '#5865f2', true, 9),
  ('reddit', 'Reddit', 'Reddit', '', '', 'reddit', 'My discussions', 'My discussions', '', '', '', '#ff4500', true, 10),
  ('dribbble', 'Dribbble', 'Dribbble', '', '', 'dribbble', 'Design shots', 'Design shots', '', '', '', '#ea4c89', true, 11),
  ('behance', 'Behance', 'Behance', '', '', 'behance', 'Creative work', 'Creative work', '', '', '', '#1769ff', true, 12),
  ('stackoverflow', 'Stack Overflow', 'Stack Overflow', '', '', 'stackoverflow', 'Answers I wrote', 'Answers I wrote', '', '', '', '#f48024', true, 13),
  ('medium', 'Medium', 'Medium', '', '', 'medium', 'Articles & posts', 'Articles & posts', '', '', '', '#00ab6c', true, 14),
  ('hashnode', 'Hashnode', 'Hashnode', '', '', 'hashnode', 'Dev blog', 'Dev blog', '', '', '', '#2962ff', true, 15),
  ('spotify', 'Spotify', 'Spotify', '', '', 'spotify', 'Playlists I love', 'Playlists I love', '', '', '', '#1db954', true, 16),
  ('leetcode', 'LeetCode', 'LeetCode', '', '', 'leetcode', 'Coding challenges', 'Coding challenges', '', '', '', '#ffa116', true, 17)
on conflict (id) do nothing;

commit;
