---
file_type: troubleshooting
title: Milestone Automation Troubleshooting Guide
description: Common failures, diagnostics, and solutions
created_date: 2026-08-30
last_updated: 2026-08-30
---

# Troubleshooting Guide — Milestone Automation

## Quick Diagnosis

**First step:** Check the GitHub Actions workflow run logs.

```bash
# URL pattern
https://github.com/lightspeedwp/.github/actions/runs/{RUN_ID}

# Look for:
1. Workflow status (Success/Failure)
2. Failed job name
3. Step where it failed
4. Error message in logs
```

---

## Common Failures

### ❌ Failure 1: "Workflow Failed — No Open Milestones"

**Error Message:**
```
Error: Could not identify active milestone. No open milestones found.
```

**Root Cause:**
- All milestones are closed
- No milestones exist
- Repository misconfiguration

**Diagnosis:**

```bash
# Check milestones
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones?state=open
```

**Solutions:**

1. **If milestones closed accidentally:**
   ```bash
   # Reopen milestone via GitHub UI
   # Settings > Milestones > Click milestone > Reopen
   ```

2. **If no milestones exist:**
   ```bash
   # Create one via UI
   # Issues > Milestones > New Milestone
   # Title: v1.1
   # Due date: End of sprint
   ```

3. **If repo misconfigured:**
   - Verify GITHUB_REPOSITORY env var
   - Check token permissions (need: issues:write)

**Prevention:**
- Keep at least one milestone open always
- Automate milestone creation in release workflow

---

### ❌ Failure 2: "API Rate Limit Exceeded"

**Error Message:**
```
Error: API rate limit exceeded. Remaining: 0/5000. Resets at: 2026-08-30T16:32:00Z
```

**Root Cause:**
- Too many API calls in short time
- Batch size too large
- Other workflows competing for quota

**Diagnosis:**

```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq .

# Check workflow timing
# Review workflow logs for call count
```

**Solutions:**

1. **Immediate fix — Wait for reset:**
   ```bash
   # Rate limit resets in 1 hour
   # Manually re-run workflow after reset
   ```

2. **Reduce batch size:**
   ```yaml
   # In workflow or script
   BATCH_SIZE: 25  # Reduced from 50
   ```

3. **Implement backoff:**
   ```javascript
   // In scripts
   await sleep(5000);  // 5s between batches
   ```

4. **Check for other workflows:**
   - Review other workflow runs
   - Stagger execution times
   - Use separate GitHub tokens if available

**Prevention:**
- Monitor rate limit during runs (set alert at <500)
- Set batch size conservatively (25-50)
- Schedule heavy workflows at off-peak times
- Document rate limit expectations

---

### ❌ Failure 3: "Permission Denied — Issues Write"

**Error Message:**
```
Error: Resource not accessible by integration. (Status: 403)
```

**Root Cause:**
- GitHub token missing or invalid
- Insufficient permissions
- Workflow permissions not configured

**Diagnosis:**

```bash
# Verify token
echo "$GITHUB_TOKEN" | cut -c1-10

# Check permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Verify workflow permissions
cat .github/workflows/milestone-distribution.yml | grep -A5 "permissions:"
```

**Solutions:**

1. **Regenerate GitHub token:**
   - Settings > Developer settings > Personal access tokens
   - Generate new token with scopes: `repo`, `workflow`
   - Update GitHub Actions secret

2. **Check workflow permissions:**
   ```yaml
   permissions:
     issues: write
     pull-requests: write
     contents: read
   ```

3. **Verify organization access:**
   - Token must have access to lightspeedwp organization
   - Check if org restrictions applied
   - Request organization permission if needed

**Prevention:**
- Document token creation process
- Set token expiration reminder (90 days)
- Test token after creation
- Use organization-scoped tokens

---

### ❌ Failure 4: "Anthropic API Key Missing/Invalid"

**Error Message:**
```
Warning: ANTHROPIC_API_KEY not available. Falling back to local processing.
```

**Root Cause:**
- Environment variable not set
- API key expired
- API key invalid format

**Diagnosis:**

```bash
# Check if key set (in workflow logs, masked as ***)
# Try API key directly
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/models
```

**Solutions:**

1. **If optional feature (normal operation):**
   - This is expected behavior
   - Workflow continues with local processing
   - No action needed

2. **If required for enhancement (Phase 3+):**
   - Generate new API key from Anthropic dashboard
   - Add to GitHub Actions secrets: `ANTHROPIC_API_KEY`
   - Update workflow to use: `env.ANTHROPIC_API_KEY`

**Prevention:**
- Document that Phase 2 doesn't require this key
- Keep key in secure vault (not hardcoded)
- Set key rotation reminders

---

### ❌ Failure 5: "Workflow Timeout — Processing Takes Too Long"

**Error Message:**
```
Error: Workflow timed out after 360 minutes
```

**Root Cause:**
- Too many issues to process (100+)
- API calls very slow
- Retry loops infinite

**Diagnosis:**

```bash
# Check workflow run duration
# Look at job logs for API call timing
# Count issues updated vs. time elapsed
```

**Solutions:**

