# Pattern Category Implementation & Registration Guide (Canonical)

Audience: LightSpeed block theme engineers & maintainers  
Scope: All pattern categories required (and permitted) for the patterns defined across the attached documentation plus the currently existing patterns under `/patterns/` (including subfolders).  
Primary Namespace: `lsx-design` (custom categories) while re‑using Core categories whenever possible to keep the Inserter familiar and uncluttered.

---

## 1. Goals

- Provide a **single canonical inventory** of pattern categories to register.
- Minimize category sprawl → fewer, clearer buckets for editors.
- Map **slug / filename prefixes → category** for automated linting.
- Define conditional categories (WooCommerce, experimental) and deprecation rules.
- Supply production‑ready registration code (functions.php) with i18n & safety checks.
- Offer QA & migration steps to consolidate any legacy or divergent categories.

---

## 2. Category Strategy Overview

1. **Prefer Core categories first** (e.g., `banner`, `posts`, `query`, `header`, `footer`, `gallery`, `text`, `media`, `call-to-action`, `social`, `columns`).
2. Introduce **only a small curated set of custom `lsx-design/*` categories** where Core vocabulary is insufficient for editor discovery or where grouping increases reuse (e.g., `lsx-design/menu`, `lsx-design/sections`).
3. Keep **custom names concise, audience-friendly, translatable**, and consistently prefixed with `lsx-design/`.
4. Use **one category per conceptual dimension**—avoid near synonyms (e.g., don’t add both `lsx-design/cards` and `lsx-design/card`).
5. Conditionals:
   - WooCommerce category registered only if WooCommerce is active.
   - Experimental / deprecated categories hidden behind feature toggles or filters.

---

## 3. Canonical Category Inventory

### 3.1 Custom LSX Categories (register these)

| Category Slug             | Label (UI)          | Purpose / Contents (Pattern Slug Prefixes)                             | Notes |
|---------------------------|---------------------|-------------------------------------------------------------------------|-------|
| lsx-design/sections       | LSX: Sections       | Generic page sections (hero/page, feature rows, testimonials, pricing) | Broad “page building” bucket |
| lsx-design/query          | LSX: Query Layouts  | Query Loop containers & item layouts (`query-`, `loop-`)               | Containers & item wrappers |
| lsx-design/posts          | LSX: Post Items     | Post cards & loop items (`post-card`, `post-meta`, `share-actions`)    | Narrower than sections; item-level |
| lsx-design/header         | LSX: Header         | Header template-part variants (`header-`)                              | Block-type patterns: `core/template-part/header` |
| lsx-design/footer         | LSX: Footer         | Footer template-part variants (`footer-`)                              | Block-type patterns: `core/template-part/footer` |
| lsx-design/menu           | LSX: Menu / Panels  | Mega menu panels, mobile nav, menu cards (`menu-`, `mobile-menu-`)     | Block-type: `core/template-part/menu` |
| lsx-design/hero           | LSX: Hero           | Hero variants (`hero-`) (page, post, archives)                         | Optional; else use `banner` core |
| lsx-design/cta            | LSX: CTAs           | CTA banners, promo strips (`cta-`, `cta-banner`)                       | |
| lsx-design/meta           | LSX: Meta           | Post meta bars, breadcrumbs, author cards (`post-meta`, `breadcrumbs`, `author-card-`) | “Glue” info components |
| lsx-design/utility        | LSX: Utility        | Site notice, search panel, language/currency switchers (`site-notice`, `search-panel`, `language-`, `currency-`) | Non-content overlays & bars |
| lsx-design/pages          | LSX: Page Starters  | Starter page patterns (`page-`) (Block Types: `core/post-content`)     | Use for editor “Add Page” flows |
| lsx-design/templates      | LSX: Template Starters | Template-type patterns (`template-`) (Template Types + `Inserter: no`) | Hidden from general inserter |
| lsx-design/card (optional consolidation) | LSX: Cards | Author card, testimonial, generic card components (`*-card(-*)`) | Use only if many card micro-patterns |
| lsx-design/woocommerce (conditional) | LSX: WooCommerce | Product grids, collection layouts, single product sections (`wc-`, `product-`, `woocommerce-`) | Register only if Woo active |

Recommended Default Core Reuse (no custom prefix needed):
- `banner` (hero patterns if you opt NOT to use `lsx-design/hero`)
- `posts` (alternative to `lsx-design/posts` if you want purely core; choose one scheme)
- `query`
- `header`
- `footer`
- `social`
- `media`
- `text`
- `featured`
- `call-to-action` (optional instead of `lsx-design/cta` – decide & stay consistent)

