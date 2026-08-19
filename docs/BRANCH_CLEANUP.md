---
title: "Branch Cleanup Procedures"
description: "Automated and manual procedures for cleaning up stale, merged git branches"
file_type: "documentation"
created_date: "2026-07-24"
last_updated: "2026-07-24"
owners:
  - LightSpeed Team
tags:
  - maintenance
  - git
  - branches
  - automation
status: active
stability: stable
domain: governance
language: en
---

# Branch Cleanup Procedures

This document describes how to identify and safely remove stale, merged branches from the repository. Stale branches accumulate over time and can clutter the repository, making branch listings confusing and potentially affecting repository performance.

## Overview

**Goal:** Keep the git repository clean by removing branches that have been:

- Fully merged into `develop` or `main`
- Inactive for 30+ days
- Not currently used in open pull requests

**Safety:** The cleanup process is designed to be safe with multiple safeguards:

- Protected branches (`main`, `develop`, `production`) are never deleted
- Branches with open PRs are preserved
- Branches matching exclusion patterns (`release/*`, `hotfix/*`) are kept
- Dry-run mode (default) previews deletions without executing them

## Quick Start

### Generate a Report (No Changes)

```bash
# List stale branches (generates report, no deletions)
npm run cleanup:report

# Full report with JSON output
node .github/scripts/cleanup-branches.js --reportFormat=json

# Custom inactivity threshold (45 days)
node .github/scripts/cleanup-branches.js --inactiveDays=45
```

### Execute Cleanup (With Safety Checks)

```bash
# Dry run (default) — preview what would be deleted
node .github/scripts/cleanup-branches.js --dryRun=true

# Actually delete remote branches (interactive)
node .github/scripts/cleanup-branches.js --dryRun=false

# Also delete local tracking branches
node .github/scripts/cleanup-branches.js --dryRun=false --deleteLocal
```

### Post-Cleanup Sync

After executing cleanup, sync your local repo:

```bash
# Remove remote tracking refs for deleted branches
git fetch origin --prune

# Verify cleanup
git branch -vv | grep '\[gone\]'
# (Should show 0 branches)
```

---

## How It Works

### 1. Branch Discovery

The script discovers branches in two categories:

**Remote branches** (`origin/*`)

- Source of truth for cleanup decisions
- Deletable after merge

**Local branches** (your machine)

- Synced from remote tracking refs
- Optional cleanup with `--deleteLocal`

### 2. Classification

Each branch is classified as **KEEP** or **DELETE** based on:

| Condition | Decision | Reason |
|-----------|----------|--------|
| Protected branch (`main`, `develop`, `production`) | KEEP | System requirement |
| Excluded pattern (`release/*`, `hotfix/*`) | KEEP | Configuration |
| Open pull request | KEEP | Active work |
| Not merged to `develop` or `main` | KEEP | Unmerged work |
| Merged & recent (< 30 days) | KEEP | Active in branch history |
| Merged & stale (≥ 30 days) | **DELETE** | Safe to remove |

### 3. Safety Checks

Before deletion, the script verifies:

- ✅ Branch exists on remote
- ✅ Branch is fully merged to base ref
- ✅ No open PRs target the branch
- ✅ Not explicitly excluded
- ✅ Inactivity threshold exceeded

### 4. Reporting

Reports are generated in two formats:

**Markdown** (human-readable)

```markdown
## Stale Branches Report (2026-07-24)

Deleted: 28 branches
- Category 1: 7 branches
- Category 2: 5 branches
...

Storage freed: ~112 MB (estimate)
```

**JSON** (machine-readable)

```json
{
  "timestamp": "2026-07-24T08:00:00Z",
  "summary": {
    "deleted": 28,
    "preserved": 42,
    "errors": 0
  },
  "branches": [...]
}
```

---

