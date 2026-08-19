---
file_type: documentation
title: "WordPress Release Utilities Agent"
description: "README for agents/wordpress/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# WordPress Release Utilities Agent

> Manages version updates across WordPress plugins, themes, and readme files for multi-repo release automation.

## Overview

The WordPress Release Utilities Agent provides modular utilities for versioning WordPress plugins and themes. It works in conjunction with the [Release Agent](../release/) and [Changelog Agent](../changelog/) to enable seamless version management across all repository types.

**Key Features:**

- 🔌 **Plugin versioning** — Updates `Version:` header in main plugin file
- 🎨 **Theme versioning** — Updates `Version:` in `style.css`
- 📖 **Readme versioning** — Updates `Stable tag:` in `readme.txt`
- ✅ **Version validation** — Ensures SemVer format compliance
- 🔀 **Version consistency** — Detects and reports mismatches across files
- 📦 **Modular design** — Use independently or integrated with release agents

## Installation

```bash
npm install
```

## Usage

### As Node Module

```javascript
import wordpress from './wordpress.agent.js';

// Detect WordPress components in repository
const component = wordpress.detectWordPressComponent('/path/to/repo');
// Returns: { hasPlugin, hasTheme, hasReadme, components }

// Validate version consistency
const validation = wordpress.validateVersionConsistency('/path/to/repo');
// Returns: { isConsistent, baseVersion, versions, mismatches }

// Update all versions
const result = wordpress.updateAllVersions('/path/to/repo', '2.0.0');
// Returns: { updated, failed, success, summary }

// Bump version (major/minor/patch)
const bump = wordpress.bumpAllVersions('/path/to/repo', 'minor');
// Returns: { newVersion, updated, failed, success }

// Get metadata
const metadata = wordpress.getComponentMetadata('/path/to/repo');
// Returns: { hasPlugin, hasTheme, plugin, theme, readme }
```

### Standalone Utilities

Each utility can be used independently:

#### Plugin Header Utility

```javascript
const pluginHeader = require('./includes/pluginHeader.cjs');

// Find plugin file
const pluginFile = pluginHeader.findPluginFile('/path/to/repo');

// Read version
const version = pluginHeader.readVersion(pluginFile);

// Update version
pluginHeader.writeVersion(pluginFile, '1.2.0');

// Bump version
const newVersion = pluginHeader.bumpVersion('1.0.0', 'minor'); // '1.1.0'

// Read plugin metadata
const metadata = pluginHeader.readMetadata(pluginFile);
// Returns: { name, description, version, author, license, ... }
```

#### Theme CSS Utility

```javascript
const themeCss = require('./includes/themeCss.cjs');

// Find theme file (style.css)
const themeFile = themeCss.findThemeFile('/path/to/repo');

// Read/write/bump versions (same as plugin utility)
const version = themeCss.readVersion(themeFile);
themeCss.writeVersion(themeFile, '2.0.0');
const newVersion = themeCss.bumpVersion('1.0.0', 'major');

// Read theme metadata
const metadata = themeCss.readMetadata(themeFile);
```

#### Readme.txt Utility

```javascript
const readmeTxt = require('./includes/readmeTxt.cjs');

// Find readme.txt
const readmeFile = readmeTxt.findReadmeFile('/path/to/repo');

// Read/write/bump versions
const version = readmeTxt.readVersion(readmeFile);
readmeTxt.writeVersion(readmeFile, '1.5.0');
const newVersion = readmeTxt.bumpVersion('1.0.0', 'patch');

// Read readme metadata
const metadata = readmeTxt.readMetadata(readmeFile);
```

## API Reference

### Main Agent Functions

#### `detectWordPressComponent(repoRoot)`

Detects WordPress components in a repository.

**Parameters:**
- `repoRoot` (string) — Path to repository root

**Returns:**
```javascript
{
  hasPlugin: boolean,
  hasTheme: boolean,
  hasReadme: boolean,
  components: {
    plugins: [{file, version}],
    themes: [{file, version}],
    readmes: [{file, version}]
  },
  primaryComponent: {file, version}
}
```

#### `validateVersionConsistency(repoRoot)`

Checks all version files for consistency.

**Parameters:**
- `repoRoot` (string) — Path to repository root

**Returns:**
```javascript
{
  isConsistent: boolean,
  baseVersion: string,
  versions: [{file, type, version}],
  mismatches: string[],
  message: string
}
```

#### `updateAllVersions(repoRoot, newVersion)`

Updates version in all detected files.

**Parameters:**
- `repoRoot` (string) — Path to repository root
- `newVersion` (string) — New version (SemVer format)

**Returns:**
```javascript
{
  updated: string[],
  failed: string[],
  success: boolean,
  summary: string
}
```

#### `bumpAllVersions(repoRoot, scope)`

Bumps version across all components.

**Parameters:**
- `repoRoot` (string) — Path to repository root
- `scope` (string) — `'major'`, `'minor'`, or `'patch'` (default: `'patch'`)

