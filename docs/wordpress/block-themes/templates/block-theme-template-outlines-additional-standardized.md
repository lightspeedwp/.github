## date.html
- Purpose:
  - Provide a date-based archive (year / month / day) for time-oriented content.
- Minimum blocks:
  - parts/skip-links (parts/skip-links.html)
  - parts/header (parts/header.html)
  - Archive title block (dynamic: "Posts from {Month Year}" / "Posts from {Year}")
  - Optional lead/description paragraph (in hero pattern)
  - Query Loop filtered by date (use parts/loop-default or patterns/post-card)
  - Pagination (rel="prev/next" or numbered)
  - parts/footer (parts/footer.html)
- Notes:
  - Include accessible headings and rel="prev/next" for paginated sections.
  - Provide a short explanation or fallback when results are empty.

## author-{nicename}.html / author-{id}.html
- Purpose:
  - Author-specific archive showing an author profile and that author's posts.
- Minimum blocks:
  - parts/skip-links, parts/header
  - hero/author pattern (patterns or parts/author-card.html with patterns/author-card-full.html)
  - Author bio / avatar / meta row
  - Query Loop scoped to author (posts by this author) using parts/loop-default or patterns/post-card
  - Sidebar or secondary column (optional): parts/author-card.html or parts/sidebar.html
  - Pagination
  - parts/footer
- Notes:
  - Ensure single H1 is the author name; include structured author data where appropriate.
  - Provide a graceful no-posts state and links to popular site sections.

## taxonomy.html
- Purpose:
  - Generic fallback template for custom taxonomy term archives.
- Minimum blocks:
  - parts/skip-links, parts/header
  - parts/hero (use patterns/hero-archives.html for term hero)
  - Term description / lead paragraph (if available)
  - Optional representative image (term image) or icon (in hero pattern)
  - parts/breadcrumbs (parts/breadcrumbs.html) — optional under hero
  - Query Loop scoped to current term (parts/loop-default or patterns/post-card)
  - Pagination
  - parts/footer
- Notes:
  - Encourage good term descriptions and images to improve discoverability.

## privacy-policy.html
- Purpose:
  - Static privacy policy page (legal/compliance content) with clear structure and accessible presentation.
- Minimum blocks:
  - parts/skip-links, parts/header
  - Post Title (H1) or Page Title block ("Privacy Policy")
  - Post Content block (editable legal content) — use H2/H3 for sections
  - Optional Table of Contents / anchor links for long documents
  - Optional contact details or data-request CTA (parts/cta-banner.html)
  - parts/footer
- Notes:
  - Consider marking as noindex if required by policy.
  - Ensure plain-language headings and accessible links to data handling pages.

## offline/maintenance.html
- Purpose:
  - Lightweight maintenance/offline page served during site maintenance.
- Minimum blocks:
  - Minimal parts/header (optional)
  - H1: short maintenance message ("We'll be back soon")
  - Short explanatory text and ETA or status
  - Actions: link to contact, status page, or subscribe CTA (parts/cta-banner.html optional)
  - Minimal parts/footer (optional)
- Notes:
  - Typically served by a maintenance plugin or server config; keep very lightweight and avoid heavy assets.

## feed templates (feed-rss2.php, feed-atom.php, etc.)
- Purpose:
  - Provide XML feed output for site content (RSS/Atom).
- Minimum blocks:
  - These are PHP/XML templates at the theme root and must output valid XML, not block HTML.
  - Proper <?xml ... ?> declaration and channel metadata; loop over posts outputting <item>/<entry> with required elements.
- Notes:
  - Do not include HTML template parts in feed templates. Ensure correct content-type and escaping.

## attachments.html
- Purpose:
  - Display media attachment pages (images, files) with caption, metadata and link back to parent content.
- Minimum blocks:
  - parts/skip-links, parts/header
  - Attachment display block (Image or Media block) with caption/metadata
  - Link back to parent post / parent URL
  - Optional related media Query Loop (parts/loop-default / patterns/post-card)
  - parts/comments (optional)
  - parts/footer
- Notes:
  - Ensure all images include meaningful alt text and responsive srcset. Provide license or download info if relevant.

## General notes for templates
- Purpose:
  - Ensure consistent structure and accessibility across templates.
- Minimum blocks (generic):
  - parts/skip-links, parts/header, template-specific blocks, parts/footer
- Notes:
  - Prefer block-based HTML templates under templates/; avoid PHP-only files except for feeds.
  - Maintain a single visible H1 per page; templates should supply H1 for archives, single/page templates rely on Post Title block.
  - Document templates that require editor assignment (e.g., privacy policy) in the theme README.