# Router integration

Use this file when checking whether `zendesk-router-skill` can reference `zendesk-bug-report-package` safely in a shared support desk agent.

## Primary router trigger

Use `zendesk-bug-report-package` when the user asks for an internal bug report, defect package, product bug handoff, engineering-ready handoff, reproduction package, or a concise package of Zendesk support evidence for product/engineering review.

## Do not route here first

Do not route here when the dominant need is first-pass classification, missing evidence collection, customer/account research, customer-facing drafting, formal escalation, documentation grounding, duplicate/pattern review, backlog reporting, refund/policy assessment, or general support handoff without a defect focus.

## Minimum useful input

- Zendesk ticket URL/ID or pasted support thread.
- Product/surface and affected environment if known.
- Expected versus actual behaviour, even if expected behaviour is uncertain.
- Reproduction steps, clues, screenshots, logs, or timestamps if available.
- Impact, workaround, affected users/accounts, and urgency signals if known.

## Router output example

```md
**Primary skill:** `zendesk-bug-report-package`

**Why this skill:** The request needs a support-safe defect package for engineering/product review.

**Supporting skill:** `zendesk-evidence-collector` if the ticket evidence has not been assembled yet.

**What input would help next:** The ticket URL or pasted support thread plus expected behaviour, actual behaviour, reproduction clues, impact, and any screenshots/logs.
```

## Shared-agent fallback

If Zendesk access is unavailable, the router should still recommend this skill when the intent is clearly defect packaging, but it must ask for the smallest useful pasted ticket/thread or investigation extract and avoid claiming live Zendesk evidence was inspected.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
