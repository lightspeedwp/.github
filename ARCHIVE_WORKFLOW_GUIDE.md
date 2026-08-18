---
title: "Project Archive Workflow Guide"
description: "Manual archive process for moving completed projects to archive folder"
type: "operational-guide"
created_date: "2026-08-11"
status: "active"
---

# Project Archive Workflow Guide

## Overview

This guide documents the process for archiving completed active projects. Once a project is complete, it should be moved from `.github/projects/active/` to `.github/projects/archive/` with proper documentation of completion status and preservation of related issues.

---

## Archive Process (Option A: Manual)

### Prerequisites

- Project is marked as "complete" or "inactive"
- All project deliverables are documented
- Related GitHub issues are updated with completion status
- Project README is current with final status

### Step 1: Create Archive Folder Structure

```bash
# Create archive folder if it doesn't exist
mkdir -p .github/projects/archive

# Verify archive folder exists
ls -la .github/projects/archive/
```

### Step 2: Prepare Archive Status Document

Create a `.archive-status.md` file in the project folder (before moving it) with the following template:

```bash
cat > .github/projects/active/{PROJECT_SLUG}/.archive-status.md << 'EOF'
---
title: "Archive Status — {PROJECT_NAME}"
archived_date: "YYYY-MM-DD"
completion_status: "complete"
---

# Archive Status — {PROJECT_NAME}

## Completion Summary

**Project:** {PROJECT_NAME}  
**Archived Date:** YYYY-MM-DD  
**Original Location:** `.github/projects/active/{PROJECT_SLUG}/`  
**Archive Location:** `.github/projects/archive/{PROJECT_SLUG}/`

### Deliverables Completed

- [x] Phase 1: [Deliverable]
- [x] Phase 2: [Deliverable]
- [x] Phase 3: [Deliverable]
- [x] Documentation complete
- [x] Related issues closed/resolved

### Related Issues (Resolved)

- [#1234](../../../issues/1234) — Epic: {Issue Title} — 🔴 Closed
- [#1235](../../../issues/1235) — Task: {Issue Title} — 🔴 Closed
- [#1236](../../../issues/1236) — Task: {Issue Title} — 🔴 Closed

### Archive Criteria Met

✅ All project goals achieved  
✅ All deliverables completed  
✅ All related issues closed  
✅ Documentation finalized  
✅ Team trained/notified  

### How to Access Archived Project

If you need to reference this archived project:

1. Check `.github/projects/archive/{PROJECT_SLUG}/README.md` for project overview
2. Check `.archive-status.md` for completion details
3. Check GitHub issues (linked above) for historical context
4. Contact project owner: [OWNER_NAME] ([OWNER_EMAIL])

### If Archiving Was Premature

If this project needs to be restored to active:

1. Move folder back: `git mv .github/projects/archive/{PROJECT_SLUG} .github/projects/active/{PROJECT_SLUG}`
2. Update `.archive-status.md` with restoration reason
3. Reopen related GitHub issues
4. Notify team of restoration

---

## Project Summary

**Start Date:** YYYY-MM-DD  
**End Date:** YYYY-MM-DD  
**Duration:** XX weeks  
**Team:** [Team members]  
**Key Achievements:** [List achievements]  
**Lessons Learned:** [List lessons]

---

**Status:** Archived  
**Last Updated:** YYYY-MM-DD  
**Archived By:** [Your name]
EOF
```

### Step 3: Commit Archive Status

```bash
cd .github/projects/active/{PROJECT_SLUG}

# Add archive status file
git add .archive-status.md
git commit -m "docs: Add archive status for {PROJECT_NAME}

Document project completion and archive intent.

- Archive date: YYYY-MM-DD
- All deliverables completed
- All related issues closed
- Team notified

See .archive-status.md for details."
```

### Step 4: Move Project to Archive

```bash
cd .github/projects

# Move project from active to archive
git mv active/{PROJECT_SLUG} archive/{PROJECT_SLUG}

# Verify move
ls -la archive/{PROJECT_SLUG}/
```

### Step 5: Update Related Issues

For each issue linked in the project's README:

```markdown
## Update Issue Description

Add/update "Related Projects" comment:

---

## Related Active Projects

✅ **ARCHIVED:** This issue's project has been archived.

- [reports-projects-restructuring-2026-08-11](./.github/projects/archive/reports-projects-restructuring-2026-08-11/) — Archived 2026-09-21

**Archived Details:**
- Completion Status: ✅ Complete
- All Deliverables: ✅ Delivered
- Documentation: ✅ Finalized

See project `.archive-status.md` for complete archival information.

---
```

### Step 6: Commit Project Move

