---
name: client-site-netlify
description: Scaffold, build, and deploy local-business quotation websites under client-sites/ to Netlify, register portfolio preview URLs, draft email/SMS/messenger quotations, and share carlmanuel.com/?preview= links. Use when the user asks to create a client website, business landing page, Netlify deploy, quotation demo, sales outreach drafts, or portfolio device preview for a prospect.
---

# Client site + Netlify deploy

**Preview URL format:** `https://carlmanuel.com/?preview={slug}` (e.g. `?preview=jk-construction`)  
**Helper:** `buildPreviewPortfolioUrl(slug)` in [`previewWhitelist.js`](../../src/v3/config/previewWhitelist.js)  
**Legacy:** full `*.netlify.app` hostnames in `?preview=` still resolve but the URL bar is normalized to the slug.  
**Whitelist:** [src/v3/config/previewWhitelist.js](../../src/v3/config/previewWhitelist.js)  
**Tests:** [previewWhitelist.test.js](../../src/v3/config/previewWhitelist.test.js), PreviewShowcase + Index preview routing tests  
**Site catalog:** [client-sites/README.md](../../client-sites/README.md) — list of all clients, preview links, contact, packages  
**Template:** [client-sites/_template/](../../client-sites/_template/)

## Prerequisites

- Netlify MCP in Cursor (see [.cursor/MCP.md](../../MCP.md))
- Node.js 22+ for `@netlify/mcp`
- Netlify account authenticated on first MCP use

## Workflow checklist

```
Client site progress:
- [ ] Brief gathered via Chrome DevTools MCP (Facebook About + Photos; assets inspected and downloaded)
- [ ] Folder scaffolded from _template
- [ ] Site content + styles customized
- [ ] Deployed to Netlify (capture previewHost)
- [ ] client.json updated (contact + quotation fields)
- [ ] Draft outreach written (email, SMS, messenger)
- [ ] PREVIEW_SITES entry added
- [ ] client-sites/README.md catalog updated (table + detail section)
- [ ] Preview slug tests pass (`previewWhitelist.test.js`)
- [ ] Portfolio preview link + drafts shared with user for review
```

## Step 1 — Scaffold

```bash
cp -R client-sites/_template client-sites/{slug}
```

Edit `client.json`: `businessName`, `slug`, `industry`, `contact`, `quotation` (package, amount, timeline).

## Step 1b — Gather brief from Facebook (Chrome DevTools MCP)

`WebFetch` and web search often **fail or time out** on Facebook. Use the **Chrome DevTools MCP** (`user-chrome-devtools`) instead:

1. `new_page` → client Facebook URL (profile or page link from user).
2. Dismiss login modal if shown (`take_snapshot` → click **Close**).
3. Scrape from **Posts** intro: tagline, phone, services, follower count.
4. Open **About** tab: full address, email, hours, category, review score.
5. Open **Photos** tab — **inspect** then **download** images (see below).
6. Open cover photo for hero — same download workflow → `hero-*.jpg`.
7. Record canonical Facebook URL + scraped fields in `client.json` → `sources` and `contact`.

### Facebook photos — inspect, then download (not screenshots)

**Do not** use `take_screenshot` for client `assets/` — viewport crops are lower quality and may clip UI chrome. **Do** download full JPEG bytes from the browser session.

| Step | MCP tool | Purpose |
|------|----------|---------|
| Inspect | `evaluate_script` | List `<img>` nodes: `src`, `naturalWidth`, `naturalHeight`, `alt` |
| Pick | (judgment) | One image per unique FB asset; prefer largest resolution; skip junk alts (phone screenshots, “Galaxy S25”, unrelated memes) |
| Map | `list_network_requests` | `resourceTypes: ["image"]` — match `fbcdn.net` URLs to chosen images |
| Download | `get_network_request` | `reqid` + `responseFilePath` → saves full response body (e.g. 2000×1414 JPEG) |
| Verify | shell `file` | Confirm `JPEG image data` and expected dimensions before commit |
| Rename | move into `assets/` | `hero-*.jpg`, `project-01.jpg` … `project-04.jpg` |

Example inspect script (Photos tab, after images load):

```js
() => [...document.querySelectorAll('img[src*="fbcdn"]')]
  .map((img, i) => ({
    i,
    w: img.naturalWidth,
    h: img.naturalHeight,
    alt: (img.alt || '').slice(0, 80),
    src: img.src.split('?')[0].slice(-40),
  }))
  .filter((x) => x.w >= 400)
  .sort((a, b) => b.w * b.h - a.w * a.h)
```

