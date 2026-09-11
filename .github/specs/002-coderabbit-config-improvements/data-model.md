# Phase 1 Design: CodeRabbit Configuration Data Model

**Date**: 2026-09-11 | **Status**: Complete | **Scope**: Organisation-wide central configuration

## Overview

This document defines the data structures and relationships within the improved `.coderabbit.yml` configuration in the organisation control plane (`.github` repository), including entities, attributes, validation rules, and state transitions.

**Critical Context**: This configuration file is deployed **organisation-wide** via CodeRabbit's central configuration feature, applying review rules to all repositories in the organisation that consume the central configuration. Instructions must therefore be technology-agnostic and compatible across diverse project types (WordPress plugins, PHP libraries, TypeScript packages, CLI tools, etc.).

---

## Core Entities

### 1. CodeRabbit Configuration Root

```yaml
CodeRabbitConfig
  ├── reviews: ReviewSettings
  ├── path_instructions: PathInstruction[]
  ├── label_automation: LabelAutomationRules
  └── pr_templates: PRTemplateMapping
```

**Purpose**: Top-level container for all CodeRabbit behavior

**Validation Rules**:
- Must have at least one path_instruction block
- reviews settings must be valid YAML
- label_automation must reference only existing labels from `.github/labels.yml`

---

### 2. ReviewSettings

```yaml
ReviewSettings
  ├── request_changes_workflow: boolean
  ├── high_level_summary: boolean
  ├── poem: boolean
  ├── review_status: boolean
  ├── collapse_walkthrough: boolean
  ├── path_filters: string[] (glob patterns)
  ├── auto_review: AutoReviewConfig
  └── early_access: boolean
```

**Purpose**: Global review workflow configuration

**Attributes**:
- `request_changes_workflow`: Whether CodeRabbit should request changes when issues found
- `high_level_summary`: Include summary in reviews
- `poem`: Disable/enable poem output (aesthetic setting)
- `review_status`: Show review status in output
- `collapse_walkthrough`: UI preference for detailed walkthrough
- `path_filters`: Paths to exclude from review (build/, node_modules/, etc.)
- `auto_review`: Automation behavior configuration
- `early_access`: Enable early-access CodeRabbit features

**Validation Rules**:
- All boolean fields must have boolean values
- path_filters must contain valid glob patterns
- auto_review.enabled must be boolean
- auto_review.base_branches must contain valid branch names

---

### 3. PathInstruction (Primary Design Change)

```yaml
PathInstruction
  ├── path: string (glob pattern)
  ├── priority: integer (1-100, specificity level)
  ├── instructions: string (markdown)
  ├── branch_context: BranchContext[optional]
  ├── applies_after: string[] (dependencies, optional)
  └── validation_rules: ValidationRule[] (optional)
```

**Purpose**: Define review guidance for a specific file type/path

**Attributes**:
- `path`: Glob pattern matching files (e.g., `**/*.js`, `.github/workflows/*.yml`)
- `priority`: Numeric priority for pattern resolution (higher = more specific)
  - 90-100: Exact file paths
  - 70-89: Specific nested directories
  - 50-69: File types in specific directories
  - 1-49: General file type patterns
- `instructions`: Markdown text with review focus areas (3+ sections)
- `branch_context`: Optional per-branch customization (see below)
- `applies_after`: Dependencies on other patterns (e.g., "run pattern X first")
- `validation_rules`: Custom validation rules for this file type

**Structure of instructions field**:
```markdown
Review [file type] for [purpose]:
  - **Focus Area 1**: [specific criteria]
  - **Focus Area 2**: [specific criteria]
  - **Focus Area 3**: [specific criteria]
  [Additional context, references, examples]
```

**Validation Rules**:
- path must be non-empty glob pattern
- priority must be 1-100 (integer)
- instructions must contain at least 3 distinct review focus areas
- branch_context values (if present) must map to valid branch types

**Priority Ordering** (resolution algorithm):
1. Sort all matching patterns by priority (descending)
2. Within same priority: use definition order
3. First matching pattern wins; no cascading
4. Higher priority patterns override lower priority

---

### 4. BranchContext (New in v2)

