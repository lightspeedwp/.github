---
file_type: documentation
title: "Phase 6 Implementation Plan — WordPress Support"
description: "Detailed implementation roadmap for Phase 6 (WordPress-specific version file handling)"
status: active
version: "1.0"
last_updated: "2026-08-09"
owners: ["Ash Shaw"]
tags: ["implementation", "phase-6", "wordpress", "plugin", "theme"]
category: "release-engineering"
---

# Phase 6 Implementation Plan

**Release Process V2: WordPress Support**

---

## Overview

Phase 6 extends the Phase 5 portable agents with WordPress-specific capabilities for handling plugin and theme version files.

**Phase 6 Scope:** Create WordPress utilities for detecting and updating plugin headers, theme CSS headers, and readme.txt files. Integrate with Phase 5 agents to provide seamless multi-repo release process.

**Timeline:** 1-2 days (estimated 2026-08-13 through 2026-08-14)

**Success Metric:** WordPress plugin and theme releases working end-to-end with all version files synchronized.

---

## Validation Against OpenSpec Specification

This plan directly implements requirements from [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md):

| Requirement | Task(s) | Status |
|------------|---------|--------|
| F2: Multi-repo version detection (WordPress) | CHILD-025/026 | Planned |
| NF4: Reliability (all version files in sync) | CHILD-025/026 | Planned |

**Validation Result:** ✅ All WordPress-specific requirements covered by Phase 6 tasks.

---

## Task Breakdown

### CHILD-025/026: WordPress Utilities

**Objective:** Create comprehensive WordPress version file handling utilities.

**Timeline:** 1-2 days

**Location:** `agents/release/includes/wordpressUtils.cjs`

---

## 1. Plugin Header Support

### Context

WordPress plugins can store version information in multiple places:

1. **Plugin Header (Required)**
   - Located in main plugin file (e.g., `plugin.php`)
   - Format: `Version: X.Y.Z`
   - Part of WordPress plugin metadata
   - Required by WordPress.org plugins directory

2. **readme.txt (Optional but recommended)**
   - Located at repo root
   - Format: `Stable tag: X.Y.Z`
   - Used by WordPress.org plugins directory
   - User-facing documentation

3. **VERSION file (Control plane convention)**
   - Located at repo root
   - Format: Plain text `X.Y.Z`
   - Version of record for this repo

4. **package.json (CommonJS convention)**
   - Standard npm/Node.js version
   - Format: `"version": "X.Y.Z"`

### Implementation: Plugin Header Operations

**Function:** `updatePluginHeader(filePath, newVersion)`

```javascript
// Input: plugin.php with header
/*
Plugin Name: My Plugin
Version: 1.2.3
Author: Ash Shaw
*/

// Update Version line
/*
Plugin Name: My Plugin
Version: 1.2.4
Author: Ash Shaw
*/

// Implementation: Parse only the plugin header block (first 8KB or until first PHP code)
// Regex pattern (restricted to header comment block):
const headerRegex = /\/\*[\s\S]*?Version:\s*([^\n]+)[\s\S]*?\*\//i;
```

**Key Functions:**

```javascript
readPluginHeader(filePath)
  → {
      name: 'My Plugin',
      version: '1.2.3',
      author: 'Ash Shaw',
      description: '...',
      ...
    }

updatePluginHeader(filePath, newVersion)
  → boolean (success/failure)

validatePluginHeader(filePath)
  → { valid: boolean, errors: [...] }

detectPluginFile()
  → 'plugin.php' | 'my-plugin.php' | null
  // Search for main plugin file
```

**Implementation Details:**

```javascript
// Read PHP file line by line
// Match: /** Plugin Name: ... */ structure
// Find Version: X.Y.Z line
// Preserve formatting and comments
// Write back with updated version
```

### Error Handling

```javascript
{
  notFound: 'Plugin header not found in file',
  invalidVersion: 'Version not in SemVer format',
  invalidFormat: 'Plugin header format invalid',
  writeError: 'Could not write updated plugin file',
}
```

