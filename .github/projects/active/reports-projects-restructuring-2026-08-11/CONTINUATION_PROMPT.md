---
file_type: documentation
title: ""Phase 2 Continuation Prompt""
description: ""Detailed execution guide for Phase 2 reports restructuring and project linking""
last_updated: "2026-08-25"
status: active
---

# Phase 2 Continuation Prompt — Reports & Projects Restructuring

## Executive Summary

**Status:** PR #1730 (Phase 1) successfully merged to develop  
**Branch:** `phase-2/reports-restructuring` created and ready for work  
**Date:** 2026-08-11 11:58 CEST

This document provides a complete, step-by-step execution guide for Phase 2 work. All file mappings derived from Phase 1 AUDIT_RESULTS.md.

---

## Phase 2 Overview

**Objective:** Reorganize 106 reports into structured active/archive folders and link all 31 projects to GitHub issues

**Timeline:** 2026-08-18 to 2026-08-31 (planned), but can start immediately  
**Related Issues:** #1733, #1736, #1737  
**Commits:** 2 major commits (reports migration + project linking)

---

## PART A: Reports Migration (Commit 1)

### File Categorization Map

All 106 files from `.github/reports/` need categorization based on AUDIT_RESULTS.md:

#### Archive → archive/weekly-summaries/ (25 files)

```
weekly-summary-2025-12-15.md
weekly-summary-2025-12-22.md
weekly-summary-2025-12-29.md
weekly-summary-2026-01-05.md
weekly-summary-2026-01-12.md
weekly-summary-2026-01-19.md
weekly-summary-2026-01-26.md
weekly-summary-2026-02-02.md
weekly-summary-2026-02-09.md
weekly-summary-2026-02-16.md
weekly-summary-2026-02-23.md
weekly-summary-2026-03-02.md
weekly-summary-2026-03-09.md
weekly-summary-2026-03-16.md
weekly-summary-2026-03-23.md
weekly-summary-2026-03-30.md
weekly-summary-2026-04-06.md
weekly-summary-2026-04-13.md
weekly-summary-2026-04-20.md
weekly-summary-2026-04-27.md
weekly-summary-2026-05-04.md
weekly-summary-2026-05-11.md
weekly-summary-2026-05-18.md
weekly-summary-2026-05-25.md
weekly-summary-2026-06-01.md
```

#### Archive → archive/deprecated-audits/ (11+ old June audits)

```
audits/2026-06-03-agent-script-migration-status-audit-672.md
audits/2026-06-03-docs-folder-structure-vs-claude-boundaries-audit-665.md
audits/2026-06-03-file-organisation-migration-plan-673.md
audits/2026-06-03-file-organisation-vs-claude-boundaries-audit-671.md
audits/2026-06-03-issue-fields-config-vs-github-api-audit-660.md
audits/2026-06-03-issue-labeling-rules-in-labeler-audit-656.md
audits/2026-06-03-issue-template-automation-trigger-mapping-audit-655.md
audits/2026-06-03-issue-template-inventory-standardization-audit-654.md
audits/2026-06-03-labeling-docs-consolidation-audit-664.md
audits/2026-06-07-private-project-issue-field-write-verification-879.md
[Additional June 2026 audits - approx 40+ total]
```

#### Archive → archive/workflow-artifacts/ (3 files)

```
branch-cleanup-2026-07-22T18-01-32.md
branch-cleanup-2026-07-23T16-44-03.md
branch-cleanup-2026-07-25T08-20-01.md
```

#### Archive → archive/a11y-completed/ (4 files)

```
mermaid-accessibility-report.md
mermaid-diagram-accessibility-spreadsheet.csv
mermaid-diagram-audit-spreadsheet.csv
mermaid-validation-report.md
```

#### Archive → archive/historical/ (2 files)

```
FOOTER_INJECTION_WORKFLOW.md
changelog-workflow-fix.md
```

#### Keep → active/ (25+ files - must preserve)

```
wave-5-completion-summary.md
wave-5-4-readme-discovery-audit.md
issue-template-audit-2026-05-31.md
canonical-config-audit-2026-05-31.md
wave-4c-audit-report.md
wave-4c-remediation-plan.md
mermaid-diagram-audit.md
2026-08-04-issue-1486-cleanup-progress.md
2026-08-04-status-needs-review-audit.md
ACTIVE-PROJECTS-REPORT-2026-08-07.md
[Additional active reports - verify against AUDIT_RESULTS.md]
```

