# Hosting PHP (live Stellar) — outreach cron

Synced to `~/public_html/api-carlxaeron/` while production still runs the custom PHP API (Laravel app lives in parent folder for the future cutover).

## Offline auto follow-ups

1. After you approve a client quotation in Cursor, agent calls `POST /outreachSchedule` with `OUTREACH_SECRET`.
2. Initial proposal email sends immediately via Private Email.
3. cPanel/cron runs daily: `scripts/cron-outreach-followups.php` and sends due follow-ups (3d or 1w, max 2).
4. Pause: `POST /outreachPause`.

## Install / refresh on server

Upload `src/outreach.php`, `scripts/cron-outreach-followups.php`, patched `public/index.php` + `src/bootstrap.php`, run SQL or let `outreach_ensure_table()` create `outreach_jobs`.

Cron (installed):

```cron
0 1 * * * /usr/local/bin/php /home/carlxaeron/public_html/api-carlxaeron/scripts/cron-outreach-followups.php >> /home/carlxaeron/public_html/api-carlxaeron/storage/outreach-cron.log 2>&1
```
