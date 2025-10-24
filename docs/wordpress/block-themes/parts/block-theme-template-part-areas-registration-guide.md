# Template Part Areas — Registration & Best Practices Guide

This guide explains how to register and manage template part areas for a LightSpeed block theme (namespace: lsx-design). It focuses on practical, safe approaches you can apply today: theme.json registration, minimal template part areas to expose in the Site Editor, programmatic fallbacks, naming conventions, pattern connections and migration/checklist items.

Audience: theme engineers and maintainers who build/register template parts and curate the Site Editor experience.

## Goals
- Register a minimal, useful set of template part areas so the Site Editor remains clear.
- Use theme.json as the primary source of truth for template parts.
- Provide programmatic fallbacks for environments where needed.
- Standardize naming, slug patterns and locking recommendations.
- Show examples of how to connect patterns to template parts and how to include them in templates.

## Contents
- Recommended template part areas
- theme.json: templateParts examples
- Programmatic registration (fallbacks / conditional)
- Naming conventions & slug rules
- Pattern → template-part mapping examples
- Template part header recommendations (max metadata)
- Locking & editor UX guidance
- Migration & QA checklist
- Example files & snippets

---

## Recommended template part areas (minimal list)

### Guidance
Only register areas that are useful and meaningful in the Site Editor. Keep the list small.

### Recommended set (start here)
- header
- footer
- hero
- site-notice
- mobile-nav-panel
- search-panel
- sidebar
- comments
- author-card

### Rationale
- These areas surface commonly edited, reusable regions without cluttering the editor.
- Avoid registering many tiny or one-off areas — that fragments the editing surface.

---

## theme.json: Registering templateParts (primary method)

### Overview
Add templateParts entries to theme.json so parts are discoverable in the Site Editor.

### Example excerpt
```json
{
  "version": 2,
  "templateParts": [
    {
      "slug": "header",
      "title": "Header",
      "area": "header"
    },
    {
      "slug": "footer",
      "title": "Footer",
      "area": "footer"
    },
    {
      "slug": "hero",
      "title": "Hero",
      "area": "hero"
    },
    {
      "slug": "site-notice",
      "title": "Site Notice",
      "area": "utility"
    },
    {
      "slug": "mobile-nav-panel",
      "title": "Mobile Nav Panel",
      "area": "overlay"
    },
    {
      "slug": "search-panel",
      "title": "Search Panel",
      "area": "utility"
    },
    {
      "slug": "sidebar",
      "title": "Sidebar",
      "area": "sidebar"
    },
    {
      "slug": "comments",
      "title": "Comments",
      "area": "comments"
    },
    {
      "slug": "author-card",
      "title": "Author Card",
      "area": "parts"
    }
  ]
}
```

### Notes
- The `title` is the human label seen in the Site Editor.
- The `area` field is optional metadata for organizing parts in your docs; WordPress ignores custom `area` keys but we include them for maintainer clarity.
- theme.json registration is the recommended, explicit, and persistent approach.

---

## Programmatic registration (when required)

### When to register programmatically
Use programmatic registration when you need translated titles, conditional registration (e.g., only when WooCommerce is active), or dynamic behaviour.

### Pattern
Use an init hook, check for API availability, and call the registration function when available.

### Example (functions.php)
```php
add_action( 'init', function() {
  // Example: programmatic registration when a helper exists
  if ( function_exists( 'register_block_template_part' ) ) {
    // Register header template part programatically (WP <-> new APIs vary by version)
    register_block_template_part(
      'lsx-design/header-primary', // theme-provided slug (optional in some WP versions)
      [
        'title' => __( 'Header: Primary', 'lsx-design' ),
        'area'  => 'header',
      ]
    );
  }

  // Conditional: register WooCommerce template area or patterns only if Woo exists.
  if ( class_exists( 'WooCommerce' ) ) {
    // Register additional template part area / or patterns for WooCommerce
    // (Register patterns via register_block_pattern() if needed)
  }
} );
```

