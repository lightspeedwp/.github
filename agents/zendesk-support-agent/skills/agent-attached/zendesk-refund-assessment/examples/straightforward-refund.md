# Example: straightforward refund request with clear policy support

## Input pattern

Customer asks to cancel an annual add-on renewal charged yesterday. Zendesk ticket shows the renewal charge occurred 18 hours ago. Billing evidence confirms no usage since renewal. Help-center policy says renewals may be refunded within 7 days if the renewed service has not been used. No prior compensation, chargeback, or policy exception exists.

## Expected assessment pattern

- Classify as `refund`.
- Confirm policy support, but still avoid saying the refund is approved unless approval authority is confirmed.
- State that billing evidence supports eligibility under the documented window.
- Mark approval path as normal billing/support approval if the workspace requires it.
- Say a customer-facing reply can be drafted safely within a bounded phrasing: `we are processing/reviewing this under the refund window` only if the workflow confirms that support may process it; otherwise `this appears to meet the documented criteria and we are sending it for approval`.
- Recommended downstream skill: `zendesk-draft-response` if the user wants the reply.

## Safety note

Do not write `you are entitled to a refund` unless policy and authority both confirm that wording is allowed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
