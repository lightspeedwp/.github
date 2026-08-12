---
title: "Branding Configuration Specification"
description: "Complete specification for category-aware branding, frontmatter validation, and header/footer management"
file_type: "documentation"
version: "1.0.1"
created_date: "2026-05-29"
last_updated: "2026-06-19"
category: "governance"
owners: ["LightSpeedWP Automation Team"]
---

# Branding Configuration Specification

**Document Version**: 1.0.1
**Last Updated**: 2026-06-19
**Related Issues**: #33 (Parent Spec), #554 (Schema Implementation), #555 (Agent Implementation), #556 (Remediation)

---

## Overview

This specification defines the complete configuration system for unified branding across the LightSpeed `.github` repository. It covers:

- **16 Document Categories** with metadata, templates, and rules
- **Frontmatter Fields** (4 required + 7 optional)
- **Path-based Category Inference** with priority rules
- **Header & Footer Management** per category
- **Badge Conventions** for consistent visual marking
- **Validation Rules** for schema compliance

The system is **config-driven** and **automation-friendly**, allowing the unified branding agent to read configuration from YAML/JSON and apply category-aware branding consistently across all documents.

---

## 1. Document Categories (16 Total)

### 1.1 Category Reference Table

| ID | Name | Audience | File Patterns | Header | Footer | Default Footer |
|---|---|---|---|---|---|---|
| `readme` | README & Overview | Contributors, users | `README.md`, `*/README.md` | Optional | Required | `lightspeed-standard` |
| `docs` | Documentation | End users, maintainers | `docs/**/*.md` | Required | Required | `lightspeed-standard` |
| `ai-ops` | AI Operations | Maintainers, automation teams | `docs/**/*governance*.md`, `docs/**/*automation*.md` | Required | Required | `ai-ops-standard` |
| `agents` | Agent Specifications | Developers, framework maintainers | `agents/**/*.md` | Required | Required | `ai-ops-standard` |
| `instructions` | Instructions & Standards | Developers, reviewers | `instructions/**/*.md`, `*.instructions.md` | Required | Required | `standards-footer` |
| `prompts` | Prompts & Examples | Prompt engineers, AI users | `prompts/**/*.md`, `*.prompt.md`, `wceu-2026/**/*.md` | Optional | Optional | `ai-ops-standard` |
| `schema` | Schema & Validation | Developers, API users | `.schemas/**/*.md`, `*.schema.md` | Required | Required | `schema-footer` |
| `audit` | Audit & Reports | Auditors, decision makers | `audit/**/*.md`, `*audit*.md`, `.github/reports/**/*.md` | Required | Required | `audit-footer` |
| `research` | Research & Analysis | Researchers, stakeholders | `research/**/*.md`, `*research*.md` | Required | Required | `research-footer` |
| `workflow` | Workflows & Automation | DevOps, automation engineers | `.github/workflows/**/*.md`, `docs/**/*workflow*.md` | Required | Required | `ai-ops-standard` |
| `issue-template` | Issue Templates | Contributors | `.github/ISSUE_TEMPLATE/*.md` | Optional | Optional | `issue-footer` |
| `pull-request-template` | Pull Request Templates | Contributors | `.github/PULL_REQUEST_TEMPLATE/*.md` | Optional | Optional | `pr-footer` |
| `test` | Test Documentation | QA, developers | `test/**/*.md`, `*test*.md`, `**/*-test.md` | Optional | Optional | `lightspeed-standard` |
| `utility` | Utility Documentation | DevOps, automation engineers | `.github/scripts/**/*.md`, `utils/**/*.md`, `*.utility.md` | Optional | Optional | `utility-footer` |
| `awesome-copilot` | Awesome Copilot | Copilot users, extension developers | `awesome-copilot/**/*.md` | Required | Required | `copilot-footer` |
| `governance` | Governance & Policy | Maintainers, decision makers | `governance/**/*.md`, `docs/**/*governance*.md` | Required | Required | `governance-footer` |

---

## 2. Frontmatter Fields Specification

### 2.1 Required Fields (4)

All documents must include these four fields in frontmatter:

#### `title` (string)

- **Description**: Human-readable title of the document
- **Type**: String
- **Constraints**: 1–200 characters, non-empty
- **Example**: `"Unified Branding Agent Specification"`
- **Used by**: Header generation, document indexing, category inference

#### `description` (string)

- **Description**: Brief description of the document's purpose
- **Type**: String
- **Constraints**: 10–500 characters
- **Example**: `"Complete specification for category-aware branding and header/footer management"`
- **Used by**: Search indexes, document summaries, agent context

#### `file_type` (string)

