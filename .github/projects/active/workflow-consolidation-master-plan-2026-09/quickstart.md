---
file_type: quickstart
title: "Workflow Consolidation Refactoring — Quickstart Validation Guide"
description: "Step-by-step guide to validate workflow consolidation work"
---

# Quickstart Validation Guide — Workflow Consolidation Refactoring

## Prerequisites

- ✅ Access to `.github` repository
- ✅ Git installed locally
- ✅ Understanding of GitHub workflow files (`.yml`)
- ✅ Ability to review directory structure and documentation
- ✅ No breaking changes to production workflows

---

## Phase 1 Validation: Backup & Archive (Sep 16-30)

### Setup

```bash
# Check out the refactoring branch
git fetch origin refactor/workflow-consolidation-and-archiving
git checkout refactor/workflow-consolidation-and-archiving

# Verify branch naming compliance
git branch -m refactor/workflow-consolidation-and-archiving
# Should show: refactor/workflow-consolidation-and-archiving ✓
```

### Test 1: Archive Directory Structure

**Objective:** Verify all 62 workflows are archived in proper directory structure

**Command:**
```bash
# List archived workflows by category
find .github/workflows/archived/2026-09-11 -type f -name "*.yml" | sort

# Expected output: 62 workflow files organized by:
# - labeling/ (9 files)
# - validation/ (12 files)
# - documentation/ (8 files)
# - issue-management/ (10 files)
# - pr-management/ (7 files)
# - testing/ (8 files)
# - ci-cd/ (8 files)
# - utilities/ (8 files)
```

**Validation:**
```bash
# Count workflows in archive (should be 62)
find .github/workflows/archived/2026-09-11 -name "*.yml" -type f | wc -l
# Expected: 62 ✓

# Verify no workflows in main directory match archived list
ls -la .github/workflows/*.yml | wc -l
# Should only show 14 core workflows (if Phase 1 moving only)
```

**✅ Pass:** All 62 workflows present in archive, organized by category  
**❌ Fail:** Missing workflows, incorrect directory structure, files in wrong category

---

### Test 2: Consolidation Mapping Document

**Objective:** Verify consolidation mapping is complete and accurate

**Command:**
```bash
# Check mapping document exists
ls -la .github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md
# Should exist ✓

# Verify all 76 workflows are listed
grep -E "^\|.*\.yml" .github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md | wc -l
# Expected: 76 rows (1 per workflow)
```

**Validation Checklist:**
- [ ] `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` exists
- [ ] All 62 archived workflows listed
- [ ] All 14 core workflows listed
- [ ] Each row has mapping to Phase 2 consolidated workflow
- [ ] Feature coverage documented for each mapping
- [ ] Timeline shows when Phase 2 replacement ready

**✅ Pass:** Mapping complete, accurate, and well-documented  
**❌ Fail:** Missing workflows, inaccurate mappings, incomplete documentation

---

### Test 3: Archive Documentation

**Objective:** Verify all archive supporting documentation exists

**Command:**
```bash
# Check all archive docs exist
ls -la .github/workflows/archived/2026-09-11/
# Should show:
# - README.md
# - ARCHIVED_WORKFLOWS_MANIFEST.md
# - RESTORE.md
# - labeling/ directory
# - validation/ directory
# - (other category directories)

# Verify README exists and has content
wc -l .github/workflows/archived/2026-09-11/README.md
# Expected: > 20 lines ✓
```

**Validation Checklist:**
- [ ] `.github/workflows/archived/2026-09-11/README.md` exists (index & navigation)
- [ ] `.github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md` exists
- [ ] `.github/workflows/archived/2026-09-11/RESTORE.md` exists with procedures
- [ ] `.github/workflows/archived/INDEX.md` exists (multi-year tracking)
- [ ] Each category subdirectory has category-specific README

