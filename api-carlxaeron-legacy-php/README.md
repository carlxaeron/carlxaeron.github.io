# api-carlxaeron

Self-hosted PHP + MySQL API for [carlmanuel.com](https://carlmanuel.com) (visits, preview feedback, analytics summary, contact, quotation).

**Production base:** `https://api.carlmanuel.com` (Namecheap Stellar · docroot `public_html/api-carlxaeron/public`)  
**Interim twin:** `https://api-carlmanuel.tahanan.org` (same folder; keep for fallback)

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Liveness |
| POST | `/trackVisit` | Analytics |
| POST | `/previewFeedback` | Like / dislike |
| GET | `/analyticsSummary` | Insights panel |
| POST | `/contact` | Form + SMTP |
| POST | `/quotation` | Form + SMTP |

Response shape matches Firebase `sendSuccess` / `sendError` (`status` 200/400).

## Local layout

```text
api-carlxaeron/
  public/           # subdomain document root
  src/              # bootstrap, cors, db, mail, analytics
  routes/handlers.php
  sql/schema.sql
  .env.example
  scripts/issue-ssl.sh
```

## Deploy (hosting-ssh)

1. Sync files to `~/public_html/api-carlxaeron/`
2. Keep server `.env` (DB + SMTP + analytics exclude hashes) — never commit
3. Subdomain / addon document root → `public_html/api-carlxaeron/public`
4. DNS: Namecheap Advanced DNS for `carlmanuel.com` — **A** `api` → `162.213.253.122`
5. SSL: `scripts/issue-ssl.sh api.carlmanuel.com` then deploy hook `cpanel_uapi` (or AutoSSL)
6. Addon note: `carlmanuel.com` is an addon on Stellar (DCV TXT); `api` is a subdomain of that addon → docroot `public_html/api-carlxaeron/public`

```bash
# From laptop (key auth)
scp -i Hosting-SSH-MCP-Server/.ssh/tahanan_mcp -P 21098 -r api-carlxaeron/{public,src,routes,sql} \
  carlxaeron@server402.web-hosting.com:~/public_html/api-carlxaeron/
```

## Important

- Apex `carlmanuel.com` must stay on **GitHub Pages DNS** (do not point domain nameservers to `dns1/dns2.namecheaphosting.com`). The apex addon on Stellar exists only so `api` can be a vhost.
- Never commit `api-carlxaeron/.env` (DB / SMTP / analytics exclude hashes).
- Leave on Firebase for now: **assistant**, **license**, **weeklyVisitReport**.

## Related

- Skill: `.cursor/skills/hosting-ssh/SKILL.md`
- DNS edits: `.cursor/skills/namecheap-browser/SKILL.md`
- Legacy Firebase endpoints: `.cursor/skills/firebase-backend/SKILL.md`
