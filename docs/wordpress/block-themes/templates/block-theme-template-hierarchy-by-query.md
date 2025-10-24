### Overview — What this document is and how to use it

This document documents the Block Theme Template Hierarchy (by query/context) and the exact set of template files and template-part slugs used by this project. It is written for theme authors, implementers and content designers working with WordPress Full Site Editing (block themes). It clarifies:

- How WordPress chooses which template file to use for a request (the Template Hierarchy concept).
- The canonical set of template files (templates/) created for the theme and where they fit in the hierarchy.
- The canonical set of template parts (parts/) and how templates should include them.
- How to use patterns/ for layout variants instead of proliferating template-part slugs.

If you want the formal WordPress reference, see:
- Template Hierarchy overview — https://developer.wordpress.org/themes/templates/template-hierarchy/
- Template Hierarchy basics — https://developer.wordpress.org/themes/basics/template-hierarchy/

This document aligns the project's file list and naming conventions with the WordPress template hierarchy rules so that WordPress will select the most specific template available and fall back predictably to more generic templates (ultimately templates/index.html).

---

## How Template Selection Works (short summary)

- WordPress evaluates the request (is it a post, page, category, author, search, feed, etc.) and tries to find the most specific template file that matches that context.
- For block themes the templates are HTML files under templates/ (not PHP). The same hierarchy rules apply — only the filenames and file format differ.
- If a highly-specific template exists (for example templates/single-product.html for the 'product' post type) WordPress uses it. If it does not exist, WordPress falls back to the next file in the hierarchy until templates/index.html is used as the final fallback.
- Template Parts (files in parts/) are reusable fragments (header, footer, hero, etc.) inserted into templates via the Template Part block:
  <!-- wp:template-part {"slug":"header"} /-->
- Patterns live in patterns/ and provide layout variants that editors can insert into parts or templates (for example hero-page, hero-post).

The sections below show the hierarchy by context and the exact template filenames the theme provides or recommends. Where the project uses a consolidated approach (single slug with patterns for variants), that guidance is stated.

---

## File conventions used by this project

- templates/ — top-level templates (block HTML): templates/index.html, front-page.html, home.html, single.html, page.html, archive.html, category.html, taxonomy.html, search.html, 404.html, attachment.html, embed.html, date.html, author.html, privacy-policy.html, offline.html, plus optional specific templates (single-{post-type}.html, archive-{post_type}.html, taxonomy-{taxonomy}.html, taxonomy-{taxonomy}-{term}.html, page-{slug}.html, page-{id}.html).
- parts/ — template parts injected via Template Part block. Canonical slugs (filenames in parts/) for this project:
  - parts/skip-links.html
  - parts/header.html
  - parts/footer.html
  - parts/hero.html (use patterns for hero-page, hero-post, hero-archives)
  - parts/post-meta.html
  - parts/author-card.html (patterns for compact / full)
  - parts/comments.html
  - parts/loop-default.html
  - parts/share-actions.html
  - parts/breadcrumbs.html
  - parts/site-notice.html
  - parts/mobile-nav-panel.html
  - parts/search-panel.html
  - parts/sidebar.html
  - parts/cta-banner.html
  - parts/language-switcher.html
  - parts/currency-switcher.html
- patterns/ — layout variants used inside parts or templates (e.g., patterns/hero-page.html, patterns/hero-post.html, patterns/hero-archives.html, patterns/post-card.html, patterns/author-card-compact.html).
- theme.json — registers templateParts (template part slugs and friendly titles) and defines global styles.

Keep template part filenames kebab-case and slugs consistent with file names (for example slug "header" -> parts/header.html).

---

## Front page hierarchy

- When site front page is set to "Your latest posts" (blog index):
  1. templates/front-page.html
  2. templates/home.html
  3. templates/index.html

- When front page displays a static page (Settings → Reading):
  1. templates/front-page.html
  2. templates/page-{slug}.html
  3. templates/page-{id}.html
  4. templates/page.html
  5. templates/index.html

Notes: templates/front-page.html always takes precedence if present. If a static Page object is used and front-page.html is absent, WordPress will use the page-specific templates (page-{slug}.html / page-{id}.html) before falling back to page.html and then index.html.

