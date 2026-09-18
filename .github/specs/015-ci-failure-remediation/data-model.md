# Data Model: CI Failure Classification Framework

**Spec**: 015-ci-failure-remediation | **Phase**: 1 (Design) | **Date**: 2026-09-18

## Overview

This document defines the entities, attributes, and validation methods for classifying CI check failures on PR #3367 as environmental (pre-existing) or audit-introduced (new violations from audit code).

## Failure Categories

### 1. Changelog Entry Validation Failure

**Entity Name**: `changelog_failure`

**Attributes**:

- `entry_index` — Position in CHANGELOG.md (e.g., entry #1, #2, ..., #54)
- `entry_text` — Full changelog entry text
- `character_count` — Length in characters (validation: ≤250)
- `compliance_status` — COMPLIANT | VIOLATION
- `violation_type` — None | EXCEEDS_LENGTH | UNEXPLAINED_ABBREVIATION | IMPLEMENTATION_DETAILS | FORMAT_ERROR
- `source_branch` — develop | audit/015-ci-failure-remediation

**Classification**: Environmental (Pre-existing on develop)

**Validation Method**:

1. Run changelog validation script on develop branch
2. Count compliant entries (expected: 6/54)
3. Run same script on audit branch
4. Compare results: must be identical
5. If identical, mark as ENVIRONMENTAL

**Evidence Format**:

```
Changelog Validation Baseline:
- Validation run on develop: 6/54 entries compliant (11.1%)
- Validation run on audit/015: 6/54 entries compliant (11.1%)
- Delta: 0 (identical results)
- Classification: ENVIRONMENTAL — No new violations from audit changes
```

**Remediation Owners** (separate work from audit): Changelog maintainers

**Remediation Effort**: Medium (requires rewriting 48 entries to meet format/length requirements)

### 2. Mermaid Diagram Validation Failure

**Entity Name**: `mermaid_failure`

**Attributes**:

- `file_path` — Full path to file with Mermaid diagram (e.g., `.github/specs/001-governance-audit/diagram.md`)
- `diagram_type` — flowchart | sequence | class | state | entity-relationship | ...
- `validation_error` — Specific Mermaid validation error message
- `source_branch` — develop | audit/015-ci-failure-remediation
- `file_exists_on_develop` — true | false

**Classification**: Environmental (Merge artifact from develop)

**Validation Method**:

1. Extract list of files failing Mermaid validation from PR #3367 CI checks
2. For each file:
   a. Check if file exists on develop branch (git ls-tree origin/develop <file_path>)
   b. If exists: fetch file from develop; run Mermaid validator
   c. Compare error message: must be identical
3. If file exists on develop with identical error, mark as ENVIRONMENTAL

**Evidence Format**:

```
Mermaid Validation Merge Artifacts:
- File: .github/specs/001-governance-audit/architecture.md
- Error: "Invalid diagram syntax at line 15"
- Exists on develop: YES
- Error on develop: IDENTICAL
- Classification: ENVIRONMENTAL — Pre-existing violation in merged file
```

**Remediation Owners** (separate work from audit): Spec file maintainers

**Remediation Effort**: Medium (file-by-file diagram format corrections)

### 3. Frontmatter Validation Failure

**Entity Name**: `frontmatter_failure`

**Attributes**:

- `file_path` — Full path to spec file (e.g., `.github/specs/*/spec.md`)
- `field_name` — Frontmatter field that failed validation (e.g., Created, Status, Feature Branch)
- `validation_error` — Specific validation error message
- `expected_format` — Schema requirement (e.g., "YYYY-MM-DD", "Draft|In Progress|Complete")
- `actual_value` — Value found in file
- `source_branch` — develop | audit/015-ci-failure-remediation

**Classification**: Environmental (Merge artifact from develop)

**Validation Method**:

1. Extract list of files failing frontmatter validation from PR #3367 CI checks
2. For each file:
   a. Check if file exists on develop branch
   b. If exists: fetch file from develop; validate frontmatter
   c. Compare error: must be identical
3. If file exists on develop with identical error, mark as ENVIRONMENTAL

**Evidence Format**:

```
Frontmatter Validation Merge Artifacts:
- File: .github/specs/004-branch-naming-strategy/spec.md
- Field: Feature Branch
- Error: "Invalid format: expected 'prefix/scope-title'"
- Exists on develop: YES
- Error on develop: IDENTICAL
- Classification: ENVIRONMENTAL — Pre-existing frontmatter schema violation
```

**Remediation Owners** (separate work from audit): Spec maintainers, schema definition owners

**Remediation Effort**: Low-Medium (frontmatter schema standardization and migration)

### 4. Agent Spec Validation Failure

**Entity Name**: `agent_spec_failure`

**Attributes**:

- `check_name` — "Agent Spec Validation"
- `error_message` — Full error output from check
- `test_case` — Which automation check failed (e.g., "frontmatter", "cross-reference", "undefined-refs")
- `reproducible_locally` — true | false
- `reproducible_on_develop` — true | false | UNTESTED
- `source_branch` — develop | audit/015-ci-failure-remediation

**Classification**: Environmental (Requires investigation; likely infrastructure or automation side effect)

**Validation Method**:

1. Reproduce check locally: clone repo, run agent spec validation script
2. Run on develop branch: Does the error occur?
3. Run on audit branch without merging develop changes: Does the error still occur?
4. Conclusion:
   - If error on develop + error on audit (different) → Likely infrastructure issue (ENVIRONMENTAL)
   - If error on develop + no error on audit → Likely merge conflict in CI config (ENVIRONMENTAL)
   - If no error on develop + error on audit → Likely audit code issue (AUDIT-INTRODUCED)

**Evidence Format**:

```
Agent Spec Validation Investigation:
- Error: "Frontmatter Validation: ❌ Failed"
- Reproducible locally: [YES/NO]
- Reproducible on develop: [YES/NO]
- Classification: ENVIRONMENTAL — [reason based on investigation results]
```

**Remediation Owners** (separate work from audit): Infrastructure/automation team (if environmental)

**Remediation Effort**: Low (diagnostic work; implementation depends on root cause)

### 5. Milestone Assignment

**Entity Name**: `milestone_requirement`

**Attributes**:

- `pr_number` — 3367
- `project_field` — GitHub Projects "Milestone" field
- `requirement` — Milestone must be assigned before merge
- `assignment_method` — GitHub UI (manual) | Automated workflow
- `current_status` — UNASSIGNED | ASSIGNED

**Classification**: Governance Workflow (Not a code violation; manual GitHub UI assignment)

**Validation Method**:

1. Open PR #3367 in GitHub
2. Navigate to linked GitHub Projects board
3. Locate the PR card
4. Check if "Milestone" field is populated
5. If not populated, assign via UI

**Evidence Format**:

```
Milestone Assignment Status:
- PR #3367: GitHub Projects milestone field
- Current: [UNASSIGNED | ASSIGNED to <milestone name>]
- Action: [Assign via GitHub UI]
- Classification: GOVERNANCE WORKFLOW — Not code-enforced; UI-only action
```

**Remediation Owners**: PR author or governance team lead

**Remediation Effort**: Minimal (one-time UI action, <1 minute)

### 6. Lint and Testing Failures

**Entity Name**: `lint_or_test_failure`

**Attributes**:

- `file_path` — File containing violation (e.g., `.github/workflows/*.yml`, `.eslint.config.cjs`)
- `violation_type` — lint | test_failure | coverage_gap
- `rule_name` — ESLint rule, Jest test name, etc.
- `violation_message` — Specific error message
- `source_branch` — develop | audit/015-ci-failure-remediation
- `linting_rule_version` — ESLint/PHPCS version under which rule is evaluated

**Classification**: Environmental (Merge artifact from develop; violations pre-exist under current rules)

**Validation Method**:

1. Extract failing file and rule name from PR #3367 CI checks
2. Check if file exists on develop branch
3. If exists:
   a. Fetch file from develop
   b. Run linting with CURRENT rules (same version as audit branch CI)
   c. If violation appears: mark as ENVIRONMENTAL
4. If violation does NOT appear on develop under same rules: mark as AUDIT-INTRODUCED

**Evidence Format**:

```
Lint Failure — Environmental:
- File: .github/workflows/old-workflow.yml
- Rule: no-deprecated-actions (ESLint v9.0)
- Violation: "GitHub Actions step 'setup-node' uses deprecated version"
- Exists on develop: YES
- Violation under current rules: YES
- Classification: ENVIRONMENTAL — Pre-existing violation in merged workflow file

Lint Failure — Audit-Introduced (hypothetical):
- File: .github/audit-rules.js (NEW FILE from audit)
- Rule: no-hardcoded-secrets
- Violation: "Hardcoded API key found"
- Exists on develop: NO (new file)
- Classification: AUDIT-INTRODUCED — Requires fix before merge
```

**Remediation Owners** (if environmental): Configuration file maintainers (separate work)

**Remediation Effort**: Medium (file-by-file rule updates and configuration corrections)

---

## Validation State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    CI Check Runs                            │
│         (PR #3367 GitHub Actions output)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   Extract Failure Details     │
         │  (file, rule, error message)  │
         └────────────┬──────────────────┘
                      │
                      ▼
         ┌────────────────────────────────┐
         │  Classify by Category          │
         │  (1-6 categories above)        │
         └────────┬───────────────────────┘
                  │
       ┌──────────┴──────────┬────────────────┐
       │                     │                │
       ▼                     ▼                ▼
  Check develop       Run validation    Manual verification
  (1-4, 6)           script (all)       (5 = UI action)
       │                   │                │
       ▼                   ▼                ▼
  File exists?      Error identical?   UI toggle needed?
     YES│NO          YES│NO              YES│NO
       │             │                    │
    MERGE           ENVIRONMENTAL       ASSIGN
    ARTIFACT     ←────────────────→     MILESTONE
       │                  │                 │
       └──────────────────┼─────────────────┘
                          ▼
            ┌──────────────────────────┐
            │ CLASSIFICATION COMPLETE  │
            │  (ENVIRONMENTAL or       │
            │   AUDIT-INTRODUCED)      │
            └──────────────────────────┘
```

---

## Validation Rules Summary

| Category | Pre-Existence Check | Evidence | Pass Condition |
|----------|-------------------|----------|---|
| Changelog | Run validator on develop | Results: 6/54 identical | Results match audit branch |
| Mermaid | File git ls-tree on develop | File exists + error identical | File found + same error |
| Frontmatter | File git show on develop | File exists + frontmatter match | File found + same error |
| Agent Spec | Run locally + on develop | Script output comparison | Reproduce on develop or show infra issue |
| Milestone | GitHub UI check | Field status | Assignable via UI |
| Lint/Test | Run current linter on develop | Violation reproduction | Violation found on develop |

---

## References

- **Specification**: [spec.md](./spec.md) — Feature requirements and user stories
- **Plan**: [plan.md](./plan.md) — Implementation roadmap
- **PR #3367**: Governance audit implementation (source of CI failures)
- **Constitution**: `.specify/memory/constitution.md` — Governance principles
