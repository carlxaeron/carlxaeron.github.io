---
name: onlinejobs-apify
description: Search OnlineJobs.ph remote job listings via the onlinejobs-apify MCP server (Apify Job Radar actor). Use when the user asks to find jobs on OnlineJobs.ph, monitor VA/full-stack listings, match roles to their portfolio skills, or prepare an application folder with CV and submission text.
---

# OnlineJobs.ph (Apify MCP)

## When to use

- User asks to search **OnlineJobs.ph** / **OJP** / Filipino remote jobs
- User wants job leads matching **full-stack**, **React**, **Laravel**, **OpenAI**, or **Flutter**
- User says **apply to #N** or wants a **submission.txt** / tailored **CV** for a listing
- Comparing listings to portfolio/CV positioning

## MCP server

Project server: `onlinejobs-apify` (see [OnlineJobs-MCP-Server/README.md](../../OnlineJobs-MCP-Server/README.md)).

Full repo map: [docs/project-history.md](../../docs/project-history.md) · [AGENTS.md](../../AGENTS.md)

Requires `APIFY_API_TOKEN` in MCP env (Apify Console → Integrations). Restart Cursor after changing the token.

## Local dashboard

```bash
cd OnlineJobs-MCP-Server
cd dashboard-ui && npm run build && cd ..
uv run job-dashboard
```

Open **http://localhost:8787** — list applications, update status/notes, search & apply, manual create.

**Runs as a launchd LaunchAgent** (`com.carlmanuel.olj-dashboard`, `~/Library/LaunchAgents/com.carlmanuel.olj-dashboard.plist`) so it survives reboots/logouts. launchd gives the process a **minimal environment with no `PATH`** (unlike an interactive shell) — any code that shells out to a bare command name (e.g. `subprocess.run(["uv", ...])`) will fail with `[Errno 2] No such file or directory` under this service even though it works fine in a terminal. `applications.py`'s `resolve_uv_path()` resolves an absolute path (`shutil.which("uv")`, falling back to `~/.local/bin/uv`, `/opt/homebrew/bin/uv`, `/usr/local/bin/uv`) for this reason — apply the same pattern to any new bare-executable `subprocess` call. The plist also sets `EnvironmentVariables.PATH` as defense-in-depth. After editing the plist, `kickstart -k` does **not** reload it — use `launchctl bootout gui/$(id -u)/com.carlmanuel.olj-dashboard` then `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.carlmanuel.olj-dashboard.plist`.

## End-to-end workflow

```text
1. search_onlinejobs / search_onlinejobs_fullstack_ai
2. Present Markdown table (# | Title | Company | Salary | Posted)
3. User picks a row → create_job_application with fields from JSON block
4. If CV_UPLOAD_PROVIDER is set (Dropbox/Google Drive), CV is uploaded and submission.txt gets a share link
5. User opens submission.txt — paste share link or attach local CARLLOUISMANUEL-CV.docx on OnlineJobs.ph
```

## Tools

### `search_onlinejobs`

- `keywords`: array, required (e.g. `["laravel", "react developer"]`)
- `maximum_items`: default 50, max 500
- `date_filter`: `LAST_24_HOURS` | `LAST_3_DAYS` (default; only values Apify actor accepts)
- `company_name`: optional employer substring
- `remote_work`: optional boolean

### `search_onlinejobs_fullstack_ai`

Preset keywords for Carl’s stack (full-stack, React, Laravel, OpenAI, Flutter, Firebase, senior developer).

### `create_job_application`

Creates one folder per job under `job-applications/`:

```text
job-applications/
  YYYY-MM-DD_Job-Title_Company-Name/
    job-info.json          # listing metadata + timestamp
    submission.txt         # SUBJECT + OnlineJobs.ph message body
    CARLLOUISMANUEL-CV.docx  # CV with tailored header tagline
```

`job-info.json` may include `cv_share_url` and `cv_upload_provider` when cloud upload is configured.

**Parameters:**

