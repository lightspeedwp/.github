---
file_type: documentation
title: Agent Developer Guide
description: Complete guide for creating, maintaining, and governing agent specifications
created_date: 2026-08-30
last_updated: 2026-08-30
author: LightSpeed Team
language: en
version: 1.0.0
status: active
---

# Agent Developer Guide

Complete reference for creating, testing, and maintaining agent specifications in the LightSpeed `.github` control plane.

## Overview

This guide covers:

- Creating new portable agents
- Authoring agent specifications (`.agent.md`)
- Frontmatter requirements and validation
- Testing and validation procedures
- CI/CD integration
- Governance policies

## Agent Categories

Agents are classified into functional categories for discovery and organisation. Common categories include:

| Category | Purpose | Examples |
| --- | --- | --- |
| **configuration** | Configuring systems and platforms | WordPress, WooCommerce configuration |
| **analysis** | Research and analysis tasks | Website scope estimation, AI readiness |
| **integration** | Integrating with external services | Linear, Zendesk integration |
| **planning** | Planning and roadmap generation | PRD generation, proposal planning |
| **governance** | Repository and project governance | Issue management, testing automation |
| **automation** | Workflow and release automation | PR creation, changelog generation |
| **tooling** | Development tools and utilities | Project metadata sync, templates |
| **mode** | Operational modes and decision frameworks | Thinking mode, documentation mode |

New categories can be added as needed for domain-specific agents (e.g., infrastructure, ecommerce, analytics).

## Creating a New Agent

### Step 1: Directory Structure

Create a new directory under `agents/` using the naming convention `{purpose}-{function}-agent/`:

```bash
mkdir -p agents/my-new-agent/
```

Standard structure:

```
agents/
├── my-new-agent.agent.md       # Agent specification (metadata & usage)
└── my-new-agent/               # Implementation directory (optional)
    ├── README.md               # Implementation documentation
    ├── skills/                 # Skill implementations
    │   ├── skill-1.js
    │   ├── skill-2.js
    │   └── index.js
    ├── tests/                  # Test suite
    │   ├── skill-1.test.js
    │   └── skill-2.test.js
    └── config/                 # Configuration files
        └── default.json
```

### Step 2: Create the Specification File

Create `agents/my-new-agent.agent.md` with complete frontmatter and documentation:

```markdown
---
name: My New Agent
description: Brief one-sentence description of agent purpose
file_type: agent
category: configuration
status: active
version: 1.0.0
created_date: 2026-08-30
last_updated: 2026-08-30
author: Your Name
language: en
maintainer: Team Name
visibility: public
tags:
  - tag1
  - tag2
implementation: my-new-agent
---

# My New Agent

## Purpose

Detailed description of what this agent does and why.

## Capabilities

- Capability 1
- Capability 2
- Capability 3

## Skills

### Skill 1: `skill-name`
Description of skill functionality.

### Skill 2: `another-skill`
Description of skill functionality.

## Usage

```yaml
agent: my-new-agent
skills:
  - skill-name:
      param1: value1
      param2: value2
```

## Integration

Link to implementation directory: [`agents/my-new-agent/`](../my-new-agent/)

See [Implementation Documentation](../my-new-agent/README.md) for technical details.

## Configuration

Configuration stored in `config/default.json`:

```json
{
  "timeout": 30000,
  "retries": 3,
  "version": "1.0.0"
}
```

## Testing

Run tests with:

```bash
npm test -- agents/my-new-agent
```

See [Test Documentation](../my-new-agent/tests/README.md) for test strategy.

## References

- [Agent Specification Requirements](#agent-specification-requirements)
- [Validation Procedures](#validation-procedures)

```

### Step 3: Frontmatter Requirements

