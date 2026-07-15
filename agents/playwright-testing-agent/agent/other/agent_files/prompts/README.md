# Prompts

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

For MCP work, run the LightSpeed Playwright MCP validation prompt first, then use the MCP repair prompt to fix only the grounded issues that validation found.
