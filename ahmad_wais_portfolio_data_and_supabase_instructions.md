# Ahmad Wais Sarwari --- Portfolio Content & Supabase Data Entry Specification

> **Purpose:** This document contains the portfolio content and
> implementation instructions for an AI coding agent to populate the
> existing portfolio website and Supabase database.
>
> **Important:** Treat this document as the content source. Inspect the
> project's current code, Supabase schema, migrations, and data-access
> layer before making changes. Do not assume table names or column names
> from this document.

------------------------------------------------------------------------

## 1. Implementation Instructions for the AI Agent

1.  Inspect the project architecture, current portfolio pages, dashboard
    managers, Supabase schema, migrations, types, validation rules, and
    data-access functions.
2.  Identify the exact existing tables and fields for Profile, Projects,
    Skills, Resume/Experience, Services, Testimonials, Social Media,
    Site Management, and Analytics/SEO.
3.  Map the content in this document to the existing schema. Do not
    invent tables or columns if the application already has a defined
    structure.
4.  Populate the appropriate Supabase records using the project's
    existing data-access approach. Prefer the app's existing
    dashboard/admin CRUD functions or approved migration/seed process.
5.  Do not expose Supabase service-role keys, credentials, passwords, or
    private environment values. Never ask the user to paste secrets into
    chat.
6.  Do not overwrite unrelated records or delete existing data. Before
    updating existing portfolio records, compare them and preserve
    records that are not explicitly being replaced.
7.  Avoid duplicate records. Match existing records by stable IDs where
    possible, or by a suitable unique field and confirm before creating
    duplicates.
8.  Do not fabricate client testimonials, project statistics, awards,
    certifications, project screenshots, GitHub URLs, or demo URLs.
9.  Do not claim that the user independently built a company project if
    the CV describes team contributions. Use the supplied descriptions
    and ownership distinctions.
10. Verify every saved record by reading it back from Supabase. Report
    what was inserted, updated, skipped, and what still needs user
    input.
11. If the database has no field for a piece of content, do not silently
    alter the schema. Report the missing field and recommend the minimal
    change.
12. Follow existing project validation, storage bucket, image upload,
    and authentication/RLS rules.

------------------------------------------------------------------------

## 2. Profile & Branding

### Full Name

Ahmad Wais Sarwari

### Professional Titles

Use these titles for the rotating hero heading, if supported:

-   Software Engineer
-   Full-Stack Developer
-   Flutter Developer
-   Mobile Application Developer
-   Web Application Developer

### Professional Headline

Software Engineer \| Full-Stack Web & Mobile Application Developer

### Short Biography

I'm a Software Engineer and Full-Stack Developer specializing in
building modern web and mobile applications. My expertise includes
Flutter mobile development, React.js frontend development, backend API
development, database design, and scalable application architecture.

I enjoy transforming ideas into practical software solutions, developing
intuitive user interfaces, building reliable backend systems, and
creating applications that solve real-world problems. I have experience
working on marketplace platforms, management systems, e-commerce
applications, and enterprise-oriented software.

### About Me

I am a Software Engineer and Full-Stack Developer with a passion for
designing, developing, and delivering high-quality software
applications. My primary focus is Flutter for cross-platform mobile
development and modern web technologies for building responsive,
scalable, and interactive web applications.

My technical background includes frontend development, backend
engineering, RESTful API integration, database management,
authentication systems, and software architecture. I enjoy working on
both individual and team-based projects, solving complex technical
problems, and continuously improving my development skills.

With practical experience in developing real-world projects, I aim to
create software that combines performance, functionality, usability, and
maintainable code. My goal is to grow as a professional Software
Engineer and contribute to innovative projects that make a meaningful
impact.

### What I Focus On

-   Building cross-platform mobile applications.
-   Developing responsive and modern web applications.
-   Designing backend APIs and database systems.
-   Developing management systems and business software.
-   Creating scalable and maintainable software architectures.
-   Improving application performance and user experience.

### Contact / Profile

-   **Email:** ahmadwaissarwari@gmail.com
-   **Phone:** +93 776 415 307
-   **Location:** Kabul, Afghanistan
-   **GitHub:** https://github.com/ahmadwais12
-   **LinkedIn:**
    https://www.linkedin.com/in/ahmad-wais-sarwari-819807291

### Profile Statistics

These are suggested display values only. Verify before publishing; do
not represent them as measured or guaranteed facts.

