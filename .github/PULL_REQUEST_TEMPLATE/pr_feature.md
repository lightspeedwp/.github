---
name: "Feature PR"
about: "Add new user-facing capability; linked to Story/Epic with AC"
title: "feat: <short summary>"
labels: ["status:needs-review"]
---
<!-- Note: YAML front matter is parsed by our labeler workflow; GitHub itself does not apply labels from front matter. -->

<!-- Suggested additional labels (pick as relevant):
- comp:* and/or area:*
- compat:* (versions)
- env:staging (for UAT)
-->

## Summary

**Linked issues**: Closes #<id> (and/or) Relates to #<id>

## User Story / Acceptance Criteria

- Story: <link>
- AC: <bullets>

## Solution Overview

- <points>

## Screenshots / UI (if applicable)

<add images or remove section>

## Accessibility (a11y) Notes

- Keyboard/focus:
- Screen reader:
- Contrast/zoom/RTL:

## Observability

- Metrics/logs/traces added or updated:
- Alerts/dashboards impacted:

## Feature Flags / Migrations

- Flagged? <Yes/No> — name:
- Data or schema changes:
- Rollout plan (staged? percentage?):

## Test Plan

- [ ] Unit tests for new logic
- [ ] E2E/regression steps listed
- [ ] Cross-browser/devices (list)

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan: <how to revert / disable flag / migration rollback>

---

### Checklist (Global DoD / PR)
- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

