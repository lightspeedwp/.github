# Aging and SLA System Audit Report

**Date:** 2026-07-23  
**Scope:** GitHub Workflow automation for issue aging and SLA tracking  
**Status:** ⚠️ No auto-closure currently active, but system architecture enables it

---

## Executive Summary

The LightSpeed `.github` repository has an **aging and SLA annotation system** that currently only **reports metrics** on issues and PRs without auto-closing them. However, the system is designed in a way that makes future auto-closure easy to add, which poses a risk if not carefully managed.

### Key Findings

- ✅ **No automatic issue closure is currently happening**
- ⚠️ SLA thresholds are hardcoded (7 days warning, 14 days breach)
- ⚠️ The annotation system has no safeguards against future auto-closure logic
- ⚠️ Breach state ("SLA breached") is semantically close to "ready to close"
- ⚠️ No configuration options prevent someone from easily adding closure automation

---

## Current System Architecture

### Workflow: `.github/workflows/project-meta-sync.yml`

**Purpose:** Synchronizes issue/PR metadata with GitHub Projects and adds aging annotations.

**SLA Configuration (lines 18-19):**

```yaml
SLA_WARN_DAYS: "7"
SLA_BREACH_DAYS: "14"
```

**What it does:**

1. Triggers on: issue/PR opened, edited, labeled, reopened, or PR ready for review
2. Adds items to GitHub Projects
3. Derives status/priority/type from labels
4. **Adds or updates an SLA annotation comment** (lines 131-197)

**SLA State Calculation (lines 153-155):**

```javascript
let slaState = "Within SLA";
if (ageDays >= breachDays) slaState = "SLA breached";
else if (ageDays >= warnDays) slaState = "SLA risk";
```

**Annotation Format:**
The workflow posts a comment with:

```
## ⏱️ Aging and SLA annotation
- Age: **X day(s)**
- SLA state: **[Within SLA | SLA risk | SLA breached]**
- Thresholds: warn at 7 days, breach at 14 days
- Last updated: [ISO timestamp]
```

### Related Workflow: `.github/workflows/issue-close-label-hygiene.yml`

**What it does:** Removes `status:needs-triage` label from closed issues  
**Risk Level:** Low (only operates on already-closed issues)

---

## What's NOT Happening (But Could Be)

### ❌ Auto-closure Logic NOT Present

No workflows currently:

- Close issues after 7 or 14 days
- Archive issues based on age
- Close "SLA breached" issues automatically
- Use stale-issue GitHub Action marketplace extensions

**Confirmed by:**

- No `close` action calls in any workflow step
- No scheduled workflows that operate on open issues by age
- No GitHub Action marketplace "auto-close-stale" integrations
- No scripts calling `github.rest.issues.update({ state: 'closed' })`

---

## Risk Analysis: Where Auto-closure Could Happen

### 1. **Inside `project-meta-sync.yml` (Highest Risk)**

**Current state:** Lines 131-197 only add/update comments.

**How it could fail:**

```javascript
// ❌ This could easily be added to project-meta-sync.yml:
if (slaState === "SLA breached") {
  await github.rest.issues.update({
    owner, repo, issue_number: number,
    state: 'closed',
    state_reason: 'not_planned'
  });
}
```

**Why this is dangerous:**

- Workflow has `issues: write` permission
- No additional validation or approval gates
- Triggered on every issue edit/label change (could cascade close)

---

### 2. **New Scheduled Workflow (Medium Risk)**

Someone could add a new `.github/workflows/auto-close-stale.yml`:

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # Daily at 03:00 UTC

jobs:
  close-aged-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Find issues older than 14 days
        # Query GraphQL, find open issues, close them
      - name: Close SLA-breached issues
        # Dangerous automation path
