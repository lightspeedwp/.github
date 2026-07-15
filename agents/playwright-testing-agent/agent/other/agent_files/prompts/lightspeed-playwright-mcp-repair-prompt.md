# LightSpeed Playwright MCP Repair Prompt

## Purpose

Use this recurring prompt after an MCP audit to repair LightSpeed Playwright MCP definition or usage-guidance issues found in the current agent setup.

## Prompt

Repair this agent's LightSpeed Playwright MCP definition and usage-guidance issues using the findings from the latest MCP validation pass.

Primary goal:

- fix blocking mismatches between the attached LightSpeed Playwright MCP app, the instructions, starter prompts, and validation-facing docs
- make MCP usage guidance truthful, clear, and grounded to the real current setup
- leave no blocking LightSpeed Playwright MCP issue unresolved

Scope priorities:

1. blocking instruction and usage-guidance fixes
2. starter prompt and validation-doc fixes that must change to match the repaired MCP guidance
3. README or prompt-library wording only where it would otherwise remain misleading
4. only then nearby notes that materially affect MCP truthfulness

Required working rules:

- Start from the actual findings of the MCP validation pass.
- Treat the current attached app/tool setup and file tree as source of truth.
- Prefer the smallest grounded repair that resolves the mismatch.
- Do not invent new MCP capabilities, files, folders, or workflows that are not grounded.
- Preserve the agent's Playwright-testing role and review-before-code workflow.

During the pass:

- fix stale or conflicting LightSpeed Playwright MCP labels in instructions and docs
- strengthen MCP usage guidance where the current instructions are too vague about when to use it
- remove wording that incorrectly treats the MCP as the main execution path when it should only support browser exploration, debugging, or QA assistance
- align starter prompts and validation-facing docs to the repaired MCP guidance
- keep unrelated app cleanup out of scope unless it would leave the MCP slice misleading

Output requirements:

1. short repair summary
2. exact files or agent fields updated
3. any remaining non-blocking follow-up opportunities
4. explicit confirmation that no blocking LightSpeed Playwright MCP issue remains

Validation expectation:

- Run the documented validation entry point when validation-facing docs or file-quality assets change.
- Re-check the repaired MCP slice before finalising.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
