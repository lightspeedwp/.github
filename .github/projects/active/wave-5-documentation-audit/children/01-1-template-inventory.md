---
issue_number: 654
file_type: documentation
description: "Inventory and audit of issue templates for standardization"
parent_issue: 649
title: "[Child of [#649](https://github.com/lightspeedwp/.github/issues/649)] Audit: Issue Template Inventory & Standardization"
type: "type:audit"
area: "area:documentation"
priority: "priority:normal"
status: active
effort: "S"
---

## Overview

Inventory and audit of all issue templates in `.github/ISSUE_TEMPLATE/` to verify standardization, completeness, and consistency.

## Scope

- Inventory all `.md` files in `.github/ISSUE_TEMPLATE/`
- Check if each template has required frontmatter
- Verify each template's relationship to an issue type in `issue-types.yml`
- Document which templates are actively used vs. deprecated
- Check `config.yml` for completeness

## Audit Checklist

- [ ] Create inventory spreadsheet with all templates
- [ ] Verify frontmatter structure in each template
- [ ] Cross-reference each template with `issue-types.yml`
- [ ] Document usage status for each template
- [ ] Check `.github/ISSUE_TEMPLATE/config.yml` for accuracy
- [ ] Identify deprecated or unused templates

## Deliverables

- Audit report as issue comment
- Spreadsheet: Template Name | Issue Type | Frontmatter Status | Usage Status | Last Updated | Notes
- List of standardization recommendations

## Related Files

- `.github/ISSUE_TEMPLATE/` (all `.md` files)
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/issue-types.yml`

## Related Documentation

- [Issue Templates Directory](https://github.com/lightspeedwp/.github/blob/develop/.github/ISSUE_TEMPLATE/README.md)
- [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_TYPES.md)
- [Issue Creation Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_CREATION_GUIDE.md)
