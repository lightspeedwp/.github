---
title: 'Scripts Documentation Hub'
description: 'Comprehensive documentation for all LightSpeed WP automation scripts, utilities, and tools'
version: '1.0'
last_updated: '2025-11-18'
author: 'LightSpeed WP Team'
category: 'documentation'
tags: ['scripts', 'automation', 'utilities', 'documentation']
references:
  - '../README.md'
  - '../../scripts/README.md'
  - '../DEVELOPMENT.md'
  - './awesome-copilot.md'
  - './maintenance.md'
  - './projects.md'
---

# Scripts Documentation Hub

Comprehensive documentation for all automation scripts, utilities, and tools in the LightSpeed WP ecosystem. This hub provides detailed information about each script category, usage examples, and integration guidelines.

## Overview

The `/scripts/` directory contains 50+ automation scripts organized into 9 main categories, supporting everything from repository maintenance to GitHub Projects management. This documentation provides a centralized reference for all scripts.

## Quick Navigation

| Category | Purpose | Documentation | Scripts |
|----------|---------|---------------|---------|
| [Awesome Copilot](#awesome-copilot) | Prompt collection management | [📄 Doc](./awesome-copilot.md) | 5 scripts |
| [Includes](#includes) | Shared utilities & helpers | [📄 Doc](./includes.md) | 10+ utilities |
| [JSON Validation](#json-validation) | Configuration validation | [📄 Doc](./json-validation.md) | 3 scripts |
| [Validation](#validation) | Frontmatter validation | [📄 Doc](./validation.md) | 2 scripts |
| [Maintenance](#maintenance) | Repository maintenance | [📄 Doc](./maintenance.md) | 11 scripts |
| [Projects](#projects) | GitHub Projects management | [📄 Doc](./projects.md) | 5 scripts |
| [Utility](#utility) | General utilities | [📄 Doc](./utility.md) | 7 scripts |
| [Versioning](#versioning) | Version management | [📄 Doc](./versioning.md) | 1 script |
| [Root Level](#root-level) | Top-level automation | [📄 Doc](./root-level-scripts.md) | 8 scripts |

## Script Categories

### Awesome Copilot

**Purpose:** Collection and prompt management for Awesome Copilot system

**Documentation:** [awesome-copilot.md](./awesome-copilot.md)

**Scripts:**
- `create-collection.js` - Creates new prompt collections
- `validate-collections.js` - Validates collection schemas
- `yaml-parser.js` - YAML frontmatter parsing utilities
- `update-readme.js` - Generates collection READMEs
- `fix-line-endings.sh` - Normalizes line endings

**Use Cases:**
- Creating new prompt collections
- Validating existing collections against schemas
- Maintaining documentation for prompts
- Cross-platform file compatibility

---

### Includes

**Purpose:** Shared utilities and test helpers used across all scripts

**Documentation:** [includes.md](./includes.md)

**Core Utilities:**
- `cli-utils.sh` - CLI argument parsing and help generation
- `colors.sh` - Terminal color constants and functions
- `common-functions.sh` - General-purpose utilities
- `logging.sh` - Standardized logging system
- `validation.sh` - Input validation utilities
- `file-operations.sh` - Safe file system operations

**Test Helpers:**
- `enhanced-test-helpers.bash` - Extended Bats testing utilities
- `agent-test-helpers.bash` - Agent-specific test helpers

**Use Cases:**
- Building new automation scripts
- Writing standardized tests
- Consistent logging across scripts
- Reusable validation logic

---

### JSON Validation

**Purpose:** Validation of JSON/YAML configuration files

**Documentation:** [json-validation.md](./json-validation.md)

**Scripts:**
- `validate-coderabbit-yml.cjs` - Validates CodeRabbit configuration
- `update-coderabbit-schema.cjs` - Updates CodeRabbit schema
- `validate-coderabbit-yml.test.js` - Test suite for validator

**Use Cases:**
- Pre-commit configuration validation
- CI/CD pipeline checks
- Schema compliance enforcement
- Configuration file testing

---

### Validation

**Purpose:** Frontmatter and metadata validation

**Documentation:** [validation.md](./validation.md)

**Scripts:**
- `validate-frontmatter.js` - Main frontmatter validation script
- `validate-frontmatter.sh` - Shell wrapper for validation

**Use Cases:**
- Documentation quality assurance
- Pre-commit frontmatter checks
- Metadata consistency enforcement
- Schema compliance validation

---

### Maintenance

**Purpose:** Repository maintenance and automation

**Documentation:** [maintenance.md](./maintenance.md)

**Scripts:**
- `find-readmes.sh` - Finds all README files
- `folder-and-file-readmes.sh` - Generates comprehensive READMEs
- `update-readme-and-changelog.sh` - Ensures README/changelog consistency
- `validate-changelog-links.sh` - Validates changelog links
- `update-badges.sh` - Updates workflow badges
- `manage-labels.sh` - Manages GitHub labels
- `prune-labels.sh` - Conservative label synchronization
- `manage-issue-types.sh` - Manages GitHub issue types
- `test-pr-labeler.sh` - Tests PR labeler workflow
- `run-maintenance-tests.sh` - Runs maintenance test suite

**Use Cases:**
- Automated documentation generation
- Label synchronization across repos
- Badge updates for CI/CD
- Repository quality assurance
- Changelog maintenance

---

### Projects

**Purpose:** GitHub Projects creation and management

**Documentation:** [projects.md](./projects.md)

**Scripts:**
- `client-delivery-project.sh` - Creates/updates client delivery projects
- `product-dev-project.sh` - Creates/updates product development projects
- `update-projects.sh` - Core project management engine
- `run-project-tests.sh` - Runs project-related tests
- `validate-project-fields.js` - Validates project field definitions

**Fixtures:**
- CSV templates for project configuration
- Field definitions and settings

**Use Cases:**
- Standardized project creation
- Field configuration management
- Project template deployment
- Scrumban workflow automation

---

### Utility

**Purpose:** General-purpose utilities and support functions

**Documentation:** [utility.md](./utility.md)

**Scripts:**
- `lint-shell.sh` - Shell script linting
- `standardize-logging.sh` - Injects standardized logging
- `utility-functions.sh` - Common shell function library
- `validate-release.sh` - Pre-release validation
- `manage-labels.sh` - Label management utilities
- `manage-issue-types.sh` - Issue type management
- `run-utility-tests.sh` - Runs utility test suite

**Use Cases:**
- Code quality enforcement
- Release preparation
- Standard logging injection
- Label/issue type management

---

### Versioning

**Purpose:** Version management and bumping

**Documentation:** [versioning.md](./versioning.md)

**Scripts:**
- `bump-file-version.cjs` - Bumps file version in frontmatter

**Use Cases:**
- Automated version bumping
- Frontmatter version management
- Semantic versioning enforcement
- Pre-release version updates

---

### Root Level

**Purpose:** Top-level automation and validation scripts

**Documentation:** [root-level-scripts.md](./root-level-scripts.md)

**Scripts:**
- `canonical-to-json.js` - Converts YAML to JSON
- `create-release-pr.cjs` - Creates release PRs
- `validate-changelog.cjs` - Validates changelog format
- `validate-version.cjs` - Validates VERSION file
- `verify-docs-commands.js` - Verifies documentation commands
- `gather-metrics.js` - Collects CI/repo metrics
- `run-all-tests.sh` - Master test runner

**Use Cases:**
- Release automation
- Repository-wide validation
- Metrics collection
- Comprehensive testing

## Common Usage Patterns

### Running Scripts

```bash
# From repository root
./scripts/category/script-name.sh

# With npm scripts
npm run script:name

# With proper sourcing of utilities
source scripts/includes/common-functions.sh
```

### Script Standards

All scripts follow these standards:

1. **File Headers** - Comprehensive headers with purpose, author, version
2. **Error Handling** - Robust error handling with meaningful messages
3. **Logging** - Standardized logging using `scripts/includes/logging.sh`
4. **Documentation** - Inline documentation and usage examples
5. **Testing** - Comprehensive test coverage in `/tests/`

### Environment Variables

Common environment variables used across scripts:

| Variable | Purpose | Required |
|----------|---------|----------|
| `GITHUB_TOKEN` | GitHub API authentication | Yes (most scripts) |
| `GITHUB_REPOSITORY` | Repository context | Yes (many scripts) |
| `DRY_RUN` | Preview mode without changes | No |
| `DEBUG` | Enable verbose logging | No |
| `CI` | CI environment indicator | No |

## Testing Scripts

All scripts have corresponding tests in `/tests/`:

```bash
# Run all tests
npm run test

# Run category-specific tests
bats tests/maintenance/test-*.bats

# Run with coverage
npm run test:coverage
```

See [Test Documentation](../TESTING.md) for comprehensive testing guide.

## Development Workflow

### Creating New Scripts

1. Choose appropriate category (or create new one)
2. Follow naming conventions (`verb-noun.sh` or `action-script.js`)
3. Add comprehensive file header
4. Source required utilities from `/scripts/includes/`
5. Implement with proper error handling
6. Add tests to `/tests/category/`
7. Document in category README
8. Update this hub documentation

### Script Template

```bash
#!/usr/bin/env bash

# ==================================================================
# Script Name
# Description: Brief purpose of script
# Author: Your Name
# Version: 1.0
# Standards:
#   - [LightSpeed Coding Standards](...)
# Dependencies:
#   - List of required utilities or tools
# ==================================================================

set -euo pipefail

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../includes/logging.sh"
source "$SCRIPT_DIR/../includes/validation.sh"

# Main logic here
main() {
    log_info "Starting script execution"
    # Implementation
    log_info "Script completed successfully"
}

main "$@"
```

## Related Documentation

### Core Documentation
- [Main Documentation Hub](../README.md)
- [Development Guide](../DEVELOPMENT.md)
- [Testing Documentation](../TESTING.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

### Script-Specific Docs
- [Awesome Copilot Scripts](./awesome-copilot.md)
- [Maintenance Scripts](./maintenance.md)
- [Project Management Scripts](./projects.md)
- [Utility Scripts](./utility.md)
- [Validation Scripts](./validation.md)

### Related Topics
- [Label Automation](../label-automation/README.md)
- [Git Workflows](../git-workflow/README.md)
- [Configuration](../config/README.md)
- [Release Process](../RELEASE-PROCESS.md)

## Continuous Integration

Scripts are validated via CI/CD:

- **Linting:** ShellCheck, ESLint, Prettier
- **Testing:** Bats, Jest test suites
- **Validation:** Schema compliance, security checks
- **Documentation:** README generation, link validation

See [Workflows Documentation](../WORKFLOWS.md) for CI/CD details.

## Troubleshooting

### Common Issues

**Permission denied:**
```bash
# Make script executable
chmod +x scripts/category/script-name.sh
```

**Utility not found:**
```bash
# Check source path is correct
source "$SCRIPT_DIR/../includes/utility-name.sh"

# Verify utility exists
ls scripts/includes/
```

**GitHub API authentication:**
```bash
# Set GitHub token
export GITHUB_TOKEN="your_token_here"

# Or use gh CLI
gh auth login
```

### Getting Help

- Check category-specific documentation
- Review script file headers for usage
- Run script with `--help` flag
- Check `/tests/` for usage examples
- Review CI/CD workflow configurations

## Contributing

When contributing new scripts:

1. Follow [Contributing Guidelines](../../CONTRIBUTING.md)
2. Add comprehensive documentation
3. Include tests with >80% coverage
4. Follow LightSpeed coding standards
5. Update relevant README files
6. Validate with linting tools

## Maintenance

- **Review quarterly** - Ensure scripts are up to date
- **Deprecate unused scripts** - Remove or archive obsolete scripts
- **Update dependencies** - Keep utilities and libraries current
- **Monitor failures** - Track and fix recurring issues
- **Document changes** - Update documentation with changes

---

**Last Updated:** 2025-11-18
**Maintained By:** LightSpeed WP Team
**Total Scripts:** 50+
**Test Coverage:** 85%+
**Status:** ✅ Active | 🟢 Well-Maintained