1. **Increase timeout (short-term):**
   ```yaml
   jobs:
     milestone-distribution:
       timeout-minutes: 600  # 10 hours
   ```

2. **Optimize batch processing:**
   ```javascript
   // Process in parallel instead of sequential
   const results = await Promise.all(
     issues.map(issue => updateIssue(issue))
   );
   ```

3. **Split into multiple jobs:**
   ```yaml
   jobs:
     batch-1:
       # Process issues 1-50
     batch-2:
       # Process issues 51-100
   ```

**Prevention:**
- Monitor duration in workflow logs
- Set up performance dashboard (Phase 3)
- Test with 100+ issues before scaling
- Document expected processing time: ~50ms/issue

---

### ❌ Failure 6: "Linked Issues Not Found"

**Error Message:**
```
Warning: Issue #456 not found. Skipping.
```

**Root Cause:**
- Issue was deleted
- Wrong repository
- Typo in issue number

**Diagnosis:**

```bash
# Check if issue exists
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/issues/456
```

**Solutions:**

1. **If issue legitimately deleted:**
   - This is normal; workflow continues
   - Log warning and skip

2. **If issue in different repo:**
   - Workflow only processes current repo
   - Cross-repo linking not supported (Phase 3+ feature)
   - Document limitation

3. **If typo in PR description:**
   - Fix PR description
   - Re-run workflow

**Prevention:**
- Validate issue references during PR review
- Use PR template with issue linking examples
- Document linking format: `Fixes #123`, `Closes #456`

---

### ❌ Failure 7: "Invalid Milestone Provided"

**Error Message:**
```
Error: Milestone 'v2.5' does not exist in repository
```

**Root Cause:**
- Typo in milestone name
- Milestone was deleted
- Milestone closed

**Diagnosis:**

```bash
# List all milestones
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones?state=all
```

**Solutions:**

1. **Create missing milestone:**
   - Go to Issues > Milestones
   - Create new milestone with exact name
   - Set due date

2. **Use correct milestone name:**
   - Check exact spelling (case-sensitive)
   - Update script/workflow parameter

3. **Reopen closed milestone:**
   - Click milestone in GitHub UI
   - Click "Reopen" button

**Prevention:**
- Document canonical milestone names
- Add milestone validation to scripts
- Use milestone creation workflow (Phase 3)

---

## Diagnostic Workflows

### Workflow 1: Check Milestone Health

```bash
#!/bin/bash
# Save as: scripts/diagnostic/check-milestones.sh

GITHUB_REPO="lightspeedwp/.github"

echo "=== Milestone Status ==="
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/${GITHUB_REPO}/milestones?state=all \
  | jq '.[] | {title, state, due_date, open_issues, closed_issues}'

echo ""
echo "=== Rate Limit Status ==="
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit \
  | jq '.resources.core'
```

### Workflow 2: Find Unallocated Issues

```bash
#!/bin/bash
# Save as: scripts/diagnostic/find-unallocated.sh

curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=none&state=open&per_page=100" \
  | jq '.[] | {number, title, created_at}'
```

### Workflow 3: Validate Workflow Configuration

```bash
#!/bin/bash
# Save as: scripts/diagnostic/validate-workflow.sh

echo "=== Checking Workflow File ==="
if [ -f ".github/workflows/milestone-distribution.yml" ]; then
  echo "✅ Workflow file exists"
  
  # Check for required permissions
  if grep -q "issues: write" ".github/workflows/milestone-distribution.yml"; then
    echo "✅ Issues write permission configured"
  else
    echo "❌ Missing issues write permission"
  fi
  
  # Check for required env vars
  echo ""
  echo "=== Environment Variables ==="
  grep -A20 "env:" ".github/workflows/milestone-distribution.yml" || echo "No env section"
else
  echo "❌ Workflow file not found"
fi
```

---

## Resolution Checklist

When troubleshooting a failure:

- [ ] Check workflow run logs (raw logs, not summary)
- [ ] Identify failed step/job name
- [ ] Note exact error message
- [ ] Verify environment variables set
- [ ] Test with diagnostic workflow
- [ ] Check GitHub status page (outages)
- [ ] Review recent changes to scripts
- [ ] Test in dry-run mode first
- [ ] Document issue and solution
- [ ] Update this guide if new pattern found

---

## Escalation Path

| Severity | Response | Owner |
|----------|----------|-------|
| 🔴 Critical (Production broken) | <15 min | On-call Engineer |
| 🟠 High (Feature failing) | <1 hour | Platform Team |
| 🟡 Medium (Degraded performance) | <4 hours | Scheduled Review |
| 🟢 Low (Warning, non-blocking) | Next sprint | Future Enhancement |

---

## Related Documentation

- [OPENSPEC.md](./OPENSPEC.md) — Technical specifications
- [RUNBOOK.md](./RUNBOOK.md) — Operational procedures
- [.github/workflows/milestone-distribution.yml](../../workflows/milestone-distribution.yml) — Workflow source

---

**Document Owner:** lightspeedwp/maintainers  
**Last Updated:** 2026-08-30  
**Next Review:** Weekly (first month), then monthly
