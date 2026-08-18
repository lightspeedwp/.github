---
title: Project Maintenance Agent — Phase 3 Implementation Summary
description: GitHub Actions workflows and team integration for automated project maintenance
created_date: 2026-08-18
last_updated: 2026-08-18
status: complete
---

# Project Maintenance Agent — Phase 3 Implementation

**Phase Duration:** 2026-08-12 → 2026-08-18 (1 week)  
**PR:** [#2005](https://github.com/lightspeedwp/.github/pull/2005)  
**Status:** ✅ MERGED to `develop`  
**Merge Commit:** Pending first `git log` after merge

---

## Executive Summary

Phase 3 successfully delivers two production-ready GitHub Actions workflows for automated project maintenance:

1. **Nightly Audit Workflow** — Daily dry-run checks with Slack notifications
2. **On-Demand Operations Workflow** — Manual execution of audit, create, validate, and archive operations

Both workflows integrate with Phase 1 scripts and are ready for team deployment after Slack webhook configuration.

---

## Deliverables

### 1. GitHub Actions Workflows

#### Workflow 1: project-maintenance-nightly.yml

**Purpose:** Automated daily audit of project documentation

**Location:** `.github/workflows/project-maintenance-nightly.yml`

**Trigger:** 
- Scheduled: Daily at 2 AM UTC (`cron: '0 2 * * *'`)
- Manual: `workflow_dispatch` for testing

**Operations:**
1. Checkout repository
2. Execute Phase 1 script in dry-run mode
3. Analyze output for documentation gaps
4. Post results to Slack (via webhook)
5. Create GitHub issue if critical gaps detected (optional)

**Key Features:**
- ✅ Dry-run mode (no file modifications)
- ✅ Verbose output for debugging
- ✅ Slack webhook integration
- ✅ Error handling with clear feedback
- ✅ Runs on `ubuntu-latest`
- ✅ Can be manually triggered via GitHub Actions tab

**Example Output:**
```
Project Maintenance Audit — 2026-08-18 02:00 UTC

Total projects scanned: 52
Projects missing PLANNING.md: 5
Projects missing OPENSPEC.md: 12
Projects missing README.md: 0

Critical gaps (>3 files): 0

Recommendations:
  • Create PLANNING.md for: project-a, project-b, project-c, project-d, project-e
  • Create OPENSPEC.md for: 12 projects (see full report)

Approval workflow: Run on-demand workflow with create-docs operation
```

---

#### Workflow 2: project-maintenance-on-demand.yml

**Purpose:** Manual execution of project maintenance operations

**Location:** `.github/workflows/project-maintenance-on-demand.yml`

**Trigger:** Manual via `workflow_dispatch` with input parameters

**Inputs:**
```yaml
operation:
  type: choice
  description: 'Operation to perform'
  required: true
  options:
    - audit      # Check documentation completeness
    - create-docs # Generate missing files
    - validate    # Validate project structure
    - archive     # Move completed projects to archive

projects:
  type: string
  description: 'Project slugs (comma-separated) or "all"'
  required: true
  example: 'project-a,project-b' or 'all'

dry_run:
  type: boolean
  description: 'Preview mode (no file modifications)'
  required: true
  default: true
```

**Operations:**

**audit** — Check documentation status
- Analyzes specified projects
- Reports missing PLANNING.md, OPENSPEC.md, README.md
- Recommends next actions
- No file modifications

**create-docs** — Generate missing documentation
- Creates missing PLANNING.md files from template
- Creates missing OPENSPEC.md files from template
- Creates missing README.md files from template
- Dry-run preview before live execution
- Reports created count, skipped count, errors

**validate** — Check project structure
- Validates folder structure
- Checks frontmatter in markdown files
- Verifies required metadata fields
- Reports issues with recommendations

**archive** — Move projects to archive
- Moves completed projects from `active/` to `archive/`
- Creates `.archive-status.md` with archive metadata
- Updates parent `README.md` links
- Dry-run shows what will be moved

**Example Execution:**
```
Manual Workflow Dispatch:
  operation: create-docs
  projects: project-a,project-b
  dry_run: true

Output:
Dry-run mode (no files will be created)

project-a:
  ✓ PLANNING.md (would be created from template)
  ✓ README.md (already exists, skip)
  ✓ OPENSPEC.md (would be created from template)

project-b:
  ✓ PLANNING.md (already exists, skip)
  ✓ README.md (already exists, skip)
  ✗ OPENSPEC.md (template not found)

Summary: Would create 2 files, skip 2 files, 1 error

Next: Run with dry_run: false to apply changes
```

---

### 2. Slack Integration Documentation

**Location:** `.github/projects/active/project-maintenance-agent-phase-1-2026-08-12/SLACK_WEBHOOK_SETUP.md`

**Contents:**
- Webhook creation step-by-step guide
- GitHub Secrets configuration
- Slack channel setup for notifications
- Message format and customization
- Testing webhook connectivity
- Troubleshooting common issues

**Setup Steps (Summary):**
1. Create incoming webhook in Slack workspace
2. Add `PROJECT_MAINTENANCE_SLACK_WEBHOOK` secret to GitHub repository
3. Update workflow to reference the secret
4. Test with manual workflow dispatch
5. Configure alert thresholds if needed

**Expected Notifications:**
- Daily: Nightly audit results (gaps found)
- Manual: On-demand workflow results
- Critical: Alert if >5 projects missing documentation

---

## Technical Implementation

### Workflow Architecture

```
GitHub Actions Workflow
  ├── Checkout code
  ├── Execute Phase 1 Script
  │   ├── Scan .github/projects/active/
  │   ├── Check each project folder
  │   ├── Validate documentation
  │   └── Generate report
  ├── Process Results
  │   ├── Parse script output
  │   ├── Format for Slack
  │   ├── Identify gaps
  │   └── Generate recommendations
  └── Notify Team
      ├── Post to Slack webhook
      ├── Create GitHub issue (optional)
      └── Add workflow summary
```

### Integration with Phase 1 Scripts

Both workflows leverage Phase 1 automation scripts:

**Script:** `scripts/automation/project-docs-update.sh`

**Modes Used:**
```bash
# Nightly workflow
./scripts/automation/project-docs-update.sh \
  --dry-run \
  --verbose \
  --output-format json

# On-demand: audit
./scripts/automation/project-docs-update.sh \
  --audit \
  --projects "project-a,project-b"

# On-demand: create
./scripts/automation/project-docs-update.sh \
  --create \
  --projects "project-a,project-b" \
  --dry-run

# On-demand: validate
./scripts/automation/project-docs-update.sh \
  --validate \
  --projects "project-a,project-b"
```

---

## Configuration & Customization

### Environment Variables

**Global (set in workflow file):**
```yaml
env:
  PROJECTS_DIR: .github/projects/active
  ARCHIVE_DIR: .github/projects/archive
  TEMPLATES_DIR: .github/projects/_templates
```

**Nightly Workflow:**
```yaml
env:
  DRY_RUN: true
  VERBOSE: true
  SLACK_WEBHOOK: ${{ secrets.PROJECT_MAINTENANCE_SLACK_WEBHOOK }}
  ALERT_THRESHOLD: 5  # Critical if >5 projects have gaps
```

**On-Demand Workflow:**
```yaml
env:
  SLACK_WEBHOOK: ${{ secrets.PROJECT_MAINTENANCE_SLACK_WEBHOOK }}
  # DRY_RUN: set from user input
  # PROJECTS: set from user input
  # OPERATION: set from user input
```

### Customization Points

**Change nightly schedule:**
Edit `.github/workflows/project-maintenance-nightly.yml`
```yaml
schedule:
  - cron: '0 2 * * *'  # Change to desired time
```

**Change alert threshold:**
```yaml
ALERT_THRESHOLD: 5  # Change number of projects
```

**Modify Slack message format:**
Edit notification step in workflow to customize message template

**Add additional checks:**
Extend Phase 1 script with new validation rules

---

## Testing & Validation

### Pre-Merge Testing

Phase 3 workflows were tested:

✅ **Syntax Validation**
- YAML syntax checked
- Workflow triggers validated
- Input schemas verified

✅ **Dry-Run Testing**
- Nightly workflow executed in dry-run mode
- No files created
- Output format verified
- Slack message preview generated

✅ **Integration Testing**
- Phase 1 script integration confirmed
- Output parsing validated
- Error handling tested
- CI checks passed

### Post-Merge Testing Checklist

When Slack webhook is configured:

- [ ] Manual trigger of nightly workflow
  - [ ] Verify script executes
  - [ ] Check output format
  - [ ] Confirm Slack notification sent
  
- [ ] Test on-demand audit operation
  - [ ] Specify single project
  - [ ] Run in dry-run mode
  - [ ] Verify correct output
  
- [ ] Test on-demand create-docs operation
  - [ ] Run dry-run first
  - [ ] Review what would be created
  - [ ] Run live mode (if approved)
  - [ ] Verify files created

- [ ] Test on-demand validate operation
  - [ ] Check project structure
  - [ ] Review recommendations
  - [ ] Verify no modifications

- [ ] Test error handling
  - [ ] Invalid project name
  - [ ] Missing phase 1 script
  - [ ] Slack webhook failure (graceful degradation)

---

## Deployment & Operations

### Phase 3 Completion Status

**Workflows:** ✅ MERGED (PR #2005)
- `.github/workflows/project-maintenance-nightly.yml`
- `.github/workflows/project-maintenance-on-demand.yml`

**Documentation:** ✅ CREATED
- `SLACK_WEBHOOK_SETUP.md`
- This implementation summary
- Updated PLANNING.md with Phase 3 details

**Next Steps:**

1. **Immediate (Today):**
   - Review merged workflows in `develop` branch
   - Verify Phase 1 script integration
   - Plan Slack webhook setup timing

2. **This Week:**
   - Create Slack webhook in team workspace
   - Add `PROJECT_MAINTENANCE_SLACK_WEBHOOK` secret to GitHub
   - Manually test nightly workflow (trigger via workflow_dispatch)
   - Verify Slack notifications working

3. **Next Phase (Phase 4):**
   - Team training on using on-demand workflows
   - Document common operations
   - Create incident response runbooks
   - Setup monitoring/dashboards if needed

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **Slack Integration** — Requires manual webhook setup
   - *Future:* Use GitHub App for native integration

2. **Limited Error Recovery** — Failed operations require manual retry
   - *Future:* Automatic retry with exponential backoff

3. **No Approval Workflow** — On-demand operations run immediately
   - *Future:* Add GitHub approval requirement for destructive operations (archive)

4. **Single Output Format** — JSON output only
   - *Future:* Support CSV, markdown, email formats

### Future Enhancement Opportunities

1. **Dashboard/Reporting**
   - Track documentation completeness % over time
   - Visualize project archival history
   - Monitor script execution performance

2. **Advanced Notifications**
   - Email summaries (daily digest)
   - Custom alerts (Slack app with buttons)
   - PR comments with findings

3. **Approval Workflow**
   - Require approval for archive operations
   - Team lead sign-off on bulk changes
   - Conflict resolution workflow

4. **Phase 2 Agent Integration**
   - Call Maintenance Agent from workflows
   - Multi-provider support (Claude, Copilot, OpenAI)
   - Intelligent gap resolution

---

## Rollback & Troubleshooting

### If Workflows Have Issues

**To temporarily disable:**
1. Comment out the entire workflow file
2. OR delete the workflow file from `.github/workflows/`
3. Phase 1 scripts remain unchanged and functional

**To debug:**
1. Check "Actions" tab in GitHub for job logs
2. Look for errors in script output
3. Verify Phase 1 script is present and executable
4. Check Slack webhook secret is configured correctly

**Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| Workflow doesn't run on schedule | Cron expression wrong | Check cron format, try manual trigger first |
| Slack notification fails | Missing webhook secret | Add `PROJECT_MAINTENANCE_SLACK_WEBHOOK` to repo secrets |
| Script not found | Phase 1 not in develop | Verify Phase 1 PR was merged |
| Input validation error | Invalid operation value | Use only: audit, create-docs, validate, archive |
| Workflow times out | Too many projects | Test with subset first, then full run |

---

## Summary

**Phase 3 delivers:**
- ✅ 2 production-ready GitHub Actions workflows
- ✅ Full documentation and setup guides
- ✅ Integration with Phase 1 scripts
- ✅ Slack notification support
- ✅ Both scheduled and on-demand execution
- ✅ Dry-run mode for safe previews

**Ready for:**
- Team deployment after webhook configuration
- Phase 4 training and documentation
- Future integration with Phase 2 portable agent

**Status:** Production-ready, awaiting Slack webhook setup

---

*Phase 3 Implementation by ash — 2026-08-18*
