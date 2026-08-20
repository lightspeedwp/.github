---
file_type: readme
title: Changelog Agent
description: Portable changelog management agent with Keep a Changelog 1.1.0 support
version: "1.0.0"
last_updated: "2026-08-20"
owners:
  - Ash Shaw
tags:
  - agent
  - changelog
  - keep-a-changelog
  - validation
  - formatting
  - portable
---

# Changelog Agent

Portable, enterprise-grade agent for managing changelogs using the Keep a Changelog 1.1.0 standard.

## Overview

The Changelog Agent provides:

1. **Two-gate validation system** — Entry validation (on PR) and structure validation (at release)
2. **Automatic formatting** — Enforce em-dashes, character limits, capitalization
3. **Keep a Changelog parsing** — Read, modify, and write Keep a Changelog format
4. **Entry management** — Add, validate, and format changelog entries
5. **Release processing** — Convert [Unreleased] to release versions with dates

Validates against Keep a Changelog 1.1.0 specification for consistency and professionalism.

## Architecture

```
agents/changelog/
├── changelog.agent.js          # Main orchestrator (ESM)
├── package.json
├── README.md
└── includes/
    ├── changelogValidator.cjs  # Two-gate validation
    ├── changelogFormatter.cjs  # Auto-formatting
    ├── keepAChangelogParser.cjs # Parse & manipulate
    └── tests/
        ├── changelogValidator.test.cjs
        └── integration.test.cjs
```

## Usage

### Validate Changelog Entry (Gate 1 — PR Validation)

```javascript
const { validateEntry } = require('./changelog.agent.js');

const entry = {
  title: 'Add new dashboard features',
  description: 'Enhanced admin dashboard with better UX',
  prLink: '#123',
};

const result = await validateEntry(entry);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
} else {
  console.log('Entry is valid');
}
```

### Validate Changelog Structure (Gate 2 — Release Validation)

```javascript
const { validateChangelog } = require('./changelog.agent.js');

const result = await validateChangelog('./CHANGELOG.md');

if (!result.valid) {
  console.error('Changelog issues:', result.errors);
} else {
  console.log('Changelog is ready for release');
}
```

### Auto-Format Entry

```javascript
const result = await validateEntry(entry, { autoFormat: true });

if (result.formatted) {
  console.log('Entry was auto-formatted:', result.formatted);
  console.log('Use entry:', result.entry);
}
```

### Add Entry to Changelog

```javascript
const { addEntry } = require('./changelog.agent.js');

const result = await addEntry('./CHANGELOG.md', {
  category: 'Added',
  text: 'New admin features (#123)',
}, { validate: true, autoFormat: true });

if (result.success) {
  console.log('Entry added to [Unreleased]');
}
```

### Process Changelog for Release

```javascript
const { processChangelog } = require('./changelog.agent.js');

const result = await processChangelog(
  './CHANGELOG.md',
  '1.2.4',         // new version
  '2026-08-09'     // release date
);

if (result.success) {
  console.log(`Released v${result.version} on ${result.date}`);
}
```

## Keep a Changelog Format

