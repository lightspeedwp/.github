# SEO Migration Notes

## Core SEO controls

A redirect map should reduce migration risk, but it cannot guarantee ranking preservation.

Before launch, confirm:

- final URL structure
- crawlable staging environment when appropriate
- meta titles and descriptions migrated or rewritten
- canonical tags point to final URLs
- XML sitemap contains final URLs only
- robots.txt does not block production
- internal links use final URLs, not staging URLs
- schema uses final canonical URLs
- old high-value URLs have specific redirect destinations
- 404 handling is user-friendly and monitored

## Search Console checks

Before launch:

- export top pages by clicks
- export top pages by impressions
- export indexed URL examples
- note pages with brand/query value

After launch:

- submit sitemap
- monitor coverage/indexing
- check 404 and soft 404 reports
- monitor top landing pages
- inspect high-priority redirected URLs

## Common SEO risks

- redirecting many pages to homepage
- forgetting trailing slash variants
- leaving internal links pointing to old URLs
- allowing staging URLs into the index
- losing query/campaign landing pages
- missing redirects for PDFs or uploaded assets
- deleting old blog/category routes without review
- changing slugs after redirect rules are built
