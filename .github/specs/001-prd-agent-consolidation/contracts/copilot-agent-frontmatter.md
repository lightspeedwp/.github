# Contract: `agents/prd-agent/copilot/agent.md`

**Consumer**: GitHub Copilot custom agents, when a user copies this file into their repository's `.github/agents/` directory (FR-002 of this feature). Also the eventual replacement for `agents/mode-prd.agent.md` per FR-010.

**Format**: Markdown file with YAML frontmatter, body is the agent instructions.

## Required frontmatter fields

| Field | Type | Notes |
|---|---|---|
| `name` | string | Custom agent identifier |
| `description` | string | Triggering description shown to the user when selecting an agent |
| `tools` | array | Tool allowlist |
| `mcp-servers` | array | Required if the agent depends on any MCP server integration; per research.md D1, only Linear, Google Workspace, and GitHub are real/plugin-backed — Figma and Slack must NOT be listed here unless a real plugin config exists for them |

## Acceptance test (SC-003)

1. Copy the file unmodified into a scratch repository's `.github/agents/`.
2. Confirm GitHub Copilot recognises it as a valid custom agent (per [docs.github.com custom-agents-configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)).
3. Confirm no MCP server is listed that isn't backed by a real plugin (cross-check against research.md D1's finding on Figma/Slack).

Failure mode this contract exists to prevent: today's `copilot/agent.md` does not have real frontmatter, so this step currently fails; and `agents/mode-prd.agent.md` (the file this eventually replaces) is still referenced by a live memory-registry entry that must be updated in the same change (see `memory-registry-entry.md`).
