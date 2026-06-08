# Job Applications Workflow

End-to-end system for searching [OnlineJobs.ph](https://www.onlinejobs.ph), generating tailored application packages, tracking apply status, and optionally uploading CVs to cloud storage.

**Live portfolio:** [carlmanuel.com](https://carlmanuel.com)  
**Local dashboard:** http://localhost:8787 (after setup below)

---

## What this includes

| Component | Location | Purpose |
|-----------|----------|---------|
| **Local dashboard** | `OnlineJobs-MCP-Server/` + `dashboard-ui/` | List applications, status/notes, search & apply, manual create |
| **MCP server (Cursor)** | `OnlineJobs-MCP-Server/` | Search jobs and create packages from chat (`onlinejobs-apify`) |
| **CV generator** | `Office-Word-MCP-Server/apply_canva_cv_design.py` | Tailored Word CV per job (tagline, headshot, experience only) |
| **Application storage** | `job-applications/` (gitignored) | Per-job folder with JSON, submission text, CV |
| **CV cloud upload** | Optional Dropbox / Google Drive | Shareable link in `submission.txt` |
| **Cursor skill & rule** | `.cursor/skills/onlinejobs-apify/`, `.cursor/rules/onlinejobs-workflow.mdc` | Agent workflow in Cursor |

---

## Architecture

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ Cursor chat     │     │ Local dashboard  │     │ Apify Job Radar     │
│ (MCP tools)     │     │ localhost:8787   │     │ (OnlineJobs.ph)     │
└────────┬────────┘     └────────┬─────────┘     └──────────┬──────────┘
         │                       │                          │
         └───────────┬───────────┴──────────────────────────┘
                     ▼
         ┌───────────────────────┐
         │ applications.py       │
         │ search.py             │
         └───────────┬───────────┘
                     ▼
         job-applications/YYYY-MM-DD_Title_Company/
           job-info.json
           submission.txt
           CARLLOUISMANUEL-CV.docx
                     │
                     ▼ (optional)
         Dropbox / Google Drive → cv_share_url
```

---

## Quick start

### 1. Configure Apify

```bash
cd OnlineJobs-MCP-Server
cp .env.example .env
# Set APIFY_API_TOKEN in .env
uv sync
```

Get a token: [Apify Console → Integrations](https://console.apify.com/account/integrations)

### 2. Run the local dashboard

```bash
cd OnlineJobs-MCP-Server
cd dashboard-ui && npm install && npm run build && cd ..
uv run job-dashboard
```

Open **http://localhost:8787**

### 3. Enable Cursor MCP (optional)

Add `onlinejobs-apify` to Cursor MCP settings — see [OnlineJobs-MCP-Server/README.md](../OnlineJobs-MCP-Server/README.md).

---

## Application folder layout

```text
job-applications/
  2026-06-05_Senior-React-Developer_Acme-Corp/
    job-info.json          # metadata + tracking
    submission.txt         # subject + OnlineJobs.ph message
    CARLLOUISMANUEL-CV.docx
```

### `job-info.json` fields

| Field | Description |
|-------|-------------|
| `job_title`, `company`, `salary`, `job_url`, `job_id` | From listing |
| `tailored_tagline` | CV header line inferred from title |
| `status` | `draft` · `submitted` · `interviewing` · `rejected` · `offer` · `withdrawn` |
| `notes` | Personal tracking notes |
| `created_at`, `updated_at`, `submitted_at` | Timestamps |
| `location`, `posted_at` | From search when available |
| `cv_share_url`, `cv_upload_provider` | After cloud upload |

---

## Workflows

### A — Dashboard (recommended for tracking)

1. **Applications** tab — filter/search, click a row for detail drawer  
2. Update **status** and **notes**, copy submission, download CV  
3. **Search & Apply** tab — search OnlineJobs.ph, click **Apply** on a row  
4. Or use **Manual apply** for listings found outside search  

### B — Cursor chat

1. Ask to search OnlineJobs.ph (e.g. “laravel and react, last 3 days”)  
2. Pick a row: “apply to #3”  
3. Agent calls `create_job_application` with fields from the JSON block  
4. Open `job-applications/.../submission.txt` and attach CV or paste share link  

### C — CV only

```bash
cd Office-Word-MCP-Server
uv run python apply_canva_cv_design.py \
  --output ~/Documents/CARLLOUISMANUEL-CV-V4.docx \
  --tagline "Senior React Developer · Full-Stack Engineer"
```

---

## MCP tools reference

| Tool | Description |
|------|-------------|
| `search_onlinejobs` | Keyword search → Markdown table + apply JSON |
| `search_onlinejobs_fullstack_ai` | Preset keywords for full-stack + AI roles |
| `create_job_application` | Create folder + CV + submission |
| `list_job_applications` | List local folders with status |
| `update_job_application` | Update status / notes |
| `upload_job_cv` | Re-upload CV to Dropbox/Google Drive |

---

## CV cloud upload (optional)

Set in `OnlineJobs-MCP-Server/.env` and Cursor MCP env:

- **Dropbox** — `CV_UPLOAD_PROVIDER=dropbox` + `DROPBOX_ACCESS_TOKEN`  
- **Google Drive** — OAuth setup via `scripts/google_drive_auth.py`  

Details: [OnlineJobs-MCP-Server/README.md](../OnlineJobs-MCP-Server/README.md#cv-upload-dropbox-or-google-drive)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Dashboard search → Internal Server Error | Use date filter **last 24 hours** or **last 3 days** only (Apify actor limit) |
| MCP `onlinejobs-apify` errors | Set `APIFY_API_TOKEN` in Cursor MCP env; restart Cursor |
| Search is slow | Apify runs take **2–5 minutes** — normal |
| Empty applications list | Create one via dashboard **Manual apply** or MCP `create_job_application` |
| UI shows old version | `cd dashboard-ui && npm run build`, restart `uv run job-dashboard` |
| CV generation fails | Run from `Office-Word-MCP-Server` with `uv sync` (needs `python-docx`) |

---

## Privacy

- `job-applications/` is **gitignored** — never committed  
- Dashboard binds to **127.0.0.1** only — local machine  
- Cover messages must not mention confidential projects (see `.cursor/rules/onlinejobs-workflow.mdc`)

---

## Related docs

- [OnlineJobs-MCP-Server/README.md](../OnlineJobs-MCP-Server/README.md) — MCP setup, API, env vars  
- [OnlineJobs-MCP-Server/dashboard-ui/README.md](../OnlineJobs-MCP-Server/dashboard-ui/README.md) — UI dev mode  
- [.cursor/skills/onlinejobs-apify/SKILL.md](../.cursor/skills/onlinejobs-apify/SKILL.md) — Cursor agent skill  
