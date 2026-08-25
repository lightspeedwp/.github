---
file_type: documentation
title: AI Feedback Validation — Automation Setup
description: Technical setup and automation enforcement for AI feedback PR review system
version: 1.0.1
created_date: 2026-08-04T00:00:00.000Z
audience: DevOps, Engineering Leads
---

# AI Feedback Validation — Automation Setup

This document covers the technical setup, configuration, and enforcement automation for the AI feedback validation system.

## System Architecture

```
GitHub Event: PR opened/edited/pushed
         ↓
[ai-feedback-validation.yml workflow]
         ↓
   Job 1: validate-feedback-linkage
   ├─ Check issue links (Resolves #123)
   ├─ Load FEEDBACK_RESPONSE.md
   ├─ Validate status markers
   ├─ Check deferred items
   └─ Post validation comment
         ↓
   Job 2: check-feedback-response-format
   ├─ Validate file structure
   ├─ Check required sections
   └─ Log warnings
         ↓
[Workflow passes ✅ or fails ❌]
```

## Deployed Components

### 1. Workflow File

**Location:** `.github/workflows/ai-feedback-validation.yml`

**Size:** 190 lines  
**Permissions:** contents:read, issues:read, pull-requests:write, checks:write  
**Trigger:** `pull_request_target` (safe from forks)  
**Jobs:** 2 concurrent jobs

**Key Features:**