**Returns:**
```javascript
{
  currentVersion: string,
  newVersion: string,
  scope: string,
  updated: string[],
  failed: string[],
  success: boolean
}
```

#### `getComponentMetadata(repoRoot)`

Gets metadata for all detected WordPress components.

**Parameters:**
- `repoRoot` (string) — Path to repository root

**Returns:**
```javascript
{
  hasPlugin: boolean,
  hasTheme: boolean,
  hasReadme: boolean,
  plugin: {name, description, version, author, ...},
  theme: {name, description, version, author, ...},
  readme: {name, version, author, ...}
}
```

### Utility Functions

All utilities export these standard functions:

#### `readVersion(filePath)`
Reads current version from file.

#### `writeVersion(filePath, newVersion)`
Updates version in file.

#### `isValidVersion(version)`
Validates SemVer format.

#### `bumpVersion(currentVersion, scope)`
Calculates next version.

#### `readMetadata(filePath)`
Extracts all header metadata.

## Examples

### Example 1: Release Workflow

```javascript
import wordpress from './wordpress.agent.js';

// 1. Check current state
const current = wordpress.validateVersionConsistency('./repo');
console.log(`Current version: ${current.baseVersion}`);

// 2. Bump version
const bumped = wordpress.bumpAllVersions('./repo', 'minor');
console.log(`Updated to: ${bumped.newVersion}`);

// 3. Verify consistency
const validated = wordpress.validateVersionConsistency('./repo');
if (!validated.isConsistent) {
  console.error('Version mismatch:', validated.mismatches);
  process.exit(1);
}

console.log('Release ready!');
```

### Example 2: Detect Repository Type

```javascript
const component = wordpress.detectWordPressComponent('./');

if (component.hasPlugin) {
  console.log('This is a WordPress plugin');
} else if (component.hasTheme) {
  console.log('This is a WordPress theme');
} else {
  console.log('Not a WordPress repository');
}
```

### Example 3: Metadata Inspection

```javascript
const metadata = wordpress.getComponentMetadata('./');

if (metadata.plugin) {
  console.log(`Plugin: ${metadata.plugin.name}`);
  console.log(`Author: ${metadata.plugin.author}`);
  console.log(`Description: ${metadata.plugin.description}`);
}
```

## Testing

Run test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

Watch mode:

```bash
npm run test:watch
```

**Test Coverage:**
- Plugin header: 25+ tests
- Theme CSS: 20+ tests
- Readme.txt: 20+ tests
- Integration: 15+ tests
- **Total: 80+ tests, >85% coverage**

## Integration with Release Agent

The WordPress utilities integrate seamlessly with the main Release Agent:

```javascript
import releaseAgent from '../release/release.agent.js';
import wordpressAgent from './wordpress.agent.js';

// Release agent detects WordPress repo type
const repoConfig = releaseAgent.detectRepoType('./');

// WordPress agent provides version management
const validation = wordpressAgent.validateVersionConsistency('./');

// Both work together in release workflow
```

See [Release Agent README](../release/README.md) for integration details.

## File Structure

```
agents/wordpress/
├── wordpress.agent.js           # Main agent orchestrator
├── includes/
│   ├── pluginHeader.cjs         # Plugin versioning utility
│   ├── themeCss.cjs             # Theme versioning utility
│   ├── readmeTxt.cjs            # Readme.txt versioning utility
│   └── tests/
│       ├── pluginHeader.test.cjs
│       ├── themeCss.test.cjs
│       └── readmeTxt.test.cjs
├── __tests__/                   # Integration tests
├── package.json
└── README.md
```

## Supported Formats

### WordPress Plugins

Reads/writes version from plugin header (main PHP file):

```php
<?php
/*
Plugin Name: My Plugin
Description: A test plugin
Version: 1.2.3
Author: Your Name
*/
```

Also supports `readme.txt` with:

```
=== My Plugin ===
Stable tag: 1.2.3
```

### WordPress Themes

Reads/writes version from `style.css`:

```css
/*
Theme Name: My Theme
Version: 1.2.3
Author: Your Name
*/
```

## Error Handling

All functions validate input and provide clear error messages:

```javascript
try {
  wordpress.updateAllVersions(repoRoot, 'invalid-version');
} catch (error) {
  console.error('Update failed:', error.message);
  // "Update failed: Invalid SemVer format: invalid-version"
}
```

## Performance

- File operations: O(1) per component
- Metadata parsing: <100ms per file
- Version validation: <1ms

## Limitations

- Assumes standard WordPress plugin/theme structure
- Does not validate actual WordPress compatibility
- Version bumping limited to SemVer format

## Related Agents

- [Release Agent](../release/) — Multi-repo release orchestration
- [Changelog Agent](../changelog/) — Automatic changelog generation
- [Linting Agent](../../.github/scripts/linting/) — Code quality validation

## License

GPL-2.0+ (same as WordPress)

---

**Contributing:** See [AGENTS.md](../../AGENTS.md) for contribution guidelines.

**Questions?** Refer to test files for detailed usage examples.

## Repository Flow

```mermaid
graph LR
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```
