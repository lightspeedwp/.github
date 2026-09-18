# Quickstart: Requirements Quality Checklist Framework

**Phase**: Phase 1 (Design & Contracts) | **Date**: 2026-09-13 | **Status**: Validation Guide

## Overview

This document provides step-by-step guidance to validate the Requirements Quality Checklist Framework design and confirm that MVP deliverables will meet specification requirements.

---

## Quickstart Scenarios

### Scenario 1: Author Self-Review (P1 User Story)

**Goal**: Verify that authors can self-validate a specification within 30 minutes using the checklist, catching common quality gaps.

**Setup**:

1. **Source**: Use the spec file itself (`.github/specs/010-requirements-checklist/spec.md`) as test target
2. **Template**: Load `author-pre-review` checklist template
3. **Environment**: Node.js runtime, checklist library installed

**Execution**:

```bash
# Pseudo-code (actual implementation language TBD)
npm install @lightspeed/requirements-checklist

const checklist = require('@lightspeed/requirements-checklist');
const spec = readFile('.github/specs/010-requirements-checklist/spec.md');

const result = await checklist.run({
  spec_path: '.github/specs/010-requirements-checklist/spec.md',
  template_id: 'author-pre-review',
  spec_content: spec
});

console.log(result.overall_score);        // Expected: 90+ (high quality spec)
console.log(result.passed);               // Expected: true
console.log(result.findings.length);      // Expected: 0-2 (minor findings)
console.log(result.completion_time_seconds); // Expected: <5 seconds
```

**Expected Outcome**:

- ✅ Checklist completes in <5 seconds (SC-006)
- ✅ Identifies that the spec is complete and well-structured
- ✅ May flag minor ambiguities (if any exist)
- ✅ Provides actionable recommendations (if items fail)
- ✅ Output is human-readable and machine-parseable

**Verification Checklist** (for Phase 1 validation):

- [ ] Checklist executes without errors
- [ ] Results include overall_score (0-100)
- [ ] Results include per-dimension scores
- [ ] Results include findings with evidence & recommendations
- [ ] Completion time is <5 seconds
- [ ] Result schema validates against `checklist-result.schema.json`

---

### Scenario 2: Peer Review with High Inter-Rater Reliability (P1 User Story)

**Goal**: Verify that two independent reviewers using the same checklist produce aligned findings on dimension-specific issues (80%+ inter-rater reliability).

**Setup**:

1. **Test Spec**: Create a spec with intentional quality gaps (bad examples that fail specific checklist items)
2. **Reviewers**: Two simulated reviewers (can be automated or manual)
3. **Template**: Use `peer-review` template
4. **Execution**: Run same checklist twice independently

**Execution**:

```bash
# Run 1: Reviewer A
const result_a = await checklist.run({
  spec_path: 'test-specs/spec-with-gaps.md',
  template_id: 'peer-review',
  metadata: { reviewer: 'alice' }
});

# Run 2: Reviewer B (simulated, same template)
const result_b = await checklist.run({
  spec_path: 'test-specs/spec-with-gaps.md',
  template_id: 'peer-review',
  metadata: { reviewer: 'bob' }
});

# Comparison
const alignment = compareResults(result_a, result_b);
console.log(alignment.dimension_score_correlation);  // Expected: 0.80+
console.log(alignment.failed_items_overlap);         // Expected: 80%+
```

**Test Spec Characteristics** (spec-with-gaps.md):

- ✅ Complete structure (passes completeness dimension)
- ❌ Uses vague language ("fast", "scalable") without thresholds (fails clarity)
- ❌ Inconsistent terminology (uses "user story" and "story" interchangeably) (fails consistency)
- ❌ Success criteria with no metrics (fails measurability)
- ❌ Missing edge case coverage (fails edge-cases)

**Expected Outcome**:

- ✅ Both reviewers identify the same failing items (dimension-specific alignment)
- ✅ Both assign similar dimension scores
- ✅ Both produce similar findings and recommendations
- ✅ Inter-rater reliability ≥80% (SC-002)

