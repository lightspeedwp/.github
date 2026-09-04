---
file_type: pr-template
name: "Task"
about: "Complete a well-scoped unit of work"
title: "chore: {scope}"
labels: ["type:task", "status:needs-review"]
---

# Task Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the issue(s) it addresses. Use keywords to auto-close issues when merged:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Fixes #123` — alternative to "Closes"
- `Resolves #123` — alternative to "Closes"
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger initiative

Closes #

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the skip-changelog label.
-->

### Changed

- Task completed: {description}

## Summary

Brief description of the work completed. What was changed and why?

## Test plan

How was this tested?

- [ ] Manual testing completed
- [ ] Related tests updated or added
- [ ] No test changes needed (explain below)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are well-documented
- [ ] All tests pass
- [ ] No breaking changes introduced
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
