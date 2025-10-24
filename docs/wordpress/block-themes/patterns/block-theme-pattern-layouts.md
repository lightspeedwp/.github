# Block Theme — Essential Pattern Layouts & Category Map

This document defines the canonical pattern layout inventory, naming conventions, folder structure and the pattern → template/part mapping for the LightSpeed block-theme pattern library. All pattern slugs use the project namespace prefix: lsx-design.

Use this document when authoring new patterns, reviewing existing patterns, or composing templates with patterns.

## Goals
- Consolidate duplicate concepts and canonicalize pattern slugs to lsx-design/*
- Provide a small, sensible set of pattern categories and folder groups
- Ensure each pattern file contains a full PHP header with every applicable field
- Encourage reuse: small, single-purpose patterns that compose into starter pages and templates

---

## Namespace & top-level rules
- Pattern slug namespace: lsx-design (example: lsx-design/hero-page)
- Files live in theme_root/patterns/ (use subfolders for repo organisation only; WordPress auto-registers regardless of subfolders)
- Filenames mirror slugs and may use an optional numeric prefix for repo ordering:
  - patterns/10-sections/20-hero-page.php → slug lsx-design/hero-page
- Use kebab-case for slugs and filenames
- Keep one pattern per file

---

## Recommended folder groups (for repo organisation)
- patterns/00-foundations/ — atomic bits (icons, badges, tiny components)
- patterns/10-sections/ — hero, CTA, feature rows, testimonials, team
- patterns/20-queries/ — Query Loop containers & item templates (post-card, loop-default)
- patterns/30-headers/ — header variants (header-primary, header-minimal)
- patterns/40-footers/ — footer variants
- patterns/50-template-parts/ — mobile-nav-panel, search-panel, site-notice (block-type: template-part/*)
- patterns/60-pages/ — starter page patterns (homepage, about, blog index)
- patterns/70-templates/ — template-type starter patterns (Inserter: no; Template Types set)
- patterns/80-woocommerce/ — WooCommerce-specific patterns (register only when Woo active)

Do not rely on folder structure for registration — use it only for humans and code review.

---

## Pattern categories (register a small, curated set)
We recommend registering these pattern categories (use register_block_pattern_category in functions.php):

- lsx-design/sections — general page sections (heroes, features)
- lsx-design/posts — post-related (post-card, loop-default)
- lsx-design/header — header / nav patterns
- lsx-design/footer — footer patterns
- lsx-design/menu — menu / panel patterns
- lsx-design/card — small card components (author-card, testimonial)
- lsx-design/cta — call-to-action / banners
- lsx-design/meta — post-meta, breadcrumbs, share-actions
- lsx-design/utility — site-notice, search-panel, mobile-nav-panel
- lsx-design/woocommerce — WooCommerce (only when applicable)
- lsx-design/pages — starter pages and page-level patterns
- lsx-design/templates — template starter patterns (Template Types; Inserter: no)

Keep categories limited so the inserter stays usable.

Example category registration (functions.php):
```php
add_action( 'init', function() {
  register_block_pattern_category(
    'lsx-design/sections',
    ['label' => __( 'LSX: Sections', 'lsx-design' )]
  );
  // register other categories...
} );
```

---

## Template-part areas to register (minimal list)
Register only essential template part areas in theme.json to keep the Site Editor clean:

- header
- footer
- hero
- site-notice
- mobile-nav-panel
- search-panel
- sidebar
- author-card
- comments
- loop-default (optional as part)
- post-card (pattern)
- breadcrumbs
- cta-banner
- language-switcher
- currency-switcher

Register areas that are meaningful in the site editor — do not register many tiny areas.

---

## Canonical pattern inventory (high-level)

1. Hero patterns (block-type neutral; use as parts/hero.html)
- lsx-design/hero-page — large page hero (front-page, page)
- lsx-design/hero-post — post hero (single)
- lsx-design/hero-archives — archive/term hero (archive, category, tag, taxonomy)

2. Headers
- lsx-design/header-primary — full header (template-part)
- lsx-design/header-minimal — minimal header (template-part)
- lsx-design/header-with-banner — header with CTA bar

3. Footers
- lsx-design/footer-primary — rich footer (template-part)
- lsx-design/footer-compact — compact footer (template-part)
- lsx-design/footer-centered — centered footer

4. Query & Loop Patterns
- lsx-design/post-card — card item for Query Loop (Block Types: core/query)
- lsx-design/loop-default — fallback item for small lists (Block Types: core/query)
- lsx-design/query-grid-2col — Query Loop container (Block Types: core/query)
- lsx-design/query-list-1col — Query Loop container (Block Types: core/query)
- lsx-design/post-loop-grid-default — default grid pattern for index/archive

5. Post / Author parts
- lsx-design/post-meta — reusable post meta bar
- lsx-design/author-card-compact — small author summary
- lsx-design/author-card-full — full author profile

6. Utility / Panels
- lsx-design/site-notice — dismissible top notice (utility)
- lsx-design/mobile-nav-panel — off-canvas nav (template-part/menu)
- lsx-design/search-panel — overlay search pattern (utility)
- lsx-design/breadcrumbs — breadcrumbs trail (meta category)

7. CTA / Promo
- lsx-design/cta-banner — small CTA band
- lsx-design/text-call-to-action — text CTA variants (from attached patterns)

8. Menus & Cards
- lsx-design/menu-card-1 … menu-card-N — menu panel variants (Block Types: core/template-part/menu)
- lsx-design/menu-panel-1 … menu-panel-N — mega menu / panel variants

9. Comments & Author
- lsx-design/post-comments — configured comments region (Inserter: false; used in single templates)

10. Starter Pages & Template-type patterns (Inserter: no for template-type starters)
- lsx-design/page-home — homepage starter (Block Types: core/post-content; Post Types: page; Inserter: true/false as intended)
- lsx-design/template-home-blogging — starter template for blogging (Template Types: front-page, home, index; Inserter: no)
- lsx-design/page-about — about page starter
- lsx-design/blog-page — page containing post-loop pattern

Note: This list should be used as the initial canonical registry; implementers should dedupe duplicates (see Plan of Action).

---

## Pattern → Template mapping (quick reference)
- templates/front-page.html → parts/skip-links, parts/header, lsx-design/hero-page, lsx-design/query-grid-2col, lsx-design/cta-banner, parts/footer
- templates/home.html / index.html → parts/header, lsx-design/query-grid-2col / post-card, pagination, parts/footer
- templates/single.html → parts/header, optional lsx-design/hero-post, Post Title (H1), lsx-design/post-meta, Post Content, lsx-design/author-card-full, lsx-design/post-comments, footer
- templates/archive.html → header, lsx-design/hero-archives, lsx-design/loop-default or post-card grid, pagination, footer
- templates/search.html → header (search visible), heading "Search results for: {query}", Query Loop (search), footer
- templates/404.html → header, H1 "Page Not Found", search form, suggested posts (loop-default), footer

Include patterns in templates using:
<!-- wp:pattern {"slug":"lsx-design/post-card"} /-->

---

## Starter patterns (recommended)
Starter patterns are curated page-level or template-type patterns used in the "Add New" flows. They should use:
- Block Types: core/post-content
- Post Types: page (where applicable)
- Template Types: set for template starters
- Inserter: yes for normal starter pages; use Inserter: no + Template Types for template-only starters

Examples:
- lsx-design/page-home — Front page starter (Block Types: core/post-content; Post Types: page)
- lsx-design/template-home-blogging — Template starter for blogging (Template Types: front-page, home, index; Inserter: no)
- lsx-design/page-about — About page starter (Block Types: core/post-content; Post Types: page)

---

## Notes on querying / performance
- Keep Query Loop default per-page small (e.g., 3–6 items) for inserter preview performance
- Provide paginated containers and let templates add pagination blocks
- For WooCommerce patterns, register patterns conditionally when Woo is active

---

## Dedupe rules & migration notes
- For existing files that use the old slug ns (lsx/...), migrate slugs to lsx-design/* consistently.
- Replace pattern references in templates/parts (<!-- wp:pattern {"slug":"lsx/..."} /--> → lsx-design/...)
- Consolidate variants: if multiple post-card implementations exist, standardize on one canonical lsx-design/post-card and create ornamented variants (post-card-alt) as needed.

---

If you want I can generate:
- an inventory report (list of attached files with current slug → proposed new slug)
- a migration script to rename slugs and update pattern references in templates
- starter pattern files for the prioritized list (homepage, blog home, about)

Which would you like to proceed with next?