---
name: lightspeed-redirect-map-planner
description: plan redirects and seo migration controls when a wordpress website structure changes. use when the user needs a current url inventory, new url map, redirect status table, priority page list, 404 risk list, seo migration notes, launch-day redirect checklist, redirect qa plan, or go/no-go notes for a redesign, rebuild, migration, domain change, content consolidation or information architecture change.
---

# LightSpeed Redirect Map Planner

## Purpose

Plan redirects and SEO migration controls for WordPress website launches where URLs, information architecture, domains, content types or page structures change.

Use this skill before launch, during a redesign, or when rebuilding a site on a new staging/dev URL that will replace an existing live site.

## Core rule

Do not assume redirects are safe because a new sitemap exists. Build the redirect plan from the current live URL inventory, priority pages, analytics/search evidence, and the proposed new URL structure.

If URL evidence is missing, create a safe redirect planning framework and mark the inventory as pending rather than inventing URLs.

## Inputs to accept

Accept any combination of:

- current live URL exports
- crawl exports from Screaming Frog, Sitebulb or similar tools
- Google Search Console page exports
- GA4 landing-page reports
- XML sitemaps
- existing WordPress page/post exports
- new sitemap or IA notes
- staging/dev URL list
- content collection outputs
- page briefs
- SEO notes
- launch audit notes
- manual URL lists

## Workflow

1. Confirm the migration context: redesign, rebuild, domain change, content consolidation or IA change.
2. Identify available URL evidence and missing inputs.
3. Build or request the current URL inventory.
4. Build the proposed new URL map.
5. Classify URLs by priority and redirect requirement.
6. Create a redirect status table.
7. Identify 404 risks, orphaned pages, duplicate routes and deleted content.
8. Add SEO migration notes and QA requirements.
9. Create a launch-day redirect checklist.
10. Provide a go/no-go redirect summary.

## Redirect classifications

Use these statuses:

- `Direct Match` - same or equivalent page exists in the new structure.
- `Consolidate` - several old URLs map to one stronger new destination.
- `Replace` - old page maps to a related but not identical new page.
- `Retain` - URL should stay live unchanged.
- `Remove - No Redirect` - only for deliberately retired low-value content with no useful equivalent.
- `Needs Decision` - destination or business intent is unclear.
- `Blocked` - redirect cannot be implemented until another issue is resolved.

## Priority levels

Classify pages as:

- `P1 Launch Critical` - homepage, top traffic pages, lead pages, high-converting pages, indexed service pages, priority backlinks, paid landing pages.
- `P2 Important` - useful indexed pages, articles, portfolio items, solution pages, pages with internal links.
- `P3 Low Risk` - low-traffic utility pages or content with no search/conversion value.
- `Review` - insufficient evidence.

## Required outputs

For redirect planning tasks, include:

- executive summary
- evidence reviewed
- missing evidence
- current URL inventory
- new URL map
- redirect status table
- priority pages
- 404 risk list
- SEO migration notes
- implementation notes for WordPress
- launch-day redirect checklist
- post-launch monitoring checklist
- go/no-go summary

## Output rules

Use UK English. Keep recommendations practical and launch-focused. Separate client-facing notes from internal LightSpeed implementation notes when useful.

Do not guarantee rankings, traffic preservation or zero SEO loss. Use careful wording such as "reduce migration risk", "preserve key routes", and "monitor after launch".

## Reference loading

Use these references as needed:

- `references/redirect-planning-workflow.md` for the end-to-end process.
- `references/redirect-status-model.md` for statuses and priority rules.
- `references/seo-migration-notes.md` for SEO migration considerations.
- `references/wordpress-redirect-notes.md` for WordPress implementation guidance.
- `references/report-template.md` for final report structure.

Use these assets as templates when generating downloadable artefacts:

- `assets/current-url-inventory-template.md`
- `assets/new-url-map-template.md`
- `assets/redirect-status-table-template.md`
- `assets/404-risk-list-template.md`
- `assets/launch-day-checklist-template.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
