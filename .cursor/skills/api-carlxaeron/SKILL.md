---
name: api-carlxaeron
description: Laravel/PHP portfolio API on Namecheap (api.carlmanuel.com) — contact, quotation, visits, analytics, ChatAgent assistant, weekly report cron. Use when changing api-carlxaeron, deploying the hosting API, SMTP/MySQL, or Firebase-compatible response contracts.
---

# api-carlxaeron (Laravel 12)

**Live:** `https://api.carlmanuel.com`  
**Repo:** [`api-carlxaeron/`](../../../api-carlxaeron/)  
**Hosting:** Namecheap Stellar · docroot `public_html/api-carlxaeron/public`  
**Deploy MCP:** skill **hosting-ssh**  
**Legacy backup:** `api-carlxaeron-legacy-php/` (do not deploy)

Portfolio frontend URLs: [`src/mapping.js`](../../../src/mapping.js) → `https://api.carlmanuel.com/...`

Still on Firebase (skill **firebase-backend**): Analytics client SDK only (+ optional unused legacy handlers). Assistant + weekly report are hosting-php; **license** deleted.

## Endpoints (unprefixed — not `/api/...`)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | `{ ok, service: "api-carlxaeron" }` |
| POST | `/trackVisit` | Analytics |
| POST | `/previewFeedback` | Like / dislike — admin Web Push + **prospect auto-reply email** when email known (`outreach_jobs.contact_email` or optional body `contactEmail`; one per feedback row; BCC `MAIL_BCC`) |
| GET | `/analyticsSummary` | Insights panel |
| POST | `/contact` | Form + SMTP |
| POST | `/quotation` | Form + SMTP |
| POST | `/assistant` | ChatAgent — browser Origin + OpenAI (`OPENAI_API_KEY`) |
| POST | `/outreachSchedule` | **Secret** — after user yes: send initial + queue auto follow-ups (`autoFollowUp: true`, cadence `3d1w` = **3d→7d→7d→7d**, `maxFollowUps: 4`). Follow-up emails stack goodwill discount **10%→20%→30%→50%** + commission invite. On successful initial send → admin Web Push |
| POST | `/outreachPause` | **Secret** — stop auto follow-ups for a slug (hosting-php cron still reads same MySQL rows) |
| POST | `/pushNotifyAdmins` | **Secret** — `{ title, body, data? }` → push to all admin subscriptions (used by hosting-php follow-up cron) |

### Admin (Sanctum Bearer token — Laravel only)

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | `/admin/login` | public + throttle 5/min | email/password → `{ token, user }` |
| POST | `/admin/logout` | `auth:sanctum` | revoke current token |
| GET | `/admin/summary` | sanctum | unmasked analytics (raw preview slugs) |
| GET | `/admin/contacts` | sanctum | paginated `contact` (`?perPage=25`) |
| GET | `/admin/quotations` | sanctum | paginated `quotations` |
| GET | `/admin/outreach` | sanctum | list `outreach_jobs` |
| POST | `/admin/outreachPause` | sanctum | pause by `slug` + optional `contactEmail` |
| GET | `/admin/content/{section}` | sanctum | read CMS payload (`hero`, `about`, `header`, `skills`, `experiences`, `companies`, `projectDetails`) |
| PUT | `/admin/content/{section}` | sanctum | save CMS payload `{ content: ... }` |
| GET | `/admin/push/vapidPublicKey` | sanctum | VAPID public key for `PushManager.subscribe` |
| POST | `/admin/push/subscribe` | sanctum | body `{ endpoint, keys: { p256dh, auth } }` — upsert subscription for current user |
| DELETE | `/admin/push/subscribe` | sanctum | body `{ endpoint }` — remove current user's subscription |
| POST | `/admin/push/sendPing` | sanctum | send test push to current user's subscriptions; `{ data: { sent } }` |
| GET | `/content/{section}` | public | portfolio read with `source: static|cms` |

Seed admin user: `ADMIN_EMAIL` + `ADMIN_PASSWORD` in server `.env` → `php artisan db:seed --class=AdminSeeder --force`. Never commit password.

