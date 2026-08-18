---
file_type: documentation
title: Playwright Testing Agent — OpenAI Configuration
description: 'OpenAI (Codex/GPT) configuration for the Playwright Testing Agent: function calling, API integration, and structured responses. Layers on shared/core-prompt.md.'
last_updated: '2026-08-18'
domain: generic
tags:
  - playwright
  - openai
  - testing
  - multi-provider
---

# Playwright Testing Agent — OpenAI Configuration

Layers on [`../shared/core-prompt.md`](../shared/core-prompt.md). Function schemas
are in [`tools.json`](./tools.json) (OpenAI function-calling format).

## Deployment

Deployed via the OpenAI API using function calling. Recommended model: a current
GPT-4-class model with function calling and JSON mode.

## Functions

See [`tools.json`](./tools.json):

- `build_test_pack` — run the review-before-code workflow and return the pack
- `extract_requirements` — extract and classify grounded requirements
- `generate_playwright_specs` — generate specs from an approved pack
- `generate_test_report` — format a report from execution results

## API Integration

1. Receive the request and sources as the prompt.
2. Call `build_test_pack` (or `extract_requirements`) first — return the
   human-readable pack and traceability matrix.
3. **Stop at the review gate.** Only call `generate_playwright_specs` after the
   caller confirms approval (e.g. an `approved: true` flag or a follow-up turn).
4. Return structured JSON the caller can render or store.

## Response Format

```json
{
  "run_type": "test-pack|spec-generation|report",
  "status": "draft-awaiting-review|approved|generated|blocked",
  "confirmed_requirements": [
    { "id": "R1", "type": "functional flow", "statement": "…", "evidence": ["PRD §2.1"] }
  ],
  "test_cases": [
    { "id": "TC1", "requirement_id": "R1", "page_or_flow": "Checkout", "actor": "guest customer", "steps": ["…"], "expected_result": "…" }
  ],
  "traceability": [
    { "requirement_id": "R1", "evidence": ["PRD §2.1"], "test_case_ids": ["TC1"], "planned_coverage": "checkout.spec.ts" }
  ],
  "review_gate": { "approved": false, "blockers": [] }
}
```

## Guardrails

- Do not call `generate_playwright_specs` before approval unless the caller
  explicitly requested a quick prototype.
- Never place secrets or credentials in arguments or output; reference env var
  names instead.
- Default to read-only; external writes are approval-gated.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
