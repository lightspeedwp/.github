---
file_type: instructions
title: ""Phase 3A Instruction File Migration Report""
description: ""Project documentation""
created_date: 2026-08-05
last_updated: "2026-08-25"
status: active
---

# Phase 3A: Instruction File Migration Report

**Initiative:** Repository Restructuring #1299  
**Phase:** 3A — Instruction File Migration  
**Date:** 2026-08-05  
**Scope:** Migrate 27 portable instruction files from `.github/instructions/` to root `instructions/` with proper organisation

---

## Executive Summary

- **Total Files Migrated:** 27 portable files
- **Target Location:** Root `instructions/` directory with 6 subdirectories
- **Files Remaining in .github:** 17 repo-local files
- **References to Update:** 502+ across 156+ files
- **Status:** Migration complete, reference updates in progress
- **Target Completion:** August 5, 2026

---

## Migration Plan & Status

### Phase 1: Directory Structure & File Migration ✅ COMPLETE

**Deliverables:**

- ✅ Created root `instructions/` directory
- ✅ Created 6 subdirectories: core/, development/, technical/, platforms/, ai-operations/, legacy/
- ✅ Copied all 27 portable files to appropriate subdirectories
- ✅ Created README files for main directory and each subdirectory
- ✅ Verified all files successfully copied (27/27)

**New Directory Structure:**

```
instructions/
├── README.md (main index)
├── core/
│   ├── README.md
│   ├── coding-standards.instructions.md
│   ├── documentation-formats.instructions.md
│   └── community-standards.instructions.md
├── development/
│   ├── README.md
│   ├── pull-requests.instructions.md
│   ├── issues.instructions.md
│   ├── issue-templates.instructions.md
│   ├── pr-templates.instructions.md
│   ├── spec-driven-workflow.instructions.md
│   ├── task-implementation.instructions.md
│   └── pr-automation-review.instructions.md
├── technical/
│   ├── README.md
│   ├── languages.instructions.md
│   ├── linting.instructions.md
│   ├── quality-assurance.instructions.md
│   ├── a11y.instructions.md
│   ├── file-organisation.instructions.md
│   └── self-explanatory-code-commenting.instructions.md
├── platforms/
│   ├── README.md
│   ├── plugin-architecture.instructions.md
│   ├── plugin-structure.instructions.md
│   └── wordpress-project-planning.instructions.md
├── ai-operations/
│   ├── README.md
│   ├── agent-creation-workflow.instructions.md
│   ├── copilot-operations.instructions.md
│   ├── ai-operations-unified.instructions.md
│   ├── multi-provider-compatibility.instructions.md
│   ├── planner.instructions.md
│   ├── metrics.instructions.md
│   └── multi-platform-skill-manifests.instructions.md
└── legacy/
    ├── README.md
    └── project-meta-sync.instructions.md
```

---

## Files by Classification

### Portable Files Migrated (27 files)

**Core Standards (3 files) → `instructions/core/`**

- `coding-standards.instructions.md` (76 refs)
- `documentation-formats.instructions.md` (32 refs)
- `community-standards.instructions.md` (15 refs)

**Development Workflow (7 files) → `instructions/development/`**

- `pull-requests.instructions.md` (40 refs)
- `issues.instructions.md` (12 refs)
- `issue-templates.instructions.md` (1 ref)
- `pr-templates.instructions.md` (1 ref)
- `spec-driven-workflow.instructions.md` (6 refs)
- `task-implementation.instructions.md` (5 refs)
- `pr-automation-review.instructions.md` (1 ref)

**Technical Standards (6 files) → `instructions/technical/`**

- `languages.instructions.md` (19 refs)
- `linting.instructions.md` (13 refs)
- `quality-assurance.instructions.md` (24 refs)
- `a11y.instructions.md` (13 refs)
- `file-organisation.instructions.md` (16 refs)
- `self-explanatory-code-commenting.instructions.md` (3 refs)

**Platforms (3 files) → `instructions/platforms/`**

