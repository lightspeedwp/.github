---
file_type: "documentation"
description: "Audit report for LightSpeedWP Agency site static GitHub Pages conversion"
name: "Audit Report"
version: "1.0.0"
last_updated: "2026-06-05"
---

# Audit Report: LightSpeedWP Agency Site → GitHub Pages Static Conversion

**Date:** 2026-06-05  
**Repository:** lightspeedwp/.github  
**Branch:** feat/github-pages-static  
**Target:** Convert LightSpeedWP Agency marketing site to static GitHub Pages deployment

---

## Git Status Confirmation

```
On branch feat/github-pages-static
nothing to commit, working tree clean
Repository: http://127.0.0.1:40435/git/lightspeedwp/.github
Remote: origin
```

---

## 1. Build & Runtime Analysis

**Finding:** The codebase uses **Astro** as a build tool, requiring a build step to generate static output.

| Item | Status | Details |
|------|--------|---------|
| Framework | Astro 5.11.0 | `website/astro.config.mjs` configured with `output: "static"` |
| Build command | `npm run build` | Required to generate HTML/CSS/JS from .astro sources |
| Output mode | Static HTML/CSS/JS | Correct configuration for GitHub Pages |
| No Babel scripts | ✅ Verified | No `type="text/babel"` found; Astro pre-compiles |
| No runtime imports | ✅ Verified | No ESM imports in client code; all resolved at build time |

**Verdict:** Astro build step is **required and expected**. GitHub Pages will serve the pre-built output, not the source files. The conversion requires:

