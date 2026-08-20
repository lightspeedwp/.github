---
file_type: readme
title: Release Agent
description: Portable agent for multi-repository version management and release automation
version: "1.0.0"
last_updated: "2026-08-20"
owners:
  - Ash Shaw
tags:
  - agent
  - release
  - version-management
  - portable
---

# Release Agent

Portable, production-grade agent for managing releases across multiple repository types (control plane, WordPress plugins, WordPress themes).

## Overview

The Release Agent automates the release preparation workflow (Phase 1):

1. **Detect** repository type (control-plane, plugin, or theme)
2. **Validate** version consistency across all version files
3. **Bump** versions (major/minor/patch) across all files
4. **Commit** version changes with proper messaging
5. **Create PR** to develop branch with version bumps

**Phase 2 (planned):** Create PR to main, tag, and GitHub release

Supports:

- Control-plane repositories (`.github` with VERSION + package.json)
- WordPress plugins (plugin header + readme.txt + VERSION)
- WordPress themes (style.css header + VERSION)

## Architecture

```
agents/release/
├── release.agent.js          # Main orchestrator (ESM)
├── package.json
├── README.md
└── includes/
    ├── repoDetector.cjs      # Repo type detection
    ├── versionManager.cjs    # Version file handling
    ├── gitOps.cjs            # Git operations
    ├── githubOps.cjs         # GitHub API
    └── tests/
        ├── repoDetector.test.cjs
        ├── versionManager.test.cjs
        └── integration.test.cjs
```

## Usage

### Basic Release (Patch Version)

```javascript
const { releaseWorkflow } = require('./release.agent.js');

const result = await releaseWorkflow({
  scope: 'patch',  // 'patch', 'minor', or 'major'
  message: 'Bug fixes and improvements',
  repoRoot: process.cwd(),
});

console.log(result);
// {
//   currentVersion: '1.2.3',
//   newVersion: '1.2.4',
//   prDevelop: { number: 42, url: '...' },
//   status: 'success',
//   message: 'Release v1.2.4 ready...'
// }
```

### Dry Run (No Side Effects)

```javascript
const result = await releaseWorkflow({
  scope: 'minor',
  dryRun: true,  // No commits or PRs created
});
```

### Validate Before Release

```javascript
const { validateRelease } = require('./release.agent.js');

const validation = await validateRelease({
  repoRoot: process.cwd(),
});

if (!validation.isValid) {
  console.error('Release validation failed:', validation.errors);
}
```

## Supported Repository Types

### Control-Plane (`.github`)

**Required files:**

- `VERSION` — Plain text version file
- `package.json` — npm package manifest

**Example:**

```
repository/
├── .github/           # Marker for control-plane
├── VERSION            # "1.0.0"
├── package.json       # { "version": "1.0.0" }
└── ...
```

### WordPress Plugin

**Required files:**

- `VERSION` — Plain text version file
- `{plugin}.php` — PHP file with plugin header

**Optional files:**

- `readme.txt` — Plugin readme with "Stable tag: X.Y.Z"
- `package.json` — npm package manifest

**Example:**

```
my-plugin/
├── VERSION                    # "2.0.0"
├── my-plugin.php
│   ├── Plugin Name: My Plugin
│   └── Version: 2.0.0
├── readme.txt                 # Stable tag: 2.0.0
└── package.json
```

### WordPress Theme

**Required files:**

- `VERSION` — Plain text version file
- `style.css` — CSS file with theme header

**Optional files:**

- `package.json` — npm package manifest

**Example:**

```
my-theme/
├── VERSION       # "3.0.0"
├── style.css
│   ├── Theme Name: My Theme
│   └── Version: 3.0.0
└── package.json
```

## Version Files

### VERSION File

Plain text file containing semantic version:

```
1.2.3
```

### package.json

Standard npm manifest:

```json
{
  "version": "1.2.3"
}
```

### Plugin Header

PHP file with plugin header:

```php
<?php
/**
 * Plugin Name: My Plugin
 * Version: 1.2.3
 * Description: My plugin description
 */
```

### Theme Header

CSS file with theme header:

```css
/*
 * Theme Name: My Theme
 * Version: 1.2.3
 * Description: My theme description
 */
```

### readme.txt

WordPress plugin readme file:

```
=== My Plugin ===
Contributors: author
Stable tag: 1.2.3
```

## Version Bumping

### Semantic Versioning

Versions follow SemVer (X.Y.Z):

- **Patch** (1.2.3 → 1.2.4) — Bug fixes, minor changes
- **Minor** (1.2.3 → 1.3.0) — New features, backward compatible
- **Major** (1.2.3 → 2.0.0) — Breaking changes, major rewrites

### Validation Rules

1. All version files must exist and be readable
2. All version files must contain the same version
3. New version must be valid SemVer (X.Y.Z)
4. All version files must be writable before bumping

## API Reference

### `releaseWorkflow(options)`

Main release orchestrator.

**Parameters:**

```javascript
{
  scope: 'patch' | 'minor' | 'major',  // Default: 'patch'
  dryRun: boolean,                      // Default: false
  message: string,                      // Release message (optional)
  repoRoot: string,                     // Default: process.cwd()
}
```

**Returns:**

