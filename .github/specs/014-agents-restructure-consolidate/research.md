# Technical Research & Decisions: Agent Structure Standardization & Skill Consolidation

**Date**: 2026-09-18 (Enhanced with Clarifications) | **Phase**: 0 Research | **Status**: Complete

**Input**: Clarified feature specification (spec.md) with 5 resolved critical gaps

---

## Decision 1: Agent Folder Structure Template

**Decision**: Every agent MUST contain 7 standardized components:

1. `AGENT.md` - Agent definition file
2. `CHANGELOG.md` - Version history and changes
3. `package.json` - Node.js dependencies
4. `README.md` - Human-readable documentation
5. `skills/` - Subfolder for agent-specific skills
6. `tests/` - Subfolder for test files
7. `config/` - Subfolder for configuration files

**Rationale**: Standardized structure enables automated tooling; each agent self-contained; package.json provides dependency declaration standard; reduces onboarding overhead.

**Alternatives Considered**:

- Option A (Minimal, 5 items) - *Rejected*: Missing CHANGELOG.md and package.json
- Option C (Comprehensive, 11 items) - *Rejected*: Excessive for MVP

**Implementation Impact**: Task T016 validates all 7 components; T008 documents template.

---

## Decision 2: Skills Naming Convention & Organization

**Decision**: All skills follow `{category}/{scope}-{title}` where category is a categorical subfolder.

**Examples**:

- `skills/validation/broken-refs-finder`
- `skills/audit/structure-checker`
- `skills/reporting/audit-report-builder`

**Rationale**: Mirrors branch naming for consistency; categorical organization groups related skills; enables hierarchical discovery; improves deduplication accuracy.

**Alternatives Considered**:

- Flat structure - *Rejected*: 1000+ skills unnavigable
- Alphabetical subfolders - *Rejected*: Doesn't reflect functional organization

**Implementation Impact**: Task T003 creates category subfolders; T015 respects boundaries; T013 preserves structure.

---

## Decision 3: Testing Framework Selection (Context-Dependent)

**Decision**: Framework chosen per agent type:

- **JavaScript agents/skills**: Jest with `__tests__/` convention
- **Shell scripts**: Bats with `tests/` convention
- **UI agents**: Playwright with `tests/e2e/` convention

**Rationale**: Uses best tool per context; Jest standard for Node.js; Bats for shell; Playwright for browser automation.

**Alternatives Considered**:

- Single framework for all - *Rejected*: Mismatched tooling fit

**Implementation Impact**: Task T016 validates tests/ folder matches agent type; Phase 2 enforces 80% coverage.

---

## Decision 4: Skills Registry Format & Generation

**Decision**: JSON registries auto-generated from filesystem:

- Per-agent: `agents/{agent}/registry.json`
- Consolidated: `skills/registry.json`
- Triggers: On-demand CLI; integrable with pre-commit hooks/CI

**Rationale**: JSON machine-parseable for JavaScript; auto-generation prevents drift; on-demand allows validation.

**Alternatives Considered**:

- YAML - *Rejected*: Less suitable for JavaScript parsing
- Manual maintenance - *Rejected*: High drift risk

**Implementation Impact**: Task T013 generates registry; T014 validates schema; T017 provides CLI command.

---

## Decision 5: Agent Standardization Scope

**Decision**: Phase 1 = Audit & plan; Phase 2 = Execute restructuring.

**Rationale**: Audit-first safety principle; Phase 1 stays on timeline; Phase 2 focused on execution.

**Implementation Impact**: Task T016 documents conformance; T008 documents template and remediation.

---

## Decision 6: Deferred Scope (Phase 2 Specifications)

**Explicitly deferred**:

1. Linting Phase - ESLint, PHPCS, Prettier gates
2. Test Creation & Validation Phase - 80% coverage enforcement
3. Comprehensive Documentation Phase - Extended docs
4. Plugin Creation (User Story 8) - Claude & Copilot plugins
5. SpecKit Integration (User Story 9) - Speckit skills for agent/skill creation

**Rationale**: Keeps Phase 1 scope tight (30 days); prevents timeline creep; allows stabilization before quality gates.

---

## Status

✅ **Phase 0 Research Complete** — All 6 technical decisions documented, consistent with spec and clarifications. Ready for Phase 1 Design (data-model.md, contracts/, quickstart.md).
