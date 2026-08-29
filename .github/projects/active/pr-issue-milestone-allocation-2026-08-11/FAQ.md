---
title: "Milestone Allocation FAQ"
description: "Frequently asked questions about the PR/Issue → Milestone Allocation automation"
version: 1.0.0
created_date: 2026-08-22
last_updated: 2026-08-22
---

# PR/Issue → Milestone Allocation — FAQ

**Last Updated:** 2026-08-22  
**Quick Links:** [Runbook](./RUNBOOK.md) | [OpenSpec](./OPENSPEC.md) | [Quick Reference](./QUICK-REFERENCE.md)

---

## General Questions

### Q: How does this automation work?

**A:** The milestone allocation automation:

1. **Listens** for PR merges and issue closes (via GitHub Actions)
2. **Selects** the "current" active milestone (earliest due date among open milestones)
3. **Allocates** the PR/issue to that milestone
4. **Detects** linked issues in PR body (e.g., "Closes #123")
5. **Allocates** linked issues to the same milestone
6. **Posts** a confirmation comment on the PR/issue

This happens automatically—no action needed from you.

---

### Q: Is this mandatory? Do I have to use it?

**A:** No, it's optional and automatic:

- ✅ If you prefer manual allocation, you can do it yourself anytime
- ✅ The automation is a convenience feature to save time
- ✅ If allocation is wrong, you can change it manually
- ✅ The automation respects manual changes (skips already-allocated items)

---

### Q: What if I don't want an item allocated to a milestone?

**A:** You have several options:

1. **Remove after allocation:** Edit the PR/issue and remove the milestone
2. **Prevent allocation:** Don't merge the PR (stays as draft)
3. **Allocate manually:** Use `--dry-run` to preview, then manually allocate instead
4. **Contact the team:** Ask DevOps to skip allocation for your PR

---

### Q: Can I force allocation to a different milestone?

**A:** Yes, manually:

1. Open the PR/issue in GitHub
2. Click "Milestone" on the right sidebar
3. Select the desired milestone
4. The automation respects your manual choice

Or programmatically:

```bash
# Force allocation to milestone #42
node scripts/automation/allocate-to-milestone.js --milestone 42 --dry-run
```

---

## Milestone Selection

### Q: How does the script choose the "current" milestone?

**A:** The algorithm:

1. **Fetch** all open milestones
2. **Sort by due date:** Earliest due date first
3. **Tiebreaker:** If same due date, pick the most recently created
4. **Select:** The first milestone in sorted list

**Example:**

```
v1.5.0 (due: 2026-09-15)  ← Selected (earliest)
v1.6.0 (due: 2026-09-30)
v1.4.0 (due: none/default)
```

---

### Q: What if I have multiple milestones with the same due date?

**A:** The script picks the one created most recently.

**Example:**

```
v1.5.0 (due: 2026-09-15, created: 2026-07-15)
v1.5-rc (due: 2026-09-15, created: 2026-08-01) ← Selected (newer)
```

---

### Q: What if all milestones have no due date?

**A:** The script picks the most recently created milestone.

This shouldn't happen in practice—always set due dates when creating milestones.

---

### Q: Can I have both a "current" and "next" milestone open?

**A:** Yes, and the script will always pick the "current" one (earliest due date).

**Best practice:**

```
v1.5.0 (due: 2026-09-15)  ← "Current" (being worked on now)
v1.6.0 (due: 2026-10-01)  ← "Next" (planned, not yet current)
v1.4.0 (due: 2026-08-30)  ← Closed when released (then closed)
```

---

### Q: What if I close a milestone? Does allocation break?

**A:** No. The automation only looks at **open** milestones. Closed milestones are ignored.

---

## Linked Issues

### Q: What patterns does the script detect for linked issues?

**A:** The script detects (case-insensitive):

- `Closes #123`
- `Resolves #456`
- `Fixes #789`
- `Close #111`
- `Resolve #222`
- `Fix #333`

**Example PR body:**

```markdown
## Description
Fixes the critical auth bug.

Closes #1885
Resolves #1886
```

**Result:** Both issues #1885 and #1886 allocated to the same milestone as the PR.

---

### Q: Can I link multiple issues in one PR?

**A:** Yes! The script finds all linked issues and allocates them.

**Example:**

```markdown
This PR addresses multiple issues:
- Closes #1885
- Resolves #1886
- Fixes #1887
```

**Result:** PR + all 3 issues allocated.

