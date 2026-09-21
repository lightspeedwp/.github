---
name: submit-pr
description: Submits the orchestrated PR object to GitHub, or validates it without creating anything in dry-run mode. Use as the final step, once orchestrate-pr-creation and validate-and-apply-labels have produced a complete, valid PR object.
---

# submit-pr

Submits a PR to GitHub using the orchestrated PR object.

## When to use this skill

As the final step, once `orchestrate-pr-creation` and `validate-and-apply-labels` have produced a complete PR object (title, body, head, base, labels).

## Input

```js
{
  pr: object,           // { title, body, head, base, labels }
  githubContext: object, // { owner, repo, token }
  dryRun: boolean,       // optional, default false — validate only, don't create
}
```

## Behaviour

- Validates the PR object (title, body length, branch fields, label format) before submitting.
- In dry-run mode, returns a preview without creating anything on GitHub.
- Otherwise creates the PR and returns its URL, number, and ID.

## Output

```js
{ valid: boolean, submitted: boolean, prUrl: string|null, prNumber: number, prId: string, warnings: string[], validationErrors: string[] }
```

## Usage

```js
import { submitPr } from "./scripts/submit-pr.js";

const result = await submitPr({ pr, githubContext, dryRun: true });
```
