# Audit Scope Definition

**Date**: 2026-09-14

## Baseline State (T015)

### File Metrics
- **CLAUDE.md**: 162 lines, 13 KB
- **AGENTS.md**: 338 lines, 18 KB
- **Total**: 500 lines, 31 KB

### Line Range Summary
- CLAUDE.md: 1-162
- AGENTS.md: 1-338

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
Found 0 references in CLAUDE.md

### File Path References in AGENTS.md (T017)
Found 0 references in AGENTS.md

### Cross-File References (T019)

References between CLAUDE.md and AGENTS.md:
- AGENTS.md mentioned in CLAUDE.md: 2 occurrences
- CLAUDE.md mentioned in AGENTS.md: 3 occurrences
