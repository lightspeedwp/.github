## Overview

Comprehensive audit of README files across the repository for Mermaid syntax validity, accessibility compliance, and documentation freshness.

## In-Scope

- Discover all README files using reproducible commands
- Validate Mermaid syntax and render behaviour
- Assess Mermaid accessibility (`accTitle`, `accDescr`, contrast, readability)
- Identify stale README content and broken links

## Out-of-Scope

- Non-README docs unless directly referenced by README fixes
- Large-scale content redesign not required for accuracy/a11y

## Current Problems

1. Mermaid diagrams may contain syntax/rendering errors.
2. Accessibility metadata may be missing.
3. Content freshness is inconsistent.
4. Diagram behaviour in light/dark themes may be uneven.

## Acceptance Criteria

- [ ] Full README inventory produced from reproducible discovery
- [ ] Mermaid syntax validation completed for all in-scope diagrams
- [ ] Accessibility gaps identified with concrete fixes
- [ ] Content freshness and link-health findings documented

## Deliverables

- README inventory report
- Mermaid validation report
- Accessibility audit report
- Remediation issue set (if required)

## Related Files

- `**/README.md` (repository-wide)
- `docs/`
- `instructions/mermaid.instructions.md`
- `instructions/a11y.instructions.md`