```bash
cd .github/projects

git add active/ archive/
git commit -m "chore: Archive {PROJECT_NAME}

Move project to archive folder and update issue references.

- Project: {PROJECT_SLUG}
- Archive Date: YYYY-MM-DD
- Related Issues: #XXXX, #YYYY, #ZZZZ
- Archive Details: See .archive-status.md

Archive Status:
✅ All deliverables completed
✅ All related issues closed
✅ Documentation finalized
✅ Team notified"
```

### Step 7: Create PR & Merge

```bash
# Push changes
git push -u origin phase-3/archive-{PROJECT_SLUG}

# Create PR
gh pr create \
  --title "chore: Archive {PROJECT_NAME}" \
  --body "$(cat << 'EOF'
## Summary

Archive completed project: {PROJECT_NAME}

## Archive Details

- **Project:** {PROJECT_SLUG}
- **Archive Date:** YYYY-MM-DD
- **Completion Status:** ✅ Complete
- **Related Issues:** Closed/resolved

## Changes

- Moved `.github/projects/active/{PROJECT_SLUG}` → `.github/projects/archive/{PROJECT_SLUG}`
- Added `.archive-status.md` with completion details
- Updated related GitHub issues with archive reference

## Validation

✅ Archive status document complete  
✅ All deliverables documented  
✅ Related issues updated  
✅ Git history preserved  

See `.archive-status.md` for details.
EOF
)" \
  --base develop \
  --label type:chore --label area:documentation

# After review & approval, merge
gh pr merge <PR_NUMBER> --squash
```

---

## Testing: Archive Workflow Example

### Test Project: wave-4-codebase-discovery (if eligible)

1. **Verify completion:**

   ```bash
   ls -la .github/projects/active/wave-4-codebase-discovery/
   cat .github/projects/active/wave-4-codebase-discovery/README.md | head -20
   ```

2. **Create archive status:**

   ```bash
   cat > .github/projects/active/wave-4-codebase-discovery/.archive-status.md << 'EOF'
   ---
   title: "Archive Status — Wave 4 Codebase Discovery"
   archived_date: "2026-08-11"
   completion_status: "complete"
   ---

   # Archive Status — Wave 4 Codebase Discovery

   ## Completion Summary

   **Project:** Wave 4 Codebase Discovery  
   **Archived Date:** 2026-08-11  
   **Status:** ✅ Complete

   ### Deliverables Completed

   - [x] Initial codebase discovery & mapping
   - [x] File structure audit
   - [x] Dependency analysis
   - [x] Final report delivered

   ### Related Issues

   - #1234 — Wave 4 epic — 🔴 Closed
   - #1235 — Discovery phase — 🔴 Closed

   ---

   **Archive Date:** 2026-08-11  
   **Archived By:** Ash Shaw
   EOF
   ```

3. **Commit and verify:**

   ```bash
   git add .github/projects/active/wave-4-codebase-discovery/.archive-status.md
   git commit -m "docs: Test archive workflow with wave-4-codebase-discovery"
   git log --oneline -1
   ```

4. **Dry-run move (do not push yet):**

   ```bash
   # This is a test — do not execute in production
   echo "✅ Archive status created successfully"
   echo "✅ File location: .github/projects/active/wave-4-codebase-discovery/.archive-status.md"
   ```

5. **Verify links:**

   ```bash
   grep -n "Related Issues" .github/projects/active/wave-4-codebase-discovery/README.md
   ```

---

## Batch Archive (Multiple Projects)

For archiving multiple projects in one PR:

```bash
# Create feature branch
git checkout -b chore/batch-archive-projects

# For each project:
for project in project-1 project-2 project-3; do
  # Create .archive-status.md
  # Stage files
  # Commit individually
done

# Create single PR with all archival commits
git push -u origin chore/batch-archive-projects
gh pr create --title "chore: Archive 3 completed projects"
```

---

## Rollback Archive

If an archive was premature:

```bash
# Move project back to active
git mv .github/projects/archive/{PROJECT_SLUG} .github/projects/active/{PROJECT_SLUG}

# Remove or update .archive-status.md
git rm .github/projects/active/{PROJECT_SLUG}/.archive-status.md
# OR
echo "Reason for restoration: [describe reason]" >> .github/projects/active/{PROJECT_SLUG}/.archive-status.md

# Commit rollback
git commit -m "chore: Restore {PROJECT_SLUG} from archive

Reason: [Provide reason]

- Moved back to active
- .archive-status.md updated with restoration reason
- Related issues can be reopened if needed"

# Reopen related issues (manual)
```

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) — Repository structure standards
- [LINKING_STANDARD.md](./LINKING_STANDARD.md) — Project-issue linking patterns
- [.github/projects/README.md](../) — Projects folder overview

---

**Guide Status:** Active  
**Last Updated:** 2026-08-11  
**Owner:** Ash Shaw (<ashley@lightspeedwp.agency>)
