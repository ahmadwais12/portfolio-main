# Portfolio analytics and SEO

## Current architecture

The site is a React 18 + Vite SPA using React Router 6. The analytics pipeline uses the existing Supabase project, PostgreSQL tables, security-definer RPCs, and Supabase Auth. No analytics numbers are seeded. The tracker fails silently when the database setup has not been applied or a request fails.

## Setup and deployment

**The standalone SQL setup file has been created but not applied.** The configured Supabase project previously reported `COMING_UP`, so I did not alter the remote database. Analytics will remain unavailable until the project is active and `supabase/portfolio_setup.sql` is run in its SQL Editor.

1. Set `VITE_SITE_URL=https://your-real-domain.example` in the build environment (no trailing slash). Set it in `.env` for local development as well. The prebuild script reads this setting and generates `public/sitemap.xml` and an absolute sitemap directive in `public/robots.txt`. Without the URL, the build warns and does not generate the sitemap.
2. Run `supabase/portfolio_setup.sql` as one script in Supabase Dashboard → SQL Editor. It creates portfolio profile, project, skill, resume, service, testimonial, social link, settings, and SEO audit tables, plus analytics tables/functions/policies, indexes, and the public `portfolio-assets` Storage bucket. It does not add sample content. Then run `supabase/migrations/20260930120000_super_admin_role.sql`, which replaces the old `analytics_admins` allowlist with `public.users.role`. If exactly one account exists it becomes Super Admin automatically. Otherwise promote the intended account:

   ```sql
   update public.users set role = 'Super Admin' where email = 'you@example.com';
   ```

3. Build/deploy the SPA and the generated static `robots.txt` and `sitemap.xml`. Configure the host to serve SPA routes with the `index.html` fallback while keeping `robots.txt` and `sitemap.xml` as static files.
4. Sign in at `/admin` with the Supabase Auth account added above. Analytics reads and exports are blocked by database policies/RPC authorization for accounts whose `users.role` is not `Super Admin`.

