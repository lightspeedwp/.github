---
name: wordpress-theme-validation
description: Validate a WordPress block theme from its files, and against the approved design system. Runs a file-only validator (theme.json schema, orphaned tokens, style-partial engine traps, pattern headers and escaping, template and part references, block markup, attachment IDs, heading and alt-text basics), then classifies design drift against Figma and DESIGN.md. Use when the user asks to validate, check or lint a block theme, theme.json, block or section styles, style variations, patterns or templates, asks "is this theme valid?" before a handover or PR, or wants Figma traceability for a WordPress theme.
---

# WordPress Theme Validation

## Overview

Use this skill when the task is to validate a WordPress block theme against its design-system sources of truth.

This skill is for implementation validation, not for broad package drafting. It works in two layers:

1. **Mechanical checks** (`scripts/validate-theme.ts`): rules that can be decided from the theme's files alone, with no running WordPress. Run these first; they are fast and objective.
2. **Design judgement** (the workflow below): whether `theme.json`, block styles, section styles, style variations, CSS custom properties, and theme utility conventions stay aligned with approved design evidence such as `DESIGN.md`, `AGENTS.md`, Figma variables, Figma styles, parent-theme inheritance, and project-specific rules.

## When To Use This Skill

Use `$wordpress-theme-validation` when the user asks to:

- validate `theme.json`
- check a block theme before a handover, release or pull request ("is this theme valid?")
- check patterns, templates or template parts for broken references, headers or escaping
- validate a block theme against Figma
- check block styles, section styles, or style variations for drift
- inspect `theme-utils.mjs` or equivalent theme utility conventions
- identify unverifiable token values, legacy overrides, or hardcoded implementation drift
- produce implementation findings for a package-wide validation report

Do not use this skill for first-pass `DESIGN.md` creation, broad evidence gathering, or general Figma-to-code implementation. Use the broader package and Figma skills for those tasks first, then use this skill to validate the implementation layer.

## Required Inputs

Use the strongest available sources in this order:

1. current project implementation files
2. `DESIGN.md`
3. `AGENTS.md`
4. Figma variables, styles, patterns, and component context
5. parent-theme files and inheritance context
6. `theme-utils.mjs` or equivalent theme utility files
7. plugin extension rules that affect the theme surface

If the needed implementation files are missing, say exactly which file or surface is missing before making strong validation claims.

## Run The Validator

From the root of the repository that holds this skill (dependencies installed with `npm ci`):

```bash
npx tsx skills/wordpress-theme-validation/scripts/validate-theme.ts <theme-path>
npx tsx skills/wordpress-theme-validation/scripts/validate-theme.ts <theme-path> --format json
npx tsx skills/wordpress-theme-validation/scripts/validate-theme.ts <theme-path> --only styles,patterns/escaping
npx tsx skills/wordpress-theme-validation/scripts/validate-theme.ts --list
```

| Option | Meaning |
| --- | --- |
| `--format text\|json` | Text for people (default); JSON for agents and CI. |
| `--only <ids>` | Comma-separated check ids. A group prefix (`styles`) runs the whole group. |
| `--schema <file>` | Validate against this theme.json schema instead of the bundled copy. |
| `--list` | Print every check with its severity, then exit. |

Exit codes: `0` no errors (warnings allowed), `1` errors found or recorded debt grew, `2` usage problem (not a theme folder, broken `.theme-validation.json`).

The token check imports `theme-orphaned-refs/scripts/find-orphaned-presets.ts`, so install that skill alongside this one. Use `theme-orphaned-refs` to apply the replacements it suggests.

### Checks

