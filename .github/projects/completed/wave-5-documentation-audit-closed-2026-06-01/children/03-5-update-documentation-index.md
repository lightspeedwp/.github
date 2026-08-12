---
issue_number: 666
file_type: documentation
description: "Update docs/README.md and docs/index.md to reflect consolidation changes and remove broken references"
parent_issue: 651
title: "[Child of [#651](https://github.com/lightspeedwp/.github/issues/651)] Update: Documentation Index & Broken References"
type: "type:docs"
area: "area:documentation"
priority: "priority:normal"
status: completed
effort: "S"
---

## Overview

Update documentation index files (`docs/README.md` and `docs/index.md`) to reflect consolidation changes from Wave 5 audits, fix broken references to consolidated/deprecated files, and remove duplicate footer lines.

## Scope

- Fix broken references to consolidated files (ISSUE_LABELS.md → LABELING.md, PR_LABELS.md, LABEL_STRATEGY.md, AUTOMATION_GOVERNANCE.md → AUTOMATION.md, WORKFLOWS.md)
- Remove duplicate footer in docs/README.md (3 identical lines at end)
- Populate docs/index.md with actual index content (currently just forwards to README)
- Update last_updated dates
- Verify all links point to existing files
- Ensure consistency with consolidation recommendations from [#662](https://github.com/lightspeedwp/.github/issues/662), [#663](https://github.com/lightspeedwp/.github/issues/663), [#664](https://github.com/lightspeedwp/.github/issues/664)

## Audit Findings Summary

### From Issue [#662](https://github.com/lightspeedwp/.github/issues/662) (Issue Creation Docs)

- `docs/LABELING.md` was consolidated into `docs/LABELING.md#issue-labelling`
- References should point to `docs/LABELING.md#issue-labelling` not ISSUE_LABELS.md

### From Issue [#663](https://github.com/lightspeedwp/.github/issues/663) (PR Creation Docs)

- `docs/LABELING.md` doesn't exist (needs investigation)
- `docs/LABELING.md` reference should redirect to LABELING.md
- `docs/AUTOMATION.md` doesn't exist (file is actually `docs/AUTOMATION.md`)

### From Issue [#664](https://github.com/lightspeedwp/.github/issues/664) (Labeling Docs)

- LABELING.md is canonical reference for all label documentation
- PR and issue labeling sections exist within LABELING.md

### Issues to Fix in docs/README.md

- Line 31: Reference to `AUTOMATION_GOVERNANCE.md` → should be `AUTOMATION.md`
- Line 66: Reference to `ISSUE_LABELS.md` → should be `LABELING.md#issue-labelling`
- Line 67: Reference to `PR_LABELS.md` → needs decision (consolidate into LABELING.md or create file)
- Line 68: Reference to `LABEL_STRATEGY.md` → doesn't exist; consolidate into LABELING.md
- Line 57: Reference to `WORKFLOWS.md` → verify if file exists
- Line 115: References to ISSUE_LABELS.md, PR_LABELS.md in role table → update
- Lines 172-174: Duplicate footer signature (repeats 3 times identically)

## Deliverables

- Updated `docs/README.md`:
  - Fix all broken file references
  - Remove duplicate footer lines
  - Update last_updated date to 2026-05-31
  - Add notes about consolidated files where applicable

- Updated `docs/index.md`:
  - Add actual index content instead of just frontmatter
  - Link to docs/README.md
  - Provide quick navigation

## Related Issues

- [#662](https://github.com/lightspeedwp/.github/issues/662) (Issue Creation Docs Consolidation) — identified ISSUE_LABELS.md consolidation
- [#663](https://github.com/lightspeedwp/.github/issues/663) (PR Creation Docs Consolidation) — identified missing PR_LABELS.md, AUTOMATION_GOVERNANCE.md reference
- [#664](https://github.com/lightspeedwp/.github/issues/664) (Labeling Docs Consolidation) — documented LABELING.md as canonical reference
- [#665](https://github.com/lightspeedwp/.github/issues/665) (File Organization Alignment) — verified file structure

## Acceptance Criteria

- [ ] All broken references in docs/README.md fixed or explained
- [ ] Links verified to point to existing files
- [ ] Duplicate footer removed
- [ ] docs/index.md updated with actual content
- [ ] Last updated dates refreshed
- [ ] No references to non-existent files remain
- [ ] Consistency check: all references match consolidation recommendations

## Notes

- This is the final Wave 5 documentation consolidation task
- Follow-up cleanup tasks (moving root .md files, etc.) can be added to a Wave 5.4 issue
- Consider creating a breaking changes or migration guide if users are bookmarking specific file links
