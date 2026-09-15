# Upstream Example Workflow

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Load this reference when starting a greenfield ChatGPT app or when deciding whether to adapt an upstream example or use the local fallback scaffold.

## Default Order

Prefer these starting points in order:

1. Official OpenAI Apps SDK examples
2. Version-matched `@modelcontextprotocol/ext-apps` examples
3. Local `scripts/scaffold_node_ext_apps.mjs` fallback

This keeps the skill aligned with current docs and maintained example code while still preserving a low-dependency fallback when examples are not a good fit.

## Choose The Right Source

### 1. Official OpenAI examples

Prefer these when:

- The app is clearly ChatGPT-facing
- The user wants a polished UI or React component
- The task involves file upload, modal flows, display-mode changes, or other ChatGPT extensions
- The docs/examples page already shows a similar interaction pattern

Typical sources:

- `https://developers.openai.com/apps-sdk/build/examples/`
- `https://github.com/openai/openai-apps-sdk-examples`
- `https://developers.openai.com/apps-sdk/quickstart/` for the smallest vanilla baseline

### 2. `@modelcontextprotocol/ext-apps` examples

Prefer these when:

- The user needs a lower-level MCP Apps baseline
- Portability across MCP Apps-compatible hosts matters more than ChatGPT-specific polish
- You want version-matched examples close to the installed `@modelcontextprotocol/ext-apps` package shape

This follows the same basic idea as the upstream `create-mcp-app` skill: use maintained examples as the starting point, then adapt them.

Typical examples from upstream flows:

- `examples/demo-vanilla-html`
- `examples/demo-react-simple`
- `examples/demo-connectors-api`

### 3. Local fallback scaffold

Use `scripts/scaffold_node_ext_apps.mjs` when:

- No close upstream example exists
- The user wants a tiny Node + vanilla HTML starter
- Network/example retrieval is undesirable
- You need a throwaway starter to patch quickly during a live coding task

Do not prefer the local scaffold just because it is available. It is the fallback, not the default.

## Adaptation Rules

- Copy the smallest matching example, not the entire showcase app.
- Remove unrelated demo tools, assets, and routes immediately.
- Keep the upstream file structure when it is already clean and docs-aligned.
- Reconcile the copied example with the current docs before finishing:
  - tool names and descriptions
  - annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`, `idempotentHint` when true)
  - `_meta.ui.resourceUri` and optional `_meta["openai/outputTemplate"]`
  - resource `_meta.ui.csp`, `_meta.ui.domain`, and `openai/widgetDescription`
  - URI versioning for template changes
  - local run/test instructions
- State which example you chose and why.
- If you rely on upstream code, note the source repo and branch/tag/commit when practical; avoid silently depending on a floating example shape for long-lived work.

## Minimal Selection Heuristic

- If the user asks for **React + polished UI**, start with official OpenAI examples.
- If the user asks for **vanilla HTML + tiny demo**, start with the quickstart example; use the local fallback scaffold only if the quickstart is still too opinionated or unavailable.
- If the user asks for **portable MCP Apps wiring**, start with `@modelcontextprotocol/ext-apps` examples.
- If the user already has an app, adapt their code directly instead of importing a new example.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
