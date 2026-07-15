# Reference Site Analysis Quality Check

## Scope
Validate the reference-site-analysis package assets for structural completeness, evidence labelling, open-question quality, and token-mode guidance.

## Validation rules
- The output should distinguish verified observations from likely but unconfirmed interpretation.
- Open questions should focus on unresolved evidence, not generic discovery resets.
- Recommendation labels should be used consistently where the workflow expects them.
- If no supporting technical evidence was needed, the check should allow a neutral no-technical-evidence path.
- Guidance should stay anchored to the analysed site rather than drifting into generic advice.
- Token guidance should prefer global foundational primitives before component-specific naming.
- The validator may treat this file as optional when it is not staged, but should use it when it is present.