**Admin SPA:** `carlmanuel.com/#login` → Sanctum token → `#admin` dashboard (Overview, Inbox, Outreach, Clients, CMS). URLs in [`src/mapping.js`](../../../src/mapping.js) (`adminLogin`, `adminSummary`, `adminContent`, etc.).

**Clients → Generate agreement:** Prefills from `public/data/client-catalog.json` (built from `client-sites/*/client.json`) + outreach rows; client-side fill of [`docs/templates/client-service-agreement.md`](../../../docs/templates/client-service-agreement.md) → download `.md` / printable `.html` (no API route; template served from `public/templates/`).

**Web Push (Admin Settings):** Sanctum admin subscribes via `POST /admin/push/subscribe`; Laravel stores rows in `push_subscriptions` and sends via `minishlink/web-push` when:
- `POST /contact` or `POST /quotation` succeeds
- Outreach **initial** email sent (`OutreachScheduler` / `outreachSchedule`)
- Outreach **follow-up** email sent (hosting-php cron → `POST /pushNotifyAdmins`)
- **`POST /trackVisit`** with `eventType: preview_view` + allowlisted Origin/Referer + valid slug — **one push per slug + session** (Cache TTL `PUSH_PREVIEW_VIEW_THROTTLE_MINUTES`, default **30**)
- **`POST /previewFeedback`** on successful like/dislike (slug + sentiment in title/body; dislike includes comment snippet) — also sends **one auto-reply email** to the prospect when `outreach_jobs.contact_email` or body `contactEmail` resolves (like = thank + soft “push through”; dislike = thank + invite revision); BCC `MAIL_BCC`; skipped if no email or already sent for that row

Push failure never breaks form/outreach/analytics responses. Service worker + Settings UI live in the portfolio SPA. **iOS:** user must Add to Home Screen (iOS 16.4+), then open Admin and enable notifications.

Live Stellar: **Laravel** serves public API routes including `POST /outreachSchedule` and `POST /outreachPause`. **Follow-up cron** still runs `api-carlxaeron/hosting-php/scripts/cron-outreach-followups.php` (reads same MySQL `outreach_jobs`) — **not** `api-carlxaeron/scripts/` (wrong path). Cron bootstraps via `hosting-php/src/bootstrap.php`: loads `hosting-php/.env`, then parent Laravel `api-carlxaeron/.env` if local copy missing (DB + SMTP + `OUTREACH_SECRET`). Cursor rule: yes-to-send enables follow-ups automatically (no second cadence ask).

### Public security layer (hosting-php)

| Control | Detail |
|---------|--------|
| CORS | Allowlist only — **never** `Access-Control-Allow-Origin: *` (`src/cors.php`) |
| Browser gate | Public data routes (`analyticsSummary`, contact, quotation, trackVisit, previewFeedback) require allowlisted **Origin** or **Referer** (`require_browser_origin`); bare curl / address-bar → **403**. `/health` stays open. Outreach still `OUTREACH_SECRET` |
| Slug mask | `analyticsSummary` `previewStats[].slug` masked server-side (`mask_client_slug`: `g3k-cad` → `g3****ad`) — no raw client slugs in JSON |
| Rate limits | Per-IP file counters in `storage/rate-limit/` (`src/rate_limit.php`); env `RATE_LIMIT_*` |
| Headers | `nosniff`, `X-Frame-Options: DENY`, `no-store`, CSP `default-src 'none'` |
| Outreach | `OUTREACH_SECRET` + outreach rate bucket |

Forms / Insights stay public to the SPA (browser sends Origin). Defaults: contact/quote 8/h, visits 120/min, feedback 30/h, summary 60/min, outreach 60/h.

**`POST /quotation` body** (portfolio Get a Quote): `name`, `email`, `details` required; optional `company`, `phone`, `projectType`, `budgetRange`, `currency` (`PHP`|`USD`), `timeline`, `services[]`. Persisted to `quotations.currency` (nullable). Before first deploy with currency: run `php hosting-php/scripts/migrate-quotations-currency.php` on Stellar and `php artisan migrate` for Laravel.

