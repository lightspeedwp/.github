---
title: Phase 2C Implementation Plan
description: CI/CD integration, pre-commit hooks, extended testing for Meta Agent v2.0
file_type: documentation
status: in-progress
date: 2026-08-19
---

# Meta Agent v2.0 — Phase 2C Implementation Plan

## Overview

Phase 2C focuses on integrating Meta Agent v2.0 into development workflows through CI/CD automation, pre-commit hooks, and comprehensive testing across real repository scenarios.

**Timeline:** 2026-08-19 to 2026-08-23 (5 days)  
**Success Target:** 15+ integration tests, CI workflows validated, pre-commit hooks functional  
**Team:** Ash Shaw (@ashshaw)  

## Phase 2C Deliverables

### 1. CI/CD Workflow Integration 📦

**GitHub Actions Workflow:** `.github/workflows/meta-agent-validation.yml`

**Features:**
- ✅ Trigger on: PR open/update, commits to `.github/agents/meta-agent/`
- ✅ Run full test suite (jest with coverage reporting)
- ✅ Validate frontmatter on all Markdown files in changed files
- ✅ Schema validation against repo-type schemas
- ✅ Report validation errors as PR comments
- ✅ Enforce passing tests before merge (required status check)

**Steps:**
1. Checkout code
2. Setup Node.js & install dependencies
3. Run meta-agent tests (all 96 tests from Phase 2B)
4. Run frontmatter validation on changed Markdown files
5. Generate coverage report
6. Report results (pass/fail with details)

**Acceptance Criteria:**
- ✅ Workflow triggers correctly on PR changes
- ✅ All tests pass in CI environment
- ✅ Coverage report generated and visible
- ✅ PR validation runs automatically

### 2. Pre-commit Hooks 🔧

**Hook Script:** `hooks/meta-agent-validate.sh`

**Features:**
- ✅ Validates staged Markdown files before commit
- ✅ Checks frontmatter against schemas
- ✅ Reports issues and suggests fixes
- ✅ Can be skipped with `--no-verify` for emergency commits
- ✅ Fast (only checks changed files)

**Validations:**
- Frontmatter present and valid YAML
- Required fields for repo type
- UK English consistency
- Metadata completeness

**Installation:**
```bash
cp hooks/meta-agent-validate.sh .husky/meta-agent-validate.sh
chmod +x .husky/meta-agent-validate.sh
# Automatically invoked before commits
```

**Acceptance Criteria:**
- ✅ Hook blocks commits with invalid frontmatter
- ✅ Suggests fixes in error message
- ✅ Can be bypassed with --no-verify
- ✅ Performance acceptable (<2s for typical PR)

### 3. Extended Integration Tests 🧪

**New Tests:** `__tests__/integration/ci-workflows.test.js` (10+ tests)

**Scenarios:**
1. **Multi-file Updates** — Apply standards to 5+ files in one workflow
2. **Badge Injection** — Inject badges into multiple repo types
3. **Conflict Handling** — Handle existing badges/footers correctly
4. **Large Files** — Process 10K+ line Markdown files
5. **Special Characters** — Handle Unicode, emojis, special syntax
6. **Concurrent Operations** — Simulate multiple skills running
7. **Error Recovery** — Test error handling and rollback
8. **Performance Benchmarks** — Measure speed on various file sizes
9. **Real Repo Scenarios** — Test against actual LightSpeedWP repos
10. **Edge Cases** — Malformed files, missing metadata, etc.

**Coverage Target:**
- ✅ 15+ new integration tests
- ✅ All repo types covered (block-plugin, block-theme, control-plane)
- ✅ Edge cases and error scenarios
- ✅ >95% coverage of Phase 2B skills

**Test Execution:**
```bash
npm test -- agents/meta-agent/__tests__/integration/ci-workflows.test.js
# Expected: 15+ tests passing in <10s
```

### 4. Documentation 📚

#### 4.1 IMPLEMENTATION_GUIDE.md
**Purpose:** Help other projects use Meta Agent v2.0

**Sections:**
- Quick start (5 min setup)
- Integration options (CLI, programmatic, GitHub Actions)
- Configuration options
- Common patterns and best practices
- Troubleshooting guide
- FAQ with real examples