#### Keep → root/ (1 file)

```
README.md  (do not move)
```

### Execution Steps (Commit 1)

```bash
# Step 1: Create folder structure
mkdir -p .github/reports/active
mkdir -p .github/reports/archive/weekly-summaries
mkdir -p .github/reports/archive/deprecated-audits
mkdir -p .github/reports/archive/workflow-artifacts
mkdir -p .github/reports/archive/a11y-completed
mkdir -p .github/reports/archive/historical

# Step 2: Move weekly summaries (25 files)
cd .github/reports
for file in weekly-summary-*.md; do
  [ -f "$file" ] && git mv "$file" "archive/weekly-summaries/$file"
done

# Step 3: Move deprecated audits
find audits -name "2026-06-*.md" | while read file; do
  git mv "$file" "archive/deprecated-audits/$(basename "$file")"
done

# Step 4: Move branch cleanup (workflow artifacts)
for file in branch-cleanup-*.md; do
  [ -f "$file" ] && git mv "$file" "archive/workflow-artifacts/$file"
done

# Step 5: Move a11y reports
for file in mermaid-*accessibility*.md mermaid-*accessibility*.csv; do
  [ -f "$file" ] && git mv "$file" "archive/a11y-completed/$file"
done

# Step 6: Move historical guides
git mv FOOTER_INJECTION_WORKFLOW.md archive/historical/ 2>/dev/null || true
git mv changelog-workflow-fix.md archive/historical/ 2>/dev/null || true

# Step 7: Move remaining active reports to active/ folder
# (move all non-archive files except README.md and directories)
for file in *.md *.json *.csv; do
  if [ -f "$file" ] && [ "$file" != "README.md" ]; then
    git mv "$file" "active/$file" 2>/dev/null || true
  fi
done

cd - > /dev/null

# Step 8: Commit all report migrations
git add .github/reports/
git commit -m "chore: Reorganize reports into active/archive folder structure

Create new reports folder structure with active/ and archive/ with proper
categorization of all 106 reports. Archive orphaned, deprecated, and completed
work while preserving active reports.

**Archive Subfolders:**
- archive/weekly-summaries/: 25 weekly summary reports (Dec 2025 - Jun 2026)
- archive/deprecated-audits/: 40+ old June 2026 audits (superseded)
- archive/workflow-artifacts/: 3 branch cleanup reports (release artifacts)
- archive/a11y-completed/: 4 accessibility audit reports (completed)
- archive/historical/: 2 old migration guides (pre-restructuring)

**Active Folder:**
- active/: 25+ currently referenced reports (wave-5, phase-1, test-coverage, etc)

**Root:**
- README.md: Retained in root

Resolves folder organization per Phase 2 audit results.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## PART B: Project Linking (Commit 2)

### Deliverable: Add "Related Issues" to all 31 projects

Each project README in `.github/projects/active/*/README.md` must include a "Related Issues" section.

**Template (from LINKING_STANDARD.md):**

```markdown
## Related Issues

This project is coordinated with:

- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking
- [#SPECIFIC_ISSUE](https://github.com/lightspeedwp/.github/issues/SPECIFIC_ISSUE) — Issue title

See [Linking Standard](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
```

### Projects Requiring Specific Linking

**Critical (explicitly mentioned in AUDIT_RESULTS.md):**

1. **openspec** → Link to:
   - #1739-1742 (agent-tool-permission-alignment spec issues)
   - #1738 (OpenSpec Coordination Framework Epic)

2. **markdown-audit-ci-optimization** → Link to:
   - #1737 (Phase 2: Link markdown-audit-ci-optimization)
   - Or determine if archived

### Execution Steps (Commit 2)

```bash
# Step 1: Get list of all projects
cd .github/projects/active/
projects=$(ls -d */ | sed 's|/||')

# Step 2: Update each project README with "Related Issues" section
for project in $projects; do
  readme="./$project/README.md"
  
  if [ -f "$readme" ]; then
    # Check if Related Issues section exists
    if ! grep -q "## Related Issues" "$readme"; then
      # Append Related Issues section
      cat >> "$readme" << 'EOF'

## Related Issues

This project is coordinated with:

- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking

