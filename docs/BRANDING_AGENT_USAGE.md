---
title: "Unified Branding Agent — Usage Guide"
description: "Complete guide for using the unified branding agent to apply category-aware branding to documents"
file_type: "documentation"
version: "1.0.1"
created_date: "2026-05-29"
last_updated: "2026-06-19"
category: "docs"
owners: ["LightSpeedWP Automation Team"]
---

# Unified Branding Agent — Usage Guide

**Document Version**: 1.0.1
**Last Updated**: 2026-06-19
**Related Issues**: #555 (Wave 4E Implementation)

---

## Overview

The **Unified Branding Agent** automates the application of category-aware branding (headers, footers, and badges) to Markdown documents across the repository.

It reads from the canonical branding configuration (`config/footers.config.yaml` and `.schemas/branding-schema.json`) with a legacy fallback for older automation paths, and applies consistent branding rules based on:

- **Document category** (explicitly in frontmatter or inferred from file path)
- **Predefined footer templates** per category
- **Frontmatter metadata** (title, version, owners, dates)
- **Fallback rules** for missing metadata

---

## Installation & Setup

### Prerequisites

- Node.js 18+ (for ES modules support)
- `js-yaml` package (already in project dependencies)
- `minimist` package (already in project dependencies)

### Verify Installation

```bash
# Check that the agent file exists
ls -la .github/scripts/agents/branding-unified.agent.js

# Check configuration files exist
ls -la config/footers.config.yaml
ls -la .schemas/branding-schema.json
```

---

## Usage

### Command Line Interface

```bash
node .github/scripts/agents/branding-unified.agent.js <file-path> [options]
```

### Arguments

| Argument | Description | Example |
|----------|-------------|---------|
| `<file-path>` | **Required**. Path to file relative to project root | `docs/guide.md` |

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--dry-run` | `-d` | Preview changes without writing | `true` |
| `--apply` | — | Apply changes to file | `false` |
| `--verbose` | `-v` | Show detailed output | `false` |
| `--infer-metadata` | — | Infer missing frontmatter fields | `false` |
| `--help` | `-h` | Show help message | — |

### Examples

#### Preview changes (dry-run mode)

```bash
# Default: dry-run shows what would change
node .github/scripts/agents/branding-unified.agent.js docs/guide.md

# Output:
# 📄 File: docs/guide.md
# Status: success
# Category: docs
#
# ✅ Changes:
#   - Updated header
#   - Updated footer
```

#### Apply changes to file

```bash
# --apply flag writes changes to the file
node .github/scripts/agents/branding-unified.agent.js docs/guide.md --apply

# Output includes "Status: applied"
```

#### Verbose output

```bash
# Shows detailed processing information
node .github/scripts/agents/branding-unified.agent.js docs/guide.md --verbose
```

#### Infer missing metadata

```bash
# Automatically fills in missing required fields with sensible defaults
node .github/scripts/agents/branding-unified.agent.js docs/guide.md --apply --infer-metadata

# Output:
# ✅ Changes:
#   - Set title to: guide
#   - Set category to: docs
#   - Set file_type to: documentation
#   - Set last_updated to: 2026-05-29
```

#### Help message

```bash
node .github/scripts/agents/branding-unified.agent.js --help
```

---

## How It Works

### Step 1: Determine Category

The agent determines the document's category using **hybrid inference**:

1. **Check frontmatter** — If `category:` field is present and valid, use it
2. **Check file path** — Match path against predefined patterns (in priority order)
3. **Fallback** — Default to `docs` category if no match

**Example Category Inference**:

```yaml
# File: docs/governance/policy.md
# Frontmatter: (category field present)

# Step 1: Check frontmatter
category: governance  # ✅ Found → Use "governance"
```

```yaml
# File: agents/labeling.agent.md
# Frontmatter: (no category field)

