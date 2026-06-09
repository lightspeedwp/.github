---
issue_number: 773
parent_issue: 770
file_type: documentation
title: "[Task] Finalise report artifact placement and script outputs"
description: "OpenSpec strict planning artefact"
last_updated: "2026-06-03"
status: active
---

# [Task] Finalise report artifact placement and script outputs

## template-map

- template_file: .github/ISSUE_TEMPLATE/01-task.md

## Deliverables

1. Report artefact relocation from root into .github/reports canonical folders.
2. Script output path updates to prevent root recontamination.
3. One successful run of updated scripts proving new paths are active.

## Acceptance Criteria

- [ ] audit-frontmatter-report.csv is generated into .github/reports/audits/frontmatter.
- [ ] footer-violations artifacts are stored in an archived reports namespace.
- [ ] Updated script run succeeds end-to-end with no path errors.
- [ ] Root inventory confirms these generated files do not return.
