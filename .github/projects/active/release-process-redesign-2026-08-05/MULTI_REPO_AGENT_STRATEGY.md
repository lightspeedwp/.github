---
title: Multi-Repo Release Agent Strategy
description: Architecture for portable release agents supporting .github control plane + WordPress plugins/themes
---

# Multi-Repo Release Agent Strategy

**Context:** The release process must serve multiple repo types with different versioning requirements.

---

## Problem Statement

Current release process is specific to `.github` control plane. But LightSpeedWP organization has:

1. **Control Plane** (.github) — Version in VERSION file only
2. **WordPress Block Plugins** — Version in:
   - VERSION file
   - Plugin header (Version: X.Y.Z)
   - readme.txt (Stable tag: X.Y.Z)
   - package.json (version: X.Y.Z)
3. **WordPress Block Themes** — Version in:
   - VERSION file
   - style.css header (Version: X.Y.Z)
   - package.json (version: X.Y.Z)

**Current Situation:** No unified release agent; each repo would need custom handling.

**Desired State:** Single portable release agent that handles all repo types.

---

## Solution: Portable Release Agent Architecture

### Directory Structure

```
agents/
├── release/
│   ├── release.agent.md          # Specification
│   ├── release.agent.js          # Main agent (portable)
│   ├── includes/
│   │   ├── releaseUtils.cjs      # Core utilities (detect repo type, version files)
│   │   ├── versionManager.cjs    # Version detection + bumping
│   │   ├── changelogManager.cjs  # Changelog processing
│   │   ├── gitOps.cjs            # Git operations (commit, tag, push)
│   │   ├── githubOps.cjs         # GitHub API (PR, Release)
│   │   ├── wordpressUtils.cjs    # WordPress-specific (plugin headers, etc.)
│   │   └── validators.cjs        # Validation helpers
│   └── __tests__/
│       ├── release.agent.test.js
│       ├── wordpressUtils.test.js
│       └── versionManager.test.js
│
└── changelog/
    ├── changelog.agent.md         # Specification
    ├── changelog.agent.js         # Main agent (portable)
    ├── includes/
    │   ├── changelogParser.cjs
    │   ├── changelogValidator.cjs
    │   └── changelogFormatters.cjs
    └── __tests__/
        └── changelog.agent.test.js
```

### Portable Agent Pattern

**Each agent is:**

- ✅ Repo-agnostic (detects repo type automatically)
- ✅ Framework-agnostic (pure Node, no build tool dependencies)
- ✅ Self-contained (all dependencies in includes/)
- ✅ Tested independently (unit + integration tests)
- ✅ Documented with spec (agent.md)
- ✅ Reusable (works across all LightSpeedWP repos)

---

## How It Works: Release Agent in Multi-Repo Context

### Step 1: Detect Repo Type

Release agent automatically detects which repo it's running in:

```javascript
function detectRepoType() {
  // Check for indicators
  if (fs.existsSync('plugin-file.php') && hasPluginHeader('plugin-file.php')) {
    return 'wordpress-plugin'
  }
  if (fs.existsSync('style.css') && hasThemeHeader('style.css')) {
    return 'wordpress-theme'
  }
  if (fs.existsSync('.github/workflows/release.yml')) {
    return 'github-control-plane'
  }
  throw new Error('Cannot determine repo type')
}
```

### Step 2: Get Version Files

Based on repo type, identify all version files:

```javascript
function getVersionFiles(repoType) {
  const baseFiles = ['VERSION']  // All repos have this
  
  if (repoType === 'wordpress-plugin') {
    return [
      'VERSION',
      'plugin-file.php',     // Check: Version: X.Y.Z header
      'readme.txt',          // Check: Stable tag: X.Y.Z line
      'package.json'         // Check: "version": "X.Y.Z"
    ]
  }
  
  if (repoType === 'wordpress-theme') {
    return [
      'VERSION',
      'style.css',           // Check: Version: X.Y.Z in header
      'package.json'         // Check: "version": "X.Y.Z"
    ]
  }
  
  if (repoType === 'github-control-plane') {
    return [
      'VERSION',
      'package.json'         // Optional
    ]
  }
}
```

### Step 3: Validate Version Consistency

Before bumping, verify all version files are in sync:

```javascript
function validateVersionConsistency(repoType) {
  const files = getVersionFiles(repoType)
  const versions = files.map(f => readVersion(f))
  
  const allMatch = versions.every(v => v === versions[0])
  
  if (!allMatch) {
    throw new Error(
      'Version mismatch!\n' +
      files.map((f, i) => `${f}: ${versions[i]}`).join('\n')
    )
  }
}
```

### Step 4: Bump All Version Files

Update all version files simultaneously:

