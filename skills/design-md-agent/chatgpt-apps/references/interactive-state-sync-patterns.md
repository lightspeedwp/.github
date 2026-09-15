# Interactive State Sync Patterns

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
<!-- BADGES-END -->

Use this reference when building ChatGPT apps with long-lived widget state, repeated interactions, or component-initiated tool calls (for example: games, boards, maps, dashboards, editors, or realtime-ish UIs).

Do not load this file for simple read-only render apps unless state sync behavior is part of the task.

## When This Reference Helps

Read this file when the app needs one or more of these patterns:

- Repeated actions that may return similar data (retry, refresh, reset, reroll)
- UI controls that trigger tool calls after the initial render
- Local widget behavior that should also work outside ChatGPT during development
- Multiple tool calls updating one mounted widget over time
- Clear separation between model-visible state and widget-only state

## Reusable Patterns

### 1. Snapshot + Event Token

Return a stable state snapshot in `structuredContent` and add a monotonic event token for repeated actions that may not change other fields.

Examples:

- `stateVersion`
- `refreshCount`
- `resetCount`
- `lastMutationId`

Use this when the widget must detect "same shape, new event" updates reliably.

### 2. Intent-Focused Tool Surface

Prefer small, explicit tools that map to user-visible actions or data operations.

- Keep names action-oriented
- Use enums and bounded schemas where possible
- Avoid kitchen-sink tools that mix unrelated reads and writes

This improves model tool selection and reduces malformed calls.

### 3. Idempotent Handlers (or Explicitly Non-Idempotent)

Design handlers to tolerate retries. If a tool is not idempotent, make the side effect explicit and confirm intent in the flow.

- Reads and pure transforms should usually be idempotent
- Writes should include clear impact hints and current-turn confirmation where needed
- Repeated calls with the same input should not corrupt widget state

### 4. `structuredContent` / `_meta` Partitioning

Partition payloads intentionally:

- `structuredContent`: concise model-visible state the widget also uses
- `content`: short narration/status text
- `_meta`: large maps, caches, or sensitive widget-only hydration data

Keep `structuredContent` small enough for follow-up reasoning and chaining.

### 5. MCP Apps Bridge First, `window.openai` Second

For new scaffolds:

- Prefer MCP Apps bridge notifications and `tools/call` (portable across hosts)
- Use `window.openai` as a compatibility layer plus optional ChatGPT extensions

This keeps the app portable while still enabling ChatGPT-specific capabilities when helpful.

### 6. Component-Initiated Tool Calls Without Remounting

For interactive widgets, allow the UI to call data/action tools directly and update the existing widget state instead of forcing a full re-render/remount every time.

This is especially useful for:

- Refresh
- Retry
- Rerun
- Toggle/filter actions
- Incremental interactions inside one widget session

### 7. Standalone / No-Host Fallback Mode

When feasible, make the widget usable without ChatGPT during development:

- If host APIs are unavailable, apply local state directly
- Preserve basic interactions in a normal browser

This speeds up front-end iteration and reduces dependence on connector setup for every UI tweak.

### 8. Decouple Data Tools from Render Tools (When Complexity Grows)

Use separate data and render tools when the app has multi-step reasoning or frequent updates.

- Data tools fetch/compute/mutate and return reusable `structuredContent`
- Render tools attach the widget template and focus on presentation

This reduces unnecessary remounts and gives the model a chance to refine data before rendering.

## Common Anti-Patterns

- Putting large widget-only blobs into `structuredContent`
- Attaching a widget template to every tool when only one render tool needs it
- Using hidden client-side state as the source of truth for critical actions
- Depending only on `window.openai` APIs for baseline app behavior
- Using ambiguous tool names that do not match user intent

## Example App Types That Benefit From These Patterns

- Multiplayer or turn-based games
- Collaborative boards / task views
- Maps with filters and repeated searches
- Dashboards with refresh and drill-down actions
- Editors or builders with iterative tool calls

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
