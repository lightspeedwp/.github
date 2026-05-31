---
issue_number: 664
file_type: "task"
description: "Audit and consolidate labeling documentation"
parent_issue: 651
title: "[Child of #651] Audit: Labeling Docs - Consolidate Overlapping Files"
type: "type:audit"
area: "area:documentation"
priority: "priority:important"
status: "status:needs-triage"
effort: "M"
---

## Overview

Audit all documentation related to labeling to identify duplication, consolidate into a single source of truth, and eliminate redundancy.

## Scope

Review all labeling related files:

- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_LABELS.md`
- `docs/PR_LABELS.md`
- `docs/AUTOMATION_GOVERNANCE.md` (label section)
- Agent specs for labeling

## Audit Checklist

- [ ] Read through all 6 files listed above
- [ ] Identify overlapping content between files
- [ ] Document what information is in each file
- [ ] Note cross-references and links between files
- [ ] Identify the "source of truth" for each topic
- [ ] Identify gaps or missing information
- [ ] Propose consolidation strategy
- [ ] Recommend which file should be primary reference

## Deliverables

- Labeling documentation audit report
- Content matrix: File | Topic | Is Unique | Is Duplicated | Should Be Where
- List of files that could be merged
- Proposed unified structure for labeling docs

## Related Files

- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_LABELS.md`
- `docs/PR_LABELS.md`
- `docs/AUTOMATION_GOVERNANCE.md`
- `.github/agents/labeling.agent.md` (if exists)

## Related Documentation

- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Labeling Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING.md)
- [Issue Labels Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_LABELS.md)
- [PR Labels Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/PR_LABELS.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md)
