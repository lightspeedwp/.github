# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Template-part generation is the right skill | The request is for a shared part rather than a full template |
| Path discipline | The target path is correct | Output uses `/parts/{slug}.html` |
| Naming discipline | Shared slugs are reused | Standard parts use stable conventional slugs |
| Markup quality | The part body is valid block markup | The output is plausible and reusable |
| Insertion support | Template usage is clear | Insertion markup is returned when useful |
| Boundary discipline | The skill stays scoped | Template or pattern-only work is routed appropriately |

## Minimum Acceptance Standard

- no template part outside `/parts`
- no unnecessary custom shared area
- no missing insertion markup when template use is part of the request
- no invalid wrapper tag choice for the stated part role
