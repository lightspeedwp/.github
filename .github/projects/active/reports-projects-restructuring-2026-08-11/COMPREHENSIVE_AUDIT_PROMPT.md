---
title: "Comprehensive Reports & Projects Restructuring Audit Prompt"
description: "Reusable prompt for agents to execute the full audit, cleanup, and restructuring of .github/reports/ and .github/projects/active/ folders."
type: "agent-prompt"
created_date: "2026-08-11"
---

# Comprehensive Reports & Projects Restructuring Audit Prompt

## Overview

This prompt guides agents through a complete audit, cleanup, and restructuring of GitHub reports and active projects. It produces a structured execution plan with clear priorities, dependencies, and deliverables.

## Audit Phase 1: Inventory & Analysis

### 1.1 Reports Inventory (`.github/reports/`)

**Objective:** Create a complete inventory of all reports with metadata and reference analysis.

**Tasks:**

1. List all files and folders in `.github/reports/`
2. For each report, extract:
   - File size
   - Creation date (via git log: `git log --follow --diff-filter=A --format=%aI -- <file> | tail -1`)
   - Last modified date (via git log: `git log -1 --format=%aI -- <file>`)
   - Content type (infer from filename, path, and content preview)
   - Current location (root vs. subfolder)
3. Search entire codebase for references to each report:
   - `grep -r "report-filename" .github/projects/active/`
   - `grep -r "report-filename" docs/`
   - `grep -r "report-filename" .github/workflows/`
   - `grep -r "report-filename" CLAUDE.md AGENTS.md`
4. Flag reports by status:
   - **Orphaned** (0 references)
   - **Referenced by projects** (active external refs)
   - **Internal only** (only in reports folder)

**Output:** CSV with columns: `filename, location, created_date, modified_date, content_type, reference_count, referenced_by, status`

### 1.2 Active Projects Inventory (`.github/projects/active/`)

**Objective:** Catalog all active projects with metadata and activity analysis.

**Tasks:**

1. List all project folders in `.github/projects/active/`
2. For each project:
   - Get creation date (earliest file in folder)
   - Get last modification date
   - Count files by type (`.md`, `.yaml`, etc.)
   - Extract issue numbers from project docs (grep for `#\d{4,}` or `Resolves/Closes`)
   - List all markdown files (documentation depth)
3. Search codebase for references to each project:
   - `grep -r "project-slug" .github/workflows/`
   - `grep -r "project-slug" docs/`
   - `grep -r "project-slug" instructions/`
   - Count and categorize references
4. Identify project health:
   - **Active:** Updated within last 30 days, has issue links, has external refs
   - **Completed:** No recent updates, marked complete, >3 months old
   - **Unlinked:** Zero issue links found
   - **Orphaned:** No updates, no external refs, no issue links

**Output:** JSON with project objects: `{name, path, created, last_modified, file_count, issue_links, reference_count, referenced_by, status}`

### 1.3 Linking Analysis

**Objective:** Identify gaps in bidirectional linking between projects and issues.

**Tasks:**

1. For each active project:
   - Extract all issue numbers (grep project docs for `#\d{4,}`)
   - Note if issues are linked via `Resolves #`, `Closes #`, or just mentioned
2. For each referenced issue (if GitHub API available):
   - Check if issue description/body links back to project
   - Flag as "linked" or "unlinked"
3. For each report:
   - Count projects that reference it
   - Flag as "actively used", "deprecated", or "orphaned"

**Output:** JSON with gaps: `{projects_without_issue_links: [...], issues_without_project_links: [...], orphaned_reports: [...]}`

---

## Planning Phase 2: Prioritization & Structure Design

### 2.1 Report Categorization

**Objective:** Design the new report folder structure based on actual content patterns.

**Tasks:**

1. Group reports by inferred category (from audit data):
   - Audits (code audits, accessibility, schema validation)
   - Analysis (coverage analysis, workflow analysis, metrics)
   - Project Outputs (generated from active project work)
   - Deprecated (old, referenced, but historical only)
   - Weekly/Periodic (summary reports, rotation artifacts)
2. For each category, propose a folder path
3. Identify reports that belong in multiple categories (note conflict)
4. Propose lifecycle policy:
   - Reports age 0-2 months: `reports/active/`
   - Reports age 2-12 months: `reports/archive/`
   - Reports age >12 months: `reports/history/` (optional)

**Output:** Tree structure with categorization and count per category

### 2.2 Project Archival Strategy