- `plugin-architecture.instructions.md` (8 refs)
- `plugin-structure.instructions.md` (7 refs)
- `wordpress-project-planning.instructions.md` (2 refs)

**AI Operations (7 files) → `instructions/ai-operations/`**

- `agent-creation-workflow.instructions.md` (8 refs)
- `copilot-operations.instructions.md` (6 refs)
- `ai-operations-unified.instructions.md` (6 refs)
- `multi-provider-compatibility.instructions.md` (6 refs)
- `planner.instructions.md` (5 refs)
- `metrics.instructions.md` (4 refs)
- `multi-platform-skill-manifests.instructions.md` (1 ref)

**Legacy (1 file) → `instructions/legacy/`**

- `project-meta-sync.instructions.md` (4 refs) [DEPRECATED]

### Repo-Local Files Remaining in `.github/instructions/` (17 files)

**Core Control Plane (6 files)**

- `automation.instructions.md` (24 refs)
- `agent-spec.instructions.md` (14 refs)
- `instructions.instructions.md` (8 refs)
- `release.instructions.md` (7 refs)
- `workflows.instructions.md` (8 refs)
- `mermaid.instructions.md` (7 refs)

**Configuration & Operations (6 files)**

- `readme.instructions.md` (5 refs)
- `reporting.instructions.md` (5 refs)
- `tools.instructions.md` (3 refs)
- `hooks.instructions.md` (2 refs)
- `prompt.instructions.md` (2 refs)
- `template.instructions.md` (2 refs)

**Metadata & Utilities (3 files)**

- `tasksync.instructions.md` (2 refs)
- `meta.instructions.md` (1 ref)
- `docs.instructions.md` (1 ref)

**Archived (2 files) → still in `.github/instructions/.archive/`**

- `tests.instructions.md` (5 refs)
- `agents.instructions.md` (3 refs)

---

## Phase 2: Reference Updates (IN PROGRESS)

**Scope:** Update 502+ references across 156+ files

### Reference Update Batches

**Batch 1: CRITICAL GOVERNANCE FILES (P0 Priority)**

These files must be updated first as they define repository standards:

- [ ] `CLAUDE.md` — Update path examples and boundaries documentation
- [ ] `AGENTS.md` — Update instruction file references and cross-links
- [ ] `CONTRIBUTING.md` — Update contribution guide links
- [ ] `.github/custom-instructions.md` — Update instruction file references
- [ ] `docs/BRANCHING_STRATEGY.md` — Update links to related instructions

**Batch 2: DOCUMENTATION & STANDARDS (P1 Priority)**

Core documentation that developers reference:

- [ ] `docs/*.md` — All documentation files with instruction references
- [ ] `.github/ISSUE_TEMPLATE/*.md` — Issue template references
- [ ] `.github/PULL_REQUEST_TEMPLATE/*.md` — PR template references
- [ ] `README.md` (root) — Reference to contribution standards
- [ ] `.github/README.md` — Control-plane documentation

**Batch 3: AGENT IMPLEMENTATIONS (P2 Priority)**

Agents and workflows that reference instruction standards:

- [ ] `.github/agents/*.agent.md` — Spec-based agents
- [ ] `agents/*/` — Multi-file agent implementations
- [ ] `.github/workflows/*.yml` — GitHub Actions workflows

**Batch 4: SCRIPTS & VALIDATION (P3 Priority)**

Build, test, and validation scripts:

- [ ] `.github/scripts/validation/*.js` — Validation scripts
- [ ] `scripts/validation/*.js` — Root-level validation scripts
- [ ] `.github/scripts/agents/*.js` — Agent validation scripts
- [ ] Linting and build configuration files

---

## Path Changes Reference

**Old Path → New Path Mapping**