-   Experience: `1+ Year` (verify before publication)
-   Projects: `6+` (verify what counts as completed)
-   Technologies: `20+` (verify)
-   Specialization: `Web & Mobile`

### Profile Assets --- User Must Supply

-   Profile photo: square, at least 800×800, JPG/PNG/WebP, ≤5 MB (per
    checklist).
-   Resume PDF: current version, ≤10 MB.
-   Website logo: square transparent PNG/WebP, preferably 512×512 or
    larger.
-   Favicon: square PNG, 64--512 px.
-   Optional Open Graph banner: 1200×630 px.

Do not fabricate or generate an asset and upload it as the user's real
portrait, logo, or resume.

------------------------------------------------------------------------

## 3. Skills

> Proficiency values below are proposed presentation values, not
> objectively tested ratings. The user should confirm or adjust them
> before publication.

### Frontend

  Skill               Category      Proficiency
  ------------------- ----------- -------------
  React.js            Frontend               85
  JavaScript (ES6+)   Languages              85
  TypeScript          Languages              75
  HTML5               Frontend               90
  CSS3                Frontend               85
  Tailwind CSS        Frontend               85
  Vue.js              Frontend               75

### Mobile

  Skill                   Category      Proficiency
  ----------------------- ----------- -------------
  Flutter                 Mobile                 90
  Dart                    Languages              85
  Firebase                Backend                75
  Mobile UI Development   Mobile                 90
  REST API Integration    Backend                85

### Backend

  Skill                  Category      Proficiency
  ---------------------- ----------- -------------
  PHP                    Languages              80
  Laravel                Backend                75
  Node.js                Backend                75
  Express.js             Backend                75
  REST API Development   Backend                80

### Database

  Skill             Category     Proficiency
  ----------------- ---------- -------------
  Supabase          Backend               85
  MongoDB           Backend               75
  MySQL             Backend               80
  Database Design   Backend               80

### Tools & Other

  Skill          Category      Proficiency
  -------------- ----------- -------------
  Git & GitHub   DevOps                 85
  Postman        Other                  80
  Python         Languages              65
  Java           Languages              60

**Mapping note:** The checklist's supported skill categories are
`Frontend`, `Backend`, `Mobile`, `Languages`, `DevOps`, `Design`, and
`Other`. If a label above is not supported by the existing schema, map
it to the closest supported category without changing the schema
unnecessarily. Confirm proficiency ratings with the user before
publishing if possible.

------------------------------------------------------------------------

## 4. Professional Experience

### Experience 1 --- Flutter Developer Intern

-   **Type:** Work
-   **Title:** Flutter Developer Intern
-   **Organization:** Al-Hawa Technology Company
-   **Location:** Kabul, Afghanistan
-   **Period:** February 2026 -- August 2026

**Description:**

Worked as a Flutter Developer Intern, contributing to the development of
mobile and web-based software applications. Implemented frontend
interfaces, integrated backend APIs, and worked with database
operations. Collaborated with the development team to troubleshoot
technical issues, improve application performance, and support testing
and deployment processes.

Developed practical experience in mobile application development,
software debugging, API integration, database interaction, and
collaborative software development.

### Experience 2 --- Full-Stack Developer

-   **Type:** Work
-   **Title:** Full-Stack Developer
-   **Organization:** Al-Hawa Technology Company
-   **Location:** Kabul, Afghanistan
-   **Period:** August 2026 -- Present

**Description:**

Working on the development and maintenance of full-stack web
applications, building responsive frontend interfaces, backend APIs, and
database-driven functionality.

Responsible for implementing new features, integrating frontend and
backend systems, troubleshooting application issues, improving
performance, and contributing to software testing and deployment.

Collaborating with development teams to deliver reliable, maintainable,
and user-friendly software solutions while following modern development
practices.

------------------------------------------------------------------------

## 5. Education

### Education 1

-   **Type:** Education
-   **Title:** Bachelor's Degree in Computer Science
-   **Organization:** Kabul Polytechnic University
-   **Department:** Information Systems
-   **Period:** March 2023 -- July 2026
-   **Location:** Kabul, Afghanistan

**Description:**

Graduated in 2026 with a Bachelor's degree in Computer Science from the
Information Systems Department of Kabul Polytechnic University.
Developed a strong foundation in software engineering, programming,
databases, information systems, and application development.

### Education 2

