# Phase 0 Clarifications: Governance Audit Implementation

**Status**: Critical Ambiguities Resolved  
**Date**: 2026-09-17  
**Branch**: `audit/governance-audit-implementation`

---

## Overview

Three critical ambiguities identified during specification analysis require resolution before Phase 1 implementation begins. This document captures decisions and rationale for each.

---

## A1: FR-001 — "Completion Status" Definition (CRITICAL)

### Original Ambiguity

**FR-001**: "Audit system MUST scan all LOCKED governance files and report completion status"

**Problem**: "completion status" undefined. Does it mean:

- Binary pass/fail (audit finished or not)?
- Detailed metrics (files scanned, rules checked, violations found)?
- Compliance percentage (100/100 rules passed)?

### Decision

**Completion Status = Detailed Audit Report**

The audit "completion status" is a comprehensive JSON and Markdown report containing:

1. **Audit Metadata**
   - Report ID: `audit-[YYYYMMDD]-[HHMMSS]`
   - Timestamp: ISO 8601
   - Files scanned (count): `x of y LOCKED files`
   - Scan duration: milliseconds

2. **Validation Results**
   - Total rules checked: `n`
   - Rules passed: `m`
   - Compliance percentage: `(m/n) * 100%`
   - Violations found: `v` (grouped by severity)

3. **Violation Details**
   - Each violation: {file, line, rule, message, remediation}
   - Grouped by: severity (CRITICAL, HIGH, MEDIUM, LOW)
   - Sorted by: line number within each file

4. **Trends** (if prior reports exist)
   - Violations fixed (count): since last audit
   - New violations (count): since last audit
   - Trend direction: improving / stable / declining
   - Compliance trend: % change since last audit

5. **Accessibility**
   - JSON format (machine-readable): `.github/reports/governance-audit-[DATE].json`
   - Markdown format (human-readable): `.github/reports/governance-audit-[DATE].md`

### Impact on Tasks

- **T012** (Main audit entrypoint): Updated to output JSON + Markdown report per above schema
- **T014** (Report writer): Explicitly saves both formats
- **T013** (Compliance metrics): Computes percentage, summary stats, violations by severity
- **T015** (Trend analysis): Compares to prior report, calculates trend direction

### Rationale

Comprehensive reporting enables:

- Automated monitoring (CI gates can check compliance %)
- Historical tracking (trends show improvement over time)
- Actionable remediation (each violation includes location + fix guidance)
- Governance audit trail (timestamped reports for compliance proof)

---

## A2: FR-003 — "Documented Purpose" & "Usage Detection" (CRITICAL)

### Original Ambiguity

**FR-003**: "Audit MUST verify that each label in the canonical set has a documented purpose and is used at least once in active workflows or templates"

**Problem**: Two undefined concepts:

1. **Where documentation lives**: Labels.yml comment? Separate registry? Inline docs?
2. **How to detect "active usage"**: PR/issues applied? Workflow reference? Code mention?

### Decision

#### Part A: Documentation Location

**Labels MUST have documented purpose in `.github/labels.yml`**

Format: YAML comment immediately above each label definition

**Example**:

```yaml
# Primary issue classification: used when initial triage determines this is a defect vs. feature
- name: type:bug
  color: FF0000
  description: Bug report or defect needing resolution
```

Comment format:

- Single line preferred (max 100 chars)
- Lowercase first letter (UK English convention)
- Explains: what the label is, why it exists, primary use case
- Avoid: implementation details, just state the governance purpose

#### Part B: Active Usage Detection

**Label is "actively used" if ANY of the following are true:**

1. **Used in active templates** (highest priority)
   - Applied in `.github/ISSUE_TEMPLATE/*.md` frontmatter
   - Applied in `.github/PULL_REQUEST_TEMPLATE/*.md` frontmatter
   - Example: `labels: ["type:bug"]` in template frontmatter

2. **Referenced in workflows**
   - Used in `.github/workflows/*.yml` label filters
   - Applied by labeler automation or CI gates
   - Example: `github.event.label.name == 'type:bug'`

3. **Documented in specification**
   - Explicitly listed in `.github/specs/*/spec.md` requirements
   - Example: "Audit validates `type:bug` labels per FR-002"
   - Evidence: grep in spec files

**Audit algorithm**:

```
for each label in canonical set {
  if label in any active template → USED ✓
  else if label in any workflow → USED ✓
  else if label in any spec.md → USED ✓
  else → UNUSED ✗ (violation: label-not-actively-used)
}
```

### Impact on Tasks

- **T004** (GovernanceFile parser): Extract YAML comments as documented purpose
- **T008** (Label validation): Check for documented purpose comment; report violations
- **T013** (Compliance metrics): Count active vs. unused labels
- **New acceptance criterion**: All labels in canonical set have documented purpose + active usage

### Rationale

