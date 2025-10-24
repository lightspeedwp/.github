# Section styles

Guidance on defining, naming, and applying section-level styles to create consistent, reusable layout and visual patterns across your theme. When building reusable section styles, focus on container-level design tokens and nested block element rules. These keep layouts consistent and reduce ad-hoc overrides.

---

## What they are (and when to use)

Section styles are **block style variations** you register for container blocks (commonly `core/group`, `core/columns`, `core/cover`).  
They are defined in `theme.json` and can cascade styles to **nested elements** (links, buttons, headings) and **child blocks**.

### Key points

- Applied at the container level for consistent section design.
- Cascading rules let headings, links, and other inner blocks inherit styles automatically.
- Keeps design tokens in `theme.json` instead of ad-hoc CSS.
- Best used for **reusable “bands”** that repeat across a theme.

### When to use

- **Hero sections** (dark/light backgrounds, strong typography).
- **Card grids** (consistent padding, border radius, shadows).
- **Feature or infobox rows** (controlled spacing, link colors, heading scale).
- **Call-to-action strips** (buttons + background presets).
- **Archive/blog sections** (uniform card or list layouts).

---

## Best Practices

- **Scope to containers first**  
  Register styles for `core/group`, `core/columns`, `core/cover`.  
  Apply child tweaks with `blocks.core/*` and `elements.*` inside the variation.
- **Use presets, not hard-coded values**  
  Always prefer tokens like `var:preset|color|*`, `var:preset|spacing|*`, `var:preset|font-size|*` to stay aligned with Global Styles.
- **One purpose per slug**  
  Follow the format `section-{context}-{purpose}` (e.g. `section-archive-cards`).  
  Keep styles focused; don’t mix utilities into a section style.
- **Style nested blocks/elements, not roots**  
  Target inner headings, links, and paragraphs within the section.  
  Avoid broad root color rules that can clash inside nested sections.
- **Stay within schema**  
  No pseudo-elements, arbitrary selectors, or JS.  
  If needed, keep `css` string overrides minimal.
- **Respect WP 6.6 specificity changes**  
  Core selectors are now lower-specificity.  
  Let `theme.json` handle overrides first instead of using `!important`.

---

## Limitations

- **Restricted to theme.json**  
  Only properties supported by `theme.json` can be used. No custom selectors, pseudo-elements (`::before`, `::after`), or JavaScript behaviors.
- **Static logic only**  
  Section styles are static. They cannot apply conditionally by template, post type, or device size. Use patterns, block visibility, or templates for conditional behavior.
- **No deep targeting**  
  You cannot style structural positions (e.g. “first child only”). Styling cascades only to defined blocks (`blocks.core/*`) or elements (`elements.link`).
- **Manual application**  
  Variations must be applied manually in the Block Editor or pre-applied in block patterns. There is no automatic inheritance across all blocks.
- **Code-only workflow**  
  Section styles must be defined in JSON partials or via `register_block_style()`. They cannot be created or edited visually in the Site Editor.
- **Global Styles limitations (WP 6.6)**
  - Only **root block styles** are configurable in Global Styles; inner-block rules are not.
  - Variations cannot override inner block variations.
  - Variations do not have their own `settings` store.
  - Custom variations cannot be previewed in the **Style Book**.
- **Maintenance & accessibility**  
  Too many variations increase bundle size and maintenance overhead.  
  Background and contrast choices must always meet accessibility guidelines.  
  Some blocks still lack full block supports to benefit from section styles — check [tracking issues](https://github.com/WordPress/gutenberg/issues/57537) before assuming support.

---

## Naming conventions

- Filenames: `/styles/block/section-{slug}.json`
- Slugs: lowercase kebab-case; stable per “look”, e.g. `section-dark-hero`, `section-cards`.
- Titles: human, screen-reader friendly (e.g. `Section · Cards`).
  Matches how 6.6 scans `/styles` and auto-registers.

---

## CSS selectors & hover states

- Prefer JSON-expressible properties (color/spacing/typography/border/shadow).
- For hover/rollovers on links and buttons: set base via elements.link / blocks.core/button. If you absolutely need a pseudo-class, use the css string scoped to the variation (e.g. & a:hover{…}) and keep it minimal.

---

## Fluid spacing & typography

- Use preset spacing and font-size presets (which can be fluid via theme presets) rather than raw clamps in each variation; this keeps sections consistent when presets change.
- Validate on smallest breakpoints; spacing drifts often show there first. Architecture docs explain how presets & supports flow into generated CSS.

---

## What blocks benefit most

- Start with container blocks: `core/group`, `core/columns`, `core/cover`. Add nested rules for `core/heading`, `core/paragraph`, `core/buttons`, and specific components used repeatedly (e.g. `core/post-terms` example).

---

## Example Code

---

### Quick start: add two section styles via JSON

```
/styles/block/section-1.json
```

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "slug": "section-1",
  "title": "Section 1",
  "blockTypes": ["core/group", "core/columns"],
  "styles": {
    "color": { "background": "var:preset|color|contrast", "text": "var:preset|color|base" }
  }
}
```

```
/styles/block/section-2.json
```

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "slug": "section-2",
  "title": "Section 2",
  "blockTypes": ["core/group", "core/columns"],
  "styles": {
    "color": { "background": "#cbd5e1", "text": "var:preset|color|contrast" }
  }
}
```