**Document Content Validation:**
```bash
# Check README content
grep -q "Archive" .github/workflows/archived/2026-09-11/README.md && echo "✓" || echo "✗"
grep -q "restore" .github/workflows/archived/2026-09-11/RESTORE.md && echo "✓" || echo "✗"
grep -q "manifest" .github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md && echo "✓" || echo "✗"
```

**✅ Pass:** All documentation exists, is complete, and contains expected content  
**❌ Fail:** Missing files, incomplete content, or broken references

---

### Test 4: Restore Procedures

**Objective:** Verify workflow restoration procedures work

**Command:**
```bash
# Test restore for a single workflow
# (Don't actually restore; just verify command syntax)
WORKFLOW=".github/workflows/archived/2026-09-11/labeling/labeling.yml"
if [ -f "$WORKFLOW" ]; then
  echo "✓ Workflow exists at $WORKFLOW"
else
  echo "✗ Workflow missing: $WORKFLOW"
fi

# Test restore documentation clarity
cat .github/workflows/archived/2026-09-11/RESTORE.md | head -20
# Should show clear restore instructions
```

**Validation Checklist:**
- [ ] RESTORE.md includes command-line restore procedures
- [ ] RESTORE.md includes Git restore procedures
- [ ] Rollback decision criteria documented
- [ ] Estimated rollback time documented (< 30 min)
- [ ] Examples provided for common restore scenarios

**Restore Command Examples (verify in RESTORE.md):**
```bash
# Individual workflow restore
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > .github/workflows/labeling.yml

# All workflows from archive
git checkout refactor/workflow-consolidation-and-archiving -- .github/workflows/archived/2026-09-11/
```

**✅ Pass:** Restore procedures documented clearly and procedurally sound  
**❌ Fail:** Missing procedures, unclear instructions, or commands don't work

---

### Test 5: AUTOMATION.md Update

**Objective:** Verify main automation documentation updated

**Command:**
```bash
# Check AUTOMATION.md mentions new architecture
grep -q "consolidated workflow" .github/docs/AUTOMATION.md && echo "✓ Found consolidation reference" || echo "✗ Missing"

# Check AUTOMATION.md mentions workflow count reduction
grep -q "76\|14" .github/docs/AUTOMATION.md && echo "✓ Found workflow counts" || echo "✗ Missing"

# Check AUTOMATION.md links to consolidation mapping
grep -q "WORKFLOW_CONSOLIDATION_MAPPING" .github/docs/AUTOMATION.md && echo "✓ Found mapping link" || echo "✗ Missing"
```

**Validation Checklist:**
- [ ] AUTOMATION.md reflects new 14-workflow architecture
- [ ] Links to consolidation mapping document
- [ ] Mentions archiving of 62 workflows
- [ ] Adds timeline for Phase 2 & Phase 3
- [ ] Consolidation project links included

**✅ Pass:** AUTOMATION.md updated with new architecture and links  
**❌ Fail:** Missing updates, broken links, or outdated references

---

## Phase 1 PR Validation

### Test 6: GitHub PR Structure

**Objective:** Verify PR follows `type:refactor` template

**Command:**
```bash
# Check PR branch name
git rev-parse --abbrev-ref HEAD
# Expected: refactor/workflow-consolidation-and-archiving ✓
```

**Validation Checklist (Review in GitHub):**
- [ ] PR title: `refactor: consolidate workflow archive and mapping — Phase 1 prep`
- [ ] Labels include: `type:refactor`, `status:needs-review`, `priority:normal`, `area:automation`
- [ ] Related issues linked (Epic + sub-issues)
- [ ] Changelog section completed
- [ ] Summary explains Phase 1 scope
- [ ] Test plan section completed
- [ ] All checklist items addressed

**Expected PR Stats:**
```
Files changed: ~70+  (62 archived workflows + 4 new docs)
Additions: ~2000+   (archive structure + documentation)
Deletions: ~0       (files moved, not deleted)
```

**✅ Pass:** PR follows refactor template, all fields complete, meets standards  
**❌ Fail:** Template incomplete, missing labels, or documentation gaps

