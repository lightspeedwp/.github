# .github/PR_LABELS.md

## Purpose
Provide high‑signal, automated **PR labels** for review routing, release hygiene, and search, aligned with BugHerd families.

## How labels are applied
1) **Paths → labels** via `.github/labeler.yml` (map to `area:*`, `comp:*`, `block:*`, `template:*`, `woo:*`, `to:*`, etc.).  
2) **Branch prefixes → status** on PR open: `feat/`, `fix/`, `docs/`, `chore/`, `build/` → add `status:needs-review`.

### Optional branch→type mapping (for Projects)
When the Project **Type** field is present, workflows may map PR branches to **Type**: `feat/`→`Feature`, `fix/`→`Bug`, `docs/`→`Documentation`, `chore/|build/`→`Task`.

## Changelog hygiene
- On PR open, if no changelog marker exists, add `meta:needs-changelog`.  
- Remove after updating changelog/README (or apply `meta:no-changelog` if internal‑only).

## Status rules (PRs)
- Keep **exactly one** `status:*`. Workflow adds `status:needs-review` if none; fails if multiple are present.
