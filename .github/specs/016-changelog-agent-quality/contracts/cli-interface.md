# CLI Interface Contract: Changelog Agent

**Feature**: 016-changelog-agent-quality

**Version**: 1.0.0

**Date**: 2026-09-19

---

## Overview

The changelog agent exposes its core skills via npm CLI commands. This contract defines the command interface, parameters, return codes, and output format for each skill.

---

## Changelog Validate Skill

**Shipped entrypoint**: `.github/validation/changelog/bin/validate.js`

**Command from the repository root**:

```bash
node .github/validation/changelog/bin/validate.js [options]
```

The root-level `npm run changelog:validate` alias is planned by FR-001 but is not
shipped yet.

**Purpose**: Validate changelog entries against quality standards

### Parameters

| Parameter                | Type    | Required | Default                | Description                                       |
| ------------------------ | ------- | -------- | ---------------------- | ------------------------------------------------- |
| `--changelog-path`, `-p` | string  | No       | `CHANGELOG.md`         | Path resolved from the caller's working directory |
| `--output`, `-o`         | enum    | No       | `text`                 | Output format: `text` or `json`                   |
| `--trigger`, `-t`        | enum    | No       | `manual`               | `manual`, `pr_submission`, or `scheduled_audit`   |
| `--pr-number`            | number  | No       | —                      | Pull request number for a PR-triggered run        |
| `--branch`               | string  | No       | —                      | Branch name included in validation context        |
| `--github-token`         | string  | No       | `GITHUB_TOKEN`         | Token made available to link-validation context   |
| `--verbose`, `-v`        | boolean | No       | `false`                | Write diagnostic progress to stderr               |
| `--metrics`, `-m`        | boolean | No       | `false`                | Save a metrics snapshot                           |
| `--metrics-path`         | string  | No       | implementation default | Metrics snapshot destination                      |

The shipped validator has no `--strict` mode and no configurable entry limit. It
validates every entry parsed from `[Unreleased]`; warning gate results remain
successful.

### Usage Examples

```bash
# Basic validation
node .github/validation/changelog/bin/validate.js --changelog-path ./CHANGELOG.md

# With text output for humans
node .github/validation/changelog/bin/validate.js --changelog-path ./CHANGELOG.md --output text

# JSON output for automation
node .github/validation/changelog/bin/validate.js --output json
```

### Exit Codes

| Code | Meaning | Description                                                                                                |
| ---- | ------- | ---------------------------------------------------------------------------------------------------------- |
| 0    | SUCCESS | Gate result is `pass` or `warning`, no entries are present, or help was requested                          |
| 1    | FAILED  | Missing file, missing `[Unreleased]`, parse failure, failed gate, invalid yargs input, or unexpected error |

### Output Format: JSON

```json
{
  "summary": {
    "total_entries": 12,
    "passed": 10,
    "failed": 2,
    "pass_rate": "83.3"
  },
  "validations": [],
  "trigger": "manual",
  "ci_context": {},
  "timestamp": "2026-09-19T14:32:15.123Z",
  "ci_gate_result": "warning",
  "recommendation": "review_required"
}
```

### Output Format: Text

```
════════════════════════════════════════
    CHANGELOG VALIDATION REPORT
════════════════════════════════════════

Total Entries: 12
Compliant:    10 (83.3%)
Non-Compliant: 2

Gate Result: ⚠ WARNING
Recommendation: review_required

Issues Found:
─────────────────────────────────────
CHK_MAX_LENGTH [ERROR]: 1 violation(s)
  → Entry exceeds 250 character limit. Current: 262 chars
CHK_HAS_PR_LINK [ERROR]: 1 violation(s)
  → Entry must reference a PR or issue number (e.g., #1234 or issues/#5678)

════════════════════════════════════════
```

---

## Changelog Check-Links Skill

**Command**: `npm run changelog:check-links`

**Purpose**: Verify PR/issue links in changelog are valid and merged

### Parameters

| Parameter          | Type    | Required | Default               | Description                                  |
| ------------------ | ------- | -------- | --------------------- | -------------------------------------------- |
| `--changelog-path` | string  | Yes      | —                     | Path to CHANGELOG.md file                    |
| `--github-token`   | string  | No       | env.GITHUB_TOKEN      | GitHub API token for verification            |
| `--repo`           | string  | No       | env.GITHUB_REPOSITORY | GitHub repo (owner/name)                     |
| `--strict`         | boolean | No       | false                 | Fail if any link is unmerged (draft/open PR) |

### Usage Examples

```bash
# Basic link checking (uses GitHub token from env)
npm run changelog:check-links -- --changelog-path ./CHANGELOG.md

# With an explicit token: set it as an environment variable, never as a CLI
# argument (command-line args are visible in shell history and `ps`/process
# lists on shared machines and CI runners)
GITHUB_TOKEN=ghp_xxxx npm run changelog:check-links -- --changelog-path ./CHANGELOG.md

# Strict mode (only merged PRs count)
npm run changelog:check-links -- --changelog-path ./CHANGELOG.md --strict
```

### Exit Codes

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| 0    | All links valid and merged                |
| 1    | One or more links invalid or unmerged     |
| 2    | File not found                            |
| 3    | GitHub API error (auth, rate limit, etc.) |
| 4    | Invalid arguments                         |
| 5    | Timeout                                   |

