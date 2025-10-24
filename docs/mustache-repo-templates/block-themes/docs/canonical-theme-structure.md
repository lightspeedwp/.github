# Canonical Theme Structure Reference

This document provides the definitive structure, naming conventions, and placeholder mapping for this WordPress block theme.  
Reference: *WordPress Block Theme – Structure & Development Guidelines.md*

---

## 1. Naming Conventions

- **Slugs**: lowercase, dash-separated, unique.
- **Categories**: `lsx-design/<area>`, e.g. `lsx-design/menu`, `lsx-design/hero`.
- **Files**: mirror slug (e.g., `patterns/20-hero-page.php` → `lsx-design/hero-page`).

---

## 2. Patterns

- **Location**: `patterns/`
- **File format**: PHP or HTML, with canonical header.
- **Header example**:

    ```php
    /**
     * Title: Hero Page
     * Slug: lsx-design/hero-page
     * Categories: lsx-design/hero
     * Block Types: core/cover
     * Inserter: yes
     */
    ```

- **Folder breakdown** *(logical plan)*:
  - `patterns/00-foundations/` — icons, badges, micro bits
  - `patterns/10-template-parts/` — header, footer, menu, hero, sidebar, etc.
  - `patterns/20-starters/` — starter page patterns (homepage, about, cta-band)
  - `patterns/30-template-types/` — template-type patterns (Inserter: no)
  - `patterns/40-queries/` — Query Loop containers & items (post-card, loop-default)
  - `patterns/50-full-pages/` — full page layouts
  - `patterns/60-sections/` — sections: features, testimonials, team, pricing

---

## 3. Pattern Categories

- **Register in functions.php:**

    ```php
    register_block_pattern_category('lsx-design/hero', ['label' => __('Hero', 'lsx-design')]);
    register_block_pattern_category('lsx-design/menu', ['label' => __('Menu', 'lsx-design')]);
    // ...add others as needed
    ```

---

## 4. Template Parts

- **Location**: `parts/`
- **Canonical slugs**: skip-links, header, footer, menu, hero, sidebar, comments, breadcrumbs, post-meta, author-card, cta-banner, site-notice, search-panel, mobile-nav-panel, language-switcher, currency-switcher, loop-default, share-actions
- **Naming**: `parts/<slug>.html`
- **Header example**:

    ```html
    <!--
      Template Part: Header
      Slug: header
      Description: Primary header for site branding and navigation.
      Area: header
    -->
    ```

---

## 5. Template Part Areas

- **theme.json registration**:

    ```json
    "templateParts": [
      { "slug": "header", "title": "Header" },
      { "slug": "footer", "title": "Footer" },
      { "slug": "menu", "title": "Menu" },
      { "slug": "hero", "title": "Hero" },
      // ...add others
    ]
    ```

---

## 6. Templates

- **Location**: `templates/`
- **Canonical files**: index.html, front-page.html, home.html, single.html, page.html, archive.html, category.html, tag.html, taxonomy.html, search.html, 404.html, privacy-policy.html, offline.html, attachment.html, embed.html, page-no-title.html, page-with-sidebar.html
- **Naming**: kebab-case, follow WP hierarchy.

---

## 7. theme.json

- **Global settings**:
  - Color palette, typography, spacing, templateParts, customTemplates
  - Example mustache placeholders:

        ```json
        {
          "settings": {
            "color": { "palette": [ { "name": "Primary", "slug": "primary", "color": "{{primary_color}}" } ] },
            "typography": { "fontFamilies": [ { "name": "Body", "slug": "body", "fontFamily": "{{body_font}}" } ] }
          },
          "templateParts": [
            { "slug": "header", "title": "Header" }
            // ...
          ],
          "customTemplates": [
            { "name": "page-no-title", "title": "Page (No Title)", "postTypes": ["page", "post"] }
          ]
        }
        ```

---

## 8. Styles / Style Variations

