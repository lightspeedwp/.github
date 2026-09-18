---
title: "Changelog System Consolidation & Audit — Complete Implementation Prompt"
description: "Comprehensive prompt for consolidating changelog agents, skills, workflows, and auditing the current CHANGELOG.md"
created: 2026-09-03
updated: 2026-09-03
---

# Changelog System Consolidation & Audit — Complete Implementation Prompt

## Executive Summary

This document provides a detailed, copy/paste-ready prompt for:

1. **Consolidating changelog agents & specs** — Merging multi-file agent (`agents/changelog/`) and spec agent (`.github/agents/changelog.agent.md`)
2. **Creating shared changelog skill** — Portable skill for org-wide use in `skills/changelog-automation/`
3. **Auditing & updating active projects** — Linking issues to project docs and creating openspec documents
4. **Validating CHANGELOG.md** — Ensuring all merged PRs have entries with correct format and links
5. **Addressing v1.0.0 release issues** — Understanding why changelog was corrupted and preventing future issues
6. **Consolidating workflows & validation** — Merging duplicate changelog workflows into agentic workflow

---

## Part 1: Issues & Problems Discovered

### Problem 1: Duplicate Agent Implementations

**Current State:**
- Multi-file portable agent: `agents/changelog/` (changelog.agent.js + includes/)
- Spec agent: `.github/agents/changelog.agent.md` (GitHub-native spec)
- Both define similar validation gates, entry format requirements, and task workflows
- Maintenance burden: changes must be made in both places or risk divergence

**Impact:**
- Higher maintenance cost
- Risk of spec/implementation drift
- Confusion about which is authoritative
- Inconsistent versioning (v1.0 in portable agent vs v1.0 in spec agent)

**Solution Needed:**
- Single source of truth for changelog agent behavior
- Clear separation between portable agent (agents/changelog/) and GitHub-native spec (.github/agents/)
- Spec agent should reference portable agent implementation
- Both should be kept in sync via shared validation tests

---

### Problem 2: Multiple Changelog Workflows

**Current State:**
- `.github/workflows/changelog.yml` — Basic workflow (status unclear)
- `.github/workflows/changelog-management.yml` — Primary changelog workflow (8.3KB)
- `.github/workflows/changelog-safety-audit.yml` — Safety validation workflow (5.0KB)
- Each has different purposes but overlapping validation logic

**Impact:**
- Duplicate validation logic across workflows
- Inconsistent behavior between workflows
- Unclear which workflow is authoritative
- Hard to maintain three separate workflows

**Solution Needed:**
- Consolidate into single agentic workflow using GitHub's agentic workflow features
- Clear separation of concerns (validation vs. management vs. audit)
- Single validation engine used by all workflows
- Deprecation path for redundant workflows

---

### Problem 3: Spec Agent & Multi-File Agent Divergence

**Current State:**
- Spec Agent: 599 lines of constraints, validation rules, and task workflows
- Multi-File Agent: JavaScript implementation with 7-layer validation
- Both implement "three-tier validation" but with different details
- Spec agent mentions "Phase 2" constraints (audit logging) but multi-file agent implementation differs

**Impact:**
- Agents don't fully align
- Constraints in spec agent may not be enforced in portable agent
- Phase 2 write protection mentioned in spec but unclear if implemented in portable agent
- Pre-commit hook mentioned but location/implementation unclear

**Solution Needed:**
- Align spec agent constraints with portable agent implementation
- Clear documentation of what's implemented vs. what's planned
- Update both spec and implementation to reflect Phase 2 constraints

---

### Problem 4: CHANGELOG.md Validation & Audit Issues (from 2026-07-29 audit)