Recommended template parts to include:
- parts/skip-links.html
- parts/header.html
- parts/hero.html (or patterns/hero-page.html)
- featured Query Loop (parts/loop-default or patterns/post-card)
- parts/cta-banner.html (optional)
- parts/footer.html

---

## Home (posts index) hierarchy

- Posts index (the page assigned as "Posts page" or the default blog listing):
  1. templates/home.html
  2. templates/index.html

Notes: templates/home.html is the intended posts-index template for block themes. If the Posts page is an actual static Page object, page templates can apply when front-page/front-page.html is not present (see Front page rules).

Recommended template parts:
- parts/skip-links.html
- parts/header.html
- Query Loop scoped to posts (parts/loop-default or patterns/post-card)
- Pagination
- parts/sidebar.html (optional)
- parts/footer.html

---

## Singular hierarchy

Single posts and CPTs:
- Single (custom post types and post):
  1. templates/single-{post_type}.html
  2. templates/single.html
  3. templates/singular.html
  4. templates/index.html

Page (static pages):
- Page:
  1. templates/page-{slug}.html
  2. templates/page-{id}.html
  3. templates/page.html
  4. templates/singular.html
  5. templates/index.html

Attachment pages:
- Attachment:
  1. templates/attachment.html
  2. templates/single.html
  3. templates/singular.html
  4. templates/index.html

Notes: Use templates/single-{post_type}.html for CPT single views when you need a custom layout (e.g., templates/single-product.html). Use page-{slug}.html/page-{id}.html for landing pages or highly-specific page overrides.

Recommended template parts:
- parts/skip-links.html
- parts/header.html
- parts/hero.html (patterns/hero-post.html optional)
- Post Title (Post Title block — H1)
- parts/post-meta.html
- Post Content (Post Content block)
- parts/author-card.html or patterns/author-card-compact.html
- parts/comments.html (optional)
- parts/footer.html

---

## Archive hierarchy

Generic archive (post type archives):
- 1. templates/archive-{post_type}.html
- 2. templates/archive.html
- 3. templates/index.html

Category archive:
- 1. templates/category-{slug}.html
- 2. templates/category-{id}.html
- 3. templates/category.html
- 4. templates/archive.html
- 5. templates/index.html

Tag archive:
- 1. templates/tag-{slug}.html
- 2. templates/tag.html
- 3. templates/archive.html
- 4. templates/index.html

Custom taxonomy:
- 1. templates/taxonomy-{taxonomy}-{term}.html
- 2. templates/taxonomy-{taxonomy}.html
- 3. templates/taxonomy.html
- 4. templates/archive.html
- 5. templates/index.html

Notes: Use templates/archive-{post_type}.html for CPT archives when has_archive is registered. Term- and taxonomy-specific templates allow highly tailored layouts for particular taxonomies or terms.

Recommended template parts:
- parts/skip-links.html
- parts/header.html
- parts/hero.html or patterns/hero-archives.html (term title + description)
- parts/breadcrumbs.html (optional)
- Query Loop (parts/loop-default or patterns/post-card)
- Pagination
- parts/sidebar.html (optional)
- parts/footer.html

---

## Search hierarchy

- templates/search.html
- templates/index.html

Notes: search.html should include a visible Search block and an accessible heading: "Search results for: {query}". Provide search refinement (search form) and a usable empty-state with suggestions or Recent/Popular posts.

Template parts to include:
- parts/skip-links.html
- parts/header.html (with visible search)
- Search results heading + Query Loop
- parts/footer.html

---

## 404 (not found) hierarchy

- templates/404.html
- templates/index.html

Notes: Provide helpful actions: search form, popular links, home link. Keep 404.html focused and helpful; include a visible H1 like "Page not found".

Recommended template parts:
- parts/skip-links.html
- parts/header.html
- H1 "Page not found" and actions
- Suggested posts Query Loop (parts/loop-default or patterns/post-card)
- parts/footer.html

---

## Embed hierarchy

- templates/embed.html
- templates/index.html

Notes: templates/embed.html wraps oEmbed/embed requests in a minimal layout. Keep it lightweight; fallback to index.html if embed.html is absent.

---

## Date & Author archives

Date-based archives:
- templates/date.html
- templates/archive.html
- templates/index.html

