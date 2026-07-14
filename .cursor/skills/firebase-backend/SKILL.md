---
name: firebase-backend
description: Firebase Cloud Functions remaining endpoints (assistant, weekly report, license) and email troubleshooting. Contact/quotation/analytics moved to api.carlmanuel.com (api-carlxaeron). Use when the user asks about assistant, Trigger Email, functions deploy, or legacy Firestore.
---

# Firebase backend (portfolio)

**Project:** `carllouismanuel-1e3a9`  
**History:** [docs/project-history.md](../../../docs/project-history.md)

## Migrated off Firebase (hosting)

Logging + contact/quotation now live on **`https://api.carlmanuel.com`** (Namecheap Stellar, **Laravel 12** repo [`api-carlxaeron/`](../../../api-carlxaeron/)). Skills: **api-carlxaeron** (code/contracts) + **hosting-ssh** (deploy).

Still on Firebase: **assistant**, **license**, **weeklyVisitReport**.

## Architecture (remaining Firebase)

```text
ChatAgent → mapping.assistant → functions/index.js (assistant)
  → OpenAI (optional)
Weekly cron → weeklyVisitReport → mail / SMTP (still Cloud Functions)
```

Contact / quote / visits → **api-carlxaeron** (not Firestore).

## Key files

| File | Role |
|------|------|
| `functions/index.js` | `assistant`, `license`, `weeklyVisitReport` (+ legacy handlers) |
| `api-carlxaeron/` | Laravel 12 — contact, quotation, trackVisit, previewFeedback, analyticsSummary |
| `src/mapping.js` | Prod URLs for forms/analytics → api.carlmanuel.com; assistant → Firebase |
| `functions/.env` | `OPENAI_API_KEY`, SMTP (weekly report / assistant if needed) |

Forms SMTP: skill **api-carlxaeron** (`MAIL_*` / legacy `SMTP_*` on hosting `.env`).

## Deploy functions

```bash
cd functions && npm run deploy
```

Only required when changing Firebase-hosted endpoints (assistant / weekly report).

## SMTP / email troubleshooting

Forms SMTP is configured on the hosting API `.env` (`SMTP_*`). Weekly report still uses `functions/.env` `SMTP_CONNECTION_URI`.

| Gmail error | Fix |
|-------------|-----|
| `535 BadCredentials` | Wrong password or malformed URI |
| `534 Application-specific password required` | Use 16-char **App Password**, not login password |

**Correct URI format (Firebase):**

```text
smtps://carllouismanuel09@gmail.com:YOUR_16_CHAR_APP_PASSWORD@smtp.gmail.com:465
```

## CORS origins (must include)

- `https://carlmanuel.com`
- `https://www.carlmanuel.com`
- `https://carlxaeron.github.io`
- `http://localhost:3000`

## Firestore collections (legacy / remaining)

| Collection | Notes |
|------------|----------------|
| `contact` / `quotations` / `visits` | Historical — new writes go to MySQL on hosting |
| `mail` | Still used by weekly report / Trigger Email if enabled |

## Check logs

```bash
firebase functions:log --only assistant,weeklyVisitReport -n 20
```

Hosting API: curl `https://api.carlmanuel.com/health` or hosting-ssh `hosting_exec`.

## Security

- Never commit `functions/.env`, `api-carlxaeron/.env`, or app passwords
- Do not expose maintenance/export endpoints in production without auth
- `job-applications/` and `exports/` are local/gitignored
