---
title: "Reports & Projects Restructuring — Detailed Planning"
description: "Phase-by-phase planning for the full restructuring initiative"
type: "planning"
created_date: "2026-08-11"
---

# Reports & Projects Restructuring — Detailed Planning

## Phase Overview

| Phase | Duration | Goal | Status |
|-------|----------|------|--------|
| **1: Audit & Planning** | 1 week | Complete analysis + planning docs | 🟢 In Progress |
| **2: Folder Structure & Linking** | 2 weeks | Migrate reports + link projects | ⏳ Planned |
| **3: Archive Workflow** | 2 weeks | Automation + CI validation | ⏳ Planned |
| **4: Cleanup & Documentation** | 1 week | Final cleanup + update docs | ⏳ Planned |
| **Total Effort** | **6 weeks** | Full restructuring complete | - |

---

## PHASE 1: Audit & Planning (2026-08-11 to 2026-08-17)

### 1.1 Objectives

✅ Complete comprehensive audit of reports and projects  
✅ Design new folder structure for reports  
✅ Design archival strategy for completed projects  
✅ Create bidirectional linking standard  
✅ Create detailed execution plan for Phase 2-4

### 1.2 Deliverables

- [x] **AUDIT_RESULTS.md** — Full inventory with recommendations
- [x] **LINKING_STANDARD.md** — Bidirectional linking patterns & templates
- [ ] **REPORT_CATEGORIZATION_PLAN.md** — New folder structure + migration map
- [ ] **ARCHIVE_STRATEGY.md** — Archive workflow design
- [ ] **EXECUTION_PLAN.md** — Step-by-step implementation guide
- [ ] **GitHub Issues** — Master epic + sub-issues for all phases

### 1.3 Tasks & Assignments

| Task | Owner | Status | Deadline |
|------|-------|--------|----------|
| Audit reports inventory | Agent | ✅ Complete | 2026-08-11 |
| Audit projects inventory | Agent | ✅ Complete | 2026-08-11 |
| Design report folder structure | Ash | ⏳ TBD | 2026-08-13 |
| Design archive strategy | Ash | ⏳ TBD | 2026-08-14 |
| Create execution plan | Ash | ⏳ TBD | 2026-08-15 |
| Review & approve planning | Ash | ⏳ TBD | 2026-08-17 |
| Create GitHub issues | Ash | ⏳ TBD | 2026-08-17 |

### 1.4 Success Criteria

✅ All audit reports completed and reviewed  
✅ Clear folder structure designed  
✅ Archive strategy documented  
✅ Linking standard approved  
✅ GitHub issues created for all phases  
✅ Team alignment on plan

---

## PHASE 2: Folder Structure & Linking (2026-08-18 to 2026-08-31)

### 2.1 Objectives

✅ Create new report folder structure  
✅ Migrate 80+ reports to appropriate folders  
✅ Link all unlinked projects to GitHub issues  
✅ Add "Related Issues" to all projects  
✅ Update related GitHub issues with "Related Projects" links

### 2.2 Deliverables

- [ ] New `.github/reports/` folder structure implemented
- [ ] 80+ old reports moved to `archive/` folders
- [ ] All reports organized by category (audit, analysis, etc.)
- [ ] Zero reports in root (except README.md)
- [ ] `openspec` project linked to issues
- [ ] `markdown-audit-ci-optimization` status determined + linked or archived
- [ ] All 31 projects have ≥1 linked GitHub issue
- [ ] PR with folder migrations + linking updates

### 2.3 Subtasks

#### 2.3.1 Create Folder Structure

```bash
mkdir -p .github/reports/active
mkdir -p .github/reports/archive/weekly-summaries
mkdir -p .github/reports/archive/deprecated-audits
mkdir -p .github/reports/archive/workflow-artifacts
mkdir -p .github/reports/archive/a11y-completed
mkdir -p .github/reports/archive/historical
```

#### 2.3.2 Migrate Reports (Parallel)