```

**Why this is dangerous:**

- Easy to implement (30 lines of GitHub Actions YAML)
- No guards in CI/CD prevent it from being merged
- Would run unattended on schedule

---

### 3. **GitHub Settings UI (Low Risk)**

GitHub has built-in "Stale issue auto-close" in repository settings:

- **Location:** Settings → Issues → Auto-close stale issues
- **Current state:** Presumably disabled (not visible in code)
- **Risk:** Can be accidentally enabled by maintainers

---

## Recommendations: Prevent Auto-closure

### Tier 1: Immediate Actions (Do This First)

#### 1a. Add a Safeguard Comment to `project-meta-sync.yml`

```yaml
# .github/workflows/project-meta-sync.yml

# CRITICAL: This workflow MUST NEVER close issues automatically.
# The SLA state is informational only. Auto-closure should only happen via:
# - Manual close by issue author or maintainer
# - Explicit closure criteria defined in issue/PR body
# - Admin-approved decision with full discussion
#
# If you are adding auto-closure logic, STOP and open a discussion first.
# See docs/BRANCHING_STRATEGY.md and .github/AGENTS.md for governance.
```

**Location:** Top of the workflow file, below the name

**Effect:** Makes intent clear to future maintainers

---

#### 1b. Document Governance in CLAUDE.md or AGENTS.md

Add to `.github/CLAUDE.md`:

```markdown
## Aging and SLA System

The repository tracks issue and PR age with automatic SLA annotations. This system is **informational only** — it does not close issues.

### Explicit Policy: No Auto-closure

- Issues will **never** be automatically closed based on age or SLA state
- Issues will **never** be automatically closed based on inactivity
- Issues will **only** be closed via:
  - Manual action by the issue author, assignee, or repository maintainer
  - Explicit closure decision with public discussion
  - Admin-approved automation with clear criteria (documented in the workflow)

### If You Want to Add Auto-closure

1. **Open an issue** describing the problem (e.g., "Stale issues are cluttering the backlog")
2. **Propose a solution** with:
   - Criteria for closure (e.g., "no activity for 60 days AND status:needs-triage")
   - Notification strategy (issue comment 7 days before closure)
   - Exclusion lists (labels, projects, milestones that block closure)
   - Dry-run period (run for 2 weeks logging only, no actual closures)
3. **Get approval** from @team/maintainers
4. **Add safeguards** in the workflow:
   - Dry-run mode in workflow inputs
   - Detailed logging of what would be closed
   - Mandatory review before PR merge
   - Scheduled report of closures

See [AGENTS.md](./AGENTS.md) for full AI governance rules.
```

---

#### 1c. Disable GitHub's Built-in Stale Auto-close (If Enabled)

**Check current state:**

```bash
gh repo view --json autoCloseStaleIssues
```

**If enabled, disable it via settings:**

```bash
# Settings → Issues → uncheck "Auto-close stale issues"
# OR use GitHub CLI if API is available
```

---

### Tier 2: Medium-term Actions (Add These in Next Sprint)

#### 2a. Create a Dry-run Workflow for Future Automation

If you later decide auto-closure is necessary:

```yaml
# .github/workflows/stale-issue-audit.yml
# (This is a TEMPLATE for future use, do not activate yet)

name: "Audit: Potential stale issues (dry-run)"

on:
  workflow_dispatch:
  schedule:
    - cron: "0 2 * * 0"  # Weekly, Sundays

jobs:
  audit-stale:
    runs-on: ubuntu-latest
    steps:
      - name: Find potentially stale issues
        uses: actions/github-script@v7
        with:
          script: |
            const { data: issues } = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              per_page: 100
            });
            
            const staleThresholdDays = 60;
            const cutoffDate = new Date(Date.now() - staleThresholdDays * 24 * 60 * 60 * 1000);
            
            const candidates = issues.filter(issue => {
              const updatedAt = new Date(issue.updated_at);
              return updatedAt < cutoffDate;
            });
            
            console.log(`Found ${candidates.length} issues inactive for 60+ days`);
            
            // Log only, do not close
            candidates.slice(0, 10).forEach(issue => {
              console.log(`- #${issue.number}: "${issue.title}" (inactive since ${issue.updated_at})`);
            });
