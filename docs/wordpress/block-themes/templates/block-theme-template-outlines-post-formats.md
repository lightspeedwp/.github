# Block Template Outlines — Post Formats (Updated to canonical template parts & patterns)

These outlines describe templates for specific post formats. Each template should follow the standard skeleton (parts/skip-links, parts/header, content, parts/footer) and use the canonical parts and patterns.

## Naming
- Post-format-specific single templates can be named: templates/single-post-{format}.html (e.g., single-post-quote.html).
- Post-format archives are taxonomy/post_format archives: templates/taxonomy-post_format-post-format-{format}.html or templates/taxonomy-post_format.html.

## Templates

### 1) single-post-standard.html (or single-post.html)
- Minimal:
  - parts/skip-links, parts/header, parts/hero (optional patterns/hero-post), Post Title (H1), Featured Image/Cover, Post Content, parts/post-meta, parts/author-card (compact/full), parts/share-actions (optional), parts/comments, parts/footer
- Notes:
  - Provide TOC for long posts, related posts Query Loop where appropriate.

### 2) single-post-aside.html
- Minimal:
  - parts/skip-links, parts/header, Post Content (inline), parts/post-meta (date/time), parts/footer
- Notes:
  - If title is hidden, include a visually-hidden Post Title for accessibility.

### 3) single-post-gallery.html
- Minimal:
  - parts/skip-links, parts/header, Gallery block / Cover, Post Content (caption/description), parts/share-actions (optional), parts/footer
- Notes:
  - Ensure alt text on all images and consider keyboard-accessible lightbox.

### 4) single-post-link.html
- Minimal:
  - parts/skip-links, parts/header, Post Title or Post Content containing the link, clear primary link CTA, parts/post-meta, parts/footer
- Notes:
  - Mark external links with rel="noopener" and indicate external target to assistive tech.

### 5) single-post-image.html
- Minimal:
  - parts/skip-links, parts/header, Large featured image (Cover) with caption, Post Content (short), parts/post-meta, parts/footer
- Notes:
  - Provide descriptive alt text and download/license info if needed.

### 6) single-post-quote.html
- Minimal:
  - parts/skip-links, parts/header, Blockquote with cite, optional commentary, parts/post-meta, parts/footer
- Notes:
  - Ensure semantic markup (blockquote/cite). Provide an accessible H1 if quote is prominent.

### 7) single-post-status.html
- Minimal:
  - parts/skip-links, parts/header, Post Content (short), parts/post-meta (timestamp), parts/footer
- Notes:
  - Keep DOM light and time machine-readable.

### 8) single-post-video.html
- Minimal:
  - parts/skip-links, parts/header, Responsive Embed/Video block, Transcript/description (Post Content), parts/post-meta, parts/footer
- Notes:
  - Include captions/transcript and accessible player controls.

### 9) single-post-audio.html
- Minimal:
  - parts/skip-links, parts/header, Audio block/player, Episode notes (Post Content), download link/chapters, parts/post-meta, parts/footer
- Notes:
  - Provide transcript and accessible controls.

### 10) single-post-chat.html
- Minimal:
  - parts/skip-links, parts/header, Conversation/structured list, intro/context, parts/post-meta, parts/footer
- Notes:
  - Use semantic lists (dl/ul) for speakers and timestamps.

### Taxonomy: post_format archives
- Minimal:
  - parts/skip-links, parts/header, Archive title (format name), Query Loop scoped to post_format (parts/loop-default or patterns/post-card), pagination, parts/footer

General implementation notes:
- Prefer core blocks for editability.
- Maintain single visible H1 per page; if a format hides visible title, include a visually-hidden H1.
- Expose custom fields used in Query Loops via show_in_rest.
- Use parts/share-actions, parts/loop-default, patterns/post-card, and patterns/author-card variants as needed.

If desired, I can generate ready-to-drop-in templates for all formats that include Template Part blocks referencing the canonical parts.