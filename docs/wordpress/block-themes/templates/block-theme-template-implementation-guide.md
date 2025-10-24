# Block Theme Template Implementation Guide

This guide explains how WordPress **block templates**, **template parts**, and **patterns** work together in a LightSpeed block theme, and how to structure, register, and reference them for a scalable, maintainable front‑end system.

> Cross References  
> - See: `pattern-development.instructions.md` for authoring patterns  
> - See: `php-block.instructions.md` for dynamic blocks  
> - See: `theme-json.instructions.md` for global style + settings integration  
> - See: `coding-standards.instructions.md` for coding conventions  

---

## 1. Core Concepts Overview

| Concept | Purpose | Stored As | Editable in Site Editor? | Referenced By |
| ------- | ------- | --------- | ------------------------- | ------------- |
| Template | High-level layout defining page context (e.g. single, archive) | HTML file in `templates/` (or DB override) | Yes | Theme hierarchy, user assignment |
| Template Part | Reusable fragment (header, footer, sidebar) | HTML file in `parts/` (or DB override) | Yes | `wp:template-part` block inside templates/patterns |
| Pattern | Precomposed block arrangement for insertion (hero, feature grid) | PHP or HTML registration; code in `patterns/` | Inserted (not auto-loaded) | User, `wp:pattern` block, block inserter |
| Block Variation / Style | Design variants of a block | `theme.json` or JS filters | Partially | Patterns, templates |
| Reusable Block | User-defined global instance | DB only | Yes | Inserted manually |

---

## 2. File & Directory Structure

A typical block theme layout:

```
theme/
├─ theme.json
├─ functions.php
├─ templates/
│  ├─ index.html
│  ├─ single.html
│  ├─ archive.html
│  ├─ front-page.html
│  └─ page.html
├─ parts/
│  ├─ header.html
│  ├─ footer.html
│  └─ sidebar.html
├─ patterns/
│  ├─ hero-banner.php
│  ├─ feature-grid.php
│  └─ cta-strip.php
└─ inc/
   ├─ patterns.php          (optional central registration)
   └─ template-parts.php    (optional helper logic)
```

### Naming Conventions

- Slugs should be lowercase, dash-separated.
- Template part filenames map to their slug (e.g. `header.html` → slug: `header`).
- Pattern slugs recommended prefix: `lightspeed/{component}`.

---

## 3. Template Loading & Override Hierarchy

Order of resolution for a given template (e.g. `single`):

1. **User customized template** (DB) – created/edited via Site Editor.
2. **Theme file** in `templates/single.html`.
3. **Fallback hierarchy** (e.g. `singular.html` → `index.html`).
4. **Core fallback** (rarely reached if theme provides `index.html`).

Template parts follow a similar priority:

1. User customized part (DB).
2. Theme file in `parts/{slug}.html`.
3. Fallback: If a referenced template part file is missing, the editor shows a placeholder.

---

## 4. Anatomy of a Template

Example: `templates/single.html`

```html
<!-- wp:template-part {"slug":"header","theme":"lightspeed"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
    <!-- wp:post-title {"level":1} /-->
    <!-- wp:post-featured-image /-->
    <!-- wp:post-content /-->
    <!-- wp:pattern {"slug":"lightspeed/cta-strip"} /-->
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","theme":"lightspeed"} /-->
```

Key Points:

- `wp:template-part` loads a reusable region.
- `wp:pattern` (WordPress 6.4+) can inline a registered pattern at render time. Unlike manual insertion, this makes the pattern a structural part of the template. Users editing the template will see the resolved blocks (they become *detached* from the pattern source once edited).

---

## 5. Template Parts

Example: `parts/header.html`

```html
<!-- wp:group {"align":"full","layout":{"type":"flex","justifyContent":"space-between"}} -->
    <!-- wp:site-title /-->
    <!-- wp:navigation {"overlayMenu":"never"} /-->
<!-- /wp:group -->
```

Guidelines:

- Keep them minimal and composition-focused.
- Avoid duplicating large UI constructs better suited as patterns (e.g. hero banners).
- Use semantic wrappers (`header`, `footer`, `aside`) when appropriate via block attributes or Group block `tagName`.

---

## 6. Patterns

### 6.1 Registration

PHP pattern file: `patterns/hero-banner.php`

