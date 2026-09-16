# Research Findings: SpecKit Folder Organization Refactoring

**Date**: 2026-09-16 | **Specification**: [013-spec-folder-refactor/spec.md](./spec.md)

## Overview

This document consolidates research findings for the SpecKit folder organization refactoring project. Research addresses audit methodology, catalog design patterns, quality framework application, and maintenance procedure documentation.

## Research Findings

### 1. Specification Catalog Design Pattern

**Research Question**: What is the best practice for organizing a centralized specification catalog in a governance repository?

**Decision**: Single `CATALOG.md` file in `.github/specs/` directory, indexed by specification number (001-013+), with quick navigation and status tracking.

**Rationale**:

- Single source of truth (CATALOG.md) is simpler to maintain than multiple index files
- Numbered indexing mirrors physical directory structure (001-*, 002-*, etc.)
- Single file avoids sync issues between multiple catalogs
- GitHub's native Markdown rendering supports navigation via anchors

**Alternatives Considered**:

- Option A: Individual INDEX.md in each spec directory → Rejected: fragmented, hard to discover all specs at once
- Option B: Wiki-based catalog → Rejected: adds dependency on GitHub Wiki, less portable
- Option C: JSON/YAML catalog with auto-generation → Rejected: extra tooling complexity, manual catalog sufficient for current scale (12 specs)

**Catalog Content Structure**:

```
# Specification Catalog

## Active Specifications (001-013)

| # | Title | Purpose | Status | Created | Link |
|---|-------|---------|--------|---------|------|
| 001 | ... | ... | Draft/Active/Complete | YYYY-MM-DD | [spec/link](#001) |
| 002 | ... | ... | ... | ... | ... |
...
| 013 | SpecKit Folder Organization | Audit & maintenance | Draft | 2026-09-16 | [spec/link](#013) |

## Detailed Entries

### 001 - [Title]
...

### 013 - SpecKit Folder Organization
...
```

**Implementation**: CATALOG.md created in `.github/specs/` with link from CLAUDE.md and README.

---

### 2. Specification Quality Audit Methodology

**Research Question**: How should the 8-dimension quality audit be executed across 12 specifications?

**Decision**: Systematic audit using `/speckit-analyze` framework, one specification per audit pass, generating pass/fail report for each dimension, with specific examples of gaps.

**Rationale**:

- `/speckit-analyze` framework is already defined in the project (Constitution Principle VII)
- One-per-pass allows detailed analysis without overwhelming context
- Systematic approach ensures consistency across all 12 specs
- Examples (line references, quotes) enable actionable remediation

**Audit Dimensions** (from Constitution Principle VII):

1. **Completeness** — All requirements present, user stories complete, edge cases identified
2. **Clarity** — Specific, unambiguous, vague terms quantified
3. **Consistency** — Requirements aligned, terminology consistent, no conflicts
4. **Measurability** — Objective acceptance criteria, metrics defined
5. **Scenario Coverage** — User flows addressed, primary/secondary paths complete
6. **Edge Cases** — Boundary conditions defined, failure modes specified
7. **Dependencies** — Assumptions documented, external dependencies identified
8. **Ambiguities** — No NEEDS CLARIFICATION markers remain, unclear areas surfaced

**Audit Output**:

```
# Quality Audit Report: All 12 Specifications

## Summary
- Specs Audited: 12
- Average Pass Rate: X%
- Highest-Quality Spec: [spec]
- Most Common Gap: [dimension]

## Per-Specification Results

### Spec 001: [Title]
| Dimension | Status | Examples/Notes |
|-----------|--------|----------------|
| Completeness | PASS / FAIL | ... |
| Clarity | PASS / FAIL | Vague: "System MUST be scalable" (line X) |
| Consistency | PASS / FAIL | ... |
| Measurability | PASS / FAIL | ... |
| Scenario Coverage | PASS / FAIL | ... |
| Edge Cases | PASS / FAIL | ... |
| Dependencies | PASS / FAIL | ... |
| Ambiguities | PASS / FAIL | Unresolved: FR-X (specific question) |

## Remediation Plan
[Prioritized by impact/effort]
```

