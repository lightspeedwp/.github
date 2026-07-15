# Example: Security-sensitive handoff

This is an anonymised example. Do not treat it as real Zendesk evidence.

## Internal handoff

- Problem: Customer reports that a former contractor may still have access to their admin account.
- Impact: Potential access-control risk for one customer account. No confirmed data exposure yet.
- Owner or target team: security
- Exact ask: Review account access history and advise whether immediate session revocation or credential reset is required.
- Urgency/risk: urgent - possible unauthorised access, but impact is not yet confirmed.

## Evidence

- Confirmed: Zendesk ticket ZD-10004, requester is the account owner for Example Health Group.
- Customer-reported: Former contractor left the organisation on 2026-05-30.
- Customer-reported: Contractor username may still be able to access admin area.
- Confirmed: Support has not copied credentials, tokens, raw logs, or personal identity documents into this handoff.
- Missing: Access logs have not yet been reviewed.

## Sensitivity notes

- Sensitive details omitted: yes
- Share with: security team and assigned senior support owner only
- Do not share with: broad Slack channels, public comments, downstream issue trackers, or customer-facing replies until security confirms safe wording

## Attempted steps

- Support acknowledged the concern without confirming breach or exposure.
- Support asked the customer not to send passwords or secret keys.
- Support has not made account changes yet.

## Blockers

- Need access-log review and containment decision.
- Need security-approved customer wording before the next public reply.

## Handoff brief

Security review needed for ZD-10004. Account owner reports that a former contractor may still have admin access. No data exposure is confirmed yet. Sensitive details are omitted from this handoff. Please review account access history and advise whether support should revoke sessions, trigger credential reset, or use specific customer-facing wording.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
