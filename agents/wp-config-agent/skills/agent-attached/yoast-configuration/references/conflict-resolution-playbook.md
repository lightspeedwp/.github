# Conflict resolution playbook

Use this file when evidence, settings, rendered output, source documents, Yoast UI claims, developer documentation, Google guidance, WooCommerce data, or client requirements conflict.

## Conflict types

| Conflict type | Example | Primary response |
|---|---|---|
| Source hierarchy conflict | Yoast marketing page implies a search benefit but Google documentation limits the effect | Prefer Google for Google Search behaviour; cite Yoast only for product capability |
| Product packaging conflict | Product page and plugin UI suggest different availability | Verify current product packaging before commercial recommendation |
| UI/path conflict | Help article path differs from current admin UI | Mark exact path as `needs live verification` |
| Configuration/output conflict | Yoast setting says noindex, rendered source still shows index | Treat rendered output as the QA target; investigate caching/theme/plugin conflict |
| Sitemap/indexation conflict | URL is noindexed but remains in sitemap | Flag high risk; validate Yoast object visibility, filters and caches |
| Canonical/schema conflict | Product canonical points elsewhere while Product schema describes current URL | Flag high risk; inspect canonical source and product data mapping |
| Schema vocabulary vs Google eligibility | Schema.org allows a property but Google rich result does not use it | Separate vocabulary validity from Google eligibility |
| WooCommerce data conflict | Product variation data differs from parent product schema | Inspect product type, variations, offers, stock and identifiers |
| Client preference vs SEO risk | Client wants thin product tags indexed | Record risk, recommend safer default, seek approval if overriding |
| Developer customisation conflict | Custom code overrides Yoast presenter/filter output | Route to developer handoff and require before/after rendered-source QA |

## Resolution order

1. Identify the exact claim or setting in conflict.
2. Classify each input as scanned evidence, verified current source, rendered output, user-provided evidence, inference, stale evidence, or unsupported.
3. Apply the source hierarchy from `SKILL.md` and `docs/evidence-policy.md`.
4. Prefer live rendered output for what the site currently emits.
5. Prefer official developer documentation for how Yoast behaviour should be changed.
6. Prefer Google Search Central for Google-specific interpretation.
7. Prefer Schema.org for vocabulary validity only, not rich-result eligibility.
8. Preserve unresolved uncertainty in the output rather than choosing a false certainty.
9. Create a decision record when the resolution affects implementation, approval, or QA.

## Output format for conflict notes

Use this compact structure unless the user requests a full report:

```text
Conflict:
Evidence A:
Evidence B:
Current confidence:
Safest interpretation:
Recommended action:
Owner:
QA check:
Decision record needed: yes/no
```

## Escalation triggers

Escalate to a developer handoff when:

- Rendered output does not match Yoast settings.
- Canonicals, robots, sitemaps or schema are altered by custom code, theme code, caching, multilingual plugins, WooCommerce extensions, or filters.
- Indexables appear stale and require reindexing or further Yoast-supported investigation.
- The fix needs an API/filter change rather than an admin setting.

Escalate to client/SEO approval when:

- The decision changes what Google can index.
- The decision suppresses a major content type, taxonomy, product type or archive.
- A client preference conflicts with a safer duplicate-content or quality recommendation.
- Product or organisation schema would make claims not supported by source data.

## Maintenance

Add recurring conflict patterns to `tests/audit-triage-scenario-tests.md` or `tests/configuration-scenario-tests.md` so future package updates retain the behaviour.
