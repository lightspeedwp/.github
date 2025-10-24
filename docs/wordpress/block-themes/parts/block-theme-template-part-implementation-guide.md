# Template Part Implementation Notes & Best Practices (Aligned to canonical template parts & areas)

This implementation guide consolidates the canonical list of template parts, their purpose, minimal block content, and the recommended usage patterns and registration approach. It aligns to the project's Block Theme guidelines and the canonical parts list.

## Key principles
- Keep parts small and single-purpose; use patterns/ for layout variants.
- Prefer core blocks (Site Title, Navigation, Social Links, Site Logo, Post Title, Post Content, Query Loop).
- Register template parts in theme.json under `templateParts` with friendly titles.

---

## Canonical templateParts (slugs → filenames)
- skip-links — parts/skip-links.html
- header — parts/header.html
- footer — parts/footer.html
- site-notice — parts/site-notice.html
- mobile-nav-panel — parts/mobile-nav-panel.html
- sidebar — parts/sidebar.html
- search-panel — parts/search-panel.html
- hero — parts/hero.html (use hero patterns for variants)
- post-meta — parts/post-meta.html
- author-card — parts/author-card.html (patterns for compact/full)
- comments — parts/comments.html
- loop-default — parts/loop-default.html
- post-card — patterns/post-card.html (or parts/post-card.html if you prefer a part)
- share-actions — parts/share-actions.html
- breadcrumbs — parts/breadcrumbs.html
- cta-banner — parts/cta-banner.html
- language-switcher — parts/language-switcher.html
- currency-switcher — parts/currency-switcher.html

Example registration snippet for theme.json:
{
  "templateParts": [
    { "slug": "skip-links", "title": "Skip Links" },
    { "slug": "header", "title": "Header" },
    { "slug": "hero", "title": "Hero" },
    { "slug": "footer", "title": "Footer" },
    { "slug": "site-notice", "title": "Site Notice" },
    { "slug": "mobile-nav-panel", "title": "Mobile Nav Panel" },
    { "slug": "post-meta", "title": "Post Meta" },
    { "slug": "author-card", "title": "Author Card" },
    { "slug": "comments", "title": "Comments" },
    { "slug": "breadcrumbs", "title": "Breadcrumbs" },
    { "slug": "cta-banner", "title": "CTA Banner" },
    { "slug": "search-panel", "title": "Search Panel" },
    { "slug": "language-switcher", "title": "Language Switcher" },
    { "slug": "currency-switcher", "title": "Currency Switcher" },
    { "slug": "post-card", "title": "Post Card" },
    { "slug": "share-actions", "title": "Share Actions" },
    { "slug": "loop-default", "title": "Loop Default" },
    { "slug": "sidebar", "title": "Sidebar" }
  ]
}

---

## Detailed part guidance (purpose & minimal blocks)

- Skip Links (parts/skip-links.html)
  - Purpose: top-of-DOM links to #content, #primary-nav, #footer
  - Minimal: anchor list with visible focus styles and accessible labels.

- Header (parts/header.html)
  - Purpose: site identity, primary navigation, search toggle, language/currency switchers
  - Minimal: Site Title/Logo, Navigation block, optional mobile-nav toggle, search icon.

- Footer (parts/footer.html)
  - Purpose: secondary nav, legal links, social links
  - Minimal: Group with navigation, copyright, social links.

- Hero (parts/hero.html + patterns)
  - Purpose: single part to host hero patterns (hero-page, hero-post, hero-index, hero-archives)
  - Minimal: Group wrapper with placeholder/pattern insertion point.

- Post Meta (parts/post-meta.html)
  - Purpose: date, author, categories, read time
  - Minimal: Post Date, Post Author, Post Terms blocks.

- Author Card (parts/author-card.html + patterns)
  - Purpose: author presentation; patterns for compact/full variants
  - Minimal: Avatar, heading (author name), paragraph (bio), social links.

- Loop Default (parts/loop-default.html)
  - Purpose: default Query Loop item template
  - Minimal: Featured Image, Post Title (linked), Post Excerpt, Post Meta, Read More.

- Post Card (patterns/post-card.html)
  - Purpose: card-style item for grid/list loops
  - Minimal: Cover or image, Title, Excerpt, Meta, CTA.

- Share Actions (parts/share-actions.html)
  - Purpose: social links and copy-link button
  - Minimal: Social Links block and an accessible copy-link button (data-permalink attribute).

- Comments (parts/comments.html)
  - Purpose: comments heading, Comment List, Comment Form.

- Breadcrumbs (parts/breadcrumbs.html)
  - Purpose: small breadcrumb list with aria-label="Breadcrumb".

- Site Notice, Mobile Nav Panel, Search Panel, Sidebar, CTA Banner, Language/Currency Switchers
  - Purpose: utility and interaction parts. Keep minimal; provide small JS modules for interactivity (focus trap, dismiss, copy-to-clipboard).
  - Implementation: progressive enhancement — parts function without JS; JS adds focus trapping/dismiss/store behavior.

---

## Accessibility & performance
- Use single visible H1 per page.
- Place skip-links early in DOM.
- Ensure overlays/panels trap focus and restore it when closed (small JS modules).
- Lazy-load off-screen images; use responsive srcset & sizes.
- Keep Query Loop initial counts modest; provide pagination.

---

## Next steps
1. Create parts/*.html files for the canonical list above as pure block markup.
2. Create patterns/ for hero variants, author-card variants and post-card variations.
3. Register template parts in theme.json as shown.
4. Add small JS modules in assets/ and enqueue via functions.php using .asset.php manifests.

If helpful, I can now generate the minimal parts/*.html files and a patterns/ set based on this canonical list.