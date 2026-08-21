---
name: pattern-extractor
description: Convert a Figma design into a production-ready WordPress block pattern for the CURRENT block theme. Theme-adaptive — it probes the theme to learn its token model, file layout, motion approach, and WooCommerce conventions, then maps the design onto them with strict token discipline, reuse-or-create style workflow, an approval gate, and CSS-vs-GSAP motion routing. Works whether the theme uses semantic custom colour tokens + dark-mode parity (e.g. ls-theme) or references preset tokens directly by numeric slug (e.g. kwv-theme-2026).
---

# Pattern Extractor

## Purpose

Use this skill when importing a Figma design into `patterns/` as a production-ready WordPress block pattern for whatever block theme you are working in.

This skill is **theme-adaptive**. It does not assume any one theme's architecture. Phase 0 builds a *theme profile* by probing the repo, and every later phase reads from that profile. The same workflow must work for a theme that uses semantic custom colour tokens with `styles/dark.json` parity (e.g. `ls-theme`) and for a theme that references preset tokens directly by numeric slug with no dark layer (e.g. `kwv-theme-2026`).

This skill is **approval-gated**:

1. Analyse the design and propose what to reuse or create.
2. Wait for user approval.
3. Implement the pattern, styles, motion assets, and token updates.

Do not skip the proposal gate.

## Phase 0 — Build the theme profile (do this first, every time)

Never assume paths. Probe the theme and record a profile. The profile decides everything downstream.

Detect and record:

1. **Theme root & metadata** — `style.css` header, text domain, `theme.json` `version`/`$schema`. Use the text domain for all i18n.
2. **Token model** — open `theme.json` and look for the colour architecture:
   - **Preset-direct** (e.g. KWV): authored UI references presets by slug — `var:preset|color|brand-500`, `var(--wp--preset--color--brand-500)`. There is usually **no** `styles/dark.json` and **no** `styles/presets/**`. Tokens live directly in `theme.json`.
   - **Semantic + dark** (e.g. ls-theme): authored UI references semantic custom tokens — `var(--wp--custom--color--text--default)` — mirrored in `styles/dark.json`, with preset slices split under `styles/presets/**` and merged via `inc/presets.php`.
   - If both appear, prefer whichever the *authored patterns* actually use. Confirm with the user if ambiguous.
3. **Where tokens are defined** — `theme.json` always; plus `styles/presets/**` and `styles/dark.json` **only if they exist**.
4. **Style-variation layout** — list `styles/blocks/**/*.json` and `styles/sections/**/*.json`. Note the subfolder convention actually in use (e.g. `styles/sections/cards/`). Confirm WP auto-registers nested files by querying `WP_Block_Styles_Registry` (see Operational notes).
5. **Pattern layout** — list `patterns/`. **Match the existing layout** (flat vs subfoldered). Do not impose subfolders if the theme keeps related patterns flat (KWV keeps `woo-*` cards flat). Note category registration in `functions.php`.
6. **Motion layer** — find where CSS motion lives. Could be `assets/styles/*.css`, `assets/css/animations.css`, or block/section JSON `css` fields. Find GSAP wiring **only if it exists** (`assets/**/gsap*`, `inc/gsap.php`). Do not invent a GSAP layer in a theme that has none.
7. **WooCommerce** — is `inc/woocommerce.php` present? Is there a dedicated `assets/styles/woocommerce.css` (or similar)? That file is the escape hatch for advanced/verbose Woo selectors.
8. **Enforcement tooling** — if the theme uses the semantic+dark model, the `theme-color-token-enforcer` skill applies (token reuse + dark parity + contrast). If the theme is preset-direct, that skill's dark-parity rules **do not apply**; instead run `theme-orphaned-refs` after token changes to keep broken preset refs at zero.

Read before proposing: `AGENTS.md` (and any theme-level `AGENTS.md`), `theme.json`, the relevant style-variation JSON, 2–4 existing patterns in the target family, the motion file(s), and any `.github/instructions/*.instructions.md` that exist. Then read the Figma node (see Operational notes for the View-seat fallback).

