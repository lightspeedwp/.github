---
file_type: 'documentation'
title: 'Portable AI Agents'
description: 'Ownership index and specifications for reusable LightSpeed AI agent implementations across platforms.'
version: 'v0.3.1'
created_date: '2026-05-29'
last_updated: '2026-05-29'
maintainer: 'LightSpeed Team'
authors:
  - LightSpeed Team
license: 'GPL-3.0'
stability: 'stable'
domain: 'governance'
tags:
  - agents
  - ai-ops
  - automation
  - specifications
name: 'Portable Agents'
---

# Portable AI Agents

This folder contains specifications and implementations for reusable AI agents that can be deployed across LightSpeed projects and various platforms (Claude Code, GitHub, Slack, etc.).

## Overview

Portable agents are self-contained specifications that define:

- **Role & Responsibilities** – What the agent does and when to use it
- **Instructions** – Step-by-step guidance for the agent's behaviour
- **Tools & Permissions** – Which APIs and tools the agent can access
- **Integration Points** – How the agent integrates with platforms and workflows
- **Testing Strategy** – How to validate the agent's performance

## Agent Categories

### Core Agents

These agents handle fundamental governance and automation tasks:

- **ADR Agent** (`adr.agent.md`) – Architecture Decision Record generation and management
- **Issues Agent** (`issues.agent.md`) – Issue creation, triage, and labeling
- **Labeling Agent** (`labeling.agent.md`) – Automated labeling of issues and PRs
- **Linting Agent** (`linting.agent.md`) – Code quality and linting automation
- **Metrics Agent** (`metrics.agent.md`) – Metrics collection and reporting
- **Release Agent** (`release.agent.md`) – Release planning and automation
- **Testing Agent** (`testing.agent.md`) – Test planning and execution
- **Reviewing Agent** (`reviewer.agent.md`) – Code review automation

### Mode Agents

These agents enable specialized work modes:

- **Document Reviewer Mode** – Review and provide feedback on documentation
- **PRD Mode** – Generate and refine Product Requirements Documents
- **Thinking Mode** – Extended reasoning and analysis
- **Demonstrate Understanding Mode** – Verify comprehension before execution

### Specialized Agents

Task-specific agents for targeted workflows:

- **Task Planner** – Break down complex tasks into actionable steps
- **Task Researcher** – Research and gather context for decisions
- **Prompt Engineer** – Design and optimise prompts
- **Project Meta Sync** – Synchronise project metadata across platforms
- **Reporting Agent** – Generate comprehensive reports and summaries

## Using Agents

### In Claude Code

Deploy agents via Claude Code with `--agent` flag or in project settings:

```bash
claude code --agent labeling-agent --task "label issues in PR #123"
```

### In GitHub Actions

Use agents in workflows:

```yaml
- name: Run labeling agent
  uses: lightspeedwp/.gith../.github/agents/labeling.agent@main
  with:
    repository: my-org/my-repo
    issues: 'state:open'
```

### In Projects

Configure agents in `.claude/settings.json`:

```json
{
  "agents": {
    "enabled": true,
    "default_agent": "task-planner",
    "permissions": {
      "github": ["read:issues", "write:issues", "read:repos"]
    }
  }
}
```

## Agent Specifications

Each agent includes:

- **Overview** – What the agent does
- **When to Use** – Conditions and triggers
- **Instructions** – Core agent logic
- **Tools & Permissions** – Required APIs and access
- **Error Handling** – How the agent handles failures
- **Examples** – Real-world usage scenarios
- **Testing** – Validation approach

See individual `.agent.md` files for complete specifications.

## Contributing Agents

To create a new agent:

1. Copy `template.agent.md` as your starting point
2. Define the agent's role, instructions, and tools
3. Include at least one real-world example
4. Write tests to validate behaviour
5. Add agent metadata to `SKILL_REGISTRY.json`
6. Submit a PR for review

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Agent Stability

- **stable** – Production-ready; breaking changes in major versions
- **experimental** – Under active development; changes expected
- **deprecated** – Superseded by newer agents; plan migration

## Related Documentation

- [AGENTS.md](../AGENTS.md) – Global AI rules and agent policy
- [ai/agents.md](../ai/agents.md) – Canonical AI source map
- [agents/agent.md](./agent.md) – Agent implementations index

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