After `get_network_request`, rename `.network-response` to `.jpg` (or save with a `.jpg` path if the tool allows). Commit assets to the repo — **never** hotlink live `fbcdn.net` URLs in HTML.

**Do not** use `curl` against `fbcdn.net` outside the browser — CDN returns 403 without session cookies. Canvas/`fetch` in-page also fail (CORS / tainted canvas).

Fallback only if browser unavailable: stock photos + note in `client.json` → `sources.notes`.

## Step 2 — Build site

- **Tailwind-first** static HTML — load via CDN (`https://cdn.tailwindcss.com`) with per-client `tailwind.config` inline for brand colors.
- **`assets/`** — logo, hero, and 3–6 gallery JPGs from Facebook (Chrome DevTools MCP: inspect + `get_network_request` download); never ship emoji-only galleries when FB photos are available.
- **Supplemental `styles.css`** only for hero backgrounds, scroll-reveal, and effects Tailwind cannot express cleanly.
- **Interactive `site.js`** (copy from `_template/site.js`) — required on every client site:
  - Mobile hamburger nav (`data-nav-toggle`, `data-mobile-nav`)
  - Sticky header shadow on scroll (`data-header`)
  - Smooth anchor scroll
  - Scroll-reveal animations (`data-reveal`)
  - FAQ accordions (`data-accordion`)
  - Optional tabs (`data-tabs` / `data-tab`) or filters (`data-filter` / `data-filter-btn`)
- Mobile-first; default brand palette from V3 greens (`#00473e`, `#00A862`) unless client has brand colors.
- One-page layout: hero, services, about, FAQ, contact.
- `netlify.toml`: `publish = "."`, `command = ""` (static site — do not run portfolio CRA build).
- **Do not remove** template security files:
  - `embed-guard.js` — client-side iframe + referrer check
  - `netlify/edge-functions/embed-only.js` — server-side 403 on direct access
  - CSP `frame-ancestors` in `netlify.toml` — only portfolio domains may embed
- Load guard in `<head>` before body: `<script src="embed-guard.js"></script>`
- Load interactivity at end of `<body>`: `<script src="site.js"></script>`

### Tailwind + interactive stack

| File | Role |
|------|------|
| `index.html` | Mostly Tailwind utility classes; brand tokens in inline `tailwind.config` |
| `styles.css` | Hero bg images, `[data-reveal]`, header scroll — not full layout |
| `site.js` | Mobile nav, accordions, tabs, filters, scroll reveal |

Do **not** add a CRA/webpack build to client folders — Tailwind CDN keeps deploys zero-config on Netlify.

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

Use `buildPreviewPortfolioUrl("slug")` for outreach `previewUrl` values.

3. Share: `https://carlmanuel.com/?preview={slug}` (use `client.json` → `slug`, not the Netlify hostname)

4. **Update the site catalog:** add a row and detail section in [`client-sites/README.md`](../../client-sites/README.md) (preview link, contact, package, sources, outreach paths).

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

**Preview URL:** `https://carlmanuel.com/?preview={slug}`

Applies to **every** whitelisted client site via shared `PreviewShowcase` (not per-client):

| Mockup | Viewport | Behavior |
|--------|----------|----------|
| Desktop monitor | 1280×800 | Scaled down to fit bezel — true desktop layout on phone |
| Phone frame | 390×844 | Scaled down slightly to fit phone chrome — true mobile layout (hamburger, stacked sections) |

Both use absolute-positioned iframe scalers so layout does not overlap on narrow screens.

```
Browser QA checklist:
- [ ] Preview page loads (title, hostname, Back to portfolio)
- [ ] Desktop mockup: site visible, header/hero readable, iframe scrolls
- [ ] Scroll hints visible (intro + per-device); native `title` on hover for screen areas
- [ ] **Desktop on phone** — monitor shows full 1280px layout scaled down (not mobile breakpoints)
- [ ] **Mobile mockup** — phone shows 390px mobile layout (short logo, hamburger) scaled to fit frame
- [ ] Mobile mockup: logo not cramped, CTA visible, iframe scrolls
- [ ] **Mobile page scroll** — preview page scrolls past desktop mockup to mobile section (desktop iframe ignores touch on mobile so page scroll works)
- [ ] **No overlap on mobile** — desktop monitor and phone mockup must not overlap (40px+ gap); desktop iframe uses absolute scaler so 1280px layout does not bleed into phone section
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

**Fix loop:** if mobile header/hero breaks in the phone mockup (~256px inner width), tighten Tailwind responsive classes (`sm:`, `md:`) and `styles.css`, redeploy Netlify, re-check preview.

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
