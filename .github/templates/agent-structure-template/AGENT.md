# {agent-name} Agent

**Agent ID**: `{agent-id}`

**Version**: 1.0.0

**Status**: Active | Deprecated | Experimental

**Description**: {agent-purpose-and-capabilities}

## Overview

{Detailed overview of what the agent does, its primary responsibilities, and key use cases}

## Capabilities

- Capability 1
- Capability 2
- Capability 3

## Skills

This agent uses the following skills:

- `skills/{category}/{scope}-{title}` - Description

## Configuration

Configuration options are defined in `config/config.json`. See [Configuration](#configuration) below.

## Usage

### As a Claude Agent

```javascript
// Example usage
```

### As a Copilot Agent

```typescript
// Example usage
```

### Programmatically

```bash
# Example CLI usage
```

## Architecture

### Folder Structure

```
{agent-name}/
├── AGENT.md                 # This file (agent definition)
├── CHANGELOG.md             # Version history
├── package.json             # Dependencies
├── README.md                # Documentation
├── skills/                  # Agent-specific skills
│   └── {skill-id}/
├── tests/                   # Test files
│   ├── {agent-name}.test.js # Jest tests (if JS)
│   └── unit/                # Unit test files
└── config/                  # Configuration files
    └── config.json          # Default configuration
```

### Dependencies

- Skill dependencies: [List skills this agent depends on]
- Script dependencies: [List scripts this agent depends on]
- Agent dependencies: [List other agents this agent depends on]

## Configuration

### config.json

```json
{
  "version": "1.0.0",
  "enabled": true,
  "timeout": 30000,
  "retries": 3
}
```

See [Configuration Requirements](../../docs/PACKAGE_JSON_REQUIREMENTS.md) for full details.

## Testing

This agent includes automated tests:

- **Framework**: [Jest | Bats | Playwright]
- **Coverage Target**: 80%
- **Location**: `tests/` directory

Run tests:

```bash
npm run test -- {agent-name}
```

## Breaking Changes

### v1.0.0

- Initial release

## References

- [Agent Folder Structure Standard](../../docs/AGENT_FOLDER_STRUCTURE.md)
- [Skills Convention](../../docs/SKILLS_NAMING_CONVENTION.md)
- [Testing Strategy](../../docs/TESTING_STRATEGY.md)

## Status

- [x] Defined in AGENT.md
- [x] Skills listed
- [x] Configuration documented
- [x] Tests implemented
- [x] README.md complete
- [x] CHANGELOG.md complete
- [x] package.json complete

---

**Last Updated**: {date}

**Maintained By**: @{maintainer}
