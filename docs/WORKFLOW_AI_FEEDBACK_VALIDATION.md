---
file_type: documentation
title: AI Feedback Validation Workflow
description: Automated GitHub Actions workflow for validating AI feedback tracking in pull requests
version: 1.0.1
created_date: 2026-08-04T00:00:00.000Z
---

# AI Feedback Validation Workflow

Automated validation to ensure AI feedback is reviewed, considered, and tracked in pull requests before merge.

## Overview

This workflow automatically validates that:

✅ **PRs link to issues** — Every PR must reference one or more GitHub issues using `Resolves`, `Closes`, or `Relates to`

✅ **Feedback is documented** — FEEDBACK_RESPONSE.md exists and tracks all AI feedback items

✅ **Feedback has valid status** — Each item marked as ✅ Addressed, 📋 Deferred, or ❌ Rejected

✅ **Commitments are clear** — Addressed items reference commits, deferred items reference issues, rejected items include rationale

## Files Included

### 1. Workflow Definition

- **Path:** `.github/workflows/ai-feedback-validation.yml`
- **Triggers:** PR open, edit, reopen, synchronize, ready_for_review
- **Jobs:**
  - `validate-feedback-linkage` — Checks issue links and feedback response completeness
  - `check-feedback-response-format` — Validates FEEDBACK_RESPONSE.md structure if present

### 2. Validation Helper Script

- **Path:** `scripts/validation/ai-feedback-helpers.cjs`
- **Functions:**
  - `validateAIFeedback()` — Main validation orchestrator
  - `validateFeedbackResponseFile()` — Checks file structure
  - `checkInvalidStatuses()` — Validates status markers
  - `checkDeferredWithoutIssue()` — Ensures deferred items have tracking issues

### 3. Templates & Examples

- **Template:** `.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md`
- **Simple Example:** `.github/examples/FEEDBACK_RESPONSE_example-simple.md`
- **Complex Example:** `.github/examples/FEEDBACK_RESPONSE_example-complex.md`

### 4. Documentation

- **Main Guide:** `docs/ai-feedback-response-tracking.md` — Comprehensive guide with examples
- **This File:** `.github/WORKFLOW_AI_FEEDBACK_VALIDATION.md` — Workflow overview

---

## How It Works

### Validation Process

```
PR Opened/Edited
    ↓
Workflow Triggered (pull_request_target event)
    ↓
validate-feedback-linkage job
    ├─ Check for issue links (Resolves/Closes/Fixes)
    ├─ Load FEEDBACK_RESPONSE.md if exists
    ├─ Validate feedback status markers
    ├─ Check for deferred items without issues
    └─ Comment with results or delete previous comment
    ↓
check-feedback-response-format job (if file exists)
    ├─ Validate file structure
    ├─ Check for required sections
    └─ Log warnings/errors
    ↓
Validation Complete
    └─ Workflow passes ✅ or fails ❌
```

### Validation Rules

#### PASS (✅ Required)

PR links to at least one issue:

```markdown
Resolves #456
Closes #789
```

#### PASS (✅ Recommended)

FEEDBACK_RESPONSE.md exists with:

- Clear feedback tracking table or list
- Status markers (✅, 📋, ❌) for each item
- Commit references for addressed items
- Issue references for deferred items
- Summary of what was addressed

#### WARN (⚠️ Noted but not blocking)

- FEEDBACK_RESPONSE.md is missing (but recommended)
- Deferred items don't reference tracking issues (strongly discouraged)

#### FAIL (❌ Blocks merge)

- No issue links in PR description
- Invalid or malformed FEEDBACK_RESPONSE.md
- Invalid status markers
- Incomplete feedback tracking

---

## Usage Guide

### For PR Authors

1. **Link to Issues**

   ```markdown
   ## Related Issues
   Resolves #456
   ```

2. **Copy Template**

   ```bash
   cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./FEEDBACK_RESPONSE.md
   ```

3. **Document Feedback**
   - Add each feedback item to the table
   - Assign status: ✅, 📋, or ❌
   - Include commit references or issue links

4. **Commit Changes**

   ```bash
   git add FEEDBACK_RESPONSE.md
   git commit -m "docs: document AI feedback responses for PR #456"
   ```

5. **Check Workflow**
   - Workflow runs automatically
   - Review comments from validation bot
   - Fix any issues and push again

### For Reviewers

1. **Check Validation Status**
   - Green ✅ = Feedback properly documented
   - Red ❌ = Issues need to be fixed

2. **Review Feedback Decisions**
   - ✅ Addressed items — verify commits make sense
   - 📋 Deferred items — confirm issue #123 created
   - ❌ Rejected items — assess rationale

3. **Approve When Ready**
   - All feedback tracked
   - Decisions well-reasoned
   - Commits reference feedback

---

## Examples

### Example 1: Simple Feedback Response

All feedback addressed:

```markdown
| Extract magic number | code-quality | ✅ Addressed | abc123d | CONFIG_TIMEOUT constant |
| Add error handling | robustness | ✅ Addressed | def456e | Guard clause added |
```

