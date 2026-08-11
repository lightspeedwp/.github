# PR/Issue → Milestone Allocation — Implementation Guide

Complete guide to implementing automated PR and issue allocation to the current active milestone.

## Files Included

This implementation consists of three key files:

1. **`pr-issue-milestone-allocation-prompt.md`** — Planning & requirements document
2. **`allocate-to-milestone.js`** — Manual Node.js script for allocation
3. **`allocate-pr-issue-to-milestone.yml`** — GitHub Actions workflow (automated)
4. **`ALLOCATE-SCRIPT-README.md`** — Full script documentation

## Quick Overview

**Problem:** When PRs are merged or issues are closed, they should automatically be allocated to the "current active milestone" (defined as the open milestone with the earliest due date).

**Solution:** Two-part implementation:

- ✅ Manual script for on-demand allocation and testing
- ✅ Automated workflow for real-time allocation on PR merge/issue close

## Setup Steps

### Step 1: Add the Script

Place the script in your repository:

```bash
cp allocate-to-milestone.js .github/scripts/allocate-to-milestone.js
chmod +x .github/scripts/allocate-to-milestone.js
```

### Step 2: Test the Script (Dry-Run)

Before enabling automation, test the script with dry-run mode:

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"  # Your personal access token
cd .github/scripts
node allocate-to-milestone.js --dry-run
```

This shows what would happen **without making any changes**.

**Expected output:**

```
🚀 PR/Issue → Milestone Allocation Tool

Repository: lightspeedwp/.github
Look-back period: 7 days
Dry-run: ✅ YES

📋 Fetching open milestones...
✅ Selected milestone: #15 "v1.5.0" (due: 2026-08-31)
...
```

### Step 3: Run the Script (Live)

Once you're confident the script works:

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node .github/scripts/allocate-to-milestone.js
```

### Step 4: Add the Workflow

Place the workflow in your repository:

```bash
cp allocate-pr-issue-to-milestone.yml .github/workflows/allocate-pr-issue-to-milestone.yml
```

### Step 5: Configure and Commit

```bash
git add .github/scripts/allocate-to-milestone.js
git add .github/workflows/allocate-pr-issue-to-milestone.yml
git commit -m "feat: Add PR/issue to milestone allocation automation"
git push -u origin feat/milestone-allocation-automation
```

## Usage Scenarios

### Scenario 1: Manual Allocation (Ad-Hoc)

Use the script when you want to manually allocate items without waiting for workflow automation.

```bash
# Dry-run first
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node .github/scripts/allocate-to-milestone.js --dry-run

# Then run for real
node .github/scripts/allocate-to-milestone.js
```

**When to use:**

- Testing before enabling workflow
- Bulk fixing older PRs/issues
- Recovering from mistaken allocations
- Allocating items from custom date ranges

### Scenario 2: Automatic Allocation (Workflow)

Once the workflow is deployed, allocation happens automatically:

1. **PR is merged** → Workflow runs, PR + linked issues allocated to current milestone
2. **Issue is closed** → Workflow runs, issue allocated to current milestone
3. **Notification comment** → GitHub adds a comment confirming allocation

**When to use:**

- Standard workflow for all merged PRs/closed issues
- Real-time allocation without manual intervention
- Team enforcement of milestone discipline

### Scenario 3: Manual Workflow Trigger

For special cases, manually trigger the workflow via GitHub Actions UI:

1. Go to Actions → "Allocate PR/Issue to Current Milestone"
2. Click "Run workflow"
3. Set options:
   - Dry-run: toggle for preview mode
   - Look back: number of days to search (default: 7)
4. Click "Run workflow"

**When to use:**

- Recovering from workflow failures
- Custom allocation parameters (e.g., look back 30 days)
- Bulk re-allocation campaigns

## How Milestone Selection Works

The script implements the following logic:

### Step 1: Fetch All Open Milestones

```javascript
GET /repos/{owner}/{repo}/milestones?state=open
```

### Step 2: Sort Milestones

