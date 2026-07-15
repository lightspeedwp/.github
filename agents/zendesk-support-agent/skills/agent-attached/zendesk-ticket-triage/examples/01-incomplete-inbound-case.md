# Example 1: straightforward but incomplete inbound case

## Input

Ticket subject: Cannot log in after password reset

Customer says they reset their password twice but still cannot access the dashboard. They did not include screenshots or the exact error. No internal notes yet.

## Output

# Internal triage package

## Issue summary
The requester cannot access the dashboard after attempting password resets, but the exact error and affected account details are not yet available.

## Urgency
normal — Login access is affected for one customer, but there is no confirmed outage, time-sensitive blocker, or security concern in the ticket evidence.

## Severity
Medium — The customer is blocked from account access, but the visible evidence suggests a single-customer issue rather than a platform-wide failure.

## Recommended priority
Normal — Handle through standard access troubleshooting unless additional impact, SLA, or security evidence appears.

## Issue type
account/access

## Likely owner
frontline support — inferred from a routine access issue that needs basic troubleshooting before specialist involvement.

## Duplicate or pattern risk
not assessed — No related tickets or repeated symptoms are visible in the supplied evidence.

## Customer impact
The customer is currently unable to access the dashboard. Business impact is not stated.

## Confirmed facts
- The customer attempted password reset twice.
- The customer still cannot log in.
- The ticket does not include the exact error message or screenshots.

## Inferred risks or concerns
- The issue may be user/account-specific rather than platform-wide, but this is not confirmed.

## Missing information
- Exact error message or screenshot.
- Affected email/account identifier.
- Whether other users on the same account are affected.
- Browser/device details if the issue persists after basic checks.

## Escalation signals
none confirmed — No outage, security, payment, VIP, SLA, or repeated-failure signal is visible.

## Recommended next action
Request the missing login details and provide safe first-line troubleshooting steps.

## Recommended downstream skill
`zendesk-draft-response`
