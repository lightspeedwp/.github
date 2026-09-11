# Branch Context Mapping Reference

**Status**: Design Phase (T008 - Phase 2 Foundational)  
**Purpose**: Define branch-type-specific review guidance for CodeRabbit configuration  
**Scope**: Top 15-20 branch types by organizational usage frequency  
**Coverage**: ~80% of actual organizational branch usage patterns

---

## Executive Summary

Branch-type-specific review context allows CodeRabbit to provide targeted, relevant guidance adapted to the nature of each change. This document maps each of the top 15-20 branch types to:

1. **Review focus areas**: What reviewers should prioritize for this change type
2. **Critical checks**: Non-negotiable validation points
3. **Technology-agnostic guidance**: Universal principles (not framework-specific)
4. **Implementation priorities**: Which checks matter most for this branch type

---

## Top 15 Branch Types (High Frequency)

### 1. `feat/*` — Feature Development

**Review Focus Areas:**
- Feature completeness: Does implementation match acceptance criteria?
- UX/API design: Are new interfaces intuitive and well-documented?
- Backwards compatibility: Are existing APIs/functionality preserved?

**Critical Checks:**
- [ ] Acceptance criteria are fully met and demonstrated
- [ ] No breaking changes to public APIs or contracts
- [ ] Accessibility (WCAG 2.2 AA) verified for all UI changes
- [ ] Performance implications assessed and acceptable
- [ ] Tests demonstrate feature behavior and edge cases

**Technology-Agnostic Guidance:**
- Validate that the feature is complete, not partial or draft
- Ensure new functionality doesn't break existing workflows
- Check that error cases are handled gracefully
- Confirm documentation explains how to use the feature

---

### 2. `fix/*` — Bug Fix

**Review Focus Areas:**
- Root cause: Is the underlying issue being fixed, not just symptoms?
- Regression prevention: Are tests added to prevent re-occurrence?
- Edge cases: Are boundary conditions properly handled?

**Critical Checks:**
- [ ] Root cause identified and documented
- [ ] Fix addresses the underlying problem, not just symptoms
- [ ] Regression test added to prevent future re-occurrence
- [ ] Edge cases considered and handled
- [ ] No new bugs or technical debt introduced

**Technology-Agnostic Guidance:**
- Ensure the fix actually solves the reported problem
- Verify edge cases are covered in tests
- Check that fix doesn't break other functionality
- Confirm error messages are helpful to users

---

### 3. `hotfix/*` — Critical Production Fix

**Review Focus Areas:**
- Critical impact: Does this fix address a production-blocking issue?
- Rollback readiness: Can this be safely reverted if needed?
- Security: Are security implications considered?

**Critical Checks:**
- [ ] Issue is genuinely critical/production-blocking
- [ ] Fix is minimal and targeted (reduces rollback risk)
- [ ] Rollback procedure documented
- [ ] Security implications assessed
- [ ] No wide-ranging refactoring included

**Technology-Agnostic Guidance:**
- Ensure fix is as small and focused as possible
- Verify rollback is safe and documented
- Check that this doesn't introduce unrelated changes
- Confirm monitoring/alerting is in place for re-detection

---

### 4. `release/*` — Release Management

**Review Focus Areas:**
- Versioning: Are version changes correct per semver?
- Changelog: Are user-facing changes documented?
- Deployment: Is release checklist complete?

**Critical Checks:**
- [ ] Version number correct (semantic versioning)
- [ ] Changelog entries match actual changes
- [ ] Deployment checklist completed
- [ ] No breaking changes without major version bump
- [ ] Release notes are clear for users

**Technology-Agnostic Guidance:**
- Validate that version numbers follow semantic versioning
- Ensure changelog accurately reflects user-facing changes
- Check that deployment steps are documented
- Confirm rollback procedure is tested

---

### 5. `refactor/*` — Code Refactoring

**Review Focus Areas:**
- Maintainability: Does refactoring improve code clarity?
- Behavior preservation: Does refactoring change any functionality?
- Test coverage: Are all code paths tested?

**Critical Checks:**
- [ ] No behavior change (refactoring only, no features)
- [ ] Code is objectively more maintainable
- [ ] Test coverage maintained or improved
- [ ] Performance not negatively impacted
- [ ] Documentation updated if APIs changed

**Technology-Agnostic Guidance:**
- Verify refactoring doesn't change user-visible behavior
- Ensure code is actually more readable/maintainable
- Check that tests still pass and cover refactored code
- Confirm no performance regressions introduced

