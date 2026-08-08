---
title: "Badge Troubleshooting Guide"
description: "Troubleshooting common badge generation and validation issues"
file_type: "documentation"
tags: ["badges", "troubleshooting", "diagnostics"]
---

# Badge Troubleshooting Guide

**Status:** Active  
**Version:** 1.0.0  
**Last Updated:** 2026-08-08

---

## Quick Diagnosis Flowchart

```
Badge issue?
├─ Badges not appearing?
│  └─ See: "Badges Not Generating"
├─ Broken badge links?
│  └─ See: "Broken Badge Links"
├─ Workflow not running?
│  └─ See: "Workflow Execution Issues"
└─ Schema problems?
   └─ See: "Schema Validation Errors"
```

---

## Problem: Badges Not Generating

### Symptoms

- Document has proper markers but no badges appear
- No workflow errors in GitHub Actions
- File changes don't trigger badge generation

### Diagnosis Checklist

- [ ] Document has `<!-- BADGES-START -->` marker?
- [ ] Document has `<!-- BADGES-END -->` marker?
- [ ] Markers are on separate lines?
- [ ] Document has frontmatter section with `---`?
- [ ] File is in a documented directory (docs/, agents/, etc.)?
- [ ] File type is in coverage list?
- [ ] Schema file exists at `.github/automation/badges.schema.yml`?

### Solutions

#### Solution 1: Verify Markers

**Correct format:**

```markdown
# Document Title

<!-- BADGES-START -->
<!-- BADGES-END -->

Content here...
```

**Common mistakes:**

```markdown
<!-- Incorrect: inline markers -->
<!-- BADGES-START --> <!-- BADGES-END -->

<!-- Incorrect: typo in marker -->
<!-- BADGES_START --> <!-- BADGES_END -->

<!-- Incorrect: missing content between -->
<!-- BADGES-START --><!-- BADGES-END -->
```

**Fix:** Edit the file and ensure markers are exactly as shown above, on separate lines.

#### Solution 2: Check Frontmatter

**Correct format:**

```markdown
---
title: "My Document"
file_type: "documentation"
---
```

**Common mistakes:**

```markdown
# My Document
<!-- Missing frontmatter section -->

---
title: "My Document"
<!-- Missing opening --- -->

title: "My Document"
---
<!-- Missing closing --- -->
```

**Fix:** Add proper YAML frontmatter with three-dash delimiters.

#### Solution 3: Verify File Type

**Supported file types for badges:**

- `documentation` — Standard documentation
- `specification` — Technical specifications
- `guide` — How-to and procedural guides
- `workflow` — Workflow documentation
- `automation` — Automation and infrastructure

**Fix:** Update `file_type:` in frontmatter to one of the above.

#### Solution 4: Check Directory

**Supported directories:**

```
docs/
agents/
instructions/
schemas/
```

**Fix:** Move document to a supported directory, or request directory support.

#### Solution 5: Manually Trigger Workflow

```bash
# Run workflow for specific file
gh workflow run badges-documentation-update.yml \
  -b develop \
  --input target_files="docs/my-file.md"

# Check workflow logs
gh workflow view badges-documentation-update.yml --log
```

---

## Problem: Broken Badge Links

### Symptoms

- Badges appear but links are broken (404)
- Some badge URLs redirect incorrectly
- Badges return 410 Gone errors

### Root Causes

1. **Workflow renamed or deleted** — URL references non-existent workflow
2. **Schema out of sync** — Workflow name doesn't match actual file
3. **Typo in workflow name** — Schema references wrong filename
4. **Workflow temporarily unavailable** — Repository access issue

### Diagnosis Steps

**Step 1: Check GitHub Actions**

```bash
# List all workflows
gh workflow list --all --repo lightspeedwp/.github
```

**Step 2: Verify Schema Workflow Names**

```bash
# Extract workflows from schema
grep -oP "^\s{4}\K[a-z0-9-]+(?=:$)" .github/automation/badges.schema.yml | sort
```

**Step 3: Compare Lists**

