# Branch Type Priority Mapping Reference

**Status**: T012 - Phase 2 Foundational  
**Purpose**: Document the top 15-20 branch types with priority levels and review context  
**Scope**: Organization-wide CodeRabbit configuration  
**Coverage**: ~80% of actual organizational branch usage patterns

---

## Executive Summary

This document maps each of the top 15-20 branch types to:
1. **Usage frequency** (estimated % of organizational branch usage)
2. **Review priority** (how critical/urgent is review for this type)
3. **Review focus areas** (what reviewers should prioritize)
4. **Related documentation** (spec sections, policy references)

---

## Priority-Based Branch Type Mapping

### Tier 1: CRITICAL (Hotfix, Security, Release)

These branch types require **highest priority review** due to production impact or risk.

#### 🔴 hotfix/* — Critical Production Fix
- **Frequency**: 2-3% (low frequency, high impact)
- **Review Priority**: CRITICAL
- **Review Focus Areas**:
  - Issue is genuinely production-blocking
  - Fix is minimal and targeted
  - Rollback is documented and safe
  - Security implications assessed
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#3-hotfix--critical-production-fix)
- **PR Template**: `pr_hotfix.md`
- **Labels Applied**: `priority:critical`, `type:bug`

#### 🔴 security/* — Security Fix
- **Frequency**: 1-2% (critical)
- **Review Priority**: CRITICAL
- **Review Focus Areas**:
  - Vulnerability properly classified
  - Fix prevents actual exploitation
  - No security debt introduced
  - Disclosure timeline correct
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#12-security--security-fixes)
- **PR Template**: `pr_security.md`
- **Labels Applied**: `priority:critical`, `type:security`

#### 🔴 release/* — Release Management
- **Frequency**: 5-8% (regular, high-stakes)
- **Review Priority**: CRITICAL
- **Review Focus Areas**:
  - Version numbers correct (semver)
  - Changelog matches actual changes
  - Deployment checklist completed
  - No breaking changes without major version bump
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#4-release--release-management)
- **PR Template**: `pr_release.md`
- **Labels Applied**: `priority:high`, `type:release`

---

### Tier 2: HIGH (Feature, Fix, Refactor, Perf, CI)

These branch types are **common, with significant code impact**.

#### 🟡 feat/* — Feature Development
- **Frequency**: 30-35% (very common)
- **Review Priority**: HIGH
- **Review Focus Areas**:
  - Feature completeness vs acceptance criteria
  - API/UX design and backwards compatibility
  - Performance and accessibility implications
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#1-feat--feature-development)
- **PR Template**: `pr_feature.md`
- **Labels Applied**: `type:feature`, `priority:normal`

#### 🟡 fix/* — Bug Fix
- **Frequency**: 20-25% (very common)
- **Review Priority**: HIGH
- **Review Focus Areas**:
  - Root cause identified and fixed
  - Regression test added
  - Edge cases handled
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#2-fix--bug-fix)
- **PR Template**: `pr_bug.md`
- **Labels Applied**: `type:bug`, `priority:normal`

#### 🟡 refactor/* — Code Refactoring
- **Frequency**: 8-12% (regular)
- **Review Priority**: HIGH
- **Review Focus Areas**:
  - No behavior change (refactoring only)
  - Code is more maintainable
  - Test coverage maintained/improved
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#5-refactor--code-refactoring)
- **PR Template**: `pr_refactor.md`
- **Labels Applied**: `type:refactor`, `priority:normal`

#### 🟡 perf/* — Performance Optimization
- **Frequency**: 3-5% (regular)
- **Review Priority**: HIGH
- **Review Focus Areas**:
  - Performance improvement measured and documented
  - Benchmark methodology valid
  - No functionality compromised
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#10-perf--performance-optimization)
- **PR Template**: `pr_feature.md`
- **Labels Applied**: `type:performance`, `priority:normal`

#### 🟡 ci/* — CI/CD & Automation
- **Frequency**: 3-5% (regular)
- **Review Priority**: HIGH
- **Review Focus Areas**:
  - Workflow steps clear and documented
  - Secrets not exposed
  - Status checks appropriate
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#11-ci--cicd--automation)
- **PR Template**: `pr_ci.md`
- **Labels Applied**: `type:ci`, `priority:normal`

---

### Tier 3: MEDIUM (Task, Design, A11y, Docs, Test, Ops)

These branch types are **important but often less frequently reviewed**.

#### 🟢 task/* — Scoped Unit of Work
- **Frequency**: 5-10% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Scope matches original definition
  - Acceptance criteria met
  - Dependencies documented
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#7-task--scoped-unit-of-work)
- **PR Template**: `pr_feature.md`
- **Labels Applied**: `type:task`, `priority:normal`

#### 🟢 design/* — Design System & UI
- **Frequency**: 3-5% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Design consistency with system
  - Component reusability
  - Accessibility (WCAG 2.2 AA)
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#13-design--design-system--ui)
- **PR Template**: `pr_design.md`
- **Labels Applied**: `type:design`, `priority:normal`

#### 🟢 a11y/* — Accessibility Improvements
- **Frequency**: 2-4% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - WCAG 2.2 AA compliance verified
  - Keyboard navigation works
  - Screen reader compatibility
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#14-a11y--accessibility-improvements)
- **PR Template**: `pr_a11y.md`
- **Labels Applied**: `type:a11y`, `priority:normal`

