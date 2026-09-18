# Audit triage model

Use this reference when a Yoast audit, troubleshooting request, QA finding, launch check, or migration issue needs severity, priority, owner direction, or next-step classification.

## Purpose

The triage model keeps Yoast findings practical for agency delivery. It separates search-impact risk, implementation urgency, evidence confidence, and ownership so the skill does not overstate uncertain SEO effects or bury important technical defects in generic advice.

## Required finding fields

For each finding capture:

| Field | Use |
|---|---|
| Finding ID | Stable short ID such as `YOAST-AUD-001` |
| Area | Metadata, canonical, robots, sitemap, schema, breadcrumbs, WooCommerce, migration, redirects, AI metadata, developer customisation, product packaging, or source evidence |
| Location | URL, content type, taxonomy, template, product, setting group, plugin, source row, or code path |
| Observed evidence | What was actually seen in admin, rendered source, crawl, sitemap, source register, code, screenshot, or user-provided note |
| Expected behaviour | What should happen, with source state labelled |
| Impact | What can break or degrade: indexation, duplication, discoverability, sharing, schema validity, product eligibility, editor workflow, migration safety, or evidence reliability |
| Severity | Critical, high, medium, low, or advisory |
| Priority | P0, P1, P2, P3, or backlog |
| Confidence | Verified, likely, partial, weak, or unknown |
| Owner direction | SEO/configuration, content, developer, WooCommerce/data, client approval, hosting/platform, or research refresh |
| Recommended action | Smallest safe next action |
| QA check | How to confirm resolution |
| Evidence state | Use `references/evidence-state-model.md` labels |

## Severity scale

| Severity | Use when | Examples |
|---|---|---|
| Critical | The site or important sections may be blocked, deindexed, severely duplicated, or migrated unsafely | Site-wide noindex, production robots block, broken canonical on all product pages, missing migration redirects for key URLs |
| High | Important page groups have strong SEO output risk or transactional/search-impact risk | Products excluded from sitemap unintentionally, product canonicals point to wrong variant, important content type hidden from search, schema conflict on key templates |
| Medium | Issue affects quality, consistency, validation, or a meaningful subset of pages | Weak title templates, duplicate taxonomy archives indexed, incomplete product identifiers, missing breadcrumbs on key templates |
| Low | Issue is localised, cosmetic, advisory, or has limited search impact | Single page metadata gap, optional social image missing, minor breadcrumb label issue |
| Advisory | Recommendation improves maintainability or evidence quality but is not a defect | Refresh product packaging source, document agency default, add QA screenshot to handoff |

## Priority scale

Priority is not the same as severity. Use urgency and delivery context.

| Priority | Use when | Typical action window |
|---|---|---|
| P0 | Launch blocker or active production harm | Stop launch or fix before continuing |
| P1 | Important pre-launch or current production risk | Fix in the current workstream |
| P2 | Meaningful improvement but not blocking | Schedule in this sprint or project phase |
| P3 | Useful but low urgency | Add to backlog or maintenance plan |
| Backlog | Nice-to-have, evidence weak, or dependent on future decisions | Track only after approval |

## Confidence scale

| Confidence | Definition |
|---|---|
| Verified | Confirmed in rendered output, admin export, source scan with date, crawl, Search Console, or codebase evidence |
| Likely | Strong inference from multiple consistent inputs, but no direct rendered/admin confirmation |
| Partial | Some evidence exists, but important context is missing |
| Weak | Based on user description, screenshot fragment, stale source, or unverified source-register row |
| Unknown | Cannot classify without more evidence |

## Owner direction

| Owner | Typical findings |
|---|---|
| SEO/configuration | Search appearance, indexation choices, sitemaps, breadcrumbs, social metadata |
| Content | Missing titles/descriptions, poor excerpts, taxonomy bloat, thin categories, missing product copy |
| Developer | Filters, schema customisation, canonical conflicts, theme/plugin output conflicts, headless rendering |
| WooCommerce/data | Product identifiers, variations, stock, reviews, attributes, categories, filtered URLs |
| Client approval | Organisation/person identity, legal claims, AI-generated copy, migration redirect decisions |
| Hosting/platform | Robots delivery, HTTP headers, staging blocks, caching or CDN output conflicts |
| Research refresh | Product packaging, version-sensitive APIs, Google rich-result eligibility, Yoast UI path |

## Triage workflow

1. Identify the affected surface: setting, page group, product group, taxonomy, template, rendered output, code path, source row, or launch gate.
2. Record observed evidence before recommending fixes.
3. Classify severity by potential harm, not by how annoying the issue is.
4. Classify priority by timing, launch state, and business importance.
5. Label evidence confidence and source state.
6. Choose the smallest safe next action.
7. Add a QA check that proves the issue is resolved.
8. If the finding depends on product packaging, Google behaviour, or developer API status, route to current verification before final advice.

## Output rules

- Do not imply a finding has search impact without explaining the plausible mechanism.
- Do not mark a finding critical solely because a tool score is red.
- Do not ask for more evidence if a safe low-risk recommendation can be made from current context.
- Use `advisory` for source freshness, documentation and maintainability issues.
- Escalate to developer only when configuration or content changes cannot safely resolve the finding.
