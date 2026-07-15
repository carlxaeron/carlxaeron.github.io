---
name: api-carlxaeron
description: Laravel 12 portfolio API on Namecheap (api.carlmanuel.com) — contact, quotation, visits, preview feedback, analytics. Use when changing api-carlxaeron, deploying the hosting API, SMTP/MySQL for forms, or Firebase-compatible response contracts.
---

# api-carlxaeron (Laravel 12)

**Live:** `https://api.carlmanuel.com`  
**Repo:** [`api-carlxaeron/`](../../../api-carlxaeron/)  
**Hosting:** Namecheap Stellar · docroot `public_html/api-carlxaeron/public`  
**Deploy MCP:** skill **hosting-ssh**  
**Legacy backup:** `api-carlxaeron-legacy-php/` (do not deploy)

Portfolio frontend URLs: [`src/mapping.js`](../../../src/mapping.js) → `https://api.carlmanuel.com/...`

Still on Firebase (skill **firebase-backend**): assistant, license, weeklyVisitReport.

## Endpoints (unprefixed — not `/api/...`)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | `{ ok, service: "api-carlxaeron" }` |
| POST | `/trackVisit` | Analytics |
| POST | `/previewFeedback` | Like / dislike |
| GET | `/analyticsSummary` | Insights panel |
| POST | `/contact` | Form + SMTP |
| POST | `/quotation` | Form + SMTP |
| POST | `/outreachSchedule` | **Secret** — after user yes: send initial + queue auto follow-ups (`autoFollowUp: true`, cadence `3d1w` = **3d→7d→7d→7d**, `maxFollowUps: 4`) |
| POST | `/outreachPause` | **Secret** — stop auto follow-ups for a slug |

Live hosting (until full Laravel cutover) uses PHP under `hosting-php/` synced to Stellar. Daily cron: `scripts/cron-outreach-followups.php`. Cursor rule: yes-to-send enables follow-ups automatically (no second cadence ask).

**Before deploying `hosting-php` outreach changes**, run:

```bash
php api-carlxaeron/hosting-php/tests/run-unit.php
```

Must pass (exit 0). See rule **test-before-deploy**.

Response shape (Firebase-compatible):

- Success: `{ status: 200, message, data }`
- Error: `{ status: 400, message, data, errCode: "" }` (HTTP usually 400)

CORS origins: `carlmanuel.com`, `www`, `carlxaeron.github.io`, `localhost:3000` — see `config/cors.php`.

## Key code

| Path | Role |
|------|------|
| `routes/api.php` | Route table (`apiPrefix: ''` in `bootstrap/app.php`) |
| `app/Http/Controllers/Api/PortfolioApiController.php` | Handlers |
| `app/Support/ApiResponse.php` | Envelope helpers |
| `app/Services/AnalyticsExclusion.php` | IP hash salt `:carlxaeron-portfolio` |
| `app/Services/PortfolioMailer.php` | Contact / quotation mail |
| `config/portfolio.php` | `MAIL_TO`, exclusions, `CLIENT_SITES_COUNT` |
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
| `MAIL_BCC` | BCC on **outbound** client outreach (`info@carlmanuel.com` by default; hidden from To) |
| `ANALYTICS_EXCLUDE_IP_HASHES` / `ANALYTICS_EXCLUDE_VISITOR_IDS` | (same) |

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
2. Subdomain docroot → `…/public` only.
3. On server: `composer install --no-dev`, `php artisan migrate --force`, `php artisan config:cache`.
4. Writable: `storage/`, `bootstrap/cache/`.
5. Smoke: `curl https://api.carlmanuel.com/health`.

Details: [`api-carlxaeron/README.md`](../../../api-carlxaeron/README.md).

## Tests

```bash
# Laravel
cd api-carlxaeron && php artisan test

# Hosting-php outreach + mail helpers — required before Stellar upload
php api-carlxaeron/hosting-php/tests/run-unit.php
```

Unit: `ApiResponse`, `AnalyticsExclusion`, `PortfolioMailer`, **`hosting-php/tests/run-unit.php`** (outreach cadence + `mail_*` helpers).  
Feature: full endpoint contracts + exclusion / dedupe / mail.

**Deploy gate:** never upload `hosting-php/src/outreach.php` (or cron scripts) if outreach unit tests fail. Never deploy Laravel without `php artisan test` green.

## Do not

- Change JSON contracts without updating `src/mapping.js` consumers and tests
- Point apex `carlmanuel.com` nameservers at hosting (GitHub Pages only)
- Commit `.env` / secrets
- Deploy `api-carlxaeron-legacy-php/`
- Change outreach cadence/max without updating and passing `hosting-php/tests/run-unit.php`
