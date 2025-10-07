---
name: "Release PR"
about: "Prepare and ship a release (semver, notes, deploy, rollback)"
title: "release: vX.Y.Z"
labels: ["status:needs-review", "area:deployment", "env:staging"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- env:live (after deploy)
-->

## Release

- Version: v<X.Y.Z>
- Target date: <YYYY-MM-DD>
- Environments: staging → live

## Scope

- Changes included (changelog bullets):
  - <pkg>@<ver> — <note>
  - …
- Migrations/flags: <details or N/A>

## Verification plan

- [ ] Smoke tests on staging passed
- [ ] Critical paths verified (list)
- [ ] Docs/Readme/Changelog updated

## Rollout & Rollback

- Rollout steps: <deploy action / action run / wp.org release>
- Rollback plan: <how to revert / tags / DB backup>

---

### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

