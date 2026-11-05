---
name: site-to-figma-components
description: Rebuild a live website's building blocks in Figma as a design system for a WordPress rebuild. Use after site-to-design-tokens has created the Figma variables, when a project needs the site's components (buttons, cards, form fields, navigation, accordions, sliders), patterns (heroes, card grids, call-to-action bands), template parts (header, footer, sidebar) and templates (one frame per page type) built in Figma from those variables. Crawls chosen pages at 390px and 1440px, writes an inventory report for approval, then builds component sets, parts, patterns and templates bound to semantic tokens, verifies them against the live pages, and writes a manifest that maps each Figma node to its WordPress target for figma-to-block-theme Pattern mode.
---

# Site to Figma Components

## Overview

The third step of a rebuild. Tokens come first, then this skill, then the theme.

```text
site-to-design-tokens → crawl → inventory report → approval → Figma build → verify → manifest → figma-to-block-theme (Pattern mode)
```

It stops for approval between stages. Nothing is written to Figma before the reviewer approves the inventory.

## Companion skills

- `figma-use`: **required before every `use_figma` call**, read-only ones included.
- `figma-generate-library`: component sets, variant properties and variable bindings (stage 3).
- `figma-generate-design`: composing parts, patterns and templates from instances (stage 3).
- `audit-design-system` and `fix-design-system-finding`: the design system audit (stage 4).
- `site-to-design-tokens`: must have run first. Its variables export is this skill's `--tokens` input.
- `figma-to-block-theme`: reads the manifest in Pattern mode. `wp-block-themes` and `wp-patterns` cover the WordPress side.

If a companion skill is missing, say so and stop rather than calling Figma tools directly.

## Stage 1: Inventory

1. **Agree the pages** with the reviewer: one or two public pages per template, from the site's sitemap. See [references/crawling.md](references/crawling.md).
2. **Crawl** (scratch folder outside the repository). Install the repository's dependencies first and set `SITE_TO_FIGMA_REPO_ROOT` to the absolute path of its checkout. The `--prefix` option selects its pinned `tsx` while keeping output in the scratch folder:

   ```bash
   npx --prefix "$SITE_TO_FIGMA_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/crawl-site-structure.ts --url https://www.example.com \
     --pages '/,/tours/example/,/blog/,/?s=safari' --out site-structure.json --shots shots
   ```

3. **Get the tokens.** Use the `variables.json` from `site-to-design-tokens`, or export the variables from the project's Figma file with the script in `figma-to-block-theme`'s `references/figma-access.md`.
4. **Propose**, then take one example screenshot per item:

   ```bash
   npx --prefix "$SITE_TO_FIGMA_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/propose-inventory.ts site-structure.json --tokens variables.json \
     --theme <theme-slug> --out inventory.json --report inventory.md --shots shots
   npx --prefix "$SITE_TO_FIGMA_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/crawl-site-structure.ts --url https://www.example.com \
     --shoot inventory.json --shots shots
   ```

## Stage 2: Approval report

Present `inventory.md`: the decisions list first (with a proposal for every value that has no token), then each table. [references/inventory-review.md](references/inventory-review.md) explains the sections. The reviewer approves, renames, merges or cuts items. Record the answers in `decisions.json`, including the **build scope** (`"build"`: the templates and items to import), re-run `propose-inventory.ts` with `--decisions decisions.json`, and repeat until the report says **approved** and lists the build scope. How items are found, named and mapped is in [references/classification.md](references/classification.md).

## Stage 3: Figma build

Confirm the target file and pages, add the variables the reviewer approved, then follow [references/figma-build.md](references/figma-build.md). Build only the approved scope, in this order:

1. **Components**: component sets with variant properties, Auto Layout, text styles and a variable on every fill, stroke, gap, padding, radius, font and effect. Each description names its WordPress block.
2. **Template parts and patterns**: composed from component instances.
3. **Templates**: composed from parts and patterns, at 1440px, and at 390px where the report says the layout changes.

Record each built node ID in `figma-nodes.json` as you go.

## Stage 4: Verify

Compare each frame with the live page at both widths, list the differences, and run the design system audit until it is clean. See [references/verification.md](references/verification.md).

## Stage 5: Hand-off

```bash
npx --prefix "$SITE_TO_FIGMA_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/write-manifest.ts inventory.json --nodes figma-nodes.json \
  --out manifest.json --markdown manifest.md
```

Add `--partial` while only some items are built. Hand `manifest.json` to `figma-to-block-theme` Pattern mode and post `manifest.md` on the project's Linear issue. See [references/manifest.md](references/manifest.md).

## Rules

- **Approval first.** No Figma writes before the inventory is approved, and confirm the target file and pages before the first write.
- **Tokens only.** Every colour, size, space, radius and shadow binds to a variable, semantic tokens before primitives. A value with no token gets a proposal for the reviewer: fonts match the live site (an `Alternate` family), colours fit the ramps, sizes get a new ramp step in order, and one-offs become semantically named `custom/*` variables. Nothing is added without approval.
- **Approved build scope.** The reviewer approves which templates to build before any import.
- **Public pages only**, one at a time at the default pace. Never log in, submit a form, click or type. Hovering and focusing to read states is allowed.
- **Archive, don't delete.** Move superseded Figma items to an archive page (`node.remove()` is blocked) and check prototype link destinations before moving anything.
- **No em dashes** in Figma copy or document text.
- **Real content.** Use the site's headings, labels and images, uploaded with the Figma image tools.

## Scripts

TypeScript run with `tsx` (`npx --prefix "$SITE_TO_FIGMA_REPO_ROOT" tsx <script> --help`). Tests are in `scripts/__tests__/`: run `npm run test:site-to-figma-components` from the repository root.

| Script | Does |
| --- | --- |
| `scripts/crawl-site-structure.ts` | Records regions, sections and components with shape, style, states and content, with Puppeteer; `--shoot` takes example screenshots |
| `scripts/propose-inventory.ts` | Clusters and classifies, maps to WordPress, binds to tokens, writes the inventory and report, applies decisions |
| `scripts/write-manifest.ts` | Maps built Figma nodes to WordPress targets for Pattern mode |
| `scripts/lib/tokens.ts`, `scripts/lib/color.ts` | Token matching and colour helpers |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
