---
title: "Scripts Architecture & Reference"
description: "Complete guide to project management scripts, dependencies, and execution patterns"
file_type: "architecture"
created_date: "2026-09-03"
last_updated: "2026-09-03"
---

# Scripts Architecture & Reference

**Overview**: Complete technical reference for all 8 project management scripts.

---

## Quick Reference

| Script | Purpose | Input | Output | Trigger |
|--------|---------|-------|--------|---------|
| `collect-link-targets.js` | Find modified markdown files in PRs | GitHub event env vars | JSON: `files=...` output var | Pull request changes |
| `validate-reports-structure.js` | Validate all project README frontmatter | Project directory | YAML validation report | Manual / CI |
| `archive-projects.cjs` | Archive completed/inactive projects | Env: ARCHIVE_LIST, DRY_RUN | Archived projects report | Manual / Scheduled |
| `scan-completion.cjs` | Detect project completion status | Project directory | JSON: completed projects | Manual / Scheduled |
| `orchestrate-phase-progression.cjs` | Update project phase based on events | GitHub event, arguments | Label synced, phase updated | Issue/PR labeled/created |
| `update-projects-status.cjs` | Audit, template, and link projects | Project directory | Audit/template/linking output | Manual (4 modes) |
| `project-docs-update.sh` | Update project documentation files | Project directory + templates | Updated .md files | Manual / Scheduled |

---

## Script 1: `collect-link-targets.js`

### Purpose
Identifies markdown files modified in a pull request to determine what needs link updates.

### Input
**Environment Variables**:
- `GITHUB_EVENT_NAME` — GitHub event type (`push`, `pull_request`, `release`, etc.)
- `GITHUB_EVENT_PATH` — Path to event JSON file
- `BASE_SHA` — Base commit for comparison
- `HEAD_SHA` — Head commit for comparison

### Output
**GitHub Actions Output Variable**:
```
files=src/api.md,docs/guide.md,docs/examples.md
```

### Execution Flow
1. Check if event is `push` or `pull_request` (early exit if not)
2. Run `git diff --name-only <BASE_SHA> <HEAD_SHA>`
3. Filter for `*.md` files
4. Set GitHub Actions output variable `files=...`

### Error Handling
- ✅ Exits early if event is not relevant (not an error)
- ✅ Returns empty list if no markdown files changed
- ✅ Handles missing environment variables gracefully

### Test Coverage
- ✓ Early exit conditions (15 test cases)
- ✓ File filtering and formatting (50% of tests)
- ✓ GitHub output variable formatting

### Usage Example
```bash
# In GitHub Actions workflow
- name: Collect link targets
  id: collect
  run: node scripts/collect-link-targets.js
  env:
    GITHUB_EVENT_NAME: ${{ github.event_name }}
    BASE_SHA: ${{ github.event.pull_request.base.sha }}
    HEAD_SHA: ${{ github.event.pull_request.head.sha }}

- name: Use collected files
  run: echo "Files: ${{ steps.collect.outputs.files }}"
```

---

## Script 2: `validate-reports-structure.js`

### Purpose
Validates all project README files for correct YAML frontmatter and required structure.

### Input
**Directory**: `.github/projects/active/*/README.md`

### Output
```
✅ Report validation passed
```

Or detailed validation report on errors:
```
❌ Project: label-prefix-audit-2026-08-05
   - Missing field: status
   - Invalid value for priority: "urgent" (must be critical/high/medium/low)
```

### Validation Rules

**Required Frontmatter Fields**:
- `status` ∈ [active, pending, review, blocked, completed, at_risk]
- `priority` ∈ [critical, high, medium, low]
- `type` ∈ [audit, consolidation, enhancement, infrastructure, documentation, etc.]
- `effort` — format: "8h", "20h", "3 weeks"
- `title` — non-empty string
- `created_date` — YYYY-MM-DD format
- `last_updated` — YYYY-MM-DD format

**Required Sections**:
- At least one of: Related Issues, Related PRs, or Related Resources
- Clear project status in intro paragraph

### Execution Flow
1. Scan `.github/projects/active/*/` for all directories
2. For each directory, read `README.md`
3. Parse YAML frontmatter
4. Validate field presence and format
5. Report results (pass/fail + details)

