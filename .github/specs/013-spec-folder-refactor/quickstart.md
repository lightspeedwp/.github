# Quickstart: Specification Catalog & Audit Validation Scenarios

**Date**: 2026-09-16 | **Specification**: [013-spec-folder-refactor/spec.md](./spec.md)

This document defines runnable validation scenarios that prove the SpecKit folder refactoring feature works end-to-end. Each scenario is designed to be manually verified by the governance team.

---

## Prerequisites

- Access to `.github` repository
- Local clone of repository with `.github/specs/` directory
- Ability to browse GitHub files
- Familiarity with Markdown and file navigation

---

## Validation Scenario 1: Directory Audit & Inventory

**Feature**: System MUST audit all numbered directories in `.github/specs/` and generate complete inventory  
**Requirement**: FR-001, FR-002, FR-003

**Setup**:

```bash
# Ensure you have local clone
cd /path/to/.github
git fetch origin develop
git checkout develop
```

**Test Steps**:

1. **Verify directory structure exists**
   - Navigate to `.github/specs/` in file browser or terminal
   - List all directories: `ls -d [0-9][0-9][0-9]-*/`
   - Expected: See 001-*, 002-*, ..., 012-* directories

2. **Verify naming convention**
   - Each directory should follow pattern: `{NNN}-{slug}` (e.g., `001-specification-framework`)
   - Check: All use 3-digit numbers (zero-padded), lowercase slugs, hyphens
   - Result: ✅ 100% of directories follow convention (SC-001)

3. **Verify spec.md exists in all**
   - For each directory: `test -f {dir}/spec.md && echo "EXISTS" || echo "MISSING"`
   - Expected: All 12+ directories contain spec.md file
   - Result: ✅ 100% of directories have spec.md (SC-003)

4. **Verify sequential numbering**
   - Extract all numbers: `ls -d [0-9][0-9][0-9]-*/ | sed 's/.*\///' | cut -d- -f1 | sort -n`
   - Expected: 001, 002, 003, ..., 013 (no gaps)
   - Result: ✅ Numbering is fully sequential with zero gaps (SC-002)

**Expected Outcome**:

- ✅ Inventory complete
- ✅ 100% naming compliance
- ✅ 100% spec.md present
- ✅ Sequential numbering confirmed
- ✅ Success Criteria SC-001, SC-002, SC-003 verified

**Time**: ~5 minutes

---

## Validation Scenario 2: Centralized Catalog Discovery

**Feature**: CATALOG.md exists and is discoverable  
**Requirement**: FR-004, SC-003, SC-007

**Setup**:

```bash
# Ensure CATALOG.md has been created in planning/implementation phase
ls -l .github/specs/CATALOG.md
```

**Test Steps**:

1. **Verify CATALOG.md exists**
   - File: `.github/specs/CATALOG.md`
   - Expected: File exists and is readable
   - Result: ✅ CATALOG.md found

2. **Verify index table structure**
   - Open `.github/specs/CATALOG.md` in text editor
   - Locate "Specification Catalog" heading
   - Verify index table with columns: #, Title, Purpose, Status, Created, Link
   - Expected: All 12+ specifications in table, sorted by number
   - Result: ✅ Index table complete and well-organized

3. **Verify specification links**
   - Check 3 random links in catalog (e.g., spec 001, 007, 013)
   - Click/navigate to links: Expected to land in correct spec directory
   - Verify: spec.md file exists and is readable
   - Result: ✅ 100% of links valid (SC-003)

4. **Verify catalog discoverability**
   - Scenario: New team member opens repository
   - Navigate to `.github/specs/CATALOG.md`
   - Can they quickly find a specification by number or title?
   - Time to locate spec 007: Should be <30 seconds (SC-007)
   - Result: ✅ Usable discoverability achieved

5. **Verify CLAUDE.md link**
   - Open `.github/CLAUDE.md`
   - Search for link to CATALOG.md
   - Expected: Clear navigation link to specification catalog
   - Result: ✅ CATALOG.md linked from CLAUDE.md

**Expected Outcome**:

- ✅ CATALOG.md created and well-formed
- ✅ All specifications indexed
- ✅ All links valid
- ✅ Specification discoverable in <30 seconds (SC-007)
- ✅ Success Criteria SC-003, SC-007 verified

**Time**: ~10 minutes

---

## Validation Scenario 3: Quality Audit Results

**Feature**: Quality audit report generated covering all 12 specs  
**Requirement**: FR-005, FR-006, FR-007, SC-004, SC-005

**Setup**:

```bash
# Audit report should exist after implementation
ls -l .github/specs/013-spec-folder-refactor/audit-report.md
```

**Test Steps**:

