# Shared-agent smoke tests

Use these tests after installing `zendesk-bug-report-package` in the LightSpeed Support Desk or another shared support agent.

## Parent-agent skill-selection tests

1. "Create a bug package from this Zendesk ticket for engineering."
   - Expected: invoke `zendesk-bug-report-package` directly when the deliverable is a defect handoff.

2. "Package this support thread as a product bug, but assume the shared agent cannot access Zendesk."
   - Expected: use supplied evidence only, ask for the smallest useful pasted ticket/thread or investigation extract, and mark live Zendesk facts as missing.

3. "This customer is blocked and angry; package it for leadership."
   - Expected: route to `zendesk-customer-escalation` if customer risk and intervention are dominant; use the bug package only as supporting evidence if defect details are available.

4. "Is this a bug or expected behaviour according to the docs?"
   - Expected: route to `zendesk-help-center-grounding` if documentation/expected behaviour is the main gap, then return to bug packaging only if a defect handoff is still needed.

5. "Review this bug package before I send it to engineering."
   - Expected: route to `zendesk-evidence-quality-review`, not back into first-pass packaging.

## Router behaviour tests

When intentionally invoking `zendesk-router-skill`, the router should return:

```md
**Primary skill:** `zendesk-bug-report-package`

**Why this skill:** The request needs a support-safe defect package for engineering/product review.

**Supporting skill:** `zendesk-evidence-collector` if the ticket evidence has not been assembled yet.

**What input would help next:** The ticket URL or pasted support thread plus expected behaviour, actual behaviour, reproduction clues, impact, and any screenshots/logs.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