-   **Type:** Education
-   **Title:** High School Graduate
-   **Organization:** Hazrat Ibrahim Khalilullah High School
-   **Period:** Graduated 2021 (confirm date; CV has a date
    inconsistency)
-   **Location:** Kabul, Afghanistan

**Description:**

Completed secondary education at Hazrat Ibrahim Khalilullah High School
in Kabul, Afghanistan.

------------------------------------------------------------------------

## 6. Projects

> Use project category values accepted by the current application.
> Checklist categories are `Web`, `Mobile`, or `Design`. The project
> descriptions below distinguish company/team work from personal
> projects. Do not falsely claim sole ownership of company projects.

### Project 1 --- Karwwan

-   **Title:** Karwwan -- Online Automotive Marketplace

-   **Category:** Web

-   **Category display label:** Automotive Marketplace

-   **Short description:** An online automotive marketplace connecting
    car buyers, sellers, and dealerships through vehicle listings,
    marketplace features, and vehicle management systems.

-   **Long description:** Karwwan is an automotive marketplace designed
    to simplify buying, selling, and discovering vehicles in
    Afghanistan. The platform provides users with vehicle listings,
    search functionality, vehicle information, and marketplace features.

    I contribute to the development and maintenance of the platform,
    including frontend development, vehicle management functionality,
    database integration, administrative systems, and frontend-backend
    communication. The project focuses on creating a reliable and
    user-friendly automotive marketplace experience.

-   **Technologies / tags:** React.js, JavaScript, Supabase, Database
    Integration, Web Development, API Integration

-   **Live demo:** https://karwwan.com

-   **GitHub:** Not supplied

-   **Featured:** Yes

-   **Ownership:** Company/team contribution. Do not describe as
    independently built.

### Project 2 --- Armans

-   **Title:** Armans -- Food Delivery Platform

-   **Category:** Web

-   **Category display label:** Food Delivery & Management

-   **Short description:** A full-stack food delivery platform
    connecting customers, restaurants, and delivery riders through an
    integrated ordering and management system.

-   **Long description:** Armans is a food delivery platform designed to
    improve the online food ordering experience. The platform provides
    restaurant and menu management, customer ordering, order tracking,
    payment management, and dedicated dashboards for different user
    roles.

    The platform integrates multiple user workflows into one system,
    including customers, restaurant owners, and delivery riders, with a
    focus on operational efficiency and a smooth digital ordering
    experience.

-   **Technologies / tags:** React.js, Node.js, Express.js, Database
    Integration, REST APIs, Full-Stack Development

-   **Live demo:** https://armans.com

-   **GitHub:** Not supplied

-   **Featured:** Yes

-   **Ownership:** Company/team contribution. Do not describe as
    independently built.

### Project 3 --- Behsazan Industrial Company

-   **Title:** Behsazan Industrial Company -- Corporate Website

-   **Category:** Web

-   **Category display label:** Industrial & Corporate Website

-   **Short description:** A professional corporate website showcasing
    industrial manufacturing capabilities, LPG road tankers, gas storage
    equipment, products, and business services.

-   **Long description:** Developed a corporate web platform for
    Behsazan Industrial Company, a company specializing in LPG road
    tankers and gas storage solutions.

    The website presents company information, industrial products,
    manufacturing capabilities, and business services through a
    professional digital interface. The project focuses on responsive
    design, clear content presentation, and providing potential
    customers with accessible information about the company's products
    and expertise.

-   **Technologies / tags:** Web Development, Responsive UI, Frontend
    Development, Corporate Website

-   **Live demo:** https://behsazan-industry.com

-   **GitHub:** Not supplied

-   **Featured:** Yes

-   **Ownership:** Team/company contribution; CV says "contributed."

### Project 4 --- Course EMIS

-   **Title:** Course EMIS -- Education Management System

-   **Category:** Mobile

-   **Category display label:** Education & Mobile Application

-   **Short description:** A mobile Education Management Information
    System designed to manage students, teachers, courses, attendance,
    grades, payments, and administrative operations.

-   **Long description:** Course EMIS is a mobile application developed
    to simplify educational institution management. The system provides
    functionality for managing students, teachers, courses, attendance,
    grades, payments, and staff operations.

    The application includes role-based authentication, structured
    database architecture, and management interfaces designed to support
    different users and educational workflows. The project demonstrates
    mobile application development, data management, authentication, and
    system architecture.

-   **Technologies / tags:** Flutter, Dart, Supabase, Database Design,
    Authentication, Mobile Development

