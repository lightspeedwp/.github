---
title: Reviewer Agent Runbook
description: Operational guide for deploying, configuring, and troubleshooting the Reviewer Agent
version: "1.0"
last_updated: "2026-05-31"
---

# Reviewer Agent Runbook

## Overview

The Reviewer Agent provides automated code review summaries for pull requests. It analyzes CI status, categorizes changed files by risk level, checks for changelogs, and flags potential issues with blockers and recommendations.

**Key Capabilities:**

- Real-time CI status integration
- File risk categorization (CRITICAL, HIGH, MEDIUM, LOW)
- Changelog detection (multiple formats and locations)
- Blocker detection (CI failures, security issues, large deletions, migrations)
- Comment deduplication (updates instead of duplicating)
- Pagination support (handles PRs with 100+ changed files)
- Structured JSON logging with configurable verbosity

## Deployment

### Prerequisites

- Node.js 16+ with ES6 module support
- GitHub Actions environment (or local with `GITHUB_TOKEN` set)
- Repository configured with `"type": "module"` in `package.json`

### Enable in Workflow

The Reviewer Agent is integrated into GitHub Actions workflows. To enable:

1. **Add to workflow YAML:**

```yaml
- name: Run Reviewer Agent
  uses: actions/github-script@v7
  if: github.event_name == 'pull_request'
  with:
    script: |
      const { run } = await import('./scripts/agents/reviewer.agent.js');
      await run(context, { dryRun: false });
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    LOG_LEVEL: info
```

1. **With changelog requirement:**

```yaml
- name: Run Reviewer Agent
  uses: actions/github-script@v7
  if: github.event_name == 'pull_request'
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      const { run } = await import('./scripts/agents/reviewer.agent.js');
      await run(context, { dryRun: false });
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Local Testing

```bash
# Dry-run mode (safe, logs comment without posting)
DRY_RUN=true node scripts/agents/reviewer.agent.js

# Apply mode (posts to PR)
GITHUB_TOKEN=your_token node scripts/agents/reviewer.agent.js
```

## Configuration

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GITHUB_TOKEN` | Yes (non-dry-run) | — | GitHub API authentication |
| `DRY_RUN` | No | false | Run without posting comments |
| `LOG_LEVEL` | No | info | Logging verbosity (debug/info/warn/error) |
| `require-changelog` | No | false | Require CHANGELOG for code changes |

