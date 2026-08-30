---
title: Issue Triage Guide
---

# Issue Triage & Metadata Management

This guide explains how to systematically review and improve issue quality using the issue triage automation tools.

## Overview

The `.github` repository uses a structured labeling and metadata system to ensure high-quality issue tracking. Issues requiring triage are marked with `status:needs-triage` and should be processed to ensure:

- **Complete Labeling**: All issues have `type:*` and `priority:*` labels
- **Area Classification**: Issues have appropriate `area:*` labels when applicable
- **Ownership**: Issues are assigned to the responsible owner
- **Milestone Tracking**: Issues are assigned to relevant milestones
- **Linked Issues**: Related issues are properly linked

## Labels System

### Type Labels

- `type:bug` — Defect report
- `type:feature` — Feature request
- `type:task` — General task
- `type:epic` — Large initiative
- `type:documentation` — Docs improvement
- `type:code-refactor` — Refactoring work
- `type:release` — Release-related

### Priority Labels

- `priority:critical` — Blocks work
- `priority:high` — Important, soon
- `priority:important` — Important, when possible
- `priority:normal` — Standard priority
- `priority:low` — Nice-to-have

### Area Labels

- `area:ci` — CI/CD and automation
- `area:documentation` — Docs and guides
- `area:tests` — Test coverage and quality
- `area:security` — Security concerns
- `area:scripts` — Utility scripts
- `area:ops` — Operations and deployment
- `area:agents` — Agent implementations
- `area:plugins` — Plugin development

### Status Labels

- `status:needs-triage` — Awaiting initial review
- `status:needs-more-info` — Blocked on details
- `status:in-progress` — Currently being worked
- `status:blocked` — Waiting on dependency
- `status:ready` — Ready to implement

### Meta Labels

- `meta:needs-changelog` — Should be in changelog
- `meta:no-changelog` — Exclude from changelog
- `meta:breaking-change` — Breaking change notice needed

## Triage Automation Tools

### 1. Analyze Issues (`--dry-run` mode)

Review what improvements are needed without making changes:

```bash
npm run triage:analyze -- --dry-run
```

Output shows:

- Issues needing area labels
- Issues needing assignees
- Issues needing milestones

### 2. Apply Improvements

Update all identified issues:

```bash
npm run triage:apply -- --dry-run  # Review first
npm run triage:apply                # Apply changes
```

### 3. Triage Single Issue

For manual review of a specific issue:

```bash
npm run triage:analyze -- --issue 2352
npm run triage:apply -- --issue 2352
```

## Triage Workflow

### For New Issues

1. **Verify Labels**
   - Ensure `type:*` label is present
   - Ensure `priority:*` label is present
   - Add `area:*` labels if applicable
   - If tracking changelog: add `meta:needs-changelog`

2. **Assign Owner**
   - Set assignee if work is assigned
   - Default: leave unassigned if awaiting input

3. **Set Milestone**
   - Assign to relevant milestone based on priority/type
   - Use milestone grouping to track release batches

4. **Check Related Issues**
   - Link to blocking/blocked-by issues
   - Link to related work

5. **Remove Triage Label**
   - Remove `status:needs-triage` once complete
   - Add `status:ready` if it's ready for work

### For Issues Marked `status:needs-more-info`

1. **Review Description**
   - Check if clarity has improved
   - Add clarifying comments if needed

2. **Request Information**
   - Comment with specific questions
   - Tag author if details needed

3. **Resolve When**
   - Author provides additional context, OR
   - Issue can proceed without more info

### For Issues Needing Changelog

Issues with `meta:needs-changelog` should:

1. Have clear, user-facing description
2. Explain what changed and why
3. Link to related work
4. Be included in release notes

Issues with `meta:no-changelog`:

1. Are internal refactoring or infrastructure
2. Don't appear in release notes
3. Still require full metadata

## Priority Guidelines

### Critical Issues (`priority:critical`)

- Blocks production or core workflow
- Requires immediate attention
- Milestone: Critical Issues
- Expected resolution: ASAP

