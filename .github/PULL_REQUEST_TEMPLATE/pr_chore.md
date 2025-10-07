---
name: "Chore PR"
about: "Repo hygiene: configs, scripts, formatting — no behaviour change"
title: "chore: <scope>"
labels: ["status:needs-review"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- area:dependencies or area:ci (if relevant)
-->

## Summary

**Linked issues**: Closes #<id> (and/or) Relates to #<id>

## Changes

- <list>

## Impact / Compatibility

- Runtime/behaviour changes: <None expected>
- Build/dev-experience impact: <notes>

## Verification

- [ ] CI passes
- [ ] Local build and smoke tests
- [ ] Docs updated if developer-facing

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan: <revert commit>

---

### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

