# Contract: PR Governance Rules Schema

**Phase 1 Design Deliverable** | **Date**: 2026-09-17 | **For**: PR Governance Automation (FR-016 to FR-019)

---

## Overview

This contract defines schemas for 4 PR governance automation rule sets:

1. **TemplateValidation** (FR-016, SC-014) - PR description section validation
2. **LabelEnforcement** (FR-017, SC-015) - Label family enforcement
3. **DoDAautomation** (FR-018, SC-016) - Definition of Done checklist automation
4. **DocValidation** (FR-019, SC-017) - Documentation validation failure handling

---

## TemplateValidation Schema

**Purpose**: Validate PR description includes required sections per branch-type template

**Structure**:

```yaml
pr_governance:
  template_validation:
    enabled: boolean
    rules:
      - section: string (section header name)
        required: boolean
        min_items: integer (optional)
        max_length: integer (optional)
        pattern: regex (optional)
        reject_patterns: string[] (optional)
```

**Validation Rules**:

- `section` must match actual PR template section names
- `min_items` ≥1; `max_length` ≥50
- `pattern` and `reject_patterns` must be valid regex
- Accuracy target: ≥95% pass (well-formed), ≥90% catch (malformed)

**Example**:

```yaml
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
```

---

## LabelEnforcement Schema

**Purpose**: Validate labels follow canonical prefix structure; suggest missing labels

**Structure**:

```yaml
pr_governance:
  label_enforcement:
    enabled: boolean
    families:
      type: { required, source, options, mapping, default }
      status: { required, options, default }
      priority: { required, options, default }
      area: { required, source, mapping }
      meta: { required, options }
    suggestions:
      enabled: boolean
      accuracy_target: float (0.85 = 85%)
```

**Label Family Rules**:

- **type**: Required; inferred from branch_type; maps feat→type:feature, fix→type:bug, etc. (38 mappings)
- **status**: Required; options: needs-triage, in-progress, done, blocked; default: needs-triage
- **priority**: Optional; options: critical, high, normal, low
- **area**: Optional; inferred from changed_files; maps patterns to area:* labels
- **meta**: Optional; special labels (has-pr, duplicate, needs-changelog, etc.)

**Suggestion Accuracy Target**: ≥85% (SC-015)

**Example**:

```yaml
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
      options: ["status:needs-triage", "status:in-progress", "status:done"]
      default: "status:needs-triage"
    area:
      required: false
      source: "changed_files"
      mapping:
        ".github/workflows/**": "area:ci"
        "**security/**": "area:security"
```

---

## DoDAautomation Schema

**Purpose**: Populate PR descriptions with standardized DoD checklist by change scope

**Structure**:

```yaml
pr_governance:
  dod_automation:
    enabled: boolean
    scope_detection: string (branch_type | changed_files | pr_description)
    templates:
      [scope]:
        items: string[] (5-8 items per scope)
    blocking_rule: string (all_items_must_be_checked | warn_only | none)
```

**Scope Templates**:

- **feature**: 7-8 items (code testing, accessibility, performance, security, docs, changelog, linked issues)
- **bugfix**: 5 items (root cause, fix verification, regression test, changelog, linked issues)
- **docs**: 4 items (content review, links verified, examples tested, changelog if public)
- **refactor**: 5 items (no behavior change verified, tests passing, performance baseline, coverage maintained, linked issues)
- **perf**: 6 items (benchmark baseline, improvement measured, regression testing, performance tests, changelog, linked issues)

**Relevance Target**: ≥90% of PRs report checklist is useful (SC-016)

**Example**:

```yaml
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

---

## DocValidation Schema

**Purpose**: Handle documentation linting/validation failures gracefully with explicit rules

**Structure**:

```yaml
pr_governance:
  doc_validation:
    enabled: boolean
    skip_paths: string[] (glob patterns to exclude)
    failure_rules:
      [failure_type]:
        block_review: boolean
        on_critical_files: boolean
        on_other_files: boolean
        remediation: string
    commentary:
      format: string (actionable | brief)
      silent_failures: boolean
```

**Failure Types**:

- **broken_links**: Internal or external links returning 404
- **linting_failures**: Markdown syntax, formatting, structure issues
- **missing_content**: Required frontmatter, sections, metadata
- **encoding_issues**: File encoding, character encoding errors

**Block Review Decision Logic**:

- **Critical files** (README.md, docs/*, .github/docs/): block_review=true
- **Other files**: block_review=false (warn only)
- **Security-related docs**: block_review=true
- **Auto-generated files** (skip_paths): block_review=false

**Zero Silent Failures Requirement** (SC-017): Always comment if failure detected; never silently skip

**Example**:

```yaml
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
      remediation: "Fix broken links or exclude via EXCLUDE_PATHS in linter config"
    linting_failures:
      block_review: true
      on_critical_files: true
      on_other_files: false
      remediation: "Run 'npm run lint:md' and fix violations per output"
    missing_content:
      block_review: true
      on_critical_files: true
      on_other_files: false
      remediation: "Add required frontmatter or sections per template"
  commentary:
    format: "actionable"
    silent_failures: false
```

---

## Constraints & Validation

**All Governance Rules**:

- Must align with Constitution Principles (I, II, V, VIII, IX, X)
- Must reference only canonical labels from `.github/labels.yml` (LOCKED)
- Must not conflict with existing PR template routing (Constitution Principle VIII)
- Must maintain backward compatibility (no breaking changes to existing PRs)

**Accuracy Targets**:

- Template validation: ≥95% pass rate (well-formed), ≥90% catch rate (malformed) (SC-014)
- Label enforcement: ≥85% accuracy on suggestions (SC-015)
- DoD automation: ≥90% relevance of checklist items (SC-016)
- Documentation validation: Zero silent failures (SC-017)

---

**Status**: ✅ GOVERNANCE RULES SCHEMA COMPLETE | Ready for integration