| Task | Reports | Destination | Effort | Status |
|------|---------|-------------|--------|--------|
| Archive weekly summaries | 25 files | `archive/weekly-summaries/` | 30m | ⏳ |
| Archive deprecated audits | 40+ files | `archive/deprecated-audits/` | 45m | ⏳ |
| Archive workflow artifacts | 3 files | `archive/workflow-artifacts/` | 15m | ⏳ |
| Archive a11y reports | 4 files | `archive/a11y-completed/` | 15m | ⏳ |
| Archive old migrations | 2 files | `archive/historical/` | 10m | ⏳ |
| Organize active reports | 25 files | `active/`, category subfolders | 30m | ⏳ |

#### 2.3.3 Link Unlinked Projects

**openspec:**
- [ ] Identify related issues (agent-tool-permission-alignment, test-coverage-implementation)
- [ ] Add "Related Issues" section to `.github/projects/active/openspec/README.md`
- [ ] Add "Related Projects" comment to each related issue
- [ ] Validate links in GitHub preview

**markdown-audit-ci-optimization:**
- [ ] Review project status (completed? stale? blocked?)
- [ ] If active: link to related issue
- [ ] If completed: create "Archive {project}" issue
- [ ] If stale: determine next steps

#### 2.3.4 Add Linking to All Projects

For each of the remaining 29 projects:
- [ ] Add "Related Issues" section to README (if missing)
- [ ] Verify table format matches linking standard
- [ ] Update issue descriptions with "Related Projects" comments
- [ ] Validate all links work

### 2.4 Git Workflow

**Branch:** `chore/github-reports-restructure`

```bash
# Create branch
git checkout develop
git pull origin develop
git checkout -b chore/github-reports-restructure

# Make changes (folder creation + migrations)
mkdir -p .github/reports/{active,archive/{...}}
git mv .github/reports/weekly-summary-*.md .github/reports/archive/weekly-summaries/
# [more migrations...]

# Update project links
# [Edit .github/projects/active/*/README.md files]

# Commit
git add .github/
git commit -m "chore: Restructure reports folder + link all projects to issues"

# Push & create PR
git push -u origin chore/github-reports-restructure
```

**PR Template:** Use `pr_chore.md` — Links all projects to related issues

### 2.5 Timeline

| Date | Milestone |
|------|-----------|
| 2026-08-18 | Create folder structure |
| 2026-08-20 | Migrate reports (80+ files) |
| 2026-08-23 | Link openspec + markdown-audit-ci-optimization |
| 2026-08-27 | Add "Related Issues" to all projects |
| 2026-08-29 | Update GitHub issue comments |
| 2026-08-31 | Review + merge PR |

### 2.6 Success Criteria

✅ New folder structure in place  
✅ All reports migrated (0 in root except README)  
✅ All projects linked to ≥1 issue  
✅ All linking standard patterns used correctly  
✅ GitHub preview validates all links work  
✅ PR reviewed and merged to `develop`

---

## PHASE 3: Archive Workflow & Automation (2026-09-01 to 2026-09-14)

### 3.1 Objectives

✅ Design archive workflow (manual trigger or automatic)  
✅ Create `.archive-status.md` template  
✅ Implement CI validation for project linking  
✅ Optional: Automated report aging & archival  
✅ Document archival process in CLAUDE.md

### 3.2 Deliverables

- [ ] Archive workflow documented (manual process or GitHub Action)
- [ ] `.archive-status.md` template created
- [ ] CI validation for linked projects implemented
- [ ] Optional: GitHub Action for auto-archival (if scope permits)
- [ ] CLAUDE.md updated with archival process
- [ ] Example archived project created with `.archive-status.md`

### 3.3 Design Options

#### Option A: Manual Archive (Simple)

**Process:**
1. When project is complete, owner creates "Archive {project}" issue
2. Issue includes: summary of work, PR links, outcomes
3. On merge, update project folder:
   - Add `.archive-status.md` with metadata
   - Move folder to `.github/projects/archive/{year}/{slug}/`
   - Update `.github/projects/active/` references
4. Create symlink in `active/` if links need to resolve (optional)

**Effort:** Low (~4 hours design + docs)

#### Option B: Automated Archive (Medium)

