# Example: Customer Reply Review

This is a synthetic example. Do not treat names, dates, IDs, or facts as real support evidence.

## Supplied evidence

- Ticket: ZD-10001.
- Customer reports that order confirmation emails stopped arriving after they changed their sender address.
- Support confirmed the sender address was changed today.
- Support has not confirmed whether DNS, spam filtering, or the application caused the issue.
- No refund, credit, fix date, or engineering commitment is approved.

## Draft to review

> We found that today's release broke confirmation emails. Engineering will fix this tomorrow. We will credit your account for the downtime. In the meantime, change your sender address back and everything will work.

## Correct review output

## Verdict

Not ready. The reply includes unsupported root cause, engineering, timing, credit, and workaround claims that are not backed by the supplied evidence.

## What is strong

- It attempts to give the customer a direct answer.
- It recognises the issue is affecting confirmation emails.

## Issues to fix

### Missing evidence

- The draft claims today's release caused the issue, but the evidence only confirms a sender address change.
- The draft promises a fix tomorrow, but no approved engineering commitment is supplied.
- The draft promises a credit, but no approved billing position is supplied.

### Unsupported or overstated claims

- Replace "today's release broke confirmation emails" with "we have confirmed the sender address changed today, but we have not confirmed the cause of the delivery issue yet."
- Replace "Engineering will fix this tomorrow" with "we will continue investigating and escalate with the evidence collected if needed."

### Weak next steps

- "Change your sender address back and everything will work" overstates the workaround. Ask the customer whether they can temporarily revert the sender address while support verifies whether that restores delivery.

## Recommended edits

> We have confirmed that the sender address was changed today, and we are checking whether that relates to the confirmation email delivery issue. We have not confirmed the root cause yet, so I do not want to overstate it. As a next step, can you confirm whether reverting the sender address temporarily is possible while we continue investigating?

## Quick pass/fail checklist

- Evidence supports the main claims: No
- Facts and interpretation are clearly separated: No
- Next steps are specific and owned: Partially
- Risk or escalation gaps remain: Yes
- Safe to send or share as-is: No

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