1. By **due date** (earliest first)
2. If tied, by **creation date** (latest first)
3. **Past-due milestones are included** (age doesn't matter)

### Step 3: Select First Milestone

The milestone at the top of the sorted list becomes the "current active milestone."

### Example

| Milestone | Due Date | Created | Sort Order |
| --- | --- | --- | --- |
| v1.4.0 | 2026-07-31 | 2026-07-01 | **1st** (earliest due) |
| v1.5.0 | 2026-08-31 | 2026-08-01 | 2nd |
| v1.5.0 | 2026-08-31 | 2026-08-05 | 3rd (older created) |
| Backlog | (no due) | 2026-01-01 | 4th (no due date) |

→ **Selected: v1.4.0** (even if past-due)

## Configuration Options

### Script Options

```bash
node .github/scripts/allocate-to-milestone.js [OPTIONS]
```

| Option | Effect | Example |
| --- | --- | --- |
| `--dry-run` | Preview without changes | `--dry-run` |
| `--days N` | Look back N days | `--days 30` |
| `--milestone N` | Force specific milestone | `--milestone 42` |
| `--verbose` | Detailed logging | `--verbose` |

### Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `GITHUB_TOKEN` | Auth token (required) | (none) |
| `GITHUB_OWNER` | Org/user | `lightspeedwp` |
| `GITHUB_REPO` | Repository | `.github` |

### Workflow Trigger Options

When manually running the workflow, set:

- **dry_run** (`true`/`false`) — Preview mode
- **days** (number) — Lookback period

## Testing Checklist

Before deploying to production, verify:

- [ ] Script runs with `--dry-run` without errors
- [ ] Correct milestone is selected (earliest due date)
- [ ] Merged PRs are detected correctly
- [ ] Closed issues are detected correctly
- [ ] Linked issues (from `Closes #123`) are found
- [ ] Already-allocated items are skipped (idempotent)
- [ ] Summary report is readable and accurate
- [ ] Workflow file syntax is valid (`npm run validate:branch-name` passes)
- [ ] Token has `repo` scope
- [ ] Workflow permissions are set correctly

### Test Commands

```bash
# Validate workflow YAML
npm run lint:js .github/workflows/allocate-pr-issue-to-milestone.yml

# Test script with dry-run
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node .github/scripts/allocate-to-milestone.js --dry-run

# Test with custom parameters
node .github/scripts/allocate-to-milestone.js --days 30 --verbose --dry-run
```

## Error Handling

| Error | Cause | Fix |
| --- | --- | --- |
| "GITHUB_TOKEN not set" | Missing env var | `export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"` |
| "API Error 401: Bad credentials" | Invalid token | Generate new token at <https://github.com/settings/tokens> |
| "API Error 404: Not Found" | Wrong repo/owner | Verify `GITHUB_OWNER` and `GITHUB_REPO` |
| "No open milestones found" | No active milestones | Create a milestone or use `--milestone N` |
| "API Error 403: Forbidden" | Token lacks `repo` scope | Recreate token with `repo` scope |

## Monitoring & Observability

### Workflow Runs

GitHub Actions UI shows:

- ✅ Success: Workflow completed, items allocated
- ❌ Failure: Workflow failed, check logs
- ⏭️ Skipped: Item already had correct milestone

### Script Output

Readable summary at end of execution:

```
============================================================
📊 ALLOCATION SUMMARY
============================================================
Milestones found:     4
Current milestone:    #15 "v1.5.0"
Dry-run mode:         NO

PRs processed:        5
PRs allocated:        3
Issues processed:     2
Issues allocated:     1
============================================================
✅ Allocation completed successfully!
```

### Logs & Diagnostics

For detailed diagnostics:

```bash
node .github/scripts/allocate-to-milestone.js --verbose
```

Verbose mode shows:

- Milestone selection logic
- API request details
- Item-by-item allocation status
- Full error messages

## Troubleshooting

### "Milestone not updating"

**Cause:** Token doesn't have `repo` scope

**Fix:**

1. Go to <https://github.com/settings/tokens>
2. Create new token with `repo` scope
3. Update `GITHUB_TOKEN`

### "Workflow not triggering on PR merge"

**Cause:** Workflow file not committed or syntax error

**Fix:**

1. Verify workflow file exists: `.github/workflows/allocate-pr-issue-to-milestone.yml`
2. Verify YAML syntax: run through YAML linter
3. Check Actions tab for errors

### "Script finds different milestone than I expect"

**Cause:** Sorting logic picked a different milestone

**Explanation:** Script sorts by earliest due date, then latest created. If you want a specific milestone:

**Fix:**

```bash
node .github/scripts/allocate-to-milestone.js --milestone 42
```

Replace `42` with your milestone number (visible in GitHub UI).

### "Script is slow"

**Cause:** Looking back too many days (too many results to process)

**Fix:**

```bash
node .github/scripts/allocate-to-milestone.js --days 7
```

Reduce lookback period (default is 7 days).

## Advanced: Custom Deployment

### Option A: Repository Script (Recommended)

Place script in `.github/scripts/`:

```bash
cp allocate-to-milestone.js .github/scripts/allocate-to-milestone.js
git add .github/scripts/allocate-to-milestone.js
```

### Option B: npm Script

Add to `package.json`:

```json
{
  "scripts": {
    "allocate:milestones": "node .github/scripts/allocate-to-milestone.js",
    "allocate:milestones:dry-run": "node .github/scripts/allocate-to-milestone.js --dry-run"
  }
}
```

Then run:

```bash
npm run allocate:milestones -- --days 30
```

### Option C: GitHub Actions Scheduled

Allocate items daily at 9 AM UTC:

```yaml
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
```

## FAQ

**Q: What if a PR closes multiple issues?**

A: All linked issues and the PR are allocated to the same milestone.

**Q: What if a milestone is past-due?**

A: Past-due milestones are still eligible to be "current active" if they're open.

**Q: What if I don't want a specific milestone to be used?**

A: Mark it as "closed" in GitHub, or remove its due date so it sorts to the end.

**Q: Can I undo an allocation?**

A: Yes. Either:

1. Manually update the PR/issue in GitHub
2. Run script with `--milestone 0` to remove (or use GitHub UI)
3. Run script again pointing to correct milestone

**Q: How often does the workflow run?**

A: On every PR merge and issue close. If you want scheduled runs, add `schedule:` trigger to the workflow.

**Q: Can multiple people run the script simultaneously?**

A: Yes, script is idempotent. Already-allocated items are skipped.

## Files Summary

| File | Purpose | Location |
| --- | --- | --- |
| `allocate-to-milestone.js` | Manual script | `.github/scripts/allocate-to-milestone.js` |
| `allocate-pr-issue-to-milestone.yml` | Workflow | `.github/workflows/allocate-pr-issue-to-milestone.yml` |
| `ALLOCATE-SCRIPT-README.md` | Script docs | Documentation |
| `pr-issue-milestone-allocation-prompt.md` | Design doc | Documentation |

## Next Steps

1. ✅ Review the planning prompt: `pr-issue-milestone-allocation-prompt.md`
2. ✅ Test the script: `node allocate-to-milestone.js --dry-run`
3. ✅ Deploy the workflow: copy to `.github/workflows/`
4. ✅ Monitor first runs and adjust as needed
5. ✅ Document in team runbook/wiki

---

**Ready to deploy?** Start with Step 1 of the Setup section above.
