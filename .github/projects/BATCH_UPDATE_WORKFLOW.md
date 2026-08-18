# Batch Update Workflow Guide

Complete walkthrough for updating all 57 active projects with status/priority/type/effort fields.

---

## 📋 Tools Available

| Tool | Purpose | Location |
|------|---------|----------|
| `update-projects-status.cjs` | Audit, template, and link suggestions | `scripts/automation/update-projects-status.cjs` |
| `batch-update-projects.cjs` | Batch update multiple projects | `scripts/automation/batch-update-projects.cjs` |
| `PRIORITIZED_PROJECTS_UPDATE_LIST.md` | Prioritized list by phase/priority | `.github/projects/PRIORITIZED_PROJECTS_UPDATE_LIST.md` |

---

## 🚀 Quick Start (5 minutes)

### Step 1: Generate CSV Template
```bash
cd .github
node scripts/automation/batch-update-projects.cjs generate-csv > critical-projects.csv
```

Output:
```csv
project,status,priority,type,effort
testing-agent-phase-2-4-2-7,active,critical,feature,40h
reviewer-agent-v2-2026-08,active,critical,feature,32h
```

### Step 2: Edit CSV with Your Data
```bash
# Edit the CSV with your editor
vim critical-projects.csv
```

Example completed CSV:
```csv
project,status,priority,type,effort
testing-agent-phase-2-4-2-7,active,critical,feature,40h
reviewer-agent-v2-2026-08,active,critical,feature,32h
prd-agent-prompt-improvements-2026-08,active,critical,feature,24h
pr-creation-agent-phase-2-2026-08-12,active,critical,feature,32h
portable-task-planning-agents-2026-08-12,active,critical,feature,28h
```

### Step 3: Apply Batch Update
```bash
node scripts/automation/batch-update-projects.cjs batch-file critical-projects.csv
```

Output:
```
=== BATCH UPDATE ===

Projects to update: 5
Fields: status, priority, type, effort

✓ testing-agent-phase-2-4-2-7: Updated status, priority, type, effort
✓ reviewer-agent-v2-2026-08: Updated status, priority, type, effort
✓ prd-agent-prompt-improvements-2026-08: Updated status, priority, type, effort
✓ pr-creation-agent-phase-2-2026-08-12: Updated status, priority, type, effort
✓ portable-task-planning-agents-2026-08-12: Updated status, priority, type, effort

=== SUMMARY ===

Success: 5
Errors: 0

Next: Review changes and commit
```

### Step 4: Verify Changes
```bash
git diff .github/projects/active/*/README.md | head -100
```

### Step 5: Commit
```bash
git add .github/projects/active/*/README.md
git commit -m "feat: Update project status fields (critical priority batch)

- Updated 5 critical projects with status/priority/type/effort
- testing-agent-phase-2-4-2-7: critical, 40h
- reviewer-agent-v2-2026-08: critical, 32h
- prd-agent-prompt-improvements-2026-08: critical, 24h
- pr-creation-agent-phase-2-2026-08-12: critical, 32h
- portable-task-planning-agents-2026-08-12: critical, 28h

All changes validated. No orphaned links."
```

---

## 📊 Full Workflow (All 57 Projects)

### Week 1: Critical Phase Blockers (9 projects)

**Projects:** From PRIORITIZED_PROJECTS_UPDATE_LIST.md, 🔴 Critical section

**Time:** ~1-2 hours
**Commands:**
```bash
node scripts/automation/batch-update-projects.cjs generate-csv > critical.csv
# Edit critical.csv with the 9 critical projects
node scripts/automation/batch-update-projects.cjs batch-file critical.csv
git diff .github/projects/active/*/README.md
git add .github/projects/active/*/README.md
git commit -m "feat: Update 9 critical phase-blocker projects"
```

### Week 2: High Priority Active Dev (15 projects)

**Projects:** From PRIORITIZED_PROJECTS_UPDATE_LIST.md, 🟠 High section

