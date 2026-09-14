# Phase 1: Validation Guide & Acceptance Criteria

**Date**: 2026-09-14  
**Status**: Phase 1 output  
**Output**: Runnable validation process and acceptance criteria

---

## Overview

This guide defines how to validate that the governance audit and refactoring have successfully met all requirements from the specification and research phases.

---

## Pre-Refactoring Validation (Baseline)

Before refactoring begins, establish the current state as a baseline:

### ✅ Baseline Checklist

**Duplication Baseline**:
- [ ] Confirm "Label Creation Governance" section exists at AGENTS.md lines 209–252
- [ ] Confirm duplicate exists at AGENTS.md lines 285–338
- [ ] Note: After refactoring, only one section should remain

**Reference Baseline**:
- [ ] Document current list of broken/outdated references (see research.md VER-001)
- [ ] Record file paths that don't exist
- [ ] List references marked as "legacy" or "pending migration"

**Conflict Baseline**:
- [ ] Note current scope issues (e.g., script org rules in AGENTS.md)
- [ ] Record terminology inconsistencies across files
- [ ] List contradictory guidance (if any)

**Branch Naming Baseline**:
- [ ] Note any branches using forbidden prefixes (current count: 3)
- [ ] Verify current branch naming section is in CLAUDE.md
- [ ] Confirm 34 branch types are documented

---

## Post-Refactoring Validation

After refactoring tasks complete, run these validation scenarios:

### Validation Scenario 1: Reference Integrity ✅

**Goal**: All file path references are valid or properly documented as migrated.

**Steps**:

```bash
# 1. Extract file references from refactored CLAUDE.md
grep -E "^\[.*\]\(\.?/?.*\.md\)" CLAUDE.md | tee /tmp/claude-refs.txt

# 2. Extract file references from refactored AGENTS.md
grep -E "^\[.*\]\(\.?/?.*\.md\)" AGENTS.md | tee /tmp/agents-refs.txt

# 3. Verify each file exists or is documented as migrated
# For each reference, verify:
#   - File exists in repository, OR
#   - Clear documentation explains migration/reason for removal

# 4. Check that documentation links work
git status  # All files should be in repository
```

**Acceptance Criteria**:
- ✅ No broken links in governance files
- ✅ Every file reference resolves to valid repository path
- ✅ Migrations documented with rationale
- ✅ External links (if any) documented as non-repository references

**Pass/Fail Signature**:
```
Validation 1 Status: PASS ✅
Broken References: 0
Verified References: [COUNT]
Documented Migrations: [COUNT]
```

---

### Validation Scenario 2: Duplication Elimination ✅

**Goal**: No duplicate sections remain; each governance topic has single source of truth.

**Steps**:

```bash
# 1. Search for duplicate section markers
echo "Searching for 'Label Creation Governance' occurrences..."
grep -n "## Label Creation Governance" AGENTS.md

# Expected output: 0 or 1 occurrence (only one should remain)
# If 2+ occurrences found, validation FAILS

# 2. Verify consolidation retained all unique information
# Check that consolidated section includes:
#   - All required examples (correct + incorrect labels)
#   - Validation checklist items
#   - References to both source locations (for traceability)

# 3. For script organization rules (moved from AGENTS.md)
echo "Searching for script organization rules..."
grep -n "scripts/" AGENTS.md

# Expected: Either removed from AGENTS.md, or minimal reference with link to new location
```

**Manual Review**:
- [ ] Read consolidated "Label Creation Governance" section (single occurrence)
- [ ] Verify all guidance from original sections is present
- [ ] Confirm no content loss
- [ ] Verify section references are clear and unambiguous

**Acceptance Criteria**:
- ✅ "Label Creation Governance" appears exactly 1 time in AGENTS.md
- ✅ Script organization rules removed from AGENTS.md (moved to CLAUDE.md or instructions/)
- ✅ All unique content from duplicates is preserved
- ✅ Cross-file duplication eliminated or minimized (CLAUDE.md vs. AGENTS.md)

**Pass/Fail Signature**:
```
Validation 2 Status: PASS ✅
Duplicate Sections Found: 0
Content Consolidation: 100% retention
```

---

### Validation Scenario 3: Consistency & Conflict Resolution ✅

**Goal**: No contradictory or conflicting guidance; clear authority hierarchy.

**Manual Review**:
- [ ] Read all branch naming guidance in CLAUDE.md
- [ ] Read all branch naming guidance in AGENTS.md
- [ ] Verify guidance aligns (same rules, no conflicts)
- [ ] Confirm AGENTS.md references CLAUDE.md (or consolidates completely)
- [ ] Check technology-agnostic guidance (no WordPress-specific, framework-specific, language-specific rules in organization-wide guidance)

**Checks**:

```bash
# 1. Verify branch naming consistency
echo "Branch types in CLAUDE.md:"
grep "^| \`" CLAUDE.md | wc -l

echo "Branch types in AGENTS.md:"
grep "^| \`" AGENTS.md | wc -l

# Both should reference same 34 types (or AGENTS.md should have summary only)

# 2. Search for potentially framework-specific guidance
echo "Checking for WordPress-specific guidance in AGENTS.md:"
grep -i "wordpress" AGENTS.md | head -5

# Should be none (or only in role declaration, not in core guidance)
```

**Acceptance Criteria**:
- ✅ No contradictory guidance across files
- ✅ Clear authority hierarchy established (constitution > governance > instructions)
- ✅ Branch naming guidance is consistent
- ✅ Technology-agnostic (universal across all project types)
- ✅ Terminology consistent across files (same concept always named same way)

**Pass/Fail Signature**:
```
Validation 3 Status: PASS ✅
Contradictions Found: 0
Authority Hierarchy Clear: Yes
Technology-Agnostic: Yes
```

