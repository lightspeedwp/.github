# Proposed Description Refinements

## inc-formatter

**Current (270 chars):**
Standardize WordPress theme PHP files with namespaces and remove legacy function prefixes. Use when migrating theme inc/ files to modern conventions, converting prefixed functions to namespaced ones, ensuring consistent PHP code structure across themes, or removing function_exists wrappers. Works on themes using the dp_ prefix convention.

**Proposed (348 chars):**
Standardize WordPress theme PHP files with namespaces and remove legacy function prefixes. Use when migrating theme inc/ files to modern conventions, converting prefixed functions to namespaced ones, ensuring consistent PHP code structure across themes, removing function_exists wrappers, modernizing PHP code, or cleaning up legacy theme functions—even if they just mention standardizing or formatting theme PHP files. Works on themes using the dp_ prefix convention.

**Changes:** +78 chars
- Added: "modernizing PHP code, or cleaning up legacy theme functions"
- Added "even if" clause to be more pushy about scope
- Added "formatting theme PHP files" as triggering keyword

---

## spacing-mapper

**Current (280 chars):**
Migrate WordPress theme spacing presets from numeric to semantic slugs (e.g., Die Papier to Ollie). Use when converting theme spacing systems, standardizing design tokens between themes, updating spacing preset naming conventions in theme.json and pattern files, or aligning with reference theme spacing architecture.

**Proposed (356 chars):**
Migrate WordPress theme spacing presets from numeric to semantic slugs (e.g., Die Papier to Ollie). Use when converting theme spacing systems, standardizing design tokens between themes, updating spacing preset naming conventions in theme.json and pattern files, migrating spacing values, updating CSS variables for spacing, or aligning with reference theme spacing architecture—even when they just mention spacing presets or design token migration.

**Changes:** +76 chars
- Added: "migrating spacing values, updating CSS variables for spacing"
- Added "even when" clause for broader matching

---

## wordpress-block-pattern-generator

**Current (433 chars):**
Generate production-ready WordPress block patterns with accessibility (WCAG 2.1 AA), proper spacing presets, BEM naming, and integration with WooCommerce, LifterLMS, and ACF custom fields. Use when creating block patterns, building query loops for custom post types, designing hero sections, implementing taxonomy filters, or building accessible card components with custom field integration.

**Proposed (433 chars) - NO CHANGE:**
This description is already excellent with comprehensive keyword coverage and clear use cases.

---

## wordpress-block-pattern-validator

**Current (367 chars):**
Validate and fix WordPress block pattern files to ensure HTML matches block comment attributes. Use when debugging block validation errors, fixing font family attribute mismatches, correcting malformed CSS classes (e.g., has-h-3-font-size vs has-h3-font-size), ensuring pattern files pass WordPress core rendering rules, or detecting redundant fontFamily attributes that WordPress strips on save.

**Proposed (444 chars):**
Validate and fix WordPress block pattern files to ensure HTML matches block comment attributes. Use when debugging block validation errors, fixing font family attribute mismatches, correcting malformed CSS classes (e.g., has-h-3-font-size vs has-h3-font-size), ensuring pattern files pass WordPress core rendering rules, detecting redundant fontFamily attributes that WordPress strips on save, or troubleshooting patterns showing errors in the block editor—even if they just mention pattern errors or validation issues.

**Changes:** +77 chars
- Added: "troubleshooting patterns showing errors in the block editor"
- Added "even if" clause with "pattern errors or validation issues"

---

## wordpress-theme-json-mapper

**Current (406 chars):**
Map design system tokens (colors, typography, spacing, layouts) to WordPress theme.json configuration. Use when translating design tokens to theme.json, converting style guides to WordPress presets, generating block styles from design systems, creating theme.json from existing documentation, or automating the process of extracting design tokens into WordPress-compatible format.

**Proposed (513 chars):**
Map design system tokens (colors, typography, spacing, layouts) to WordPress theme.json configuration. Use when translating design tokens to theme.json, converting style guides to WordPress presets, generating block styles from design systems, creating theme.json from existing documentation, automating the process of extracting design tokens into WordPress-compatible format, or converting design systems from Figma, Tailwind, or other platforms—even if they just mention design tokens, style guides, or theme.json generation without specifying WordPress.

**Changes:** +107 chars
- Added: "or converting design systems from Figma, Tailwind, or other platforms"
- Added "even if" clause to catch broader design system queries

---

## theme-json-to-preset-folders

**Current (374 chars):**
Extract a monolithic WordPress theme.json into modular preset files under styles/presets/. Use when migrating to modular theme.json architecture, reducing merge conflicts in design tokens, aligning with reference theme structure (e.g., Die Papier Tema), improving maintainability of theme settings, or splitting theme.json into focused, single-concern files.

**Proposed (460 chars):**
Extract a monolithic WordPress theme.json into modular preset files under styles/presets/. Use when migrating to modular theme.json architecture, reducing merge conflicts in design tokens, aligning with reference theme structure (e.g., Die Papier Tema), improving maintainability of theme settings, splitting theme.json into focused single-concern files, organizing large or huge theme.json files, or improving team collaboration on theme settings—even when they mention theme.json being unwieldy or causing conflicts.

**Changes:** +86 chars
- Added: "organizing large or huge theme.json files, or improving team collaboration on theme settings"
- Added "even when" clause for conflict/size mentions

---

## Summary

**Skills with changes:** 5 of 6
**Skills unchanged:** 1 (wordpress-block-pattern-generator - already optimal)
**Average increase:** ~85 chars
**All under 1024 char limit:** ✅ (longest proposed is 513)
**All maintain "Use when" pattern:** ✅
**All add "even if/when" clauses:** ✅ (following agentskills.io "pushy" guidance)
