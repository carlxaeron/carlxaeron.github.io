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

*Fictitious demo business for quotation template workflow.*

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

## Folder layout

```text
client-sites/
  README.md           # This catalog — update when adding a client
  _template/          # Copy for new clients
  {slug}/             # One folder per business
    index.html        # Tailwind CDN (primary layout)
    styles.css        # Hero bg, reveal animations
    site.js           # Mobile nav, accordions, filters, scroll reveal
    assets/           # Logos, photos (optional)
    netlify.toml
    client.json       # business, contact, quotation, preview URL
    quotation-email.md
    quotation-sms.txt
    quotation-messenger.txt
    embed-guard.js
    netlify/edge-functions/embed-only.js
```

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
    "paymentTerms": "50% upfront, 50% on delivery",
    "timeline": "5–7 business days",
    "previewUrl": "https://carlmanuel.com/?preview=business-slug"
  },
  "outreach": {
    "emailDraft": "quotation-email.md",
    "smsDraft": "quotation-sms.txt",
    "messengerDraft": "quotation-messenger.txt"
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
2. Customize `index.html`, `styles.css`, `site.js`, `client.json`, assets
3. Deploy: `cd client-sites/{slug} && npx netlify deploy --prod --create-site {netlify-site-name}`
4. Set `previewHost`, `deployedAt`, and `quotation.previewUrl` in `client.json` (`previewUrl` uses `?preview={slug}`, not the Netlify hostname)
5. Draft outreach: `quotation-email.md`, `quotation-sms.txt`, `quotation-messenger.txt`
6. Add entry to `src/v3/config/previewWhitelist.js` (`PREVIEW_SITES`)
7. **Add a row + detail section to this README**
8. Portfolio release if whitelist changed (see deploy skill)
9. Browser QA: open preview link on desktop + mobile mockups

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
