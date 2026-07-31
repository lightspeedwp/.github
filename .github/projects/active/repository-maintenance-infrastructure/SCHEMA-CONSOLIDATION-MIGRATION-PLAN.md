---
name: schema-consolidation-migration
description: Comprehensive plan for consolidating schema folders (.github/schemas/ and /schema/) to .schemas/
metadata:
  type: planning
  status: in-planning
  parent-issue: TBD
  child-issues: TBD
---

# Schema Consolidation Migration Plan

**Objective:** Consolidate schema files from TWO current locations (`.github/schemas/` and `/schema/`) into a single unified location (`.schemas/`) following awesome-copilot pattern.

**Timeline:** Phase 1A (Audit) → Phase 1B (Extended Audit) → Phase 2 (Documentation) → Phase 3 (Migration) → Phase 4 (Validation)

---

## Executive Summary

### Current State (AUDIT VERIFIED)

- ✅ **Active schemas location:** `.github/schema/` (singular, 26 files including README)
  - 25 JSON schema files (12 portable + 5 repo-local + 8 supporting)
  - 2 example files
  - 5 memory system schemas
- ✅ **Target location prepared:** `.github/.schemas/` (hidden, nested in .github/)
- ❌ **200+ references** scattered across scripts, workflows, documentation
- ❌ **Hard-coded paths** in 4 scripts (branding-unified.agent.js, verify-wceu-readiness.js, etc.)
- ❌ **Boundary marker duplication** (`.github/.github/schemas/` and `.github/.schemas/` both exist)

### Target State

- ✅ **Single unified location:** `.github/.schemas/` (hidden, nested, matches awesome-copilot structure)
- ✅ **All 26 schema files consolidated** in `.github/.schemas/` with structure intact
- ✅ **All 200+ references updated** to point to new location
- ✅ **Scripts updated** with new paths (4 files identified)
- ✅ **CI/CD workflows passing** with new paths
- ✅ **Boundary markers clarified** (`.github/.github/schemas/` as repo-local marker only)

---

## Phase 1: Comprehensive Audit (COMPLETED)

### 1A. Initial Schema Audit (Complete)

**Findings:**

- **17 JSON schema files** in `/schema/` (root level)
- **Supporting files:** README.md, examples/, memory/ subdirectories
- **`.github/schemas/`:** Contains only README.md (boundary marker)
- **`.schemas/`:** Exists with only README.md (prepared for migration)

**Schema Inventory:**

- 13 portable schemas (reusable across repos)
- 4 repo-only schemas (GitHub-specific)
- 17 total schema files to consolidate

### 1B. Extended Audit (In Progress)

**Audit Scope:**

1. Complete inventory of BOTH `.github/schemas/` and `/schema/`
2. Identify duplicates or conflicts
3. Map all references (scripts, workflows, docs, configs)
4. Categorize by portability and dependency
5. Consolidation action items

**Expected Output:** Detailed consolidation map with migration sequence

---

## Phase 2: Documentation Updates

### Priority 1: Governance Documents

- [ ] Update `CLAUDE.md` — Repository boundaries table, schema folder reference
- [ ] Update `AGENTS.md` — Schema reference location clarification
- [ ] Update `.github/custom-instructions.md` — Path references

### Priority 2: Operational Documentation

- [ ] Update `instructions/file-organisation.instructions.md` — Clarify schema location
- [ ] Update `schema/README.md` content for `.schemas/` → create `.schemas/README.md`
- [ ] Update `.github/schemas/README.md` — Boundary marker explanation

### Priority 3: Script & Configuration Updates

- [ ] `scripts/validation/validate-frontmatter.js` — Update path: `../../schema/` → `../../.schemas/`
- [ ] `scripts/validation/validate-agents.js` — Update schema directory path
- [ ] `scripts/validation/validate-json.js` — Update schema reference paths
- [ ] `website/src/lib/catalogue.ts` — Update hard-coded schema paths (lines 792-900)
- [ ] `package.json` — Update npm script references: `schema/**` → `.schemas/**`

