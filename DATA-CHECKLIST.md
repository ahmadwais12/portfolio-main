# Portfolio — Data Checklist

This file lists every piece of data the whole system needs: the public website (Home, About, Skills, Services, Projects, Resume, Testimonials, Contact) and the dashboard (Overview, Analytics, Profile, Projects, Skills, Resume, Testimonials, Services, Social Media, Site Management).

Two ways to give me the data:

1. Fill in the **Fill-in template** at the bottom of this file and hand it back, or
2. Enter it yourself in the dashboard (`/admin` → `/dashboard`) — the website reads from the same database.

Anything marked **required** is needed for the page to look complete. Everything else is optional and will simply be hidden when empty.

---

## 1. Access & setup (no content, just confirm)

| Item | Required | Notes |
| --- | --- | --- |
| Supabase project URL + publishable key | Done | Already configured in `.env` — do not paste keys in chat. |
| Storage buckets `portfolio-assets` and `profile-images` | Done | Created by the Supabase migration. |
| Super Admin account (email + password) | Required | Used for `/admin`. Create extra admins from `/admin/create-user`. |
| Final public domain (e.g. `https://your-domain.com`) | Required | Needed for SEO canonical links, `sitemap.xml`, `robots.txt` and `VITE_SITE_URL`. Currently hard-coded to `https://ahmad-wais.netlify.app`. |

---

## 2. Branding — Dashboard → Site Management

| Item | Required | Format / notes |
| --- | --- | --- |
| Website logo | Yes | PNG or WebP, square, transparent background, ≥ 512×512. Shown in the navbar (turns white in dark mode). |
| Launcher logo (favicon) | Yes | PNG, square, 64–512px. Shown as the browser-tab icon. |
| Launcher text | Yes | Browser-tab / page-title text, e.g. `Ahmad Wais — Portfolio`. |

---

## 3. Profile — Dashboard → Profile (feeds Hero, About, Contact, Footer)

| Field | Required | Notes |
| --- | --- | --- |
| Full name | Yes | Hero headline + brand name. |
| Professional titles | Yes | One per line (or comma-separated); they rotate in the hero. E.g. `Full-Stack Developer`, `Flutter Developer`. |
| Email | Yes | Shown on Contact + used by `mailto:` links. |
| Phone | Yes | Shown on Contact + used by `tel:` links. |
| Location | Yes | Shown on About, Contact, Footer. |
| Biography | Yes | 2–4 sentences; first line is reused in Footer and meta description. |
| Years of experience | Optional (stat) | A number as text, e.g. `5+`. Shown on the About stats. |
| Projects completed | Optional (stat) | E.g. `40+`. Shown on the About stats. |
| Technologies | Optional (stat) | E.g. `15+`. Shown on the About stats. |
| Profile image | Yes | JPG/PNG/WebP, square, ≥ 800×800, ≤ 5 MB. Displayed in the hero's square frame. |
| Resume PDF | Yes | PDF, ≤ 10 MB. Used by the hero "Download CV" button. |

> The old per-profile GitHub/LinkedIn/X/WhatsApp fields are legacy — use **Social Media** instead (section 8).

---

## 4. Projects — Dashboard → Projects (Home featured + `/projects`)

Add 3–8 projects. Per project:

| Field | Required | Notes |
| --- | --- | --- |
| Title | Yes | Project name. |
| Category | Yes | One of: `Web`, `Mobile`, `Design`. Drives the `/projects` filter tabs. |
| Category display text | Optional | Custom label shown on the card instead of "web/mobile/design". |
| Short description | Yes | 1–2 lines for the card. |
| Long description | Optional | Detail paragraph for the project modal. |
| Project image | Yes | JPG/PNG/WebP/GIF, landscape (16:10 / 4:3), ≤ 10 MB. |
| GitHub URL | Optional | Repository link. |
| Live demo URL | Optional | Deployed link. |
| Tags | Optional | Comma-separated tech list, e.g. `React, TypeScript, Node.js`. |
| Featured | Optional | Toggle to include it in the home "featured" set. |

---

## 5. Skills — Dashboard → Skills (`/skills` + home)

Add 8–20 skills. Per skill:

| Field | Required | Notes |
| --- | --- | --- |
| Skill name | Yes | E.g. `React.js`. |
| Category | Yes | Fixed list: `Frontend`, `Backend`, `Mobile`, `Languages`, `DevOps`, `Design`, `Other`. |
| Category display text | Optional | Custom label for the group heading. |
| Proficiency | Yes | 0–100%. |

---

## 6. Resume — Dashboard → Resume (`/resume` + home timeline)

Add all work, education and certification entries. Per entry:

| Field | Required | Notes |
| --- | --- | --- |
| Type | Yes | `Work`, `Education` or `Certification`. |
| Type display text | Optional | Custom badge label. |
| Title | Yes | Job title / degree / certificate name. |
| Organization | Yes | Company / school / issuer. |
| Period | Yes | E.g. `2022 — Present`. |
| Description | Optional | 1–3 sentences of achievements. |

---

## 7. Services — Dashboard → Services (`/services` + home)

Add 3–6 services. Per service:

| Field | Required | Notes |
| --- | --- | --- |
| Service title | Yes | E.g. `Web Development`. |
| Description | Yes | 1–3 sentences. |
| Features | Yes | One per line (or comma-separated), e.g. `Responsive design`, `API integration`. |
| Icon | Yes | One of the 5 built-in icons: `Code`, `Globe`, `Zap`, `Sparkles`, `Briefcase`. |

---

## 8. Testimonials — Dashboard → Testimonials (`/testimonials` + home)