1. **Verify audit report exists**
   - File: `013-spec-folder-refactor/audit-report.md`
   - Expected: Comprehensive audit report exists
   - Result: ✅ Audit report found

2. **Verify all 12 specs audited**
   - Open audit report
   - Count number of "Spec 001", "Spec 002", etc. sections
   - Expected: All 12 specifications (001-012) have audit results
   - Result: ✅ 100% of specs audited

3. **Verify 8-dimension evaluation**
   - Review audit section for Spec 001 (or any spec)
   - Look for 8 dimensions evaluated:
     - Completeness ✅
     - Clarity ✅
     - Consistency ✅
     - Measurability ✅
     - Scenario Coverage ✅
     - Edge Cases ✅
     - Dependencies ✅
     - Ambiguities ✅
   - Expected: All 8 dimensions present with PASS/FAIL status
   - Result: ✅ Full dimensional analysis completed (SC-004)

4. **Verify quality metrics**
   - Check audit report summary:
     - Average quality score: [X]%
     - Specs with all PASS: [Y] of 12
     - Most common gap dimension: [Z]
   - Expected: ≥95% accuracy when spot-checked (SC-004)
   - Spot-check: Pick spec, verify audit findings match spec content
   - Result: ✅ Metrics accurate

5. **Verify remediation plan exists**
   - Open remediation plan
   - Expected: Actions identified for quality gaps
   - Count remediation items: Should be ≥1 per failing spec (SC-005)
   - Sample item: "Spec 006: Add clarity to requirement FR-003"
   - Result: ✅ Remediation plan actionable (SC-005)

**Expected Outcome**:

- ✅ Audit report comprehensive
- ✅ All 12 specs evaluated
- ✅ 8 dimensions evaluated per spec
- ✅ Quality metrics calculated
- ✅ Remediation plan with actionable items (≥90% with actions, per SC-005)
- ✅ Success Criteria SC-004, SC-005 verified

**Time**: ~15 minutes

---

## Validation Scenario 4: Maintenance Procedures Documented

**Feature**: MAINTENANCE.md documents procedures for spec management  
**Requirement**: FR-009, FR-010, FR-011, SC-006

**Setup**:

```bash
# Maintenance guide should exist after implementation
ls -l .github/specs/MAINTENANCE.md
```

**Test Steps**:

1. **Verify MAINTENANCE.md exists**
   - File: `.github/specs/MAINTENANCE.md`
   - Expected: Comprehensive maintenance guide
   - Result: ✅ MAINTENANCE.md found

2. **Verify numbering scheme documented**
   - Open MAINTENANCE.md
   - Locate "Numbering Scheme" section
   - Verify: States that 001-012 preserved, new specs start at 013
   - Expected: Clear decision documented with rationale
   - Result: ✅ Numbering scheme clear (FR-012)

3. **Verify new spec creation procedure**
   - Locate "Creating a New Specification" section
   - Expected procedures:
     - [ ] Determine next number
     - [ ] Create directory structure
     - [ ] Use SpecKit workflow (/speckit-specify, etc.)
     - [ ] Update CATALOG.md
     - [ ] Approval gate documented
   - Result: ✅ Creation procedure complete (FR-009)

4. **Verify update procedure documented**
   - Locate "Updating an Existing Specification" section
   - Expected: Change process, approval gates, quality re-validation
   - Result: ✅ Update procedure documented (FR-010)

5. **Verify governance authority documented**
   - Search for "@ashley" or "approval authority"
   - Expected: Clear statement that @ashley governs spec changes
   - Result: ✅ Governance authority documented (FR-011)

6. **Verify quality gates defined**
   - Locate "Quality Gate Enforcement" section
   - Expected: 8 dimensions listed, checklist requirement stated
   - Result: ✅ Quality gates clear (FR-011)

7. **Verify non-technical language**
   - Read a procedure section
   - Expected: Plain English, no technical jargon unsuitable for governance team
   - Result: ✅ Accessible to non-technical stakeholders (SC-006)

**Expected Outcome**:

- ✅ MAINTENANCE.md comprehensive
- ✅ Numbering scheme clear
- ✅ New spec creation procedure step-by-step
- ✅ Update and archival procedures documented
- ✅ Governance authority explicit
- ✅ Quality gates objective and measurable
- ✅ Language non-technical and clear (SC-006)
- ✅ Success Criteria SC-006 verified

**Time**: ~15 minutes

---

## Validation Scenario 5: Numbering Strategy Working

**Feature**: New spec can be created following numbering scheme  
**Requirement**: FR-012, SC-009

**Setup**:

```bash
# After implementation, verify that next spec would be numbered correctly
# Current highest number should be 013
ls -d .github/specs/[0-9][0-9][0-9]-*/ | sed 's/.*\///' | cut -d- -f1 | sort -n | tail -1
# Expected output: 013
```