**Before deploying `hosting-php` changes**, run:

```bash
php api-carlxaeron/hosting-php/tests/run-unit.php
```

Must pass (exit 0). See rule **test-before-deploy**. On server: `mkdir -p storage/rate-limit`.

Response shape (Firebase-compatible):

- Success: `{ status: 200, message, data }`
- Error: `{ status: 400, message, data, errCode: "" }` (HTTP usually 400)

CORS origins: `carlmanuel.com`, `www`, `carlxaeron.github.io`, `localhost:3000` — see `config/cors.php`.

## Key code

| Path | Role |
|------|------|
| `routes/api.php` | Route table (`apiPrefix: ''` in `bootstrap/app.php`) |
| `app/Http/Controllers/Api/PortfolioApiController.php` | Public handlers |
| `app/Http/Controllers/Api/OutreachController.php` | Secret-gated `outreachSchedule` / `outreachPause` |
| `app/Http/Controllers/Api/AdminController.php` | Admin auth + ops + CMS |
| `app/Services/OutreachScheduler.php` | Schedule initial send + queue follow-ups |
| `app/Services/OutreachCadence.php` | Cadence normalize, discount ladder (mirrors hosting-php) |
| `app/Services/OutreachMailer.php` | Prospect outreach SMTP (+ `MAIL_BCC`) |
| `app/Mail/OutreachProspectMail.php` | Initial / follow-up HTML bodies |
| `app/Services/PortfolioContentService.php` | CMS section read/write |
| `app/Models/PortfolioContent.php` | `portfolio_content_sections` table |
| `app/Services/AnalyticsSummaryService.php` | Shared analytics (masked public / raw admin) |
| `app/Models/OutreachJob.php` | Eloquent on existing `outreach_jobs` table |
| `app/Support/ApiResponse.php` | Envelope helpers |
| `app/Services/AnalyticsExclusion.php` | IP hash salt `:carlxaeron-portfolio` |
| `app/Services/PortfolioMailer.php` | Contact / quotation mail |
| `app/Services/PushNotificationService.php` | Web Push subscribe/send (VAPID) |
| `app/Services/PreviewFeedbackAutoReply.php` | Like/dislike prospect auto-reply (email from outreach job or `contactEmail`) |
| `app/Services/PreviewFeedbackEmailBuilder.php` | Auto-reply HTML/text bodies |
| `app/Support/BrowserOriginGate.php` | Origin/Referer allowlist (mirrors hosting-php) |
| `app/Http/Controllers/Api/AdminPushController.php` | Admin push subscribe/test routes |
| `app/Models/PushSubscription.php` | `push_subscriptions` table |
| `config/portfolio.php` | `MAIL_TO`, exclusions, `CLIENT_SITES_COUNT`, VAPID keys |
| `database/migrations/*_create_portfolio_api_tables.php` | Creates tables only if missing |

## Env

Never commit `.env`. Prefer Laravel names; legacy keys still work via config fallbacks:

