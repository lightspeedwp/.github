---
file_type: agent
title: Changelog Agent Specification
description: Enterprise-grade changelog management with Keep a Changelog 1.1.0 validation and automation
version: "1.0.0"
status: active
created_date: "2026-08-25"
last_updated: "2026-08-25"
owners:
  - Ash Shaw
tags:
  - agent
  - changelog
  - keep-a-changelog
  - validation
  - automation
  - release-management
---

# Changelog Agent Specification

Enterprise-grade agent for managing changelogs using Keep a Changelog 1.1.0 standard. Provides validation, formatting, and release automation with a two-gate architecture for safety and consistency.

## Overview

The Changelog Agent provides:

1. **Two-gate validation system** — Entry validation (on PR via Gate 1) and structure validation (at release via Gate 2)
2. **Automatic formatting** — Enforce em-dashes, character limits, capitalization, and formatting rules
3. **Keep a Changelog parsing** — Read, modify, and write Keep a Changelog 1.1.0 format
4. **Entry management** — Add, validate, and format changelog entries
5. **Release processing** — Convert [Unreleased] to release versions with semantic versioning and ISO 8601 dates
6. **PR link validation** — Ensure all PR references are resolvable and properly formatted
7. **Semantic versioning** — Validate version bumps match SEMVER 2.0.0

## Architecture

```
agents/changelog/
├── changelog.agent.js          # Main orchestrator (ESM)
├── package.json                # Dependencies
├── README.md                   # Implementation guide
└── includes/
    ├── changelogValidator.cjs  # Two-gate validation system
    ├── changelogFormatter.cjs  # Auto-formatting engine
    ├── keepAChangelogParser.cjs # Keep a Changelog parser
    └── tests/
        ├── changelogValidator.test.cjs
        └── integration.test.cjs
```

## Specification

### Functions

#### `validateEntry(entry, options)`

Validates a single changelog entry against Keep a Changelog 1.1.0 rules.

**Parameters:**

- `entry` (Object) — Entry to validate
  - `title` (String) — Feature/fix title (required)
  - `description` (String) — Detailed description (required)
  - `prLink` (String) — GitHub PR link in format `#123` (required)
  - `category` (String) — One of: Added, Fixed, Changed, Deprecated, Removed, Security (required)

- `options` (Object, optional)
  - `autoFormat` (Boolean) — Auto-fix formatting issues (default: false)
  - `strict` (Boolean) — Fail on minor issues (default: false)

**Returns:**

```javascript
{
  valid: Boolean,
  errors: Array<String>,
  warnings: Array<String>,
  formatted: Object | null,  // Only if autoFormat: true
  entry: Object,            // Original or formatted entry
}
```

**Validation Rules:**

- Title must be 5–100 characters
- Title must start with capital letter
- Description must be 20–500 characters
- PR link must match pattern `#\d+`
- No trailing punctuation on title or description (unless em-dash)
- Category must be one of Keep a Changelog standard categories

#### `validateChangelog(filePath)`

Validates entire changelog file structure and content.

**Parameters:**

- `filePath` (String) — Path to CHANGELOG.md file

**Returns:**

```javascript
{
  valid: Boolean,
  errors: Array<String>,
  warnings: Array<String>,
  structure: {
    hasUnreleased: Boolean,
    versionCount: Number,
    versions: Array<Object>,
  },
}
```

**Validation Rules:**

- File must exist and be readable
- Must have exactly ONE `[Unreleased]` section at top
- Must have valid version sections with dates in YYYY-MM-DD format
- All entries must follow Keep a Changelog format
- All PR links must be valid and resolvable
- Version numbers must follow SEMVER 2.0.0

#### `formatEntry(entry)`

Auto-formats a changelog entry.

**Parameters:**

- `entry` (Object) — Entry to format

**Returns:**

```javascript
{
  entry: Object,      // Formatted entry
  changes: Array<String>, // List of formatting changes applied
}
```

**Formatting Rules:**

- Capitalize first letter of title
- Replace dashes with em-dashes in descriptions
- Trim trailing whitespace
- Normalize spacing
- Ensure proper punctuation

#### `addEntry(filePath, entry, section)`

Adds a new entry to the changelog.

**Parameters:**

- `filePath` (String) — Path to CHANGELOG.md
- `entry` (Object) — Entry to add (validated via validateEntry)
- `section` (String) — Section name (default: "Added")

**Returns:**

```javascript
{
  success: Boolean,
  message: String,
  updatedFile: String,  // Content of updated file
}
```

#### `processChangelog(filePath, version, releaseDate)`

Processes changelog for release (converts [Unreleased] to version).

**Parameters:**

- `filePath` (String) — Path to CHANGELOG.md
- `version` (String) — Semantic version (e.g., "1.0.0")
- `releaseDate` (String) — ISO 8601 date (default: today)

**Returns:**

```javascript
{
  success: Boolean,
  message: String,
  releaseNotes: String,    // Formatted release notes
  updatedFile: String,     // Content of updated file
}
```

## Integration

### Release Agent Integration

The Release Agent uses this specification to:

1. **Gate 1 (Pre-Release)** — Validate changelog structure via `validateChangelog()`
2. **Gate 2 (Release Processing)** — Process changelog via `processChangelog()`
3. **Release Notes** — Generate release notes from [Unreleased] section
4. **Version Validation** — Ensure version matches SEMVER

See `.github/agentic-workflows/release.agent.js` for integration.

### Workflow Integration

