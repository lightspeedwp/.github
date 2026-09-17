---
title: Claude Code Setup Guide
description: Install and configure the PRD agent as a Claude Code subagent
created: 2026-09-17
---

# Claude Code Setup Guide

This guide walks you through installing and configuring the consolidated PRD agent for use in Claude Code.

## Overview

Claude Code is Anthropic's official CLI for Claude, available as a desktop app, web interface, or IDE extension (VS Code, JetBrains). The PRD agent is available as a **portable subagent** that you can load into any Claude Code session.

**Recommended for:**

- Individual developers and designers
- Cross-platform teams (works on Mac, Windows, Linux)
- Teams without GitHub Copilot/OpenAI licenses
- Maximum flexibility and customisation

## Prerequisites

- Claude Code installed ([claude.ai/code](https://claude.ai/code) or desktop app)
- Access to the LightSpeed .github repository
- Basic familiarity with Claude Code (optional, but helpful)

## Installation Steps

### Step 1: Locate the Agent File

The PRD agent specification is stored in the LightSpeed .github repository:

```
agents/prd-agent/claude/agent.md
```

**Repository**: <https://github.com/lightspeedwp/.github>  
**Branch**: `develop` (or latest)

### Step 2: Copy the Agent to Your Repository

1. **In your project repository**, create the directory if it doesn't exist:

   ```bash
   mkdir -p .claude/agents
   ```

2. **Copy the agent file** from the LightSpeed repository:

   ```bash
   curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/claude/agent.md \
     -o .claude/agents/prd-agent.md
   ```

   Or, **manually copy-paste**:
   - Open [`agents/prd-agent/claude/agent.md`](https://github.com/lightspeedwp/.github/blob/develop/agents/prd-agent/claude/agent.md) in the .github repository
   - Copy the entire file contents
   - Create `.claude/agents/prd-agent.md` in your project and paste

3. **Commit the file** to your repository:

   ```bash
   git add .claude/agents/prd-agent.md
   git commit -m "feat: add PRD agent subagent configuration"
   git push
   ```

### Step 3: Load the Agent in Claude Code

1. **Open Claude Code** in your project directory
2. **Type the agent invocation**:

   ```
   /prd-agent
   ```

   Or reference it by path:

   ```
   /agents:prd-agent
   ```

3. **Claude Code loads the agent** and displays its capabilities

### Step 4: Verify Installation

You should see:

- Agent name: "PRD Agent"
- Agent description: "Consolidated PRD generation agent"
- Available commands and tools
- Confirmation that the agent initialized without errors

If you see errors about missing tools or invalid configuration, see [Troubleshooting](#troubleshooting) below.

## Using the PRD Agent

Once loaded, invoke the agent with your PRD request:

```
/prd-agent
Write a PRD for a new user authentication system with role-based access control.
```

Or use it in a conversation:

```
I need a PRD for [feature description]. Can you generate one?
```

The agent will guide you through PRD creation, asking clarifying questions and producing a structured output.

## Configuration & Customisation

### Modifying the Agent (Optional)

You can customise the agent's behaviour by editing `.claude/agents/prd-agent.md`:

1. **Edit the agent prompt** to adjust tone, detail level, or output structure
2. **Add custom tools** if you want integration with your internal systems
3. **Change the model** (default: `claude-opus-4-1`) to use a different Claude version

After editing, the changes apply immediately in new Claude Code sessions.

**Warning**: Be careful when editing the agent prompt — changing core instructions may affect output quality. See [best practices](./best-practices.md) if you customise the prompt.

### Updating to Latest Version

The PRD agent is updated periodically. To get the latest version:

```bash
# Remove old version
rm .claude/agents/prd-agent.md

# Download latest
curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/claude/agent.md \
  -o .claude/agents/prd-agent.md

# Commit and push
git add .claude/agents/prd-agent.md
git commit -m "chore: update PRD agent to latest version"
git push
```

Subscribe to the [LightSpeed .github releases](https://github.com/lightspeedwp/.github/releases) to be notified of updates.

## Troubleshooting

### "Agent not found" or "Invalid agent configuration"

**Problem**: Claude Code can't load the agent.

**Solutions**:

1. Verify `.claude/agents/prd-agent.md` exists and is readable
2. Check the file syntax — make sure you copied it completely (no truncation)
3. Look for parse errors in the agent's YAML frontmatter
4. If you edited the agent, undo your changes and re-download the original
5. Restart Claude Code and try again

### "Tool unavailable" or "Tool not found"

**Problem**: The agent loaded but says its tools are missing.

**Solutions**:

1. Claude Code requires certain tools to be available in your session
2. Check the `tools:` section in `.claude/agents/prd-agent.md`
3. Most tools are built-in to Claude Code; no additional setup needed
4. If you see external tool errors, see the [Integration Guide](./integration-guide.md)

### Agent responses are poor quality or incomplete

**Problem**: The PRD output is vague, missing sections, or doesn't match expectations.

**Solutions**:

1. Check [best practices](./best-practices.md) for PRD quality guidelines
2. Review your input prompt — give the agent as much context as possible (user personas, constraints, example outputs, etc.)
3. Try again with more specific details
4. If consistently poor, your project might benefit from a custom agent prompt — see [Customisation](#configuration--customisation)

### How do I use this with my IDE?

Claude Code extensions are available for:

- VS Code ([install](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-dev))
- JetBrains IDEs ([install](https://plugins.jetbrains.com/plugin/22161-claude))

Once installed, the agent works the same way — just invoke `/prd-agent` in the Claude panel.

### Can I use this agent across multiple projects?

**Yes.** You have two options:

1. **Copy the agent to each project** (recommended for version control and project-specific customisation)
2. **Reference it globally** if you set up a shared `.claude/agents/` directory (advanced setup)

Most teams prefer option 1 — it keeps each project's configuration self-contained.

## Security & Privacy

- The agent runs **locally in your Claude Code session** — no PRD content is stored externally
- Your project files and PRD content are only sent to Claude's API for processing
- Sensitive information (API keys, credentials) should never be included in PRDs — use placeholder names instead
- See [LightSpeed security policy](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md) for more details

## Next Steps

- **Create your first PRD**: See [Workflow](./workflow.md)
- **Learn best practices**: See [Best Practices](./best-practices.md)
- **Feed PRDs into your tools**: See [Integration Guide](./integration-guide.md)
- **Questions?** See [FAQ](./faq.md)

---

**Last Updated**: 2026-09-17  
**Platform**: Claude Code (all versions)  
**Agent Version**: v2.1  
**Questions?** Open an issue: [lightspeedwp/.github](https://github.com/lightspeedwp/.github/issues)
