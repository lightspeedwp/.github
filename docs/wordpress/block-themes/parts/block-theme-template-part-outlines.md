# Template Parts — Approach, Filenames & Assigned Areas (Canonical list)

This document provides the canonical template part slugs, filenames, and intended template areas. Use these slugs when creating parts in parts/ and register them in theme.json under `templateParts`. For layout variants, create patterns/ files rather than registering multiple slugs.

Format:
- Name — Filename — Area
  - Short purpose / notes (patterns, fallback, accessibility reminders)

## Essential / Global parts
- Skip Links — parts/skip-links.html — Area: utility / top-of-dom
  - Purpose: Immediate navigation for keyboard users (#content, #nav, #footer). Place as first element.

- Header — parts/header.html — Area: header (global)
  - Purpose: Site identity, primary navigation, search toggle, language/currency switchers.

- Footer — parts/footer.html — Area: footer (global)
  - Purpose: Secondary navigation, legal links, social links, credits.

- Site Notice — parts/site-notice.html — Area: utility / top-of-page
  - Purpose: Dismissible announcement bar. Provide accessible dismiss control.

- Mobile Nav Panel — parts/mobile-nav-panel.html — Area: overlay / mobile-nav
  - Purpose: Off-canvas navigation for small screens. Requires optional JS for focus management.

- Sidebar — parts/sidebar.html — Area: secondary column / widgets
  - Purpose: Contextual widgets, search, newsletter CTAs.

- Search Panel — parts/search-panel.html — Area: overlay / utility
  - Purpose: Dedicated search interface; trap focus while open.

## Hero / Page Header (consolidated)
- Hero — parts/hero.html — Area: hero (template-specific)
  - Purpose: Single registered hero part. Use patterns for variants:
    - patterns/hero-page.html — large page cover (title + CTA)
    - patterns/hero-post.html — featured image + post title + meta
    - patterns/hero-index.html — intro band for listing pages
    - patterns/hero-archives.html — term/archive hero with description

## Author presentation (consolidated)
- Author Card — parts/author-card.html — Area: author / post-meta / sidebar
  - Purpose: Single author part with pattern variants:
    - patterns/author-card-compact.html
    - patterns/author-card-full.html

## Post-related parts
- Post Meta — parts/post-meta.html — Area: content-top / content-bottom / post-meta band
  - Purpose: date, author, taxonomies, read time.

- Share Actions — parts/share-actions.html — Area: content-top / content-bottom
  - Purpose: Social buttons and copy-link.

- Comments — parts/comments.html — Area: content-bottom / comments-region
  - Purpose: Comments list and form.

## Loop & Query Loop parts
- Loop Default — parts/loop-default.html — Area: Query Loop item template
  - Purpose: Default item markup for Query Loop.

- Post Card (pattern) — patterns/post-card.html — Area: Query Loop / grid
  - Purpose: Card-style variant for Query Loops.

## Taxonomy / Archive parts
- Breadcrumbs — parts/breadcrumbs.html — Area: under hero / content-top
  - Purpose: Breadcrumb navigation (aria accessible).

## Utility & Small parts
- CTA Banner — parts/cta-banner.html — Area: global / content-top / content-bottom
- Language Switcher — parts/language-switcher.html — Area: header / footer / utility
- Currency Switcher — parts/currency-switcher.html — Area: header / footer / utility

## Accessibility / Admin parts
- Skip Links — parts/skip-links.html — Area: top-of-dom
- Site Notice — parts/site-notice.html — Area: top-of-page

## Registration guidance (theme.json)
Register canonical slugs under `templateParts` in theme.json. Prefer a single slug for a logical area (e.g., `hero`) and create patterns for layout variations. Patterns will appear in the Pattern browser for editors.

## Implementation checklist & quick reminders
- Create parts/*.html files as pure block markup.
- Create patterns/ for hero and author-card variants and post-card.
- Register template parts in theme.json with friendly titles.
- Provide small JS modules for interactive parts and enqueue using .asset.php manifests.
- Document mapping (template → templatePart slug → recommended pattern) in README for editors.

If you want, I can now produce minimal parts/*.html and patterns/*.html files following this canonical list.