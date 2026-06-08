# Carl Louis Manuel — Portfolio & Dev Tooling

Personal portfolio ([carlmanuel.com](https://carlmanuel.com)) built with Create React App, V3 design system, Firebase, and GitHub Pages.

---

## Major features (2026 updates)

### Portfolio V3

- Starbucks-inspired green/gold design system under `src/v3/`
- SEO: sitemap, JSON-LD, Open Graph, manifest (`public/`)
- Bryl Lim–style copy: quantified experience, project impact lines
- **Side Projects** on portfolio: **Tahanan** (community SaaS) and **OnlineJobs Application Pipeline** (MCP + dashboard)

### Job applications workflow (new)

Full pipeline for **OnlineJobs.ph** remote job search, tailored CVs, apply tracking, and optional cloud CV links — also featured as a **Side Project** on the portfolio (`Side Projects` filter in Projects).

| What | Where |
|------|--------|
| **Local dashboard** | `OnlineJobs-MCP-Server/` → `uv run job-dashboard` → http://localhost:8787 |
| **Cursor MCP** | `onlinejobs-apify` server — search & apply from chat |
| **CV generator** | `Office-Word-MCP-Server/apply_canva_cv_design.py` |
| **Application data** | `job-applications/` (gitignored, local only) |
| **Full guide** | [docs/job-applications-workflow.md](docs/job-applications-workflow.md) |

**Dashboard capabilities:** list/filter applications, status & notes, copy submission message, download CV, search OnlineJobs.ph, one-click apply, manual apply form.

**MCP capabilities:** search listings, create application folders, list/update tracking, upload CV to Dropbox or Google Drive.

---

## Quick links

| Task | Command / doc |
|------|----------------|
| Run portfolio locally | `npm start` → http://localhost:3000 |
| Run job dashboard | `cd OnlineJobs-MCP-Server && uv run job-dashboard` |
| Job workflow guide | [docs/job-applications-workflow.md](docs/job-applications-workflow.md) |
| MCP + env setup | [OnlineJobs-MCP-Server/README.md](OnlineJobs-MCP-Server/README.md) |
| Deploy portfolio | [.cursor/skills/deploy-portfolio/SKILL.md](.cursor/skills/deploy-portfolio/SKILL.md) |

---

## Repository layout (high level)

```text
src/v3/                    # Portfolio V3 (active UI)
OnlineJobs-MCP-Server/     # MCP server + FastAPI dashboard + dashboard-ui/
Office-Word-MCP-Server/    # CV Word doc generator (Canva-style)
job-applications/          # Generated apply folders (gitignored)
docs/                      # GitHub Pages build + workflow docs
functions/                 # Firebase Cloud Functions (contact, chat)
.cursor/skills/            # Cursor agent skills (onlinejobs, deploy, …)
.cursor/rules/             # Agent rules (v3 design, onlinejobs workflow)
```

---

## Portfolio development

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in watch mode.

### `npm run build`

Builds for production to the `build/` folder.

See [Create React App documentation](https://github.com/facebook/create-react-app) for more.

---

## Directory structure (legacy CRA reference)

### `docs`

Build output and static assets for GitHub Pages.

### `functions`

Firebase Cloud Functions — contact form, chat API.

### `public`

Static files copied at build time (index.html, sitemap, robots, manifest).

### `src`

React source — V3 portfolio in `src/v3/`, shared config in `src/external-config.js`.

### `OnlineJobs-MCP-Server`

OnlineJobs.ph integration: Apify search, application packages, local dashboard.

### `Office-Word-MCP-Server`

Generates `CARLLOUISMANUEL-CV.docx` from portfolio data with per-job tagline override.

---

## Environment & secrets

| File | Purpose |
|------|---------|
| `OnlineJobs-MCP-Server/.env` | `APIFY_API_TOKEN`, CV upload tokens, `DASHBOARD_PORT` |
| `.cursor/mcp.json` | Cursor MCP server config (gitignored or local) |
| `functions/.env` | Firebase function secrets |

Never commit tokens or `job-applications/` folders.

---

## Learn more

- [Job applications workflow](docs/job-applications-workflow.md)
- [OnlineJobs MCP server](OnlineJobs-MCP-Server/README.md)
- [Create React App docs](https://facebook.github.io/create-react-app/docs/getting-started)
