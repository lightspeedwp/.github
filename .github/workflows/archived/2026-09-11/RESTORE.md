---
file_type: restore-procedures
title: "Workflow Restoration Procedures"
archive: 2026-09-11
created: 2026-09-11
---

# Workflow Restoration Procedures

This document provides detailed instructions for restoring archived workflows from the 2026-09-11 archive.

**Archive:** `.github/workflows/archived/2026-09-11/`  
**Retention Period:** 2 weeks (Sep 11 - Sep 25, 2026)  
**Estimated Restore Time:** < 5 minutes (single) / < 30 minutes (all)  
**Git Branch:** `refactor/workflow-consolidation-and-archiving`

---

## Quick Reference

### Restore Single Workflow

```bash
# Format: git show <branch>:path/to/workflow.yml > destination.yml
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > .github/workflows/labeling.yml
```

### Restore Entire Archive

```bash
# Restore archive directory to current working directory
git checkout refactor/workflow-consolidation-and-archiving -- .github/workflows/archived/2026-09-11/

# Move workflows from archive back to active workflows directory
mv .github/workflows/archived/2026-09-11/*/*.yml .github/workflows/
```

### Restore by Category

```bash
# Restore all workflows from a category
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/*.yml > labeling-workflows.tar
tar -x < labeling-workflows.tar  # Then move files to .github/workflows/
```

---

## Detailed Restoration Procedures

### Procedure 1: Restore Individual Workflow

**Use this when:** You need to restore a single specific workflow (< 5 minutes)

**Prerequisites:**
- Git access to repository
- Write access to `.github/workflows/` directory
- Workflow file name from ARCHIVED_WORKFLOWS_MANIFEST.md

**Steps:**

1. **Identify the workflow file:**
   ```bash
   # Example: restore labeling.yml from labeling category
   WORKFLOW_NAME="labeling.yml"
   CATEGORY="labeling"
   ```

2. **Restore the file:**
   ```bash
   git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/${CATEGORY}/${WORKFLOW_NAME} > .github/workflows/${WORKFLOW_NAME}
   ```

3. **Verify the restore:**
   ```bash
   # Check file exists and has content
   ls -lh .github/workflows/${WORKFLOW_NAME}
   head -10 .github/workflows/${WORKFLOW_NAME}
   ```

4. **Test the workflow:**
   ```bash
   # Verify YAML syntax is valid
   yamllint .github/workflows/${WORKFLOW_NAME}
   
   # Or use GitHub Actions checker
   gh workflow list --all
   ```

5. **Commit and push:**
   ```bash
   git add .github/workflows/${WORKFLOW_NAME}
   git commit -m "restore: bring back ${WORKFLOW_NAME} from archive"
   git push origin <branch-name>
   ```

**Expected Output:**
```
✓ File restored to .github/workflows/<workflow>.yml
✓ File size and timestamps match archive
✓ YAML syntax valid (yamllint passes)
✓ Workflow appears in GitHub Actions list
```

---

### Procedure 2: Restore by Category

**Use this when:** You need to restore all workflows in a category (10-15 minutes)

**Prerequisites:**
- Git access to repository
- Write access to `.github/workflows/` directory
- Category name from ARCHIVED_WORKFLOWS_MANIFEST.md

**Categories:**
- `labeling/` (9 workflows)
- `validation/` (12 workflows)
- `documentation/` (8 workflows)
- `issue-management/` (10 workflows)
- `pr-management/` (7 workflows)
- `testing/` (8 workflows)
- `ci-cd/` (8 workflows)
- `utilities/` (8 workflows)

**Steps:**

1. **Set category variable:**
   ```bash
   CATEGORY="labeling"  # or validation, documentation, etc.
   ```

2. **Create temporary restore directory:**
   ```bash
   mkdir -p /tmp/restore-${CATEGORY}
   cd /tmp/restore-${CATEGORY}
   ```

3. **Restore all workflows in category:**
   ```bash
   git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/${CATEGORY}/ | tar -x
   ```
   
   **OR manually restore each file:**
   ```bash
   for file in $(git ls-tree -r --name-only refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/${CATEGORY}/); do
     git show refactor/workflow-consolidation-and-archiving:${file} > $(basename ${file})
   done
   ```

4. **Move restored files to active workflows:**
   ```bash
   mv /tmp/restore-${CATEGORY}/*.yml ~/.github/workflows/
   ```

5. **Verify all files restored:**
   ```bash
   ls -lh .github/workflows/*.yml | grep -E "(labeling|validation|documentation|issue|pr|testing|ci|utilities)"
   ```

6. **Validate and commit:**
   ```bash
   # Run validation on all restored files
   yamllint .github/workflows/*.yml
   
   # Commit all restored workflows
   git add .github/workflows/
   git commit -m "restore: bring back ${CATEGORY} workflows from 2026-09-11 archive"
   git push origin <branch-name>
   ```

**Expected Output:**
```
✓ All X workflows from <category> restored
✓ All files in .github/workflows/ directory
✓ YAML syntax valid for all files
✓ All workflows appear in GitHub Actions list
```

