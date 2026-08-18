---
title: "Milestone Allocation Runbook"
description: "Team runbook for operating the PR/Issue → Milestone Allocation automation"
version: 1.0.0
created_date: 2026-08-22
last_updated: 2026-08-22
---

# PR/Issue → Milestone Allocation Runbook

**Purpose:** This runbook provides step-by-step instructions for team members to use and troubleshoot the milestone allocation automation.

**Audience:** DevOps, Release Managers, Maintainers  
**Frequency:** On-demand (script runs automatically on PR merge/issue close)  
**Last Updated:** 2026-08-22

---

## Quick Start

### Automatic Allocation (No Action Needed)

The allocation script runs automatically when:
- ✅ A PR is merged (`pull_request.closed` with `merged=true`)
- ✅ An issue is closed (`issues.closed`)

**What happens:**
1. Script fetches all open milestones
2. Selects the "current" active milestone (earliest due date)
3. Allocates the PR/issue to that milestone
4. Posts a comment confirming allocation
5. Also allocates any linked issues (from "Closes #123" in PR body)

**You'll see:**
- A comment on the PR: `✅ Allocated to milestone #X "vX.Y.Z"`
- The milestone updated in GitHub UI

---

## Manual Operations

### When to Run Manually

Run the script manually if:
- ⚙️ You need to allocate items from more than 7 days ago
- ⚙️ You want to force allocation to a different milestone
- ⚙️ The automatic workflow failed or didn't run
- ⚙️ You want to test before enabling for real

### How to Run: Dry-Run Mode (Recommended First)

**Dry-run shows what would change without making changes:**

```bash
export GITHUB_TOKEN="your-token-here"
node scripts/automation/allocate-to-milestone.js --dry-run --verbose
```

**Output example:**
```
🚀 PR/Issue → Milestone Allocation Tool

Repository: lightspeedwp/.github
Look-back period: 7 days
Dry-run: ✅ YES (will modify)

📋 Fetching open milestones...
✅ Selected milestone: #42 "v1.5.0" (due: 2026-09-15)

🔍 Searching for PRs merged in the last 7 days...
   Found 3 merged PRs
   [DRY-RUN] Would allocate pull #1950 to milestone #42
   [DRY-RUN] Would allocate pull #1951 to milestone #42
   [DRY-RUN] Would allocate pull #1952 to milestone #42

⏹️  Processing closed issues...
   Found 5 closed issues
   [DRY-RUN] Would allocate issue #1885 to milestone #42
   [DRY-RUN] Would allocate issue #1886 to milestone #42

========================================================
📊 ALLOCATION SUMMARY
========================================================
Milestones found:     2
Current milestone:    #42 "v1.5.0"
Dry-run mode:         YES

PRs processed:        3
PRs allocated:        3
Issues processed:     5
Issues allocated:     2
========================================================
✅ Dry-run completed. No changes were made.
```

**Review the output to verify:**
- ✓ Correct milestone selected
- ✓ Correct number of PRs/issues found
- ✓ No unexpected allocations

### How to Run: Live Mode

Once you've verified the dry-run output:

```bash
export GITHUB_TOKEN="your-token-here"
node scripts/automation/allocate-to-milestone.js --verbose
```

**Expected output:** Same as dry-run, but with ✅ confirmations instead of [DRY-RUN]

```
   ✅ Allocated pull #1950 to milestone #42
   ✅ Allocated pull #1951 to milestone #42
   ✅ Allocated pull #1952 to milestone #42
```

### How to Run: Custom Options

#### Look back N days (default: 7)
```bash
node scripts/automation/allocate-to-milestone.js --days 30 --verbose
# Allocates PRs/issues from the last 30 days
```

#### Force a specific milestone (override auto-detection)
```bash
node scripts/automation/allocate-to-milestone.js --milestone 42 --dry-run
# Forces allocation to milestone #42 regardless of due date
```

#### Combine options
```bash
node scripts/automation/allocate-to-milestone.js --days 30 --milestone 42 --dry-run --verbose
```

---

## Understanding the Milestone Selection Algorithm

The script selects the "current" active milestone using this logic:

### Algorithm

1. **Fetch all open milestones** from the repository
2. **Sort by due date:** Earliest due date first
3. **Tiebreaker:** If two milestones have the same due date, select the one created most recently
4. **Select:** Use the first milestone from the sorted list

### Example

If your milestones are:

| Milestone | Due Date | Created At | Status |
|-----------|----------|-----------|--------|
| v1.6.0 | 2026-09-30 | 2026-08-01 | Open |
| v1.5.0 | 2026-09-15 | 2026-07-15 | Open |
| v1.4.0 | (none) | 2026-06-01 | Open |

**Result:** v1.5.0 is selected (earliest due date)

---

## Understanding Linked Issue Allocation

When a PR body contains "Closes #123" or "Resolves #456":

### Patterns Detected

The script detects these patterns (case-insensitive):
- `Closes #123`
- `Resolves #456`
- `Fixes #789`
- `Close #111`
- `Resolve #222`
- `Fix #333`

### Example PR Body

```markdown
## Description
This PR fixes the critical bug in the auth middleware.

## Closes
- Closes #1885 (critical: auth timeout)
- Resolves #1886 (secondary: logging missing)

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
```

