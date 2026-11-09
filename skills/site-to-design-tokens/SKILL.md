---
name: site-to-design-tokens
description: Propose design tokens for a website rebuild from the existing live site. Use when a project rebuilds a site and needs its colours, fonts, type sizes, spacing, radii, shadows, layout widths and breakpoints turned into variable ramps and semantic tokens in the LightSpeed (TSP) structure, before a prototype or theme is built. Crawls chosen pages at 390px and 1440px, writes an approval report that matches each live value to a token, then creates the Figma variables and a variables export for figma-to-block-theme.
---

# Site to Design Tokens

## Overview

Rebuild projects start from the live site's values. This skill measures them, proposes tokens in the TSP structure, and, once approved, creates them.

```text
live site → crawl (390px, 1440px) → proposal + report → approval → Figma variables and export JSON → figma-to-block-theme
```

Nothing is written to Figma or a theme until the reviewer approves the proposal.

## Companion skills

- `figma-use`: required before running the generated script through `use_figma`. Creating a token library also uses `figma-generate-library`.
- `figma-to-block-theme`: turns the export JSON (or the new Figma variables) into `theme.json` presets.

## Workflow

### 1. Agree the pages

Ask for the live site URL and 5 to 10 pages that cover its templates: home, a listing, a single item, a long text page, contact, and any store or booking pages. Use the **live** site, not a development copy that may already run a new theme, and record the date as the baseline. See [references/crawling.md](references/crawling.md).

### 2. Crawl

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/crawl-site-styles.ts --url https://www.example.com \
  --pages /,/about/,/tours/,/contact/ --out site-styles.json
```

Save the output to a scratch folder outside the repository. The crawler reads public pages one at a time, with a 1.5 second pause between requests.

### 3. Propose

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/propose-tokens.ts site-styles.json --out proposal.json --report proposal.md
```

The proposal follows the structure in [references/target-structure.md](references/target-structure.md):

- `base`, `contrast`, and `brand`, `primary`, `cta` and `neutral` ramps from 100 to 900, each built around a live colour that keeps its exact value
- the 44 semantic roles, taken from what elements use where the site shows it, and from the TSP defaults otherwise
- type, spacing, radius, shadow, layout and breakpoint scales, with Max (1440px) and Min (390px) values

### 4. Review with the user

Present the report's summary, its **Decisions for the reviewer** list and any failing contrast pairs. [references/proposal-review.md](references/proposal-review.md) explains each section. Common changes:

- **A colour in the wrong family:** re-run with `--assign brand=#hex,primary=#hex,cta=#hex`.
- **A wrong content or wide width:** re-run with `--layout content=768,wide=1240`. Content width is measured from running text, one vote per page, preferring blog posts, so include a blog post in the crawl.
- **A failing contrast pair:** propose the nearest passing step and record the change.
- **A live value with no close token:** keep the nearest token with the same role and list it for the reviewer. Don't add a raw value.

Repeat until the reviewer approves. Then ask: `Approve this token proposal and create the variables?`

### 5. Create the outputs

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/write-token-export.ts proposal.json \
  --export variables.json --figma-script create-variables.js
```

- **Figma:** confirm the target file with the user. Every Figma write needs approval. Load `figma-use` and run `create-variables.js` through `use_figma`. The script stops without changes if any of its collections or effect styles already exist. See [references/outputs.md](references/outputs.md).
- **theme.json:** hand `variables.json` to `figma-to-block-theme` (Tokens mode, from step 2 "Map"). Later edits made in Figma come back through that skill's Figma export.

### 6. Report

Post the proposal summary, the decisions taken and the created collections on the project's Linear issue.

### Next step

Rebuild the site's components, patterns, template parts and templates in Figma on these variables with `site-to-figma-components`. Pass it `variables.json` (`--tokens`).

## Rules

- **Read only public pages of the site you were given**, one at a time, with the default pause. Don't crawl logged-in, checkout or account pages.
- **Never invent a token.** Every token comes from a live value or a documented default, and the report says which.
- **Keep live values exact where they anchor a ramp.** Other steps are generated, unless a site colour fits the ramp and replaces the step it is closest to. The report lists each replacement.
- **Sizing ramps are in order.** Spacing and type sizes are created smallest first.
- **Approval first.** No Figma or theme writes before the reviewer approves.
- **Contrast.** Semantic text pairs need 4.5:1, and focus and border pairs need 3:1. Fix the pairs that fail or list them for the reviewer.

## Scripts

TypeScript run with `tsx` (`npx tsx <script> --help`). Tests are in `scripts/__tests__/`: run `npm run test:site-to-design-tokens` from the repository root.

| Script                          | Does                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `scripts/crawl-site-styles.ts`  | Records computed styles by element role at each viewport, with Puppeteer |
| `scripts/propose-tokens.ts`     | Builds the proposal JSON and the Markdown report                         |
| `scripts/write-token-export.ts` | Writes the variables export and the `use_figma` script                   |
| `scripts/lib/color.ts`          | OKLCH conversion, WCAG contrast and ramp building                        |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
