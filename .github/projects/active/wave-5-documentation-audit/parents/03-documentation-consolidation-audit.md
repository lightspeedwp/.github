---
issue_number: 651
file_type: documentation
description: "Comprehensive audit and consolidation of documentation to reduce duplication and improve clarity"
title: "[Audit] Documentation Consolidation - Reduce Duplication Across Docs"
type: "type:audit"
area: "area:documentation"
priority: "priority:important"
status: active
effort: "XL"
children:
  - "3.1-issue-creation-docs"
  - "3.2-pr-creation-docs"
  - "3.3-labeling-docs"
  - "3.4-file-organization-alignment"
  - "3.5-update-index"
last_updated: '2026-06-01'
---

## Overview

Audit of 40+ documentation files across `docs/` to identify duplication, overlap, and opportunities for consolidation.

## Current Problems

1. Multiple files document similar topics (e.g., 3-4 files on PR creation)
2. Files reference each other with inconsistent linking patterns
3. Some documentation is in `docs/`, some in `.github/`, some in `instructions/`
4. Duplication makes updates difficult and creates sync/consistency issues
5. Documentation index (`docs/index.md`) is incomplete or outdated

## Areas to Audit

See child issues for detailed audits of:

- Issue creation documentation (4+ files involved)
- PR creation documentation (3+ files involved)
- Labeling documentation (3+ files involved)
- Automation governance documentation (2+ files involved)
- File organization and folder structure alignment
- Documentation index and cross-referencing

## Acceptance Criteria

- [ ] All docs audited and duplication mapped
- [ ] Consolidation strategy created
- [ ] Obsolete files identified for archival
- [ ] Updated cross-reference links documented

## Related Files

- `docs/` (all .md files)
- `docs/index.md`
- `.github/README.md`
- `README.md` (root)
- Various `.instructions.md` files in `instructions/`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/PULL_REQUEST_TEMPLATE/README.md`

## Related Documentation

- [Documentation Index](https://github.com/lightspeedwp/.github/blob/develop/docs/index.md)
- [Issue Creation Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_CREATION_GUIDE.md)
- [PR Creation Process](https://github.com/lightspeedwp/.github/blob/develop/docs/PR_CREATION_PROCESS.md)
- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
- [Root README](https://github.com/lightspeedwp/.github/blob/develop/README.md)
- [.github README](https://github.com/lightspeedwp/.github/blob/develop/.github/README.md)
