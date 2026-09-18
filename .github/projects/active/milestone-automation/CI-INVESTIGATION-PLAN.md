---
title: Phase 2 CI Investigation Plan
description: Detailed breakdown of CI checks 11-28 and investigation strategy
type: plan
file_type: documentation
status: active
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - automation
  - phase-2
  - ci-investigation
  - implementation-plan
---

# Phase 2 CI Investigation Plan

**Date Created:** 2026-09-03  
**Target Completion:** 2026-09-10  
**Related Issue:** [#2678](https://github.com/lightspeedwp/.github/issues/2678) — Phase 2 Follow-Up: CI Investigation (Checks 11-24)  
**Related PR:** [#2640](https://github.com/lightspeedwp/.github/pull/2640) (Merged)  

---

## Overview

This document details the strategy for investigating and resolving the remaining 18/28 CodeRabbit findings. These are primarily CI check failures that require investigation, debugging, and potentially infrastructure changes.

**Current Status:** 10/28 resolved (36%); 18/28 pending (64%)

---

## Investigation Phases

### Phase A: Documentation & Schema Validation (Checks 11-18)
**Estimated Effort:** 4-6 hours  
**Complexity:** Medium  
**Blocker:** No  

#### Check #11: Validate README Structure

**Issue:** Frontmatter schema validation complex; not all type/file_type combinations valid

**Investigation Steps:**
1. Locate frontmatter schema definition in `.github/scripts/validation/`
2. Extract valid type/file_type combinations
3. Audit all 24 milestone-automation project files
4. Document findings in CI-SCHEMA-FINDINGS.md
5. Fix non-compliant frontmatter across files

**Files to Audit:**
- All `.md` files in `.github/projects/active/milestone-automation/`
- Check for `file_type` field presence and validity
- Verify `owners` field uses YAML list syntax (not string)

**Expected Outcome:**
- Documentation of valid frontmatter schema
- All 24 project files compliant
- frontmatter validation passing

---

#### Check #12: Validate Mermaid Diagrams

**Issue:** Mermaid diagrams missing accessibility attributes (accTitle, accDescr)

**Investigation Steps:**
1. Search for all Mermaid diagrams in project files
2. Identify diagrams missing accTitle/accDescr
3. Add accessibility attributes to each diagram
4. Validate diagram syntax

**Files Affected:**
- OPENSPEC.md (contains Mermaid diagrams)
- PLANNING.md (may contain diagrams)
- ROADMAP.md (may contain diagrams)

**Required Attributes:**
```mermaid
graph LR
  accTitle: Diagram Title (required)
  accDescr: Detailed description of diagram purpose and flow (required)
```

**Expected Outcome:**
- All Mermaid diagrams have accTitle and accDescr
- Accessibility validation passing
- diagrams remain visually correct

---

#### Check #13: Unified Labeling, Status, Type

**Issue:** Label family prefixes not properly applied per `.github/labels.yml`

**Investigation Steps:**
1. Review canonical labels in `.github/labels.yml`
2. Audit all labels applied to milestone-automation issues
3. Check for non-canonical labels (bare labels without family prefix)
4. Document label audit results
5. Create label application guide for project

**Canonical Label Families:**
- `type:*` (task, bug, feature, design, etc.)
- `status:*` (needs-triage, in-progress, done, etc.)
- `priority:*` (critical, important, normal, minor)
- `area:*` (automation, ci, testing, etc.)
- `meta:*` (needs-changelog, has-pr, duplicate, etc.)

**Related Issue:** [#1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Governance Enforcement

**Expected Outcome:**
- All labels on milestone-automation issues use canonical family prefixes
- No bare labels (e.g., "bug", "feature", "urgent")
- Label audit report documented

---

#### Check #14: Validate Project-Issue Linking

**Issue:** Issue reference format not validated

**Investigation Steps:**
1. Review ISSUE-LINKS.md format and structure
2. Validate all issue links point to valid GitHub issues
3. Check for orphaned issue references
4. Verify bidirectional linking (issues link back to project files)
5. Document linking standards

**Standard Format:**
```markdown
**Issue:** [#2678](https://github.com/lightspeedwp/.github/issues/2678)  
**Title:** Issue Title  
**Status:** 🟡 Open  
**Relationship:** How this issue relates to milestone-automation  
```

**Expected Outcome:**
- All issue links valid and bidirectional
- Issue references standardized across project
- Linking validation passing

---

#### Check #15: Auto-regenerate Documentation

**Issue:** Script-based documentation generation not verified

**Investigation Steps:**
1. Locate auto-doc generation script(s) in `.github/scripts/`
2. Understand script purpose and trigger conditions
3. Run script manually on milestone-automation files
4. Compare generated output with current documentation
5. Document regeneration process

**Expected Outcome:**
- Documentation generation script identified and documented
- Manual run successful
- Auto-generation process validated

---

#### Check #16: OpenSpec Validation

**Issue:** OPENSPEC.md schema and completeness not validated

**Investigation Steps:**
1. Review OpenSpec schema requirements
2. Audit OPENSPEC.md structure against schema
3. Verify all required sections present
4. Validate code examples and syntax
5. Check completeness against system architecture

**Schema Validation:**
- Title and description present
- Frontmatter valid (type: spec, file_type: documentation)
- All major sections included
- References and cross-links valid

**Expected Outcome:**
- OPENSPEC.md schema compliant
- Completeness validated against architecture
- OpenSpec validation passing

---

#### Check #17: FOLLOW-UP-FIXES Tracker

**Issue:** All 28 items not properly tracked

**Investigation Steps:**
1. Verify all 28 CodeRabbit findings present in FOLLOW-UP-FIXES.md
2. Check status markers (✅, ⏳, ❌) accurate
3. Validate section organization (Critical, Important, Polish, CI)
4. Ensure all items have clear descriptions
5. Update tracker with current status

**Tracking Status:**
- ✅ Completed: Items 1-10
- ⏳ Pending: Items 11-28
- Implementation tracking to be added

**Expected Outcome:**
- All 28 findings tracked with clear status
- Tracker format standardized
- Real-time status maintained

---

#### Check #18: Phase Status Synchronization

**Issue:** README, STATUS, FOLLOW-UP-FIXES alignment incomplete

**Investigation Steps:**
1. Compare dates across STATUS.md, README.md, FOLLOW-UP-FIXES.md
2. Verify completion counts consistent (e.g., 10/28)
3. Check phase descriptions aligned
4. Validate progress markers (%) consistent
5. Ensure cross-references current

**Alignment Checklist:**
- [ ] Date fields synchronized (2026-09-03)
- [ ] Finding counts consistent (10/28 resolved, 18/28 remaining)
- [ ] Phase descriptions match across files
- [ ] Progress percentages consistent
- [ ] Cross-references current and valid

**Expected Outcome:**
- All status documents synchronized
- Single source of truth for progress
- Alignment validation passing

---

### Phase B: Workflow Automation Checks (Checks 19-24)
**Estimated Effort:** 6-8 hours  
**Complexity:** High  
**Blocker:** No  

#### Check #19: add-and-sync Workflow

**Issue:** Label workflow automation state unclear

**Investigation Steps:**
1. Locate add-and-sync workflow definition
2. Understand trigger conditions and automation
3. Verify workflow runs on milestone-automation PRs/issues
4. Check workflow logs for errors
5. Document workflow behavior

**Related Issue:** [#1524](https://github.com/lightspeedwp/.github/issues/1524)

**Expected Outcome:**
- Workflow automation state documented
- Trigger conditions clear
- Integration with milestone-automation verified

---

#### Check #20: Progress Phase on PR Event

**Issue:** Issue phase tracking automation unclear

**Investigation Steps:**
1. Understand phase tracking system
2. Verify automation trigger on PR events
3. Check issue #1852 phase updates
4. Document phase transition logic
5. Validate automation runs correctly

**Related Issue:** [#1852](https://github.com/lightspeedwp/.github/issues/1852)

**Expected Outcome:**
- Phase tracking automation verified
- Phase transitions tracked correctly
- Integration working end-to-end

---

#### Check #21: reviewer Workflow

**Issue:** Review assignment workflow state unclear

**Investigation Steps:**
1. Locate reviewer workflow automation
2. Understand review assignment rules
3. Verify workflow runs on PRs related to milestone-automation
4. Check review request logs
5. Document assignment logic

**Related Issue:** [#1673](https://github.com/lightspeedwp/.github/issues/1673)

**Expected Outcome:**
- Review workflow behavior documented
- Assignment rules clear
- Integration working correctly

---

#### Check #22: Standard Labeling, Status, Type

**Issue:** Label application consistency issues

**Investigation Steps:**
1. Audit all issues and PRs related to milestone-automation
2. Check label family prefixes consistent
3. Verify status labels applied correctly
4. Validate type labels match issue type
5. Create label application guide

**Expected Outcome:**
- All labels consistent and canonical
- Label application guide created
- Labeling validation passing

---

#### Check #23: Secrets Scanning

**Issue:** Security scanning configuration incomplete

**Investigation Steps:**
1. Locate secrets scanning configuration
2. Verify scanning enabled on repository
3. Check for secrets in milestone-automation files
4. Review scanning logs
5. Document configuration and results

**Expected Outcome:**
- Secrets scanning verified working
- No secrets found in project files
- Security validation passing

---

#### Check #24: Workflow Event Routing

**Issue:** Event filtering and trigger validation incomplete

**Investigation Steps:**
1. Review workflow event filtering rules
2. Verify correct events trigger workflows
3. Check for event misrouting
4. Validate trigger conditions
5. Document event routing logic

**Expected Outcome:**
- Event routing verified correct
- No misrouted events
- Workflow trigger validation passing

---

### Phase C: Infrastructure Upgrade (Checks 25-28)
**Estimated Effort:** 2-4 hours  
**Complexity:** Low  
**Blocker:** YES — Blocks all Node.js-dependent checks  

**CRITICAL:** Node.js must be upgraded to 24+ before these checks can run

#### Check #25: Node.js Version

**Current State:** Node 22  
**Required:** Node 24+  
**Blocker Impact:** npm ci fails, validation scripts timeout

**Steps:**
1. Request GitHub Actions runner upgrade to Node 24+
2. Update `.github/workflows/ci.yml` with `node-version: 24`
3. Test npm ci on Node 24+
4. Document requirement in README

**Timeline:** Expected 2026-09-04 to 2026-09-05

---

#### Checks #26-28: Dependent on #25

- Check #26: Dependencies (npm ci on Node 24+)
- Check #27: Script Execution (validation scripts on Node 24+)
- Check #28: Performance (baseline tests on Node 24+)

**Expected Timeline:** Run after Node.js upgrade complete

---

## Investigation Strategy

### Priority Order

1. **First:** Checks 11-18 (Documentation & Schema) — No blockers, can start immediately
2. **Second:** Checks 19-24 (Workflow Automation) — Requires understanding of automation systems
3. **Third:** Checks 25-28 (Infrastructure) — Blocked by Node.js upgrade, unblock and run

### Parallel Work

- Documentation checks (11-18) can run in parallel
- Workflow checks (19-24) can run after documentation is stable
- Infrastructure checks (25-28) require sequential upgrade then validation

### Documentation of Findings

Each check should result in:
- Investigation summary (what was checked)
- Findings (what was discovered)
- Root cause (why it failed)
- Resolution steps (how to fix)
- Validation (how to verify fix)

---

## Success Criteria

| Criterion | Target | Success |
|-----------|--------|---------|
| Checks 11-18 Passing | All 8 | ✅ All documentation validated |
| Checks 19-24 Passing | All 6 | ✅ All workflows verified |
| Checks 25-28 Passing | All 4 | ✅ All infrastructure checks pass |
| Total CodeRabbit Findings Resolved | 28/28 | ✅ 100% complete |
| CI Green | All checks | ✅ All workflows passing |
| Project Documentation Validated | 24/24 files | ✅ All compliant |

---

## Related Documents

- [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) — Detailed tracker of all 28 findings
- [PHASE-2-FOLLOWUP-SUMMARY.md](./PHASE-2-FOLLOWUP-SUMMARY.md) — Executive summary of follow-up work
- [ISSUE-LINKS.md](./ISSUE-LINKS.md) — GitHub issue cross-references
- [STATUS.md](./STATUS.md) — Phase 2 completion status
- [#2678](https://github.com/lightspeedwp/.github/issues/2678) — CI Investigation issue

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-03  
**Target Completion:** 2026-09-10  
**Status:** 🟡 Active — Ready for investigation