### Caveats
- Avoid conditional logic that depends on the main query (is_single(), is_front_page()) during registration.
- Use programmatic registration sparingly — prefer theme.json where possible.

---

## Naming conventions & slug rules for template parts

### Rules
- Namespace prefix: lsx-design (project-wide). Example template part slugs: `lsx-design/header-primary`.
- Template part file names in /patterns/ or /parts/ should mirror slugs:
  - patterns/30-headers/30-header-primary.php → slug lsx-design/header-primary
- Titles: human-friendly and scoped: `Header: Primary`, `Footer: Primary`, `Hero: Page`.
- Keep slugs short (no spaces), kebab-case.
- Use variant suffixes where needed: `header-primary`, `header-minimal`, `footer-compact`.

### Best practices
- Keep titles descriptive but consistent across patterns and templateParts.
- Use the same slug in theme.json and pattern files to avoid mismatch.

---

## Pattern → template-part mapping & usage

### Authoring template parts
- Template parts should be authored as pattern files (prefer PHP file-based patterns) with block-type metadata when relevant.

### Example header for a template-part pattern (patterns/30-headers/30-header-primary.php)
```php
<?php
/**
 * Title: Header: Primary
 * Slug: lsx-design/header-primary
 * Description: Site header with site title, primary nav and utility actions.
 * Categories: lsx-design/header, lsx-design/sections
 * Keywords: header, nav, site-identity, primary
 * Viewport Width: 1368
 * Block Types: core/template-part/header
 * Post Types:
 * Inserter: yes
 */
?>
<!-- wp:group {"align":"full","className":"lsx-header-primary"} -->
<div class="wp-block-group alignfull lsx-header-primary"> ... </div>
<!-- /wp:group -->
```

### How to include a template part in a theme template
- In a PHP template part or theme template you use:
  - `<!-- wp:template-part {"slug":"header","theme":"your-theme-slug"} /-->`
- Or include a pattern that references the part:
  - `<!-- wp:pattern {"slug":"lsx-design/header-primary"} /-->`

Prefer adding template parts into templates via `<!-- wp:template-part {"slug":"header"} /-->` and rely on the theme.json `templateParts` mapping.

---

## Template part header recommendations (max metadata)

### Recommended header fields
Every template part pattern file should include the full header set to make it discoverable and constraining in the editor.

### Recommended header example
```php
<?php
/**
 * Title: Header: Primary
 * Slug: lsx-design/header-primary
 * Description: Primary header used across most templates with site identity and navigation.
 * Categories: lsx-design/header, lsx-design/sections
 * Keywords: header, nav, site-title, search, mobile-nav
 * Viewport Width: 1368
 * Block Types: core/template-part/header
 * Post Types:
 * Template Types: (optional) front-page, page
 * Inserter: yes
 * Viewport Width: 1368
 * Author: LightSpeed Team
 * Version: 1.0
 */
?>
```

### Notes
- Include Block Types: core/template-part/header for best inserter placement.
- Template Types: only use if the part is strictly only for certain templates (rare).

---

## Locking & editor UX guidance for template parts

### Locking strategy
Locking keeps layout stability for maintainers and clients.

### Recommendations
- Apply `lock` attributes on structural blocks to prevent accidental removal or movement of key blocks (navigation, grid containers).
- Allow content edits inside specific inner blocks (site title, nav links, search input).
- Example JSON lock usage inside block markup:
  - `{"lock":{"move":true,"remove":true}}` on a Group or Columns block.
- For template parts that must be edited only via the Site Editor (e.g., header/footer), document that in the pattern header description.

### Best practice
- Lock only structural layout blocks; do not lock shallow text blocks (so editors can change copy).
- Add short HTML comments in the pattern file to explain locked regions for maintainers.

---

## Starter templates vs template parts