### 3.2 Choose One of Two Directional Sets

Because prior docs show both a “Core+Custom Hybrid” and “All Custom” approach, decide:

A. **Hybrid (Recommended)** – Lean on Core categories; custom only where necessary:
- Keep Core: `banner`, `posts`, `query`, `header`, `footer`, `social`
- Custom: `lsx-design/menu`, `lsx-design/sections`, `lsx-design/meta`, `lsx-design/utility`, `lsx-design/pages`, `lsx-design/templates`, `lsx-design/woocommerce`, optionally `lsx-design/cta`, `lsx-design/hero` (if you want separation beyond `banner`).

B. **All Custom** – Use `lsx-design/*` for every domain-specific grouping:
- Remove overlapping Core categories from pattern headers except where Core semantics aid search (you can dual-tag: `Categories: banner, lsx-design/hero`).
- Increases maintenance overhead; not advised unless you have curation tooling that enforces naming.

> Action: Pick Set A (Hybrid) unless there is a strong product/design decision otherwise.

---

## 4. Mapping Slug Prefixes → Categories (Lint Rules)

Use these rules for an automated validator (pseudo-regex):

| Slug Pattern / Prefix         | Enforced Category (Primary)          | Secondary (Optional) |
|-------------------------------|--------------------------------------|----------------------|
| `hero-*`                      | banner OR lsx-design/hero            | lsx-design/sections  |
| `header-*`                    | lsx-design/header                    | header (core)        |
| `footer-*`                    | lsx-design/footer                    | footer (core)        |
| `menu-*`, `mobile-menu-*`     | lsx-design/menu                      | navigation (core)    |
| `query-*`, `loop-*`           | lsx-design/query                     | query (core)         |
| `post-card*`, `post-meta*`    | lsx-design/posts                     | posts (core)         |
| `author-card*`                | lsx-design/meta OR lsx-design/card   | authors (core)       |
| `breadcrumbs*`                | lsx-design/meta                      | navigation (core)    |
| `cta-*`, `cta-banner*`        | lsx-design/cta                       | call-to-action (core)|
| `site-notice`, `search-panel` | lsx-design/utility                   |                      |
| `language-*`, `currency-*`    | lsx-design/utility                   |                      |
| `page-*`                      | lsx-design/pages                     |                      |
| `template-*`                  | lsx-design/templates                 |                      |
| `wc-*`, `woocommerce-*`, `product-*` | lsx-design/woocommerce       |                      |
| `*-card*` (generic others)    | lsx-design/card (if enabled)         |                      |

Lint rule summary:
1. Every pattern must have at least one allowed category.
2. If a slug matches a prefix rule, ensure mapped category present.
3. Disallow more than 3 custom categories per pattern (avoid noise).

---

## 5. Registration Code (functions.php)

### 5.1 Core Implementation

