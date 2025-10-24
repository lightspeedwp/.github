# Pattern Header Specification — Maximum Fields & Best Practices

This document defines a maximal, practical header specification for file-based block pattern PHP files and shows recommended headers per pattern type (block-type, query item, query container, template-part, starter page, template-type, WooCommerce). Use these headers in `/patterns/` to make patterns discoverable and scoped correctly in the inserter and editor.

## Important rules
- Put pattern files in /patterns/ at the theme root (subfolders allowed for repo organisation).
- Filenames should mirror the slug and may include a numeric prefix for ordering (e.g., 20-hero-page.php).
- Use kebab-case slugs and a single theme/namespace prefix (example: lsx or lsx-design).
- Avoid conditional WP template functions in headers — headers are read at init. Use programmatic registration when you need conditional or translated registration.

---

## Canonical header fields (maximal set)
Include these fields in the top PHP comment where applicable. Fields marked REQUIRED should always be present.

- Title (REQUIRED) — Human readable Title. e.g., "Hero: Page"
- Slug (REQUIRED) — namespaced slug. e.g., lsx/hero-page
- Description — Short 1–2 line description for the inserter.
- Categories (REQUIRED) — comma-separated list. Prefer core categories; add one custom namespace category when needed.
- Keywords — comma-separated search keywords.
- Viewport Width — integer preview width for the inserter (e.g., 1368).
- Block Types — comma-separated block names (e.g., core/query, core/template-part/header). Use to target insert context.
- Post Types — comma-separated post types when pattern targets post editor (e.g., page, post).
- Template Types — comma-separated template contexts (e.g., front-page, home, index). Use in template-type patterns.
- Inserter — yes|no. Use `no` for template-only starters you don’t want the general inserter to show.
- Inserter Priority — optional numeric priority for ordering in the inserter.
- Required Plugins — optional list (e.g., WooCommerce) to note conditional requirements.
- Author — author or team name.
- Version — semantic versioning for pattern iteration.
- Viewport Height — optional (if needed for better preview).
- Post Status — optional hint (not usually required).
- Notes — free-form maintainers note (not displayed by core but useful in repo).
- Example Usage — small hint showing where to use the pattern (optional).

### Header format example (max fields)
```php
<?php
/**
 * Title:           Hero: Page
 * Slug:            lsx/hero-page
 * Description:     Full-width page hero with title, lead and CTA.
 * Categories:      banner, featured
 * Keywords:        hero, page, cta
 * Viewport Width:  1368
 * Viewport Height: 560
 * Block Types:     core/cover
 * Post Types:      page
 * Template Types:  front-page
 * Inserter:        yes
 * Inserter Priority: 10
 * Required Plugins: 
 * Author:          LightSpeed Team
 * Version:         1.0.0
 * Notes:           Use only in landing pages; provide plain-color fallback image.
 */
?>
```

---

## Pattern header examples by pattern type

### Block-type pattern (Query Loop item — Post Card)
Use when the pattern should appear while editing a specific block (core/query).
```php
<?php
/**
 * Title: Blog Post Card
 * Slug: lsx/post-card
 * Description: Card-style Query Loop item with image, title, excerpt and meta.
 * Categories: lsx-design/posts, card
 * Keywords: card, post, excerpt, image, read-more
 * Viewport Width: 600
 * Block Types: core/query
 * Inserter: yes
 * Author: LightSpeed Team
 * Version: 1.0.0
 */
?>
<!-- wp:group ... -->
```

### Query Loop container (grid / list)
Container patterns wrap Query block and configure columns, pagination.
```php
<?php
/**
 * Title: Query: Grid (2 Columns)
 * Slug: lsx/query-grid-2col
 * Description: Two-column Query Loop container using lsx/post-card as item.
 * Categories: lsx-design/sections, posts
 * Keywords: query, grid, posts
 * Viewport Width: 1200
 * Block Types: core/query
 * Inserter: yes
 * Author: LightSpeed Team
 */
?>
<!-- wp:query {"queryId":0,"layout":{"type":"flex","columns":2}} /-->
```

### Template-part pattern (header/footer/menu)
Target core/template-part/* so the pattern appears when inserting template parts.
```php
<?php
/**
 * Title: Header: Primary
 * Slug: lsx/header-primary
 * Description: Site header with site identity, primary nav and search toggle.
 * Categories: lsx-design/header
 * Keywords: header, nav, logo, search
 * Viewport Width: 1368
 * Block Types: core/template-part/header
 * Inserter: yes
 * Version: 1.0.0
 */
?>
<!-- wp:group {"align":"full"} -->...<!-- /wp:group -->
```

### Starter page pattern (Add New Page)
Starter patterns should include Block Types: core/post-content and Post Types.
```php
<?php
/**
 * Title: Page: Homepage Starter
 * Slug: lsx/page-home
 * Description: Starter layout for a homepage with hero, features and CTA.
 * Categories: lsx-design/pages
 * Keywords: home, starter, homepage
 * Viewport Width: 1400
 * Block Types: core/post-content
 * Post Types: page
 * Inserter: yes
 * Author: LightSpeed Team
 */
?>
<!-- wp:pattern {"slug":"lsx/hero-page"} /-->
<!-- wp:pattern {"slug":"lsx/query-grid-2col"} /-->
```

### Template-type pattern (template starter — Inserter: no)
Use Template Types and Inserter: no for patterns that only appear in the New Template flow.
```php
<?php
/**
 * Title: Template: Blog Home (Starter)
 * Slug: lsx/template-home-blogging
 * Description: Starter template for a blog index layout.
 * Categories: lsx-design/templates
 * Keywords: blog, home, starter
 * Viewport Width: 1400
 * Template Types: front-page, home, index
 * Inserter: no
 * Author: LightSpeed Team
 */
