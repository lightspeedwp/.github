# Template & Template-Part Header Metadata — Maximal Field Reference and Best Practices

This document describes the maximum set of header fields you can (and should) include at the top of block theme template files (templates/*.html) and template-part files (parts/*.html) as well as the fields used in pattern files (patterns/*.php). It explains why to include them, which fields WordPress actually consumes, and recommended best practices and examples for different scenarios (header, menu, hero, breadcrumbs, loop, sidebar, footer, etc.).

## Why add header metadata?
- Documentation: templates and parts are easier for maintainers and editors to understand.
- Tooling: automated scripts, linters, pattern migrators and release tooling can parse these fields.
- Consistency: makes templates, template-parts and patterns self-describing across the repo.
- Patterns: WordPress registers pattern metadata from pattern files (Title, Slug, Categories, Block Types, Inserter, Viewport Width, Keywords). This must be present in pattern headers.

## Important note about WordPress behavior
- Pattern files (patterns/*.php) are parsed by WordPress and many header fields (Title, Slug, Categories, Block Types, Inserter, Viewport Width, Keywords, Description) are used to register patterns.
- Block theme templates (templates/*.html) and template parts (parts/*.html) are not registered by WordPress via header metadata; WordPress reads templates from the filesystem and uses theme.json for exposing custom template names (customTemplates) and templateParts for the Site Editor. Template headers are primarily documentation and useful to tooling and editors — but they should still be complete and consistent.
- For template availability in the Site Editor (to let editors select them), add entries to theme.json → customTemplates (for named templates) and theme.json → templateParts (for template parts).

## A. Maximum recommended header fields (templates, template-parts, patterns)
Include as many of these as relevant. Use the same canonical names so tooling can parse them easily.

### Required / Core
- Title: Human-friendly title shown in docs/editor.
- Slug: machine-friendly slug for references (e.g., page-no-title, lsx-design/menu-panel-1).
- Description: Concise description of template or pattern purpose and what it contains.

### Context & usage
- Template Types: comma-separated list of template types this file targets (e.g., front-page, index, single, archive, page, author, category, taxonomy, search, 404, attachment, embed).
- Post Types: comma-separated post types the template applies to (e.g., page, post, product).
- Template Parts: list template part slugs expected by this file (e.g., skip-links, header, menu, breadcrumbs).
- Template Areas: helpful for template parts to declare the template-part area(s) they fit (e.g., header, footer, menu, hero, sidebar).

### Pattern / Block info
- Block Types: list of block contexts (e.g., core/query, core/template-part/menu, core/cover, woocommerce/product). Important for patterns to surface in the correct editor context.
- Categories: pattern categories (for pattern files and pattern registration) — e.g., lsx-design/menu, lsx-design/hero, lsx-design/query.
- Keywords: comma-separated keywords for pattern searchability.
- Viewport Width: preview width in pixels for pattern previews (e.g., 1260, 800).

### Editor / Inserter flags
- Inserter: yes / no — whether to show in the pattern inserter.
- Inserter Priority: numeric hint for ordering in the inserter (optional).

### Dependencies & requirements
- Required Plugins: e.g., WooCommerce, Yoast SEO, Ollie Menu Designer (document plugin dependencies that affect rendering or block availability).
- Required Block Versions / Blocks: optional notes about required block types or block versions.

### Authorship & maintenance
- Author: author or team name.
- Version: semantic version (1.0.0).
- License: license identifier (GPL-2.0-or-later).
- Release Date: YYYY-MM-DD (optional).
- Changelog / Changes: short note for recent changes (optional).
- Notes: free-form notes for implementers (e.g., accessibility reminders, where patterns live).

### Machine-friendly / Tooling
- Slug Namespace: recommended namespace (e.g. lsx-design/) for patterns.
- Inserter Preview Image: path to an image for pattern previews (patterns/images/...).
- Template Mapping: optional mapping to indicate where the template is used (e.g., header.html → templates/*).
- CI Tags: optional tags for CI/automation to process (e.g., "auto-register: true").

## B. Field table (short reference)
- Title — string — Human name  
- Slug — string — machine name  
- Description — string — short purpose  
- Template Types — list — front-page, home, single, page, archive, category, tag, taxonomy, date, author, search, 404, attachment, embed  
- Post Types — list — page, post, product, etc.  
- Template Parts — list — skip-links, header, menu, breadcrumbs, footer, etc.  
- Block Types — list — core/query, core/cover, core/template-part/menu, woo/..., yoast-seo/...  
- Categories — list — lsx-design/menu, lsx-design/hero, navigation, posts, query  
- Keywords — list — assists search in editor  
- Viewport Width — integer — preview width (patterns)  
- Inserter — yes/no — whether visible in inserter (patterns)  
- Inserter Priority — integer — optional ordering  
- Required Plugins — list — WooCommerce, Yoast SEO, Ollie Menu Designer  
- Author, Version, License, Notes, Suggested Patterns — lists/strings for docs & guidance  
- Suggested Patterns — list — pattern slugs recommended to insert in this template/part  
- Template Areas — list — header, hero, under-hero, footer, menu  
- Template Mapping / Usage — free form — where used

## C. Templates vs. Patterns vs. Template Parts — what WordPress uses vs. what’s for docs
- Patterns: WordPress registers patterns using the header metadata (Title, Slug, Categories, Block Types, Inserter, Viewport Width, Keywords, Description). Make these fields complete for patterns.
- Templates: Put full header metadata in templates for human and tooling consumption, but WordPress does not use template header fields for registration. To expose templates to editors, use theme.json → customTemplates and keep the header metadata synchronized with theme.json.
- Template Parts: Like templates, header metadata is primarily for documentation and tooling. Use theme.json → templateParts to expose parts to the Site Editor. However for template-part patterns (patterns registered to be inserted into a template part), include Block Types: core/template-part/menu or core/template-part/header in the pattern header so they are discoverable when editing that template part.

## D. Best practices — templates

### 1) Keep templates structural, small and semantic
- Templates should include Template Part blocks to reference parts/ files (header, menu, breadcrumbs, hero, footer).
- Templates define layout (columns, main areas, sidebars) and rely on parts/patterns for content and visual styling.

### 2) Use Template Parts for repeatable regions
- header, footer, skip-links, menu, breadcrumbs, sidebar, cta-banner should be template parts under parts/.
- Avoid duplicating header/footer markup across templates.

### 3) Use patterns for layout variants
- Create pattern files for visual variants (hero-page, hero-post, menu-panel-1, mobile-menu-1), and insert them into template parts or templates via pattern references.
- Patterns should include correct Block Types and Categories to surface in the right editor context.

### 4) Register customTemplates & templateParts in theme.json
- Templates that should be available for assignment (e.g., page-no-title, page-with-sidebar) must be declared in theme.json → customTemplates.
- Template parts must be declared in theme.json → templateParts so Site Editor lists them with friendly titles.

### 5) Accessibility & heading structure
- Templates should ensure a single visible H1 per page. Templates may include H2 / H3 placeholders for grouping content (useful for initial editor experience).
- Template parts should avoid introducing duplicate H1s; prefer H2/H3 inside parts when they represent sub-sections.

### 6) Document plugin dependencies
- If a template or pattern expects a plugin (WooCommerce, Yoast, Ollie), declare it in Required Plugins and include fallback markup or graceful degradation.

## E. Best practices — template parts
- Template parts should be focused and small (single responsibility). Example areas:
  - Header (parts/header.html): site branding, primary navigation template-part, search toggle, language/currency switchers.
  - Menu (parts/menu.html): single insertion point where mega-menu patterns or mobile-menu patterns are inserted.
  - Hero (parts/hero.html): small wrapper intended to host hero patterns (patterns/lsx-design/hero-*).
  - Breadcrumbs (parts/breadcrumbs.html): nav[aria-label="Breadcrumb"] that uses core:breadcrumb block or falls back.
  - Loop Default (parts/loop-default.html): default query loop item or include a pattern.
  - Sidebar (parts/sidebar.html): widgets or small patterns (newsletter, author card, related lists).

### Header — example & guidance
- Purpose: site identity and main navigation.  
- Block Types: core/template-part/header  
- Suggested Patterns: lsx-design/header-primary, lsx-design/menu-card-1  
- Accessibility: include skip-links, proper nav landmarks, aria-expanded toggles for mobile.  
- Example header metadata (for parts/header.html — documentation header):
  ```
  /*
    Template Part: Header
    Slug: header
    Description: Primary header template part; contains site title/logo and primary navigation insertion (parts/menu.html).
    Template Areas: header
    Template Types: all
    Block Types: core/template-part/header
    Suggested Patterns: lsx-design/menu-panel-1, lsx-design/mobile-menu-4
    Required Plugins:
    Author: LSX Design Team
    Version: 1.0.0
  */
  ```

### Menu / Mega-menu — example & guidance
- Purpose: insertion point for mega menus and mobile variants.  
- Block Types: core/template-part/menu  
- Pattern Category: lsx-design/menu (register this category)  
- Guidance:
  - Keep parts/menu.html minimal (a nav wrapper); supply actual UI in patterns (menu-panel-1, menu-card-2, mobile-menu-1).
  - Patterns that target this template part should include Block Types: core/template-part/menu so they surface when editing the menu area.
  - Example pattern header used in patterns/menu/menu-panel-1.php:
    ```
    /**
     * Title: Menu Panel — Columns
     * Slug: lsx-design/menu-panel-1
     * Description: Wide mega menu panel with columns and feature CTA. Use inside parts/menu.html.
     * Categories: lsx-design/menu
     * Block Types: core/template-part/menu
     * Viewport Width: 1260
     * Inserter: true
     * Keywords: menu, mega menu, panel
     * Required Plugins: Ollie Menu Designer (optional)
     * Author: LSX Design Team
     * Version: 1.0.0
     */
    ```

### Hero — example & guidance
- Purpose: presentational hero cover or lead.  
- Block Types: core/cover, core/template-part  
- Guidance:
  - Use parts/hero.html as a lightweight wrapper and provide layout variants via patterns (lsx-design/hero-page, lsx-design/hero-post).
  - Pattern header should include Block Types: core/cover and Categories: lsx-design/hero.

### Breadcrumbs — example & guidance
- Purpose: small nav for breadcrumb trail.  
- Block Types: core/template-part (for patterns) and core/breadcrumb for content.  
- Guidance:
  - Provide a parts/breadcrumbs.html that uses core:breadcrumb where available and has a fallback paragraph.
  - Supply pattern variants for plugin-specific blocks (lsx-design/breadcrumbs-yoast, lsx-design/breadcrumbs-woocommerce).
  - Example pattern header (breadcrumbs-yoast):
    ```
    /**
     * Title: Breadcrumbs — Yoast
     * Slug: lsx-design/breadcrumbs-yoast
     * Description: Uses Yoast SEO breadcrumb block if available, with fallback markup.
     * Categories: navigation, lsx-design
     * Block Types: core/template-part
     * Viewport Width: 1000
     * Inserter: true
     * Keywords: breadcrumb, yoast, seo
     * Author: LSX Design Team
     * Version: 1.0.0
     */
    ```

### Loop / Query Loop items — example & guidance
- Purpose: provide consistent Query Loop item markup (post-card) and container (query-grid-2col).  
- Block Types: core/query  
- Guidance:
  - Provide an item pattern (lsx-design/post-card) and a container pattern (lsx-design/query-grid-2col or a parts/loop-default.html).
  - Register Block Types: core/query so patterns surface when editing Query Loop contexts.

### Sidebar & Footer — example & guidance
- Sidebar: small parts/sidebar.html; expose patterns for widgets and CTAs.  
- Footer: parts/footer.html; keep content editable via patterns (social links, secondary nav, legal).  
- Include Template Parts field in template headers listing these so implementers know dependencies.

## F. Examples — maximal header blocks

### 1) Template header (templates/archive-{post_type}.html)
```html
<!--
  Template: Archive — Post Type Specific
  Title: Archive — Post Type Specific
  Slug: archive-{post_type}
  Description: Specific post type archive template. Replace {post_type} with your CPT slug (e.g., archive-product.html). Includes skip-links, header, menu, breadcrumbs, hero, Query Loop scoped to the post type, pagination and footer.
  Template Types: archive
  Block Types: core/query, core/template-part
  Post Types:
  Inserter: false
  Viewport Width: 1200
  Template Parts: skip-links, header, menu, breadcrumbs, hero, loop-default, footer
  Suggested Patterns: lsx-design/hero-archives, lsx-design/query-grid-2col, lsx-design/breadcrumbs
  Keywords: archive, post type
  Required Plugins:
  Author: LSX Design Team
  Version: 1.0.0
  License: GPL-2.0-or-later
  Notes: Duplicate and rename to archive-{post_type}.html for specific CPTs.
-->
```

### 2) Template Part header (parts/breadcrumbs.html)
```html
<!--
  Template Part: Breadcrumbs
  Title: Breadcrumbs
  Slug: breadcrumbs
  Description: Reusable breadcrumbs template part. Renders core/breadcrumb when available and provides a fallback markup. Insert into templates under hero or content-top.
  Template Areas: under-hero, content-top
  Template Types: page, post, archive, taxonomy, category, tag
  Block Types: core/template-part
  Suggested Patterns: lsx-design/breadcrumbs, lsx-design/breadcrumbs-yoast, lsx-design/breadcrumbs-woocommerce
  Keywords: breadcrumb, navigation, path, trail
  Author: LSX Design Team
  Version: 1.0.0
  License: GPL-2.0-or-later
  Notes: Patterns provide plugin-specific variations; use the appropriate pattern when Yoast or WooCommerce plugins are active.
-->
```

### 3) Pattern header (patterns/73-breadcrumbs-yoast.php — PHP pattern)
```php
<?php
/**
 * Title: Breadcrumbs — Yoast SEO
 * Slug: lsx-design/breadcrumbs-yoast
 * Description: Breadcrumbs pattern that uses the Yoast SEO breadcrumb block when the Yoast plugin is active. Falls back to a lightweight markup when the block is not available.
 * Categories: navigation, lsx-design
 * Keywords: breadcrumb, yoast, seo, navigation
 * Viewport Width: 1000
 * Block Types: core/template-part
 * Post Types:
 * Template Types:
 * Inserter: true
 * Required Plugins: Yoast SEO
 * Author: LSX Design Team
 * Version: 1.0.0
 * License: GPL-2.0-or-later
 */
?>
```

## G. Should templates be updated with additional values or are they handled with patterns?
- Patterns: require rich header metadata so WordPress can register and surface them in the block editor. These headers are functional.
- Templates & Template Parts: header fields are not required by WordPress for registration. However:
  - You should still include maximal header metadata in templates and template parts for:
    - Documentation for editors and implementers.
    - Consistency with patterns and automated tooling (scripts that scan the repo, generate docs or create PRs).
    - Local tooling that may parse header metadata to stamp theme.json entries, or to validate template → part mappings.
  - For actual editor exposure and assignment:
    - Add templates to theme.json → customTemplates (so they appear in Site Editor for assignment).
    - Add template parts to theme.json → templateParts (so the editor lists them with friendly names).
  - Patterns are the right place for variants, previews, and inserter presence. Templates should reference template parts and patterns rather than embedding variant markup directly.

### Recommended workflow
1. Create parts/*.html as minimal semantic wrappers (nav, header, footer, hero placeholders).
2. Create pattern files for all visual variants and for plugin-specific blocks (menu-panel-1, mobile-menu-4, breadcrumbs-woocommerce).
3. Keep templates as structural shells that call template parts and include example H2/H3 placeholders for editor UX.
4. Add full header metadata to:
   - Patterns (required fields for WordPress).
   - Templates and Template Parts (for docs, tooling, and consistency).
5. Ensure theme.json registers templateParts and customTemplates to expose them in the Site Editor.

## H. Linting & automation recommendations
- Keep header fields parsable: use consistent key names and colon separators like "Title: " and "Slug: ".
- Provide a small repository script that validates header fields across patterns/templates and optionally auto-syncs theme.json entries (useful for large themes).
- When patterns include PHP strings, wrap translatable text with i18n functions (esc_html_e / __).
- Use consistent namespace (lsx-design/*) for pattern slugs and categories.

## I. Quick checklist to implement header metadata across repo
- [ ] Add maximal header comment to every pattern file (patterns/*.php).
- [ ] Add matching header comment to templates (templates/*.html) documenting Template Types, Template Parts & Suggested Patterns.
- [ ] Add matching header comment to template parts (parts/*.html) listing Template Areas & Suggested Patterns.
- [ ] Register templateParts in theme.json and customTemplates for templates that must be selectable.
- [ ] Register pattern categories (e.g., lsx-design/menu) and ensure patterns use those categories.
- [ ] Add tooling to validate headers and optionally generate a template/pattern index (README or docs).

## J. Final notes
- Patterns are functional metadata for WordPress — they must be complete.
- Templates and template parts are primarily structural; header metadata is for humans and tooling but strongly recommended to be complete and consistent.
- Prefer patterns for visual and plugin-specific variants; prefer template parts for repeated structural regions.
- Keep accessibility (single H1, correct roles, aria labels) in mind when designing parts and patterns.

## If you want, I can:
- Generate a validation script that scans templates / parts / patterns to ensure headers include a canonical set of fields.
- Produce a README table listing every templates/ and parts/ file with parsed header metadata (inventory) to commit to the repo.
- Create a theme.json snippet (or update) that auto-registers the current templateParts and customTemplates based on parsed headers.

Which would you like next?