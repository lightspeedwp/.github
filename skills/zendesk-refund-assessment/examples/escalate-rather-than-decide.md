# Example: case that should escalate rather than decide

## Input pattern

Enterprise customer requests compensation for lost revenue after a data sync issue. Ticket includes executive contacts, renewal next month, a claimed monetary loss, and a threat to involve legal. Support has confirmed a defect may have affected exports, but root cause and contract terms are not confirmed.

## Expected assessment pattern

- Classify as `compensation` and `policy_exception` or `mixed`.
- Confirm executive visibility, claimed loss, possible defect, and renewal pressure.
- Mark legal/contract terms, actual loss evidence, root cause, and approval authority as missing.
- Recommend escalation before any customer-facing compensation language.
- Say customer-facing reply is limited to acknowledgement and escalation/continued review if an interim update is needed.
- Recommended downstream skill: `zendesk-customer-escalation`.

## Safety note

Do not assess legal liability or validate the claimed loss. State that specialist/approval review is needed.