```javascript
function bumpVersionInAllFiles(repoType, oldVersion, newVersion) {
  const files = getVersionFiles(repoType)
  
  files.forEach(f => {
    if (f === 'VERSION') {
      fs.writeFileSync(f, newVersion + '\n')
    }
    
    if (f === 'plugin-file.php') {
      replaceInFile(f, 
        `Version: ${oldVersion}`,
        `Version: ${newVersion}`)
    }
    
    if (f === 'style.css') {
      replaceInFile(f,
        `Version: ${oldVersion}`,
        `Version: ${newVersion}`)
    }
    
    if (f === 'readme.txt' && repoType === 'wordpress-plugin') {
      replaceInFile(f,
        `Stable tag: ${oldVersion}`,
        `Stable tag: ${newVersion}`)
    }
    
    if (f === 'package.json') {
      const pkg = JSON.parse(fs.readFileSync(f))
      pkg.version = newVersion
      fs.writeFileSync(f, JSON.stringify(pkg, null, 2) + '\n')
    }
  })
}
```

### Step 5: Commit & Tag

Create consistent commit across all repo types:

```javascript
async function createReleaseCommitAndTag(version, repoType) {
  // Stage version files
  const files = getVersionFiles(repoType)
  files.forEach(f => exec(`git add ${f}`))
  
  // Create commit
  const message = `chore(release): v${version}\n\nUpdated VERSION and version headers in ${getVersionFileNames(repoType).join(', ')}`
  exec(`git commit -m "${message}"`)
  
  // Create annotated tag
  exec(`git tag -a v${version} -m "Release version ${version}"`)
  
  // Push
  exec(`git push origin develop`)
  exec(`git push origin v${version}`)
}
```

---

## Changelog Agent Pattern

### Similar Multi-Repo Support

Changelog agent:

1. Detects repo type
2. Validates CHANGELOG.md (same format for all)
3. Supports repo-specific entry types (optional):
   - WordPress plugins: Installation, Activation notes
   - WordPress themes: Theme compatibility notes
   - Control plane: Workflow/automation notes

---

## Repo-Specific Configuration (Optional)

Each repo can have `.releaserc.js` for customization:

```javascript
// .releaserc.js
module.exports = {
  repoType: 'wordpress-plugin',  // auto-detected, can override
  
  versionFiles: [
    'VERSION',
    'my-custom-plugin.php',       // Custom plugin file name
    'readme.txt'
  ],
  
  hooks: {
    preRelease: async () => {
      // Run WordPress-specific checks
      await validatePluginStructure()
    },
    postRelease: async (version) => {
      // Deploy to WordPress.org
      await uploadToWordPressOrg(version)
    }
  }
}
```

---

## Usage Examples

### .github Control Plane

```bash
# In .github repo
node agents/release/release.agent.js --scope=patch

# Agent detects: github-control-plane
# Updates: VERSION
# Creates: release/v0.7.0 → develop PR → main PR → tag v0.7.0
```

### WordPress Plugin

```bash
# In wp-block-testimonials repo
node ../../.github/agents/release/release.agent.js --scope=minor

# Agent detects: wordpress-plugin
# Updates: VERSION, plugin-file.php (Version header), readme.txt (Stable tag), package.json
# Creates: release/v1.5.0 → develop PR → main PR → tag v1.5.0
# (Optional post-release: upload to WordPress.org)
```

### WordPress Theme

```bash
# In wp-block-theme repo
node ../../.github/agents/release/release.agent.js --scope=minor

# Agent detects: wordpress-theme
# Updates: VERSION, style.css (Version header), package.json
# Creates: release/v2.1.0 → develop PR → main PR → tag v2.1.0
```

---

## Shared Components (In `agents/release/includes/`)

### releaseUtils.cjs

- `detectRepoType()` — What kind of repo is this?
- `getVersionFiles(repoType)` — Which files need version updates?
- `readVersion(filePath)` — Extract current version from file
- `writeVersion(filePath, version)` — Update version in file

### versionManager.cjs

- `validateVersionConsistency(repoType)` — All version files in sync?
- `parseVersion(version)` — SemVer parsing
- `bumpVersion(version, scope)` — patch/minor/major bump
- `bumpAllVersionFiles(repoType, oldVersion, newVersion)` — Update all files

### changelogManager.cjs

- `validateChangelog(changelogPath)` — Schema validation
- `getUnreleasedEntries(changelogPath)` — What's in [Unreleased]?
- `rollChangelog(changelogPath, version)` — Move [Unreleased] → [X.Y.Z]
- `getChangelogSection(changelogPath, version)` — Extract section for GitHub Release

### wordpressUtils.cjs (New)

- `getPluginHeader(filePath)` — Read plugin file header
- `updatePluginHeader(filePath, field, value)` — Update Version/Author/etc.
- `getThemeHeader(cssPath)` — Read style.css header
- `updateThemeHeader(cssPath, field, value)` — Update Version/Theme URI/etc.
- `validatePluginStructure()` — Check plugin is well-formed
- `validateThemeStructure()` — Check theme is well-formed

### gitOps.cjs

- `createBranch(branch)` — Create release/vX.Y.Z
- `commitChanges(files, message)` — Stage + commit
- `pushBranch(branch)` — Push to origin
- `createTag(version, message)` — Create annotated tag
- `deleteTag(version)` — Remove tag (for rollback)

