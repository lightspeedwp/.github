# Output Templates

Use these templates when the user wants a reusable deliverable rather than a conversational summary.

## Source Map Template

```markdown
# DESIGN.md Source Map

| Area | Token or rule | DESIGN.md location | Source | Confidence | Notes |
|---|---|---|---|---|---|
| Colors |  |  |  | confirmed / mixed / inferred |  |
| Typography |  |  |  | confirmed / mixed / inferred |  |
| Spacing |  |  |  | confirmed / mixed / inferred |  |
| Components |  |  |  | confirmed / mixed / inferred |  |
```

## Validation Report Template

```markdown
# DESIGN.md Validation Report

## Summary
- Scope:
- Files checked:
- Evidence used:
- Validation run date:

## Automated checks
| Check | Result | Notes |
|---|---|---|
| `@google/design.md lint` | pass / fail / not run |  |
| `@google/design.md diff` | pass / fail / not run |  |
| `@google/design.md export` | pass / fail / not run |  |

## Manual checks
| Area | Result | Notes |
|---|---|---|
| Source traceability | pass / risk / fail |  |
| Accessibility and contrast | pass / risk / fail |  |
| WordPress mapping clarity | pass / risk / fail |  |
| Inferred value labelling | pass / risk / fail |  |
| Custom section preservation | pass / risk / fail |  |

## Risks and follow-up
-
```

## Follow-up Issue Template

```markdown
# [Issue title]

## Context
[Why this gap matters]

## Evidence
- [Figma, GitHub, brand guide or screenshot source]

## Required work
- [Concrete task]
- [Concrete task]

## Acceptance criteria
- [ ] `DESIGN.md` and implementation evidence agree
- [ ] Missing tokens or mappings are documented
- [ ] Accessibility or contrast issue is resolved or formally accepted
```

## Minimal DESIGN.md Skeleton

```markdown
---
version: alpha
name: Project Name
description: Short description of the design system
colors: {}
typography: {}
rounded: {}
spacing: {}
components: {}
---

## Overview

## Colors

## Typography

## Layout

## Elevation & Depth

## Shapes

## Components

## Do's and Don'ts
```
