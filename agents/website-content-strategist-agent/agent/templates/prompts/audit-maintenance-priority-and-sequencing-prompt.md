# Audit Maintenance Priority And Sequencing Prompt

Use this prompt to review whether the agent's current maintenance issues are being prioritised and sequenced sensibly.

## Prompt

Audit the priority and sequencing of this agent's grounded maintenance work.

Review the current prompts, references, validators, tests, and README guidance. Identify which maintenance issues should be fixed first, which can wait, and where the current system may encourage the wrong order of work.

Focus on the following:

1. Identify the most operationally risky maintenance gaps first.
2. Distinguish between blockers, important follow-up fixes, and optional cleanup.
3. Check whether current prompts and references imply an inefficient or misleading order of work.
4. Recommend the smallest useful sequencing improvements.
5. Keep the review grounded in the visible attached files only.

## Output requirements

Use this structure:

## Grounded Inputs
- ...

## Highest-Priority Issues
- ...

## Secondary Issues
- ...

## Sequencing Risks
- ...

## Recommended Order
1. ...
2. ...
3. ...

## Best Next Step
- State the single best maintenance task to do first.

## Guardrails
- Use only grounded visible files.
- Keep recommendations conservative and practical.
- Do not invent missing maintenance layers.