**Process:**
1. GitHub Action monitors projects for completion signals:
   - All linked issues closed
   - No recent updates (>30 days)
   - Owner tags with "archive-ready" label
2. Action creates draft PR with:
   - `.archive-status.md` auto-generated
   - Folder move commands
   - Preservation of issue references
3. Owner reviews & merges

**Effort:** Medium (~16 hours design + implementation)

#### Option C: Archive-on-Tag (Advanced)

**Process:**
1. Owner runs: `git tag archive-ready/{project-slug}`
2. Webhook triggers GitHub Action
3. Action validates completion, creates `.archive-status.md`, moves folder
4. Commits directly to `develop`

**Effort:** High (~24 hours design + implementation)

### 3.4 Recommended Approach

**Start with Option A (Manual)** → Implement Option B in Q4 if volume justifies automation

**Rationale:**
- Low risk, clear process
- Can evaluate effectiveness before automating
- Gives team time to adjust to new structure
- Easier to refine based on feedback

### 3.5 CI Validation Implementation

**Rule:** Every project in `.github/projects/active/` must have ≥1 linked issue

**Implementation:**
```yaml
# .github/workflows/validate-project-linking.yml
name: Validate Project Linking
on: pull_request

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check projects have issue links
        run: |
          for project in .github/projects/active/*/; do
            if ! grep -qE "\[#[0-9]{4,}\]" "$project/README.md"; then
              echo "❌ $(basename $project) missing issue links"
              exit 1
            fi
          done
```

### 3.6 Timeline

| Date | Milestone |
|------|-----------|
| 2026-09-01 | Design archive workflow options |
| 2026-09-03 | Approve archival approach |
| 2026-09-05 | Create `.archive-status.md` template + CI validation |
| 2026-09-08 | Test on completed project (dry run) |
| 2026-09-10 | Archive first completed project (with validation) |
| 2026-09-12 | Document process in CLAUDE.md |
| 2026-09-14 | Review + finalize workflow |

### 3.7 Success Criteria

✅ Archive workflow documented & tested  
✅ CI validation for project linking in place  
✅ First completed project successfully archived  
✅ `.archive-status.md` template used  
✅ CLAUDE.md updated with archive process  
✅ Team trained on archival process

---

## PHASE 4: Cleanup & Documentation (2026-09-15 to 2026-09-21)

### 4.1 Objectives

✅ Remove temporary files / cleanup  
✅ Update all key documentation  
✅ Final validation of structure  
✅ Publish linking standard to `docs/`  
✅ Celebrate completion!

### 4.2 Deliverables

- [ ] `.github/reports/README.md` updated with lifecycle policy
- [ ] `docs/LINKING_STANDARD.md` created (public reference)
- [ ] `CLAUDE.md` updated with new structure reference
- [ ] `.github/projects/active/` reference page created
- [ ] Report lifecycle automation documented (optional)
- [ ] Team training/communication

### 4.3 Documentation Updates

#### 4.3.1 `.github/reports/README.md`

Add lifecycle policy:

```markdown
# GitHub Reports

Reports are organized by lifecycle:

- **active/** — Reports from last 2 months, actively referenced
- **archive/** — Reports 2-12 months old, historical interest
  - weekly-summaries/ — Weekly summary reports
  - deprecated-audits/ — Old audit reports (superseded)
  - workflow-artifacts/ — Temporary CI/workflow artifacts
  - a11y-completed/ — Completed accessibility audits
  - historical/ — Pre-restructuring archives
- **history/** — Reports >12 months old (optional)

## Lifecycle Policy

- Reports auto-age to `archive/` after 60 days if no references
- Reports in `archive/` may be moved to `history/` after 1 year
- All reports preserved for historical context
- Never delete reports; preserve link integrity

## Creating a Report

1. Create in appropriate category subfolder
2. Include relevant dates and context
3. Link to related projects/issues in frontmatter
4. Report will auto-archive after 60 days if unused

---

[See LINKING_STANDARD.md for connecting reports to projects]
```

#### 4.3.2 CLAUDE.md Updates

Add reference to restructuring:

