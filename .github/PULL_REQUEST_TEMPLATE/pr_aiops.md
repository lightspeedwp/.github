---
file_type: pr-template
name: "AI Operations"
about: "AI-assisted operations, automation, or agent-driven tasks"
title: "aiops: {scope}"
labels: ["type:ai-ops", "status:needs-review", "priority:normal", "area:ai", "meta:needs-changelog"]
recommended_issue_type: "type:ai-ops"
---

# AI Operations Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the AI operations issue(s) it addresses:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger AI operations initiative

Closes #

## AI Operation Summary

What AI-assisted operation or automation was executed? Include:

- Agent/automation type used
- Task or workflow executed
- Scope and scale of changes

## Operation Details

Provide details on:

- What was automated or AI-assisted
- Decision logic or reasoning applied
- Any manual interventions or approvals

## Generated Changes

List the changes made by the AI operation:

- Files created/modified/deleted
- Impact on existing functionality
- Any breaking changes

## Verification

How was the AI operation output verified?

- [ ] Output reviewed for correctness
- [ ] Generated code follows project standards
- [ ] Tests pass (if applicable)
- [ ] No unintended side effects
- [ ] Manual spot-checks completed

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Changed

- AI Operations: {description}

## Automation Governance

- [ ] Operation follows AGENTS.md rules
- [ ] AI decisions are transparent and documented
- [ ] No sensitive data generated or exposed
- [ ] Rollback plan documented (if needed)
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