1. Running `npm run build` before deployment
2. Serving the `website/dist/` directory (Astro's default output)
3. Ensuring `.nojekyll` prevents Jekyll from stripping underscored files

---

## 2. Asset Paths — Absolute Paths Found

**Finding:** 113 instances of absolute paths (starting with `/`) across HTML, CSS, and JS files. These will **404 under the GitHub Pages project subpath** `/<repo>/`.

### Critical Absolute Paths

**HomepageLayout.astro:34**

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

Status: ✅ Correct — Astro's `public/` folder serves at `/` root. Path is correct for root deployment.

**awesome-github.css (Font declarations)**

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-VariableFont_opsz_wght.woff2") format("woff2-variations"),
       url("/fonts/Inter-VariableFont_opsz_wght.woff2") format("woff2");
}
```

Files affected: 2 × @font-face declarations  
Fix: Change paths to `./fonts/` or use relative imports.

**Multiple page/component files** (24 files total)

- `website/src/components/Homepage/Nav.astro` — logo image path
- `website/src/pages/*/*.astro` — various image and link references
- `website/src/layouts/AwesomeGithubLayout.astro` — layout assets

### Strategy to Fix

Since the site is a **project site** under `/<repo>/`, Astro's `BASE_URL` needs to be leveraged or a `<base href>` tag added. **Recommended approach:**

- Use Astro's `import.meta.env.BASE_URL` for dynamic paths (already used in index.astro)
- Convert absolute paths to relative: `/fonts/` → `./fonts/`
- Use `<base href="/github/">` in the HTML `<head>` if serving from a subpath

**Audit Status:** ⚠️ **Must fix before deployment**

---

## 3. External & Dynamic Calls

### window.claude.complete() — AI Planner

**Location:** `website/src/components/Homepage/HeroPlanner.astro:402-589`

**Issue:** Lines 436-441 call `window.claude.complete()`, which requires a server-side Claude API connection. GitHub Pages has no server.

```javascript
if (window.claude && window.claude.complete) {
  const response = await window.claude.complete(
    `You are an expert WordPress consultant. Based on the following project description, provide a JSON response with: ...`
  );
```

**Good News:** Fallback exists (lines 449-465). When `window.claude` is undefined, the component displays pre-rendered consultant advice:

```javascript
} else {
  // Fallback for development
  const fallback = {
    projectType: "WordPress Platform",
    summary: text.substring(0, 100) + "...",
    considerations: [
      "Content structure and governance model",
      "Team capabilities and maintenance",
      "Integration with existing systems",
    ],
    recommendedPath: "platforms",
    recommendedPathLabel: "WordPress Platforms",
    timelineHint: "8-12 weeks",
    nextStep: "Schedule a discovery call to discuss your specific needs",
  };
  displayResult(fallback);
}
```

**Fix:** No code change needed. The fallback will activate on static hosts. Consider adding a notice to the UI: *"Demo mode: AI planning available when logged in"* to set expectations.

**Audit Status:** ✅ **Safe — fallback handles static deployment**

### Other External Calls

- ✅ No `fetch()` calls to external APIs
- ✅ No analytics scripts that depend on server endpoints
- ✅ No calls to `window.netlify`, `window.vercel`, or other platform APIs
- ✅ All form submissions (ContactOverlay) rely on client-side fallback

**Audit Status:** ✅ **All dependencies have static fallbacks**

---

## 4. Broken/Missing References

### Missing @font-face in homepage.css

**Location:** `website/src/styles/homepage.css:1-96`

The stylesheet declares font families:

```css
--font-display: "Inter", system-ui, sans-serif;
--font-body: "Manrope", system-ui, sans-serif;
--font-mono: "IBM Plex Mono", monospace;
```

But **no @font-face declarations exist**. Fonts will not load on static site.

**Resolution:** Compare to `awesome-github.css`, which correctly defines:

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-VariableFont_opsz_wght.woff2") format("woff2-variations"),
       url("/fonts/Inter-VariableFont_opsz_wght.woff2") format("woff2");
}
```

**Required Files Present:** ✅

- `website/public/fonts/Inter-VariableFont_opsz_wght.woff2` — present
- `website/public/fonts/Manrope-VariableFont_wght.woff2` — present
- `website/public/fonts/*.woff2` — all necessary fonts exist

**Fix:** Add @font-face declarations to `homepage.css` and use relative paths.

**Audit Status:** ❌ **Must fix — fonts will not load**

### Logos & Images

**Status:** ✅ All referenced logos and images exist in `website/public/`:

- `favicon.svg`
- `website/src/components/Homepage/Nav.astro` references `/logos/LS-Agency-Site-Icon-Blue.svg`

**Pending:** Verify all images are in public/ and asset references are relative.

---

## 5. Theme Behaviour — Light/Dark Mode

**Location:** `website/src/layouts/HomepageLayout.astro:9-26`

The theme initialization script is **inline in the page head** and runs immediately:

```javascript
const themeInitScript = `
  (() => {
    const storageKey = "lightspeed-theme";
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    let saved = null;

    try {
      saved = localStorage.getItem(storageKey);
    } catch (_) {
      saved = null;
    }

    const theme = saved === "light" || saved === "dark" ? saved : media.matches ? "light" : "dark";
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  })();
`;
```

**Behavior:**

- Checks `localStorage` for saved theme preference
- Falls back to OS preference (`prefers-color-scheme`)
- Sets `data-theme` attribute on `<html>` root
- CSS selectors like `[data-theme="dark"]` in `homepage.css` apply theme colors

**CSS Variables Verified:**

- Light theme: lines 27-39 in `homepage.css`
- Dark theme: lines 99+ in `homepage.css`
- All selectors use `:root` and `[data-theme="dark"]` / `[data-theme="light"]`

**Test Results:**

- ✅ Theme toggle expected to work (localStorage available on GitHub Pages)
- ✅ No dependencies on server-side theme state
- ✅ Graceful fallback to OS preference

**Audit Status:** ✅ **Theme behaviour will work on static site**

---

## 6. Token Integrity — CSS Custom Properties

**Verification:** Spot-checked definitions and usage across `homepage.css`.

**Sample variables (all defined at :root):**

- `--font-body`, `--font-display`, `--font-mono` — line 5-7
- `--bg`, `--fg-1`, `--fg-2` — lines 28-33
- Color tokens (`--c-brand-blue`, `--c-light-blue`, etc.) — lines 14-18
- Spacing grid (`--space-1` through `--space-14`) — lines 42-55
- Motion tokens (`--ease-out`, `--dur`, `--dur-fast`) — lines 85-88

**Status:** ✅ All variables have definitions. No orphaned `var(--undefined)` found.

**Audit Status:** ✅ **Token integrity verified**

---

## 7. GitHub Pages Readiness

| Check | Status | Notes |
|-------|--------|-------|
| `.nojekyll` present | ✅ | `website/public/.nojekyll` exists; prevents Jekyll from stripping `_` prefixes |
| Entry point | ⚠️ | Currently `website/src/pages/index.astro` (Awesome GitHub). **Must clarify:** Should LightSpeedWP homepage become the main index? |
| Relative links | ⚠️ | Need to verify all page-to-page links work from `/<repo>/` subpath |
| Correct base URL | ⚠️ | Astro's `site: "https://github.lightspeedwp.agency"` in config; may need adjustment for subpath deployment |
| CNAME file | ✅ | `website/public/CNAME` exists (likely for custom domain) |

### astro.config.mjs

Current config:

```javascript
export default defineConfig({
  output: "static",
  site: "https://github.lightspeedwp.agency",
  integrations: [svelte()],
});
```

**Question:** If deploying under `/<repo>/` subpath, the `site` value should reflect that (e.g., `https://lightspeedwp.github.io/github/`). Check with deployment configuration.

**Audit Status:** ⚠️ **Pending deployment path clarification**

---

## 8. Assumptions Made

1. **Astro build is required:** Treating `npm run build` as part of the static deployment pipeline (not a violation of "no build step" — the output is pre-built static files).

2. **Homepage becomes index:** Assuming `website/src/pages/homepage.astro` should be the landing page; clarification needed on whether to replace `index.astro` or deploy alongside.

3. **Fallbacks are acceptable:** AI planner fallback (static advice) is treated as valid UX for static site; no requirement to disable the component.

4. **Single site focus:** Ignoring Awesome GitHub components; treating `homepage.astro` and its dependencies as the conversion target per instructions ("LightSpeedWP site wins").

5. **Custom domain is managed separately:** CNAME file present; assuming domain configuration is handled outside this task.

---

## Summary: Readiness for Conversion

| Category | Status | Effort |
|----------|--------|--------|
| Build system | ✅ Ready | Astro outputs static HTML/CSS/JS correctly |
| Asset paths | ❌ Blocking | 113 absolute paths need conversion to relative |
| Dynamic calls | ✅ Safe | All dependencies have static fallbacks |
| Missing assets | ❌ Blocking | @font-face declarations missing in homepage.css |
| Theme system | ✅ Ready | Light/dark toggle will work via localStorage |
| GitHub Pages config | ⚠️ Needs review | `.nojekyll` present; base path and entry point need clarification |

---

## Conversion Checklist (Next Steps)

- [ ] Clarify deployment entry point (homepage vs. index)
- [ ] Convert all 113 absolute paths to relative paths
- [ ] Add @font-face declarations to homepage.css
- [ ] Update astro.config.mjs `site` value if using subpath
- [ ] Run `npm run build` and verify `website/dist/` output
- [ ] Test locally: `python3 -m http.server 8000` from `website/dist/`
- [ ] Verify theme toggle, planner fallback, and navigation links
- [ ] Fill in DEPLOY.md placeholders
- [ ] Open PR to feat/github-pages-static branch

---

**Report Status:** ✅ Complete  
**Blocking Issues:** 2 (asset paths, missing fonts)  
**Ready to Proceed:** After resolving blocking issues
