# Data Model: CodeRabbit Configuration Structure

**Phase 1 Design Deliverable** | **Date**: 2026-09-17 | **Scope**: Code review instructions + PR governance automation

---

## Overview

The enhanced `.coderabbit.yml` configuration provides unified governance covering code review instructions AND PR governance automation (template validation, label enforcement, DoD checklist, documentation validation). This data model defines entities, relationships, and validation rules.

**Critical Context**: This configuration file is deployed **organisation-wide** via CodeRabbit's central configuration feature, applying review rules and governance to all repositories. Instructions must be technology-agnostic and compatible across diverse project types (WordPress plugins, PHP libraries, TypeScript packages, infrastructure-as-code, MCP servers, etc.).

---

## Top-Level Configuration Structure

```yaml
reviews:
  # CodeRabbit global settings (existing)
  request_changes: false
  approve: "comment"
  max_files_to_review: 100
  
code_review_rules:
  # Code review instruction set (new section, Phase 1)
  path_instructions: [...]       # PathInstruction[]
  branch_context: [...]          # BranchContext[] (documentation references)
  priority_rules: { ... }        # Priority/specificity ordering rules
  
pr_governance:
  # PR governance automation (new section, Phase 1 expansion)
  template_validation: { ... }   # TemplateValidation
  label_enforcement: { ... }     # LabelEnforcement
  dod_automation: { ... }        # DoDAautomation
  doc_validation: { ... }        # DocValidation
```

---

## Entity Definitions

### PathInstruction Entity

**Purpose**: Define review guidance for a file type/path pattern

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `priority` | integer (1-100) | Yes | Priority/specificity (100=highest, 1=lowest). Determines override when multiple patterns match. |
| `paths` | string[] | Yes | Array of glob patterns (e.g., `["**/e2e/*.spec.ts"]`). Standard glob syntax. |
| `instructions` | string (markdown) | Yes | Review guidance (markdown). MUST include 3-4 focus areas with 2-3 specific checks each. Min 150 chars, max 5000. |
| `branch_context` | object | No | Optional metadata linking to BranchContext entries (navigation only). |

**Validation Rules**:

- `priority` must be unique per `paths` set; prevent duplicates
- `paths` patterns must not be duplicative across entries
- `instructions` must have ≥3 distinct focus areas
- `instructions` must NOT contain framework/language-specific guidance (Constitution Principle IV)
- Each focus area must have 2-3 specific, actionable checks

**Relationships**:

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
code_review_rules:
  path_instructions:
    - priority: 95
      paths: [".specify/spec.md"]
      instructions: |
        ## Specification Review
        
        ### Focus Area 1: Completeness
        - All user stories include Why, Independent Test, Acceptance Scenarios
        - All functional requirements numbered (FR-001, etc.)
        - Success criteria are measurable and testable
        
        ### Focus Area 2: Clarity
        - Requirements specific, testable (no "should", "may", "might")
        - Edge cases identified
        - Assumptions documented
        
        ### Focus Area 3: Consistency
        - Requirements aligned, no conflicts
        - Terminology consistent
        - Cross-references valid
      branch_context:
        relevant_for: ["docs/", "feat/", "refactor/"]
    
    - priority: 50
      paths: ["**/*.{ts,js}"]
      instructions: |
        ## Code Quality Review
        
        ### Focus Area 1: Correctness
        - Logic handles edge cases (null, empty, errors)
        - Error handling comprehensive
        - State management clean
        
        ### Focus Area 2: Performance & Accessibility
        - No hardcoded values
        - Performance-sensitive operations optimized
        - No debug statements left in
        
        ### Focus Area 3: Security
        - Input validation on external data
        - No hardcoded secrets
        - Dependencies checked for vulnerabilities