### Error Handling
- ✅ Handles missing README files (warning, skip)
- ✅ Handles malformed YAML (error, detailed message)
- ✅ Handles invalid field values (warning, suggest correct values)

### Test Coverage
- ✓ Directory validation (10 tests)
- ✓ Filename validation (5 tests)
- ✓ YAML parsing (8 tests)
- ✓ Field validation (20 tests)
- ✓ Section detection (5 tests)

### Usage Example
```bash
# Validate all projects
node scripts/validate-reports-structure.js

# In CI (GitHub Actions)
- name: Validate project structure
  run: node scripts/validate-reports-structure.js
```

---

## Script 3: `archive-projects.cjs` (CommonJS)

### Purpose
Archives completed or inactive projects by moving them from `active/` to `archived/`.

### Input
**Environment Variables**:
- `ARCHIVE_LIST` — Comma-separated project slugs: `project-1,project-2,project-3`
- `DRY_RUN` — Set to `true` for testing (no actual moves)
- `BATCH_SIZE` — Default 10, max projects per run

### Output
**Report**:
```
📦 Archiving projects...
✅ Archived: label-prefix-audit-2026-08-05 → .github/projects/archived/
✅ Archived: workflows-consolidation-2026-q3 → .github/projects/archived/
📊 Results: 2 archived, 0 failed
```

### Execution Flow
1. Parse ARCHIVE_LIST environment variable
2. For each project slug:
   - Validate project exists in `.github/projects/active/`
   - Check that `.github/projects/archived/` exists (create if not)
   - Copy entire project directory to `archived/`
   - Delete from `active/`
   - Log result
3. Generate summary report

### Error Handling
- ✅ Handles missing projects (skip + warning)
- ✅ Handles directory creation failures (rollback previous moves)
- ✅ Dry-run mode prevents accidental deletions
- ✅ Batch size protection prevents mass archival

### Test Coverage
- ✓ Environment variable parsing (10 tests)
- ✓ Project validation (15 tests)
- ✓ Directory operations (8 tests)
- ✓ Error handling (7 tests)

### Usage Example
```bash
# Dry run (safe test)
ARCHIVE_LIST=project-1,project-2 DRY_RUN=true node scripts/workflows/projects/archive-projects.cjs

# Actual archival
ARCHIVE_LIST=project-1,project-2 node scripts/workflows/projects/archive-projects.cjs

# In GitHub Actions
- name: Archive completed projects
  env:
    ARCHIVE_LIST: ${{ env.PROJECTS_TO_ARCHIVE }}
    DRY_RUN: false
  run: node scripts/workflows/projects/archive-projects.cjs
```

---

## Script 4: `scan-completion.cjs` (CommonJS)

### Purpose
Scans all projects to identify completion indicators (status fields, PARENT_ISSUE.md files).

### Input
**Directory**: `.github/projects/active/*/`

### Output
**JSON Array** (GitHub Actions output):
```json
[
  {
    "slug": "label-prefix-audit-2026-08-05",
    "status": "active",
    "has_parent_issue": false,
    "parent_issue_number": null
  },
  {
    "slug": "scripts-audit-2026-09-03",
    "status": "active",
    "has_parent_issue": true,
    "parent_issue_number": 2687
  }
]
```

### Execution Flow
1. Scan all directories in `.github/projects/active/`
2. For each project:
   - Read `README.md` frontmatter (extract `status`)
   - Check for `PARENT_ISSUE.md` file
   - If PARENT_ISSUE.md exists, parse issue number from filename or content
3. Compile results to JSON
4. Set GitHub Actions output variable: `projects_json=...`

### Detection Logic
**Completion Indicators**:
- `status: completed` in frontmatter
- Existence of `PARENT_ISSUE.md` file
- `has_parent_issue: true` field

### Test Coverage
- ✓ Directory scanning (10 tests)
- ✓ Project filtering (8 tests)
- ✓ Completion detection (15 tests)
- ✓ PARENT_ISSUE parsing (6 tests)

### Usage Example
```bash
# Scan all projects
node scripts/workflows/projects/scan-completion.cjs

# In GitHub Actions (JSON output)
- id: scan
  run: node scripts/workflows/projects/scan-completion.cjs
- name: Archive completed
  run: |
    COMPLETED='${{ steps.scan.outputs.projects_json }}'
    # Process JSON to extract completed projects
```

---

## Script 5: `orchestrate-phase-progression.cjs` (CommonJS)

