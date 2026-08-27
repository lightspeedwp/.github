# Redirect Planning Workflow

## 1. Confirm migration context

Identify whether the project is:

- redesign on same domain
- rebuild with new information architecture
- domain change
- subdomain to root migration
- multisite or publication consolidation
- content pruning or archive cleanup
- platform migration into WordPress

## 2. Gather evidence

Minimum useful inputs:

- current XML sitemap
- crawl export of current live site
- proposed new URL list
- top landing pages from GA4 or equivalent analytics
- top indexed/clicked pages from Google Search Console
- pages with backlinks, paid links or campaign links if available
- high-value lead pages
- existing redirect rules if any

If analytics or Search Console are missing, mark priority confidence as lower and rely on sitemap, internal knowledge and business-critical pages.

## 3. Build current URL inventory

For each current URL, capture:

- current URL
- page title
- content type
- current status code
- indexability
- organic clicks/impressions if available
- sessions/conversions if available
- backlink or campaign value if known
- priority
- notes

## 4. Build new URL map

For each planned new page, capture:

- new URL
- page title
- content type
- source content or old page equivalent
- intended search purpose
- primary CTA
- owner
- launch status

## 5. Map redirects

Map old URLs to the closest valid new destination.

Preferred hierarchy:

1. same content at new URL
2. consolidated equivalent page
3. close topical replacement
4. relevant parent/category page
5. no redirect only when intentionally retired and low value

Avoid redirecting everything to the homepage. This weakens user experience and search relevance.

## 6. QA before launch

Check:

- all P1 URLs have destinations
- redirects are single-hop
- redirect chains are avoided
- no redirect loops exist
- deleted URLs are intentional
- canonical tags match final URLs
- sitemap includes final URLs only
- internal links point to final URLs
- forms and CTAs point to final URLs

## 7. Monitor after launch

Monitor:

- 404s
- redirect hits
- Search Console coverage
- sitemap processing
- organic landing pages
- high-value keyword pages
- form submissions
- unexpected traffic drops