---

## 2. Theme CSS Header Support

### Context

WordPress themes store version in CSS header:

```css
/*
Theme Name: My Theme
Version: 1.2.3
Author: Ash Shaw
Description: A cool theme
*/
```

Located in `style.css` at repo root.

### Implementation: Theme CSS Operations

**Function:** `updateThemeCSSVersion(filePath, newVersion)`

```javascript
// Implementation: Parse only the CSS header block (first 10 lines, first /* */ block)
// Regex pattern (restricted to CSS header comment):
const themeVersionRegex = /\/\*[\s\S]*?Version:\s*([^\n]+)[\s\S]*?\*\//i;
```

**Key Functions:**

```javascript
readThemeCSSHeader(filePath)
  → {
      name: 'My Theme',
      version: '1.2.3',
      author: 'Ash Shaw',
      description: '...',
      ...
    }

updateThemeCSSVersion(filePath, newVersion)
  → boolean (success/failure)

validateThemeCSSVersion(filePath)
  → { valid: boolean, errors: [...] }

detectThemeFile()
  → 'style.css' (always at root)
```

**Implementation Details:**

```javascript
// Read CSS file
// Find /* Theme ... */ block
// Locate Version: X.Y.Z line
// Preserve formatting
// Write back with updated version
```

---

## 3. readme.txt Support

### Context

WordPress plugins often include a `readme.txt` file with:

```
=== My Plugin ===
Contributors: ash
Stable tag: 1.2.3
Requires at least: 5.0
Tested up to: 6.4
License: GPL v2
Description: ...
```

The `Stable tag:` field indicates the current released version.

### Implementation: readme.txt Operations

**Function:** `updateReadmeTxtStableTag(filePath, newVersion)`

```javascript
// Implementation: Parse the header metadata section (first ~20 lines)
// Regex pattern (restricted to header section, case-insensitive):
const stableTagRegex = /^Stable\s+tag:\s*([^\n]+)$/im;
```

**Key Functions:**

```javascript
readReadmeTxt(filePath)
  → {
      name: 'My Plugin',
      stableTag: '1.2.3',
      requiresAtLeast: '5.0',
      testedUpTo: '6.4',
      description: '...',
      ...
    }

updateReadmeTxtStableTag(filePath, newVersion)
  → boolean (success/failure)

validateReadmeTxt(filePath)
  → { valid: boolean, errors: [...] }

detectReadmeFile()
  → 'readme.txt' (always at root if exists)
```

**Implementation Details:**

```javascript
// Read readme.txt as text
// Find "Stable tag:" line (case-insensitive)
// Update version
// Write back (preserve exact formatting)
```

---

## 4. Integrated WordPress Utils Module

**File:** `agents/release/includes/wordpressUtils.cjs`

### Master Function: `updateWordPressVersionFiles(repoType, newVersion)`

```javascript
async updateWordPressVersionFiles(repoType, newVersion) {
  const results = {
    plugin: { updated: false, file: null },
    theme: { updated: false, file: null },
    readme: { updated: false, file: null },
  };

  try {
    if (repoType === 'plugin') {
      // 1. Find plugin file
      const pluginFile = detectPluginFile();
      if (!pluginFile) throw new Error('Plugin file not found');
      
      // 2. Update plugin header (validate return value)
      const pluginUpdated = updatePluginHeader(pluginFile, newVersion);
      if (!pluginUpdated) throw new Error(`Failed to update plugin header in ${pluginFile}`);
      results.plugin = { updated: true, file: pluginFile };
    }

    if (repoType === 'theme') {
      // 1. Update style.css header (validate return value)
      const themeUpdated = updateThemeCSSVersion('style.css', newVersion);
      if (!themeUpdated) throw new Error('Failed to update theme CSS header in style.css');
      results.theme = { updated: true, file: 'style.css' };
    }

    // 3. Update readme.txt if exists (validate return value)
    if (fileExists('readme.txt')) {
      const readmeUpdated = updateReadmeTxtStableTag('readme.txt', newVersion);
      if (!readmeUpdated) throw new Error('Failed to update readme.txt stable tag');
      results.readme = { updated: true, file: 'readme.txt' };
    }

    return results;
  } catch (error) {
    // On any failure, attempt to restore consistency or report partial success
    throw new Error(`WordPress version file update failed: ${error.message}`);
  }
}
```