### Distinction
- Template parts are modular regions used inside templates and template parts; register them in theme.json.
- Starter template patterns (full pages or template-type starters) are separate: they should use `Template Types:` and `Inserter: no` when they are only available in the "New template" flows.

### Composition
- Use template parts inside starter templates to compose page starters; this encourages reuse and easier maintenance.

---

## Migration & merge plan for existing template parts

### Steps
If merging many existing pattern files into the canonical set:

#### 1. Inventory
- Export a list of pattern files and current slugs (old namespace) → map to new canonical `lsx-design/*` slugs.

#### 2. Pick canonical parts
- For each area (header, footer, hero), choose a canonical implementation. Create `*-alt` variants only when necessary.

#### 3. Update headers
- Ensure full header metadata (Title, Slug, Categories, Block Types, Inserter, etc.).

#### 4. Replace references
- Update `<!-- wp:pattern {"slug":"oldns/..."} /-->` references to `lsx-design/...` in templates and parts.
- Update theme.json `patterns` array if you bundle patterns.

#### 5. Register templateParts in theme.json
- Add the selected template part slugs to `templateParts` in theme.json.

#### 6. QA & review
- Open a PR with the mapping and screenshots; run Site Editor visual checks.
- Verify Inserter placement and block-type visibility.

---

## QA checklist (template part areas)

### Checklist
- theme.json includes only the minimal set of templateParts.
- Template part files have full headers and canonical slugs (lsx-design/*).
- Block Types include the appropriate core/template-part/* target where relevant.
- Locked blocks are documented and limited to structural regions.
- Template parts used in templates via `<!-- wp:template-part {"slug":"header"} /-->` or pattern references are updated to new slugs.
- All user-facing strings in template parts are translatable (wrapped in __ / esc_html_e where used in PHP).
- Images/assets referenced via `esc_url( get_theme_file_uri( ... ) )`.
- Visual verification in Site Editor: header/footer/hero appear where expected and are editable as intended.

---

## Example: Minimal functions.php additions

### Register pattern categories (example)
Register pattern categories so header/footer patterns can be categorized nicely.

```php
add_action( 'init', function() {
  register_block_pattern_category(
    'lsx-design/header',
    [ 'label' => __( 'LSX: Header', 'lsx-design' ) ]
  );
  register_block_pattern_category(
    'lsx-design/footer',
    [ 'label' => __( 'LSX: Footer', 'lsx-design' ) ]
  );
  register_block_pattern_category(
    'lsx-design/utility',
    [ 'label' => __( 'LSX: Utility', 'lsx-design' ) ]
  );
} );
```

### Register WooCommerce patterns conditionally (example)
```php
add_action( 'init', function() {
  if ( class_exists( 'WooCommerce' ) ) {
    // Register programmatic patterns or template parts for Woo if needed.
    register_block_pattern( 'lsx-design/wc-collection', [
      'title'       => __( 'LSX: Product Collection', 'lsx-design' ),
      'categories'  => [ 'lsx-design/woocommerce' ],
      'content'     => '<!-- wp:group --><div>...</div><!-- /wp:group -->',
    ] );
  }
} );
```

---

## Final notes & recommendations

### Summary
- Use theme.json → templateParts as the primary registration surface.
- Keep template part areas minimal and meaningful.
- Prefer file-based, fully metadata'd template part patterns (PHP) stored in `/patterns/` that match theme.json templateParts.
- Use programmatic registration only when you must (conditional, localized title/descriptions at registration time).
- Enforce naming conventions (lsx-design/*) and keep a migration record when changing slugs.

### Offers
If you’d like, I can:
- Produce a canonical mapping (inventory) from the attached pattern files → proposed lsx-design template part slugs.
- Generate a theme.json templateParts snippet prefilled with the chosen canonical slugs.
- Create the pattern header stubs for each canonical template part (ready-to-drop PHP files).

Which next step should I take?
