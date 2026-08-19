---
file_type: documentation
title: WordPress Release Guide
description: Step-by-step release process for WordPress plugins and themes with version management and changelog automation
version: v1.0
last_updated: '2026-08-19'
status: active
stability: stable
domain: governance
owners:
  - LightSpeed Team
tags:
  - wordpress
  - release
  - plugin
  - theme
  - process
---

# WordPress Release Guide v1.0

> Ship WordPress plugins and themes reliably with automated version management, changelog validation, and multi-file coordination.

## Overview

This guide covers the complete release process for WordPress plugins and themes using the portable Release Agent. The process automatically manages version files across different formats while maintaining consistency.

### Supported WordPress Formats

| Type | Version Files | Detection |
|------|---------------|-----------|
| **Plugin** | Plugin header + readme.txt + VERSION | Main PHP file with `Plugin Name:` header |
| **Theme** | style.css + VERSION | `style.css` with `Theme Name:` header |
| **Hybrid** | Plugin + readme.txt + VERSION | Main PHP file detected first |

---

## Part 1: WordPress Plugin Release

### Step 1: Verify Plugin Structure

Before releasing, verify your plugin has the required files:

```bash
# Check plugin file exists and has header
ls -la my-plugin.php
head -20 my-plugin.php  # Look for Plugin Name: line

# Check readme.txt exists
ls -la readme.txt

# (Optional) Check VERSION file
cat VERSION
```

**Required plugin header format:**

```php
<?php
/*
Plugin Name: My Awesome Plugin
Description: A brief description
Version: 1.0.0
Author: Your Name
License: GPL v2 or later
Text Domain: my-awesome-plugin
*/
```

**Required readme.txt header:**

```
=== My Awesome Plugin ===
Contributors: yourname
Author: Your Name
License: GPL v2 or later
Requires at least: 5.0
Tested up to: 6.0
Stable tag: 1.0.0
Text Domain: my-awesome-plugin

Description of the plugin.
```

### Step 2: Update CHANGELOG.md

Ensure your `CHANGELOG.md` has unreleased entries. The release agent will automatically roll these into a versioned section.

**Format:**

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- New feature X
- New feature Y

### Changed
- Updated feature Z

### Fixed
- Fixed bug A

## [1.0.0] - 2026-08-19

### Added
- Initial release

[Unreleased]: https://github.com/yourorg/plugin/compare/v1.0.0...develop
[1.0.0]: https://github.com/yourorg/plugin/releases/tag/v1.0.0
```

### Step 3: Prepare develop Branch

```bash
# Switch to develop
git checkout develop
git pull origin develop

# Verify clean working tree
git status

# Verify CHANGELOG.md has unreleased entries
grep -A 10 "## \[Unreleased\]" CHANGELOG.md
```

### Step 4: Trigger Release Workflow

```bash
# Patch release (1.0.0 → 1.0.1)
gh workflow run release.yml -f scope=patch -f dry_run=false

# Minor release (1.0.0 → 1.1.0)
gh workflow run release.yml -f scope=minor -f dry_run=false

# Major release (1.0.0 → 2.0.0)
gh workflow run release.yml -f scope=major -f dry_run=false

# Preview first (recommended for major)
gh workflow run release.yml -f scope=major -f dry_run=true
```

### Step 5: Review & Merge PR #1

The release agent creates **PR #1** with version and changelog updates.

```bash
# View PR details
gh pr view <pr-number> --json title,body

# Verify changes
git diff origin/develop...HEAD -- my-plugin.php readme.txt CHANGELOG.md

# What to check:
# ✅ my-plugin.php: Version: X.Y.Z updated
# ✅ readme.txt: Stable tag: X.Y.Z updated
# ✅ VERSION file: Updated (if exists)
# ✅ CHANGELOG.md: [Unreleased] rolled to [X.Y.Z]

# Merge to develop
gh pr merge --squash --delete-branch
```

**Expected changes in PR #1:**

```diff
--- my-plugin.php
+++ my-plugin.php
@@ -1,10 +1,10 @@
 <?php
 /*
 Plugin Name: My Awesome Plugin
 Description: A brief description
-Version: 1.0.0
+Version: 1.1.0
 Author: Your Name
 License: GPL v2 or later
 Text Domain: my-awesome-plugin
 */

