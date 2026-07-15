# Example: Backlog Summary Review

This is a synthetic example. Do not treat names, dates, IDs, or facts as real support evidence.

## Supplied evidence

- Time window: 2026-06-01 to 2026-06-07.
- Queue: Zendesk Support Inbox.
- 42 open tickets at start of window.
- 57 open tickets at end of window.
- 9 tickets mention checkout, but no duplicate review has been completed.

## Draft to review

> The backlog exploded because checkout is broken. We should make checkout the top product priority this week.

## Correct review output

## Verdict

Not ready. The backlog increase is supported by the supplied counts, but the cause and product-priority recommendation go beyond the evidence.

## What is strong

- The draft correctly recognises a backlog increase.
- It attempts to turn the report into an action.

## Issues to fix

### Missing evidence

- The draft needs the time window and queue scope included.
- It needs duplicate or pattern review before saying checkout is broken.

### Unsupported or overstated claims

- Replace "backlog exploded" with "open tickets increased from 42 to 57 during 2026-06-01 to 2026-06-07."
- Replace "checkout is broken" with "9 tickets mention checkout, but they have not yet been confirmed as duplicates or a single incident."

### Weak next steps

- Recommend duplicate/pattern review of the 9 checkout-related tickets before product escalation.

## Recommended edits

> Open tickets in the Zendesk Support Inbox increased from 42 to 57 between 2026-06-01 and 2026-06-07. Nine tickets mention checkout, but the supplied evidence does not yet confirm whether these are duplicates, related symptoms, or separate issues. Recommended next step: run a duplicate and pattern review on the checkout-related tickets before making a product-priority recommendation.

## Quick pass/fail checklist

- Evidence supports the main claims: No
- Facts and interpretation are clearly separated: No
- Next steps are specific and owned: Partially
- Risk or escalation gaps remain: Yes
- Safe to send or share as-is: No
