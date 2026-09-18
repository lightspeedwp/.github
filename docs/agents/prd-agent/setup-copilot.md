---
title: GitHub Copilot Setup Guide
description: Integrate the PRD agent as a GitHub Copilot custom agent
created: 2026-09-17
---

# GitHub Copilot Setup Guide

This guide walks you through integrating the consolidated PRD agent as a custom GitHub Copilot agent in your organisation's .github control plane.

## Overview

GitHub Copilot allows custom agents to be defined in your `.github/agents/` directory and used across your organisation. The PRD agent is available as a **spec-based custom agent** optimised for Copilot workflows.

**Recommended for:**

- Teams with GitHub Copilot Enterprise licenses
- Organisations managing agents centrally via `.github` repository
- Copilot-native workflows (VS Code, JetBrains, Web)
- Standardised agent availability across all team repositories

## Prerequisites

- GitHub Copilot Enterprise license (or Copilot Free/Pro for personal use)
- Administrator access to your `.github` repository
- VS Code, JetBrains IDE, or GitHub Copilot web interface
- Basic familiarity with `.github/agents/` directory structure

## Installation Steps

### Step 1: Locate the Agent File

The PRD agent spec-based definition is stored in:

```
agents/prd-agent/copilot/agent.md
```

**Repository**: <https://github.com/lightspeedwp/.github>  
**Branch**: `develop` (or latest)

This is the Copilot-native version of the agent, optimised for GitHub's control plane and Copilot integration.

### Step 2: Add the Agent to Your Repository

You can add the PRD agent at either organisation or project level:

**Option A: Organisation-wide (recommended)**

1. **In your organisation's `.github` repository**, create or navigate to:

   ```
   .github/agents/
   ```

   This makes the agent available across all repositories in your organisation.

**Option B: Project-level**

1. **In your project repository**, create or navigate to:

   ```
   .github/agents/
   ```

   This makes the agent available only within that specific project.

**Installation (both options use the same path):**

