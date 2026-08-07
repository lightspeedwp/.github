---
title: "Label Prefix Enforcement Testing & Validation"
description: "Comprehensive testing procedures and validation checklist"
file_type: "documentation"
version: "1.0.0"
created_date: "2026-08-07"
last_updated: "2026-08-07"
author: "Claude Code"
maintainer: "LightSpeed Team"
domain: "governance"
status: "active"
tags:
  - testing
  - validation
  - qa
  - procedures
---

# Testing & Validation Procedures

**Document Purpose**: Define testing and validation procedures for each phase  
**Target Audience**: QA, DevOps, Engineering, Governance teams  
**Success Measure**: All tests pass, 0 violations confirmed  

---

## Testing Strategy Overview

### Testing Pyramid

```
        ▲
       ╱│╲
      ╱ │ ╲  E2E Tests (Manual + Automated)
     ╱  │  ╲ - Full workflow scenarios
    ╱───┼───╲
   ╱    │    ╲ Integration Tests
  ╱     │     ╲ - Validation + label creation
 ╱──────┼──────╲
╱       │       ╲ Unit Tests
         │        - Individual functions
    Base Tests
```

### Test Coverage Targets

| Category | Target | Measurement |
|----------|--------|-------------|
| **Unit Tests** | 90%+ | Function coverage |
| **Integration** | 85%+ | Workflow coverage |
| **E2E Tests** | 100% | Critical paths |
| **Regression** | 0 | New issues created |
| **Edge Cases** | 100% | Known scenarios |

---

## Phase 1 Testing: Stop New Violations

### Test 1.1: Documentation Accuracy

**Purpose**: Verify CLAUDE.md and AGENTS.md contain accurate, helpful information  
**Owner**: QA  
**Timeline**: 30 minutes  

#### Test Steps

1. **Review CLAUDE.md Section**
   - [ ] Section exists and is findable
   - [ ] Title is clear: "Label Creation Rules (CRITICAL)"
   - [ ] Examples are accurate
   - [ ] Invalid examples are actually invalid
   - [ ] References point to correct files

2. **Review AGENTS.md Section**
   - [ ] Section exists under governance section
   - [ ] Implementation examples are correct
   - [ ] Code blocks format properly
   - [ ] References match canonical system

3. **Validate References**

   ```bash
   # Verify .github/labels.yml exists
   test -f .github/labels.yml && echo "✓ Labels file exists"
   
   # Verify docs/LABELING.md exists
   test -f docs/LABELING.md && echo "✓ LABELING.md exists"
   
   # Verify docs/LABEL_STRATEGY.md exists
   test -f docs/LABEL_STRATEGY.md && echo "✓ LABEL_STRATEGY.md exists"
   ```

4. **Example Validation**
   - All `type:bug`, `type:feature`, etc. examples must exist in `.github/labels.yml`
   - Invalid examples (bare labels) must NOT exist in `.github/labels.yml`

#### Pass Criteria

- [ ] All sections readable and well-formatted
- [ ] All examples verified against canonical labels
- [ ] All references valid
- [ ] Linting passes (markdown, YAML)

---

### Test 1.2: Code Deletion Verification

**Purpose**: Confirm defective code is removed and not referenced elsewhere  
**Owner**: DevOps  
**Timeline**: 15 minutes  

#### Test Steps

1. **Verify File Removal**

   ```bash
   # Check file doesn't exist
   if [ -f "scripts/agents/includes/labeling-agent.js" ]; then
     echo "❌ FAIL: File still exists"
     exit 1
   else
     echo "✓ File removed"
   fi
   ```

2. **Check Git History**

   ```bash
   # Verify removal was committed
   git log --oneline | grep -i "Remove defective" && echo "✓ Commit found"
   
   # Check for file in previous commit
   git show HEAD~1:scripts/agents/includes/labeling-agent.js &>/dev/null && echo "✓ File existed before"
   ```