--- readme.txt
+++ readme.txt
@@ -7,1 +7,1 @@
-Stable tag: 1.0.0
+Stable tag: 1.1.0
```

### Step 6: Phase 2 Automatic (Skip to Step 8)

After PR #1 merges, **Phase 2 automatically begins**:
- Safety gates run (7-layer validation)
- PR #2 created (release → main)
- Approval required based on scope

**For patch releases:** Automatic approval (if agentic score ≥ 0.8)  
**For minor/major:** Manual approval required

### Step 7: Review & Merge PR #2

```bash
# View PR #2 (auto-created)
gh pr view <new-pr-number> --json title,body

# Check agentic confidence score in PR comments
# Check all safety gates passed

# Merge PR #2 to main
gh pr merge --squash --delete-branch
```

**Post-merge:** GitHub Release published automatically with:
- Release name: `Release v1.1.0`
- Release notes: Compiled from CHANGELOG.md + PR details
- Tag: `v1.1.0`

### Step 8: Merge Post-Sync PR

After release publishes, an automatic **post-sync PR** keeps branches in sync:

```bash
# Find and view post-sync PR
gh pr list --search "post-release-sync" --state open

# Review changes (should be no conflicts)
gh pr view <pr-number>

# Merge to develop
gh pr merge --merge --delete-branch
```

---

## Part 2: WordPress Theme Release

### Step 1: Verify Theme Structure

```bash
# Check style.css exists and has header
ls -la style.css
head -15 style.css  # Look for Theme Name: line

# (Optional) Check VERSION file
cat VERSION
```

**Required style.css header format:**

```css
/*
Theme Name: My Awesome Theme
Description: A brief description
Version: 1.0.0
Author: Your Name
Author URI: https://yoursite.com
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: my-awesome-theme
Domain Path: /languages
*/
```

### Step 2: Update CHANGELOG.md

Same format as plugins (see Part 1, Step 2).

### Step 3: Prepare & Release

Follow the same workflow as plugins (Part 1, Steps 3-8):

```bash
# Prepare develop
git checkout develop
git pull origin develop

# Trigger release (patch/minor/major)
gh workflow run release.yml -f scope=minor -f dry_run=false

# Review & merge PR #1
gh pr merge <pr-number> --squash

# Phase 2 automatic (gates + approvals)

# Review & merge PR #2
gh pr merge <new-pr-number> --squash

# Merge post-sync PR
gh pr merge <sync-pr-number> --merge
```

**What the agent updates for themes:**

- ✅ `style.css`: Version: line in CSS header
- ✅ `VERSION` file (if exists)
- ✅ `CHANGELOG.md`: Rolls [Unreleased] to [X.Y.Z]

---

## Before & After Examples

### Example 1: Plugin Minor Release (1.0.0 → 1.1.0)

**Before release:**

```
my-plugin.php:
  Version: 1.0.0

readme.txt:
  Stable tag: 1.0.0

CHANGELOG.md:
  ## [Unreleased]
  ### Added
  - New feature X
```

**After Phase 1 (PR #1 merged):**

```
my-plugin.php:
  Version: 1.1.0  ← Updated

readme.txt:
  Stable tag: 1.1.0  ← Updated

CHANGELOG.md:
  ## [Unreleased]
  (empty)

  ## [1.1.0] - 2026-08-19  ← New section
  ### Added
  - New feature X
```

**After Phase 2 (PR #2 merged + GitHub Release published):**

- Tag `v1.1.0` created on main
- GitHub Release published with compiled notes
- Branches synced (post-release-sync merged)

### Example 2: Theme Major Release (1.0.0 → 2.0.0)

**Before release:**

```
style.css:
  Theme Name: My Awesome Theme
  Version: 1.0.0

VERSION:
  1.0.0

CHANGELOG.md:
  ## [Unreleased]
  ### Changed
  - Complete theme redesign
  - Updated framework
```

**After Phase 1:**

```
style.css:
  Version: 2.0.0  ← Updated

VERSION:
  2.0.0  ← Updated

CHANGELOG.md:
  ## [2.0.0] - 2026-08-19  ← Version-dated entry
  ### Changed
  - Complete theme redesign
  - Updated framework
