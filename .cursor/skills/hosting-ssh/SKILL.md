---
name: hosting-ssh
description: Manage Namecheap Stellar shared hosting (tahanan.org) via the hosting-ssh MCP over SSH/SFTP on port 21098. Use when the user asks to deploy/edit files on Namecheap hosting, SSH into tahanan.org, manage public_html, api-carlxaeron / api.carlmanuel.com, or transfer files to carlxaeron shared hosting.
---

# Hosting SSH MCP (tahanan.org)

Prefer MCP tools on the **hosting-ssh** server over browser File Manager when changing hosting files or running remote commands.

## Cursor server id

In Cursor’s tool catalog the project MCP often appears as:

`project-0-carlxaeron.github.io-hosting-ssh`

(mcp.json key is still `hosting-ssh`). Use whichever name `GetMcpTools` returns.

**Launch:** [`/.cursor/mcp.json`](../../mcp.json) runs:

`node Hosting-SSH-MCP-Server/dist/index.js`

(Avoid shell starters if Cursor fails to register the server.) Rebuild after changes: `cd Hosting-SSH-MCP-Server && npm run build`.

## Connection

| Field | Value |
|--------|--------|
| Host | `server402.web-hosting.com` |
| Port | **21098** |
| User | `carlxaeron` |
| Auth | Key in `Hosting-SSH-MCP-Server/.ssh/tahanan_mcp` |
| Home | `/home/carlxaeron` |

Common paths: `public_html`, `public_html/api-carlxaeron` (→ **api.carlmanuel.com**), `tahanan`, `api.tahanan.org`, `www` → `public_html`.

## Workflow

```
Hosting SSH:
- [ ] hosting_info (confirm target)
- [ ] hosting_ls on public_html / api-carlxaeron before edits
- [ ] hosting_read targeted files
- [ ] hosting_write / hosting_upload for changes
- [ ] hosting_exec only for safe non-interactive commands
- [ ] Never leak Tahanan details into OnlineJobs submission.txt
```

## Tools

- `hosting_info`, `hosting_exec`
- `hosting_ls` / `hosting_read` / `hosting_write`
- `hosting_mkdir` / `hosting_rm` (refuses home / public_html root delete)
- `hosting_upload` / `hosting_download`

## Portfolio API

Self-hosted **PHP API** (Laravel app in repo; live Stellar tree currently custom PHP + `hosting-php/` outreach) under `public_html/api-carlxaeron`. Public base: `https://api.carlmanuel.com`. Document root → `public_html/api-carlxaeron/public`.

### Outreach cron (offline follow-ups)

```
Outreach / follow-ups:
- [ ] OUTREACH_SECRET set in hosting .env
- [ ] crontab: daily scripts/cron-outreach-followups.php
- [ ] Initial send only via /outreachSchedule after user approval in Cursor
- [ ] Follow-ups auto-send when due (Private Email SMTP)
- [ ] Pause via /outreachPause when prospect opts out
```

Full details: skill **api-carlxaeron** + **client-site-netlify** Step 5.

## Troubleshooting

1. MCP fails to start → `cd Hosting-SSH-MCP-Server && npm install && npm run build`
2. Tools missing → reload MCP / enable `hosting-ssh` in Settings → MCP
3. Auth fail → cPanel **Manage Shell** → SSH enabled + key **authorized**
4. Port 22 fails → must use **21098**
5. Namecheap DNS / `api` subdomain → skill `namecheap-browser`

Do not commit `.env` or `.ssh/` keys.
