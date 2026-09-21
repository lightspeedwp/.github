---
name: orchestrate-pr-creation
description: Assembles and validates the complete PR data object (title, body, head, base, labels) derived from the branch's own commits and diff, before it is submitted. Use after branch name validation and template routing, once the PR's content is ready to be assembled.
---

# orchestrate-pr-creation

Orchestrates PR creation by assembling PR data and validating it.

## When to use this skill

After `validate-branch-name` and `route-pr-template`, once the PR's title, body, head, base and labels are ready to be assembled into a single PR object for `submit-pr`.

## Input

```js
{
  pr: object,                     // { title, body, head, base, labels }
  aiFeedback: array,              // optional: AI review feedback
  triggerWorkflow: boolean,       // optional
  createFeedbackResponse: boolean, // optional
  parseFrontmatter: boolean,      // optional
}
```

## Behaviour

- Derives PR content from the branch's own commits/diff, not assumed prior context.
- Validates the assembled PR object before it is handed to `submit-pr`.

## Output

```js
{ success: boolean, pr: object, errors: string[] }
```

## Usage

```js
import { orchestratePrCreation } from "./scripts/orchestrate-pr-creation.js";

const result = await orchestratePrCreation({ pr: { title, body, head, base, labels } });
```