Documented purposes:

- Enable governance clarity (why does this label exist?)
- Support auditing (can verify label taxonomy aligns with constitution)
- Aid new team members (understand governance structure without code diving)

Active usage detection:

- Prevents orphaned labels (labels with no real purpose clogging the taxonomy)
- Ensures audit reflects actual governance (not theoretical)
- Reveals drift (labels in taxonomy but not used = governance drift)

---

## A6: FR-010 — "Prevent Commits" Enforcement Mechanism (CRITICAL)

### Original Ambiguity

**FR-010**: "Validation system MUST prevent commits that violate established governance rules"

**Problem**: Enforcement layer undefined. Options:

1. **Pre-commit hook only**: Developer-side, can bypass (`git commit --no-verify`)
2. **CI gate only**: Server-side, cannot bypass, blocks merge
3. **Both**: Defense-in-depth (catch early locally, enforce server-side)

### Decision

**BOTH: Pre-commit Hook + CI Gate (Defense-in-Depth)**

#### Layer 1: Pre-commit Hook (Fast, Developer-Facing)

**File**: `.husky/pre-commit`

**Triggers**: On `git commit` (before commit is created)

**Behavior**:

- Runs validation on staged governance files only (fast feedback)
- If violations found: refuse commit, show remediation guidance
- If no violations: commit proceeds normally

**User experience**:

```bash
$ git commit -m "Update labels"
✓ Validating staged governance files...
✗ VIOLATION: label 'bug' missing 'type:' prefix at .github/labels.yml:42
  Remediation: Change 'bug:' to 'type:bug' and retry

$ git commit  # after fix
✓ Validation passed. Commit created.
```

**Can be bypassed**: `git commit --no-verify` (documented as "for emergencies only")

#### Layer 2: CI Gate (Server-Side, Enforcement)

**File**: `.github/workflows/validate-governance.yml`

**Triggers**: On every push + PR

**Behavior**:

- Full validation of all governance files (not just staged)
- If violations found: check fails, comments on PR with violations
- Merge blocked until check passes (cannot override)

**User experience**:

```
❌ validate-governance
   VIOLATION: label 'bug' missing 'type:' prefix at .github/labels.yml:42
   VIOLATION: duplicate labels: 'type:feature' and 'type:feature-request' (similar meaning)
   
   Fix violations and push again to re-run check.
```

**Cannot be bypassed**: Requires admin approval to merge with failed checks (which should not be granted)

### Impact on Tasks

- **T027** (Pre-commit hook integration): Create `.husky/pre-commit` that runs validation on staged files
- **T028** (GitHub Actions workflow): Create `.github/workflows/validate-governance.yml` that runs full validation
- **FR-010 updated**: Explicitly states "via pre-commit hook and CI gate" (not OR, AND)

### Rationale

**Why both?**

Pre-commit hook alone:

- ✗ Can be bypassed with `--no-verify`
- ✗ Slow feedback if developer commits bad changes and waits for CI to fail
- ✓ Fast (prevents bad commits from reaching CI at all)
- ✓ Good developer experience (immediate feedback)

CI gate alone:

- ✓ Cannot be bypassed
- ✓ Guarantees only valid code reaches repository
- ✗ Slower feedback (developer commits, waits for CI)
- ✗ Wastes CI resources validating locally-fixable issues

Both together:

- ✓ Fast developer feedback (pre-commit catches issues immediately)
- ✓ Server-side enforcement (CI prevents bad pushes)
- ✓ Defense-in-depth (even if pre-commit is bypassed, CI catches it)
- ✓ Audit trail (CI logs show all validation runs)

---

## Implementation Summary

| Item | Before | After | Tasks |
|------|--------|-------|-------|
| **A1: Completion Status** | Undefined | Comprehensive JSON+Markdown report with trends | T012, T013, T014, T015 |
| **A2: Documentation** | Unclear | YAML comments + active usage detection | T004, T008, T013 |
| **A6: Enforcement** | Missing | Pre-commit hook + CI gate (both required) | T027, T028 |

---

## Approval & Next Steps

✅ **Phase 0 Clarifications Complete**

Ready to proceed with:

- ✅ Phase 1: Setup (T001-T003)
- ✅ Phase 2: Foundational (T004-T007)
- ✅ Phase 3: User Story 1 (T008-T020)

**Blockers Resolved**: All 3 critical ambiguities clarified. No blockers remain for Phase 1 start.

**Outstanding Items** (can resolve during implementation):

- A3: Provide duplicate detection examples (test dataset for T025)
- A4: Define WCAG validation scope for Markdown (design task for T010)
- A5: Define "active" templates definition (implementation detail for T009)
- C2: Confirm UK English requirement (optional FR if in scope)
- D1: Secret scanning scope (Phase 2+ decision)

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-17  
**Status**: Ready for Implementation
