# Redirect Status Model

## Redirect status labels

| Status | Use when | Action |
|---|---|---|
| Direct Match | New page is the same or very close equivalent | 301 to new URL |
| Consolidate | Multiple old pages merge into one new page | 301 all relevant old URLs to canonical new page |
| Replace | Old page has no exact match but a relevant replacement exists | 301 to closest useful page |
| Retain | URL remains live unchanged | No redirect required |
| Remove - No Redirect | Low-value content intentionally retired | Allow 404/410 only if agreed |
| Needs Decision | Destination is unclear | Escalate to content/SEO owner |
| Blocked | Redirect cannot be implemented yet | Resolve blocker before launch |

## Priority rules

| Priority | Definition | Launch rule |
|---|---|---|
| P1 Launch Critical | High traffic, lead generation, backlinks, paid campaigns, important service or brand pages | Must have approved destination before launch |
| P2 Important | Indexed or useful content with moderate business/search value | Should have destination before launch |
| P3 Low Risk | Low-value, duplicate or obsolete content | Can be retired with documented decision |
| Review | Not enough evidence | Needs owner decision |

## Risk flags

Flag URLs where:

- the old page has no destination
- the new page is not published
- the destination is too broad
- old page had traffic/conversions
- URL has external backlinks
- page was linked from campaigns or newsletters
- redirect creates a chain or loop
- slash/case/query handling is unclear