```

**After Phase 2 & Release:**

- GitHub Release v2.0.0 published
- Compiled release notes include:
  - Plugin/theme name and version
  - All changelog entries
  - Contributor list (from merged PRs)
  - Links to issues and PRs

---

## Common Issues & Solutions

### ❌ "Plugin header not found"

**Problem:** Release agent can't detect plugin file

**Solution:**

1. Verify main plugin file exists and has `Plugin Name:` header
2. Ensure header format is correct:

```php
<?php
/*
Plugin Name: Exact Plugin Name
Version: 1.0.0
*/
```

3. Check plugin file is in repo root (not subdirectory)

### ❌ "Version mismatch in plugin files"

**Problem:** Plugin header and readme.txt have different versions

**Solution:**

The agent automatically detects and reports mismatches. If you get this error:

1. Check current versions:

```bash
grep "Version:" my-plugin.php | head -1
grep "Stable tag:" readme.txt | head -1
cat VERSION
```

2. Manually fix any mismatches:

```bash
# Update plugin header
sed -i '' 's/Version: .*/Version: 1.0.0/' my-plugin.php

# Update readme.txt
sed -i '' 's/Stable tag: .*/Stable tag: 1.0.0/' readme.txt

# Update VERSION file
echo "1.0.0" > VERSION
```

3. Commit and retry:

```bash
git add my-plugin.php readme.txt VERSION
git commit -m "chore: Fix version mismatch"
git push
```

### ❌ "style.css Theme Name header not found"

**Problem:** theme/style.css doesn't have proper WordPress header

**Solution:**

Add WordPress theme header to the top of `style.css`:

```css
/*
Theme Name: My Awesome Theme
Description: A brief description
Version: 1.0.0
Author: Your Name
License: GPL v2 or later
*/

/* Rest of stylesheet below */
body { color: black; }
```

### ❌ "CHANGELOG.md not in valid format"

**Problem:** Changelog doesn't meet validation requirements

**Solution:**

Check your CHANGELOG.md has:

1. `## [Unreleased]` section (case-sensitive)
2. Valid subsections: `### Added`, `### Changed`, `### Fixed`, `### Removed`
3. Proper markdown formatting

**Valid format:**

```markdown
# Changelog

## [Unreleased]

### Added
- New feature

### Fixed
- Bug fix

## [1.0.0] - 2026-08-19

### Added
- Initial release
```

### ❌ "readme.txt missing Stable tag"

**Problem:** readme.txt doesn't have Stable tag header

**Solution:**

Add `Stable tag: X.Y.Z` to readme.txt header (must match plugin version):

```
=== My Plugin ===
Contributors: yourname
Stable tag: 1.0.0
Text Domain: my-plugin
```

### ❌ "Patch release for patch increment only"

**Problem:** Can't release major version to minor increment

**Solution:**

Use correct scope for your version bump:

```bash
# From 1.0.0 to 1.0.1 (patch fix)
gh workflow run release.yml -f scope=patch

# From 1.0.0 to 1.1.0 (new features)
gh workflow run release.yml -f scope=minor

# From 1.0.0 to 2.0.0 (breaking changes)
gh workflow run release.yml -f scope=major
```

---

## Multiple Plugins/Themes in One Repo

If your repo contains multiple plugins or themes:

### Solution 1: Separate Repositories

**Recommended:** Split into separate repos, one plugin/theme per repo.

Benefits:
- Clear versioning per component
- Independent release cycles
- Simpler change tracking

### Solution 2: Monorepo Approach

If using a monorepo:

1. Create subdirectories: `./plugins/plugin-1/`, `./plugins/plugin-2/`
2. Update branch naming: `feat/plugin-1-feature-name`, `feat/plugin-2-feature-name`
3. Create separate `.github/workflows/release-plugin-1.yml` per component
4. Trigger specific workflow for the component you're releasing

**Example structure:**

```
plugins/
├── plugin-1/
│   ├── plugin-1.php
│   ├── readme.txt
│   └── VERSION
├── plugin-2/
│   ├── plugin-2.php
│   ├── readme.txt
│   └── VERSION
themes/
├── theme-1/
│   ├── style.css
│   └── VERSION
└── shared/
    └── CHANGELOG.md
```

---

## Pre-Release Version Handling

### Beta / Release Candidate Versions

If you use pre-release versions (e.g., `1.0.0-beta`):

**Supported format:**

```
1.0.0-alpha          # Earliest pre-release
1.0.0-beta           # Beta version
1.0.0-rc1            # Release candidate
1.0.0                # Final release
1.1.0-beta           # Next version beta
```

