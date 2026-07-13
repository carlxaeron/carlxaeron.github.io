# MCP configuration

## Project MCP (`.cursor/mcp.json`)

| Server | Purpose |
|--------|---------|
| `onlinejobs-apify` | OnlineJobs.ph search, apply, CV upload |
| `netlify` | Create/deploy client sites under `client-sites/` — see [site catalog](../client-sites/README.md). Preview links use `?preview={slug}`; tests in `previewWhitelist.test.js`.
| `chrome-devtools` (user) | Scrape client Facebook pages (About, Photos); inspect + download hero/gallery images via network responses when building quotation sites |

Set `APIFY_API_TOKEN` in Cursor MCP env for onlinejobs. Restart Cursor after changes.

## Chrome DevTools MCP (Facebook briefs)

Use for **client-site-netlify** when the prospect link is Facebook:

- `new_page` / `navigate_page` → Facebook URL
- `take_snapshot` → intro, contact, address, reviews
- **Photos** tab → `evaluate_script` to inspect images (dimensions, alt) → pick best assets
- `list_network_requests` (`resourceTypes: ["image"]`) → match `fbcdn.net` URLs
- `get_network_request` (`reqid` + `responseFilePath`) → download full JPEG to `client-sites/{slug}/assets/`
- Shell `file` on saved files to verify resolution before commit

Do **not** use `take_screenshot` for client `assets/` (low-res crops). Do **not** use `WebFetch` or `curl` on Facebook CDN — returns 403 without browser session. See skill Step 1b for full workflow.

## Netlify MCP

Required for [client-site-netlify skill](skills/client-site-netlify/SKILL.md).

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"]
}
```

- Node.js **22+**
- Netlify account — authenticate on first tool use (`npx netlify login` or MCP auth flow)
- Portfolio itself deploys via **GitHub Pages**, not Netlify
- Client sites deploy to Netlify with **embed-only** security (edge `embed-only` + `embed-guard.js`) — see [client-site-netlify skill](skills/client-site-netlify/SKILL.md)

## onlinejobs-apify

See [OnlineJobs-MCP-Server/README.md](../OnlineJobs-MCP-Server/README.md).