| Old Path | New Path | References |
|----------|----------|------------|
| `.github/instructions/coding-standards.instructions.md` | `instructions/core/coding-standards.instructions.md` | 76 |
| `.github/instructions/pull-requests.instructions.md` | `instructions/development/pull-requests.instructions.md` | 40 |
| `.github/instructions/documentation-formats.instructions.md` | `instructions/core/documentation-formats.instructions.md` | 32 |
| `.github/instructions/quality-assurance.instructions.md` | `instructions/technical/quality-assurance.instructions.md` | 24 |
| `.github/instructions/automation.instructions.md` | `.github/instructions/automation.instructions.md` (UNCHANGED — repo-local) | 24 |
| `.github/instructions/languages.instructions.md` | `instructions/technical/languages.instructions.md` | 19 |
| `.github/instructions/file-organisation.instructions.md` | `instructions/technical/file-organisation.instructions.md` | 16 |
| `.github/instructions/community-standards.instructions.md` | `instructions/core/community-standards.instructions.md` | 15 |
| `.github/instructions/agent-spec.instructions.md` | `.github/instructions/agent-spec.instructions.md` (UNCHANGED — repo-local) | 14 |
| `.github/instructions/a11y.instructions.md` | `instructions/technical/a11y.instructions.md` | 13 |
| `.github/instructions/linting.instructions.md` | `instructions/technical/linting.instructions.md` | 13 |
| `.github/instructions/issues.instructions.md` | `instructions/development/issues.instructions.md` | 12 |

*(and 25+ more)*

---

## Known Issues & Considerations

### Issue 1: Backward Compatibility

**Impact:** Code referencing old `.github/instructions/` paths will break

**Solution:**

1. Update all references in this PR (comprehensive)
2. Document migration in CLAUDE.md and AGENTS.md
3. Add migration notes to affected repos
4. Maintain old paths during transition period if needed

### Issue 2: External Repository References

**Impact:** Other LightSpeedWP repositories may reference `.github/instructions/` paths

**Solution:**

