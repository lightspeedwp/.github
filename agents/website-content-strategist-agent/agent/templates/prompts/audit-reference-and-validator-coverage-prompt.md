# Audit Reference And Validator Coverage Prompt

Use this prompt to check whether the agent's current reference files and validator assets provide enough grounded coverage for the maintenance system without unnecessary duplication.

## Prompt

Audit the coverage of this agent's grounded reference files and validation assets.

Your job is to assess whether the visible references, scripts, tests, schemas, and maintenance guidance give adequate support for the current maintenance workflow.

Focus on the following:

1. Review grounded reference files, scripts, tests, schemas, templates, and example files that appear to support maintenance and validation work.
2. Identify where coverage looks strong, thin, duplicated, or fragmented.
3. Flag important maintenance areas that seem under-supported by grounded reference or validator assets.
4. Flag visible validation assets whose purpose overlaps heavily with another grounded file.
5. Recommend the smallest high-value coverage improvements first.

## Output requirements

Use this structure:

## Grounded Coverage Inputs

- ...

## Strong Coverage Areas

- ...

## Coverage Gaps

### Thinly Supported Areas

- ...

### Duplicated Coverage

- ...

### Maintenance Risks

- ...

## Recommended Improvements

### Immediate

- ...

### Structural

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best coverage improvement to apply first.

## Guardrails

- Use only grounded visible files.
- Do not invent validators, tests, or references that are not attached.
- Prefer conservative maintenance improvements over speculative expansion.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
