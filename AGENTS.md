# Agent guide — carlxaeron.github.io

Instructions for AI agents working in this repository.

## Project at a glance

- **Portfolio V3** (active): `src/v3/` → [carlmanuel.com](https://carlmanuel.com)
- **Version:** see `package.json` (currently `3.0.x`)
- **Backend:** Firebase Functions + Firestore (`functions/`)
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
| [.cursor/skills/onlinejobs-apify/SKILL.md](.cursor/skills/onlinejobs-apify/SKILL.md) | OnlineJobs.ph search, apply, CV, dashboard |
| [.cursor/skills/firebase-backend/SKILL.md](.cursor/skills/firebase-backend/SKILL.md) | Contact/quote forms, email, Firestore, functions deploy |

## Rules (auto-attached by glob)

| Rule | Scope |
|------|--------|
| `v3-design-system.mdc` | All V3 UI — colors, typography, spacing |
| `v3-components.mdc` | V3 components, motion, forms |
| `v3-content-data.mdc` | `external-config.js`, section data |
| `v3-copy.mdc` | Marketing copy tone |
| `v3-deploy.mdc` | Build, GitHub Pages, releases |
| `v3-firebase-backend.mdc` | `functions/`, `mapping.js`, email |
| `onlinejobs-workflow.mdc` | OJP MCP, job-applications |
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

### Contact / quote / email
- Frontend: `Contact.js`, `Quote.js` → `src/mapping.js`
- Backend: `functions/index.js` (`contact`, `quotation`)
- Deploy: `cd functions && npm run deploy`
- SMTP: Gmail **App Password** in `functions/.env` + Trigger Email extension

### Release portfolio
1. `CI=true npm test` + `CI=true npm run build`
2. Bump `package.json` + `CHANGELOG.md`
3. Push `main`, tag `vX.Y.Z`
4. Deploy functions if backend changed
5. Verify carlmanuel.com

### OnlineJobs apply
1. MCP search → user picks row
2. `create_job_application` → folder in `job-applications/`
3. Never mention Tahanan in `submission.txt`

## MCP servers

| Server | Config | Purpose |
|--------|--------|---------|
| `onlinejobs-apify` | `.cursor/mcp.json` | Job search & apply |
| Netlify (optional) | User Cursor settings | Not used for this portfolio deploy |

## Tests

```bash
CI=true npm test -- --watchAll=false --passWithNoTests
```

10 suites, 34+ tests — run before release.