Add 2–6 testimonials. Per testimonial:

| Field | Required | Notes |
| --- | --- | --- |
| Name | Yes | Client's name. |
| Photo | Optional | JPG/PNG/WebP/GIF, square, ≤ 10 MB. Initials are shown when empty. |
| Role | Optional | E.g. `CEO`. |
| Company | Optional | Company name. |
| Rating | Yes | 1–5 stars. |
| Testimonial content | Yes | The quote (preferably with the client's permission). |

---

## 9. Social Media — Dashboard → Social Media

Only links with **Enabled = on** and a **URL** appear on the website (Contact + Footer).
Provided per platform: URL (leave blank for platforms you don't use).

Built-in platforms: GitHub, LinkedIn, X, Instagram, Facebook, YouTube, TikTok, WhatsApp, Telegram, Discord, Reddit, Dribbble, Behance, Stack Overflow, Medium, Hashnode, Spotify, LeetCode.

Optional per platform: display label, small caption (`sub`), brand colour. Defaults already exist, so URLs are all I need.

---

## 10. Contact page

| Item | Required | Notes |
| --- | --- | --- |
| Contact details | — | Reused automatically from Profile (email, phone, location). |
| Social cards | — | Reused automatically from Social Media. |
| Contact form destination | **Decision needed** | ⚠️ The form currently shows a "sent" toast but does **not** save or email anything (see Issues). Tell me which you want: (a) store messages in the existing `portfolio_contact_messages` table + build a dashboard inbox, (b) forward to your email (e.g. Resend/Formspree), or (c) both. |

---

## 11. Analytics & SEO — Dashboard → Analytics

Nothing to type — visits, sessions, devices, referrers, events and SEO audits are collected automatically. Two deployment items:

| Item | Required | Notes |
| --- | --- | --- |
| Final domain in `sitemap.xml` + `robots.txt` | Yes | Both currently hard-code `https://ahmad-wais.netlify.app`. |
| `VITE_SITE_URL` env value | Yes | Same domain, used for canonical + Open Graph URLs. |
| Open Graph image | Optional | Defaults to the profile image; can be a dedicated 1200×630 banner. |

---

## 12. Admin users — `/admin/create-user`

Per additional admin: full name, email, password (≥ 8 chars). Supabase sends a confirmation email — the account must confirm it and be a Super Admin to enter the dashboard.

---

## File specifications (enforced by the app)

| Upload | Bucket | Formats | Max size | Recommended |
| --- | --- | --- | --- | --- |
| Profile image | `profile-images` | JPG, PNG, WebP | 5 MB | Square, ≥ 800×800 |
| Project / testimonial images, logos | `portfolio-assets` | JPG, PNG, WebP, GIF | 10 MB | Landscape 16:10 for projects |
| Resume | `portfolio-assets` | PDF | 10 MB | Text-based (not scanned) PDF |

---

## Issues found while auditing the system

1. **Two dashboard links are dead.** The sidebar links to `/dashboard/about` and `/dashboard/resume`, but neither route exists in `src/App.tsx` — both open the 404 page. `AboutManager.tsx` and `ResumeManager.tsx` are written but never routed, so **resume entries currently cannot be edited in the dashboard** (About data is editable through Profile, which uses the same record).
2. **The contact form doesn't deliver messages.** `Contact.tsx` just waits 1 second and shows a success toast; `portfolio_contact_messages` exists in the schema but nothing writes to it. Messages from visitors are lost.
3. **Deployment domain is hard-coded** in `public/sitemap.xml` and `public/robots.txt` as `https://ahmad-wais.netlify.app`.
4. **Only English is supported** for content — the Dari/Pashto content columns were removed by migration; no translation data is required.
5. **Footer copy falls back to Profile data** (bio first line, location) — nothing extra to supply, but keep the bio's first sentence appropriate for a footer.

---

## Fill-in template

Copy this block, fill it in, and send it back (or enter the same values in the dashboard).

```text
=== ACCESS ===
Final domain:
Admin email:            (create the password directly in Supabase / /admin/create-user)

=== BRANDING ===
Website logo file:      (attach)
Launcher logo file:     (attach)
Launcher text:

=== PROFILE ===
Full name:
Professional titles:    (one per line)
Email:
Phone:
Location:
Bio:
Years of experience:
Projects completed:
Technologies:
Profile image file:     (attach, square)
Resume PDF file:        (attach)

=== PROJECTS (repeat per project) ===
Title:
Category:               (web / mobile / design)
Category label:
Short description:
Long description:
Image file:             (attach)
GitHub URL:
Demo URL:
Tags:
Featured:               (yes / no)

=== SKILLS (repeat per skill) ===
Skill name:
Category:               (Frontend / Backend / Mobile / Languages / DevOps / Design / Other)
Proficiency:            (0-100)

=== RESUME (repeat per entry) ===
Type:                   (work / education / certification)
Title:
Organization:
Period:
Description:

=== SERVICES (repeat per service) ===
Title:
Description:
Features:               (one per line)
Icon:                   (Code / Globe / Zap / Sparkles / Briefcase)

=== TESTIMONIALS (repeat per testimonial) ===
Name:
Photo file:             (attach or leave blank)
Role:
Company:
Rating:                 (1-5)
Content:

=== SOCIAL LINKS ===
GitHub:
LinkedIn:
X (Twitter):
Instagram:
Facebook:
YouTube:
WhatsApp:
Telegram:
Other platforms:

=== CONTACT FORM ===
Preferred delivery:     (dashboard inbox / email forwarding / both)
```

---

*Generated 2026-11-19 from a full audit of the dashboard pages, public pages, Supabase schema and store.*
