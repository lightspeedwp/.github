---
issue_number: 660
file_type: documentation
description: "Validate issue fields configuration against GitHub API"
parent_issue: 650
title: "[Child of [#650](https://github.com/lightspeedwp/.github/issues/650)] Audit: Issue Fields Configuration vs. GitHub API"
type: "type:audit"
area: "area:labels"
priority: "priority:normal"
status: active
effort: "M"
---

## Overview

Validate that `issue-fields.yml` configuration is complete, correct, and aligns with GitHub's issue fields API.

## Scope

- Review `.github/issue-fields.yml` configuration
- Verify custom fields are properly defined
- Check field mappings to GitHub API
- Verify field values match what GitHub supports
- Test field creation/update via automation

## Audit Checklist

- [ ] Extract all custom fields from `issue-fields.yml`
- [ ] Verify field naming conventions
- [ ] Check field types (single_select, date, text, etc.)
- [ ] Verify field values are valid GitHub options
- [ ] Check field descriptions are clear and complete
- [ ] Verify required field configurations
- [ ] Test field creation via API or workflow
- [ ] Identify any deprecated or unsupported fields

## Deliverables

- Issue fields validation report
- Field configuration checklist
- Any identified GitHub API misalignments
- Test results and recommendations
- Documentation updates (if needed)

## Related Files

- `.github/issue-fields.yml`
- docs/ISSUE_FIELDS.md
- docs/ISSUE_TYPES.md

## Related Documentation

- [Issue Fields Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_FIELDS.md)
- [GitHub API - Issue Fields](https://docs.github.com/en/rest/reference/issues)
- [Canonical Issue Fields](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-fields.yml)