---

### Q: What if a linked issue was already closed?

**A:** The script still allocates it.

If the issue is already closed **when the PR merges**, it's allocated to the current milestone.

---

### Q: What if a linked issue is deleted?

**A:** The script safely skips it (no error).

You'll see in verbose logs:

```
⏭️  issue #1885 not found (deleted or inaccessible), skipping
```

---

## Dry-Run & Testing

### Q: How do I test before allocating for real?

**A:** Use dry-run mode:

```bash
export GITHUB_TOKEN="your-token"
node scripts/automation/allocate-to-milestone.js --dry-run --verbose
```

This shows **what would change** without making changes.

---

### Q: What's the difference between dry-run and live mode?

**A:**

| Mode | Behavior | Use Case |
|------|----------|----------|
| Dry-run (`--dry-run`) | Shows changes, doesn't apply them | Testing, verification |
| Live (no flag) | Actually allocates items | Production use |

---

### Q: Can I test on a specific repository?

**A:** Yes, set environment variables:

```bash
export GITHUB_OWNER="myorg"
export GITHUB_REPO="myrepo"
export GITHUB_TOKEN="your-token"

node scripts/automation/allocate-to-milestone.js --dry-run
```

Default: `lightspeedwp/.github`

---

## Troubleshooting

### Q: The script says "No open milestones found"

**A:** No open milestones exist in the repository.

**Solution:**

