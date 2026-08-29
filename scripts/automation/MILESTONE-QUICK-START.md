---
title: Milestone Management Scripts - Quick Start
description: Quick reference guide for common milestone management tasks
file_type: documentation
created_date: 2026-08-29
last_updated: "2026-08-29"
authors:
  - Claude (AI)
tags:
  - automation
  - milestone-management
  - quick-reference
status: active
---

# Milestone Management Scripts - Quick Start

## 30-Second Setup

1. **Get your GitHub Token**:
   ```bash
   export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
   ```

2. **(Optional) Get Claude API Key for AI analysis**:
   ```bash
   export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxx"
   ```

---

## Common Tasks

### Task 1: Move all v1.0 issues to v1.1

```bash
# Preview changes first
./reassign-v1-to-v1-1.js --dry-run --verbose

# Execute
./reassign-v1-to-v1-1.js
```

### Task 2: Distribute unallocated issues to v1.1-v1.6

```bash
# Preview with AI analysis
ANTHROPIC_API_KEY=sk-... ./distribute-unallocated-milestones.js --dry-run --verbose

# Execute
./distribute-unallocated-milestones.js
```

### Task 3: Test with small set of issues

```bash
# Only process first 10 issues
./distribute-unallocated-milestones.js --dry-run --limit 10 --verbose
```

---

## What These Scripts Do

### `reassign-v1-to-v1-1.js`
Moves all open issues from milestone **v1.0** → **v1.1**

**Use when**: Completing a milestone and moving work to next phase

### `distribute-unallocated-milestones.js`
Analyzes unallocated issues and spreads them across **v1.1 to v1.6**

**Use when**: Planning next 5 releases and organizing backlog

---

## Key Options

| Option | Effect | Example |
|--------|--------|---------|
| `--dry-run` | Preview only, no changes | `./script.js --dry-run` |
| `--verbose` | Show detailed logging | `./script.js --verbose` |
| `--limit N` | Process only N issues | `./distribute-unallocated-milestones.js --limit 5` |
| `--source X` | Source milestone | `./reassign-v1-to-v1-1.js --source v1.0` |
| `--target X` | Target milestone | `./reassign-v1-to-v1-1.js --target v1.1` |

---

## Success Indicators

✅ All issues moved successfully:
```
✅ 2024-08-29T10:30:50.678Z [script-name] Reassignment complete. | Reassigned: 45 | Skipped: 0 | Errors: 0
```

✅ Check GitHub:
- Visit repo's Milestones page
- Verify issues appear in correct milestone
- Check issue activity log shows recent updates

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "GITHUB_TOKEN required" | `export GITHUB_TOKEN="ghp_..."` |
| "No issues found" | Check milestones exist, use `--verbose` for details |
| "403 Forbidden" | Token may lack 'repo' scope, or rate limited |
| "API error" | Check token validity, wait for rate limit reset |

---

## Next Steps

- Read full documentation: `./MILESTONE-MANAGEMENT-README.md`
- Set up GitHub Actions workflow for automation
- Schedule regular runs to keep milestones organized
- Monitor script output for issues or patterns

---

## Need Help?

1. Run with `--verbose` flag for detailed logging
2. Try `--dry-run` first to see what would happen
3. Check GitHub token permissions: Settings → Developer Settings → Personal access tokens
4. Review full docs in `MILESTONE-MANAGEMENT-README.md`
