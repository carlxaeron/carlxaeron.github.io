# Project history — carlxaeron.github.io

Living record of what this repository contains, how it evolved, and where things live.  
**Current version:** `3.0.17` · **Production:** [carlmanuel.com](https://carlmanuel.com)

---

## What this repo is (today)

| Area | Summary |
|------|---------|
| **Portfolio V3** | Full-screen slide UI (CRA + React 18), Starbucks-inspired design |
| **Forms / analytics API** | Laravel 12 [`api-carlxaeron/`](../api-carlxaeron/) → [api.carlmanuel.com](https://api.carlmanuel.com) (Namecheap Stellar) |
| **Firebase (remaining)** | Assistant, license, weeklyVisitReport Cloud Functions |
| **Deploy** | GitHub Pages (`docs/`) via GitHub Actions; custom domain `carlmanuel.com` |
| **Job tooling** | OnlineJobs.ph MCP server, local dashboard, CV generator, `job-applications/` |
| **Client demos** | `client-sites/` — static sites deployed to Netlify; portfolio preview via `?preview=` |
| **AI in product** | Portfolio chat assistant (OpenAI), AI-first marketing copy |

**Not in this repo:** Tahanan app codebase, ME-ONE Foundation admin. Portfolio uses GitHub Pages; client demo sites use Netlify.

---

## Portfolio V3 — sections (7 slides)

| # | ID | Title | Notes |
|---|-----|-------|-------|
| 1 | `home` | Home | AI-first hero, CTAs |
| 2 | `about` | About | Bio, stats, skill tags (incl. AI Automation, MCP) |
| 3 | `skills` | Skills | From `src/external-config.js` |
| 4 | `experience` | Experience | Jobs with impact lines |
| 5 | `projects` | Projects | Client + Side Projects filter; scrollable case-study modal |
| 6 | `contact` | Contact | Message form → api.carlmanuel.com |
| 7 | `quote` | Get a Quote | Project brief form → api.carlmanuel.com |

**Navigation:** hash routes (`#about`, `#quote`), nav dots, hamburger, keyboard, swipe.  
**Entry:** `src/pages/Index.js` → Portfolio or `?preview=host` → PreviewShowcase.

---

## Content & data

| File | Role |
|------|------|
| `src/external-config.js` | Skills, companies, projects, experience, SEO meta — **single source of truth** |
| `src/v3/data/projectDetails.js` | Long modal case studies (client projects); short copy for side projects |
| `functions/external-config.js` | Copied on `functions` deploy; powers AI assistant context |
| `Office-Word-MCP-Server/apply_canva_cv_design.py` | Generates `CARLLOUISMANUEL-CV.docx` from external-config |

**Side projects on portfolio (brief public copy):**

- **Tahanan** — community SaaS, Philippines; details on request
- **OnlineJobs Application Pipeline** — private MCP + dashboard tooling

**Rule:** Never mention Tahanan in OnlineJobs cover letters (`submission.txt`).

---

## Laravel API (`api-carlxaeron/`)

**Live:** [api.carlmanuel.com](https://api.carlmanuel.com) · **Stack:** Laravel 12 + MySQL on Namecheap Stellar  
**Contracts:** Firebase-shaped JSON; unprefixed routes `/health`, `/trackVisit`, `/previewFeedback`, `/analyticsSummary`, `/contact`, `/quotation`  
**Skill:** `.cursor/skills/api-carlxaeron/` · **Deploy:** hosting-ssh  
**Legacy PHP backup:** `api-carlxaeron-legacy-php/` (local only)

Frontend mapping: `src/mapping.js` → production `https://api.carlmanuel.com/...`

---

## Firebase backend (remaining)

**Project:** `carllouismanuel-1e3a9`

### Cloud Functions (`functions/index.js`)

| Export | Purpose |
|--------|---------|
| `assistant` | Chat agent (OpenAI GPT-3.5, portfolio context) |
| `license` | WHMCS license validation (client site) |
| `weeklyVisitReport` | Scheduled visit email report |

Historical Firestore collections (`contact`, `quotations`, `visits`) are no longer the write path for the portfolio UI.

### Email

- **Contact / quote:** Laravel SMTP on hosting (`.env` `MAIL_*` / legacy `SMTP_*`)
- **Weekly report:** still Cloud Functions / Trigger Email as configured

### API endpoints (`src/mapping.js`)

| Key | Production |
|-----|------------|
| `contact` / `quotation` / visits / feedback / analytics | `https://api.carlmanuel.com/...` (Laravel) |
| `assistant` | Firebase HTTPS function |

CORS: `carlmanuel.com`, `www.carlmanuel.com`, `carlxaeron.github.io`, `localhost:3000`.

### Firestore collections

| Collection | Notes |
|------------|-------|
| `contact` / `quotations` / `visits` | Historical only — new writes go to MySQL on hosting |
| `mail` | Weekly report / Trigger Email if enabled |

**Jul 7, 2026:** Historical leads exported to local `exports/` (gitignored) and collections cleared for a clean slate.

---

## OnlineJobs.ph workflow

| Piece | Location |
|-------|----------|
| MCP server | `OnlineJobs-MCP-Server/` (Python + uv) |
| Dashboard | `uv run job-dashboard` → http://localhost:8787 |
| Application folders | `job-applications/` (gitignored) |
| Guide | `docs/job-applications-workflow.md` |

**MCP tools:** search, search (AI-filtered), create/list/update application, upload CV.

---

## Client sites + preview showcase (v3.0.17)

| Piece | Location |
|-------|----------|
| Preview whitelist | `src/v3/config/previewWhitelist.js` |
| Showcase UI | `src/v3/containers/PreviewShowcase/` — desktop iframe 1280×800, phone iframe 390×844, scaled to mockups |
| Client template | `client-sites/_template/` |
| Sample demo | `client-sites/quotation/` (Bamboo Grove Café) |
| Extra Rice 8 Trading | `client-sites/extra-rice/` → `extra-rice-trading.netlify.app` |
| Ohana Business Solutions | `client-sites/ohana/` → `ohana-business-solutions.netlify.app` |
| Suyat Notary Public | `client-sites/suyat/` → `suyat-notary-public.netlify.app` |
| RG Decals and Printing Shop | `client-sites/rg-decals/` → `rg-decals-printing.netlify.app` |
| Embed security | `embed-guard.js` + `netlify/edge-functions/embed-only.js` |
| Interactive stack | Tailwind CDN + `site.js` (nav, accordions, tabs, scroll reveal) |
| Outreach drafts | `quotation-email.md`, `quotation-sms.txt`, `quotation-messenger.txt` |
| Cursor skill | `.cursor/skills/client-site-netlify/SKILL.md` |

**Blog (v3.0.19):** `#blog` section — `src/v3/data/blogPosts.js`, `Blog.js`, posts on sideline workflow and each client demo.

**Preview URL:** `https://carlmanuel.com/?preview=bamboo-grove-cafe.netlify.app`

Hosts must match `*.netlify.app` or explicit `PREVIEW_SITES` list. Client Netlify URLs are **embed-only** (direct access returns 403). Preview UI has no “open live site” link.

---

## Deploy pipeline

```text
npm run build  →  build/  →  docs/
git push main  →  .github/workflows/static.yml
cd functions && npm run deploy  →  when backend/CORS changes
```

Tag releases: `v3.0.x` · Update `CHANGELOG.md` + `package.json`.

---

## Version timeline (major)

### v3.0.17 — 2026-07-10
- Preview showcase page (`?preview=`) with desktop + mobile device mockups
- `client-sites/` monorepo with `_template/` and `quotation/` demo
- Embed-only client security (edge function + `embed-guard.js`; direct Netlify URL blocked)
- Cursor skill `client-site-netlify`, rule `client-quotations.mdc`, Netlify MCP

### v3.0.16 — 2026-06-09
- Get a Quote section + `quotation` Cloud Function
- AI automation skills (AI Automation, OpenAI/Claude APIs, Prompt Engineering, MCP)
- About copy + Metrobank/GoAutoDial experience updates
- Email delivery fixed (Gmail App Password)

### v3.0.15 — 2026-06-08
- Shortened side-project modal copy (Tahanan, OJP pipeline)

### v3.0.14 — 2026-06-08
- Side Projects section (Tahanan, OJP workflow)
- Long client project case studies in modal
- OnlineJobs MCP + dashboard + job workflow docs

### v3.0.13 — 2026-06-04
- AI-first hero/About/SEO rewrite
- Project impact lines, quantified outcomes

### v3.0.12 and earlier
- SEO (sitemap, JSON-LD), contact email queue, V3 design system, Bryl-style enterprise copy

---

## Cursor / agent setup

| Asset | Path |
|-------|------|
| Agent guide | `AGENTS.md` |
| Skills | `.cursor/skills/` — deploy-portfolio, **api-carlxaeron**, hosting-ssh, firebase-backend, client-site-netlify, namecheap-browser, onlinejobs-apify |
| Rules | `.cursor/rules/` — V3 design/deploy/content, **api-carlxaeron**, Firebase (remaining), OnlineJobs, client-quotations |
| MCP (project) | `.cursor/mcp.json` — `onlinejobs-apify`, `netlify`, `hosting-ssh`, `namecheap` |

---

## Local-only / gitignored

- `job-applications/` — apply folders
- `exports/` — Firestore lead exports
- `functions/.env` — secrets (OpenAI, SMTP for weekly report)
- `api-carlxaeron/.env` — MySQL + SMTP for forms/analytics API
- `extensions/*.env` — Trigger Email SMTP

---

## Maintenance notes

- After `npm run build`, restore `docs/job-applications-workflow.md` from git if wiped
- Portfolio tests: `CI=true npm test -- --watchAll=false --passWithNoTests`
- Laravel API tests: `cd api-carlxaeron && php artisan test`
- Do not re-add broken npm deps: `react-particles`, `tsparticles-preset-firefly`
- Regenerate CV after `external-config.js` content changes
- Do not deploy `api-carlxaeron-legacy-php/`
