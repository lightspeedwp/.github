---
title: 'Maintenance Scripts Documentation'
description: 'Documentation for repository maintenance and automation scripts'
version: '1.0'
last_updated: '2025-11-18'
author: 'LightSpeed WP Team'
category: 'scripts'
tags: ['maintenance', 'automation', 'labels', 'badges', 'readmes']
references:
  - './README.md'
  - '../../scripts/maintenance/README.md'
  - '../label-automation/README.md'
  - '../MANAGE-READMES.md'
  - '../RELEASE-PROCESS.md'
---

# Maintenance Scripts

Comprehensive automation scripts for repository maintenance, quality assurance, and documentation generation. These scripts keep the repository clean, well-documented, and compliant with LightSpeed standards.

## Overview

Location: `/scripts/maintenance/`

**Purpose:** Automate repository maintenance tasks including:
- README and documentation generation
- GitHub label synchronization
- Workflow badge updates
- Changelog validation
- Issue type management

**Documentation:**
- Folder README: [`/scripts/maintenance/README.md`](../../scripts/maintenance/README.md)
- Label Automation: [`/docs/label-automation/`](../label-automation/README.md)
- README Management: [`/docs/MANAGE-READMES.md`](../MANAGE-READMES.md)

## Scripts

### Documentation Generation

#### folder-and-file-readmes.sh

**Purpose:** Generates comprehensive README files for folders and individual scripts by extracting metadata from file headers.

**Usage:**
```bash
# Generate all READMEs
./scripts/maintenance/folder-and-file-readmes.sh

# Dry-run mode
DRY_RUN=true ./scripts/maintenance/folder-and-file-readmes.sh

# Generate for specific directory
./scripts/maintenance/folder-and-file-readmes.sh scripts/utility
```

**Features:**
- Extracts metadata from script file headers
- Generates folder-level README.md files
- Creates index files for quick navigation
- Supports nested directory structures
- Preserves custom documentation sections

**Tests:** `tests/maintenance/tests-folder-and-file-readmes.bats`

---

#### find-readmes.sh

**Purpose:** Discovers and catalogs all README files in the repository for analysis and verification.

**Usage:**
```bash
# Find all READMEs
./scripts/maintenance/find-readmes.sh

# Output to file
./scripts/maintenance/find-readmes.sh > readme-inventory.txt
```

**Output:**
- List of all README.md file paths
- Count of total READMEs
- Directory hierarchy visualization

---

#### update-readme-and-changelog.sh

**Purpose:** Ensures all README.md files contain required badges and links to CONTRIBUTING.md.

**Usage:**
```bash
# Update all READMEs
./scripts/maintenance/update-readme-and-changelog.sh

# Check specific README
./scripts/maintenance/update-readme-and-changelog.sh docs/README.md
```

**Updates:**
- License badge
- Contributing link
- Standard footer
- Cross-references

**Tests:** `tests/maintenance/test-update-readme-and-changelog.bats`

**Documentation:** [MANAGE-READMES.md](../MANAGE-READMES.md)

---

### Label Management

#### manage-labels.sh

**Purpose:** Manages GitHub repository labels including creation, updates, and synchronization across repositories.

**Usage:**
```bash
# Sync labels from canonical source
./scripts/maintenance/manage-labels.sh --sync

# Create new label
./scripts/maintenance/manage-labels.sh --create "label-name" "color" "description"

# Update existing label
./scripts/maintenance/manage-labels.sh --update "old-name" --new-name "new-name"

# Dry-run mode
DRY_RUN=true ./scripts/maintenance/manage-labels.sh --sync
```

**Features:**
- Syncs labels from `.github/automation/labels.yml`
- Creates missing labels
- Updates existing labels (name, color, description)
- Preserves labels not in canonical source
- Batch operations support

**Tests:** `tests/maintenance/test-manage-labels.bats`

**Documentation:** [Label Automation](../label-automation/README.md)

---

#### prune-labels.sh

