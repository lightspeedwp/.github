---
file_type: agent
name: Reviewer Agent Runbook
description: Operational guide for deploying, configuring, and troubleshooting the Reviewer Agent
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
      const { run } = await import('./.github/scripts/agents/reviewer.agent.js');
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
      const { run } = await import('./.github/scripts/agents/reviewer.agent.js');
      await run(context, { dryRun: false });
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Local Testing

```bash
# Dry-run mode (safe, logs comment without posting)
DRY_RUN=true node .github/scripts/agents/reviewer.agent.js

# Apply mode (posts to PR)
GITHUB_TOKEN=your_token node .github/scripts/agents/reviewer.agent.js
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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
