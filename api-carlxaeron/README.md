# api-carlxaeron

Laravel 12 API for [carlmanuel.com](https://carlmanuel.com) (visits, preview feedback, analytics summary, contact, quotation).

**Production base:** `https://api.carlmanuel.com` (Namecheap Stellar · docroot `public_html/api-carlxaeron/public`)  
**Interim twin:** `https://api-carlmanuel.tahanan.org` (same folder; keep for fallback)

Same JSON contracts as the previous custom PHP app and Firebase (`status` 200/400).

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Liveness (`service: api-carlxaeron`) |
| POST | `/trackVisit` | Analytics |
| POST | `/previewFeedback` | Like / dislike |
| GET | `/analyticsSummary` | Insights panel |
| POST | `/contact` | Form + SMTP |
| POST | `/quotation` | Form + SMTP |

Laravel’s built-in `GET /up` health check also exists (framework default).

## Local

```bash
cd api-carlxaeron
cp .env.example .env   # set APP_KEY, DB_*, MAIL_*
composer install
php artisan key:generate
php artisan migrate
php artisan test
php artisan serve --port=8080
# curl http://127.0.0.1:8080/health
```

## Tests

```bash
cd api-carlxaeron && php artisan test
```

Unit: `ApiResponse`, `AnalyticsExclusion`, `PortfolioMailer`.  
Feature: endpoint contracts (health, visits, feedback, contact, quotation, analytics).

## Shared hosting layout

```text
public_html/api-carlxaeron/     # Laravel app root (composer vendor, app/, .env)
  public/                       # ← subdomain document root only
  app/
  bootstrap/
  config/
  database/
  routes/
  storage/
  vendor/
  .env
```

Deploy notes:

1. Sync the Laravel tree to `~/public_html/api-carlxaeron/` (exclude `node_modules`, keep `vendor` or run `composer install --no-dev` on the server).
2. Document root for `api.carlmanuel.com` → `public_html/api-carlxaeron/public`.
3. Merge server secrets into `.env` (never commit). Existing legacy keys `DB_NAME` / `DB_USER` / `DB_PASS` / `SMTP_*` / `DEFAULT_FROM` still work via config fallbacks.
4. `php artisan migrate --force` (skips creating portfolio tables if they already exist).
5. `php artisan config:cache` after env changes.
6. Ensure `storage/` and `bootstrap/cache/` are writable.
7. DNS / SSL unchanged — see `scripts/issue-ssl.sh` and hosting-ssh skill.

```bash
# Example sync (adjust excludes for your machine)
rsync -avz -e 'ssh -i Hosting-SSH-MCP-Server/.ssh/tahanan_mcp -p 21098' \
  --exclude .env --exclude node_modules --exclude .git \
  api-carlxaeron/ \
  carlxaeron@server402.web-hosting.com:~/public_html/api-carlxaeron/
```

## Important

- Apex `carlmanuel.com` must stay on **GitHub Pages DNS**.
- Never commit `api-carlxaeron/.env`.
- Leave on Firebase for now: **assistant**, **license**, **weeklyVisitReport**.
- Legacy custom PHP backup: `api-carlxaeron-legacy-php/` (local only; do not deploy).

## Related

- Skill: `.cursor/skills/hosting-ssh/SKILL.md`
- Portfolio mapping: `src/mapping.js` → `https://api.carlmanuel.com/...`