**Purpose:** Conservative, REST-only label sync with optional pruning of non-standard labels.

**Usage:**
```bash
# Sync without pruning
./scripts/maintenance/prune-labels.sh

# Map non-standard labels
./scripts/maintenance/prune-labels.sh --map

# Prune after confirmation
./scripts/maintenance/prune-labels.sh --prune
```

**Features:**
- Maps non-canonical labels to standard labels
- Safe pruning with confirmation
- Dry-run mode for testing
- Detailed reporting of changes
- Backup before pruning

**Tests:** `tests/maintenance/test-prune-labels.bats`

---

### Issue Type Management

#### manage-issue-types.sh

**Purpose:** Manages GitHub issue types including creation, configuration, and standards enforcement.

**Usage:**
```bash
# Create issue type
./scripts/maintenance/manage-issue-types.sh --create

# Update issue type
./scripts/maintenance/manage-issue-types.sh --update "type-name"

# List issue types
./scripts/maintenance/manage-issue-types.sh --list
```

**Features:**
- Creates standardized issue types
- Configures issue templates
- Enforces LightSpeed standards
- Validates issue type compliance

**Tests:** `tests/maintenance/test-manage-issue-types.bats`

**Documentation:** [Issue Creation Guide](../ISSUE_CREATION_GUIDE.md)

---

### Workflow & Badge Management

#### update-badges.sh

**Purpose:** Updates workflow status badges in main README.md for all workflows in the repository.

**Usage:**
```bash
# Update all badges
./scripts/maintenance/update-badges.sh

# Dry-run mode
DRY_RUN=true ./scripts/maintenance/update-badges.sh
```

**Features:**
- Scans `.github/workflows/` directory
- Generates badge markdown for each workflow
- Updates README.md badge section
- Preserves custom badges
- Validates badge URLs

**Tests:** `tests/maintenance/test-update-badges.bats`

---

### Changelog Management

#### validate-changelog-links.sh

**Purpose:** Validates that all entries in `[Unreleased]` section of CHANGELOG.md have proper comparison links.

**Usage:**
```bash
# Validate changelog
./scripts/maintenance/validate-changelog-links.sh

# Fix missing links
./scripts/maintenance/validate-changelog-links.sh --fix
```

**Features:**
- Validates link format
- Checks link accessibility
- Identifies missing links
- Auto-fix capability

**Tests:** `tests/maintenance/test-update-changelog-links.bats`

**Documentation:** [Release Process](../RELEASE-PROCESS.md)

---

### Testing

#### test-pr-labeler.sh

**Purpose:** Simple test script to verify Pull Request labeler workflow functionality.

**Usage:**
```bash
# Test PR labeler
./scripts/maintenance/test-pr-labeler.sh

# With custom PR number
./scripts/maintenance/test-pr-labeler.sh 123
```

**Features:**
- Simulates PR events
- Validates labeler configuration
- Reports labeling results
- Dry-run safe

---

#### run-maintenance-tests.sh

**Purpose:** Dedicated test runner for executing all maintenance-related Bats tests.

**Usage:**
```bash
# Run all maintenance tests
./scripts/maintenance/run-maintenance-tests.sh

# Run with verbose output
./scripts/maintenance/run-maintenance-tests.sh --verbose

# Run specific test
./scripts/maintenance/run-maintenance-tests.sh test-manage-labels
```

**Features:**
- Runs all maintenance tests
- Aggregates test results
- Provides coverage reports
- CI/CD integration

## Common Workflows

### Workflow 1: Label Synchronization

```bash
# 1. Update canonical labels file
vim .github/automation/labels.yml

# 2. Validate syntax
npx js-yaml .github/automation/labels.yml

# 3. Sync labels (dry-run first)
DRY_RUN=true ./scripts/maintenance/manage-labels.sh --sync

# 4. Sync labels for real
./scripts/maintenance/manage-labels.sh --sync

# 5. Verify changes
gh label list
```

### Workflow 2: README Generation

