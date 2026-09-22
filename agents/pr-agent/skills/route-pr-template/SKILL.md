---
name: route-pr-template
description: Selects the correct PR template for a branch based on its type, honouring the repository's own template-routing configuration and any explicit user override. Use once the branch has been validated and before assembling the PR body, to know which template structure to follow.
---

# route-pr-template

Routes a pull request to the correct template based on branch type.

## When to use this skill

After `validate-branch-name` confirms the branch name, and before `orchestrate-pr-creation` assembles the PR body — to determine which template structure the PR body must follow.

## Input

```js
{
  branchName: string,          // full branch name, e.g. "feat/new-feature"
  branchType: string,          // alternative: just the type, e.g. "feat"
  config: object,               // optional: routing configuration override
  userSelectedTemplate: string, // optional: explicit user override
}
```

## Behaviour

- Honours a repository's own PR-template routing configuration (e.g. `.github/PULL_REQUEST_TEMPLATE/config.yml`) where one exists.
- Falls back to a standard description structure when no routing configuration exists.
- Never applies a template-suggested label absent from the repository's real label set.

## Output

Matched routes and user overrides return:

```js
{
  routed: true,
  template: string,
  reason: string,
  fallback: false,
  userOverride?: true,
}
```

Invalid input and unknown branch types use the fallback template and include a warning:

```js
{
  routed: false,
  template: "pr_feature.md",
  reason: "invalid-input" | "unknown-branch-type",
  fallback: true,
  warning: string,
}
```

## Usage

```js
import { routePrTemplate } from './scripts/route-pr-template.js';

const result = await routePrTemplate({ branchName: 'feat/new-feature' });
```
