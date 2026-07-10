---
name: firebase-backend
description: Firebase Cloud Functions, Firestore forms, and email delivery for the carlxaeron.github.io portfolio (contact, quotation, assistant, Trigger Email). Use when the user asks about contact form, quote form, Firestore leads, SMTP, Gmail app password, functions deploy, or mapping.js API endpoints.
---

# Firebase backend (portfolio)

**Project:** `carllouismanuel-1e3a9`  
**History:** [docs/project-history.md](../../../docs/project-history.md)

## Architecture

```text
Contact.js / Quote.js  →  axios POST  →  mapping.js endpoints
  →  functions/index.js (contact | quotation)
  →  Firestore (contact | quotations)
  →  mail collection  →  Trigger Email extension
  →  optional direct SMTP (nodemailer)
  →  info@carlmanuel.com + carllouismanuel09@gmail.com
```

## Key files

| File | Role |
|------|------|
| `functions/index.js` | `contact`, `quotation`, `assistant`, `license` |
| `functions/.env` | `OPENAI_API_KEY`, `SMTP_CONNECTION_URI`, `DEFAULT_FROM` |
| `extensions/firestore-send-email.env` | Trigger Email SMTP (mirror App Password) |
| `src/mapping.js` | Prod/dev API URLs |
| `firebase.json` | Functions + Trigger Email extension |

## Deploy functions

```bash
cd functions && npm run deploy
```

Copies `src/external-config.js` → `functions/external-config.js`, then `firebase deploy --only functions`.

## SMTP / email troubleshooting

| Gmail error | Fix |
|-------------|-----|
| `535 BadCredentials` | Wrong password or malformed URI |
| `534 Application-specific password required` | Use 16-char **App Password**, not login password |

**Correct URI format:**

```text
smtps://carllouismanuel09@gmail.com:YOUR_16_CHAR_APP_PASSWORD@smtp.gmail.com:465
```

Update **both** `functions/.env` and Firebase Console → Extensions → Trigger Email, then redeploy functions.

## CORS origins (must include)

- `https://carlmanuel.com`
- `https://www.carlmanuel.com`
- `https://carlxaeron.github.io`
- `http://localhost:3000`

## Firestore collections

| Collection | Fields (main) |
|------------|----------------|
| `contact` | name, email, message, date |
| `quotations` | name, company, email, phone, projectType, budgetRange, timeline, services[], details, date |
| `mail` | to, replyTo, message{subject,html,text}, delivery |

## Check logs

```bash
firebase functions:log --only contact,quotation -n 20
```

Look for: `written to Firestore`, `queued in mail collection`, `sent via SMTP`.

## Adding a new form endpoint

1. Mirror `exports.contact` / `exports.quotation` pattern in `functions/index.js`
2. Add `mapping.js` key (dev emulator + prod URL)
3. Build V3 form component; use zustand modal on success (see `Contact.js`)
4. Deploy functions; test with curl + check inbox
5. Update `docs/project-history.md` and `CHANGELOG.md` on release

## Security

- Never commit `functions/.env` or app passwords
- Do not expose maintenance/export endpoints in production without auth
- `job-applications/` and `exports/` are local/gitignored
