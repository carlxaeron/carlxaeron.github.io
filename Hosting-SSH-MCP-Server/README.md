# Hosting SSH MCP Server

Local MCP bridge to **Namecheap Stellar** shared hosting (`tahanan.org`) over **SSH/SFTP**.

Use this when you need agents to list/read/write files or run shell commands on the hosting account. Namecheap’s public API is separate (and often locked) — this talks to the server directly.

## Connection (verified)

| Field | Value |
|--------|--------|
| Host | `server402.web-hosting.com` |
| IP | `162.213.253.122` |
| Username | `carlxaeron` |
| SSH / SFTP port | **21098** (not 22) |
| FTP | `ftp.tahanan.org` port **21** |
| Home | `/home/carlxaeron` |
| Web | `~/public_html`, `~/tahanan`, `~/api.tahanan.org` |

Auth: dedicated ed25519 key at `.ssh/tahanan_mcp` (authorized in cPanel as `cursor-hosting-mcp`).

## Setup

```bash
cd Hosting-SSH-MCP-Server
cp .env.example .env   # already filled for this account
npm install && npm run build
chmod 700 .ssh && chmod 600 .ssh/tahanan_mcp
chmod +x start-mcp.sh
```

If the key is missing, generate one and **Authorize** the public key in cPanel → **Manage Shell** → **Import Key** / **Manage** → Authorize:

```bash
ssh-keygen -t ed25519 -f .ssh/tahanan_mcp -N "" -C "cursor-hosting-mcp@tahanan"
```

Manual smoke test:

```bash
ssh -i .ssh/tahanan_mcp -p 21098 carlxaeron@server402.web-hosting.com 'pwd'
```

## Cursor

Configured in [`.cursor/mcp.json`](../.cursor/mcp.json) as `hosting-ssh` via `start-mcp.sh`.

Reload MCP / restart Cursor after first build.

## Tools

| Tool | Purpose |
|------|---------|
| `hosting_info` | Connection summary + common paths |
| `hosting_exec` | Remote shell command |
| `hosting_ls` | List directory (SFTP) |
| `hosting_read` / `hosting_write` | Read/write files |
| `hosting_mkdir` / `hosting_rm` | Create / remove (rm refuses home/`public_html` roots) |
| `hosting_upload` / `hosting_download` | Local ↔ remote transfer |

Paths are soft-jailed under `/home/carlxaeron`.

## Security

- **Never commit** `.env` or `.ssh/` private keys
- Prefer key auth; leave `SSH_PASSWORD` empty
- Destructive `hosting_rm` / wild `hosting_exec` — confirm with the user first
- Tahanan app code may be private — do not mention Tahanan in OnlineJobs submissions

## Related

- Namecheap domains/DNS API MCP: `Namecheap-MCP-Server/` (API eligibility often locked)
- Browser DNS fallback: `.cursor/skills/namecheap-browser/SKILL.md`
- Agent skill: `.cursor/skills/hosting-ssh/SKILL.md`
