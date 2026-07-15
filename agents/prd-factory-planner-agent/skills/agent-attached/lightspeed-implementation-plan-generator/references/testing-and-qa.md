# Testing and QA Approach

## Recommended checks

| Area | Checks |
|---|---|
| PHP | PHPCS/WPCS, fatal errors, hooks, escaping and sanitisation |
| JavaScript | ESLint where available, build errors, block editor behaviour |
| Blocks | editor controls, frontend render, fallbacks, responsive behaviour |
| Theme | templates, parts, patterns, theme.json, global styles |
| Accessibility | keyboard, focus, contrast, headings, forms, reduced motion |
| Performance | Lighthouse/PageSpeed, asset loading, image/font handling |
| Content | approved content, links, claims, schema-ready FAQs |
| Analytics | GA4 events, GTM triggers, form submissions, CTA clicks |
| Launch | redirects, sitemap, robots, Search Console, rollback |

## Acceptance mapping

Each task should map to:

- acceptance criteria
- QA checks
- launch gate impact
- reviewer role