3. **Search for References**

   ```bash
   # Comprehensive reference search
   grep -r "labeling-agent.js" . --include="*.js" --include="*.yml" --include="*.yaml" --include="*.md" && echo "❌ FAIL: References found" || echo "✓ No references"
   
   grep -r "scripts/agents/includes/labeling" . --include="*.js" --include="*.yml" && echo "❌ FAIL: References found" || echo "✓ No references"
   ```

4. **Verify Correct Implementation Exists**

   ```bash
   test -f .github/scripts/agents/labeling.agent.js && echo "✓ Correct implementation exists"
   ```

#### Pass Criteria

- [ ] Defective file completely removed
- [ ] No references to file exist
- [ ] Correct implementation file exists
- [ ] Git history shows proper removal

---

### Test 1.3: Governance Rule Enforcement

**Purpose**: Verify AI instructions will prevent bare label creation going forward  
**Owner**: Governance + QA  
**Timeline**: 30 minutes  

#### Test Steps

1. **CLAUDE.md Governance**

   ```bash
   # Check section exists
   grep -A 20 "Label Creation Rules" CLAUDE.md | head -25
   
   # Verify it mentions:
   # - "ALL labels MUST"
   # - ".github/labels.yml"
   # - "family prefix"
   # - Examples of valid AND invalid labels
   ```

2. **AGENTS.md Implementation Guide**

   ```bash
   # Check implementation section
   grep -A 30 "Label Creation for Programmatic" AGENTS.md
   
   # Verify it includes:
   # - Reference to canonical system
   # - Validation steps
   # - Correct vs incorrect patterns
   ```

3. **Validation Checklist**
   - [ ] CLAUDE.md: "Label Creation Rules (CRITICAL)" section exists
   - [ ] CLAUDE.md: Valid examples (with prefixes) documented
   - [ ] CLAUDE.md: Invalid examples (bare) documented  
   - [ ] CLAUDE.md: Reference to `.github/labels.yml` included
   - [ ] AGENTS.md: Implementation guidance documented
   - [ ] AGENTS.md: Code pattern examples included
   - [ ] Both files: Markdown linting passes

#### Pass Criteria

- [ ] Both documents clearly explain rules
- [ ] Rules are unambiguous and actionable
- [ ] Team can understand without further questions
- [ ] Governance is documented in AI instructions

---

## Phase 2 Testing: Fix Existing Issues

### Test 2.1: Remediation Script Dry-Run

**Purpose**: Verify remediation script works correctly without making changes  
**Owner**: QA + DevOps  
**Timeline**: 1 hour  

#### Test Steps

1. **Run Dry-Run Audit**

   ```bash
   npm run audit:labels -- --mode dry-run
   ```

2. **Review Proposed Changes**
   - [ ] Script identifies all ~100 issues with bare labels
   - [ ] Proposed corrections are accurate
   - [ ] No false positives (valid labels not flagged)
   - [ ] All corrections follow canonical system

3. **Example Validations**
   - Bare `bug` → `type:bug` ✓
   - Bare `feature` → `type:feature` ✓
   - Bare `urgent` → `priority:critical` ✓
   - Bare `ci` → `area:ci` ✓

4. **Document Review**

   ```bash
   # Save dry-run output for review
   npm run audit:labels -- --mode dry-run > /tmp/remediation-plan.txt
   
   # Manual review by 2+ team members
   # Sign off: acceptance needed to proceed
   ```

#### Pass Criteria

- [ ] Dry-run completes without errors
- [ ] All proposed changes reviewed and approved
- [ ] No false positives found
- [ ] All changes are valid label corrections
- [ ] 2+ team members have signed off

---

### Test 2.2: Remediation Script Execution (Subset)

**Purpose**: Test remediation on first 10 issues before full batch  
**Owner**: QA + DevOps  
**Timeline**: 30 minutes  

#### Test Steps

