# Tool Target Guidance

## VS Code

Use VS Code outputs when the user wants local developer execution.

Good outputs:

- Workspace checklist.
- `.github/copilot-instructions.md`.
- File tree and implementation notes.
- Terminal commands.
- Manual QA checklist.

Avoid assuming a specific VS Code extension unless the user names it.

## Claude Code

Use Claude Code outputs when the user wants agentic local coding with a strong repo context file.

Good outputs:

- `CLAUDE.md`.
- A single focused task prompt.
- Files to inspect first.
- Files to avoid touching.
- Test and verification instructions.
- Stop conditions for human approval.

Claude prompts should be explicit about scope boundaries and avoiding broad refactors.

## OpenAI Codex

Use Codex outputs when the user wants a repo-scoped, CLI, IDE, app, or coding-agent workflow.

Good outputs:

- `AGENTS.md`.
- `.agents/skills/<name>/SKILL.md` for repeatable repo-scoped workflows.
- Codex task prompt.
- Verification commands.
- Review checklist.

Codex prompts should front-load objective, files, constraints, and acceptance criteria.

## ChatGPT

Use ChatGPT outputs when the user wants a reviewable planning artefact in the conversation.

Good outputs:

- Markdown implementation packet.
- GitHub-ready issue drafts.
- QA matrices.
- Copy-paste prompt packs.
- Handoff notes.

## Figma MCP

Use Figma MCP outputs when the user wants design context, code context, or canvas updates through an MCP-enabled client.

Good outputs:

- Figma URL or node-specific prompt.
- Variables/components extraction prompt.
- Design-to-code implementation prompt.
- Code-to-canvas or live UI capture prompt when supported.
- Design system alignment checklist.

Fallback when MCP is unavailable:

- Ask for screenshots, Figma exports, variables tables, Dev Mode CSS snippets, or a written design brief.
- Mark the output as approximate until real Figma context is available.
