---
name: route-pr-template
description: Selects the correct PR template for a branch based on its type using the static branch-type routing map or an explicit user override. Use once the branch has been validated and before assembling the PR body, to know which template structure to follow.
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
  userSelectedTemplate: string, // optional: explicit user override
}
```

## Behaviour

- Matches the branch type against the static `BRANCH_TYPE_ROUTING` map.
- Uses `userSelectedTemplate` when provided.
- Does not yet load repository template-routing configuration or follow template content verbatim; that guarantee is deferred to T020.

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
