# Changelog Quality Audit System

**Status**: Phase 3 Complete - Real-time Entry Validation

Real-time validation and quality assurance for changelog entries across LightSpeed projects.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Validation Rules](#validation-rules)
5. [Entry Format](#entry-format)
6. [Compliance Scoring](#compliance-scoring)
7. [CLI Usage](#cli-usage)
8. [Output Formats](#output-formats)
9. [Integration](#integration)
10. [Configuration](#configuration)
11. [Development](#development)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [FAQ](#faq)

## Overview

The Changelog Quality Audit system ensures changelog entries meet quality standards:
- **Clear language** — No code, imports, or technical implementation details
- **Proper structure** — Required fields (category, title, description)
- **Consistent formatting** — No markdown, backticks, or special characters
- **Meaningful content** — Substantive descriptions that inform users
- **Compliance scoring** — Numeric quality assessment (0-100)

**Intended for**:
- **Developers** — Validate entries before committing
- **Release Managers** — Audit and certify changelog entries (Phase 4)
- **Users & Support** — Reading clear, professional release notes (Phase 5)

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
