---
name: "Bugfix PR"
about: "Fix a defect/regression with clear repro, fix, and verification"
title: "fix: <short summary>"
labels: ["status:needs-review"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- priority:* (set by impact)
- env:staging (for QA)
-->

## Context
- Severity/Impact: <High/Medium/Low>
- Affected versions/environments: <list>

## Reproduction
- Steps: 1) … 2) … 3) …
- Expected vs Actual: <summary>

## Root Cause
- <brief analysis and evidence (logs/links)>

## Fix Summary
- <what changed and why>

## Verification
- [ ] Tests added/updated to cover the bug
- [ ] Manual verification steps (browsers/devices)
- [ ] Negative/edge cases checked

## Risk & Rollback
- Risk level: Low / Medium / High
- Rollback plan: <revert / feature-flag / config>

---
### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

