# Migration intake

Use this for redesigns, rebuilds, domain moves, URL changes, WooCommerce migrations, content consolidation, platform changes, or metadata/schema migration work.

## Required migration evidence

1. Old domain and new domain or staging URL.
2. Old URL inventory and proposed new URL map.
3. Redirect map, including 1:1 redirects, consolidated pages, removed pages, product/category changes, and excluded URLs.
4. Existing metadata export: titles, descriptions, canonicals, robots, social metadata, schema notes, focus keyphrases where relevant.
5. Existing and proposed sitemap URLs.
6. Existing robots.txt and proposed robots.txt.
7. Existing llms.txt and proposed llms.txt if used.
8. Existing indexation controls: noindex, canonical overrides, blocked paths, parameter handling.
9. WooCommerce migration state: product IDs, SKUs, categories, tags, attributes, variations, reviews, ratings, stock, redirects.
10. Search Console access, current indexed pages, top landing pages, traffic-sensitive URLs, and known coverage issues.

## Safe defaults

- Do not approve launch without redirect, canonical, noindex, sitemap, robots, schema, and Search Console QA.
- Preserve high-value metadata where appropriate, but do not preserve bad duplicate templates blindly.
- Check that noindex URLs are excluded from sitemaps.
- Check that canonical URLs point to final indexable destinations.
- Test representative old-to-new redirects and product/category redirects.
- Treat exact post-launch Google behaviour as uncertain; verify with Search Console after launch.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
