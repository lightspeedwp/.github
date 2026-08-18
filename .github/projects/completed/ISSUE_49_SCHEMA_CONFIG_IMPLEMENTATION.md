---
title: 'Branding Agent Schema and Config Implementation — Issue [#49](https://github.com/lightspeedwp/.github/issues/49)'
description: Schema and configuration model specification for unified branding agent
  supporting category-aware Markdown headers, footers, and badges
file_type: documentation
category: Governance
version: 'v1.0.1'
created_date: '2026-05-28'
last_updated: '2026-06-01'
owners:
- Ash Shaw
tags:
- branding
- schema
- configuration
- governance
- validation
status: completed
stability: stable
domain: governance
---

# Branding Agent Schema and Config Implementation (Issue [#49](https://github.com/lightspeedwp/.github/issues/49))

**Parent Issue**: [#33](https://github.com/lightspeedwp/.github/issues/33) (Parent Specification)
**Related Issues**: [#46](https://github.com/lightspeedwp/.github/issues/46) (Template Design), [#48](https://github.com/lightspeedwp/.github/issues/48) (Current-state audit)
**Status**: Schema/Config Design Phase
**Effort**: 10–12 hours (schema design, validation, documentation)
**Timeline**: Week 2 implementation

---

## 1. Executive Summary

This document defines the schema and configuration model for the unified branding agent. The schema provides a structured, maintainable source of truth for:

- Document category definitions and metadata
- Frontmatter field support and validation
- Path-to-category mapping rules
- Badge definitions and category-specific rules
- Header and footer template references
- Validation rules and safe failure behavior

The recommended approach is **YAML authoring with JSON Schema validation**, which keeps configuration human-readable while ensuring type safety and deterministic validation.

---

## 2. Configuration Format Decision

### 2.1 Recommended Approach: YAML + JSON Schema

**Format**: YAML (human-friendly authoring)
**Validation**: JSON Schema v7
**Storage**: `config/branding.config.yaml` (main config) and `.schemas/branding.schema.json` (validation schema)

**Rationale**:

- YAML is easier for maintainers to read, update, and review
- JSON Schema provides strict, standards-based validation without custom tooling
- Decouples maintainer workflow (YAML authoring) from system requirements (JSON Schema validation)
- Compatible with existing LightSpeed repo conventions and CI/validation pipeline
- Enables deterministic, testable output from the branding agent

**Alternative Considered**: Inline JSON or TypeScript configuration

- **Rejected**: Requires code changes for simple category/template updates; harder to review in PRs; tighter coupling to agent implementation

---

## 3. Category Definitions

### 3.1 Supported Document Categories

The branding agent supports 16 document categories as defined in Issue [#33](https://github.com/lightspeedwp/.github/issues/33):

| Category ID | Category Name | Description | Key Use Case |
|---|---|---|---|
| `documentation` | Documentation | General documentation, guides, tutorials | `docs/`, `README.md` |
| `agents` | AI Agents | Agent specifications and behavior definitions | `.github/agents/`, agent specs |
| `instructions` | Instructions | Procedural documentation, workflow steps | `.github/instructions/` |
| `schemas` | Schemas | JSON Schema, data model definitions | `.schemas/` |
| `prompts` | Prompts | AI/ML prompts, templates, examples | `prompts/`, agent prompts |
| `governance` | Governance | Policies, standards, guidelines | `CLAUDE.md`, `.coderabbit.yaml` |
| `issue-template` | Issue Templates | GitHub issue templates | `.github/ISSUE_TEMPLATE/` |
| `pr-template` | PR Templates | GitHub PR templates | `.github/PULL_REQUEST_TEMPLATE/` |
| `workflow` | Workflows | GitHub Actions workflows, CI/CD | `.github/workflows/` |
| `research` | Research | Research notes, experiments, findings | `research/`, lab documents |
| `audit` | Audit | Audit reports, compliance documentation | `audit/`, reports |
| `awesome-list` | Awesome Lists | Curated resource lists | `awesome-*.md` |
| `readme` | README | Repository root and section READMEs | `README.md`, `*/README.md` |
| `test` | Test | Test specifications, test plans | `tests/`, `__tests__/` |
| `utility` | Utility | Utility scripts, tools, helpers | `scripts/`, `tools/` |
| `ai-ops` | AI Ops | AI operations, automation, meta-tasks | AI ops issues, meta-agent specs |

### 3.2 Category Configuration Structure

Each category is defined with the following metadata:

```yaml
categories:
  documentation:
    id: "documentation"
    label: "Documentation"
    description: "General documentation, guides, and tutorials"
    badges:
      allowed: ["status", "version", "category", "audience"]
      recommended: ["status"]
      max_count: 4
    header_template: "docs-standard"
    footer_template: "docs-variant-1"
    footer_variants: ["docs-variant-1", "docs-variant-2", "docs-variant-3", "docs-variant-4", "docs-variant-5"]
    path_patterns:
      - "docs/**"
      - "documentation/**"
    fallback_behavior: "use-path-match"
    required_frontmatter: ["category", "title", "last_updated", "owners"]
    optional_frontmatter: ["tags", "status", "stability", "domain", "audience"]
```

**Category Field Reference**:

- `id`: Unique category identifier (lowercase, hyphens)
- `label`: Human-readable category name
- `description`: Purpose and use cases
- `badges.allowed`: Badge types allowed in this category
- `badges.recommended`: Badges that should appear by default
- `badges.max_count`: Maximum badges per document (prevent clutter)
- `header_template`: Default header template for this category
- `footer_template`: Default footer template for this category
- `footer_variants`: Available footer template options
- `path_patterns`: Glob patterns for automatic category inference
- `fallback_behavior`: How to handle missing or ambiguous metadata
- `required_frontmatter`: Fields that must be present in frontmatter
- `optional_frontmatter`: Fields that may influence branding behavior

---

## 4. Frontmatter Field Support

### 4.1 Required Fields

All Markdown documents in the repository must include these frontmatter fields:

| Field | Type | Required | Default | Example | Notes |
|---|---|---|---|---|---|
| `title` | string | Yes | N/A | `"Branding Agent Schema"` | Document title, required for all docs |
| `category` | string | Yes | Inferred from path | `"documentation"` | Must match a defined category ID |
| `last_updated` | date | Yes | N/A | `"2026-05-28"` | ISO 8601 date format, no time |
| `owners` | array[string] | Yes | N/A | `["Ash Shaw", "ops@lightspeedwp.agency"]` | GitHub username or email, at least one |

### 4.2 Optional Fields

These fields may influence badge selection, template variant selection, and fallback behavior:

| Field | Type | Optional | Default | Example | Notes |
|---|---|---|---|---|---|
| `tags` | array[string] | Yes | `[]` | `["schema", "validation"]` | Tag-driven metadata, lowercase |
| `status` | string | Yes | `"active"` | `"active"`, `"deprecated"`, `"draft"` | Controls status badge behavior |
| `version` | string | Yes | Auto-inferred | `"v1.0.0"` | Semantic versioning, optional |
| `stability` | string | Yes | `"stable"` | `"stable"`, `"beta"`, `"experimental"` | Influences stability badge |
| `domain` | string | Yes | Inferred | `"governance"`, `"agents"` | Semantic domain grouping |
| `audience` | string | Yes | `"internal"` | `"internal"`, `"public"`, `"community"` | Affects badge visibility rules |

### 4.3 Frontmatter Validation Rules

**Field Validation**:

- `category`: Must match one of 16 defined category IDs (case-sensitive)
- `status`: Enum: `"active"`, `"deprecated"`, `"draft"`, `"under-review"`, `"on-hold"`
- `stability`: Enum: `"stable"`, `"beta"`, `"experimental"`, `"deprecated"`
- `domain`: Enum: one of domain taxonomy values
- `owners`: Non-empty array, each element is GitHub username or email format
- `tags`: All lowercase, alphanumeric + hyphens, no spaces
- `version`: Must follow semantic versioning (optional, but if present must be valid)
- `last_updated`: Must be valid ISO 8601 date (YYYY-MM-DD format only, no time)

**Validation Behavior**:

- Missing required field: Fail validation, report error
- Invalid enum value: Fail validation, show allowed values
- Invalid format (e.g., malformed date): Fail validation, show expected format
- Missing optional field: Validation passes, use default or fall back to path-based inference

---

## 5. Path-Based Category Inference

### 5.1 Precedence Rules

When determining a document's category, apply in this order:

**Priority 1: Explicit Frontmatter** (highest precedence)

```yaml
category: "agents"  # Always respected if present and valid
```

**Priority 2: Path-Based Mapping** (inferred from file location)

```
prompts/generation/**       → category: "prompts"
agents/**                   → category: "agents"
instructions/**             → category: "instructions"
.schemas/**                   → category: "schemas"
schemas/**                  → category: "schemas"
.github/workflows/**        → category: "workflow"
.github/ISSUE_TEMPLATE/**   → category: "issue-template"
.github/PULL_REQUEST_TEMPLATE/** → category: "pr-template"
docs/**                     → category: "documentation"
documentation/**            → category: "documentation"
README.md                   → category: "readme"
**/README.md                → category: "readme"
tests/** or __tests__/**    → category: "test"
scripts/**                  → category: "utility"
tools/**                    → category: "utility"
research/**                 → category: "research"
audit/**                    → category: "audit"
awesome-*.md                → category: "awesome-list"
```

**Priority 3: Global Default** (lowest precedence)

```yaml
default_category: "documentation"
```

**Example Resolution**:

1. File: `prompts/generation/story-prompt.md`
   - Check frontmatter: no explicit `category` field
   - Check path: matches `prompts/generation/**` → `"prompts"`
   - Result: `category: "prompts"`

2. File: `docs/custom-category.md` with frontmatter `category: "agents"`
   - Check frontmatter: `"agents"` is valid → use it
   - Result: `category: "agents"` (path inference skipped)

3. File: `misc-file.md` with no path match
   - Check frontmatter: no category
   - Check path: no pattern match
   - Fall back to default: `category: "documentation"`
   - Result: `category: "documentation"`

---

## 6. Badge Rules and Structure

### 6.1 Badge Types

The branding agent supports the following badge types:

#### Status Badge

- **Purpose**: Indicates document lifecycle stage
- **Valid Values**: `"active"`, `"deprecated"`, `"draft"`, `"under-review"`, `"on-hold"`
- **Sourced From**: Frontmatter `status` field (defaults to `"active"`)
- **Rendering**: `![Status: Active](...)` with category-specific styling
- **Category Restrictions**: None (all categories support status)

#### Version Badge

- **Purpose**: Indicates semantic version of document/spec
- **Valid Values**: Semantic versioning (e.g., `"v1.0.0"`, `"v2.1.3"`)
- **Sourced From**: Frontmatter `version` field (optional)
- **Rendering**: `![Version: v1.0.0](...)`
- **Category Restrictions**: Recommended for `schemas`, `instructions`, `agents`

#### Category Badge

- **Purpose**: Reinforces document category
- **Valid Values**: One of 16 category IDs
- **Sourced From**: Inferred from `category` field
- **Rendering**: `![Category: Documentation](...)`
- **Category Restrictions**: None (universal)

#### Stability Badge

- **Purpose**: Indicates API/content stability level
- **Valid Values**: `"stable"`, `"beta"`, `"experimental"`, `"deprecated"`
- **Sourced From**: Frontmatter `stability` field (defaults to `"stable"`)
- **Rendering**: `![Stability: Beta](...)` with visual distinction
- **Category Restrictions**: Recommended for `schemas`, `agents`, `prompts`

#### Audience Badge

- **Purpose**: Indicates intended audience/visibility
- **Valid Values**: `"internal"`, `"public"`, `"community"`
- **Sourced From**: Frontmatter `audience` field
- **Rendering**: `![Audience: Internal](...)` with visibility indicator
- **Category Restrictions**: Optional, all categories

### 6.2 Badge Placement and Quantity Rules

**Placement**:

- Top of document, immediately after title heading
- Single horizontal line of badges (left-aligned)
- One space between badges

**Example**:

```markdown
# Document Title

![Status: Active](...) ![Category: Documentation](...) ![Version: v1.0.0](...)

Document body starts here...
```

**Quantity Limits**:

- Maximum 4 badges per document (prevent clutter, maintain readability)
- Recommended order: Status → Category → Version → Stability
- Exclude low-value badges when at capacity

**Category-Specific Badge Rules**:

```yaml
badge_rules:
  documentation:
    allowed: ["status", "version", "category", "audience"]
    recommended: ["status"]
    max_count: 4

  agents:
    allowed: ["status", "version", "category", "stability"]
    recommended: ["status", "stability"]
    max_count: 4

  schemas:
    allowed: ["status", "version", "category", "stability"]
    recommended: ["version", "stability"]
    max_count: 4

  prompts:
    allowed: ["status", "version", "category", "stability", "audience"]
    recommended: ["status", "stability"]
    max_count: 4

  governance:
    allowed: ["status", "category"]
    recommended: ["status"]
    max_count: 2

  # Simpler rules for other categories
  utility:
    allowed: ["status", "category"]
    recommended: ["status"]
    max_count: 2

  workflow:
    allowed: ["status", "category"]
    recommended: ["status"]
    max_count: 2
```

---

## 7. Header and Footer Template References

### 7.1 Template Reference Structure

Each category references pre-designed header and footer templates. Templates are not inline in the config; instead, the config specifies which template variant to use.

```yaml
template_references:
  documentation:
    header: "docs-standard"
    footer:
      default: "docs-variant-1"
      variants: ["docs-variant-1", "docs-variant-2", "docs-variant-3", "docs-variant-4", "docs-variant-5"]
      selection_rule: "use-default"

  agents:
    header: "agents-spec"
    footer:
      default: "agents-variant-1"
      variants: ["agents-variant-1", "agents-variant-2", "agents-variant-3", "agents-variant-4", "agents-variant-5"]
      selection_rule: "use-default"

  schemas:
    header: "schema-definition"
    footer:
      default: "schema-variant-1"
      variants: ["schema-variant-1", "schema-variant-2", "schema-variant-3", "schema-variant-4", "schema-variant-5"]
      selection_rule: "use-default"

  # Simpler templates for other categories
  readme:
    header: "readme-standard"
    footer:
      default: "readme-simple"
      variants: ["readme-simple"]
      selection_rule: "use-default"

  utility:
    header: "utility-standard"
    footer:
      default: "utility-simple"
      variants: ["utility-simple"]
      selection_rule: "use-default"
```

### 7.2 Template Selection Logic

**For Categories with Multiple Footer Variants**:

- Default: Use category's designated default footer variant
- Override: Frontmatter `footer_variant` field can override (if present)
- Fallback: Use default if specified variant is unavailable

**Example**:

```yaml
# In document frontmatter
category: "documentation"
footer_variant: "docs-variant-3"  # Optional override

# Config processing
→ Uses "docs-variant-3" instead of "docs-variant-1" (the default)
```

**For Categories with Single Variant**:

- Use only variant (no selection logic needed)
- Ignore any override attempt; report warning if override attempted

---

## 8. Validation Rules and Safe Failure Behavior

### 8.1 Validation Checkpoints

The branding agent applies validation at the following points:

1. **Frontmatter Parsing** (YAML structure validity)
2. **Field Type Checking** (string vs array vs date)
3. **Enum Validation** (status, stability, domain values)
4. **Category Resolution** (priority 1→2→3)
5. **Template Reference Resolution** (header/footer template exists)
6. **Badge Rule Validation** (category supports requested badges)
7. **Path Validation** (referenced files exist)

### 8.2 Failure Handling Strategy

**Principle**: **Fail safely. Report clearly. Never silently corrupt.**

For each validation failure, apply one of:

| Failure Scenario | Behavior | Example |
|---|---|---|
| Missing required frontmatter field | Reject document, report specific field name | `Error: Missing required field 'owners' in [file.md]` |
| Invalid enum value | Reject document, show allowed values | `Error: 'status' must be one of: active, deprecated, draft, under-review, on-hold. Got: "invalid"` |
| Category inference fails | Use global default, log warning | `Warning: Could not infer category for [file.md]. Using default: documentation` |
| Template not found | Use category default template, log warning | `Warning: Footer variant 'unknown-variant' not found. Using default 'docs-variant-1'` |
| Unsupported badge for category | Omit badge, log warning | `Warning: Badge 'stability' not allowed in category 'readme'. Skipping.` |
| Too many badges | Keep first N, omit remainder, log warning | `Warning: Document has 5 badges, but max is 4 for category 'docs'. Keeping: status, category, version. Omitting: stability, audience.` |

**Never**:

- Silently skip validation failures
- Auto-correct without user awareness
- Create malformed output
- Proceed with unknown template references

### 8.3 CI/Validation Integration

The schema and validation rules should be enforced at CI build time:

```bash
# Validate all Markdown files against schema
npm run validate:branding:schema

# Output: List of validation errors with file paths and specific issues
# Exit code: 0 if valid, 1 if any errors found
```

**Error Reporting Format**:

```
[ERROR] Validation failed for .github/agents/my-agent.md
  Field 'category' has invalid value 'unknown-category'
  Allowed values: [documentation, agents, instructions, ...]

[WARNING] .github/docs/readme-variant.md
  Path suggests category 'documentation', but frontmatter says 'agents'
  Using frontmatter value (priority 1)

✘ Validation failed: 1 error, 1 warning
```

---

## 9. Complete Configuration Example

Below is a minimal but complete `config/branding.config.yaml` example:

```yaml
---
# Branding Agent Configuration
# Version: 1.0.0
# Last Updated: 2026-05-28
# Source: Issue [#49](https://github.com/lightspeedwp/.github/issues/49) specification

version: "1.0.0"
description: "Unified branding agent configuration for category-aware headers, footers, and badges"

# Default category (lowest precedence in resolution)
default_category: "documentation"

# Supported document categories
categories:
  documentation:
    id: "documentation"
    label: "Documentation"
    description: "General documentation, guides, tutorials"
    badges:
      allowed: ["status", "version", "category", "audience"]
      recommended: ["status"]
      max_count: 4
    header_template: "docs-standard"
    footer_template: "docs-variant-1"
    footer_variants: ["docs-variant-1", "docs-variant-2", "docs-variant-3", "docs-variant-4", "docs-variant-5"]
    path_patterns:
      - "docs/**"
      - "documentation/**"
    required_frontmatter: ["title", "category", "last_updated", "owners"]
    optional_frontmatter: ["tags", "status", "stability", "domain", "audience", "version"]

  agents:
    id: "agents"
    label: "AI Agents"
    description: "Agent specifications and behavior definitions"
    badges:
      allowed: ["status", "version", "category", "stability"]
      recommended: ["status", "stability"]
      max_count: 4
    header_template: "agents-spec"
    footer_template: "agents-variant-1"
    footer_variants: ["agents-variant-1", "agents-variant-2", "agents-variant-3", "agents-variant-4", "agents-variant-5"]
    path_patterns:
      - ".github/agents/**"
      - "agents/**"
    required_frontmatter: ["title", "category", "last_updated", "owners"]
    optional_frontmatter: ["tags", "status", "stability", "domain", "version"]

  # ... (similar definitions for remaining 14 categories)

  governance:
    id: "governance"
    label: "Governance"
    description: "Policies, standards, guidelines, governance documents"
    badges:
      allowed: ["status", "category"]
      recommended: ["status"]
      max_count: 2
    header_template: "governance-policy"
    footer_template: "governance-simple"
    footer_variants: ["governance-variant-1", "governance-variant-2", "governance-variant-3", "governance-variant-4", "governance-variant-5"]
    path_patterns:
      - "CLAUDE.md"
      - ".coderabbit.yaml"
      - "GOVERNANCE.md"
    required_frontmatter: ["title", "category", "last_updated", "owners"]
    optional_frontmatter: ["tags", "status"]

# Path-based category inference mappings
path_mappings:
  "docs/**": "documentation"
  "documentation/**": "documentation"
  ".github/agents/**": "agents"
  "agents/**": "agents"
  ".github/instructions/**": "instructions"
  "instructions/**": "instructions"
  ".schemas/**": "schemas"
  "prompts/**": "prompts"
  ".github/workflows/**": "workflow"
  ".github/ISSUE_TEMPLATE/**": "issue-template"
  ".github/PULL_REQUEST_TEMPLATE/**": "pr-template"
  "tests/**": "test"
  "__tests__/**": "test"
  "scripts/**": "utility"
  "tools/**": "utility"
  "research/**": "research"
  "audit/**": "audit"
  "awesome-*.md": "awesome-list"
  "README.md": "readme"
  "**/README.md": "readme"

# Badge definitions and rules
badges:
  status:
    label: "Status"
    type: "enum"
    allowed_values: ["active", "deprecated", "draft", "under-review", "on-hold"]
    default: "active"
    source: "frontmatter.status"

  version:
    label: "Version"
    type: "semver"
    source: "frontmatter.version"
    optional: true

  category:
    label: "Category"
    type: "enum"
    source: "inferred_category"

  stability:
    label: "Stability"
    type: "enum"
    allowed_values: ["stable", "beta", "experimental", "deprecated"]
    default: "stable"
    source: "frontmatter.stability"

  audience:
    label: "Audience"
    type: "enum"
    allowed_values: ["internal", "public", "community"]
    default: "internal"
    source: "frontmatter.audience"
    optional: true

# Frontmatter field definitions
frontmatter_fields:
  # Required fields
  title:
    type: "string"
    required: true
    description: "Document title"

  category:
    type: "string"
    required: true
    enum: ["documentation", "agents", "instructions", "schemas", "prompts", "governance", "issue-template", "pr-template", "workflow", "research", "audit", "awesome-list", "readme", "test", "utility", "ai-ops"]
    description: "Document category"

  last_updated:
    type: "date"
    format: "YYYY-MM-DD"
    required: true
    description: "Last update date"

  owners:
    type: "array[string]"
    required: true
    minItems: 1
    description: "GitHub username or email, at least one"

  # Optional fields
  tags:
    type: "array[string]"
    required: false
    description: "Tag-driven metadata"

  status:
    type: "string"
    enum: ["active", "deprecated", "draft", "under-review", "on-hold"]
    default: "active"
    description: "Document lifecycle stage"

  stability:
    type: "string"
    enum: ["stable", "beta", "experimental", "deprecated"]
    default: "stable"
    description: "API/content stability level"

  domain:
    type: "string"
    description: "Semantic domain grouping"

  audience:
    type: "string"
    enum: ["internal", "public", "community"]
    default: "internal"
    description: "Intended audience"

  version:
    type: "string"
    format: "semver"
    description: "Semantic version"

# Validation rules
validation:
  fail_on_missing_required: true
  fail_on_invalid_enum: true
  fail_on_invalid_format: true
  fail_on_category_not_found: false  # Use default instead
  warn_on_path_category_mismatch: true
  warn_on_template_not_found: true
  warn_on_unsupported_badge: true
  warn_on_too_many_badges: true

# Accessibility and maintainability settings
accessibility:
  # All badges must include alt text
  require_badge_alt_text: true

  # Contrast ratio requirements (WCAG AA)
  min_contrast_ratio: 4.5

  # Link guidance
  require_descriptive_links: true
  avoid_bare_urls: true

maintainability:
  # Footer constraints
  max_footer_word_count: 150
  prefer_bullet_lists: true
  max_nesting_depth: 3
  max_line_length: 100
```

---

## 10. Implementation Relationship

This .schemas/config specification is the bridge between:

- **Issue [#33](https://github.com/lightspeedwp/.github/issues/33)** (parent specification): Defines category taxonomy and requirements
- **Issue [#46](https://github.com/lightspeedwp/.github/issues/46)** (template design): Defines actual header/footer content and examples
- **Issue [#49](https://github.com/lightspeedwp/.github/issues/49)** (this issue): Defines how templates are referenced and validated
- **Future Issues** (agent implementation): Uses this schema to drive agent behavior

**Dependency Graph**:

```
Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (Parent Spec)
    ↓
Issue [#46](https://github.com/lightspeedwp/.github/issues/46) (Template Design)  Issue [#49](https://github.com/lightspeedwp/.github/issues/49) (Schema/Config) ← depends on [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46)
    ↓
Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (Current-state Audit) ← enabled by [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49)
    ↓
Issue #? (Agent Implementation) ← depends on [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49)
```

**Unblocks**:

- Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (Current-state audit): Can now identify categories and validate against schema
- Future agent implementation: Has clear configuration contract to implement against

---

## 11. Acceptance Criteria

- [x] Configuration format decision documented (YAML + JSON Schema)
- [x] All 16 document categories defined with metadata
- [x] Frontmatter field support documented (4 required, 7 optional)
- [x] Path-based default mapping rules documented with precedence
- [x] Badge rules structured with type, values, and category restrictions
- [x] Header/footer template reference structure documented
- [x] Validation rules and safe failure behavior documented
- [x] Complete `config/branding.config.yaml` example provided
- [x] Validation integration approach defined (CI/npm script)
- [x] Category-specific rules and defaults documented
- [x] Accessibility constraints documented (alt text, contrast, links)
- [x] Maintainability guidance provided (footer word limits, nesting)
- [x] Error reporting format specified
- [x] Relationship to Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48) documented
- [x] Clear division of responsibility between specification phases
- [x] Ready for implementation in next phase (agent development)

---

## 12. Next Steps

Once this specification is approved:

1. **PR Creation**: Create PR with this .schemas/config specification
2. **Code Review**: Address any feedback on structure or clarity
3. **Merge**: Integrate into develop branch
4. **Issue [#48](https://github.com/lightspeedwp/.github/issues/48)**: Proceed to current-state audit using this schema
5. **Agent Implementation**: Begin branding agent implementation with validated .schemas/config contract

---

## References

**Related Issues**:

- [#33](https://github.com/lightspeedwp/.github/issues/33) — Unified branding agent parent specification
- [#46](https://github.com/lightspeedwp/.github/issues/46) — Template design specification for branding agent
- [#48](https://github.com/lightspeedwp/.github/issues/48) — Current-state audit and remediation (enabled by this spec)

**Related Files** (will be created or updated):

- `config/branding.config.yaml` — Main configuration file
- `.schemas/branding.schema.json` — JSON Schema validation
- `.github/instructions/branding-config.instructions.md` — Maintainer guidance
- `scripts/validation/validate-branding.js` — Validation script

**Standards and References**:

- JSON Schema v7: <https://json-schema.org/>
- Keep a Changelog 1.1.0: <https://keepachangelog.com/en/1.1.0/>
- Semantic Versioning: <https://semver.org/>
- WCAG 2.2 AA: <https://www.w3.org/WAI/WCAG22/quickref/>
