# Investigation Report Template

Use this template when returning investigation mode output for RCA, proof, lookup, timeline reconstruction, reproduction context, known-issue checking, or diagnostic investigation.

Keep the investigation focused on one active issue. Every critical branch should end as `verified`, `disproven`, `blocked`, or `unknown`.

```md
# Zendesk Case Investigation

## Case

- Ticket: <ticket id, ticket url, or best available identifier>
- Customer / account: <name if known, or unknown>
- Investigation goal: <RCA | Proof | Lookup>
- Current disposition: <Confirmed root cause | Likely cause | Proven | Disproven | Inconclusive | Blocked | Lookup answered>

## Issue being investigated

<short summary of expected behaviour, actual behaviour, affected surface, stable identifiers, and relevant time window>

## Confirmed facts

- <fact grounded in Zendesk, supplied evidence, logs, screenshots, docs, or named secondary source>

## Branch ledger

| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| <branch> | <question that could change the conclusion> | <Zendesk / logs / GitHub / Help Centre / supplied evidence / other> | <verified / disproven / blocked / unknown> | <evidence, contradiction, or blocker> |

## Conclusion

<best-supported answer. Use cautious language when evidence is partial. State if the result is blocked or inconclusive.>

## Missing or uncertain evidence

- <exact evidence needed to unblock the conclusion, or none>

## Recommended next action

- <one concrete support next step>

## Sources checked

- <source category>: <what it was used for and any access limitation>
```

## Use rules

- Choose exactly one investigation goal before concluding.
- Prefer the smallest falsification step over broad searching.
- Separate current-state truth from event-time truth.
- Do not treat missing evidence as proof that something did not happen.
- Do not declare `Confirmed root cause`, `Proven`, or `Disproven` unless the branch ledger supports it.
- Do not invent request IDs, user IDs, account impact, reproduction steps, ownership, or ETA.
- End with one recommended next action, not a broad task list.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