| Param | Required | Notes |
|-------|----------|--------|
| `job_title` | yes | From search table |
| `job_url` | yes | Listing URL |
| `company` | no | Empty if unknown |
| `job_id` | no | From JSON apply block |
| `salary` | no | From table |
| `tailored_tagline` | no | Auto-inferred from title if omitted |
| `extra_notes` | no | Appended to cover message |
| `upload_cv_to_cloud` | no | Default `true`; uploads when `CV_UPLOAD_PROVIDER` is set |
| `job_description` | no | Listing description text (if scraped/known) — grounds the AI-tailored cover message in real job specifics |

### `list_job_applications`

List local folders with `status`, title, company, created date. Optional filters: `status`, `q`.

### `update_job_application`

Update `status` and/or `notes` on a folder (`folder_id` = directory name under `job-applications/`).

### `upload_job_cv`

Re-upload CV from an existing `job-applications/...` folder; refreshes `cv_share_url` in `job-info.json` and `submission.txt`.

**Cloud setup:** see [OnlineJobs-MCP-Server/README.md](../../OnlineJobs-MCP-Server/README.md) — `CV_UPLOAD_PROVIDER=dropbox` or `google_drive` plus tokens in MCP env.

**Tagline inference (when `tailored_tagline` empty):**

- React roles → `Senior React Developer · Full-Stack Engineer`
- Laravel/PHP → `Senior PHP/Laravel Engineer · Full-Stack Developer`
- AI/LLM → `Full-Stack Engineer · AI Integration Specialist`
- Flutter/mobile → `Full-Stack Engineer · Flutter & Mobile Developer`
- Default → `Senior Full-Stack Engineer · AI Integration Specialist`

## Search output format

Results are a **Markdown table** with row numbers `#1`, `#2`, … plus:

- **Links** section (one URL per row)
- **Apply reference (JSON)** — copy `job_title`, `company`, `job_url`, `job_id` into `create_job_application`

User can say: *"apply to #3"* — use the matching JSON entry.

## submission.txt format

```text
SUBJECT: Application for [Job Title] — Carl Louis Manuel

--- ONLINEJOBS.PH MESSAGE ---

Hi [Company or Hiring Manager],
...
---
URL: [job_url]
```

**Subject + body generation:** `build_submission_text` (`applications.py`) calls `onlinejobs_mcp_server/ai_tailor.py` per job with `job_title`/`company`/`job_description`/`extra_notes` plus the **master bio** from `job-applications/_profile.json` (Settings tab; falls back to built-in `CANDIDATE_PROFILE` when empty), trying providers in order **Groq (`GROQ_API_KEY`) → Google Gemini (`GEMINI_API_KEY`) → OpenAI (`OPENAI_API_KEY`)** (`.env` or MCP env; all optional) — first provider with a key set that returns valid, non-banned output wins, so each submission is genuinely tailored, not the same paragraph with only the title swapped in. Falls back to the static keyword-matched template (unchanged, no crash) when every configured provider is missing/fails; a warning is logged to stderr, never into `submission.txt`, and no API key is ever logged. Contact info, portfolio link, and CV line stay deterministic (not model-generated). Model output that mentions Tahanan is rejected for that provider and the chain tries the next one (or falls to static if it was the last). Dashboard **Settings** can also draft the master bio via free AI (`POST /api/profile/generate`); Save is still required. After changing the master bio, use **Regenerate submission** on existing applications.

Paste the block under `--- ONLINEJOBS.PH MESSAGE ---` into OnlineJobs.ph when applying.

- If uploaded: message includes `CV (shareable link): https://...` — paste that link in the application form.
- Otherwise: attach `CARLLOUISMANUEL-CV.docx` from the same folder.

## Rules

- Do not run `maximum_items` > 200 unless the user asks (Apify cost).
- Never mention **Tahanan**, `tahanan.org`, or stealth SaaS product details in cover messages.
- Remind user to replace `[CONFIRM: ...]` placeholders in master CV data in `src/external-config.js` before mass applying.
- After creating a package, tell the user the exact folder path.

## Related docs

- Workflow rule: [`.cursor/rules/onlinejobs-workflow.mdc`](../../rules/onlinejobs-workflow.mdc)
- Full guide: [docs/job-applications-workflow.md](../../../docs/job-applications-workflow.md)
- CV generator: [`Office-Word-MCP-Server/apply_canva_cv_design.py`](../../Office-Word-MCP-Server/apply_canva_cv_design.py) (`--output`, `--tagline`, `--no-backup`)
