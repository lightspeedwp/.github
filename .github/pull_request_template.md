---
name: "Default PR"
about: "General change; use for features, improvements, refactors when no specific template fits"
title: "change: <short summary>"
labels: ["status:needs-review"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- area:* or comp:*
- env:* (for UAT/production)
- compat:* (if versions matter)
-->

## Summary
**Linked issues**: Closes #<id> (and/or) Relates to #<id>

## Changes
- <bullet list of notable changes>

## Screenshots / UI (if applicable)
<add images or remove section>

## Test Notes
- [ ] Steps to verify (browsers/devices):
- [ ] Edge cases covered:

## Risk & Rollback
- Risk level: Low / Medium / High
- Rollback plan: <how to revert / flags / migrations>

---
### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