**Time:** ~2-3 hours (break into 3-4 batches)
**Commands:**
```bash
# Batch 1: 5 projects
node scripts/automation/batch-update-projects.cjs generate-csv > high-batch1.csv
node scripts/automation/batch-update-projects.cjs batch-file high-batch1.csv
git add .github/projects/active/*/README.md && git commit -m "feat: Update 5 high-priority projects (batch 1)"

# Batch 2: 5 projects
node scripts/automation/batch-update-projects.cjs generate-csv > high-batch2.csv
node scripts/automation/batch-update-projects.cjs batch-file high-batch2.csv
git add .github/projects/active/*/README.md && git commit -m "feat: Update 5 high-priority projects (batch 2)"

# Batch 3: 5 projects
node scripts/automation/batch-update-projects.cjs generate-csv > high-batch3.csv
node scripts/automation/batch-update-projects.cjs batch-file high-batch3.csv
git add .github/projects/active/*/README.md && git commit -m "feat: Update 5 high-priority projects (batch 3)"
```

### Week 3-4: Medium & Low Priority (33 projects)

**Projects:** From PRIORITIZED_PROJECTS_UPDATE_LIST.md, 🟡 Medium and 🔵 Low sections

**Time:** ~4-6 hours (break into 5-6 batches)
**Commands:** Same pattern as above

---

## 🎯 Update Value Mapping

Use this reference when filling out CSVs:

### By Project Type

| Type | Status | Priority | Effort |
|------|--------|----------|--------|
| **Agent Implementation** | active | critical/high | 24-40h |
| **Infrastructure/Workflows** | active | high/medium | 16-32h |
| **Planning/Design** | active/pending | medium | 16-24h |
| **Documentation** | active/pending | low/medium | 12-20h |
| **Old/Archived** | review/pending | low | 12-16h |

### By Project Status

| Status | Usage | When |
|--------|-------|------|
| **active** | In progress, making forward momentum | Most projects |
| **pending** | Waiting for approval/resources | Planning phases, waiting on decision |
| **review** | In code/design review | PRs open, design review pending |
| **blocked** | Can't proceed | Hard external dependency |
| **at_risk** | SLA breach or critical blocker | Stalled >7 days |

### Default Effort Estimates

```
agent-*.cjs files         → 32h (complex, many tests)
workflow files            → 24h (automation integration)
infrastructure scripts    → 20h (validation, deployment)
documentation files       → 12-16h (guides, tutorials)
planning/design phases    → 16-24h (requirements, design)
old/completed projects    → 12h (audit, cleanup)
```

---

## ✅ Command Reference

### Single Project Update
```bash
node scripts/automation/batch-update-projects.cjs update testing-agent-phase-2-4-2-7 \
  --status=active --priority=critical --type=feature --effort=40h
```

### Multiple Projects (comma-separated)
```bash
node scripts/automation/batch-update-projects.cjs update proj1,proj2,proj3 \
  --status=active --priority=high --type=infrastructure --effort=24h
```

### Batch from CSV
```bash
node scripts/automation/batch-update-projects.cjs batch-file projects.csv
```

### Generate CSV Template
```bash
node scripts/automation/batch-update-projects.cjs generate-csv > template.csv
```

### Validate Completion Status
```bash
node scripts/automation/batch-update-projects.cjs validate
```

### Show Help
```bash
node scripts/automation/batch-update-projects.cjs help
```

---

## 🔍 Audit & Validation

### Check What Needs Updating
```bash
node scripts/automation/update-projects-status.cjs audit
```

### See Update Templates
```bash
node scripts/automation/update-projects-status.cjs template | head -50
```

### Validate Current State
```bash
node scripts/automation/batch-update-projects.cjs validate
```

### Check Diff Before Commit
```bash
git diff .github/projects/active/*/README.md
```

---

## 📝 CSV Format Reference

**Columns:** `project`, `status`, `priority`, `type`, `effort`