See: `.github/examples/FEEDBACK_RESPONSE_example-simple.md`

### Example 2: Complex Feedback Response

Mixed statuses:

```markdown
| Refactor function | code-quality | ✅ Addressed | abc123d | Split into two functions |
| Add caching | performance | 📋 Deferred | #567 | Performance initiative |
| Use TypeScript | tooling | ❌ Rejected | — | Not migrated to TypeScript |
```

See: `.github/examples/FEEDBACK_RESPONSE_example-complex.md`

---

## Workflow Output

### On Success ✅

No comment posted (clean validation)

Workflow status: **PASSED**

### On Failure ❌

Comment posted with validation report:

```
<!-- ai-feedback-validation -->

## AI Feedback Validation Report

❌ **No issue link found** — PR must include `Resolves #XYZ` or `Closes #XYZ`

⚠️ **No FEEDBACK_RESPONSE.md** — AI feedback tracking document is recommended

### Required Actions:
1. Link this PR to related issues using `Resolves #123` in the PR description
2. Create a `FEEDBACK_RESPONSE.md` file tracking all AI feedback
3. Ensure each feedback item has a status: ✅ Addressed, 📋 Deferred, or ❌ Rejected
4. For deferred feedback, create a separate GitHub issue and link it
```

---

## Configuration

### Trigger Events

The workflow runs on:

- `pull_request_target` with type `[opened, edited, reopened, synchronize, ready_for_review]`

### Permissions

```yaml
permissions:
  contents: read
  issues: read
  pull-requests: write
  checks: write
```

### Concurrency

```yaml
concurrency:
  group: ai-feedback-${{ github.pull_request.number }}
  cancel-in-progress: true
```

One workflow per PR at a time; new triggers cancel previous runs.

---

## Customization

### Modify Validation Rules

Edit `scripts/validation/ai-feedback-helpers.cjs`:

```javascript
// Example: Add new feedback category validation
function checkFeedbackCategories(content) {
  const validCategories = ['code-quality', 'performance', 'documentation', 'custom'];
  // ...
}
```

### Customize Messages

Edit `.github/workflows/ai-feedback-validation.yml`:

```yaml
- name: Check PR-Issue linkage and feedback response
  with:
    script: |
      // Edit buildValidationMessage() function
      const message = buildValidationMessage(marker, validation);
```

### Adjust FEEDBACK_RESPONSE.md Template

Edit `.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md`:

```markdown
# Your Custom Template
...
```

---

## Troubleshooting

### Workflow Not Running

**Issue:** Workflow doesn't run when I open a PR

**Solutions:**

1. Check `.github/workflows/ai-feedback-validation.yml` exists
2. Verify branch is not in `paths-ignore` list
3. Check PR is against a branch (not draft)
4. Ensure `pull_request_target` trigger is enabled

### Validation Comment Not Appearing

**Issue:** No validation comment on my PR

**Possible Cause:** Validation passed (no issues)

**Verify:** Check workflow run logs (Actions tab)

### FEEDBACK_RESPONSE.md Not Recognized

**Issue:** File exists but workflow doesn't validate it

**Solutions:**

1. Ensure file is in repo root: `./FEEDBACK_RESPONSE.md`
2. Check file is committed (not just staged)
3. Verify filename exactly matches (case-sensitive)

### False Positives

**Issue:** Workflow failing on valid feedback

**Report:** File an issue with:

1. PR number
2. Workflow run ID
3. FEEDBACK_RESPONSE.md content
4. Expected vs. actual validation result

---

## Related Resources

- **Guide:** [AI Feedback Response Tracking](./docs/ai-feedback-response-tracking.md)
- **Template:** [FEEDBACK_RESPONSE.md](./PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md)
- **Script:** [ai-feedback-helpers.cjs](./scripts/validation/ai-feedback-helpers.cjs)
- **Workflow:** [ai-feedback-validation.yml](./workflows/ai-feedback-validation.yml)

---

## FAQ

**Q: Is FEEDBACK_RESPONSE.md mandatory?**

A: No — issue linking is mandatory, but FEEDBACK_RESPONSE.md is recommended. Simple PRs with 1-2 feedback items can get by with just issue links.

**Q: Can I skip validation if no AI feedback was given?**

A: The workflow still requires issue linking even if no AI feedback is present. PRs should always reference related issues.

**Q: What if I receive feedback after opening the PR?**

A: Update FEEDBACK_RESPONSE.md and push. Workflow re-runs automatically.

**Q: Can deferred items reference multiple issues?**

A: You can create one comprehensive issue (#567) and reference it from multiple feedback items.

---

## Support

For questions or issues:

1. Check the **[AI Feedback Response Tracking Guide](./docs/ai-feedback-response-tracking.md)**
2. Review **Examples** in `.github/examples/`
3. Open an issue with `workflow` label
4. Tag `@team/engineering` for assistance

---

*Built for the LightSpeedWP .github control plane — 2026-08-04*

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