- Safe `pull_request_target` (inspects PR body only, doesn't check out code)
- Command injection protection (no shell commands with untrusted input)
- Automatic comment creation/update on validation failure
- Comment cleanup when validation passes

---

### 2. Validation Helper Script

**Location:** `.github/scripts/validation/ai-feedback-helpers.cjs`

**Size:** 191 lines  
**Language:** CommonJS (Node.js)

**Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `validateAIFeedback()` | Main orchestrator | validation object with issues |
| `validateFeedbackResponseFile()` | Structure validation | {valid, errors[]} |
| `checkInvalidStatuses()` | Status marker validation | array of invalid items |
| `checkDeferredWithoutIssue()` | Deferred tracking check | array of items without issue |

---

### 3. Templates & Examples

**Location:** `.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md`

Users copy this template into their PR to document feedback responses.

**Examples:**

- Simple: 3 items, all addressed
- Complex: 7 items, mixed statuses

---

### 4. Documentation

**Location:** `.github/docs/`

| File | Audience | Purpose |
|------|----------|---------|
| `QUICK_REFERENCE_AI_FEEDBACK.md` | All developers | 4-step quick reference |
| `ai-feedback-response-tracking.md` | All developers | Comprehensive guide |
| `WORKFLOW_AI_FEEDBACK_VALIDATION.md` | Tech leads, DevOps | Technical details |
| `AI_FEEDBACK_IMPLEMENTATION_GUIDE.md` | Team leads | Implementation for teams |
| `AI_FEEDBACK_AUTOMATION_SETUP.md` | DevOps | This file |

---

## Installation & Setup

### Step 1: Verify Files Are In Place

```bash
# Check workflow
ls -la .github/workflows/ai-feedback-validation.yml

# Check validation helper
ls -la .github/scripts/validation/ai-feedback-helpers.cjs

# Check templates
ls -la .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md
ls -la .github/examples/FEEDBACK_RESPONSE_example-*.md

# Check documentation
ls -la .github/docs/ai-feedback-*.md
ls -la .github/docs/AI_FEEDBACK_*.md
```

### Step 2: Verify Workflow Syntax

```bash
# Install GitHub CLI (if not already installed)
brew install gh  # macOS
# or: apt-get install gh  # Linux
# or: choco install gh  # Windows

# Validate workflow syntax
gh workflow view --repo lightspeedwp/.github ai-feedback-validation.yml
```

### Step 3: Test Workflow

**Create test PR:**

```bash
# Create test branch
git checkout -b test/feedback-validation-test

# Add test file
echo "test" > test-feedback.md
git add test-feedback.md
git commit -m "test: feedback validation workflow"

# Create PR (without FEEDBACK_RESPONSE.md to test failure)
gh pr create --title "test: AI feedback validation" \
  --body "Resolves #123" \
  --draft
```

**Expected Result:**

- Workflow runs (visible in PR checks)
- Validation comment appears
- Check fails with clear message

**Fix test:**

```bash
# Copy template
cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./

# Document feedback
# (edit FEEDBACK_RESPONSE.md with a feedback item)

# Commit
git add FEEDBACK_RESPONSE.md
git commit -m "docs: document feedback responses"
git push

# Verify: workflow should pass now
```

### Step 4: Enable Branch Protection (Optional)

If you want to require passing validation before merge:

**In GitHub Settings → Branches → main/develop:**

1. Require status checks to pass before merging
2. Add check: `validate-feedback-linkage`
3. Check "Dismiss stale pull request approvals"
4. Check "Require branches to be up to date"

---

## Configuration

### Customize Validation Rules

Edit `.github/scripts/validation/ai-feedback-helpers.cjs`:

#### Example: Add Custom Feedback Category

```javascript
function validateFeedbackCategories(content) {
  const validCategories = [
    'code-quality', 'performance', 'documentation',
    'security', 'testing', 'custom-category'  // Add here
  ];
  
  // Check category against valid list
  const categoryPattern = /\|\s*\S+\s*\|\s*(\S+)\s*\|/g;
  let match;
  while ((match = categoryPattern.exec(content)) !== null) {
    const category = match[1];
    if (!validCategories.includes(category)) {
      return false;
    }
  }
  return true;
}
```

#### Example: Change Status Markers

```javascript
// Original
const validStatusTexts = ['addressed', 'deferred', 'rejected'];

// Custom: add 'pending'
const validStatusTexts = ['addressed', 'deferred', 'rejected', 'pending'];
```

### Customize Workflow Messages

Edit `.github/workflows/ai-feedback-validation.yml`:

#### Change Validation Comment

Find `buildValidationMessage()` function and update messages:

```yaml
- name: Check PR-Issue linkage and feedback response
  uses: actions/github-script@v7
  with:
    script: |
      // Customize this section
      const message = [
        marker,
        '🚀 **Custom Header Message**',
        '✅ All checks passed!',
        ...
      ].join('\n');
```

### Customize Template

Edit `.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md`:

- Add/remove sections
- Change table format
- Update examples
- Add team-specific guidance

---

## Monitoring & Troubleshooting

### Check Workflow Runs

```bash
# View recent runs
gh run list --repo lightspeedwp/.github --workflow ai-feedback-validation.yml

# View specific run details
gh run view <RUN_ID> --repo lightspeedwp/.github

# View workflow logs
gh run view <RUN_ID> --log --repo lightspeedwp/.github
```

### Common Issues

#### Workflow Not Triggering

**Symptom:** Workflow doesn't run on PR open

**Causes:**

1. Workflow file has syntax errors
2. File not in `.github/workflows/` (exact path required)
3. Event filter (`pull_request_target`) not matching
4. Branch protection prevents workflow from running

**Fix:**

```bash
# Validate syntax
cd .github
git add workflows/ai-feedback-validation.yml
npm run validate:workflows

# Check for syntax errors
yamllint workflows/ai-feedback-validation.yml

# Verify file is committed
git status workflows/ai-feedback-validation.yml
```

#### Validation Comment Not Appearing

**Symptom:** Workflow runs but no comment on PR

**Causes:**

1. Validation passed (no issues found)
2. Workflow lacks permission to comment
3. Previous comment was deleted, new one not created

**Fix:**

```bash
# Check workflow permissions
grep -A 5 "permissions:" workflows/ai-feedback-validation.yml
# Should include: pull-requests: write

# Check workflow logs for errors
gh run view <RUN_ID> --log

# Manually trigger workflow
git commit --allow-empty -m "test: trigger workflow"
git push
```

#### Helper Script Not Found

**Symptom:** Error: "Cannot find module './scripts/validation/ai-feedback-helpers.cjs'"

**Cause:** Incorrect require path in workflow

**Fix:**

```yaml
# In workflow, check require path
script: |
  const { validateAIFeedback } = require('./scripts/validation/ai-feedback-helpers.cjs');
  // Path must be relative to repository root (.github/ for this repo)
```

---

## Performance Considerations

### Workflow Runtime

**Typical Execution:**

- Job 1 (validate-feedback-linkage): 2-3 seconds
- Job 2 (check-feedback-response-format): 1-2 seconds
- Total: 3-5 seconds

**Optimizations:**

- Both jobs run concurrently (not sequential)
- No external API calls (fast)
- No large file operations (small files only)

### GitHub Actions Cost

**Per PR Run:**

- Linux runner usage: ~0.25 minutes
- ~0.004 GitHub Actions hours per PR
- Negligible cost even with 1000s of PRs/month

---

## Integration with Other Systems

### With Mergify

If using Mergify for auto-merge:

```yaml
# mergify.yml
pull_request_rules:
  - name: Auto-merge validated PRs
    conditions:
      - check-success=validate-feedback-linkage
      - approved-by=lightspeedwp/team
    actions:
      merge:
        method: squash
```

### With GitHub Branch Protection

```bash
# Via GitHub CLI
gh repo edit lightspeedwp/.github \
  --enable-auto-merge \
  --enable-squash-merge
```

### With CI/CD Pipelines

Add workflow check to PR status requirement:

```bash
# Require workflow to pass
gh rule edit lightspeedwp/.github \
  --require-status-checks validate-feedback-linkage \
  --branch develop
```

---

## Maintenance

### Regular Updates

**Monthly Review:**

- Check workflow error logs
- Count validation failures (should be < 5%)
- Review feedback documentation quality
- Update examples if needed

**Quarterly Review:**

- Analyze most common feedback items
- Identify patterns (addressed vs deferred)
- Refine categories/statuses based on usage
- Update documentation

### Backup Procedures

```bash
# Backup workflow configuration
cp .github/workflows/ai-feedback-validation.yml \
   .github/workflows/.backups/ai-feedback-validation.yml.$(date +%Y%m%d)

# Backup validation script
cp .github/scripts/validation/ai-feedback-helpers.cjs \
   .github/scripts/validation/.backups/ai-feedback-helpers.cjs.$(date +%Y%m%d)
```

### Version History

Track changes in CHANGELOG:

```markdown
## 2026-08-04

### Added
- AI feedback PR validation workflow
- FEEDBACK_RESPONSE.md template
- Validation helper script

### Features
- Automatic issue linking validation
- Feedback status marker checking
- Deferred item tracking
- Helpful validation comments

### Status
- Initial release
- Team rollout begins
```

---

## Scaling Considerations

### If You Have 100+ PRs/Month

- Workflow runtime: ~300-500 runner minutes/month
- Cost: < $5/month (negligible)
- No changes needed
- System scales linearly

### If You Need Stricter Enforcement

Add branch protection rule:

```bash
gh repo edit lightspeedwp/.github \
  --required-status-checks validate-feedback-linkage \
  --require-code-reviews
```

### If You Need Custom Categories

1. Update `.github/scripts/validation/ai-feedback-helpers.cjs`
2. Add category to valid list
3. Update documentation
4. Test with sample PR
5. Deploy

---

## Disaster Recovery

### If Workflow Breaks

**Step 1: Disable workflow**

```bash
# Temporarily disable
gh workflow disable --repo lightspeedwp/.github ai-feedback-validation.yml
```

**Step 2: Fix issue**

```bash
# Edit workflow file
# Or revert to previous version
git revert <COMMIT_HASH>
```

**Step 3: Re-enable**

```bash
# Re-enable workflow
gh workflow enable --repo lightspeedwp/.github ai-feedback-validation.yml
```

### If Script Is Corrupt

```bash
# Revert to known good version
git checkout HEAD~N -- .github/scripts/validation/ai-feedback-helpers.cjs

# Verify
npm run validate:scripts

# Commit
git commit -m "fix: restore ai-feedback-helpers.cjs from HEAD~N"
```

---

## Support & Escalation

**For Issues:**

| Issue | Escalation |
|-------|-----------|
| Workflow syntax error | DevOps → Fix validation script |
| Validation logic incorrect | Engineering Lead → Fix helper functions |
| Documentation unclear | Team Lead → Update docs |
| Performance degradation | DevOps → Analyze logs, optimize |

**Contact:**

- Engineering Lead: [contact info]
- DevOps Team: [contact info]
- Create issue with `workflow` label

---

## Related Documentation

- [Workflow Overview](./WORKFLOW_AI_FEEDBACK_VALIDATION.md)
- [Team Implementation Guide](./AI_FEEDBACK_IMPLEMENTATION_GUIDE.md)
- [User Guide](./ai-feedback-response-tracking.md)
- [Quick Reference](./QUICK_REFERENCE_AI_FEEDBACK.md)

---

*Built for the LightSpeedWP .github control plane — 2026-08-04*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
