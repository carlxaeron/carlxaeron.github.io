# MCP configuration

## Project MCP (`.cursor/mcp.json`)

| Server | Purpose |
|--------|---------|
| `onlinejobs-apify` | OnlineJobs.ph search, apply, CV upload |
| `netlify` | Create/deploy client sites under `client-sites/` — see [site catalog](../client-sites/README.md). Preview links use `?preview={slug}`; tests in `previewWhitelist.test.js`.
| `namecheap` | Domains + DNS via Namecheap **API** — only after eligibility; see [Namecheap-MCP-Server/README.md](../Namecheap-MCP-Server/README.md) |
| `chrome-devtools` (user) | Facebook briefs + **Namecheap dashboard DNS** when API is locked — skill [namecheap-browser](skills/namecheap-browser/SKILL.md) |

Set `APIFY_API_TOKEN` in Cursor MCP env for onlinejobs. Restart Cursor after changes.

## Namecheap — preferred path (no API)

Account does **not** meet Namecheap API criteria (\$50 balance / 20 domains / \$50 spend). Use browser automation instead:

1. Read [.cursor/skills/namecheap-browser/SKILL.md](skills/namecheap-browser/SKILL.md)
2. Chrome DevTools MCP → `https://ap.www.namecheap.com/domains/list/`
3. User completes login/2FA if prompted
4. Edit **Advanced DNS** from snapshots (document before/after)

Optional later: fund/qualify → enable API → fill `Namecheap-MCP-Server/.env`.

## Namecheap MCP (API — optional)

Local server: [Namecheap-MCP-Server/](../Namecheap-MCP-Server/) — **inactive until API Access unlocks**.

```json
"namecheap": {
  "command": "/…/Namecheap-MCP-Server/start-mcp.sh"
}
```

1. Enable API + whitelist IP at https://ap.www.namecheap.com/settings/tools/apiaccess/
2. `cp Namecheap-MCP-Server/.env.example Namecheap-MCP-Server/.env` and fill username + API key
3. Restart Cursor MCP

**Caution:** `namecheap_set_dns_hosts` replaces all records; `namecheap_register_domain` charges the account.

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
