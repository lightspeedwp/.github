# Example: Privacy and Redaction Review

This example uses fictional data only.

## Supplied evidence

Zendesk ticket `ZD-90210` contains a customer report that a user could not log in. The private notes include a debug log with an IP address, session token, internal staging URL, and a comment from support speculating that the engineering team broke the login flow in a release.

## Draft to review

> Hi Mira,
>
> We checked the logs for user Dani Taylor at <dani.taylor@example.test>. Their IP was 203.0.113.25 and their session token was `abc123-secret-token`. It looks like Engineering broke login during yesterday's release. We have seen the same thing for Atlas Books and Northwind Retail as well, so this is a widespread bug. We will fix it tomorrow.

## Correct review output

## Verdict

Not safe to send as-is. The draft exposes personal data, a session token, internal speculation, other customer names, and an unsupported fix commitment.

## Issues to fix

### Privacy or redaction risk

- High: The session token must be removed entirely. Secrets must never appear in customer-facing wording.
- Medium: The user's full name, email address, and IP address are not needed in the customer reply.
- High: Naming other affected customers creates cross-customer disclosure risk.
- Medium: The engineering blame statement exposes internal speculation and should be reframed.

### Unsupported or overstated claims

- The draft says the issue will be fixed tomorrow, but no approved date is provided.
- The draft calls the issue widespread without supported scope or approved incident wording.

## Recommended edits

Replace the customer-facing paragraph with:

> Thanks for the details. We found evidence of a failed login attempt for the affected user and are continuing to investigate the cause. We are checking whether this relates to recent release activity and will update you once we have a confirmed next step. Please do not send passwords, full tokens, or unredacted debug logs in the ticket.

## Quick pass/fail checklist

- Evidence supports the main claims: No
- Facts and interpretation are clearly separated: No
- Next steps are specific and owned: Partially
- Risk or escalation gaps remain: Yes
- Safe to send or share as-is: No

## Why this is correct

The review keeps the useful support signal while removing unnecessary personal data, secrets, other-customer references, internal speculation, and unsupported delivery commitments.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