## Command Reference

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dryRun=BOOL` | `true` | Preview deletions without executing |
| `--deleteLocal` | `false` | Also delete local tracking branches |
| `--inactiveDays=N` | `30` | Inactivity threshold in days |
| `--excludePatterns=RE` | `release/.*\|hotfix/.*` | Pipe-separated regex patterns to preserve |
| `--preserveAuthors=RE` | (none) | Preserve branches by author (e.g., `dependabot\|renovate`) |
| `--reportFormat=TYPE` | `markdown` | Output format: `markdown` or `json` |
| `--reportDir=PATH` | `.github/reports` | Directory for report output |

### Examples

**Preserve dependabot and renovate branches:**

```bash
node .github/scripts/cleanup-branches.js --preserveAuthors="dependabot|renovate"
```

**Custom exclusion patterns:**

```bash
node .github/scripts/cleanup-branches.js --excludePatterns="release/.*|hotfix/.*|wip/.*"
```

**45-day inactivity threshold:**

```bash
node .github/scripts/cleanup-branches.js --inactiveDays=45
```

**Generate JSON report (no deletions):**

```bash
node .github/scripts/cleanup-branches.js --dryRun=true --reportFormat=json
```

---

## Workflow Integration

### Manual Cleanup (Recommended)

**Frequency:** Monthly (1st of each month)

**Steps:**

1. Generate report: `npm run cleanup:report`
2. Review report in `.githu./.github/reports/stale-branches-{date}.md`
3. Verify no critical branches are marked for deletion
4. Execute cleanup: `node .github/scripts/cleanup-branches.js --dryRun=false`
5. Sync local repo: `git fetch origin --prune`

### Automated Cleanup (Optional)

**Setup scheduled workflow:**

Add to `.github/workflows/branch-cleanup.yml`:

```yaml
name: Scheduled Branch Cleanup
on:
  schedule:
    - cron: '0 0 1 * *' # First day of each month

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run cleanup:report
      - uses: actions/upload-artifact@v4
        with:
          name: cleanup-reports
          path: .githu./.github/reports/stale-branches-*.{md,json}
```

---

## Troubleshooting

### Issue: "Could not fetch open PRs via gh CLI"

**Cause:** GitHub CLI (`gh`) not installed or not authenticated.

**Solution:**

```bash
# Install gh CLI
brew install gh  # macOS
sudo apt install gh  # Ubuntu

# Authenticate
gh auth login

# Retry cleanup
node .github/scripts/cleanup-branches.js --reportFormat=markdown
```

### Issue: Deletion fails for a specific branch

**Cause:** Branch protection rules, insufficient permissions, or concurrent deletion.

**Solution:**

1. Check branch protection in GitHub (Settings > Branches)
2. Verify you have `admin` role on the repository
3. Retry cleanup (race conditions are rare)
4. Manual deletion if script fails:

   ```bash
   git push origin --delete {branch-name}
   ```

### Issue: Local branches not deleted with `--deleteLocal`

**Cause:** Local branch not fully merged or has unpushed commits.

**Solution:**

```bash
# Force delete if absolutely safe
git branch -D {branch-name}

# Or verify it's merged first
git branch --merged develop
```

---

## Branch Type Categories

The cleanup script categorizes branches by type for reporting:

| Type | Pattern | Example | Safe to Delete |
|------|---------|---------|---|
| Feature | `feat/.*` | `feat/new-agent` | ✅ Yes (if merged) |
| Fix | `fix/.*` | `fix/auth-bug` | ✅ Yes (if merged) |
| Chore | `chore/.*` | `chore/deps-upgrade` | ✅ Yes (if merged) |
| Release | `release/.*` | `release/v1.5.0` | ❌ Never |
| Hotfix | `hotfix/.*` | `hotfix/critical-bug` | ❌ Never |
| Dependabot | `dependabot/.*` | `dependabot/npm/react-18` | ✅ Yes (if merged) |
| CI | `ci/.*` | `ci/workflow-fix` | ✅ Yes (if merged) |
| Documentation | `docs/.*` | `docs/api-guide` | ✅ Yes (if merged) |
| Refactor | `refactor/.*` | `refactor/simplify-auth` | ✅ Yes (if merged) |
| Test | `test/.*` | `test/edge-cases` | ✅ Yes (if merged) |
| Other | (no prefix) | `bugfix-123` | ✅ Yes (if merged) |

---

## Related Documentation

- [**BRANCHING_STRATEGY.md**](./BRANCHING_STRATEGY.md) — Branch naming conventions, protection policies
- [**PR_CREATION_PROCESS.md**](./PR_CREATION_PROCESS.md) — Pull request workflow and merge discipline
- [**CONTRIBUTING.md**](../CONTRIBUTING.md) — Contributor guidelines including branch cleanup responsibilities
- [**AUTOMATION.md**](./AUTOMATION.md) — Repository automation and workflow orchestration

---

## FAQ

**Q: Why do we clean up branches?**  
A: Over time, branches accumulate and make repository navigation harder. Cleanup keeps the repo lean and improves clarity.

**Q: How often should we clean up?**  
A: Monthly is recommended (e.g., first Monday of each month).

**Q: Can I recover a deleted branch?**  
A: Yes, if the commit history still exists on your local machine or in GitHub's reflog. However, the reflog may only persist for 30–90 days.

**Q: What if a critical branch gets deleted by mistake?**  
A: Contact GitHub Support with the branch name and deletion timestamp. They may be able to restore it from backups.

**Q: Can I customize the inactivity threshold?**  
A: Yes, use `--inactiveDays=N` to set a custom threshold (default: 30 days).

**Q: What about branches I'm actively using?**  
A: If a branch has an open PR, it's automatically preserved. If not, keep it active by merging promptly after PR approval.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