```php
<?php
/**
 * Register LightSpeed pattern categories (canonical list).
 * Keep this early on init so file-based pattern auto-registration can attach them.
 */

add_action( 'init', function() {

    if ( ! function_exists( 'register_block_pattern_category' ) ) {
        return;
    }

    // Base set (Hybrid strategy).
    $categories = [
        'lsx-design/sections'  => [
            'label'       => __( 'LSX: Sections', 'lsx-design' ),
            'description' => __( 'Reusable page sections (heroes, features, testimonials, pricing, etc.)', 'lsx-design' ),
        ],
        'lsx-design/query'     => [
            'label'       => __( 'LSX: Query Layouts', 'lsx-design' ),
            'description' => __( 'Query Loop containers and item layouts.', 'lsx-design' ),
        ],
        'lsx-design/posts'     => [
            'label'       => __( 'LSX: Post Items', 'lsx-design' ),
            'description' => __( 'Post cards, meta bars, share actions.', 'lsx-design' ),
        ],
        'lsx-design/header'    => [
            'label'       => __( 'LSX: Header', 'lsx-design' ),
            'description' => __( 'Header template-part variants.', 'lsx-design' ),
        ],
        'lsx-design/footer'    => [
            'label'       => __( 'LSX: Footer', 'lsx-design' ),
            'description' => __( 'Footer template-part variants.', 'lsx-design' ),
        ],
        'lsx-design/menu'      => [
            'label'       => __( 'LSX: Menu / Panels', 'lsx-design' ),
            'description' => __( 'Mega menu, menu panels, mobile navigation patterns.', 'lsx-design' ),
        ],
        'lsx-design/hero'      => [
            'label'       => __( 'LSX: Hero', 'lsx-design' ),
            'description' => __( 'Hero (banner) variants for pages, posts, archives.', 'lsx-design' ),
        ],
        'lsx-design/cta'       => [
            'label'       => __( 'LSX: CTAs', 'lsx-design' ),
            'description' => __( 'Call-to-action banners and promo strips.', 'lsx-design' ),
        ],
        'lsx-design/meta'      => [
            'label'       => __( 'LSX: Meta', 'lsx-design' ),
            'description' => __( 'Author cards, breadcrumbs, taxonomy/meta bars.', 'lsx-design' ),
        ],
        'lsx-design/utility'   => [
            'label'       => __( 'LSX: Utility', 'lsx-design' ),
            'description' => __( 'Site notice, search panel, language & currency switchers.', 'lsx-design' ),
        ],
        'lsx-design/pages'     => [
            'label'       => __( 'LSX: Page Starters', 'lsx-design' ),
            'description' => __( 'Starter page patterns (Block Types: core/post-content).', 'lsx-design' ),
        ],
        'lsx-design/templates' => [
            'label'       => __( 'LSX: Template Starters', 'lsx-design' ),
            'description' => __( 'Template-type patterns (Template Types, Inserter: no).', 'lsx-design' ),
        ],
    ];

    // Optional categories (enable only if needed).
    if ( apply_filters( 'lsx_design_enable_card_category', false ) ) {
        $categories['lsx-design/card'] = [
            'label'       => __( 'LSX: Cards', 'lsx-design' ),
            'description' => __( 'Generic / micro card components.', 'lsx-design' ),
        ];
    }

    // Conditional WooCommerce category.
    if ( class_exists( 'WooCommerce' ) ) {
        $categories['lsx-design/woocommerce'] = [
            'label'       => __( 'LSX: WooCommerce', 'lsx-design' ),
            'description' => __( 'Product grids, collection & single-product section patterns.', 'lsx-design' ),
        ];
    }

    foreach ( $categories as $slug => $args ) {
        // WP core ignores duplicates gracefully; you can defensively skip if already set.
        register_block_pattern_category( $slug, $args );
    }
}, 9 );
```

### 5.2 Optional: Remove Core & Remote Patterns (Curated UX)

```php
add_action( 'after_setup_theme', function() {
    remove_theme_support( 'core-block-patterns' );
} );

add_filter( 'should_load_remote_block_patterns', '__return_false' );
```

### 5.3 Lint Helper (Optional – CI / Dev Tool)

Pseudocode (build as WP-CLI or a PHP script):

```
scan /patterns/**/*.php
  parse header (Slug:, Categories:)
  derive expected category via prefix map
  if expected not in Categories -> ERROR
  if > 3 custom categories -> WARN
  if woo prefix (wc-*) but Woo category missing -> WARN
```

---

## 6. Pattern Header Category Examples

```php
/**
 * Title: Header: Primary
 * Slug: lsx-design/header-primary
 * Categories: lsx-design/header
 * Block Types: core/template-part/header
 * Viewport Width: 1368
 * Inserter: yes
 * Description: Primary site header with branding and navigation pattern slot.
 */
```

```php
/**
 * Title: Hero: Page
 * Slug: lsx-design/hero-page
 * Categories: banner, lsx-design/hero
 * Block Types: core/cover
 * Viewport Width: 1368
 * Inserter: yes
 * Description: Full-width hero for landing & front pages.
 */
```

```php
/**
 * Title: Query: Grid (2 Columns)
 * Slug: lsx-design/query-grid-2col
 * Categories: lsx-design/query
 * Block Types: core/query
 * Viewport Width: 1200
 * Inserter: yes
 * Description: Two-column Query Loop container using Post Card item pattern.
 */
```

```php
/**
 * Title: Menu Panel — Columns
 * Slug: lsx-design/menu-panel-1
 * Categories: lsx-design/menu
 * Block Types: core/template-part/menu
 * Viewport Width: 1260
 * Inserter: yes
 * Description: Wide mega menu panel with multi-column layout and CTA slot.
 */
```

```php
/**
 * Title: CTA Banner: Simple
 * Slug: lsx-design/cta-banner
 * Categories: lsx-design/cta
 * Viewport Width: 1440
 * Inserter: yes
 * Description: Narrow site-wide promotional CTA band.
 */
```

