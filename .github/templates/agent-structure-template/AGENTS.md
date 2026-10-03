# {agent-name} Agent

Working instructions for AI coding agents and contributors working in this agent's folder, in the open
[AGENTS.md](https://agents.md/) format. The nearest `AGENTS.md` to the file being edited applies.

This is not the agent's definition. An org-wide Copilot or Claude agent is defined by one
`agents/{agent-name}.agent.md` file at the repository root, whose frontmatter carries `name` and
`description` (plus optional `tools` and `model`).

## Overview

{What the agent does, its primary responsibilities and key use cases}

## Setup and commands

```bash
npm install
npm run test -- {agent-name}
npm run lint
```

## Folder layout

```text
{agent-name}/
├── AGENTS.md                # This file (working instructions)
├── CHANGELOG.md             # Version history
├── package.json             # Dependencies and scripts
├── README.md                # Documentation
├── skills/                  # Agent-specific skills, one SKILL.md per skill directory
│   └── {skill-name}/
│       └── SKILL.md
├── tests/                   # Test files
│   └── {agent-name}.test.js
└── config/                  # Configuration files
    └── default.json
```

## Skills

List the skills this agent uses. Each is a directory with a `SKILL.md` entry point.

- `skills/{skill-name}` - Description

## Conventions

- {Code style, naming and commit conventions that apply to this agent}
- {Anything an agent must not touch}

## Testing

- **Framework**: Jest
- **Location**: `tests/`

## References

- [Agent Folder Structure Standard](../../docs/AGENT_FOLDER_STRUCTURE.md)
- [Skills Convention](../../docs/SKILLS_NAMING_CONVENTION.md)
- [Testing Strategy](../../docs/TESTING_STRATEGY.md)
