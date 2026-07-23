---
name: wp-blockstyle-css-field
description: "Author WordPress block style variations (styles/**/*.json) correctly given the css field's sanitisation and zero-specificity limits. Use when writing or debugging a block-style/section-style JSON partial: deciding what belongs in structured styles vs the css field vs an enqueued .css file, why a rule silently vanished or lost the cascade (:where() zero specificity, stripped :hover/:first-child, mangled content:\"\", dropped comma selectors), and how to beat core block resets. Complements wp-block-style-audit (which migrates CSS-soup into JSON) with the authoring doctrine and specificity rules."
compatibility: "Targets WordPress 6.9+ block themes (theme.json v3, recursively auto-discovered styles/**/*.json variations). Requires the theme's theme.json for preset token names. Behaviour of the css field is verified empirically per WP version — re-test after core upgrades."
---

# WP Block-Style css Field

## Overview

WordPress block style variations authored as theme.json partials in `styles/**/*.json` (slug/title/blockTypes/styles) are auto-discovered recursively; WP applies an `is-style-{slug}` class (plus per-instance `is-style-{slug}--N`). The style's `styles.css` field lets you write selector-level CSS with `&` as the variation root — but that field is a **sanitised, zero-specificity surface with sharp limits.** Rules silently vanish or lose the cascade if you don't know them.

This skill is the authoring doctrine: **put styling in JSON first**, use the `css` field only within its safe subset, and drop to an enqueued `.css` file **only** for what JSON provably can't express — scoped to the `is-style-*` class, with a comment saying which limit forced it. It pairs with the upstream `wp-block-style-audit` skill (which *migrates* CSS-soup into JSON) by telling you what will and won't survive once it's there.

## When to use

- Writing or editing a block-style / section-style JSON partial under `styles/**`.
- A rule you put in a `css` field **silently disappeared** or didn't win the cascade.
- Deciding **where** a given rule belongs: structured `styles`, the `css` field, or enqueued CSS.
- A `core/navigation` (or other core block) hover/colour won't take even though the JSON parses.

## Inputs required

- The theme's `theme.json` (for preset token slugs — reference tokens, never raw hex/font literals).
- The target block(s) and their `block.json` supports/selectors — especially any `__experimentalSelector` / `__experimentalSkipSerialization` (see `references/css-field-limits.md`).
- Where the theme keeps its enqueued stylesheets and which of them reach the **editor** (front-end-only sheets don't).

## Procedure

Route each rule to the lowest-risk home that can express it:

1. **Structured props → JSON `styles` object.** Colour, border, radius, typography, spacing, and native `:hover`/`:focus` states go here. First choice: one source of truth, renders in the editor, clean cascade.
2. **Selector-level rules → the JSON `css` field**, but only within the **safe subset**: single selector, no `:hover`/`:first-child`, no `content:""`, and `!important` on anything core/theme.json/plugin also sets (the field compiles at zero specificity). See `references/css-field-limits.md`.
3. **Enqueued `.css` file → last resort**, only for what JSON can't hold: `:hover`/`:focus` *flips* that must beat a core reset, `::after`/`::before` icon content, `:first-child` logic, comma selectors, and blocks that can't be styled via JSON at all. Scope every rule to the `is-style-*` class so natural specificity wins without `!important`, and **comment which limit forced the fallback** with a link back to the JSON style.
4. **When beating a core block reset**, compute specificity — a `:where()`-wrapped variation is `(0,1,0)` and will lose. See `references/specificity-and-core-resets.md`.
5. **If the page renders from a DB template/part**, patch both the JSON/CSS *and* the DB copy — see `wp-db-override-reconciliation`.

## Verification

- **Load the front end *and* the editor** — a `css`-field rule that renders on the front end must also appear in the editor (that's a key reason for JSON-first). If it's missing in one, you've mis-routed it.
- **Inspect the compiled selector** in devtools: if you see `:root :where(.is-style-…)`, it's `(0,1,0)` — confirm it actually wins against core/plugin rules, or move it to enqueued CSS.
- **Confirm nothing silently dropped**: search the rendered CSS for your declaration. A missing rule usually means a stripped pseudo, a `content:""`, or a comma selector (see limits reference).

## Failure modes

- **Rule silently gone** → `:hover`/`:first-child` stripped, `content:""` mangled the whole rule, or a comma-separated `&` list lost all but the last selector. → `references/css-field-limits.md`
- **Rule present but ignored** → zero-specificity `:where()` wrap loses to core/theme.json/plugin; needs `!important` (css field) or a higher-specificity enqueued rule. → `references/specificity-and-core-resets.md`
- **`core/navigation` link colour/hover won't change** → core's doubled-class reset is `(0,3,0)` with no `:hover`; a `(0,1,0)` variation can't win. Style it in CSS at `≥ (0,4,0)`. → `references/specificity-and-core-resets.md`
- **Woo/experimental block can't be driven by JSON at all** → `__experimentalSelector` + `__experimentalSkipSerialization` blocks miscompile `&`, emit at zero specificity, and serialize stray inline styles. Style in enqueued CSS scoped to `is-style-*`. → `references/css-field-limits.md`
- **Works on front end, gone in editor** → the rule is in a front-end-only enqueued sheet; move expressible parts into the JSON style.

## Escalation

- If a required effect genuinely can't live in JSON, put it in enqueued CSS **and record the exception** (comment + a note wherever the theme documents its styling rules) so audits don't "fix" it back into JSON.
- If core/plugin CSS keeps out-specifying you and `!important` is spreading, stop and reconsider the selector strategy rather than escalating `!important`.

## Related

- `block-theme-audit` — structured theme audit that flags styling-system risks; run it after styling changes. (This skill explains the *why* behind its css-field findings.)
- `wp-block-style-audit` (upstream) — migrate CSS selector-soup into JSON properties.
- `wp-db-override-reconciliation` — when the live page renders from a DB copy, not the file you edited.
- `wp-mcp-wpcli-ops` — clearing the theme-version-keyed pattern/style transient so new `styles/**` files register.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