```php
/**
 * Title: Product Collection Grid
 * Slug: lsx-design/wc-collection-grid
 * Categories: lsx-design/woocommerce
 * Block Types: woocommerce/product-query
 * Viewport Width: 1400
 * Inserter: yes
 * Description: Product collection grid with responsive columns and filter slot.
 * Required Plugins: WooCommerce
 */
```

---

## 7. Decision & Migration Guidelines

| Scenario                                    | Action |
|---------------------------------------------|--------|
| Pattern currently uses `banner` only, you adopt `lsx-design/hero` | Add `lsx-design/hero` (keep `banner` for search) |
| Redundant custom category (e.g., `lsx-design/cards` vs `lsx-design/card`) | Choose ONE → update headers → remove obsolete |
| Legacy namespace (`lsx/hero-basic`)         | Migrate slug & categories to `lsx-design/*` simultaneously |
| Woo pattern present but WooCommerce inactive | Still allowed (file-based) but Woo category not registered—Prefer programmatic registration instead |
| Too many categories (>3)                    | Reduce to 1–2 focused, plus 0–1 core fallback |

Migration steps:
1. Inventory headers (script).
2. Map non-canonical → canonical category set.
3. Batch update pattern headers (search/replace).
4. Run linter; fix violations.
5. Commit with “refactor(pattern-categories): canonicalize category inventory”.

---

## 8. QA Checklist (Pre-PR)

- [ ] Registration code present (functions.php) & loads without PHP warnings.
- [ ] All pattern headers contain at least one canonical category.
- [ ] No orphan custom categories left unregistered.
- [ ] Woo patterns conditionally registered OR headers clearly state Required Plugins.
- [ ] Inserter shows reduced, clean category list (manual verification).
- [ ] Pattern count per category feels balanced (no single pattern categories).
- [ ] Linters / CI pass (if implemented).
- [ ] Documentation updated (other guides reference only canonical categories).

---

## 9. Optional Enhancements

| Enhancement | Description | Value |
|-------------|-------------|-------|
| CLI `patterns:categories-audit` | Outputs JSON table of pattern → categories → compliance | Automatable governance |
| theme.json `patterns` curation | Include only high-value patterns in curated list; rely on categories for discovery | Faster Inserter |
| Deprecation meta | Add `Deprecated: true` or `Deprecated-Slug:` in header comments for tooling | Clean migration |
| Category metrics script | Count patterns per category; flag categories with <2 or >25 patterns | Balance library |

---

## 10. Common Pitfalls & Remedies

| Pitfall | Impact | Remedy |
|---------|--------|--------|
| Overlapping categories (hero in both `banner` and multiple custom categories) | User confusion & clutter | Limit to 1 primary + 1 core |
| Registering Woo category without condition | Empty category when plugin absent | Gate with `class_exists( 'WooCommerce' )` |
| Creating a new category for a one-off pattern | Inserter noise | Use existing broader category (`sections`, `utility`) |
| Slug & category mismatch (e.g. `menu-panel-1` without `lsx-design/menu`) | Hard to discover in Menu editing context | Enforce prefix mapping via linter |
| Excessive categories in header (>5) | Inserter clutter | Reduce to ≤3 |

---

## 11. Reference Snippets (Copy/Paste)

### Minimal Hybrid Set (if you drop hero & cta custom)

```php
$minimal = [
  'lsx-design/sections',
  'lsx-design/query',
  'lsx-design/posts',
  'lsx-design/header',
  'lsx-design/footer',
  'lsx-design/menu',
  'lsx-design/meta',
  'lsx-design/utility',
  'lsx-design/pages',
  'lsx-design/templates',
];
```

### Filter Hook to Allow External Customization

```php
$categories = apply_filters( 'lsx_design_pattern_categories', $categories );
```

Place before the `foreach` loop to let child themes extend or remove categories.

---

## 12. Summary

- **Adopt the Hybrid strategy**: Core + a small curated `lsx-design/*` set.
- **Enforce slug → category mapping** to guarantee discovery in block contexts.
- **Conditionally register** WooCommerce category.
- **Automate validation** (prefix rules + max categories).
- **Keep docs synchronized**: any new category must be added here first.

---

If you’d like next:
- I can generate a linter script outline (WP-CLI) for enforcing these rules.
- Produce a migration patch changing existing pattern headers to the canonical set.

Let me know which follow-up you prefer.