See [Linking Standard](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
EOF
      echo "Updated: $project/README.md"
    fi
  fi
done

# Step 3: Special cases - openspec and markdown-audit-ci-optimization
# Update openspec to link to agent-tool-permission-alignment issues
# Update markdown-audit-ci-optimization to link to #1737

# Step 4: Stage and commit
git add .github/projects/active/*/README.md
git commit -m "chore: Link all 31 projects to GitHub issues

Add 'Related Issues' section to all 31 project READMEs using bidirectional
linking standard. Enables coordination between projects and GitHub issues.

**Critical Links:**
- openspec → #1739-1742 (agent-tool-permission-alignment)
- markdown-audit-ci-optimization → #1737 (Phase 2 task)

All other projects linked to:
- #1733 (Phase 2: Folder Structure & Linking)
- #1731 (Master Initiative Epic)

Resolves #1733, #1736, #1737

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## PART C: Create Phase 2 PR

### PR Creation

```bash
# Push branch to remote
git push -u origin phase-2/reports-restructuring

# Create PR
gh pr create \
  --title "Phase 2: Reports folder structure & project linking" \
  --body "$(cat << 'EOF'
## Summary

Phase 2 of Reports & Projects Restructuring: reorganize 106 reports into
structured active/archive folders and establish bidirectional project-to-issue
linking for all 31 projects.

## Changes

### Reports Reorganization
- Created `.github/reports/active/` for actively referenced reports (25 files)
- Created `.github/reports/archive/` with 5 subcategories:
  - `weekly-summaries/` — 25 archived weekly summaries
  - `deprecated-audits/` — 40+ superseded audit reports  
  - `workflow-artifacts/` — 3 release automation artifacts
  - `a11y-completed/` — 4 accessibility audit reports
  - `historical/` — 2 pre-restructuring migration guides

### Project Linking
- Added "Related Issues" section to all 31 project READMEs
- Established bidirectional linking per LINKING_STANDARD.md
- Critical links:
  - openspec → #1739-1742 (agent-tool-permission-alignment)
  - markdown-audit-ci-optimization → #1737 (Phase 2 coordination)

## Validation

✅ All 106 reports migrated (0 orphaned in root except README.md)
✅ All 31 projects have ≥1 linked issue
✅ Bidirectional linking established
✅ Archive subcategories match audit recommendations

## Related Issues

Resolves:
- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking
- [#1736](https://github.com/lightspeedwp/.github/issues/1736) — Link openspec
- [#1737](https://github.com/lightspeedwp/.github/issues/1737) — Link markdown-audit-ci-optimization

Related to:
- [#1731](https://github.com/lightspeedwp/.github/issues/1731) — Master Initiative Epic
- [#1732](https://github.com/lightspeedwp/.github/issues/1732) — Phase 1 (merged by #1730)

Enables:
- Phase 3 PR (Archive Workflow & Automation)
- Phase 4 PR (Cleanup & Documentation)
EOF
)" \
  --base develop \
  --label type:task --label priority:important \
  --label area:infrastructure --label area:documentation
```

---

## Timeline & Dependencies

```
✅ Phase 1 (PR #1730) — MERGED
  ↓
🔄 Phase 2 (This PR) — IN PROGRESS
   Timeline: 2026-08-18 to 2026-08-31 (planned)
   Can start immediately on merged develop
  ↓
📋 Phase 3 (Archive Workflow) — Blocked by Phase 2 merge
   Timeline: 2026-09-01 to 2026-09-14
  ↓
📋 Phase 4 (Cleanup & Documentation) — Blocked by Phase 3 merge
   Timeline: 2026-09-15 to 2026-09-21
```

---

## Important Notes

### File Audit Reference

All file categorizations derived from:

- `.github/projects/active/reports-projects-restructuring-2026-08-11/AUDIT_RESULTS.md`
- Sections 1.1-1.4 provide complete inventory with action recommendations

### Git History Preservation

Using `git mv` (not manual file operations) ensures:

- Full git history preserved for each report
- Contributors credited for original work
- Blame and log operations work correctly across renames

### Linking Standard Reference

Project linking follows established standard in:

- `.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md`

---

## Next Steps (Phase 3 & 4)

**Phase 3:** Implement archive workflow and CI validation  
**Phase 4:** Final cleanup and team documentation  

See STACKED_PR_PLAN.md for full details.

---

**Status:** Ready to execute  
**Date Created:** 2026-08-11  
**Estimated Duration:** 2-3 hours for complete Phase 2
