# Changelog

## [3.0.73] — 2026-07-19

### Changed
- **PreviewShowcase (mobile ≤991px)** — Default to Admin + Site phone frames only; **Mobile | Desktop** view toggle (sessionStorage per slug); sticky bottom feedback dock with compact Like/Dislike row; intro hint updated for phone browsing
- **Tests** — `PreviewShowcase.test.js` mocks `matchMedia` for mobile toggle, frame visibility, and feedback dock

## [3.0.72] — 2026-07-19

### Changed
- **PreviewShowcase** — Admin desktop/mobile panels first, site second; eyebrow “Business system + website sample”; intro leads with admin browse
- **Outreach emails** — Initial + follow-up copy opens with system hook (`systemLabel` + optional `systemPain`), then admin browse, then marketing site; phone kept in signature
- **Agent docs** — client-site-netlify skill + client-quotations rule require per-client demo data + `painHero` customization (forbid default pack text unchanged)

## [3.0.71] — 2026-07-19

### Added
- **PreviewShowcase** — Four-panel layout: Site desktop/mobile + Admin desktop/mobile (`/admin/` iframes); eyebrow “Website + admin system preview”; browse hint for admin nav
- **Client admin kit** — Shared browsable demo under `client-sites/_systems/admin/` (hash nav, vertical demo data packs: booking, appointments, service, leads; responsive sidebar + mobile bottom nav)
- **Batch A systems** — Villa Clara Pool (`villa-clara-pool`) and Costa Abril Resort (`costa-abril`): `/admin/` wired, `client.json` `system` fields, embed-only guard covers admin HTML, “View admin demo” CTA on marketing contact
- **Template** — `_template/client.json` `system` block; embed-only edge function protects `/admin/` paths
- **Tests** — `PreviewShowcase.test.js` covers four frames, admin URL builder, and `/admin/` iframe src

## [3.0.70] — 2026-07-18

### Added
- **Client sites** — The Lakehouse Taguig (`the-lakehouse-taguig`) and Journey Woodblock Modular Cabinets (`journey-woodblock-ph`) added to portfolio preview whitelist, `client-sites/` catalog, and Netlify embed-only demos (alongside `taguig-city-general-hospital` from 3.0.69)
- **Template** — `_template/hero-three.js` woodblock featured object (`data-hero-three-object="woodblock"`) for cabinetry demos
- **Agent docs** — client-site-netlify skill, client-quotations rule, and AGENTS.md notes for hero-three featured objects
- **Tests** — `previewWhitelist.test.js` matrix covers the new slugs via `PREVIEW_SITES`

## [3.0.69] — 2026-07-18

### Added
- **Client site** — Taguig City General Hospital (`taguig-city-general-hospital`) added to portfolio preview whitelist, `client-sites/` catalog, and Netlify embed-only demo
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves (via `PREVIEW_SITES` matrix)

## [3.0.68] — 2026-07-17

### Added
- **Google AdSense** — Site-wide `adsbygoogle.js` loader in `public/index.html` (`ca-pub-8982621236971546`)

## [3.0.67] — 2026-07-17