- **Location**: `styles/`
- **Files**: `light.json`, `dark.json`, `contrast.json`, etc.
- **Content**: mustache placeholders for colors, typography, etc.

    ```json
    {
      "settings": {
        "color": { "palette": [ { "name": "Light", "slug": "light", "color": "{{light_bg_color}}" } ] }
      }
    }
    ```

---

## 9. Styles / Blocks, Typography, Color Palettes, Sections

- **styles/blocks/**: per-block style variations (e.g., group, button)
- **styles/typography.json**: font sizes, font families, fluid min/max values
- **styles/color-palettes.json**: palette definitions
- **styles/sections/**: section style variations (e.g., card-gradient, hero-light)
- **Variables (mustache)**:
  - Colors: `{{primary_color}}`, `{{secondary_color}}`, `{{contrast_color}}`
  - Sizes: `{{spacing_large}}`, `{{spacing_small}}`
  - Typography: `{{font_size_base}}`, `{{font_size_heading}}`
  - Fluid: use `clamp(min, vw/vh/rem/em, max)`

---

## 10. Fluid Design Considerations

- **Typography**: Use `clamp(min, Xvw, max)` for font sizes (fluid scale).
- **Spacing**: Use `clamp(min, Xvw, max)` for padding/margin.
- **Units**: Prefer `rem`, `em`, `vw`, `vh` for scalable outcomes.
- **Example**:

    ```json
    {
      "typography": {
        "fontSizes": [
          { "slug": "base", "size": "clamp(1rem, 2vw, 1.5rem)", "name": "Base" }
        ]
      },
      "spacing": {
        "spacingSizes": [
          { "slug": "large", "size": "clamp(2rem, 6vw, 4rem)", "name": "Large" }
        ]
      }
    }
    ```

---

## 11. Mustache Placeholder Examples

Include mustache values in **every canonical file** so it’s ready for automated replacement:

- `{{theme_name}}`, `{{slug}}`, `{{author}}`, `{{primary_color}}`, `{{body_font}}`, etc.

---

## 12. Starter File Placeholders

**patterns/20-hero-page.php**

```php
/**
 * Title: Hero Page
 * Slug: lsx-design/hero-page
 * Categories: lsx-design/hero
 * Block Types: core/cover
 * Inserter: yes
 * Author: {{author}}
 */
<!-- wp:cover { "background": "{{primary_color}}" } -->
  <h1>{{hero_title}}</h1>
  <p>{{hero_lead}}</p>
<!-- /wp:cover -->
```

**parts/header.html**

```html
<!--
  Template Part: Header
  Slug: header
  Description: Primary header for {{theme_name}}.
  Area: header
-->
<!-- wp:group { "tagName": "header" } -->
  <!-- wp:site-title /-->
  <!-- wp:navigation /-->
<!-- /wp:group -->
```

**theme.json**

```json
{
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        { "name": "Primary", "slug": "primary", "color": "{{primary_color}}" }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "name": "Body", "slug": "body", "fontFamily": "{{body_font}}" }
      ]
    }
  },
  "templateParts": [
    { "slug": "header", "title": "Header" }
  ],
  "customTemplates": [
    { "name": "page-no-title", "title": "Page (No Title)", "postTypes": ["page", "post"] }
  ]
}
```

**styles/dark.json**

```json
{
  "settings": {
    "color": { "palette": [ { "name": "Dark", "slug": "dark", "color": "{{dark_bg_color}}" } ] }
  }
}
```

**src/scss/style.scss**

```scss
// Main stylesheet for {{theme_name}}
body {
  background: {{primary_color}};
  color: {{contrast_color}};
  font-family: {{body_font}};
}
```

**src/js/index.js**

```js
// JS entry for {{theme_name}} by {{author}}
console.log("Theme loaded: {{theme_name}}");
```

---

**Use this document as the canonical reference for structure, naming, and mustache placeholders across all theme files.**