**Verification Checklist** (for Phase 1 validation):

- [ ] Two independent runs produce dimension_scores within 10 percentage points
- [ ] Overlap of failed items is ≥80%
- [ ] Findings include the same evidence quotes
- [ ] Dimension-level pass/fail decisions align

---

### Scenario 3: Stakeholder Gate Validation (P1 User Story)

**Goal**: Verify that non-technical stakeholders can complete the business-focused checklist in 15 minutes and identify scope issues.

**Setup**:

1. **Template**: Use `stakeholder-gate` template (simplified, business-focused)
2. **Audience**: Simulate non-technical reviewer
3. **Time Constraint**: Track completion time
4. **Test Spec**: Use a spec with missing user scenarios and unresolved dependencies

**Execution**:

```bash
const result = await checklist.run({
  spec_path: 'test-specs/spec-scope-issues.md',
  template_id: 'stakeholder-gate',
  audience: 'stakeholder'
});

console.log(result.template_id);              // Expected: 'stakeholder-gate'
console.log(result.completion_time_seconds);  // Expected: <15 * 60 = 900s
console.log(result.findings.length);          // Expected: 2-3 (scope/dependency issues)
console.log(result.findings[0].recommendation); // Expected: Business-friendly language
```

**Test Spec Characteristics** (spec-scope-issues.md):

- ✅ Clear overview and business value statement
- ✅ User scenarios defined
- ❌ Missing one critical user scenario (stakeholder should catch)
- ❌ Unresolved dependency on external system (stakeholder should catch)
- ✅ Success criteria present (stakeholder not expected to validate each one)

**Expected Outcome**:

- ✅ Checklist identifies missing scenarios
- ✅ Checklist flags unresolved dependencies
- ✅ Recommendations are written for stakeholders (no technical jargon)
- ✅ No questions on technical architecture/implementation
- ✅ Time to complete: <15 minutes (realistic for busy stakeholder)

**Verification Checklist** (for Phase 1 validation):

- [ ] Template used is `stakeholder-gate`
- [ ] Completion time is <15 minutes
- [ ] Questions have no technical jargon (no "API", "database", "framework")
- [ ] Findings recommendations reference business impact ("Delays release", "Breaks integration")
- [ ] Result schema validates

---

### Scenario 4: Cross-Project Integration Validation (P2 User Story)

**Goal**: Verify that technical leads can validate a dependent project's spec for contract clarity and integration readiness in ~20 minutes.

**Setup**:

1. **Template**: Use `cross-project-integration` template (focused on dependencies/contracts)
2. **Test Spec**: Spec from a hypothetical dependent project (Project B)
3. **Integration Context**: Assume Project A depends on Project B's deliverables

**Execution**:

```bash
const result = await checklist.run({
  spec_path: 'test-specs/project-b-spec.md',
  template_id: 'cross-project-integration',
  metadata: {
    dependent_project: 'Project A',
    integration_concern: 'Data API contract'
  }
});

console.log(result.dimension_scores['dependencies']);  // Expected: high (contract clarity)
console.log(result.findings.filter(f => f.dimension_id === 'dependencies'));
// Expected: Findings about API contract clarity, assumption alignment
```

**Test Spec Characteristics** (project-b-spec.md):

- ✅ Clear assumptions documented
- ✅ Data/API contracts defined
- ❌ One assumption conflicts with Project A's requirements (integration issue)
- ❌ API versioning approach unclear (integration risk)

**Expected Outcome**:

- ✅ Checklist identifies the assumption conflict
- ✅ Checklist flags API versioning ambiguity
- ✅ Recommendations include specific resolution steps ("Clarify API versioning in Dependencies section")
- ✅ Lead can decide: Is spec ready for integration, or needs revision?

**Verification Checklist** (for Phase 1 validation):

- [ ] Template focuses on Completeness, Dependencies, Consistency dimensions
- [ ] Findings reference cross-project impact
- [ ] Result identifies contract clarity issues
- [ ] Completion time is ~20 minutes