**Implementation**: Audit report created with per-spec dimension analysis and remediation recommendations.

---

### 3. Maintenance Procedure Documentation Pattern

**Research Question**: What is the best structure for governance maintenance procedures that are non-technical and suitable for stakeholders?

**Decision**: MAINTENANCE.md in `.github/specs/` with plain-English procedures organized by task (create new spec, update existing spec, manage catalog, enforce quality gates).

**Rationale**:

- Non-technical language ensures governance team can understand and execute procedures
- Task-based organization mirrors how maintainers will actually use the document
- Step-by-step guidance reduces ambiguity
- Quality gate checklists make governance decisions objective

**Maintenance Procedure Topics**:

1. **Numbering Scheme** — How to assign next number (highest current + 1)
2. **New Specification Creation** — Folder structure, file templates, catalog entry
3. **Specification Updates** — Change process, approval gates, changelog documentation
4. **Catalog Maintenance** — When to update, what fields to refresh
5. **Quality Gate Enforcement** — How to validate specs meet 8-dimension standards
6. **Governance Authority** — Who can approve changes (@ashley for governance decisions)
7. **Archive/Deprecation** — How to mark old specs, preserve historical numbers

**Implementation**: MAINTENANCE.md created with actionable procedures and decision trees.

---

### 4. GitHub Governance Automation Integration

**Research Question**: How should this governance project integrate with existing GitHub automation (PR templates, labels, workflows)?

**Decision**: Respect existing governance automation; document how this specification maintains consistency with Constitution principles and doesn't require changes to LOCKED files.

**Rationale**:

- Constitution Principle II: LOCKED files require explicit approval (@ashley)
- This specification doesn't modify any LOCKED files (labels.yml, issue-types.yml, templates)
- Changes are to governance process documentation, not GitHub configuration
- Governance authority (@ashley) is documented as approval gate

**Integration Points**:

- PR template: Uses `chore/` template (maintenance/documentation changes)
- Labels: Uses canonical `type:audit`, `area:docs` labels from labels.yml
- Branch naming: Follows `chore/update-github-speckit-folder-numbers` pattern
- Workflows: Respects existing changelog validation, branch name validation

**Implementation**: No changes to GitHub configuration files needed; governance procedures documented in Markdown.

---

### 5. Specification Number Management Strategy

**Research Question**: Should existing specs (001-012) be preserved as-is, or should gaps be closed through renumbering?

**Decision**: PRESERVE existing numbers (001-012) exactly as-is. Start new specifications at 013. Future numbers increment from highest current number + 1.

**Rationale** (from clarification in Session 2026-09-16):

- Preserves historical traceability (can audit which specs existed when)
- No disruptive renumbering (stakeholders can reference by original number)
- Simplifies maintenance (current numbers never change)
- Enables predictable future numbering (next = highest + 1)

**Implementation**:

- Document in MAINTENANCE.md: "Current specs 001-012 unchanged; new specs start at 013"
- Document in ASSUMPTIONS: "Historical traceability preserved; no retroactive renumbering"
- Update catalog to reflect full numbering range (001-013+)

---

## Conclusions & Next Steps

**All Research Questions Resolved**: No NEEDS CLARIFICATION markers remain. Technical approach is clear:

1. ✅ Catalog design: Single CATALOG.md with indexed entries
2. ✅ Audit methodology: Systematic per-spec 8-dimension analysis with remediation plan
3. ✅ Maintenance procedures: MAINTENANCE.md with plain-English task-based workflows
4. ✅ GitHub integration: Respect LOCKED files, use existing governance automation
5. ✅ Numbering strategy: Preserve 001-012, start new at 013

**Ready for Phase 1 Design**: Can now create data-model.md, contracts/, and quickstart.md validation scenarios.

---

**Research Completed**: 2026-09-16 | **Researcher**: Claude Haiku 4.5
