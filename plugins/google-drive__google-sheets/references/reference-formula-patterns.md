# Formula Patterns

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

When to read: when the formula itself is the task.

Use this reference before drafting the first formula.
The point is to refresh exact syntax, formula-shape choices, and rollout discipline before writing.

## Workflow

1. Ground the formula in the live sheet first: exact input columns, target output cell or column, and a few representative rows.
2. Choose the formula shape deliberately:
   - row formula when the logic is local to one row and should copy down
   - spill formula when one formula should populate a whole output range
   - lookup formula when the task is key-to-value retrieval
   - filter/query formula when the task is to derive a subset or summary table
   - named function only when the same logic is conceptually reusable
3. Draft the formula in one helper cell or a scratch location first.
4. Test on a small representative slice, including likely edge cases.
5. Iterate until the sample output is correct, then roll the formula out to the intended target range.

## Output Conventions

- Name the exact target cell or output column.
- Return the final formula exactly as it should be entered.
- If rollout matters, say whether the formula should be filled down, spilled from one anchor cell, or turned into a named function.

## Formula Shape Heuristics

- Use a row formula when the logic is evaluated row-by-row and should be copied down.
- Use a spill formula when one anchor cell should populate the whole output region.
- Prefer `XLOOKUP` for straightforward exact lookups when available.
- If using `VLOOKUP`, explicitly pass `FALSE` for exact match behavior.
- Use `FILTER` when the output should be the original rows or columns that satisfy conditions.
- Use a named function when the same formula pattern should be reused semantically, not just copied.
- Use `MAP` with `LAMBDA` when you need per-item transformation logic that would be awkward as a plain spill formula.

## High-Value Syntax Reminders

### ARRAYFORMULA

- Official doc: <https://support.google.com/docs/answer/3093275?hl=en>
- Google notes that many array formulas automatically expand into neighboring cells, so explicit `ARRAYFORMULA` is not always required.
- Good when one anchor formula should fill an output column.

Example:

```gs
=ARRAYFORMULA(IF(A2:A="", "", IF(E2:E>=90, "On track", "At risk")))
```

### FILTER

- Official doc: <https://support.google.com/docs/answer/3093197?hl=en>
- Conditions must match the length of the filtered range.
- Google notes that you cannot mix row conditions and column conditions in the same `FILTER`.
- If no values satisfy the conditions, Google returns `#N/A`.

Example:

```gs
=FILTER(A2:D, D2:D="Open", A2:A<>"")
```

### XLOOKUP

- Official doc: <https://support.google.com/docs/answer/12405947?hl=en>
- `lookup_range` must be a single row or column.
- `result_range` should have the same row or column size as the lookup range.
- Use `missing_value` when you want a cleaner fallback than raw `#N/A`.

Example:

```gs
=XLOOKUP(A2, Lookup!A:A, Lookup!D:D, "")
```

### VLOOKUP

- Official doc: <https://support.google.com/docs/answer/3093318?hl=en>
- Google strongly recommends using `FALSE` for `is_sorted` for more predictable exact-match behavior.
- The search key must be in the first column of the lookup range.
- If you need a friendlier fallback, wrap with `IFNA` or `IFERROR`.

Example:

```gs
=IFNA(VLOOKUP(A2, Lookup!A:D, 4, FALSE), "")
```

### MAP

- Official doc: <https://support.google.com/docs/answer/12568985?hl=en>
- The `LAMBDA` must accept exactly as many names as the number of input arrays.
- Each mapped value must resolve to a single value, not another array.
- Useful for per-item transformations that are more expressive than a plain copied formula.

Example:

```gs
=MAP(A2:A, LAMBDA(item, JOIN("-", SPLIT(item, ","))))
```

### Named Functions

- Official doc: <https://support.google.com/docs/answer/12504534?hl=en>
- Named functions are appropriate when the formula pattern should be reused conceptually across a sheet or across files.
- Google requires placeholder names rather than A1-style references for function arguments.

## Practical Rollout Pattern

1. Draft in one helper cell or scratch column.
2. Test on representative rows, including blanks, missing lookups, and unusual values.
3. Decide whether the final rollout should be copy-down, spill-from-anchor, or named-function-based.
4. Only then replace the target formula region.

## Official References

- Google Sheets function list: <https://support.google.com/docs/table/25273?hl=en>
- ARRAYFORMULA: <https://support.google.com/docs/answer/3093275?hl=en>
- FILTER: <https://support.google.com/docs/answer/3093197?hl=en>
- XLOOKUP: <https://support.google.com/docs/answer/12405947?hl=en>
- VLOOKUP: <https://support.google.com/docs/answer/3093318?hl=en>
- MAP: <https://support.google.com/docs/answer/12568985?hl=en>
- Named functions: <https://support.google.com/docs/answer/12504534?hl=en>

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