---

## Validation Checklists

### Framework MVP Readiness

Use these checklists during Phase 1 prototyping to validate that the framework design meets requirements:

#### ✅ Checklist Execution

- [ ] Checklist runs without errors
- [ ] Execution time <5 seconds for 50+ items (SC-006)
- [ ] Supports markdown, YAML, and JSON spec formats
- [ ] Handles large specs (100+ pages) without degradation

#### ✅ Data Model Compliance

- [ ] ChecklistDimension entity validates against schema (contracts/)
- [ ] ChecklistItem entity validates against schema
- [ ] ChecklistTemplate entity validates against schema
- [ ] ChecklistResult entity validates against schema
- [ ] SpecificationReference entity validates against schema
- [ ] All relationships between entities work correctly

#### ✅ Template Functionality

- [ ] `author-pre-review` template loads and executes (~50 items)
- [ ] `peer-review` template loads and executes (~50 items)
- [ ] `stakeholder-gate` template loads and executes (~25 items)
- [ ] `cross-project-integration` template loads and executes (~30 items)
- [ ] Templates can be customised without modifying core engine

#### ✅ Dimension Coverage

- [ ] Completeness dimension works (detects missing sections)
- [ ] Clarity dimension works (detects vague language)
- [ ] Consistency dimension works (detects terminology drift)
- [ ] Measurability dimension works (detects non-quantified criteria)
- [ ] Scenario Coverage dimension works (detects missing user journeys)
- [ ] Edge Cases dimension works (detects missing edge case coverage)
- [ ] Dependencies dimension works (detects unresolved assumptions)
- [ ] Ambiguities dimension works (detects unclear requirements)

#### ✅ Results & Reporting

- [ ] Results include overall_score (0-100)
- [ ] Results include per-dimension scores
- [ ] Results include findings (failed items with evidence)
- [ ] Results include recommendations
- [ ] Results can be output as JSON
- [ ] Results can be output as human-readable report
- [ ] Results schema validates against checklist-result.schema.json

#### ✅ Specification Requirements Met

- [ ] **FR-001**: 8 dimensions with measurable checkpoints ✅
- [ ] **FR-002**: 40+ base checklist items ✅
- [ ] **FR-003**: 4 audience variants with tailored language ✅
- [ ] **FR-004**: Results with dimension scores & findings ✅
- [ ] **FR-005**: Reference examples & clarification guidance ✅
- [ ] **FR-006**: Extension mechanism (config overlays) ✅
- [ ] **FR-007**: Integration foundation (library + CLI) ✅
- [ ] **FR-008**: Result tracking (SpecificationReference + result storage) ✅

#### ✅ Success Criteria Validation

- [ ] **SC-001**: Authors can self-review in 30 minutes ✅
- [ ] **SC-002**: 80%+ inter-rater reliability (Scenario 2) ✅
- [ ] **SC-003**: 90% rework avoidance on passing specs (requires pilot data)
- [ ] **SC-004**: Stakeholder onboarding 60→15 minutes (Scenario 3) ✅
- [ ] **SC-005**: 50% fewer integration surprises (requires pilot data)
- [ ] **SC-006**: <5 seconds execution (all scenarios) ✅
- [ ] **SC-007**: Adoption target (requires 6-month pilot)

---

## Phase 2 Validation Gates

Before moving to Phase 2 (Task Decomposition), confirm:

1. **Prototype Complete**: All 4 scenarios execute successfully
2. **Data Model Validated**: All entities pass JSON schema validation
3. **Performance Verified**: All scenarios complete in <5 seconds
4. **Contract Definitions Approved**: All 5 schemas reviewed and finalised
5. **Architecture Reviewed**: Framework design aligns with specification
6. **No Blocker Findings**: No issues that would prevent task decomposition

---

**Quickstart Status**: ✅ COMPLETE — Validation guide ready for Phase 1 prototype development.
