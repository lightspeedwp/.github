# Agent Folder Structure: Standardized Template

**Purpose**: Define the 7-component folder structure for all agents in the repository, and
record which parts of it a validator checks.

**Applies to**: All agents in `agents/` folder

**Status**: Mandatory by convention only. `StructureChecker` is reached solely by
running `node scripts/validation/phase-4-structure-audit.js` directly. No npm
script, workflow or other script invokes it, so nothing here blocks a merge. See
[Validation Rules](#validation-rules) for what is actually checked.

---

## Folder Structure Template

An org-wide agent is defined by one root `agents/{agent-name}.agent.md` file whose frontmatter
carries `name` and `description` (plus optional `tools` and `model`); Copilot and Claude Code both
read that format. The agent's folder holds its working instructions, tests, skills and
configuration, laid out like this ([#3464](https://github.com/lightspeedwp/.github/issues/3464)
adopted the open `AGENTS.md` format in place of the bespoke `AGENT.md`):

```
agents/{agent-name}/
├── AGENTS.md                # (1) Working instructions (legacy name AGENT.md still accepted)
├── CHANGELOG.md             # (2) Version history and changes
├── package.json             # (3) Dependencies and scripts
├── README.md                # (4) Documentation and usage
├── skills/                  # (5) Agent-specific skills
│   └── {skill-name}/
├── tests/                   # (6) Unit and integration tests│   └── {test-name}.test.js
└── config/                  # (7) Configuration files
    ├── default.json
    ├── .env.example
    └── README.md
```

---

## Component Requirements

### 1. AGENTS.md (Working Instructions)

**Purpose**: What an AI coding agent or contributor needs to work in this agent's folder, in the
open [AGENTS.md](https://agents.md/) format. The nearest `AGENTS.md` to a file applies. It is not
the agent's definition; that is the root `agents/{agent-name}.agent.md`.

**Content**: free-form Markdown. Typical content is an overview, setup and test commands,
conventions, and what must not be touched. The format sets no required sections.

**Legacy**: `AGENT.md` is the retired name. `StructureChecker` still accepts it, with a warning, so
an agent folder can be migrated by renaming the file. The old `AGENT.md` section recommendations
(Description, Capabilities, Skills) are still checked, as warnings, for that legacy name only.

**Template**: See [agent-structure-template/AGENTS.md](../templates/agent-structure-template/AGENTS.md)

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

**Template**: See [agent-structure-template/CHANGELOG.md](../templates/agent-structure-template/CHANGELOG.md)

---

### 3. package.json (Dependencies)

**Purpose**: Node.js dependencies, scripts, and metadata

**Required fields**:

- `name`: Must be `@lightspeedwp/{agent-name}` (scope from the root `package.json`; kebab-case)
- `version`: Must match latest CHANGELOG.md version
- `description`: Brief description
- `main`: Entry point (typically `index.js` or `src/index.js`)
- `type`: Must be `"module"` (ES modules)
- `scripts`: At minimum `test` and `lint`
- `engines.node`: Minimum Node.js version (>=18.0.0)

**Validation**: Must parse as valid JSON and satisfy npm schema

**Template**: See [agent-structure-template/package.json](../templates/agent-structure-template/package.json)

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

**Template**: See [agent-structure-template/README.md](../templates/agent-structure-template/README.md)

---

### 5. skills/ (Agent Skills)

**Purpose**: Skills specific to this agent

**Structure**:

```
skills/
├── skill-one/
│   ├── SKILL.md          # required entry point
│   ├── scripts/          # optional
│   ├── references/       # optional
│   └── assets/           # optional
├── skill-two/
│   └── SKILL.md
```

**Requirements** (the [Agent Skills specification](https://agentskills.io/specification), adopted by
[#3464](https://github.com/lightspeedwp/.github/issues/3464)):

- Each skill is a subdirectory whose name equals the skill's `name`
- `SKILL.md` is the required entry point, with `name` and `description` frontmatter
- `scripts/`, `references/` and `assets/` are optional; a skill needs no `index.js` or `package.json`
- Skills are agent-private unless moved to the root `skills/` folder
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
- Coverage: Minimum 70%. Not currently measured by any validator, so this is a
  convention rather than an enforced threshold.
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

These rules are checked by `StructureChecker`, which runs only when you invoke
`node scripts/validation/phase-4-structure-audit.js` directly. Nothing else calls
it: there is no npm script for it, and no workflow runs it. The `audit:structure`
script runs a different program, `scripts/validation/audit-agents.js`, which does
not use `StructureChecker`.

`StructureChecker` reports an `error` for these:

1. ✅ The 7 required components exist with the correct type: `AGENTS.md` (or the legacy
   `AGENT.md`, which warns), `CHANGELOG.md`, `package.json` and `README.md` as files, and `skills/`, `tests/` and `config/` as
   directories. A directory is accepted whether or not it is empty.
2. ✅ `CHANGELOG.md` is readable (an unreadable file is an error).
3. ✅ `package.json` is present, parses, and its required fields are set
4. ✅ `package.json` `name` matches the agent folder name
5. ✅ `package.json` `version` is valid semver
6. ✅ `package.json` `main` file exists
7. ✅ `package.json` `type` is `"module"`
8. ✅ `package.json` `license` matches the organisation licence from the root `package.json`
9. ✅ `package.json` declares `test` and `lint` scripts. Presence only: the validator
   never executes them, so a script that exists but fails is not caught here.
10. ✅ `package.json` `dependencies` do not reference another agent

Reported as a `warning`, so they do not fail the run:

- `config/default.json` exists. Its **contents are not parsed**, so an invalid
  JSON file is not detected.
- `config/.env.example` exists.
- `engines.node` is a valid range that resolves to 18 or later.

**Not implemented.** Nothing in the validator checks any of the following, so
they are conventions rather than validated rules:

- `AGENTS.md` Markdown validity (the format sets no required sections).
- `README.md` table of contents or usage examples.
- That `tests/` contains at least one test file, or that the file is named
  `{agent-name}.test.js`.
- That `config/default.json` is valid JSON.
- That the agent root contains no unexpected files.
- Any test coverage threshold.
- That the `test` or `lint` scripts pass.

If any of these should gate a pull request, they need implementing in
`StructureChecker` or `PackageJsonValidator` first; today a conformant result
does not prove the agent meets the conventions above.

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

- **AGENTS.md**: Working instructions for tools and contributors (the agent itself is defined by the root `agents/{agent-name}.agent.md`)
- **CHANGELOG.md**: Track version history (required for CI/release automation)
- **package.json**: Dependency management and npm scripts
- **README.md**: User-facing documentation (discoverable)
- **skills/**: Encapsulation of agent-specific capabilities
- **tests/**: Quality assurance and regression prevention
- **config/**: Environment flexibility and defaults

This structure balances:

- ✅ Consistency across 50+ agents
- ✅ Discoverability (README, AGENTS.md in standard locations)
- ✅ Automation (registry generation, CI validation)
- ✅ Maintainability (clear expectations)
- ✅ Flexibility (config, skill isolation)

---

## Related

- [Standardized Template](../templates/agent-structure-template/)
- [CHANGELOG Format](CHANGELOG_FORMAT.md)
- [package.json Requirements](PACKAGE_JSON_REQUIREMENTS.md)
- [Structure audit script](../../scripts/validation/phase-4-structure-audit.js)