?>
<!-- wp:pattern {"slug":"lsx/query-grid-2col"} /-->
```

### WooCommerce-specific pattern (conditional)
Include Required Plugins or register programmatically when WooCommerce must be active.
```php
<?php
/**
 * Title: Product Collection: Grid
 * Slug: lsx/wc-collection-grid
 * Description: Product collection grid for WooCommerce with filters.
 * Categories: lsx-design/woocommerce
 * Keywords: products, collection, shop
 * Viewport Width: 1200
 * Block Types: woocommerce/product-query
 * Required Plugins: WooCommerce
 * Inserter: yes
 * Author: LightSpeed Team
 */
?>
<!-- wp:group ... -->
```
Note: For translation of Title/Description or safe conditional registration, prefer register_block_pattern() in an init hook that checks class_exists('WooCommerce').

---

## Best practices & implementation notes

### Naming & slugs
- Use a single namespace prefix across the theme (e.g., lsx or lsx-design).
- Slug format: namespace/<area>-<purpose>-<variant>. Keep slugs short and descriptive.
- Mirror the slug in the filename: patterns/20-hero-page.php → lsx/hero-page.

### Categories & Keywords
- Prefer core categories where applicable (banner, posts, header, footer).
- Add one custom category namespace only when necessary (e.g., lsx-design/woocommerce).
- Provide 3–8 keywords for editor searchability.

### Viewport metadata
- Set Viewport Width to a representative value (1200–1400) to improve inserter preview.
- Viewport Height is optional and rarely needed.

### Block Types / Post Types / Template Types
- Use Block Types to surface patterns at the point a block is inserted (e.g., core/query).
- Use Post Types for starter page patterns.
- Use Template Types for template starters and set Inserter: no for template-only patterns.

### Inserter visibility & priority
- Inserter: yes|no controls whether pattern shows in general inserter.
- Use Inserter Priority for ordering when needed.

### Internationalization & assets
- Wrap PHP strings using __(), esc_html_e(), etc., when pattern content includes PHP.
- Use assets via esc_url( get_theme_file_uri( 'assets/images/…' ) ).
- Do not hard-code media library URLs in pattern files.

### When to register programmatically
- Need translated Title/Description at registration time.
- Conditional patterns (plugins, feature flags).
- Dynamic content generation at registration time.
If you use register_block_pattern(), run it on init and avoid main-query functions.

### Locking & editor UX
- Lock structural containers (navigation columns, main grid) with block lock attributes in the block JSON:
  - Example: {"lock":{"move":true,"remove":true}}
- Allow inner content edits; only lock what must remain stable.
- Document locking decisions in the pattern header Notes.

### Accessibility
- Maintain logical heading order. Sections should start at H2/H3; templates supply H1.
- Provide ALT placeholders for images.
- Buttons and links must have descriptive accessible texts.
- For overlays (mobile nav, search-panel), plan JS that traps focus and handles ESC.

### Styling
- Use theme.json tokens for colours, spacing, typography. Avoid inline CSS.
- Test patterns across style variations (light/dark) if theme supports them.

### Performance
- Keep Query Loop preview items small (3–6) to speed inserter rendering.
- Optimize pattern images and use srcset where possible.

### Versioning & migration
- Use Version in headers to indicate pattern iteration; for breaking changes add a v2 slug (e.g., lsx/post-card-v2).
- Maintain a migration map when renaming slugs so templates and parts referencing patterns are updated.

---

## Minimal content snippet example (Hero: Page)
Example of a full pattern file (header + block markup). Use i18n and asset functions where needed.
```php
<?php
/**
 * Title: Hero: Page
 * Slug: lsx/hero-page
 * Description: Full-width page hero with title, lead and CTA.
 * Categories: banner, featured
 * Keywords: hero, page, cta
 * Viewport Width: 1368
 * Block Types: core/cover
 * Post Types: page
 * Template Types: front-page
 * Inserter: yes
 * Author: LightSpeed Team
 * Version: 1.0.0
 */
?>
<!-- wp:group {"align":"full","className":"lsx-hero-page","style":{"spacing":{"padding":{"top":"64px","bottom":"64px"}}}} -->
<div class="wp-block-group alignfull lsx-hero-page" style="padding-top:64px;padding-bottom:64px">
  <!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>","dimRatio":30} -->
  <div class="wp-block-cover" style="background-image:url('<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>')">
    <div class="wp-block-cover__inner-container">
      <!-- wp:heading {"level":1} -->
      <h1><?php echo esc_html__( 'Welcome to Our Site', 'lsx' ); ?></h1>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p><?php echo esc_html__( 'A short lead paragraph that introduces the page.', 'lsx' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:buttons --><div class="wp-block-buttons">
        <!-- wp:button {"className":"is-style-primary"} -->
        <div class="wp-block-button is-style-primary"><a class="wp-block-button__link"><?php echo esc_html__( 'Get started', 'lsx' ); ?></a></div>
        <!-- /wp:button -->
      </div><!-- /wp:buttons -->
    </div>
  </div>
</div>
<!-- /wp:group -->
```

---

## Quick checklist before merging a pattern file
- Header contains Title, Slug, Description, Categories, Keywords, Viewport Width.
- Block Types / Post Types / Template Types present if applicable.
- Inserter value correct (yes/no).
- Strings are localised when using PHP.
- Assets referenced via get_theme_file_uri() and escaped.
- No inline CSS beyond allowed block attributes.
- Lock attributes documented and applied only to structural containers.
- Accessibility and image alt placeholders present.
- File name matches slug.

---

If you want, I can generate a set of ready-to-drop pattern header stubs for your top-priority patterns (hero-page, post-card, query-grid-2col, header-primary, footer-primary, author-card-compact) that follow this maximal header spec.