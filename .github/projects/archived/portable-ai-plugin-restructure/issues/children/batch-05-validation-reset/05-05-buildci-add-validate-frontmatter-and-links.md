---
name: "Build & CI"
about: "Propose changes, fixes, or improvements to build tools, CI/CD pipelines, or automation."
title: "[Build/CI] Add read-only frontmatter and local link validators"
labels: [status:needs-triage, priority:important, area:ci, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/315"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Build/CI Summary

Add read-only validation for frontmatter and local links across active source
folders after migration.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps / Checklist

- [ ] Define active source folders to validate.
- [ ] Validate frontmatter against simplified active schemas.
- [ ] Validate local Markdown links.
- [ ] Warn, not fail, on archived legacy folders during migration.
- [ ] Add `npm run validate:frontmatter`.
- [ ] Add `npm run validate:links`.
- [ ] PR uses correct branch prefix `ci/` or `build/`.

## Acceptance Criteria

- [ ] Active source frontmatter validation is read-only.
- [ ] Broken active local links fail validation.
- [ ] Archived legacy paths are handled intentionally.
- [ ] Documentation/changelog updated.

## Additional Context

This issue supports safe deletion of old paths later.

## References

- Active PRD FR-305 and FR-306.

## Definition of Ready (DoR)

- [ ] Build/CI goal and scope defined.
- [ ] Checklist prepared.
- [ ] Estimate added.

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed.
- [ ] Documentation/changelog updated.
- [ ] Approved by maintainer.
