# Module 1: Slash Commands

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Teach these categories one at a time, with examples and "when to use" guidance.

## Getting Started

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/login` | Authenticate with GitHub | First launch or expired session |
| `/logout` | Sign out | Switching accounts |
| `/help` | Show all commands | When lost |
| `/exit` `/quit` | Exit CLI | Done working |
| `/init` | Bootstrap copilot-instructions.md | New repo setup |
| `/terminal-setup` | Configure multiline input | First-time setup |

## Models & Agents

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/model` | Switch AI model | Need different capability/speed |
| `/agent` | Browse/select agents | Delegate to specialist |
| `/fleet` | Enable parallel subagents | Complex multi-part tasks |
| `/tasks` | View background tasks | Check on running subagents |

## Code & Review

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/diff` | Review changes in current dir | Before committing |
| `/review` | Run code review agent | Get feedback on changes |
| `/lsp` | Manage language servers | Need go-to-def, diagnostics |
| `/ide` | Connect to IDE workspace | Want IDE integration |

## Session & Context

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/context` | Show token usage visualization | Context getting large |
| `/usage` | Display session metrics | Check premium request count |
| `/compact` | Compress conversation history | Near context limit |
| `/session` | Show session info | Need session details |
| `/resume` | Switch to different session | Continue previous work |
| `/rename` | Rename current session | Better organization |
| `/share` | Export session to markdown/gist | Share with team |
| `/copy` | Copy last response to clipboard | Grab AI output quickly |
| `/clear` | Clear conversation history | Fresh start |

## Permissions & Directories

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/allow-all` | Enable all permissions | Trusted environment, move fast |
| `/add-dir` | Add trusted directory | Working across projects |
| `/list-dirs` | Show allowed directories | Check access scope |
| `/cwd` | Change working directory | Switch project context |
| `/reset-allowed-tools` | Revoke tool approvals | Tighten security |

## Configuration & Customization

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/instructions` | View active instruction files | Debug custom behavior |
| `/experimental` | Toggle experimental features | Try autopilot mode |
| `/theme` | Change terminal theme | Personalize |
| `/streamer-mode` | Hide sensitive info | Livestreaming/demos |
| `/changelog` | Show release notes | After update |
| `/update` | Update CLI | New version available |
| `/feedback` | Submit feedback | Report bug or request |

## Extensibility

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/skills` | Manage skills | Browse/enable capabilities |
| `/mcp` | Manage MCP servers | Add external tools |
| `/plugin` | Manage plugins | Extend functionality |

## Workflows & Research

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/plan` | Create implementation plan | Before complex changes |
| `/research` | Run deep research investigation | Need thorough analysis with sources |
| `/user` | Manage GitHub user list | Team context |

## Quiz (5+ questions, use ask_user with 4 choices each)

Ask "Which command would you use to [scenario]?" style questions.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
