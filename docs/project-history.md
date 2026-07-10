# Project history — carlxaeron.github.io

Living record of what this repository contains, how it evolved, and where things live.  
**Current version:** `3.0.17` · **Production:** [carlmanuel.com](https://carlmanuel.com)

---

## What this repo is (today)

| Area | Summary |
|------|---------|
| **Portfolio V3** | Full-screen slide UI (CRA + React 18), Starbucks-inspired design |
| **Backend** | Firebase Cloud Functions + Firestore + Trigger Email extension |
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
| 6 | `contact` | Contact | Message form → Firebase |
| 7 | `quote` | Get a Quote | Project brief form → Firebase (v3.0.16) |

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

## Firebase backend

**Project:** `carllouismanuel-1e3a9`

### Cloud Functions (`functions/index.js`)

| Export | Purpose |
|--------|---------|
| `contact` | Contact form → Firestore `contact` + email |
| `quotation` | Quote form → Firestore `quotations` + email |
| `assistant` | Chat agent (OpenAI GPT-3.5, portfolio context) |
| `license` | WHMCS license validation (client site) |

### Email (working Jul 2026)

1. Form saves to Firestore  
2. Doc queued in `mail` collection  
3. **Trigger Email** extension (`firestore-send-email`) sends via Gmail App Password  
4. Cloud Function also sends direct SMTP (same credentials in `functions/.env`)  
5. Recipients: `info@carlmanuel.com`, `carllouismanuel09@gmail.com`

**SMTP format:** `smtps://USER:APP_PASSWORD@smtp.gmail.com:465` (16-char Gmail App Password, not login password).

### API endpoints (`src/mapping.js`)

| Key | Production |
|-----|------------|
| `contact` | `https://contact-fjb46y5zza-uc.a.run.app` |
| `quotation` | `https://us-central1-carllouismanuel-1e3a9.cloudfunctions.net/quotation` |
| `assistant` | `https://assistant-fjb46y5zza-uc.a.run.app` |

CORS: `carlmanuel.com`, `www.carlmanuel.com`, `carlxaeron.github.io`, `localhost:3000`.

### Firestore collections (forms)

| Collection | Written by |
|------------|------------|
| `contact` | Contact form |
| `quotations` | Quote form |
| `mail` | Email queue (Trigger Email extension) |

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
| Skills | `.cursor/skills/` — deploy-portfolio, onlinejobs-apify, firebase-backend, client-site-netlify |
| Rules | `.cursor/rules/` — V3 design, deploy, content, OnlineJobs, Firebase, client-quotations |
| MCP (project) | `.cursor/mcp.json` — `onlinejobs-apify`, `netlify` |

---

## Local-only / gitignored

- `job-applications/` — apply folders
- `exports/` — Firestore lead exports
- `functions/.env` — secrets (OpenAI, SMTP)
- `extensions/*.env` — Trigger Email SMTP

---

## Maintenance notes

- After `npm run build`, restore `docs/job-applications-workflow.md` from git if wiped
- Portfolio tests: `CI=true npm test -- --watchAll=false --passWithNoTests`
- Do not re-add broken npm deps: `react-particles`, `tsparticles-preset-firefly`
- Regenerate CV after `external-config.js` content changes
