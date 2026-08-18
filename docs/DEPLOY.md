---
file_type: "documentation"
description: "Deployment guide for LightSpeedWP Agency site on GitHub Pages"
name: "Deployment Guide"
version: "1.0.1"
last_updated: "2026-08-08"
---

# Deploy — LightSpeedWP Agency site on GitHub Pages

Static site with an Astro build step. GitHub Pages serves the built static files from `website/dist/`.

> Agent: fill in every `<…>` placeholder and tick the checklist. Do NOT change
> the Pages source branch or push a `gh-pages` branch — that is decided and
> applied by the repo owner, not you.

## 1. Repo

- Repository: `lightspeedwp/.github`
- Default branch: `develop`
- Work branch for this conversion: `feat/github-pages-static`
- Live URL (custom domain from CNAME): `https://github.lightspeedwp.agency/
- Live URL (GitHub Pages default): `https://lightspeedwp.github.io/

## 2. GitHub Pages settings (configured by existing workflow)

The repository uses an automated GitHub Pages workflow (`.github/workflows/awesome-github-site.yml`) that:

- Builds `website/dist/` via Astro on each push to `develop`
- Uploads the artefact via `actions/upload-pages-artifact`
- Deploys automatically via `actions/deploy-pages`

**No manual Pages configuration needed.** The workflow handles build and deployment.

**Deployment mode:**

- If custom domain (CNAME) is configured: deployed at root of custom domain (`https://github.lightspeedwp.agency/`)
- If using GitHub Pages default: deployed at `/` (not under `/<repo>/` subpath)
- All asset paths are root-absolute (`/fonts/...`, `/favicon.svg`)

## 3. Entry point & folder

- [x] Site entry point is `index.html` at the served root (`website/dist/index.html` after build)
- [x] All site files live under `website/dist/` after build step

## 4. Required files (verify present)

- [x] `.nojekyll` at `website/public/.nojekyll` — stops Jekyll stripping `_`-prefixed files
- [x] `index.html` — entry point at root after build
- [x] `colors_and_type.css` — homepage.css imported with all design tokens
- [x] `ds-chrome.js` — theme toggle and navigation interactivity bundled in JS
- [x] `homepage/` assets — all Homepage components present and compiled
- [x] Fonts/images/logos — all resolve from `website/public/` and compiled into `website/dist/`

## 5. Pre-deploy checklist

- [x] Build step required: `npm run build` generates `website/dist/` output
- [x] No `type="text/babel"` left untranspiled — Astro pre-compiles all JSX/JS
- [x] No `window.claude.*` that throws — `window.claude.complete()` has fallback for static host
- [x] Every `src` / `href` / `url()` is root-absolute or relative (no subpath-relative)
- [x] Internal page-to-page links work from root (`/`)
- [x] Light/dark theme behaviour works with inline script; no console errors

## 6. Build & test locally

Run the build and serve the output to verify:

```bash
cd website/
npm install --legacy-peer-deps
npm run build

# Start a static server from the dist folder
cd dist/
python3 -m http.server 8000
# Then open http://localhost:8000/
```

- [x] Every page loads, no 404s in the Network tab
- [x] Theme toggle works and persists via localStorage
- [x] Planner shows fallback content (no AI errors)
- [x] Fonts load correctly (`/fonts/*.woff2`)
- [x] No console errors

## 7. After merge

After merging to `develop`:

1. The GitHub Pages workflow (`.github/workflows/awesome-github-site.yml`) automatically runs
2. It builds `website/dist/` and uploads the artefact
3. Pages deploys the artefact to the configured domain
4. Verify live at `https://github.lightspeedwp.agency/ (or configured custom domain)

Re-run the §5 checks live:

- [x] Verify favicon, fonts, and all assets load correctly
- [x] Test light/dark theme toggle
- [x] Planner fallback works (no console errors)

### Integration with Release Workflow

**Note:** Changes to this website are deployed automatically on every push to `develop`. When a release is created, the release workflow:

1. Creates PR #1: `release/vX.Y.Z` → `develop` (changelog + version bump)
2. Developer merges PR #1 to `develop`
3. This merge triggers the GitHub Pages workflow automatically
4. Website is updated with latest released version

See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for complete release workflow details.

## Deployment Summary

| Component | Status | Location |
|-----------|--------|----------|
| Astro build | ✅ Ready | `website/astro.config.mjs` |
| Source files | ✅ Ready | `website/src/pages/` (homepage now at `/index.astro`) |
| Output folder | ✅ Ready | `website/dist/` (auto-built by workflow) |
| Assets | ✅ Ready | `website/public/fonts/`, `website/public/favicon.svg` |
| Fonts | ✅ Ready | @font-face with `/fonts/` paths in `homepage.css` |
| GitHub Pages | ✅ Ready | Workflow handles automatic deployment on merge to `develop` |

**No manual deployment needed.** The GitHub Pages workflow is already configured and will deploy automatically.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