Author archives:
- templates/author.html
- templates/author-{nicename}.html
- templates/author-{id}.html
- templates/index.html

Recommended template parts:
- parts/skip-links.html
- parts/header.html
- For author: parts/author-card.html (patterns/author-card-full.html)
- Query Loop scoped to date or author
- Pagination
- parts/footer.html

---

## Privacy, Offline, and Other Specialized templates

- templates/privacy-policy.html — used for the WordPress Privacy policy page (Post Title + Post Content).
- templates/offline.html — lightweight maintenance page (optional; not a WordPress core template but useful).
- Attachment variations: templates/attachment.html handles media attachments.
- Post-format templates: templates/single-post-{format}.html (optional — create only if layout differs).
- Post-format archives: templates/taxonomy-post_format.html and templates/taxonomy-post_format-post-format-{format}.html (optional).

---

## Feed templates (PHP/XML)

- Feeds are not block HTML templates. Use feed-rss2.php, feed-atom.php, etc. in the theme root for XML feed output.
- Feed templates must produce valid XML and must NOT include block-based template parts (HTML). They are outside the block template system.

---

## Mapping: templates → parts (quick reference)

Use this mapping as your canonical reference for implementing template files:

- index.html: skip-links, header, Query Loop (parts/loop-default or patterns/post-card), footer
- front-page.html: skip-links, header, hero (patterns/hero-page), featured Query Loop, cta-banner, footer
- home.html: skip-links, header, Query Loop (posts), pagination, sidebar, footer
- single.html / single-{post-type}.html: skip-links, header, hero (optional), Post Title, parts/post-meta, Post Content, parts/author-card (compact/full), parts/comments, footer
- page.html / page-{slug}.html / page-{id}.html: skip-links, header, hero (optional), Post Title, Post Content, footer
- archive.html / archive-{post-type}.html: skip-links, header, hero-archives pattern, breadcrumbs, Query Loop, pagination, sidebar, footer
- taxonomy.html / category.html / tag.html: skip-links, header, hero-archives pattern (term title/description), Query Loop, pagination, footer
- search.html: skip-links, header (search visible), Search results heading + Query Loop, footer
- 404.html: skip-links, header, H1 "Page not found", search & suggestions, footer
- attachment.html: skip-links, header, attachment display + metadata, link to parent, comments (optional), footer
- embed.html: minimal wrapper for embeds, header/footer optional

---

## Registration & theme.json

- Register the canonical template part slugs in theme.json under `templateParts` with friendly titles so they appear in the Site Editor:
  - skip-links, header, hero, footer, site-notice, mobile-nav-panel, post-meta, author-card, comments, breadcrumbs, cta-banner, search-panel, language-switcher, currency-switcher, post-card (pattern), share-actions, loop-default, sidebar

Example (in theme.json):
{
  "templateParts": [
    { "slug": "skip-links", "title": "Skip Links" },
    { "slug": "header", "title": "Header" },
    { "slug": "hero", "title": "Hero" },
    { "slug": "footer", "title": "Footer" },
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
    { "slug": "sidebar", "title": "Sidebar" }
  ]
}

Note: theme.json registration improves discoverability inside the Site Editor but templates will still load parts from parts/ even if not registered.

---

## Accessibility & developer reminders

- Place parts/skip-links.html as the first DOM element in templates to enable keyboard users to jump to main content.
- Maintain a single visible H1 per page. Templates should provide H1 for archive-like pages; single/page templates rely on the Post Title block being H1.
- Keep template parts small and single-purpose so Site Editor users can edit them easily.
- Patterns (patterns/) should provide layout variants (hero-page, hero-post, post-card) that can be inserted into hero or loop parts.
- Keep templates pure block HTML (no PHP) except for feed PHP/XML templates which must be output as XML.

---

## Where this aligns with official docs

This document follows the official WordPress Template Hierarchy and Practical usage for block themes:
- https://developer.wordpress.org/themes/templates/template-hierarchy/
- https://developer.wordpress.org/themes/basics/template-hierarchy/

Follow those guides for any additional corner-case fallbacks or unusual template naming needs. The filenames and slugs listed here are the canonical ones used by this project and are arranged to match WordPress’s selection order so that the platform will pick the most specific available template automatically.