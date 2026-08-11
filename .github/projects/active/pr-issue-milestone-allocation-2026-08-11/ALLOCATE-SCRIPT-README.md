# PR/Issue → Milestone Allocation Script

Manual script to allocate merged PRs and closed issues to the current active milestone.

## Quick Start

```bash
# Set GitHub token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

# Run in dry-run mode (shows what would change)
node allocate-to-milestone.js --dry-run

# Run for real
node allocate-to-milestone.js
```

## Usage

```bash
node allocate-to-milestone.js [OPTIONS]
```

### Options

| Option | Description | Default |
| --- | --- | --- |
| `--dry-run` | Show changes without applying them | (off) |
| `--days N` | Look back N days for merged PRs/closed issues | 7 |
| `--milestone N` | Force allocation to specific milestone number (skips auto-detection) | (auto-detect) |
| `--verbose` | Enable detailed logging | (off) |

### Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `GITHUB_TOKEN` | GitHub personal access token with `repo` scope | **Yes** |
| `GITHUB_OWNER` | GitHub owner/organization | No (default: `lightspeedwp`) |
| `GITHUB_REPO` | GitHub repository name | No (default: `.github`) |

## Examples

### 1. Dry-run (no changes)

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node allocate-to-milestone.js --dry-run
```

**Output:**

```
🚀 PR/Issue → Milestone Allocation Tool

Repository: lightspeedwp/.github
Look-back period: 7 days
Dry-run: ✅ YES

📋 Fetching open milestones...
✅ Selected milestone: #15 "v1.5.0" (due: 2026-08-31)

🔍 Searching for PRs merged in the last 7 days...
   Found 3 merged PRs

📤 Processing merged PRs...
   [DRY-RUN] Would allocate pull #1753 to milestone #15
   [DRY-RUN] Would allocate pull #1754 to milestone #15
   ⏭️  #1755 already allocated to this milestone, skipping

⏹️  Processing closed issues...
   Found 2 closed issues
   ⏭️  #1748 already allocated to this milestone, skipping
   [DRY-RUN] Would allocate issue #1750 to milestone #15

============================================================
📊 ALLOCATION SUMMARY
============================================================
Milestones found:     4
Current milestone:    #15 "v1.5.0"
Dry-run mode:         YES

PRs processed:        3
PRs allocated:        2
Issues processed:     2
Issues allocated:     1
============================================================
✅ Dry-run completed. No changes were made.
```

### 2. Live run (applies changes)

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node allocate-to-milestone.js
```

**Output:**

```
🚀 PR/Issue → Milestone Allocation Tool

Repository: lightspeedwp/.github
Look-back period: 7 days
Dry-run: ❌ NO (will modify)

📋 Fetching open milestones...
✅ Selected milestone: #15 "v1.5.0" (due: 2026-08-31)

🔍 Searching for PRs merged in the last 7 days...
   Found 3 merged PRs

📤 Processing merged PRs...
   ✅ Allocated pull #1753 to milestone #15
   ✅ Allocated pull #1754 to milestone #15
   ⏭️  #1755 already allocated to this milestone, skipping

⏹️  Processing closed issues...
   Found 2 closed issues
   ⏭️  #1748 already allocated to this milestone, skipping
   ✅ Allocated issue #1750 to milestone #15

============================================================
📊 ALLOCATION SUMMARY
============================================================
Milestones found:     4
Current milestone:    #15 "v1.5.0"
Dry-run mode:         NO

PRs processed:        3
PRs allocated:        2
Issues processed:     2
Issues allocated:     1
============================================================
✅ Allocation completed successfully!
```

### 3. Look back 30 days

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node allocate-to-milestone.js --days 30
```

### 4. Force allocation to specific milestone

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node allocate-to-milestone.js --milestone 42 --dry-run
```

This is useful if auto-detection isn't selecting the milestone you want.

### 5. Verbose mode (detailed logging)

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node allocate-to-milestone.js --verbose
```

## How It Works

### 1. **Find Current Active Milestone**

The script queries all open milestones and selects the one that should receive allocations:

- Sort by **due date** (earliest first)
- If multiple milestones have the same due date, pick the **latest created**
- Past-due milestones are **not excluded** (age doesn't matter)
- If no open milestones exist, the script exits with an error

### 2. **Find Merged PRs**

The script searches for PRs merged in the lookback period (default: last 7 days) and:

- Checks if PR already has the target milestone (skips if already allocated)
- Allocates PR to current active milestone
- Parses PR body for linked issues (`Closes #123`, `Resolves #456`, etc.)
- Allocates each linked issue to the milestone too

### 3. **Find Closed Issues**

The script searches for issues closed in the lookback period and:

- Skips any issues that are PRs (handled in step 2)
- Skips issues already allocated to the target milestone
- Allocates each to the current active milestone

## Features

- ✅ **Dry-run support** — preview all changes before applying
- ✅ **Linked issue detection** — automatically allocates issues closed by PRs
- ✅ **Idempotent** — safe to run multiple times (already-allocated items are skipped)
- ✅ **Error handling** — logs API errors without stopping
- ✅ **Detailed summary** — shows allocation stats at the end
- ✅ **Verbose logging** — optional detailed output for debugging
- ✅ **Flexible milestone selection** — auto-detect or force a specific milestone

## GitHub Token

To create a personal access token:

1. Go to <https://github.com/settings/tokens>
2. Click **Generate new token (classic)**
3. Select scope: `repo` (full control of private repositories)
4. Copy the token and set it as `GITHUB_TOKEN` environment variable

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
```

Or add to `.env` (but don't commit it):

```bash
# .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

Then source it before running:

```bash
source .env
node allocate-to-milestone.js
```

## Troubleshooting

### "API Error 401: Bad credentials"

- ❌ Token is invalid or expired
- ✅ Generate a new token at <https://github.com/settings/tokens>

### "API Error 404: Not Found"

- ❌ Repository name or owner is wrong
- ✅ Check `GITHUB_OWNER` and `GITHUB_REPO` environment variables

### "No open milestones found"

- ❌ No open milestones exist in the repository
- ✅ Create a milestone and rerun, or use `--milestone N` to force a specific one

### "Failed to fetch merged PRs: API Error 403"

- ❌ Token lacks `repo` scope
- ✅ Create a new token with `repo` scope selected

## Integration with GitHub Actions Workflow

To use this script in a workflow, see `allocate-pr-issue-to-milestone.yml` (the companion workflow file).

**Workflow approach:**

```yaml
jobs:
  allocate-pr-to-milestone:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node .github/scripts/allocate-to-milestone.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## FAQ

**Q: What if a PR closes multiple issues?**

A: The script allocates all linked issues to the milestone, along with the PR itself.

**Q: What if a PR/issue already has a milestone?**

A: It's replaced with the current active milestone (script is not additive, it's exclusive).

**Q: What if I want to see what would happen before running for real?**

A: Always use `--dry-run` first. It shows all intended changes without applying them.

**Q: Can I run this multiple times safely?**

A: Yes! Already-allocated items are skipped. The script is idempotent.

**Q: What if there's a past-due milestone?**

A: Past-due status does not disqualify a milestone. If it's open, it can be selected as "current."

**Q: How do I force allocation to a specific milestone?**

A: Use `--milestone N` where N is the milestone number. Check GitHub UI to find the number.

## Related Files

- **Workflow:** `.github/workflows/allocate-pr-issue-to-milestone.yml` — Automated workflow version
- **Planning prompt:** `pr-issue-milestone-allocation-prompt.md` — Requirements & design doc
