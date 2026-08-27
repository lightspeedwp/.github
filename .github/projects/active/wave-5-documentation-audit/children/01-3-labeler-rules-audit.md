---
issue_number: 656
file_type: documentation
description: "Audit labeling rules for issue-specific automation"
parent_issue: 649
title: "[Child of [#649](https://github.com/lightspeedwp/.github/issues/649)] Audit: Issue Labeling Rules in labeler.yml"
type: "type:audit"
area: "area:labels"
priority: "priority:normal"
status: active
effort: "M"
---

## Overview

Comprehensive audit of labeling rules in `.github/labeler.yml` to identify issue-specific rules, gaps, and opportunities for improvement.

## Scope

- Review `.github/labeler.yml` for issue-specific rules
- Compare coverage between PR rules and issue rules
- Identify gaps (e.g., file path-based rules for issues)
- Document current issue detection heuristics
- Check if content/title-based rules exist for issues

## Audit Checklist

- [ ] Extract all issue-specific rules from `labeler.yml`
- [ ] Extract all PR-specific rules from `labeler.yml`
- [ ] Compare coverage between issue and PR rules
- [ ] Identify types of rules present (branch-based, file-based, content-based)
- [ ] Determine what heuristics are used for issues vs. PRs
- [ ] Document gaps and opportunities

## Deliverables

- Current issue rules inventory
- PR vs. issue rule comparison matrix
- Report of identified gaps
- Recommendations for adding issue rules

## Related Files

- `.github/labeler.yml`
- `.github/labels.yml` (canonical label definitions)
- `.github/issue-types.yml` (issue type mapping)
- `scripts/agents/includes/` (labeling agent code)

## Related Documentation

- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Labeler Configuration](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
