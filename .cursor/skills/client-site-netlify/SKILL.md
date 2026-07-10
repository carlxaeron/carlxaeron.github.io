---
name: client-site-netlify
description: Scaffold, build, and deploy local-business quotation websites under client-sites/ to Netlify, register portfolio preview URLs, and share carlmanuel.com/?preview= links. Use when the user asks to create a client website, business landing page, Netlify deploy, quotation demo, or portfolio device preview for a prospect.
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
- [ ] Brief gathered (business, services, CTA, location, colors)
- [ ] Folder scaffolded from _template
- [ ] Site content + styles customized
- [ ] Deployed to Netlify (capture previewHost)
- [ ] client.json updated
- [ ] PREVIEW_SITES entry added
- [ ] Portfolio preview link shared
```

## Step 1 — Scaffold

```bash
cp -R client-sites/_template client-sites/{slug}
```

Edit `client.json`: `businessName`, `slug`, `industry`.

## Step 2 — Build site

- Keep **static HTML + CSS** unless client needs a framework.
- Mobile-first; match quality bar from V3 greens (`#00473e`, `#00A862`).
- One-page layout: hero, services, about, contact.
- `netlify.toml`: `publish = "."`
- Use `X-Frame-Options: SAMEORIGIN` so portfolio can iframe `*.netlify.app`.

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

3. Share: `https://carlmanuel.com/?preview=slug.netlify.app`

## Step 5 — Portfolio release (if preview UI changed)

Follow [deploy-portfolio/SKILL.md](../deploy-portfolio/SKILL.md) — bump version, CHANGELOG, push.

## Rules

- Whitelist-only preview hosts (no arbitrary domains).
- No secrets in `client-sites/` — use Netlify env for forms later.
- Demo copy OK; mark fictitious businesses clearly.
- Do not add client sites to portfolio Side Projects without user approval.

## Rule reference

[.cursor/rules/client-quotations.mdc](../../rules/client-quotations.mdc)