1. **Run Remediation on Subset**

   ```bash
   # Remediate first 10 issues (dry-run first)
   npm run remediate:labels -- --mode dry-run --limit 10
   
   # If approved, run real remediation
   npm run remediate:labels -- --mode direct --limit 10
   ```

2. **Verify Changes**

   ```bash
   # For each of the 10 issues, verify in GitHub UI:
   # - Old label (bare) is removed
   # - New label (prefixed) is added
   # - No other labels were changed
   ```

3. **Post-Remediation Audit**

   ```bash
   # Audit after subset remediation
   npm run audit:labels
   
   # Expected: 90 violations remaining (not 100)
   ```

4. **Check for Side Effects**
   - [ ] No other labels changed
   - [ ] Workflows still function
   - [ ] No automation broke
   - [ ] Issues still properly categorized

#### Pass Criteria

- [ ] All 10 issues successfully remediated
- [ ] Labels correct in GitHub UI
- [ ] Post-remediation audit confirms reduction
- [ ] No unintended side effects
- [ ] Approved to proceed with full batch

---

### Test 2.3: Full Remediation Execution

**Purpose**: Execute full remediation on all ~100 issues  
**Owner**: DevOps  
**Timeline**: 2 hours (execution + audit)  

#### Test Steps

1. **Execute Full Remediation**

   ```bash
   # Full remediation with final approval
   npm run remediate:labels -- --mode direct
   ```

2. **Monitor Execution**
   - [ ] Script runs to completion
   - [ ] No errors reported
   - [ ] Progress indicator shows completion
   - [ ] Total issues processed = ~100

3. **Post-Remediation Audit**

   ```bash
   # Full audit after remediation
   npm run audit:labels
   
   # Expected: 0 violations found
   ```

4. **Spot Check Issues**
   - [ ] Randomly select 20 issues from range #1500–#1600
   - [ ] Verify in GitHub UI that labels are correct
   - [ ] No bare labels remain
   - [ ] All labels are from canonical set

5. **Workflow Verification**
   - [ ] Automation that depends on prefixed labels works
   - [ ] Reports/metrics still accurate
   - [ ] No workflow failures

#### Pass Criteria

- [ ] Full remediation completes successfully
- [ ] Post-remediation audit: 0 violations
- [ ] Spot check: all sampled issues correct
- [ ] All workflows function normally
- [ ] Phase 2 complete and verified

---

### Test 2.4: Regression Testing

**Purpose**: Verify fix doesn't break existing functionality  
**Owner**: QA  
**Timeline**: 1 hour  

#### Test Scenarios

1. **Issue Search**

   ```bash
   # Test filtering by label family
   gh issue list --label "type:bug" | wc -l
   gh issue list --label "status:needs-triage" | wc -l
   gh issue list --label "priority:critical" | wc -l
   
   # Results should be consistent
   ```

2. **Workflow Execution**
   - [ ] Issue triage workflow works with new labels
   - [ ] Release workflow recognizes labels correctly
   - [ ] CI/CD workflows function normally
   - [ ] Slack notifications still fire

3. **Reports & Metrics**
   - [ ] Label-based metrics are accurate
   - [ ] Issue dashboards show correct counts
   - [ ] Team reports unaffected

#### Pass Criteria

- [ ] All issue searches work
- [ ] All workflows function
- [ ] All reports/metrics accurate
- [ ] Zero regressions detected

---

## Phase 3 Testing: Enforce Validation in Workflows

### Test 3.1: Unit Tests for Validation Function

**Purpose**: Test validation logic at function level  
**Owner**: QA + DevOps  
**Timeline**: 1 hour  

#### Test Cases

```javascript
// Test: Valid label passes
validateLabel('type:bug') → true ✓

// Test: Bare label fails
validateLabel('bug') → false ✓

// Test: Invalid label fails
validateLabel('type:invalid-type') → false ✓

// Test: One-hot per family passes
validateLabels(['type:bug', 'status:open', 'priority:normal']) → true ✓

// Test: Duplicate family fails
validateLabels(['type:bug', 'type:feature']) → false ✓

// Test: Meta labels can be multiple
validateLabels(['meta:needs-changelog', 'meta:has-pr']) → true ✓
```

