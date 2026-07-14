# Agent guide — carlxaeron.github.io

Instructions for AI agents working in this repository.

## Project at a glance

- **Portfolio V3** (active): `src/v3/` → [carlmanuel.com](https://carlmanuel.com)
- **Version:** see `package.json` (currently `3.0.x`)
- **Forms / analytics API:** Laravel 12 [`api-carlxaeron/`](api-carlxaeron/) → [api.carlmanuel.com](https://api.carlmanuel.com)
- **Firebase (remaining):** assistant, license, weeklyVisitReport (`functions/`)
- **Job tooling:** `OnlineJobs-MCP-Server/`, `job-applications/` (local)
- **Full history:** [docs/project-history.md](docs/project-history.md)

## Before you change things

1. Read [docs/project-history.md](docs/project-history.md) for current architecture.
2. Match existing conventions — minimal diffs, no drive-by refactors.
3. **Do not edit** `.cursor/plans/` or user plan files.
4. **Do not commit** `job-applications/`, `exports/`, or `.env` secrets.

## Skills (read when task matches)

| Skill | Use when |
|-------|----------|
| [.cursor/skills/deploy-portfolio/SKILL.md](.cursor/skills/deploy-portfolio/SKILL.md) | Deploy, release, tag, verify carlmanuel.com, CI failures |
| [.cursor/skills/api-carlxaeron/SKILL.md](.cursor/skills/api-carlxaeron/SKILL.md) | Laravel API: contact, quote, visits, feedback, analytics, contracts |
| [.cursor/skills/hosting-ssh/SKILL.md](.cursor/skills/hosting-ssh/SKILL.md) | Namecheap Stellar SSH/SFTP — deploy `api-carlxaeron` / api.carlmanuel.com |
| [.cursor/skills/firebase-backend/SKILL.md](.cursor/skills/firebase-backend/SKILL.md) | Remaining Firebase: assistant, weekly report, license |
| [.cursor/skills/namecheap-browser/SKILL.md](.cursor/skills/namecheap-browser/SKILL.md) | Namecheap DNS via browser (when API access unavailable) |
| [.cursor/skills/onlinejobs-apify/SKILL.md](.cursor/skills/onlinejobs-apify/SKILL.md) | OnlineJobs.ph search, apply, CV, dashboard |
| [.cursor/skills/client-site-netlify/SKILL.md](.cursor/skills/client-site-netlify/SKILL.md) | Client sites, Netlify, `?preview=`, ask-before-send quotations + 3d/1w follow-ups |

## Rules (auto-attached by glob)

| Rule | Scope |
|------|--------|
| `v3-design-system.mdc` | All V3 UI — colors, typography, spacing |
| `v3-components.mdc` | V3 components, motion, forms |
| `v3-content-data.mdc` | `external-config.js`, section data |
| `v3-copy.mdc` | Marketing copy tone |
| `v3-deploy.mdc` | Build, GitHub Pages, releases |
| `api-carlxaeron.mdc` | `api-carlxaeron/`, `src/mapping.js` — Laravel API contracts |
| `v3-firebase-backend.mdc` | Remaining `functions/` (assistant / weekly report) |
| `onlinejobs-workflow.mdc` | OJP MCP, job-applications |
| `client-quotations.mdc` | `client-sites/`, Netlify previews |
| `project-overview.mdc` | Always-on repo map |

## Common tasks

### Add portfolio content
- Edit `src/external-config.js` (skills, experience, companies)
- Long project stories: `src/v3/data/projectDetails.js`
- Side projects: keep modal copy **short**; client projects stay **long**

### Add a V3 section
- New component under `src/v3/containers/Portfolio/`
- Register in `SECTIONS_CONFIG` in `Portfolio.js`
- Follow `v3-design-system.mdc`

### Contact / quote / visits API
- Frontend: `Contact.js`, `Quote.js`, analytics → `src/mapping.js` → `https://api.carlmanuel.com`
- Backend: Laravel [`api-carlxaeron/`](api-carlxaeron/) (skill **api-carlxaeron**)
- Deploy: hosting-ssh to Stellar; `composer install --no-dev` + `php artisan migrate --force` + `config:cache`
- SMTP / MySQL: `api-carlxaeron/.env` (never commit)
- Still Firebase: assistant, license, weeklyVisitReport only

### Release portfolio
1. `CI=true npm test` + `CI=true npm run build`
2. Bump `package.json` + `CHANGELOG.md`
3. Push `main`, tag `vX.Y.Z`
4. Deploy Laravel API and/or Firebase if those backends changed
5. Verify carlmanuel.com (+ `curl https://api.carlmanuel.com/health` if API changed)

### OnlineJobs apply
1. MCP search → user picks row
2. `create_job_application` → folder in `job-applications/`
3. Never mention Tahanan in `submission.txt`

### Client site + Netlify preview
1. Copy `client-sites/_template/` → `client-sites/{slug}/`
2. **Scrape client Facebook** via Chrome DevTools MCP (About + Photos → inspect + download to `assets/`); see client-site-netlify skill Step 1b
3. Customize HTML with **Tailwind CDN** + supplemental `styles.css`; keep `site.js` + **`hero-motion.js`** (Motion) + **`hero-three.js`** (Three.js ambient canvas on the first section)
4. **Keep** `embed-guard.js` + edge `embed-only` + CSP headers
5. Fill `client.json` (`contact`, `quotation` package/price/timeline)
6. Deploy via Netlify MCP or CLI (`netlify.toml`: `command = ""`)
7. Add host to `src/v3/config/previewWhitelist.js`; update `client.json` (`quotation.previewUrl` uses `?preview={slug}`)
8. **Update [`client-sites/README.md`](client-sites/README.md)** — catalog table + per-client detail section
9. Draft outreach: `quotation-email.md`, `quotation-sms.txt`, `quotation-messenger.txt`, plus `quotation-followup-3d.md` / `quotation-followup-1w.md`
10. **If email found** → ask: send quotation now + enable hosting auto follow-ups (**3 days** or **1 week**)? **Never send initial without a clear yes**
11. After approval → `POST https://api.carlmanuel.com/outreachSchedule` (`sendInitial` + `autoFollowUp`); cron on Stellar sends follow-ups while offline
12. Pause anytime via `POST /outreachPause` if prospect asks to stop
13. Share preview `https://carlmanuel.com/?preview={slug}` + drafts for user review (embed-only — direct client URL returns 403)
14. **Browser QA** — verify preview UI in Chrome (desktop + mobile mockups at true viewports, no overlap, iframe scroll)

Full catalog: [`client-sites/README.md`](client-sites/README.md)  
Preview tests: `src/v3/config/previewWhitelist.test.js`, `src/pages/Index.test.js`, `PreviewShowcase.test.js`

## MCP servers

| Server | Config | Purpose |
|--------|--------|---------|
| `onlinejobs-apify` | `.cursor/mcp.json` | Job search & apply |
| `netlify` | `.cursor/mcp.json` | Client site deploy (required for client-site-netlify skill) |
| `namecheap` | `.cursor/mcp.json` → `Namecheap-MCP-Server/` | Domains + DNS **API** (blocked until Namecheap eligibility) |
| `hosting-ssh` (`project-0-carlxaeron.github.io-hosting-ssh`) | `.cursor/mcp.json` → `Hosting-SSH-MCP-Server/` (`node dist/index.js`) | Stellar SSH/SFTP + deploy Laravel `api-carlxaeron` |
| `chrome-devtools` | user MCP | Facebook briefs + **Namecheap dashboard DNS** (no API) — skill `namecheap-browser` |

## Tests

**Portfolio (CRA):**

```bash
CI=true npm test -- --watchAll=false --passWithNoTests
```

**Laravel API:**

```bash
cd api-carlxaeron && php artisan test
```
