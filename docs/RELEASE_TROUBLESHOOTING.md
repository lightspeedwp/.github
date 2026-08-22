---
file_type: documentation
title: Release Troubleshooting Guide
description: Common issues and recovery procedures for the agentic release workflow
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
domain: governance
owners:
  - Release Engineering Team
tags:
  - release
  - troubleshooting
  - recovery
  - debugging
---

# Release Troubleshooting Guide v1.0

> Comprehensive guide for diagnosing and resolving common issues that occur during release workflow execution. **Coverage: 80%+ of known edge cases**.

---

## Table of Contents

1. [Pre-Release Issues](#pre-release-issues)
2. [Phase 1 Issues (Version Bump)](#phase-1-issues)
3. [Phase 2 Issues (Safety Gates)](#phase-2-issues)
4. [Approval & Authorization Issues](#approval--authorization-issues)
5. [Post-Release Issues](#post-release-issues)
6. [Emergency Procedures](#emergency-procedures)
7. [Debugging Techniques](#debugging-techniques)

---

## Pre-Release Issues

### Issue: CHANGELOG.md Missing [Unreleased] Section

**Symptom:**
```
❌ GATE 1: Pre-flight Checks FAILED
Error: CHANGELOG.md missing [Unreleased] section
```

**Cause:**
- CHANGELOG.md doesn't have [Unreleased] section
- Changelog entries not in expected format
- File may have been manually edited

**Solution:**

1. Check current CHANGELOG structure:
   ```bash
   head -20 CHANGELOG.md
   ```

2. Verify [Unreleased] section exists:
   ```bash
   grep -n "## \[Unreleased\]" CHANGELOG.md
   ```

3. If missing, add template to CHANGELOG.md (after title):
   ```markdown
   # Changelog

   All notable changes to this project will be documented in this file.

   ## [Unreleased]

   ### Added
   - (List new features here)

   ### Changed
   - (List improvements here)

   ### Fixed
   - (List bug fixes here)

   ## [1.0.0] - 2026-01-01
   [previous releases...]
   ```

4. Add entries for your release:
   ```bash
   git add CHANGELOG.md
   git commit -m "docs: Add CHANGELOG entries for unreleased features"
   git push origin develop
   ```

5. **Retry release workflow**

---

### Issue: VERSION File Missing or Malformed

**Symptom:**
```
❌ GATE 1: Pre-flight Checks FAILED
Error: VERSION file not found or not readable
```

**Cause:**
- VERSION file deleted or moved
- File path incorrect
- File permissions issue

**Solution:**

1. Check if VERSION file exists:
   ```bash
   ls -la VERSION
   ```

2. Check VERSION file content:
   ```bash
   cat VERSION
   # Should show: 1.0.0 (single line, no extra text)
   ```

3. If file missing, create it:
   ```bash
   echo "1.0.0" > VERSION
   git add VERSION
   git commit -m "chore: Add VERSION file"
   git push origin develop
   ```

4. If format wrong (multiple lines or extra text):
   ```bash
   # Fix: echo only version on one line
   echo "1.0.0" > VERSION
   git add VERSION
   git commit -m "chore: Fix VERSION file format"
   git push origin develop
   ```

5. **Retry release workflow**

---

### Issue: Uncommitted Changes in Repository

**Symptom:**
```
⚠️ WARNING: Repository has uncommitted changes
Workflow may fail or create incomplete release
```

**Cause:**
- Modified files not committed
- New files not added to git
- Stashed changes not applied

**Solution:**

1. Check current git status:
   ```bash
   git status
   ```

2. Commit or discard changes:
   ```bash
   # Option A: Commit changes
   git add .
   git commit -m "chore: [your commit message]"
   git push origin develop

   # Option B: Discard changes (careful!)
   git checkout .
   ```

3. If there are untracked files to keep:
   ```bash
   git add <specific-files>
   git commit -m "chore: Add files"
   git push origin develop
   ```

4. **Retry release workflow**

---

## Phase 1 Issues

### Issue: Branch Creation Failed

**Symptom:**
```
❌ GATE 1: Pre-flight Checks FAILED
Error: Failed to create release/vX.Y.Z branch
```

**Cause:**
- Branch already exists from previous failed release
- Branch name conflict
- Git permissions issue

**Solution:**

1. Check if release branch exists:
   ```bash
   git branch -a | grep release/v
   ```

2. If branch exists from failed release, delete it:
   ```bash
   git fetch origin
   git branch -D release/v1.0.1  # Delete local
   git push origin --delete release/v1.0.1  # Delete remote
   ```

3. Verify branch deleted:
   ```bash
   git branch -a | grep release/v1.0.1
   # Should return nothing
   ```

4. **Retry release workflow**

---

### Issue: Version Calculation Wrong (Off by One)

**Symptom:**
```
⚠️ Version calculated incorrectly
Expected: 1.0.1 (patch)
Got: 1.1.0 (minor)
```

**Cause:**
- VERSION file format issue
- Parsing error in version calculation
- Incorrect scope specified

**Solution:**

1. Verify VERSION file format:
   ```bash
   cat VERSION
   # Output should be exactly: X.Y.Z (no extra whitespace or newlines)
   ```

2. Remove trailing whitespace if present:
   ```bash
   VERSION_CLEAN=$(cat VERSION | xargs)
   echo "$VERSION_CLEAN" > VERSION
   git add VERSION
   git commit -m "chore: Fix VERSION file whitespace"
   git push origin develop
   ```

3. Verify scope parameter:
   ```bash
   # Check what scope you're using:
   # patch → X.Y.Z to X.Y.(Z+1)
   # minor → X.Y.Z to X.(Y+1).0
   # major → X.Y.Z to (X+1).0.0
   ```

4. **Retry with correct scope**

---

### Issue: CHANGELOG Roll Failed (Format Error)

**Symptom:**
```
❌ GATE 1: Pre-flight Checks FAILED
Error: Failed to roll CHANGELOG entries
[Unreleased] section found but cannot parse
```

**Cause:**
- CHANGELOG format not matching expected pattern
- Markdown syntax error in [Unreleased] section
- Nested headers or lists with wrong indentation

**Solution:**

1. Validate CHANGELOG format:
   ```bash
   # Check [Unreleased] section structure:
   grep -A 15 "## \[Unreleased\]" CHANGELOG.md
   ```

2. Verify format matches pattern:
   ```markdown
   ## [Unreleased]
   
   ### Added
   - Item 1
   - Item 2
   
   ### Changed
   - Item 1
   
   ### Fixed
   - Item 1
   
   ### Deprecated
   - (optional)
   
   ### Removed
   - (optional)
   
   ### Security
   - (optional)
   ```

3. Fix any formatting issues:
   - Use `###` for subsections (not `##` or `####`)
   - Use `-` for bullet points (not `*`)
   - Ensure blank lines between sections
   - No extra indentation on list items

4. After fixing:
   ```bash
   git add CHANGELOG.md
   git commit -m "docs: Fix CHANGELOG formatting"
   git push origin develop
   ```

5. **Retry release workflow**

---

## Phase 2 Issues

### Issue: GATE 4 — Tag Already Exists

**Symptom:**
```
❌ GATE 4: Tag Uniqueness FAILED
Error: Tag v1.0.1 already exists
```

**Cause:**
- Tag created from previous release attempt
- Manual tag created with same version
- Orphaned tag from failed cleanup

**Solution:**

1. Check if tag exists locally and remotely:
   ```bash
   git tag | grep v1.0.1
   git ls-remote --tags origin | grep v1.0.1
   ```

2. If tag exists, check its commit:
   ```bash
   git show v1.0.1
   # Look at the commit SHA
   ```

3. Decide: Keep existing tag or create new version?

   **Option A: Reuse existing tag** (if tag is on correct commit)
   ```bash
   # Check if tag points to correct version
   git log v1.0.1..HEAD --oneline | wc -l
   # If this is 0, tag is on latest commit
   # Release can proceed (tag already exists, that's OK)
   ```

   **Option B: Use different version** (if tag on wrong commit)
   ```bash
   # Delete the old tag and use next version
   git push origin --delete v1.0.1
   git tag -d v1.0.1
   
   # Increment version manually if needed
   echo "1.0.2" > VERSION
   git add VERSION
   git commit -m "chore: Bump version to 1.0.2"
   git push origin develop
   
   # Retry with patch scope (will create 1.0.2)
   ```

4. **Retry release workflow** with appropriate version

---

### Issue: GATE 5 — Authorization Denied

**Symptom:**
```
❌ GATE 5: Authorization FAILED
Error: User not in maintainers team
```

**Cause:**
- User triggering release not in maintainers GitHub team
- Team membership not synced
- User account not in organization

**Solution:**

1. Verify user is in maintainers team:
   ```bash
   # Check your GitHub username
   gh auth status  # or git config user.name
   
   # Check team membership
   gh api /orgs/lightspeedwp/teams/maintainers/members \
     -q '.[] | select(.login == "YOUR_USERNAME")'
   ```

2. If not in team, request addition:
   - Contact Release Engineering Lead
   - Provide GitHub username
   - Wait for team addition (1–5 minutes)

3. Clear any cached credentials:
   ```bash
   gh auth logout
   gh auth login
   ```

4. **Retry release workflow**

---

### Issue: GATE 6 — Secrets Found (gitleaks)

**Symptom:**
```
❌ GATE 6: Integrity Filter FAILED
Error: Secrets detected in repository
Found: AWS_ACCESS_KEY_ID, API_KEY
```

**Cause:**
- Accidentally committed secrets (passwords, API keys)
- Configuration file with sensitive data
- Credentials in code comments

**Solution:**

1. **DO NOT push again with secrets!** Instead:

   Identify the commit with secrets:
   ```bash
   # Check recent commits
   git log --oneline -20
   ```

2. Find and remove the secret:
   ```bash
   # Search for common secret patterns
   grep -r "password\|secret\|key\|token" . --include="*.js" --include="*.md" --include="*.json"
   ```

3. If secret is in recent unpushed commit:
   ```bash
   git reset HEAD~1  # Undo last commit
   # Edit file to remove secret
   git add <file>
   git commit -m "chore: Remove sensitive data"
   git push origin develop
   ```

4. If secret already pushed:
   ```bash
   # Use git-filter-branch or BFG to remove from history
   # This is complex - contact Release Engineering for help
   ```

5. Generate new credentials:
   - Invalidate old API keys
   - Create new credentials if needed
   - Use environment variables or secrets manager

6. **Retry release workflow** (new credentials won't be in commit)

---

### Issue: GATE 7 — Approval Not Detected (Minor/Major)

**Symptom:**
```
⏳ GATE 7: Approval Enforcement
Waiting for approval... (5 minutes passed, still waiting)
```

**Cause:**
- Approver hasn't reviewed PR yet
- Approval method not recognized (comment vs. button)
- Workflow hasn't detected approval yet

**Solution:**

1. **For Minor Release** (1 maintainer approval):
   ```bash
   # Check PR approval status
   gh pr view <PR_NUMBER> --json reviews
   # Look for state: "APPROVED"
   ```

2. **For Major Release** (2 maintainers approval):
   ```bash
   # Check both approvals
   gh pr view <PR_NUMBER> --json reviews
   # Should show state: "APPROVED" from 2 different users
   ```

3. If not approved:
   - Check if approver is available
   - Send them a message: _"PR #N awaiting your review"_
   - Verify they know they need to click "Approve" button

4. Common approval mistakes to check:
   - [ ] Did they click "Approve" button? (not just comment)
   - [ ] Are they a maintainer in the team? (not just collaborator)
   - [ ] Did they submit the right review? (not "Request Changes")

5. If approver unavailable:
   - Get approval from another maintainer
   - They can review and approve same PR
   - Release continues after approval detected

6. **Wait for approval** (workflow continues automatically once detected)

---

### Issue: GATE 7 — ADR Not Found (Major Release)

**Symptom:**
```
❌ GATE 7: Approval Enforcement FAILED
Error: ADR referenced but not found
Expected: docs/adr/0042-*.md
Got: File not found
```

**Cause:**
- ADR file doesn't exist at expected path
- ADR filename doesn't match reference
- ADR status not "Accepted"

**Solution:**

1. Verify ADR file exists:
   ```bash
   # Check docs/adr directory
   ls -la docs/adr/
   
   # Look for ADR file matching reference
   grep -r "Status" docs/adr/  # Should find one with "Accepted"
   ```

2. Check commit message for ADR reference:
   ```bash
   git log --oneline -1
   # Should include: "Refs: ADR-NNN" or "See: docs/adr/..."
   ```

3. If ADR file missing:
   ```bash
   # Check if ADR was committed
   git log --all --oneline | grep -i adr
   
   # If not committed, create and commit it
   # See ADR template in docs/adr/ or contact Architecture Team
   ```

4. If ADR status wrong:
   ```bash
   # Check ADR status line
   grep "Status:" docs/adr/0042-*.md
   # Must show: "Status: Accepted" (not "Proposed" or "Superseded")
   ```

5. Fix ADR status if needed:
   - Contact Architecture Team
   - Have them review and accept ADR
   - Update ADR file "Status: Accepted"
   - Commit and push

6. Ensure commit message references ADR:
   ```bash
   # Add ADR reference if missing
   git commit --amend -m "chore: Release v2.0.0
   
   Refs: ADR-42
   See: docs/adr/0042-breaking-change.md"
   
   git push origin <release-branch> --force-with-lease
   ```

7. **Retry release workflow**

---

## Approval & Authorization Issues

### Issue: Approval Timeout (Workflow Expired)

**Symptom:**
```
⏳ GATE 7: Waiting for approval (45 minutes)
... 
⏰ Approval window expired (60 minute timeout)
❌ Release workflow failed
```

**Cause:**
- Approval took too long
- Approver not available within timeout
- Workflow engine timeout reached

**Solution:**

1. Check how long approval took:
   ```bash
   # Review workflow logs for timestamps
   gh run view <RUN_ID> --log
   ```

2. If approval was given (just late):
   - Release can be retried
   - Approvals already documented on PR
   - Re-trigger workflow and it should complete faster

3. If approver became unavailable:
   - Get approval from different maintainer
   - Have them review PR and approve
   - Retry workflow

4. To prevent timeout next time:
   - Pre-notify approvers before release
   - Schedule release when approvers available
   - Use async communication (not waiting for response)

5. **Retry release workflow**

---

### Issue: User Approval Conflicts

**Symptom:**
```
❌ GATE 7: Approval Enforcement FAILED
Error: Reviewer submitted "Request Changes" instead of approval
```

**Cause:**
- Approver clicked "Request Changes" instead of "Approve"
- They want modifications before release
- Release blocked until changes addressed

**Solution:**

1. Check the review:
   ```bash
   gh pr review <PR_NUMBER>
   # Look for "Request changes" status
   ```

2. Read the requested changes:
   ```bash
   gh pr view <PR_NUMBER> --json reviews
   # Review the review.comments for details
   ```

3. Address the requested changes:
   - Fix what was requested
   - Commit and push changes
   - Request re-review from same approver

4. Request new approval:
   ```bash
   # Add comment on PR
   gh pr comment <PR_NUMBER> -b "Changes addressed, please review again"
   ```

5. Once addressed and re-approved:
   - Workflow continues automatically
   - Release completes

---

## Post-Release Issues

### Issue: Post-Release Sync Failed (Merge Conflict)

**Symptom:**
```
🚫 Post-Release Sync Failed
Error: Merge conflict when merging main → develop
Branches: main (v1.0.1) ↔ develop (v1.0.0)
```

**Cause:**
- develop diverged significantly from main after release branch created
- Same files modified on both branches
- Incompatible changes merged during release

**Solution:**

1. Check sync branch status:
   ```bash
   git fetch origin
   git branch -a | grep post-release-sync
   ```

2. Check what files have conflicts:
   ```bash
   git checkout origin/chore/post-release-sync-main-to-develop
   git merge-base HEAD origin/main
   git diff <merge-base> HEAD --name-only
   ```

3. Manual sync (if automated sync blocked):
   ```bash
   # Create new sync branch
   git checkout develop
   git pull origin develop
   git checkout -b chore/manual-sync-main-to-develop
   
   # Merge main into develop
   git merge origin/main
   # Resolve conflicts manually using git mergetool or editor
   git add .
   git commit -m "chore: Merge main into develop (post-release sync)"
   git push origin chore/manual-sync-main-to-develop
   ```

4. Verify merge is correct:
   - Check all conflict markers removed
   - VERSION file should match main (current release version)
   - CHANGELOG should have new release section

5. Create PR and merge manually if needed:
   ```bash
   gh pr create -B develop -H chore/manual-sync-main-to-develop \
     -t "chore: Post-release sync main → develop" \
     -b "Manual sync after release v1.0.1"
   ```

---

### Issue: GitHub Release Not Published

**Symptom:**
```
✅ Tag created: v1.0.1
❌ GitHub Release creation FAILED
Repository releases page shows nothing
```

**Cause:**
- GitHub API failure
- Release notes too long
- Special characters in release notes
- Permissions issue

**Solution:**

1. Check if release was created:
   ```bash
   # List releases
   gh release list
   # Check for v1.0.1
   ```

2. If release missing but tag exists:
   ```bash
   # Create release manually
   gh release create v1.0.1 \
     --title "Release v1.0.1" \
     --notes "See CHANGELOG.md for details"
   
   # Or get full changelog
   CHANGELOG=$(git log --oneline <previous-tag>..v1.0.1)
   gh release create v1.0.1 \
     --title "Release v1.0.1" \
     --notes "$CHANGELOG"
   ```

3. Check release notes format:
   - Avoid extremely long release notes (> 10k characters)
   - Escape special characters properly
   - Use valid Markdown syntax

4. If permissions issue:
   - Verify GitHub token has `repo` scope
   - Check collaborator status on repo
   - May need to re-authenticate

5. Verify release published:
   ```bash
   # Check releases page
   gh release view v1.0.1
   ```

---

## Emergency Procedures

### Emergency: Immediate Rollback Needed

If critical issues found immediately after release:

**Within 1 hour of release:**

1. **Stop all distributions** (if applicable)
   - Cancel deployments using v1.0.1
   - Alert users not to upgrade

2. **Delete GitHub Release**
   ```bash
   gh release delete v1.0.1
   ```

3. **Delete git tag**
   ```bash
   git push origin --delete v1.0.1
   git tag -d v1.0.1
   ```

4. **Revert merge commit on main**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   
   # Find merge commit SHA
   git log --oneline | grep "chore: Release"
   # Note the SHA
   
   git revert -m 1 <MERGE_COMMIT_SHA>
   git push origin main
   ```

5. **Optional: Revert develop changes**
   ```bash
   # Only if version bump was wrong
   git checkout develop
   git pull origin develop
   git revert <COMMIT_SHA>
   git push origin develop
   ```

6. **Notify team immediately**
   ```
   🚨 RELEASE ROLLBACK: v1.0.1

   Issue: [brief description]
   Action: Release yanked, tag deleted
   Status: Do NOT upgrade to v1.0.1
   Next: [what happens next - patch fix or investigation]
   ```

7. **Post-mortem**
   - What caused the issue?
   - Why wasn't it caught in testing?
   - How to prevent next time?

---

### Emergency: Release Stuck (Nothing Happening)

If workflow appears frozen for > 15 minutes:

1. **Check workflow status**
   ```bash
   gh run view <RUN_ID>
   # Look for "queued", "in_progress", or "completed"
   ```

2. **Check logs**
   ```bash
   gh run view <RUN_ID> --log
   # Look for last log entry and timestamp
   ```

3. **If truly stuck:**
   ```bash
   # Cancel the workflow
   gh run cancel <RUN_ID>
   
   # Wait 30 seconds
   sleep 30
   
   # Check status
   gh run view <RUN_ID>
   ```

4. **Cleanup before retry**
   ```bash
   # Delete any partial release branch
   git push origin --delete release/v1.0.1  # if exists
   git branch -D release/v1.0.1
   
   # Delete any partial tag
   git push origin --delete v1.0.1  # if exists
   git tag -d v1.0.1
   ```

5. **Retry workflow**
   - Go to Actions → Release Automation
   - Click "Run workflow"
   - Specify scope and version again

---

## Debugging Techniques

### Technique 1: Read Workflow Logs Carefully

When workflow fails:

1. Go to **Actions** tab
2. Click the failed workflow run
3. Click each step to expand
4. Read error messages carefully
5. Note exact error and line number

**Example workflow log analysis:**

```
❌ Step: "Validate CHANGELOG"
   Error: Line 42: Unexpected end of [Unreleased] section
   Expected: "## [1.0.1]" header after list items
   Found: "## [Deprecated]" (subsection still in [Unreleased])
```

### Technique 2: Test Locally Before Triggering

Before release, test locally:

```bash
# Simulate version bump
CURRENT=$(cat VERSION)
echo "Current version: $CURRENT"

# Test CHANGELOG parsing
grep -A 20 "## \[Unreleased\]" CHANGELOG.md | head -25

# Test git commands that workflow will run
git log --oneline -10
git status
```

### Technique 3: Use Dry-Run Always

Never skip dry-run:

1. Always trigger with `Dry Run: true` first
2. Review all 7 gates in preview
3. If all pass, then trigger with `Dry Run: false`
4. Dry-run catches 95% of issues

### Technique 4: Check Workflow Code

If issue unclear, review workflow implementation:

```bash
# View release workflow
cat .github/workflows/release.yml
# Look for the failing step
# Check what commands it runs
```

### Technique 5: Reach Out for Help

If stuck:

1. Create GitHub issue with:
   - Exact error message
   - Workflow run link
   - Reproduction steps

2. Tag Release Engineering team:
   ```
   @lightspeedwp/maintainers please help debug
   ```

3. Share logs:
   ```bash
   gh run view <RUN_ID> --log > release-logs.txt
   ```

---

## Preventive Checklist

To avoid common issues:

- [ ] Verify CHANGELOG.md has [Unreleased] section
- [ ] Verify VERSION file has correct current version
- [ ] Verify no uncommitted changes (`git status` clean)
- [ ] Verify no release/* branches exist from previous attempts
- [ ] Verify tag doesn't already exist (`git tag | grep`)
- [ ] Verify you're in maintainers team (for authorization)
- [ ] Do dry-run first (always)
- [ ] Notify approvers beforehand (for minor/major)
- [ ] Have ADR prepared (for major releases)
- [ ] Monitor workflow log during execution

---

## Support & Escalation

**For individual step failures:**
- Check corresponding section above
- Follow resolution steps
- Retry workflow

**For complex issues:**
- Review workflow code in `.github/workflows/release.yml`
- Check git history for related changes
- Consult Release Engineering team

**For feature requests or improvements:**
- Create GitHub issue
- Tag @lightspeedwp/maintainers
- Include: use case, impact, proposed solution

**For critical production issues:**
- Contact Release Engineering Lead immediately
- Have: detailed error description, time, impact assessment
- Be ready to execute rollback if needed

---

**Phase 9B Deliverable:** Release Workflow Validation & E2E Testing  
**Related Epic:** #2296  
**Coverage:** 80%+ of known issues  
**Last Updated:** 2026-08-22
