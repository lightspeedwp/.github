---
name: "Audit"
about: "Propose, conduct, or document a security, accessibility, code, or process audit."
title: "[Audit] Classify GitHub-native files that must remain in `.github`"
labels: [status:needs-audit, priority:important, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/293"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Audit Summary

Identify the files and folders that must remain in `.github` for GitHub
community health, workflow, template, and repo maintenance behaviour.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Audit Checklist / Scope

- [ ] Classify issue, PR, and discussion templates.
- [ ] Classify saved replies, labels, funding, dependabot, and workflows.
- [ ] Classify repo-local Copilot and agent files.
- [ ] Flag any current `.github` files that are portable AI assets.
- [ ] Add results to the migration decision map.

## Findings / Risks

Risk: moving GitHub-native files out of `.github` could break organisation
defaults or workflow execution.

## Remediation Actions

- [ ] Add "keep in `.github`" decisions to the migration map.
- [ ] Create follow-up issues for files that should move.

## Acceptance Criteria

- [ ] Audit scope and checklist completed.
- [ ] Findings and risks documented.
- [ ] Remediation actions assigned and tracked.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.

## Additional Context

This issue protects GitHub inheritance behaviour during the restructure.

### Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined.
- [ ] Areas/components listed.
- [ ] Dependencies and standards mapped.

### Definition of Done (DoD)

- [ ] Audit performed and findings documented.
- [ ] Remediation actions assigned.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.