## Phase 1 — Read the Figma design

1. Get design context, a screenshot, and variable defs for the node.
2. **Figma View-seat fallback:** the remote `mcp__claude_ai_Figma__*` tools are rate-limited on View-tier org seats and will error. If they do, use the **`mcp__figma-desktop__*`** tools instead — they talk to the local Figma desktop app and are not rate-limited. Do not loop on a failing remote call.
3. Capture every styled value: colours (bg/text/border/icon/overlay/focus), spacing (padding/margin/gap/blockGap), typography (family/size/weight/line-height/letter-spacing/transform), border (width/style/radius), shadows, layout (alignment/content width/columns/media ratio), interaction states, and motion.
4. Record state deltas explicitly: base → hover, base → focus-visible, base → active.

## Phase 2 — Map design values to theme tokens

Map every captured value to the **closest existing token in the theme profile**. Mapping rules:

1. **Colour:**
   - Semantic+dark theme → reuse a semantic custom colour token by role; if none fits, propose a new semantic token path and add it to **both** `theme.json` and `styles/dark.json` during implementation.
   - Preset-direct theme → reference the matching preset by **numeric/named slug** (`var:preset|color|brand-500`). Never hand-invent hex. No dark-mode mirror is required unless the theme actually ships one.
2. **Non-colour** (spacing, typography, radius, shadow, layout) → reuse preset tokens by slug. **Find the closest preset** when the design value is off-scale, and *say so in the proposal* (e.g. "Figma 14px → `font-size|200` (16px); 0.875rem sits between `100`/`200`, chose `200` for legibility"). Never hardcode a radius — always map to a radius preset slug.
3. **Fonts:** reference the theme's font-family **slugs** (`heading`/`body`), not literal family names. If the design uses a font the theme hasn't licensed, map to the closest slug and note that swapping the preset later updates everything (KWV uses `heading`/Jost as a stand-in for Trenda).
4. Never invent preset slugs that do not exist. Never carry external design-system token names into authored files.

## Phase 2.5 — Context-aware block selection

Infer the most **semantic** core/Woo block for each element before writing markup. Prefer semantic blocks over generic layout blocks. Assign each a confidence: `high` (exact semantic match), `medium` (close, minor compromise), `low` (generic fallback). Document fallbacks in the proposal.

Common mappings:

- Branding → `core/site-logo`/`site-title`/`site-tagline`; nav → `core/navigation`; CTA → `core/buttons`/`core/button`.
- Post/product cards → `core/query`/`woocommerce/product-collection` + `core/post-template`, `core/post-title`, `core/post-featured-image`, `core/post-terms`, and the WooCommerce product blocks.
- Generic sections → `core/group`, `core/columns`, `core/heading`, `core/paragraph`, `core/image`, `core/cover`, `core/separator`.

## Phase 3 — Reuse discovery

Before creating anything, search for what already exists: similar **patterns**, matching **block-style** and **section-style** JSON, reusable **motion** rules, and reusable **tokens**. Reuse beats create.

## Phase 4 — Motion routing

Classify each interaction as **CSS-only** or **GSAP**.

- CSS-only for selector-driven state (hover/focus-visible/active transitions, underline draws, fades, scale/slide, safe keyframe loops). If a card is a single interactive surface, make the **whole card** own hover/focus-visible, not just an inner CTA. CSS-only motion goes in the theme's motion CSS file (per the profile).
- GSAP **only if** the interaction needs JS-managed state (pointer tracking, DOM augmentation, coordinated timelines, runtime custom-property interpolation) **and the theme already has a GSAP layer**. If so, load and follow the `wordpress-gsap` skill. Do not introduce GSAP into a theme that has none without explicit approval.
- Honour `prefers-reduced-motion` in any new motion. Keep timing close to the theme's existing micro-interaction range.

## Phase 5 — Style creation rules

