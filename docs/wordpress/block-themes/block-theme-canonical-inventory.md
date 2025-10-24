# Canonical Inventory — Templates, Template Parts, Patterns, Categories & Registrations

Summary
- This file consolidates the definitive list of templates (templates/), template parts (parts/), template-part areas, patterns (patterns/) and pattern categories that the project actually creates and uses.
- It also provides the theme.json and functions.php snippets you should add so the Site Editor and pattern inserter show the right template parts, pattern categories and custom templates.
- Use this document as the single source-of-truth to update all open docs (hierarchy, implementation guide, outlines, pattern guides, part guides).

Why this matters
- All previously attached documents must reference the same canonical filenames, slugs, pattern categories and block types. If a document names a template/part/pattern differently, update it to match the entries below.

---

A. Templates (files created under templates/)
- index.html
- front-page.html
- home.html
- single.html
- page.html
- page-no-title.html
- page-with-sidebar.html
- archive.html
- archive-{post_type}.html (create when needed)
- category.html
- tag.html
- taxonomy.html
- taxonomy-{taxonomy}.html (create when needed)
- taxonomy-{taxonomy}-{term}.html (create when needed)
- date.html
- author.html (author-{nicename}.html / author-{id}.html supported)
- search.html
- 404.html
- attachment.html
- embed.html
- privacy-policy.html
- offline.html

Notes:
- The two newly created custom page templates are templates/page-no-title.html and templates/page-with-sidebar.html. They must be registered in theme.json's `customTemplates` array (see theme.json snippet below).
- Index.html must remain present as the final fallback as per WordPress template hierarchy.

---

B. Template Parts (parts/ directory — canonical slugs & files)
Each slug must map to a kebab-case filename under parts/:

- skip-links — parts/skip-links.html
- header — parts/header.html
- menu — parts/menu.html              ← new dedicated menu template part (lsx-design/menu compatibility)
- hero — parts/hero.html
- post-meta — parts/post-meta.html
- author-card — parts/author-card.html
- comments — parts/comments.html
- loop-default — parts/loop-default.html
- share-actions — parts/share-actions.html
- breadcrumbs — parts/breadcrumbs.html
- site-notice — parts/site-notice.html
- mobile-nav-panel — parts/mobile-nav-panel.html
- search-panel — parts/search-panel.html
- sidebar — parts/sidebar.html
- cta-banner — parts/cta-banner.html
- language-switcher — parts/language-switcher.html
- currency-switcher — parts/currency-switcher.html
- footer — parts/footer.html

Notes:
- parts/menu.html is intended to be the canonical insertion point for the mega menu and the set of menu patterns (lsx-design/menu category). Use the Template Part block:
  <!-- wp:template-part {"slug":"menu"} /-->
- Template part areas: register a 'menu' area via the default_wp_template_part_areas filter (see functions.php snippet).

---

C. Patterns (patterns/ directory) — canonical slugs, filenames & categories
Patterns should use the `lsx-design` namespace in their slugs and use categories described below.

High-priority patterns (examples and slugs):
- lsx-design/hero-page — patterns/20-hero-page.php
  - Categories: banner, featured
  - Block Types: core/cover
- lsx-design/hero-post — patterns/21-hero-post.php
  - Categories: banner, posts
  - Block Types: core/cover
- lsx-design/hero-archives — patterns/22-hero-archives.php
  - Categories: banner, archive
  - Block Types: core/cover
- lsx-design/post-card — patterns/50-post-card.php
  - Categories: posts, query
  - Block Types: core/query
- lsx-design/query-grid-2col — patterns/52-query-grid-2col.php
  - Categories: query, posts
  - Block Types: core/query
- lsx-design/query-list-1col — patterns/51-query-list-1col.php
  - Categories: query, posts
  - Block Types: core/query
- lsx-design/loop-default — patterns/54-loop-default.php
  - Categories: query
  - Block Types: core/query
- lsx-design/author-card-compact — patterns/60-author-card-compact.php
  - Categories: authors
  - Block Types: core/author
- lsx-design/author-card-full — patterns/61-author-card-full.php
  - Categories: authors
  - Block Types: core/author
- lsx-design/post-meta — patterns/70-post-meta.php
  - Categories: meta, posts
  - Block Types: none / core/post-terms