- **Description**: Type of file (from standard enum)
- **Type**: String
- **Allowed Values**: `documentation`, `instructions`, `agent`, `prompt`, `report`, `guide`, `template`, `specification`, `issue-template`, `pr-template`
- **Example**: `"documentation"`
- **Used by**: Schema validation, template selection, category inference

#### `category` (string)

- **Description**: Document category for branding and organization
- **Type**: String
- **Allowed Values**: One of the 16 categories above (e.g., `docs`, `agents`, `instructions`)
- **Example**: `"governance"`
- **Used by**: Footer selection, header generation, validation, path inference

### 2.2 Optional Fields (7)

Recommended but not required:

#### `version` (string)

- **Description**: Document version (semantic versioning)
- **Type**: String
- **Pattern**: `^v?\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?$`
- **Example**: `"v1.0.0"` or `"1.2.3"`
- **Used by**: Version badges, change tracking, API documentation

#### `created_date` (date)

- **Description**: ISO date when document was created
- **Type**: String (ISO 8601 date format)
- **Format**: `YYYY-MM-DD`
- **Example**: `"2026-05-28"`
- **Used by**: Document history, audit trails, age calculations

#### `last_updated` (date)

- **Description**: ISO date when document was last modified
- **Type**: String (ISO 8601 date format)
- **Format**: `YYYY-MM-DD`
- **Example**: `"2026-05-29"`
- **Used by**: Freshness indicators, footer timestamps, change detection

#### `owners` (array of strings)

- **Description**: List of owners or maintainers responsible for this document
- **Type**: Array of strings (GitHub usernames or email addresses)
- **Constraints**: 1–10 items
- **Example**: `["@ashshaw", "@automation-team", "team@lightspeedwp.agency"]`
- **Used by**: Attribution, responsibility assignment, notification routing

#### `tags` (array of strings)

- **Description**: Keywords for discovery and filtering
- **Type**: Array of strings
- **Constraints**: 1–8 tags, lowercase with hyphens
- **Example**: `["branding", "automation", "governance", "schema"]`
- **Used by**: Search indexing, categorization, cross-references

#### `status` (string)

- **Description**: Current document status
- **Type**: String
- **Allowed Values**: `active`, `deprecated`, `draft`, `experimental`
- **Example**: `"active"`
- **Used by**: Status badges, deprecation warnings, visibility filtering

#### `stability` (string)

- **Description**: API or feature maturity level
- **Type**: String
- **Allowed Values**: `stable`, `experimental`, `incubating`
- **Example**: `"stable"`
- **Used by**: Breaking change notifications, API stability badges

---

## 3. Path-Based Category Inference Rules

### 3.1 Inference Strategy

The unified branding agent uses **hybrid inference** with the following priority:

1. **Frontmatter category** (if present) — highest priority
2. **Path-based patterns** — medium priority, applied in order
3. **Fallback to `docs`** — default if no match

### 3.2 Path Patterns (Priority Order)

Patterns are evaluated in this order; first match wins:

| Priority | Pattern | Inferred Category |
|---|---|---|
| 1 | `.github/ISSUE_TEMPLATE/*.md` | `issue-template` |
| 2 | `.github/PULL_REQUEST_TEMPLATE/*.md` | `pull-request-template` |
| 3 | `agents/**/*.md` or `agents/**/*.agent.md` | `agents` |
| 4 | `awesome-copilot/**/*.md` | `awesome-copilot` |
| 5 | `instructions/**/*.md` or `*.instructions.md` | `instructions` |
| 6 | `prompts/**/*.md` or `*.prompt.md` or `wceu-2026/**/*.md` | `prompts` |
| 7 | `.github/workflows/**/*.md` | `workflow` |
| 8 | `.schemas/**/*.md` or `*.schema.md` | `schema` |
| 9 | `.github/reports/**/*.md` or `*audit*.md` | `audit` |
| 10 | `*research*.md` or `research/**/*.md` | `research` |
| 11 | `test/**/*.md` or `*test*.md` | `test` |
| 12 | `.github/scripts/**/*.md` or `utils/**/*.md` or `*.utility.md` | `utility` |
| 13 | `docs/**/*governance*.md` or `governance/**/*.md` | `governance` |
| 14 | `docs/**/*automation*.md` or `docs/**/*ai-ops*.md` | `ai-ops` |
| 15 | `docs/**/*.md` | `docs` |
| 16 | `README.md` or `*/README.md` | `readme` |

**Note**: Path patterns are case-insensitive glob matches. Longer, more specific patterns are evaluated before shorter, generic ones.

---

## 4. Header Requirements Per Category

### 4.1 Header Inclusion Rules

