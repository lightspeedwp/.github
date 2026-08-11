# PR/Issue → Milestone Allocation — Quick Reference

**TL;DR:** Automatically allocate merged PRs and closed issues to the current active milestone.

## Install

```bash
# 1. Copy script
cp allocate-to-milestone.js .github/scripts/

# 2. Copy workflow
cp allocate-pr-issue-to-milestone.yml .github/workflows/

# 3. Commit
git add .github/scripts/ .github/workflows/
git commit -m "feat: Add PR/issue to milestone allocation"
git push
```

## Test (Dry-Run)

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node .github/scripts/allocate-to-milestone.js --dry-run
```

## Run

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
node .github/scripts/allocate-to-milestone.js
```

## Common Commands

| Command | Effect |
| --- | --- |
| `--dry-run` | Preview without changes |
| `--days 30` | Look back 30 days (default: 7) |
| `--milestone 15` | Force milestone #15 |
| `--verbose` | Show detailed logs |

## How It Works

1. Fetch open milestones
2. Select the one with **earliest due date** (past-due OK)
3. Find merged PRs + closed issues in last 7 days
4. Allocate each to that milestone
5. Report summary

## Example Output

```
✅ Selected milestone: #15 "v1.5.0"
📤 Processing merged PRs... (3 found, 2 allocated)
⏹️  Processing closed issues... (2 found, 1 allocated)
✅ Allocation completed successfully!
```

## Workflow (Automated)

Once deployed, workflow runs automatically on:

- PR merge → Allocate PR + linked issues
- Issue close → Allocate issue

## GitHub Token

```bash
# Generate at: https://github.com/settings/tokens
# Scope needed: repo (full control)

export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
```

## Docs

- **Full guide:** `IMPLEMENTATION-GUIDE.md`
- **Script docs:** `ALLOCATE-SCRIPT-README.md`
- **Requirements:** `pr-issue-milestone-allocation-prompt.md`

---

**Questions?** See `ALLOCATE-SCRIPT-README.md` Troubleshooting section.
