# Block Theme — Pattern Implementation & Registration Guide

This implementation guide gives concrete instructions for merging the attached patterns into a single, consistent LightSpeed pattern library (namespace: lsx-design). It includes file conventions, header requirements, registration recommendations (file-based + programmatic), pattern category registration, template-part areas, migration plan and QA checklist.

Use this for actual implementation and PRs.

---

## Quick summary of outcomes

### Goals
- Canonical namespace: lsx-design/*
- Folder structure for repo organisation (patterns/10-sections, 20-queries, etc.)
- Curated pattern categories (lsx-design/sections, lsx-design/posts, etc.)
- All pattern files contain maximal PHP header metadata (see header spec)
- Programmatic registration only used for translations or conditional patterns (e.g., Woo)
- Template part areas registered sparingly via theme.json and align with WP Site Editor expectations

---

## 1) File & folder structure (authoring)

### Recommended folders 
- patterns/
  - 00-foundations/
  - 10-sections/
  - 20-queries/
  - 30-headers/
  - 40-footers/
  - 50-template-parts/
  - 60-pages/
  - 70-templates/
  - 80-woocommerce/

### File rules 
- Filenames mirror slug: lsx-design/<slug> → file <optional-prefix>-<slug>.php
- One pattern per file. Keep patterns small and composable.
- Note: WordPress auto-registers PHP files in /patterns/ regardless of subfolders.

---

## 2) Full PHP pattern header (max fields)

### Template header template 
```php
<?php
/**
 * Title:           <Human readable Title>
 * Slug:            lsx-design/<short-slug>
 * Description:     <Short 1–2 line description>
 * Categories:      lsx-design/sections, lsx-design/posts
 * Keywords:        kw1, kw2, kw3
 * Viewport Width:  1368
 * Block Types:     core/query, core/template-part/header, core/post-content
 * Post Types:      page, post
 * Template Types:  front-page, home, index, single, page, archive, category
 * Inserter:        yes|no
 * Inserter Priority: 10          // optional numeric ordering in inserter
 * Required Plugins: WooCommerce  // optional hint for reviewers
 * Author:          Team Name
 * Version:         1.0.0
 */
?>
```

### Notes 
- Title, Slug and Categories are mandatory.
- Block Types should be exact block names (core/query, core/template-part/header, woocommerce/product, etc.).
- Template Types should use the canonical list (see section 9).
- Inserter: `yes` usually — use `no` for template-type-only patterns.
- Use i18n for user-visible strings inside pattern content.

---

## 3) Pattern header examples

### Block-type pattern (Query Loop item — Post Card) 
```php
<?php
/**
 * Title: Blog Post Card
 * Slug: lsx-design/blog-post-card
 * Description: Card-style post list item with image, title, excerpt and meta.
 * Categories: lsx-design/card, lsx-design/posts
 * Keywords: card, post, excerpt, image, read-more
 * Viewport Width: 600
 * Block Types: core/query
 * Post Types:
 * Inserter: yes
 */
?>
<!-- wp:group ... -->
```

### Template-part pattern (menu panel) 
```php
<?php
/**
 * Title: Menu Card 1
 * Slug: lsx-design/menu-card-1
 * Description: Menu card with quick links and CTA; used in header menu panels.
 * Categories: lsx-design/menu
 * Keywords: menu, panel, nav, quick-links
 * Viewport Width: 800
 * Block Types: core/template-part/menu
 * Post Types:
 * Inserter: yes
 */
?>
<!-- wp:group ... -->
```

### Starter / Template-type pattern 
```php
<?php
/**
 * Title: Blogging home template
 * Slug: lsx-design/template-home-blogging
 * Description: Starter template for a simple blogging homepage.
 * Categories: lsx-design/templates
 * Keywords: home, blog, starter, index
 * Viewport Width: 1400
 * Block Types:
 * Post Types:
 * Template Types: front-page, home, index
 * Inserter: no
 */