```

### BranchContext Entity

**Purpose**: Document branch-type-specific review priorities (documentation only; not enforced by CodeRabbit)

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `branch_type` | string (enum) | Yes | One of 38 authorized types (feat, fix, hotfix, security, perf, a11y, docs, ci, etc.) |
| `review_priorities` | string[] | Yes | 3-5 review focus areas emphasized for this branch type |
| `examples` | string | No | Example scenarios/patterns for this branch type |

**Validation Rules**:

- Keys must correspond to valid branch types from CLAUDE.md
- Values must be markdown strings
- Can be empty/null for branch types without special context

- `branch_type` must be from 38 authorized set (Constitution Principle V)
- `review_priorities` must reference existing PathInstruction focus areas
- Must not duplicate content in AGENTS.md, CLAUDE.md, BRANCHING_STRATEGY.md
- Technology-agnostic (no framework/language-specific details)

**Relationships**:

- Documented in external `docs/BRANCHING_STRATEGY.md` (Section 5.3)
- Referenced by PathInstruction.branch_context (optional)
- NOT enforced as CodeRabbit rules (documentation only per research)

**Example** (from BRANCHING_STRATEGY.md Section 5.3):

```
### security/
Review Priorities: Authentication, access control, secrets handling, threat modeling
Examples: Security patches, vulnerability fixes, authentication refactors
Focus: Ensure fix resolves CVE/threat; no new vulnerabilities introduced

### perf/
Review Priorities: Benchmarking, performance metrics, resource optimization, regression testing
Examples: Algorithm optimization, caching strategy, lazy-loading implementation
Focus: Quantify performance improvement; verify no regressions
```

### TemplateValidation Entity

**Attributes**:

- `enabled`: Whether auto-review is turned on
- `drafts`: Whether to review pull request drafts
- `base_branches`: Which base branches trigger auto-review (main, develop, feature/*, etc.)

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | Yes | Enable/disable template validation |
| `rules` | TemplateRule[] | Yes | Array of section validation rules |

**TemplateRule Subentity**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section` | string | Yes | Required section header (e.g., "Linked Issues", "Changelog", "Checklist") |
| `required` | boolean | Yes | Section MUST be present and non-empty |
| `min_items` | integer | No | Minimum items/links required |
| `max_length` | integer | No | Maximum character length |
| `pattern` | regex | No | Content must match pattern |
| `reject_patterns` | string[] | No | Reject content matching patterns (e.g., TODO, FIXME) |

**Validation Rules**:

- All labels must exist in `.github/labels.yml` (read-only reference)
- All branch prefixes must match CLAUDE.md naming strategy
- All file paths must use valid glob patterns

- `section` headers must match actual PR template section names
- `min_items` ≥1 if specified
- `max_length` ≥50 characters
- Accuracy target: ≥95% pass (well-formed), ≥90% catch (malformed) (SC-014)

**Example**:

```yaml
pr_governance:
  template_validation:
    enabled: true
    rules:
      - section: "Linked Issues"
        required: true
        min_items: 1
        pattern: "^(https://github\\.com|#).*"
      - section: "Changelog"
        required: true
        max_length: 250
        reject_patterns: ["TODO", "FIXME", "placeholder"]
      - section: "Checklist"
        required: true
        min_items: 3
        must_be_checked: true
```

### LabelEnforcement Entity

**Purpose**: Define rules for validating and suggesting labels on PRs

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | Yes | Enable/disable label enforcement |
| `families` | { type, status, priority, area, meta } | Yes | Label family rules |
| `suggestions` | object | No | Label suggestion engine config |

**LabelFamily Subentity**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `required` | boolean | Yes | Family MUST be present on PR |
| `source` | string | No | How to infer: "branch_type", "changed_files", "manual" |
| `options` | string[] | No | Valid labels for this family |
| `mapping` | object | No | Branch/file pattern → label mapping |
| `default` | string | No | Default label if no better option |

**Validation Rules**:

- All templates must exist at `.github/PULL_REQUEST_TEMPLATE/[template].md`
- All branch types must have a mapping
- Mappings must match actual template files

- `families` must include at minimum: type (required), status (required)
- `options` must list 3-8 valid labels
- `mapping` keys must match Constitution branch types or glob patterns
- `mapping` values must match `.github/labels.yml` canonical labels
- Suggestion accuracy target: ≥85% (SC-015)

**Example**:

```yaml
pr_governance:
  label_enforcement:
    enabled: true
    families:
      type:
        required: true
        source: "branch_type"
        mapping:
          feat: "type:feature"
          fix: "type:bug"
          security: "type:security"
          perf: "type:performance"
          # ... 34 additional mappings
      status:
        required: true
        options: ["status:needs-triage", "status:in-progress", "status:done", "status:blocked"]
        default: "status:needs-triage"
      area:
        required: false
        source: "changed_files"
        mapping:
          ".github/workflows/**": "area:ci"
          "**security/**": "area:security"
    suggestions:
      enabled: true
      accuracy_target: 0.85
```

