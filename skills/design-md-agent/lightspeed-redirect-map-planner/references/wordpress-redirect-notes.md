# WordPress Redirect Notes

## Implementation options

Redirects may be implemented through:

- server configuration such as Nginx or Apache rules
- hosting control panel redirect rules
- WordPress redirect plugin
- custom WordPress rewrite handling
- CDN or edge redirect rules

Choose the simplest maintainable option for the site architecture and hosting environment.

## WordPress-specific checks

Check:

- pages, posts and custom post types
- category, tag and custom taxonomy archives
- author archives if used
- pagination routes
- search result URLs if indexed
- media attachment pages
- uploaded PDFs and files
- WooCommerce products/categories if applicable
- multilingual routes if applicable
- trailing slash behaviour

## QA commands and tools

Use available tools such as:

- Screaming Frog
- Sitebulb
- curl status checks
- browser manual checks
- hosting redirect logs
- Search Console after launch

## WordPress launch notes

Avoid relying only on WordPress automatic slug redirects for a major IA change. Create explicit redirects for high-value routes.