```yaml
BranchContext
  ├── feat: string (feature-specific guidance)
  ├── fix: string (bug-fix-specific guidance)
  ├── security: string (security-focused guidance)
  ├── perf: string (performance-focused guidance)
  ├── a11y: string (accessibility-focused guidance)
  ├── docs: string (documentation-focused guidance)
  ├── ci: string (CI/CD-specific guidance)
  ├── refactor: string (refactoring-focused guidance)
  └── [other branch types]: string (as needed)
```

**Purpose**: Provide branch-type-specific review context while reusing core instruction blocks

**Attributes**:
- Each key corresponds to a branch type prefix (feat/, fix/, security/, etc.)
- Value is markdown text with branch-specific emphasis or criteria
- Optional - if not present, base instructions apply to all branch types

**Example**:
```yaml
security: |
  For security/ branches: Emphasize authentication, access control, 
  secrets handling, and threat model validation. Check for CVE references.
```

**Validation Rules**:
- Keys must correspond to valid branch types from CLAUDE.md
- Values must be markdown strings
- Can be empty/null for branch types without special context

---

### 5. AutoReviewConfig

```yaml
AutoReviewConfig
  ├── enabled: boolean
  ├── drafts: boolean
  ├── base_branches: string[] (branch names)
  └── [future extensibility]
```

**Purpose**: Automation settings for automatic review triggering