```javascript
{
  currentVersion: string,           // e.g. "1.2.3"
  newVersion: string,               // e.g. "1.2.4"
  prDevelop: {
    number: number,
    url: string,
  },
  prMain: {                          // After develop merges
    number: number,
    url: string,
  },
  tag: string,                       // e.g. "v1.2.4"
  release: {
    id: string,
    url: string,
  },
  status: 'success' | 'partial' | 'failed',
  message: string,
  steps: [
    { step: string, status: 'complete' | 'in-progress' | 'failed' },
    ...
  ],
}
```

### `validateRelease(options)`

Validate that a release can proceed.

**Parameters:**

```javascript
{
  repoRoot: string,  // Default: process.cwd()
}
```

**Returns:**

```javascript
{
  isValid: boolean,
  errors: string[],           // Issues preventing release
  warnings: string[],         // Non-blocking warnings
  repo: {
    type: string,             // 'control-plane' | 'plugin' | 'theme'
    root: string,
    versionFiles: string[],
    mainFile: string | null,
  },
  versions: {
    VERSION: { path: string, current: string },
    packageJson: { path: string, current: string },
    plugin: { path: string, current: string },     // plugins only
    theme: { path: string, current: string },      // themes only
    readme: { path: string, current: string },     // if present
  },
}
```

## Modules

### `repoDetector.cjs`

Detects repository type and structure.

**Key functions:**

- `detectRepoType(repoRoot)` — Detect repo type
- `isValidRepoStructure(repoConfig)` — Validate structure
- `getVersionFiles(repoConfig)` — List version files
- `getMainFile(repoConfig)` — Get plugin/theme file

### `versionManager.cjs`

Manages version files: detecting, validating, and bumping.

**Key functions:**

- `detectAllVersionFiles(repoConfig)` — Find all version files
- `validateVersionConsistency(versionMap)` — Check versions match
- `bumpVersion(current, scope)` — Calculate new version
- `applyVersionBump(versionMap, newVersion)` — Update all files
- `getCurrentVersion(versionMap)` — Get current version

### `gitOps.cjs`

Git operations: branches, commits, tags, pushes.

**Key functions:**

- `createBranch(branchName)` — Create branch
- `commitChanges(message, options)` — Commit changes
- `createTag(tagName, message)` — Create tag
- `push(branch, remote)` — Push to remote
- `getLatestTag()` — Get latest tag

### `githubOps.cjs`

GitHub API operations: PRs, releases.

**Key functions:**

- `createPullRequest(options)` — Create PR
- `mergePullRequest(prNumber)` — Merge PR
- `createGitHubRelease(options)` — Create release
- `getGitHubUser()` — Get authenticated user

## Testing

### Run All Tests

```bash
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests

```bash
npm run test:integration
```

**Test coverage:**

- 18 tests for repo type detection
- 24 tests for version management
- Integration tests for multi-repo scenarios

All tests passing: ✓ 42/42

## Requirements

### System

- Node.js 18+
- Git 2.30+
- GitHub CLI (`gh`) for GitHub operations

### Authentication

```bash
# GitHub authentication (required for PR/release creation)
gh auth login

# Verify authentication
gh auth status
```

## Examples

### Example 1: Patch Release (Bug Fix)

```javascript
const result = await releaseWorkflow({
  scope: 'patch',
  message: 'Fix: Critical security update',
  repoRoot: '/path/to/plugin',
});

console.log(`Released v${result.newVersion}`);
console.log(`PR: ${result.prDevelop.url}`);
```

### Example 2: Minor Release (New Feature)

```javascript
const result = await releaseWorkflow({
  scope: 'minor',
  message: 'Add: New admin features',
  repoRoot: '/path/to/theme',
});

if (result.status === 'success') {
  console.log(`v${result.currentVersion} → v${result.newVersion}`);
}
```

### Example 3: Validate Before Release

```javascript
const validation = await validateRelease();

if (validation.isValid) {
  const release = await releaseWorkflow({
    scope: 'patch',
  });
} else {
  console.error('Validation failed:', validation.errors);
}
```

## Error Handling

All functions return null or false on failure. Check the agent result `status` field:

```javascript
const result = await releaseWorkflow({ scope: 'patch' });

if (result.status === 'failed') {
  console.error(result.message);
  console.error(result.steps);  // See which step failed
}
```

## Troubleshooting

### "Unable to detect repository type"

Ensure your repo has the required version files:

- Control-plane: `VERSION` + `.github/` directory
- Plugin: `VERSION` + `{plugin}.php` with plugin header
- Theme: `VERSION` + `style.css` with theme header

### "Version mismatch"

All version files must contain the same version. Run `validateRelease()` to see which files are inconsistent.

### "Working tree has uncommitted changes"

Commit or stash uncommitted changes before running `releaseWorkflow()`.

### "Not authenticated with GitHub"

Run `gh auth login` to authenticate with GitHub CLI.

## Related Files

- [PHASE_5_IMPLEMENTATION_PLAN.md](../../.github/projects/active/release-process-redesign-2026-08-05/PHASE_5_IMPLEMENTATION_PLAN.md) — Phase 5 specification
- [agents/changelog/README.md](../changelog/README.md) — Changelog agent (Phase 5)

---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