### High Priority (`priority:high`, `priority:important`)

- Important for upcoming release
- Affects user experience
- Milestone: High Priority
- Expected resolution: Next sprint/cycle

### Normal Priority (`priority:normal`)

- Standard work items
- Enhances existing features
- Milestone: Backlog or feature-specific
- Expected resolution: Backlog

### Low Priority (`priority:low`)

- Nice-to-have improvements
- Helps future-proofing
- Milestone: Backlog
- Expected resolution: When capacity allows

## Area Assignment Rules

### Auto-Detected Areas

Some areas are automatically suggested based on other labels:

| Condition | Suggested Area |
|-----------|---|
| `type:bug` in workflow/CI files | `area:ci` |
| `type:documentation` | `area:documentation` |
| `type:test`, `area:testing` | `area:tests` |
| `security:*` label present | `area:security` |
| Related to scripts | `area:scripts` |
| Ops/deployment work | `area:ops` |

### Manual Override

Some issues require manual judgment:

- **Ambiguous Issues**: Multiple areas apply → pick primary area
- **Cross-functional Work**: Pick the team that owns the final deliverable
- **New Feature**: Pick the area being enhanced

## Milestone Strategy

Milestones are organized by:

1. **Priority-based milestones**
   - "Critical Issues" — high priority bugs/blockers
   - "High Priority" — important features for next release

2. **Type-based milestones**
   - "Epics" — large initiatives
   - "Bug Fixes" — maintenance releases
   - "Enhancements" — new features
   - "Technical Debt" — refactoring work

3. **Release milestones**
   - "v2.0", "v1.5", etc. — versioned releases
   - "Backlog" — unscheduled work

## Validation Rules

The system enforces these metadata standards:

### Tier 1 (Blockers)

- ✅ All issues have `type:*` label
- ✅ No conflicting labels within same family
- ✅ All PRs have `status:*` label
- ✅ Issues in milestones (or unassigned)

### Tier 2 (Warnings)

- ✅ 95%+ of issues are labeled
- ✅ 90%+ have `priority:*` label
- ✅ 80%+ have `area:*` label

### Tier 3 (Info)

- Consider assignees set
- Consider all linked issues documented
- Consider descriptions complete

## Common Patterns

### Epic Issues

Template:

```markdown
## Overview
[What is this initiative about?]

## Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## Phases
- [ ] Phase 1: [Description]
- [ ] Phase 2: [Description]

## Related Issues
- #123 — Related epic
- #456 — Related task
```

Labels: `type:epic`, `priority:normal/important`, `area:*`
Milestone: Epic-specific or "Backlog"

### Bug Reports

Template:

```markdown
## Description
[What is the bug?]

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
[What should happen?]

## Actual Behavior
[What actually happens?]

## Environment
- OS: [e.g., macOS 14.1]
- Node: [version]
- npm: [version]
```

Labels: `type:bug`, `priority:*`, `area:*`
Milestone: "Bug Fixes" or "Critical Issues" (if high priority)

### Feature Requests

Template:

```markdown
## Description
[What feature should be added?]

## Use Cases
- Use case 1
- Use case 2

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Related Issues
- #123 — Related work
```

Labels: `type:feature`, `priority:*`, `area:*`, `meta:needs-changelog`
Milestone: Version-specific milestone

## Tips & Best Practices

1. **Use labels consistently** — Follow the naming conventions exactly
2. **Link everything** — Cross-reference related issues for context
3. **Write clear descriptions** — Future-you will thank you
4. **Update as work progresses** — Change status labels as work moves forward
5. **Review milestones regularly** — Ensure they reflect actual priorities
6. **Archive old milestones** — Close completed milestones to reduce clutter
7. **Assign ownership** — Clear owners reduce confusion and improve accountability

## References

- [GitHub Community Health Files](https://github.com/lightspeedwp/.github)
- [AGENTS.md](../AGENTS.md) — Full AI operations guidelines
- [Coding Standards](./instructions/coding-standards.instructions.md)
- [File Organisation](./instructions/file-organisation.instructions.md)