### Added
- **Client site** — Amora Body Wellness Spa (`amora-body-wellness-spa`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves

### Fixed
- **Admin login** — Relaxed API throttle to 20 attempts per 5 minutes; clearer 429 message in admin login UI

## [3.0.66] — 2026-07-17

### Added
- **Client site** — MPHS Mother of Perpetual Help Inc. Fairview (`mphs-fairview`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves

## [3.0.65] — 2026-07-17

### Added
- **Form anti-spam** — Contact and Get a Quote: honeypot field + 3s time-trap (`formOpenedAt`); bots get a silent success with no DB/mail
- **API** — Rate limit tightened to **5/hour** per IP for contact/quotation; outreach initial + follow-up emails trigger admin Web Push (`pushNotifyAdmins`)

### Tests
- `FormAntiSpamTest`, PortfolioApi honeypot/time-trap cases, `formAntiSpam.test.js`

## [3.0.64] — 2026-07-17

### Added
- **PWA nav** — Login link in desktop nav and hamburger menu, visible only when the portfolio runs as a standalone home-screen PWA (`isStandalonePwa` helper + `NavLoginLink` component)
- **Tests** — `isStandalonePwa.test.js`, `NavLoginLink.test.js`, Portfolio/HamburgerMenu coverage for PWA-only Login visibility

## [3.0.63] — 2026-07-17

### Fixed
- **Admin Web Push** — Test ping endpoint renamed to `POST /admin/push/sendPing` (hosting WAF blocked `/test` paths); mapping and delivery hardening shipped with API commit `097e839`

## [3.0.62] — 2026-07-17

### Added
- **Admin Web Push** — Settings tab to enable browser notifications for new contact and quote submissions; service worker (`sw-admin-push.js`), VAPID subscribe/unsubscribe via Laravel `/admin/push/*`
- **API** — `PushNotificationService`, `push_subscriptions` migration, push on successful `POST /contact` and `POST /quotation` (failure never breaks form response)
- **Tests** — `pushNotifications.test.js`, `AdminPushApiTest`, `PushNotificationServiceTest`

## [3.0.61] — 2026-07-17

### Added
- **Client sites** — NovaGen (`novagen`) and Fairview General Hospital Inc. (`fairview-general-hospital`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slugs resolve

## [3.0.60] — 2026-07-17

### Added
- **Client site** — Pacific Global Medical Center (`pgmc`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves

## [3.0.59] — 2026-07-17

### Added
- **Client site** — Bernardino General Hospital (`bernardino-general-hospital`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves

## [3.0.58] — 2026-07-17

### Added
- **Client site** — Casa Angelina Resort (`casa-angelina`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms the new slug resolves

## [3.0.57] — 2026-07-17

### Added
- **Client sites** — Costa Abril Resort (`costa-abril`), Airalex Private Lodge & Resort (`air-alex-resort`), and Casa De Gloria Private Resort (`casa-de-gloria`) added to portfolio preview whitelist and `client-sites/README.md` catalog
- **Tests** — `previewWhitelist.test.js` coverage confirms all three new slugs resolve

## [3.0.56] — 2026-07-17

### Fixed
- **Hero CTAs** — "View My Work" and "Get In Touch" navigate by section id (`projects`, `contact`) instead of hardcoded indices, fixing scroll targets after blog/insights sections shifted indices
- **Tests** — `Home.test.js`, `Portfolio.test.js` section id navigation coverage

## [3.0.55] — 2026-07-17

### Fixed
- **SEO prerender FOUC** — hide `#seo-prerender` visually (clip) while keeping crawler-visible markup; branded `#app-boot-shell` until React marks `html.v3-app-ready`

## [3.0.54] — 2026-07-17

### Added
- **SEO prerender** — static HTML injected into `index.html` at build time (`#seo-prerender` with `<h1>Carl Louis Manuel</h1>`, section headings, JSON-LD) for crawlers that do not execute JavaScript
- **SeoHead** — `react-helmet` meta tags (title, description, canonical, Open Graph, Twitter) wired in `Index.js`
- **Build** — `scripts/inject-seo-prerender.cjs` runs after CRA build; `sitemap.xml` lastmod updated
- **Tests** — `portfolioSeo.test.js`, `inject-seo-prerender.test.js`, `Index.test.js` SeoHead coverage

## [3.0.53] — 2026-07-17

### Added
- **Get a Quote multi-currency** — PHP/USD toggle on quote form with currency-specific budget ranges; `currency` field persisted on `quotations` and shown in admin Inbox
- **API** — `POST /quotation` accepts optional `currency` (`PHP`|`USD`); Laravel migration + hosting-php migration script for `quotations.currency`
- **Tests** — `quoteConfig.test.js`, `Quote.test.js`; Laravel `quotation persists currency`; hosting-php currency helper unit tests

## [3.0.52] — 2026-07-16

### Added
- **Tests** — `v3-admin-active` scroll shell toggle in `Index.test.js`; admin `outreachPause` Feature tests in Laravel
- **Agent docs** — tests ship with every change; deploy gates reinforced in `AGENTS.md`, `test-before-deploy.mdc`, deploy-portfolio and api-carlxaeron skills

## [3.0.51] — 2026-07-16

### Fixed
- **Admin scroll** — login and admin dashboard scroll correctly; `v3-admin-active` toggles full-height flex shell on html/body outside the slide deck

## [3.0.50] — 2026-07-16

### Added
- **Admin Settings** tab — brand, announcement banner, section visibility, contact/social links, chat toggle; portfolio reads `/content/settings` with static defaults

## [3.0.49] — 2026-07-16

### Added
- **Admin dashboard** on `carlmanuel.com/#login` and `#admin` — Sanctum auth, ops hub (Overview, Inbox, Outreach, Clients)
- **Portfolio CMS (Phase 2)** — Laravel `GET/PUT /admin/content/{section}` + public `GET /content/{section}` with static fallback; CMS tab in admin with JSON editors
- CMS sections: `hero`, `about`, `header`, `skills`, `experiences`, `companies`, `projectDetails`

## [3.0.48] — 2026-07-16

### Added
- **Villa Clara Pool & Venue** client site (`villa-clara-pool`) — private pool/day venue sample (San Rafael, Rodriguez; HD FB gallery, Motion + Three.js particles hero)
- Portfolio preview: `?preview=villa-clara-pool` → `villa-clara-pool.netlify.app`

## [3.0.47] — 2026-07-15

### Added
- **San Mateo Medical Center** client site (`san-mateo-medical-center`) — private hospital sample (Ampid 2, San Mateo; trunk lines, Motion + Three.js particles hero)
- Portfolio preview: `?preview=san-mateo-medical-center` → `san-mateo-medical-center.netlify.app`

## [3.0.46] — 2026-07-15

### Added
- **H Vill Hospital** client site (`hvill-hospital`) — Rodriguez/Montalban hospital sample (services, FB gallery, Motion + Three.js particles hero); PhilHealth-accredited positioning
- Portfolio preview: `?preview=hvill-hospital` → `hvill-hospital.netlify.app`

## [3.0.45] — 2026-07-15

### Changed
- **ChatAgent:** `assistant` URL → `https://api.carlmanuel.com/assistant` (off Firebase)
- **Weekly visit email + license:** weekly report on hosting MySQL cron; Firebase `assistant` / `weeklyVisitReport` / `license` removed

## [3.0.44] — 2026-07-15

### Changed
- **Insights:** mask client slug labels on public charts (`g3k-cad` → `g3****ad`) for privacy
- **Outreach mailer (hosting-php):** display-name From, Message-ID, List-Unsubscribe; unit coverage for mail helpers

## [3.0.43] — 2026-07-15

### Added
- **Archipelago Builders Corporation** client site (`archipelago-builders`) — Category AAA contractor rebuild sample (since 1965, H+V services, Motion + Three.js blueprint hero); pitch for unreachable corporate site
- Portfolio preview: `?preview=archipelago-builders` → `archipelago-builders.netlify.app`

## [3.0.42] — 2026-07-15

### Added
- **Fastpoint PH** client site (`fastpoint-ph`) — fleet/tire supply redesign sample (Joyall, EcoVadis, Motion + Three.js particles hero); FB vanity `ltfrbphilippines` resolves to Fastpoint
- Portfolio preview: `?preview=fastpoint-ph` → `fastpoint-ph.netlify.app`

## [3.0.41] — 2026-07-15

### Added
- **Alibaton Construction Inc.** client site (`alibaton-construction`) — tower crane rebuild sample (services, gallery, Motion + Three.js blueprint hero); pitch for suspended alibaton.com.ph
- Portfolio preview: `?preview=alibaton-construction` → `alibaton-construction.netlify.app`

## [3.0.40] — 2026-07-15

### Added
- **DN Group of Companies** client site (`dn-group`) — elevated building-materials redesign (product mosaic, projects, Motion + Three.js blueprint hero)
- Portfolio preview: `?preview=dn-group` → `dn-group.netlify.app`

## [3.0.39] — 2026-07-15

### Added
- **Trumed Pharmaceuticals** client site (`trumed-pharma`) — pharmaceutical marketing redesign landing sample (products, about, responsibility, Motion + Three.js particles hero)
- Portfolio preview: `?preview=trumed-pharma` → `trumed-pharma.netlify.app`

## [3.0.38] — 2026-07-15

### Added
- **SV More Group of Companies** client site (`sv-more-group`) — pharmaceutical/health products redesign landing sample (products, about, Motion + Three.js particles hero)
- Portfolio preview: `?preview=sv-more-group` → `sv-more-group.netlify.app`

## [3.0.37] — 2026-07-15

### Added
- **IntelliSmart Technology Inc.** client site (`intellismart`) — system integration redesign landing sample (solutions, projects, Motion + Three.js blueprint hero)
- Portfolio preview: `?preview=intellismart` → `intellismartinc.netlify.app`

## [3.0.36] — 2026-07-15

### Added
- **Regan Industrial Sales Inc.** client site (`regan-industrial`) — steel supplier redesign landing sample (products, services, Motion + Three.js blueprint hero)
- Portfolio preview: `?preview=regan-industrial` → `regan-industrial.netlify.app`

## [3.0.35] — 2026-07-15

### Added
- **Kubling Tago Resort** client site (`kubling-tago-resort`) — Antipolo day resort with Facebook assets, sample rates, Motion + Three.js particles hero
- Portfolio preview: `?preview=kubling-tago-resort` → `kubling-tago-resort.netlify.app`

## [3.0.34] — 2026-07-14

### Added
- **G3k Cad Plotting & Blueprinting Services** client site (`g3k-cad`) — Rodriguez, Rizal CAD plotting / blueprint printing with Facebook-scraped assets and Motion hero
- Portfolio preview: `?preview=g3k-cad` → `g3k-cad-plotting.netlify.app`
- Client sites: **Motion** (Framer Motion family) hero entrance via `hero-motion.js` (template + Bamboo Grove sample)

## [3.0.33] — 2026-07-13

### Added
- **Owner analytics opt-out** — `?no_track=1` permanently excludes your browser from preview visit logging and feedback; server-side IP/visitor ID exclusion lists in `functions/.env`

### Changed
- Preview analytics no longer stores raw IP addresses (hash only for new events)
- **Jazz1** and **Clover** gallery assets re-downloaded at full resolution via Chrome DevTools network responses (not screenshots)
- Client-site Cursor docs: Facebook photos via inspect + `get_network_request` download

## [3.0.32] — 2026-07-13

### Added
- **Clover Industrial Fan and Blower Inc.** client site (`clover-industrial-fan`) — Antipolo industrial fans & blowers with Facebook-scraped photos
- Portfolio preview: `?preview=clover-industrial-fan` → `clover-industrial-fan.netlify.app`

### Changed
- **Jazz1 Aircon** updated with real Facebook brief, contact info, and gallery assets
- Client-site skill/docs: Facebook brief gathering via **Chrome DevTools MCP** (Step 1b)

## [3.0.31] — 2026-07-13

### Added
- **Jazz1 Airconditioning Services** client quotation site (`jazz1-aircon`) — HVAC sales, installation, cleaning, repair in Rodriguez (Montalban), Rizal
- Portfolio preview: `?preview=jazz1-aircon` → `jazz1-aircon-services.netlify.app`

## [3.0.30] — 2026-07-13

### Changed
- **Portfolio Insights** restyled to match V3 dark sections — `#00473e` background, white cards, green-accent stat values, blog-style shadows and hover lift

## [3.0.29] — 2026-07-13

### Changed
- Visit logging removed from main portfolio — **preview pages only** (`?preview=`)
- **Insights** polls every 30s while open; shows last-updated time
- Insights counts **preview views/likes only** (excludes old main-site pageview noise)

### Fixed
- `analyticsSummary` filters `eventType: preview_view` for accurate preview metrics

## [3.0.28] — 2026-07-13

### Fixed
- Restore `trackVisit` production URL to `cloudfunctions.net` endpoint (Cloud Run URL caused CORS failures in browser)

## [3.0.27] — 2026-07-13

### Added
- **Visitor IP address** stored on each `visits` record (alongside hashed IP)
- **Preview like/dislike** on all client preview pages — dislike requires a comment
- **`previewFeedback`** Cloud Function → Firestore `preview_feedback` collection
- **`analyticsSummary`** API + **Portfolio Insights** section with live stat cards and bar charts (sites, visits, likes, 7-day trends)
- Preview feedback UI tests

### Changed
- `trackVisit` production URL updated to Cloud Run endpoint
- Weekly email report includes preview like/dislike totals

## [3.0.26] — 2026-07-13

### Added
- **Anonymous visit tracking** — page views, section navigation, and client preview views sent to Firestore via `trackVisit` Cloud Function
- **`weeklyVisitReport`** scheduled function — Monday 8:00 AM (Asia/Manila) email summary to admin inboxes
- `VisitTracker` component, `visitTracker.js` utility, and unit test

### Changed
- Firestore rules lock down direct client writes (Admin SDK / functions only)
- `firestore.indexes.json` index for visit queries

## [3.0.25] — 2026-07-13

### Added
- **Machinemate Mainteneering Services** client demo (`client-sites/machinemate/`) — industrial fans & ventilation site; Netlify `machinemate-engineering.netlify.app`
- Portfolio preview whitelist entry for `?preview=machinemate`
- Outreach drafts (email, SMS, messenger) and README catalog entry

## [3.0.24] — 2026-07-13

### Added
- **Preview slug tests** — `previewWhitelist.test.js` covers all `PREVIEW_SITES` slugs, legacy hostnames, `buildPreviewPortfolioUrl()`, and rejections
- Expanded `PreviewShowcase.test.js` and `Index.test.js` (URL normalization, slug-friendly errors)

### Changed
- Cursor skill/rules/AGENTS and `client-sites/README.md` document slug preview URLs, catalog maintenance, and test locations

## [3.0.23] — 2026-07-13

### Changed
- **Preview showcase** — `?preview=` uses short slugs (e.g. `?preview=jk-construction`); legacy `*.netlify.app` URLs still resolve and normalize to slug
- Preview header no longer displays Netlify hostnames
- Client preview links in `client.json`, outreach drafts, and `client-sites/README.md` updated to slug format

### Added
- **`client-sites/README.md`** — full site catalog (preview links, contact, packages, outreach paths)
- Cursor skill/rules/AGENTS updated to maintain catalog and slug preview URLs

## [3.0.22] — 2026-07-13

### Added
- **Sonyoba Marketing** client demo (`client-sites/sonyoba-marketing/`) — office equipment catalog with product images, reviews, FAQ; Netlify `sonyoba-marketing.netlify.app`
- **JK Construction Services** client demo (`client-sites/jk-construction/`) — Caloocan construction/renovation site with services, gallery, FAQ; Netlify `jk-construction-services.netlify.app`
- Portfolio preview whitelist entries for both hosts

## [3.0.21] — 2026-07-10

### Changed
- **News & Blog** reuses shared `V3DetailModal` shell (same dark modal as project details) with working header × and footer Close
- Blog section styling aligned with Projects (`#00473e` background, standard filter buttons)
- Blog modal lifted to portfolio root (same pattern as project detail modal)

### Added
- `V3DetailModal` shared component; `ProjectDetailModal` refactored to use it
- `BlogPostModal` unit tests

## [3.0.20] — 2026-07-10

### Changed
- Sanitized **News & Blog** posts — removed pricing, full addresses, preview URLs, and outreach workflow details from public copy

## [3.0.19] — 2026-07-10

### Added
- **News & Blog** portfolio section (`#blog`) — updates on sideline client-site work and portfolio tooling
- Seven launch posts: workflow overview, preview showcase, Tailwind client stack, and four client demos (RG Decals, Suyat, Ohana, Extra Rice)
- Blog post modal with category filters and portfolio preview links

### Fixed
- Restored missing Sass spacing tokens (`$space-4`, `$space-6`) for V3 stylesheet compile

## [3.0.18] — 2026-07-10

### Added
- **RG Decals and Printing Shop** client site (`client-sites/rg-decals/`) — decals, signs, banners, and printing demo with outreach drafts
- Portfolio preview whitelist entry for `rg-decals-printing.netlify.app`

## [3.0.17] — 2026-07-10

### Added
- Portfolio **preview showcase** — `?preview=host.netlify.app` shows desktop monitor + mobile phone mockups with embedded iframes
- Whitelist-gated preview config (`src/v3/config/previewWhitelist.js`)
- `client-sites/` monorepo — `_template/` and sample `quotation/` demo (Bamboo Grove Café)
- Cursor skill `client-site-netlify`, rule `client-quotations.mdc`, Netlify MCP in `.cursor/mcp.json`

### Changed
- `Index.js` routes to PreviewShowcase when valid `?preview=` query is present
- AGENTS.md, project-history, README updated for client quotation workflow

## [3.0.16] — 2026-06-09

### Added
- **Get a Quote** portfolio section with full project brief form (project type, services, budget, timeline)
- Firebase `quotation` Cloud Function — saves to Firestore `quotations` collection and queues email to Carl
- AI automation skills in portfolio/CV config: AI Automation, OpenAI/Claude APIs, Prompt Engineering, MCP

### Changed
- About section leads with AI automation workflows; added AI Automation, MCP, Prompt Engineering tags
- Metrobank experience: testing automation and GitLab CI pipeline emphasis
- GoAutoDial experience: AI-assisted tooling and workflow automation in migration delivery

## [3.0.15] — 2026-06-08

### Changed
- Shortened Side Projects copy (Tahanan, OnlineJobs pipeline) — high-level only; client project case studies stay long
- About section: less detail on independent products; Tahanan mentioned briefly without stack spoon-feeding

## [3.0.14] — 2026-06-08

### Added
- **Side Projects** portfolio section: Tahanan (community SaaS) and OnlineJobs Application Pipeline with hero SVGs
- Long-form scrollable project case studies for all portfolio projects (Overview + Impact in modal)
- Job applications workflow docs (`docs/job-applications-workflow.md`) and expanded README coverage
- OnlineJobs MCP server, local job tracker dashboard, CV cloud upload (Dropbox/Google Drive)

### Changed
- About section names Tahanan and job pipeline side projects; stat updated to "2 Side Projects Shipped"
- Project grid: always-visible thumb labels, filter remount fix for Side Projects
- Project detail modal: multi-paragraph descriptions, scrollable body, dedicated Impact section
- Home hero test updated for AI-first copy

## [3.0.13] — 2026-06-04

### Changed
- Hero eyebrow updated to "Building AI-Powered Enterprise Applications" (Bryl Lim-inspired AI-first framing)
- Hero sub-headline updated to lead with architecture + AI angle
- About paragraphs rewritten: AI-first opening, named proof points with outcomes, builder/founder closing
- About skill tags reordered to lead with AI stack (OpenAI API, AI Integration, LLM Apps, SaaS)
- Stats row: added 4th stat "1 SaaS Shipped"
- Job descriptions for Metrobank, GoAutoDial, UCC/Cornerstone/MNX, ABS-CBN: added Impact lines with quantified outcomes
- Project descriptions: added Impact lines to mb1, eco, sc; added new entries for GoAutoDial Agent app and stealth SaaS card
- SEO: title, description, keywords, JSON-LD jobTitle and knowsAbout updated to AI-first/SaaS-builder framing
- CV rebuilt to pick up all updated content

## [3.0.12] — 2026-06-04

### Added
- `sitemap.xml` created (was referenced in HTML but returned 404)
- JSON-LD `Person` + `WebSite` structured data in `<head>`
- `<meta name="robots" content="index, follow">` and `<meta name="author">` tags
- Google Fonts preconnect hints for performance

### Fixed
- `og:image` and `twitter:image` changed to absolute URL (`https://carlmanuel.com/...`)
- `twitter:card` upgraded from `summary` to `summary_large_image`
- `og:type` corrected from invalid `portfolio` to `website`
- `robots.txt` updated with `Sitemap:` directive
- `manifest.json` branding corrected (was "Create React App Sample")
- PWA theme/background colors aligned to design tokens (`#1E3932` / `#00473e`)

## [3.0.11] — 2026-05-31

### Changed
- GoAutoDial experience end date updated to Dec 2024 (no longer listed as Present)
- Metrobank experience skill tag typo fixed (`Unit-Testing`)

## [3.0.10] — 2026-05-29

### Fixed
- Project detail modal now renders correctly (centered dialog with full content) by adding Bootstrap modal layout shell CSS required by React-Bootstrap
- Lifted `ProjectDetailModal` to portfolio root so it layers above fixed section slides without being obscured

### Changed
- Improved project modal typography (Playfair title, Inter body), spacing, and footer Close button styling
- Chat agent footer close uses native button with explicit Escape handler and test coverage

## [3.0.9] — 2026-05-28

### Fixed
- Project and chat modal close behavior now works reliably via header close icon, footer close button, and Escape key
- Prevented background portfolio interactions while a modal is open by locking page interaction and section navigation handlers
- Improved modal close-button hit area and layering so controls are consistently clickable on desktop and mobile

### Changed
- Updated chat and project modal UI copy to a more professional tone
- Rewrote all ported project descriptions in `projectDetails.js` with clearer, professional language while preserving original scope

## [3.0.8] — 2026-05-27

### Fixed
- Project and AI chat modals: solid green backgrounds on header, body, and footer (no transparent bleed-through)
- Modals now layer above nav dots/arrows (z-index 1400) with a darker backdrop (82% black)
- Improved chat bubble and project description text contrast

## [3.0.7] — 2026-05-27

### Added
- Project detail modal: click any project thumbnail for full-resolution image, description, tags, gallery, and website link
- Ported legacy project copy into `src/v3/data/projectDetails.js` (28 projects)
- `ProjectDetailModal` component with xl/fullscreen mobile layout and V3 styling

### Changed
- Projects grid still uses resized thumbnails; modal uses full `/static/images/sites/` images

## [3.0.6] — 2026-05-27

### Fixed
- AI Chat assistant: V3 styling, empty-send loading bug, safe API response parsing, scrollable messages, mobile fullscreen modal
- Mobile nav dots: higher z-index and stronger bottom tray contrast so they stay visible above content
- Mobile section arrows: visible again with safe positioning above nav dots and below header (44px tap targets)

### Added
- Chat FAB bottom-left on mobile (icon-only) to avoid overlapping nav dots
- `ChatAgent.test.js` for FAB, empty submit, and API reply flow

## [3.0.5] — 2026-05-27

### Added
- Home shape parallax via device gyroscope on mobile (tilt to move shapes)
- iOS motion permission requested on first tap; touch parallax remains as fallback

## [3.0.4] — 2026-05-27

### Added
- Home hero animated geometric shapes (circles, ring, hexagon) with slow spin, pulse, and drift
- Mouse and touch parallax on Home shapes — layered depth response on desktop and mobile
- `prefers-reduced-motion` disables shape animations and parallax

## [3.0.3] — 2026-05-27

### Fixed
- Project thumbnail images not appearing on mobile (iOS): replaced broken placeholder lazy-load with eager load when Projects section is active
- Added `background-image` fallback on project cards (same pattern as V2)
- Skip projects with invalid ids in the grid (no more broken `false.jpg` entries)

### Added
- `Projects.test.js` for image loading regression

## [3.0.2] — 2026-05-27

### Fixed
- About section scroll lock on mobile: inner content now scrolls correctly and section navigation works at boundaries
- Profile photo crop on About: face visible with improved `object-position`
- Skills and Contact sections use the same inner-scroll pattern to prevent identical mobile scroll traps

### Added
- `About.test.js` regression tests for scroll structure

## [3.0.1] — 2026-05-27

### Fixed
- Mobile fast-touch no longer jumps to the next section while scrolling inside Experience, Projects, and other long sections
- Touch swipe navigation now uses the same inner-scroll boundary gating as wheel navigation
- Nested scrollable areas (e.g. Experience timeline) resolve to the correct overflow container

### Added
- Unit tests for `SwipeHandler` and Portfolio touch boundary navigation

## [3.0.0] — 2026-05-13

### Added
- Portfolio V3 under `src/v3/` with Starbucks-inspired green design system
- Full-page slide navigation with per-section fixed positioning, hash sync, keyboard, and touch swipe
- Mobile support: hamburger menu, bottom nav dot tray, safe-area insets, 100svh sections
- V3 sections: Home, About, Skills, Experience, Projects, Contact
- Enterprise + AI-focused copy targeting big companies and AI developer roles
- Cursor rules for V3 design system, components, content, mobile, and copy
- Unit tests for V3 components and App shell
- GitHub Actions workflow builds and deploys `docs/` artifact on push to main
- Custom domain support via `public/CNAME` for carlmanuel.com

### Changed
- Default entry point switched to V3 portfolio (`src/pages/Index.js`)
- Package version bumped to 3.0.0
- Canonical and OG URLs updated to https://carlmanuel.com
- Firebase Cloud Functions CORS extended for carlmanuel.com

### Fixed
- GitHub Pages deploy workflow now runs `npm ci && npm run build` and uploads `docs/` instead of entire repo
