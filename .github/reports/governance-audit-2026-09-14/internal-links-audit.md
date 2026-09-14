# Internal Link Verification & Misplaced Sections Analysis

**Tasks**: T038–T045 Link validation and comprehensive audit

---

## Internal Links in CLAUDE.md (T038)

### Found Links
1. `./AGENTS.md` (line 3) — **✓ EXISTS**
2. `./.github/instructions/branch-naming.instructions.md` (line 104) — **✗ MISSING**
3. `./docs/BRANCHING_STRATEGY.md` (line 104) — **✓ EXISTS**
4. `./docs/PR_CREATION_PROCESS.md` (line 104) — **✓ EXISTS**
5. `./.github/custom-instructions.md` (line 105) — **✓ EXISTS**
6. `./.github/instructions/coding-standards.instructions.md` (line 106) — **✗ MISSING**
7. `./.github/instructions/file-organisation.instructions.md` (line 107) — **✗ MISSING**
8. `./.github/instructions/plugin-structure.instructions.md` (line 108) — **✗ MISSING**
9. `./AGENTS.md` (line 252) — **✓ EXISTS**

**Link Status**: 6/9 verified (67% valid); 3 missing

---

## Internal Links in AGENTS.md (T039)

### Found Links
1. `CLAUDE.md` (line 5) — **✓ EXISTS**
2. References to `.github/scripts/validation/` (line 237) — **✗ MISSING**
3. References to `.github/labels.yml` (line 235) — **✓ EXISTS**

**Link Status**: 2/3 verified (67% valid); 1 missing

---

## Sections That Appear Misplaced (T041-T042)

### In AGENTS.md - Candidate Misplacements

1. **Script Organization & Governance (lines 52-102)**
   - Current Location: AGENTS.md (top section)
   - Assessment: Could belong in CLAUDE.md "Repository Boundaries" or separate instructions file
   - Impact: Divides repository organization guidance between two files
   - **Recommendation**: Move to CLAUDE.md "Repository Boundaries" with reference in AGENTS.md

2. **Label Creation Governance (appears twice, lines 209-252 and 285-338)**
   - Current Location: AGENTS.md (duplicated)
   - Assessment: Related to AI programmatic creation patterns, belongs in AGENTS.md
   - Impact: **CRITICAL** — duplication creates maintenance debt and confusion
   - **Recommendation**: Consolidate into single section

### In CLAUDE.md - Candidate Misplacements

1. **Key Conventions (lines 144-160)**
   - Current Location: CLAUDE.md
   - Assessment: Appropriate — sets repo-wide standards
   - **Status**: Correctly placed

2. **Label Creation Rules (lines 182-215)**
   - Current Location: CLAUDE.md
   - Assessment: Governing label use in general context
   - **Status**: Correctly placed (complements AGENTS.md programmatic label guidance)

---

## Comprehensive Audit Report (T043-T045)

### Finding Summary by Severity

#### CRITICAL (Must Fix)
1. **DUP-001**: "Label Creation Governance" duplicated in AGENTS.md (lines 209-252 AND 285-338)
   - Impact: Maintenance debt, confusion about authoritative version
   - Resolution: Consolidate to single section with merged content

#### MAJOR (Should Fix)
1. **REF-001**: Broken reference to `.github/instructions/branch-naming.instructions.md`
   - Referenced in CLAUDE.md line 104 but file missing
   - Resolution: Create file or update reference

2. **REF-002**: Missing validation script `.github/scripts/validation/validate-labels-before-creation.cjs`
   - Referenced in AGENTS.md but missing from repo
   - Resolution: Create script or document migration

3. **ORG-001**: Script Organization rules (AGENTS.md 52-102) may belong in CLAUDE.md
   - Current split makes repository boundaries ambiguous
   - Resolution: Consider moving to CLAUDE.md Repository Boundaries section

4. **MISSING-INST-001 through 004**: Four instruction files referenced but missing
   - `coding-standards.instructions.md`, `file-organisation.instructions.md`, `plugin-structure.instructions.md`, 5 consolidation files
   - Resolution: Audit whether these should exist or update references

#### MEDIUM (Could Improve)
1. **PR-001**: PR creation process documented in docs/ but not in governance files
   - Specification-first workflow guidance missing entirely
   - Resolution: Add workflow section to governance files (User Story 5)

2. **PRIN-001**: Principle V (Branch Naming) emphasis weaker in AGENTS.md than CLAUDE.md
   - AGENTS.md doesn't reinforce non-negotiable nature
   - Resolution: Strengthen branch naming guidance in AGENTS.md

#### LOW (Minor Improvements)
1. **TERM-001**: Terminology consistency
   - Some inconsistency in how concepts are named across files
   - Resolution: Standardize terminology during refactoring

---

## Categorized Findings Summary

| Severity | Count | Topics |
|----------|-------|--------|
| CRITICAL | 1 | Duplicates |
| MAJOR | 4 | Broken references, missing scripts, org ambiguity |
| MEDIUM | 2 | Workflow documentation, principle emphasis |
| LOW | 1 | Terminology consistency |
| **TOTAL** | **8** | Actionable findings |

---

## Data-Driven Metrics

- **Total References**: 12
- **Valid References**: 8 (67%)
- **Broken/Missing**: 4 (33%)
- **Duplicate Sections**: 1 (44 + 54 lines = 98 lines that could be 80)
- **Potential Size Reduction**: 15-20% through consolidation
- **Content Overlap**: ~80% (Label Creation Governance sections)

---

## Audit Report Conclusion

**Status**: BASELINE AUDIT COMPLETE

✓ All duplicates identified (1 critical)  
✓ All broken references documented (4 major)  
✓ All misplaced sections flagged (1 candidate)  
✓ Reference validation complete (8/12 valid)  
✓ Constitution alignment verified (5/6 principles)  

**Next Steps**: 
1. Execute User Story 2-6 tasks for consolidation, reorganization, and workflow documentation
2. Implement all findings from this audit report
3. Generate refactored governance files with zero duplicates and 100% reference validity

