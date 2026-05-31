---
title: Mermaid Diagram Accessibility Compliance Report — Issue #669
description: Accessibility compliance audit of all 24 Mermaid diagrams for accTitle and accDescr attributes
version: 1.0.0
created_date: "2026-05-31"
last_updated: "2026-05-31"
file_type: documentation
maintainer: Claude Code
owners:
  - Claude Code
license: GPL-3.0
tags:
  - audit
  - mermaid
  - accessibility
  - a11y
  - diagrams
  - wave-5
domain: documentation
status: active
stability: stable
---

# Mermaid Diagram Accessibility Compliance Report

**Generated**: 2026-05-31T17:49:28.120Z

## Summary

- **Total diagrams**: 24
- **Accessible diagrams**: 17
- **Non-compliant diagrams**: 7
- **Compliance rate**: 70.8%

## Files Analyzed

- README.md
- profile/README.md
- scripts/README.md
- tests/README.md
- .github/README.md
- .github/ISSUE_TEMPLATE/README.md
- .github/projects/README.md
- .vscode/README.md

## Compliance Criteria

All diagrams must include:

- ✅ **accTitle attribute** — Brief accessible title for screen readers
- ✅ **accDescr attribute** — Detailed accessible description of diagram content

Supported formats:

- Single-line: `accTitle Title text` or `accDescr: "Description text"`
- Block format: `accDescr { ... }`

## Detailed Results

⚠️ 7 diagram(s) missing accessibility attributes:

### .github/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .github/README.md — Diagram #2 (sequenceDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .github/README.md — Diagram #3 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .github/README.md — Diagram #4 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .github/ISSUE_TEMPLATE/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .github/projects/README.md — Diagram #1 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .vscode/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

## Recommendations

⚠️ Recommended actions:

1. Add missing `accTitle` attributes to identify each diagram
2. Add comprehensive `accDescr` blocks describing diagram purpose and key relationships
3. Test with screen readers to verify readability
4. Re-run validation after fixes
5. Consult [Mermaid Accessibility Docs](https://mermaid.js.org/syntax/diagram-type-mermaid.html#diagram-types)

---

**Audit Conducted By**: Claude Code
**Date**: 2026-05-31
**Related Issues**: #667, #668, #669, #670
