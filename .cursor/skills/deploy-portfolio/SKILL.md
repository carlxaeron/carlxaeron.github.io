---
name: deploy-portfolio
description: End-to-end release and deploy workflow for the carlxaeron.github.io V3 portfolio on GitHub Pages and Firebase. Use when the user asks to deploy, release, push to production, tag a version, verify carlmanuel.com, or troubleshoot GitHub Actions / CI build failures for this repo.
---

# Deploy Portfolio (V3)

Repo: `carlxaeron.github.io`. Production site: **https://carlmanuel.com**.

Reference rule: [`.cursor/rules/v3-deploy.mdc`](../../rules/v3-deploy.mdc). Do **not** edit plan files.

## Architecture (quick)

- **Active app:** `src/v3/` via `src/pages/Index.js`
- **Build:** `npm run build` → copies `build/*` to `docs/`
- **Deploy:** push to `main` → `.github/workflows/static.yml`
- **Domain:** `public/CNAME` → `carlmanuel.com`
- **Backend:** contact/assistant URLs in `src/mapping.js`; CORS in `functions/index.js`

## Release checklist

Copy and track:

```
Deploy progress:
- [ ] Tests pass
- [ ] CI build passes locally
- [ ] CHANGELOG + version bumped
- [ ] Merged to main and pushed
- [ ] Tag + GitHub Release created
- [ ] Firebase functions deployed (if CORS/backend changed)
- [ ] carlmanuel.com verified
```

## Step 1 — Validate locally

From repo root:

```bash
CI=true npm test -- --watchAll=false --passWithNoTests
CI=true npm run build
```

Fix all ESLint issues before continuing (`CI=true` promotes warnings to errors).

## Step 2 — Prepare release notes

1. Bump version in `package.json` (semver).
2. Add section to `CHANGELOG.md` following the `[3.0.0]` format.

## Step 3 — Git merge and push

```bash
git checkout main
git pull origin main
# merge feature branch if needed
git push origin main
```

Push to `main` triggers GitHub Actions: `npm ci` → `npm run build` (with `REACT_APP_*` secrets) → upload `docs/`.

Monitor: `gh run list --workflow=static.yml` or GitHub Actions UI.

## Step 4 — Tag and release

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z: short summary"
git push origin main --tags
gh release create vX.Y.Z --title "vX.Y.Z" --notes "Summary from CHANGELOG"
```

Adjust tag message and release notes to match the CHANGELOG entry.

## Step 5 — Firebase functions (conditional)

Run **only** if `functions/index.js`, contact/assistant logic, or CORS origins changed:

```bash
cd functions && npm run deploy
```

Allowed origins must include:

- `https://carlmanuel.com`
- `https://www.carlmanuel.com`
- `https://carlxaeron.github.io`
- `http://localhost:3000`

## Step 6 — Verify production

```bash
curl -I https://carlmanuel.com
curl -I https://carlxaeron.github.io
```

Manual checks on **carlmanuel.com**:

- V3 portfolio renders (green design system)
- Hash / section navigation works
- Contact form submits without CORS errors

Use Chrome DevTools MCP when available for live inspection.

## CI gotchas

| Issue | Action |
|-------|--------|
| Broken npm deps | Never re-add `react-particles` or `tsparticles-preset-firefly` (404 on npm) |
| ESLint in CI | `CI=true npm run build` locally first |
| Missing analytics | Set GitHub secrets: `REACT_APP_apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId` |
| Firebase init skipped | `src/config.js` guards on `REACT_APP_projectId`; secrets required for full analytics |

## GitHub Actions secrets

Workflow env block in `.github/workflows/static.yml`:

- `REACT_APP_apiKey`
- `REACT_APP_authDomain`
- `REACT_APP_projectId`
- `REACT_APP_storageBucket`
- `REACT_APP_messagingSenderId`
- `REACT_APP_appId`
- `REACT_APP_measurementId`

Add/update in repo **Settings → Secrets and variables → Actions**.
