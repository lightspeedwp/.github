# Handoff: Awesome GitHub website (LightSpeedWP `.github` control plane)

## TL;DR for Claude Code
You could not fetch the design via URL because that endpoint returns gzip‑compressed binary. **Ignore the URL.** Everything you need is in this folder, on disk:

- `design_source/` — the working design prototype (open `design_source/Awesome GitHub.html` in a browser to see it run). This is the source of truth for layout, copy, tokens, and behaviour.
- `screenshots/` — rendered reference images of the key views.
- This `README.md` — a self‑sufficient spec.

**Your task:** recreate this design inside the existing Astro site at `lightspeedwp/.github` → `website/`, using Astro's existing patterns/components. Do **not** drop the prototype's React+Babel runtime into Astro. Port the markup, tokens, and CSS into idiomatic `.astro` components.

---

## Overview
"Awesome GitHub" is a browsable catalogue + learning site for the **`lightspeedwp/.github`** repository — the org‑wide control plane that ships the agents, instructions, prompts, skills, hooks, workflows, plugins, and tools the LightSpeed WordPress/WooCommerce team uses for consistent AI operations. Visitors browse each resource type, read detail pages, copy/install files, follow a getting‑started flow, and work through self‑paced learning tracks.

## About the design files
The files in `design_source/` are a **design reference built in HTML/React** — a prototype showing intended look and behaviour, **not** production code to paste in. The React+Babel setup exists only so the prototype runs in a single browser tab. Recreate the designs in the Astro codebase's established environment (Astro components, its routing, its CSS approach). Lift exact values — hex codes, spacing, type, copy — from the source and screenshots.

## Fidelity
**High‑fidelity.** Final colours, typography, spacing, copy, and interactions are all decided. Recreate pixel‑faithfully using the design tokens below (already in `design_source/colors_and_type.css`).

---

## Target codebase

- Repo: `https://github.com/lightspeedwp/.github` (branch `develop`)
- Astro site lives in `website/`
- New page route to create: `website/src/pages/awesome-github/index.astro` (plus sub‑routes — see Routing). Confirm the existing `src/layouts`, `src/components`, and global CSS conventions and reuse them.

## Routing (the prototype is hash‑based; port to Astro file routes)

| Prototype hash | View | Suggested Astro route |
| --- | --- | --- |
| `#/` | Home | `/awesome-github/` |
| `#/c/:cat` | Catalogue (agents, instructions, prompts, skills, hooks, workflows, plugins, tools) | `/awesome-github/c/[cat]` |
| `#/item/:id` | Resource detail | `/awesome-github/item/[...id]` |
| `#/getting-started` | Onboarding (10‑minute) | `/awesome-github/getting-started` |
| `#/learn`, `#/learn/:track`, `#/learn/:track/:lesson` | Learning centre | `/awesome-github/learn/[...]` |
| `#/cookbook`, `#/cookbook/:slug` | Cookbook recipes | `/awesome-github/cookbook/[...]` |
| `#/glossary`, `#/glossary/:term` | Glossary | `/awesome-github/glossary/[...]` |
| `#/why`, `#/references` | Editorial pages | `/awesome-github/why`, `/awesome-github/references` |

Data for these lives in the plain JS files (`data.js`, `content-data.js`, `learn-data.js`, `glossary-data.js`) — port them to Astro content collections or local JSON/TS as fits the repo.

---

## Design tokens (source: `design_source/colors_and_type.css`)

This is the **LightSpeedWP design system**. Use these exact values.

### Colour — brand & neutrals

- Brand blue (all CTAs): `#1E6AFF` · hover `#1857D6` · press `#1444B0` · soft `rgba(30,106,255,0.10)`
- Speed highlight (cyan/light‑blue): `#7BE7FF`
- Ink / near‑black: `#090909` · pure white `#FFFFFF`
- Neutrals: `#F9FAFB` (off‑white sections) · `#F0F0F0` · `#E1E1E1` (hairline) · `#B8B8B8` · `#909090` · `#757575` · `#565656` · `#404040`
- Status: success `#16A34A` / `#00D084` · warning `#F59E0B` · error `#EF4444` · info `#1E6AFF`

### Semantic — light mode (default)
`--bg #FFFFFF` · `--bg-alt #F9FAFB` · `--fg #090909` · `--fg-2 #565656` · `--fg-3 #757575` · `--border #E1E1E1` · `--accent #1E6AFF` · `--fg-link #1E6AFF` (use `#1557E0` for links on `#F9FAFB` to keep ≥4.5:1).