**Result:**
- PR #1950 → Allocated to milestone
- Issue #1885 → Allocated to same milestone
- Issue #1886 → Allocated to same milestone

---

## Troubleshooting

### Issue: "No open milestones found"

**Error Message:**
```
❌ No open milestones found. Create at least one milestone in the repository:
   → https://github.com/lightspeedwp/.github/milestones/new
```

**Solution:**
1. Go to [Create Milestone](https://github.com/lightspeedwp/.github/milestones/new)
2. Create a new milestone (e.g., "v1.5.0") with a due date
3. Mark it as "Open" (not "Closed")
4. Re-run the script

---

### Issue: "GITHUB_TOKEN not set"

**Error Message:**
```
❌ GITHUB_TOKEN not set. Generate a token at: https://github.com/settings/tokens
```

**Solution:**
1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Set scopes: `repo` (full control of private repositories)
4. Generate and copy the token
5. Export and re-run:
```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node scripts/automation/allocate-to-milestone.js --dry-run
```

---

### Issue: "API rate limit exceeded"

**Error Message:**
```
❌ API Error 429: Rate limit exceeded. Retry after 60s
⏳ Rate limited. Retrying in 4s... (attempt 2/3)
```

**What's happening:**
- GitHub API rate limit hit (typically 60 requests/hour for search)
- Script auto-retries up to 3 times with exponential backoff
- If still failing after 3 retries, you must wait before trying again

**Solution:**
1. Wait 60 seconds (as shown in error message)
2. Run again:
```bash
node scripts/automation/allocate-to-milestone.js --dry-run
```

**To avoid rate limiting:**
- Use `--days 1` instead of `--days 30` to reduce API calls
- Space out manual runs by waiting 5-10 minutes between attempts

---

### Issue: "Failed to allocate pull #1950"

**Error Message:**
```
❌ Failed to allocate pull #1950: API Error 403: Insufficient permissions
```

**Solution:**
- Check that your GITHUB_TOKEN has `repo` scope
- Verify you have write access to the repository
- Generate a new token with `repo` scope selected

---

### Issue: "Issue #1885 not found (deleted or inaccessible)"

**Message (verbose mode):**
```
⏭️  issue #1885 not found (deleted or inaccessible), skipping
```

**What's happening:**
- The PR references a linked issue that was deleted or archived
- Script safely skips it (expected behavior)
- No action needed

---

## Monitoring & Health Checks

### Check Recent Allocations

View the GitHub Actions workflow runs:
1. Go to [Actions → Allocate PR/Issue to Current Milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
2. Click on recent runs to see logs
3. Check for any failures or errors

### Manual Workflow Trigger

To test the workflow manually:
1. Go to [Actions → Allocate PR/Issue to Current Milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
2. Click "Run workflow"
3. Set options:
   - **Dry-run mode:** `true` (recommended first)
   - **Look back N days:** `7` (or customize)
4. Click "Run workflow"
5. Monitor the run in the Actions tab

---

## Performance Notes

### Typical Run Times

| Scenario | Time | Notes |
|----------|------|-------|
| Dry-run (7 days) | ~3-5 sec | No API changes |
| Live run (7 days) | ~5-10 sec | Allocates PRs/issues |
| Dry-run (30 days) | ~3-5 sec | Search takes longer |
| Rate limited | ~60-120 sec | Includes retry wait |

### API Limits

- **Request Timeout:** 30 seconds per request
- **Retry Limit:** 3 retries with exponential backoff
- **Rate Limit:** GitHub API rate limits (typically 60 search requests/hour)

---

## Best Practices

### ✅ DO

- ✅ Use dry-run mode first before live runs
- ✅ Run in off-peak hours for large batches
- ✅ Monitor the first allocation after enabling
- ✅ Update milestones regularly (remove old, add new)
- ✅ Use descriptive milestone names (e.g., "v1.5.0" not "Next")

### ❌ DON'T

- ❌ Run manual allocations during peak CI activity
- ❌ Create too many open milestones (use only "current" + 1-2 planned)
- ❌ Set milestone due dates in the past
- ❌ Share GITHUB_TOKEN in scripts or documentation
- ❌ Force allocation to closed milestones

---

## Support & Escalation

### For Questions

1. **Script usage:** See [FAQ.md](./FAQ.md)
2. **Technical issues:** Check the logs in GitHub Actions
3. **Milestone strategy:** Discuss with the release manager
4. **Bugs:** Report to the development team with reproduction steps

### Common Issues & Fixes

| Issue | First Check | Second Check | Escalate To |
|-------|-------------|--------------|-------------|
| Script not running | Workflow enabled? | Recent logs? | DevOps |
| Wrong milestone selected | How many open milestones? | Due dates set correctly? | Release Manager |
| PR not allocated | Was it merged? | Is workflow enabled? | DevOps |
| Rate limit errors | Time since last run? | Number of items to process? | DevOps |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-08-22 | Initial runbook (Phase 3) |

---

## Related Documentation

- [FAQ.md](./FAQ.md) — Frequently asked questions
- [OPENSPEC.md](./OPENSPEC.md) — Technical specification
- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) — Setup & integration guide
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) — Command quick reference

---

**Last Updated:** 2026-08-22  
**Maintained By:** DevOps Team  
**Questions?** See [FAQ.md](./FAQ.md) or open an issue