**Valid Values:**
- **project:** Any folder name in `.github/projects/active/`
- **status:** `active` | `pending` | `review` | `blocked` | `at_risk`
- **priority:** `critical` | `high` | `medium` | `low`
- **type:** `feature` | `infrastructure` | `maintenance` | `documentation` | `testing` | `planning`
- **effort:** `8h` | `16h` | `24h` | `32h` | `40h` | `5d` | `10d` (numbers + h or d)

**Example CSV:**
```csv
project,status,priority,type,effort
testing-agent-phase-2-4-2-7,active,critical,feature,40h
reviewer-agent-v2-2026-08,active,critical,feature,32h
linting-agent-2026-08-12,active,high,feature,32h
branch-naming-enforcement-2026-08-11,active,high,infrastructure,20h
issue-maintenance-phase-5-2-staging-2026-08-12,active,high,feature,32h
chat-closure-agent-2026-08-12,active,high,feature,40h
```

---

## 🛠️ Troubleshooting

### "Invalid status: xxx"
Check spelling and use only: `active`, `pending`, `review`, `blocked`, `at_risk`

### "Invalid priority: xxx"
Use only: `critical`, `high`, `medium`, `low`

### "Invalid type: xxx"
Use only: `feature`, `infrastructure`, `maintenance`, `documentation`, `testing`, `planning`

### "Invalid effort format: xxx"
Use format like: `8h`, `24h`, `5d` (number + h for hours or d for days)

### "README.md not found"
Ensure project folder exists in `.github/projects/active/`

### Rollback Changes
```bash
git checkout .github/projects/active/*/README.md
```

---

## 📈 Progress Tracking

### After Each Batch
```bash
node scripts/automation/batch-update-projects.cjs validate
```

Output shows:
- Total projects: 57
- Complete: X
- Incomplete: 57-X

### Target Milestones
- After Week 1 (9 critical): Complete = 9
- After Week 2 (24 critical+high): Complete = 24
- After Week 3-4 (all): Complete = 57

---

## 💾 Commit Message Template

```
feat: Update X project status fields (batch {N})

- Updated {N} projects with status/priority/type/effort
- Priority: {critical|high|medium|low}
- Type: {feature|infrastructure|...}

Projects updated:
- project-1: {priority}, {effort}
- project-2: {priority}, {effort}
- ...

Validation: All projects validated, no missing links.
```

---

## 🎓 Learning Resources

- Full Guide: `.github/projects/ACTIVE_PROJECTS_STATUS_UPDATE_PROMPT.md`
- Quick Reference: `.github/projects/ACTIVE_PROJECTS_STATUS_QUICK_REFERENCE.md`
- Priority List: `.github/projects/PRIORITIZED_PROJECTS_UPDATE_LIST.md`
- Script Source: `scripts/automation/batch-update-projects.cjs`
- Helper Script: `scripts/automation/update-projects-status.cjs`

---

## ⏱️ Time Estimates

| Task | Time | Notes |
|------|------|-------|
| Generate CSV | 2 min | One-time per batch |
| Edit CSV | 5-10 min | 5-10 projects per batch |
| Run batch update | 1 min | Automated |
| Review changes | 5 min | Check diff |
| Commit | 2 min | Write good message |
| **Per batch (5-10 projects)** | **15-30 min** | Mostly manual editing |
| **All 57 projects** | **2-3 hours** | 5-6 batches total |

---

## 🚀 Getting Started Now

```bash
cd .github

# 1. Generate template
node scripts/automation/batch-update-projects.cjs generate-csv > my-projects.csv

# 2. Edit in your editor
nano my-projects.csv

# 3. Apply updates
node scripts/automation/batch-update-projects.cjs batch-file my-projects.csv

# 4. Review
git diff .github/projects/active/*/README.md

# 5. Commit
git add .github/projects/active/*/README.md
git commit -m "feat: Update project status fields"
```

Done! Repeat for each batch.
