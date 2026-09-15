# Audit Scope Definition

**Date**: 2026-09-14

## Baseline State (T015)

### File Metrics
- **CLAUDE.md**: 267 lines (authoritative archived baseline)
- **AGENTS.md**: 352 lines (authoritative archived baseline)
- **Total**: 619 lines

### Line Range Summary
- CLAUDE.md: 1-267
- AGENTS.md: 1-352

---

## Issues Found (T016)

### Duplicate Sections
1. **"Label Creation Governance (CRITICAL)"** (DUP-001)
   - Location 1: AGENTS.md lines 209–252
   - Location 2: AGENTS.md lines 285–338
   - Status: CRITICAL - consolidation required

### Broken References (Known)
1. `.github/instructions/branch-naming.instructions.md` - REFERENCED but MISSING
2. `instructions/*.md` - 5 consolidated files referenced but MISSING
3. `.github/scripts/validation/validate-labels-before-creation.cjs` - REFERENCED but MISSING

### Organizational Issues
1. Script organization rules (AGENTS.md 52-102) may belong in CLAUDE.md
2. Branch naming guidance split across both files with possible inconsistencies
3. Specification-first workflow guidance missing entirely

### Conflict Count
- Estimated: 3-5 areas with conflicting or overlapping guidance

---

## Reference Extraction (T017-T019)

### File Path References in CLAUDE.md (T017)
The path-aware Markdown scan found 9 unique local targets in the archived CLAUDE.md: 7 exist at their referenced paths and 2 resolve to documented top-level migrations. No target remains unclassified.

### File Path References in AGENTS.md (T017)
The same scan found 23 unique local targets in the archived AGENTS.md: 20 exist at their referenced paths, 1 resolves to a documented top-level migration, and 2 are missing (`.github/PULL_REQUEST_TEMPLATE.md` and `MIGRATION_GUIDE.md`).

### Combined Reference Result

After de-duplicating targets shared by both files, the scan found 29 unique local paths: 25 existing, 2 migrated, and 2 missing. Results are recorded per source, original reference, status, and resolved path by the quickstart reference scan.

### Cross-File References (T019)

References between CLAUDE.md and AGENTS.md:
- AGENTS.md mentioned in CLAUDE.md: 2 occurrences
- CLAUDE.md mentioned in AGENTS.md: 3 occurrences
