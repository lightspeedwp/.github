---
file_type: "documentation"
title: "Agent Validation Workflow"
description: "Comprehensive workflow for validating all agents"
version: "v1.0"
created_date: "2025-11-25"
last_updated: "2025-11-25"
---

## Agent Validation Overview

## Workflows Created

### 1. **validate-agents.yml** (Dedicated Comprehensive Validation)

Located: `.github/workflows/validate-agents.yml`

**Triggers:**

- Push to `develop` and `main` branches
- Pull request
- Manual trigger via `workflow_dispatch`

**Jobs:**

#### validate-agent-frontmatter

- Validates all agent spec files (`.agent.md`) against the frontmatter schema
- Checks required fields (name, description, version, etc.)
- Validates field types and formats
- Generates detailed validation report
- Outputs: JSON validation results

#### validate-agent-files

- Ensures agent specs have corresponding implementation files
- Checks for `.js`, `.py`, `.sh` implementations
- Verifies file completeness
- Validates file naming conventions
- Checks for duplicate or orphaned agent files

#### test-validation-script

- Tests the validation script itself
- Ensures script works correctly on all known good agents
- Validates script output format
- Tests error handling

#### summary

- Creates summary table of all validation results
- Aggregates results from all jobs
- Posts comprehensive validation report
- Fails the workflow if any critical checks fail

### 2. **lint.yml** (Updated with Agent Validation)

Located: `.github/workflows/lint.yml`

**Updates:**

- Added `validate-agents` job to main linting workflow
- Runs alongside other linting checks
- Shares cache with other lint jobs for efficiency
- Integrated into the standard CI/CD pipeline

## npm Scripts

### validate:agents

```bash
npm run validate:agents
```

Validates all agent frontmatter against the schema and checks file completeness.

### validate:all

```bash
npm run validate:all
```

Runs all validation checks including agents and JSON schemas.

## Validation Script

Located: `scripts/validation/validate-agent-frontmatter.js`

**Capabilities:**

- ✅ Validates agent `.md` spec files against frontmatter schema
- ✅ Checks required fields presence and types
- ✅ Validates file naming conventions
- ✅ Ensures implementation files exist
- ✅ Reports missing or orphaned agent files
- ✅ Generates detailed JSON validation output
- ✅ Provides summary statistics

**Exit Codes:**

- `0`: All validations passed
- `1`: Validation failures detected

## Local Development

### Run validation locally

```bash
npm run validate:agents
```

### Run full validation suite

```bash
npm run validate:all
```

### Run full linting including agents

```bash
npm run lint
```

## Agent Requirements

All agents must meet these standards to pass validation:

### Frontmatter Fields (Required)

- `file_type`: Must be "agent"
- `name`: Unique agent identifier
- `description`: Clear purpose statement
- `version`: Semantic version (v1.0, v2.1, etc.)
- `last_updated`: ISO date (YYYY-MM-DD)
- `owners`: Array of owner teams

### Frontmatter Fields (Recommended)

- `author`: Original author
- `maintainer`: Current maintainer
- `tags`: Keywords for discovery
- `category`: Classification (automation, documentation, code-quality, etc.)
- `status`: active, deprecated, experimental
- `target`: github-copilot, vscode, cli
- `tools`: Available capabilities
- `references`: Related files with descriptions

### File Structure

- Agent spec: `.github/agents/<name>.agent.md`
- Implementation: `.github/agents/<name>.agent.{js|py|sh}`
- Tests: `.github/agents/__tests__/<name>.agent.test.js`

## Workflow Output

### Success Scenario

```
✅ Agent Validation Complete
│
├─ Frontmatter Schema: 25/25 agents validated
├─ File Completeness: 25/25 agents have implementations
├─ Test Script: ✅ Passed
│
└─ Summary: All agents meet organizational standards
```

### Failure Scenario

```
❌ Agent Validation Failed
│
├─ Frontmatter Schema: 23/25 agents valid
│  └─ Issues:
│     - branding.agent.md: missing 'maintainer' field
│     - reviewer.agent.md: invalid 'status' value
│
├─ File Completeness: 24/25 agents have implementations
│  └─ Issues:
│     - issue-type.agent.md: missing .js implementation
│
└─ Summary: 2 validation errors must be fixed before merge
```

## Continuous Monitoring

The workflow integrates with:

1. **GitHub PR Checks**: Validation appears as required check in PR
2. **Branch Protection**: Can be configured as required for merge
3. **CI/CD Pipeline**: Part of standard lint workflow
4. **Local Pre-commit**: Can be integrated via Husky hooks

## Adding New Agents

When creating a new agent:

1. Create spec file: `.github/agents/my-agent.agent.md`
2. Create implementation: `.github/agents/my-agent.agent.js`
3. Create tests: `.github/agents/__tests__/my-agent.agent.test.js`
4. Run validation: `npm run validate:agents`
5. Fix any issues reported
6. Submit PR (validation will run automatically)

## References

- [Agent Development Guidelines](../agents/agent.md)
- [Coding Standards](../instructions/coding-standards.instructions.md)
- [Frontmatter Schema](../../schemas/frontmatter.schema.json)
- [Agent Instructions](../instructions/agents.instructions.md)

---

**Status**: ✅ Active  
**Last Updated**: 2025-11-25  
**Maintained By**: LightSpeedWP Team
