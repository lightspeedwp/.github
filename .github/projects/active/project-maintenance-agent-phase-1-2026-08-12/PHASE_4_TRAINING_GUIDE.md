---
file_type: documentation
title: ""Project Maintenance Agent — Team Training Guide""
description: ""30-minute team walkthrough covering nightly audits and on-demand operations""
created_date: 2026-08-18
last_updated: "2026-08-25"
status: active
---

# Project Maintenance Agent — Team Training Guide

**Duration:** 30 minutes (dry-run demo) + 30 minutes (Q&A)  
**Audience:** Development team, project managers, technical leads  
**Prerequisites:** GitHub access, basic understanding of project structure  
**Outcome:** Team can independently run audits and resolve documentation gaps

---

## Part 1: What Is the Project Maintenance Agent? (5 minutes)

### The Problem We Solve

**Before:** 
- Documentation gaps discovered reactively
- No visibility into which projects are incomplete
- Manual, error-prone updates
- Team doesn't know status of 50+ projects

**After:**
- Automated daily audits (nightly at 2 AM UTC)
- Clear reports of what's missing
- One-click creation of missing files
- Team stays informed

### What It Does (3 Core Operations)

1. **Audit** — Check which projects are missing documentation
   - Scans all 50+ projects in `.github/projects/active/`
   - Identifies missing PLANNING.md, OPENSPEC.md, README.md
   - Reports gaps and recommendations

2. **Create** — Generate missing documentation files
   - Uses templates from `.github/projects/_templates/`
   - Creates PLANNING.md, OPENSPEC.md, README.md as needed
   - Dry-run preview before applying changes

3. **Validate** — Check project structure and metadata
   - Verifies folder structure is correct
   - Checks frontmatter (YAML metadata)
   - Reports issues with recommendations

---

## Part 2: The Nightly Audit (Automatic) (10 minutes)

### How It Works

```
Every day at 2 AM UTC
    ↓
Agent scans all projects (dry-run mode)
    ↓
Identifies gaps (missing PLANNING.md, etc.)
    ↓
Posts report to team Slack channel
    ↓
Team reviews, decides on action
```

### Slack Notification Example

**Channel:** #projects (or your configured channel)

```
🔍 Project Maintenance Audit — 2026-08-18 02:00 UTC

📊 Scan Results:
  Projects audited: 52
  Projects healthy: 45
  Projects with gaps: 7
  
⚠️ Critical Gaps (1+ missing files):
  • project-alpha: Missing PLANNING.md
  • project-beta: Missing OPENSPEC.md, README.md
  • project-gamma: Missing PLANNING.md
  • (and 4 more)

💡 Next Steps:
  1. Review full audit results (link to GitHub issue)
  2. Decide: Fix now or later?
  3. Run on-demand workflow to create docs (see instructions below)
```

### What the Team Does

**Morning After Nightly Audit:**

1. ✅ **Review the Slack notification**
   - How many projects have gaps?
   - Are the gaps critical?

2. ✅ **Decide if action is needed**
   - Critical (>5 projects): Fix immediately
   - Minor: Schedule for next sprint
   - None: All good!

3. ✅ **Optional: Run on-demand operation**
   - If gaps found, use workflow to create docs
   - (Demo in Part 3)

---

## Part 3: Running On-Demand Operations (Manual) (10 minutes)

### How to Trigger the Workflow

**Step 1: Go to GitHub Actions**

```
Repository → Actions tab → "Project Maintenance — On-Demand"
```

**Step 2: Click "Run workflow"**

```
Branch: develop
Operation: [choose one]
Projects: [list projects]
Dry-run: [true/false]
```

### Operation: Audit

**When:** Check documentation status without creating anything

**Inputs:**
```
operation: audit
projects: all  (or: project-a,project-b)
dry_run: true  (no changes made)
```

**Output Example:**
```
Project Maintenance Audit
========================

Scanning 52 projects...

Results:
  project-alpha: ✓ Has README, ✗ Missing PLANNING.md
  project-beta:  ✓ Has all docs
  project-gamma: ✗ Missing README.md, OPENSPEC.md

Summary: 2/3 projects need attention

Recommendations:
  • Create PLANNING.md for project-alpha
  • Create README.md, OPENSPEC.md for project-gamma
```

### Operation: Create Docs

**When:** Generate missing documentation files

**Inputs:**
```
operation: create-docs
projects: project-alpha,project-gamma
dry_run: true  (preview first!)
```

**Workflow:**

1. **Dry-run first** (always)
   ```
   ✓ project-alpha: Would create PLANNING.md (from template)
   ✓ project-gamma: Would create README.md, OPENSPEC.md (from templates)
   
   Summary: Would create 3 files, no errors
   
   Next: Re-run with dry_run: false to apply
   ```

2. **Review what will be created**
   - Are the right files being created?
   - Do you need to customize anything?

