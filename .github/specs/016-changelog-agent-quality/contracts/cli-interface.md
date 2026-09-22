# CLI Interface Contract: Changelog Agent

**Feature**: 016-changelog-agent-quality

**Version**: 1.0.0

**Date**: 2026-09-19

---

## Overview

The changelog agent exposes its core skills via npm CLI commands. This contract defines the command interface, parameters, return codes, and output format for each skill.

---

## Changelog Validate Skill

**Command**: `npm run changelog:validate`

**Purpose**: Validate changelog entries against quality standards

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `--changelog-path` | string | Yes | — | Path to CHANGELOG.md file (relative or absolute) |
| `--output-format` | enum | No | json | Output format: `json`, `text`, `csv` |
| `--strict` | boolean | No | false | Treat warnings as errors |
| `--max-entries` | integer | No | 500 | Maximum entries to validate (prevents runaway) |

### Usage Examples

```bash
# Basic validation
npm run changelog:validate -- --changelog-path ./CHANGELOG.md

# With text output for humans
npm run changelog:validate -- --changelog-path ./CHANGELOG.md --output-format text

# Strict mode (warnings fail validation)
npm run changelog:validate -- --changelog-path ./CHANGELOG.md --strict

# Custom entry limit
npm run changelog:validate -- --changelog-path ./CHANGELOG.md --max-entries 100
```

### Exit Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 0 | SUCCESS | All entries valid; no errors |
| 1 | VALIDATION_FAILED | One or more entries failed validation |
| 2 | FILE_NOT_FOUND | Changelog file does not exist |
| 3 | PARSE_ERROR | Could not parse changelog file (syntax error) |
| 4 | INVALID_ARGUMENTS | Invalid parameters provided |
| 5 | TIMEOUT | Validation exceeded timeout limit |
| 127 | NOT_FOUND | Script not found (npm script missing) |

### Output Format: JSON (Default)

```json
{
  "valid": false,
  "changelog_path": "./CHANGELOG.md",
  "timestamp": "2026-09-19T14:32:15.123Z",
  "entries_total": 12,
  "entries_valid": 10,
  "entries_invalid": 2,
  "validation_time_ms": 245,
  "skill_version": "1.0.0",
  "errors": [
    {
      "entry_id": "entry_001",
      "line_number": 15,
      "error_code": "LENGTH",
      "message": "Entry exceeds 250-character limit",
      "field": "content",
      "expected_format": "≤250 characters",
      "actual_value": "Added support for OAuth2 authentication with provider...",
      "suggestion": "Shorten to focus on user-facing benefit; remove implementation details",
      "severity": "ERROR"
    }
  ],
  "warnings": []
}
```

### Output Format: Text

```
❌ Changelog Validation FAILED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Line 15: Entry exceeds 250-character limit
  Current: 262 characters
  Expected: ≤250 characters
  Content: Added support for OAuth2 authentication with provider...
  Fix: Shorten to focus on user-facing benefit; remove implementation details

Line 22: Entry missing required PR/issue link
  Expected: Format #123 or PR-456
  Content: Fixed race condition in concurrent changelog merges
  Fix: Add PR link (e.g., '#2845') or create issue if missing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Total entries: 12
  Valid: 10
  Invalid: 2
  Validation time: 245ms

Run 'npm run changelog:validate -- --help' for more info.
```

---

## Changelog Check-Links Skill

**Command**: `npm run changelog:check-links`

**Purpose**: Verify PR/issue links in changelog are valid and merged

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `--changelog-path` | string | Yes | — | Path to CHANGELOG.md file |
| `--github-token` | string | No | env.GITHUB_TOKEN | GitHub API token for verification |
| `--repo` | string | No | env.GITHUB_REPOSITORY | GitHub repo (owner/name) |
| `--strict` | boolean | No | false | Fail if any link is unmerged (draft/open PR) |

### Usage Examples

```bash
# Basic link checking (uses GitHub token from env)
npm run changelog:check-links -- --changelog-path ./CHANGELOG.md

# With explicit token
npm run changelog:check-links -- --changelog-path ./CHANGELOG.md --github-token ghp_xxxx

# Strict mode (only merged PRs count)
npm run changelog:check-links -- --changelog-path ./CHANGELOG.md --strict
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All links valid and merged |
| 1 | One or more links invalid or unmerged |
| 2 | File not found |
| 3 | GitHub API error (auth, rate limit, etc.) |
| 4 | Invalid arguments |
| 5 | Timeout |

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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `--changelog-path` | string | Yes | — | Path to CHANGELOG.md |
| `--version` | string | Yes | — | Version to release (e.g., 1.0.0) |
| `--release-date` | date | No | today | Release date (ISO 8601: YYYY-MM-DD) |
| `--dry-run` | boolean | No | false | Show changes without writing |

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

| Code | Meaning |
|------|---------|
| 0 | Merge successful |
| 1 | No unreleased entries to merge |
| 2 | File not found |
| 3 | Invalid version format |
| 4 | Invalid arguments |
| 5 | File lock timeout (another merge in progress) |

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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `--changelog-path` | string | Yes | — | Path to CHANGELOG.md |
| `--dry-run` | boolean | No | false | Show changes without writing |

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

All commands have default timeout of 5 seconds for validation, 30 seconds for API calls:

- If operation exceeds timeout, exit code 5 is returned
- Output includes `timeout_reached: true` flag

### Help Output

```bash
$ npm run changelog:validate -- --help

Usage: npm run changelog:validate -- [options]

Options:
  --changelog-path PATH       Path to CHANGELOG.md (required)
  --output-format FORMAT      Output format: json, text, csv (default: json)
  --strict                    Treat warnings as errors
  --max-entries NUM           Max entries to validate (default: 500)
  --help                      Show this help message

Examples:
  npm run changelog:validate -- --changelog-path ./CHANGELOG.md
  npm run changelog:validate -- --changelog-path ./CHANGELOG.md --output-format text

Exit codes:
  0  Validation passed
  1  Validation failed
  2  File not found
  3  Parse error
  4  Invalid arguments
  5  Timeout
```

---

## Backward Compatibility

**Version 1.0.0 guarantees**:

- Exit code 0 = success, 1 = validation failed (will not change)
- JSON output structure is stable (new fields added only at end)
- Parameter order does not matter
- Unknown parameters are ignored with warning

**Deprecation policy**:

- Parameters deprecated in v1.x will be removed in v2.0
- At least 2 minor releases before removal (e.g., deprecated in v1.1, removed in v2.0)
- Deprecation warnings printed to stderr

---

## Performance Characteristics

| Operation | Typical Time | Max Time | Notes |
|-----------|--------------|----------|-------|
| Validate (20 entries) | <100ms | 5s | Lock wait can add delay |
| Check-links (25 links) | <2s | 30s | API rate limits apply |
| Merge (12 entries) | <200ms | 5s | File lock wait time |
| Format | <100ms | 5s | Parsing + output time |