### DoDAautomation Entity

**Purpose**: Define DoD checklist items by change scope and automation rules

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | Yes | Enable/disable DoD automation |
| `scope_detection` | string | Yes | How to infer scope: "branch_type", "changed_files", "pr_description" |
| `templates` | { scope: items[] } | Yes | Scope → DoD checklist template mapping |
| `blocking_rule` | string | No | Behavior: "all_items_must_be_checked", "warn_only", "none" |

**DoDAtemplate Subentity**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | string[] | Yes | Array of checklist items (5-8 items per scope) |

**Validation Rules**:

- `templates` must include at least: "feature", "bugfix", "docs"
- Each template has 5-8 items (relevant, not exhaustive)
- Items must be actionable and technology-agnostic
- Relevance target: ≥90% of PRs report checklist is useful (SC-016)

**Example**:

```yaml
pr_governance:
  dod_automation:
    enabled: true
    scope_detection: "branch_type"
    templates:
      feature:
        items:
          - "Code changes tested locally (manual or automated)"
          - "Accessibility (WCAG 2.2 AA) verified"
          - "Performance impact assessed"
          - "Security review completed"
          - "Documentation updated"
          - "Changelog entry added"
          - "Related issues linked"
      bugfix:
        items:
          - "Root cause documented"
          - "Fix verified to resolve issue"
          - "Regression test added"
          - "Changelog entry added"
          - "Related issues linked"
    blocking_rule: "warn_only"
```

### DocValidation Entity

**Purpose**: Define rules for handling documentation linting/validation failures gracefully

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | Yes | Enable/disable documentation validation |
| `skip_paths` | string[] | No | Glob patterns for files excluded from validation |
| `failure_rules` | object | Yes | Rules per failure type (broken_links, linting, missing_content) |
| `commentary` | object | No | Commentary generation rules |

**FailureRule Subentity**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block_review` | boolean | Yes | Block review/merge on this failure |
| `on_critical_files` | boolean | Yes | Different behavior for critical files |
| `on_other_files` | boolean | Yes | Different behavior for non-critical files |
| `remediation` | string | Yes | Actionable fix suggestion or workaround |

**Validation Rules**:

- `skip_paths` must be glob patterns
- `failure_rules` must cover: broken_links, linting_failures, missing_content
- `remediation` must be actionable (links, commands, or clear steps)
- Zero silent failures (always comment if detected) (SC-017)

**Example**:

```yaml
pr_governance:
  doc_validation:
    enabled: true
    skip_paths:
      - ".github/tmp/**"
      - "**/node_modules/**"
      - "**/*.generated.md"
    failure_rules:
      broken_links:
        block_review: true
        on_critical_files: true
        on_other_files: false
        remediation: "Fix broken links or exclude via EXCLUDE_PATHS"
      linting_failures:
        block_review: true
        on_critical_files: true
        on_other_files: false
        remediation: "Run 'npm run lint:md' and fix violations"
    commentary:
      format: "actionable"
      silent_failures: false
```

---

## Relationships & Dependencies

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

## Validation & Constraints

**File Type Coverage** (FR-001, SC-001):

- PathInstruction entries must cover ≥95% of repository file types
- Must include 5-8 new file types:
  - `.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md`
  - `workflows/*.md`
  - `plugins/*/SKILL.md`

**Instruction Quality** (FR-002, SC-002):

- Each PathInstruction ≥3 focus areas
- Each focus area 2-3 actionable checks
- Technology-agnostic (no framework/language specifics)

**Governance Accuracy** (SC-014, SC-015, SC-016, SC-017):

- Template validation: ≥95% pass (well-formed), ≥90% catch (malformed)
- Label suggestions: ≥85% accuracy
- DoD checklist: ≥90% relevance
- Documentation validation: Zero silent failures

**Pattern Priority** (FR-014, SC-012):

- Explicit priority numbering (100-1 scale)
- Documented specificity order in contracts/priority-rules.md
- No ambiguity on which pattern wins

---

**Status**: ✅ PHASE 1 DATA MODEL COMPLETE | Ready for contracts and quickstart design
