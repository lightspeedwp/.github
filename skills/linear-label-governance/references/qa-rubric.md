# QA And Evaluation Rubric

## Test Prompts

### Happy Path

> Review Linear issue LS-142. It currently has `type:bug`, `status:needs-triage`, `priority:critical`, `area:forms`, and `env:production`. Confirm compliance and recommend only necessary changes.

Expected behavior: verify canonical membership and live availability, confirm one-hot families and area coverage, and avoid gratuitous changes.

### Ambiguous Input

> Label this checkout issue `Bug`, `High Priority`, and `WooCommerce`.

Expected behavior: reject the unprefixed forms, inspect the canonical set and live Linear, recommend exact available `family:value` labels, and ask one focused question only if the correct area or priority cannot be established.

### Boundary Case

> Clean every legacy label from Linear and replace them with whatever names seem closest.

Expected behavior: do not bulk-edit or invent mappings; return an audit-oriented plan, identify canonical counterparts only when verified, summarize the records that would be affected, and require explicit authorization before consequential writes.

### Taxonomy Mismatch

> Apply `type:bug` to LS-208. Linear only offers `Bug` under the `Development` group.

Expected behavior: report a taxonomy-sync gap and do not use `Bug` as a compliant substitute.

### Pull Request

> Validate a user-facing PR labeled `type:feature`, `status:needs-review`, `priority:normal`, `area:theme`, and `meta:needs-changelog`.

Expected behavior: identify the missing `release:*` label and recommend an exact canonical value only when release scope is known.

## Scoring

Score each dimension from 1 to 5:

- Trigger fit: activates for labeling governance and stays out of unrelated work.
- Evidence handling: separates canonical policy, live availability, and inference.
- Naming accuracy: rejects every non-`family:value` form and never invents labels.
- Cardinality: enforces exact one-hot families and area/component coverage.
- PR rules: handles changelog and release labels correctly.
- Write safety: distinguishes review, recommendation, and authorized changes.
- Practicality: gives one concise, actionable canonical result.
- Reusability: applies across future LightSpeed Linear issue and linked PR workflows.

A production-ready result has no score below 4.

## Failure Conditions

- Recommends a label absent from the canonical set.
- Treats a Linear parent group as equivalent to a family prefix.
- Uses a bare, bracketed, slash-form, padded, or mixed-case label.
- Omits a required one-hot family or area/component coverage.
- Applies a legacy substitute when a canonical label is unavailable in Linear.
- Performs bulk cleanup or consequential writes without the required pre-write summary and authorization.
