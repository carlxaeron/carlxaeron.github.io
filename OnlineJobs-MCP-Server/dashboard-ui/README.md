# Job Applications Dashboard UI

React (Vite) frontend for the local job tracker. Served by the FastAPI backend at **http://localhost:8787** after build.

## Dev mode

```bash
# Terminal 1 — API + static (or API only)
cd OnlineJobs-MCP-Server
uv run job-dashboard

# Terminal 2 — hot reload
cd OnlineJobs-MCP-Server/dashboard-ui
npm install
npm run dev
```

- **Production UI:** http://localhost:8787 (after `npm run build`)  
- **Dev UI:** http://localhost:5173 (proxies `/api` → `:8787`)

## Build for production

```bash
npm run build
```

Output: `dist/` — mounted by `job-dashboard` when the folder exists.

## Tabs

1. **Applications** — list, filter by status, search, detail drawer  
2. **Search & Apply** — OnlineJobs.ph search, apply per row, manual create form  

## Styling

Uses portfolio V3 tokens (`#00473e`, `#00A862`, `#D4E9E2`, Inter) in `src/styles.css`.

## API

All requests go to `/api/*` — see [../README.md](../README.md) and [../../docs/job-applications-workflow.md](../../docs/job-applications-workflow.md).