---

### Validation Scenario 4: Specification-First Workflow Documentation ✅

**Goal**: Governance files clearly document the spec-first workflow (branch → spec → draft PR → review → merge).

**Manual Review**:
- [ ] Read CLAUDE.md section on Git Workflow
- [ ] Verify workflow phases are documented:
  - Phase 0: Create branch from develop following naming convention
  - Phase 1: Write specification in `specs/` directory
  - Phase 2: Run planning, tasks, implementation
  - Phase 3: Create draft PR (user triggers, not automatic)
  - Phase 4: Review and respond to feedback
  - Phase 5: Merge to develop
- [ ] Confirm success criteria for each phase are measurable
- [ ] Check that guidance prevents premature PR creation

**Checks**:

```bash
# 1. Verify SpecKit workflow is mentioned
grep -n "SpecKit\|spec.md\|spec-first" CLAUDE.md | head -10

# Should show workflow is documented

# 2. Verify branch creation is documented
grep -n "git fetch\|git checkout\|origin/develop" CLAUDE.md | head -5

# Should show correct branch workflow (fetch develop, create branch from develop)

# 3. Verify no automatic PR creation guidance
grep -n "create PR\|draft PR\|gh pr create" CLAUDE.md

# Should only appear in context of "when you're ready" (not automatic)
```

**Acceptance Criteria**:
- ✅ Specification-first workflow clearly documented
- ✅ Phase boundaries clear (when to branch, when to spec, when to PR)
- ✅ User controls when to create draft PR (not automatic)
- ✅ Workflow aligns with constitution principle
- ✅ Success criteria for each phase are defined

**Pass/Fail Signature**:
```
Validation 4 Status: PASS ✅
Workflow Phases Documented: 5/5
User Control Over PR Creation: Yes
Constitution Alignment: Yes
```

---

### Validation Scenario 5: Branch Naming Enforcement ✅

**Goal**: Branch naming rules are clear, actionable, enforceable, and prevent violations.

**Manual Review**:
- [ ] Read CLAUDE.md § "Branch Naming — CRITICAL"
- [ ] Count documented branch types (should be 34)
- [ ] Verify all types have examples
- [ ] Confirm forbidden prefixes are prominently marked
- [ ] Check that rationale explains WHY incorrect names matter
- [ ] Verify validation command is provided

**Examples to Verify**:
- [ ] ✅ `audit/governance-files-refactor` is valid (audit type)
- [ ] ✅ `feat/user-authentication` is valid (feat type)
- [ ] ❌ `claude/governance-refactor` is forbidden (claude prefix)
- [ ] ❌ `copilot/something` is forbidden (copilot prefix)
- [ ] ❌ `feature/something` is invalid (should be `feat/`)

**Checks**:

```bash
# 1. Verify validation script exists and works
npm run validate:branch-name -- --branch audit/governance-files-refactor

# Expected: "Branch 'audit/governance-files-refactor' matches the repository branching strategy."

# 2. Test that invalid branch is rejected
npm run validate:branch-name -- --branch claude/governance-refactor

# Expected: Error message (forbidden prefix)

# 3. Count documented types
grep "^| \`" CLAUDE.md | wc -l

# Expected: 34 (or thereabouts)
```

**Acceptance Criteria**:
- ✅ 34+ branch types documented with examples
- ✅ Forbidden prefixes clearly marked with explanation
- ✅ Validation command works and rejects forbidden prefixes
- ✅ Rationale explains impact of incorrect names
- ✅ Rules are clear enough that mistakes become unlikely

**Pass/Fail Signature**:
```
Validation 5 Status: PASS ✅
Branch Types Documented: 34
Forbidden Prefixes Clear: Yes
Validation Script Works: Yes
Rules Prevent Mistakes: Yes
```

---

## Overall Acceptance Checklist

### Pre-Refactoring Baseline ✅
- [ ] Baseline state documented
- [ ] Current issues identified
- [ ] Metrics recorded

### Post-Refactoring Validation ✅

| Scenario | Criteria Met? | Pass/Fail |
|----------|---------------|-----------|
| Reference Integrity | All references valid or documented | ☐ PASS / ☐ FAIL |
| Duplication Elimination | Zero duplicates remain | ☐ PASS / ☐ FAIL |
| Consistency & Conflicts | No contradictions, clear authority | ☐ PASS / ☐ FAIL |
| Workflow Documentation | Spec-first workflow clear | ☐ PASS / ☐ FAIL |
| Branch Naming Enforcement | Rules clear, validation works | ☐ PASS / ☐ FAIL |

### Final Approval Gate

✅ **REFACTORING COMPLETE** when:
- All 5 validation scenarios PASS
- Zero broken references remain
- Zero duplicate sections remain
- No contradictory guidance
- Workflow documentation is clear
- Branch naming rules are enforceable
- @ashley reviews and approves

---

## Remediation If Validation Fails

If any validation scenario fails:

1. **Document the failure** (which criteria not met, evidence)
2. **Identify root cause** (what in refactoring caused the issue)
3. **Plan remediation** (specific edits needed to fix)
4. **Re-run validation** (confirm fix works)
5. **Re-test all scenarios** (confirm no regression)

---

## Sign-Off

**Refactoring Validated By**: _________________  
**Date**: _________________  
**Notes**: _________________

**Approved By (@ashley)**: _________________  
**Date**: _________________  
**Notes**: _________________

---

## Next Steps After Validation

✅ Phase 1 complete: data-model.md + quickstart.md created  
➡️ Phase 2 next: Run `/speckit-tasks` to decompose into 96 concrete tasks  
➡️ Phase 3 follow: Execute implementation tasks  
➡️ Final step: @ashley reviews and merges refactored governance files
