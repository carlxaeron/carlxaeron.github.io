---
name: client-site-netlify
description: Scaffold, build, and deploy local-business quotation websites under client-sites/ to Netlify, register portfolio preview URLs, draft email/SMS/messenger quotations, and share carlmanuel.com/?preview= links. Use when the user asks to create a client website, business landing page, Netlify deploy, quotation demo, sales outreach drafts, or portfolio device preview for a prospect.
---

# Client site + Netlify deploy

**Preview URL format:** `https://carlmanuel.com/?preview={host}`  
**Whitelist:** [src/v3/config/previewWhitelist.js](../../src/v3/config/previewWhitelist.js)  
**Template:** [client-sites/_template/](../../client-sites/_template/)

## Prerequisites

- Netlify MCP in Cursor (see [.cursor/MCP.md](../../MCP.md))
- Node.js 22+ for `@netlify/mcp`
- Netlify account authenticated on first MCP use

## Workflow checklist

```
Client site progress:
- [ ] Brief gathered (business, contact, services, CTA, location, colors, budget)
- [ ] Folder scaffolded from _template
- [ ] Site content + styles customized
- [ ] Deployed to Netlify (capture previewHost)
- [ ] client.json updated (contact + quotation fields)
- [ ] Draft outreach written (email, SMS, messenger)
- [ ] PREVIEW_SITES entry added
- [ ] Portfolio preview link + drafts shared with user for review
```

## Step 1 — Scaffold

```bash
cp -R client-sites/_template client-sites/{slug}
```

Edit `client.json`: `businessName`, `slug`, `industry`, `contact`, `quotation` (package, amount, timeline).

## Step 2 — Build site

- Keep **static HTML + CSS** unless client needs a framework.
- Mobile-first; match quality bar from V3 greens (`#00473e`, `#00A862`).
- One-page layout: hero, services, about, contact.
- `netlify.toml`: `publish = "."`, `command = ""` (static site — do not run portfolio CRA build).
- **Do not remove** template security files:
  - `embed-guard.js` — client-side iframe + referrer check
  - `netlify/edge-functions/embed-only.js` — server-side 403 on direct access
  - CSP `frame-ancestors` in `netlify.toml` — only portfolio domains may embed
- Load guard in `<head>` before body: `<script src="embed-guard.js"></script>`

### Embed-only security (required)

Client demos are **not** meant to be browsed directly. They only render inside the portfolio preview iframes.

| Layer | File | Behavior |
|-------|------|----------|
| Edge | `netlify/edge-functions/embed-only.js` | 403 for direct document loads; allows `Sec-Fetch-Dest: iframe` or portfolio referer |
| Client | `embed-guard.js` | Replaces page if not in iframe or referrer not from allowed portfolio hosts |
| Headers | `netlify.toml` | `frame-ancestors` limits who can embed the site |

Allowed portfolio hosts: `carlmanuel.com`, `www.carlmanuel.com`, `carlxaeron.github.io`, `localhost`.

After deploy, verify:

```bash
# Direct access → 403
curl -sI https://{previewHost} | head -1

# Iframe simulation → 200
curl -sI -H "Sec-Fetch-Dest: iframe" -H "Referer: https://carlmanuel.com/?preview={previewHost}" "https://{previewHost}" | head -1
```

## Step 3 — Deploy (Netlify MCP or CLI)

**MCP (preferred in Cursor):** create/link site, deploy `client-sites/{slug}/`, note production hostname.

**CLI fallback:**

```bash
cd client-sites/{slug}
npx netlify deploy --prod --site {site-id}
```

Record hostname (e.g. `bamboo-grove-cafe.netlify.app`).

## Step 4 — Register portfolio preview

1. Update `client-sites/{slug}/client.json` → `previewHost`, `deployedAt`.
2. Add to `PREVIEW_SITES` in `src/v3/config/previewWhitelist.js`:

```js
{ id: "slug", host: "slug.netlify.app", label: "Business Name", netlifySite: "slug" }
```

