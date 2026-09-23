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

PR validation failures return:

```js
{
  valid: false,
  error: "PR validation failed",
  validationErrors: string[],
  warnings: string[],
  submitted: false,
  prUrl: null,
}
```

A successful dry run returns a preview without submission identifiers:

```js
{
  valid: true,
  dryRun: true,
  submitted: false,
  prUrl: null,
  prPreview: {
    title: string,
    body: string,
    head: string,
    base: string,
    labels: string[],
  },
  warnings: string[],
  message: string,
}
```

A successful submission returns the GitHub identifiers and applied labels:

```js
{
  valid: true,
  submitted: true,
  prUrl: string,
  prNumber: number,
  prId: string,
  message: string,
  labels: string[],
  warnings: string[],
}
```

Invalid input, GitHub submission failures, and caught errors return an error variant. Missing-field input errors add
`missingFields`; GitHub submission errors add `details`:

```js
{
  valid: false,
  error: string,
  submitted: false,
  prUrl: null,
  missingFields?: string[],
  details?: { missingFields: string[] },
}
```

## Usage

```js
import { submitPr } from './scripts/submit-pr.js';

const result = await submitPr({ pr, githubContext, dryRun: true });
```