```

**Benefits:**

- No risk of accidental closures
- Generates data on what would be closed
- Allows discussion before enabling real closure
- Follows audit-first methodology

---

#### 2b. Add Closure Criteria to Issue Templates

Update `.github/ISSUE_TEMPLATE/*.md` with a "Closure criteria" section:

```markdown
## Closure Criteria

This issue may be auto-closed if:
- [ ] No activity for 90 days (after maintainer review)
- [ ] Marked `status:wontfix` or `status:duplicate`
- [ ] Author requests closure
```

This makes expectations explicit to issue creators.

---

### Tier 3: Long-term Strategy (Architecture Level)

#### 3a. Separate Concerns: Observability vs. Automation

Current system mixes:

1. **Observability** (SLA metric comment) — safe, informational
2. **Automation** (could add closure logic) — risky, needs guards

**Recommendation:** Keep them separate:

```
project-meta-sync.yml         <- ONLY adds comments (safe)
├─ Add/update SLA annotation
└─ Never closes issues

stale-issue-handler.yml       <- IF NEEDED: only handles closure (controlled)
├─ Dry-run mode by default
├─ Detailed logging
├─ Exclusion lists
└─ Requires admin approval to close
```

---

#### 3b. Build a Closure Allowlist

Create `.github/closure-config.yml`:

```yaml
# Issues with these labels/statuses are NEVER auto-closed
never_close:
  labels:
    - "type:epic"
    - "type:story"
    - "status:pinned"
    - "status:blocked"
  milestones:
    - "Backlog"  # Long-term items stay open
  authors:
    - "lightspeed-bot"  # Don't close bot-authored issues

# Issues with these criteria MAY be auto-closed (if enabled)
closure_criteria:
  inactive_days: 90
  requires_label: "status:needs-triage"  # Only triage items, not planned work
  warn_before_close_days: 7  # Warn first, close 7 days later
```

---

## Summary Table: Risk Levels

| Risk Point | Current State | Risk Level | Mitigation |
| --- | --- | --- | --- |
| Auto-closure in `project-meta-sync.yml` | Not present | High potential | Add safeguard comment |
| New scheduled auto-close workflow | Not present | High potential | Governance in CLAUDE.md |
| GitHub built-in stale auto-close | Unknown (likely disabled) | Medium | Verify disabled in settings |
| Marketplace action integration | Not present | Low | Not imported |
| Label-based closure automation | Not present | Low | Governed by CLAUDE.md |

---

## Next Steps

**Priority 1 (This Week):**

1. Add safeguard comment to `project-meta-sync.yml`
2. Update CLAUDE.md with explicit no-auto-closure policy
3. Verify GitHub's built-in stale auto-close is disabled
4. Communicate policy to team (Slack announcement)

**Priority 2 (This Month):**

1. Create dry-run audit workflow template
2. Add closure criteria to issue templates
3. Review all workflows for hidden closure logic (if any)

**Priority 3 (Next Quarter):**

1. Build closure allowlist config if auto-closure becomes desired
2. Implement audit workflow and gather data
3. Design approval gates for future closure automation

---

## Related Files

- `.github/workflows/project-meta-sync.yml` — Current SLA system
- `.github/CLAUDE.md` — Project governance (add policy here)
- `.github/AGENTS.md` — AI governance rules
- `.github/ISSUE_TEMPLATE/*.md` — Issue templates (update criteria)

---

## Questions to Discuss with Team

1. **Current SLA thresholds:** Are 7/14 days appropriate, or should they be longer?
2. **What does "SLA breached" mean?** Is it just a warning, or does it imply action?
3. **Future closure policy:** Should old issues ever be closed? Under what conditions?
4. **Notification:** Should issues get a warning comment before potential closure?
5. **Exceptions:** Are there issue types that should never auto-close (epics, stories, pinned issues)?

---

**Prepared by:** AI Investigation  
**Status:** Ready for team discussion  
**Action Required:** Implement Tier 1 recommendations before merging any closure automation