- lsx-design/share-actions — patterns/71-share-actions.php
  - Categories: social
  - Block Types: none / core/social-links

Menu-specific patterns (must be registered in the lsx-design/menu category)
- lsx-design/menu-panel-1 — patterns/menu/menu-panel-1.php  (Block Types: core/template-part/menu)
- lsx-design/menu-panel-2 — patterns/menu/menu-panel-2.php  (Block Types: core/template-part/menu)
- lsx-design/menu-panel-3 — patterns/menu/menu-panel-3.php
- lsx-design/menu-card-1 — patterns/menu/menu-card-1.php
- lsx-design/mobile-menu-1 — patterns/menu/mobile-menu-1.php (Block Types: core/template-part/menu)
- etc.

Notes:
- All menu patterns MUST include `Categories: lsx-design/menu` in their pattern header so they appear under that category in the Pattern Inserter.
- Patterns that represent template-part content should include `Block Types: core/template-part/menu` or `core/template-part/header` as appropriate to improve inserter context.

---

D. Pattern Categories (register these in functions.php)
- lsx-design/menu — label "Menu" (for all menu/mega-menu patterns)
- lsx-design/cards — optional (if you have card patterns)
- lsx-design/hero — optional (if you want dedicated hero category)
- (Existing Ollie categories to keep compatibility if you want): ollie/menu (if importing from Ollie patterns)

Example list (recommended):
- lsx-design/menu (Menu)
- lsx-design/hero (Hero)
- lsx-design/query (Query / Posts)
- lsx-design/posts (Post Cards)
- lsx-design/cta (Call To Action)
- lsx-design/site (Header / Footer / Site)

---

E. Block Types to use in pattern headers (recommended)
- core/template-part/menu — for menu template-part patterns
- core/template-part/header — for header/template-part patterns
- core/template-part/footer — for footer patterns
- core/query — for Query Loop patterns
- core/cover — for hero patterns
- core/template-part/header, core/template-part/footer, core/template-part/menu where appropriate
- core/navigation or core/navigation-link if the pattern specifically uses the Navigation block

Notes:
- Use `Block Types:` in the pattern header to make patterns surface in relevant block editors (e.g., when editing a Template Part of that type).

---

F. theme.json snippets (Include these in your theme.json)

1) templateParts registration (include menu and other canonical parts):
```json
"templateParts": [
  { "slug": "skip-links", "title": "Skip Links" },
  { "slug": "header", "title": "Header" },
  { "slug": "menu", "title": "Menu" },
  { "slug": "hero", "title": "Hero" },
  { "slug": "post-meta", "title": "Post Meta" },
  { "slug": "author-card", "title": "Author Card" },
  { "slug": "comments", "title": "Comments" },
  { "slug": "loop-default", "title": "Loop Default" },
  { "slug": "post-card", "title": "Post Card" },
  { "slug": "share-actions", "title": "Share Actions" },
  { "slug": "breadcrumbs", "title": "Breadcrumbs" },
  { "slug": "site-notice", "title": "Site Notice" },
  { "slug": "mobile-nav-panel", "title": "Mobile Nav Panel" },
  { "slug": "search-panel", "title": "Search Panel" },
  { "slug": "sidebar", "title": "Sidebar" },
  { "slug": "cta-banner", "title": "CTA Banner" },
  { "slug": "language-switcher", "title": "Language Switcher" },
  { "slug": "currency-switcher", "title": "Currency Switcher" },
  { "slug": "footer", "title": "Footer" }
]
```

2) customTemplates registration (must include the two custom page templates):
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

3) patterns (optional curated listing — helpful but WP auto-registers file-based patterns):
```json
"patterns": [
  "lsx-design/hero-page",
  "lsx-design/hero-post",
  "lsx-design/hero-archives",
  "lsx-design/post-card",
  "lsx-design/query-grid-2col",
  "lsx-design/loop-default",
  "lsx-design/author-card-compact",
  "lsx-design/share-actions"
]
```

---

G. functions.php additions (pattern categories & template part area registration)
Add the following to your functions.php (respect WP coding standards and your theme namespace):