?>
<!-- wp:pattern {"slug":"lsx-design/post-loop-grid-default"} /-->
```

---

## 4) Pattern type guidelines (what fields to use)

### Block-type patterns 
- Use Block Types field (e.g., core/query, core/template-part/header)
- Category: lsx-design/sections or lsx-design/posts
- Inserter: yes

### Query Loop patterns 
- Block Types: core/query
- Provide both item (post-card) and container (query-grid-2col) patterns
- Categories: lsx-design/posts (item), lsx-design/sections (container)
- Ensure excerpt/read-more accessible labels and image srcset placeholders

### Template-part patterns 
- Block Types: core/template-part/header | core/template-part/footer | core/template-part/menu
- Categories: lsx-design/header, lsx-design/footer, lsx-design/menu
- Provide structured locking recommendations in comments

### Starter patterns (page / template) 
- Block Types: core/post-content
- Post Types: page (for page starters)
- Template Types: set for template starters
- Inserter: yes for page starters; Inserter: no for template-type starters

### WooCommerce patterns 
- Register conditionally (init hook check for class_exists( 'WooCommerce' ))
- Category: lsx-design/woocommerce
- Block Types: woocommerce/...

---

## 5) Pattern category registration (recommended code)

### Registration example (functions.php) 
```php
add_action( 'init', function() {
  $cats = [
    'lsx-design/sections'  => __( 'LSX: Sections', 'lsx-design' ),
    'lsx-design/posts'     => __( 'LSX: Posts', 'lsx-design' ),
    'lsx-design/header'    => __( 'LSX: Header', 'lsx-design' ),
    'lsx-design/footer'    => __( 'LSX: Footer', 'lsx-design' ),
    'lsx-design/menu'      => __( 'LSX: Menu', 'lsx-design' ),
    'lsx-design/card'      => __( 'LSX: Cards', 'lsx-design' ),
    'lsx-design/cta'       => __( 'LSX: CTAs', 'lsx-design' ),
    'lsx-design/meta'      => __( 'LSX: Meta', 'lsx-design' ),
    'lsx-design/utility'   => __( 'LSX: Utility', 'lsx-design' ),
    'lsx-design/templates' => __( 'LSX: Templates', 'lsx-design' ),
    'lsx-design/woocommerce' => __( 'LSX: WooCommerce', 'lsx-design' ),
  ];
  foreach ( $cats as $slug => $label ) {
    register_block_pattern_category( $slug, [ 'label' => $label ] );
  }
} );
```

### Notes 
- Keep the category list small and predictable for editors.
- Prefer core categories when they fit; add LS categories only when necessary.

---

## 6) theme.json — templateParts & bundle patterns

### templateParts example 
```json
"templateParts": [
  { "slug": "header", "title": "Header" },
  { "slug": "footer", "title": "Footer" },
  { "slug": "hero", "title": "Hero" },
  { "slug": "sidebar", "title": "Sidebar" }
]
```

### patterns array example 
```json
"patterns": [
  "lsx-design/hero-page",
  "lsx-design/post-card",
  "lsx-design/header-primary"
]
```

### Notes 
- Register templateParts in theme.json so they appear in the Site Editor.
- Use the patterns array to bundle curated or remote patterns.

---

## 7) Programmatic registration (when to use)

### When to use 
- You need translated title/description at registration time.
- You need conditional registration (e.g., WooCommerce).
- You must generate pattern content dynamically.

### Example conditional registration 
```php
add_action( 'init', function() {
  if ( class_exists( 'WooCommerce' ) ) {
    register_block_pattern( 'lsx-design/wc-collection-grid', [
      'title' => __( 'LSX: Product Collection Grid', 'lsx-design' ),
      'categories' => [ 'lsx-design/woocommerce' ],
      'content' => '<!-- wp:group -->...<!-- /wp:group -->'
    ] );
  }
} );
```

### Caveats 
- Do not use programmatic registration to replace file-based patterns when static PHP file headers are sufficient.
- Avoid conditional functions that rely on the main query during registration.

---

## 8) Migration & merge plan (step-by-step)

### 1) Inventory 
- Create a complete list of existing pattern files and current slugs → proposed canonical slug (lsx-design/*). I can produce this inventory from the attached snippets.

### 2) Dedupe & mapping 
- Group duplicates by behaviour (e.g., several post-card variants) and choose a canonical variant. Mark alternatives as post-card-alt or post-card-compact.

### 3) Standardize filenames & headers 
- Rename files to match slugs; add full PHP headers (max fields).
- Move files into recommended folders (optional for repo).

### 4) Update references
- Replace pattern references in templates and parts:
  <!-- wp:pattern {"slug":"lsx/..."} /--> → lsx-design/...
- Update theme.json patterns array & templateParts if necessary.

### 5) Register categories & templatePart areas 
- Add register_block_pattern_category calls
- Update theme.json templateParts list

### 6) Conditional registrations 
- For Woo patterns, register with init conditional

### 7) Tests & QA 
- Visual testing in Site Editor
- Accessibility checks (heading order, alt text, ARIA)
- Editor UX (inserter visibility per Block Types / Template Types)
- Performance checks (inserter preview)

### 8) PR & review 
- Create a branch, commit changes, open PR with mapping and screenshots
- Keep backups or a migration commit log for rollback

---

## 9) Template Types canonical list (use these in headers)

### Allowed Template Types 
- index, home, front-page, singular, single, page, archive, author, category, taxonomy, date, tag, attachment, search, privacy-policy, 404

### Notes 
- Set Template Types exactly when a pattern is intended as a template starter.
- Use `Inserter: no` for template-type patterns that should not appear in the general inserter.

---

## 10) Naming conventions & variants

### Pattern slugs 
- Format: lsx-design/<area>-<purpose>-<variant>
  - area: hero, post, header, footer, menu, cta, author, query, loop, template
  - purpose: page, post, grid, card, primary, minimal
  - variant: compact, wide, alt, stacked

### Examples 
- lsx-design/hero-page
- lsx-design/post-card
- lsx-design/query-grid-2col
- lsx-design/header-primary
- lsx-design/menu-card-1

### Prefix guidance 
- Consider `section-` prefix for section patterns (optional): `lsx-design/section-hero-page`
- Prefer short slugs unless the prefix adds clarity.

---

## 11) Locking & editor UX guidance

### Locking guidance 
- Lock structural blocks: move/remove false for headers, footers, and complex grids (apply via block lock JSON in pattern)
- Allow content-only edits where appropriate
- Document locked areas via inline HTML comments in pattern files

### Best practices 
- Lock only what must remain fixed; allow text/image edits inside inner blocks.
- Explain locking decisions in pattern file comments for maintainers and reviewers.

---

## 12) Accessibility & i18n checklist

### Accessibility checklist 
- One visible H1 per page (templates supply H1; sections should use H2/H3)
- Alt text placeholders for images
- Buttons have descriptive text
- Colors and contrast reference theme.json tokens
- Logical order and keyboard focusable interactive elements

### Internationalisation 
- All user text wrapped in translation functions when pattern content is PHP (__, esc_html_e, etc.)
- Use `esc_url( get_theme_file_uri() )` for asset URLs
- Test patterns in RTL

---

## 13) QA & PR checklist

### Pre-PR checklist 
- Slug and filename match
- Header includes required fields
- Pattern placed in correct category folder
- Inserter visibility correct (Block Types / Template Types / Inserter)
- theme.json updated (patterns & templateParts)
- Visual screenshots attached to PR
- Accessibility notes included
- If Woo patterns included, verify conditional registration

---

## 14) Migration script (recommended safe approach)

### Script plan 
- Create branch `feature/pattern-merge-lsx-design`
- Replace occurrences of old slugs (lsx/) with lsx-design/ in tracked files
- Ensure files renamed to new slug-based filenames if requested
- Commit and open PR

### Offer 
- I can produce an executable script that runs these steps and leaves a commit/branch for review.

---

## 15) Next steps & options I can implement

### Available actions 
- Produce the inventory mapping of attached files → canonical lsx-design slugs
- Generate canonical pattern files for top-priority patterns (hero-page, post-card, query-grid-2col, header-primary, footer-primary, author-card-compact) with full headers and translations
- Create functions.php snippets to register categories and conditional Woo patterns
- Provide the rename/migration script and open a PR for lightspeedwp/tsp-lsx-child

Which of the next steps would you like me to run now? I can start by generating the inventory map of the attached snippets and proposed canonical slugs.
