---
title: "Implementation Copy/Paste Prompts — Ready to Use"
description: "Direct, copy-paste-ready prompts for Claude Code to implement changelog improvements"
date: 2026-09-03
file_type: "documentation"
type: "project-documentation"
status: "active"
owner: "lightspeedwp/maintainers"
---

# Implementation Copy/Paste Prompts

Use these prompts directly with Claude Code to implement specific improvements.

---

## Prompt 1: Fix CHANGELOG.md Validation Errors

**Use this to:** Find and fix the 2 critical validation errors

```
You need to fix 2 critical errors in CHANGELOG.md that are blocking changelog validation from being added to CI.

## Critical Errors to Fix

### Error 1: "GitHub Workflows Consolidation Initiative — Phase 1A" Entry
- Problem: Opens with Epic reference `([Epic #1227](...)` but validator requires PR reference format
- Location: CHANGELOG.md in [Unreleased] → Added section
- Validator requirement: All entries must have `([PR #N](...)` format

### Error 2: "GitHub Actions workflow hardening" Entry
- Problem: References issues #1093, #1096, #1099, #1100 as PR links but they are ISSUES not PRs
- The 4 issues are unrelated to "workflow hardening" — they're "rewrite Agent" issues
- Validator requirement: All entries must have actual PR reference with `[PR #` format

## Investigation Steps

1. **For Error 1:**
   - Search CHANGELOG.md for "GitHub Workflows Consolidation Initiative"
   - Use git history to find PRs related to workflow consolidation
   - Command: `git log --all --oneline --grep="consolidation" | head -20`
   - Find the PR that implements Phase 1A of this initiative

2. **For Error 2:**
   - Search CHANGELOG.md for "GitHub Actions workflow hardening"
   - Use git history to find PRs related to workflow hardening
   - Command: `git log --all --oneline --grep="hardening" | head -20`
   - Determine if the referenced issues are correct or if wrong PR was cited

## Acceptance Criteria

- [ ] Error 1: Correct PR reference found and entry updated to format `- **Title** — Description. ([PR #N](url))`
- [ ] Error 2: Either (a) correct PR reference found and entry updated, or (b) entry restructured to clarify relationship to issues
- [ ] Run `npm run validate:changelog` and confirm 0 errors for both entries
- [ ] Document findings in commit message

## References

- CHANGELOG.md location: `/home/user/.github/CHANGELOG.md`
- Validator: `npm run validate:changelog`
- Audit report: `.github/reports/active/changelog-keepachangelog-audit-2026-07-29.md`
- Spec agent: `.github/agents/changelog.agent.md`

## Related

- Issue #2382 — Phase 2 Audit Logging
- Project: `.github/projects/active/changelog-audit-2026-08-25/`
```

---

## Prompt 2: Create Changelog Automation Skill

**Use this to:** Create a portable, reusable changelog skill in `skills/changelog-automation/`

```
Create a comprehensive, reusable Changelog Automation Skill that can be used organization-wide.

## Deliverables

Create the following in `skills/changelog-automation/`:

1. **SKILL.md** (entrypoint)
   - Frontmatter with metadata (name, description, file_type, status, etc.)
   - Role section: "You are the Changelog Automation Specialist..."
   - General Rules (6–8 rules covering entry format, validation, testing, etc.)
   - Detailed Guidance section with 3–5 subsections:
     - "When Validating an Entry" (8 steps)
     - "When Adding an Entry" (7 steps)
     - "When Preparing Release" (8 steps)
   - Examples (1 valid ✅ + 1 invalid ❌ entry with explanations)
   - Key validation scripts
   - Key resources (links to agent, portable implementation, docs)
   - Related work (release, versioning, automation docs)

2. **changelog-automation.js** (portable implementation)
   - Must provide functions: validateEntry(), validateChangelog(), addEntry(), processRelease()
   - Use validation logic from `agents/changelog/includes/changelogValidator.cjs`
   - Support Keep a Changelog 1.1.0 format
   - Entry format requirement: `- **Title** — Description. ([PR #N](url), [#M](issue-url))`
   - Export all functions for require()

3. **__tests__/changelog-automation.test.js** (100% coverage)
   - Test suite for changelog-automation.js
   - Cover all 4 functions with happy path + error cases
   - Test entry format validation (em-dash, PR link, lengths)
   - Test changelog structure validation
   - Test release processing (version bumping, date formatting)
   - Aim for >90% code coverage

4. **README.md** (usage guide)
   - Overview of what the skill does
   - Installation/import instructions
   - Function reference with examples for each:
     - validateEntry()
     - validateChangelog()
     - addEntry()
     - processRelease()
   - Integration patterns (how to use with workflows, CLI, other agents)

## Requirements

- Entry format MUST be: `- **Title** — Description. ([PR #N](url), [#M](issue-url))`
- Title constraint: <60 characters, bold
- Description constraint: <150 characters, 1–2 sentences
- Sections (in order): Added, Fixed, Changed, Removed, Deprecated, Security
- [Unreleased] section must exist
- No empty sections in [Unreleased]
- All entries must have PR links (issue links optional)
- Keep a Changelog 1.1.0 compliance required
- Semantic Versioning (SemVer) support

## References

- Agent spec: `.github/agents/changelog.agent.md`
- Portable agent: `agents/changelog/changelog.agent.js` + `includes/`
- Validation rules: `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md`
- Docs: `docs/CHANGELOG_AUTOMATION.md`
- Skills folder pattern: Check other skills like `skills/agent-creator/`

## Acceptance Criteria

- [ ] SKILL.md is complete and self-contained
- [ ] changelog-automation.js exports all 4 functions
- [ ] All functions work with Keep a Changelog 1.1.0
- [ ] Test suite has >90% coverage
- [ ] All tests passing
- [ ] README has usage examples for all functions
- [ ] Skill references spec agent and portable agent
- [ ] Can be registered in SKILL_REGISTRY.json

## After Completion

After creating the skill, you'll need to:
1. Register in `skills/SKILL_REGISTRY.json`
2. Update `.github/agents/changelog.agent.md` to reference the new skill
3. Update `agents/changelog/README.md` to reference the skill
```

---

## Prompt 3: Update Active Project Documentation & Create OpenSpec

**Use this to:** Update README files and create OpenSpec documents for both projects

```
Update documentation for two active changelog projects and create comprehensive OpenSpec documents.

## Project 1: changelog-automation-hardening

File: `.github/projects/active/changelog-automation-hardening/README.md`

### Updates Needed

1. Add Issue Links section after "Quick Links" section:
   ```markdown
   ## 📌 Tracking Issues
   
   **Epic:** [#1271](https://github.com/lightspeedwp/.github/issues/1271) — Changelog Automation Hardening
   
   **Phase 1–3 (Complete):**
   - [#1275](https://github.com/lightspeedwp/.github/issues/1275) — Fix section header corruption
   - [#1272](https://github.com/lightspeedwp/.github/issues/1272) — Rebuild lost history (40+ PRs)
   - [#1314](https://github.com/lightspeedwp/.github/issues/1314) — Phase 2 completion validation
   - [#1273](https://github.com/lightspeedwp/.github/issues/1273) — Define rules & guidelines
   
   **Phase 4 (Active):**
   - [#1316](https://github.com/lightspeedwp/.github/issues/1316) — Automated PR-to-Changelog Linking
   - [#1317](https://github.com/lightspeedwp/.github/issues/1317) — Maintainer Review Checklist
   - [#1318](https://github.com/lightspeedwp/.github/issues/1318) — Enhanced Merge Safeguards
   - [#1319](https://github.com/lightspeedwp/.github/issues/1319) — Integration Testing & Monitoring
   ```

2. Create `OPENSPEC.md` in same directory with:
   ```markdown
   ---
   title: "Changelog Automation Hardening — OpenSpec"
   specification_status: complete
   implementation_status: in-progress
   phase: 4
   target_completion: 2026-08-14
   note: "OVERDUE as of 2026-09-03 (20+ days past target)"
   ---
   
   # OpenSpec: Changelog Automation Hardening
   
   ## Specification: ✅ COMPLETE
   
   **Phases 1–3 complete:**
   - Phase 1: Automated changelog workflow bug fix
   - Phase 2: Lost history recovery from 40+ PRs
   - Phase 3: Rules & contributor guidelines defined
   
   See [README.md](./README.md) and [PROJECT_PLAN.md](./PROJECT_PLAN.md) for complete details.
   
   ## Implementation: 🔄 Phase 4 IN PROGRESS
   
   **Target Completion:** 2026-08-14 (⚠️ **OVERDUE** — Currently 2026-09-03, +20 days)
   
   ### Phase 4A: Automated PR-to-Changelog Linking
   - **Issue:** [#1316](https://github.com/lightspeedwp/.github/issues/1316)
   - **Status:** In Progress
   - **Deliverable:** Script to auto-link PRs to changelog on merge
   - **Acceptance:** PRs auto-linked when criteria met
   
   ### Phase 4B: Maintainer Review Checklist
   - **Issue:** [#1317](https://github.com/lightspeedwp/.github/issues/1317)
   - **Status:** In Progress
   - **Deliverable:** 10-item review checklist
   - **Acceptance:** Checklist documented and available to reviewers
   
   ### Phase 4C: Enhanced Merge Safeguards
   - **Issue:** [#1318](https://github.com/lightspeedwp/.github/issues/1318)
   - **Status:** In Progress
   - **Deliverable:** Hardened merge-entries.cjs with validation, backup, verification
   - **Acceptance:** Pre-write validation, post-write verification, rollback support
   
   ### Phase 4D: Integration Testing & Monitoring
   - **Issue:** [#1319](https://github.com/lightspeedwp/.github/issues/1319)
   - **Status:** In Progress
   - **Deliverable:** Monitor 10 PRs for zero automation failures
   - **Acceptance:** All entries auto-linked, no validation failures
   
   ## Success Criteria (Phase Completion)
   
   - [ ] All Phase 4 sub-tasks (#1316–#1319) completed
   - [ ] Zero broken links in CHANGELOG.md
   - [ ] Zero verbose entries (all <150 chars)
   - [ ] 100% PR coverage in [Unreleased]
   - [ ] Zero duplicates in [Unreleased]
   - [ ] 10 test PRs with zero automation failures
   
   ## Related Documentation
   
   - Project README: [README.md](./README.md)
   - Full Project Plan: [PROJECT_PLAN.md](./PROJECT_PLAN.md)
   - Phase 4 Kickoff: [PHASE_4_KICKOFF.md](./PHASE_4_KICKOFF.md)
   - Guidelines: [CHANGELOG_GUIDELINES.md](./CHANGELOG_GUIDELINES.md)
   
   ---
   ```

---

## Project 2: changelog-audit-2026-08-25

File: `.github/projects/active/changelog-audit-2026-08-25/README.md`

### Updates Needed

1. Add Issue Links section after "Project Overview":
   ```markdown
   ## 📌 Tracking Issues
   
   **Main Issue:** [#2382](https://github.com/lightspeedwp/.github/issues/2382) — Changelog Safety Audit & Automation (Phase 1–3)
   
   **Related Issues:**
   - [#2412](https://github.com/lightspeedwp/.github/issues/2412) — Phase 2 CI Validation Integration (separate work)
   - [#2414](https://github.com/lightspeedwp/.github/issues/2414) — PR Workflow Governance (separate work)
   ```

2. Create `OPENSPEC.md` in same directory with:
   ```markdown
   ---
   title: "Changelog Safety Audit — OpenSpec"
   specification_status: complete
   implementation_status: in-progress
   phase: 3
   target_completion: 2026-09-11
   timeline: "9 days to completion"
   ---
   
   # OpenSpec: Changelog Safety Audit & Automation System
   
   ## Specification: ✅ COMPLETE
   
   **Phases 1–2 complete:**
   - **Phase 1** (✅ 2026-08-XX): 7-layer validation framework with 21 test cases
   - **Phase 2** (✅ 2026-08-28): Write protection & audit logging with Phase 2 constraints
   
   ## Implementation: 🔄 Phase 3 IN PROGRESS
   
   **Target Completion:** 2026-09-11 (6 days remaining)
   
   ### Phase 3 Deliverables
   
   #### Week 1: Integration Testing & CI Hardening (2026-08-28 – 2026-09-03)
   - [ ] Cross-repository integration tests
   - [ ] CI/CD pipeline hardening
   - [ ] Schema validation hardening
   
   #### Week 2: Performance & Edge Cases (2026-09-04 – 2026-09-10)
   - [ ] Performance benchmarking & optimization
   - [ ] Edge case handling & recovery
   - [ ] Load testing validation
   
   #### Week 2-3: Documentation & Release Prep (2026-09-04 – 2026-09-11)
   - [ ] Operations & maintenance documentation (CHANGELOG_OPERATIONS.md)
   - [ ] Troubleshooting guide (CHANGELOG_TROUBLESHOOTING.md)
   - [ ] Deployment checklist (CHANGELOG_DEPLOYMENT_CHECKLIST.md)
   - [ ] Release preparation
   
   ## Success Criteria (Phase Completion)
   
   - [ ] Integration tests pass on 5+ repositories
   - [ ] CI validation completes in <30 seconds
   - [ ] Performance benchmarks meet targets
   - [ ] Zero unhandled edge cases
   - [ ] 95%+ code coverage
   - [ ] Comprehensive documentation complete
   - [ ] System production-ready
   
   ## Related Documentation
   
   - Project README: [README.md](./README.md)
   - Phase 3 Plan: [PHASE-3-IMPLEMENTATION-PLAN.md](./PHASE-3-IMPLEMENTATION-PLAN.md)
   - Phase 2 Audit: [CHANGELOG_AUDIT_REPORT_2026-08-27-PHASE2.md](./CHANGELOG_AUDIT_REPORT_2026-08-27-PHASE2.md)
   
   ---
   ```

## Acceptance Criteria

- [ ] README.md for both projects updated with Issue Links sections
- [ ] OPENSPEC.md created for changelog-automation-hardening
- [ ] OPENSPEC.md created for changelog-audit-2026-08-25
- [ ] All links are valid and point to correct issues
- [ ] Files formatted consistently with other projects in `.github/projects/active/`
- [ ] Both projects now have clear specification/implementation status tracking
```

---

## Prompt 4: Investigate v1.0.0 Changelog Corruption

**Use this to:** Root cause analysis of the v1.0.0 release corruption

```
Investigate and document the root cause of v1.0.0 release changelog corruption.

## Problem Statement

During the v1.0.0 release (released 2026-08-24), the CHANGELOG.md was "wiped out multiple times by AI agents". The exact nature, frequency, cause, and recovery process are unknown.

## Investigation Tasks

### Task 1: Git History Analysis
```bash
# Show all CHANGELOG.md changes in the 2-week window around v1.0.0
git log -p --all --since="2026-08-10" --until="2026-09-03" -- CHANGELOG.md | head -2000

# Check for commits with --no-verify (bypassed pre-commit hook)
git log --all --since="2026-08-10" --until="2026-09-03" --pretty=format:"%H %s" | grep -i "no-verify\|bypass\|skip"

# Show commits that modified CHANGELOG.md in release window
git log --oneline --all --since="2026-08-10" --until="2026-09-03" -- CHANGELOG.md
```

### Task 2: Release Workflow Analysis
- Check `.github/workflows/release.yml` execution logs for v1.0.0 release
- Look for:
  - When the workflow ran (date/time)
  - Which gates passed/failed
  - If any safety checks were skipped
  - Error messages from changelog validation
  - Changelog modifications during release

### Task 3: Agent Constraint Verification
Review CLAUDE.md and AGENTS.md for:
- Any changelog agent constraints that might have failed
- Conflicting rules about changelog modification
- Safety rules vs. automation rules
- Whether constraints would prevent "wiping out" changelog

Files to review:
- `/home/user/.github/CLAUDE.md` (Agent-specific rules)
- `/home/user/.github/AGENTS.md` (AI rules)
- `.github/agents/changelog.agent.md` (Changelog agent constraints)

### Task 4: Phase 2 Safety Mechanism Verification

Check if Phase 2 safeguards exist and are enforced:

```bash
# Check pre-commit hook installation
git config core.hooksPath

# Check if pre-commit hook exists and contains changelog validation
cat .github/hooks/pre-commit | grep -i changelog

# Check if audit log exists
ls -la .github/reports/audits/changelog-audit-log.md

# Check if audit log is being written to
tail -50 .github/reports/audits/changelog-audit-log.md
```

### Task 5: Timeline Reconstruction

Create timeline of v1.0.0 release:
1. When was release branch created?
2. When was v1.0.0 tag created?
3. What commits were included in release?
4. When did CHANGELOG.md corruptions occur?
5. How was it recovered?
6. What was the final state when v1.0.0 was published?

## Investigation Output

Document findings in a new file:
`.github/projects/active/v1.0.0-release-incident-analysis/ROOT_CAUSE_ANALYSIS.md`

### Report Should Include

1. **Timeline** — When corruption occurred, how many times, exact dates/times
2. **What was corrupted** — Sections deleted? Entries lost? Formatting broken?
3. **Root cause** — Was pre-commit bypassed? Were gates skipped? Did agent fail?
4. **Who/what caused it** — Manual intervention? Agent? Workflow step?
5. **What should have prevented it** — Which safeguard failed?
6. **Impact** — Was any data lost permanently? Was it recovered?
7. **Prevention** — What should be done to prevent recurrence?

## Acceptance Criteria

- [ ] Timeline of corruption events documented
- [ ] Root cause identified and documented
- [ ] Safeguard failure points identified
- [ ] Impact assessment completed
- [ ] Prevention plan created
- [ ] Findings shared with team
- [ ] Follow-up issues created if needed

## References

- Release workflow: `.github/workflows/release.yml`
- CLAUDE.md: `/home/user/.github/CLAUDE.md`
- AGENTS.md: `/home/user/.github/AGENTS.md`
- Changelog agent: `.github/agents/changelog.agent.md`
- Audit log: `.github/reports/audits/changelog-audit-log.md`
- v1.0.0 tag: `git show v1.0.0`

## Related

- Project: `.github/projects/active/changelog-automation-hardening/`
- Project: `.github/projects/active/changelog-audit-2026-08-25/`
```

---

## Prompt 5: Wire Changelog Validator into CI Pipeline

**Use this to:** Add changelog validation to CI checks

```
Add changelog validation to the CI pipeline so invalid changelog entries are caught before merge.

## Current State

- Validator exists: `npm run validate:changelog` ✓
- Validator is NOT in CI pipeline
- Not in `.github/workflows/checks.yml`
- Not in any blocking status checks
- Errors currently go undetected

## Required Changes

### 1. Update CI Pipeline

File: `.github/workflows/checks.yml`

Add new job or step:

```yaml
changelog-validation:
  name: Changelog Validation
  runs-on: ubuntu-latest
  if: contains(github.event.head_commit.modified, 'CHANGELOG.md') || github.event_name == 'pull_request'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version-file: '.nvmrc'
    - name: Install dependencies
      run: npm ci
    - name: Validate Changelog
      run: npm run validate:changelog
      continue-on-error: false
```

OR integrate into existing test job if preferred.

### 2. Make it a Required Status Check

- [ ] Add `changelog-validation` to required status checks in repo settings
- [ ] Set to "Required" (cannot be skipped)
- [ ] Only allow bypass with explicit `meta:no-changelog` label (with special permission)

### 3. Add GitHub Annotation for Better UX

Enhance the workflow to annotate errors:

```yaml
- name: Validate Changelog with Annotations
  run: |
    npm run validate:changelog > changelog-report.txt || {
      echo "::error::Changelog validation failed. See details below:"
      cat changelog-report.txt
      exit 1
    }
```

### 4. Test Locally First

Before committing, test that it works:

```bash
# Simulate validation
npm run validate:changelog

# Should exit 0 (success) if CHANGELOG.md is valid
# Should exit 1 (failure) if CHANGELOG.md has errors
```

## Requirements

- [ ] Validator runs on every PR that touches CHANGELOG.md
- [ ] Validator runs on every push to main/develop
- [ ] Failed validation = CI fails
- [ ] Developers see clear error messages
- [ ] Can be bypassed only with explicit label or approval
- [ ] No manual exemptions without audit trail

## Success Criteria

- [ ] Workflow runs successfully on test PR
- [ ] Failed validation is caught before merge
- [ ] Error messages guide developers to fix issues
- [ ] Status check appears in PR checks
- [ ] Required status check enforcement works

## References

- Validator script: `scripts/validation/validate-changelog.cjs`
- Current checks: `.github/workflows/checks.yml`
- Changelog agent: `.github/agents/changelog.agent.md`
```

---

## Prompt 6: Audit Merged PRs Since v1.0.0 and Add Missing Entries

**Use this to:** Find all PRs merged since v1.0.0 and ensure they have changelog entries

```
Audit all PRs merged to `develop` branch since v1.0.0 release (2026-08-24) to ensure:

1. Each PR has a changelog entry in CHANGELOG.md [Unreleased] section
2. Entry format follows Keep a Changelog 1.1.0 standard
3. All entries have PR link + issue link (where applicable)
4. Entries are in correct section (Added, Fixed, Changed, etc.)

## Steps

### Step 1: List All Merged PRs Since v1.0.0

```bash
# Show all commits merged into develop since v1.0.0 tag
git log --oneline --merges develop..v1.0.0 2>/dev/null || git log --oneline --merges --since="2026-08-24" develop

# Output will be in format:
# <hash> Merge pull request #NNNN from ...
# Extract PR numbers
git log --oneline --merges --since="2026-08-24" develop | grep -oP '#\d+' | sort -u
```

### Step 2: Cross-Reference with CHANGELOG.md

For each PR found:
1. Check if it's mentioned in CHANGELOG.md [Unreleased]
2. Verify entry format matches: `- **Title** — Description. ([PR #N](url), [#M](issue))`
3. Check title <60 chars, description <150 chars
4. Verify em-dash separator (—), not hyphen
5. Ensure PR link is correct format

### Step 3: Create Missing Entries

For each PR without a changelog entry:

1. Determine entry category (Added, Fixed, Changed, Removed, Deprecated, Security)
2. Extract PR title and description
3. Create entry in format: `- **Title** — Brief description. ([PR #N](url))`
4. Add to correct section in [Unreleased]
5. Add related issue link if applicable: `([PR #N](url), [#M](issue-url))`

### Step 4: Validate All Entries

```bash
# Run validator
npm run validate:changelog

# Should show 0 errors if all entries are correct
```

### Step 5: Document Findings

Create report in `.github/projects/active/changelog-audit-2026-08-25/`:

File: `PR_AUDIT_REPORT_2026-09-03.md`

```markdown
# PR Audit Report — August 24 – September 3

## Summary
- Total PRs merged: [N]
- PRs with existing entries: [N]
- Missing entries created: [N]
- Validation errors fixed: [N]

## PRs Processed

| PR # | Title | Status | Entry Type | Notes |
|------|-------|--------|-----------|-------|
| #NNNN | ... | ✅ Has entry | Added | — |
| #NNNN | ... | ✅ Added entry | Fixed | Was missing, created new |
...

## Validation Results

- Errors: 0
- Warnings: [N]
- Coverage: 100% (all merged PRs have entries)
```

## Acceptance Criteria

- [ ] All PRs merged since v1.0.0 identified
- [ ] All missing entries created
- [ ] All entries use correct format (title, em-dash, description, PR link)
- [ ] All entries in correct section (Added/Fixed/Changed/etc.)
- [ ] `npm run validate:changelog` shows 0 errors
- [ ] Audit report documenting work

## Key Entry Format

Entry format MUST be:

```markdown
- **Title** — Description. ([PR #1234](https://github.com/lightspeedwp/.github/pull/1234), [#5678](https://github.com/lightspeedwp/.github/issues/5678))
```

Requirements:
- Title: Bold, <60 chars, descriptive
- Em-dash (—) with spaces: ` — `
- Description: <150 chars, 1–2 sentences, explains "why" not "how"
- PR link: REQUIRED, format `([PR #N](full-url))`
- Issue link: Optional, format `([#N](full-url))`
- Bullets: Use `-`, not `*` or `+`

## References

- CHANGELOG.md: `/home/user/.github/CHANGELOG.md`
- Validator: `npm run validate:changelog`
- Guidelines: `.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md`
- Spec agent: `.github/agents/changelog.agent.md`
```

---

## How to Use These Prompts

1. **Pick the prompt** you want to use
2. **Copy the entire prompt text** (including code blocks)
3. **Open a new Claude Code session** or start fresh conversation
4. **Paste the prompt** exactly as written
5. **Let Claude Code implement** the changes
6. **Review and merge** the results

---

## Recommended Implementation Order

| Step | Prompt | Priority | Effort | Time |
|------|--------|----------|--------|------|
| 1 | Fix CHANGELOG.md Validation Errors | CRITICAL | 2–3h | Day 1 |
| 2 | Wire Validator into CI | HIGH | 1–2h | Day 1 |
| 3 | Investigate v1.0.0 Corruption | CRITICAL | 4–8h | Day 1–2 |
| 4 | Update Active Project Docs | MEDIUM | 2–3h | Day 2 |
| 5 | Audit Merged PRs & Add Entries | HIGH | 3–6h | Day 2–3 |
| 6 | Create Changelog Skill | MEDIUM | 8–12h | Day 3–4 |

**Total effort:** ~20–35 hours over 4 days

---

Generated by [Claude Code](https://claude.ai/code)  
Date: 2026-09-03
