---
name: "Audit"
about: "Propose, conduct, or document a security, accessibility, code, or process audit."
title: "[Audit] Inventory AI assets and create the migration decision map"
labels: [status:needs-audit, priority:important, type:ai-ops, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/286"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Audit Summary

Audit every current AI and automation asset before files move. Produce the
canonical migration decision map for agents, instructions, prompts, schemas,
workflows, templates, saved replies, and scripts.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Audit Checklist / Scope

- [ ] Inventory `.github/agents`, `.github/instructions`, `.github/prompts`, `.github/schemas`, `.github/workflows`, `.github/ISSUE_TEMPLATE`, `.github/SAVED_REPLIES`, `scripts/agents`, and `scripts/validation`.
- [ ] Record decision for each item: keep, move, convert, archive, delete, or defer.
- [ ] Capture target path for every moved or converted asset.
- [ ] Flag assets with hard-coded `.github/*` paths.
- [ ] Store the table in the active project folder.

## Findings / Risks

Known risks include stale paths, mixed repo/project AI guidance, and prompts
that may need conversion into skills or cookbook recipes.

## Remediation Actions

- [ ] Link all follow-up child issues to rows in the migration map.
- [ ] Do not delete old paths until the map and link audit are complete.

## Acceptance Criteria

- [ ] Audit scope and checklist completed.
- [ ] Findings and risks documented.
- [ ] Remediation actions assigned and tracked.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.

## Additional Context

Reference PRD section: "Phase 0: Freeze, Baseline, And Inventory".

### Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined.
- [ ] Areas/components listed.
- [ ] Dependencies and standards mapped.

### Definition of Done (DoD)

- [ ] Audit performed and findings documented.
- [ ] Remediation actions assigned.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.