### Semantic — dark mode (`[data-theme="dark"]`)
`--bg #0F1014` · `--fg #FFFFFF` · `--fg-2 #B8B8B8` · `--border rgba(255,255,255,0.08)` · `--accent #7BE7FF` (light‑blue for AAA contrast on dark) · links use light‑blue. The hero and several full‑bleed sections render dark; content sections render light. Theme toggle is in the nav.

### Typography

- Display/headings: **Inter** (variable, self‑hosted in `design_source/fonts/`), weights 700–800 hero, 700 sections, 600 H4.
- Body: **Manrope** (variable, self‑hosted), 400/500.
- Mono (code, file paths, kbd): **IBM Plex Mono** (Google Fonts).
- Quote/pull‑quote: **Lora** italic (Google Fonts), used sparingly.
- Scale: display‑xl `clamp(48px,6vw,80px)` · h1 `clamp(40px,4.5vw,60px)` · h2 `clamp(32px,3.4vw,48px)` · h3 40px · h4 24px · h5 20px · h6 16px · lead 20px · body 16px · body‑sm 14px · code 13px · eyebrow 12px.
- Tracking: display `-0.02em`, headings `-0.01em`, eyebrow `+0.12em` UPPERCASE.
- Line‑heights: display 1.18, heading 1.25, body 1.5.

### Spacing / layout / radii / shadows / motion

- 8‑pt grid: 4/8/12/16/20/24/32/40/48/64/80/96/128/160px.
- Container max `1280px`, prose max `720px`, gutter `32px`, section padding `96px` Y (hero `160px` Y).
- Radii: 2/4/8/12/16/24/9999px — `4` buttons, `8` inputs/small cards, `12` content cards, `9999` pills/chips/avatars.
- Shadows: `--shadow-md 0 6px 16px rgba(9,9,9,.08)` rest, `--shadow-lg 0 18px 40px rgba(9,9,9,.12)` on hover. Near‑black, never blue‑cast (except hero CTA `--shadow-xl`).
- Motion: default ease `cubic-bezier(.2,.8,.2,1)` at `200ms`. Hovers translate ≤2px, solid buttons darken ~10%. No bounce on chrome.

---

## Screens / views

### 1. Home (`screenshots/01-home-hero-dark.png`, `02-home-scrolled.png`)

- **Dark hero**, full‑bleed `#0F1014` with faint dot/grid texture. Eyebrow pill `● github.com/ lightspeedwp/.github` (cyan dot). H1 in two lines: line 1 white "Install AI governance,", line 2 light‑blue (`#7BE7FF`) "not opinions." Inter ~700–800.
- Lead paragraph in `--fg-2`, with an inline mono `.github` chip.
- CTA pair: **Start here** (solid brand‑blue, white text, arrow icon, radius 4) + **Browse catalogues** (ghost/outline, fills `accent-soft` on hover).
- Below the fold: catalogue grid, stat strip, editorial blocks (light sections alternating white / `#F9FAFB`).

### 2. Catalogue (`screenshots/03-catalogue-agents.png`)

- Light page. Breadcrumb (`Home / Agents`). Header row: square icon tile (rounded 12, soft tint bg, brand‑blue Heroicon) + H1 + one‑line blurb.
- A **type note banner** (tinted strip) explaining the interaction model for this resource type (e.g. "Single‑file" badge + "A single‑file Copilot customisation — copy the raw file or install it straight into VS Code.").
- Filter input ("Filter 9 agents…") with live count `9 / 9` on the right.
- Tag chips row (pills, hairline border) for filtering by tag.
- Grid of resource cards: icon, title, badge (e.g. `Single-file`), version + date meta (mono). Cards lift on hover.

### 3. Resource detail (`#/item/:id`)

- Breadcrumb + title + type badge. Action buttons: Copy raw / Download / Open on GitHub / Install in VS Code (`vscode:` deep link) — which appear depends on the item's **type** (see interaction matrix in `data.js`: `install`, `aiDefault`, `workflow`, `guardrail`, `pack`, `script`, `schema`, `recipe`). Body renders markdown.
- GitHub URLs are built at render time from a `main`⇄`develop` branch switch (see `urlsFor()` in `data.js`).

### 4. Learning centre (`screenshots/04-learn-centre.png`)