---

### 6. `chore/*` — Maintenance & Housekeeping

**Review Focus Areas:**
- Dependency security: Are dependencies up-to-date and secure?
- Automation: Does automation improve workflows?
- Clean-up: Is clean-up safe and complete?

**Critical Checks:**
- [ ] Dependencies updated securely (no breaking versions)
- [ ] Automation logic is correct and tested
- [ ] No removal of used code/configuration
- [ ] Scripts and tools remain functional

**Technology-Agnostic Guidance:**
- Verify dependency updates don't break functionality
- Check that automation handles error cases
- Ensure clean-up doesn't remove necessary code
- Confirm all scripts and tools still work

---

### 7. `task/*` — Scoped Unit of Work

**Review Focus Areas:**
- Scope clarity: Is the task scope well-defined?
- Completeness: Are all acceptance criteria met?
- Dependencies: Are task dependencies documented?

**Critical Checks:**
- [ ] Task scope is clear and achievable
- [ ] All acceptance criteria met
- [ ] Dependencies on other work documented
- [ ] No scope creep beyond original task
- [ ] Subtasks completed as planned

**Technology-Agnostic Guidance:**
- Verify task scope matches original definition
- Check that all acceptance criteria are satisfied
- Ensure dependent work is identified
- Confirm no unplanned work was added

---

### 8. `docs/*` — Documentation

**Review Focus Areas:**
- Clarity: Is documentation easy to understand?
- Completeness: Are all necessary topics covered?
- WCAG AA compliance: Are docs accessible?

**Critical Checks:**
- [ ] Documentation is clear and concise
- [ ] All required sections present
- [ ] Examples are accurate and helpful
- [ ] Accessibility (WCAG 2.2 AA) verified
- [ ] Links and references are correct

**Technology-Agnostic Guidance:**
- Ensure documentation matches current implementation
- Verify examples are accurate and runnable
- Check that navigation and structure make sense
- Confirm no outdated information remains

---

### 9. `test/*` — Test Coverage & Infrastructure

**Review Focus Areas:**
- Coverage: Do tests cover critical code paths?
- Isolation: Are tests independent and repeatable?
- Clarity: Are test names descriptive?

**Critical Checks:**
- [ ] Tests cover critical user flows
- [ ] Tests are isolated (no external dependencies)
- [ ] Test names are descriptive
- [ ] Tests are reproducible and reliable
- [ ] Coverage not negatively impacted

**Technology-Agnostic Guidance:**
- Verify tests actually test the code being changed
- Ensure tests are independent and can run in any order
- Check that test output is clear and diagnostic
- Confirm tests are deterministic (not flaky)

---

### 10. `perf/*` — Performance Optimization

**Review Focus Areas:**
- Benchmarks: Are performance improvements measured?
- Metrics: Are improvements quantified with actual data?
- Trade-offs: Are performance trade-offs documented?

**Critical Checks:**
- [ ] Performance improvement measured and documented
- [ ] Benchmark methodology is valid
- [ ] Trade-offs (if any) are acceptable
- [ ] Optimization works across all target platforms
- [ ] No functionality compromised for performance

**Technology-Agnostic Guidance:**
- Verify performance improvement is actually measured
- Check that benchmarks are repeatable and fair
- Ensure optimization doesn't break functionality
- Confirm trade-offs are acceptable to users

---

### 11. `ci/*` — CI/CD & Automation

**Review Focus Areas:**
- Job definition: Are job steps clear and logical?
- Secret handling: Are secrets handled securely?
- Status checks: Are required checks properly configured?

**Critical Checks:**
- [ ] Workflow steps are clear and documented
- [ ] Secrets are not logged or exposed
- [ ] Environment variables are properly scoped
- [ ] Job dependencies are correct
- [ ] Status checks are appropriate

**Technology-Agnostic Guidance:**
- Verify workflow logic is correct and testable
- Ensure no secrets appear in logs or outputs
- Check that jobs have proper error handling
- Confirm status checks reflect code quality

---

### 12. `security/*` — Security Fixes

**Review Focus Areas:**
- Vulnerability: Is the vulnerability properly classified?
- Mitigation: Does the fix prevent exploitation?
- Disclosure: Is disclosure timeline correct?

**Critical Checks:**
- [ ] Vulnerability severity properly assessed
- [ ] Fix prevents exploitation
- [ ] No workarounds that reduce fix effectiveness
- [ ] Disclosure timeline followed
- [ ] No security debt introduced

