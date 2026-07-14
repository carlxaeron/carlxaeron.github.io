# Namecheap MCP Server

Local MCP bridge to the Namecheap API for Cursor (domains, DNS, nameservers, pricing).

Upstream: [fantomdancer/mcp-namecheap](https://github.com/fantomdancer/mcp-namecheap)

## Status

**API Access may be locked** until Namecheap eligibility (\$50 balance, 20+ domains, or \$50 spend in 2 years).

Until unlocked, use the browser workflow instead:

→ [`.cursor/skills/namecheap-browser/SKILL.md`](../.cursor/skills/namecheap-browser/SKILL.md) (Chrome DevTools MCP + Advanced DNS)

## One-time Namecheap setup (API)

1. Open [API Access](https://ap.www.namecheap.com/settings/tools/apiaccess/)
2. Enable API access
3. Whitelist your public IP (must match `NAMECHEAP_CLIENT_IP`)
4. Copy the API key

```bash
cd Namecheap-MCP-Server
cp .env.example .env
# edit .env with username + API key + whitelisted IP
npm install && npm run build
chmod +x start-mcp.sh
```

## Cursor

Configured in [`.cursor/mcp.json`](../.cursor/mcp.json) as server `namecheap` via `start-mcp.sh`.

Restart Cursor (or reload MCP) after filling `.env`.

## Tools

| Tool | Purpose |
|------|---------|
| `namecheap_list_domains` | List account domains |
| `namecheap_get_domain_info` | Domain details |
| `namecheap_check_domain` | Availability |
| `namecheap_get_dns_hosts` / `namecheap_set_dns_hosts` | DNS records |
| `namecheap_get_nameservers` / `namecheap_set_nameservers` | Nameservers |
| `namecheap_set_default_nameservers` | Reset to Namecheap DNS |
| `namecheap_register_domain` | **Charges account** — confirm first |
| `namecheap_get_tld_pricing` | TLD pricing |

## Security

- Never commit `.env`
- `namecheap_set_dns_hosts` replaces **all** records — read first, then write
- Prefer not enabling register tools in shared sessions unless needed
