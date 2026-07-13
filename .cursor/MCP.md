# MCP configuration

## Project MCP (`.cursor/mcp.json`)

| Server | Purpose |
|--------|---------|
| `onlinejobs-apify` | OnlineJobs.ph search, apply, CV upload |
| `netlify` | Create/deploy client sites under `client-sites/` — see [site catalog](../client-sites/README.md) |

Set `APIFY_API_TOKEN` in Cursor MCP env for onlinejobs. Restart Cursor after changes.

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