#### 🟢 docs/* — Documentation
- **Frequency**: 5-8% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Content clarity and completeness
  - Accessibility (WCAG 2.2 AA)
  - Links and references correct
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#8-docs--documentation)
- **PR Template**: `pr_docs.md`
- **Labels Applied**: `type:docs`, `priority:normal`

#### 🟢 test/* — Test Coverage & Infrastructure
- **Frequency**: 3-5% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Tests cover critical paths
  - Tests are isolated and deterministic
  - Test names are descriptive
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#9-test--test-coverage--infrastructure)
- **PR Template**: `pr_test.md`
- **Labels Applied**: `type:test`, `priority:normal`

#### 🟢 ops/* — Operations & Infrastructure
- **Frequency**: 2-4% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Infrastructure change is safe and reversible
  - Deployment documented
  - Monitoring configured
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#15-ops--operations--infrastructure)
- **PR Template**: `pr_ops.md`
- **Labels Applied**: `area:ops`, `priority:normal`

---

### Tier 4: LOWER FREQUENCY (Chore, Build, Deps, API, Schema, Migrate)

These branch types are **important but less frequent**.

#### 🔵 chore/* — Maintenance & Housekeeping
- **Frequency**: 5-8% (regular)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Dependency updates are secure
  - Automation logic is correct
  - Clean-up is safe and complete
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#6-chore--maintenance--housekeeping)
- **PR Template**: `pr_chore.md`
- **Labels Applied**: `type:chore`, `priority:normal`

#### 🔵 build/* — Build System
- **Frequency**: 2-3% (occasional)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Build integrity maintained
  - Artifacts are consistent
  - Performance not degraded
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#16-build--build-system)
- **PR Template**: `pr_build.md`
- **Labels Applied**: `type:build`, `priority:normal`

#### 🔵 deps/* — Dependency Updates
- **Frequency**: 3-5% (regular, often automated)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - Dependencies are secure
  - No breaking changes introduced
  - Compatibility verified
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#17-deps--dependency-updates)
- **PR Template**: `pr_dep_update.md`
- **Labels Applied**: `type:dependency`, `priority:normal`

#### 🔵 api/* — API Changes
- **Frequency**: 2-4% (occasional)
- **Review Priority**: MEDIUM
- **Review Focus Areas**:
  - API contracts documented
  - Backwards compatibility maintained
  - Versioning strategy clear
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#18-api--api-changes)
- **PR Template**: `pr_api.md`
- **Labels Applied**: `area:api`, `priority:normal`

#### 🔵 schema/* — Data Schema Changes
- **Frequency**: 1-3% (occasional)
- **Review Priority**: HIGH (critical for data integrity)
- **Review Focus Areas**:
  - Migration is safe and reversible
  - Rollback procedure exists
  - Constraint validation correct
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#19-schema--data-schema)
- **PR Template**: `pr_schema.md`
- **Labels Applied**: `area:schema`, `priority:high`

#### 🔵 migrate/* — Data Migrations
- **Frequency**: 1-3% (occasional)
- **Review Priority**: HIGH (critical for data integrity)
- **Review Focus Areas**:
  - Migration is safe and reversible
  - Data integrity maintained
  - Rollback is possible
- **Related Docs**: [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md#20-migrate--data-migrations)
- **PR Template**: `pr_migrate.md`
- **Labels Applied**: `area:migrate`, `priority:high`

---

## Summary Statistics

| Tier | Count | Frequency | Impact | Review Priority |
|------|-------|-----------|--------|-----------------|
| **Critical** (Hotfix, Security, Release) | 3 | 8-13% | Production-blocking | 🔴 CRITICAL |
| **High** (Feat, Fix, Refactor, Perf, CI) | 5 | 64-77% | Core functionality | 🟡 HIGH |
| **Medium** (Task, Design, A11y, Docs, Test, Ops) | 6 | 20-36% | Support functionality | 🟢 MEDIUM |
| **Lower Frequency** (Chore, Build, Deps, API, Schema, Migrate) | 6 | 8-21% | Infrastructure/utility | 🔵 MEDIUM |
| **TOTAL TOP 20** | 20 | ~96% of usage | All categories | Varies by type |

---

## Integration with CodeRabbit Configuration

### Path Filters by Branch Type

Each branch type can be targeted with path-specific rules:

```yaml
# In future implementation:
branch_context:
  - pattern: "feat/*"
    priority: high
    review_focus: ["completeness", "backwards-compatibility", "performance"]
  - pattern: "fix/*"
    priority: high
    review_focus: ["root-cause", "regression-prevention", "edge-cases"]
  # ... continuing for all 20 types
```

### PR Template Selection

Branch type automatically selects corresponding PR template:
- `feat/*` → `pr_feature.md`
- `fix/*` → `pr_bug.md`
- `hotfix/*` → `pr_hotfix.md`
- etc. (see mapping above)

### Label Automation

Branch type triggers automatic labels:
- `feat/*` → `type:feature`
- `fix/*` → `type:bug`
- `security/*` → `priority:critical`
- etc. (see mapping above)

---

## Related Documentation

- [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md) — Detailed review guidance for each type
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Complete branch naming rules (30+ types)
- [.coderabbit.yml](./.coderabbit.yml) — CodeRabbit configuration

---

**Version**: 1.0  
**Created**: 2026-09-11  
**Status**: T012 Complete  
**Coverage**: Top 20 branch types (~96% of organizational usage)
