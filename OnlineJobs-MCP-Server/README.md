# OnlineJobs.ph MCP Server (Apify)

MCP server + **local job tracker dashboard** for [OnlineJobs.ph](https://www.onlinejobs.ph), powered by the Apify actor [`vjkhush/onlinejobsph-job-radar-actor`](https://apify.com/vjkhush/onlinejobsph-job-radar-actor).

**Full workflow guide:** [../docs/job-applications-workflow.md](../docs/job-applications-workflow.md)

---

## Major update — Job application platform

This folder is no longer search-only. It now includes:

1. **Local dashboard** (`uv run job-dashboard`) — React UI at http://localhost:8787  
2. **Application packages** — per-job folders with tailored CV, `submission.txt`, `job-info.json`  
3. **Status tracking** — draft / submitted / interviewing / rejected / offer / withdrawn + notes  
4. **CV cloud upload** — optional Dropbox or Google Drive share links  
5. **Cursor MCP tools** — search, apply, list, update, re-upload CV from chat  

```text
Search (Apify) → create_job_application → job-applications/YYYY-MM-DD_Title_Company/
                                              ├── job-info.json
                                              ├── submission.txt
                                              └── CARLLOUISMANUEL-CV.docx
Dashboard ←→ same folders (list, patch status, search & apply)
```

---

## Prerequisites

1. [Apify account](https://console.apify.com/) with an API token  
2. Python 3.11+ and [uv](https://docs.astral.sh/uv/)  
3. Node.js 18+ (for dashboard UI build)  
4. Optional: Dropbox or Google Drive for shareable CV links  

---

## Setup

```bash
cd OnlineJobs-MCP-Server
cp .env.example .env
# Edit .env — at minimum set APIFY_API_TOKEN
uv sync
```

### Environment variables (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `APIFY_API_TOKEN` | Yes (search) | Apify API token |
| `DASHBOARD_PORT` | No | Default `8787` |
| `CV_UPLOAD_PROVIDER` | No | `dropbox` or `google_drive` |
| `DROPBOX_ACCESS_TOKEN` | If Dropbox | Scoped app token |
| `DROPBOX_CV_FOLDER` | No | Default `/job-applications` |
| `GOOGLE_DRIVE_*` | If Google Drive | See [Google Drive setup](#option-b--google-drive) |

---

## Local dashboard (job tracker UI)

Private localhost UI — list applications, update status/notes, search OnlineJobs.ph, create apply packages.

```bash
cd OnlineJobs-MCP-Server
uv sync
cd dashboard-ui && npm install && npm run build && cd ..
uv run job-dashboard
```

Open **http://localhost:8787**

### Dev mode (UI hot reload)

```bash
# Terminal 1
uv run job-dashboard

# Terminal 2
cd dashboard-ui && npm run dev   # http://localhost:5173 (proxies /api)
```

See [dashboard-ui/README.md](dashboard-ui/README.md) for UI-specific notes.

### Dashboard features

| Tab / area | Actions |
|------------|---------|
| **Applications** | Filter by status, search title/company/notes, open detail drawer |
| **Detail drawer** | Edit status & notes, open job URL, copy submission, CV link, download CV, re-upload |
| **Search & Apply** | Keyword search (Apify), apply per row, manual apply form |

### REST API (used by dashboard)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/applications` | List (`?status=`, `?q=`) |
| `GET` | `/api/applications/{id}` | Detail + submission preview |
| `PATCH` | `/api/applications/{id}` | Update status, notes |
| `GET` | `/api/applications/{id}/submission` | Raw submission text |
| `GET` | `/api/applications/{id}/cv` | Download CV docx |
| `POST` | `/api/applications/{id}/upload-cv` | Cloud re-upload |
| `POST` | `/api/applications` | Create package |
| `POST` | `/api/search` | OnlineJobs search (JSON) |
| `GET` | `/api/meta` | Statuses, date filters |

---

## Cursor MCP config

Add to **Cursor Settings → MCP** (or merge into `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "onlinejobs-apify": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "/ABSOLUTE/PATH/TO/carlxaeron.github.io/OnlineJobs-MCP-Server",
        "onlinejobs-mcp-server"
      ],
      "env": {
        "APIFY_API_TOKEN": "YOUR_APIFY_TOKEN",
        "CV_UPLOAD_PROVIDER": "dropbox",
        "DROPBOX_ACCESS_TOKEN": "YOUR_DROPBOX_TOKEN"
      }
    }
  }
}
```

Replace paths and tokens. **Restart Cursor** after saving.

### MCP tools

| Tool | Description |
|------|-------------|
| `search_onlinejobs` | Search by keywords → Markdown table + apply JSON |
| `search_onlinejobs_fullstack_ai` | Preset full-stack + AI keywords |
| `create_job_application` | Folder + tailored CV + submission + job-info |
| `list_job_applications` | List local folders with status/metadata |
| `update_job_application` | Update status and notes |
| `upload_job_cv` | Re-upload CV; refresh share link |

### Chat workflow example

```text
You: Search OnlineJobs for laravel and react, last 3 days
Agent: [Markdown table with #1, #2, …]

You: Apply to #3
Agent: create_job_application(...) → job-applications/2026-06-05_.../
```

---

## Application folders

Written under `job-applications/` at the **repo root** (gitignored):

```text
job-applications/YYYY-MM-DD_Title_Company/
  job-info.json       # tracking + listing metadata
  submission.txt      # SUBJECT + OnlineJobs.ph message body
  CARLLOUISMANUEL-CV.docx
```

### `job-info.json` tracking fields

`status`, `notes`, `submitted_at`, `updated_at`, `location`, `posted_at`, plus optional `cv_share_url` / `cv_upload_provider`.

CV is generated by `Office-Word-MCP-Server/apply_canva_cv_design.py` with `--output`, `--tagline`, `--no-backup`.

---

## CV upload (Dropbox or Google Drive)

When configured, `create_job_application` uploads the CV and writes a **shareable link** into `submission.txt` and `job-info.json`.

### Option A — Dropbox (fastest)

1. [Create a Dropbox app](https://www.dropbox.com/developers/apps) → Scoped access  
2. Permissions: `files.content.write`, `sharing.write`  
3. Generate access token  

```env
CV_UPLOAD_PROVIDER=dropbox
DROPBOX_ACCESS_TOKEN=sl.u.YOUR_TOKEN
DROPBOX_CV_FOLDER=/job-applications
```

### Option B — Google Drive

1. [Google Cloud Console](https://console.cloud.google.com/) → enable **Google Drive API**  
2. OAuth client ID → Desktop app → download JSON  
3. Save as `google_drive_credentials.json` (gitignored)  
4. Run once:

```bash
uv run python scripts/google_drive_auth.py
```

5. Copy printed env vars into `.env` and MCP config.

---

## Python package layout

```text
onlinejobs_mcp_server/
  main.py           # MCP tools (FastMCP)
  dashboard_api.py  # FastAPI + job-dashboard CLI
  applications.py   # Folder create/list/update, submission, CV invoke
  search.py         # Apify search (shared by MCP + dashboard)
  cv_upload.py      # Dropbox / Google Drive
dashboard-ui/       # Vite + React local dashboard
scripts/
  google_drive_auth.py
```

### CLI entry points

```bash
uv run onlinejobs-mcp-server   # MCP stdio server (Cursor)
uv run job-dashboard           # Local web UI + REST API
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Search returns **500** / Internal Server Error | Date filter must be `LAST_24_HOURS` or `LAST_3_DAYS` only |
| Search hangs 2–5 min | Normal — Apify actor runtime |
| MCP token errors | Set `APIFY_API_TOKEN` in Cursor MCP env; restart Cursor |
| Dashboard empty | Create via **Manual apply** or MCP; data lives in `job-applications/` |
| UI not updating | `cd dashboard-ui && npm run build`; restart `job-dashboard` |
| CV build fails | `cd Office-Word-MCP-Server && uv sync` |

---

## Alternative: Apify hosted MCP (search only)

Hosted MCP does **not** include application folders, dashboard, or CV upload — use the local server for the full workflow.

```json
{
  "mcpServers": {
    "onlinejobs-apify-remote": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.apify.com/?tools=vjkhush/onlinejobsph-job-radar-actor",
        "--header",
        "Authorization: Bearer YOUR_APIFY_TOKEN"
      ]
    }
  }
}
```

---

## Cost note

Apify charges per actor run. Check [actor pricing](https://apify.com/vjkhush/onlinejobsph-job-radar-actor) before large sweeps.

---

## Related

- [docs/job-applications-workflow.md](../docs/job-applications-workflow.md) — end-user workflow guide  
- [.cursor/skills/onlinejobs-apify/SKILL.md](../.cursor/skills/onlinejobs-apify/SKILL.md) — Cursor agent skill  
- [.cursor/rules/onlinejobs-workflow.mdc](../.cursor/rules/onlinejobs-workflow.mdc) — apply rules (no confidential project names in cover letters)  