1. **Copy the agent file**:

   ```bash
   curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/copilot/agent.md \
     -o .github/agents/prd-agent.md
   ```

   Or, **manually copy-paste**:
   - Open [`agents/prd-agent/copilot/agent.md`](https://github.com/lightspeedwp/.github/blob/develop/agents/prd-agent/copilot/agent.md) in the .github repository
   - Copy the entire file contents
   - Create `.github/agents/prd-agent.md` in your `.github` repository and paste

2. **Review the agent configuration** — the YAML frontmatter should specify:

   ```yaml
   name: PRD Agent
   description: Consolidated PRD generation agent
   tools: [...]
   mcp-servers: [...]
   ```

3. **Commit and push** to your `.github` repository:

   ```bash
   git add .github/agents/prd-agent.md
   git commit -m "feat: add PRD agent for org-wide access via Copilot"
   git push
   ```

### Step 3: Make the Agent Available to Copilot

GitHub Copilot automatically discovers agents in `.github/agents/`. No additional configuration needed.

Once merged to your default branch (`main` or `develop`), the agent becomes available to:

- All organisation members using GitHub Copilot
- All repositories in your organisation
- VS Code, JetBrains, and GitHub web interfaces

### Step 4: Use the Agent in Copilot

**In VS Code**:

1. Open the Copilot Chat panel
2. Type `@` to see available agents
3. Select `@PRD Agent`
4. Ask your PRD question

**In JetBrains**:

1. Open the GitHub Copilot Chat tool window
2. Click the agent selector dropdown
3. Choose `PRD Agent`
4. Type your request

**In GitHub Web**:

1. Navigate to your repository
2. Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
3. Type `@PRD Agent` followed by your request

## Configuration & Maintenance

### Updating the Agent

To update to the latest version:

```bash
# Download latest version
curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/copilot/agent.md \
  -o .github/agents/prd-agent.md

# Review changes and commit
git add .github/agents/prd-agent.md
git commit -m "chore: update PRD agent to latest version"
git push
```

All users automatically get the updated agent on their next Copilot session.

### Customising the Agent (Optional)

You can create a customised version for your organisation:

1. **Edit `.github/agents/prd-agent.md`** to adjust the prompt, tools, or behaviour
2. **Commit your changes**
3. Copilot users see the customised agent

**Note**: If you customise significantly, consider renaming to avoid confusion with the canonical agent. For example: `prd-agent-acme.md` for ACME Corp's customisation.

### Syncing with Upstream

The canonical PRD agent in the LightSpeed .github repository is periodically updated. To stay in sync:

1. **Subscribe** to [releases](https://github.com/lightspeedwp/.github/releases)
2. **Review updates** before applying them
3. **Test** in a feature branch before merging to `main`
4. **Merge** the latest version

This ensures your organisation benefits from improvements and bug fixes.

## Integration with Your Workflows

### Using PRDs in Copilot Chat

Once you've generated a PRD with the agent, you can:

1. **Keep the PRD in the chat context** for follow-up questions
2. **Ask Copilot to expand sections** ("Give me more detail on acceptance criteria")
3. **Request integration** ("Create Linear issues from this PRD")
4. **Generate related content** ("Write a test plan for this PRD")

See [Integration Guide](./integration-guide.md) for detailed integration workflows.

### Routing PRD Requests

If multiple agents handle similar work, you can define routing rules in your `.github/AGENTS.md` or `.github/custom-instructions.md`:

```markdown
## PRD Agent Routing

- **PRD requests** → Use `@PRD Agent`
- **Technical spike research** → Use `@Research Agent`
- **Code implementation** → Use default Copilot
```

## Troubleshooting

### Agent not appearing in Copilot

**Problem**: You don't see `@PRD Agent` in the agent selector.

**Solutions**:

1. Verify the file exists at `.github/agents/prd-agent.md` in your default branch
2. Check that the YAML frontmatter is valid (no syntax errors)
3. Restart your IDE or Copilot interface
4. Refresh your Copilot subscription/license
5. If still missing, file an issue with GitHub Support

### "Tool unavailable" errors

**Problem**: The agent loads but reports missing tools.

**Solutions**:

1. Most Copilot tools are built-in — no setup needed
2. If the agent references external MCP servers, verify they're configured in your environment
3. See [MCP integration](./integration-guide.md) for advanced tool setup

### Agent responses don't match expectations

**Problem**: Output quality or format is inconsistent with local Claude Code usage.

**Solutions**:

1. The spec-based agent uses a slightly different prompt than the portable Claude Code version — this is expected
2. Review [best practices](./best-practices.md) for PRD quality guidelines
3. Give the agent more context in your request (user personas, constraints, examples)
4. If quality is persistently poor, consider using the Claude Code version instead (see [Claude Code Setup](./setup-claude-code.md))

### Can I use both Claude Code and Copilot agents?

**Yes.** Many teams use both:

- **Claude Code** for detailed, exploratory PRD work (more flexible)
- **Copilot** for quick, embedded PRD requests during coding sessions

Both produce compatible output. Choose based on your workflow.

## Security & Permissions

- **Agent visibility**: All organisation members see the agent (no per-user access control in current GitHub Copilot)
- **Data privacy**: PRD content is processed by Anthropic via GitHub's Copilot service. Data retention policies vary by subscription tier:
  - **GitHub Copilot Enterprise**: Check your organisation's data retention settings
  - **GitHub Copilot Pro/Free**: Subject to GitHub's standard Copilot privacy policy
  - See [GitHub's Copilot data retention policy](https://docs.github.com/en/copilot/overview-of-github-copilot/about-github-copilot#data-retention) for detailed information
- **Sensitive data**: Never include credentials, API keys, passwords, or private information in PRDs
- **Licensing**: Requires GitHub Copilot Enterprise (for organisation-wide agents) or Copilot Pro/Free (for individual use)

For detailed information, consult [GitHub's Copilot privacy policy](https://docs.github.com/en/copilot/overview-of-github-copilot/about-github-copilot#data-retention) and [LightSpeed security policy](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md).

## Next Steps

- **Create your first PRD**: See [Workflow](./workflow.md)
- **Learn best practices**: See [Best Practices](./best-practices.md)
- **Integrate PRDs into your tools**: See [Integration Guide](./integration-guide.md)
- **Questions?** See [FAQ](./faq.md)

---

**Last Updated**: 2026-09-17  
**Platform**: GitHub Copilot (Enterprise, Pro, Free)  
**IDE Support**: VS Code, JetBrains, GitHub Web  
**Agent Version**: v2.1  
**Questions?** Open an issue: [lightspeedwp/.github](https://github.com/lightspeedwp/.github/issues)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
