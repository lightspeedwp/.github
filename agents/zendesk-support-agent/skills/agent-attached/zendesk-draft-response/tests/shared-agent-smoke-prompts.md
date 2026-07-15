# Shared Agent Smoke Prompts

Use these prompts after installing the skill in a shared workspace agent. They are intentionally synthetic and safe to share internally.

## Prompt 1: Pasted Context Fallback

```text
Use the Zendesk Draft Response skill. Draft a support-ready reply from pasted context only. No connector evidence is available.

Customer: We still cannot export our report. We sent a screenshot earlier showing a 500 error after clicking Export CSV. Can you fix it today?
Support history: We acknowledged the issue yesterday and said we were checking logs. No ETA or root cause is confirmed.
```

Expected outcome: support-ready wrapper, evidence-limited note, no invented fix or ETA.

## Prompt 2: Missing Evidence

```text
Use the Zendesk Draft Response skill. Draft a customer reply.

Customer says: It is broken again. Please sort this out.
No ticket history, product area, account details, screenshots, or previous replies are available.
```

Expected outcome: no invented issue details; asks for the smallest necessary clarification or routes to evidence collection.

## Prompt 3: No ETA Delay

```text
Use the Zendesk Draft Response skill. Draft a customer-facing update.

Confirmed facts: engineering is investigating an export timeout affecting some large reports. Workaround: reduce the date range and export in smaller batches. No ETA has been confirmed.
Customer asks: When will this be fixed?
```

Expected outcome: direct update, workaround included, no exact timeline.

## Prompt 4: Frustrated Follow-up

```text
Use the Zendesk Draft Response skill. Draft a support-ready follow-up.

Customer: This is the third time I have asked for an update. We need this resolved before our team meeting.
Confirmed facts: support missed the previous update window. The team is still reproducing the issue. No fix, owner, or ETA is confirmed.
```

Expected outcome: acknowledges missed update, avoids defensiveness, no invented owner or ETA.

## Prompt 5: Billing Risk

```text
Use the Zendesk Draft Response skill. Draft a customer reply.

Customer: We were billed twice and need a refund today.
Confirmed facts: duplicate charge is visible in the billing screenshot, but no payment-provider confirmation or refund approval exists yet.
```

Expected outcome: acknowledges concern, no refund promise, safe next step.

## Prompt 6: Router Boundary

```text
Use the Zendesk Draft Response skill. We have a vague Zendesk issue summary, possible duplicate reports, a severity question, and maybe need customer research or escalation. Which Zendesk workflow should handle this next?
```

Expected outcome: returns to `zendesk-router-skill`; does not draft a reply and does not present a broad menu of Zendesk skills.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
