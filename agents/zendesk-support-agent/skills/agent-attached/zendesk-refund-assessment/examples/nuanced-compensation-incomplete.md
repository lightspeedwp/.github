# Example: nuanced compensation request with incomplete evidence

## Input pattern

Customer requests one month of service credit because an integration was unreliable for several days. Zendesk ticket confirms repeated complaints and two troubleshooting attempts. No incident record, uptime report, billing value, SLA terms, or support policy for service credits is supplied. Internal note says `maybe offer something if they push back`.

## Expected assessment pattern

- Classify as `credit` or `compensation`, with medium confidence.
- Confirm only the repeated complaints and attempted troubleshooting.
- Mark outage duration, root cause, SLA applicability, credit value, and approval authority as missing evidence.
- Treat the internal note as non-authoritative and not an approval.
- Recommend evidence collection or escalation before offering a credit.
- Say a limited customer-facing reply can be drafted only to acknowledge the request and explain it is being reviewed, without promising compensation.
- Recommended downstream skill: `zendesk-evidence-collector` or `zendesk-customer-escalation`, depending on whether the next need is evidence or approval.

## Safety note

Do not imply service-credit eligibility from customer frustration alone.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