**Attributes**:
- `enabled`: Whether auto-review is turned on
- `drafts`: Whether to review pull request drafts
- `base_branches`: Which base branches trigger auto-review (main, develop, feature/*, etc.)

---

### 6. LabelAutomationRules

```yaml
LabelAutomationRules
  ├── status_rules: {label: trigger_condition}[]
  ├── type_rules: {label: branch_prefix_mapping}[]
  ├── priority_rules: {label: severity_level}[]
  ├── area_rules: {label: file_path_mapping}[]
  └── language_rules: {label: file_extension_mapping}[]
```

**Purpose**: Map repository changes to automatic label application

**Validation Rules**:
- All labels must exist in `.github/labels.yml` (read-only reference)
- All branch prefixes must match CLAUDE.md naming strategy
- All file paths must use valid glob patterns

---

### 7. PRTemplateMapping (Reference Structure)

```yaml
PRTemplateMapping
  ├── feat/*: "pr_feature.md"
  ├── fix/*: "pr_bug.md"
  ├── docs/*: "pr_docs.md"
  ├── security/*: "pr_security.md"
  ├── perf/*: "pr_performance.md"
  ├── [all other types]: [mapped template]
  └── [validation against .github/PULL_REQUEST_TEMPLATE/]
```

**Purpose**: Map branch types to PR templates (for documentation, not automation)

**Validation Rules**:
- All templates must exist at `.github/PULL_REQUEST_TEMPLATE/[template].md`
- All branch types must have a mapping
- Mappings must match actual template files

---

## Data Relationships

### Path Instruction Resolution Flow

```
1. File changed in PR
   ↓
2. Extract file path (e.g., src/auth/login.js)
   ↓
3. Evaluate against all PathInstruction.path patterns
   ↓
4. Collect matching patterns
   ↓
5. Sort matches by PathInstruction.priority (descending)
   ↓
6. Select first match (highest priority)
   ↓
7. Extract instructions (base + branch_context if applicable)
   ↓
8. CodeRabbit applies review guidance
```

### Branch Type Context Selection

```
If file matches pattern with branch_context:
  ├── Extract branch type from PR branch (feat/, fix/, security/, etc.)
  ├── Look up branch_context[branch_type]
  ├── If found: use branch-specific guidance
  ├── If not found: use base instructions
  └── Combine with global review settings
```

---

## State Transitions & Lifecycle

### Pattern Addition Lifecycle

```
1. New file type identified (e.g., .specify/spec.md)
   ↓
2. Create PathInstruction block
   ├── Set path pattern
   ├── Calculate priority based on specificity
   ├── Write instructions with 3+ focus areas
   ├── Add branch_context if needed
   └── Add validation_rules if needed
   ↓
3. Insert into config at appropriate position (priority ordering)
   ↓
4. Document priority reasoning in config comments
   ↓
5. Test with sample PRs to verify matching
   ↓
6. Update CODERABBIT_COVERAGE_AUDIT.md
   ↓
7. Done
```

### Coverage State Transitions

```
State: Under-covered (coverage < 95%)
  ├── Identify gap (missing file type pattern)
  ├── Conduct audit of actual files in repository
  ├── Create PathInstruction for gap
  └── Verify coverage ≥ 95%
      ↓
State: Covered (coverage ≥ 95%)
```

---

## Validation Rules & Constraints

### Global Constraints

| Constraint | Rule | Enforcement |
|-----------|------|-------------|
| **No Duplication** | Instructions must not repeat content from AGENTS.md, CLAUDE.md, `.github/instructions/` | Code review |
| **Backward Compatibility** | No breaking changes to existing path_instructions | Testing with sample PRs |
| **UK English** | All text must use UK English spelling (optimize, colour, etc.) | Linting + review |
| **No Label Duplication** | Must not redefine labels already in `.github/labels.yml` | Validation script |
| **Priority Uniqueness** | Within same path pattern: priorities must be distinct or explicitly ordered | Config validation |
| **Pattern Validity** | All glob patterns must be valid and non-overlapping (or with explicit priority) | Glob validation tool |

### Per-Pattern Validation

| Field | Validation Rule |
|-------|-----------------|
| `path` | Must be non-empty glob, no regex |
| `priority` | Integer 1-100, no duplicates at same level |
| `instructions` | Markdown, 3+ focus areas, no placeholders, no implementation details |
| `branch_context` | Keys must match valid branch types; values must be markdown |
| `applies_after` | References must exist in config; no circular dependencies |

---

## Example: Complete Instruction Block

```yaml
- path: "**/.github/workflows/*.yml"
  priority: 85  # Very specific: nested directory + file type
  instructions: |
    Review GitHub Actions workflow files for CI/CD correctness:
      
      - **Job Definition & Matrix Strategy**: Verify all jobs have clear names, 
        matrix strategies use appropriate parallelization, and matrix combinations
        are not excessive (avoid N² explosions).
      
      - **Secret & Environment Handling**: Validate secrets are not logged,
        environment variables are properly scoped, and sensitive operations
        use appropriate authentication methods.
      
      - **Required Status Checks & Merge Controls**: Confirm workflows enforce
        linting, testing, and release policies via status checks. Verify merge
        branch protections require passing checks.
  
  branch_context:
    security: |
      Security branches: Emphasize access control for deployment jobs,
      verify no hardcoded credentials, and validate CI-level security checks.
    ci: |
      CI branches: Validate workflow structure changes don't break automation,
      ensure all matrix combinations are tested, and confirm new steps have
      clear failure modes.
  
  applies_after:
    - "**/.github/actions/**"  # Review reusable actions first
```

---

## Design Decisions & Rationale

**Decision 1: Numeric Priority (vs. Named Levels)**
- *Chosen*: Numeric (1-100)
- *Rationale*: Enables precise ordering, scales to many patterns, clear visual comparison

**Decision 2: Branch-Type-Specific vs. Separate Blocks**
- *Chosen*: Branch-type-specific within single block (via branch_context field)
- *Rationale*: Reduces config duplication, keeps related guidance together, easier maintenance

**Decision 3: External Audit Guide**
- *Chosen*: External documentation (not embedded in YAML)
- *Rationale*: Keeps config focused on review instructions; audit is a process, not a config property

**Decision 4: No Cascading Instructions**
- *Chosen*: First matching pattern wins (CodeRabbit behavior)
- *Rationale*: Simpler mental model, no composition complexity, works with CodeRabbit schema

---

## Next Steps for Implementation

1. **Reorganize existing path_instructions** by priority (most-specific first)
2. **Add 5-8 new path patterns** for coverage gaps
3. **Enhance existing 20+ blocks** with 3+ focus areas
4. **Add branch_context** for high-value branch types (security/, perf/, a11y/)
5. **Document priority rules** in config comments
6. **Create CODERABBIT_COVERAGE_AUDIT.md** for ongoing verification

---

**Validation**: ✅ Data model aligns with spec requirements, supports all 3 clarifications, and enables branch-type-specific, pattern-priority-ordered review instructions.