-   **Live demo:** Not supplied

-   **GitHub:** Not supplied

-   **Featured:** Yes

-   **Ownership:** CV identifies this as a personal project. A previous
    user statement indicated it was built independently; retain this
    only if confirmed.

### Project 5 --- Madrasa EMIS

-   **Title:** Madrasa EMIS -- Education Management Web Application

-   **Category:** Web

-   **Category display label:** Enterprise Management System

-   **Short description:** A comprehensive full-stack education
    management system featuring multiple user panels, student and
    teacher management, academic records, financial management, and
    administrative dashboards.

-   **Long description:** Madrasa EMIS is a full-stack Education
    Management Information System developed to manage educational
    institution operations through a centralized web application.

    The system includes student management, teacher management, academic
    administration, attendance, examinations, financial records,
    role-based access control, and multiple dashboards. The project was
    developed with a modular architecture to support different user
    roles and organizational workflows.

    It demonstrates full-stack application development, backend
    architecture, database modeling, authentication, authorization, and
    enterprise-oriented system design.

-   **Technologies / tags:** MongoDB, Express.js, React.js, Node.js,
    JavaScript, REST APIs, JWT Authentication

-   **Live demo:** Not supplied

-   **GitHub:** Not supplied

-   **Featured:** Yes

-   **Ownership:** CV identifies this as a personal project. Confirm
    details and public-display permission.

### Project 6 --- Online Food Delivery System

-   **Title:** Online Food Delivery System

-   **Category:** Web

-   **Category display label:** Full-Stack E-Commerce

-   **Short description:** A responsive full-stack food ordering
    application featuring secure authentication, product management,
    shopping cart functionality, order processing, and an administrative
    dashboard.

-   **Long description:** Developed a full-stack food delivery web
    application using MySQL, Express.js, React.js, and Node.js.

    The application includes secure JWT authentication, product and
    order management, shopping cart functionality, and an administrative
    dashboard. The responsive user interface supports mobile and desktop
    devices while the backend handles business logic, APIs,
    authentication, and data management.

    This project strengthened practical experience in full-stack
    development, API design, authentication, database integration, and
    scalable application architecture.

-   **Technologies / tags:** React.js, Node.js, Express.js, MySQL, JWT,
    REST APIs

-   **Live demo:** Not supplied

-   **GitHub:** Not supplied

-   **Featured:** No

-   **Ownership:** CV identifies this as a project developed by the
    user. Confirm before publishing.

### Project Images

Use genuine project screenshots, supplied by the user or found in the
existing project assets. Checklist requirements: - Project image:
JPG/PNG/WebP/GIF. - Landscape ratio preferred: 16:10 or 4:3. - Maximum
10 MB per image. - Do not use generic or misleading stock images as
screenshots of these projects. - If no image is available, leave the
image empty or use the existing app's approved placeholder.

------------------------------------------------------------------------

## 7. Services

Create these five services if they fit the existing service schema.

### Service 1 --- Web Application Development

-   **Title:** Web Application Development
-   **Description:** Develop modern, responsive, and scalable web
    applications tailored to business requirements.
-   **Features:**
    -   Responsive UI
    -   Frontend development
    -   Backend integration
    -   Database systems
    -   API integration
-   **Icon:** `Code` (use only if supported by the app's built-in icon
    list)

### Service 2 --- Mobile Application Development

-   **Title:** Mobile Application Development
-   **Description:** Build cross-platform mobile applications using
    Flutter with modern architecture, smooth interfaces, and reliable
    backend integration.
-   **Features:**
    -   Android applications
    -   Cross-platform development
    -   API integration
    -   Authentication
    -   Responsive mobile UI
-   **Icon:** `Globe` (use only if supported)

### Service 3 --- Backend & API Development

-   **Title:** Backend & API Development
-   **Description:** Design and develop backend systems, REST APIs,
    authentication systems, and database-driven applications.
-   **Features:**
    -   REST APIs
    -   Database design
    -   Authentication
    -   Business logic
    -   Backend integration
-   **Icon:** `Briefcase` (use only if supported)

### Service 4 --- Management Systems & ERP Solutions

-   **Title:** Management Systems & ERP Solutions
-   **Description:** Develop customized management systems for
    educational institutions, businesses, and organizations.
-   **Features:**
    -   Admin dashboards
    -   Role-based access
    -   Reports
    -   Data management
    -   Workflow automation
-   **Icon:** `Sparkles` (use only if supported)

