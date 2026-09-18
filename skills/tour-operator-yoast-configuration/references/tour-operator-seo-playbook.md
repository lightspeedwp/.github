# Tour Operator SEO Playbook

Use this reference when a Yoast configuration task involves destination, tour, accommodation, travel-style, itinerary, guide, FAQ or enquiry-led content.

## Table of contents

1. Page group model
2. Archive indexation decisions
3. Canonical decisions
4. Sitemap decisions
5. Breadcrumb decisions
6. Schema-safe content
7. Seasonal and expired tour handling
8. Source evidence rules

## 1. Page group model

Classify the site before recommending settings:

- **Destination pages**: regions, countries, cities, parks, routes or themes used to organise tour content.
- **Tour pages**: bookable or enquiry-led experiences, with dates, duration, inclusions, exclusions and itinerary copy.
- **Accommodation pages**: lodges, hotels, camps or stays connected to destinations or tours.
- **Travel-style pages**: safari, family, luxury, self-drive, walking, adventure or special-interest taxonomy pages.
- **Guide content**: articles, travel advice, FAQs, route notes and practical planning pages.
- **Lead pages**: enquiry, booking request, consultation, contact and thank-you pages.

## 2. Archive indexation decisions

Index an archive only when it has clear search intent, enough unique text, useful listings and stable internal links. Treat thin archives as candidates for content improvement, consolidation or noindex.

Good indexation candidates:

- destination archives with useful introductory copy and relevant child pages
- travel-style pages that explain who the trip type suits
- tour archives with meaningful filtering handled outside indexable URL sets
- accommodation archives that support destination planning

Poor indexation candidates:

- empty tag archives
- near-duplicate activity archives
- low-value internal grouping pages
- date archives with no strategic purpose
- attachment pages and media archives unless intentionally used

## 3. Canonical decisions

Use self-referencing canonicals for strong, unique pages. Use canonical changes only when there is a confirmed duplicate or replacement relationship.

Common tour cases:

- A seasonal tour page with updated dates should usually remain self-canonical if the main content remains useful.
- A retired tour replaced by a new route may need a redirect rather than a canonical change.
- A destination page and a tour page should not canonicalise to each other unless one is genuinely a duplicate.
- A translated page should have its own canonical for that language version, paired with correct hreflang where available.

## 4. Sitemap decisions

Include high-value, indexable pages in XML sitemaps. Exclude noindex archives, internal utility pages, test pages and low-value archives.

Prioritise sitemap QA for:

- destination pages
- tour pages
- accommodation pages
- travel-style pages
- evergreen guide content
- key enquiry pages

## 5. Breadcrumb decisions

Breadcrumbs should help users understand the site structure and should not misrepresent relationships.

Recommended patterns:

- Home > Destinations > Destination > Tour
- Home > Travel Styles > Style > Tour
- Home > Accommodation > Region > Accommodation
- Home > Guides > Article

When a tour belongs to more than one destination or style, choose a primary path based on the strongest user journey and internal linking strategy.

## 6. Schema-safe content

Use schema only where the visible page content supports it. Do not mark up claims, ratings, dates, prices or availability unless the source is approved and visible.

Common safe schema areas:

- Organisation and WebSite basics
- WebPage and Article output
- FAQPage when the FAQ is visible and approved
- BreadcrumbList when breadcrumbs are rendered
- Place-style entity modelling where supported by the site data and current vocabulary

Avoid treating schema validity as proof of rich-result display.

## 7. Seasonal and expired tour handling

Choose the smallest safe path:

- keep and refresh if the tour is recurring
- redirect if a clear successor exists
- keep with updated status if the page still answers planning intent
- noindex only when the page should remain accessible but not indexed
- remove only with a redirect or documented reason

Always QA redirect status, canonical state, sitemap inclusion, internal links and visible messaging after a change.

## 8. Source evidence rules

Before recommending changes, identify the evidence state:

- current rendered output
- Yoast setting export
- sitemap URL
- source page copy
- crawl evidence
- Search Console evidence
- redirect map
- migration map
- stakeholder notes
- unverified assumption

Do not treat a settings screenshot as proof of live output.