# Step 1: Check frontmatter → not found
# Step 2: Check path patterns
# Pattern: ^agents\/.*\.(?:md|agent\.md)$ → MATCH
# Use: "agents"  # ✅ Inferred
```

### Step 2: Validate Frontmatter

Check that required fields are present for the category:

- **Required fields** (all categories): `title`, `description`, `file_type`, `category`
- **Optional but recommended**: `version`, `created_date`, `last_updated`, `owners`, `tags`, `status`, `stability`

Validation errors are reported as **warnings** and don't block processing.

```yaml
# Example: missing 'description'
---
title: "My Document"
# description: MISSING
file_type: documentation
category: docs
---

# Output:
# ⚠️  Warnings:
#   - Missing required field: description
```

### Step 3: Generate Header (if required)

For categories with `header_behavior: "required"`, the agent generates a header including:

- **Document title**
- **Category badge** (e.g., `[docs]`)
- **Status** (active, draft, deprecated)
- **Version** (if present)
- **Owners** (if present)
- **Last updated** (if present)

**Example Generated Header**:

```markdown
---
title: API Documentation
description: Complete API reference
category: docs
version: 2.0.0
owners: ["@ashshaw", "team@lightspeedwp.agency"]
last_updated: "2026-05-29"
---

# API Documentation

**Category**: [docs] · **Status**: Active · **Version**: 2.0.0
**Owners**: @ashshaw, team@lightspeedwp.agency · **Last Updated**: 2026-05-29

---

## API Endpoints

Content begins here...
```

### Step 4: Select and Render Footer

The agent selects a footer template based on:

1. **Explicit selection** — `footer_id:` field in frontmatter (highest priority)
2. **Category default** — `default_footer` from category configuration
3. **Fallback** — `lightspeed-standard` if category has no default

Footer templates may contain **variables** that are substituted:

```yaml
# Example footer template with variable:
audit-footer:
  template: |
    ---
    🔍 Audit report generated {audit_date}
  variables:
    audit_date: "Date the audit was performed (YYYY-MM-DD)"
```

**Variable Substitution**:

```yaml
# Frontmatter:
---
audit_date: "2026-05-28"
---

# Rendered footer:
---
🔍 Audit report generated 2026-05-28
```

### Step 5: Write File

- **Dry-run mode** (default): Preview output, no changes written
- **Apply mode** (`--apply`): Write changes to file and report success

---

## Configuration Files

### `config/footers.config.yaml`

Defines all categories and footer templates:

```yaml
version: "1.0.0"

categories:
  docs:
    name: "Documentation"
    default_footer: "lightspeed-standard"
    allowed_footers: ["lightspeed-standard", "lightspeed-brief"]
    header_behavior: "required"
    footer_behavior: "required"

footers:
  lightspeed-standard:
    id: "lightspeed-standard"
    template: |
      ---
      *Built by 🧱 LightSpeedWP*
