# Data Model: Changelog Agent Quality Framework

**Feature**: 016-changelog-agent-quality

**Date**: 2026-09-19

**Status**: Design Phase

---

## Core Entities

### 1. Changelog Entry

**Purpose**: Represents a single user-facing change documented in CHANGELOG.md

**Fields**:

| Field             | Type          | Required | Description                         | Validation                                                                 |
| ----------------- | ------------- | -------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `id`              | string        | Yes      | Stable content hash or UUID         | Non-empty, immutable; never derived from line position                     |
| `version`         | string        | Yes      | Release version (e.g., "1.0.0")     | Semantic versioning format                                                 |
| `release_date`    | date          | No       | Release date (ISO 8601: YYYY-MM-DD) | Valid date or "Unreleased"                                                 |
| `category`        | enum          | Yes      | Entry type per Keep a Changelog     | One of: Added, Changed, Fixed, Deprecated, Removed, Security               |
| `content`         | string        | Yes      | User-facing change description      | 1-250 characters, no implementation details                                |
| `pr_issues`       | array[string] | Yes      | PR/issue references                 | At least one; format: "#123" or "PR-456"                                   |
| `character_count` | integer       | Yes      | Length of `content` field           | ≤250                                                                       |
| `line_number`     | integer       | Yes      | Current line number in CHANGELOG.md | Positive integer; mutable when entries move or earlier content is inserted |

**Relationships**:

- One-to-many: `ChangelogEntry` → `ValidationError` (one entry can have multiple validation errors)
- Many-to-many: `ChangelogEntry` ↔ `GitHubPullRequest` (via `pr_issues` links)

**Lifecycle/State Transitions**:

```
DRAFT (entry written)
  → VALIDATING (validation in progress)
  → VALID (passed all checks)
  → INVALID (failed one or more checks)
  → MERGED (incorporated into release section)
```

**Example**:

```json
{
  "id": "sha256:8a798890fe93817163b10b5f474ef2ef",
  "version": "1.0.0",
  "release_date": "2026-09-20",
  "category": "Added",
  "content": "Support for changelog validation in local development environments with clear feedback",
  "pr_issues": ["#3372", "PR-3373"],
  "character_count": 98,
  "line_number": 15
}
```

---

### 2. Validation Result

**Purpose**: Outcome of validating one or more changelog entries

**Fields**:

| Field                | Type                 | Required | Description                        | Validation                   |
| -------------------- | -------------------- | -------- | ---------------------------------- | ---------------------------- |
| `id`                 | string               | Yes      | Unique validation run ID (UUID)    | Non-empty, immutable         |
| `timestamp`          | datetime             | Yes      | When validation ran                | ISO 8601 datetime            |
| `changelog_path`     | string               | Yes      | Path to validated CHANGELOG.md     | Relative path from repo root |
| `valid`              | boolean              | Yes      | Overall result (all entries pass?) | Boolean                      |
| `entries_total`      | integer              | Yes      | Total entries in changelog         | Non-negative                 |
| `entries_valid`      | integer              | Yes      | Count of valid entries             | ≤ `entries_total`            |
| `entries_invalid`    | integer              | Yes      | Count of invalid entries           | ≤ `entries_total`            |
| `errors`             | array[ErrorObject]   | Yes      | List of validation errors          | Empty array if `valid=true`  |
| `warnings`           | array[WarningObject] | No       | List of non-blocking warnings      |                              |
| `validation_time_ms` | integer              | Yes      | Execution time in milliseconds     | Non-negative                 |
| `skill_version`      | string               | Yes      | Version of validation skill used   | Semantic version             |

**Relationships**:

- One-to-many: `ValidationResult` → `ErrorObject` (result contains multiple errors)
- Many-to-one: `ValidationResult` → `Skill` (via `skill_version`)

**Example**:

```json
{
  "id": "validation_abc123def456",
  "timestamp": "2026-09-19T14:32:15Z",
  "changelog_path": "CHANGELOG.md",
  "valid": false,
  "entries_total": 12,
  "entries_valid": 10,
  "entries_invalid": 2,
  "errors": [
    {
      "entry_id": "sha256:8a798890fe93817163b10b5f474ef2ef",
      "line_number": 15,
      "error_type": "LENGTH",
      "message": "Entry exceeds 250-character limit"
    }
  ],
  "warnings": [],
  "validation_time_ms": 243,
  "skill_version": "1.0.0"
}
```