| Laravel | Legacy fallback |
|---------|-----------------|
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | `DB_NAME` / `DB_USER` / `DB_PASS` |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_SCHEME=smtps` | `SMTP_*` + `SMTP_ENCRYPTION=ssl` (Private Email: `mail.privateemail.com:465`) |
| `MAIL_FROM_ADDRESS` | `DEFAULT_FROM` |
| `MAIL_FROM_NAME` / — | `DEFAULT_FROM_NAME` / `MAIL_FROM_NAME` (hosting-php: display name, default `Carl Louis Manuel`) |
| `MAIL_TO` | (same) — inbound contact/quote recipients |
| `MAIL_BCC` | BCC on **outbound** client outreach (`info@carlmanuel.com` by default) |
| `OUTREACH_SECRET` | `POST /outreachSchedule` + `/outreachPause` (body `secret` or `X-Outreach-Secret` header) |
| `ANALYTICS_EXCLUDE_IP_HASHES` / `ANALYTICS_EXCLUDE_VISITOR_IDS` | (same) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Sanctum admin seeder (server only) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Web Push (generate once; server only). Subject e.g. `mailto:info@carlmanuel.com` |
| `PUSH_PREVIEW_VIEW_THROTTLE_MINUTES` | Admin push dedupe for `preview_view` (default **30**) |

**Generate VAPID keys (once per environment):**

```bash
cd api-carlxaeron
npx web-push generate-vapid-keys
# or:
php -r "require 'vendor/autoload.php'; print_r(Minishlink\\WebPush\\VAPID::createVapidKeys());"
```

Copy `publicKey` → `VAPID_PUBLIC_KEY`, `privateKey` → `VAPID_PRIVATE_KEY`. After deploy: `php artisan migrate --force` then `php artisan config:cache`.

### Deliverability (outreach / Private Email)

- **SPF + DKIM:** Private Email for `carlmanuel.com` (already on domain).
- **DMARC:** TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:info@carlmanuel.com; fo=1` (Namecheap Advanced DNS; skill `namecheap-browser`).
- **hosting-php `mail.php`:** From `"Name" <email>`, bare envelope `MAIL FROM`, `Message-ID`, `List-Unsubscribe` mailto — deploy with unit tests before upload.

## Local

```bash
cd api-carlxaeron
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate
php artisan test
php artisan serve --port=8080
```

## Deploy (Stellar)

1. Rsync/sync app root to `~/public_html/api-carlxaeron/` (keep server `.env`; exclude local `.env`).
2. **Required `.env` DB keys for Laravel:** `DB_CONNECTION=mysql`, `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` (legacy `DB_NAME` / `DB_USER` / `DB_PASS` still work for the mysql connection array). Missing `DB_CONNECTION` defaults to sqlite and analytics will look empty.
3. Subdomain docroot → `…/public` only.
4. On server: `composer install --no-dev`, `php artisan migrate --force`, `php artisan db:seed --class=Database\\Seeders\\AdminSeeder --force` (needs `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`; seeder reads via `config/portfolio.php`), set `VAPID_*` keys, `php artisan config:cache`. **Web Push:** `minishlink/web-push` pulls `web-token/jwt-library` — never rsync a partial `vendor/` tree; if push test 500s with missing `JWK.php`, run `rm -rf vendor/web-token/jwt-library && composer install --no-dev` on Stellar (Composer may not be on PATH — download to `/tmp/composer` first).
5. Writable: `storage/`, `bootstrap/cache/`.
6. Smoke: `curl https://api.carlmanuel.com/health` + `POST /admin/login`.

Details: [`api-carlxaeron/README.md`](../../../api-carlxaeron/README.md).

## Tests

**Add tests with every API change.** New routes, CMS sections, admin ops, or contract tweaks need Feature/Unit tests in `api-carlxaeron/tests/` in the same commit.

```bash
# Laravel — required before any Laravel deploy
cd api-carlxaeron && php artisan test

# Hosting-php outreach + mail helpers — required before Stellar upload when hosting-php changed
php api-carlxaeron/hosting-php/tests/run-unit.php
```

Unit: `ApiResponse`, `AnalyticsExclusion`, `PortfolioMailer`, **`hosting-php/tests/run-unit.php`** (outreach cadence + `mail_*` + CORS + browser origin gate + `mask_client_slug` + rate limit).  
Feature: full endpoint contracts + admin auth/CMS/outreach + exclusion / dedupe / mail.

**Deploy gate:** never upload `hosting-php/src/outreach.php` (or cron scripts) if outreach unit tests fail. Never deploy Laravel without `php artisan test` green. Do not ship admin/API behavior without matching tests.

## Do not

- Change JSON contracts without updating `src/mapping.js` consumers and tests
- Point apex `carlmanuel.com` nameservers at hosting (GitHub Pages only)
- Commit `.env` / secrets
- Deploy `api-carlxaeron-legacy-php/`
- Change outreach cadence/max without updating and passing `hosting-php/tests/run-unit.php`
- Point Stellar crontab at `api-carlxaeron/scripts/cron-outreach-followups.php` — use `hosting-php/scripts/` only