**Length:** 1,500+ lines
**Target Audience:** Developers integrating Meta Agent into their workflows

#### 4.2 TROUBLESHOOTING.md
**Purpose:** Common issues and solutions

**Sections:**
- Frontmatter validation failures (5+ common cases)
- Badge injection errors
- UK English corrections (when they fail)
- Pre-commit hook issues
- CI workflow troubleshooting
- Performance issues
- Contact support section

**Length:** 800+ lines
**Includes:** Real error examples, step-by-step fixes

#### 4.3 SCHEMA_REFERENCE.md
**Purpose:** Complete field documentation

**Sections:**
- Field listing for each repo type
- Required vs optional fields
- Validation rules
- Type specifications
- Examples for each field
- Migration guide (if schema changes)

**Length:** 600+ lines
**Format:** Organized by repo type with tables

### 5. CI/CD Validation 🔐

**Validation Script:** `scripts/validation/validate-meta-agent-workflow.js`

**Checks:**
- ✅ Workflow file syntax
- ✅ All required jobs present
- ✅ Proper permissions/access
- ✅ Correct triggers
- ✅ Status checks configured

**Execution:**
```bash
npm run validate:meta-agent-workflow
# Expected output: All checks pass
```

## Implementation Timeline

| Day | Task | Status |
|-----|------|--------|
| **Aug 19 (Today)** | Phase 2C planning, GitHub Actions workflow | 🟡 In Progress |
| **Aug 20** | Pre-commit hooks, extended tests (5+) | ⏳ Ready |
| **Aug 21** | Extended tests (10+), performance benchmarks | ⏳ Ready |
| **Aug 22** | Documentation (guides, troubleshooting) | ⏳ Ready |
| **Aug 23** | Final testing, validation, merge to develop | ⏳ Ready |

## Success Criteria

### ✅ Functional Requirements
- [ ] GitHub Actions workflow runs on all PRs
- [ ] Pre-commit hook validates frontmatter
- [ ] 15+ integration tests passing
- [ ] All tests run in <10 seconds
- [ ] Coverage >95% of Phase 2B code
- [ ] Documentation complete and accurate

### ✅ Quality Requirements
- [ ] No external dependencies added
- [ ] Error messages helpful and actionable
- [ ] Performance acceptable (<5s per operation)
- [ ] Cross-platform compatible (Mac, Linux, CI)
- [ ] Backwards compatible with Phase 2B

### ✅ Integration Requirements
- [ ] Works with existing LightSpeedWP workflows
- [ ] No conflicts with other hooks/validations
- [ ] Can be disabled/customized per repo
- [ ] Documented integration patterns

## File Structure

```
agents/meta-agent/
├── PHASE-2C-PLAN.md                (this file)
├── PHASE-2C-COMPLETION.md          (completion summary, at end)
├── scripts/
│   ├── hooks/
│   │   └── meta-agent-validate.sh  (pre-commit hook)
│   └── validation/
│       └── validate-meta-agent-workflow.js
├── .github/
│   └── workflows/
│       └── meta-agent-validation.yml (CI workflow)
├── __tests__/
│   └── integration/
│       └── ci-workflows.test.js    (10+ new tests)
├── docs/
│   ├── IMPLEMENTATION_GUIDE.md     (1,500+ lines)
│   ├── TROUBLESHOOTING.md          (800+ lines)
│   └── SCHEMA_REFERENCE.md         (600+ lines)
└── [existing files from Phase 2B]
```

## Notes

- **Dependencies:** No new external dependencies
- **Breaking Changes:** None (fully backwards compatible)
- **Migration Path:** Existing skills work as-is, integration optional
- **Support:** Full documentation and troubleshooting guides included

## Next Steps (Phase 2D)

After Phase 2C completion:
1. v1.0.0 release with full changelog
2. Team training materials and workshops
3. Organisation-wide adoption rollout
4. Monitoring, feedback collection, iterative improvements

---

**Status:** Phase 2C Implementation Plan Created ✅  
**Started:** 2026-08-19 01:06  
**Target Completion:** 2026-08-23 23:59
