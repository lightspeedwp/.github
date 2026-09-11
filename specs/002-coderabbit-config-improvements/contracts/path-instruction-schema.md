# Contract: Path Instruction Block Schema

**Version**: 1.0 | **Date**: 2026-09-11

## Purpose

Defines the required structure, fields, and validation rules for each path instruction block in `.coderabbit.yml`.

---

## Critical Constraint: Technology-Agnosticism

**This schema is for organisation-wide central configuration.** Instructions MUST be completely technology-agnostic and apply across diverse project types:

- ✅ **Allowed**: "Code quality", "security practices", "performance", "accessibility", "testing coverage", "documentation"
- ❌ **NOT allowed**: "PHP function naming", "TypeScript types", "React components", "Terraform modules", "WordPress actions", "Node.js middleware"

Instructions should reference **universal principles** that apply to all code:
- Security: authentication, authorization, secrets, injection prevention
- Performance: algorithmic efficiency, resource usage, caching strategies
- Quality: readability, maintainability, testing, documentation
- Accessibility: WCAG compliance, semantic markup, keyboard navigation

Examples must use generic patterns, not framework-specific ones. Branch context guidance (security/, perf/, a11y/) must be universally applicable across WordPress, Node.js, infrastructure, and MCP projects.

---

## Schema Definition (YAML/JSON)

```yaml
PathInstruction:
  type: object
  required:
    - path
    - instructions
  optional:
    - priority
    - branch_context
    - applies_after
    - validation_rules

  properties:
    path:
      type: string
      description: "Glob pattern matching file paths (e.g., '**/*.js', '.github/workflows/*.yml')"
      constraints:
        - non-empty
        - valid glob syntax
        - no regex
      example: "**/e2e/*.spec.ts"

    priority:
      type: integer
      description: "Specificity level for pattern resolution (1-100, higher = more specific)"
      default: 50
      constraints:
        - minimum: 1
        - maximum: 100
      ranges:
        - "90-100": Exact file paths (.github/AGENTS.md)
        - "70-89": Specific nested directories (**/agents/*.agent.js)
        - "50-69": File types in specific directories (**/scripts/**/*.sh)
        - "1-49": General file type patterns (**/*.js)
      example: 85

    instructions:
      type: string
      description: "Markdown text with review focus areas (minimum 3 distinct sections)"
      format: markdown
      constraints:
        - non-empty
        - valid markdown
        - minimum 3 review focus areas
        - no [NEEDS CLARIFICATION] markers
        - no implementation details (no framework/language specifics)
        - UK English spelling throughout
      structure:
        - "Intro line": Brief description of what to review and why
        - "Focus Area 1": Specific criterion or checklist item
        - "Focus Area 2": Specific criterion or checklist item
        - "Focus Area 3": Specific criterion or checklist item
        - "Additional context": References, links, examples
      example: |
        Review code for quality and accessibility:
          - **Code Style & Clarity**: Ensure consistent code style, no unused variables,
            clear and descriptive naming conventions.
          - **Performance**: Validate efficient algorithms, avoid unnecessary operations,
            confirm scalability with data size.
          - **Accessibility**: Confirm all interactive elements support keyboard access,
            sufficient color contrast (WCAG 2.2 AA), proper semantic structure.

    branch_context:
      type: object
      description: "Optional per-branch-type review emphasis"
      properties:
        feat:
          type: string
          description: "Feature branch context"
          format: markdown
          example: "Validate new functionality doesn't break existing features."
        fix:
          type: string
          description: "Bug fix branch context"
          format: markdown
        security:
          type: string
          description: "Security branch context"
          format: markdown
        perf:
          type: string
          description: "Performance branch context"
          format: markdown
        a11y:
          type: string
          description: "Accessibility branch context"
          format: markdown
        docs:
          type: string
          description: "Documentation branch context"
          format: markdown
        ci:
          type: string
          description: "CI/CD branch context"
          format: markdown
        refactor:
          type: string
          description: "Refactoring branch context"
          format: markdown
        "[other branch types]":
          type: string
          description: "Context for other valid branch types from CLAUDE.md"
      example:
        security: "Emphasize authentication, access control, secrets handling."
        perf: "Validate performance metrics and benchmarking approach."

    applies_after:
      type: array
      items:
        type: string
        description: "Path patterns that should be evaluated first"
      description: "Dependencies on other patterns (evaluation order)"
      constraints:
        - no circular dependencies
        - referenced patterns must exist in config
      example:
        - "**/.github/actions/**"
        - "agents/**"

    validation_rules:
      type: array
      items:
        type: object
        properties:
          rule_name:
            type: string
          description:
            type: string
          criteria:
            type: string
      description: "Custom validation rules specific to this file type"
      example:
        - rule_name: "no-hardcoded-secrets"
          description: "Must not contain hardcoded credentials"
          criteria: "Use environment variables or secret management system"
```

---

## Validation Rules

### Required Fields

| Field | Validation |
|-------|-----------|
| `path` | Non-empty, valid glob pattern, no regex |
| `instructions` | Non-empty markdown, 3+ focus areas, no vague adjectives |