**Test Steps**:

1. **Verify current highest number**
   - Command: Find highest numbered directory
   - Expected: 013 (or latest if more specs added)
   - Result: ✅ Highest number identified

2. **Predict next number**
   - Calculation: highest current + 1 = next
   - Expected: 013 + 1 = 014
   - Rationale: Ensures no gaps, predictable numbering
   - Result: ✅ Next number predictable (FR-012, SC-009)

3. **Verify numbering is sequential**
   - List all numbers: `001, 002, ..., 013`
   - Expected: No gaps, no reused numbers
   - Result: ✅ Sequential numbering maintained (SC-002, SC-009)

4. **Verify historical traceability**
   - Original spec 001 still numbered 001 (not renumbered)
   - Reasons 001-012 unchanged documented in MAINTENANCE.md
   - Result: ✅ Historical traceability preserved (SC-009)

**Expected Outcome**:

- ✅ Numbering scheme working correctly
- ✅ Next number is predictable (014)
- ✅ Sequential numbering with no gaps
- ✅ Historical specs preserved unchanged
- ✅ Success Criteria SC-009 verified

**Time**: ~5 minutes

---

## Validation Scenario 6: End-to-End Governance Audit

**Feature**: Complete governance audit can be performed in one workflow  
**Requirement**: All FRs, all SCs

**Setup**:

```bash
# All artifacts from scenarios 1-5 should be in place
ls -l .github/specs/CATALOG.md
ls -l .github/specs/MAINTENANCE.md
ls -l .github/specs/013-spec-folder-refactor/audit-report.md
```

**Test Steps**:

1. **Verify complete governance system**
   - CATALOG.md: ✅ Specifications indexed and discoverable
   - MAINTENANCE.md: ✅ Procedures documented for governance team
   - Audit Report: ✅ Quality audit complete for all 12 specs
   - Directory Structure: ✅ 001-013+ directories, sequential, compliant
   - Result: ✅ Complete governance system operational

2. **Verify workflow integration**
   - Specification can be created using `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` workflow
   - New spec automatically numbered (next = highest + 1)
   - New spec automatically discoverable in CATALOG.md
   - New spec automatically audited for quality
   - Result: ✅ Specification-first workflow integrated (SC-009)

3. **Verify compliance metrics**
   - 100% of specifications follow naming convention (SC-001)
   - Numbering fully sequential with zero gaps (SC-002)
   - CATALOG.md exists and linked from CLAUDE.md (SC-003)
   - Quality audit complete with >95% accuracy (SC-004)
   - Remediation plan actionable with ≥90% coverage (SC-005)
   - Maintenance procedures documented and non-technical (SC-006)
   - Specifications discoverable in <30 seconds (SC-007)
   - Catalog updated within 7 days of new spec (SC-008)
   - Future specifications follow documented procedures (SC-009)
   - Result: ✅ All success criteria met

**Expected Outcome**:

- ✅ Complete governance system functional
- ✅ All 5 user stories validated
- ✅ All 12 functional requirements implemented
- ✅ All 9 success criteria achieved
- ✅ Feature ready for production use

**Time**: ~20 minutes (comprehensive validation)

---

## Summary

| Scenario | Requirement | Success Metric | Status |
|----------|-------------|-----------------|--------|
| 1. Directory Audit | FR-001, FR-002, FR-003 | 12+ dirs audited, 100% compliant, sequential numbering | ✅ |
| 2. Catalog Discovery | FR-004, SC-003, SC-007 | CATALOG.md exists, linked, 100% discoverable | ✅ |
| 3. Quality Audit | FR-005-007, SC-004-005 | All 12 specs audited, 8 dimensions, remediation plan | ✅ |
| 4. Maintenance Procedures | FR-009-011, SC-006 | MAINTENANCE.md complete, non-technical, governance authority clear | ✅ |
| 5. Numbering Strategy | FR-012, SC-009 | Predictable numbering, sequential, historical traceability | ✅ |
| 6. End-to-End Governance | All FRs, All SCs | Complete system operational, workflow integrated | ✅ |

---

## Next Steps After Validation

Once all scenarios pass:

1. **Implementation Phase**: Execute tasks from `tasks.md` to create CATALOG.md, MAINTENANCE.md, and audit report
2. **Stakeholder Review**: Governance team reviews and approves procedures
3. **Production Rollout**: Activate procedures; use MAINTENANCE.md for ongoing spec management
4. **Compliance Tracking**: Monitor quality metrics and numbering compliance going forward

---

**Quickstart Validation Guide**: 1.0 | **Date**: 2026-09-16 | **Author**: Claude Haiku 4.5
