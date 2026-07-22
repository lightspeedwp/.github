---
provider: 'copilot'
agent_slug: 'website-content-strategist'
agent_name: 'Website Content Strategist (GitHub Copilot)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-22'
platform: 'github'
integration: 'copilot-chat'
---

# Website Content Strategist — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Website Content Strategist integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

Copilot excels at:
- **GitHub Projects integration** – Manage issues and projects
- **Code analysis** – Review and improve code
- **Workflow automation** – Trigger GitHub Actions
- **Pull request assistance** – Review and comment on PRs

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

1. **@skill-analyze** – Analyze requirements
2. **@skill-plan** – Create implementation plan
3. **@skill-review** – Review outputs
4. **@skill-document** – Generate documentation
5. **@skill-validate** – Validate results
6. **@skill-sync** – Sync with project tools

## Response Format

Copilot provides responses optimized for GitHub:
- Markdown-formatted explanations
- Code snippets with syntax highlighting
- Links to related GitHub issues and discussions
- Action buttons for common tasks

## GitHub Integration

Works with:
- GitHub Projects (beta) – Task management
- GitHub Discussions – Communication
- Pull Requests – Code review
- GitHub Actions – Workflow automation

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*