### Purpose
Automatically updates project phase labels based on GitHub events (PR merge, issue labeling).

### Input
**Arguments**:
```bash
orchestrate-phase-progression.cjs <event_type> [issue_number] [labels...]
```

**Environment Variables**:
- `GITHUB_EVENT_NAME` — Event type
- `GITHUB_REPOSITORY` — Repo owner/name
- `GITHUB_TOKEN` — GitHub API token

### Output
```
✅ Phase progression synchronized
  Issue: #2687
  Previous phase: specification
  New phase: implementation
  Labels applied: phase:implementation (removed: phase:specification)
```

### Execution Flow
1. Parse event type and arguments
2. Determine current phase from existing labels
3. Based on event, determine next phase:
   - `PR opened` → moved to `implementation` phase
   - `PR merged` → moved to `deployment` phase
   - `issue labeled` → check new label for phase
4. Sync labels via GitHub API
5. Log all changes to audit trail

### Event Type Handling

| Event | Trigger | Phase Change |
|-------|---------|--------------|
| `pr_opened` | PR created | → `implementation` |
| `pr_merged` | PR merged | → `deployment` |
| `issue_labeled` | Label added | → based on label |
| `issue_unlabeled` | Label removed | revert phase |

### Label Schema
```
phase:specification   # Initial state
phase:implementation  # Development started
phase:testing         # Ready for testing
phase:deployment      # Approved for deploy
phase:completed       # Released
```

### Test Coverage
- ✓ Argument parsing (12 tests)
- ✓ Event type detection (10 tests)
- ✓ Label syncing (15 tests)
- ✓ Issue linking (8 tests)

### Usage Example
```bash
# When PR is opened
node scripts/workflows/orchestrate-phase-progression.cjs pr_opened 2687

# When PR is merged
node scripts/workflows/orchestrate-phase-progression.cjs pr_merged 2687

# In workflow
- name: Sync phase labels
  run: |
    node scripts/workflows/orchestrate-phase-progression.cjs \
      ${{ github.event_name }} \
      ${{ github.event.issue.number }}
```

---

## Script 6: `update-projects-status.cjs` (CommonJS)

### Purpose
Multi-purpose script for auditing, generating templates, and creating linking suggestions.

### Input
**Command**: `<audit|template|link|help>`

### Output Modes

#### Mode 1: `audit`
```
✅ Complete: label-prefix-audit-2026-08-05
⚠️  Missing fields: priority, type, effort
```

#### Mode 2: `template`
```
📄 adr-agent-portability-org/README.md:
Add to frontmatter:
status: active|pending|review|blocked|at_risk
priority: critical|high|medium|low
effort: "24h"
```

#### Mode 3: `link`
```
agent-skills-standards-comprehensive: Link back from issues:
  Issue #1733:
    Add to issue body:
    ## 📋 Project Reference
    **Related Project:** [...]
```

#### Mode 4: `help`
```
Usage: update-projects-status.cjs <command>

Commands:
  audit    - Audit all projects for missing metadata
  template - Generate metadata templates
  link     - Generate linking suggestions
  help     - Show this help message
```

### Execution Flow

**Audit Mode**:
1. Scan all projects
2. Check each for required fields: status, priority, type, effort
3. Check for required sections: Related Issues
4. Report complete vs. incomplete

**Template Mode**:
1. Identify projects missing fields
2. Generate template snippets with:
   - Field names
   - Example values
   - Copy-paste ready format

**Link Mode**:
1. Parse Related Issues from projects
2. For each related issue number:
   - Suggest backlink to project
   - Provide markdown template
   - Group by issue

### Test Coverage
- ✓ Command parsing (8 tests)
- ✓ Frontmatter extraction (12 tests)
- ✓ Field validation (15 tests)
- ✓ Template generation (12 tests)
- ✓ Linking suggestions (13 tests)

### Usage Example
```bash
# Audit all projects
node scripts/automation/update-projects-status.cjs audit

# Generate templates
node scripts/automation/update-projects-status.cjs template

# Generate linking suggestions
node scripts/automation/update-projects-status.cjs link

# Show help
node scripts/automation/update-projects-status.cjs help
```

---

## Script 7: `project-docs-update.sh` (Bash)

### Purpose
Batch updates project documentation with consistent structure and metadata.

