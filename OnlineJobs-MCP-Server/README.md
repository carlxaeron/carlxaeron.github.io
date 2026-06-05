# OnlineJobs.ph MCP Server (Apify)

MCP server that searches [OnlineJobs.ph](https://www.onlinejobs.ph) using the Apify actor [`vjkhush/onlinejobsph-job-radar-actor`](https://apify.com/vjkhush/onlinejobsph-job-radar-actor).

## Prerequisites

1. [Apify account](https://console.apify.com/) with an API token
2. Python 3.11+ and [uv](https://docs.astral.sh/uv/) (recommended) or `pip`

## Setup

```bash
cd OnlineJobs-MCP-Server
cp .env.example .env
# Edit .env and set APIFY_API_TOKEN
```

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
        "APIFY_API_TOKEN": "YOUR_APIFY_TOKEN"
      }
    }
  }
}
```

Replace the path and token. Restart Cursor after saving.

## Tools

| Tool | Description |
|------|-------------|
| `search_onlinejobs` | Search by custom keywords; returns Markdown table with row numbers |
| `search_onlinejobs_fullstack_ai` | Preset keywords for full-stack + AI roles |
| `create_job_application` | Creates `job-applications/YYYY-MM-DD_Title_Company/` with `submission.txt`, tailored `CARLLOUISMANUEL-CV.docx`, and `job-info.json` |

## Application folders

After `create_job_application`, files are written under `job-applications/` at the repo root (gitignored). Open `submission.txt` for the OnlineJobs.ph **subject** and **message**; attach the CV from the same folder.

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

## Cost note

Apify charges per actor run. The actor includes a small free trial; check [actor pricing](https://apify.com/vjkhush/onlinejobsph-job-radar-actor) before large sweeps.