1. Go to [GitHub Milestones](https://github.com/lightspeedwp/.github/milestones)
2. Create a new milestone with a due date
3. Ensure it's marked as "Open" (not "Closed")
4. Re-run the script

---

### Q: The script times out or hangs

**A:** Request timeout (> 30 seconds) or network issue.

**Solutions:**

1. Check your internet connection
2. Try again in a few seconds
3. Use `--days 1` to reduce the search scope
4. If persistent, contact DevOps

---

### Q: The script says "Insufficient permissions"

**A:** Your GITHUB_TOKEN doesn't have the right scopes.

**Solution:**

1. Go to [GitHub Tokens](https://github.com/settings/tokens)
2. Create new token with `repo` scope
3. Set `export GITHUB_TOKEN="your-new-token"`
4. Try again

---

### Q: The script allocated items to the wrong milestone

**A:** The wrong milestone was selected.

**Likely cause:** Milestone due dates not set or set in the past.

**Solution:**

1. Check milestone due dates: [GitHub Milestones](https://github.com/lightspeedwp/.github/milestones)
2. Edit milestones to set correct due dates
3. Verify the "current" milestone is correct
4. Manually fix allocations if needed
5. Re-run script if necessary

---

### Q: My PR wasn't allocated. Why?

**A:** Several possible reasons:

| Reason | How to Check | Fix |
|--------|--------------|-----|
| PR not merged | Is `merged` status true? | Merge the PR |
| No open milestones | Are there open milestones? | Create one |
| Workflow disabled | Is workflow enabled in Actions? | Enable it |
| Recent PR (< 1 min) | Wait a bit | GitHub Actions can take 1-2 min |
| Wrong repo | Is this the right repo? | Check repository name |

---

### Q: Can I allocate items from more than 7 days ago?

**A:** Yes, use `--days` option:

```bash
# Last 30 days
node scripts/automation/allocate-to-milestone.js --days 30 --dry-run

# Last 90 days
node scripts/automation/allocate-to-milestone.js --days 90 --dry-run
```

---

### Q: What if the script allocates to the wrong milestone (historical issue)?

**A:** Manually fix allocations:

1. Go to the PR/issue in GitHub
2. Click "Milestone" → change to correct one
3. Done!

To prevent future issues:

1. Verify milestone due dates are set correctly
2. Run `--dry-run` before live allocations

---

## Workflow & Automation

### Q: When does the workflow run automatically?

**A:** On two events:

1. **PR merge:** When a PR is merged (`pull_request.closed` + `merged=true`)
2. **Issue close:** When an issue is closed (`issues.closed`)

The workflow runs **after** the event, typically within 1-2 minutes.

---

### Q: Can I manually trigger the workflow?

**A:** Yes, via GitHub Actions:

1. Go to [Actions → Allocate PR/Issue to Current Milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
2. Click "Run workflow"
3. Set options:
   - `dry_run`: `true` or `false`
   - `days`: Number of days to look back (default: 7)
4. Click "Run workflow"

---

### Q: What if the workflow fails?

**A:** Check the logs:

1. Go to [Actions](https://github.com/lightspeedwp/.github/actions)
2. Click "Allocate PR/Issue to Current Milestone"
3. Find the failed run
4. Click the run name → see error message
5. Common errors:
   - ❌ Rate limited → Wait and retry
   - ❌ No token → Check GITHUB_TOKEN secret
   - ❌ No milestones → Create a milestone

---

## Performance & Rate Limits

### Q: How long does allocation take?

**A:**

- **Dry-run:** 3-5 seconds
- **Live (small batch):** 5-10 seconds
- **Live (large batch):** 10-30 seconds
- **With rate limiting:** 60+ seconds (auto-retries)

---

### Q: What's the rate limit?

**A:** GitHub API rate limits:

- **Search requests:** ~60 per hour
- **Modification requests:** ~5,000 per hour

The script respects both limits and auto-retries.

---

### Q: What if I hit the rate limit?

**A:** The script auto-retries with exponential backoff.

You'll see:

```
❌ API Error 429: Rate limit exceeded. Retry after 60s
⏳ Rate limited. Retrying in 4s... (attempt 2/3)
```

**To avoid rate limits:**

- Use `--days 1` instead of `--days 30`
- Space manual runs 5-10 minutes apart
- Run during off-peak hours for large batches

---

## Best Practices

### Q: What's the best practice for milestone management?

**A:** Recommended approach:

1. **Create milestones upfront** with clear due dates
2. **Keep only 2-3 open:** Current + next 1-2 planned
3. **Close milestones** when versions are released
4. **Name clearly:** "v1.5.0" not "Current" or "Next"
5. **Set due dates:** Always set a realistic due date
6. **Don't backdate:** Due dates should be in the future

---

### Q: Should I allocate manually or use automation?

**A:** Use the automation. It's faster and consistent.

Manual allocation is good for:

- Edge cases or special circumstances
- Allocating to different milestones than auto-selected
- Fixing mistakes made by automation

---

### Q: Can I use this on multiple repositories?

**A:** Yes! Set environment variables:

```bash
export GITHUB_OWNER="your-org"
export GITHUB_REPO="your-repo"
export GITHUB_TOKEN="token"

node allocate-to-milestone.js --dry-run
```

Each repository needs the script installed in `.github/scripts/`.

---

## Integration & APIs

### Q: Can I integrate this with other tools?

**A:** The script uses standard GitHub API. You can:

- Call the script from CI/CD pipelines
- Trigger via webhooks
- Integrate with automation platforms
- Use the GitHub API directly (script is just a wrapper)

---

### Q: Can I extend the script with custom logic?

**A:** Yes, the script is open source. You can:

- Fork and modify
- Add custom milestone selection logic
- Add filtering or validation
- Submit PRs for improvements

See [OPENSPEC.md](./OPENSPEC.md) for API contracts and design patterns.

---

## Getting Help

### Q: Where do I find more information?

**A:** Check these docs in order:

1. **This FAQ** — Most common questions
2. **[RUNBOOK.md](./RUNBOOK.md)** — Step-by-step operations guide
3. **[OPENSPEC.md](./OPENSPEC.md)** — Technical specification
4. **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** — Command reference

---

### Q: How do I report a bug or request a feature?

**A:** Open a GitHub issue with:

1. **Title:** Clear one-line description
2. **Description:** What you expected vs. what happened
3. **Reproduction steps:** How to reproduce the bug
4. **Environment:** Token scope, repository, milestone setup
5. **Logs:** Copy relevant error messages

---

### Q: Who do I contact with questions?

**A:** Contact the DevOps/Release team:

- **Slack:** `#devops` or `#releases`
- **GitHub:** Open an issue in `.github` repo
- **Email:** See team directory

---

## Appendix

### Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `GITHUB_TOKEN not set` | Missing env var | Set `export GITHUB_TOKEN="..."`  |
| `No open milestones found` | No milestones exist | Create one with a due date |
| `API Error 429` | Rate limited | Wait 60s and retry |
| `API Error 403` | Permission denied | Check token scope is `repo` |
| `API request timeout` | Network issue | Check internet, try again |
| `issue #123 not found` | Deleted/archived | Safe to ignore |

---

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-08-22 | Initial FAQ (Phase 3) |

---

**Questions not answered here?** Check the [Runbook](./RUNBOOK.md) or open an issue.

**Last Updated:** 2026-08-22  
**Maintained By:** DevOps Team
