# Audit Validator And Test Drift Prompt

Use this prompt to review whether validator scripts, test files, schemas, and related maintenance guidance still align with the current grounded file inventory.

## Prompt

Audit drift across this agent's grounded validators, tests, schemas, and validation guidance.

Your job is to identify where the visible validation assets appear aligned and where they have drifted apart.

Focus on the following:

1. Review grounded validator scripts, test files, schemas, README files, and references that mention validation.
2. Flag outdated validator references, duplicated checks, missing coverage notes, and inconsistencies between scripts, tests, schemas, and documentation.
3. Identify where documentation appears to promise validation behaviour that is not clearly supported by visible assets.
4. Distinguish between minor naming drift and drift that could mislead maintenance work.
5. Prefer the smallest high-value fixes first.

## Output requirements

Use this structure:

## Grounded Validation Assets Reviewed
- List only exact grounded filenames that are visible in the current attached file tree.
- If the visible file list is partial, say so explicitly and keep the inventory conservative.

## Confirmed Alignment
- ...

## Drift Findings
### Script And Test Drift
- ...

### Documentation Drift
- ...

### Coverage Risks
- ...

## Recommended Fixes
### Immediate
- ...

### Secondary
- ...

### Optional Cleanup
- ...

## Best Next Step
- State the single best validator-or-test drift fix to apply first.

## Guardrails
- Use only grounded visible validation assets.
- Do not invent unseen scripts, tests, schemas, YAML specs, or companion validation files.
- Do not infer filenames from folder conventions, README expectations, or naming patterns alone.
- Keep recommendations conservative and specific.
- If the visible file list is partial, say that the validator or test inventory may be incomplete.
