---
name: "🚀 Release"
about: "Template for Release issues"
title: "release: {scope} - {short description}"
labels: ["type:release", "status:planning", "priority:critical", "area:core", "meta:needs-changelog"]
recommended_branch: "release/"
file_type: issue-template
---

## Release Summary

<!-- Briefly describe the release, deployment, or versioning event. -->

## Milestones / Checklist

<!-- List key steps, milestones, or tasks for this release. -->

- [ ] Release goal described
- [ ] Versions/tags mapped
- [ ] Docs/changelog prepared
- [ ] Release notes drafted
- [ ] QA/staging verified

## Acceptance Criteria

<!-- List requirements for completion. Use checkboxes. -->

- [ ] Release completed and verified
- [ ] Documentation/changelog updated
- [ ] Release notes published
- [ ] Branch created as per release process with correct naming convention and prefix (release/)
- [ ] At least one maintainer approved
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Additional Context

<!-- Add any extra info, links, screenshots, or references. -->

---

## Definition of Ready (DoR)

- [ ] Release goal and scope defined
- [ ] Milestones and checklist mapped
- [ ] Estimate added
- [ ] Realease process `docs/RELEASE_PROCESS.md` reviewed and completed

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed
- [ ] Documentation/changelog updated
- [ ] Approved by maintainer
- [ ] Milestone closed and release notes prepared
- [ ] Branch merged as per release process
- [ ] PR uses correct branch prefix (release/)
- [ ] PR uses the correct PR template based on `type:release` PR label or linked issue type or linked issue `type:release` label
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
