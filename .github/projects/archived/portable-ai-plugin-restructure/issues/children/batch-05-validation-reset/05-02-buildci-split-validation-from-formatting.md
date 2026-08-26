---
name: "Build & CI"
about: "Propose changes, fixes, or improvements to build tools, CI/CD pipelines, or automation."
title: "[Build/CI] Split validation commands from mutating format and fix commands"
labels: [status:needs-triage, priority:important, area:ci]
github_issue: "https://github.com/lightspeedwp/.github/issues/312"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Build/CI Summary

Ensure every `validate:*` command is read-only and move mutating behaviour to
explicit `format:*` or `fix:*` commands.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps / Checklist

- [ ] Audit existing validation commands for file writes.
- [ ] Add or update read-only validation scripts.
- [ ] Add explicit write-capable formatter/fixer scripts.
- [ ] Update package scripts and documentation.
- [ ] PR uses correct branch prefix `ci/` or `build/`.
- [ ] Approved by at least one maintainer.

## Acceptance Criteria

- [ ] `validate:*` commands do not modify files.
- [ ] Write-capable commands are named `format:*` or `fix:*`.
- [ ] CI uses read-only validation commands.
- [ ] Documentation explains the distinction.

## Additional Context

The PRD calls out `validate:json:schemas` as currently mutating and failing.

## References

- Active PRD section 16.2, Required New Commands.

## Definition of Ready (DoR)

- [ ] Build/CI goal and scope defined.
- [ ] Checklist prepared.
- [ ] Estimate added.

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed.
- [ ] Documentation/changelog updated.
- [ ] Approved by maintainer.
