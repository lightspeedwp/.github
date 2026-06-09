---
issue_number: 661
file_type: documentation
description: "Document relationships between canonical config files"
parent_issue: 650
title: "[Child of [#650](https://github.com/lightspeedwp/.github/issues/650)] Document: Canonical Config File Interdependencies"
type: "type:task"
area: "area:labels"
priority: "priority:important"
status: active
effort: "L"
---

## Overview

Create comprehensive documentation of how canonical config files (labels.yml, issue-types.yml, labeler.yml, issue-fields.yml) relate to each other and how automation uses them.

## Scope

- Create diagram showing how all config files interact
- Document the flow: issue creation → template selection → type assignment → label application → field population
- Identify all dependencies and relationships
- Document which tools/agents use which configs
- Create reference guide for extending configs

## Checklist

- [ ] Create Mermaid diagram showing config relationships
- [ ] Document data flow from issue creation to automation completion
- [ ] Document all tool/agent dependencies
- [ ] Create reference guide for adding new labels/types/fields
- [ ] Document config format and validation rules
- [ ] Create troubleshooting guide for config issues
- [ ] Document how configs are synced across repos

## Deliverables

- Relationship diagram (Mermaid, accessible for light/dark mode)
- Config interdependencies documentation
- Data flow diagram (issue creation → automation)
- Reference guide for extending configs
- New file: `docs/CANONICAL_CONFIGS_GUIDE.md`

## Related Files

- `.github/labels.yml`
- `.github/issue-types.yml`
- `.github/labeler.yml`
- `.github/issue-fields.yml`
- `docs/LABEL_STRATEGY.md`
- `scripts/agents/includes/` (labeling agent code)

## Related Documentation

- [Label Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/LABEL_STRATEGY.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md)
- [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/ISSUE_TYPES.md)