| Id | Severity | What it catches |
| --- | --- | --- |
| `theme-json/schema` | error | theme.json or a `styles/` partial is invalid JSON, has no `$schema`, or fails its schema. Warns when that schema version is not bundled (`scripts/schemas/`). |
| `theme-json/duplicate-slug` | error | The same preset slug twice in one list. |
| `theme-json/declared-files` | error | A `customTemplates` or `templateParts` entry with no file. |
| `theme-json/undeclared-part` | warning | A `parts/` file missing from `templateParts`. |
| `tokens/orphaned-preset` | error | `var:preset\|…` or `--wp--preset--…` with no defined slug; suggests the nearest. |
| `tokens/orphaned-custom` | error | `var:custom\|…` or `--wp--custom--…` with no `settings.custom` value. |
| `styles/pseudo-state-key` | error | `:hover` and similar keys in a partial (WordPress drops them silently). |
| `styles/media-in-css` | error | `@media` in a block, element or variation `css` field (WordPress flattens it). Root `styles.css` may use it. |
| `styles/raw-px` | warning | Raw `px` in a `css` field. |
| `styles/raw-hex` | warning | Raw hex colours in styles. |
| `styles/raw-font-family` | warning | A literal font name in `fontFamily`. |
| `styles/important` | error | `!important` not recorded in the allow-list. |
| `patterns/header` | error | No `Title` or `Slug`, or an invalid `Inserter`. |
| `patterns/header-recommended` | warning | No `Inserter`; inserter patterns with no `Categories` or `Viewport Width`. |
| `patterns/slug` | error | Slug outside the theme namespace, or used twice. |
| `patterns/slug-filename` | warning | Slug is not `<namespace>/<file name>`. |
| `patterns/category` | error | A theme-namespace category the theme PHP never registers. |
| `patterns/nested-pattern` | warning | A `wp:pattern` block inside a pattern. Verify on the rendered page. |
| `patterns/escaping` | error | Unescaped `echo`; `esc_url()` and friends inside block-comment JSON. |
| `patterns/text-domain` | error | A translation call with no text domain or the wrong one. |
| `templates/name` | warning | A template that is neither a hierarchy name nor in `customTemplates`. |
| `templates/part-ref` | error | A `wp:template-part` slug with no `parts/` file. |
| `templates/pattern-ref` | error | A theme-namespace `wp:pattern` slug with no pattern file. |
| `markup/parse` | error | Unbalanced block comments, or attributes that are not valid JSON. |
| `markup/unknown-block` | warning | A block namespace other than core, the theme or a declared dependency. |
| `markup/database-id` | error | Attachment IDs, `wp-image-{id}`, navigation or synced-pattern `ref` IDs. |
| `a11y/single-h1` | warning | More than one h1 in a template or page starter. |
| `a11y/heading-order` | warning | A skipped heading level within a file. |
| `a11y/image-alt` | error | An `<img>` with no `alt` attribute. |

The theme's text domain comes from `style.css` (`Text Domain:`); the pattern namespace defaults to it. The validator reads `style.css`, `theme.json`, `styles/`, `templates/`, `parts/`, `patterns/`, `functions.php` and `inc/`, and skips `node_modules`, `vendor`, `build`, `dist`, `coverage` and `test(s)`.

### Recorded debt: `.theme-validation.json`

Put this file in the theme root to declare dependencies and record debt the team has accepted:

```json
{
  "blockNamespaces": ["woocommerce"],
  "allow": [
    {
      "check": "styles/important",
      "file": "theme.json",
      "path": "styles.css",
      "max": 9,
      "reason": "Mobile overrides beating inline block padding (ticket reference)."
    }
  ]
}
```

- `file` accepts `*` wildcards; `path` is the JSON path the finding reports.
- `max` caps the debt: one more finding than `max` and none of them are allowed (`DEBT GREW`, exit 1).
- An entry that matches nothing is reported as `UNUSED`, so paid-off debt gets removed.
- Optional `textDomain` and `namespace` override what `style.css` says.

### Reading the output

Each finding has a check id, a severity, a file and line (best effort for JSON paths), a JSON path where relevant, a message and a one-line fix. Report errors as blocking; report warnings with a judgement on whether they matter for this theme. Fix hints name the skill that repairs the problem where one exists (`theme-orphaned-refs`, `wp-pattern-audit`, `wp-block-style-audit`).

## Workflow

