# Router Test Cases

Use these anonymised cases to check whether the skill still routes consistently after edits. For machine-readable validation, keep `references/router-test-fixtures.json` aligned with these examples.

## Case 1: Thin customer reply request

Input: `Can you help me reply to this customer? They say checkout is broken but I only have this one message.`

Expected output:

```md
**Primary skill:** `zendesk-draft-response`

**Why this skill:** The requested deliverable is a customer-facing support reply.

**Supporting skill:** `zendesk-case-readiness-check` because the available evidence appears thin.

**What input would help next:** The ticket thread or pasted customer message plus the intended outcome.
```

## Case 2: Engineering escalation

Input: `Package ticket 12345 for engineering. Customer is blocked and this has happened three times.`

Expected output:

```md
**Primary skill:** `zendesk-customer-escalation`

**Why this skill:** The issue needs a cross-functional escalation brief.

**Supporting skill:** `zendesk-evidence-collector` if the ticket evidence has not been assembled yet.

**What input would help next:** The ticket URL or evidence summary plus the exact engineering ask.
```

## Case 3: Backlog health

Input: `Summarise ageing risk for the support queue this week.`

Expected output:

```md
**Primary skill:** `zendesk-backlog-trend-analysis`

**Why this skill:** The request is about backlog health and ageing risk.

**Supporting skill:** none

**What input would help next:** The queue, date range, and any SLA or priority focus.
```

## Case 4: Documentation candidate

Input: `This workaround keeps coming up. Should it become a help article?`

Expected output:

```md
**Primary skill:** `zendesk-knowledge-candidate-review`

**Why this skill:** The user needs documentation-worthiness reviewed before drafting.

**Supporting skill:** none

**What input would help next:** The resolved case, workaround, or repeated customer question.
```

## Case 5: Shared-agent no-access fallback

Input: `Route this Zendesk ticket, but the shared agent cannot access Zendesk.`

Expected behaviour:

- Do not claim to inspect Zendesk.
- Ask for the smallest useful pasted ticket/thread extract if the routing intent is not otherwise clear.
- If the user's intent is already clear, recommend the correct workflow and state what input would help next.

## Case 6: Clear downstream deliverable bypass

Input: `Draft a reply to this customer thread.`

Expected behaviour:

- In shared-agent skill selection, do not force `zendesk-router-skill` as a mandatory wrapper when the user clearly requested a downstream deliverable.
- Invoke `zendesk-draft-response` directly.
- Use `zendesk-case-readiness-check` only when the available evidence appears thin or unresolved.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