| Category | Required? | Fields | Format |
|---|---|---|---|
| `readme` | No | — | — |
| `docs` | Yes | Title, Category, Version | Badge + Metadata |
| `ai-ops` | Yes | Title, Category, Governance Level | Badge + Metadata |
| `agents` | Yes | Agent Name, Capabilities | Badge + Metadata |
| `instructions` | Yes | Title, Compliance Level | Badge + Metadata |
| `prompts` | Optional | Tool, Model Compatibility | Badge + Metadata |
| `schema` | Yes | Schema Name, Version | Badge + Metadata |
| `audit` | Yes | Audit Type, Scope | Badge + Metadata |
| `research` | Yes | Research Scope | Badge + Metadata |
| `workflow` | Yes | Trigger Events | Badge + Metadata |
| `issue-template` | No | — | — |
| `pull-request-template` | No | — | — |
| `test` | Optional | Test Type | Badge + Metadata |
| `utility` | Optional | Utility Name | Badge + Metadata |
| `awesome-copilot` | Yes | Resource Type | Badge + Metadata |
| `governance` | Yes | Policy Scope | Badge + Metadata |

### 4.2 Standard Header Format

When headers are required or included:

```markdown
---
<frontmatter>
---

# Document Title

**Category**: [`category-badge`]
**Status**: Active | Draft | Deprecated
**Version**: vX.Y.Z
**Owners**: @owner1, @owner2
**Last Updated**: YYYY-MM-DD

---

## Content begins here...
```

---

## 5. Footer Management

### 5.1 Footer Assignment Rules

- **One footer per document** (enforced by schema)
- Footer ID selected from `allowed_footers` list for the category
- Default footer used if `footer_id` not specified in frontmatter
- All footers must be defined in `footers:` section of configuration

### 5.2 Available Footers

The following footer templates are predefined:

- `lightspeed-standard` — Standard LightSpeed footer (org info)
- `lightspeed-brief` — Minimal LightSpeed footer (single-line)
- `ai-ops-standard` — AI Operations footer (automation team, governance links)
- `standards-footer` — Standards & Guidelines footer (compliance links)
- `schema-footer` — Schema & Validation footer (schema registry links)
- `audit-footer` — Audit Report footer (audit date, reports index)
- `research-footer` — Research & Analysis footer (research date, sources)
- `copilot-footer` — Copilot Collections footer (awesome-copilot links)
- `governance-footer` — Governance & Policy footer (governance links)
- `issue-footer` — Issue Footer (related issues)
- `pr-footer` — Pull Request Footer (closes issues)
- `agent-with-examples` — Agent Footer with Examples (code block, specs)
- `docs-with-edit-link` — Documentation with Edit Link (edit button)
- `utility-footer` — Utility Script Footer (scripts directory)

### 5.3 Footer Template Variables

Footer templates may contain variables that are substituted at render time:

- `{audit_date}` — Date the audit was performed (YYYY-MM-DD)
- `{research_date}` — Date the research was completed (YYYY-MM-DD)
- `{file_path}` — Relative path to file in repo
- `{related_issues}` — Links to related issues
- `{closes_issues}` — Issue numbers this PR closes

---

## 6. Badge Conventions

### 6.1 Standard Badges by Category

Badges are used to visually mark documents with category and status information. They appear in headers and footers.

#### Category Badges

- `[docs]` — Documentation
- `[ai-ops]` — AI Operations
- `[agents]` — Agent Specifications
- `[instructions]` — Coding Standards
- `[prompts]` — Prompt Template
- `[schema]` — Schema Definition
- `[audit]` — Audit Report
- `[research]` — Research Document
- `[workflow]` — CI/CD Workflow
- `[awesome-copilot]` — Copilot Resource
- `[governance]` — Policy Document
- `[test]` — Test Documentation
- `[utility]` — Utility Script

#### Status Badges

- `[Active]` — Current and maintained
- `[Draft]` — Work in progress
- `[Deprecated]` — No longer recommended
- `[Experimental]` — Testing phase

#### Quality Badges (Optional)

- `[✅ Reviewed]` — Peer reviewed and approved
- `[🔍 Audited]` — Compliance checked
- `[🤖 Automated]` — Generated or maintained by automation

---

## 7. Validation Rules

### 7.1 Global Validation Rules

```yaml
validation_rules:
  max_frontmatter_size_bytes: 5000
  enforce_category_in_frontmatter: true
  allow_multiple_footers: false
  max_footer_lines: 5
  require_updated_date: true
```

### 7.2 Category-Specific Validation

Each category may define additional validation rules:

- `max_header_lines` — Maximum lines in generated header
- `max_footer_lines` — Maximum lines in footer
- `require_category_in_frontmatter` — Whether category must be explicit
- `allow_duplicate_footers` — Whether duplicate footer blocks are allowed

---