Create the narrowest reusable artefact needed:

- Block style JSON → `styles/blocks/<block-family>/<slug>.json` (`blockTypes`, `slug`, `title`, `styles`).
- Section style JSON → `styles/sections/<subfolder>/<slug>.json` (`blockTypes: ["core/group"]` etc.).
- CSS-only motion / advanced selectors → the theme's motion CSS file.

Constraints:

- Authored UI uses the theme's token model only (semantic tokens for semantic themes; preset slugs for preset-direct themes). For semantic+dark themes, follow `theme-color-token-enforcer` in apply mode across changed files; for preset-direct themes, run `theme-orphaned-refs` and keep raw hex/font literals out.
- Radius always resolves to a preset slug. Never hardcode radius.
- **Keep JSON `css` strings manageable.** A few child selectors (BEM-style `.card__title`, `.card__price`) is fine. When it grows large, move it to the theme's CSS file and leave a note in the JSON/pattern pointing there. (KWV puts verbose Woo selectors in `assets/styles/woocommerce.css`.)
- Prefer native blocks/defaults before inventing a new style. Don't create a heading block style when the right heading level already satisfies intent.

### WooCommerce specifics (learned, reusable)

- **A `core/button` style variation does NOT automatically style `woocommerce/product-button`** — it is a *different block*, and file-based variations emit low-specificity `:where()` selectors that WooCommerce's own button rules can override. To style the Add-to-Cart control in a product loop: apply the same `is-style-*` class to the `woocommerce/product-button`, then **reapply the look in the Woo CSS file** with enough specificity (e.g. scope under the card's `is-style-*` class and target `.wc-block-components-product-button.is-style-X .wp-block-button__link`). Keep the canonical `core/button` variation in JSON for general reuse.
- **Product collection cards** use `woocommerce/product-image`, `core/post-title` (with `__woocommerceNamespace`), `woocommerce/product-price`, and `woocommerce/product-button`. Set `isDescendentOfQueryLoop:true` on the Woo blocks. Mark loop cards `Inserter: false`.
- **Showing a product attribute** (e.g. a "750 ml" volume) in a loop card: a WooCommerce global attribute is a taxonomy `pa_<slug>`, so render it with `core/post-terms {"term":"pa_<slug>"}`. **`core/post-terms` renders nothing unless the taxonomy is publicly_queryable**, which for a Woo attribute means **archives enabled**. Flag the exact attribute slug for the user to confirm against the live store.
- **Two-state Woo controls** (e.g. Add-to-Cart → quantity stepper) are stateful Store-API/Interactivity behaviour and generally **cannot** be reproduced declaratively in a collection-loop card. Default to the static/first state and log the stateful state as separate follow-up work unless the user asks for it.

## Phase 6 — Icons (Phosphor mapping)

