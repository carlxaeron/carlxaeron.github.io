# Client sites (Netlify)

Static business websites for local quotation / sales demos. Each folder deploys to Netlify and can be showcased on the portfolio via:

`https://carlmanuel.com/?preview={previewHost}`

## Folder layout

```text
client-sites/
  _template/          # Copy for new clients
  {slug}/             # One folder per business
    index.html
    styles.css
    netlify.toml
    client.json
```

## client.json schema

```json
{
  "businessName": "Business Name",
  "slug": "business-slug",
  "previewHost": "business-slug.netlify.app",
  "industry": "Restaurant | Salon | Clinic | …",
  "deployedAt": "2026-07-10T00:00:00.000Z"
}
```

After deploy:

1. Set `previewHost` to the live Netlify URL hostname.
2. Add entry to `src/v3/config/previewWhitelist.js` (`PREVIEW_SITES`).
3. Share portfolio preview link with the prospect.

## New client workflow

```bash
cp -R client-sites/_template client-sites/my-client
# Edit index.html, styles.css, client.json
cd client-sites/my-client
npx netlify deploy --prod   # or use Netlify MCP from Cursor
```

## Agent skill

See [`.cursor/skills/client-site-netlify/SKILL.md`](../.cursor/skills/client-site-netlify/SKILL.md).

## Security

- Preview iframes only allow `*.netlify.app` or hosts in `PREVIEW_SITES`.
- Client demos ship with `embed-guard.js` + Netlify edge `embed-only` — direct URL visits are blocked; only portfolio iframe preview works.
- Do not commit API keys; use Netlify env vars for forms later.