```php
<?php
/**
 * Title: Hero Banner
 * Slug: lightspeed/hero-banner
 * Categories: featured, hero
 * Block Types: core/post-content
 * Keywords: hero, banner
 */
?>
<!-- wp:cover {"minHeight":60,"minHeightUnit":"vh","contentPosition":"center center"} -->
    <!-- wp:heading {"textAlign":"center","level":1} -->
    <h1><?php echo esc_html__( 'Your Next Big Message', 'lightspeed' ); ?></h1>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"align":"center"} -->
    <p><?php echo esc_html__( 'Subheading driving engagement.', 'lightspeed' ); ?></p>
    <!-- /wp:paragraph -->
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
        <!-- wp:button -->
        <div class="wp-block-button"><a class="wp-block-button__link"><?php echo esc_html__( 'Get Started', 'lightspeed' ); ?></a></div>
        <!-- /wp:button -->
    <!-- /wp:buttons -->
<!-- /wp:cover -->
```

The header docblock establishes metadata. Content below must be valid block HTML markup.

### 6.2 Pattern Usage Modes

| Mode | How Inserted | Mutability | Use Case |
| ---- | ------------- | ---------- | -------- |
| Manual Insertion | Editor (Block Inserter) | User edits freely | Optional content suggestions |
| Programmatic via `wp:pattern` block | Inside template or template part | Becomes static after first save | Structural composition |
| Starter content (demo) | Inserted by `wp_insert_post` logic or activation flows | Editable | Seeding experience |

### 6.3 Including Patterns in Templates

Example (CTA pattern in footer template part):

```html
<!-- wp:pattern {"slug":"lightspeed/cta-strip"} /-->
```

This resolves to the pattern's block HTML at runtime. If the user edits the template, the resolved blocks become independent (they do not stay synced with the original pattern file).

---

## 7. Pattern vs Template Part — Decision Framework

| Choose | When |
| ------ | ---- |
| Template Part | Structural region repeated across multiple templates and expected to be globally replaceable (e.g. header, footer). |
| Pattern | Pre-designed content chunk that can appear multiple times or optionally in various contexts (hero, feature list, testimonial section). |
| Both | A template part can include patterns to seed substructure (e.g. footer part including a links pattern + signup pattern). |

---

## 8. Theme JSON Integration

Patterns and templates should leverage `theme.json` tokens:

- Use preset values: `var:preset|color|primary`.
- Avoid hardcoded spacing; instead apply `spacing.scale` custom naming (if defined).
- Encourage design consistency: block style variations (e.g. button style) referenced in patterns.

Example inside pattern:

```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|l"}},"color":{"background":"var:preset|color|base"}},"layout":{"type":"constrained"}} -->
    <!-- wp:heading {"style":{"typography":{"fontSize":"var:preset|font-size|xxl"}}} -->
    <h2><?php echo esc_html__( 'Stay in the Loop', 'lightspeed' ); ?></h2>
    <!-- /wp:heading -->
<!-- /wp:group -->
```

---

## 9. Dynamic Blocks Within Templates/Patterns

If using custom dynamic PHP blocks:

- Register via `register_block_type()`.
- In patterns/templates, include them like any block: `<!-- wp:lightspeed/pricing-table {"plan":"pro"} /-->`.
- Ensure server-side render callback outputs markup integrating theme design tokens.

Refer to `php-block.instructions.md`.

---

## 10. Performance & Maintainability Practices

1. Keep templates shallow — delegate complex regions to template parts or patterns.  
2. Cohesion: Each template part should have a single layout responsibility.  
3. Limit repeated inline style attributes by leaning on global styles and presets.  
4. Use descriptive pattern titles and categories for discoverability.  
5. Avoid version drift: when a core pattern evolves, consider new slug if changes are breaking.  
6. Provide accessible semantic markup (headings hierarchy, alt text, nav landmarks).  

---

## 11. Evolving Templates Safely

When changing shipped templates or parts:

- Users with customized versions will not see updates automatically (their DB copy overrides).
- Offer migration guidance or a “Reset” note in documentation.
- For structural overhauls, consider introducing a new pattern slug and updating template references.

---

## 12. Debugging & Validation

| Issue | Cause | Remedy |
| ----- | ----- | ------ |
| Pattern not rendering via `wp:pattern` | Wrong slug or pattern failed to register | Confirm file header; check `Appearance > Editor > Patterns` |
| Template part placeholder shown | Missing file or slug mismatch | Ensure filename equals slug; clear caches |
| Styles inconsistent | Hardcoded CSS bypassing `theme.json` | Refactor to tokens/presets |
| Duplicate hero content | Pattern included in template and manually inserted by editor | Clarify editorial workflow; remove one source |

---

## 13. Editorial Workflow Recommendations

1. Provide a “Layout Map” (diagram or README) explaining which templates exist and their parts.  
2. Limit critical business logic to dynamic blocks rather than embedding in patterns.  
3. Document which patterns are “structural” (used via `wp:pattern` in templates) vs “editorial” (for manual insertion).  
4. Provide naming prefix `Structural:` in pattern title if needed (e.g. “Structural: CTA Strip”) to discourage random reuse.  

