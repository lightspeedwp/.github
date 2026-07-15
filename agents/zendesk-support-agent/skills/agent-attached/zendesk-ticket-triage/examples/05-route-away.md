# Example 5: case that should route away

## Input

User request: Draft a customer reply for ticket 8421 apologising for the delayed migration and asking for the DNS records. The ticket notes already confirm the migration delay reason and the exact records needed.

## Output

This should route away from `zendesk-ticket-triage`.

Reason: the user already requested a finished customer reply, and the prompt says the required facts are confirmed.

Recommended downstream skill: `zendesk-draft-response`.

Suggested handoff context:

- Confirmed migration delay reason.
- Exact DNS records needed.
- Tone: apologise for delay, be clear and practical, avoid unsupported promises.