3. Share: `https://carlmanuel.com/?preview={previewHost}`

**Preview UI:** `PreviewShowcase` shows desktop + mobile mockups only — there is **no “Open live site”** link (client URLs are embed-only by design).

## Step 5 — Draft outreach quotations (required)

After the site is built and `previewUrl` is known, customize the three draft files in `client-sites/{slug}/`:

| File | Channel | Notes |
|------|---------|-------|
| `quotation-email.md` | Email | Subject line + full proposal with package table |
| `quotation-sms.txt` | SMS | Short; aim for one text (~300 chars) |
| `quotation-messenger.txt` | Messenger / Viber / Telegram | Friendly tone; preview link + package summary |

**Template placeholders** (replace in all three): `{{contactName}}`, `{{businessName}}`, `{{previewUrl}}`, `{{packageName}}`, `{{packageScope}}`, `{{quotedAmount}}`, `{{paymentTerms}}`, `{{timeline}}`, `{{industry}}`.

**Tone:** professional, warm, Philippine business context (₱, salamat OK in messenger). Sign off as **Carl Louis Manuel** with carlmanuel.com and info@carlmanuel.com.

**Workflow:**

1. Fill `client.json` → `contact` and `quotation` blocks first.
2. Copy values from `client.json` into the three draft files (replace placeholders).
3. Present all drafts to the user for review — **do not send** without explicit approval.
4. Use fictitious contact details only for portfolio demos (see `quotation/` sample).

**SMS length:** keep under ~320 characters when possible; shorten package line if needed.

## Step 6 — Portfolio release (if preview UI changed)

Follow [deploy-portfolio/SKILL.md](../deploy-portfolio/SKILL.md) — bump version, CHANGELOG, push.

## Step 7 — Post-deploy browser QA (required)

After Netlify deploy **and** portfolio push (if whitelist changed), verify UI in a real browser before sharing outreach drafts.

**Preview URL:** `https://carlmanuel.com/?preview={previewHost}`

```
Browser QA checklist:
- [ ] Preview page loads (title, hostname, Back to portfolio)
- [ ] Desktop mockup: site visible, header/hero readable, iframe scrolls
- [ ] Mobile mockup: logo not cramped, CTA visible, iframe scrolls
- [ ] **Mobile page scroll** — preview page scrolls past desktop mockup to mobile section (desktop iframe ignores touch on mobile so page scroll works)
- [ ] Direct URL returns 403 (embed-only)
- [ ] No broken images or layout overflow at ~256px (phone iframe width)
```

**How to verify:**

1. Open the portfolio preview link in Chrome (or Chrome DevTools MCP / browser screenshot).
2. Scroll inside desktop and mobile iframes — confirm products, contact, footer render.
3. Resize or emulate mobile (~390px) on the preview page — devices stack vertically.
4. Optional CLI checks:

```bash
curl -sI "https://{previewHost}" | head -1                    # expect 403
curl -sI -H "Sec-Fetch-Dest: iframe" \
  -H "Referer: https://carlmanuel.com/?preview={previewHost}" \
  "https://{previewHost}" | head -1                           # expect 200
```

**Fix loop:** if mobile header/hero breaks in the phone mockup (~256px inner width), tighten `styles.css` (`@media max-width: 480px`), redeploy Netlify, re-check preview.

**Do not commit:** `.qa/` screenshots or local `qa-iframe.html` — dev-only.

## Rules

- Whitelist-only preview hosts (no arbitrary domains).
- Keep `embed-guard.js` + edge `embed-only` on every client folder — do not ship browsable public demos.
- No secrets in `client-sites/` — use Netlify env for forms later.
- Demo copy OK; mark fictitious businesses and contacts clearly.
- Draft email/SMS/messenger for every client site — user reviews before any send.
- Do not add client sites to portfolio Side Projects without user approval.

## Rule reference

[.cursor/rules/client-quotations.mdc](../../rules/client-quotations.mdc)
