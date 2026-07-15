# Example: prior commitments create risk

## Input pattern

Customer asks for the `refund Sarah promised last week`. Zendesk history shows a support reply saying `we should be able to get this refunded for you` but no approved refund note exists. Billing record shows the charge is outside the normal refund window. Policy says exceptions require manager approval.

## Expected assessment pattern

- Classify as `policy_exception` and likely `refund`.
- Confirm the prior wording, but label it as expectation risk rather than confirmed approval.
- Confirm policy tension: outside normal refund window, exception approval required.
- Recommend manager/commercial approval before customer-facing outcome language.
- Say a limited reply can be drafted to acknowledge the prior conversation and explain the team is reviewing the exception request.
- Recommended downstream skill: `zendesk-customer-escalation` for approval handoff, then `zendesk-draft-response` after approval or a safe interim update.

## Safety note

Do not blame the teammate or tell the customer the previous promise was invalid. Keep the internal assessment factual and neutral.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