### Output Format: JSON

```json
{
  "valid": true,
  "changelog_path": "./CHANGELOG.md",
  "github_repo": "lightspeedwp/.github",
  "links_checked": 25,
  "links_valid": 24,
  "links_invalid": 0,
  "links_unmerged": 1,
  "validation_time_ms": 1543,
  "skill_version": "1.0.0",
  "errors": [
    {
      "line_number": 42,
      "link": "#2845",
      "error": "PR is open (not merged)",
      "suggestion": "Wait for PR to be merged or update changelog entry"
    }
  ],
  "details": [
    {
      "line_number": 10,
      "link": "#2840",
      "status": "valid",
      "pr_number": 2840,
      "pr_title": "Fix race condition in changelog merges",
      "pr_state": "merged",
      "merged_at": "2026-09-18T10:30:00Z"
    }
  ]
}
```

---

## Changelog Merge Skill

**Command**: `npm run changelog:merge`

**Purpose**: Consolidate changelog entries into a release section

### Parameters

| Parameter          | Type    | Required | Default | Description                         |
| ------------------ | ------- | -------- | ------- | ----------------------------------- |
| `--changelog-path` | string  | Yes      | —       | Path to CHANGELOG.md                |
| `--version`        | string  | Yes      | —       | Version to release (e.g., 1.0.0)    |
| `--release-date`   | date    | No       | today   | Release date (ISO 8601: YYYY-MM-DD) |
| `--dry-run`        | boolean | No       | false   | Show changes without writing        |

### Usage Examples

```bash
# Merge for release 1.0.0
npm run changelog:merge -- --changelog-path ./CHANGELOG.md --version 1.0.0

# With custom date
npm run changelog:merge -- --changelog-path ./CHANGELOG.md --version 1.0.0 --release-date 2026-09-20

# Dry run (preview changes)
npm run changelog:merge -- --changelog-path ./CHANGELOG.md --version 1.0.0 --dry-run
```

### Exit Codes

| Code | Meaning                                       |
| ---- | --------------------------------------------- |
| 0    | Merge successful                              |
| 1    | No unreleased entries to merge                |
| 2    | File not found                                |
| 3    | Invalid version format                        |
| 4    | Invalid arguments                             |
| 5    | File lock timeout (another merge in progress) |

### Output Format: JSON

```json
{
  "success": true,
  "changelog_path": "./CHANGELOG.md",
  "version": "1.0.0",
  "release_date": "2026-09-20",
  "entries_merged": 12,
  "timestamp": "2026-09-19T14:35:20Z",
  "skill_version": "1.0.0",
  "backup_file": ".changelog-backup-20260919-143520.md",
  "stats": {
    "added_count": 5,
    "changed_count": 3,
    "fixed_count": 3,
    "deprecated_count": 0,
    "removed_count": 1,
    "security_count": 0
  }
}
```

---

## Changelog Format Skill

**Command**: `npm run changelog:format`

**Purpose**: Auto-format changelog entries to conform to Keep a Changelog standard

### Parameters

| Parameter          | Type    | Required | Default | Description                  |
| ------------------ | ------- | -------- | ------- | ---------------------------- |
| `--changelog-path` | string  | Yes      | —       | Path to CHANGELOG.md         |
| `--dry-run`        | boolean | No       | false   | Show changes without writing |

### Usage Examples

```bash
# Format changelog
npm run changelog:format -- --changelog-path ./CHANGELOG.md

# Dry run (preview)
npm run changelog:format -- --changelog-path ./CHANGELOG.md --dry-run
```

---

## Common Patterns

### Error Handling

All commands follow this error response pattern:

```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "suggestion": "How to fix this error",
  "timestamp": "2026-09-19T14:32:15Z"
}
```

### Timeout Handling

The shipped validate CLI does not enforce an internal timeout or return a
timeout-specific exit code. The future check-links and merge commands may add
their contract-specific timeouts when implemented.

### Help Output

```bash
$ node .github/validation/changelog/bin/validate.js --help

Options:
  -p, --changelog-path  Path to CHANGELOG.md file       [default: "CHANGELOG.md"]
  -t, --trigger         Validation trigger type
                    [choices: "manual", "pr_submission", "scheduled_audit"]
                                                       [default: "manual"]
  -o, --output          Output format
                                      [choices: "text", "json"] [default: "text"]
  -v, --verbose         Enable verbose output          [boolean] [default: false]
  -m, --metrics         Save metrics snapshot          [boolean] [default: false]
  -h, --help            Show help                                      [boolean]
```

---

## Backward Compatibility

**Version 1.0.0 guarantees**:

- Exit code 0 = successful or warning gate; exit code 1 = failure
- JSON output is selected explicitly with `--output json`
- Parameter order does not matter

**Deprecation policy**:

- New options must not reuse existing short aliases
- Any future incompatible option or output change requires a major version

---

## Performance Characteristics

| Operation              | Typical Time | Max Time | Notes                   |
| ---------------------- | ------------ | -------- | ----------------------- |
| Validate (20 entries)  | <100ms       | 5s       | Lock wait can add delay |
| Check-links (25 links) | <2s          | 30s      | API rate limits apply   |
| Merge (12 entries)     | <200ms       | 5s       | File lock wait time     |
| Format                 | <100ms       | 5s       | Parsing + output time   |
