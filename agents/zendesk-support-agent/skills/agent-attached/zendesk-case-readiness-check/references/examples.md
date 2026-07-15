# Readiness examples

Use these synthetic examples when a borderline case is hard to classify. Do not copy customer details into these examples.

## Example 1: reply-ready without root cause

Input:
Customer asks why a coupon no longer works. Supplied evidence shows the coupon expired yesterday. Help Centre policy says expired coupons cannot be reactivated.

Output direction:

- Target deliverable: customer reply
- Readiness status: ready
- Blocker: none
- Next step: recommend `zendesk-draft-response` if the user asked for the customer reply; otherwise stop at the readiness decision.

## Example 2: partially ready for escalation

Input:
Customer reports repeated checkout failures on a production site. Ticket includes account name and screenshots, but no order IDs, timestamps, or affected payment method.

Output direction:

- Target deliverable: internal escalation
- Readiness status: partially ready
- Blocker: one concrete failure example with timestamp or order/payment context
- Risk if skipped: the receiving owner may need to restart basic discovery.

## Example 3: not ready for engineering handoff

Input:
Customer says "the site is broken" after an update. No URL, user role, browser, screenshot, expected behaviour, or reproduction step is available.

Output direction:

- Target deliverable: downstream engineering/product handoff
- Readiness status: not ready
- Blocker: affected URL/workflow plus observed and expected behaviour
- Next step: recommend `zendesk-evidence-collector` to collect minimum reproduction context before handoff.

## Example 4: knowledge draft not ready

Input:
Two customers report similar API errors. Support has a temporary workaround from one internal note, but engineering has not confirmed the cause or whether the workaround is safe.

Output direction:

- Target deliverable: knowledge drafting
- Readiness status: not ready
- Blocker: confirmed stable workaround or resolution boundary
- Next step: return to `zendesk-router-skill` for documentation-worthiness routing, or use `zendesk-knowledge-candidate-review` only if the parent agent already selected that path. Do not draft the article yet.

## Example 5: standalone pasted ticket

Input:
A teammate pastes the customer message and one internal note, but Zendesk is unavailable in the current agent.

Output direction:

- Assess only the supplied evidence.
- State unavailable Zendesk details explicitly.
- Do not invent ticket history, SLA state, linked tickets, or prior commitments.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