### Service 5 --- Software Maintenance & Optimization

-   **Title:** Software Maintenance & Optimization
-   **Description:** Improve existing applications through bug fixing,
    performance optimization, API integration, and system improvements.
-   **Features:**
    -   Bug fixing
    -   Performance optimization
    -   Refactoring
    -   API integration
    -   Technical support
-   **Icon:** `Zap` (use only if supported)

> The checklist indicates the current app supports the built-in service
> icons `Code`, `Globe`, `Zap`, `Sparkles`, and `Briefcase`. Verify
> exact values before writing.

------------------------------------------------------------------------

## 8. Social Media

Enable and configure only the links that the user confirms are correct.

  ----------------------------------------------------------------------------------------------------------
  Platform                URL                                                        Enabled
  ----------------------- ---------------------------------------------------------- -----------------------
  GitHub                  https://github.com/ahmadwais12                             Yes

  LinkedIn                https://www.linkedin.com/in/ahmad-wais-sarwari-819807291   Verify URL

  WhatsApp                https://wa.me/93776415307                                  Yes

  Telegram                Not provided                                               No until supplied

  Instagram               Not provided                                               No until supplied

  Facebook                Not provided                                               No until supplied

  X                       Not provided                                               No until supplied

  YouTube                 Not provided                                               No until supplied
  ----------------------------------------------------------------------------------------------------------

Do not create enabled social links with empty or invented URLs.
Checklist says only enabled platforms with a URL should be displayed.

------------------------------------------------------------------------

## 9. Contact Section

### Contact Headline

Let's Build Something Great Together

### Contact Description

Have a project idea, business opportunity, or technical challenge? I'm
always interested in connecting with people, collaborating on innovative
projects, and building meaningful software solutions.

Feel free to contact me for web application development, mobile
application development, full-stack projects, or software engineering
opportunities.

### Contact Details

-   **Email:** ahmadwaissarwari@gmail.com
-   **Phone:** +93 776 415 307
-   **Location:** Kabul, Afghanistan

### Contact Form Requirements

Preferred implementation: **both dashboard inbox storage and email
notification**, if supported and configured.

-   Save visitor messages to the existing contact-message table, if
    available.
-   Provide a dashboard inbox to read and manage messages, if the
    current application supports it or can safely implement it.
-   Send email notification using the configured email provider only if
    credentials/configuration are already safely available or the user
    supplies them through secure deployment settings.
-   Never show success toasts for messages that were not actually
    persisted/sent.
-   Validate fields and protect against spam/abuse.
-   The existing checklist reports the contact form currently displays a
    success toast without saving or emailing; inspect and fix this
    behavior.

------------------------------------------------------------------------

## 10. Testimonials

**Do not insert fabricated testimonials.**

Until the user provides real, permission-approved testimonials: - Leave
testimonials empty or disabled. - Do not create fake people, companies,
quotes, profile photos, or ratings. - If the existing site hides empty
testimonial sections, use that behavior.

When real testimonials are provided, fields may include: - Name - Photo
(optional) - Role (optional) - Company (optional) - Rating (1--5) -
Testimonial content

------------------------------------------------------------------------

## 11. SEO & Site Management

### Website Title

Ahmad Wais Sarwari \| Software Engineer & Full-Stack Developer

### Meta Description

Ahmad Wais Sarwari is a Software Engineer and Full-Stack Developer
specializing in Flutter mobile applications, React.js web development,
backend APIs, and modern software solutions.

### SEO Keywords

-   Ahmad Wais Sarwari
-   Ahmad Wais Software Engineer
-   Flutter Developer Afghanistan
-   Full Stack Developer Kabul
-   Mobile Application Developer
-   Web Application Developer
-   React Developer
-   Software Engineer Afghanistan
-   Flutter Developer
-   Full Stack Web Developer

### Open Graph Title

Ahmad Wais Sarwari \| Software Engineer Portfolio

### Open Graph Description

Explore my portfolio of web applications, mobile applications,
full-stack projects, and software engineering solutions.

### Open Graph Image

Recommended: 1200×630 pixels. Create a branded banner only after the
user supplies or approves the required portrait/brand assets. Do not
fabricate a portrait.

