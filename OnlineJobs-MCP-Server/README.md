# OnlineJobs.ph MCP Server (Apify)

MCP server that searches [OnlineJobs.ph](https://www.onlinejobs.ph) using the Apify actor [`vjkhush/onlinejobsph-job-radar-actor`](https://apify.com/vjkhush/onlinejobsph-job-radar-actor).

## Prerequisites

1. [Apify account](https://console.apify.com/) with an API token
2. Python 3.11+ and [uv](https://docs.astral.sh/uv/) (recommended) or `pip`
3. Optional: Dropbox or Google Drive for shareable CV links

## Setup

```bash
cd OnlineJobs-MCP-Server
cp .env.example .env
# Edit .env and set APIFY_API_TOKEN
uv sync
```

## CV upload (Dropbox or Google Drive)

When configured, `create_job_application` uploads `CARLLOUISMANUEL-CV.docx` and writes a **shareable link** into `submission.txt` and `job-info.json` (`cv_share_url`).

### Option A — Dropbox (fastest)

1. [Create a Dropbox app](https://www.dropbox.com/developers/apps) → **Scoped access** → **Full Dropbox** or **App folder**
2. Enable permissions: `files.content.write`, `sharing.write`
3. Generate an access token under the app’s **Permissions** tab
4. Add to `.env` and Cursor MCP `env`:

```env
CV_UPLOAD_PROVIDER=dropbox
DROPBOX_ACCESS_TOKEN=sl.u.YOUR_TOKEN
DROPBOX_CV_FOLDER=/job-applications
```

Files land at `/job-applications/CARLLOUISMANUEL-CV.docx` (overwritten per upload). Share links use `?dl=1` for direct download.

### Option B — Google Drive

1. [Google Cloud Console](https://console.cloud.google.com/) → enable **Google Drive API**
2. **Credentials** → **OAuth client ID** → **Desktop app** → download JSON
3. Save as `OnlineJobs-MCP-Server/google_drive_credentials.json` (gitignored)
4. Run the one-time auth script:

```bash
cd OnlineJobs-MCP-Server
uv run python scripts/google_drive_auth.py
```

5. Copy the printed values into `.env` and Cursor MCP `env`:

```env
CV_UPLOAD_PROVIDER=google_drive
GOOGLE_DRIVE_CLIENT_ID=...
GOOGLE_DRIVE_CLIENT_SECRET=...
GOOGLE_DRIVE_REFRESH_TOKEN=...
GOOGLE_DRIVE_FOLDER_ID=optional_folder_id
```

Uploaded files are set to **anyone with the link can view**.

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
        "/Users/carllouismanuel/CARL MANUEL/DEV/carlxaeron.github.io/OnlineJobs-MCP-Server",
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

Replace the path and tokens. Restart Cursor after saving.

## Local dashboard (job tracker UI)

Private localhost UI to list applications, update status/notes, search OnlineJobs.ph, and create apply packages.

```bash
cd OnlineJobs-MCP-Server
uv sync
cd dashboard-ui && npm install && npm run build && cd ..
uv run job-dashboard
```

Open **http://localhost:8787**

**Dev mode** (hot reload UI):

```bash
# Terminal 1
uv run job-dashboard

# Terminal 2
cd dashboard-ui && npm run dev   # http://localhost:5173 (proxies /api)
```

Set `DASHBOARD_PORT` in `.env` to change the API port (default `8787`).

**Dashboard features:**

- **Applications** — filter by status, search title/company/notes, open detail drawer
- **Detail drawer** — edit status & notes, copy submission, CV share link, download CV, re-upload
- **Search & Apply** — OnlineJobs.ph search via Apify + Apply button per row
- **Manual apply** — create a package without searching first

`job-info.json` tracking fields: `status`, `notes`, `submitted_at`, `updated_at`, `location`, `posted_at`.

## Tools

| Tool | Description |
|------|-------------|
| `search_onlinejobs` | Search by custom keywords; returns Markdown table with row numbers |
| `search_onlinejobs_fullstack_ai` | Preset keywords for full-stack + AI roles |
| `create_job_application` | Folder + `submission.txt`, tailored CV, `job-info.json`; uploads CV when cloud is configured |
| `list_job_applications` | List local application folders with status and metadata |
| `update_job_application` | Update status and notes on an existing folder |
| `upload_job_cv` | Re-upload CV from an existing application folder and refresh share link |

## Application folders

After `create_job_application`, files are written under `job-applications/` at the repo root (gitignored):

```text
job-applications/YYYY-MM-DD_Title_Company/
  job-info.json       # includes cv_share_url when uploaded
  submission.txt      # message includes share link or "CV attached."
  CARLLOUISMANUEL-CV.docx
```

Open `submission.txt` for the OnlineJobs.ph **subject** and **message**. Paste the share link or attach the local CV.

## Alternative: Apify hosted MCP (no local install)

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

Note: hosted MCP does not include `create_job_application` or CV upload — use the local server for the full workflow.

## Cost note

Apify charges per actor run. The actor includes a small free trial; check [actor pricing](https://apify.com/vjkhush/onlinejobsph-job-radar-actor) before large sweeps.
