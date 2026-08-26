# Evaluation and Trigger Rubric

This reference adapts Anthropic-style skill evaluation for ChatGPT skill creation.

## Minimum Test Set

For production skills, create at least three test prompts.

### 1. Happy path

A realistic prompt with enough source material to produce the expected output.

Check that the skill:

- Uses the intended workflow.
- Produces the expected structure.
- Applies domain-specific guidance.
- Avoids generic filler.
- Includes validation, risks or acceptance criteria where relevant.

### 2. Ambiguous or incomplete input

A prompt missing one or two important details.

Check that the skill:

- Asks no more than one focused question when required.
- Otherwise uses safe defaults and states assumptions.
- Does not block progress unnecessarily.

### 3. Boundary or mis-trigger

A prompt that is adjacent to the skill but should not fully trigger it.

Check that the skill:

- Routes to a more appropriate workflow when needed.
- Avoids making unsupported claims.
- Declines unsafe or out-of-scope work where appropriate.

## Optional Baseline Comparison

For important skills, compare output with and without the skill.

Record:

- Baseline weaknesses.
- Skill improvements.
- Remaining gaps.
- Whether the skill should be tightened, expanded or split.

## Grading Criteria

Score each output from 1 to 5.

| Score | Meaning |
|---|---|
| 1 | Fails the task or ignores skill instructions. |
| 2 | Partially useful but misses core workflow or domain constraints. |
| 3 | Acceptable but generic or incomplete. |
| 4 | Strong, usable and mostly aligned. |
| 5 | Production-ready, specific, well-structured and low-risk. |

Assess:

- Trigger fit.
- Input handling.
- Domain accuracy.
- Output structure.
- Practicality.
- Risk handling.
- Reusability.

## Trigger Review

The skill description should answer:

1. What does the skill do?
2. When should it be used?
3. Which domains or file types trigger it?
4. Which outputs does it create?
5. Which adjacent requests should not trigger it?

Good trigger wording is specific enough to invoke the skill only when useful, but broad enough to catch natural user phrasing.

## Trigger Test Matrix

Use this table when refining descriptions.

| Test prompt | Should trigger? | Reason | Description change needed? |
|---|---:|---|---|
| Create a GitHub issue for mapping Figma variables to theme.json | Yes | Figma to WordPress planning | No |
| Explain what WordPress is | No | General explanation | Possibly narrow description |
| Build a launch QA skill for a WooCommerce block theme | Yes | WordPress skill creation | No |
| Debug this PHP fatal error | No | Implementation support, not skill creation | Add boundary if over-triggering |

## Iteration Loop

1. Review test outputs.
2. Identify missed instructions, over-specific rules or ambiguous triggers.
3. Update `SKILL.md` or references.
4. Remove bloated or duplicated guidance.
5. Re-run the most important test prompts.
6. Package only after the skill behaves predictably.