### Integration with Phase 5 versionManager

In Phase 5's `versionManager.cjs`, add WordPress support:

```javascript
const wp = require('./wordpressUtils.cjs');

async function applyVersionBump(newVersion, repoType) {
  const results = [];

  // Update standard files
  results.push(updateVersionFile('VERSION', newVersion));
  results.push(updatePackageJson('package.json', newVersion));

  // Update WordPress-specific files
  if (repoType === 'plugin' || repoType === 'theme') {
    const wpResults = await wp.updateWordPressVersionFiles(
      repoType,
      newVersion
    );
    results.push(wpResults);
  }

  return results;
}
```

---

## 5. Complete Function Reference

```javascript
// ============================================
// Plugin Operations
// ============================================

readPluginHeader(filePath)
  @param {string} filePath - Path to main plugin file
  @returns {object} Plugin metadata { version, name, author, ... }
  @throws {Error} If file not found or header invalid

updatePluginHeader(filePath, newVersion)
  @param {string} filePath - Path to main plugin file
  @param {string} newVersion - New version (X.Y.Z)
  @returns {boolean} Success/failure
  @throws {Error} If update fails

validatePluginHeader(filePath)
  @param {string} filePath - Path to main plugin file
  @returns {object} { valid: boolean, errors: [...] }

detectPluginFile()
  @returns {string|null} Main plugin file path or null
  // Searches: plugin-name.php, main file with plugin header

// ============================================
// Theme Operations
// ============================================

readThemeCSSHeader(filePath)
  @param {string} filePath - Path to style.css
  @returns {object} Theme metadata { version, name, author, ... }
  @throws {Error} If file not found or header invalid

updateThemeCSSVersion(filePath, newVersion)
  @param {string} filePath - Path to style.css
  @param {string} newVersion - New version (X.Y.Z)
  @returns {boolean} Success/failure
  @throws {Error} If update fails

validateThemeCSSVersion(filePath)
  @param {string} filePath - Path to style.css
  @returns {object} { valid: boolean, errors: [...] }

// ============================================
// readme.txt Operations
// ============================================

readReadmeTxt(filePath)
  @param {string} filePath - Path to readme.txt
  @returns {object} Readme metadata { stableTag, name, ... }
  @throws {Error} If file not found or format invalid

updateReadmeTxtStableTag(filePath, newVersion)
  @param {string} filePath - Path to readme.txt
  @param {string} newVersion - New version (X.Y.Z)
  @returns {boolean} Success/failure
  @throws {Error} If update fails

validateReadmeTxt(filePath)
  @param {string} filePath - Path to readme.txt
  @returns {object} { valid: boolean, errors: [...] }

// ============================================
// Integrated Operations
// ============================================

updateWordPressVersionFiles(repoType, newVersion)
  @param {string} repoType - 'plugin' | 'theme'
  @param {string} newVersion - New version (X.Y.Z)
  @returns {Promise<object>} {
      plugin: { updated: boolean, file: string },
      theme: { updated: boolean, file: string },
      readme: { updated: boolean, file: string }
    }
  @throws {Error} If any critical update fails
```

---

## Testing Strategy

### Unit Tests for WordPress Utils

```javascript
// Plugin header tests
✓ Reads plugin header correctly (name, version, author)
✓ Detects plugin file in repo
✓ Updates plugin header version
✓ Preserves formatting (spacing, comments)
✓ Fails on missing plugin file
✓ Fails on invalid version format

// Theme CSS tests
✓ Reads theme CSS header
✓ Updates theme CSS version
✓ Preserves CSS structure
✓ Fails on missing style.css

// readme.txt tests
✓ Reads readme.txt correctly
✓ Updates Stable tag
✓ Preserves readme.txt structure
✓ Handles missing readme.txt gracefully

// Integration tests
✓ Updates all plugin files simultaneously (plugin + readme.txt)
✓ Updates theme files (style.css)
✓ Validates all files after update
✓ Handles mixed WordPress repos
```

