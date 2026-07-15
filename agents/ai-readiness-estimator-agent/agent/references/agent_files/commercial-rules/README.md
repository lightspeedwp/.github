# Commercial Rules Control File

Use this file before opening any other file in `commercial-rules/`.

## Purpose

This folder contains the commercial guardrails that control whether a scoped recommendation can be treated as fixed-fee, provisional, approval-dependent, add-on-supported, or custom-scope.

## File Routing

### `pricing-rules.md`
Use when deciding whether pricing can be presented as fixed-fee, provisional, audit-first, or custom-scope.

### `package-thresholds.md`
Use when the task depends on package size, scale, or threshold boundaries that affect standard-scope fit.

### `addon-rules.md`
Use when checking whether an add-on is commercially valid after the base package is chosen.

### `custom-scope-triggers.md`
Use when checking whether the audit findings force escalation out of standard package scope.

### `approval-rules.md`
Use when the task requires approval logic, sign-off conditions, or commercial confirmation steps before final recommendation.

## Usage Rule

Do not treat any price or scope as final until the relevant commercial rule files confirm that the package path still fits standard scope.