3. **Run live mode** (without dry_run flag)
   ```
   ✓ project-alpha: Created PLANNING.md
   ✓ project-gamma: Created README.md
   ✓ project-gamma: Created OPENSPEC.md
   
   Files created: 3
   Errors: 0
   ```

4. **Verify in GitHub**
   - Check project folders
   - Files should now exist
   - Frontmatter (title, status, dates) auto-filled

### Operation: Validate

**When:** Check project structure and metadata

**Inputs:**
```
operation: validate
projects: all
dry_run: true
```

**Output Example:**
```
Project Validation Report
========================

✓ project-alpha: VALID
  - Has README.md ✓
  - Has PLANNING.md ✓
  - Frontmatter valid ✓

✗ project-beta: INVALID
  - README.md exists but missing frontmatter
  - Recommendation: Add title, status, created_date to frontmatter

Issues found: 1
Recommendations: Fix project-beta frontmatter
```

---

## Part 4: Common Scenarios (5 minutes)

### Scenario 1: "Nightly Audit Found 3 Projects with Missing Docs"

**What happened:**
- Nightly audit ran at 2 AM
- Slack notification shows gaps
- Team wants to fix them

**Steps:**
1. ✅ Go to GitHub Actions
2. ✅ Run "Project Maintenance — On-Demand" workflow
3. ✅ Set: `operation: create-docs`, `projects: project-a,project-b,project-c`, `dry_run: true`
4. ✅ Review preview
5. ✅ Run again with `dry_run: false`
6. ✅ Verify files created in GitHub
7. ✅ Done! Files are now in place

**Time required:** ~5 minutes

---

### Scenario 2: "We Have a New Project, Need to Set It Up"

**What happened:**
- New project created in `.github/projects/active/new-project/`
- Needs initial documentation

**Steps:**
1. ✅ Create project folder manually
2. ✅ Run audit: `operation: audit`, `projects: new-project`, `dry_run: true`
3. ✅ See what's missing
4. ✅ Run create-docs: `operation: create-docs`, `projects: new-project`, `dry_run: true`
5. ✅ Review, then apply with `dry_run: false`
6. ✅ Customize metadata if needed
7. ✅ Done!

**Time required:** ~10 minutes

---

### Scenario 3: "Project Is Completed, Need to Archive It"

**What happened:**
- Project work is done
- Need to move from `active/` to `archive/` folder

**Steps:**
1. ✅ Run on-demand workflow
2. ✅ Set: `operation: archive`, `projects: completed-project`, `dry_run: true`
3. ✅ Review what will be moved
4. ✅ Confirm: `dry_run: false`
5. ✅ Project moved to `archive/`
6. ✅ `.archive-status.md` created with metadata

**Time required:** ~3 minutes

**Note:** This operation is destructive (moves folders). Always use `dry_run: true` first!

---

### Scenario 4: "Someone Broke the Project Structure"

**What happened:**
- Project folder exists but metadata is malformed
- README.md missing required frontmatter
- Team doesn't know what's wrong

**Steps:**
1. ✅ Run: `operation: validate`, `projects: broken-project`, `dry_run: true`
2. ✅ Validation output shows exactly what's wrong
3. ✅ Fix manually or use create-docs to regenerate
4. ✅ Re-run validate to confirm fixed

**Time required:** ~5 minutes

---

## Part 5: Safety & Best Practices (3 minutes)

### The Golden Rule: Always Dry-Run First

```
❌ WRONG:
  Run: operation: create-docs, dry_run: false
  Result: Files created without preview!

✅ RIGHT:
  Step 1: Run with dry_run: true
  Step 2: Review what will happen
  Step 3: Run with dry_run: false
  Result: Safe, predictable outcome
```

### Key Safety Features

1. **Dry-Run Mode** — Preview all changes before applying
2. **Nightly Audit** — Only reads, never modifies (safe!)
3. **Clear Output** — Always shows what was/will be created
4. **Error Reporting** — Tells you exactly what went wrong
5. **No Approval Needed** — On-demand ops run immediately (except archive)

### When to Call for Help

| Situation | Action |
|-----------|--------|
| Workflow times out | Check if 50+ projects; split into batches |
| Slack notification not sent | Verify webhook configured; check logs |
| Files created but wrong content | Run validate; may need custom templates |
| Afraid to run archive | Always dry-run first; ask team before archiving |
| Confused about what changed | Check GitHub Actions logs; they show details |

---

## Part 6: Key Files & Where to Find Them

### What You Need to Know

**Project Locations:**
```
.github/projects/active/        ← All active projects live here
.github/projects/archive/       ← Archived projects moved here
.github/projects/_templates/    ← Template files (PLANNING.md, etc.)
```