---

### Procedure 3: Restore Entire Archive

**Use this when:** You need to restore all 62 archived workflows (20-30 minutes)

**Prerequisites:**
- Git access to repository
- Write access to `.github/workflows/` directory
- Disk space for ~1.2 MB of workflow files

**WARNING:** This will restore ALL 62 archived workflows and may overwrite existing files.

**Steps:**

1. **Backup current workflows (CRITICAL):**
   ```bash
   cp -r .github/workflows .github/workflows.backup.$(date +%Y%m%d-%H%M%S)
   ```

2. **Restore entire archive directory:**
   ```bash
   git checkout refactor/workflow-consolidation-and-archiving -- .github/workflows/archived/2026-09-11/
   ```

3. **Move archived workflows to active directory:**
   ```bash
   # Move all .yml files from archive to active workflows
   find .github/workflows/archived/2026-09-11 -name "*.yml" -type f -exec mv {} .github/workflows/ \;
   ```

4. **Verify restoration:**
   ```bash
   # Count restored workflows (should be 62)
   ls -1 .github/workflows/*.yml | wc -l  # Should output: 62
   
   # Validate all YAML files
   yamllint .github/workflows/*.yml
   
   # List all workflows
   gh workflow list --all
   ```

5. **Test workflows (IMPORTANT):**
   - Review each workflow in GitHub Actions UI
   - Check for any errors or warnings
   - Manually trigger test workflows to verify they work
   - Monitor Actions tab for 24 hours to ensure no failures

6. **Commit and push:**
   ```bash
   git add .github/workflows/
   git commit -m "restore: bring back all 62 archived workflows from 2026-09-11 archive"
   git push origin <branch-name>
   ```

7. **Create PR or branch for review:**
   ```bash
   # This is a major change, get team review before merging to develop
   gh pr create --title "restore: all archived workflows from 2026-09-11 archive" \
     --body "Restores 62 archived workflows from archive. See RESTORE.md for details."
   ```

**Expected Output:**
```
✓ 62 workflows restored from archive
✓ All files in .github/workflows/ directory
✓ Archive directory still available for reference
✓ YAML syntax valid for all files
✓ All workflows appear in GitHub Actions list
✓ No runtime errors in first 24 hours
```

---

### Procedure 4: Restore via Git History

**Use this when:** You need to restore workflows and preserve the full git history (15-20 minutes)

**Prerequisites:**
- Git access to repository
- Ability to perform git operations
- Understanding of git branches and merges

**Steps:**

1. **Create restore branch:**
   ```bash
   git checkout -b restore/archived-workflows-from-2026-09-11
   ```

2. **Merge archive commit into branch:**
   ```bash
   git merge refactor/workflow-consolidation-and-archiving --no-edit
   ```

3. **Cherry-pick workflow files:**
   ```bash
   # Get commit hash of archive creation
   git log --oneline refactor/workflow-consolidation-and-archiving | head -5
   
   # Cherry-pick the archive commit
   git cherry-pick <commit-hash>
   ```

4. **Resolve conflicts (if any):**
   ```bash
   # If workflows have been modified, resolve conflicts
   git status  # Shows conflicted files
   
   # Choose to keep archived version or current version
   git checkout --theirs .github/workflows/  # Keep archived
   # OR
   git checkout --ours .github/workflows/    # Keep current
   
   # Complete cherry-pick
   git add .github/workflows/
   git cherry-pick --continue
   ```

5. **Verify and test:**
   ```bash
   # Verify all workflows present
   find .github/workflows -name "*.yml" -type f | wc -l
   
   # Run validation
   yamllint .github/workflows/*.yml
   ```

6. **Create PR for review:**
   ```bash
   git push -u origin restore/archived-workflows-from-2026-09-11
   gh pr create --title "restore: archived workflows from 2026-09-11 archive" \
     --body "Restores 62 archived workflows with full git history preserved."
   ```

---

## Rollback Decision Criteria

**Rollback to archived workflows if:**

1. **Critical failures in Phase 2 consolidated workflows:**
   - Consolidated workflows cause repeated CI failures
   - Multiple essential features break after consolidation
   - Team decides consolidation approach is flawed

2. **Performance regression:**
   - GitHub Actions minutes increased by > 20%
   - PR merge time increased by > 30%
   - Scheduled job collisions return

3. **Data loss or security issues:**
   - Workflows cause unintended commits or deletions
   - Secret exposure or security vulnerability discovered
   - Workflow triggers events incorrectly

4. **Timeline constraints:**
   - Consolidation blocked due to unforeseeable circumstances
   - Team bandwidth unavailable to continue consolidation
   - Organizational priorities change

**Rollback Timeline:**
- **Detection:** < 1 hour (monitoring and alerts)
- **Decision:** < 2 hours (team discussion)
- **Execution:** < 5 minutes per workflow (git restore)
- **Validation:** < 20 minutes (testing restored workflows)
- **Total:** < 30 minutes (complete rollback)

