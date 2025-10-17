# **Issue & PR Labelling — Guide & Explainer**

***Version:*** v1.0 • ***Last updated:*** 17 Oct 2025

This guide explains how to use LightSpeed’s **default GitHub labels**. It folds in our **BugHerd tag families** so triage flows from BugHerd → GitHub without translation.

## Families overview

- **`status:*`** — blocked, duplicate, in-progress, needs-client-discussion, needs-design, needs-design-review, needs-dev, needs-discussion, needs-documentation, needs-figma-update, needs-loom-video, needs-more-info…
- **`priority:*`** — critical, important, normal, minor
- **`type:*`** — a11y, bug, chore, compat, content-import, content-management, design, dev, feature, fix, improve, missing-content…
- **`area:*`** — analytics, block-visibility, cards, cookie-policies, cta, emails, forms, gallery, hero, integration, mega-menu, mobile-menu…
- **`comp:*`** — block-editor, block-json, block-patterns, block-styles, block-templates, color-palette, post-settings, section-styles, settings, site-editor, spacing, template-parts…
- **`env:*`** — live, local, prototype, staging
- **`phase:*`** — post-launch, pre-launch, staging-uat
- **`page:*`** — about, blog, contact, events, faq, gallery, home, legal, newsletter-subscribe, portfolio, products, services…
- **`issue:*`** — 404-error, broken-link, js-error, open-link_blank, redirect
- **`device:*`** — desktop, laptop, mobile, tablet-landscape, tablet-portrait
- **`layout:*`** — content-width, full-width, grid, list, wide-width
- **`theme:*`** — block-theme, configuration, content-model, design-system, plugin, tour-operator, woocommerce
- **`size:*`** — L, M, S, XL, XS, XS|S|M|L|XL|unknown, unknown
- **`block:*`** — audio, button, columns, comments, cover, excerpt, featured-image, gallery, group, image, list, pagination…
- **`template-part:*`** — breadcrumbs, comments, footer, header, post-meta, sidebar
- **`template:*`** — 404, all-archives, category-archives, front-page, index, page, page-blank, page-default, page-no-title, search-results, single, tag-archives
- **`woo:*`** — block-cart, block-checkout, block-product-collection, block-product-collections, block-product-search, coupons, emails, extension-subscriptions, page-cart, page-checkout, page-coming-soon, page-my-account…
- **`to:*`** — accommodation-archive, accommodation-facilities, accommodation-rooms, accommodation-type-archive, brand-archive, continent-archive, core, destinations-archive, fast-facts, maps, post-relationships, prices…

### Principles
- **One current `status:*`.** Update as work moves.
- **Always set a `priority:*`.** Default to `priority:normal` if unsure.
- **Use `type:*` for category** (feature, bug, chore, etc.).
- **Add `area:*` or `comp:*`** to route to owners. Use the more specific `comp:*` when possible.
- Add **context labels** only when they help assignment/search: `env:*`, `phase:*`, `page:*`, `device:*`, `layout:*`, `theme:*`, `block:*`, `template:*`, `template-part:*`, `woo:*`, `to:*`, `size:*`.

### Triage (quick path)
1. Set **Issue Type** (Epic/Story/Task/Bug/etc.).
2. Add **`priority:*`** and **`type:*`**.
3. Add **one** of `area:*` or `comp:*`.
4. Set **`status:needs-triage`** → when ready switch to **`status:ready`**.
5. Add optional context labels (env/phase/page/device/layout/…).
6. Link PRs; workflows enforce **one** `status:*` and nudge for changelog labels.

### Status reference
- Intake: `status:needs-triage` → `status:ready`
- Doing: `status:in-progress` (queues: `status:needs-dev`, `status:needs-design`, `status:needs-review`, `status:needs-qa`, `status:needs-testing`)
- Pauses: `status:on-hold`, `status:blocked`, `status:needs-more-info`
- Admin: `status:duplicate`, `status:wontfix`, `status:ready-for-deployment`

See the **label catalogue** for full descriptions and colours.
