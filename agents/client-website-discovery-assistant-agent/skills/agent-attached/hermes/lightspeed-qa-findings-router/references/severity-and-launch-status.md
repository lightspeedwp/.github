# Severity and Launch Status

Use severity to describe impact. Use launch status to describe release decision.

## Severity

| Severity | Definition | Examples |
|---|---|---|
| Critical | Blocks launch or creates serious legal, privacy, security, accessibility, revenue or conversion risk. | Broken checkout/contact form, exposed private data, inaccessible main navigation, production-breaking fatal error. |
| High | Major user journey, search, accessibility, design-system or tracking issue with clear launch impact. | Mobile navigation broken, key template layout failure, missing redirects for priority pages, lead forms not tracked. |
| Medium | Noticeable issue with workaround, limited scope or moderate user impact. | Inconsistent spacing, missing alt text on a non-critical image, one secondary template has a layout issue. |
| Low | Minor polish, editorial or isolated issue. | Typo, small alignment issue, non-critical copy inconsistency. |
| Improvement | Useful enhancement but not required for launch. | Future optimisation, CRO idea, editorial enhancement, dashboard refinement. |

## Launch status

| Status | Meaning | Action |
|---|---|---|
| Launch Blocker | Must be fixed before launch. | Escalate, assign owner, retest before go/no-go. |
| Must Fix Before Launch | Should be fixed before launch unless leadership explicitly accepts risk. | Schedule before launch or document accepted risk. |
| Can Launch With Follow-up | Safe to launch if owner/date are assigned. | Track as follow-up issue. |
| Post-launch Improvement | Backlog or optimisation item. | Route to post-launch or improvement backlog. |
| Needs Reproduction | Cannot route as a fix until confirmed. | Create reproduction task with missing evidence listed. |
| Duplicate | Already tracked by another finding or issue. | Link to canonical item and close/merge duplicate. |
| Out of Scope | Valid request but outside current approval, release or estimate. | Route to change request or backlog. |

## Launch blocker test

Treat a finding as a launch blocker only when at least one of these is true:

- It prevents a critical user journey from working.
- It creates legal, privacy, security or severe accessibility exposure.
- It breaks a committed launch requirement or approval gate.
- It risks material revenue, lead capture, indexing or operational readiness.
- It cannot be safely mitigated with a short-term workaround.

If leadership can knowingly accept the risk with a named owner and follow-up date, classify it as `Can Launch With Follow-up`, not `Launch Blocker`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
