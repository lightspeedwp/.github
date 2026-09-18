# Step 5: Apply fixes

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

Sub-agent type: `general-purpose`, **one sub-agent per finding**,
parallel **max 5 concurrent**; budget: 5 min each. If step 4 returned
more than 5 `fix` rows, the parent runs step 5 in waves of ≤5.

## Inputs

Per sub-agent (one finding per invocation):

- `thread_id`, `file`, `line` from step 3.
- The finding `summary` and Copilot's suggested fix (if any).
- The triage `rationale` from step 4 — the agent already decided this
  is a `fix`; this sub-agent only implements it.

## Return contract

```
{ thread_id, files_touched, summary, status }
```

Where `status` ∈ `complete` | `partial` | `blocked` and `summary` is
a one-line description of the change.

## Procedure

1. **Discover repo conventions for the area being edited — first.**
   Before writing any code, read:
   - `.github/instructions/*.md` whose `applyTo` glob matches the
     file's path,
   - `.github/skills/`,
   - `AGENTS.md`,
   - `CONTRIBUTING.md`,
   - neighbor-file patterns in the same directory and recent commits
     touching similar files.
2. Apply the fix in line with those conventions.
3. Return `files_touched` + a one-line `summary` + `status`.

## Gotchas

- **Max 5 concurrent fix sub-agents.** The cap prevents fix-fanout
  chaos; the parent merges results and reconciles file conflicts
  between waves before step 6.
- **Never invent a generic answer that contradicts repo practice.**
  That's the "elephant in school" anti-pattern — a Copilot suggestion
  in isolation looks right but breaks the project's lint, format,
  spell-check, license-header, or framework conventions. The
  discovery step is mandatory, not optional.
- **One finding per sub-agent.** Fixes that need to touch the same
  file get serialized by the parent between waves — don't merge
  multiple findings into one sub-agent invocation.
- **Project policy beats Copilot suggestion.** If discovery surfaces
  a documented convention (spell-check allowlist mechanism, lint
  suppression style, etc.) that contradicts the suggested fix, follow
  the convention and reflect that in the reply body drafted in step 8
  (see [04-triage.md](04-triage.md#project-specific-policy-hooks)).
- **Push back with written rationale** if implementing the fix would
  over-engineer the design for a hypothetical edge case — flip the
  triage to `decline` and return `status: blocked` with the rationale
  so step 8 drafts the right reply.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
