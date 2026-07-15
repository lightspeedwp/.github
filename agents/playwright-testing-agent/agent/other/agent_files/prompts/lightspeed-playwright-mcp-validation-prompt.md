# LightSpeed Playwright MCP Validation Prompt

## Purpose

Use this recurring prompt to verify that the LightSpeed Playwright MCP app is defined correctly across the current agent setup, agent files, and instructions.

## Prompt

Audit this agent's LightSpeed Playwright MCP app setup so the app definition, instructions, starter prompts, validation-facing docs, and any MCP-related references all match the real current configuration.

Primary goal:

- verify that the LightSpeed Playwright MCP app is present and described accurately everywhere it is referenced
- verify that the instructions clearly explain how this MCP should be used in the context of this agent
- identify stale app names, stale MCP wording, missing usage guidance, or misleading references
- leave no blocking ambiguity in the LightSpeed Playwright MCP slice

Scope priorities:

1. agent instructions and any MCP-usage rules
2. attached app/tool references, starter prompts, and validation-facing docs
3. README or prompt-library wording only where it materially affects MCP accuracy
4. only then nearby examples or notes that materially affect truthful MCP guidance

Required working rules:

- Treat the current attached app/tool setup and file tree as source of truth.
- Verify the exact app label and current MCP wording before recommending changes.
- Do not invent MCP capabilities, folders, files, or workflows that are not grounded.
- Keep the pass focused on the LightSpeed Playwright MCP app rather than general app cleanup.
- Preserve the agent's Playwright-testing role and the review-before-code workflow.

During the pass:

- compare the current instructions against the actual LightSpeed Playwright MCP app setup
- verify that MCP usage guidance is clear about when this app should be used and when it should not be the default path
- check for stale app labels, stale MCP references, missing usage boundaries, or conflicting guidance across docs
- verify that starter prompts and validation-facing docs do not overpromise unsupported MCP behaviour
- review app-related README or prompt-library wording only where it materially affects MCP truthfulness

Checks to perform:

- the LightSpeed Playwright MCP app label matches the current attached app/tool setup
- instructions describe the MCP as browser automation and QA support rather than the main cross-browser test runner unless the current setup says otherwise
- instructions explain how the MCP fits alongside Playwright code generation, validation, and review-before-code workflow
- no file claims this MCP replaces the normal validation or spec-generation workflow when it should only support it
- validation-facing docs and prompts do not refer to a missing MCP file, folder, or unsupported app action

Output requirements:

1. short MCP audit summary
2. exact files or agent fields that are inconsistent
3. blocking issues versus non-blocking follow-up opportunities
4. explicit confirmation of whether anything in the LightSpeed Playwright MCP slice remains blocking

Validation expectation:

- Run the documented validation entry point when validation-facing docs or file-quality assets change.
- Keep the pass focused on MCP definition and usage guidance accuracy, not a general rewrite.
