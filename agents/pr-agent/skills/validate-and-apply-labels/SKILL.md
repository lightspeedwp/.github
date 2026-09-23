---
name: validate-and-apply-labels
description: Maps branch types to labels and validates them against built-in defaults or a caller-supplied canonical set, including exactly one changelog-decision label. Use before submission to check the currently assembled labels.
---

# validate-and-apply-labels

Validates GitHub labels against the canonical set and maps branch type to labels.

## When to use this skill

Before `submit-pr`, to apply the current branch-type mapping, validate label shape or membership against the available policy, and confirm exactly one changelog-decision label is present.

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
- In direct-validation mode, checks labels against the built-in canonical set.
- In branch-mapping mode, uses `config.canonicalLabels` when supplied; otherwise it accepts built-in labels and well-formed supported-family labels.
- Ensures exactly one changelog-decision label is present, never zero or two.
- Does not yet fetch the repository's live label set or apply labels atomically with PR submission; those guarantees are deferred to T021.

## Output

Branch-type mapping returns the applied labels and any mapping validation errors:

```js
{
  valid: boolean,
  appliedLabels: string[],
  branchType: string,
  templateFile: string,
  validationErrors: string[],
  warnings: string[],
  deduplicatedCount: number,
  metadata: {
    typeLabels: string[],
    contextLabels: string[],
    totalLabels: number,
  },
}
```

Invalid branch-type mapping input omits `templateFile`, deduplication data, and metadata:

```js
{
  valid: false,
  error: string,
  appliedLabels: [],
  branchType: unknown,
  validationErrors: [],
  warnings: [],
}
```

Direct label validation returns label-specific errors and may identify invalid or conflicting labels:

```js
{
  valid: boolean,
  appliedLabels: string[],
  errors: string[] | undefined,
  deduplicatedCount: number,
  validationErrors: string[],
  warnings: string[],
  invalidLabels?: unknown[],
  conflicts?: Array<{ family: string, labels: string[] }>,
}
```

## Usage

```js
import { validateAndApplyLabels } from './scripts/validate-and-apply-labels.js';

const result = await validateAndApplyLabels({
  labels: ['meta:no-changelog'],
  branchType: 'feat',
  templateFile: 'pr_feature.md',
});
```
