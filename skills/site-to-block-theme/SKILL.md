---
name: site-to-block-theme
description: Build or fix a WordPress block theme's templates, template parts, patterns and cards so they match an existing live site, without a Figma layout step. Use when a rebuild copies the live site directly, for example 'rebuild the homepage from live', 'match the footer to live', 'port this section from the old site into the new theme', 'why does this card look different from live' or 'compare local with live'. Measures live with computed styles at 390, 768 and 1440, maps every value to the theme's theme.json tokens, builds with the official WordPress skills to current WordPress coding standards, then proves the match with side-by-side screenshots, a style diff and an accessibility check.
---

# Site to Block Theme

## Overview

The direct route from a live site to block theme files. The live page is the source for layout, content and styles; the theme's `theme.json` is the source for tokens.

```text
site-to-design-tokens (tokens) → site-to-block-theme: inventory → measure → map to tokens → build → check local → prove
```

Use the Figma route instead (`site-to-figma-components`, then `figma-to-block-theme` Pattern mode) when the design is changing and needs sign-off in Figma first. Use this skill when the rebuild matches the live site as it is.

It stops for approval after the inventory, and again before any new token.

## Companion skills

This skill holds only the live-site workflow and LightSpeed conventions. WordPress mechanics come from the **official WordPress skills** ([WordPress/agent-skills](https://github.com/WordPress/agent-skills)). Load them; don't work from memory:

| Skill                                   | Load it for                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `wordpress-router`, `wp-project-triage` | Step 0: classify the repository and its tooling                                           |
| `wp-block-themes`                       | `theme.json`, templates, template parts, style variations, the style hierarchy and caches |
| `wp-patterns`                           | Pattern registration, file headers, block markup, i18n and escaping                       |
| `wp-block-development`                  | Only if no core block can do the job (the block then belongs in the project plugin)       |
| `wp-interactivity-api`                  | Any front-end behaviour: menus, sliders, accordions, filters                              |
| `wp-performance`                        | Images, fonts and script loading on the built page                                        |
| `wp-wpcli-and-ops`                      | WP-CLI: caches, database template copies, options                                         |
| `wp-phpstan`                            | Themes that run PHPStan                                                                   |

LightSpeed skills:

- `site-to-design-tokens`: if the theme has no tokens yet, run it first.
- `figma-to-block-theme`: its [theme profile](../figma-to-block-theme/references/theme-profile.md) is step 0 here, and its Complete mode fills missing `theme.json` block settings.
- `theme-color-token-enforcer` and `theme-orphaned-refs`: run after the build in themes with semantic colour tokens.
- `wp-blockstyle-css-field`: the limits of the `css` field in block and section styles.
- `wp-pattern-runtime-pitfalls`: patterns that render nothing or stale data.
- `wp-db-override-reconciliation`: when a Site Editor copy in the database hides the theme file.
- `theme-screenshot`: the theme's `screenshot.png`.

If an official WordPress skill is not installed, say so and install it from WordPress/agent-skills before building.

## Current WordPress, not memory

WordPress changes every release. Before you write code, read [references/wordpress-standards.md](references/wordpress-standards.md) and:

1. Find the version the theme targets: the `theme.json` `$schema` and `version`, `Requires at least` and `Tested up to` in `style.css`, and `wp core version` on the local site.
2. Look up anything version-sensitive in the current documentation (Context7, the Block Editor Handbook, the Theme Handbook, the `theme.json` reference for that version and the Core dev notes), not in recalled knowledge.
3. Build to the WordPress Coding Standards with the theme's own lint, PHPCS and test commands, and leave them passing.

## Step 0: Theme profile and project rules

1. Read the theme's `AGENTS.md`, `CLAUDE.md`, `.claude/rules/` and `CONTRIBUTING.md`. Project rules win over this skill.
2. Build the theme profile from [figma-to-block-theme's theme-profile.md](../figma-to-block-theme/references/theme-profile.md): theme root, text domain, colour model (preset-direct or semantic), where tokens live, the pattern, part and style layouts, and the lint and test commands.
3. Note the live URL, the local URL and how to run WP-CLI locally (for example `studio wp` in WordPress Studio).

## Step 1: Inventory before building

1. Read the issue: acceptance criteria and comments.
2. Find every place the thing appears on live (a card may be on the homepage, an archive and a mega menu). List each variant and each state.
3. Check the theme for something that already does the job: `patterns/`, `parts/`, `templates/`, block styles and section styles. Reuse or extend it; don't add a near-copy.
4. Show the inventory and a short plan (files to add or change, blocks to use, open questions) and wait for approval. One message is enough for a small piece of work.

## Step 2: Measure live

Computed styles, not the site's CSS files: live CSS is overridden in many places. Write a selectors file (one name per element, with a separate live and local selector where the markup differs), then measure at 390, 768 and 1440 in default, hover and focus. See [references/measuring.md](references/measuring.md).

```bash
npx --prefix "$SITE_TO_BLOCK_THEME_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/measure-page.ts \
  --url https://www.example.com/ --selectors selectors.json --side live --out live.json --shots shots
```

Work in a scratch folder outside the theme. Also record what styles can't show: image ratios and crops, link targets, sticky and scroll-triggered behaviour, and anything that only appears at one width.

## Step 3: Map values to tokens

```bash
npx --prefix "$SITE_TO_BLOCK_THEME_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/map-to-tokens.ts live.json \
  --theme-json <theme>/theme.json [--theme-json <theme>/<preset-slice>.json ...] --out tokens.json --report tokens.md
```

Pass one `--theme-json` for `theme.json` and one for each preset slice the theme profile lists, in the order the theme merges them (later files win). A token that lives only in a slice you leave out is reported as missing.

If any width failed to measure, the report says the capture is incomplete and the script exits with an error: re-measure first. `diff-measurements.ts` does the same when either side failed or the widths don't match.

`tokens.md` lists the values with no exact token first. For each one:

- **Exact:** use the token. When several match, pick the semantic token whose role fits (`text`, `surface`, `border`), not the palette slug.
- **Near:** use the nearest token with the same role and list it under "Differences from live" in the pull request.
- **None:** propose a new token (name, value, role) and stop for approval. New tokens go through the design source first (Figma, or `site-to-design-tokens`). Never hardcode the value.
- Fonts always match live.

## Step 4: Build

Follow `wp-block-themes` and `wp-patterns`, the theme's rules and [references/wordpress-standards.md](references/wordpress-standards.md):

- **JSON first:** `theme.json`, block styles and section styles. Use the theme's stylesheet only when JSON can't do it (see `wp-blockstyle-css-field`).
- **Core blocks first.** Query Loop and Post Template for listings; block bindings for post data where the theme already uses them. Ask before adding a binding source or a custom block.
- **Patterns** in `patterns/*.php` with the theme's namespaced slug, full header metadata, translated strings in the theme's text domain and late escaping.
- **Tokens only** in markup and styles: `var:preset|spacing|30` in block attributes and `var(--wp--custom--…)` for semantic colours, as the theme profile says. No raw hex, px or font names.
- **No plugin features in the theme:** post types, fields, cron and integrations belong in the project plugin. Output must still render sensibly when that plugin is off.
- Real content from live: headings, labels, images (with alt text) and links.

## Step 5: Check the local site

1. Clear caches after adding patterns or styles (`wp transient delete --all`, or the theme's documented step).
2. Look for database copies of templates and parts that would hide the theme file:

   ```bash
   wp post list --post_type=wp_template,wp_template_part --fields=ID,post_name,post_type --format=table
   ```

   If one matches what you're building, follow `wp-db-override-reconciliation`: copy any wanted Site Editor changes into the file, then remove the database copy so the file renders. Ask before deleting a copy you didn't create.

3. Open the page in the editor and confirm no block shows "unexpected or invalid content".

## Step 6: Prove it

1. Measure local with the same selectors file and `--side local`, then diff:

   ```bash
   npx --prefix "$SITE_TO_BLOCK_THEME_REPO_ROOT" tsx ${CLAUDE_SKILL_DIR}/scripts/diff-measurements.ts live.json local.json \
     --out diff.json --report diff.md
   ```

   Fix each difference, or keep it and say why.

2. Put the local screenshots next to live's at 390, 768 and 1440, and fix any difference you can see that the diff missed.
3. Run an accessibility check (axe, through the theme's Playwright setup where it has one) and the theme's lint, PHPCS, JSON validation and tests.
4. Hand over: the screenshots side by side, the commands you ran and their results, a commit message and a pull request description with "Differences from live" (from `diff.md` and the near tokens) and "How to test".

## Rules

- **Live is the only source** for layout and content: not a staging copy, and not Figma unless the project says so.
- **Approval first:** after the inventory, and before any new token.
- **Read-only on live:** public pages only. Hover and focus to read states; never log in, click through checkout, type or submit.
- **Tokens only.** Nearest token plus a note beats a hardcoded value.
- **Current standards:** look up version-sensitive APIs; leave the theme's lint and tests passing.
- **Don't commit or push** unless the project's rules and the user say so.
- **No em dashes** in visible copy.

## Scripts

TypeScript run with `tsx`. Install the repository's dependencies first and set `SITE_TO_BLOCK_THEME_REPO_ROOT` to the absolute path of its checkout; `--prefix` selects its pinned `tsx` and Puppeteer while output stays in your scratch folder. Every script takes `--help`. Tests are in `scripts/__tests__/`: run `npm run test:site-to-block-theme` from the repository root.

| Script                                                                               | Does                                                                                                  |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `scripts/measure-page.ts`                                                            | Computed styles of named elements per width and state, plus full-page screenshots, with Puppeteer     |
| `scripts/map-to-tokens.ts`                                                           | Matches each live value to the theme's tokens (fluid sizes per width) and writes the decisions report |
| `scripts/diff-measurements.ts`                                                       | Compares live and local measurements and writes the "Differences from live" table                     |
| `scripts/lib/theme-tokens.ts`                                                        | Reads presets and custom tokens from `theme.json`, including WordPress fluid typography               |
| `scripts/lib/token-matcher.ts`, `scripts/lib/css-length.ts`, `scripts/lib/colour.ts` | Matching, CSS length and colour helpers                                                               |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