The browser already needs the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`. Never put a Supabase service-role key in a `VITE_` variable or browser bundle.

## Data model and relationships

- `analytics_visitors`: random first-party UUID, first/last seen time, first/last source. It contains no IP, email, fingerprint, or precise location.
- `analytics_sessions`: random session UUID, visitor FK, start/last activity, entry/exit route, source, device/browser/OS, traffic class.
- `analytics_page_views`: timestamped route view with visitor/session FKs, title/type, source/referrer, UTM JSON, device/browser/OS, traffic class, and duration when the next route view arrives.
- `analytics_events`: allowlisted event name, route and small allowlisted metadata object. No form values are sent.
- `analytics_bots`: aggregate counts by crawler label and route, with first/last seen.
- `users.role`: accounts with `Super Admin` can open the dashboard and read analytics.
- `analytics_rate_limits`: a short rolling request counter keyed by the anonymous first-party UUID; the ingestion RPC caps requests per token.

Indexes cover view timestamps, routes, visitor/session IDs, source, session activity, and event name/time. Foreign keys cascade visitor/session cleanup. No automatic retention job is enabled: raw rows remain until an operator configures and documents a retention policy.

## Tracking flow

`AnalyticsTracker` observes React Router `pathname` changes, skipping `/admin` and `/dashboard`. A random UUID in first-party `localStorage` identifies a pseudonymous visitor. A UUID in `sessionStorage` identifies a session and is rotated after 30 minutes of inactivity. No fingerprinting is used. Each public route transition makes a non-blocking `track_analytics_page_view` RPC call; API failures do not block rendering. Rapid reloads of the same route within five seconds in a session are deduplicated. Page duration is recorded when the visitor opens the next route; the last page often has no duration.

Device, browser, and operating system are coarse categories parsed from the browser user-agent. Source is derived from UTM source first, then a known referrer domain, then Direct/Other Referral. Original referrers are reduced to origin + path (query strings are dropped). UTM source/medium/campaign/term/content are separately retained with a 100-character limit. User-agent is sent for crawler classification but is not stored in tables. Country is null/unavailable because there is no trusted server geolocation provider.

Client-side bot classification only sees requests that run JavaScript. Known crawler user-agent matches are aggregated separately; ordinary browser traffic is marked `unknown` because client user-agent claims cannot reliably prove a human. Dashboard human-usage aggregates include `unknown` and exclude identified `bot` rows. Many search crawlers do not execute the app, so `analytics_bots` is not a server access log.

The database rejects malformed routes and oversized fields. The anonymous RPC can still be abused by a determined caller with generated visitor IDs; this SPA-only repository has no API gateway or server middleware where IP-based rate limiting could be enforced. Configure rate limiting/WAF at the hosting or Supabase edge before relying on analytics against adversarial traffic.

## Dashboard and APIs

The protected route is `/dashboard/analytics`. It offers date presets/custom dates, overview cards and time series, most-viewed pages/search, per-page detail, sources, UTM campaigns, device/browser breakdowns, recent activity polling (30 seconds), visitor journeys, crawler events, CSV export, and SEO checks. Aggregates are computed in PostgreSQL; page lists cap at 100; recent events/sessions cap at 20; export pages through 1,000-row requests and caps at 25,000 rows per download.

RPCs:

- `track_analytics_page_view`: public tracking ingestion, deduplication and crawler aggregation.
- `track_analytics_event`: public allowlisted event ingestion.
- `analytics_dashboard`: admin-only aggregated totals, series, dimensions, sessions and recent activity.
- `analytics_page_detail`: admin-only per-route aggregate.
- `analytics_export`: admin-only page-view export with offset/limit validation (max 5,000 rows per call).
- `is_analytics_admin` / `is_super_admin`: report whether the signed-in user is a Super Admin.

SQL row-level security denies direct anonymous reads. Dashboard/export RPCs also check the Super Admin role. Do not grant service-role credentials to the browser.

## Events

Call `trackAnalyticsEvent(name, metadata)` from UI interactions. The ingestion RPC accepts only small, allowlisted keys (`project_id`, `route`, and supported performance values). Existing events cover project GitHub/demo link clicks, social/email/phone clicks, resume download intent (click only, not confirmed file delivery), and browser performance samples. The current contact form simulates submission and does not send a message, so it intentionally does not report a form-submission conversion. Extend the event-name/key allowlist in the migration when adding events; then add its UI call. Never pass names, email addresses, messages, authentication tokens, or other form content.

## Performance

The lightweight browser observer samples FCP, LCP, and CLS where supported and submits a small event payload. Unsupported values remain absent. It does not collect INP, navigation timing for every browser, or claim Core Web Vitals field data. The dashboard averages the received samples; they are lab-like client observations, not Google's CrUX/Search Console metrics.

## SEO audit and sitemap

`SeoManager` updates title, description, canonical, robots, Open Graph, Twitter card, and accurate Person/WebSite JSON-LD from available portfolio profile data. Dashboard-only routes receive `noindex, nofollow`. A browser-side audit records title/description/canonical/robots/social tags, H1 count, H2 count, rendered image alt coverage, internal link count, URL shape, JSON-LD types, and sitemap response. A route is `NOT CHECKED` until opened in a browser and audited. The score is `PASS / (PASS + WARNING + ERROR) * 100`; NOT CHECKED checks are excluded. This is a transparent technical checklist score, not a search ranking or a claim of optimization.

The audit runs in a client-rendered SPA. It cannot inspect server response headers, search engine rendering, remote link status, image HTTP errors, actual indexing, ranking, Search Console, or full-page static HTML before JavaScript runs. SEO snapshots are stored in the current browser's local storage, not shared between admins. Add a page path to `PUBLIC_PAGES` and `scripts/generate-sitemap.cjs` when adding a new public route; the page-view tracker itself automatically records unknown public paths.

The sitemap contains only the current public routes. Admin and dashboard paths are disallowed in generated `robots.txt` and have noindex metadata. `VITE_SITE_URL` is required to emit valid absolute sitemap/canonical URLs. Search Console is not configured and no search data is shown.

## Testing and verification

- Local tracking: start with `npm run dev`, apply the migration and authorize an admin, visit public routes, then inspect `analytics_page_views` and `analytics_sessions` in Supabase. Navigate between routes to populate duration samples.
- Dashboard: sign in at `/admin`; open `/dashboard/analytics`, change date filters, select a page, expand a session and export CSV. A missing migration or unauthorized account displays an explicit error, never sample values.
- SEO: set `VITE_SITE_URL`, run `npm run build`, confirm generated `dist/sitemap.xml` uses that exact domain and `dist/robots.txt` disallows admin/dashboard while allowing public routes. Visit public routes once each and then inspect the SEO Health tab.
- Troubleshooting: check browser Network for failed `rpc` calls, confirm Supabase URL/key and setup SQL, verify the user's `users.role` is `Super Admin`, check allowed origins/CSP, and verify static sitemap/robots files on the deployed host.

## Known limits

No IP/geolocation, server-side crawler log, built-in API-gateway rate limiting, cross-device identity, confirmed download delivery, actual contact submission tracking, Search Console, full broken-link crawling, server-rendered metadata, or database retention scheduler is configured. Browser-local profile/content fields are existing site storage; analytics alone uses the Supabase database. These values are shown as unavailable rather than inferred or fabricated.




