---
issue_number: 659
file_type: documentation
description: "Verify issue types align with templates and labels"
parent_issue: 650
title: "[Child of [#650](https://github.com/lightspeedwp/.github/issues/650)] Audit: Issue Types Alignment with Templates & Labels"
type: "type:audit"
area: "area:labels"
priority: "priority:important"
status: completed
effort: "M"
---

## Overview

Verify that all issue types in `issue-types.yml` have matching templates and labels, and that colors are consistent.

## Scope

- Review all issue types in `.github/issue-types.yml`
- Verify each type has a matching issue template in `.github/ISSUE_TEMPLATE/`
- Verify each type has a matching label in `.github/labels.yml`
- Check if type colors match label colors
- Identify unused types or orphaned templates

## Audit Checklist

- [ ] Extract all issue types from `issue-types.yml`
- [ ] Extract all issue templates from `.github/ISSUE_TEMPLATE/`
- [ ] Extract all `type:*` labels from `labels.yml`
- [ ] Create three-way mapping: Type ↔ Template ↔ Label
- [ ] Verify color consistency between type and label
- [ ] Identify orphaned templates without a type
- [ ] Identify types without templates
- [ ] Document alignment gaps

## Deliverables

- Issue types alignment audit report
- Mapping table: Issue Type | Template | Label | Color Match | Status
- List of orphaned or missing items
- Recommendations for alignment fixes

## Related Files

- `.github/issue-types.yml`
- `.github/labels.yml`
- `.github/ISSUE_TEMPLATE/` (all templates)
- `docs/ISSUE_TYPES.md`

## Related Documentation

- [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_TYPES.md)
- [Issue Labels Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING.md)
- [Issue Templates](https://github.com/lightspeedwp/.github/blob/develop/.github/ISSUE_TEMPLATE/README.md)