### Input
**Arguments**:
```bash
project-docs-update.sh <project_dir> <template_dir> [--dry-run] [--verbose]
```

### Output
```
✅ Updated: .github/projects/active/label-prefix-audit-2026-08-05/README.md
✅ Updated: CONSOLIDATED_FINDINGS.md with latest frontmatter
📊 Total: 2 files updated
```

### Features
- Batch process multiple projects
- Apply consistent frontmatter
- Generate derived documentation
- Safe dry-run mode

### Test Coverage
- ✓ File operations (12 tests)
- ✓ Template processing (10 tests)
- ✓ Bash test suite (integration tests)

### Usage Example
```bash
# Single project (dry run)
./scripts/project-docs-update.sh \
  .github/projects/active/label-prefix-audit-2026-08-05 \
  ./templates \
  --dry-run

# Batch update (all projects)
for dir in .github/projects/active/*/; do
  ./scripts/project-docs-update.sh "$dir" ./templates
done
```

---

## Execution Sequence & Dependencies

### Recommended Workflow

```
1. collect-link-targets.js
   └─ Identifies changed files
      └─ Input to downstream link-checking

2. validate-reports-structure.js
   └─ Validates all projects
      └─ Must pass before other ops

3. scan-completion.cjs
   └─ Finds completed projects
      └─ Input to archive-projects

4. archive-projects.cjs (optional)
   └─ Archives completed
      └─ Only if scan found completions

5. update-projects-status.cjs audit
   └─ Checks current state
      └─ Identifies what needs updating

6. update-projects-status.cjs template
   └─ Generates update templates
      └─ For manual application

7. update-projects-status.cjs link
   └─ Suggests backlinking
      └─ For manual issue updates

8. orchestrate-phase-progression.cjs
   └─ Syncs phase labels (event-driven)
      └─ Runs on PR/issue events
```

### Data Flow

```
GitHub Events
  ↓
collect-link-targets.js
  ↓ (changed .md files)
↓
Project Directory
  ↓
validate-reports-structure.js
  ↓ (validation status)
├─→ ✅ Pass: Proceed
└─→ ❌ Fail: Fix frontmatter
     ↓
     update-projects-status.cjs template
       ↓ (generate templates)
       ↓ (apply fixes manually)
       ↓
       validate-reports-structure.js (re-run)

  ↓ (if pass)
  scan-completion.cjs
    ↓ (find completed)
    ├─→ Yes: archive-projects.cjs
    └─→ No: Continue

  ↓
  update-projects-status.cjs audit
    ↓ (audit metadata)
    ├─→ Missing: template + link
    └─→ Complete: Done

  ↓
  orchestrate-phase-progression.cjs (event-driven)
    ↓ (sync phases)
    ↓ (on PR/issue events)
```

---

## Error Scenarios & Recovery

| Scenario | Script | Handling |
|----------|--------|----------|
| Missing README.md | validate | Skip + warning |
| Invalid YAML | validate | Error + details |
| Missing PARENT_ISSUE.md | scan-completion | OK (optional) |
| GitHub API rate limit | orchestrate | Retry with backoff |
| Permission denied | archive | Fail safely, log error |
| Invalid phase label | orchestrate | Suggest valid values |

---

## Integration Points

### GitHub Actions
- `collect-link-targets.js` → Pull request workflows
- `validate-reports-structure.js` → CI checks
- `orchestrate-phase-progression.cjs` → Issue/PR event handlers
- `update-projects-status.cjs` → Scheduled audits

### CLI / Manual
- All scripts can be run manually for testing
- Dry-run modes available where applicable
- Help text available for all commands

---

## Maintenance & Extension

### Adding New Scripts
1. Follow naming pattern: `{verb}-{object}.{js|cjs}`
2. Implement same error handling patterns
3. Create unit tests (Jest format)
4. Document in this file under new section
5. Add to execution sequence if needed

### Updating Script Logic
1. Update script file
2. Update corresponding test file (if exists)
3. Run: `npm test`
4. Update this documentation
5. Create PR with changes

---

**Last Updated**: 2026-09-03  
**Maintainer**: Claude Code  
**Related**: [AGENT_ARCHITECTURE.md](./AGENT_ARCHITECTURE.md), [WORKFLOW_ARCHITECTURE.md](./WORKFLOW_ARCHITECTURE.md)
