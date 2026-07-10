# MCP configuration notes

## Project MCP (`.cursor/mcp.json`)

| Server | Purpose |
|--------|---------|
| `onlinejobs-apify` | OnlineJobs.ph search, apply, CV upload |

Set `APIFY_API_TOKEN` in Cursor MCP env. Restart Cursor after changes.

## Optional user-level MCP

**Netlify** — not used for portfolio deploy (GitHub Pages + Firebase). Install in Cursor user settings if deploying other projects:

```json
{
  "mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"]
    }
  }
}
```

Requires Node.js 22+ and Netlify account auth on first use.
