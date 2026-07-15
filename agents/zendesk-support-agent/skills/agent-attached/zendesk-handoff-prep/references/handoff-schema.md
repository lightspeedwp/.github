# Handoff schema reference

Use this reference only when the user asks for structured output, validation, automation-friendly output, downstream conversion support, or when another tool or agent needs a predictable handoff shape.

The default customer-visible output should remain the readable markdown handoff in `SKILL.md` unless structured output is explicitly useful.

## Schema file

Use `schemas/zendesk-handoff.schema.json` as the optional structured-output contract.

The schema captures:

- handoff type;
- support-first problem statement;
- impact;
- target team;
- exact ask;
- urgency and risk;
- confirmed evidence;
- attempted steps;
- blockers;
- assumptions;
- missing evidence;
- sensitivity notes;
- downstream conversion status;
- concise handoff brief.

## When to use structured output

Use the schema when:

- the user asks for JSON;
- the handoff will be consumed by another agent, script, or workflow;
- the user asks for validation or consistency checking;
- the handoff may later become a Linear, GitHub, Asana, BugHerd, Slack, or Zendesk private-note artefact;
- the receiving workflow needs to compare multiple handoffs consistently.

Do not use the schema when:

- the user only wants a quick internal handoff;
- a readable Zendesk private note or Slack message is enough;
- structured output would make the answer harder for a human support teammate to use.

## Field rules

- Put only confirmed facts in `evidence`.
- Put inferred context in `assumptions`.
- Put missing but material facts in `missing_evidence`.
- Use `unknown` instead of inventing impact, urgency, owner, source, or confidence.
- Keep `exact_ask` action-oriented. Do not use `FYI` as the ask.
- Use `sensitivity` for access, privacy, billing, security, credentials, logs, screenshots, or personal-data concerns.
- Set `downstream_conversion.requested` to `false` unless the user explicitly asks for conversion to another system.

## Minimal structured output example

```json
{
  "handoff_type": "engineering_review",
  "problem": "Customer reports that checkout fails after selecting a saved payment method. Cause is not confirmed.",
  "impact": "Checkout is blocked for the reporting customer. Broader impact is unknown.",
  "target_team": "engineering",
  "exact_ask": "Check whether the saved-payment checkout error is reproducible and advise support on the next customer-safe reply.",
  "urgency_risk": {
    "level": "high",
    "reason": "Revenue-impacting checkout flow is blocked for at least one customer."
  },
  "evidence": [
    {
      "source_type": "zendesk_ticket",
      "source_reference": "ticket id redacted",
      "summary": "Customer states checkout fails after selecting a saved payment method.",
      "confidence": "confirmed"
    }
  ],
  "attempted_steps": [
    "Support confirmed the issue occurs after saved payment method selection."
  ],
  "blockers": [
    "No reproduction result from engineering yet."
  ],
  "assumptions": [],
  "missing_evidence": [
    "Exact error message or screenshot if available.",
    "Affected browser, account, and timestamp."
  ],
  "sensitivity": {
    "contains_sensitive_details": false,
    "sensitive_details_omitted": true,
    "approved_audience": ["support", "engineering"],
    "do_not_share_with": [],
    "notes": "No credentials, payment details, or personal data included."
  },
  "downstream_conversion": {
    "requested": false,
    "target_system": null,
    "notes": "No downstream conversion requested."
  },
  "handoff_brief": "Customer reports checkout failure after selecting a saved payment method. Engineering should check reproducibility and advise support on the next customer-safe reply."
}
```