### Workflow Input (GitHub Actions)

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  require-changelog: 'true'  # Set to 'true' to enforce changelog requirement
```

## File Risk Categorization

Files are automatically categorized and assigned risk levels:

### CRITICAL Risk

- `.github/workflows/*` — Workflow file changes affect all CI/CD
- Files matching: secrets, API keys, passwords

**Review Carefully:** Workflow changes can enable/disable security gates.

### HIGH Risk

- `.github/*` (config, actions, settings)
- `package.json`, `package-lock.json` — Dependency changes
- `composer.json`, `composer.lock` — PHP dependency changes
- `yarn.lock`, `pnpm-lock.yaml` — Lock files
- `SECURITY.md`, `LICENSE` — Security-sensitive documents
- Migration files, schema changes — Database structure changes

**Review Thoroughly:** These impact system behavior or infrastructure.

### MEDIUM Risk

- `src/` or files with extensions: `.js`, `.ts`, `.php`, `.py` — Source code
- `tests/`, `spec/` — Test files

**Standard Review:** Code review applies.

### LOW Risk

- `docs/`, `README.md` — Documentation
- Examples, comments

**Light Review:** Documentation changes are typically safe.

## Blocker Detection

The agent flags issues that may block merging:

### Blocker: CI Checks Not Green

**Triggered when:** CI status is not "success"

**Action:** Wait for CI to pass before merging.

### Blocker: Changelog Missing

**Triggered when:**

- Requirement enabled: `require-changelog: 'true'`
- Code files changed (src/, .js, .ts, .php, .py)
- No changelog file detected

**Changelog Files Detected:**

- `CHANGELOG.md`, `CHANGELOG.txt`
- `HISTORY.md`, `NEWS.md`, `RELEASES.md`
- Case-insensitive, any directory

**Action:** Add an entry to CHANGELOG or disable requirement.

### Blocker: Critical Risk Files Modified

**Triggered when:** Any file categorized as CRITICAL risk changed

**Example:** Modifying `.github/workflows/ci.yml`

**Action:** Extra careful review; consider security implications.

### Blocker: Security-Sensitive Files

**Triggered when:** Security-related files changed

- `SECURITY.md`
- `LICENSE`
- `.github/workflows/*`
- Code containing security patterns

**Action:** Security review recommended.

### Blocker: Large Deletion (>500 lines)

**Triggered when:** Total deletions across all files exceed 500 lines

**Action:** Verify intentional; check for accidental removals.

### Blocker: Database Migration Without Rollback

**Triggered when:**

- Migration file detected (filename matches `migration` or `schema.*change`)
- No rollback plan documented (no file matching `rollback`, `revert`, `downgrade`, or `.down.sql`)

**Action:** Document rollback plan or ensure migration is reversible.

## Comment Management

### Deduplication

The Reviewer Agent marks its comments with `<!-- reviewer-agent-summary -->`. On subsequent runs:

- **First run:** Creates comment with summary
- **Subsequent runs:** Updates existing comment (no duplicates)
- **Manual edits:** Next run overwrites if marker present

### Detecting Reviewer Comments

Look for the marker at the bottom:

```markdown
---
<!-- reviewer-agent-summary -->
```

## Interpreting the Summary

Example output:

```markdown
## 🔍 Reviewer Summary for PR #42
**CI Status:** ✅ `success`
**Files changed:** 12
**Risk Distribution:** 1 critical, 3 high, 5 medium, 3 low

### Recommendations
- Ready to proceed pending human review

---
<!-- reviewer-agent-summary -->
```

### Status Emoji Legend

| Emoji | Meaning | Action |
|-------|---------|--------|
| ✅ | All checks green, no blockers | Safe to merge (subject to approval) |
| ❌ | Blockers detected | Address blockers before merge |
| ⚠️ | CI not green | Wait for CI to pass |

### Risk Distribution

Shows file count by risk level. High/CRITICAL prevalence indicates extra review attention needed.

## Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=debug node scripts/agents/reviewer.agent.js
```

**Log format (JSON):**

```json
{
  "timestamp": "2026-05-31T10:23:45.123Z",
  "level": "info",
  "message": "Review analysis complete",
  "event": "analysis",
  "filesChanged": 12,
  "criticalRisk": 1,
  "highRisk": 3,
  "mediumRisk": 5,
  "lowRisk": 3,
  "blockers": 1
}
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `Missing GITHUB_TOKEN` | No auth | Set `GITHUB_TOKEN` env var |
| `No PR in context` | Wrong event | Ensure workflow runs on `pull_request` event |
| `Could not fetch CI status` | API error | Check token permissions; may be non-critical failure |
| Files truncated (>100) | Large PR | Agent uses pagination; should handle all files |
| Changelog not detected | Wrong filename | Ensure file is named exactly (case-insensitive): CHANGELOG.md, HISTORY.md, etc. |

## Metrics & Observability

The agent logs key metrics for monitoring:

```json
{
  "event": "analysis",
  "filesChanged": 12,
  "criticalRisk": 1,
  "highRisk": 3,
  "blockers": 2,
  "duration": 456
}
```

**Key fields:**

- `filesChanged` — Total files in PR
- `criticalRisk`, `highRisk`, `mediumRisk`, `lowRisk` — File counts by category
- `blockers` — Number of blocking issues detected
- `duration` — Milliseconds to complete

## Examples

### Example 1: Successful PR (Green)

```markdown
## 🔍 Reviewer Summary for PR #42
**CI Status:** ✅ `success`
**Files changed:** 5
**Risk Distribution:** 0 critical, 0 high, 3 medium, 2 low

### Recommendations
- Ready to proceed pending human review
```

### Example 2: PR with Blockers

```markdown
## 🔍 Reviewer Summary for PR #43
**CI Status:** ❌ `failure`
**Files changed:** 8
**Risk Distribution:** 1 critical, 2 high, 4 medium, 1 low

### Recommendations
- CI checks not green
- ⚠️ 1 critical-risk file(s) modified (workflows, secrets)
- CHANGELOG.md missing for code change
```

### Example 3: Large Deletion Warning

```markdown
## 🔍 Reviewer Summary for PR #44
**CI Status:** ⚠️ `pending`
**Files changed:** 20
**Risk Distribution:** 0 critical, 3 high, 15 medium, 2 low

### Recommendations
- ⚠️ Large deletion detected (>500 lines removed)
```

## Troubleshooting FAQ

**Q: Changelog detection not working**
A: Verify filename is exactly one of: CHANGELOG.md, CHANGELOG.txt, HISTORY.md, NEWS.md, RELEASES.md (case-insensitive). File can be in any directory.

**Q: Why is my workflow file flagged as CRITICAL?**
A: Workflow files (`.github/workflows/*.yml`) control all CI/CD. Changes require careful review to avoid breaking tests or security gates.

**Q: How do I disable the changelog requirement?**
A: Either:

1. Don't set `require-changelog: 'true'` in workflow
2. Add a changelog file to the PR
3. Remove code file changes from PR

**Q: Can I customize risk categories?**
A: Yes, modify the `categorizeFile()` function in `scripts/agents/reviewer.agent.js` to adjust regex patterns and risk levels.

**Q: Agent says files truncated but I see all files**
A: Agent automatically paginates through all files (handles 100+). If you see all files, pagination worked correctly.

**Q: How do I silence a specific blocker?**
A: Modify the blocker detection logic in `run()` function. For example, to always skip the changelog blocker, remove or comment out the relevant blocker.push() line.

## Related Documentation

- [Agent Architecture](./AGENT-ARCHITECTURE.md) — Module structure and logging format
- [Planner Agent Runbook](./PLANNER-RUNBOOK.md) — Companion planner agent
- [Improvement Plan](../ai/improvement-plan-planner-reviewer.md) — Development roadmap
