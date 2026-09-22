---
name: validate-branch-name
description: Validates that a branch name follows the {type}/{scope}-{short-title} convention, rejects forbidden prefixes (claude/, bot/, automated/), and checks the type against the repository's canonical list. Use before creating or updating a PR, whenever a branch name needs checking against this repository's branching convention.
---

# validate-branch-name

Validates a branch name follows `{type}/{scope}-{short-title}` format.

## When to use this skill

Before any PR is created or updated, and whenever a branch name needs to be checked against this repository's branching convention (e.g. `docs/BRANCHING_STRATEGY.md`).

## Input

```js
{
  branchName: string,   // e.g. "feat/pr-agent-consolidation-portability"
  config: object,       // optional: override allowed types through config.allowed_types only
}
```

## Behaviour

- Rejects branch names using a forbidden prefix (`claude/`, `bot/`, `automated/`).
- Rejects a branch type not in the repository's approved-type list.
- Rejects a name that doesn't match `{type}/{scope}-{short-title}`.

## Output

```js
{ valid: boolean, errors: string[] }
```

## Usage

```js
import { validateBranchName } from "./scripts/validate-branch-name.js";

const result = await validateBranchName({ branchName: "feat/my-feature" });
```
