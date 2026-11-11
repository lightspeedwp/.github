---
name: theme-screenshot
description: Make a WordPress theme's screenshot.png (1200 by 900) from the site's logo. Use when a block theme has no screenshot, so Appearance > Themes shows a blank card and Theme Check flags it. Finds the logo from a file or a live site (custom logo, header logo, then og:image), takes colours from the theme.json palette with overrides, adds an industry line and the year, and renders the image with Puppeteer in the style of the KWV and Southern Destinations themes.
---

# Theme Screenshot

## Overview

Generated block themes need a `screenshot.png`. This skill makes one in the house style: the site's logo centred on a soft radial gradient in the theme's colours, a thin divider, an industry line in spaced capitals, and "WordPress block theme · 2026" (the current year).

```text
logo (file or live site) + theme.json palette + industry line → HTML → Puppeteer → screenshot.png (1200 x 900)
```

References for the look: `kwv-theme-2026` (dark background, gold accent) and `sd-theme-2026` (light background, brown logo).

## Before you start

The script runs from the `.github` repository checkout and needs its dependencies and a browser:

- Run `npm ci` in the `.github` checkout. Without it `tsx` and Puppeteer are missing.
- If the browser fails to launch, run `npx puppeteer browsers install chrome`. npm 11 blocks Puppeteer's install script, so the browser is not downloaded automatically.

## Workflow

### 1. Gather the inputs

Ask for:

- **The logo.** A file (PNG, JPG, GIF, WebP or SVG; SVG is best), or the live site's URL. From a live site the script looks for the custom logo (`.custom-logo`), then a header image named or labelled "logo", then `og:image`. It reads one public page and one image.
- **The theme's `theme.json`**, for the colours. Without one the script uses black and white, so pass `--base`, `--contrast` and `--accent`.
- **The industry line**, for example "Tour operator" or "Wine & spirits".
- **The year**, if it is not the current one.

### 2. Make the screenshot

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/make-theme-screenshot.ts \
  --site https://www.example.com \
  --theme-json wp-content/themes/my-theme/theme.json \
  --industry "Tour operator" \
  --out wp-content/themes/my-theme/screenshot.png
```

Use `--logo logo.svg` instead of `--site` for a file. Other options:

| Option                             | Does                                                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--mode light\|dark\|auto`         | Light uses the `base` colour. Dark uses `contrast`. `auto` (default) gives a light logo a dark background and a dark logo a light one. |
| `--base`, `--contrast`, `--accent` | Override a palette colour with a hex value. The accent is the divider and, in dark mode, the tagline.                                  |
| `--label`                          | Replaces "WordPress block theme".                                                                                                      |
| `--year`                           | Replaces the current year.                                                                                                             |

The accent is the first of `brand-600`, `brand-500`, `primary-600`, `primary-500`, `cta-600` and `cta-500` that the palette has.

### 3. Look at the image

Open the PNG before handing it over. Check that the logo is sharp and not clipped, the text is readable on the background, and the colours match the theme. If the logo came from `og:image` it may be a photo or a cropped banner: ask for a proper logo file instead. If the logo has little contrast with the background, set `--mode` or the colours.

## Rules

- **Public pages only.** The script reads the one page and image you point it at and nothing else. It refuses anything that is not http or https.
- **Keep the output with the theme** (`screenshot.png` in the theme root, not in a scratch folder), but make test runs in a scratch folder.
- **Never invent a logo.** If none is found, the script stops and asks for a file.
- **A raster logo is never enlarged**, because that blurs it. A small raster logo stays small, so ask for a larger file or an SVG.

## Scripts

TypeScript run with `tsx` (`npx tsx <script> --help`). Tests are in `scripts/__tests__/`: run `npm run test:theme-screenshot` from the repository root.

| Script                             | Does                                                        |
| ---------------------------------- | ----------------------------------------------------------- |
| `scripts/make-theme-screenshot.ts` | Command line, orchestration and the Puppeteer renderer      |
| `scripts/lib/logo.ts`              | Finds the logo on a live site and loads it from file or URL |
| `scripts/lib/palette.ts`           | Reads the theme.json palette and plans the colours          |
| `scripts/lib/template.ts`          | The HTML for the screenshot and the logo sizing             |
| `scripts/lib/colour.ts`            | Hex parsing, mixing and luminance                           |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
