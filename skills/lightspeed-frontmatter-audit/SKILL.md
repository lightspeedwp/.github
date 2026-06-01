---
name: "lightspeed-frontmatter-audit"
description: "Audit frontmatter, schema drift, stale links, and missing folder indexes in LightSpeed governance repositories."
---

# lightspeed-frontmatter-audit

## Inputs

- Repository root path.
- Scope paths (optional).

## Workflow

1. Run frontmatter validation (`npm run validate:frontmatter`).
2. Run structure validation (`npm run validate:structure`).
3. Run link validation (`npm run validate:links`) for active folders.
4. Report missing indexes (`README.md` or `index.md`) and stale references.
5. Summarise risks and suggested fixes.

## Output format

- Findings grouped by severity (`high`, `medium`, `low`).
- Each finding includes file path, rule breached, and fix suggestion.
