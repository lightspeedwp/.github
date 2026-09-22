---
name: handle-pr-errors
description: Catches an error from any stage of the PR workflow, categorizes it, assigns a severity, and suggests recovery options and next steps. Use whenever any other pr-agent skill returns or throws an error, to turn it into an actionable recovery response instead of a bare failure.
---

# handle-pr-errors

Handles errors and provides recovery mechanisms for the PR creation workflow.

## When to use this skill

Whenever any other skill in this agent (`validate-branch-name`, `route-pr-template`, `orchestrate-pr-creation`, `validate-and-apply-labels`, `submit-pr`) returns or throws an error — to categorise it and suggest a concrete recovery path rather than surfacing a bare failure.

## Input

```js
{
  error: object,     // { type, message, stage }
  context: object,   // optional: context from the failed operation
  history: array,     // optional: prior attempts, for retry logic
}
```

## Behaviour

- Categorises the error (input validation, branch name, template, GitHub API, authentication, rate limit, unknown).
- Assigns a severity (LOW/MEDIUM/HIGH/CRITICAL).
- Determines whether the error is retryable, capping retries at 3 attempts.
- Provides recovery options and ordered next steps.

## Output

Handled errors include their classification and recovery plan:

```js
{
  handled: true,
  errorCategory: string,
  severity: string,
  originalError: string,
  recoveryOptions: string[],
  recommendedAction: string,
  nextSteps: string[],
  retryable: boolean,
  retryCount: number,
  maxRetries: 3,
}
```

Invalid input and failures caught while handling an error return the same failure shape:

```js
{
  handled: false,
  error: string,
  recoveryOptions: [],
}
```

## Usage

```js
import { handlePrErrors } from './scripts/handle-pr-errors.js';

const result = await handlePrErrors({ error: { message: 'Rate limit exceeded' } });
```

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
