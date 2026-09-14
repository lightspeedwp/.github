# Research Phase: Branch Naming & PR Strategy

**Created**: 2026-09-12 | **Status**: Phase 0 Complete

## Research Resolved

### Q1: Branch Type System Design
**Decision**: 24 authorized types with 6 categories (Feature/Maintenance, Release, Code Quality, Accessibility, Configuration, Specialty)

**Rationale**: Balances specificity (developers know which type applies) with simplicity (<50 types = easier to remember). 24 types cover 95%+ of real-world use cases.

**Types**: `feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `task`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `audit`, `codex`, `research`, `revert`

### Q2: Forbidden Prefix Enforcement
**Decision**: Absolute ban on `claude/`, `copilot/`, `openai/` prefixes

**Rationale**: These prefixes are reserved for integrations and internal tools. Enforcing absolute ban prevents conflicts and automation breakage.

### Q3: PR Template Routing Strategy
**Decision**: Map 24 types to 19 PR templates using type→template mapping

**Mapping Examples**:
- `feat/`, `chore/`, `task/` → `pr_feature.md`
- `fix/`, `hotfix/` → `pr_bugfix.md`  
- `docs/`, `refactor/` → `pr_maintenance.md`
- `security/` → `pr_security.md`
- `perf/`, `build/`, `ci/`, `deps/` → `pr_technical.md`

### Q4: Validation Timing
**Decision**: Pre-push validation (optional hook) + PR-time validation (mandatory CI)

**Rationale**: Pre-push catches errors immediately; PR validation provides safety net for teams without hooks installed.

### Q5: Compliance Metrics
**Decision**: Daily automated metrics; track compliance % by type and by team member

**Rationale**: Enables trend analysis; identifies patterns; supports targeted coaching.

## Phase 0 Complete

All research questions resolved. Ready for Phase 1 (Design & Contracts).