- Dark hero with eyebrow `LEARNING CENTRE`, two‑line H1 (white + light‑blue), lead, and a **progress bar** ("2 of 10 lessons read") persisted in localStorage. A Wapuu mascot illustration sits right of the hero (asset in `design_source/assets/`).
- Track cards below ("TRACK 1 / Getting oriented", lesson count badge `1/2`).
- Lesson reader renders markdown with prev/next + progress tracking.

### 5. Getting started / onboarding (`screenshots/05-getting-started.png`)

- Light page. Breadcrumb, eyebrow `ONBOARDING`, large H1 "Up and running in ten minutes". Lead with inline `.github` mono chip.
- A **clone command** block (mono, with a Copy button) inside a hairline card.
- Numbered steps (circular brand‑blue number badge + step title + body), e.g. "1 Set the org default".

### Global chrome (all views)

- **Sticky top nav, 72px**, never auto‑hides. Left: LS glyph + "Awesome **GitHub**" wordmark (GitHub in brand‑blue). Right: search button (opens command palette, `Cmd/Ctrl+K`), hamburger/menu, theme toggle. Uses `backdrop-filter: blur(12px)` over translucent bg.
- **Search palette**: modal command palette, keyboard‑navigable, searches all resources.
- **Footer**: dark `#090909`, full‑bleed, soft cyan halo around the LS mark. Reassurance line "Crafted with care in WordPress."
- **Toast**: transient confirmation (e.g. on copy), auto‑dismiss ~2.2s.

---

## Interactions & behaviour

- Branch switch (`main`⇄`develop`) rewrites every GitHub/raw/`vscode:` URL — keep this; it's central.
- Copy‑to‑clipboard buttons fire a toast.
- `Cmd/Ctrl+K` opens search; Esc closes.
- Learn progress + theme choice persist in localStorage.
- Hover: cards lift 4px (`--shadow-lg`), solid buttons darken ~10%, ghost buttons fill `accent-soft`, links underline. Press: solid darken + `scale(.99)`. Focus: 2px brand‑blue outline at 2px offset — never remove it.
- Respect `prefers-reduced-motion`.

## State

- `theme` (light/dark, persisted), `branch` (main/develop, persisted), current route, search‑open, toast message, learn progress (persisted). Port to Astro + minimal client islands (or nanostores) where interactivity is genuinely needed; render everything else statically.

## Assets (in `design_source/assets/` and `fonts/`)

- Logos/glyphs: `LS-Agency-Logo-{Blue,White}.svg`, `LS-Agency-Site-Icon-{Blue,Light-Blue,White}.svg` — official, do not recolour outside these colourways; preserve clear‑space.
- Mascots: `wapuu-astropuu.png`, `wapuu-yoduu.png`, `wapuu-rocket.svg`.
- Fonts: `Inter-VariableFont_opsz_wght.woff2`, `Manrope-VariableFont_wght.woff2` (self‑host these in Astro; IBM Plex Mono + Lora via Google Fonts or self‑host too).
- Icons: **Heroicons** (outline 24×24, 1.5px stroke). The prototype inlines them in `icons.jsx` — map to your Astro icon approach.

## Files in `design_source/`

- `Awesome GitHub.html` — entry; shows load order.
- CSS: `colors_and_type.css` (all tokens — **port first**), `app-styles.css`, `extra-styles.css`, `pages-v2.css`.
- Data (plain JS, easy to read/port): `data.js` (catalogue + interaction matrix + URL builders), `content-data.js`, `learn-data.js`, `glossary-data.js`.
- Components (React/JSX — read for structure & copy, re‑author as `.astro`): `app.jsx` (router/mount), `chrome.jsx` (nav/footer/toast/theme), `search.jsx`, `views.jsx` (home/catalogue/detail), `pages.jsx`, `tools.jsx`, `cookbook.jsx`, `learn.jsx`, `onboarding.jsx`, `content-pages.jsx`, `markdown.jsx`, `icons.jsx`.

## Suggested order of work

1. Port `colors_and_type.css` tokens into the Astro global stylesheet; self‑host the two woff2 fonts.
2. Build the shared layout: sticky nav + footer + theme toggle.
3. Build the home page (dark hero + catalogue grid).
4. Build the catalogue list + resource detail (with branch switch + copy/install actions) from `data.js`.
5. Add getting‑started, learn, glossary, cookbook, editorial pages.
6. Wire search palette + toast as small client islands.