**Objective:** Design process for safely archiving completed projects without breaking links.

**Tasks:**

1. For projects flagged as "completed":
   - Identify if any issues remain open (if API available)
   - Count external references
   - Determine if project can be safely moved or must stay in active/
2. Design archive metadata file (`.archive-status.md` template)
3. For projects flagged as "unlinked":
   - Identify which GitHub issues should be linked
   - Create linking recommendations
4. Propose folder structure for archived projects:
   - `projects/active/` (ongoing)
   - `projects/archive/{year}/{slug}/` (completed, with history)

**Output:** Archive strategy document with project-by-project recommendations

### 2.3 Bidirectional Linking Standard

**Objective:** Design linking pattern for projects ↔ issues.

**Tasks:**

1. Create template for "Related Issues" section in project docs
2. Create template for "Related Projects" comment in GitHub issues
3. Document the linking format and when to use it
4. Propose CI validation:
   - Flag projects with 0 issue links
   - Flag issues with 0 project links (optional, noisy)

**Output:** Linking standard document with templates and examples

---

## Execution Phase 3: Implementation Plan

### 3.1 Report Folder Migration Plan

**Objective:** Create step-by-step plan to migrate reports to new structure.

**Tasks:**

1. For each report in "safe to archive" list:
   - Note archive destination
   - Plan git mv command
2. For reports in "keep" list:
   - Determine new location
   - Plan git mv command
3. Create new folder structure:

   ```
   reports/
   ├── active/               # <2mo old, actively referenced
   ├── archive/              # 2-12mo old, may be referenced
   │   ├── weekly-summaries/
   │   ├── deprecated-audits/
   │   └── workflow-artifacts/
   ├── history/              # >12mo old (optional)
   ├── issue-management/     # keep current
   ├── frameworks/           # keep current
   └── README.md            # lifecycle policy
   ```

**Output:** Ordered list of git mv commands with source/dest paths

### 3.2 Project Linking Plan

**Objective:** Create plan to link all unlinked projects to GitHub issues.

**Tasks:**

1. For projects flagged "unlinked":
   - Identify which issues should be linked (from related work, PRs, discussions)
   - Create list of: `project_slug → [issue#1, issue#2, ...]`
2. For each project:
   - Create "Related Issues" markdown section (if missing)
   - Plan update to project README or index doc
3. Identify projects that need NEW issues created:
   - Determine issue type (task, epic, etc.)
   - Draft issue title and description

**Output:** JSON with `{project_slug: {current_issues: [], new_issues_needed: [], updates_required: [...]}}`

### 3.3 GitHub Issues Creation Plan

**Objective:** Plan GitHub issues for all cleanup work.

**Tasks:**

1. Create master issue: "Reports & Projects Restructuring Initiative"
   - Epic issue that tracks the entire work
   - References all sub-issues
   - Links to this planning document
2. Create sub-issues for each phase:
   - Issue: "Audit Reports & Projects Structure" (Phase 1)
   - Issue: "Design Report Folder Structure" (Phase 2)
   - Issue: "Migrate Reports to New Structure" (Phase 3)
   - Issue: "Link All Projects to GitHub Issues" (Phase 4)
   - Issue: "Implement Archive Workflow" (Phase 5)
3. For each unlinked project:
   - Create issue: "Link {project_name} to related issues"
4. For each completed project:
   - Create issue: "Archive {project_name} and preserve references"

**Output:** List of issues to create with title, type, description, labels

---

## Deliverables Checklist

- [ ] **Audit Report (JSON):** Complete inventory with metadata and reference counts
- [ ] **Categorization Plan:** Proposed folder structure for reports
- [ ] **Archive Strategy:** Decision plan for each project (keep active/archive/new issues)
- [ ] **Linking Standard:** Templates and format for bidirectional project ↔ issue links
- [ ] **Implementation Plan:** Ordered steps to execute cleanup
- [ ] **GitHub Issues List:** Ready to create with descriptions and labels
- [ ] **Active Project Folder:** Planning documents with issues linked

---

## Success Criteria

✅ All reports categorized and in proper folders
✅ All active projects have at least one linked issue
✅ No reports in `.github/reports/` root folder
✅ Bidirectional linking standard documented and templates created
✅ Archive workflow designed (manual or automated)
✅ All cleanup work tracked in GitHub issues
✅ Active project folder created with planning docs + issue links
✅ Completed projects marked with `.archive-status.md` (if not moved)
