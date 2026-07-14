---
name: namecheap-browser
description: Manage Namecheap domains and DNS via the Namecheap web dashboard using Chrome DevTools MCP when Namecheap API access is unavailable. Use when the user asks about Namecheap DNS, domain records, nameservers, A/CNAME/TXT edits, API qualification failure, or domain pointing (e.g. carlmanuel.com, GitHub Pages, Netlify).
---

# Namecheap via browser (no API)

Namecheap API requires account balance / domain / purchase thresholds. When API is locked, use the **Chrome DevTools MCP** (`user-chrome-devtools`) against the logged-in Namecheap dashboard.

**Do not** rely on `Namecheap-MCP-Server` until API Access is enabled.

## Prerequisites

- User can log into Namecheap in the Chrome DevTools browser (or already is)
- Chrome DevTools MCP available

## Workflow checklist

```
Namecheap browser DNS:
- [ ] Open Domain List (login if prompted — user completes 2FA)
- [ ] Open target domain → Advanced DNS (or Domain → Manage → Advanced DNS)
- [ ] Snapshot current records before any change
- [ ] Apply requested A / AAAA / CNAME / TXT / MX edits
- [ ] Confirm save; re-snapshot
- [ ] Optional: dig/nslookup verify after TTL
```

## Step 1 — Open account domains

1. `new_page` or `navigate_page` → `https://ap.www.namecheap.com/domains/list/`
2. If login wall: tell the user to complete login/2FA in that browser tab, then `take_snapshot` again
3. Find the domain row (e.g. `carlmanuel.com`) → open **Manage**

## Step 2 — Advanced DNS

Typical path after Manage:

- `Domain` → **Advanced DNS**
- Or URL pattern: `https://ap.www.namecheap.com/Domains/DomainControlPanel/{domain}/advancedns`

`take_snapshot` and list Host Records (Type, Host, Value, TTL).

**Before edits:** copy the current set into the chat (so the user can undo).

## Step 3 — Edit records

Use DevTools interactions (`click`, `fill`, `take_snapshot` loops):

| Change | Typical UI |
|--------|------------|
| Add record | **Add New Record** → choose type → Host + Value → Save |
| Edit | Pencil / edit on row → update → Save / checkmark |
| Delete | Trash on row → confirm |

### Common recipes (portfolio / clients)

**GitHub Pages (`carlmanuel.com`):**

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `{user}.github.io.` |

(Confirm current GitHub Pages IPs in GitHub docs if unsure.)

**Netlify custom domain for a client site:**

| Type | Host | Value |
|------|------|-------|
| CNAME or ALIAS | `@` or subdomain | Netlify hostname from Netlify UI (e.g. `something.netlify.app`) |

Prefer Netlify’s Domain management → “Verify DNS configuration” values when available.

**TXT** (verification / SPF): paste exact string Namecheap / Netlify / Google provides — no spaces truncation.

**Portfolio API subdomain (`api.carlmanuel.com`):**

| Type | Host | Value |
|------|------|-------|
| A | `api` | Namecheap Stellar hosting IP (e.g. `162.213.253.122`) |

On Stellar: add **`carlmanuel.com` as addon** (DNS TXT `_simpledcver` DCV if BasicDNS stays on GitHub Pages — do **not** switch apex nameservers), then create subdomain **`api`** → docroot `public_html/api-carlxaeron/public`. Issue LE SSL via `api-carlxaeron/scripts/issue-ssl.sh` + `cpanel_uapi` deploy. Skill: `hosting-ssh`.

## Step 4 — Nameservers (only if asked)

**Domain** → **Nameservers**:

- Namecheap BasicDNS / PremiumDNS
- Custom DNS (e.g. Cloudflare `*.ns.cloudflare.com`)

Moving to Cloudflare unlocks Cloudflare’s free API later — only change NS if the user explicitly wants that.

## Step 5 — Verify

```bash
dig +short {domain} A
dig +short www.{domain} CNAME
dig +short {domain} NS
```

Allow TTL (often 5–30 minutes; can be hours).

## Hard rules

- Never delete all Host Records without an explicit undo plan
- Never register / renew / transfer / change Whois without user approval
- Never store Namecheap password in repo or `.env`
- If 2FA / captcha blocks automation: stop and hand the tab to the user
- Prefer smallest change set (one record at a time)

## API path (optional later)

If the account later qualifies for API Access:

1. Enable API + whitelist IP
2. Fill `Namecheap-MCP-Server/.env`
3. Use MCP server `namecheap` from `.cursor/mcp.json`

Until then, **this browser skill is the supported path**.