All agent specs must have frontmatter with these required fields:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `name` | String | My New Agent | Display name |
| `description` | String | Brief description | One-line summary |
| `file_type` | String | agent | Always "agent" |
| `category` | String | configuration | Domain-specific category for discovery |
| `status` | String | active | active, draft, or deprecated |
| `version` | String | 1.0.0 | Semantic versioning |
| `created_date` | Date | 2026-08-30 | YYYY-MM-DD format |
| `last_updated` | Date | 2026-08-30 | YYYY-MM-DD format |
| `author` | String | Your Name | Creator |
| `language` | String | en | Documentation language |

Optional fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `maintainer` | String | Primary maintainer name/team |
| `visibility` | String | public or private access level |
| `tags` | Array | Functional tags for discovery |
| `implementation` | String | Implementation directory name |

### Step 4: Implement Skills

Create skill implementations in `skills/`:

```javascript
// skills/my-skill.js
module.exports = {
  name: 'my-skill',
  description: 'Brief skill description',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter 1'
      }
    },
    required: ['param1']
  },
  async execute(params, context) {
    // Implementation
    return {
      success: true,
      result: 'Result data'
    };
  }
};
```

### Step 5: Write Tests

Create comprehensive test coverage:

```javascript
// tests/my-skill.test.js
describe('My Skill', () => {
  it('should execute with valid parameters', async () => {
    // Test implementation
  });

  it('should handle errors gracefully', async () => {
    // Error handling test
  });
});
```

Ensure at least 80% code coverage:

```bash
npm test -- agents/my-new-agent --coverage
```

### Step 6: Documentation

Create `README.md` with:

- Purpose and use cases
- Skill reference
- Configuration options
- Examples
- Error handling
- Performance considerations

## Agent Specification Requirements

### File Location

Agent specifications can be placed in one of three locations:

1. **Primary location** – `agents/` for main agent specs:

   ```
   agents/my-agent.agent.md
   agents/my-other-agent.agent.md
   ```

2. **GitHub control plane** – `.github/agents/` for repository-maintenance agents:

   ```
   .github/agents/issues-manager.agent.md
   .github/agents/labeling-automation.agent.md
   ```

3. **Plugin-scoped agents** – `plugins/{plugin-name}/agents/` for plugin-specific agents:

   ```
   plugins/wordpress-plugin/agents/wordpress-manager.agent.md
   plugins/woocommerce-plugin/agents/product-sync.agent.md
   ```

### Naming Convention

- File: `{slug}.agent.md`
- Directory: `{slug}-agent/` or `{slug}/`
- Example: `adr.agent.md` → `adr-generator/`

### Frontmatter Validation

All specs are validated against:

- **Required fields**: name, description, file_type, category, status, version, created_date, last_updated, author, language
- **Field formats**: file_type must be "agent", category must be non-empty (can be any domain-specific category), dates in YYYY-MM-DD
- **Implementation reference**: If present, implementation directory must exist

### Cross-Reference Rules

- Each spec in `agents/` should reference an implementation directory in same location
- Internal/mode agents can be specification-only (no implementation directory)
- Implementation directories should have entry points (AGENT.md, README.md, or SKILL.md)

## Validation Procedures

### Local Validation

Before committing, run validation:

```bash
# Validate all agent specs
node .github/scripts/validate-agent-specs.js

# Validate frontmatter
npm run validate:frontmatter

# Run tests
npm test -- agents/my-agent
```

### Pre-commit Hooks

Enable automatic validation on commit:

