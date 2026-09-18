# Agent Folder Structure: Standardized Template

**Purpose**: Define and enforce the 7-component folder structure for all agents in the repository.

**Applies to**: All agents in `agents/` folder

**Status**: Mandatory (enforced by CI validation)

---

## Folder Structure Template

Every agent MUST conform to this folder structure:

```
agents/{agent-name}/
├── AGENT.md                 # (1) Agent definition and metadata
├── CHANGELOG.md             # (2) Version history and changes
├── package.json             # (3) Dependencies and scripts
├── README.md                # (4) Documentation and usage
├── skills/                  # (5) Agent-specific skills
│   └── {skill-name}/
├── tests/                   # (6) Unit and integration tests
│   └── {test-name}.test.js
└── config/                  # (7) Configuration files
    ├── default.json
    ├── .env.example
    └── README.md
```

---

## Component Requirements

### 1. AGENT.md (Agent Definition)

**Purpose**: Primary metadata and description of the agent

**Required sections**:

- Type (Agent)
- Version (semver)
- Status (Active/Deprecated/Experimental)
- Description (brief summary)
- Capabilities (bulleted list)
- Skills (dependencies)
- Configuration reference
- Usage examples (as action and/or module)
- Testing instructions
- Support/contact info

**Size**: 50-200 lines typically

**Template**: See [agent-structure-template/AGENT.md](.github/templates/agent-structure-template/AGENT.md)

---

### 2. CHANGELOG.md (Version History)

**Purpose**: Track all changes to the agent over time

**Required format**: [Keep a Changelog](https://keepachangelog.com/) format

**Required sections per version**:

- Version number (semver)
- Release date (ISO 8601)
- Categories: Added, Changed, Fixed, Removed, Security
- Link to PR/issue for each entry

**Minimum content**: At least one entry documenting initial release

**Validation**: Each version MUST have a corresponding git tag `agents/{agent-name}/v{version}`

**Template**: See [agent-structure-template/CHANGELOG.md](.github/templates/agent-structure-template/CHANGELOG.md)

---

### 3. package.json (Dependencies)

**Purpose**: Node.js dependencies, scripts, and metadata

**Required fields**:

- `name`: Must be `agents-{agent-name}` (kebab-case)
- `version`: Must match latest CHANGELOG.md version
- `description`: Brief description
- `main`: Entry point (typically `index.js` or `src/index.js`)
- `type`: Must be `"module"` (ES modules)
- `scripts`: At minimum `test` and `lint`
- `engines.node`: Minimum Node.js version (>=18.0.0)

**Validation**: Must parse as valid JSON and satisfy npm schema

**Template**: See [agent-structure-template/package.json](.github/templates/agent-structure-template/package.json)

---

### 4. README.md (Documentation)

**Purpose**: Usage documentation, installation, configuration

**Required sections**:

- One-line summary at top
- Table of Contents
- Installation instructions (npm and GitHub Action)
- Usage examples (at least 2: Node.js module and GitHub Action)
- Configuration options
- Skills dependencies (with links)
- Testing instructions
- Contributing guidelines
- Related links (to registry, other agents)

**Size**: 200-500 lines typically

**Template**: See [agent-structure-template/README.md](.github/templates/agent-structure-template/README.md)

---

### 5. skills/ (Agent Skills)

**Purpose**: Skills specific to this agent

**Structure**:

```
skills/
├── skill-one/
│   ├── index.js
│   ├── package.json
│   ├── README.md
│   └── tests/
├── skill-two/
│   ├── index.js
│   └── ...
```

**Requirements**:

- Each skill is a subdirectory with its own `package.json`
- Skills are agent-private unless moved to root `skills/` folder
- Each skill has at least `index.js` and `package.json`
- No circular dependencies between skills

**Can be empty** if agent uses only root-level shared skills

---

### 6. tests/ (Test Suite)

**Purpose**: Unit and integration tests for the agent

**Structure**:

```
tests/
├── unit/
│   └── {component}.test.js
├── integration/
│   └── {workflow}.test.js
└── fixtures/
    └── {test-data}.json
```

**Requirements**:

- Minimum test file: `{agent-name}.test.js`
- Framework: Jest
- Coverage: Minimum 70% (enforced by CI)
- No skipped tests (`.skip` or `.only`)

**Can be empty initially** but MUST be populated before release

---

### 7. config/ (Configuration)

**Purpose**: Default configuration and environment templates

**Required files**:

- `default.json`: Default configuration values
- `.env.example`: Environment variable template
- `README.md`: Configuration guide

**Example default.json**:

```json
{
  "timeout": 30000,
  "retries": 3,
  "logLevel": "info"
}
```

**Example .env.example**:

```
AGENT_LOG_LEVEL=info
AGENT_TIMEOUT=30000
# Copy to .env and fill in real values
```

---

## Validation Rules

**Enforced by CI:**

1. ✅ All 7 components present
2. ✅ AGENT.md is valid Markdown with required sections
3. ✅ CHANGELOG.md follows Keep a Changelog format
4. ✅ package.json is valid and `name` matches folder
5. ✅ README.md has Table of Contents and usage examples
6. ✅ skills/ directory exists (can be empty)
7. ✅ tests/ directory exists with at least one test file
8. ✅ config/default.json exists and is valid JSON
9. ✅ config/.env.example exists
10. ✅ No files directly in agent root (everything organized)

---

## Migration Guide

**For agents that don't conform:**

1. Run structure audit: `npm run audit:structure`
2. Review report: `agents/reports/structure-audit.json`
3. Follow remediation recommendations in `agents/reports/structure-remediation-recommendations.json`
4. Create feature branch per agent
5. Add missing components from templates
6. Update existing components to match requirements
7. Run validation: `npm run validate:structure -- agents/{agent-name}`
8. Open PR for review

---

## Rationale

**Why 7 components?**

- **AGENT.md**: Single source of truth for agent metadata
- **CHANGELOG.md**: Track version history (required for CI/release automation)
- **package.json**: Dependency management and npm scripts
- **README.md**: User-facing documentation (discoverable)
- **skills/**: Encapsulation of agent-specific capabilities
- **tests/**: Quality assurance and regression prevention
- **config/**: Environment flexibility and defaults

This structure balances:

- ✅ Consistency across 50+ agents
- ✅ Discoverability (README, AGENT.md in standard locations)
- ✅ Automation (registry generation, CI validation)
- ✅ Maintainability (clear expectations)
- ✅ Flexibility (config, skill isolation)

---

## Related

- [Standardized Template](.github/templates/agent-structure-template/)
- [CHANGELOG Format](CHANGELOG_FORMAT.md)
- [package.json Requirements](PACKAGE_JSON_REQUIREMENTS.md)
- [Structure Audit Guide](AGENT_FOLDER_STRUCTURE_AUDIT.md)
- [Agent Registry](../agents/registry.json)