**Release process:**

1. Update to pre-release version manually (agent doesn't do this)
2. Bump to stable when ready (e.g., `1.0.0-beta` → `1.0.0`)
3. Use normal release workflow with `scope=patch`

### Alpha/Beta Testing Releases

For testing before official release:

```bash
# Manually update to beta
echo "1.1.0-beta1" > VERSION
sed -i '' 's/Version: .*/Version: 1.1.0-beta1/' my-plugin.php

# Commit and create test branch (not release/)
git checkout -b test/v1.1.0-beta
git commit -m "chore: Release 1.1.0-beta1 for testing"
git push origin test/v1.1.0-beta

# Create PR for review
gh pr create --title "test: Release 1.1.0-beta1"

# After testing, update to stable and use normal release process
```

---

## Integration with Release Agents

### Release Agent (Phase 1)

The portable Release Agent handles:
- Repository type detection (plugin vs theme)
- Version file discovery and updating
- CHANGELOG.md validation and rolling
- Release branch creation
- PR generation

**For plugin-specific features:**
- Reads/writes plugin headers
- Reads/writes readme.txt stable tag
- Validates WordPress-specific metadata

**For theme-specific features:**
- Reads/writes style.css headers
- Validates theme metadata

See [Release Agent README](../agents/release/README.md) for technical details.

### WordPress Utilities Agent

For advanced WordPress-specific operations:

```javascript
import wordpress from './agents/wordpress/wordpress.agent.js';

// Detect plugin or theme
const component = wordpress.detectWordPressComponent('./');

// Validate consistency across all version files
const validation = wordpress.validateVersionConsistency('./');

// Update all versions at once
const result = wordpress.updateAllVersions('./', '2.0.0');

// Bump versions (major/minor/patch)
const bump = wordpress.bumpAllVersions('./', 'minor');
```

See [WordPress Agent README](../agents/wordpress/README.md) for full API.

---

## Related Documentation

- [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) — Complete two-phase release workflow
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch naming and release flow
- [Release Agent README](../agents/release/README.md) — Release agent technical docs
- [WordPress Agent README](../agents/wordpress/README.md) — WordPress utilities API

---

## FAQ

### Q: How often should I release WordPress plugins/themes?

**Answer:** Depends on your release strategy:
- **Patch releases:** As needed for critical bugs (weekly or more frequent)
- **Minor releases:** Every 2-4 weeks for new features
- **Major releases:** Quarterly or annually for breaking changes

Recommend documenting your release schedule in your plugin/theme README.

### Q: What if I need to release to WordPress.org plugin directory?

**Answer:** The release process creates GitHub Releases and tags. To publish to WordPress.org:

1. Add your plugin to [wordpress.org/plugins/](https://wordpress.org/plugins/)
2. Commit SVN repo alongside GitHub repo
3. Use tools like [WP CLI](https://wp-cli.org/) or GitHub Actions to deploy SVN

Or use deployment plugins like [GitHub Deploy to WordPress.org](https://github.com/marketplace/actions/github-deploy-to-wordpress-org).

### Q: Can I revert a release?

**Answer:** Yes. If you need to revert a published release:

```bash
# Revert the release tag
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0

# Delete GitHub Release (manual at github.com/your-org/plugin/releases)

# Create hotfix/revert PR
git checkout main
git revert HEAD --no-edit
git push origin main
```

Then create a new release with patch bump when ready.

### Q: How do I test a release before publishing?

**Answer:** Use dry-run mode:

```bash
# Preview release without making changes
gh workflow run release.yml -f scope=minor -f dry_run=true

# Check workflow output for what would happen
# Then run with dry_run=false when confident
```

### Q: What SemVer rules apply?

**Answer:** Follow strict semantic versioning:

- **MAJOR** (X.0.0) — Breaking changes, incompatible API
- **MINOR** (0.X.0) — New features, backward compatible
- **PATCH** (0.0.X) — Bug fixes, no new features

Examples:
- `1.0.0` → `2.0.0` — Major (breaking)
- `1.0.0` → `1.1.0` — Minor (new features)
- `1.0.0` → `1.0.1` — Patch (bug fix)

---

**Status:** ✅ Production Ready  
**Last Updated:** 2026-08-19  
**Version:** 1.0

Questions? See the [FAQ](#faq) or check [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for complete workflow details.
