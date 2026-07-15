# Hosting PHP (live Stellar)

Synced to `~/public_html/api-carlxaeron/` while production still runs the custom PHP API (Laravel app lives in parent folder for the future cutover).

## Security layer (public endpoints)

| Control | Behavior |
|---------|----------|
| CORS | Allowlist only (`carlmanuel.com`, `www`, github.io, `localhost:3000`). **No** `Access-Control-Allow-Origin: *`. |
| Browser gate | Data routes require allowlisted Origin/Referer; `/health` open. |
| Rate limits | File counters in `storage/rate-limit/` keyed by IP + bucket (see `.env.example`). |
| Headers | `nosniff`, `DENY` frame, `no-store`, CSP `default-src 'none'`. |
| Outreach | Still requires `OUTREACH_SECRET` (+ outreach rate bucket). |
| Assistant | `POST /assistant` — browser gate + OpenAI (`OPENAI_API_KEY`). |
| Weekly report | CLI cron Monday 08:00 — MySQL + SMTP (not Firestore). |

## Assistant context

```bash
node api-carlxaeron/hosting-php/scripts/build-assistant-context.cjs
```

Uploads `data/assistant-context.json` with the PHP sources.

## Offline auto follow-ups

1. After you approve a client quotation in Cursor, agent calls `POST /outreachSchedule` with `OUTREACH_SECRET`.
2. Initial proposal email sends immediately via Private Email.
3. cPanel/cron runs daily: `scripts/cron-outreach-followups.php` (**3d → 7d → 7d → 7d**, max 4).
4. Pause: `POST /outreachPause`.

## Weekly visit report cron

```cron
0 8 * * 1 /usr/local/bin/php /home/carlxaeron/public_html/api-carlxaeron/scripts/cron-weekly-visit-report.php >> /home/carlxaeron/public_html/api-carlxaeron/storage/weekly-report-cron.log 2>&1
```

(Set crontab timezone to Asia/Manila or adjust hour for UTC.)

## Install / refresh on server

**Before upload:** `php api-carlxaeron/hosting-php/tests/run-unit.php` (must exit 0).

```bash
mkdir -p ~/public_html/api-carlxaeron/storage/rate-limit
chmod 755 ~/public_html/api-carlxaeron/storage/rate-limit
# Set OPENAI_API_KEY in server .env (never commit)
```