---

### 3. Error Object

**Purpose**: Detailed report of a single validation failure

**Fields**:

| Field             | Type    | Required | Description                                   | Validation                                            |
| ----------------- | ------- | -------- | --------------------------------------------- | ----------------------------------------------------- |
| `error_code`      | enum    | Yes      | Machine-readable error type                   | One of: LENGTH, MISSING_LINK, FORMAT, CLARITY, SYNTAX |
| `message`         | string  | Yes      | Human-readable error message                  | Clear, actionable                                     |
| `entry_id`        | string  | Yes      | References which entry failed                 | Must match valid `ChangelogEntry.id`                  |
| `line_number`     | integer | Yes      | Line number in changelog file                 | Positive integer                                      |
| `field`           | string  | No       | Which field failed (content, pr_issues, etc.) | Optional, helps pinpoint issue                        |
| `expected_format` | string  | No       | What format is expected                       | Example: "#123" or "PR-456"                           |
| `actual_value`    | string  | No       | What was actually found                       | May be truncated if very long                         |
| `suggestion`      | string  | Yes      | How to fix the error                          | Clear, actionable guidance                            |
| `severity`        | enum    | Yes      | Error severity                                | One of: ERROR (blocks merge), WARNING (informational) |

**Example**:

```json
{
  "error_code": "LENGTH",
  "message": "Entry exceeds 250-character limit",
  "entry_id": "sha256:8a798890fe93817163b10b5f474ef2ef",
  "line_number": 15,
  "field": "content",
  "expected_format": "≤250 characters",
  "actual_value": "Added support for OAuth2 authentication with provider configuration...",
  "suggestion": "Shorten to focus on user-facing benefit. Remove implementation details.",
  "severity": "ERROR"
}
```

---

### 4. Skill Definition

**Purpose**: Standard Agent Skills definition plus namespaced LightSpeed runtime metadata in `SKILL.md`

**Standard SKILL.md frontmatter fields**:

| Field           | Type               | Required | Description                               | Validation                                                                                  |
| --------------- | ------------------ | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| `name`          | string             | Yes      | Skill identifier and directory name       | 1-64 lowercase alphanumeric/hyphen characters; no leading, trailing, or consecutive hyphens |
| `description`   | string             | Yes      | What the skill does and when to use it    | 1-1024 characters                                                                           |
| `license`       | string             | No       | Licence name or bundled licence reference | Non-empty when present                                                                      |
| `compatibility` | string             | No       | Environment requirements                  | 1-500 characters when present                                                               |
| `metadata`      | map[string,string] | No       | Namespaced implementation metadata        | Keys and values are strings                                                                 |
| `allowed-tools` | string             | No       | Space-separated pre-approved tools        | Experimental Agent Skills field                                                             |

**Required LightSpeed entries within `metadata`**:

| Key                         | Description                   | Validation                                       |
| --------------------------- | ----------------------------- | ------------------------------------------------ |
| `lightspeedwp-version`      | Skill version                 | Semantic version string                          |
| `lightspeedwp-triggers`     | Supported invocation triggers | String-encoded trigger list                      |
| `lightspeedwp-inputs`       | Accepted inputs               | String-encoded input contract                    |
| `lightspeedwp-outputs`      | Produced outputs              | String-encoded output contract                   |
| `lightspeedwp-error-codes`  | Error codes                   | String-encoded error-code list                   |
| `lightspeedwp-dependencies` | Other skills or services      | Optional string-encoded list                     |
| `lightspeedwp-timeout-ms`   | Maximum execution time        | Optional decimal integer string; default `30000` |

**Example**:

```yaml
---
name: changelog-validate
description: Validate changelog entries against quality standards when checking a release or pull request.
license: GPL-3.0-or-later
compatibility: Requires Node.js 18 or later and repository file access.
metadata:
  lightspeedwp-version: '1.0.0'
  lightspeedwp-triggers: 'manual,pull_request.opened'
  lightspeedwp-inputs: 'changelog_path:string:optional,output:text|json:optional'
  lightspeedwp-outputs: 'validation_result:object'
  lightspeedwp-error-codes: 'VALIDATION_FAILED'
  lightspeedwp-timeout-ms: '5000'
---
```

---

### 5. GitHub Pull Request (External Reference)

**Purpose**: Represents a PR linked from changelog entries

**Fields Referenced**:

- `number` — PR number (e.g., 3372)
- `title` — PR title
- `author` — PR author
- `state` — PR state (open, merged, closed)
- `merged_at` — When PR was merged
- `branch` — Branch PR targets (typically `develop`)

**Validation Rules**:

- If changelog entry has `pr_issues: ["#3372"]`, that PR must exist and be merged (state = merged)
- Link validation happens in `changelog-check-links` skill
- Invalid links are reported as MISSING_LINK errors

---

## Data Relationships Diagram

```
ChangelogEntry
  ├─ id, version, category, content, pr_issues
  ├── 1-to-many → ValidationError
  └── many-to-1 → ValidationResult

ValidationResult
  ├─ id, timestamp, valid, entries_total, entries_valid
  ├── 1-to-many → ErrorObject
  └── many-to-1 → Skill (via skill_version)

ErrorObject
  ├─ error_code, message, entry_id, suggestion
  └── many-to-1 → ChangelogEntry (via entry_id)

SkillMetadata
  ├─ id, version, inputs, outputs, error_codes
  └── 1-to-many → ValidationResult (via skill_version)

GitHubPullRequest (external)
  └── linked-from → ChangelogEntry (via pr_issues)
```

---

## Validation Constraints

### Entry-Level Constraints

| Constraint                | Type       | Rule                                                                 | Source           |
| ------------------------- | ---------- | -------------------------------------------------------------------- | ---------------- |
| Content length            | Business   | `len(content) ≤ 250`                                                 | SC-001           |
| PR/issue link             | Business   | `pr_issues.length ≥ 1`                                               | FR-002           |
| Valid PR/issue format     | Business   | Format matches `#\d+` or `PR-\d+`                                    | FR-002           |
| PR must exist             | Business   | Linked PR must be merged or closed (not open)                        | Best practice    |
| No implementation details | Business   | Scan for code snippets, function names, API details                  | Clarity rule     |
| Valid category            | Structural | Must be one of: Added, Changed, Fixed, Deprecated, Removed, Security | Keep a Changelog |

### Skill-Level Constraints

| Constraint          | Type        | Rule                                            | Source                     |
| ------------------- | ----------- | ----------------------------------------------- | -------------------------- |
| Unique skill ID     | Structural  | Each skill has unique `id`                      | Skill registry requirement |
| Semantic versioning | Structural  | Version must match `X.Y.Z` pattern              | Convention                 |
| Required metadata   | Structural  | All fields marked "Yes" in Skill Metadata table | agentskills.io spec        |
| Timeout specified   | Operational | Skills must have timeout_ms (default 30s)       | Reliability requirement    |

---

## State Transitions & Lifecycle

### Changelog Entry Lifecycle

```
DRAFT
  ↓ (developer commits to branch)
PENDING_VALIDATION
  ↓ (workflow triggers validation)
VALIDATING
  ├→ VALID (all checks pass) → READY_FOR_RELEASE
  ├→ INVALID (checks fail) → AWAITING_FIX → VALIDATING (loop back)
  └→ ERROR (validation crash) → REQUIRES_INVESTIGATION
```

### Validation Run Lifecycle

```
QUEUED
  ↓ (picked up by worker)
IN_PROGRESS
  ├→ COMPLETED_VALID (all entries valid)
  ├→ COMPLETED_INVALID (some entries invalid)
  └→ FAILED (validation system error)
```

---

## Data Volume & Scale Assumptions

- **Typical CHANGELOG.md size**: 20-50 entries (versions 1.0-2.5)
- **Max CHANGELOG.md size**: 500 entries (large mature projects)
- **Entry validation time**: <50ms per entry (on modern hardware)
- **Concurrent validations**: Up to 5 simultaneous (via GitHub Actions runners)
- **Lock wait time**: <5 seconds (typical merge finishes in <2s)
- **Data retention**: Validation results archived for 90 days (for metrics/compliance)

---

## Integration Points

### Input Sources

1. CHANGELOG.md file (local filesystem)
2. GitHub PR metadata (via GitHub API)
3. Workflow environment variables (CI context)

### Output Targets

1. JSON validation result (to stdout or file)
2. GitHub PR comment (feedback to developers)
3. GitHub PR labels (status indicators)
4. Workflow log (CI/CD visibility)
5. Metrics dashboard (compliance tracking)

---

## Next Steps

- Generate contracts/ with CLI and REST API schemas
- Generate quickstart.md with validation scenarios
- Proceed to task decomposition (100+ tasks across phases)
