---
title: "LightSpeedWP Scripts & Automation"
description: "Comprehensive automation scripts, utilities, and maintenance tools for LightSpeedWP projects. Modular design with shared infrastructure and extensive testing."
file_type: documentation
version: "2.7"
last_updated: "2026-06-18"
created_date: "2025-12-04"
owners:
  - LightSpeedWP Team
maintainer: LightSpeed Team
license: GPL-3.0
tags:
  - scripts
  - automation
  - utilities
  - testing
domain: lightspeed
stability: stable
---
# LightSpeedWP Scripts & Automation

![Scripts Badge](https://img.shields.io/badge/scripts-active-brightgreen?style=flat-square)
![Automation Badge](https://img.shields.io/badge/automation-optimized-blue?style=flat-square)
![Testing Badge](https://img.shields.io/badge/testing-comprehensive-success?style=flat-square)
![Maintenance Badge](https://img.shields.io/badge/maintenance-automated-orange?style=flat-square)

This directory contains all automation, utility, and maintenance scripts for the LightSpeedWP project. Scripts are grouped by function for modularity, maintainability, and testability.

## Scripts Architecture

```mermaid
graph TB
accTitle: "Scripts and automation directory architecture"
accDescr: "Shows the hierarchical structure of scripts directory including awesome-copilot, includes, validation, maintenance, and projects folders with their core utilities, test helpers, and integrations with GitHub Actions and CI/CD pipeline."
    A[Scripts Directory] --> B[awesome-copilot/]
    A --> V[audit/]
    A --> C[includes/]
    A --> D[json-validation/]
    A --> E[maintenance/]
    A --> F[projects/]
    A --> G[utility/]
    A --> H[validation/]

    C --> I[Core Utilities]
    C --> J[Test Helpers]
    C --> K[CLI Support]
    C --> L[File Operations]

    B --> M[Collection Management]
    V --> W[Agent Frontmatter Audit]
    D --> N[Schema Validation]
    E --> O[Documentation Updates]
    F --> P[GitHub Projects]
    G --> Q[General Tools]
    H --> R[Config Validation]

    S[GitHub Actions] --> A
    T[Pre-commit Hooks] --> A
    U[CI/CD Pipeline] --> A

    style A fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
    style C fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style S fill:#dcfce7,color:#14532d,stroke:#14532d
```

## Automation Workflow

```mermaid
sequenceDiagram
accTitle: "Scripts and automation workflow sequence"
accDescr: "Sequential flow showing developer executing scripts, loading utilities, validating inputs, performing operations, running tests, triggering CI/CD workflows, and deployment with completion notification."
    participant Dev as Developer
    participant Scripts as Scripts System
    participant Tests as Test Suite
    participant CI as CI/CD Pipeline
    participant Deploy as Deployment

    Dev->>Scripts: Execute script
    Scripts->>Scripts: Load includes/utilities
    Scripts->>Scripts: Validate inputs
    Scripts->>Scripts: Perform operations
    Scripts->>Tests: Run validation tests
    Tests->>Scripts: Return results
    Scripts->>CI: Trigger workflows
    CI->>Deploy: Deploy if successful
    Deploy->>Dev: Notify completion
```

## Directory Structure

- **awesome-copilot/** — Utilities for prompt/collection management and validation.
  *See:* `awesome-copilot/README.md`
- **audit/** — Point-in-time audit scripts, including agent frontmatter baseline comparison.
- **includes/** — Shared Bash helpers and test utilities.
  *See:* `includes/README.md`
- **json-validation/** — Node.js/YAML validation scripts and tests.
  *See:* `json-validation/README.md`
- **logs/** — Log output for script runs.
- **maintenance/** — Scripts for repo maintenance, documentation, and label automation.
  *See:* `maintenance/README.md`
- **projects/** — GitHub Projects management and automation scripts.
  *See:* `projects/README.md`
- **utility/** — General-purpose shell and Node.js utilities for label management, logging, and validation.
  *See:* `utility/README.md`

## Core Components

## Shared Infrastructure (`includes/`)

The `includes/` directory provides reusable components used across all scripts:

- **Core Utilities**: `logging.sh`, `validation.sh`, `colors.sh`, `common-functions.sh`
- **CLI Support**: `cli-utils.sh` for standardized argument parsing and help
- **File Operations**: `file-operations.sh` for safe file system interactions
- **Test Helpers**: `enhanced-test-helpers.bash`, `agent-test-helpers.bash`
- **Network Functions**: `git-functions.sh` for Git operations

## Script Categories

## Awesome Copilot (`awesome-copilot/`)

Manages prompt collections and Copilot-related functionality:

- Collection creation, validation, and maintenance
- YAML frontmatter processing
- Cross-platform line ending normalization
- README generation for collections

## Maintenance (`maintenance/`)

Repository maintenance and automation:

- Documentation generation and updates
- GitHub label synchronization
- Badge management for workflows
- Changelog validation
- Issue type management

## Utility (`utility/`)

General-purpose tools and libraries:

- Label management and reporting
- Release validation
- Shell script linting
- Version synchronization
- Status enforcement

## JSON/YAML Validation (`json-validation/`)

Configuration file validation:

- CodeRabbit configuration validation
- Schema-based YAML validation
- Automated schema updates

## Projects (`projects/`)

GitHub Projects management:

- Project creation and updates
- Field management
- Access control configuration
- Project type templates

## Integration Points

## Test Structure

Each script directory has a corresponding `__tests__/` subdirectory:

- `awesome-copilot/__tests__/` — Tests for Copilot utilities
- `includes/__tests__/` — Tests for shared helpers
- `json-validation/__tests__/` — Tests for validation scripts
- `maintenance/__tests__/` — Tests for maintenance scripts
- `utility/__tests__/` — Tests for utility functions

## Workflow Integration

Scripts integrate with GitHub Actions workflows:

- Pre-commit validation
- Automated documentation updates
- Label synchronization
- Release validation
- Test execution

## Configuration Dependencies

Scripts work with various configuration files:

- `.coderabbit.yml` — CodeRabbit configuration
- `../.schemas/` — JSON/YAML validation schemas
- `.github/workflows/` — GitHub Actions definitions
- `fixtures/` — Test data and templates

## Usage & Quickstart

## Running Individual Scripts

```bash
# Validate collections
scripts/awesome-copilot/validate-collections.js

# Update documentation
scripts/maintenance/update-readme-and-changelog.sh

# Synchronize labels
scripts/utility/label-sync.js --dry-run

# Validate configuration
node scripts/validation/validate-coderabbit-yml.cjs

# Audit agent frontmatter against release baseline
npm run audit:agents:ruby

# Validate WCEU 2026 Phase 1 (Schema migration, slides, etc.)
npm run validate:wceu:phase1

# Validate WCEU 2026 Phase 2 (NotebookLM output, design system, etc.)
npm run validate:wceu:phase2
```

## WCEU 2026 Validation Scripts

Two JavaScript-based validation scripts have been created to replace legacy bash scripts:

### `validate-phase2-completion.js`

Validates Phase 2 WCEU 2026 deliverables including:

- NotebookLM output files and content quality
- Supporting documentation (prompts, checklists, sources index)
- Google Slides foundation (interactive verification)
- Frontmatter and Markdown validation
- Content quality checks (timing, examples, visuals)

**Usage:**

```bash
npm run validate:wceu:phase2
# or
node scripts/validate-phase2-completion.js
```

**Features:**

- Interactive input for manual verification steps (Google Slides check)
- Color-coded output for pass/fail/warning indicators
- Detailed logging of validation results
- Cross-platform compatible (uses Node.js built-ins)

### `verify-wceu-readiness.js`

Validates Phase 1 WCEU 2026 completion including:

- Schema migration (.schemas directory removed, new schema structure)
- Agent slides reorganization
- Content file completeness
- Frontmatter and Markdown validation
- File reference integrity

**Usage:**

```bash
npm run validate:wceu:phase1
# or
node scripts/verify-wceu-readiness.js
```

**Features:**

- Non-interactive, fully automated validation
- Comprehensive file existence and structure checks
- Integration with `npm run validate:frontmatter` and `npm run lint:md`
- Cross-platform compatible

## Running Test Suites

```bash
# Run all tests
./run-all-tests.sh

# Run category-specific tests
scripts/maintenance/run-maintenance-tests.sh
scripts/utility/run-utility-tests.sh

# Run individual test files
bats scripts/includes/__tests__/test-logging.bats
```

## Using Includes in Scripts

```bash
#!/bin/bash
# Source shared utilities
source "$(dirname "$0")/../includes/core/logging.sh"
source "$(dirname "$0")/../includes/core/validation.sh"
source "$(dirname "$0")/../includes/cli/cli-utils.sh"

# Use standardized functions
parse_common_args "$@"
log_info "Starting script execution"
validate_required_command "git"
```

## Validation & Testing

Validation tooling applied to scripts:

| Area        | Tool             | Purpose                                 |
| ----------- | ---------------- | --------------------------------------- |
| Shell       | ShellCheck       | Static analysis for Bash scripts        |
| Bash tests  | Bats             | Behaviour validation of shell utilities |
| JS/TS       | ESLint           | Linting and code quality checks         |
| Collections | Custom validator | Ensures collection schema compliance    |
| Frontmatter | Schema validator | Validates metadata blocks               |
| Markdown    | Markdownlint     | Documentation formatting consistency    |

Example aggregate run (placeholder):

```bash
./run-all-tests.sh            # Executes all test suites
npm run lint                  # Lints JS/TS sources
shellcheck scripts/**/*.sh    # Shell linting
markdownlint scripts/**/*.md  # README / docs lint
```

## Change Log / History

Version: 2.5 (increment when public script interfaces or includes contracts change).
Refer to `../CHANGELOG.md` for release context and automation evolution.

## FAQ / Troubleshooting

**Collection validation failed?** Ensure `collection.schema.json` is up to date and YAML frontmatter paths are correct.
**Scripts sourcing wrong path?** Use `$(dirname "$0")` patterns and avoid relative assumptions.
**Permission denied running script?** Add executable bit: `chmod +x <script>`.
**Bats tests not found?** Verify test file naming pattern `test-*.bats` and correct path in run script.

## Limitations & Notes

- Some legacy scripts may not yet use standardized logging wrappers.
- JSON validation tooling scheduled for consolidation into a single CLI.
- Multi-platform (macOS/Linux) parity tests are partial; Windows support not prioritized.

## Environment & Dependencies

| Dependency | Minimum | Purpose                   |
| ---------- | ------- | ------------------------- |
| Node.js    | 18+     | Run JS/validation scripts |
| Bash       | 5.x     | Execute shell automation  |
| Bats       | Latest  | Shell test framework      |
| ShellCheck | Latest  | Shell static analysis     |
| jq         | Latest  | JSON manipulation         |

## Related Documentation

## Internal References

- [Coding Standards](../instructions/coding-standards.instructions.md)
- [Quality Assurance](../instructions/quality-assurance.instructions.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Schema Definitions](../.schemas/)

## External Dependencies

- **GitHub CLI** — For GitHub API interactions
- **Node.js** — For JavaScript validation scripts
- **Bats** — For Bash script testing
- **ShellCheck** — For shell script linting
- **jq** — For JSON processing

## Development Workflow

1. **Script Development**: Follow coding standards and include proper headers
2. **Testing**: Add comprehensive tests in appropriate `__tests__/` directory
3. **Documentation**: Update README files and inline documentation
4. **Validation**: Run linting and validation tools
5. **Integration**: Ensure compatibility with existing workflows

## Maintenance

## Regular Tasks

- Update dependencies and schemas
- Validate all configuration files
- Run comprehensive test suites
- Update documentation and badges
- Synchronize labels and issue types

## Monitoring

- Check log files in `logs/` directory
- Monitor GitHub Actions workflow results
- Validate script execution in CI/CD pipelines
- Review test coverage and failures

## Script Execution Flow

```mermaid
flowchart TD
accTitle: "Script execution flow and lifecycle"
accDescr: "Detailed flowchart showing script execution lifecycle from dependency checking, includes loading, CLI argument parsing, input validation, main logic execution, test running, and exit handling with error and success paths."
    A[Script Execution] --> B{Check Dependencies}
    B -->|Missing| C[Install Dependencies]
    B -->|Available| D[Load Includes]
    C --> D
    D --> E[Parse CLI Arguments]
    E --> F[Validate Inputs]
    F --> G{Validation Pass?}
    G -->|No| H[Show Error & Exit]
    G -->|Yes| I[Execute Main Logic]
    I --> J[Run Tests if Available]
    J --> K{Tests Pass?}
    K -->|No| L[Report Failures]
    K -->|Yes| M[Log Success]
    L --> N[Exit with Error]
    M --> O[Exit Successfully]

    style A fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
    style I fill:#dcfce7,color:#14532d,stroke:#14532d
    style O fill:#ecfdf5,color:#064e3b,stroke:#059669
    style N fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c
```

## Contributing

When contributing new scripts or modifications:

1. Follow the established directory structure
2. Use shared utilities from `includes/`
3. Add comprehensive tests
4. Update relevant README files
5. Ensure all validation passes
6. Document dependencies and usage

---

## References

## Documentation Links

- [LightSpeedWP Main Repository](https://github.com/lightspeedwp/.github)
- [Coding Standards Instructions](../instructions/coding-standards.instructions.md)
- [Quality Assurance](../instructions/quality-assurance.instructions.md)
- [WordPress Development Standards](https://developer.wordpress.org/coding-standards/)

## Development Resources

- [GitHub Actions Workflows](../.github/workflows/)
- [Schema Definitions](../.schemas/)
- [Test Coverage Reports](../tests/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## AI & Automation References

- [Custom Instructions](../.github/custom-instructions.md)
- [Agents Documentation](../agents/agent.md)
- [Prompts Library](../.github/prompts/prompts.md)
- [Automation & Workflows](../docs/AUTOMATION.md)
- [Workflow Coordination](../docs/WORKFLOW_COORDINATION.md)
- [Testing Standards](../docs/TESTING.md)
- [Linting Standards](../docs/LINTING.md)

---

---

*🎼 Orchestrated automation — where intelligence meets operations*