Detect icon usage. Match each to the closest Phosphor glyph (<https://phosphoricons.com/>) by silhouette + semantic intent; prefer a high-confidence Phosphor match over a bespoke SVG. Model icon tiles as a nested `core/group` containing an Icon Block. Leave an Icon Block empty only if the user wants to swap later or there is no confident match. Use `assets/icons/` only as an approved bespoke fallback. Report chosen icons + confidence in the proposal.

## Phase 7 — Proposal report (then stop for approval)

Return a structured plan and stop. Include:

1. Pattern file + final slug/title + **target path** (matching the theme's pattern layout)
2. Theme profile summary (token model, motion layer, Woo CSS file, pattern layout)
3. Reuse: patterns / block styles / section styles / motion / tokens
4. Create: block styles / section styles (path + slug + title + intent)
5. Motion routing per interactive element (CSS or GSAP → files)
6. Colour tokens to reuse, and any to add (with `theme.json` [+ `styles/dark.json` if semantic] paths)
7. Non-colour token mappings, **calling out off-scale "closest match" choices**
8. Context-aware block map with confidence scores
9. WooCommerce decisions (attribute source/slug, deferred stateful states, product-button styling approach)
10. Phosphor icon matches + confidence + any fallback needing approval
11. Assumptions / ambiguities needing confirmation

Then ask: **"Approve this plan and proceed with implementation?"** Use structured questions for genuinely open decisions (attribute slug, scope of states, etc.).

## Phase 8 — Implementation after approval

1. Add any new colour token paths first (`theme.json` [+ `styles/dark.json` for semantic themes]).
2. Create/update block + section style JSON.
3. Add CSS-only motion / advanced selectors to the theme's CSS file; add GSAP assets only if the approved plan + theme support it.
4. Create the pattern file at the profile-correct path with full header metadata.
5. Run the right enforcement pass: `theme-color-token-enforcer` (semantic+dark themes) **or** `theme-orphaned-refs` (preset-direct themes).
6. Seed any required dev data (e.g. a Woo attribute + term) via wp-cli, and label it clearly as local dev data, not theme code.
7. Verify (see below). Update `CHANGELOG.md`.

## Operational notes (environment gotchas)

These are real, reusable failure modes — check the project's own notes too, but assume these by default for WP Studio / local installs:

- **wp-cli OOMs** on the default memory limit — run `php -d memory_limit=1024M $(which wp) …`.
- **`wp db query` may fail** (`env: mysql: No such file or directory`) when the mysql client isn't on PATH — use `wp eval` / `wp eval-file` through the WP/WC data layer instead of raw SQL.
- **A newly added pattern/style file won't register** until cache is cleared: theme block patterns are cached in a **site transient keyed on theme version** (not file mtimes), so `wp transient delete --all` is *insufficient* — run `wp transient delete --all --network`. Confirm registration with `WP_Block_Patterns_Registry` / `WP_Block_Styles_Registry` via `wp eval`.
- **Verify by rendering**, not by eyeballing markup: set up a representative post/product (`setup_postdata` + `wc_setup_product_data`) and `do_blocks($pattern_content)`, then assert the key strings (attribute value, price, button, frame class) are present and there are no fatals.

## Authoring standards (always)

- WordPress block markup, not raw HTML. Semantic `tagName`s. Correct heading hierarchy. Self-contained patterns. No hardcoded URLs where a WP function should provide them.
- Full pattern header metadata: Title, Slug, Description, Categories, Keywords, Block Types / Post Types when relevant, Viewport Width, Inserter (single cards insertable unless they are loop-only).
- Escape all PHP output; wrap visible strings with the theme's text domain.
- Variable formats: semantic custom tokens `var(--wp--custom--color--…)` for semantic themes; preset syntax `var:preset|type|slug` in block attributes and `var(--wp--preset--type--slug)` in CSS for preset-direct themes; radius via `--wp--preset--border-radius--<slug>`. Don't mix syntaxes incorrectly.
- Don't leave hover/focus-visible/active implicit when the design specifies them; ensure keyboard parity.

## Validation checklist

- Theme profile built; paths/token-model/motion-layer confirmed against the real repo (not assumed)
- Pattern at the profile-correct path; slug matches filename; valid block markup
- All PHP output escaped; visible strings use the theme text domain
- Colour usage matches the theme's model (semantic tokens + dark parity, OR preset slugs); no raw hex/font literals in authored UI
- Non-colour values map to existing presets; off-scale choices documented; no hardcoded radius
- Existing styles/motion reused where possible; new artefacts only when necessary
- WooCommerce: product-button styled correctly (CSS bridge where needed), attribute taxonomy viewable, deferred stateful states logged
- CSS-only motion in the theme's motion file; GSAP only where the theme supports it; reduced-motion handled
- Icons matched to Phosphor first; Icon Block + Group wrapper; `assets/icons/` only for approved fallbacks
- Pattern + styles confirmed registered (caches cleared with `--network`); pattern render-tested with no fatals
- Enforcement pass run (`theme-color-token-enforcer` or `theme-orphaned-refs`); `CHANGELOG.md` updated

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
