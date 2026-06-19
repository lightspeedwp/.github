---
issue_number: 649
file_type: documentation
description: "Comprehensive audit of issue templates, automation integration, and AI agent instructions"
title: "[Audit] Issue Templates, Automation, & AI Agent Integration"
type: "type:audit"
area:
  - "area:automation"
  - "area:labels"
priority: "priority:important"
status: completed
effort: "M"
children:
  - "1.1-template-inventory"
  - "1.2-template-automation-mapping"
  - "1.3-labeler-rules-audit"
  - "1.4-ai-instructions"
last_updated: '2026-06-01'
---

## Overview

Comprehensive audit of issue templates, their relationship to the automated labeling system, and how AI agents should create issues to trigger proper automation.

## Current Problems

1. Issue templates exist (`.github/ISSUE_TEMPLATE/*.md`) but don't consistently trigger automation
2. PR templates work well, but issue templates don't map clearly to labeling rules
3. `.github/labeler.yml` has rules for PRs and branches, but minimal rules for issues
4. AI agents don't have clear instructions on how to structure issues for automation

## Areas to Audit

See child issues for detailed audits of:

- Issue template inventory and standardization
- Mapping between templates and automation triggers
- Missing automation rules in labeler.yml for issue types
- AI agent instructions for issue creation

## Acceptance Criteria

- [ ] All issue templates audited and categorized
- [ ] Clear mapping between template usage and automation triggers
- [ ] Labeler.yml rules for issues identified and documented
- [ ] AI agent instructions for issue creation updated

## Related Files

- `.github/ISSUE_TEMPLATE/` (all files)
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/labeler.yml` (issue rules section)
- `.github/issue-types.yml`
- `docs/ISSUE_CREATION_GUIDE.md`
- `.github/custom-instructions.md`

## Related Issues

- Parent Issue in Wave 5 Documentation Audit

## Related Documentation

- [Issue Creation Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_CREATION_GUIDE.md)
- [Issue Templates README](https://github.com/lightspeedwp/.github/blob/develop/.github/ISSUE_TEMPLATE/README.md)
- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
