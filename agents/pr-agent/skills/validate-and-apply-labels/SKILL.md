---
name: validate-and-apply-labels
description: Validates labels against the repository's real canonical label set and maps branch type to its required labels, including exactly one changelog-decision label. Use before submission, to make sure every label on a PR is valid and nothing required (like the changelog-decision label) is missing.
---

# validate-and-apply-labels

Validates GitHub labels against the canonical set and maps branch type to labels.

## When to use this skill

Before `submit-pr`, to confirm every label attached to the PR is real (exists in this repository's canonical set) and that branch-type-required labels — including exactly one changelog-decision label — are present.

## Input

```js
{
  labels: string[],      // e.g. ["type:feature", "area:agents"]
  branchType: string,    // optional: for conditional labels
  templateFile: string,  // optional: PR template file
  config: object,        // optional
  mockGitHub: object,    // optional: for testing
}
```

## Behaviour

- Rejects a bare label without its required family prefix (e.g. `bug` instead of `type:bug`).
- Rejects a label not present in the repository's real canonical label set — never invents one.
- Ensures exactly one changelog-decision label is present, never zero or two.

## Output

```js
{ valid: boolean, labels: string[], errors: string[] }
```

## Usage

```js
import { validateAndApplyLabels } from "./scripts/validate-and-apply-labels.js";

const result = await validateAndApplyLabels({ labels: ["type:feature"], branchType: "feat" });
```