- workflows in `.github/workflows/` should match schema definitions
- Missing matches indicate deleted workflows
- Extra matches indicate renamed workflows

### Solutions

#### Solution 1: Update Schema for Renamed Workflow

**Find the old name:**

```bash
# Search schema for similar names
grep "old-workflow-name" .github/automation/badges.schema.yml
```

**Update schema:**

```yaml
# Change from:
  old-workflow-name:
    label: "Old Workflow Name"
    
# To:
  new-workflow-name:
    label: "New Workflow Name"
```

**Verify:**

```bash
# Run health check
gh workflow run badges-health-check.yml
```

#### Solution 2: Remove Deleted Workflow from Schema

**If workflow no longer exists:**

1. Remove from schema `badges.workflow` section
2. Update any mapping rules that reference it
3. Commit and push changes
4. Verify by running health check

#### Solution 3: Check Workflow File Exists

```bash
# Verify workflow file exists
ls -la .github/workflows/my-workflow.yml

# Check for case sensitivity issues
ls .github/workflows/ | grep -i "my-workflow"
```

#### Solution 4: Validate Badge URLs

```bash
# Test a badge URL manually
curl -s -o /dev/null -w "%{http_code}" \
  "https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop"

# Should return 200, not 404
```

---

## Problem: Workflow Execution Issues

### Symptoms

- Workflow doesn't run on schedule
- Manual dispatch doesn't trigger workflow
- Workflow runs but produces no output

### Diagnosis

**Check workflow status:**

```bash
# View recent runs
gh workflow view badges-documentation-update.yml --json status -q

# View detailed logs
gh run list --workflow badges-documentation-update.yml --limit 5
```

**Check workflow permissions:**

- Repository must grant workflow permissions
- Token must have write access to `contents` and `issues`
- Check branch protection rules

### Solutions

#### Solution 1: Verify Workflow Permissions

**File:** `.github/workflows/badges-documentation-update.yml`

```yaml
permissions:
  contents: write          # Required for commits
  pull-requests: write     # Required for PRs
  issues: write           # Required for issue creation
```

**Fix:** Ensure `permissions` section is present and correct.

#### Solution 2: Check Trigger Conditions

**For on-push trigger:**

```yaml
on:
  push:
    branches: [develop]
    paths:
      - "docs/**/*.md"
      - "**.md"
```

**Verify:**

- Branch is `develop`
- Files changed match path patterns
- No branch protection blocking automation

**Fix:**

```bash
# Run manual dispatch instead
gh workflow run badges-documentation-update.yml -b develop
```

#### Solution 3: Check Workflow Syntax

```bash
# Validate workflow YAML
yamllint .github/workflows/badges-documentation-update.yml

# Check for common errors
- Incorrect indentation
- Missing quotes around values
- Invalid environment variable syntax
```

**Fix:** Correct any YAML syntax errors.

---

## Problem: Schema Validation Errors

### Symptoms

- Workflow logs show "Schema validation failed"
- Badges not generated due to schema issues
- Error messages about missing sections

### Common Errors

**Error: "Schema missing 'badges' section"**

- Schema file is empty or corrupted
- YAML parsing failed

**Error: "Schema missing 'mapping' section"**

- Mapping rules not defined
- Workflow can't determine which badges to apply

**Error: "Invalid YAML in schema"**

- Syntax errors in `.github/automation/badges.schema.yml`
- Bad indentation or special characters

### Solutions

#### Solution 1: Validate Schema Syntax

```bash
# Check YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/automation/badges.schema.yml'))"

# Or use online validator
# https://www.yamllint.com/
```

**Fix:** Correct any YAML syntax errors (indentation, quotes, etc.).

#### Solution 2: Verify Required Sections

```bash
# Check for required sections
grep "^badges:" .github/automation/badges.schema.yml
grep "^mapping:" .github/automation/badges.schema.yml
grep "^config:" .github/automation/badges.schema.yml
```

**If missing:** Add required sections from the schema template.

#### Solution 3: Regenerate Schema