1. Run the validator (above) and fix or record every error before judging design alignment.
2. Identify which implementation surfaces are in scope: `theme.json`, block styles, section styles, style variations, CSS custom properties, `theme-utils.mjs`, or related theme helper files.
3. Identify the validation baseline: `DESIGN.md`, `AGENTS.md`, Figma evidence, parent-theme inheritance, plugin extension rules, or approved project conventions.
4. Inspect `theme-utils.mjs` or equivalent utility files before judging generated or transformed theme outputs. Treat them as implementation conventions, not as the canonical design source.
5. Run `scripts/inventory_theme_surfaces.mjs` (legacy) only when a fast inventory of theme surfaces, token-like values, or likely validation targets will improve consistency.
6. Compare implementation values against approved sources and classify findings as:
   - **Verified**: directly supported by implementation plus approved design evidence
   - **Inferred**: likely correct but not fully traceable
   - **Drift**: conflicts with approved design-system evidence or introduces undeclared values
   - **Legacy**: pre-existing values or structures that do not match current rules but may still be intentionally retained
   - **Conflict**: two or more sources disagree and the winner is not yet settled
7. Validate all relevant implementation surfaces together rather than checking `theme.json` in isolation.
8. Call out which Figma variables, styles, or patterns appear to map to each implementation surface whenever that traceability is available.
9. If a value cannot be traced back to Figma, `DESIGN.md`, parent-theme inheritance, or an approved project rule, do not present it as verified.
10. When block styles, section styles, or style variations duplicate logic that belongs in shared tokens or `theme.json`, flag that as maintainability risk.
11. When `theme-utils.mjs` conventions imply generated output, note whether the implementation appears to respect those conventions.

## Validation Targets

Check these when present:

- `theme.json`
- `styles/*.json`
- block style registrations and block-style files
- section styles and section-specific style files
- style variations and variation-specific theme files
- CSS custom properties and token aliases
- theme helper files such as `theme-utils.mjs`
- parent-theme presets and inherited values
- plugin-driven theme surfaces that introduce styling requirements

## Output Contract

Return a structured validation result with these sections when relevant:

1. **Validation Scope**
2. **Sources Checked**
3. **Implementation Surfaces Checked**
4. **Verified Mappings**
5. **Inferred Mappings**
6. **Drift And Legacy Findings**
7. **Block Style / Section Style / Variation Findings**
8. **theme-utils Convention Findings**
9. **Figma Traceability Findings**
10. **Open Conflicts Or Missing Evidence**
11. **Recommended Fixes**
12. **Validation Status**

For each meaningful finding, include:

- the affected file or surface
- the value, token, or rule at issue
- the strongest source that supports the finding
- the classification: Verified, Inferred, Drift, Legacy, or Conflict
- the practical impact on maintainability, parity, or correctness

## Decision Rules

- Prefer approved semantic tokens over raw values.
- Prefer `theme.json` settings and shared presets over one-off overrides.
- Prefer inherited parent-theme values over duplicated child-theme definitions when inheritance is intentional.
- Prefer reusable block or variation patterns over isolated style fragments when the design intent is shared.
- Do not silently normalize unverifiable values into the approved system; flag them first.
- Treat plugin-specific styling as an extension surface that still needs token discipline.

## Supporting Files

- `references/validation-checklist.md` — use for the ordered validation checklist and classification rules.
- `references/figma-traceability.md` — use when relating theme implementation values back to Figma variables, styles, and patterns.
- `scripts/validate-theme.ts` — the file-only validator (entry point); `scripts/lib/` holds one class per check, the theme reader, runner and reporter; tests are in `scripts/__tests__/` (`npm run test:wordpress-theme-validation`, Vitest, 80% coverage enforced).
- `scripts/schemas/theme-wp-<version>.json` — pinned theme.json schemas, so validation needs no network. Add a file to support another WordPress version.
- `scripts/inventory_theme_surfaces.mjs` — legacy quick inventory of theme files and token-like values. Superseded by the validator; kept until its removal is agreed.

## Example Request Shapes

- "Use $wordpress-theme-validation to check this theme before I open the PR."
- "Use $wordpress-theme-validation to validate this theme.json and its style variations against the approved Figma variables and DESIGN.md."
- "Use $wordpress-theme-validation to find block-style drift and unverifiable values in this block theme."
- "Use $wordpress-theme-validation to inspect theme-utils conventions and tell me whether the generated theme surfaces still match the design system."

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
