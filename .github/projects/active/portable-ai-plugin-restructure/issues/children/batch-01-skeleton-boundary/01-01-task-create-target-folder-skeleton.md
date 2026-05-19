---
name: "Task"
about: "Propose a well-scoped unit of work: template tweaks, config updates, copy edits, etc."
title: "[Task] Create target top-level folder skeleton"
labels: [status:needs-triage, priority:important, area:core]
assignees: []
projects: []
milestone: ""
file_type: task
github_issue: "https://github.com/lightspeedwp/.github/issues/289"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Task Summary

Create the requested top-level folder structure without moving production
assets yet.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Acceptance Criteria

- [ ] `/.schemas` exists.
- [ ] `/agents` exists.
- [ ] `/cookbook` exists.
- [ ] `/hooks` exists.
- [ ] `/instructions` exists.
- [ ] `/plugins` exists.
- [ ] `/skills` exists.
- [ ] `/workflows` exists.
- [ ] Existing `.github` behaviour is unchanged.
- [ ] Correct branch prefix for PR: `chore/` or `task/`.

## Steps / Checklist

- [ ] Add `.gitkeep` or README/index placeholders where needed.
- [ ] Avoid moving existing files in this issue.
- [ ] Confirm `git status` only shows new skeleton files.

## Dependencies

Depends on the approved PRD and target structure.

## Additional Context

This is intentionally a tiny first implementation slice.

## Definition of Ready (DoR)

- [ ] Task described and scoped.
- [ ] Estimate added if relevant.

## Definition of Done (DoD)

- [ ] Task completed and documented.
- [ ] Changelog entry prepared for PR.
- [ ] PR uses correct branch prefix.
