---
title: Project Maintenance Agent — Troubleshooting Guide
description: Detailed error diagnosis and solutions for common issues
created_date: 2026-08-18
last_updated: 2026-08-18
status: troubleshooting
phase: 4
file_type: documentation
---

# Project Maintenance Agent — Troubleshooting Guide

**Purpose:** Find and fix problems quickly
**Format:** Error → Diagnosis → Solution
**Audience:** Support team, on-call engineers, power users

---

## Table of Contents

1. [Workflow Errors](#workflow-errors)
2. [Script Errors](#script-errors)
3. [Permission & Access Errors](#permission--access-errors)
4. [Slack Integration Errors](#slack-integration-errors)
5. [File & Metadata Errors](#file--metadata-errors)
6. [Performance Issues](#performance-issues)

---

## Workflow Errors

### Error: "Workflow failed to start"

**Error Message:**

```

Unable to start workflow run
This repository does not have the specified workflow file

```

**Root Cause:**

- Workflow file doesn't exist
- File is in wrong location
- File has syntax error in YAML

**Diagnosis:**

```bash

# Check if file exists

ls -la .github/workflows/project-maintenance-*.yml

# Should show:

# .github/workflows/project-maintenance-nightly.yml

# .github/workflows/project-maintenance-on-demand.yml

# Check YAML syntax

yamllint .github/workflows/project-maintenance-nightly.yml

```

**Solution:**

1. **If files missing:**
   - They should have been created in Phase 3 (PR #2005)
   - Verify PR #2005 is merged: `git log | grep "2005"`
   - Pull latest develop: `git pull origin develop`
   - Files should now exist

2. **If YAML syntax error:**
   - Open file in editor
   - Check for: unclosed brackets, bad indentation, invalid characters
   - Use: `https://yamllint.com/` to validate
   - Fix syntax error
   - Commit and retry

3. **If file still in wrong place:**
   - Should be: `.github/workflows/project-maintenance-nightly.yml`
   - Check for typos in filename
   - Correct path and commit

---

### Error: "Workflow executed with failures"

**Error Message (in GitHub Actions):**

```

The job failed because the process exited with code 1.

```

**Root Cause:** One or more steps in workflow failed

**Diagnosis:**

1. **Click on failed job** in GitHub Actions tab
2. **Look for specific error** in logs:
   - Which step failed? (checkout, script, notify, etc.)
   - What's the error message?

**Solution:** See specific step errors below

---

### Error: "Script not found: project-docs-update.sh"

**Full Error:**

```

./scripts/automation/project-docs-update.sh: No such file or directory

```

**Root Cause:** Phase 1 script is missing or not in develop branch

**Diagnosis:**

```bash

# Check if file exists

ls -la scripts/automation/project-docs-update.sh

# Check if it's executable

file scripts/automation/project-docs-update.sh

# Should show: "executable"

# Check git history

git log --oneline -- scripts/automation/project-docs-update.sh

```

**Solution:**

1. **If file doesn't exist:**
   - Phase 1 PR (#1867) may not be merged
   - Check: `git log | grep -i "phase 1"`
   - If not merged, merge Phase 1 PR first
   - Then retry workflow

2. **If file not executable:**

   ```bash
   chmod +x scripts/automation/project-docs-update.sh
   git add scripts/automation/project-docs-update.sh
   git commit -m "fix: Make project-docs-update.sh executable"
   git push origin develop
   ```

3. **If file exists but still fails:**
   - Try running locally: `./scripts/automation/project-docs-update.sh --help`
   - If fails locally, check Phase 1 script for bugs
   - Create issue on Phase 1 epic (#1862)

---

### Error: "Workflow timeout: job exceeded maximum execution time"

**Full Error:**

```

The job running on runner has exceeded the maximum execution time of 360 minutes.

```

**Root Cause:** Workflow taking too long (usually >50 projects)

**Diagnosis:**

```bash

# Check how many projects

ls -1 .github/projects/active/ | wc -l

# If result > 50, that's likely the issue

# Check workflow execution time

# GitHub Actions → Previous runs → check "Elapsed time"


```

**Solution:**

1. **Split into batches:**

   ```
   Instead of: projects: all

   Do:
   Batch 1: projects: [first 25 projects]
   Batch 2: projects: [next 25 projects]
   ```
   See PHASE_4_OPERATIONS_RUNBOOK.md for detailed procedure

2. **Increase timeout:**

   ```yaml
   # In .github/workflows/project-maintenance-on-demand.yml
   jobs:
     execute:
       runs-on: ubuntu-latest
       timeout-minutes: 60  # Change from 30 to 60
   ```

3. **Archive old projects:**
   - Move completed projects to `archive/` folder
   - Reduces total project count
   - Faster scans

**Prevention:**

- Monitor workflow duration trends
- Keep active projects < 50 (archive completed ones)
- Split large operations into batches

---

## Script Errors

### Error: "Cannot read properties of undefined"

**Full Error:**

```

TypeError: Cannot read properties of undefined (reading 'PROJECTS_DIR')

```

**Root Cause:** Configuration not loaded or environment variable missing

**Diagnosis:**

```bash

# Check environment variables

echo $PROJECTS_DIR

# Should return: .github/projects/active

# Check script is sourcing config

head -20 scripts/automation/project-docs-update.sh

```

**Solution:**

1. **Set environment variable:**

   ```bash
   export PROJECTS_DIR=".github/projects/active"
   ./scripts/automation/project-docs-update.sh --dry-run
   ```

2. **If still fails, check script syntax:**

   ```bash
   bash -n scripts/automation/project-docs-update.sh
   # If no output, syntax is OK
   # If output, there's a syntax error
   ```

3. **Run with verbose output:**

   ```bash
   bash -x scripts/automation/project-docs-update.sh --dry-run 2>&1 | head -50
   # Shows each command executed
   ```

---

### Error: "Permission denied" on project folder

**Full Error:**

```

./scripts/automation/project-docs-update.sh: line 45: .github/projects/active: Permission denied

```

**Root Cause:** Script doesn't have read/write permission on folder

**Diagnosis:**

```bash

# Check folder permissions

ls -la .github/projects/active/ | head

# Should show: drwxr-xr-x (at least read+execute)

# Check file permissions

ls -la .github/projects/active/*/README.md | head

# Should show: -rw-r--r-- (at least readable)


```

**Solution:**

1. **Fix folder permissions:**

   ```bash
   chmod 755 .github/projects/active/
   chmod 755 .github/projects/active/*/
   ```

2. **Fix file permissions:**

   ```bash
   chmod 644 .github/projects/active/*/*.md
   ```

3. **Commit changes:**

   ```bash
   git add .github/projects/
   git commit -m "fix: Correct folder and file permissions"
   ```

4. **In GitHub Actions:**
   - Workflow runs as `github-actions` user
   - Permissions usually inherited from repo settings
   - If still fails, check GitHub branch protection rules

---

### Error: "Invalid argument to sed"

**Full Error:**

```

sed: 1: "s/old/new/g": invalid argument

```

**Root Cause:** Special characters in project name (/, &, etc.)

**Diagnosis:**

```bash

# Check for special characters

ls .github/projects/active/ | grep -E '[/&\\]'

# If any output, those are the problem projects


```

**Solution:**

This is handled by Phase 1 script. If you see this error:

1. **Check if Phase 1 has latest security fix:**

   ```bash
   git log --oneline -- scripts/automation/project-docs-update.sh | head
   # Look for: "security fix" or "sed injection"
   ```

2. **If fix not present:**
   - Phase 1 PR (#1867) may not have merged correctly
   - Merge Phase 1 again or apply security patch manually

3. **Workaround: Rename project:**

   ```bash
   # Avoid special characters in project folder names
   # Use: project-name (hyphens OK)
   # Avoid: project&name, project/name, etc.
   ```

---

## Permission & Access Errors

### Error: "Permission denied: 'project.md' (13)"

**Full Error:**

```

Error: EACCES: permission denied, open '.github/projects/active/my-project/README.md'

```

**Root Cause:** Insufficient read/write permissions on file

**Diagnosis:**

```bash

# Check if user can write to file

test -w .github/projects/active/my-project/README.md && echo "writable" || echo "not writable"

# Check file owner

ls -la .github/projects/active/my-project/README.md

# Look at: owner, group, permissions


```

**Solution:**

1. **Make file writable:**

   ```bash
   chmod 644 .github/projects/active/my-project/README.md
   ```

2. **Make all files writable:**

   ```bash
   chmod -R 644 .github/projects/active/*/
   chmod -R 755 .github/projects/active/
   ```

3. **Commit changes:**

   ```bash
   git add -A
   git commit -m "fix: Correct file permissions across projects"
   git push origin develop
   ```

4. **In GitHub Actions:**
   - Usually handled automatically
   - If still failing, check: Settings → Permissions → Actions

---

### Error: "Cannot access repository secrets"

**Full Error:**

```

The workflow file is not found in this repository
OR
Error: GitHub Actions is not permitted to access this secret

```

**Root Cause:** Secret (like Slack webhook) not configured or not accessible

**Diagnosis:**

```bash

# Check if secret exists (local only)

# GitHub UI: Settings → Secrets and variables → Actions

# Look for: PROJECT_MAINTENANCE_SLACK_WEBHOOK


```

**Solution:**

1. **If secret missing:**
   - Go to: Settings → Secrets and variables → Actions
   - Click: "New repository secret"
   - Name: `PROJECT_MAINTENANCE_SLACK_WEBHOOK`
   - Value: [paste webhook URL from Slack]
   - Save

2. **If secret exists but not accessible:**
   - Check: Workflow file has correct secret name
   - Should be: `${{ secrets.PROJECT_MAINTENANCE_SLACK_WEBHOOK }}`
   - Re-create secret (sometimes helps)
   - Clear GitHub Actions cache

3. **Testing secret access:**

   ```bash
   # In workflow, add debug step:

   - name: Debug secret

     run: |
       if [ -z "${{ secrets.PROJECT_MAINTENANCE_SLACK_WEBHOOK }}" ]; then
         echo "Secret not found!"
       else
         echo "Secret exists"
       fi
   ```

---

## Slack Integration Errors

### Error: "Slack webhook returned 404"

**Full Error (in workflow logs):**

```

curl: (22) The requested URL returned error: 404 Not Found

```

**Root Cause:** Webhook URL is invalid or has been deleted in Slack

**Diagnosis:**

```bash

# Test webhook (locally)

curl -X POST $WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d '{"text":"test"}'

# If 404, webhook is bad


```

**Solution:**

1. **Regenerate webhook in Slack:**
   - Slack workspace → Settings → App management
   - Find: "Incoming webhooks" or "Project Maintenance"
   - Delete old webhook
   - Create new webhook
   - Copy new URL

2. **Update GitHub secret:**
   - Settings → Secrets and variables → Actions
   - Edit: `PROJECT_MAINTENANCE_SLACK_WEBHOOK`
   - Paste: New URL
   - Save

3. **Test webhook:**

   ```bash
   curl -X POST [new-url] -d '{"text":"test"}'
   # Should respond with HTTP 200
   ```

4. **Re-run workflow:**
   - GitHub Actions tab
   - Select workflow
   - "Run workflow" button
   - Monitor logs for success

---

### Error: "Slack message not received"

**Symptom:** Workflow completed, but no Slack message appears

**Root Cause:**

- Webhook created for wrong channel
- Webhook is disabled in Slack
- Message formatting is wrong
- Network issue (rare)

**Diagnosis:**

```bash

# 1. Check webhook status

curl -I https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Should return: HTTP 200

# 2. Check webhook channel setting

# Slack UI → Incoming webhooks → Project Maintenance

# Look at: "Post to Channel"

# Should be: #projects (or your configured channel)

# 3. Test message format

curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-type: application/json' \
  -d '{
    "channel": "#projects",
    "username": "Project Maintenance Bot",
    "text": "Test message"
  }'

```

**Solution:**

1. **If webhook disabled in Slack:**
   - Slack workspace → Settings → App management
   - Find webhook integration
   - Enable it
   - Test again

2. **If wrong channel:**
   - Edit webhook in Slack
   - Change "Post to channel" to correct channel
   - Verify channel exists and bot has access

3. **If message format wrong:**
   - Check workflow YAML file
   - Look for: curl command that sends to Slack
   - Verify JSON is valid (use validator)
   - Fix syntax if needed

4. **Webhook refresh:**
   - Delete and recreate webhook
   - Update secret
   - Test again

---

## File & Metadata Errors

### Error: "README.md has invalid YAML frontmatter"

**Full Error (from validate operation):**

```

File: README.md
Issue: Invalid YAML syntax in frontmatter
Details: Line 3: unexpected character ':'

```

**Root Cause:** Malformed YAML in file header

**Common Issues:**

```yaml

# ❌ WRONG: Unquoted string with colon

title: My Project: The Sequel

# ✅ RIGHT: Quoted string

title: "My Project: The Sequel"

# ❌ WRONG: Missing quotes on URL

url: https://example.com

# ✅ RIGHT: Quoted URL

url: "https://example.com"

# ❌ WRONG: Bad indentation

---
  title: My Project
---

# ✅ RIGHT: Correct indentation

---
title: My Project
---

```

**Diagnosis:**

```bash

# Use online YAML validator

# https://www.yamllint.com/

# Or validate locally

yamllint .github/projects/active/my-project/README.md

# Or check with a test editor

# (Many Markdown editors have YAML validators)


```

**Solution:**

1. **Open file in GitHub editor**
   - Or edit locally: `code .github/projects/active/my-project/README.md`

2. **Find the error line**
   - Use yamllint output to find exact line
   - Look for: colons, quotes, special characters

3. **Fix syntax:**
   - Add quotes around strings with colons or special chars
   - Fix indentation (2 spaces)
   - Remove invalid characters

4. **Commit fix:**

   ```bash
   git add .github/projects/active/my-project/README.md
   git commit -m "fix: Correct YAML frontmatter in README.md"
   ```

5. **Validate fix:**

   ```bash
   # Run validate operation
   GitHub Actions → Project Maintenance — On-Demand
   operation: validate
   projects: my-project
   dry_run: true
   ```

---

### Error: "Template file not found"

**Full Error (from create-docs operation):**

```

Error: Template not found: PLANNING.md.template
Location: .github/projects/_templates/PLANNING.md.template

```

**Root Cause:** Template files missing or in wrong location

**Diagnosis:**

```bash

# Check if templates folder exists

ls -la .github/projects/_templates/

# Should show files like:

# PLANNING.md.template

# OPENSPEC.md.template

# README.md.template


```

**Solution:**

1. **If templates folder missing:**
   - Should be created during Phase 1
   - Check: PR #1867 includes templates
   - If not, create folder and templates manually

2. **If templates exist but wrong location:**
   - Should be: `.github/projects/_templates/`
   - Move files to correct location
   - Commit change

3. **If templates have wrong names:**
   - Should be: `FILENAME.template` (lowercase, with .template extension)
   - Rename files if needed
   - Commit change

4. **If templates still not found:**
   - Pull latest develop: `git pull origin develop`
   - Check Phase 1 PR merged: `git log | grep "1867"`
   - Run audit to see full error details

---

### Error: "Created files have wrong content"

**Symptom:** Files created but content doesn't match template

**Root Cause:** Template file has wrong content or was modified incorrectly

**Diagnosis:**

```bash

# Check actual template content

cat .github/projects/_templates/PLANNING.md.template | head

# Compare with created file

cat .github/projects/active/my-project/PLANNING.md | head

```

**Solution:**

1. **Review template content:**
   - Does it have frontmatter (YAML)?
   - Does it have content body?
   - Is formatting correct?

2. **If template wrong:**
   - Edit template file
   - Add correct content
   - Commit change

3. **If created files wrong:**
   - Delete created files from project folder
   - Re-run create-docs operation
   - Check output

4. **If still wrong:**
   - Manually edit created files
   - Or delete and create manually
   - Create issue for template improvement

---

## Performance Issues

### Issue: "Audit takes >5 minutes for 50 projects"

**Symptom:** Workflow runs slowly, taking 5+ minutes for complete audit

**Root Cause:**

- Too many projects (>50)
- Network latency
- Disk I/O bottleneck

**Diagnosis:**

```bash

# Count projects

ls -1 .github/projects/active/ | wc -l

# Check file sizes

du -sh .github/projects/active/

# If > 100MB, lots of large files


```

**Solution:**

1. **Archive old projects:**

   ```bash
   # Move completed projects to archive/
   # Reduces count and improves speed
   ```

2. **Split operations:**

   ```bash
   # Instead of: projects: all
   # Do: projects: [first 30]
   # Then: projects: [next 20]
   ```

3. **Optimize templates:**
   - Check if template files are very large
   - Remove unnecessary content
   - Keep to essentials

4. **Monitor trends:**
   - Track execution time over time
   - Set alerts if > 10 minutes
   - Archive more frequently

---

### Issue: "Workflow uses too much disk space"

**Symptom:** Workflow fails with: "Disk quota exceeded" or similar

**Root Cause:** Too much data in workflow logs or large project files

**Diagnosis:**

```bash

# Check .github/projects size

du -sh .github/projects/

# If > 500MB, that's large

# Check specific projects

du -sh .github/projects/active/*/ | sort -h | tail

# Shows largest projects


```

**Solution:**

1. **Archive large old projects:**

   ```bash
   # Archive completed projects first
   # This reduces active folder size
   ```

2. **Clean up logs:**

   ```bash
   # GitHub Actions → Settings → Logs and artifacts
   # Set retention to 7 or 14 days
   ```

3. **Remove unnecessary files:**
   - Check if projects have large binary files
   - Remove or move to separate repo
   - Keep projects lean

---

## Still Stuck?

**If error not in this guide:**

1. **Check the other guides:**
   - PHASE_4_TRAINING_GUIDE.md (overview, basics)
   - PHASE_4_OPERATIONS_RUNBOOK.md (procedures, not just errors)

2. **Check logs:**
   - GitHub Actions → Select failed workflow
   - Read full error message (scroll to find relevant part)
   - Search for "error" or "failed" in logs

3. **Ask for help:**
   - Create issue: `type: support`, `label: project-maintenance`
   - Include:
     - Exact error message
     - Steps to reproduce
     - What you've already tried
   - Link to epic #1862

4. **Check related docs:**
   - Phase 3: PHASE_3_IMPLEMENTATION.md
   - Phase 2: PHASE_2_KICKOFF.md
   - Phase 1: docs/SCRIPT_USAGE.md

---

## Common Error Patterns

**Error contains "not found"?**

- File doesn't exist or is in wrong location
- Check: file paths, naming, extensions

**Error contains "permission"?**

- Folder/file permissions too restrictive
- Solution: chmod to fix

**Error contains "syntax" or "invalid"?**

- File has syntax error (YAML, bash, etc.)
- Solution: use validator, fix syntax

**Error contains "timeout"?**

- Operation taking too long
- Solution: split into batches, reduce scope

**Error contains "webhook" or "slack"?**

- Slack integration not working
- Solution: check webhook URL, regenerate, test

---

*Troubleshooting Guide v1.0 — 2026-08-18*
*30+ error scenarios covered*