Why this shape? This matches the 6.6 pattern for **block/section** variations in `/styles`, and is the simplest safe baseline.

---

### Advanced: nested elements & blocks + the `css` escape hatch

You can scope **inner elements** (e.g. `elements.link`) and **inner blocks** (e.g. `blocks.core/heading`) inside a variation. A limited `css` string is available if you must target something not expressible via schema—use sparingly.

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "slug": "section-cards",
  "title": "Section · Cards",
  "blockTypes": ["core/group", "core/columns"],
  "styles": {
    "color": { "background": "var:preset|color|surface", "text": "var:preset|color|contrast" },
    "elements": {
      "link": {
        "color": { "text": "var:preset|color|accent-1", "background": "transparent" },
        "typography": { "textDecoration": "none" }
      }
    },
    "blocks": {
      "core/heading": {
        "typography": { "fontSize": "var:preset|font-size|large", "fontWeight": "700" },
        "spacing": { "margin": { "top": "0", "bottom": "var:preset|spacing|20" } }
      }
    },
    "css": "& .wp-block-post-terms__separator{display:none;}"
  }
}
```

The exact capabilities and `css` usage are demonstrated in the Dev Blog’s 6.6 tutorial.

---

### PHP registration (multi-block + `style_data`)

If you prefer server registration (or need to support multiple blocks in one go):

```php
add_action( 'init', function () {
  register_block_style(
    array( 'core/group','core/columns' ),
    array(
      'name'       => 'section-flagship',
      'label'      => __( 'Section · Flagship', 'lsx' ),
      'style_data' => array(
        'color'   => array( 'background' => 'var:preset|color|contrast', 'text' => 'var:preset|color|base' ),
        'blocks'  => array( 'core/heading' => array( 'typography' => array( 'fontSize' => 'var:preset|font-size|large' ) ) ),
        'elements'=> array( 'link' => array( 'typography' => array( 'textDecoration' => 'none' ) ) )
      )
    )
  );
}
);
```

`style_data` is new in 6.6 and maps to the theme.json-like notation. The first arg now accepts an **array of block types**.

---

## Conflict diagnosis & avoidance

### Why conflicts happen

- Two variations applied **nested** (Group inside Group) share specificity; rules can cascade unpredictably.
- Local user controls (inline classes/inline styles) can override your variation.
  The 6.6 work reduced specificity to make the cascade saner, but nested edge cases remain.

### Avoidance rules

- Keep **section-wide colour/background** at the variation root; move typography/spacing for specific components into `blocks.core/*` so inner sections can override locally.
- Don’t stack variations on non-container blocks.
- Prefer **patterns** to combine multiple looks in a predictable structure. ([WordPress Developer Resources][1])

### Debug checklist

1. Did you register for the **right block types**?
2. Is a **local control** (e.g. link colour) applied on the child block?
3. Are you missing an **inner block** rule where you expected inheritance?
4. If nested sections clash, shift the contested rule into the inner variation’s `blocks.core/*`.
5. Only drop down to the `css` string if schema can’t express the tweak.

---

## Benefits

- Saving time ?? Why

---

## When to use

- You need to visually group content into distinct sections (hero, feature grid, testimonials) with consistent spacing and backgrounds.
- Multiple pages reuse the same section look-and-feel and should change uniformly via a single update.
- You want to offer non-technical authors a curated set of section presets instead of custom CSS per page.
- You need variants for different surfaces (default, subdued, emphasis) without duplicating blocks or layouts.

---

## Playwright tests (baseline)

Create minimal, repeatable checks in `e2e/section-styles.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('section-cards applies nested heading + link styles', async ({ page }) => {
  // 1) Create page with Group (section-cards) → Heading + Paragraph + Link
  // 2) Assert computed styles (font-size, margin-bottom, link color) match presets
  // 3) Duplicate Group inside a Group (nested) and ensure inner rules still win
});
```

Use selectors by **block wrapper class** plus the auto `is-style-{slug}` class, mirroring Block Styles API behaviour.

---

## Linting rules (CI)

- Validate against **theme.json v3** schema via `$schema` and a JSON schema check.
- Enforce: has `slug`, `title`, `blockTypes`, **no disallowed CSS** (pseudo-elements), at least one `elements.link` or inner `blocks.*` rule.
- Check tokens: only `var:preset|…` or theme variables for colours/spacing/typography. Dev Blog & API pages confirm v3 and `style_data` conventions.

---

## Make/Core (24 Jun 2024) — _“Section Styles”_

**What it is:** Official feature announcement + quick how-to.

**Key points**

- Section styles are **block style variations** defined in **theme.json partials** under **`/styles/`**, scoped by `blockTypes` (e.g., Group/Columns/Cover).
- How to **apply** in the editor, and **limitations** for 6.6 (root styles in Global Styles, no per-variation settings, etc.).

**Why it matters**

- Provides the **canonical folder structure**, editor UX, and **current limits** we’ll document in the Copilot.

---

## WP Dev Blog (21 Jun 2024) — _“Styling sections, nested elements, and more with Block Style Variations in WordPress 6.6”_

**What it is:** Hands-on tutorial from Core team on using section styles.
**Key points**

- Shows **JSON structure**: `blockTypes`, `styles.color/spacing`, **`elements.link`**, and **`blocks.core/*`** for inner targeting.
- Demonstrates **nested application** and managing **cascades** via JSON (not CSS).
- Notes practical **limitations** and **tips** for predictable outcomes.

**Why it matters**

- This is the **best practice cookbook** we’ll codify into the Copilot’s generators and debug playbooks.

---

## WP Dev Blog (Feb 2023) — _“Intrinsic design, theming, and rethinking how to design with WordPress”_

**What it is:** Design philosophy that informed the section-style direction.
**Key points**

- Advocates **intrinsic design**: fluid, token-driven, systemised scales for spacing/typography/colour.
- Encourages **theme.json as the source of truth**, avoiding ad-hoc CSS.

**Why it matters**

- Backs our **token mapping** (Figma → presets) and **fluid spacing** approach in Copilot guidance.

---

## 7) Gutenberg Issue #57537 — _“Section Styling, Colorways, and Typesets for WP 6.6”_ (tracking/design)

**What it is:** The **planning/tracking issue** for the feature.
**Key points**

- Documents the plan: **reduce specificity**, refine block style variations, push section styling into **6.6**.
- Introduces **`gutenberg_register_block_style`**, integration with **`theme.json`**, and support for **inner elements/blocks** (but not arbitrarily deep/over-specific variants).
- Mentions referencing shared definitions via `styles.blocks.variations`.

**Why it matters**

- Explains the **rationale & constraints** we must uphold in our lint rules and Copilot “dos/don’ts”.

---

## Reference Links

- [Section Styles – Make WordPress Core](https://make.wordpress.org/core/2024/06/24/section-styles/)
- [WordPress Developer Resources: Intrinsic design, theming, and rethinking how to design with WordPress](https://developer.wordpress.org/news/2023/02/intrinsic-design-theming-and-rethinking-how-to-design-with-wordpress/)
- [Styling sections, nested elements, and more with Block Style Variations in WordPress 6.6 – WordPress Developer Blog](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/)
- ["Section Styling, Colorways, and Typesets for WP 6.6 · Issue #57537 · WordPress/gutenberg · GitHub](https://github.com/WordPress/gutenberg/issues/57537)
- ["Section styles: editing a block variation in Styles doesn't reflect in the editor · Issue #62303 · WordPress/gutenberg · GitHub](https://github.com/WordPress/gutenberg/issues/62303)
- [Section Styles: unecessary additional CSS output · Issue #62457 · WordPress/gutenberg · GitHub](https://github.com/WordPress/gutenberg/issues/62457)
- [Styles in the Editor – Block Editor Handbook - Developer.WordPress.org](https://developer.wordpress.org/block-editor/explanations/architecture/styles/)

---
