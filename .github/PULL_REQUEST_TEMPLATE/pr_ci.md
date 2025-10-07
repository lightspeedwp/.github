---
name: "Build/CI PR"
about: "Pipelines, linting, packaging, or release automation"
title: "build(ci): <short summary>"
labels: ["status:needs-review", "area:ci"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- compat:wordpress (if build targets)
-->

## Build/CI change
- What: <summarise>
- Why: <reliability/speed/consistency>

## Baseline & Target
- Before: <times/flakes>
- After: <times/flakes>

## Rollback
- Plan: <how to revert>

## Notes
- Secrets/permissions considerations: <details>

---
### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