```php
// Register lsx-design pattern category for menu patterns (priority 9 to register early).
add_action( 'init', function() {
    if ( function_exists( 'register_block_pattern_category' ) ) {
        register_block_pattern_category( 'lsx-design/menu', array( 'label' => __( 'Menu', 'lsx-design' ) ) );
    }
}, 9 );

// Add 'menu' template-part area so it appears in the Site Editor area list.
add_filter( 'default_wp_template_part_areas', function( array $areas ) {
    $areas[] = array(
        'area'        => 'menu',
        'area_tag'    => 'nav',
        'label'       => __( 'Menu', 'lsx-design' ),
        'description' => __( 'Primary navigation / mega menu area used in the header and mobile nav template parts.', 'lsx-design' ),
        'icon'        => 'menu',
    );
    return $areas;
} );
```

Notes:
- If you already register pattern categories (like in Ollie functions.php), ensure you add the `lsx-design/menu` category and do not duplicate identical registrations. If the Ollie repo uses `ollie/menu`, you can register both if you want cross-compatibility, but prefer `lsx-design/menu` as canonical for this theme.

---

H. Template → parts mapping (Canonical reference)
- index.html: skip-links → header → menu → (Query Loop: parts/loop-default or lsx-design/post-card patterns) → footer
- front-page.html: skip-links → header → menu → hero (lsx-design/hero-page) → featured Query Loop → cta-banner → footer
- home.html: skip-links → header → menu → Query Loop → pagination → sidebar (optional) → footer
- single.html / single-{post-type}.html: skip-links → header → menu → hero-post (optional) → Post Title → post-meta → Post Content → share-actions → author-card → comments → footer
- page.html / page-no-title.html / page-with-sidebar.html: skip-links → header → menu → (hero optional) → main content (Post Title included in page.html and page-with-sidebar; omitted in page-no-title) → sidebar if page-with-sidebar → footer
- archive/category/tag/taxonomy/date/author: skip-links → header → menu → hero-archives (term title) → breadcrumbs (optional) → Query Loop → pagination → sidebar (optional) → footer
- search.html: skip-links → header (search visible) → menu → Search heading + Query Loop → footer
- 404.html: skip-links → header → menu → helpful actions + search-panel → recent posts (loop-default) → footer
- embed.html: minimal wrapper (embed block), header/footer optional
- privacy-policy.html: skip-links → header → Post Title → Post Content → footer
- offline.html: minimal header (optional) → H1 maintenance message → minimal footer

---

I. Pattern header recommendations (example templates)
- Menu pattern header (menu-panel-1.php):
```
/*
 Title: Menu Panel 1
 Slug: lsx-design/menu-panel-1
 Categories: lsx-design/menu
 Keywords: menu, mega menu, panel
 Viewport Width: 1260
 Block Types: core/template-part/menu
 Inserter: true
 Description: Wide mega menu panel with columns, icons and CTA.
*/
```

- Post-card pattern header:
```
/*
 Title: Post Card
 Slug: lsx-design/post-card
 Categories: posts, query
 Keywords: post, card, query
 Block Types: core/query
 Inserter: true
 Description: Card used as the Query Loop item. Includes featured image, title, excerpt, meta and read more.
*/
```

---

J. Action items — what to update in all open docs
1. Replace any old/non-canonical slugs with the canonical ones listed above (templates, parts, patterns).
2. Add note in each doc that menu patterns use the pattern category `lsx-design/menu` and menu parts use slug `menu` (parts/menu.html).
3. Ensure the theme.json examples in docs include:
   - templateParts array with `"menu"` entry
   - customTemplates array with `page-no-title` and `page-with-sidebar`
   - patterns curated list (optional)
4. Add the functions.php pattern-category and template-part-area registration snippet in implementation docs and functions.php guidance.
5. For pattern guidance, include recommended `Block Types` values (e.g., `core/template-part/menu`, `core/query`, `core/cover`) for each pattern type.
6. Confirm that the created templates templates/page-no-title.html and templates/page-with-sidebar.html are shown in examples and mapping (they are included above).

---

If you’d like I can:
- Produce updated versions of each of the open documents (hierarchy, implementation guide, outlines, part guides, patterns guide) with all references replaced to the canonical slugs and categories above. I will output each updated file as a code block (file header + contents), ready to drop into the repository.
- Or produce a single PR-ready patch (draft PR text + file diffs) that updates each document to match this canonical inventory.

Which would you prefer next?