---

## 14. Example End-to-End Flow

1. Create `patterns/hero-banner.php` with markup & metadata.  
2. Reference it in `templates/front-page.html` using `<!-- wp:pattern {"slug":"lightspeed/hero-banner"} /-->`.  
3. Add `parts/header.html` & `parts/footer.html` and include them in the front-page template.  
4. Define palette, spacing, typography in `theme.json`.  
5. Test in Site Editor, verify tokens resolve and no inline ad-hoc styling persists.  
6. Commit and publish.

---

## 15. Checklist Before Shipping

- [ ] All template part slugs match filenames.  
- [ ] Patterns have localized strings via `esc_html__()` where appropriate.  
- [ ] No deprecated block attributes present (validate with latest WP).  
- [ ] Uses `theme.json` presets for spacing, colors, typography.  
- [ ] Dynamic blocks (if any) render without PHP notices.  
- [ ] Accessibility: heading order, ARIA landmarks, link text clarity.  
- [ ] Patterns categorized logically and searchable via keywords.  

---

## 16. Glossary

| Term | Definition |
| ---- | ---------- |
| Slug | Unique identifier for a template part or pattern (namespaced for patterns). |
| Preset | Design token defined in `theme.json` (e.g. color, font size). |
| Structural Pattern | Pattern inserted automatically via `wp:pattern` inside templates. |
| Editorial Pattern | Pattern intended for optional manual insertion by content editors. |

---

## 17. Further Enhancements (Optional)

- Automate pattern registration via scanning directory on theme load.
- Lint pattern HTML for unsupported attributes.
- Provide an index page listing available patterns (query Patterns API).
- Add unit tests for dynamic block render callbacks.

---

## 18. Summary

Templates define the page-level scaffold. Template parts modularize shared regions. Patterns accelerate composition and can now be embedded structurally via `wp:pattern`. `theme.json` underpins design consistency across all three. Proper alignment of these layers yields a flexible, maintainable LightSpeed block theme with a clean editorial experience.

---

Questions or extension requests? Open an internal discussion or propose an issue using the standard template.

## Addendum — Menu Template Part & Pattern Category (lsx-design/menu)

This implementation guide is extended to include the new menu template part and pattern-category requirements. Implementers should follow these steps to ensure full compatibility with the Ollie Menu Designer plugin and the theme's pattern registration approach.

## 1) Canonical template part
- File: parts/menu.html
- Slug: "menu"
- Purpose: Host the theme menu area. Patterns inserted into parts/menu.html should provide the built-in mega menu layouts, cards, and mobile variants.

## 2) Patterns to create and register
- Place menu patterns in patterns/ with header metadata including:

### Categories
  - Categories: lsx-design/menu

### Block Types
  - Block Types (where appropriate): core/template-part/menu or core/template-part/header

### Example pattern header

/* Title: 
Menu Panel — Columns 
Slug: lsx-design/menu-panel-columns 
Categories: lsx-design/menu 
Block Types: core/template-part/menu 
Inserter: yes 
Viewport Width: 1260 
*/ 

- Ensure the file-based patterns use i18n functions (esc_html_e / __) if they include PHP wrapper strings.

## 3) Register menu pattern category (functions.php)
- Add registration similar to the Ollie pattern_categories function, but for lsx-design/menu. Use a priority of 9 if you need to ensure categories exist before pattern registration.

## 4) Template part area registration
- Add the template-part area 'menu' via the default_wp_template_part_areas filter so it appears in the Site Editor with a friendly label ("Menu") and correct area_tag ('nav').

## 5) Example usage mapping (templates → parts)
- parts/header.html (include `<!-- wp:template-part {"slug":"menu"} /-->` where the primary nav should render)
- parts/mobile-nav-panel.html (can include a menu pattern or use parts/menu.html for consistent markup)
- templates/front-page.html / templates/index.html may include specific menu patterns directly if needed.

## 6) theme.json — customTemplates
- Ensure the customTemplates block below is present in theme.json so Page (Full Width, No Title) and Page (With Sidebar) will be available in the editor:
  (Paste snippet)
- Also ensure templateParts registration in theme.json includes the menu slug:

```json
"templateParts": [
  { "slug": "skip-links", "title": "Skip Links" },
  { "slug": "header", "title": "Header" },
  { "slug": "menu", "title": "Menu" },
  { "slug": "hero", "title": "Hero" },
  { "slug": "footer", "title": "Footer" }
  ...
]
```