The agent expects the standard Keep a Changelog 1.1.0 format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature 1 (#123)
- New feature 2 (#124)

### Changed
- Enhancement to existing feature (#125)

### Fixed
- Bug fix 1 (#126)

## [1.0.0] - 2026-08-09

### Added
- Initial release features

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Validation Rules

### Gate 1: Entry Format (On PR to Develop)

```
✓ Title < 60 characters
✓ Description < 150 characters (optional)
✓ Uses em-dashes (—) not hyphens (-)
✓ Includes PR link (#123)
✓ Proper capitalization (starts with uppercase)
✓ No extra whitespace
✓ No duplicate previous releases
```

### Gate 2: Changelog Structure (At Release)

```
✓ File exists and is readable
✓ Schema matches Keep a Changelog 1.1.0
✓ [Unreleased] section exists
✓ [Unreleased] has entries
✓ Version format: ## [X.Y.Z] - YYYY-MM-DD
✓ All reference links are valid
✓ No empty sections
```

## Formatting Rules

### Em-Dashes

Converts hyphens to em-dashes in content (but never in URLs or PR links):

```
Input:  "Fix bug - critical issue"
Output: "Fix bug — critical issue"
```

### Character Limits

Enforces limits and removes extra whitespace:

```
Title:       max 60 chars (including em-dashes)
Description: max 150 chars (optional)
```

### Capitalization

Enforces first-letter capitalization:

```
Input:  "add new feature"
Output: "Add new feature"
```

## API Reference

### `validateEntry(entry, options)`

Validate a changelog entry.

**Parameters:**

```javascript
entry: {
  title: string,           // Required
  description: string,     // Optional
  prLink: string,          // Required (e.g., "#123")
}

options: {
  autoFormat: boolean,     // Default: false
}
```

**Returns:**

```javascript
{
  valid: boolean,
  errors: string[],
  entry: Object,           // Original or formatted
  formatted: Object,       // null or formatted version
  status: 'success' | 'failed' | 'pending',
  message: string,
}
```

### `validateChangelog(changelogPath, options)`

Validate changelog file structure.

**Parameters:**

```javascript
changelogPath: string,   // Path to CHANGELOG.md

options: {
  parseContent: boolean, // Default: false
}
```

**Returns:**

```javascript
{
  valid: boolean,
  errors: string[],
  warnings: string[],
  parsed: Object,        // null or parsed changelog
  status: 'success' | 'failed' | 'pending',
  message: string,
}
```

### `processChangelog(changelogPath, version, date)`

Convert [Unreleased] to release version.

**Parameters:**

```javascript
changelogPath: string,   // Path to CHANGELOG.md
version: string,         // New version (e.g., "1.2.3")
date: string,            // Release date (e.g., "2026-08-09")
```

**Returns:**

```javascript
{
  success: boolean,
  errors: string[],
  updated: boolean,
  version: string,
  date: string,
  content: string,       // Updated changelog content
  status: 'success' | 'failed' | 'pending',
  message: string,
}
```

### `addEntry(changelogPath, entry, options)`

Add entry to [Unreleased] section.

**Parameters:**

```javascript
changelogPath: string,

entry: {
  category: string,      // Default: "Changed"
  text: string,          // Entry text
},

options: {
  validate: boolean,     // Default: true
  autoFormat: boolean,   // Default: false
}
```

**Returns:**

```javascript
{
  success: boolean,
  errors: string[],
  updated: boolean,
  entry: Object,
  status: 'success' | 'failed' | 'pending',
  message: string,
}
```

## Modules

### `changelogValidator.cjs`

Validates changelog entries and structure.

**Key functions:**

- `validateEntryFormat(entry)` — Validate entry format
- `validateChangelogStructure(filepath)` — Validate file structure
- `validateNoFormattingIssues(entry)` — Check formatting
- `getValidationErrors(entry)` — Collect all errors

### `changelogFormatter.cjs`

Automatically format changelog entries.

**Key functions:**

- `formatEntry(entry)` — Comprehensive formatting
- `enforceEmDash(text)` — Replace hyphens with em-dashes
- `truncateTitle(title)` — Enforce 60-char limit
- `truncateDescription(desc)` — Enforce 150-char limit
- `formatTitle(title)` — Format title (capitalize, em-dash, truncate)

### `keepAChangelogParser.cjs`

Parse and manipulate Keep a Changelog format.

**Key functions:**

- `parseChangelog(path)` — Parse CHANGELOG.md
- `convertUnreleasedToRelease(content, version, date)` — Release conversion
- `getChangelogExcerpt(parsed, version)` — Extract version text
- `appendEntry(content, entry)` — Add entry to [Unreleased]
- `writeChangelog(path, content)` — Write file

## Testing

### Run All Tests

```bash
npm test
```

### Run Unit Tests

```bash
npm run test:unit
```

**Test coverage:**

- 19 validator tests (entry format, structure, formatting)
- Integration tests for parser and formatter
- Real CHANGELOG.md scenario tests

All tests passing: ✓ 19/19

## Requirements

### System

- Node.js 18+

### Dependencies

None (standard library only)

## Examples

### Example 1: Validate PR Entry

```javascript
const { validateEntry } = require('./changelog.agent.js');

const entry = {
  title: 'Fix critical memory leak in dashboard',
  description: 'Resolves issue with unclosed event listeners',
  prLink: '#456',
};

const result = await validateEntry(entry, { autoFormat: true });

if (result.valid) {
  console.log('✓ Ready to add to CHANGELOG');
} else {
  console.log('✗ Fix errors:', result.errors);
}
```

### Example 2: Release Workflow

```javascript
const { validateChangelog, processChangelog } = require('./changelog.agent.js');

// Step 1: Validate before release
const validation = await validateChangelog('./CHANGELOG.md');
if (!validation.valid) {
  console.error('Changelog issues:', validation.errors);
  process.exit(1);
}

// Step 2: Process changelog for release
const release = await processChangelog(
  './CHANGELOG.md',
  '2.0.0',
  '2026-08-09'
);

if (release.success) {
  console.log(`✓ Released v${release.version}`);
}
```

### Example 3: Add Entry with Auto-Formatting

```javascript
const { addEntry } = require('./changelog.agent.js');

const result = await addEntry('./CHANGELOG.md', {
  category: 'Fixed',
  text: 'fix: security update for CVE-2026-1234 (#789)',
}, { validate: true, autoFormat: true });

if (result.success) {
  console.log('✓ Entry added to [Unreleased]');
}
```

## Error Handling

All functions return result objects with `status` field:

```javascript
if (result.status === 'failed') {
  console.error('Errors:', result.errors);
  console.error('Message:', result.message);
}
```

## Troubleshooting

### "No [Unreleased] section found"

Add this to your CHANGELOG.md:

```markdown
## [Unreleased]

### Changed
- Nothing yet
```

### "Version mismatch in changelog"

Ensure all version references use SemVer (X.Y.Z) and match.

### "PR link required"

Include PR reference in entry text:

```javascript
entry: {
  title: 'New feature',
  prLink: '#123',  // Required
}
```

## Related Files

- [Release Agent README](../release/README.md) — Version management
- [PHASE_5_IMPLEMENTATION_PLAN.md](../../.github/projects/active/release-process-redesign-2026-08-05/PHASE_5_IMPLEMENTATION_PLAN.md) — Phase 5 spec

---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