### SEO Page Titles

  Page       Title
  ---------- -----------------------------------------
  Home       Ahmad Wais Sarwari \| Software Engineer
  About      About Ahmad Wais Sarwari
  Projects   Software Projects \| Ahmad Wais Sarwari
  Skills     Technical Skills \| Ahmad Wais Sarwari
  Services   Web & Mobile Development Services
  Resume     Ahmad Wais Sarwari \| Resume
  Contact    Contact Ahmad Wais Sarwari

### Deployment / SEO Requirements

-   Set the final public domain only after the user confirms it.
-   Update `VITE_SITE_URL`, canonical URLs, sitemap, and robots.txt to
    the confirmed domain.
-   Checklist reports these currently reference
    `https://ahmad-wais.netlify.app`.
-   Do not invent a final domain.
-   Verify sitemap and robots.txt are valid and point to the correct
    domain.
-   Ensure the Open Graph image is publicly accessible.
-   Preserve existing SEO/analytics implementation unless a change is
    needed and verified.

------------------------------------------------------------------------

## 12. Recommended Homepage Section Order

1.  Hero --- name, rotating professional titles, headline, CTA buttons
    (Projects and Download CV).
2.  About --- biography, profile image, focus areas, verified
    statistics.
3.  Skills --- categorized technologies.
4.  Featured Projects --- Karwwan, Armans, Behsazan, Course EMIS,
    Madrasa EMIS.
5.  Services --- five service cards.
6.  Experience --- Al-Hawa Technology Company.
7.  Education --- Kabul Polytechnic University and high school.
8.  Testimonials --- only if genuine testimonials exist.
9.  Contact --- contact details, social links, functioning contact form.

------------------------------------------------------------------------

## 13. Known Checklist Issues to Verify / Fix

The provided portfolio checklist reports the following issues; inspect
the current code to confirm they still exist:

1.  Dashboard sidebar links to `/dashboard/about` and
    `/dashboard/resume` may be broken; Resume manager may not be routed.
2.  Contact form may display a success toast without storing or sending
    the message.
3.  Deployment domain may be hard-coded in `public/sitemap.xml` and
    `public/robots.txt`.
4.  Portfolio content is English-only in the current schema/application.
5.  Footer copy uses profile biography/location fallback.

Do not assume these findings are still current. Verify the codebase
first and report the actual status.

------------------------------------------------------------------------

## 14. User Confirmation / Missing Inputs

Do not invent these values. Leave them unchanged or mark them as
pending:

-   Final portfolio domain.
-   Current professional profile photo.
-   Logo and favicon.
-   Latest resume PDF.
-   Real project screenshots.
-   GitHub repository links for projects (if public).
-   Live demo links for personal projects.
-   Confirmed LinkedIn URL.
-   Additional social links.
-   Confirmed skill proficiency ratings.
-   Confirmed public project ownership/permission.
-   Real testimonials.
-   Contact form email provider/configuration.
-   Confirmed statistics (years, completed projects, technologies).

### Data Accuracy Notes

-   CV states high school graduation, but its date format is
    inconsistent; use `2021` only after confirmation.
-   CV lists University study from March 2023 to July 2026 and says
    graduated in 2026.
-   CV describes Karwwan, Armans, and Behsazan as contributions. Do not
    label these as independently built.
-   CV identifies Course EMIS, Madrasa EMIS, and Online Food Delivery as
    personal projects. Confirm details before making ownership claims.
-   CV and portfolio descriptions may contain technology differences;
    project-specific technologies above are based on supplied CV/context
    and should be verified against each project's actual repository
    before publication.

------------------------------------------------------------------------

## 15. Final Verification Checklist for the AI Agent

After data entry:

-   [ ] Read back Profile record and verify values.
-   [ ] Verify biography and professional titles display correctly.
-   [ ] Verify skills are stored in correct categories and percentages.
-   [ ] Verify experience and education timeline order and dates.
-   [ ] Verify project records, categories, tags, descriptions, and
    featured flags.
-   [ ] Verify no duplicate project/skill/service entries were created.
-   [ ] Verify services and icon values are valid.
-   [ ] Verify only confirmed social links are enabled.
-   [ ] Verify no fake testimonials exist.
-   [ ] Verify contact form actually stores/sends messages.
-   [ ] Verify no private keys or credentials were exposed.
-   [ ] Verify website public pages display the new data.
-   [ ] Verify responsive layout and empty-state behavior.
-   [ ] Verify SEO title, description, canonical domain, sitemap,
    robots.txt.
-   [ ] Report database records changed and records skipped.
-   [ ] List remaining user-supplied assets or confirmations.

**End of specification.**