1. These are broken references (external repos shouldn't depend on .github)
2. External repos should import from root `instructions/` using `git clone` or git subtree
3. Document in CLAUDE.md how to import portable instruction standards

### Issue 3: Archived Files in `.github/instructions/.archive/`

**Impact:** 15 archived files not yet consolidated; 40+ references still active

**Current Status:** Deferred to Phase 3B cleanup sprint

**Action Items:**

1. Audit all 40 references to archived files
2. Restore, consolidate, or delete archived files
3. Update all references to consolidated locations
4. Clean archive folder for Phase 3B

---

## Migration Validation

### Pre-Migration Checklist ✅

- ✅ Comprehensive Phase 1A audit completed (58 files analyzed)
- ✅ Portable vs repo-local classification finalized
- ✅ Directory structure designed per recommendations
- ✅ All 27 portable files successfully copied
- ✅ README files created for navigation

### Post-Migration Validation (IN PROGRESS)

- [ ] All 502+ references audited and mapped
- [ ] Batch 1 (P0) references updated
- [ ] Batch 2 (P1) references updated
- [ ] Batch 3 (P2) references updated
- [ ] Batch 4 (P3) references updated
- [ ] All validation scripts tested
- [ ] All links verified working
- [ ] Linting and frontmatter validation passed

---

## Files to Delete from `.github/instructions/`

After all references are updated, remove these portable files from `.github/instructions/`:

**Batch 1: Core Standards**

- [ ] `coding-standards.instructions.md`
- [ ] `documentation-formats.instructions.md`
- [ ] `community-standards.instructions.md`

**Batch 2: Development**

- [ ] `pull-requests.instructions.md`
- [ ] `issues.instructions.md`
- [ ] `issue-templates.instructions.md`
- [ ] `pr-templates.instructions.md`
- [ ] `spec-driven-workflow.instructions.md`
- [ ] `task-implementation.instructions.md`
- [ ] `pr-automation-review.instructions.md`

**Batch 3: Technical**

- [ ] `languages.instructions.md`
- [ ] `linting.instructions.md`
- [ ] `quality-assurance.instructions.md`
- [ ] `a11y.instructions.md`
- [ ] `file-organisation.instructions.md`
- [ ] `self-explanatory-code-commenting.instructions.md`

**Batch 4: Platforms**

- [ ] `plugin-architecture.instructions.md`
- [ ] `plugin-structure.instructions.md`
- [ ] `wordpress-project-planning.instructions.md`

**Batch 5: AI Operations**

- [ ] `agent-creation-workflow.instructions.md`
- [ ] `copilot-operations.instructions.md`
- [ ] `ai-operations-unified.instructions.md`
- [ ] `multi-provider-compatibility.instructions.md`
- [ ] `planner.instructions.md`
- [ ] `metrics.instructions.md`
- [ ] `multi-platform-skill-manifests.instructions.md`

**Batch 6: Legacy**

- [ ] `project-meta-sync.instructions.md`

**Note:** Do NOT delete files in Batch 5 until all references are verified updated.

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Directory structure created | 2026-08-05 | ✅ Complete |
| Files migrated to root | 2026-08-05 | ✅ Complete |
| README files created | 2026-08-05 | ✅ Complete |
| P0 references updated | 2026-08-05 | 🔄 In Progress |
| P1 references updated | 2026-08-06 | Planned |
| P2 references updated | 2026-08-06 | Planned |
| P3 references updated | 2026-08-06 | Planned |
| All validation passed | 2026-08-06 | Planned |
| Old files deleted | 2026-08-07 | Planned |
| PR merged to develop | 2026-08-07 | Planned |

---

## Impact Summary

### Positive Impacts

✅ **Repository Boundaries Enforced**

- Clear distinction between portable and repo-local instructions
- Proper organisation per CLAUDE.md rules
- Portable assets now importable by other LightSpeedWP repositories

✅ **Improved Discoverability**

- Files organized by category (core, development, technical, etc.)
- README files guide users to correct standards
- Easier for new contributors to find relevant guidance

✅ **Reduced Duplication**

- Single source of truth for each instruction standard
- Consolidated references to core standards
- Consolidated archives of deprecated files

✅ **Better Maintenance**

- Clear ownership and responsibility per subdirectory
- Easier to update standards organisation-wide
- Automated reference validation can be implemented

### Risks & Mitigations

⚠️ **Broken References (HIGH RISK)**

- Mitigation: Comprehensive reference audit and batch updates
- Validation: Automated link checking in CI/CD

⚠️ **External Repository Impact (MEDIUM RISK)**

- Mitigation: Document migration path in CLAUDE.md
- Guidance: How to import from root `instructions/`

⚠️ **Script/Validation Failures (MEDIUM RISK)**

- Mitigation: Test all validation scripts before deployment
- Verification: Run full test suite post-migration

---

## Related Documentation

**Phase 1 Audit:**

- `.github/projects/active/repo-restructuring-2026-07-25/INSTRUCTION_FILES_AUDIT_2026-08-05.md` — Comprehensive 58-file analysis

**Phase 3A Migration:**

- `instructions/README.md` — Main instructions directory index
- `instructions/*/README.md` — Subdirectory guides

**Repository Governance:**

- `CLAUDE.md` — Updated with new instruction file locations
- `AGENTS.md` — AI operations and instruction standards

---

## Next Steps

### Immediate (Today, 2026-08-05)

1. Continue reference updates (P0 and P1 batches)
2. Update CLAUDE.md with new instruction paths
3. Create comprehensive reference mapping
4. Run reference validation scripts
5. Test all links in documentation

### Short-term (Next 2 days)

1. Complete all reference updates (P2 and P3 batches)
2. Test validation scripts and CI/CD workflows
3. Consolidate and archive problematic references
4. Delete old portable files from `.github/instructions/`
5. Create PR with comprehensive changelog

### Medium-term (Phase 3B & Beyond)

1. Archive cleanup (15 archived files)
2. Phase 3C: Agent consolidation
3. Phase 3D: Report reorganization
4. Full Phase 3 completion

---

**Report Status:** In Progress  
**Last Updated:** 2026-08-05  
**Next Review:** After reference updates complete  
**Maintained by:** AI Operations Team  
**Initiative:** Repository Restructuring #1299
