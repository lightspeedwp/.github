---
name: orchestrate-pr-creation
description: Assembles and validates a caller-supplied PR data object (title, body, head, base, labels) before it is submitted. Use after branch name validation and template routing, once the caller has prepared the PR content.
---

# orchestrate-pr-creation

Orchestrates PR creation by assembling PR data and validating it.

## When to use this skill

After `validate-branch-name` and `route-pr-template`, once the PR's title, body, head, base and labels are ready to be assembled into a single PR object for `submit-pr`.

## Input

```js
{
  pr: object,                     // { owner, repo, title, body, head, base, labels }
  aiFeedback: array,              // optional: AI review feedback
  triggerWorkflow: boolean,       // optional
  createFeedbackResponse: boolean, // optional
  parseFrontmatter: boolean,      // optional
}
```

## Behaviour

- Requires the caller to supply the title, body, head, base, and repository identity.
- Validates the assembled PR object before it is handed to `submit-pr`.
- Does not yet derive title or body from commits and diff; that guarantee is deferred to T015.

## Output

Failures return a single error:

```js
{ success: false, error: string }
```

Successes return the assembled PR and orchestration metadata:

```js
{
  success: true,
  pr: object,
  frontmatter: object | null,
  feedbackResponseCreated: boolean,
  workflowRequested: boolean,
}
```

## Usage

```js
import { orchestratePrCreation } from "./scripts/orchestrate-pr-creation.js";

const result = await orchestratePrCreation({
  pr: { owner, repo, title, body, head, base, labels },
});
```

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
