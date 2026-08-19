---
name: block-theme-audit
description: Perform a structured audit of a WordPress block theme repository — missing files, unreplaced placeholders, PHP escaping gaps, accessibility problems, structural inconsistencies, and styling-system risks. Use when reviewing or QA-ing a block theme before release or handoff.
---

# SKILL: Block Theme Audit

**Version:** 1.1.0
**Scope:** WordPress block theme repositories

---

## Purpose

Perform a structured audit of a WordPress block theme repository.
Identify missing files, unreplaced placeholders, escaping issues, accessibility problems, structural inconsistencies, and styling-system risks.

---

## Inputs

| Input         | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| `theme_root`  | The root directory of the WordPress block theme                                 |
| `report_path` | Where to save the report (default: `.githu./.github/reports/YYYY-MM-DD-theme-audit.md`) |

---

## Steps

### 1. Required File Check

Confirm these files exist:

- `style.css`
- `theme.json`
- `functions.php`
- `templates/index.html`
- `parts/header.html`
- `parts/footer.html`
- `styles/dark.json`
- `CHANGELOG.md`
- `README.md`
- `AGENTS.md`

### 2. Placeholder Check

Scan all text files for unreplaced placeholder tokens matching `{{[A-Z_]+}}`.
Report the file path and token for each finding.

### 3. theme.json Quality Check

- Confirm `$schema` is present.
- Confirm `version` is 3.
- Confirm colour palette slugs are consistent with style variations.
- Flag deprecated properties.

### 4. Style Variation Check

- Confirm `styles/dark.json` is valid JSON.
- Confirm all `styles/**/*.json` variation files (including nested paths like `styles/blocks/<slug>.json` and `styles/sections/<subfolder>/<slug>.json`) are valid JSON.
- Confirm colour references use slugs defined in `theme.json`.

### 5. Sass and CSS Workflow Check

- If `src/scss/` exists, treat it as the source styling layer and `assets/css/` as compiled runtime output.
- Flag styling contracts duplicated across Sass, compiled CSS, and long raw `styles/**/*.json` `css` strings.
- Flag guidance or files that imply alternate toolchains such as Gulp, Grunt, CodeKit, Scout, or ad hoc prefixing when the repo already has working `npm` Sass scripts.
- Flag universal selectors, overly deep descendant chains, ID-heavy selectors, or avoidable specificity spikes.
- Flag repeated hard-coded breakpoints instead of the shared breakpoint map or `mq()` mixin when the repo already exposes one.
- Flag layout or animation rules that rely on layout-triggering properties where `transform` or `opacity` would likely achieve the same effect.
- Flag missed logical-property opportunities where directional spacing or positioning should remain RTL-safe.
- Do not recommend PurgeCSS, critical-CSS splitting, or framework adoption as default fixes; only surface them as explicit, evidence-based follow-up ideas.

### 6. PHP Escaping Check

- Scan `functions.php`, `inc/**/*.php`, `patterns/**/*.php`.
- Flag `echo` statements without escaping wrappers.
- Flag translation functions missing the text domain.
- Flag direct superglobal output.

### 7. Accessibility Check

- Check `templates/` and `parts/` for semantic `tagName` usage.
- Check heading hierarchy.
- Note any missing skip links.

### 8. CHANGELOG Check

- Confirm `CHANGELOG.md` follows Keep a Changelog format.
- Flag if there are no entries under `## [Unreleased]`.

---

## Output

A Markdown report saved to the `report_path` with:

- ✅ passing checks
- ⚠️ warnings
- ❌ errors

And a follow-up task list saved to `.github/tasks/YYYY-MM-DD-audit-followup.md` for any actionable findings.

---

## Notes

- This skill is advisory only. It flags likely issues but is not a replacement for human review.
- Do not make destructive changes automatically. Surface findings and let a human decide.
- Run `node theme-utils.mjs validate-theme` and `node theme-utils.mjs security-scan` alongside this skill for tooling-supported checks.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
