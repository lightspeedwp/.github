# Scenario Challenges

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Present these as real-world situations. Ask the user what commands/shortcuts they'd use.
Use `ask_user` with choices for each step.

## Scenario 1: Hotfix Review Under Pressure
>
> A production bug fix is ready. You need to inspect the diff, run code review, and keep sensitive data hidden because you're on a livestream.

**Answer:** `/streamer-mode` → `/diff` → `/review @src/payment.ts`

## Scenario 2: Context Window Rescue
>
> Your session is huge and model quality is dropping. Keep continuity while shrinking noise.

**Answer:** `/context` → `/compact` → `/resume` (or restart with `--continue`)

## Scenario 3: Autonomous Refactor Sprint
>
> You want an agent to execute a refactor with minimal prompts, but only after reviewing a plan and setting permissions.

**Answer:** `Shift+Tab` (Plan mode) → validate plan → `/allow-all` → execute in Autopilot mode

## Scenario 4: Enterprise Onboarding
>
> Set up custom agents, repo instructions, and MCP integration for a new team repository.

**Answer:** Add agent profiles to `.github/agents/`, verify `/instructions`, then `/mcp add`

## Scenario 5: Power Editing Session
>
> You're crafting a long prompt and need to edit quickly without losing context.

**Answer:** `Ctrl+G` (open in editor), `Ctrl+A` (jump to start), `Ctrl+K` (trim)

## Scenario 6: Agent Orchestration
>
> You're leading a complex project: understand code, run tests, refactor, then review.

**Answer:** `explore` agent (understand) → `task` agent (tests) → `general-purpose` (refactor) → `code-review` (verify)

## Scenario 7: New Project Setup
>
> You cloned a new repo and need to set up Copilot CLI for max productivity.

**Answer:** `/init` → `/model` → `/mcp add` (if needed) → `Shift+Tab` to Plan mode for first task

## Scenario 8: Production Safety
>
> Switching from boilerplate work to production deployment scripts.

**Answer:** `/reset-allowed-tools` → Plan mode → `/review` before every commit

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