### githubOps.cjs

- `createPullRequest(branch, base, title, body)` — Create PR
- `mergePullRequest(prNumber)` — Merge PR
- `createGitHubRelease(version, body, prerelease)` — Create release
- `deleteGitHubRelease(version)` — Remove release (for rollback)

### validators.cjs

- `validateSemVer(version)` — Is it valid X.Y.Z format?
- `validateChangelogFormat(entry)` — Entry is valid?
- `validateGitStatus()` — Working tree clean?
- `validateBranchName(branch)` — Matches release/* pattern?

---

## Testing Strategy

Each agent tested across repo types:

```javascript
// agents/release/__tests__/release.agent.test.js

describe('Release Agent', () => {
  describe('github-control-plane repo', () => {
    it('should detect repo type correctly', () => {})
    it('should bump VERSION file only', () => {})
    it('should create GitHub Release', () => {})
  })
  
  describe('wordpress-plugin repo', () => {
    it('should detect repo type correctly', () => {})
    it('should bump all version files', () => {})
    it('should validate plugin headers', () => {})
    it('should update readme.txt Stable tag', () => {})
  })
  
  describe('wordpress-theme repo', () => {
    it('should detect repo type correctly', () => {})
    it('should bump all version files', () => {})
    it('should validate theme headers', () => {})
    it('should handle style.css versioning', () => {})
  })
  
  describe('error handling', () => {
    it('should fail if version files out of sync', () => {})
    it('should rollback on failure', () => {})
    it('should handle missing files gracefully', () => {})
  })
})
```

---

## Documentation Structure

For multi-repo support, documentation includes:

```
docs/
├── RELEASE_PROCESS.md (main, applies to all)
│   ├── Flow (same for all repos)
│   └── Pre-release checklist (same for all)
│
├── RELEASE_AUTOMATION.md (technical)
│   ├── Workflow YAML (same for all)
│   └── Agent details (portable)
│
├── RELEASE_WORDPRESS.md (NEW — WordPress-specific)
│   ├── Plugin version management
│   ├── Theme version management
│   ├── readme.txt format
│   └── WordPress.org integration
│
├── RELEASE_TROUBLESHOOTING.md (same for all)
│
└── CHANGELOG_AUTOMATION.md (same for all)

agents/
├── release/release.agent.md
│   ├── Overview (applies to all repos)
│   ├── Usage examples (per repo type)
│   └── Configuration (.releaserc.js)
│
└── changelog/changelog.agent.md
    └── Same approach
```

---

## Migration Path

### Phase 1: Build Portable Release Agent

- Create agents/release/ structure
- Implement core + WordPress support
- Test across .github, plugin, theme repos
- Update workflows to use portable agent

### Phase 2: Update All Repos

- Update .github/workflows/release.yml → use agents/release/
- Update plugin repos → use agents/release/
- Update theme repos → use agents/release/

### Phase 3: Consolidate Documentation

- Merge RELEASE_PROCESS.md (all repos use same flow)
- Create RELEASE_WORDPRESS.md (WordPress-specific details)
- Remove repo-specific release docs

---

## Benefits of This Approach

✅ **Single source of truth** — One release agent, not per-repo copies  
✅ **Consistency** — Same process across all repos  
✅ **Testability** — Test once, works everywhere  
✅ **Maintainability** — Bug fixes apply to all repos  
✅ **Extensibility** — Easy to add new repo types  
✅ **Portability** — Agents in agents/ folder, reusable organization-wide  
✅ **WordPress-native** — Understands plugin headers, theme CSS, readme.txt  

---

## Implementation Notes

**This questionnaire incorporates multi-repo thinking:**

- Q2 (Release target): Applies to all repos
- Q9 (Version determination): Handles scope + explicit version
- Q10 (VERSION file format): Single format for all repos
- Q17 (Authorization): Single authorization model across org
- Q38-50: Architecture supports all repo types

**When OpenSpec analyzes questionnaire:**

- Will generate specs for portable agents
- Will include WordPress plugin/theme examples
- Will outline directory structure (agents/release/, agents/changelog/)
- Will create test matrix (3 repo types × all scenarios)

---

## Prepopulated Questionnaire Impact

The prepopulated questionnaire (QUESTIONNAIRE_PREPOPULATED.md) incorporates:

✅ Multi-repo thinking (mentions plugins, themes)  
✅ Portable agent pattern (agents/ folder structure)  
✅ WordPress-specific version handling (plugin headers, readme.txt)  
✅ Changelog agent (separate from release agent)  
✅ Reusable skills (can be packaged together)  

**When you review QUESTIONNAIRE_PREPOPULATED.md, you'll see:**

- References to "WordPress Plugin", "WordPress Theme" in answers
- Version files discussion (plugin headers, style.css, readme.txt)
- Portable agent architecture in context
- Multi-repo support as core feature (not afterthought)

---

*Strategy Document Complete — Ready for OpenSpec Analysis*
