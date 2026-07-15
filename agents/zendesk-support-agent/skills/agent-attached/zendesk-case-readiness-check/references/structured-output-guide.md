# Structured output guide

Use this guide only when another agent, automation, QA check, or downstream tool explicitly asks for structured output. The default customer-facing and support-facing output remains markdown.

## When to use JSON

Use JSON when:

- a parent agent needs to parse the readiness decision;
- a batch QA process needs consistent fields;
- a downstream workflow routes by `target_deliverable` or `readiness_status`;
- the user explicitly asks for JSON.

Do not use JSON for ordinary human review unless requested.

## Required JSON fields

Follow `schemas/readiness-check.schema.json`.

Required fields:

- `target_deliverable`
- `readiness_status`
- `confirmed_evidence`
- `missing_evidence.blocker`
- `next_step`

Optional fields:

- `missing_evidence.optional_improvement`
- `risk_if_skipped`

## Allowed values

Use exactly these `target_deliverable` values:

- `customer_reply`
- `internal_escalation`
- `knowledge_drafting`
- `downstream_engineering_product_handoff`

Use exactly these `readiness_status` values:

- `ready`
- `partially_ready`
- `not_ready`

## Structured output example

```json
{
  "target_deliverable": "customer_reply",
  "readiness_status": "ready",
  "confirmed_evidence": [
    "The customer ask is clear from the supplied ticket summary.",
    "The supplied evidence includes a supportable next action."
  ],
  "missing_evidence": {
    "blocker": "none",
    "optional_improvement": "Link the exact Zendesk ticket if available."
  },
  "next_step": "Draft the customer reply using the confirmed facts only."
}
```

## Validation script

When a structured JSON output is created as a file, validate it with:

```bash
python3 scripts/validate-readiness-json.py path/to/readiness-output.json
```

The script is dependency-free. It checks required keys, allowed enum values, basic value types, unknown fields, and empty required strings. It does not judge whether the support reasoning is correct; the agent must still apply the readiness rules in `SKILL.md`.
