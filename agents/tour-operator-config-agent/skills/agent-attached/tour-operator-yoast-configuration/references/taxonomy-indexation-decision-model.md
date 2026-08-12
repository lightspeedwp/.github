# Taxonomy Indexation Decision Model

Use this model when deciding whether an archive should be indexable, noindexed, improved, consolidated or redirected.

## Required fields

- taxonomy or archive name
- affected URLs or term group
- current indexation state
- sitemap state
- canonical state
- visible content quality
- internal linking role
- search intent fit
- recommendation
- risk level
- approval owner
- QA checks

## Decision scale

| Decision | Use when | QA required |
|---|---|---|
| Keep indexable | archive is useful, unique and linked | rendered robots, canonical, sitemap, title and description |
| Improve first | intent is valid but content is thin | copy review, sample rendered output, sitemap decision |
| Noindex | internal value is higher than search value | robots output and sitemap exclusion |
| Consolidate | overlapping terms split the same intent | redirects or internal link cleanup |
| Redirect | term has a clear successor | status, target canonical and sitemap cleanup |

## Caution

Do not recommend global archive exclusion without sampling important destination, tour, accommodation and travel-style archives.