---

## Integration Validation (Phase 1 Complete)

### Test 7: GitHub Issue Creation

**Objective:** Verify epic and sub-issues created

**Command:**
```bash
# Verify GitHub epic exists (check GitHub UI or API)
# Epic issue: [Epic] Workflow Consolidation Initiative 2026-Q4
# Expected issues: 5 sub-tasks (type:refactor)
#   1. Backup & Archive Workflows
#   2. Create Consolidation Mapping
#   3. Archive Documentation
#   4. Update Main Automation Docs
#   5. Create GitHub Epic + Planning
```

**Validation Checklist:**
- [ ] Epic issue created with type:epic label
- [ ] 5 sub-issues created with type:refactor label
- [ ] All issues linked to epic (parent-child relationship)
- [ ] All issues added to project board
- [ ] Timeline & milestones set

**Issue Links to Verify:**
```
Epic #XXXX
├── Sub-issue #YYYY: Backup & Archive
├── Sub-issue #ZZZZ: Consolidation Mapping
├── Sub-issue #AAAA: Archive Documentation
├── Sub-issue #BBBB: Update Automation Docs
└── Sub-issue #CCCC: Create Epic + Planning
```

**✅ Pass:** All issues created, linked, and properly labeled  
**❌ Fail:** Missing issues, broken links, or incorrect labels

---

## Phase 1 Success Criteria

✅ **Phase 1 Complete When:**

- ✅ All 62 workflows archived to `.github/workflows/archived/2026-09-11/`
- ✅ 8 subdirectories created (by category)
- ✅ Consolidation mapping document complete (all 76 workflows)
- ✅ Archive README, manifest, restore procedures created
- ✅ Main AUTOMATION.md updated
- ✅ GitHub epic + 5 sub-issues created
- ✅ PR follows `type:refactor` template
- ✅ All validation tests pass
- ✅ PR approved by tech lead
- ✅ PR merged to develop branch

---

## Running All Validation Tests

**All-in-One Validation Script:**

```bash
#!/bin/bash
set -e

echo "=== Phase 1 Validation Suite ==="

# Test 1: Archive structure
echo "✓ Test 1: Archive Directory Structure"
find .github/workflows/archived/2026-09-11 -name "*.yml" | wc -l | grep "62"

# Test 2: Mapping document
echo "✓ Test 2: Consolidation Mapping Document"
test -f .github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md

# Test 3: Archive docs
echo "✓ Test 3: Archive Documentation"
test -f .github/workflows/archived/2026-09-11/README.md
test -f .github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md
test -f .github/workflows/archived/2026-09-11/RESTORE.md

# Test 4: AUTOMATION.md
echo "✓ Test 4: AUTOMATION.md Update"
grep -q "consolidated" .github/docs/AUTOMATION.md

# Test 5: Branch name
echo "✓ Test 5: Branch Naming"
git rev-parse --abbrev-ref HEAD | grep -q "refactor/workflow-consolidation"

echo ""
echo "✅ All Phase 1 validation tests passed!"
```

Save as `.github/scripts/validate-phase1.sh` and run:
```bash
bash .github/scripts/validate-phase1.sh
```

---

## Related Documentation

- **Master Plan:** [`WORKFLOW_CONSOLIDATION_MASTER_PLAN.md`](./WORKFLOW_CONSOLIDATION_MASTER_PLAN.md)
- **Implementation Plan:** [`PHASE_1_IMPLEMENTATION_PLAN.md`](./PHASE_1_IMPLEMENTATION_PLAN.md)
- **Data Model:** [`data-model.md`](./data-model.md)
- **Spec:** [`.github/specs/workflow-consolidation-2026-q4.spec.md`](../../specs/workflow-consolidation-2026-q4.spec.md)

---

**Quickstart Version:** 1.0  
**Last Updated:** Sep 11, 2026  
**For:** Phase 1 (Backup & Archive) Validation
