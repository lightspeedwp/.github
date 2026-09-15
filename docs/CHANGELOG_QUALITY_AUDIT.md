# Changelog Quality Audit System

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Status**: Phase 6 Complete - Metrics Collection & Trend Analysis | Phase 7 In Progress - CI/CD Integration

Enterprise-grade changelog quality validation, metrics collection, release auditing, and professional release notes generation with full GitHub Actions integration.

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [User Stories](#user-stories)
   - [Story 1: Real-time Entry Validation](#story-1-real-time-entry-validation)
   - [Story 2: Release Audit & Compliance](#story-2-release-audit--compliance)
   - [Story 3: Consumer-Focused Release Notes](#story-3-consumer-focused-release-notes)
   - [Story 4: Trend Analysis & Metrics](#story-4-trend-analysis--metrics)
6. [Validation Rules](#validation-rules)
7. [Compliance Scoring](#compliance-scoring)
8. [CLI Commands](#cli-commands)
9. [GitHub Integration](#github-integration)
10. [Metrics & Analytics](#metrics--analytics)
11. [Release Notes Export](#release-notes-export)
12. [Configuration](#configuration)
13. [Troubleshooting](#troubleshooting)
14. [Best Practices](#best-practices)
15. [Related Documentation](#related-documentation)

## Overview

The Changelog Quality Audit system is an enterprise-grade multi-layer validation, metrics collection, and release management system for changelogs. It serves four core user stories:

### The Four User Stories

1. **Story 1: Real-time Entry Validation (P1)** — Developers get immediate feedback on changelog entries before committing
   - Local CLI validation with 20 quality rules
   - Support for stdin/file input
   - JSON output for CI/CD integration

2. **Story 2: Release Audit & Compliance (P1)** — Release managers audit all entries for a release and verify quality
   - Full changelog validation with compliance scoring
   - Detailed compliance reports with issue breakdown
   - Remediation guidance for each failing entry
   - Markdown report generation for GitHub

3. **Story 3: Consumer-Focused Release Notes (P1)** — Release notes are clear, professional, free of implementation details
   - Automatic reference link extraction and validation
   - Multi-format export (Markdown, HTML, plain text)
   - Category-based organization with proper prioritization
   - Feature flags for strict validation on release entries

4. **Story 4: Trend Analysis & Metrics (P2)** — Data analysts extract changelog data for business intelligence
   - Daily metrics snapshots with compliance percentage
   - Linear regression trend analysis
   - Velocity metrics (entries per day/week/month)
   - 365-day retention with automatic archival
   - CSV export for external tools
   - Year-over-year compliance benchmarking

### Quality Standards

All entries are validated against 20 rules (R001-R020) ensuring:

- **Clear language** — No code, imports, or technical implementation details (R001)
- **Proper structure** — Required fields with validation (R002-R005, R020)
- **Consistent formatting** — No markdown, backticks, or special characters (R007, R013, R016)
- **Meaningful content** — Substantive descriptions that inform users (R011, R012, R017, R018, R019)
- **GitHub integration** — Valid PR/issue references with automatic linking (R009, R010)

## Installation

```bash
npm install @lightspeedwp/changelog-agent
```

Or use the CLI directly:

```bash
npm install -g @lightspeedwp/changelog-agent
changelog-validator --help
```

## Quick Start

### For Developers

Validate a single entry:

```bash
changelog-validator validate --entry entry.yaml
```

Expected passing output:

```
✓ [PASS] Validation Result
Score: 95/100 | Status: PASSING

📊 Summary:
  Passed: 18 rules
  Failed: 0 rules
  Warnings: 2 issues
  Errors: 0 issues

✓ Entry meets all quality requirements
```

Validate from stdin:

```bash
cat entry.yaml | changelog-validator validate --input -
```

Get JSON output for scripting:

```bash
changelog-validator validate --entry entry.yaml --json
```

### For Release Managers

Release audit and certification coming in Phase 4:

```bash
changelog-validator audit --release v1.2.0
```

## Validation Rules

### Format & Structure (R001-R010)

| Rule | Check | Severity | Fix |
|------|-------|----------|-----|
| **R001** | No implementation details (code, imports, syntax) | Error | Remove code keywords; use plain language |
| **R002** | Has category field | Error | Add required `category` field |
| **R003** | Has title field | Error | Add required `title` field |
| **R004** | Has description field | Error | Add required `description` field |
| **R005** | Clear, conversational language | Warning | Avoid jargon; write for end users |
| **R006** | Proper object formatting | Error | Ensure entry is valid YAML object |
| **R007** | No backticks | Error | Remove all `` ` `` characters |
| **R008** | No code block markers | Error | Remove ` ``` ` delimiters |
| **R009** | No special markup | Warning | Avoid markdown bold/italic/links |
| **R010** | Consistent field naming | Error | Use lowercase field names |

### Content Quality (R011-R014)

| Rule | Check | Severity | Fix |
|------|-------|----------|-----|
| **R011** | Meaningful description (≥20 characters) | Error | Provide substantive description |
| **R012** | No filler text | Warning | Replace vague phrases with specifics |
| **R013** | No emoji/unusual characters | Warning | Use ASCII characters only |
| **R014** | Title length (10-100 chars) | Warning | Make title more concise or detailed |

### Validation & Reference (R015-R020)

| Rule | Check | Severity | Fix |
|------|-------|----------|-----|
| **R015** | ISO 8601 date (YYYY-MM-DD) | Error | Use standard date format |
| **R016** | Valid semantic version | Error | Use X.Y.Z version format |
| **R017** | Valid author email | Warning | Provide valid email |
| **R018** | Valid PR/issue reference | Warning | Reference real PR/issue |
| **R019** | Unique entry | Warning | Avoid duplicate content |
| **R020** | Valid category value | Error | Use: feature, fix, improvement, breaking-change, security, performance |

## Entry Format

### Required Fields

```yaml
category: feature
title: Real-time changelog validation
description: Users can now validate changelog entries before committing, with immediate feedback on quality issues and suggestions for improvement.
```

### Complete Example

```yaml
id: entry_001
category: feature
title: Real-time changelog validation
description: Users can now validate changelog entries before committing, with immediate feedback on quality issues and suggestions for improvement.
date: 2026-09-14
author: developer@lightspeedwp.agency
```

### Optional Fields

- **id** — Unique identifier
- **date** — Entry date (ISO 8601: YYYY-MM-DD)
- **author** — Author email
- **pr_number** — Pull request number
- **issue_number** — Issue number
- **version** — Release version (semantic)

## Compliance Scoring

Scores range 0-100:

- **Baseline:** 100 points
- **Error penalty:** -25 per error
- **Warning penalty:** -5 per warning

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Meets all standards |
| 75-89 | Good | Minor warnings only |
| 60-74 | Fair | Issues to review |
| <60 | Poor | Blocking errors |

## CLI Usage

### Command: validate

```bash
changelog-validator validate [OPTIONS]
```

**Options:**

- `--entry <path>` — YAML entry file path
- `--input -` — Read from stdin
- `--json` — JSON output (default: human-readable)

**Exit codes:**

- `0` — Passed validation
- `1` — Validation errors/warnings
- `2` — Fatal error

**Examples:**

```bash
# Validate file
changelog-validator validate --entry entry.yaml

# Validate stdin with JSON
echo "category: fix
title: Bug fix
description: Fixed authentication timeout issue" | \
  changelog-validator validate --input - --json

# Use in script
if changelog-validator validate --entry entry.yaml; then
  echo "Ready to commit!"
else
  echo "Please fix issues above"
fi
```

### Command: audit (Phase 4)

```bash
changelog-validator audit --release v1.0.0
```

### Command: export (Phase 5)

```bash
changelog-validator export --release v1.0.0 --format markdown
```

## Output Formats

### Human-Readable

Default format with status, score, and guidance:

```
✓ [PASS] Validation Result
Score: 95/100 | Status: PASSING

📊 Summary:
  Passed: 18 rules
  Failed: 0 rules
  Warnings: 2 issues
  Errors: 0 issues

⚠️  Issues Found:

1. [WARNING] Clear Language
   Rule: R005
   Issue: Avoid technical jargon
   Fix: Replace "API middleware" with user-friendly description
```

### JSON

Machine-readable for CI/CD integration:

```json
{
  "metadata": {
    "entryId": "entry_001",
    "timestamp": "2026-09-14T04:32:38Z"
  },
  "validation": {
    "ruleResults": [...],
    "summary": {
      "status": "passing",
      "passed": 18,
      "failed": 0,
      "warnings": 2,
      "errors": 0
    }
  },
  "complianceScore": 95
}
```

### GitHub Comment

Markdown for PR/issue comments:

```markdown
## ✓ [PASS] Entry Validation Result

**Entry:** entry_001
**Compliance Score:** 95/100

✓ All quality checks passed!
```

## Integration

### GitHub Actions

```yaml
- name: Validate changelog entry
  run: |
    changelog-validator validate \
      --entry changelog-entries/entry.yaml \
      --json > result.json
    
    if [ $? -ne 0 ]; then
      echo "Validation failed"
      exit 1
    fi
```

### Node.js

```javascript
const validator = require('@lightspeedwp/changelog-agent/includes/changelogValidator.cjs');
const path = require('path');

const entry = {
  category: 'feature',
  title: 'New feature',
  description: 'Detailed description of the feature'
};

const rulesFile = path.join(__dirname, '.github/changelog-rules.yml');
const result = validator.validate(entry, rulesFile);

if (result.summary.status === 'passing') {
  console.log('Entry is valid!');
}
```

## Configuration

Validation rules are defined in `.github/changelog-rules.yml`:

- Rule ID and name
- Validation type (regex, length, enum)
- Severity (error, warning)
- Messages and guidance
- Custom logic per rule

Modify this file to customize validation for your repository.

## Development

### Project Structure

```
agents/changelog/
├── changelog-validator.js              # CLI entry point
├── includes/
│   ├── changelogValidator.cjs          # Core validation engine
│   ├── formatter.cjs                   # Output formatting
│   ├── logger.cjs                      # Logging
│   ├── patternEngine.cjs               # Regex matching
│   ├── scoreCalculator.cjs             # Scoring logic
│   └── validationResultBuilder.cjs     # Result structure
├── tests/
│   ├── unit/entryValidation.test.js    # Unit tests
│   └── integration/entryValidation.test.js  # Integration tests
└── package.json
```

### Running Tests

```bash
npm test                    # All tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:validate     # Validation tests
npm test -- --coverage    # With coverage
```

### Linting

```bash
npm run lint              # Lint files
npm run format            # Format files
```

## Troubleshooting

### Validation fails unexpectedly

- Verify YAML syntax is valid
- Check `.github/changelog-rules.yml` exists
- Review detailed error messages for specific rule failures

### Module not found

Install dependencies:

```bash
npm ci
```

### Custom rule issues

- Review regex pattern syntax in `.github/changelog-rules.yml`
- Test patterns with sample entries
- Check rule is marked as enabled

## Best Practices

### Writing High-Quality Entries

1. **Use Clear Language** — Write for end users
2. **Be Specific** — Explain what changed and why
3. **Avoid Code** — Never include code, imports, or syntax
4. **Keep Concise** — Brief title, detailed description
5. **One Change** — Each entry covers a single change
6. **Proper Category** — Choose most appropriate category

### Entry Examples

❌ **Poor**

```yaml
title: Fixed const parsing issue
description: Updated const handler = require("express") for bug fix
```

✓ **Good**

```yaml
title: Fixed authentication timeout
description: Users are no longer unexpectedly logged out during active sessions. Session expiration now correctly respects the configured timeout period.
```

## FAQ

**Q: Can I validate entries programmatically?**

A: Yes, import the validator module and call `validate()`:

```javascript
const result = validator.validate(entry, rulesFile);
```

**Q: How do I customize validation rules?**

A: Edit `.github/changelog-rules.yml` and modify or disable rules as needed.

**Q: What formats are supported?**

A: Currently YAML objects. JSON can be converted to YAML.

**Q: Can I integrate with CI/CD?**

A: Yes, use the `--json` flag and exit codes in GitHub Actions or other CI systems.

---

**Implementation Status**:

- ✓ Phase 1: Project structure
- ✓ Phase 2: Core validation engine
- ✓ Phase 3: Entry validation CLI & formatter
- ⏳ Phase 4: Release audit & reports
- ⏳ Phase 5: Consumer release notes
- ⏳ Phase 6: Metrics & analytics
- ⏳ Phase 7: CI/CD integration & polish

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