### E2E Tests

```javascript
// Test on real WordPress plugin repo
✓ Detect plugin repo
✓ Read all version files (plugin, readme, package.json)
✓ Validate versions match
✓ Bump version
✓ Verify all files updated
✓ Git commit successful
✓ Reset and verify rollback works

// Test on real WordPress theme repo
✓ Detect theme repo
✓ Read all version files (style.css, package.json)
✓ Validate versions match
✓ Bump version
✓ Verify all files updated
✓ Git commit successful
```

---

## Integration with Phase 5

**Modified Files:**

1. **agents/release/includes/versionManager.cjs**
   - Add WordPress support to `applyVersionBump()`
   - Include wordpress detection in `detectAllVersionFiles()`

2. **agents/release/includes/repoDetector.cjs**
   - Improve plugin detection (look for plugin headers)
   - Improve theme detection (look for style.css)

3. **agents/release/release.agent.js**
   - Leverage WordPress utilities automatically for plugin/theme repos

**No Changes Needed:**

- gitOps.cjs
- githubOps.cjs
- changelog agent

---

## Success Criteria (Phase 6)

✅ **Phase 6 is successful when:**

1. **Plugin Support Complete**
   - [ ] Plugin header detection working
   - [ ] Plugin header updates working
   - [ ] readme.txt updates working
   - [ ] All plugin version files synchronized

2. **Theme Support Complete**
   - [ ] Theme CSS header detection working
   - [ ] Theme CSS header updates working
   - [ ] Theme version files synchronized

3. **Testing Comprehensive**
   - [ ] All unit tests passing (80%+ coverage)
   - [ ] E2E tests passing on real plugin/theme repos

4. **Integration Working**
   - [ ] Phase 5 agents automatically detect and handle WordPress repos
   - [ ] Release workflow works for plugins and themes
   - [ ] No manual file handling needed

5. **Ready for Phase 7**
   - [ ] Documentation can now cover WordPress-specific examples
   - [ ] Training materials can reference plugin/theme releases

---

## Deliverables Checklist

- [ ] `agents/release/includes/wordpressUtils.cjs` (complete)
- [ ] WordPress utilities documentation (in README)
- [ ] Plugin header examples (before/after)
- [ ] Theme CSS examples (before/after)
- [ ] readme.txt examples (before/after)
- [ ] Unit tests for WordPress utils (80%+ coverage)
- [ ] E2E tests on real WordPress repos
- [ ] Updated Phase 5 versionManager (WordPress integration)
- [ ] Updated repoDetector (better WordPress detection)
- [ ] All tests passing

---

## Files Modified/Created

| File | Status | Change |
|------|--------|--------|
| `agents/release/includes/wordpressUtils.cjs` | Create | New WordPress utilities |
| `agents/release/includes/versionManager.cjs` | Modify | Add WordPress support |
| `agents/release/includes/repoDetector.cjs` | Modify | Improve WordPress detection |
| `agents/release/includes/tests/wordpressUtils.test.js` | Create | WordPress utils tests |

---

## References

- **Specification:** [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md) (F2)
- **Phase 5 Plan:** [PHASE_5_IMPLEMENTATION_PLAN.md](./PHASE_5_IMPLEMENTATION_PLAN.md)
- **WordPress Handbook:** <https://developer.wordpress.org/plugins/>
- **WordPress Theme Handbook:** <https://developer.wordpress.org/themes/>

---

*Phase 6 Implementation Plan — Created 2026-08-09*  
*Status: READY FOR EXECUTION*  
*Estimated Timeline: 1-2 days (2026-08-13 through 2026-08-14)*
