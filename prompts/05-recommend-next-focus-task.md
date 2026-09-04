---
file_type: "prompt"
title: "Recommend Next Focus Task"
description: "Identify and prioritize next work by auditing active projects, open issues, discovering pre-existing CI errors, and applying priority scoring framework."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["prioritization", "planning", "workflow", "active-projects", "issue-management"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Recommending Next Focus Task

## PROMPT: What should I work on next?

This prompt systematically audits active projects, open issues, and CI errors to recommend the highest-priority next task with scoring rationale.

### Context

When you finish one task or chat session, choosing the next work can be overwhelming. This prompt:

1. **Audits active projects** — Status, completion %, blockers
2. **Scans open issues** — Linked to projects, pre-existing CI errors, unassigned, urgent
3. **Identifies CI errors** — Repository-wide failures separate from project work
4. **Scores tasks** — Urgency, impact, dependencies, effort
5. **Recommends top 3** — With rationale and effort estimate

### Task

Execute these steps IN ORDER:

---

## STEP 1: Audit Active Projects

```bash
# List all active projects
ls -la .github/projects/active/

# For each project:
#   - Read README.md (status, phase)
#   - Read STATUS.md (progress metrics)
#   - Identify completion percentage
#   - Note blockers or stuck items
```

**Create audit summary table:**

```markdown
## Active Projects Audit

| Project | Phase | Status | Completion | Blocker? | Next Action |
|---------|-------|--------|------------|----------|-------------|
| reusable-prompts | 2 | Active | 60% | Milestone assignment | Create GitHub issues |
| auth-hardening | 1 | In Progress | 45% | PR review pending | Address feedback #123 |
| label-audit | 2 | Blocked | 30% | Waiting on policy decision | Needs input from owner |
| branch-naming | 3 | Complete | 100% | None | Nothing (done) |

**Total:** 4 projects, 2 active, 1 blocked, 1 complete
```

**For each ACTIVE project, identify:**
- Current phase and deliverables
- Completion percentage
- Next immediate step
- Time estimate to unblock
- Dependencies (other work needed first)

---

## STEP 2: Scan Open Issues by Category

### Category A: Issues Linked to Active Projects

```bash
# Search GitHub for open issues linked to active projects
gh issue list --state open --search "label:area:project" --json number,title,labels,milestone

# Or manually check:
# 1. Open each active project's README
# 2. Find "Related Issues" section
# 3. Check which are still open
```

**Create linked issues table:**

```markdown
## Issues Linked to Active Projects

| Issue | Project | Title | Priority | Effort | Status |
|-------|---------|-------|----------|--------|--------|
| #100 | reusable-prompts | Prompt enhancements | High | 2h | In Progress |
| #101 | auth-hardening | Security audit fixes | Critical | 4h | Blocked |
| #102 | label-audit | Label prefix enforcement | Medium | 3h | Ready |

**Analysis:**
- 3 linked issues, 1 critical, 1 blocked, 1 ready
- Most valuable: #102 (ready, medium effort, unblocks label work)
```

### Category B: Pre-existing CI Errors (Repository-Wide)

CI failures that are NOT caused by a specific PR or issue:

```bash
# Check for known CI errors in repo
# Search: .github/reports/ci-errors-*.md
# Search issues: label:type:bug label:area:ci

# Look for patterns:
# - ESLint failing on develop
# - Type checking errors
# - Test suite failures
# - Workflow configuration errors
```

**Create CI error tracking:**

```markdown
## Pre-existing CI Failures

| Check | Status | Root Cause | Issue | Priority | Action |
|-------|--------|-----------|-------|----------|--------|
| ESLint | ❌ Red | Missing config | #105 | High | Fix config or suppress |
| Tests | ❌ Red | Outdated snapshot | #106 | Medium | Update snapshots |
| Labeler | ⚠️ Yellow | Config parsing | #107 | Low | Debug config YAML |

**Analysis:**
- 3 pre-existing CI errors blocking all PRs
- Most impactful: ESLint (blocks merges)
- Separate from project work — track in separate issues
```

### Category C: Unassigned Issues

```bash
# Find unassigned open issues
gh issue list --state open --search "no:assignee" --json number,title,labels,milestone --limit 50

# Filter by:
# - Priority (critical, high first)
# - Type (bug fixes > features)
# - Area (automation, testing, security)
```

**Create unassigned issues table:**

```markdown
## Unassigned Open Issues

| Issue | Type | Title | Priority | Effort | Why Unassigned? |
|-------|------|-------|----------|--------|-----------------|
| #103 | bug | Auth timeout under load | Critical | 3h | Urgent, needs investigation |
| #104 | feature | User preferences panel | High | 5h | Planned, awaiting design |
| #108 | docs | Update README | Medium | 1h | Low priority, in backlog |

**Analysis:**
- 3 unassigned, 1 critical, 1 high
- #103 is urgent blocker
- #104 blocked by design, schedule after
- #108 is backlog item
```

### Category D: Blocked or Stuck Issues

```bash
# Find issues labeled as blocked
gh issue list --state open --search "label:meta:blocked" --json number,title,labels

# Check issue descriptions for:
# - "Blocked by" references
# - Waiting on external input
# - Design decision pending
# - Dependency not ready
```

**Create blocked issues table:**

```markdown
## Blocked/Stuck Issues (Awaiting Unblock)

| Issue | Title | Blocker | Unblocking Action | Timeline |
|-------|-------|---------|-------------------|----------|
| #102 | Label enforcement | Policy decision | Owner review of proposed approach | 1 day |
| #109 | Cache implementation | Design approval | Design review meeting | 3 days |

**Analysis:**
- Don't spend time on these now (waiting on external input)
- Note for future: track who/what needs to unblock
- Revisit in 1-3 days
```

---

## STEP 3: Identify Quick Wins & Momentum Builders

Quick tasks that build momentum:

```markdown
## Quick Wins (< 1 hour, high impact)

- Update README.md files (20 min, improves onboarding)
- Fix lint errors in single file (30 min, unblocks CI)
- Add missing test case (45 min, improves coverage)
- Label audit for 5 existing issues (30 min, governance)

**Benefit:** Each builds momentum, demonstrates progress
```

---

## STEP 4: Apply Priority Scoring Framework

For each top candidate task, score on 0-100 scale:

### Scoring Dimensions

**1. Urgency (0-25 points)**
- 25: Blocking multiple people, security issue, production broken
- 18: Critical path, must complete this sprint
- 12: Important, should complete this month
- 6: Should do eventually
- 0: Nice-to-have, no deadline

**2. Impact (0-25 points)**
- 25: Unblocks 3+ tasks, enables new capability, fixes critical failure
- 18: Unblocks 1-2 tasks, improves significantly
- 12: Moderate improvement, addresses known issue
- 6: Minor improvement, nice-to-have
- 0: No impact or negative impact

**3. Dependencies (0-25 points)**
- 25: No dependencies, can start immediately
- 18: Minor dependencies, easily resolvable
- 12: Some dependencies, partially ready
- 6: Multiple dependencies, mostly waiting
- 0: Blocked on external work

**4. Effort (0-25 points, reversed - lower effort = higher score)**
- 25: < 1 hour (quick win)
- 18: 1-2 hours (half morning)
- 12: 2-4 hours (morning session)
- 6: 4-8 hours (full day)
- 0: > 8 hours or XL effort

**Total Score:** Sum all four dimensions (0-100)

### Scoring Example

```markdown
## Priority Scores

### Task 1: Fix ESLint Config (#105)
- **Urgency:** 20 (blocking all PRs)
- **Impact:** 22 (unblocks 15+ pending PRs)
- **Dependencies:** 24 (no blockers)
- **Effort:** 18 (estimated 1-2 hours)
- **Total: 84/100** — **HIGH PRIORITY**

### Task 2: Auth Hardening (#101)
- **Urgency:** 22 (security issue)
- **Impact:** 24 (critical feature)
- **Dependencies:** 12 (PR review feedback needed)
- **Effort:** 8 (estimated 8+ hours)
- **Total: 66/100** — **MEDIUM PRIORITY**

### Task 3: User Prefs Feature (#104)
- **Urgency:** 15 (planned, no deadline)
- **Impact:** 16 (nice-to-have)
- **Dependencies:** 6 (blocked on design)
- **Effort:** 0 (estimated > 8 hours)
- **Total: 37/100** — **LOW PRIORITY** (skip for now)
```

---

## STEP 5: Generate Top 3 Recommendations

Based on priority scoring, recommend top 3 tasks:

```markdown
## Top 3 Recommended Tasks

### 🏆 #1: Fix ESLint Configuration (#105)
**Score:** 84/100 (Highest Priority)  
**Why:** Blocks all PRs, unblocks 15+ pending work, quick fix  
**Effort:** 1-2 hours  
**Timeline:** Can complete today  
**Success Criteria:**
- [ ] Identify ESLint config issue
- [ ] Fix or suppress the error
- [ ] Verify CI passing on develop
- [ ] Update TROUBLESHOOTING guide

**Next Step:** Investigate ESLint config

---

### 🥈 #2: Auth Hardening Security Fixes (#101)
**Score:** 66/100 (High Priority)  
**Why:** Security issue, critical feature, in active project  
**Effort:** 4-6 hours  
**Timeline:** Start after #105, complete in 1-2 sessions  
**Blockers:** Address PR review feedback first  
**Success Criteria:**
- [ ] Read PR #123 review comments
- [ ] Implement all recommendations
- [ ] Security audit approval
- [ ] Merge to develop
- [ ] Create follow-up issues

**Next Step:** Review PR feedback

---

### 🥉 #3: Label Prefix Enforcement (#102)
**Score:** 71/100 (High Priority)  
**Why:** Governance, medium effort, addresses technical debt  
**Effort:** 2-3 hours  
**Timeline:** Can start while waiting on auth feedback  
**Dependencies:** Already ready to implement  
**Success Criteria:**
- [ ] Audit label usage across repo
- [ ] Create enforcement workflow
- [ ] Update labeler configuration
- [ ] Test on sample issues

**Next Step:** Start label audit
```

---

## STEP 6: Create Continuation Plan

```markdown
## Recommended Work Sequence

**Today's Focus:** Fix ESLint (unblocks everything)

1. **Session 1 (90 min):** Fix ESLint configuration
   - Investigate CI logs
   - Identify root cause
   - Fix or suppress
   - Verify CI green
   - Commit to develop

2. **Session 2 (2-3 hrs):** Auth hardening security fixes
   - Review PR feedback
   - Implement fixes
   - Test security changes
   - Merge PR

3. **Session 3 (or parallel):** Label enforcement
   - Audit existing labels
   - Implement enforcement
   - Test on sample issues

**Estimated Total Effort:** 5-6 hours over 1-2 days

**Blockers to Monitor:**
- Auth PR still under review (track comment updates)
- Policy decision for label enforcement (waiting on owner)

**Revisit:** 
- Pre-existing CI errors: Check daily
- Blocked issues: Revisit in 1-3 days
- Active projects: Update STATUS.md weekly
```

---

## STEP 7: Document Prioritization Rationale

Create report file for future reference:

```bash
# Save as: .github/reports/prioritization-{date}.md

cat > .github/reports/prioritization-2026-09-04.md << 'EOF'
# Prioritization Report — {Date}

## Decision Made
Recommended focus: Fix ESLint configuration (Issue #105)

## Audit Summary
- Active Projects: 4 (2 active, 1 blocked, 1 complete)
- Open Issues: 15 (3 critical, 6 high, 6 medium)
- Pre-existing CI Errors: 3 (ESLint, tests, labeler)
- Quick Wins Available: 4

## Scoring Results
1. ESLint Fix (#105): 84/100 — Start NOW
2. Auth Hardening (#101): 66/100 — High priority
3. Label Enforcement (#102): 71/100 — Medium priority

## Timeline
- [ ] Session 1 (today): ESLint fix
- [ ] Session 2 (tomorrow): Auth hardening
- [ ] Session 3: Label enforcement or quick wins

---
EOF
```

---

### References

- **Active Projects:** `.github/projects/active/`
- **Issue Tracking:** GitHub issues page
- **CI Status:** `.github/workflows/` and GitHub Actions
- **Reports Location:** `.github/reports/`
- **Milestone Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **Label Strategy:** `docs/LABEL_STRATEGY.md` and `.github/labels.yml`
- **Prioritization Guide:** This prompt

---

**Effort:** 1–2 hours to audit and score  
**Use When:** Finished one task, unsure what to work on next  
**Output:** Ranked task recommendations (top 3), prioritization report, active projects audit  
**Dependencies:** GitHub access, ability to read issue/PR details, git access
