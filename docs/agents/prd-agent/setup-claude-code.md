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

### Step 3: Invoke Skills from the Agent in Claude Code

Once the agent file is in place, you can invoke individual skills from the consolidated PRD agent in Claude Code.

**Available skills:**

- `/prd-writer` — Create and edit PRD documents
- `/project-researcher` — Research and gather product context
- `/feature-prioritizer` — Prioritize features using impact/effort matrices
- `/user-story-generator` — Generate user stories with acceptance criteria
- `/requirements-traceability-mapper` — Link requirements to implementation
- `/delivery-planner` — Plan releases and milestones
- `/implementation-plan-generator` — Create technical implementation plans
- `/acceptance-test-planner` — Define testable acceptance criteria

For example, to create a PRD:

```
/prd-writer
Write a PRD for a new user authentication system
```

### Step 4: Verify Installation

Test one of the agent's skills to verify installation:

```
/prd-writer
Hello, I want to create a PRD for a new feature.
```

You should see:

- The skill initializes without errors
- The skill responds and is ready to help with PRD creation
- You can follow its prompts to create a structured PRD

If you see "Skill not found" or other errors, see [Troubleshooting](#troubleshooting) below.

## Using the PRD Agent Skills

Once the agent is installed, you can invoke specific skills from the consolidated PRD agent:

**To create a new PRD:**

```
/prd-writer
Write a PRD for a new user authentication system with role-based access control.
```

**To gather context and requirements:**

```
/project-researcher
Research the existing user authentication system and competitive landscape.
```

**To prioritize features:**

```
/feature-prioritizer
Help me prioritize features for our Q4 roadmap.
```

You can also use the skills in natural conversations — the skills will guide you through PRD creation, asking clarifying questions and producing structured output.

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

### "Skill not found" or "Invalid skill configuration"

**Problem**: Claude Code can't load one of the PRD agent skills.

**Solutions**:

1. Verify `.claude/agents/prd-agent.md` exists and is readable
2. Check the file syntax — make sure you copied it completely (no truncation)
3. Look for parse errors in the agent's YAML frontmatter
4. Make sure the skill name is correct (e.g., `/prd-writer`, not `/prd_writer`)
5. Restart Claude Code and try again
6. Try a different skill (e.g., `/project-researcher`) to isolate the issue

### "Tool unavailable" or "Integration error"

**Problem**: A skill loaded but reports missing integrations or external tool errors.

**Solutions**:

1. Some PRD agent skills integrate with external services (Linear, GitHub, Google Workspace)
2. Verify you have access to the required integrations
3. Check the skill description for its specific requirements
4. If using advanced integration features, see the [Integration Guide](./integration-guide.md)

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
