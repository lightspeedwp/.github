# Prompts

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Purpose

This folder stores recurring prompts for maintenance passes across the Playwright Testing Agent asset pack.

## Current Prompts

- `routing-validation-cleanup-prompt.md` — focused recurring prompt for tightening routing language, validation guidance, and adjacent consistency notes until the routing/validation slice is no longer blocking.
- `routing-audits-prompt.md` — recurring prompt for auditing route triggers, route boundaries, and mandatory routing language across instructions, references, examples, and validation-adjacent docs.
- `readme-refreshes-prompt.md` — recurring prompt for auditing and updating root and folder README files so they match the latest real file and folder structure.
- `validation-pack-tightening-prompt.md` — umbrella recurring prompt for tightening the full validation layer when a broader pass is still useful.
- `validation-scripts-tightening-prompt.md` — recurring prompt for tightening validator entry points, validator scripts, and script-layer rule wording.
- `validation-docs-tests-tightening-prompt.md` — recurring prompt for tightening validation checklists, tests, pass criteria, and validation-focused markdown.
- `validation-reference-alignment-prompt.md` — recurring prompt for aligning README and reference-layer wording that materially affects validation accuracy.
- `skills-routing-validation-prompt.md` — recurring prompt for validating attached-skill routing, mandatory skill routes, and any skills-directory claims against the real agent setup.
- `skills-routing-repair-prompt.md` — recurring prompt for repairing the skills-routing and skills-directory issues found by the validation pass.
- `lightspeed-playwright-mcp-validation-prompt.md` — recurring prompt for validating that the LightSpeed Playwright MCP app is defined correctly and described accurately across the current agent setup.
- `lightspeed-playwright-mcp-repair-prompt.md` — recurring prompt for repairing LightSpeed Playwright MCP definition and usage-guidance issues found by the validation pass.
- `attached-apps-reference-alignment-prompt.md` — recurring prompt for aligning attached app and tool references across instructions, prompts, and validation-facing docs.
- `starter-prompts-alignment-prompt.md` — recurring prompt for tightening starter prompts so they match the current instructions, tools, skills, and workflows.
- `agent-instructions-drift-audit-prompt.md` — recurring prompt for auditing the instruction system for drift against the current tools, skills, files, and validation workflow.
- `prompt-library-audit-prompt.md` — recurring prompt for auditing the `prompts/` library so prompt names, categories, and usage guidance stay internally consistent.

## Prompt Library

This folder currently includes prompts for:

- routing and validation cleanup
- routing audits
- README refreshes
- validation-pack tightening
- validation scripts tightening
- validation docs and tests tightening
- validation reference alignment
- skills routing validation
- skills routing repair
- LightSpeed Playwright MCP validation
- LightSpeed Playwright MCP repair
- attached apps reference alignment
- starter prompts alignment
- agent instructions drift audit
- prompt library audit

## Authoring Rules

- Keep prompts grounded to the real file tree.
- Prefer narrow, reusable maintenance prompts over one-off task notes.
- Reference current folders and files exactly as they exist.
- Keep prompts conservative when suggesting cleanup or deletion.
- Preserve the agent's Playwright-testing role while improving documentation and validation quality.

## Recommended Usage

Use prompts in this folder when you want a repeatable maintenance pass without rewriting the request from scratch. Start with the prompt that matches the current maintenance slice, then expand only if the adjacent layer would otherwise remain inconsistent or misleading.

For validation work, prefer the smaller validation prompts first. Use the umbrella validation-pack prompt only when you intentionally want a broader cross-layer pass.

For skills work, run the skills-routing validation prompt first, then use the skills-routing repair prompt to fix only the grounded issues that validation found.

For MCP work, run the LightSpeed Playwright MCP validation prompt first, then use the MCP repair prompt to fix only the grounded issues that validation found

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