**Technology-Agnostic Guidance:**
- Verify vulnerability is actually fixed, not just mitigated
- Ensure fix doesn't introduce new vulnerabilities
- Check that authentication/authorization is correct
- Confirm no sensitive data is exposed

---

### 13. `design/*` — Design System & UI

**Review Focus Areas:**
- Consistency: Are components consistent with design system?
- Reusability: Are components reusable across projects?
- Accessibility: Do all components meet WCAG 2.2 AA?

**Critical Checks:**
- [ ] Components follow design system guidelines
- [ ] Reusable across multiple contexts
- [ ] Accessibility (WCAG 2.2 AA) verified
- [ ] Component documentation clear
- [ ] Token usage consistent

**Technology-Agnostic Guidance:**
- Verify components match design system specifications
- Check that components are flexible and composable
- Ensure all interactive elements are keyboard accessible
- Confirm color contrast meets accessibility standards

---

### 14. `a11y/*` — Accessibility Improvements

**Review Focus Areas:**
- WCAG 2.2 AA: Are all WCAG 2.2 AA criteria met?
- Keyboard support: Can all features be used via keyboard?
- Screen reader: Is content properly announced?

**Critical Checks:**
- [ ] WCAG 2.2 AA compliance verified
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets minimum requirements
- [ ] Focus indicators are visible

**Technology-Agnostic Guidance:**
- Test with actual assistive technology if possible
- Verify keyboard navigation covers all functionality
- Ensure focus order is logical and visible
- Check that dynamic content updates are announced

---

### 15. `ops/*` — Operations & Infrastructure

**Review Focus Areas:**
- Infrastructure: Is infrastructure change safe and reversible?
- Deployment: Is deployment procedure documented?
- Monitoring: Is impact monitoring in place?

**Critical Checks:**
- [ ] Infrastructure changes are safe and reversible
- [ ] Deployment procedure is documented
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure tested
- [ ] Dependencies are documented

**Technology-Agnostic Guidance:**
- Verify infrastructure change doesn't break service
- Ensure rollback can be performed safely
- Check that monitoring will detect failures
- Confirm change is idempotent if repeated

---

## Additional 5+ Branch Types (Lower Frequency)

These branch types are present but less frequent. Review guidance should follow the same pattern as above.

### 16. `build/*` — Build System

- Focus: Build integrity, artifact management, optimization
- Critical: Build artifacts are consistent, performance not degraded

### 17. `deps/*` — Dependency Updates

- Focus: Compatibility, security audit, breaking changes
- Critical: Dependencies are secure, no breaking changes introduced

### 18. `api/*` — API Changes

- Focus: Versioning, backwards compatibility, contract clarity
- Critical: API contracts documented, backwards compatibility maintained

### 19. `schema/*` — Data Schema

- Focus: Migration safety, rollback procedures, constraint validation
- Critical: Schema migrations are safe, rollback is possible

### 20. `migrate/*` — Data Migrations

- Focus: Safety, rollback, data integrity
- Critical: Migration is safe, data is not lost, rollback is possible

---

## Implementation Notes

### Pattern Matching

Each branch type is identified by prefix: `{type}/` (e.g., `feat/`, `fix/`, `hotfix/`).

**CodeRabbit Integration (Future):**
```yaml
branch_context:
  - pattern: "feat/*"
    review_focus: [completeness, ux-api-design, backwards-compatibility]
    critical_checks: [acceptance-criteria, no-breaking-changes, a11y-wcag2.2-aa]
  # ... additional branch types
```

### Technology-Agnosticism

All guidance is **universal principles** that apply across:
- WordPress (PHP) projects
- Node.js/TypeScript projects
- Infrastructure-as-Code projects
- MCP and AI operations assets

No framework-specific, language-specific, or tool-specific details.

### Coverage Target

- **Top 15 types**: ~70% of organizational branch usage
- **Top 20 types**: ~80% of organizational branch usage
- **Remaining 14+ types**: Specialized, lower frequency

This prioritization balances coverage with maintainability.

---

## Related Documentation

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Complete branch naming rules (30+ types)
- [.coderabbit.yml](./.coderabbit.yml) — CodeRabbit configuration (path patterns + branch context schema)
- [CODERABBIT_COVERAGE_AUDIT.md](./CODERABBIT_COVERAGE_AUDIT.md) — Coverage audit guide (future)

---

**Version**: 1.0  
**Created**: 2026-09-11  
**Last Updated**: 2026-09-11  
**Status**: Design Complete (T008)