GitHub Actions workflow `.github/workflows/changelog-management.yml` uses this agent to:

- Validate changelog entries on PR
- Auto-format entries if requested
- Generate release notes at release time
- Verify changelog compliance before merge

### Schema Validation

All entries validated against `schemas/changelog.schema.json` which defines:

- Valid categories (Added, Fixed, Changed, Deprecated, Removed, Security)
- Entry structure and required fields
- Format rules and character limits
- PR link format validation

## Related Files & Integration

### Portable Agent Implementation

- **Main Agent:** [`agents/changelog/changelog.agent.js`](../../../agents/changelog/changelog.agent.js) — ESM implementation
- **Agent README:** [`agents/changelog/README.md`](../../../agents/changelog/README.md) — Implementation guide with examples
- **Validator Module:** `agents/changelog/includes/changelogValidator.cjs` — Two-gate validation system
- **Formatter Module:** `agents/changelog/includes/changelogFormatter.cjs` — Auto-formatting engine
- **Parser Module:** `agents/changelog/includes/keepAChangelogParser.cjs` — Keep a Changelog format parser

### Supporting Files

- **Schema:** [`schemas/changelog.schema.json`](../../../schemas/changelog.schema.json) — JSON Schema for validation
- **Workflow:** [`.github/workflows/changelog-management.yml`](./../workflows/changelog-management.yml) — GitHub Actions workflow
- **Documentation:** [`docs/CHANGELOG_AUTOMATION.md`](../../../docs/CHANGELOG_AUTOMATION.md) — Complete automation guide
- **Release Agent:** [`.github/agentic-workflows/release.agent.js`](./../agentic-workflows/release.agent.js) — Release automation
- **CHANGELOG:** [`CHANGELOG.md`](../../../CHANGELOG.md) — Production changelog file

## Validation Gates

### Gate 1: Entry Validation (PR Validation)

Runs on every PR that modifies CHANGELOG.md:

- Validates each new entry using `validateEntry()`
- Auto-formats if enabled
- Fails PR if validation errors exist
- Provides actionable feedback

**Trigger:** PR open/update with CHANGELOG.md changes

### Gate 2: Changelog Validation (Release Validation)

Runs at release time to validate full changelog:

- Validates entire changelog using `validateChangelog()`
- Checks for [Unreleased] section
- Verifies all versions have dates
- Confirms all entries are properly formatted

**Trigger:** Release workflow execution

## Release Process Integration

1. **Pre-Release** — Release Agent calls `validateChangelog()` (Gate 1)
2. **Version Conversion** — Process [Unreleased] → [X.Y.Z]
3. **Date Stamping** — Add ISO 8601 release date
4. **Release Notes Generation** — Extract release notes from converted section
5. **Post-Release** — Recreate empty [Unreleased] section for next cycle

## Keep a Changelog 1.1.0 Compliance

This agent fully implements Keep a Changelog 1.1.0 specification:

- **Format:** Markdown-based
- **Sections:** [Unreleased], [X.Y.Z] - YYYY-MM-DD
- **Categories:** Added, Fixed, Changed, Deprecated, Removed, Security
- **Versioning:** Semantic Versioning 2.0.0
- **Entry Format:** Bullets with em-dashes between title and description

**Example:**

```markdown
## [Unreleased]

### Added
- **New dashboard features** — Enhanced admin dashboard with better UX ([#123](https://github.com/lightspeedwp/.github/pull/123))

### Fixed
- **Login bug** — Fixed issue where users couldn't log in with special characters ([#124](https://github.com/lightspeedwp/.github/pull/124))

## [1.0.0] - 2026-08-25

### Added
- Initial release features
```

## Error Handling

All functions return structured results with:

- `valid` or `success` field indicating outcome
- `errors` array with validation errors (blocking)
- `warnings` array with non-blocking issues
- `message` field with human-readable summary

**Error Categories:**

1. **Format Errors** — Invalid entry structure (blocking)
2. **Validation Errors** — Fails validation rules (blocking)
3. **Link Errors** — PR links not resolvable (blocking)
4. **Version Errors** — Invalid semantic version (blocking)
5. **Warnings** — Minor issues that don't block (non-blocking)

## Configuration

No configuration file required. All behavior is rule-based and follows Keep a Changelog 1.1.0 specification.

## Testing

All functions have comprehensive test coverage:

- Unit tests: `agents/changelog/includes/tests/changelogValidator.test.cjs`
- Integration tests: `agents/changelog/includes/tests/integration.test.cjs`
- Test all categories, edge cases, and error conditions

Run tests:

```bash
cd agents/changelog
npm test
```

## Performance

- Entry validation: < 100ms per entry
- Full changelog validation: < 500ms (typical file)
- Processing: Linear time complexity O(n) where n = number of entries

## Changelog Entries

This specification documents the Changelog Agent itself. See:

- `CHANGELOG.md` — Project changelog using Keep a Changelog format
- Release notes — Generated from [Unreleased] section at release time

## Next Steps

1. Review portable agent implementation: `agents/changelog/changelog.agent.js`
2. Review schema: `schemas/changelog.schema.json`
3. Review workflow: `.github/workflows/changelog-management.yml`
4. Review documentation: `docs/CHANGELOG_AUTOMATION.md`
5. Integrate with Release Agent: `.github/agentic-workflows/release.agent.js`

---

**Status:** ✅ Production-ready for v1.0.0 release

**Last Updated:** 2026-08-25

**Version:** 1.0.0