### Field Constraints

| Field | Constraint | Example |
|-------|-----------|---------|
| `path` | Valid glob pattern | `**/*.js`, `.github/workflows/*.yml` |
| `priority` | Integer 1-100 | 85 |
| `instructions` | Markdown, 3+ sections | See example above |
| `branch_context.*` | Markdown strings | See example above |
| `applies_after` | Array of paths | `["**/.github/actions/**"]` |

### Global Constraints

1. **No Duplicate Paths**: Same glob pattern should not appear twice
2. **No Duplicate Priorities**: Within same specificity level, priorities should be distinct
3. **No Circular Dependencies**: `applies_after` must not create cycles
4. **UK English**: All text must use UK spellings (colour, optimise, etc.)
5. **No Duplication with Other Docs**: Must not repeat content from AGENTS.md, CLAUDE.md

---

## Examples

### Example 1: Simple File Type (General Priority)

```yaml
- path: "**/*.md"
  priority: 30
  instructions: |
    Review Markdown documentation for clarity and structure:
      - **Content Quality**: Ensure content is accurate, complete, and useful
        for the intended audience. Check for typos and clarity.
      - **Structure & Navigation**: Verify clear heading hierarchy, logical flow,
        and links to related documentation.
      - **Accessibility**: Confirm alt text for images, sufficient heading nesting
        (WCAG 2.2 AA), no wall-of-text sections.
```

### Example 2: Specific Path with Branch Context

```yaml
- path: "**/e2e/*.spec.ts"
  priority: 85
  instructions: |
    Review end-to-end tests for reliability and coverage:
      - **Test Isolation**: Ensure tests don't depend on external state or execution
        order. Use fixtures and mocks for dependencies.
      - **Flakiness Prevention**: Check for race conditions, timing dependencies,
        and platform-specific issues. Tests should be deterministic.
      - **Coverage**: Verify tests cover critical user flows and error scenarios.
        Check for sufficient FSE (Full Site Editing) coverage.
  
  branch_context:
    feat: "New tests must demonstrate new functionality works end-to-end."
    perf: "Include performance benchmarks if tests validate performance criteria."

  applies_after:
    - "**/*.ts"
```

### Example 3: Exact Path with Deep Guidance

```yaml
- path: ".github/workflows/*.yml"
  priority: 90
  instructions: |
    Review GitHub Actions workflows for CI/CD correctness and security:
      - **Job Definition & Reusability**: Ensure all jobs have descriptive names,
        reusable workflows are used where appropriate, and matrix strategies
        avoid combinatorial explosions.
      - **Secret & Permission Handling**: Validate secrets are not logged, 
        minimum required permissions are used, and sensitive operations
        have appropriate authentication (not hardcoded).
      - **Status Checks & Merge Controls**: Confirm workflows enforce all required
        status checks (linting, tests, security scans), and branch protection
        rules require passing checks before merge.
  
  branch_context:
    ci: "Validate workflow structure changes don't break automation."
    security: "Emphasize access control and secret handling in deployment jobs."
  
  applies_after:
    - "**/.github/actions/**"

  validation_rules:
    - rule_name: "no-hardcoded-secrets"
      description: "No hardcoded credentials in workflow"
      criteria: "Use GitHub Secrets or environment variables exclusively"
    - rule_name: "required-status-checks"
      description: "Workflows must define required status checks"
      criteria: "At minimum: linting, tests, and security scanning"
```

---

## Usage in `.coderabbit.yml`

```yaml
reviews:
  # ... review settings ...

path_instructions:
  # General patterns (low priority)
  - path: "**/*.md"
    priority: 30
    instructions: |
      [markdown content]

  # Specific file types in directories (medium priority)
  - path: "**/scripts/**/*.sh"
    priority: 60
    instructions: |
      [markdown content]

  # Very specific patterns (high priority) - evaluated first
  - path: "**/e2e/*.spec.ts"
    priority: 85
    instructions: |
      [markdown content]

  - path: ".github/workflows/*.yml"
    priority: 90
    instructions: |
      [markdown content]
```

**Pattern Resolution**: CodeRabbit processes patterns in priority order (highest to lowest). First matching pattern is used; no cascading.

---

## Validation Checklist

Before submitting an instruction block:

- [ ] `path` is non-empty and valid glob pattern
- [ ] `priority` is integer 1-100 (or omit for default 50)
- [ ] `instructions` has 3+ distinct review focus areas
- [ ] No vague adjectives without metrics ("fast" → "<100ms", "clean" → specific criteria)
- [ ] No implementation details (framework names, language specifics)
- [ ] UK English spelling throughout
- [ ] No [NEEDS CLARIFICATION] markers remaining
- [ ] No duplication with AGENTS.md, CLAUDE.md, `.github/instructions/`
- [ ] If branch_context provided: keys match valid branch types
- [ ] If applies_after provided: referenced patterns exist in config
- [ ] Content is markdown-valid

---

**Schema Version**: 1.0 (compatible with CodeRabbit overrides schema v2.0)