```bash
# Backup current schema
cp .github/automation/badges.schema.yml \
   .github/automation/badges.schema.yml.bak

# Regenerate from workflows
node scripts/badges/generate-schema.js

# Verify new schema
node scripts/badges/test-workflows.js

# If successful, keep new schema
# If errors, restore backup
# cp .github/automation/badges.schema.yml.bak \
#    .github/automation/badges.schema.yml
```

---

## Problem: Timeout Issues

### Symptoms

- Badge validation times out
- Workflow runs slow
- "TIMEOUT" errors in logs

### Causes

- GitHub API rate limiting
- Slow network connections
- Too many badges being validated

### Solutions

#### Solution 1: Increase Timeout

**File:** `.github/workflows/badges-health-check.yml`

```bash
# Change timeout from 10 to 20 seconds
timeout 20 curl -s -o /dev/null -w "%{http_code}" "$url"
```

#### Solution 2: Reduce Badge Count

- Limit to critical workflow badges only
- Update mapping rules to exclude optional badges
- Focus on frequently-changing badges

#### Solution 3: Check Network

```bash
# Test GitHub API access
curl -s https://api.github.com/repos/lightspeedwp/.github | head -5

# Test badge URL access
curl -s -o /dev/null -w "%{http_code}" \
  "https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg"
```

---

## Diagnostic Commands

### Quick Diagnostics

```bash
# Test schema validity
node scripts/badges/test-workflows.js

# Generate fresh schema
node scripts/badges/generate-schema.js

# Run health check manually
gh workflow run badges-health-check.yml

# View workflow logs
gh workflow view badges-documentation-update.yml --log

# List all workflow runs
gh run list --all --repo lightspeedwp/.github | head -20
```

### Debug Information

```bash
# Check schema file exists and has content
ls -lh .github/automation/badges.schema.yml
wc -l .github/automation/badges.schema.yml

# Count workflows in schema vs actual
echo "Workflows in schema:"
grep -c "^    [a-z0-9-]*:$" .github/automation/badges.schema.yml
echo "Workflows in .github/workflows/:"
ls .github/workflows/*.yml | wc -l

# Find files with badge markers
echo "Files with badge markers:"
find docs -name "*.md" -exec grep -l "BADGES-START" {} \;
```

---

## Advanced Troubleshooting

### Issue: Workflow Coverage Gaps

**Problem:** Some workflows don't have badges

**Diagnosis:**

```bash
# Find workflows not in schema
comm -23 \
  <(ls .github/workflows/*.yml | sed 's|.*/||;s|\.yml||' | sort) \
  <(grep -oP "^    \K[a-z0-9-]+(?=:$)" .github/automation/badges.schema.yml | sort)
```

**Solution:**

```bash
# Regenerate schema to include all workflows
node scripts/badges/generate-schema.js
```

### Issue: Workflow Runs Repeatedly

**Problem:** Badge workflow triggers infinitely

**Cause:** Workflow commits changes that trigger the same workflow

**Solution:**

```yaml
# Add [skip ci] to commit message
git commit -m "docs: Update badges [skip ci]"
```

---

## Getting Help

### Escalation Path

1. **Check this guide** — Most common issues covered above
2. **Run diagnostics** — Use diagnostic commands to identify root cause
3. **Check GitHub Issues** — Search for similar issues in repository
4. **Contact Maintainers** — Open issue with diagnostic output

### Useful Information to Provide

When reporting badge issues, include:

- [ ] Output of `node scripts/badges/test-workflows.js`
- [ ] Output of `gh workflow view [workflow-name] --log`
- [ ] Screenshot of broken badge (if applicable)
- [ ] Exact error message from logs
- [ ] Steps to reproduce

---

## Related Documentation

- [Badge Governance](BADGES_GOVERNANCE.md) — Policies and procedures
- [Badge Examples](BADGES_EXAMPLES.md) — Real-world examples
- [Badge Schema](../.github/automation/badges.schema.yml) — Configuration reference
- [GitHub Actions Docs](https://docs.github.com/en/actions) — Official documentation

---

*Troubleshooting guide created 2026-08-08 | Phase 3 Integration*