### Priority 4: Workflow Updates

- [ ] `.github/workflows/changelog-validate.yml` — Update path references
- [ ] `.github/workflows/labeling.yml` — Update path references
- [ ] `.github/workflows/release.yml` — Update path references
- [ ] `.github/workflows/changelog-auto-update.yml` — Update path references

### Priority 5: Documentation Links

- [ ] Bulk update 150+ references from `schema/` → `.schemas/` in documentation files
- [ ] Update inline links in project documentation
- [ ] Update inline links in report files

---

## Phase 3: File Migrations

### 3A. Consolidate Schema Files

```
/.github/schemas/         → DELETE (move to .schemas/)
  ├── README.md           → Keep copy at .schemas/README.md
  └── (no other files)

/schema/                  → MOVE all contents to .schemas/
  ├── *.schema.json       → .schemas/
  ├── examples/           → .schemas/examples/
  ├── memory/             → .schemas/memory/
  └── README.md           → Update then move to .schemas/

/.schemas/                → TARGET (currently has README.md only)
  ├── [ALL schemas consolidate here]
  └── Complete schema directory structure
```

### 3B. Update All Reference Files

- Script paths (16 files identified in Phase 2)
- Workflow import paths (4 workflow files)
- Documentation links (150+ references)
- Configuration references (4 config files)
- Schema registry update

### 3C. Verification Steps

- [ ] All schema files exist in `.schemas/`
- [ ] No remaining references to `schema/` or `.github/schemas/`
- [ ] `validate:json:schemas` npm script works
- [ ] `validate:frontmatter` validation passes
- [ ] CI workflows pass with new paths

---

## Phase 4: Validation & Cleanup

### 4A. Automated Testing

- [ ] npm run validate:json:schemas — validates `.schemas/**/*.json`
- [ ] npm run validate:frontmatter — uses `.schemas/frontmatter.schema.json`
- [ ] All CI workflows pass
- [ ] Pre-commit hooks work with new paths

### 4B. Manual Verification

- [ ] Website catalogue reflects correct paths
- [ ] OpenSpec platform detection works (if uses schemas)
- [ ] All documentation links are correct
- [ ] No broken frontmatter references

### 4C. Cleanup & Documentation

- [ ] Remove old `schema/` directory (after verification)
- [ ] Confirm `.github/schemas/` is only boundary marker
- [ ] Update CHANGELOG.md with migration entry
- [ ] Create SCHEMA_MIGRATION_GUIDE.md documentation
- [ ] Update project tracking documents

---

## Detailed Migration Map

### Step 1: Move Schema Files

```
FROM: /schema/{file}.schema.json
TO:   ./.schemas/{file}.schema.json

FROM: /schema/examples/*
TO:   ./.schemas/examples/*

FROM: /schema/memory/*
TO:   ./.schemas/memory/*
```

### Step 2: Update Script Paths (16 files identified)

| File | Current Path | New Path | Type |
|------|---|---|---|
| `scripts/validation/validate-frontmatter.js` | `../../schema/frontmatter.schema.json` | `../../.schemas/frontmatter.schema.json` | Hardcoded |
| `scripts/validation/validate-agents.js` | `REPO_ROOT}/schema` | `${REPO_ROOT}/.schemas` | Hardcoded |
| `website/src/lib/catalogue.ts` | Schema file paths (792-900) | `.schemas/` paths | Hard-coded |
| `package.json` | `schema/**/*.json` | `.schemas/**/*.json` | Glob pattern |
| `.github/workflows/*.yml` (4 files) | Path patterns & triggers | `.schemas/` patterns | Workflow configs |

### Step 3: Document Updates (150+ references)

**Find/Replace Pattern:**

- Find: `schema/` (with context)
- Replace: `.schemas/`
- Scope: All `.md` files outside of `.schemas/` itself

