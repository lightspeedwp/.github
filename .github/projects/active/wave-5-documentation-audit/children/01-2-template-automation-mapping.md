---
issue_number: 655
file_type: documentation
description: "Map issue templates to their automation triggers"
parent_issue: 649
title: "[Child of [#649](https://github.com/lightspeedwp/.github/issues/649)] Audit: Issue Template → Automation Trigger Mapping"
type: "type:audit"
area: "area:automation"
priority: "priority:normal"
status: active
effort: "M"
---

## Overview

Map each issue template to the automation it should trigger and identify gaps between expected vs. actual automation.

## Scope

- For each issue template, document what automation should trigger
- Check if issue templates set up frontmatter that triggers labeling
- Compare with PR templates to understand the gap
- Identify missing automation rules in `labeler.yml` for issue scenarios
- Document how AI agents should structure issues for proper automation

## Audit Checklist

- [ ] Create automation expectation list for each template
- [ ] Test each template and document what automation actually triggers
- [ ] Compare PR template automation vs. issue template automation
- [ ] Identify which `labeler.yml` rules apply to issues
- [ ] Document automation gaps (expected but missing)
- [ ] Identify heuristics used for issue labeling

## Deliverables

- Mapping document: Template → Expected Automation → Current Status → Missing Pieces
- Gap analysis report
- Recommendations for closing automation gaps

## Related Files

- `.github/ISSUE_TEMPLATE/` (all templates)
- `.github/PULL_REQUEST_TEMPLATE/` (for comparison)
- `.github/labeler.yml` (automation rules)
- `.github/issue-types.yml` (issue type definitions)

## Related Documentation

- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
- [Labeling Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING.md)