```

### Validation

The repository validator now treats missing branded footers in changed Markdown as a failure and can backfill them from the category default via `npm run validate:footers -- --fix`.

Run the validator after bulk edits or agent changes to make sure changed docs are not left unbranded:

```bash
npm run validate:footers
```

### `.schemas/branding-schema.json`

Comprehensive JSON Schema for validation and IDE autocomplete.

### `.schemas/frontmatter.schema.json`

Defines frontmatter field types and constraints.

---

## Category Reference

### All 16 Categories

| Category | File Pattern | Header Required | Footer Required | Default Footer |
|----------|----------|---|---|---|
| `docs` | `docs/**/*.md` | Yes | Yes | `lightspeed-standard` |
| `agents` | `agents/**/*.md` | Yes | Yes | `ai-ops-standard` |
| `instructions` | `instructions/**/*.md` | Yes | Yes | `standards-footer` |
| `ai-ops` | `docs/**/*governance*.md` | Yes | Yes | `ai-ops-standard` |
| `prompts` | `prompts/**/*.md` | Optional | Optional | `ai-ops-standard` |
| `schema` | `.schemas/**/*.md` | Yes | Yes | `schema-footer` |
| `audit` | `.githu./.github/reports/**/*.md` | Yes | Yes | `audit-footer` |
| `research` | `research/**/*.md` | Yes | Yes | `research-footer` |
| `workflow` | `.github/workflows/**/*.md` | Yes | Yes | `ai-ops-standard` |
| `awesome-copilot` | `awesome-copilot/**/*.md` | Yes | Yes | `copilot-footer` |
| `governance` | `governance/**/*.md` | Yes | Yes | `governance-footer` |
| `test` | `test/**/*.md` | Optional | Optional | `lightspeed-standard` |
| `utility` | `.github/scripts/**/*.md` | Optional | Optional | `utility-footer` |
| `readme` | `README.md` | No | Yes | `lightspeed-standard` |
| `issue-template` | `.github/ISSUE_TEMPLATE/*.md` | No | Optional | `issue-footer` |
| `pull-request-template` | `.github/PULL_REQUEST_TEMPLATE/*.md` | No | Optional | `pr-footer` |

---

## Examples

### Example 1: Process a Documentation File

**File: `docs/getting-started.md`**

```markdown
---
title: "Getting Started"
description: "Quick start guide for the project"
file_type: documentation
category: docs
version: "1.0.0"
owners: ["@ashshaw"]
last_updated: "2026-05-29"
---

## Installation

To install...
```

**Command**:

```bash
node .github/scripts/agents/branding-unified.agent.js docs/getting-started.md --apply
```

**Result**:

The agent:

1. ✅ Infers category: `docs` (already in frontmatter)
2. ✅ Validates frontmatter: All required fields present
3. ✅ Generates header with metadata badges
4. ✅ Selects footer: `lightspeed-standard` (default for docs)
5. ✅ Writes file with header and footer

**Output**:

```markdown
---
title: "Getting Started"
description: "Quick start guide for the project"
file_type: documentation
category: docs
version: "1.0.0"
owners: ["@ashshaw"]
last_updated: "2026-05-29"
---

# Getting Started

**Category**: [docs] · **Status**: Active · **Version**: 1.0.0
**Owners**: @ashshaw · **Last Updated**: 2026-05-29

---

## Installation

To install...

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
```

### Example 2: Process an Agent File

**File: `agents/my-agent.md`** (no frontmatter)

```markdown
# My Agent

This is an agent specification...
```

**Command**:

```bash
node .github/scripts/agents/branding-unified.agent.js agents/my-agent.md --apply --infer-metadata
```

**Result**:

The agent:

1. ✅ Infers category: `agents` (from path pattern)
2. ⚠️  Validates frontmatter: Missing required fields
3. ✅ Infers metadata: title, category, file_type, last_updated
4. ✅ Generates header with inferred metadata
5. ✅ Selects footer: `ai-ops-standard` (default for agents)
6. ✅ Writes file with frontmatter, header, and footer

### Example 3: Dry-Run Preview

**Command**:

```bash
node .github/scripts/agents/branding-unified.agent.js docs/guide.md --verbose
```

**Output**:

```
📄 File: docs/guide.md
Status: success
Category: docs

✅ Changes:
  - Updated header
  - Updated footer

⚠️  Warnings:
  - Missing optional field: owners
```

---

## Batch Processing

### Process Multiple Files

```bash
# Process all docs
for file in docs/**/*.md; do
  node .github/scripts/agents/branding-unified.agent.js "$file" --apply
done

# Process all agents
for file in agents/**/*.md; do
  node .github/scripts/agents/branding-unified.agent.js "$file" --apply
done
```

### Process All Repository Files

```bash
# Dry-run on all markdown files
find . -name "*.md" -type f | while read file; do
  node .github/scripts/agents/branding-unified.agent.js "$file"
done

# Apply to all (careful!)
find . -name "*.md" -type f | while read file; do
  node .github/scripts/agents/branding-unified.agent.js "$file" --apply
done
```

---

## Error Handling

### Common Errors

#### File Not Found

```
❌ Error: File not found: docs/nonexistent.md
```

**Solution**: Check that the file path is correct and relative to project root.

#### Invalid Frontmatter YAML

```
❌ Error: Failed to parse frontmatter: mapping values are not allowed here...
```

**Solution**: Check YAML syntax. Use a YAML validator: <https://www.yamllint.com/>

#### Invalid Category

```
⚠️  Warnings:
  - Unknown category: invalid_category
