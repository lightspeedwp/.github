---
file_type: "prompt"
title: "Refactoring Prompt Template"
description: "Code refactoring, optimisation, and modernisation workflows"
version: "1.0.0"
last_updated: "2026-05-31"
owners: ["ashley@lightspeedwp.agency"]
tags: ["refactoring", "optimization", "prompts"]
status: "active"
stability: "stable"
domain: "tooling"
---

# Refactoring Prompt Template

Use this prompt when planning code refactoring, optimisation, or modernisation.

## Context

**Project:** [Project Name]
**Module/Feature:** [What's being refactored]
**Current State:** [Link to relevant code files]
**Motivation:** [Why refactor now? Technical debt, performance, maintainability?]

### Current Implementation

**What Works:**
- [Current functionality that must be preserved]
- [Performance characteristics]
- [Known limitations]

**What Needs Improvement:**
- [Code quality issues]
- [Performance bottlenecks]
- [Maintainability concerns]
- [Security or compatibility issues]

### Dependencies & Impact

- **Used By:** [Which modules/features depend on this code]
- **Integration Points:** [How this code connects to other systems]
- **Breaking Change?:** [Will refactor require API changes?]

---

## Refactoring Goals

### Primary Objective

[Clear statement of what the refactoring should achieve]

### Specific Improvements

1. **Code Quality:** [What quality issues to address]
2. **Performance:** [What optimisations to pursue]
3. **Maintainability:** [How to make code easier to understand/modify]
4. **Testing:** [Increase test coverage or improve test quality]

### Success Metrics

- [ ] Code complexity score reduced from [X] to [Y]
- [ ] Performance metric improves by [X%]
- [ ] Test coverage increases to [X%]
- [ ] Lines of code reduced from [X] to [Y]
- [ ] Maintainability improved (specify how)

---

## Refactoring Scope

### In Scope

- [Files/modules to refactor]
- [Patterns/approaches to modernise]
- [Tests to rewrite or improve]

### Out of Scope

- [Features to preserve as-is]
- [Related systems that stay unchanged]
- [Planned future improvements (defer to next phase)]

---

## Technical Approach

### Strategy

[How will the refactoring be approached? Rewrite? Incremental? etc.]

### Key Changes

1. **Change 1:** [What's changing and why]
   - Old approach: [Current pattern]
   - New approach: [Proposed pattern]
   - Benefit: [Why this is better]

2. **Change 2:** [What's changing and why]
   - Old approach: [Current pattern]
   - New approach: [Proposed pattern]
   - Benefit: [Why this is better]

### Compatibility & Migration

- **Breaking Changes?:** [Will this break existing code using this module?]
- **Migration Path:** [How will dependent code be updated?]
- **Backwards Compatibility:** [Need to support old API? For how long?]

---

## Testing & Validation

### Regression Testing

- Existing test suite passes: [Yes / No / Partial]
- New tests required: [List new test scenarios]
- Manual testing needed: [What to test manually?]

### Performance Validation

- Benchmark before/after: [How to measure impact]
- Performance acceptance: [What's acceptable improvement/regression?]
- Load testing: [Required? At what scale?]

### Code Review Checklist

- [ ] Code follows project standards
- [ ] No new technical debt introduced
- [ ] Tests cover new implementation
- [ ] Documentation updated
- [ ] Performance impact validated

---

## Acceptance Criteria

Refactoring is complete when:

- [ ] All functionality preserved and tested
- [ ] Code quality metrics improved
- [ ] Performance targets met (if applicable)
- [ ] Test coverage meets threshold ([X]%)
- [ ] All existing tests pass
- [ ] Code review approved
- [ ] Deployed and monitored

---

## Risk Mitigation

### Potential Risks

1. **Risk:** [What could go wrong?]
   - **Mitigation:** [How to prevent or minimize impact]
   - **Rollback Plan:** [How to revert if needed]

2. **Risk:** [What could go wrong?]
   - **Mitigation:** [How to prevent or minimize impact]
   - **Rollback Plan:** [How to revert if needed]

### Monitoring & Rollback

- **Monitoring After Deploy:** [What metrics to watch?]
- **Alert Thresholds:** [When to trigger rollback?]
- **Rollback Procedure:** [Steps to revert if issues appear]

---

## References

- **Current Implementation:** [Link to code being refactored]
- **Standards/Patterns:** [Link to architectural or coding pattern docs]
- **Performance Baseline:** [Link to performance metrics/benchmarks]
- **Similar Refactors:** [Links to related refactoring PRs for reference]
- **Issue/Epic:** [Link to tracking issue if applicable]

---

## Additional Notes

- [Phase of the project: can it wait or is it urgent?]
- [Dependencies on other work or changes]
- [Knowledge required or domain experts to consult]
- [Estimated effort and timeline]
