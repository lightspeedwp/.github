---
name: "Hotfix/Security PR"
about: "Urgent bug or security fix with fast rollback path"
title: "hotfix: <short summary>"
labels: ["status:needs-review", "priority:critical"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- env:staging (UAT)
- env:live (post-deploy)
-->

## Context

- Severity/Impact: <High/Medium/Low>
- Affected versions/environments: <list>

## Reproduction

- Steps: 1) … 2) … 3) …
- Expected vs Actual: <summary>

## Fix Summary

- <what changed and why>

## Verification

- [ ] Added/updated tests
- [ ] Verified on staging/live (list browsers/devices)

## Risk & Rollback

- Risk level: <Low/Medium/High>
- Rollback plan: <tag/restore/feature-flag>

---

### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

