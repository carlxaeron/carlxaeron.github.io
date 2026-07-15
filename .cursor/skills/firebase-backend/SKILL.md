---
name: firebase-backend
description: Firebase Analytics client SDK and any leftover legacy Cloud Functions. Assistant, weekly report, contact/quote/analytics live on api.carlmanuel.com. Use when debugging GA, remaining functions, or Trigger Email history.
---

# Firebase backend (portfolio)

**Project:** `carllouismanuel-1e3a9`  
**History:** [docs/project-history.md](../../../docs/project-history.md)

## Migrated off Firebase (hosting)

| Former Firebase | Now |
|-----------------|-----|
| contact, quotation, trackVisit, previewFeedback, analyticsSummary | `https://api.carlmanuel.com` (hosting-php) |
| **assistant** (ChatAgent) | `POST https://api.carlmanuel.com/assistant` |
| **weeklyVisitReport** | cPanel cron → `scripts/cron-weekly-visit-report.php` (MySQL + Private Email) |
| **license** | **Deleted** |

Skills: **api-carlxaeron** + **hosting-ssh**.

## Still on Firebase

- **Firebase Analytics** client (`src/config.js` `logEvent`) for page/chat events
- Optional **legacy** Cloud Function handlers still in `functions/index.js` (contact etc.) for emulators / rollback — **not** used by prod `mapping.js`

## Key files

| File | Role |
|------|------|
| `functions/index.js` | Legacy HTTP handlers only (no assistant / weekly / license) |
| `src/mapping.js` | Forms/analytics/assistant → api.carlmanuel.com |
| `src/config.js` | Firebase Analytics init when `REACT_APP_projectId` set |

## Deploy functions (legacy only)

**Gate:**

```bash
cd functions && npm test
```

Then:

```bash
cd functions && npm run deploy
```

Only needed if changing leftover Cloud Function code. Weekly report and assistant **do not** deploy here.

## Firestore collections (legacy)

| Collection | Notes |
|------------|-------|
| `contact` / `quotations` / `visits` / `preview_feedback` | Historical — new writes go to MySQL |
| `mail` / `analytics_reports` | Older weekly path — hosting uses MySQL `analytics_reports` now |

## Security

- Never commit `functions/.env`, `api-carlxaeron/.env`, or API keys
- `job-applications/` and `exports/` stay local/gitignored
