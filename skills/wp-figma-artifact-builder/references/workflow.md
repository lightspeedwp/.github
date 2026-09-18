# Workflow Reference

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

## Intake Fields

Capture these fields when available:

- Project name.
- Target site or repo.
- Target tool: VS Code, Claude Code, Codex, ChatGPT, Figma MCP, GitHub, or mixed.
- Figma source: file URL, node URL, prototype URL, Make URL, screenshot, export, or design-system notes.
- WordPress target: block theme, block plugin, hybrid theme, WooCommerce, publishing workflow, tourism system, or generic site.
- Desired output: plan, prompt pack, file scaffold, issue draft, QA checklist, prototype, or full implementation packet.
- Known constraints: accessibility, performance, SEO, governance, browser support, editor experience, launch deadline, and budget.
- Source confidence: confirmed, inferred, missing, or requires approval.
- Routing status: stay in this skill, route first, route instead, or return from specialist skill.
- Related skill source: the upstream skill name when a PRD, technical brief, audit, task plan, or WordPress asset plan is being assembled into artefacts.

## Routing Check

Before selecting an artefact, decide whether this skill is the right owner.

- **Stay here** when the requested output is an implementation packet, coding-agent prompt, file scaffold, QA checklist, or handoff bundle.
- **Route first** when the user still needs discovery, PRD creation, technical-brief creation, task planning, launch QA planning, parity auditing, or WordPress asset generation.
- **Route instead** when the user is asking another specialist skill to perform the final deliverable, such as creating Figma nodes, generating block patterns, drafting GitHub issues, or auditing launch readiness.
- **Return here** when a specialist output now needs to become consumable files, prompts, checklists, or repo handoff instructions.

Include the routing decision in the final artefact summary so the LightSpeed team can see what has been assembled and what should happen next.

## Artefact Selection

Use the smallest bundle that makes the next action obvious.

### Figma-to-WordPress Packet

Use when a design or design-system source must become implementation work.

Create:

1. Source summary.
2. Figma-to-WordPress mapping table.
3. Theme/plugin boundary decisions.
4. File manifest.
5. Coding-agent prompt.
6. QA checklist.
7. Human approval checkpoints.

### Agent Instruction Pack

Use when the user wants VS Code, Claude, Codex, or a repo agent to behave consistently.

Create one or more of:

- `AGENTS.md` for Codex and general agent rules.
- `CLAUDE.md` for Claude Code.
- `.github/copilot-instructions.md` for VS Code Copilot.
- `.agents/skills/<name>/SKILL.md` for repo-scoped Codex skill instructions.

### WordPress Scaffold

Use when the user needs starter files or file plans.

Create:

- File tree.
- Minimal code snippets only where useful.
- Theme/plugin boundary notes.
- Registration notes.
- Build and verification commands.
- Acceptance criteria.

### Figma MCP Prompt Pack

Use when the user wants to pull design context from Figma or send live UI back to Figma.

Create:

- Design context prompt.
- Node extraction prompt.
- Variables/components prompt.
- Code Connect or component matching prompt.
- UI capture prompt for localhost/staging when supported.
- Fallback screenshot-based prompt when MCP is unavailable.

### QA and Parity Pack

Use when the user needs to validate a design-to-code implementation.

Create:

- Page/template matrix.
- Token parity checks.
- Responsive checks.
- Accessibility checks.
- Editor experience checks.
- Performance checks.
- Launch blocker classification.

## Source Confidence Labels

Use these labels in artefacts:

- Confirmed: directly supported by supplied source material.
- Inferred: reasonable deduction from source material or repo conventions.
- Missing: required input not available.
- Needs approval: decision affects scope, budget, risk, or design intent.

## Default Human Review Gates

Add these gates to implementation packets unless the user asks for a lighter output:

1. Source confirmation gate: Figma and WordPress target confirmed.
2. Scope gate: theme/plugin boundary and file manifest approved.
3. Implementation gate: agent prompt reviewed before running.
4. QA gate: acceptance checks pass locally.
5. Design parity gate: designer or product owner reviews the result.

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