#### Pass Criteria

- [ ] All unit tests pass
- [ ] Code coverage ≥ 90%
- [ ] Edge cases handled
- [ ] Error messages clear

---

### Test 3.2: Integration Tests with Workflows

**Purpose**: Test validation integrated into GitHub workflow  
**Owner**: QA + DevOps  
**Timeline**: 2 hours  

#### Test Scenarios

1. **Create Issue with Valid Labels**

   ```bash
   gh issue create --title "Test" --label "type:bug" --label "status:needs-triage"
   
   # Expected: Issue created successfully
   # Validation passes, issue has correct labels
   ```

2. **Create Issue with Bare Labels (Should Reject)**

   ```bash
   gh issue create --title "Test" --label "bug" --label "urgent"
   
   # Expected: Issue creation blocked
   # Workflow validation rejects bare labels
   # Clear error message provided
   ```

3. **Create PR with Valid Labels**

   ```bash
   gh pr create --title "Test" --label "type:feature" --label "status:review"
   
   # Expected: PR created successfully
   ```

4. **Create PR with Invalid Labels (Should Reject)**

   ```bash
   gh pr create --title "Test" --label "bug" --label "feature"
   
   # Expected: PR creation blocked
   ```

5. **Edge Case: One-Hot Violation (Should Reject)**

   ```bash
   gh issue create --title "Test" --label "type:bug" --label "type:feature"
   
   # Expected: Issue creation blocked
   # Error: "Multiple type labels not allowed"
   ```

6. **Edge Case: Meta Multiple Labels (Should Pass)**

   ```bash
   gh issue create --title "Test" --label "meta:needs-changelog" --label "meta:has-pr"
   
   # Expected: Issue created successfully
   # Meta labels can have multiples
   ```

#### Pass Criteria

- [ ] Valid labels create issues/PRs successfully
- [ ] Bare labels are rejected with clear error
- [ ] Invalid combinations are rejected
- [ ] One-hot rules enforced (except meta)
- [ ] Error messages are helpful
- [ ] Workflows complete in <5 seconds

---

### Test 3.3: Error Handling & Recovery

**Purpose**: Test error scenarios and recovery procedures  
**Owner**: QA  
**Timeline**: 1 hour  

#### Test Scenarios

1. **Invalid Label + Recovery**

   ```bash
   # Attempt 1: Create with bare label (fails)
   gh issue create --title "Test" --label "bug"
   # → Workflow blocks, error message shown
   
   # Attempt 2: Fix label and retry
   gh issue create --title "Test" --label "type:bug"
   # → Success
   ```

2. **Workflow Timeout**
   - [ ] Validation completes in <5s
   - [ ] No timeout errors
   - [ ] Performance acceptable

3. **API Failures**
   - [ ] If label lookup fails, safe fallback behavior
   - [ ] Clear error messages
   - [ ] No silent failures

#### Pass Criteria

- [ ] All error scenarios handled gracefully
- [ ] Clear, helpful error messages
- [ ] Recovery procedures work
- [ ] Performance acceptable

---

## Phase 4 Testing: Documentation Updates

### Test 4.1: Documentation Accuracy

**Purpose**: Verify all documentation is accurate and consistent  
**Owner**: QA + Documentation owner  
**Timeline**: 2 hours  

#### Tests

1. **Example Consistency**
   - All examples in LABELING.md exist in `.github/labels.yml`
   - All invalid examples don't exist in canonical system
   - No contradictions between documents

2. **Reference Accuracy**
   - All links point to correct files
   - All file paths are accurate
   - No broken references

3. **Completeness**
   - All label families documented
   - All major labels have examples
   - Edge cases explained

4. **Clarity**
   - Documentation is understandable
   - Examples are clear
   - Screenshots/diagrams helpful

#### Pass Criteria