## 8. Configuration Files

### 8.1 Primary Configuration

**File**: `config/footers.config.yaml`

Defines:

- All 16 document categories with metadata
- Allowed footers per category
- Default footers per category
- Predefined footer templates
- Global validation rules

**Schema**: `.schemas/footer-config.schema.json`

### 8.2 Branding Schema

**File**: `.schemas/branding-schema.json`

Comprehensive JSON Schema defining:

- Complete category structure
- Frontmatter field definitions
- Category inference rules
- Path patterns with priority
- Validation rules

**Usage**: JSON Schema validation for programmatic tools

### 8.3 Frontmatter Schema

**File**: `.schemas/frontmatter.schema.json`

Validates all frontmatter fields across all file types

---

## 9. Using the Configuration

### 9.1 For the Unified Branding Agent

The unified branding agent reads this configuration to:

```javascript
// 1. Determine document category
const category = inferCategory(filePath, frontmatter);

// 2. Select appropriate footer template
const footer = config.categories[category].default_footer;

// 3. Validate against schema
validateFrontmatter(frontmatter, schema);

// 4. Generate or update headers/footers
insertHeader(content, category, frontmatter);
insertFooter(content, footer, frontmatter);

// 5. Validate entire document
validateDocument(content, category);
```

### 9.2 For CI/CD Validation

The configuration is used in:

- Pre-commit hooks (`.husky/pre-push`)
- GitHub Actions workflows
- CodeRabbit configuration
- Linting and validation scripts

Missing branded footers are now treated as a validation failure via `npm run validate:footers`, which can also backfill the category default when run with `--fix`.

### 9.3 For Documentation Generation

Category-aware tools use configuration to:

- Generate category-specific README.md
- Build documentation indexes
- Create cross-references
- Enforce consistency

---

## 10. Maintenance & Extension

### 10.1 Adding a New Category

1. Define category in `config/footers.config.yaml` under `categories:`
   - Include `name`, `description`, `file_patterns`, `allowed_footers`, `default_footer`
2. Add path pattern to `.schemas/branding-schema.json` `category_inference_rules.path_priority`
3. Create or select footer template(s) for the category
4. Add footer ID(s) to `allowed_footers` list
5. Document the category in this specification

### 10.2 Adding a New Footer Template

1. Define footer in `config/footers.config.yaml` under `footers:`
   - Include `id`, `name`, `template`, `variables` (if applicable), `accessibility_notes`
2. Register footer ID in one or more category `allowed_footers` lists
3. Update documentation in this specification

### 10.3 Schema Updates

When updating schema:

1. Increment `version` in both `config/footers.config.yaml` and `.schemas/branding-schema.json`
2. Update `last_updated` timestamp
3. Document changes in this specification
4. Update `CHANGELOG.md` with migration guidance if breaking changes

---

## 11. Examples

### 11.1 Complete Frontmatter Example

```yaml
---
title: "Unified Branding Agent Implementation"
description: "Technical implementation guide for the unified branding agent system"
file_type: "documentation"
category: "docs"
version: "1.0.0"
created_date: "2026-05-28"
last_updated: "2026-05-29"
owners: ["@ashshaw", "automation-team@lightspeedwp.agency"]
tags: ["branding", "automation", "agent", "implementation"]
status: "active"
stability: "stable"
---
```

### 11.2 Category Inference Example

File: `docs/governance/policy-framework.md`

```yaml
---
title: "Policy Framework"
description: "Core governance policies for automation"
file_type: "documentation"
# category intentionally omitted
---
```

**Inference Process**:

1. Check frontmatter → no `category` field
2. Check path patterns → matches `docs/**/*governance*.md`
3. **Inferred category**: `governance`
4. Use `governance-footer` as default footer

### 11.3 Footer Template Example

```yaml
governance-footer:
  id: "governance-footer"
  name: "Governance & Policy Footer"
  template: |
    ---

    ⚖️ *Governance policy maintained by LightSpeedWP*

    [📋 Full Governance Docs](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [🔒 Security](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md)
  emoji_only: false
  accessibility_notes: "Links to comprehensive governance and security policies."
```

---

## 12. References

- **Issue #33**: Unified Branding Agent — Parent Specification
- **Issue #46**: Header/Footer Template Design
- **Issue #49**: Schema & Config Implementation
- **Issue #48**: Current-State Audit (Wave 4C)
- **Issue #554**: Schema & Config Implementation (Wave 4D)
- **Issue #555**: Branding Agent Implementation (Wave 4E)
- **Issue #556**: Remediation & Validation (Wave 4F)

---

**Last Reviewed**: 2026-05-29
**Next Review**: 2026-06-29
**Maintained by**: LightSpeedWP Automation Team

---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