```

**Solution**: Use one of the 16 valid categories. See category reference table above.

### Validation Warnings vs. Errors

- **Warnings** (⚠️): Missing optional fields, non-critical issues. Processing continues.
- **Errors** (❌): File not found, invalid YAML, etc. Processing stops.

---

## API Usage (Programmatic)

The agent can be imported and used programmatically in other scripts:

```javascript
import {
  parseFrontmatter,
  inferCategory,
  validateFrontmatter,
  generateHeader,
  getFooter,
  processBrandingDocument,
} from "./.github/scripts/agents/branding-unified.agent.js";

// Parse a file
const content = fs.readFileSync("docs/guide.md", "utf-8");
const { frontmatter, body } = parseFrontmatter(content);

// Infer category
const category = inferCategory("docs/guide.md", frontmatter, config);

// Validate
const errors = validateFrontmatter(frontmatter, category, config);

// Generate
const header = generateHeader(frontmatter, category, config);
const footer = getFooter(category, frontmatter, config);

// Or use the all-in-one processor
const result = processBrandingDocument("docs/guide.md", {
  apply: true,
  infer_missing_metadata: true,
});
```

---

## Troubleshooting

### Agent not found

```
node: no such file or directory: .github/scripts/agents/branding-unified.agent.js
```

**Solution**: Verify file exists and you're in the project root.

### Configuration file not found

```
Error: Branding config not found: {path}/config/footers.config.yaml
```

**Solution**: Verify `config/footers.config.yaml` exists in project root.

### Module not found errors

```
Error: Cannot find module 'js-yaml'
```

**Solution**: Install dependencies: `npm ci`

### Permission denied

```
-bash: .github/scripts/agents/branding-unified.agent.js: Permission denied
```

**Solution**: Add execute permission: `chmod +x .github/scripts/agents/branding-unified.agent.js`

---

## Best Practices

### 1. Always Use Dry-Run First

```bash
# Preview changes before applying
node .github/scripts/agents/branding-unified.agent.js file.md

# Review output, then apply
node .github/scripts/agents/branding-unified.agent.js file.md --apply
```

### 2. Provide Complete Frontmatter

Always include the 4 required fields:

```yaml
---
title: "Document Title"
description: "Brief description of content"
file_type: "documentation"
category: "docs"
---
```

### 3. Use Path-Based Category Inference

If your file is in a standard location, you don't need to specify category:

```yaml
# File: docs/guide.md
---
title: "Guide"
description: "A guide"
file_type: "documentation"
# category: omitted — inferred from path
---
```

### 4. Keep Footers Minimal

Prefer 3–4 line footers. Very long footers disrupt readability.

### 5. Use Variable Substitution

For dated content, use variables instead of hardcoding:

```yaml
---
audit_date: "2026-05-28"
---

# Then footer template substitutes {audit_date}
```

---

## Integration with CI/CD

### GitHub Actions Workflow Example

```yaml
name: Apply Branding to Markdown Files

on:
  pull_request:
    paths:
      - "**.md"

jobs:
  branding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Apply branding to changed files
        run: |
          git diff --name-only HEAD~1 | grep '\.md$' | while read file; do
            node .github/scripts/agents/branding-unified.agent.js "$file" --apply
          done

      - name: Commit changes
        if: success()
        run: |
          git config user.name "Automation"
          git config user.email "automation@lightspeedwp.agency"
          git add .
          git commit -m "Apply unified branding" || echo "No changes"
```

---

## Related Documentation

- **[BRANDING_CONFIG_SPEC.md](./BRANDING_CONFIG_SPEC.md)** — Complete configuration specification
- **[Issue #555](https://github.com/lightspeedwp/.github/issues/555)** — Implementation details
- **[Wave 4D: Schema & Config](./BRANDING_CONFIG_SPEC.md)** — Configuration system
- **[Wave 4C: Audit](https://github.com/lightspeedwp/.github/issues/553)** — Current state analysis

---

## Support & Feedback

For issues, questions, or feature requests:

1. Check this documentation
2. Review [BRANDING_CONFIG_SPEC.md](./BRANDING_CONFIG_SPEC.md)
3. Open an issue on GitHub: <https://github.com/lightspeedwp/.github/issues>

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