**Current Issues:**
- D3: Non-standard types exist (`### Documentation`, `### Performance`) — not in Keep a Changelog 1.1.0
- D9: 4 tagged releases have no changelog entry (v0.2.1, v0.5.1, v0.7.0, v1.0.0)
- D10: 2 versions documented but never tagged (0.6.0, 0.1.0); dates disagree with tags
- Two outstanding validator errors:
  - "GitHub Workflows Consolidation Initiative — Phase 1A" references Epic instead of PR
  - "GitHub Actions workflow hardening" references issues (#1093, #1096, #1099, #1100) as PRs but they're issues with no actual PR link

**Additional Issues Discovered:**
- 34 warnings from validator (need investigation)
- v1.0.0 release had changelog corrupted multiple times by AI (needs root cause analysis)
- Not all recent merged PRs have changelog entries
- PR entries lack consistent link format to associated issues
- Validator not wired into CI (`checks.yml` runs `npm test` which doesn't include `validate:changelog`)

**Solution Needed:**
- Fix all outstanding validator errors (2 errors, 34 warnings)
- Audit all PRs merged to develop since v1.0.0
- Create missing changelog entries for merged PRs
- Ensure all entries have PR + issue links in correct format
- Add `validate:changelog` to CI pipeline
- Investigate v1.0.0 corruption and prevent recurrence

---

### Problem 5: v1.0.0 Release Changelog Corruption

**Reported Issue:**
> "Unfortunately in the last v1.0.0 release the changelog was wiped out multiple times by AI"

**Unknown Root Cause:**
- Why was changelog wiped out?
- How many times? When?
- What triggered it?
- Did AI agent constraints fail?
- Were guards/safeguards bypassed?

**Potential Issues:**
- CLAUDE.md or AGENTS.md may have incorrect constraints
- Changelog agent may not have had proper write protection
- Pre-commit hook may not have been enforced
- Release workflow may have allowed unsafe operations

**Solution Needed:**
- Audit CLAUDE.md and AGENTS.md for conflicts or missing constraints
- Verify Phase 2 write protection is fully implemented and enforced
- Verify pre-commit hook blocks invalid writes
- Review release workflow safety gates
- Implement audit logging to track all modifications

---

### Problem 6: Missing Shared Changelog Skill

**Current State:**
- No dedicated changelog skill in `skills/` folder
- Changelog operations scattered across scripts, workflows, agents
- No org-wide, reusable skill for changelog operations
- Users/agents must reference multiple files to understand changelog operations

**Impact:**
- No single entry point for changelog operations across organization
- Difficult for other projects to adopt changelog practices
- Skill marketplace can't discover changelog capabilities
- No standardized skill interface

**Solution Needed:**
- Create `skills/changelog-automation/` with:
  - `SKILL.md` (entrypoint with role declaration, overview, rules, examples)
  - Portable implementation files
  - Test suite with 100% coverage
  - Documentation
- Make skill reusable across organization
- Update changelog agent to reference skill
- Register skill in `SKILL_REGISTRY.json`

---

### Problem 7: Active Project Documentation Gaps

**Project 1: changelog-automation-hardening**
- Status: Phase 4 Active (per README.md updated 2026-07-24)
- Issues: #1275, #1272, #1314, #1316–#1319
- OPENSPEC.md: Only 470 bytes (minimal content)
- Needs: Link to related GitHub issues, updated status, clear Phase 4 deliverables

**Project 2: changelog-audit-2026-08-25**
- Status: Phase 3 In Progress (per README.md updated 2026-08-28)
- Issues: #2382 (main), #2412, #2414
- Missing: OPENSPEC.md file entirely
- Needs: Create comprehensive openspec, link to issues, update Phase 3 deliverables

**Solution Needed:**
- Update both README.md files with issue links and current status
- Create comprehensive OPENSPEC.md for both projects
- Ensure issues have up-to-date descriptions linking back to projects
- Verify all issue labels are prefixed correctly (type:*, status:*, etc.)

---

## Part 2: Detailed Implementation Steps

### Step 1: Create Shared Changelog Skill

**File to Create:** `skills/changelog-automation/SKILL.md`

The skill should include:

```markdown
---
name: Changelog Automation
description: Portable skill for managing Keep a Changelog 1.1.0 changelogs with validation, formatting, and release integration
file_type: skill
category: automation
version: 1.0.0
created_date: 2026-09-03
author: LightSpeed Team
status: active
tags:
  - changelog
  - keep-a-changelog
  - automation
  - validation
---

# Changelog Automation Skill

## Role

You are the **Changelog Automation Specialist**. Automate changelog management using the **Keep a Changelog 1.1.0** standard, enforce validation rules, manage changelog entries, and ensure release-ready state.

## General Rules

1. **Entry Format:** All entries must follow: `- **Title** — Description. ([PR #N](url), [#M](issue-url))`
2. **Validation Gates:**
   - Gate 1: Entry format (title <60 chars, description <150 chars, em-dash separator, PR link required)
   - Gate 2: Changelog structure ([Unreleased] exists, sections in order, no duplicates)
   - Gate 3: Release readiness ([Unreleased] has entries, no empty sections, versions sorted)
3. **Sections (in order):** Added, Fixed, Changed, Removed, Deprecated, Security
4. **Keep a Changelog 1.1.0:** Always follow the official standard
5. **Write Protection:** Pre-commit hook validates all changes; Phase 2 audit logging tracks modifications
6. **Testing:** All changes must pass validation gates before committing

## Detailed Guidance

### When Validating an Entry

1. Check title is bold and <60 characters
2. Verify em-dash (—) separator with spaces
3. Ensure description is <150 characters
4. Confirm PR link is present and correct format
5. Verify issue link format if present
6. Check entry is user-facing (not test-only, internal refactor, docs-only)
7. Run validation script: `npm run validate:changelog`
8. Report pass/fail with specific errors

### When Adding an Entry

1. Validate entry format (rules above)
2. Determine correct section (Added, Fixed, Changed, etc.)
3. Add to [Unreleased] under correct section header
4. Maintain alphabetical order if applicable
5. Validate full changelog structure
6. Run: `npm run validate:changelog`
7. Commit with clear message

### When Preparing Release

1. Validate [Unreleased] section
2. Verify all entries have correct sections
3. Bump version: `[Unreleased]` → `[X.Y.Z] — YYYY-MM-DD`
4. Create new [Unreleased] section
5. Generate release notes from entries
6. Validate new structure
7. Run full validation
8. Commit: `docs: Prepare changelog for vX.Y.Z release`

## Examples

### Valid Entry ✅

```markdown
- **Changelog Manager agent** — Validates and manages changelog entries with Keep a Changelog 1.1.0 compliance. ([PR #2342](https://github.com/lightspeedwp/.github/pull/2342), [#2340](https://github.com/lightspeedwp/.github/issues/2340))
```

### Invalid Entry ❌

```markdown
- Added new changelog agent script file
```

**Issues:**
- Not bold
- No em-dash separator
- No PR link
- Describes "what" not "why"
- Too vague

## Validation Scripts

```bash
# Validate changelog entries
npm run validate:changelog

# Run all validators
npm run validate:all

# Audit changelog modifications
npm run audit:changelog
```

## Key Resources

- **Keep a Changelog 1.1.0:** https://keepachangelog.com/en/1.1.0/
- **Spec Agent:** `.github/agents/changelog.agent.md`
- **Portable Agent:** `agents/changelog/changelog.agent.js`
- **Changelog:** `CHANGELOG.md`
- **Guidelines:** `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md`

## Related Work

- **Release Process:** `docs/RELEASE_PROCESS.md`
- **Semantic Versioning:** `docs/VERSIONING.md`
- **Automation Governance:** `docs/AUTOMATION_GOVERNANCE.md`

---

Generated by [Claude Code](https://claude.ai/code)
```

**Implementation Files to Create/Reference:**
- `skills/changelog-automation/changelog-automation.js` (portable implementation)
- `skills/changelog-automation/__tests__/changelog-automation.test.js` (test suite with 100% coverage)
- `skills/changelog-automation/README.md` (usage guide)

---

### Step 2: Update Active Project Documentation

#### Project 2A: changelog-automation-hardening

**File:** `.github/projects/active/changelog-automation-hardening/README.md`

Update to include:

1. **Issue Links Section** (add after Quick Links):
```markdown
## 📌 Tracking Issues

**Epic:** [#1271](https://github.com/lightspeedwp/.github/issues/1271) — Changelog Automation Hardening

**Phase 1–3 Completed:**
- [#1275](https://github.com/lightspeedwp/.github/issues/1275) — Fix section header corruption
- [#1272](https://github.com/lightspeedwp/.github/issues/1272) — Rebuild lost history (40+ PRs)
- [#1273](https://github.com/lightspeedwp/.github/issues/1273) — Define rules & guidelines
- [#1314](https://github.com/lightspeedwp/.github/issues/1314) — Phase 2 completion

**Phase 4 Active:**
- [#1316](https://github.com/lightspeedwp/.github/issues/1316) — Automated PR-to-Changelog Linking
- [#1317](https://github.com/lightspeedwp/.github/issues/1317) — Maintainer Review Checklist
- [#1318](https://github.com/lightspeedwp/.github/issues/1318) — Enhanced Merge Safeguards
- [#1319](https://github.com/lightspeedwp/.github/issues/1319) — Integration Testing & Monitoring
```

2. **Create OPENSPEC.md** (in same directory):
```markdown
---
title: "Changelog Automation Hardening — OpenSpec"
specification_status: complete
implementation_status: in-progress
phase: 4
target_completion: 2026-08-14
---

# OpenSpec: Changelog Automation Hardening

## Specification Status: ✅ COMPLETE

**Phases 1–3 deliverables:**
- Automated changelog workflow bug fix (Phase 1)
- Lost history recovery from 40+ PRs (Phase 2)
- Rules & contributor guidelines defined (Phase 3)

## Implementation Status: 🔄 IN PROGRESS

**Phase 4 active** — Validation & guardrails automation

### Phase 4A: Automated PR-to-Changelog Linking
- **Issue:** #1316
- **Status:** In Progress
- **Deliverable:** `scripts/workflows/changelog/auto-link-pr.cjs`
- **Acceptance:** PRs auto-linked on merge when criteria met

### Phase 4B: Maintainer Review Checklist
- **Issue:** #1317
- **Status:** In Progress
- **Deliverable:** `CHANGELOG_REVIEW_CHECKLIST.md`
- **Acceptance:** 10-item checklist published

### Phase 4C: Enhanced Merge Safeguards
- **Issue:** #1318
- **Status:** In Progress
- **Deliverable:** Hardened `merge-entries.cjs` with validation, backup, verification, rollback
- **Acceptance:** Pre-write validation, post-write verification, rollback instructions

### Phase 4D: Integration Testing & Monitoring
- **Issue:** #1319
- **Status:** In Progress
- **Deliverable:** Monitor 10 PRs for zero automation failures
- **Acceptance:** All entries auto-linked, no validation failures

## Success Criteria

- ✅ Zero broken links in CHANGELOG.md
- ✅ Zero verbose entries (all <150 chars)
- ✅ Zero non-changelog entries
- ✅ 100% PR coverage (every entry linked)
- ✅ Zero duplicates in [Unreleased]
- ✅ Zero automation failures on 10 test PRs

## Related Files

- Project README: [README.md](./README.md)
- Phase 4 Kickoff: [PHASE_4_KICKOFF.md](./PHASE_4_KICKOFF.md)
- Guidelines: [CHANGELOG_GUIDELINES.md](./CHANGELOG_GUIDELINES.md)
- Planning: [PROJECT_PLAN.md](./PROJECT_PLAN.md)

---
```

#### Project 2B: changelog-audit-2026-08-25

**File:** `.github/projects/active/changelog-audit-2026-08-25/README.md`

Update to include **Issue Links Section** similar to above (issues #2382, #2412, #2414)

**File to Create:** `.github/projects/active/changelog-audit-2026-08-25/OPENSPEC.md`

```markdown
---
title: "Changelog Safety Audit — OpenSpec"
specification_status: complete
implementation_status: in-progress
phase: 3
target_completion: 2026-09-11
---

# OpenSpec: Changelog Safety Audit & Automation System

## Specification Status: ✅ COMPLETE

**Phase 1–2 complete, Phase 3 in progress**

### Phase 1: Validation Framework (✅ COMPLETE)
- 7-layer validation system implemented
- 21 regression test cases
- Schema-based validation (AJV)
- Merged to main

### Phase 2: Write Protection & Audit Logging (✅ COMPLETE)
- Pre-commit hook validation
- Changelog audit logging system
- Git history extraction
- Merged to develop (PR #2411)

## Implementation Status: 🔄 IN PROGRESS

### Phase 3: Integration, Testing & Release

**Objectives:**
- Cross-repository integration testing
- CI/CD pipeline hardening
- Performance benchmarking
- Edge case handling & recovery
- Operations & maintenance documentation
- Production deployment

**Timeline:**
- Week 1: Integration & CI hardening (2026-08-28 – 2026-09-03)
- Week 2: Performance & edge cases (2026-09-04 – 2026-09-10)
- Week 3: Docs & deployment (2026-09-04 – 2026-09-11)

**Deliverables (Planned):**
- Cross-repo integration tests
- CI/CD hardening
- Performance benchmarks
- Edge case handling
- Operations documentation (CHANGELOG_OPERATIONS.md)
- Troubleshooting guide (CHANGELOG_TROUBLESHOOTING.md)
- Deployment checklist (CHANGELOG_DEPLOYMENT_CHECKLIST.md)

## Success Criteria

- ✅ Phase 1: 7-layer validation implemented & tested
- ✅ Phase 2: Write protection & audit logging deployed to develop
- ⏳ Phase 3: System production-ready & deployed to 80%+ of repositories

## Related Files

- Project README: [README.md](./README.md)
- Phase 3 Plan: [PHASE-3-IMPLEMENTATION-PLAN.md](./PHASE-3-IMPLEMENTATION-PLAN.md)
- Phase 2 Audit: [CHANGELOG_AUDIT_REPORT_2026-08-27-PHASE2.md](./CHANGELOG_AUDIT_REPORT_2026-08-27-PHASE2.md)

---
```

---

### Step 3: Create GitHub Issues for Audit Items

**Issues to Create or Update:**

#### Issue 1: Audit Errors & Warnings in CHANGELOG.md (2 errors, 34 warnings)

```
Title: Changelog Validation Errors — Fix 2 Outstanding Errors & 34 Warnings
Type: type:task
Area: area:documentation
Priority: priority:important
Status: status:needs-triage
Labels: meta:needs-audit, changelog-validation

Description:

## Current State

`npm run validate:changelog` reports **2 critical errors** and **34 warnings**:

### Critical Errors (2)

1. **GitHub Workflows Consolidation Initiative — Phase 1A** — Opens with Epic reference `([Epic #1227](…)` but requires PR reference format `([PR #...](…))`
   - Need to supply correct PR reference
   - Or restructure entry to lead with PR

2. **GitHub Actions workflow hardening** — References issues #1093, #1096, #1099, #1100 as PR references but they are issues with no actual PR link
   - Need to determine the actual PR that should be linked
   - Or restructure entry to clarify issue references

### Warnings (34)

- List of all warnings from latest validation run
- Patterns to identify

## Acceptance Criteria

- [ ] 2 critical errors resolved
- [ ] All warnings investigated and categorized
- [ ] `npm run validate:changelog` shows 0 errors
- [ ] Validator added to CI pipeline
- [ ] All changes documented in changelog entry

## Related

- #2382 (Phase 2: Audit Logging)
- Audit report: `.github/reports/active/changelog-keepachangelog-audit-2026-07-29.md`
```

#### Issue 2: Audit Missing Changelog Entries for Merged PRs

```
Title: Audit Merged PRs on develop — Add Missing Changelog Entries
Type: type:task
Area: area:documentation
Priority: priority:high
Status: status:needs-triage
Labels: meta:needs-audit, meta:needs-changelog

Description:

## Scope

Audit all PRs merged to `develop` branch since v1.0.0 release (2026-08-24) to ensure:

1. Each PR has a changelog entry in CHANGELOG.md [Unreleased] section
2. Entries follow Keep a Changelog 1.1.0 format
3. All entries have PR link + issue link (where applicable)
4. Entries are in correct section (Added, Fixed, Changed, etc.)

## Acceptance Criteria

- [ ] List all merged PRs since v1.0.0
- [ ] Identify PRs without changelog entries
- [ ] Create missing entries for each PR
- [ ] Verify all entries pass validation
- [ ] Link this issue in each changelog entry

## Related

- Changelog agent: `.github/agents/changelog.agent.md`
- Validation rules: `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md`
```

#### Issue 3: Investigate v1.0.0 Release Changelog Corruption

```
Title: Root Cause Analysis — v1.0.0 Release Changelog Corruption
Type: type:task
Area: area:security
Priority: priority:critical
Status: status:needs-triage
Labels: meta:needs-audit, security

Description:

## Problem

The v1.0.0 release (2026-08-24) experienced **multiple changelog corruptions by AI agents**. The exact nature, frequency, and cause are unknown.

## Questions to Answer

1. **When did corruption occur?** (date/time)
2. **How many times?** (count of corruption events)
3. **What was corrupted?** (sections deleted, entries lost, formatting broken)
4. **What caused it?** (agent operation, workflow step, manual edit)
5. **Were safeguards bypassed?** (pre-commit hook, validation gates)
6. **What should have prevented it?** (what failed)

## Investigation Steps

1. Review release workflow execution logs (release.yml Phase 1–7 gates)
2. Check git history for CHANGELOG.md during release window
3. Audit agent logs for changelog operations
4. Review CLAUDE.md and AGENTS.md constraints (conflicts?)
5. Verify Phase 2 write protection was enforced
6. Check pre-commit hook bypass events (--no-verify usage)

## Acceptance Criteria

- [ ] Root cause identified
- [ ] Timeline of corruption events documented
- [ ] Safeguard failure points identified
- [ ] Prevention plan created
- [ ] Follow-up issues created if needed

## Related

- Project: `.github/projects/active/changelog-automation-hardening/`
- Project: `.github/projects/active/changelog-audit-2026-08-25/`
- CLAUDE.md: `CLAUDE.md` (constraints)
- AGENTS.md: `AGENTS.md` (AI rules)
```

#### Issue 4: Consolidate Changelog Workflows

```
Title: Consolidate Changelog Workflows into Single Agentic Workflow
Type: type:task
Area: area:automation
Priority: priority:high
Status: status:needs-triage
Labels: meta:needs-audit

Description:

## Current State

**Three separate changelog workflows** with overlapping logic:

1. `.github/workflows/changelog.yml` (654 bytes) — Basic workflow
2. `.github/workflows/changelog-management.yml` (8.3 KB) — Primary workflow
3. `.github/workflows/changelog-safety-audit.yml` (5.0 KB) — Audit workflow

## Issues

- Duplicate validation logic
- Inconsistent behavior
- Unclear which is authoritative
- Hard to maintain

## Solution

Consolidate into **single agentic workflow** using GitHub's agentic workflow features:

1. Design unified workflow with clear phases
2. Consolidate validation logic into single engine
3. Maintain separation of concerns (validation vs. management vs. audit)
4. Update spec agent to reference unified workflow
5. Deprecate redundant workflows
6. Document workflow phases and gates

## Acceptance Criteria

- [ ] Unified workflow designed
- [ ] Validation logic consolidated
- [ ] All 3 workflows replaced by 1
- [ ] Behavior identical or improved
- [ ] Documentation updated
- [ ] Tests passing

## Related

- Spec Agent: `.github/agents/changelog.agent.md`
- Workflows: `.github/workflows/changelog*.yml`
```

---

### Step 4: Verify & Audit CHANGELOG.md Against Merged PRs

Create a script to:

1. List all PRs merged to `develop` since v1.0.0
2. Cross-reference with CHANGELOG.md [Unreleased] entries
3. Identify missing entries
4. Validate entry format for all entries
5. Generate report

**Command to verify:**
```bash
# Validate changelog
npm run validate:changelog

# List recent merged PRs
git log --oneline --merges develop...v1.0.0 | head -50

# Check for missing entries
npm run audit:changelog
```

---

### Step 5: Create Consolidated Audit Report

**File to Create:** `.github/projects/active/changelog-agent-audit-consolidated/AUDIT_REPORT_2026-09-03.md`

This report should consolidate:
- Issues from both hardening and audit projects
- Current Phase 4/3 status
- v1.0.0 corruption findings
- Validator errors and warnings
- Missing entries from recent PRs
- Recommendations for next steps

---

## Part 3: Copy/Paste Prompts for Each Task

### Prompt 1: Create Changelog Automation Skill

```
Create a comprehensive, portable `Changelog Automation` skill in `skills/changelog-automation/` that can be used org-wide for managing Keep a Changelog 1.1.0 changelogs.

The skill should include:

1. **SKILL.md** (entrypoint) — Role, General Rules, Detailed Guidance with examples
2. **changelog-automation.js** — Portable implementation
3. **__tests__/changelog-automation.test.js** — Test suite with 100% coverage
4. **README.md** — Usage guide with examples

Key requirements:
- Keep a Changelog 1.1.0 compliance
- Entry format: `- **Title** — Description. ([PR #N](url), [#M](issue-url))`
- Validation gates: format, structure, release-readiness
- Write protection via pre-commit hook
- Audit logging for all modifications
- Sections: Added, Fixed, Changed, Removed, Deprecated, Security

Reference:
- `.github/agents/changelog.agent.md` for constraints
- `agents/changelog/` for portable implementation
- `docs/CHANGELOG_AUTOMATION.md` for documentation
- `skills/` folder structure for pattern

Acceptance criteria:
- Skill is reusable across organization
- 100% test coverage
- All validation rules enforced
- Documentation complete
- Registered in SKILL_REGISTRY.json
```

### Prompt 2: Update Active Project Documentation & Create OpenSpec

```
Update both active changelog projects with:

1. **changelog-automation-hardening:**
   - Update README.md with Issue Links Section (link issues #1275, #1272, #1314, #1316–#1319 to Epic #1271)
   - Create OPENSPEC.md with specification status (complete) and implementation status (Phase 4 in-progress)
   - Update Phase 4 status (current date 2026-09-03, target completion 2026-08-14 is past due)

2. **changelog-audit-2026-08-25:**
   - Update README.md with Issue Links Section (link issues #2382, #2412, #2414)
   - Create OPENSPEC.md with specification status (complete) and implementation status (Phase 3 in-progress)
   - Update Phase 3 timeline to reflect current progress
   - Add checklist of Phase 3 deliverables

Both projects should:
- Link to related GitHub issues with clear status
- Have comprehensive OpenSpec showing specification/implementation status
- Show current progress and target completion dates
- Reference related documentation files
- Follow .github/projects/active/ structure

Use:
- `.github/projects/active/changelog-automation-hardening/README.md` as template
- `.github/projects/active/changelog-audit-2026-08-25/README.md` as reference
- Similar projects' OPENSPEC.md files as pattern
```

### Prompt 3: Audit & Fix Changelog Validation Errors

```
Audit and fix the 2 critical errors in CHANGELOG.md reported by `npm run validate:changelog`:

**Error 1:** "GitHub Workflows Consolidation Initiative — Phase 1A" entry
- Opens with Epic reference instead of PR reference
- Need to find correct PR or restructure entry
- Investigate commit history to find actual PR number

**Error 2:** "GitHub Actions workflow hardening" entry
- References issues #1093, #1096, #1099, #1100 as PRs
- These are issues, not PRs
- Need to find actual PR that should be referenced
- Or clarify relationship between issues and PR

Also investigate all 34 warnings and categorize them.

Acceptance criteria:
- 2 critical errors resolved
- `npm run validate:changelog` shows 0 errors
- All warnings categorized
- Changes documented in changelog entry
```

### Prompt 4: Consolidate Changelog Agents & Specs

```
Consolidate the changelog agent implementations to reduce duplication:

Current state:
1. **Portable multi-file agent:** `agents/changelog/changelog.agent.js` + includes/
2. **GitHub spec agent:** `.github/agents/changelog.agent.md`

Problems:
- Both define similar validation gates and entry format rules
- Maintenance burden if changes needed in both
- Risk of spec/implementation drift
- Unclear which is authoritative

Solution:
1. Ensure portable agent in `agents/changelog/` is complete implementation
2. Update spec agent in `.github/agents/changelog.agent.md` to reference portable agent
3. Align all constraints and validation rules between spec and implementation
4. Update version numbers consistently
5. Document relationship between portable and spec agent
6. Create shared test suite that validates both

Key files to update:
- `agents/changelog/README.md` (document portable agent purpose)
- `.github/agents/changelog.agent.md` (add reference to portable agent)
- Validation tests (ensure they work for both)
- Workflow files (reference correct agent)

Acceptance criteria:
- Single source of truth for validation logic
- Spec agent references portable agent
- All constraints enforced in both
- No duplicate documentation
- Tests validate both implementations
```

---

## Part 4: Implementation Order & Timeline

### Week 1 (by 2026-09-10)

**Priority 1:**
1. Create changelog automation skill (`.

tasks/changelog-automation/`)
2. Fix 2 critical changelog validation errors
3. Update active project README files with issue links
4. Create OPENSPEC.md for both projects

**Priority 2:**
1. Audit merged PRs since v1.0.0
2. Add missing changelog entries
3. Consolidate changelog agents

### Week 2 (by 2026-09-17)

**Priority 3:**
1. Investigate v1.0.0 corruption root cause
2. Fix all 34 validation warnings
3. Consolidate 3 workflows into 1 agentic workflow
4. Create consolidated audit report

**Priority 4:**
1. Update CLAUDE.md and AGENTS.md with findings
2. Create GitHub issues for follow-up work
3. Document prevention measures

---

## Part 5: Success Metrics

### Immediate (by 2026-09-10)

- ✅ Changelog automation skill created and registered
- ✅ 2 critical validation errors fixed
- ✅ Both active projects have OpenSpec documents
- ✅ Issue links added to project documentation

### Short-term (by 2026-09-17)

- ✅ All merged PRs since v1.0.0 have changelog entries
- ✅ 0 validation errors (was 2)
- ✅ All validation warnings categorized and addressed
- ✅ Root cause of v1.0.0 corruption understood

### Medium-term (by 2026-09-30)

- ✅ Single agentic changelog workflow in place
- ✅ Portable and spec agents fully consolidated
- ✅ 100% test coverage on changelog scripts
- ✅ Changelog validation integrated into CI pipeline

### Long-term (by 2026-10-15)

- ✅ All LightSpeed repositories using changelog automation
- ✅ Zero changelog corruption incidents in releases
- ✅ Phase 4 of hardening project complete
- ✅ Phase 3 of audit project complete

---

## References

**Active Projects:**
- `.github/projects/active/changelog-automation-hardening/`
- `.github/projects/active/changelog-audit-2026-08-25/`

**Agent Specs:**
- `.github/agents/changelog.agent.md`
- `agents/changelog/changelog.agent.js`

**Workflows:**
- `.github/workflows/changelog.yml`
- `.github/workflows/changelog-management.yml`
- `.github/workflows/changelog-safety-audit.yml`

**Documentation:**
- `docs/CHANGELOG_AUTOMATION.md`
- `docs/CHANGELOG_CONTRIBUTOR_CHECKLIST.md`
- `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md`

**Audit Reports:**
- `.github/reports/active/changelog-keepachangelog-audit-2026-07-29.md`
- `.github/reports/audits/CHANGELOG_AUDIT_REPORT_2026-08-27-PHASE2.md`

**CHANGELOG:**
- `CHANGELOG.md` (Keep a Changelog 1.1.0 format)

---

**Generated by [Claude Code](https://claude.ai/code)**  
**Session:** 2026-09-03
