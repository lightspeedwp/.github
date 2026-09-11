# Phase 1 Quickstart: Validation Scenarios

**Date**: 2026-09-11 | **Purpose**: Validate feature completeness end-to-end

---

## Overview

This document outlines runnable validation scenarios that prove the CodeRabbit configuration improvements work as intended. Use these to verify implementation during Phase 2 (task execution).

---

## Validation Checklist

Before marking implementation complete, test all scenarios below.

### Scenario 1: Branch-Type-Specific Review Guidance

**Test Case**: Create PR from `security/*` branch modifying PHP files

**Setup**:
1. Create branch: `git checkout -b security/authentication-validation`
2. Modify file: `.github/agents/security-check.agent.php` (add authentication validation logic)
3. Create PR with this branch

**Expected Outcome**:
- CodeRabbit review includes security-specific guidance
- Review emphasizes:
  - Authentication mechanisms
  - Access control validation
  - Secrets handling
  - Threat model considerations
- Generic PHP guidance is secondary to security context

**Validation**: ✅ Security context applied (indicates branch-type awareness working)

---

### Scenario 2: Pattern Priority Ordering

**Test Case**: File matching multiple patterns uses highest-priority match

**Setup**:
1. Modify file: `tests/e2e/auth.spec.ts`
2. This file matches multiple patterns:
   - `**/*.ts` (general TypeScript, priority 40)
   - `**/e2e/*.ts` (specific e2e tests, priority 80)
   - `**/tests/*.*` (general tests, priority 50)

**Expected Outcome**:
- CodeRabbit uses guidance from `**/e2e/*.ts` (highest priority)
- Review includes e2e-specific guidance:
  - Browser/environment setup
  - Full Site Editing (FSE) functionality
  - Reliability & flakiness concerns
- Does NOT use generic TypeScript guidance as primary focus

**Validation**: ✅ Highest-priority pattern used; no ambiguity or cascading

---

### Scenario 3: New File Type Coverage (SpecKit)

**Test Case**: Create PR modifying SpecKit specification files

**Setup**:
1. Modify file: `specs/001-feature/spec.md`
2. Make changes to Requirements section

**Expected Outcome**:
- CodeRabbit review includes SpecKit-specific guidance
- Review focuses on:
  - Specification completeness
  - Requirement testability
  - Success criteria measurability
  - Clarity and precision

**Validation**: ✅ SpecKit path instruction added and applied

---

### Scenario 4: New File Type Coverage (Workflow Documentation)

**Test Case**: Create PR modifying workflow documentation

**Setup**:
1. Modify file: `workflows/governance-audit-workflow.md` (agentic workflow doc)
2. Update workflow steps and phase descriptions

**Expected Outcome**:
- CodeRabbit review includes workflow-specific guidance
- Review focuses on:
  - Workflow structure and clarity
  - Phase definitions
  - Agent task descriptions
  - Validation criteria

**Validation**: ✅ Workflow path instruction added and applied

---

### Scenario 5: Coverage Audit Completeness

**Test Case**: Run coverage audit against repository

**Setup**:
1. List all file types in repository: `find . -type f -name ".*" | sort | uniq`
2. Cross-reference against `.coderabbit.yml` path_instructions

**Expected Outcome**:
- At least 95% of file types have explicit instructions
- Identified gaps: <5% of repository files
- External audit guide (`CODERABBIT_COVERAGE_AUDIT.md`) available for maintainers

**Validation**: ✅ Coverage ≥ 95%; audit guide exists

---

### Scenario 6: Instruction Block Quality

**Test Case**: Verify all instruction blocks meet quality standards

**Setup**:
1. Extract all instruction blocks from `.coderabbit.yml`
2. Check each block for minimum requirements

**Expected Outcome**:
- Each block has 3+ specific review focus areas
- No vague adjectives (e.g., "clean", "efficient") without metrics
- Each block references relevant documentation (CLAUDE.md, AGENTS.md, standards)
- UK English spelling throughout
- No implementation details (frameworks, languages) in tech-agnostic review guidance

**Validation**: ✅ All blocks meet quality standards

---

### Scenario 7: Backward Compatibility

**Test Case**: Existing PRs continue to work without behavior change

**Setup**:
1. Identify 5 recent merged PRs
2. Re-run CodeRabbit review on them using new config

**Expected Outcome**:
- CodeRabbit review produces similar feedback (same focus areas)
- New branch-context guidance is additive, not disruptive
- No changes to review severity or tone for existing path patterns
- Existing approved PRs would still pass review

**Validation**: ✅ No breaking changes; backward compatible

---

### Scenario 8: Branch Type Context for 5 High-Value Types

**Test Case**: Create PRs from different branch types, verify context awareness

**Branches to Test**: `feat/`, `fix/`, `security/`, `perf/`, `a11y/`

**Setup**:
1. Create PR from each branch type
2. Modify a common file type (e.g., `**/*.php`) in each PR
3. Compare reviews across branches

**Expected Outcome**:
- `feat/` PR: Focus on new functionality, design, scope
- `fix/` PR: Focus on bug reproduction, regression testing
- `security/` PR: Focus on security properties, threat model
- `perf/` PR: Focus on performance metrics, benchmarks
- `a11y/` PR: Focus on WCAG compliance, accessibility criteria

**Validation**: ✅ Context-specific guidance applied for all 5 branch types

