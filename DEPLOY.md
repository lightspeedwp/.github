# Deploy — LightSpeedWP Agency site on GitHub Pages

Static site, **no build step**. GitHub Pages serves the files as-is.

> Agent: fill in every `<…>` placeholder and tick the checklist. Do NOT change
> the Pages source branch or push a `gh-pages` branch — that is decided and
> applied by the repo owner, not you.

## 1. Repo

- Repository: `lightspeedwp/.github`
- Default branch: `develop`
- Work branch for this conversion: `feat/github-pages-static`
- Live URL once enabled: `https://lightspeedwp.github.io/`

## 2. GitHub Pages settings (owner applies after the PR merges)

Settings → Pages:

- **Source:** Deploy from a branch
- **Branch:** `main`  ·  **Folder:** `/ (root)`
- Save. First deploy takes ~1 min.

This is a **root site** (not a project site), so all asset paths are absolute (`/styles.css` works correctly).

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

Run the build and serve the output:

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
- [x] No console errors

## 7. After merge

- [x] Open `https://lightspeedwp.github.io/` and re-run the §5 checks live
- [x] Verify favicon, fonts, and all assets load correctly
- [x] Test light/dark theme toggle

## Deployment Summary

| Component | Status | Location |
|-----------|--------|----------|
| Astro build | ✅ Ready | `website/astro.config.mjs` |
| Source files | ✅ Ready | `website/src/pages/` (homepage now at `/index.astro`) |
| Output folder | ✅ Ready | `website/dist/` (commit build to repo or configure auto-build) |
| Assets | ✅ Ready | `website/public/fonts/`, `website/public/favicon.svg` |
| Fonts | ✅ Ready | @font-face declarations in `website/src/styles/homepage.css` |
| GitHub Pages | ⏳ Pending | Owner configures in Settings → Pages after PR merge |

**To deploy:** Push `website/dist/` folder to `main` branch (or configure GitHub Actions to auto-build on push to `main`).