- [ ] 100% example accuracy
- [ ] 100% reference accuracy
- [ ] Complete documentation coverage
- [ ] Clear, readable docs

---

### Test 4.2: FAQ Accuracy

**Purpose**: Verify FAQ answers are correct and helpful  
**Owner**: QA + Team Lead  
**Timeline**: 1 hour  

#### Test Scenarios

1. **Answer Verification**
   - Each FAQ answer is accurate
   - Examples are correct
   - Solutions work

2. **Question Coverage**
   - Common questions covered
   - Edge cases explained
   - Troubleshooting included

#### Pass Criteria

- [ ] All FAQ answers verified
- [ ] Common questions covered
- [ ] Examples tested and working

---

## Phase 5 Testing: Team Training

### Test 5.1: Team Understanding Assessment

**Purpose**: Verify team understands new label system  
**Owner**: Training Lead  
**Timeline**: 1 hour per session  

#### Assessment Methods

1. **Knowledge Quiz**
   - 10 questions about label rules
   - Target: 90%+ pass rate
   - Questions cover:
     - What is a family prefix?
     - What are valid label families?
     - How do I find the canonical list?
     - What if I don't know which label?

2. **Hands-On Practice**
   - Create test issues with correct labels
   - Fix test issues with bare labels
   - Identify valid vs invalid labels

3. **Feedback Survey**
   - Is documentation clear?
   - Are rules understood?
   - Any questions remaining?

#### Pass Criteria

- [ ] 90%+ team members pass knowledge quiz
- [ ] All team members can create valid labels
- [ ] Team members can explain the system
- [ ] Feedback indicates understanding

---

## Automated Testing Suite

### Continuous Validation

```bash
# Run before every commit
npm run test

# Includes:
- Unit tests for validation functions
- Integration tests with label system
- Regression tests for workflows
- Documentation accuracy checks
```

### Pre-Deployment Checklist

```bash
#!/bin/bash
set -e

# Phase 1
npm run lint:md CLAUDE.md AGENTS.md
npm run validate:frontmatter CLAUDE.md

# Phase 2
npm run audit:labels -- --mode dry-run > /tmp/audit.txt
# Manual review of /tmp/audit.txt required

# Phase 3
npm test -- validation.test.js
npm test -- integration.test.js

# Phase 4
npm run validate:label-references

# Phase 5
npm run audit:labels
# Expected: 0 violations

echo "✓ All pre-deployment checks passed"
```

---

## Success Criteria Summary

| Phase | Test | Passing Status |
|-------|------|----------------|
| 1 | Documentation accuracy | ✓ Required |
| 1 | Code deletion | ✓ Required |
| 1 | Governance enforcement | ✓ Required |
| 2 | Dry-run audit | ✓ Required |
| 2 | Subset remediation | ✓ Required |
| 2 | Full remediation | ✓ Required |
| 2 | Regression testing | ✓ Required |
| 3 | Unit tests | ✓ Required |
| 3 | Integration tests | ✓ Required |
| 3 | Error handling | ✓ Required |
| 4 | Documentation | ✓ Required |
| 4 | FAQ accuracy | ✓ Required |
| 5 | Team assessment | ✓ Required |

---

## Test Execution Timeline

```
Week 1:
  Phase 1 Tests (Tue–Wed)         [6 hours]
  Phase 2 Tests (Thu–Fri)         [8 hours]
  
Week 2:
  Phase 3 Tests (Mon–Tue)         [6 hours]
  Phase 4 Tests (Wed–Thu)         [4 hours]
  Phase 5 Tests (Fri)             [4 hours]

Total Testing Effort: ~28 hours
Parallel with Phase Execution: Reduce timeline impact
```

---

## Contact & Escalation

- **QA Lead**: [Name]
- **Testing Issues**: Raise in #governance-enforcement channel
- **Critical Failures**: Escalate immediately to Project Sponsor

---

*Built with ☕ and 🚀 by LightSpeedWP QA & Governance Teams*