```markdown
## Repository Organization — Reports & Projects

The `.github/reports/` and `.github/projects/active/` folders use a standardized structure:

- **Reports:** Organized by lifecycle (active/archive/history)
- **Projects:** All linked to GitHub issues bidirectionally
- **Linking:** See [docs/LINKING_STANDARD.md](./docs/LINKING_STANDARD.md)

For restructuring details, see [.github/projects/active/reports-projects-restructuring-2026-08-11/](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

### How to Link Projects to Issues

All active projects must have a "Related Issues" section in README:

\`\`\`markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1234](../../../issues/1234) | epic | Master epic | 🟢 Open |
\`\`\`

See [LINKING_STANDARD.md](./docs/LINKING_STANDARD.md) for templates.

### Report Lifecycle

Reports age from `reports/active/` → `reports/archive/` → `reports/history/`

No reports are ever deleted; lifecycle policy preserves links.
```

#### 4.3.3 New File: `docs/LINKING_STANDARD.md`

Copy [LINKING_STANDARD.md](./LINKING_STANDARD.md) to `docs/` for public reference

### 4.4 Final Validation Checklist

- [ ] All 106 reports in appropriate folders (0 in root)
- [ ] All 31 projects have ≥1 linked issue
- [ ] CI validation for project linking passes
- [ ] No broken links in project documentation
- [ ] All issue links resolve to valid GitHub issues
- [ ] Archive workflow documented & tested
- [ ] CLAUDE.md updated
- [ ] Team training completed

### 4.5 Timeline

| Date | Milestone |
|------|-----------|
| 2026-09-15 | Update `.github/reports/README.md` |
| 2026-09-16 | Update `CLAUDE.md` |
| 2026-09-17 | Create `docs/LINKING_STANDARD.md` |
| 2026-09-18 | Final validation of all links |
| 2026-09-19 | Team communication & training |
| 2026-09-20 | Review & feedback |
| 2026-09-21 | Mark initiative as complete |

### 4.6 Success Criteria

✅ All documentation updated  
✅ Linking standard published  
✅ Final validation passed (all links work)  
✅ Team trained & aligned  
✅ Initiative marked complete in project folder  
✅ Process sustainable for future work

---

## Cross-Phase Dependencies

```
Phase 1 (Audit & Planning)
    ↓
    ├─→ GitHub Issues Created
    ↓
Phase 2 (Folder Structure & Linking)
    ├─→ Depends on Phase 1 planning ✅
    ├─→ Creates: linked projects + structured reports
    ├─→ Delivers: foundation for automation
    ↓
Phase 3 (Archive Workflow)
    ├─→ Depends on Phase 2 structure ✅
    ├─→ Validates: linking standard works
    ├─→ Delivers: automation + CI validation
    ↓
Phase 4 (Cleanup & Documentation)
    ├─→ Depends on Phases 2-3 ✅
    ├─→ Finalizes: all documentation
    ├─→ Delivers: sustainable process
```

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Broken links during migration | High | Test all links before commit; use relative paths |
| Incomplete project linking | Medium | CI validation catches orphaned projects |
| Report loss during archive | High | Never delete; preserve all files in archive/ |
| Team confusion on process | Medium | Clear documentation + training in Phase 4 |
| Automation overkill (Phase 3) | Low | Start manual, automate only if needed |

---

## Success Metrics

After all 4 phases complete, we should have:

✅ **Structure:** Organized, categorized reports with clear lifecycle  
✅ **Linking:** 100% of projects linked to relevant GitHub issues  
✅ **Automation:** CI validation ensures links stay current  
✅ **Documentation:** Clear process for future projects & archival  
✅ **Sustainability:** Process requires <4 hours/month maintenance

---

## Related Documents

- [AUDIT_RESULTS.md](./AUDIT_RESULTS.md) — Complete inventory & findings
- [LINKING_STANDARD.md](./LINKING_STANDARD.md) — Bidirectional linking patterns
- [README.md](./README.md) — Project overview & status

---

**Last Updated:** 2026-08-11  
**Phase 1 Status:** 🟢 In Progress  
**Overall Timeline:** 6 weeks (2026-08-11 to 2026-09-21)
