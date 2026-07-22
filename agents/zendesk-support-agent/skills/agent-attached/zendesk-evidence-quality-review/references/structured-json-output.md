# Structured JSON Output

Use structured JSON output only when the user explicitly asks for JSON, when another workflow will consume the review result, or when a shared agent needs a machine-readable QA record.

Do not use JSON by default for normal human review requests. The default markdown review is easier for support teammates to read and act on.

## Required schema

When structured output is needed, follow `schemas/review-result.schema.json` exactly.

The JSON result must include:

- `verdict`: `ready`, `mostly_ready_with_fixes`, or `not_ready`
- `output_type`: the reviewed artefact type
- `summary`: one to three sentences summarising the review judgement
- `issues`: an array of evidence, wording, next-step, privacy/redaction, or risk findings
- `checklist`: booleans matching the quick pass/fail checklist, including whether sensitive data is minimised for the audience

Do not add extra top-level fields unless the schema is intentionally updated. Use `privacy_redaction_risk` for sensitive-data, secret, internal-note, cross-customer, or redaction findings.

## Validation workflow

When a JSON review will be used by another tool, validate it before sharing or handing off:

```bash
python scripts/validate_review_json.py examples/review-result-valid.json
```

Validate a custom file:

```bash
python scripts/validate_review_json.py path/to/review.json --schema schemas/review-result.schema.json
```

If validation fails, fix the JSON shape only. Do not add new support facts, ticket evidence, root cause, customer impact, owners, timelines, or decisions during schema repair.

## Shared-agent rule

Structured JSON is a transport format, not a source of truth. It must still be grounded in the supplied Zendesk evidence, pasted ticket material, or explicitly provided support notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
