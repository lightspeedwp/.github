---
name: "Task"
about: "Propose a well-scoped unit of work: template tweaks, config updates, copy edits, etc."
title: "[Task] Create milestone, label, and parent-child issue linking plan"
labels: [status:needs-triage, priority:normal, area:core]
assignees: []
projects: []
milestone: ""
file_type: task
github_issue: "https://github.com/lightspeedwp/.github/issues/288"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Task Summary

Define how the restructure issues will be posted, labelled, linked, and batched
in GitHub before creating the full issue set.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Acceptance Criteria

- [ ] Milestone name and scope are defined.
- [ ] Parent epic issue order is documented.
- [ ] Child issue posting order is documented.
- [ ] Required labels are listed.
- [ ] Parent issue numbers are added back to local child drafts after posting.
- [ ] Correct branch prefix for PR: `chore/` or `task/`.

## Steps / Checklist

- [ ] Choose milestone name, likely `Portable AI Plugin Restructure`.
- [ ] Create four parent epics first.
- [ ] Create child issues batch by batch.
- [ ] Add child issue links to parent epics.
- [ ] Update local issue drafts with GitHub issue numbers.

## Dependencies

Depends on the local issue draft pack in this active project folder.

## Additional Context

This prevents losing track of issue relationships once drafts are posted to
GitHub.

## Definition of Ready (DoR)

- [ ] Task described and scoped.
- [ ] Estimate added if relevant.

## Definition of Done (DoD)

- [ ] Task completed and documented.
- [ ] Changelog entry prepared for PR.
- [ ] PR uses correct branch prefix.
