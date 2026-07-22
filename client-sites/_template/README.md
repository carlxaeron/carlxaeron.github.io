# Client site template

Copy this folder to `client-sites/{slug}/`, customize, deploy to Netlify.

## One-time unlock (edge)

Magic links use `?access={token}` (site: `/`, admin: `/admin/`). The edge function redeems once via `POST https://api.carlmanuel.com/previewAccess/redeem`, then serves that single HTML load. Refresh / reused link → lock page with **Notify Carl**.

### Netlify env (required for unlock)

| Variable | Scope | Notes |
|----------|-------|--------|
| `PREVIEW_ACCESS_SECRET` | **Functions** (UI/CLI — not `netlify.toml`) | Must match API `PREVIEW_ACCESS_SECRET` on Stellar. Redeploy the site after setting or rotating. |

Without this secret, `?access=` redeem fails closed (lock page).

Portfolio `?preview=` iframe path is unchanged (no env needed for embeds).

### Rollout to existing clients

Copy from this template (do not batch-redeploy unless asked):

- `netlify/edge-functions/embed-only.js`
- `embed-guard.js`

Then set `PREVIEW_ACCESS_SECRET` on that Netlify site and redeploy.

**Stale edge bundle:** before redeploy, `rm -rf .netlify/edge-functions-dist` (or `netlify deploy --skip-functions-cache`). A leftover dist can ship the old lock page (`Preview only`) even after the source file is updated.