**Rollback Approval:**
- **Required:** Tech lead + Workflow owner approval
- **Process:** Discuss in Slack #engineering channel
- **Documentation:** Create GitHub issue documenting rollback reason

---

## Restoration Examples

### Example 1: Restore Single Labeling Workflow

**Scenario:** Need to restore `labeling.yml` because Phase 2 `labeling-unified.yml` has a bug.

```bash
# Get the archived workflow
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > .github/workflows/labeling-old.yml

# Rename to active workflows (or update consolidated workflow to restore function)
mv .github/workflows/labeling-old.yml .github/workflows/labeling.yml

# Commit the change
git add .github/workflows/labeling.yml
git commit -m "restore: use original labeling.yml while fixing labeling-unified.yml"
git push origin fix/labeling-consolidation-bug
```

**Estimated Time:** 3-5 minutes

---

### Example 2: Restore All Validation Workflows

**Scenario:** Phase 2 `validation-unified.yml` has regression. Need to restore all 12 original validation workflows while debugging.

```bash
# Restore validation category
CATEGORY="validation"
for file in $(git ls-tree -r --name-only refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/${CATEGORY}/); do
  git show refactor/workflow-consolidation-and-archiving:${file} > .github/workflows/$(basename ${file})
done

# Verify restoration
ls -1 .github/workflows/*validation*.yml | wc -l  # Should show restored files

# Commit
git add .github/workflows/*validation*.yml
git commit -m "restore: bring back all ${CATEGORY} workflows for debugging"
git push origin debug/validation-consolidation
```

**Estimated Time:** 10-15 minutes

---

### Example 3: Full Rollback (All 62 Workflows)

**Scenario:** Critical issue discovered in Phase 2 architecture. Team decides to rollback entire consolidation while redesigning.

```bash
# Create rollback branch
git checkout -b rollback/consolidation-2026-09-11

# Restore all archived workflows
find .github/workflows/archived/2026-09-11 -name "*.yml" -type f -exec cp {} .github/workflows/ \;

# Verify all 62 workflows present
ls -1 .github/workflows/*.yml | wc -l  # Should be 62+

# Remove Phase 2 consolidated workflows (optional)
rm .github/workflows/*-unified.yml

# Commit
git add .github/workflows/
git commit -m "rollback: restore all 62 archived workflows after Phase 2 issue discovery"

# Create PR with justification
gh pr create --title "rollback: consolidation due to critical issue" \
  --body "Restores all 62 archived workflows. Phase 2 consolidated workflows had critical flaws. See issue #XXXX for details."
```

**Estimated Time:** 20-25 minutes

---

## Testing Restored Workflows

After restoring workflows, test them thoroughly:

### 1. Syntax Validation
```bash
yamllint .github/workflows/*.yml
```

### 2. Trigger Testing
```bash
# For each workflow, verify it triggers correctly
# - Manual trigger workflows: Run from GitHub Actions tab
# - Event-triggered workflows: Create test event (issue, PR, push)
# - Scheduled workflows: Verify cron syntax is valid
```

### 3. Integration Testing
```bash
# Create test PR to trigger workflows
git checkout -b test/restored-workflows
git push origin test/restored-workflows
gh pr create --title "test: verify restored workflows" --body "Testing restored workflows"

# Monitor Actions tab for 15-20 minutes to ensure no errors
```

### 4. Monitoring (24-48 hours)
- Watch GitHub Actions dashboard for failures
- Monitor Slack for workflow notifications
- Check for any breaking changes in automation

---

## FAQ: Restoration Questions

**Q: Will restoring workflows overwrite Phase 2 consolidated workflows?**  
A: Yes, when you move restored workflows to `.github/workflows/`, they'll overwrite consolidated workflows with the same name. Back up Phase 2 first if needed.

**Q: Can I restore specific workflows without affecting others?**  
A: Yes, use Procedure 1 (Restore Individual Workflow) to restore only what you need.

**Q: What if the archive branch is deleted?**  
A: The `refactor/workflow-consolidation-and-archiving` branch is protected. It can't be deleted without explicit approval. Contact the tech lead.

**Q: How long are workflows kept in the archive?**  
A: Retention period is 2 weeks (Sep 11 - Sep 25, 2026). After that, workflows are deleted from the archive directory but remain in git history.

**Q: Can I restore workflows after the retention period expires?**  
A: Yes, the files remain in git history on the archive branch indefinitely. Use `git show refactor/workflow-consolidation-and-archiving:path/to/workflow.yml` to access them.

---

## Contact & Support

- **Workflow Consolidation Owner:** Ashley Shaw (ashley@lightspeedwp.agency)
- **Archive Branch:** `refactor/workflow-consolidation-and-archiving`
- **Related Epic:** [Epic] Workflow Consolidation Initiative 2026-Q4
- **Questions:** Create issue in repository with `[WORKFLOW-RESTORE]` tag

---

**Procedures Version:** 1.0  
**Created:** Sep 11, 2026  
**Last Updated:** Sep 11, 2026  
**Status:** ✅ Ready for Use
