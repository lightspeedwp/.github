# Contract: `agents/prd-agent/claude/agent.md`

**Consumer**: Claude Code, when a user copies this file into their repository's `.claude/agents/` directory (FR-002 of this feature) or `.claude/agents/` directly loads it as a subagent definition.

**Format**: Markdown file with YAML frontmatter, body is the system prompt.

## Required frontmatter fields

| Field | Type | Notes |
|---|---|---|
| `name` | string | Subagent identifier; must be unique among a consumer's installed subagents |
| `description` | string | Triggering description — Claude Code uses this to decide when to route to the subagent |
| `tools` | array or string | Tool allowlist; must name only tools the consolidated skill set (post-FR-001–FR-003) actually invokes |
| `model` | string | e.g. `sonnet`, `opus`, `haiku`, or `inherit` |

## Acceptance test (SC-002)

1. Copy the file unmodified into a scratch repository's `.claude/agents/`.
2. Start a Claude Code session in that repository.
3. Confirm the subagent appears as available and its description is legible (not a template placeholder like `[PRINCIPLE_1_NAME]`).

Failure mode this contract exists to prevent: today's `claude/agent.md` does not have real frontmatter, so this step currently fails.
