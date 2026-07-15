# Client sites (Netlify)

Static one-page business websites for **quotation / sales demos**. Each folder deploys to its own Netlify site and is showcased on the portfolio via device mockups (desktop + mobile).

**Portfolio preview (use this link with prospects):**

`https://carlmanuel.com/?preview={slug}`

Direct Netlify URLs return **403** (embed-only) — content loads only inside portfolio preview iframes.

---

## Site catalog

| Business | Slug | Industry | Preview link | Deployed |
|----------|------|----------|--------------|----------|
| [Bamboo Grove Café](#bamboo-grove-café-sample) *(sample)* | `quotation` | Café / local food | [Preview](https://carlmanuel.com/?preview=quotation) | 2026-07-10 |
| [Extra Rice 8 Trading, OPC](#extra-rice-8-trading-opc) | `extra-rice` | Rice wholesale & retail | [Preview](https://carlmanuel.com/?preview=extra-rice) | 2026-07-10 |
| [Ohana Business Solutions Inc](#ohana-business-solutions-inc) | `ohana` | Business consultancy | [Preview](https://carlmanuel.com/?preview=ohana) | 2026-07-10 |
| [Suyat Notary Public](#suyat-notary-public) | `suyat` | Notary / legal services | [Preview](https://carlmanuel.com/?preview=suyat) | 2026-07-10 |
| [RG Decals and Printing Shop](#rg-decals-and-printing-shop) | `rg-decals` | Printing / signs & decals | [Preview](https://carlmanuel.com/?preview=rg-decals) | 2026-07-10 |
| [Sonyoba Marketing](#sonyoba-marketing) | `sonyoba-marketing` | Office equipment | [Preview](https://carlmanuel.com/?preview=sonyoba-marketing) | 2026-07-13 |
| [JK Construction Services](#jk-construction-services) | `jk-construction` | Construction / renovation | [Preview](https://carlmanuel.com/?preview=jk-construction) | 2026-07-13 |
| [Machinemate Mainteneering Services](#machinemate-mainteneering-services) | `machinemate` | Industrial fans / ventilation | [Preview](https://carlmanuel.com/?preview=machinemate) | 2026-07-13 |
| [Jazz1 Airconditioning Services](#jazz1-airconditioning-services) | `jazz1-aircon` | Air conditioning / HVAC | [Preview](https://carlmanuel.com/?preview=jazz1-aircon) | 2026-07-13 |
| [Clover Industrial Fan and Blower Inc.](#clover-industrial-fan-and-blower-inc) | `clover-industrial-fan` | Industrial fans & blowers | [Preview](https://carlmanuel.com/?preview=clover-industrial-fan) | 2026-07-13 |
| [G3k Cad Plotting & Blueprinting Services](#g3k-cad-plotting--blueprinting-services) | `g3k-cad` | CAD plotting / blueprint printing | [Preview](https://carlmanuel.com/?preview=g3k-cad) | 2026-07-14 |
| [Kubling Tago Resort](#kubling-tago-resort) | `kubling-tago-resort` | Day resort / hospitality | [Preview](https://carlmanuel.com/?preview=kubling-tago-resort) | 2026-07-15 |
| [Regan Industrial Sales Inc.](#regan-industrial-sales-inc) | `regan-industrial` | Steel supplier / industrial metals | [Preview](https://carlmanuel.com/?preview=regan-industrial) | 2026-07-15 |
| [IntelliSmart Technology Inc.](#intellismart-technology-inc) | `intellismart` | System integration / AV / security / BMS | [Preview](https://carlmanuel.com/?preview=intellismart) | 2026-07-15 |

Whitelist source of truth: [`src/v3/config/previewWhitelist.js`](../src/v3/config/previewWhitelist.js) (`PREVIEW_SITES`).

---

## Per-client details

### Bamboo Grove Café *(sample)*

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/quotation/` |
| **Netlify site** | `bamboo-grove-cafe` |
| **Preview host** | `bamboo-grove-cafe.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=quotation |
| **Contact** | Maria Santos (fictitious) · maria.santos@example.com · +63 917 123 4567 |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

*Fictitious demo business for quotation template workflow. Hero uses **Motion** (Framer Motion family) via `hero-motion.js`.*

---

### Extra Rice 8 Trading, OPC

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/extra-rice/` |
| **Netlify site** | `extra-rice-trading` |
| **Preview host** | `extra-rice-trading.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=extra-rice |
| **Contact** | extraricetradingdmanuel@gmail.com · +63 967 582 0455 |
| **Location** | Rodriguez, Rizal (main + branch on E. Rodriguez Highway) |
| **Source** | [Facebook](https://www.facebook.com/p/Extra-Rice-8-Trading-OPC-100085354996870/) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Ohana Business Solutions Inc

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/ohana/` |
| **Netlify site** | `ohana-business-solutions` |
| **Preview host** | `ohana-business-solutions.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=ohana |
| **Contact** | ohanabusinessconsultancyinc@gmail.com |
| **Location** | Eastwood Greenview, San Isidro, Rodriguez, Rizal 1860 |
| **Source** | [Facebook](https://www.facebook.com/OhanaBusinessConsultancyInc/) · [Google Maps](https://www.google.com/maps/place/Ohana+Business+Solutions+Inc/@14.7301222,121.1375017,18z) |
| **Tagline** | Your family in doing business |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Suyat Notary Public

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/suyat/` |
| **Netlify site** | `suyat-notary-public` |
| **Preview host** | `suyat-notary-public.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=suyat |
| **Location** | JRS Building, Kanlaon St., San Jose, Rodriguez, Rizal |
| **Source** | [Facebook](https://www.facebook.com/suyatlawoffice/) · [Google Maps](https://www.google.com/maps/place/Suyat+Notary+Public/@14.7470042,121.1309309,17z) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### RG Decals and Printing Shop

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/rg-decals/` |
| **Netlify site** | `rg-decals-printing` |
| **Preview host** | `rg-decals-printing.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=rg-decals |
| **Contact** | rgdecals123@gmail.com · +63 995 456 7971 |
| **Location** | Metro Manila Hills, Rodriguez, Rizal |
| **Source** | [Facebook](https://www.facebook.com/p/RG-Decals-and-Printing-Shop-61576011299710/) · [Google Maps](https://www.google.com/maps/place/RG+Decals+and+Printing+Shop/@14.7557777,121.1330426,18z) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Sonyoba Marketing

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/sonyoba-marketing/` |
| **Netlify site** | `sonyoba-marketing` |
| **Preview host** | `sonyoba-marketing.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=sonyoba-marketing |
| **Contact** | (02) 8774-1525 · Viber (0915) 190-5949 / (0933) 260-4175 |
| **Source** | [sonyobamarketing.com](https://sonyobamarketing.com/) · [Facebook](https://www.facebook.com/sonyobamarketingph) |
| **Package** | Business Website Redesign · **₱18,000** · 7–10 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### JK Construction Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/jk-construction/` |
| **Netlify site** | `jk-construction-services` |
| **Preview host** | `jk-construction-services.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=jk-construction |
| **Contact** | jkconstructionservices@yahoo.com · +63 926 658 6754 |
| **Location** | Caloocan, Philippines 1422 |
| **Service area** | Metro Manila, Quezon City, Novaliches, Meycauayan, Caloocan, San Jose del Monte |
| **Source** | [Facebook](https://www.facebook.com/JKConstrSvcs/) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Machinemate Mainteneering Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/machinemate/` |
| **Netlify site** | `machinemate-engineering` |
| **Preview host** | `machinemate-engineering.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=machinemate |
| **Contact** | mms_fans@yahoo.com · +63 917 776 1418 |
| **Location** | Rodriguez, Philippines |
| **Source** | [Facebook](https://www.facebook.com/machinemate/) |
| **Products** | SS/MS centrifugal fans, axial fans, roof exhaust; export & maintenance engineering |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Jazz1 Airconditioning Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/jazz1-aircon/` |
| **Netlify site** | `jazz1-aircon-services` |
| **Preview host** | `jazz1-aircon-services.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=jazz1-aircon |
| **Contact** | jrairconditioningservices@gmail.com · +63 931 763 9752 |
| **Address** | No. 14 F. Rodriguez St. (Crossing), Brgy. San Jose, Rodriguez Rizal 1860 |
| **Tagline** | Your No.1 TRUSTED in Aircon Company |
| **Reviews** | 100% recommend (15 Reviews) · 12K followers · Always open |
| **Source** | [Facebook](https://www.facebook.com/people/Jazz1-Airconditioning-Services-Montalban-Rizal/100088680976545/) |
| **Assets** | Hero + 4 gallery JPGs downloaded via Chrome DevTools MCP (network response) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Clover Industrial Fan and Blower Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/clover-industrial-fan/` |
| **Netlify site** | `clover-industrial-fan` |
| **Preview host** | `clover-industrial-fan.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=clover-industrial-fan |
| **Contact** | cloverindustrial@gmail.com · +63 908 157 4707 |
| **Address** | 2181 L. Sumulong Memorial Circle, Antipolo, Philippines 1870 |
| **Service area** | Rizal, Philippines |
| **Tagline** | Simple but innovative industrial fan solutions |
| **Source** | [Facebook](https://www.facebook.com/cloverindustrialfan) |
| **Assets** | Hero + 4 gallery JPGs downloaded via Chrome DevTools MCP (network response) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### G3k Cad Plotting & Blueprinting Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/g3k-cad/` |
| **Netlify site** | `g3k-cad-plotting` |
| **Preview host** | `g3k-cad-plotting.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=g3k-cad |
| **Contact** | +63 928 353 4491 (no public email on FB) |
| **Address** | 3rd Floor Blk.30 Lot.12 Badjao St. cor. Ivatan, Amity Village Phase 2, San Jose, Rodriguez, Rizal 1860 |
| **Service area** | Rodriguez, Rizal |
| **Category** | Printing Service · CAD plotting & blueprinting |
| **Source** | [Facebook](https://www.facebook.com/p/G3k-Cad-Plotting-Blueprinting-Services-61553203343584/) |
| **Assets** | Logo, hero + 4 gallery JPGs via Chrome DevTools MCP (network response); Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Kubling Tago Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/kubling-tago-resort/` |
| **Netlify site** | `kubling-tago-resort` |
| **Preview host** | `kubling-tago-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=kubling-tago-resort |
| **Contact** | Globe 0954 385 8881 · Smart 0985 243 6620 (**no public email** on FB) |
| **Address** | Villa Maria 2 Subd., Cupang, Antipolo City |
| **Category** | Local business · Day resort (infinity pools, cottages, private rooms, function hall) |
| **Source** | [Facebook](https://www.facebook.com/KublingTagoResort/) · ~25K followers |
| **Assets** | Logo, cover, pool hero + gallery (pool, garden, entrance sign, poolside); Motion + Three.js particles; sample rates from FB sheet |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | Messenger/SMS preferred · `quotation-messenger.txt` · `quotation-sms.txt` · email draft held (no address) |

---

### Regan Industrial Sales Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/regan-industrial/` |
| **Netlify site** | `regan-industrial` |
| **Preview host** | `regan-industrial.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=regan-industrial |
| **Contact** | inquiry@reganindustrial.com.ph · 0998 843 4711 |
| **Address** | #5 Harmony Street, Grace Village, Brgy. Balingasa, Balintawak, Quezon City 1106 |
| **Category** | Metal / steel supplier · Est. 1968 · ~80K FB followers |
| **Source** | [Facebook](https://www.facebook.com/reganindustrialph/) · [reganindustrial.com](https://reganindustrial.com/) · [mail portal](https://mail.reganindustrial.com/#/home) |
| **Assets** | Logo + hero + gallery from live site (browser fetch); Motion + Three.js blueprint hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### IntelliSmart Technology Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/intellismart/` |
| **Netlify site** | `intellismartinc` |
| **Preview host** | `intellismartinc.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=intellismart |
| **Contact** | sales@intellismartinc.com · (+632) 8350 5986 |
| **Address** | 12 Catanduanes St., Brgy Paltok, West Ave., Quezon City 1105 |
| **Category** | System integration · AV / security / BMS / ICT · ~8.5K FB followers |
| **Source** | [Facebook](https://www.facebook.com/Intellismartinc/) · [intellismartinc.com](https://intellismartinc.com/) |
| **Assets** | Logo + hero + gallery from live site; Motion + Three.js blueprint hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

## Folder layout

```text
client-sites/
  README.md           # This catalog — update when adding a client
  _template/          # Copy for new clients
  {slug}/             # One folder per business
    index.html        # Tailwind CDN (primary layout)
    styles.css        # Hero bg, reveal animations
    site.js           # Mobile nav, accordions, filters, scroll reveal
    hero-motion.js    # Motion (Framer Motion) — first-section hero entrance
    hero-three.js     # Three.js ambient canvas — first-section background
    assets/           # Logos, photos (optional)
    netlify.toml
    client.json       # business, contact, quotation, preview URL
    quotation-email.md
    quotation-sms.txt
    quotation-messenger.txt
    quotation-followup-3d.md
    quotation-followup-1w.md
    embed-guard.js
    netlify/edge-functions/embed-only.js
```

**Motion + Three.js on hero:** wrap the first section in `[data-hero]`, animate copy with `[data-hero-animate]` / `[data-hero-bg]` / `[data-hero-cta]`, add `<canvas data-hero-canvas>`. Themes: `data-hero-three="blueprint"` or `"particles"`. Load `hero-motion.js` then `hero-three.js` as modules after `site.js`. Reference: `g3k-cad/` (Motion + Three.js), `quotation/` (Motion).

## `client.json` schema

```json
{
  "businessName": "Business Name",
  "slug": "business-slug",
  "previewHost": "business-slug.netlify.app",
  "industry": "Industry label",
  "deployedAt": "2026-07-13",
  "contact": {
    "name": "Contact name",
    "email": "client@example.com",
    "phone": "+63 900 000 0000"
  },
  "quotation": {
    "packageName": "Starter Business Website",
    "packageScope": "One-page responsive site…",
    "quotedAmount": "₱15,000",
    "paymentTerms": "50% upfront to begin · 50% on delivery (not the full amount upfront)",
    "timeline": "5–7 business days",
    "previewUrl": "https://carlmanuel.com/?preview=business-slug"
  },
  "outreach": {
    "emailDraft": "quotation-email.md",
    "smsDraft": "quotation-sms.txt",
    "messengerDraft": "quotation-messenger.txt",
    "followUp3dDraft": "quotation-followup-3d.md",
    "followUp1wDraft": "quotation-followup-1w.md",
    "status": "draft",
    "cadence": null,
    "emailFound": false,
    "sentAt": null,
    "nextFollowUpAt": null,
    "lastFollowUpAt": null,
    "followUpCount": 0,
    "notes": ""
  },
  "sources": {
    "facebook": "https://www.facebook.com/…",
    "website": "https://…",
    "address": "…"
  }
}
```

## New client workflow

1. `cp -R client-sites/_template client-sites/{slug}`
2. Customize `index.html`, `styles.css`, `site.js`, `hero-motion.js`, `hero-three.js`, `client.json`, assets
3. Deploy: `cd client-sites/{slug} && npx netlify deploy --prod --create-site {netlify-site-name}`
4. Set `previewHost`, `deployedAt`, and `quotation.previewUrl` in `client.json` (`previewUrl` uses `?preview={slug}`, not the Netlify hostname)
5. Draft outreach (email / SMS / messenger + **3d** and **1w** follow-ups)
6. **If email found** → ask before send (Private Email `info@carlmanuel.com`); **yes** → send + auto follow-ups (default **1 week**; **3 days** only if said in the same reply)
7. Add entry to `src/v3/config/previewWhitelist.js` (`PREVIEW_SITES`)
8. **Add a row + detail section to this README**
9. Portfolio release if whitelist changed (see deploy skill)
10. Browser QA: open preview link on desktop + mobile mockups

## Agent skill & rules

| Resource | Path |
|----------|------|
| Skill | [`.cursor/skills/client-site-netlify/SKILL.md`](../.cursor/skills/client-site-netlify/SKILL.md) |
| Rule | [`.cursor/rules/client-quotations.mdc`](../.cursor/rules/client-quotations.mdc) |
| Whitelist | [`src/v3/config/previewWhitelist.js`](../src/v3/config/previewWhitelist.js) |
| Preview helper | `buildPreviewPortfolioUrl(slug)` in `previewWhitelist.js` |
| Preview tests | [`previewWhitelist.test.js`](../src/v3/config/previewWhitelist.test.js), [`Index.test.js`](../src/pages/Index.test.js), [`PreviewShowcase.test.js`](../src/v3/containers/PreviewShowcase/PreviewShowcase.test.js) |
| Preview UI | [`src/v3/containers/PreviewShowcase/`](../src/v3/containers/PreviewShowcase/) |

## Security

- Preview iframes only allow `*.netlify.app` or hosts in `PREVIEW_SITES`.
- Every client folder ships **embed-only** protection:
  - `embed-guard.js` (in `<head>`)
  - `netlify/edge-functions/embed-only.js`
  - CSP `frame-ancestors` in `netlify.toml`
- Do not commit API keys; use Netlify env vars for forms later.
- Do not commit `.netlify/` link state.

## Verify embed-only

```bash
# Direct → 403
curl -sI "https://{slug}" | head -1

# Iframe simulation → 200
curl -sI -H "Sec-Fetch-Dest: iframe" \
  -H "Referer: https://carlmanuel.com/?preview={slug}" \
  "https://{slug}" | head -1
```

## Outreach

Each client folder includes three **draft** files. Pull package/price/contact from `client.json`. Present to the user for review — **never auto-send**.

Sign-off: **Carl Louis Manuel** · [carlmanuel.com](https://carlmanuel.com) · info@carlmanuel.com
