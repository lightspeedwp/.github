---
file_type: "documentation"
title: "Validation Scripts"
description: "Comprehensive validation scripts for LightSpeedWP .github repository ensuring schema compliance, frontmatter standards, and code quality"
version: '1.1'
last_updated: '2026-08-20'
owners:
  - LightSpeedWP Team
tags:
  - validation
  - automation
  - quality-assurance
  - testing
  - frontmatter
---

# Validation Scripts Directory

This directory contains **validation scripts** used across the LightSpeedWP `.github` repository to ensure consistency, compliance, and quality standards.

## Purpose

- **Frontmatter Validation** — Ensure all documentation has complete, valid frontmatter
- **Changelog Validation** — Keep a Changelog 1.1.0 compliance checking
- **Schema Validation** — JSON/YAML schema compliance across config files
- **Link Validation** — Broken link detection and fixing
- **Branching Rules** — Enforce branch naming conventions
- **Workflow Validation** — GitHub Actions workflow integrity checks

## Key Scripts

### Changelog Validation

- **`validate-changelog.cjs`** — Validate CHANGELOG.md schema and format
- **`changelog-rules.cjs`** — Define changelog format rules (em-dashes, length, capitalization)
- **`fix-changelog-format.cjs`** — Auto-fix changelog formatting issues
- **Related tests:** `__tests__/validate-changelog.test.js`, `__tests__/changelogBuilder.test.js`

### Frontmatter Validation

- **`validate-frontmatter.js`** — Comprehensive frontmatter schema validation
- **`validate-frontmatter-changed.js`** — Validate only changed files
- **`validate-frontmatter-freshness.js`** — Check last_updated dates are recent
- **`validate-agent-frontmatter.js`** — Agent-specific frontmatter validation

### Structure & Schema Validation

- **`validate-json.js`** — JSON file validation
- **`validate-coderabbit-yml.cjs`** — CodeRabbit config validation
- **`validate-labeling-configs.cjs`** — Label configuration validation
- **`validate-workflows.js`** — GitHub Actions workflow validation
- **`validate-agents.js`** — Agent specification validation
- **`validate-plugins.js`** — Plugin structure validation
- **`validate-skills.js`** — Skill structure validation

### Code Quality

- **`lint-md-changed.cjs`** — Markdown linting for changed files
- **`validate-links.js`** — Detect broken links in documentation
- **`validate-readme-links.js`** — Validate README cross-references

### Branch & Commit Validation

- **`validate-branch-name.js`** — Enforce branch naming conventions
- **`validate-conventional-commits.js`** — Conventional commit format checking

### Accessibility & Mermaid

- **`validate-mermaid-syntax.js`** — Mermaid diagram syntax validation
- **`validate-mermaid-accessibility.js`** — Accessibility checks (labels, descriptions)
- **`validate-mermaid-colour-contrast.js`** — Color contrast validation for color-blind accessibility

### Specialized Validation

- **`validate-version.cjs`** — Version file consistency checking
- **`validate-issue-fields.cjs`** — GitHub issue field validation
- **`validate-memory.js`** — User memory file validation (MEMORY.md structure)
- **`validate-retired-doc-links.js`** — Check for links to archived/removed docs
- **`validate-workflow-npm-scripts.cjs`** — Verify npm script references in workflows

## Testing

All validation scripts have corresponding test files in `__tests__/`:

```bash
# Run all validation tests
npm test

# Run specific validation test
jest __tests__/validate-changelog.test.js
jest __tests__/validate-frontmatter.test.js
```

**Test Coverage:** 100+ test files across validation suite

## Usage Examples

### Validate CHANGELOG.md

```bash
node scripts/validation/validate-changelog.cjs ./CHANGELOG.md
```

### Validate Frontmatter

```bash
node scripts/validation/validate-frontmatter.js ./docs/my-guide.md
```

### Fix Changelog Formatting

```bash
node scripts/validation/fix-changelog-format.cjs ./CHANGELOG.md
```

### Validate Branch Name

```bash
node scripts/validation/validate-branch-name.js --branch feat/new-feature
```

### Lint Changed Markdown

```bash
git diff --name-only | node scripts/validation/lint-md-changed.cjs
```

## Integration with Workflows

These scripts are called from GitHub Actions workflows:

- **Pull Request Validation:** `.github/workflows/pr-validation.yml`
- **Changelog Management:** `.github/workflows/changelog-management.yml`
- **Release Process:** `.github/workflows/release.yml`
- **Labeling Workflows:** `.github/workflows/labeling.yml`

## Return Codes

Most validation scripts follow this convention:

```
0 = Success (validation passed)
1 = Failure (validation failed)
2 = Warning (non-blocking issues)
```

## Configuration

Many validation scripts read configuration from:

- **`.github/labels.yml`** — Label definitions
- **`.schemas/`** — JSON schema definitions
- **`schemas/`** — Portable schema copies
- **`.coderabbit.yaml`** — CodeRabbit configuration
- **`.github/custom-instructions.md`** — Custom instructions

## Common Patterns

### Error Messages

All validation scripts provide clear, actionable error messages:

```
❌ Validation Failed: CHANGELOG.md
   Error: Missing [Unreleased] section
   Fix: Add ## [Unreleased] section to CHANGELOG.md
```

### Logging

Scripts support verbose logging:

```bash
DEBUG=true node scripts/validation/validate-frontmatter.js ./docs/file.md
VERBOSE=true node scripts/validation/validate-changelog.cjs
```

### Dry-Run Mode

Some scripts support dry-run to preview changes:

```bash
node scripts/validation/fix-changelog-format.cjs --dry-run
```

## Adding New Validation Scripts

When creating a new validation script:

1. **Name it descriptively** without `.agent.js` suffix (e.g., `validate-xyz.js`)
2. **Use clear return codes** (0 = pass, 1 = fail)
3. **Provide helpful error messages** with actionable fixes
4. **Add comprehensive tests** in `__tests__/[name].test.js`
5. **Document usage** in this README
6. **Export functions** for reuse in workflows

## Performance Notes

- **Bulk validation:** Scripts process multiple files efficiently
- **Concurrency:** Some scripts use parallel processing
- **Large repos:** Optimized for repositories with 1000+ files

## Troubleshooting

### "Script not found"

Ensure you're running from the repository root:

```bash
cd /path/to/.github
node scripts/validation/validate-changelog.cjs
```

### "Module not found"

Install dependencies:

```bash
npm ci
```

### Permission denied

Make scripts executable:

```bash
chmod +x scripts/validation/validate-*.js
```

## References

- [Frontmatter Standards](../../instructions/documentation-formats.instructions.md)
- [Coding Standards](../../instructions/coding-standards.instructions.md)
- [Labeling Guide](../../docs/LABELING.md)
- [CHANGELOG Automation](../../docs/CHANGELOG_AUTOMATION.md)
- [Mermaid Accessibility](../../docs/VALIDATION_MERMAID_ACCESSIBILITY.md)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