**Documentation:**
```
.github/projects/active/project-maintenance-agent-phase-1-2026-08-12/

  README.md                      ← Project overview
  PLANNING.md                    ← Full spec (all phases)
  PHASE_3_IMPLEMENTATION.md      ← Workflow details
  SLACK_WEBHOOK_SETUP.md         ← Webhook config guide
  PHASE_4_OPERATIONS_RUNBOOK.md  ← How to fix common issues
  PHASE_4_TROUBLESHOOTING.md     ← Detailed error solutions
```

**Workflows:**
```
.github/workflows/
  project-maintenance-nightly.yml        ← Auto-runs 2 AM UTC
  project-maintenance-on-demand.yml      ← Manual trigger
```

### Where to Go for Help

1. **"How do I run an audit?"** → Part 3 of this guide
2. **"The workflow failed, why?"** → PHASE_4_TROUBLESHOOTING.md
3. **"How do I fix broken metadata?"** → PHASE_4_OPERATIONS_RUNBOOK.md
4. **"Can I customize the templates?"** → SLACK_WEBHOOK_SETUP.md
5. **"I need training"** → This guide (30 min read)

---

## Quick Reference Card

**Print this and keep at your desk:**

```
PROJECT MAINTENANCE AGENT — Quick Reference

NIGHTLY AUDIT (Automatic)
  ✓ Runs at 2 AM UTC every day
  ✓ Posts report to Slack
  ✓ No action required (unless gaps found)

ON-DEMAND OPERATIONS
  GitHub Actions → "Project Maintenance — On-Demand"

  AUDIT:
    operation: audit
    projects: all  (or: project-a,project-b)
    dry_run: true

  CREATE DOCS:
    operation: create-docs
    projects: project-a
    dry_run: true (ALWAYS dry-run first!)
    Then re-run with dry_run: false

  VALIDATE:
    operation: validate
    projects: project-a
    dry_run: true

  ARCHIVE:
    operation: archive
    projects: completed-project
    dry_run: true (Review before applying!)

THE GOLDEN RULE:
  Always run with dry_run: true first!
  Review output.
  Then run with dry_run: false.

NEED HELP?
  → PHASE_4_TROUBLESHOOTING.md
```

---

## Q&A Reference (Common Questions)

### "How often does the nightly audit run?"
**Answer:** Every day at 2 AM UTC. You'll see the Slack notification in the morning.

### "Can I run the audit manually?"
**Answer:** Yes! Use the on-demand workflow with `operation: audit`. Useful for testing.

### "What if the audit finds 50 projects with gaps?"
**Answer:** Don't panic! The nightly audit is just visibility. Fix them incrementally:
- Week 1: Fix the 5 most critical
- Week 2: Fix the next 10
- Etc.

### "Can I customize the templates?"
**Answer:** Yes! Templates are in `.github/projects/_templates/`. Edit the PLANNING.md.template file to change what gets generated.

### "What if I accidentally archive the wrong project?"
**Answer:** Projects aren't permanently deleted, just moved to `.github/projects/archive/`. You can move them back manually if needed. Always use dry-run first!

### "Do I need to approve changes?"
**Answer:** No, workflows run immediately. Just use dry-run first to preview.

### "Can multiple people run workflows at the same time?"
**Answer:** Yes, they're independent and won't conflict.

### "How long does a full audit take?"
**Answer:** About 30 seconds for 50 projects. Creating docs takes 1-2 minutes per project.

---

## Post-Training Checklist

**After this training, you should be able to:**

- [ ] Explain what the Project Maintenance Agent does
- [ ] Understand the nightly audit process
- [ ] Know where to find Slack notifications
- [ ] Run an on-demand audit workflow
- [ ] Create missing documentation using dry-run preview
- [ ] Validate project structure and metadata
- [ ] Identify when to call for help
- [ ] Know the golden rule (always dry-run first!)

**If you checked all boxes, you're ready!** 🎉

---

## Additional Resources

- **For Developers:** `PHASE_2_KICKOFF.md` — Agent implementation details
- **For Operations:** `PHASE_4_OPERATIONS_RUNBOOK.md` — Procedures & runbooks
- **For Troubleshooting:** `PHASE_4_TROUBLESHOOTING.md` — Error solutions
- **For Setup:** `PHASE_3_IMPLEMENTATION.md` — Workflow architecture
- **For Webhooks:** `SLACK_WEBHOOK_SETUP.md` — Notification config

---

## Feedback

**Questions after training?**
- Check PHASE_4_FAQ.md
- Review PHASE_4_OPERATIONS_RUNBOOK.md for your scenario
- Create an issue on the epic (#1862)

**Suggestions for improvement?**
- Update this guide with your scenarios
- Add new troubleshooting tips
- Share common workflows with the team

---

*Training Guide v1.0 — 2026-08-18*  
*Expected time: 30 minutes*  
*Audience: Development team*