```bash
# 1. Update script file headers
vim scripts/utility/new-script.sh

# 2. Generate READMEs
./scripts/maintenance/folder-and-file-readmes.sh

# 3. Review generated docs
cat scripts/utility/README.md

# 4. Commit changes
git add scripts/utility/README.md
git commit -m "docs: generate README for utility scripts"
```

### Workflow 3: Pre-Release Maintenance

```bash
# 1. Update badges
./scripts/maintenance/update-badges.sh

# 2. Validate changelog
./scripts/maintenance/validate-changelog-links.sh

# 3. Update READMEs
./scripts/maintenance/update-readme-and-changelog.sh

# 4. Run tests
./scripts/maintenance/run-maintenance-tests.sh

# 5. Commit maintenance updates
git add .
git commit -m "chore: pre-release maintenance updates"
```

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `GITHUB_TOKEN` | GitHub API authentication | Yes | - |
| `GITHUB_REPOSITORY` | Repository context | Yes | Auto-detect |
| `DRY_RUN` | Preview mode without changes | No | `false` |
| `DEBUG` | Enable verbose logging | No | `false` |

## Testing

All maintenance scripts have comprehensive test coverage:

```bash
# Run all maintenance tests
npm run test:maintenance

# Or using Bats directly
bats tests/maintenance/

# Run specific test
bats tests/maintenance/test-manage-labels.bats
```

**Test Coverage:** 200+ tests across all scripts

**Test Documentation:** `/tests/maintenance/README.md`

## CI/CD Integration

Maintenance scripts integrate with CI/CD workflows:

- **Pre-commit:** README validation, changelog checks
- **On PR:** Label verification, badge updates
- **Nightly:** Full maintenance sweep
- **Pre-release:** Comprehensive validation

See [Workflows Documentation](../WORKFLOWS.md) for details.

## Troubleshooting

### Label Sync Issues

**Problem:** Labels not syncing correctly

**Solution:**
```bash
# 1. Verify canonical source
cat .github/automation/labels.yml

# 2. Check GitHub token permissions
gh auth status

# 3. Run in dry-run mode
DRY_RUN=true DEBUG=true ./scripts/maintenance/manage-labels.sh --sync

# 4. Check API rate limits
gh api rate_limit
```

### README Generation Failures

**Problem:** README not generated correctly

**Solution:**
```bash
# 1. Verify script file headers
head -30 scripts/category/script-name.sh

# 2. Run with debug output
DEBUG=true ./scripts/maintenance/folder-and-file-readmes.sh

# 3. Check permissions
ls -la scripts/category/
```

### Badge Update Issues

**Problem:** Badges not updating in README

**Solution:**
```bash
# 1. Verify workflow files exist
ls .github/workflows/

# 2. Check README badge section
grep "!\[.*\]" README.md

# 3. Run with dry-run
DRY_RUN=true ./scripts/maintenance/update-badges.sh
```

## Best Practices

1. **Always dry-run first** - Test changes before applying
2. **Verify permissions** - Ensure GitHub token has required scopes
3. **Check rate limits** - Monitor API usage
4. **Review changes** - Inspect generated content before committing
5. **Run tests** - Validate scripts before deployment
6. **Document changes** - Update relevant documentation

## Related Documentation

- [Label Automation Strategy](../label-automation/README.md)
- [README Management](../MANAGE-READMES.md)
- [Release Process](../RELEASE-PROCESS.md)
- [Workflows Documentation](../WORKFLOWS.md)
- [Issue Creation Guide](../ISSUE_CREATION_GUIDE.md)

## Contributing

When adding new maintenance scripts:

1. Follow script template in [README.md](./README.md)
2. Add comprehensive tests to `/tests/maintenance/`
3. Document in this file
4. Update `/scripts/maintenance/README.md`
5. Add to CI/CD workflows if appropriate

---

**Last Updated:** 2025-11-18
**Scripts:** 11
**Test Coverage:** 95%+
**Status:** ✅ Production Ready
