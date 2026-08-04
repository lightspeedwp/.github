# Yoast developer handoff

## 1. Goal

- Requested change:
- Target layer: theme / custom plugin / block / headless / third-party integration / migration script
- Product scope:
- Evidence confidence:

## 2. Confirmed behaviour

| Behaviour | Source | Confidence | Notes |
|---|---|---|---|

## 3. Recommended implementation route

| Area | Recommended route | Why | Risk |
|---|---|---|---|
| Metadata | Use documented Yoast metadata surfaces/APIs where verified | Avoid internal table coupling |  |
| Schema | Use Yoast schema API/graph extension points where verified | Avoid duplicate graph output |  |
| Canonicals | Scope canonical filters narrowly | Avoid global canonical breakage |  |
| Sitemaps | Align sitemap changes with robots/noindex/canonicals | Avoid sitemap/indexation contradictions |  |
| Indexables | Do not edit internal tables directly | Avoid stale or broken Yoast state | High |

## 4. Pseudo-code or implementation notes

Label any unverified snippets as pseudo-code.

```php
// Pseudo-code only. Verify official Yoast documentation before implementation.
```

## 5. Required tests

- [ ] Rendered source before/after.
- [ ] Canonical, title, description, robots, Open Graph output.
- [ ] JSON-LD graph validation.
- [ ] Sitemap inclusion/exclusion.
- [ ] robots.txt and llms.txt where relevant.
- [ ] Representative post types, taxonomies, products, archives, and edge cases.
- [ ] Plugin/theme update regression.

## 6. Open risks

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
