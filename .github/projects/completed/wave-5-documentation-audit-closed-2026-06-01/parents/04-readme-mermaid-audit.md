---
issue_number: 652
file_type: documentation
description: "Comprehensive audit of README files, Mermaid diagrams, and accessibility compliance"
title: "[Audit] 44 README Files - Mermaid Diagrams & Accessibility Review"
type: "type:audit"
area:
  - "area:documentation"
  - "area:a11y"
priority: "priority:normal"
status: completed
effort: "XL"
children:
  - "4.1-discover-audit-readmes"
  - "4.2-validate-mermaid-syntax"
  - "4.3-accessibility-compliance"
  - "4.4-update-readmes"
last_updated: '2026-06-01'
---

## Overview

Comprehensive audit of README.md files across the repository (~30–40) to verify Mermaid diagram syntax, accessibility compliance, and content freshness.

## Current Problems

1. Mermaid diagrams may have syntax errors or be outdated
2. Diagrams may lack accessibility attributes (accTitle, accDescr)
3. Diagrams may not work in light/dark mode
4. README content may be outdated or incomplete
5. No systematic way to verify diagram accessibility compliance

## Areas to Audit

See child issues for detailed audits of:

- Root & core README files
- Feature folder README files
- Sub-folder README files
- Test/config README files
- Mermaid diagram syntax validation
- Accessibility compliance (WCAG AA)
- Light/dark mode rendering

## Acceptance Criteria

- [ ] All README files inventoried (actual count per audit report)
- [ ] Mermaid diagram syntax validated
- [ ] Accessibility attributes added where needed
- [ ] Content freshness verified and updated
- [ ] Audit report generated

## Related Files

All README.md files across the repository (see audit report for inventory)

## Related Issues

- [#512 — Wave 3A: README & Mermaid Diagram Discovery & Audit](https://github.com/lightspeedwp/.github/issues/512)
- [#513 — Wave 3B: README & Mermaid Diagram Repair & Update](https://github.com/lightspeedwp/.github/issues/513)

## Related Documentation

- [Documentation Index](https://github.com/lightspeedwp/.github/blob/develop/docs/index.md)
- [Accessibility Instructions](https://github.com/lightspeedwp/.github/blob/develop/instructions/a11y.instructions.md)
- [Documentation Formats Guide](https://github.com/lightspeedwp/.github/blob/develop/instructions/documentation-formats.instructions.md)
