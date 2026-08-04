---
file_type: phase-plan
title: Phase 2C - Script Testing & Validation
created_date: 2026-08-05
status: in-progress
---

# Phase 2C: Testing, Documentation & Final Merge

**Objective:** Validate all migrated portable scripts, update documentation, and merge all batches to develop.

**Timeline:** 3-4 hours  
**Status:** IN PROGRESS

## Overview

Phase 2B successfully migrated 82 portable scripts across 3 batches:

- **Batch 1**: 34 validation scripts → `scripts/validation/`
- **Batch 2**: 44 agent utilities → `scripts/agents/includes/`
- **Batch 3**: 4 changelog utilities + 17 AI feedback files → `scripts/workflows/changelog/` + root

Phase 2C validates these migrations and finalizes the work.

## Task Checklist

### 1. Script Execution Testing

- [ ] Test all 34 validation scripts (15 min)
- [ ] Test all 44 agent utilities (20 min)
- [ ] Test all 4 changelog utilities (10 min)
- [ ] Test AI feedback validation system (10 min)

### 2. Path Reference Verification

- [ ] Verify no broken imports after migration
- [ ] Confirm all workflow references point to new locations
- [ ] Check package.json script references
- [ ] Validate CLAUDE.md path examples

### 3. Documentation Updates

- [ ] Update CLAUDE.md with portable assets section
- [ ] Document scripts/ folder structure
- [ ] Add script migration guide
- [ ] Link to SCRIPTS_INVENTORY.md

### 4. PR Merge & Closure

- [ ] Verify PR #1528 merged (Batch 3)
- [ ] Confirm all tests pass on develop
- [ ] Close Issue #1464 with completion summary
- [ ] Update active project status

## Test Execution Commands

### Validation Scripts

```bash
npm run test:js -- scripts/validation/
```

### Agent Utilities

```bash
npm run test:js -- scripts/agents/includes/
```

### Changelog Utilities

```bash
npm run test:js -- scripts/workflows/changelog/
```

### Path Reference Check

```bash
grep -r "\.github/scripts" scripts/ --include="*.js" --include="*.cjs" --include="*.json"
```

### Full Test Suite

```bash
npm test
```

## Documentation Updates Needed

### CLAUDE.md Additions

Add to "Portable AI operations assets" section:

```markdown
| `scripts/` | Portable agent, validation, workflow, and utility scripts (82 total migrated from .github/scripts/) |
| `scripts/validation/` | Validation utilities for frontmatter, agents, workflows, changelog, plugins, skills |
| `scripts/agents/` | Agent implementations and utility libraries for automation workflows |
| `scripts/workflows/` | Workflow-specific utilities for branch policy, changelog, metrics, release, projects |
```

### Migration Guide

Create `docs/SCRIPT_MIGRATION_GUIDE.md` documenting:

- Migration rationale (portability, org-wide reuse)
- New script locations (root `scripts/` structure)
- Path reference updates (from `.github/scripts/` to `scripts/`)
- Testing strategy (unit tests + integration validation)
- Examples of common imports

## Success Criteria

✅ All tests passing (npm test)  
✅ No broken imports or references  
✅ CLAUDE.md updated with portable assets section  
✅ Script migration guide created  
✅ All PRs merged to develop  
✅ Issue #1464 closed with summary  
✅ Project status updated  

## Related Issues & PRs

- **Issue #1464**: Phase 2B script migration (to close)
- **PR #1518**: Batches 1-2 (MERGED)
- **PR #1528**: Batch 3 + AI feedback (pending merge)
- **Dependency**: Phase 2A audit complete, scripts classified

## Timeline

| Task | Duration | Notes |
|------|----------|-------|
| Script testing | 55 min | Run test suites for each batch |
| Path verification | 15 min | Grep for hardcoded paths |
| Documentation | 20 min | Update CLAUDE.md + create guide |
| Merge & closure | 10 min | Merge PR #1528, close issue |
| **Total** | **100 min (1.7 hrs)** | Well under 3-4 hour estimate |

## Notes

- **Status**: PR #1518 merged; PR #1528 queued for merge
- **Current**: 82 scripts successfully migrated
- **Next**: Validation and final merge to develop
- **Release**: Ready for v1.0 release cycle after Phase 2C completion