```bash
# Copy hook to git hooks directory
cp hooks/pre-commit-agent-spec-validation.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### CI/CD Validation

All specs are validated automatically on:

- **Pull requests**: `.agent.md` file changes trigger validation workflow
- **Pushes to develop**: Continuous validation on integration branch

Validation workflow (`.github/workflows/agent-spec-validation.yml`):

1. **Frontmatter Validation** – Checks required fields and formats
2. **Cross-Reference Validation** – Verifies implementation directories exist
3. **Coverage Check** – Ensures all implementations have specs
4. **Status Check** – Reports results and blocks merge on failures

## Testing Strategy

### Unit Tests

Test individual skills in isolation:

```bash
npm test -- agents/my-agent/tests/skill-1.test.js
```

### Integration Tests

Test skills working together:

```bash
npm test -- agents/my-agent/tests/integration.test.js
```

### E2E Tests

Test complete agent workflows:

```bash
npm test -- agents/my-agent/tests/e2e.test.js
```

### Coverage Requirements

- **Minimum**: 80% code coverage
- **Target**: 90%+ code coverage
- **Critical paths**: 100% coverage

Run coverage report:

```bash
npm test -- agents/my-agent --coverage
```

## Governance Policy

### Specification Updates

When modifying an agent spec:

1. Update `last_updated` field to current date
2. Increment `version` following semantic versioning
3. Document changes in agent's changelog (if present)
4. Add entry to root CHANGELOG.md under [Unreleased]

### Review Process

Agent spec PRs require:

- ✅ All automated validations passing
- ✅ At least 1 approving review from maintainers
- ✅ No merge conflicts
- ✅ Tests passing for modified agents

### Deprecation

To deprecate an agent:

1. Set `status: deprecated` in frontmatter
2. Add deprecation notice in spec body
3. Document replacement agent or alternative
4. Update last_updated date
5. Remove from production workflows

Example deprecation notice:

```markdown
## ⚠️ Deprecation Notice

This agent is deprecated as of 2026-08-30.

**Replacement**: Use [New Agent Name](../new-agent.agent.md) instead.

**Migration Guide**: See [MIGRATION.md](./MIGRATION.md) for upgrade instructions.
```

### Version Numbering

Follow semantic versioning (MAJOR.MINOR.PATCH):

| Change | Description | Example |
| --- | --- | --- |
| **MAJOR** | Breaking changes to skill interface | 1.0.0 → 2.0.0 |
| **MINOR** | New skill added, backward compatible | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, documentation updates | 1.0.0 → 1.0.1 |

## Frontmatter Template

Use this template when creating new agent specs:

```markdown
---
name: Agent Display Name
description: One-line description of agent purpose
file_type: agent
category: configuration
status: active
version: 1.0.0
created_date: 2026-08-30
last_updated: 2026-08-30
author: Your Name
language: en
maintainer: Team Name
visibility: public
tags:
  - tag1
  - tag2
implementation: agent-directory-name
---

# Agent Display Name

## Purpose

Detailed description of agent purpose and use cases.

## Capabilities

List of key capabilities.

## Skills

### Skill Name
Description of skill.

## Integration

Link to implementation directory.

## Testing

Testing strategy and commands.

## Configuration

Configuration options and defaults.

## References

Related documentation and links.
```

## Troubleshooting

### Frontmatter Validation Fails

**Error**: "Missing required field 'category'"

**Solution**: Add missing field to frontmatter with a non-empty category value. Use domain-specific categories such as: configuration, analysis, integration, planning, governance, automation, tooling, mode, infrastructure, ecommerce, analytics, or any other category appropriate for your agent.

### Date Format Invalid

**Error**: "Invalid created_date format (must be YYYY-MM-DD)"

**Solution**: Use ISO 8601 date format: `2026-08-30`

### Cross-Reference Fails

**Error**: "Implementation directory not found: my-agent-agent"

**Solution**:

1. Check implementation directory name matches `implementation` field in frontmatter
2. Ensure directory exists in correct location
3. Verify directory contains AGENT.md, README.md, or SKILL.md entry point

### Tests Failing

**Error**: "Coverage threshold not met (78% < 80%)"

**Solution**: Add tests to reach 80% coverage minimum

```bash
npm test -- agents/my-agent --coverage
```

## Related Documentation

- [Agent Specification Audit - Phase 3 Results](./../.github/reports/audit/AGENT-SPECS-PHASE3-RESULTS.md)
- [Agent Index](./AGENT-INDEX.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [CLAUDE.md](../CLAUDE.md)

## Questions?

Contact the LightSpeed Team or open an issue in the `.github` repository.

---

**Last Updated**: 2026-08-30  
**Version**: 1.0.0  
**Status**: Active
