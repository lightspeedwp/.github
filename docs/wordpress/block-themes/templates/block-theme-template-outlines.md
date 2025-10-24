## Addendum — Menu Template Part & Custom Page Templates

1) Menu Template Part
- Create parts/menu.html (slug: "menu").
- Purpose: Provide a single insertion point for menu patterns and the mega-menu block. Use patterns for desktop panels, card lists, and mobile variants.
- Recommended minimal contents for parts/menu.html:
  - A Group wrapper with an accessible nav element, e.g.:
    `<!-- wp:group {"tagName":"nav","className":"site-menu"} --><!-- patterns inserted here --><!-- /wp:group -->`
- Place `<!-- wp:template-part {"slug":"menu"} /-->` into parts/header.html where appropriate.

2) Pattern Category
- All menu patterns must use the pattern category: lsx-design/menu.
- Example pattern header must include: `Categories: lsx-design/menu` and, where appropriate, `Block Types: core/template-part/menu`.

3) Custom Page Templates (theme.json)
- Add the following to theme.json to make the custom templates available in the Site Editor:
```json
"customTemplates": [
  {
    "name": "page-no-title",
    "title": "Page (Full Width, No Title)",
    "postTypes": [
      "page",
      "post"
    ]
  },
  {
    "name": "page-with-sidebar",
    "title": "Page (With Sidebar)",
    "postTypes": [
      "post",
      "page"
    ]
  }
]
```

4) Template mapping (menu)
- header.html: include parts/menu.html (desktop)
- mobile-nav-panel.html: include a mobile menu pattern (patterns/menu/mobile-*.php) or parts/menu.html variant for mobile
- page-with-sidebar template: include `<!-- wp:template-part {"slug":"menu"} /-->` as needed (for pages that require alternate menu placement)

Notes: Keep menu parts small and let patterns supply different presentations (mega-panel, card list, compact mobile list). Register the lsx-design/menu pattern category in functions.php so patterns show up correctly in the Pattern Inserter.