**High-touch files identified:**

- Mermaid accessibility report (20 refs)
- File organization audit docs (17 refs)
- Migration guides (15 refs)
- Skill definitions (11 refs)
- Theme instructions (9 refs)

---

## Risk Assessment

### Low Risk ✅

- Moving `.github/schemas/` README → `.schemas/` (it's just a boundary marker)
- Workflow path trigger updates (well-defined, tested)

### Medium Risk ⚠️

- Website catalogue hard-coded paths (4 files with 100+ lines to update)
- Validation script path updates (5 scripts with critical dependencies)
- Bulk documentation find/replace (150+ references, need careful verification)

### High Risk 🔴

- **None identified** — Schema location is well-isolated from core functionality
- Validation system uses relative paths, not absolute references
- No circular dependencies identified

### Mitigation Strategies

1. **Scripted find/replace** for bulk documentation updates (verify in dev first)
2. **Test validation scripts** after each path update
3. **Run full CI pipeline** before commit
4. **Keep old locations as boundary markers** until verification complete
5. **Document migration in CHANGELOG.md** for team visibility

---

## Dependencies & Blockers

### External Dependencies

- None identified — schemas are internal system

### Internal Dependencies Mapped

- Validation system (scripts/validation/)
- Website catalogue (website/src/lib/)
- CI/CD workflows (4 workflow files)
- Documentation system

### Blockers

- ❌ None identified — migration can proceed independently

---

## Definition of Done (DoD)

### Completion Criteria

- [ ] All schema files consolidated to `.schemas/`
- [ ] All 150+ documentation references updated
- [ ] All 5 validation scripts updated and tested
- [ ] All 4 workflows updated and passing
- [ ] `npm run validate:json:schemas` passes
- [ ] `npm run validate:frontmatter` passes
- [ ] CI pipeline passes
- [ ] No references to old `schema/` or `.github/schemas/` (except boundaries)
- [ ] CHANGELOG.md updated with migration entry
- [ ] `SCHEMA_MIGRATION_GUIDE.md` created
- [ ] Team notified of new schema location

### Verification Checklist

- [ ] `.schemas/` contains all 17 schema files
- [ ] `.schemas/examples/` contains all examples
- [ ] `.schemas/memory/` contains all memory files
- [ ] `.schemas/README.md` explains schema ownership
- [ ] `schema/` directory deleted (or archived)
- [ ] `.github/schemas/` is boundary marker only
- [ ] All workflows run successfully
- [ ] Website catalogue displays correctly
- [ ] Validation commands work end-to-end

---

## Timeline Estimate

| Phase | Duration | Owner |
|---|---|---|
| Phase 1B (Extended Audit) | ~30 min | AI Agent |
| Phase 2 (Documentation) | ~2-3 hours | Ashley |
| Phase 3A (File Migrations) | ~30 min | Bash scripts |
| Phase 3B (Reference Updates) | ~1-2 hours | Bulk replace + verification |
| Phase 4 (Validation & Cleanup) | ~1 hour | Ashley + CI |
| **Total Estimated** | **~6-8 hours** | — |

---

## Related Issues

- **Related:** Wave 5 Documentation Audit (file organization)
- **Related:** Repository Maintenance Infrastructure project
- **Blocks:** Any documentation relying on schema location clarity
- **Blocked By:** None

---

## Notes for Implementation

1. **Extended Audit Results:** Awaiting completion to confirm final consolidation map
2. **Script Validation:** Each script must be tested after path updates
3. **CI Pipeline:** Full test run required before merge
4. **Rollback Plan:** Git history preserved; can revert if issues arise
5. **Communication:** Update team via CHANGELOG entry and project notes

---

**Status:** ⏳ Awaiting Extended Audit Completion  
**Next Steps:** Present audit findings → confirm migration sequence → proceed to Phase 2 documentation updates
