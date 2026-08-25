# Project Maintenance Agent — Operations Runbook

**Audience:** Operations team, technical leads, on-call engineers  
**Purpose:** Step-by-step procedures for routine maintenance and incident response  
**Scope:** Runbooks for 7 common scenarios + escalation procedures

---

## Table of Contents

1. [Nightly Audit Failed](#nightly-audit-failed)
2. [Documentation Gaps Found (Multiple Projects)](#documentation-gaps-multiple-projects)
3. [Single Project Missing Documentation](#single-project-missing-docs)
4. [Project Metadata is Broken](#project-metadata-broken)
5. [Workflow Timeout](#workflow-timeout)
6. [Slack Notifications Not Working](#slack-notifications-not-working)
7. [Archive Project](#archive-project)
8. [Escalation Procedures](#escalation-procedures)

---

## Nightly Audit Failed

**Symptom:** Nightly workflow didn't run, no Slack notification

**Severity:** 🟡 MEDIUM (4 hours = team loses daily visibility)

**Diagnosis Checklist:**
- [ ] Check GitHub Actions tab for failed run
- [ ] Check workflow logs: `.github/workflows/project-maintenance-nightly.yml`
- [ ] Is the Phase 1 script present? `scripts/automation/project-docs-update.sh`
- [ ] Do templates exist? `ls .github/projects/_templates/`
- [ ] Is Slack webhook configured? Check repo secrets

**Common Root Causes:**

### Case 1: Phase 1 Script Missing/Broken

**Error in logs:**
```
./scripts/automation/project-docs-update.sh: No such file or directory
```

**Resolution (15 min):**
1. Check if Phase 1 PR merged: `git log --oneline | grep -i "phase 1"`
2. If not merged, wait for Phase 1 merge
3. If merged, pull latest: `git pull origin develop`
4. Manually test script: `./scripts/automation/project-docs-update.sh --dry-run`
5. If still broken, check Phase 1 recent commits for regression

**Escalation:** If Phase 1 script has bug, create issue linked to Phase 1 epic

---

### Case 2: Slack Webhook Not Configured

**Error in logs:**
```
curl: (6) Could not resolve host: hooks.slack.com
```

**Resolution (5 min):**
1. Go to repo Settings → Secrets and variables → Actions
2. Check if `PROJECT_MAINTENANCE_SLACK_WEBHOOK` exists
3. If missing, follow: `.../SLACK_WEBHOOK_SETUP.md`
4. If present, test webhook: `curl -X POST [webhook-url] -d '{"text": "test"}'`
5. If curl fails, webhook may be revoked; regenerate in Slack

**Escalation:** If Slack workspace issue, contact Slack admin

---

### Case 3: Permissions Error

**Error in logs:**
```
Permission denied accessing .github/projects/
```

**Resolution (10 min):**
1. Check if branch protections preventing writes
2. Check if service account has write permissions
3. Temporarily disable branch protection if CI-only issue
4. Re-run workflow manually
5. Restore branch protection

**Escalation:** If persistent, check GitHub organization settings

---

### Case 4: Cron Schedule Not Triggering

**Symptom:** Workflow exists but never runs

**Resolution (10 min):**
1. Verify cron syntax: `0 2 * * *` = 2 AM UTC every day
2. Check: Has `develop` branch received commits in last 7 days?
   - GitHub requires recent commits for cron to trigger
3. Merge a dummy commit if needed (e.g., doc update)
4. Wait for next 2 AM UTC
5. If still no run, manually trigger: Actions tab → Run workflow

**Escalation:** If still fails, check GitHub Actions documentation

---

**Recovery:**

```bash
# Option 1: Manual trigger (immediate)
GitHub Actions tab → Select workflow → Run workflow → develop branch

# Option 2: Debug locally
./scripts/automation/project-docs-update.sh --dry-run --verbose

# Option 3: Monitor next run
Set reminder for tomorrow 2 AM UTC
Check Slack channel at 2:15 AM UTC
```

**SLA:** Restore within 4 hours of discovery

---

## Documentation Gaps Found (Multiple Projects)

**Symptom:** Nightly audit found 5+ projects missing docs

**Severity:** 🟡 MEDIUM (visibility achieved, action needed)

**Procedure:**

### Step 1: Review the Slack Notification (5 min)
```
What did the audit find?
  ✓ How many projects have gaps?
  ✓ Which files are missing?
  ✓ Are any critical (blocking team)?
```

### Step 2: Prioritize Projects (10 min)

**Urgency Matrix:**
```
HIGH PRIORITY (Fix immediately):
  - Projects in active development
  - Projects blocking releases
  - Projects with missing README.md

MEDIUM PRIORITY (Fix this sprint):
  - Projects in planning phase
  - Projects with missing PLANNING.md only

LOW PRIORITY (Fix later):
  - Completed/archived projects
  - Projects with minor gaps
```

### Step 3: Create Missing Documentation (10-30 min)

**Procedure:**

1. **Go to GitHub Actions**
   ```
   Repo → Actions → "Project Maintenance — On-Demand"
   ```

2. **Run workflow with DRY-RUN**
   ```
   operation: create-docs
   projects: project-a,project-b,project-c
   dry_run: true
   ```

3. **Review the preview output**
   ```
   ✓ project-a: Would create PLANNING.md
   ✓ project-b: Would create PLANNING.md, OPENSPEC.md
   ✓ project-c: Would create README.md
   
   Summary: Would create 4 files, 0 errors
   ```

4. **Confirm files/structure**
   - Are these the right projects?
   - Are these the right files?
   - Any concerns? → Stop here and investigate

5. **Run workflow LIVE (no dry-run)**
   ```
   operation: create-docs
   projects: project-a,project-b,project-c
   dry_run: false
   ```

6. **Verify files created**
   - Check GitHub: `.github/projects/active/project-a/PLANNING.md`
   - Should exist and have frontmatter

7. **Optional: Customize metadata**
   - Open files in GitHub
   - Edit frontmatter if needed (title, status, owners, tags)

8. **Document the action**
   - Add comment to nightly audit issue (if one was created)
   - Note: "Created docs for 3 projects on 2026-08-18"

### Success Criteria

- [ ] All identified projects now have required docs
- [ ] Files have valid frontmatter (YAML)
- [ ] Team notified of completion
- [ ] Nightly audit next morning should show fewer gaps

**SLA:** Complete high-priority gaps within 24 hours

---

## Single Project Missing Documentation

**Symptom:** One new/forgotten project needs docs

**Severity:** 🟢 LOW (single project, non-blocking)

**Procedure (10 minutes):**

```bash
# Step 1: Create project folder (if needed)
mkdir -p .github/projects/active/my-new-project

# Step 2: Run on-demand audit
# GitHub Actions → "Project Maintenance — On-Demand"
operation: audit
projects: my-new-project
dry_run: true

# Step 3: Dry-run doc creation
operation: create-docs
projects: my-new-project
dry_run: true

# Step 4: Review what will be created
# Check the output above

# Step 5: Apply changes
operation: create-docs
projects: my-new-project
dry_run: false

# Step 6: Verify
# Check files exist in .github/projects/active/my-new-project/
# Edit frontmatter if needed
```

**Checklist:**
- [ ] Project folder exists
- [ ] Run audit to see what's missing
- [ ] Preview with dry-run
- [ ] Apply changes
- [ ] Verify files created
- [ ] Customize metadata if needed

**SLA:** Complete within 1 hour

---

## Project Metadata is Broken

**Symptom:** README.md or PLANNING.md has malformed YAML or missing required fields

**Severity:** 🔴 HIGH (validation fails, project state unclear)

**Diagnosis:**

```bash
# Check what's wrong
GitHub Actions → "Project Maintenance — On-Demand"
operation: validate
projects: broken-project
dry_run: true

# Output will show exactly what's wrong:
# ✗ README.md missing "title" field
# ✗ PLANNING.md has invalid YAML syntax
```

**Resolution:**

### Case 1: Missing Required Field (title, status, dates)

**Fix (5 min):**
1. Open file in GitHub (or locally)
2. Add the missing field to frontmatter:
   ```yaml
   ---
   title: My Project
   description: What it does
   status: active
   created_date: 2026-08-18
   ---
   ```
3. Commit change
4. Re-run validate to confirm fixed

### Case 2: Invalid YAML Syntax

**Common errors:**
```yaml
# ❌ WRONG: No quotes on string with colon
title: My Project: The Sequel

# ✅ RIGHT: Use quotes
title: "My Project: The Sequel"

# ❌ WRONG: Unquoted URL
url: https://example.com/path

# ✅ RIGHT: Quote URLs
url: "https://example.com/path"
```

**Fix (10 min):**
1. Use online YAML validator: `https://www.yamllint.com/`
2. Paste frontmatter from file
3. Validator shows exact syntax error
4. Fix in GitHub
5. Re-validate

### Case 3: Old Format (Pre-Phase 3)

**Symptom:** Project created before Phase 3, uses old frontmatter format

**Fix (10 min):**
1. Backup old file (copy content)
2. Delete file from GitHub
3. Run create-docs workflow for this project
4. New file created with current format
5. Merge fields from backup if needed

**Escalation:** If persistent validation failures, check if Phase 1 script has bug

**SLA:** Fix within 2 hours

---

## Workflow Timeout

**Symptom:** Workflow runs >30 min, GitHub automatically cancels

**Severity:** 🟡 MEDIUM (operation incomplete, can retry)

**Likely Cause:** Too many projects in single workflow run (50+)

**Procedure:**

### Step 1: Check the Numbers
```bash
# How many projects?
ls -1 .github/projects/active/ | wc -l
# If > 50, that's likely the issue
```

### Step 2: Split Into Batches

**Instead of:**
```yaml
projects: all
```

**Do:**
```yaml
# Batch 1
projects: project-a,project-b,project-c,...  (first 25)

# Batch 2
projects: project-z,project-y,...  (next 25)
```

### Step 3: Run Batches Separately
```
Run 1: projects: [first 25], dry_run: true
   (takes ~2 min)
   
Review output, then:

Run 2: projects: [first 25], dry_run: false
   (takes ~5 min)

Run 3: projects: [next 25], dry_run: false
   (takes ~5 min)
```

### Alternative: Increase Timeout

**If batching not practical:**
1. Edit `.github/workflows/project-maintenance-on-demand.yml`
2. Add to job:
   ```yaml
   timeout-minutes: 60
   ```
3. Commit and test

**Prevention:**
- Validate < 30 projects at a time
- Archive completed projects (reduces total)
- Monitor workflow duration over time

**SLA:** Recover within 30 min (can retry immediately)

---

## Slack Notifications Not Working

**Symptom:** Workflow completed successfully, but no Slack message

**Severity:** 🟡 MEDIUM (operation succeeded, just no notification)

**Diagnosis Checklist:**

- [ ] Is webhook configured? Check: Settings → Secrets → `PROJECT_MAINTENANCE_SLACK_WEBHOOK`
- [ ] Is webhook still valid? Slack webhooks expire if unused for 30 days
- [ ] Is the right channel selected? Webhook is created for specific channel
- [ ] Did workflow actually complete? Check Actions tab for success
- [ ] Is messaging step in workflow? Check `.github/workflows/project-maintenance-nightly.yml`

**Resolution:**

### Case 1: Webhook Missing

**Fix (5 min):**
1. Follow: `.../SLACK_WEBHOOK_SETUP.md`
2. Create new webhook in Slack workspace
3. Add to GitHub Secrets as `PROJECT_MAINTENANCE_SLACK_WEBHOOK`
4. Test by running workflow manually

### Case 2: Webhook Expired/Revoked

**Fix (10 min):**
1. Delete old webhook from Slack workspace
2. Create new webhook
3. Update GitHub secret
4. Test

### Case 3: Wrong Channel

**Symptom:** Webhook sends to #random instead of #projects

**Fix (5 min):**
1. In Slack, click webhook integration
2. Check "Post to channel" setting
3. Change to correct channel
4. Save
5. Test

### Case 4: Messaging Step Disabled/Broken

**Fix (10 min):**
1. Check workflow YAML: `.github/workflows/project-maintenance-nightly.yml`
2. Look for Slack notification step (should have `curl` or `@slack/actions`)
3. If commented out, uncomment it
4. If broken, fix syntax
5. Commit and test

**Manual Test:**

```bash
# Test webhook connectivity
curl -X POST $PROJECT_MAINTENANCE_SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{"text":"Test message from Project Maintenance Agent"}'

# If successful: Slack receives message immediately
# If failed: Check webhook URL and Slack workspace permissions
```

**SLA:** Restore notifications within 1 hour

---

## Archive Project

**Symptom:** Project is complete, need to move to archive

**Severity:** 🟢 LOW (non-urgent, but should happen)

**⚠️ WARNING: This moves files. Always dry-run first!**

**Procedure (10 minutes):**

### Step 1: Verify Project Is Done
- [ ] All deliverables complete
- [ ] Team confirms ready for archive
- [ ] No active work planned

### Step 2: Run with DRY-RUN
```
GitHub Actions → "Project Maintenance — On-Demand"

operation: archive
projects: completed-project
dry_run: true
```

**Preview output:**
```
Archive Plan:
  Project: completed-project
  From: .github/projects/active/completed-project/
  To: .github/projects/archive/completed-project/
  
Files to move:
  - README.md
  - PLANNING.md
  - OPENSPEC.md
  - ...

Archive status file: .archive-status.md (created)

Confirm this looks correct? (Continue only if yes!)
```

### Step 3: Get Team Approval
- [ ] Share dry-run output with team
- [ ] Get verbal/written approval
- [ ] Document approval in issue/PR

### Step 4: Apply Changes
```
operation: archive
projects: completed-project
dry_run: false
```

### Step 5: Verify
```bash
# Project should no longer be in active folder
ls .github/projects/active/ | grep completed-project
# (should return nothing)

# Project should now be in archive
ls .github/projects/archive/ | grep completed-project
# (should show: completed-project)

# Archive status file should exist
cat .github/projects/archive/completed-project/.archive-status.md
```

### Step 6: Update Documentation
- [ ] Update epic (mark project as archived)
- [ ] Update main README (remove from active projects list)
- [ ] Post completion notice to team

**Rollback (if needed):**

```bash
# If archived by mistake, move back manually:
git mv .github/projects/archive/completed-project \
       .github/projects/active/

git rm .github/projects/active/completed-project/.archive-status.md

git commit -m "docs: Unarchive completed-project (restored from archive)"
```

**SLA:** Complete within 1 day of approval

---

## Escalation Procedures

**When to escalate:**

| Situation | Escalate To | Action |
|-----------|-------------|--------|
| Phase 1 script broken | Phase 1 team | Create bug issue (don't fix yourself) |
| Slack workspace issue | Slack admin | Webhook generation/management |
| GitHub org settings broken | GitHub admin | Permissions, branch protection, secrets |
| Agent behavior unexpected | Phase 2 team | Agent implementation issue |
| Multiple simultaneous failures | Team lead | May indicate systematic issue |

**Escalation Template:**

```markdown
## Issue: [Brief description]

**Severity:** 🟢/🟡/🔴 [Low/Medium/High]

**Symptoms:**
- [What's broken]
- [When it started]
- [Impact]

**Root Cause (if known):**
- [What we think is wrong]

**Actions Taken:**
- [What we already tried]
- [Results]

**Need Help With:**
- [Specific question for team]

**Files Involved:**
- [Relevant workflow, script, project]

**Timeline:**
- [When this needs to be fixed]
```

---

## Incident Response Checklist

**Use this during any incident:**

```
INCIDENT RESPONSE CHECKLIST
===========================

□ Assess severity (🟢/🟡/🔴)
□ Identify affected projects/workflows
□ Check GitHub Actions logs for error messages
□ Attempt diagnosis (see procedures above)
□ Try resolution from matching procedure
□ If not in runbook, test solution locally
□ Document what was done
□ Verify fix with manual workflow run
□ Check nightly audit next morning
□ Post incident summary to team
□ Update this runbook if new scenario

Time to resolution: _____ minutes
Root cause: _____________________
Prevention: _____________________
```

---

## Contact Information

**For different types of issues:**

```
Slack notifications broken?
  → Check SLACK_WEBHOOK_SETUP.md
  → Ask Slack admin

Workflow keeps timing out?
  → Check Workflow Timeout section
  → Ask tech lead about splitting jobs

Project metadata malformed?
  → Run validate operation
  → Follow the procedures above

Something else?
  → Create issue with #project-maintenance label
  → Link to epic #1862
  → @ mention team lead
```

---

## Success Criteria

**After following a runbook, you should:**

- ✅ Know exactly what went wrong
- ✅ Know the steps to fix it
- ✅ Be confident in your solution
- ✅ Know when to escalate
- ✅ Have documented what happened

**If any step unclear:**
- Re-read the procedure
- Check the troubleshooting guide
- Ask team lead
- Update this runbook with what you learned

---

*Operations Runbook v1.0 — 2026-08-18*  
*7 common procedures + escalation guide*
