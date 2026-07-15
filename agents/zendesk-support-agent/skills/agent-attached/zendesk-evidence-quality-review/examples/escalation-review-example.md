# Example: Escalation Review

This is a synthetic example. Do not treat names, dates, IDs, or facts as real support evidence.

## Supplied evidence

- Ticket: ZD-10002.
- Three failed payment attempts are visible in the supplied ticket notes.
- Customer says their campaign launch is blocked.
- Support has checked plugin settings and payment method configuration.
- No logs are supplied.
- Target owner is not named.

## Draft to review

> Escalate urgently. Payments are down for this customer and probably everyone else. Product needs to fix the gateway issue today.

## Correct review output

## Verdict

Not ready. The escalation may be justified for customer impact, but the brief overstates wider impact and lacks logs, owner direction, and an exact ask.

## Escalation fit

Escalation could be appropriate because the customer reports a blocked campaign launch and support has already checked basic configuration. The wider incident claim is not supported.

## Gaps

### Impact gap

- The draft should say the supplied evidence confirms three failed payment attempts for this customer, not that payments are down for everyone.

### Evidence gap

- Add transaction IDs, timestamps, gateway error messages, and relevant logs if available.

### Ownership or ask gap

- "Product needs to fix" is not actionable. The brief should ask the relevant owner to confirm whether the failures are gateway-side, plugin-side, or configuration-side.

## Recommended escalation wording

> Customer reports a blocked campaign launch after three failed payment attempts. Support has checked plugin settings and payment method configuration, but the supplied evidence does not yet confirm the cause. Please review the failed payment evidence and confirm the likely failure point or the next diagnostic step.

## Pass/fail

- Impact is clear: Partially
- Evidence supports escalation: Partially
- Target owner or team is clear: No
- Exact ask is actionable: No
- Safe to escalate as-is: No

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