---

### Scenario 9: External Audit Guide Usability

**Test Case**: New maintainer uses audit guide to verify config completeness

**Setup**:
1. Provide `CODERABBIT_COVERAGE_AUDIT.md` to team member
2. Ask them to identify coverage gaps without additional context
3. Measure time to completion

**Expected Outcome**:
- Audit guide provides clear, step-by-step instructions
- Maintainer can identify coverage gaps in <15 minutes
- Guide is self-contained (minimal reference to other docs needed)
- Process is repeatable for ongoing maintenance

**Validation**: ✅ Audit guide is usable and efficient

---

### Scenario 10: Pattern Priority Documentation

**Test Case**: Verify pattern priority is clearly documented

**Setup**:
1. Review `.coderabbit.yml` for pattern priority documentation
2. Read config comments explaining priority scheme
3. Try to manually predict which pattern will apply to various files

**Expected Outcome**:
- Pattern priority rules are documented in config comments
- Specificity levels are clearly explained
- Examples show which patterns match various files
- Priority scheme is consistent with data-model.md

**Validation**: ✅ Pattern priority is clearly documented and understandable

---

### Scenario 11: Cross-Technology Stack Compatibility

**Test Case**: Instructions apply consistently across diverse project types (WordPress, Node.js, Infrastructure, MCP)

**Setup**:
1. Create PRs modifying files in at least 3 different repository types:
   - **WordPress project**: Create PR in a block plugin or block theme repo
   - **Node.js/TypeScript project**: Create PR in `ls-flow` or an MCP server repo
   - **Infrastructure project**: Create PR in `lightspeed-hosting-infra` (infrastructure-as-code changes)
2. All PRs should be from the same branch type (e.g., `feat/` for all three)
3. For each PR, trigger CodeRabbit review

**Expected Outcome**:
- All three PRs receive CodeRabbit reviews
- Branch-type context is applied consistently (feat/ guidance is relevant to all three project types)
- File-type guidance does NOT contain technology-specific recommendations (e.g., no "use WordPress hooks" in PHP files, no "use async/await" in TypeScript files)
- Security, performance, accessibility, and quality guidance applies universally
- No instruction blocks reference specific frameworks, languages, or project types

**Validation**: ✅ Instructions are technology-agnostic and apply consistently across all project types

---

## Test Execution Steps

### For Each Scenario:

1. **Setup**: Follow the setup instructions exactly
2. **Execute**: Trigger CodeRabbit review (create PR, request review, or re-run)
3. **Observe**: Read CodeRabbit feedback carefully
4. **Compare**: Check if actual output matches expected outcome
5. **Document**: Record result (✅ Pass or ❌ Fail) with notes
6. **Iterate**: If fail, investigate root cause and adjust config

### Testing Timeline

| Scenario | Effort | Timing |
|----------|--------|--------|
| 1-3 | Create PR + wait for review | 5 min setup + 5 min review |
| 4-5 | Create PR + wait for review | 5 min setup + 5 min review |
| 6 | Config analysis | 10-15 min |
| 7 | Historical PR analysis | 15-20 min |
| 8 | Create 5 PRs + wait | 15 min setup + 20 min reviews |
| 9 | Timed audit guide test | 20-30 min |
| 10 | Documentation review | 10-15 min |
| 11 | Cross-tech PR creation + review | 20 min setup + 15 min reviews (3 repos) |
| **Total** | | **2.5-3 hours** |

---

## Success Criteria

| # | Validation Point | Pass Criteria |
|---|------------------|---------------|
| 1 | Branch-type context | Security guidance appears in security/ PR review |
| 2 | Pattern priority | Highest-priority pattern guidance is primary |
| 3 | SpecKit coverage | spec.md review includes SpecKit-specific guidance |
| 4 | Workflow coverage | workflow documentation review includes workflow guidance |
| 5 | Coverage audit | ≥95% file type coverage identified |
| 6 | Instruction quality | All blocks have 3+ focus areas, no vague language |
| 7 | Backward compatibility | Existing PRs produce similar feedback |
| 8 | Branch type guidance | 5 branch types show distinct context |
| 9 | Audit guide | Usable in <15 min without additional context |
| 10 | Priority docs | Pattern priority clearly explained in config |
| 11 | Cross-tech compatibility | Instructions apply consistently across WordPress, Node.js, and infrastructure projects; no framework-specific guidance |

**Result**: ✅ PASS when 10/11+ validation points succeed

---

## Rollback Plan

If validation fails:

1. **For Branch-Type Issues**: Review branch_context implementation, ensure logic maps branch prefix correctly
2. **For Pattern Priority Issues**: Check pattern sort order, priority numeric values, test pattern matching
3. **For Coverage Issues**: Identify missing file type, add new PathInstruction block, re-audit
4. **For Quality Issues**: Review instruction text, add missing focus areas, remove vague language
5. **For Backward Compatibility**: Compare old vs. new config side-by-side, revert problematic patterns if needed

---

## References

- **Data Model**: See [data-model.md](./data-model.md) for entity definitions
- **Contracts**: See `contracts/` directory for schema specifications
- **Specification**: See [spec.md](./spec.md) for requirements and success criteria
- **Research**: See [research.md](./research.md) for audit findings and recommendations

---

**Readiness for Phase 2**: ✅ YES - Validation scenarios are concrete, testable, and cover all major improvements
