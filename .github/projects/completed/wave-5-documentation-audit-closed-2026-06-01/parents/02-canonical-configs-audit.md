---
issue_number: 650
file_type: documentation
description: "Comprehensive audit of canonical configuration files and their relationships"
title: "[Audit] Canonical Config Files (labels, issue-types, issue-fields)"
type: "type:audit"
area:
  - "area:labels"
  - "area:automation"
priority: "priority:important"
status: completed
effort: "L"
children:
  - "2.1-labels-color-consistency"
  - "2.2-issue-types-mapping"
  - "2.3-issue-fields-config"
  - "2.4-config-relationships"
last_updated: '2026-06-01'
---

## Overview

Comprehensive audit of canonical configuration files that define labels, issue types, issue fields, and how they relate to each other.

## Current Problems

1. `labels.yml` has 200+ labels but many are grey and don't follow the color strategy
2. `issue-types.yml` defines 26 issue types but mapping to templates is unclear
3. `issue-fields.yml` defines custom fields but their usage in templates is unclear
4. No clear documentation on how these files work together or how to extend them
5. Inconsistencies between canonical files and documentation

## Areas to Audit

See child issues for detailed audits of:

- Label color consistency and family grouping
- Issue type mapping and template correlation
- Issue fields configuration and GitHub API alignment
- Relationship and interdependencies between config files
- Missing or unused labels/types

## Acceptance Criteria

- [ ] All labels verified against color strategy
- [ ] Issue type definitions aligned with templates
- [ ] Issue fields configuration validated
- [ ] All interdependencies documented
- [ ] Deprecations and removals identified

## Related Files

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/issue-fields.yml`
- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_TYPES.md`
- `docs/ISSUE-FIELDS.md`

## Related Documentation

- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Issue Labels Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/LABELING.md)
- [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_TYPES.md)
- [Issue Fields Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE-FIELDS.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
- [Canonical Labels File](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
