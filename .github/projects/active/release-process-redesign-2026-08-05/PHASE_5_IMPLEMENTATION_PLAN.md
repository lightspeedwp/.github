---
file_type: documentation
title: "Phase 5 Implementation Plan — Portable Agent Architecture"
description: "Detailed implementation roadmap for Phase 5 (Portable agents for multi-repo release management)"
status: active
version: "1.0"
last_updated: "2026-08-09"
owners: ["Ash Shaw"]
tags: ["implementation", "phase-5", "agents", "portable", "release"]
category: "release-engineering"
---

# Phase 5 Implementation Plan

**Release Process V2: Portable Agent Architecture**

---

## Overview

Phase 5 implements the portable agent architecture that enables release automation across multiple repository types (control plane, WordPress plugins, WordPress themes).

**Phase 5 Scope:** Create reusable, multi-repo capable release agents in `agents/release/` and `agents/changelog/` with comprehensive repo-type detection, version management, and changelog handling.

**Timeline:** 3-4 days (estimated 2026-08-10 through 2026-08-13)

**Success Metric:** All portable agents complete, tested across all repo types, and ready for integration into Phase 6-7 work.

---

## Validation Against OpenSpec Specification

This plan directly implements requirements from [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md):

| Requirement | Task(s) | Status |
|------------|---------|--------|
| F2: Multi-repo version detection | CHILD-023 | Planned |
| F5: Changelog validation (2-gate) | CHILD-024 | Planned |
| F7: Portable release agents | CHILD-023, CHILD-024 | Planned |
| NF2: Documentation accuracy | Agent README files | Planned |

**Validation Result:** ✅ All 3 functional requirements covered by Phase 5 tasks.

---

## Task Breakdown

### CHILD-023: Build `agents/release/` (Portable Release Agent)

**Objective:** Create a portable, production-grade release agent that works across all repository types.

**Timeline:** 2 days

**Agent Structure:**

```
agents/release/
├── README.md (agent documentation)
├── package.json (dependencies)
├── release.agent.js (main agent - ESM)
└── includes/
    ├── versionManager.cjs (repo detection, version bumping)
    ├── repoDetector.cjs (detect repo type)
    ├── gitOps.cjs (git operations)
    ├── githubOps.cjs (GitHub API)
    └── tests/
        ├── versionManager.test.js
        ├── repoDetector.test.js
        └── integration.test.js
```

#### 1. Repo Type Detection (`repoDetector.cjs`)

**Responsibility:** Detect repository type and structure

**Supported Types:**

```javascript
// Control Plane (.github)
{
  type: 'control-plane',
  versionFiles: ['VERSION', 'package.json'],
  workspace: '.github',
}

// WordPress Plugin
{
  type: 'plugin',
  versionFiles: ['VERSION', 'plugin-file.php', 'readme.txt', 'package.json'],
  pluginFile: 'plugin-file.php',
  readmeFile: 'readme.txt',
}

// WordPress Theme
{
  type: 'theme',
  versionFiles: ['VERSION', 'style.css', 'package.json'],
  styleFile: 'style.css',
}
```

**Functions:**

```javascript
detectRepoType()
  → { type: 'control-plane' | 'plugin' | 'theme', ... }

getVersionFiles(repoType)
  → ['VERSION', 'package.json', ...]

isValidRepoStructure()
  → boolean

getMainFile()
  → 'plugin-file.php' | 'style.css' | null
```

#### 2. Version Manager (`versionManager.cjs`)

**Responsibility:** Detect, validate, and bump all version files

**Key Functions:**

```javascript
detectAllVersionFiles()
  → {
      VERSION: { path: 'VERSION', current: '1.2.3' },
      packageJson: { path: 'package.json', current: '1.2.3' },
      plugin: { path: 'my-plugin.php', current: '1.2.3' },  // actual detected path
      theme: { path: 'style.css', current: '1.2.3' },
      readme: { path: 'readme.txt', current: '1.2.3' }
    }

validateVersionConsistency()
  → { isConsistent: boolean, mismatches: [...] }

bumpVersion(scope)
  → { old: '1.2.3', new: '1.2.4', scope: 'patch' }

applyVersionBump(newVersion, repoType)
  → { updated: ['VERSION', 'package.json', ...], success: true }

readVersionFile(path)
  → '1.2.3'

writeVersionFile(path, version)
  → boolean

getCurrentVersion()
  → '1.2.3'

getNextVersion(scope)
  → '1.2.4'
```

**Version File Requirements (per repo type):**

**Control Plane:**

- REQUIRED: VERSION
- REQUIRED: package.json
- OPTIONAL: none

**WordPress Plugin:**

- REQUIRED: VERSION
- REQUIRED: plugin header (any PHP file with plugin metadata)
- OPTIONAL: readme.txt
- OPTIONAL: package.json

**WordPress Theme:**

- REQUIRED: VERSION
- REQUIRED: style.css (with CSS header metadata)
- OPTIONAL: package.json

**Implementation Details:**

- **VERSION file:** Plain text, no parsing needed
- **package.json:** Parse JSON, update `version` field
- **Plugin header:** Regex match `Version: X.Y.Z` in first 8KB of file (handle via wordpressUtils in Phase 6)
- **Theme CSS:** Regex match `Version: X.Y.Z` in first CSS comment block (handle via wordpressUtils in Phase 6)
- **readme.txt:** Regex match `Stable tag: X.Y.Z` (handle via wordpressUtils in Phase 6)

**Validation:**

- All REQUIRED files must exist and be readable
- All found version files must contain consistent versions (same X.Y.Z)
- New version must be valid SemVer (X.Y.Z)
- All version files must be writable before bumping

#### 3. Git Operations (`gitOps.cjs`)

**Responsibility:** Git-level operations (commits, branches, tags)

**Key Functions:**

```javascript
createBranch(branchName)
  → boolean

checkoutBranch(branchName)
  → boolean

getCurrentBranch()
  → 'release/v1.2.3'

isWorkingTreeClean()
  → boolean

stageFiles(files)
  → boolean

commitChanges(message, author)
  → { commit: 'abc123', message: '...' }

createTag(tagName, message)
  → boolean

deleteTag(tagName)
  → boolean

deleteRemoteTag(tagName, remote)
  → boolean

push(branch, remote)
  → boolean

getLatestTag()
  → 'v1.2.3'

getCommitsSince(tag)
  → [ { sha: '...', message: '...' }, ... ]
```

**Implementation Details:**

- Use Node.js `child_process.execSync()` for git commands
- All git operations must be logged (for audit trail)
- Error messages must be clear and actionable

#### 4. GitHub Operations (`githubOps.cjs`)

**Responsibility:** GitHub API interactions (PRs, releases, etc.)

**Key Functions:**

```javascript
createPullRequest(options)
  → { number: 42, url: 'https://...', ... }

mergePullRequest(prNumber)
  → boolean

createGitHubRelease(options)
  → { id: '...', url: 'https://...' }

deleteGitHubRelease(releaseId)
  → boolean

getGitHubUser()
  → { login: 'ash', name: 'Ash Shaw', ... }

listPullRequests(state)
  → [ { number: 42, title: '...' }, ... ]
```

**Implementation Details:**

- Use GitHub CLI (`gh`) or GitHub API
- Require authentication token in environment
- Handle rate limiting gracefully

#### 5. Main Agent (`release.agent.js`)

**Responsibility:** Orchestrate the entire release process

**Key Functions:**

```javascript
async releaseWorkflow(options)
  1. Validate authorization (from Phase 4)
  2. Detect repo type
  3. Get all version files
  4. Validate version consistency
  5. Bump versions
  6. Create changelog entry
  7. Commit version bump
  8. Create PR to develop
  9. Return PR info (user merges manually)
  10. On develop merge, create PR from develop to main
  11. On main merge, create tag + release
  12. Send notification
```

**Agent Inputs:**

```javascript
{
  scope: 'patch' | 'minor' | 'major',
  dryRun: boolean,
  message: string,
}
```

**Agent Outputs:**

```javascript
{
  currentVersion: '1.2.3',
  newVersion: '1.2.4',
  prDevelop: { number: 42, url: '...' },
  prMain: { number: 43, url: '...' },
  tag: 'v1.2.4',
  release: { id: '...', url: '...' },
  status: 'success' | 'partial' | 'failed',
  message: '...',
}
```

---

### CHILD-024: Build `agents/changelog/` (Changelog Agent)

**Objective:** Create a reusable changelog management agent with validation and formatting.

**Timeline:** 2 days

**Agent Structure:**

```
agents/changelog/
├── README.md (agent documentation)
├── package.json (dependencies)
├── changelog.agent.js (main agent - ESM)
└── includes/
    ├── changelogValidator.cjs (validation rules)
    ├── changelogFormatter.cjs (formatting)
    ├── keepAChangelogParser.cjs (parser)
    └── tests/
        ├── changelogValidator.test.js
        └── integration.test.js
```

#### 1. Changelog Validator (`changelogValidator.cjs`)

**Responsibility:** Validate changelog entries against rules

**Two-Gate Validation:**

**Gate 1 (On PR to develop):**

```javascript
validateEntryFormat(entry)
  ✓ Title < 60 chars
  ✓ Description < 150 chars
  ✓ Em-dash (—) not hyphen (-)
  ✓ PR link exists (#123)
  ✓ No duplicate previous releases
```

**Gate 2 (At Release Time):**

```javascript
validateChangelogStructure()
  ✓ Schema matches Keep a Changelog 1.1.0
  ✓ [Unreleased] section exists
  ✓ [Unreleased] has entries
  ✓ No empty sections
  ✓ All links valid
```

**Key Functions:**

```javascript
validateEntryFormat(entry)
  → { valid: boolean, errors: [...] }

validateChangelogStructure(filepath)
  → { valid: boolean, errors: [...] }

validateNoFormattingIssues(entry)
  → { valid: boolean, errors: [...] }

getValidationErrors(entry)
  → ['Title too long', 'Em-dash missing', ...]
```

#### 2. Changelog Formatter (`changelogFormatter.cjs`)

**Responsibility:** Auto-fix formatting issues when possible

**Key Functions:**

```javascript
formatEntry(entry)
  → {
      title: <formatted with em-dashes>,
      description: <formatted with em-dashes>,
      prLink: <preserved as-is>,
      formatted: true
    }

enforceEmDash(proseText)
  → prose text with only hyphens in hyphenated words
      converted to em-dashes (NOT in URLs, code, or lists)

truncateTitle(title)
  → title truncated to 60 chars (after em-dash conversion)

truncateDescription(description)
  → description truncated to 150 chars (after em-dash conversion)

extractPRLink(text)
  → '#123' or null (PR link reference, preserved as-is)

formatPRLink(prNumber)
  → '#123' (never modified by em-dash normalization)
```

#### 3. Keep a Changelog Parser (`keepAChangelogParser.cjs`)

**Responsibility:** Parse and manipulate Keep a Changelog format

**Key Functions:**

```javascript
parseChangelog(filepath)
  → { 
      unreleased: [...entries],
      releases: { 'v1.2.3': [...entries], ... },
      dates: { 'v1.2.3': '2026-08-09', ... }
    }

getUnreleasedEntries()
  → [{ title, description, prLink }, ...]

convertUnreleasedToRelease(version, date)
  → updated changelog content

getChangelogExcerpt(version)
  → changelog text for that release

appendEntry(entry)
  → updated changelog content

writeChangelog(filepath, content)
  → boolean
```

#### 4. Main Agent (`changelog.agent.js`)

**Responsibility:** Orchestrate changelog validation and processing

**Key Functions:**

```javascript
async validateChangelog(options)
  1. Parse CHANGELOG.md
  2. Validate structure (Gate 1 or Gate 2)
  3. Return validation result with errors/warnings

async processChangelog(version, date)
  1. Parse CHANGELOG.md
  2. Convert [Unreleased] to [version]
  3. Update date
  4. Write back to file
  5. Return updated content
```

**Agent Inputs:**

```javascript
{
  gate: 1 | 2,  // 1 = PR validation, 2 = release validation
  entry: { ... },  // for Gate 1
  version: 'v1.2.4',  // for Gate 2
  date: '2026-08-09',  // for Gate 2
}
```

**Agent Outputs:**

```javascript
{
  valid: boolean,
  errors: [...],
  warnings: [...],
  updated: boolean,
  content: '...',  // for write back
}
```

---

## Implementation Order

### Day 1-2: Core Agent Infrastructure

**Deliverables:**

1. [ ] `agents/release/includes/repoDetector.cjs` — repo type detection
2. [ ] `agents/release/includes/versionManager.cjs` — version file management
3. [ ] `agents/release/includes/gitOps.cjs` — git operations
4. [ ] `agents/release/includes/githubOps.cjs` — GitHub API

**Testing:**

- Unit tests for each module
- Test matrix: control plane + plugin + theme

### Day 3: Main Agents

**Deliverables:**

1. [ ] `agents/release/release.agent.js` — main release agent
2. [ ] `agents/changelog/changelog.agent.js` — main changelog agent
3. [ ] Complete agent READMEs

**Testing:**

- Integration tests for both agents
- End-to-end test on control plane repo

### Day 4: Polish & Validation

**Deliverables:**

1. [ ] All unit tests passing (80%+ coverage)
2. [ ] All integration tests passing
3. [ ] Agent documentation complete
4. [ ] Error messages clear and actionable

---

## Testing Strategy

### Unit Tests (Per Module)

Each module has comprehensive unit tests:

```javascript
// repoDetector.test.js
✓ Detects control-plane repos
✓ Detects plugin repos (finds plugin file)
✓ Detects theme repos (finds style.css)
✓ Detects mixed WordPress repos
✓ Returns error for invalid repos

// versionManager.test.js
✓ Reads all version files correctly
✓ Validates consistency (all match)
✓ Fails on mismatched versions
✓ Bumps patch version (1.2.3 → 1.2.4)
✓ Bumps minor version (1.2.3 → 1.3.0)
✓ Bumps major version (1.2.3 → 2.0.0)
✓ Writes all files simultaneously
✓ Handles pre-release versions (if supported: -alpha, -beta, -rc1)

// gitOps.test.js
✓ Creates and checks out branch
✓ Stages files
✓ Creates commit with message
✓ Creates tag locally
✓ Validates clean working tree

// githubOps.test.js
✓ Creates pull request
✓ Merges pull request
✓ Creates GitHub Release
✓ Deletes GitHub Release
```

### Integration Tests

```javascript
// Full workflow tests
✓ Release workflow (repo detection → version bump → commit)
✓ Multi-repo release (control plane + plugin + theme)
✓ Changelog validation (Gate 1 + Gate 2)
✓ Error recovery (validation failure handling)
```

### End-to-End Tests

```javascript
✓ Control plane release (dry-run + live)
✓ Plugin release (detect plugin, bump all files)
✓ Theme release (detect theme, bump all files)
```

---

## Success Criteria (Phase 5)

✅ **Phase 5 is successful when:**

1. **Portable Release Agent Complete**
   - [ ] Repo type detection working for all types
   - [ ] Version file management working
   - [ ] Git operations functional
   - [ ] GitHub API integration working

2. **Changelog Agent Complete**
   - [ ] Validation working (both gates)
   - [ ] Formatting working
   - [ ] Processing working

3. **Testing Comprehensive**
   - [ ] All unit tests passing (80%+ coverage)
   - [ ] All integration tests passing
   - [ ] E2E tests passing (all repo types)

4. **Documentation Complete**
   - [ ] Agent READMEs comprehensive
   - [ ] API documentation clear
   - [ ] Usage examples provided

5. **Ready for Next Phases**
   - [ ] Agents can be integrated into Phase 6 (WordPress)
   - [ ] Agents can be integrated into Phase 7 (docs rewrite)

---

## Deliverables Checklist

- [ ] `agents/release/README.md` (comprehensive documentation)
- [ ] `agents/release/package.json` (dependencies)
- [ ] `agents/release/release.agent.js` (main agent)
- [ ] `agents/release/includes/repoDetector.cjs` (repo detection)
- [ ] `agents/release/includes/versionManager.cjs` (version management)
- [ ] `agents/release/includes/gitOps.cjs` (git operations)
- [ ] `agents/release/includes/githubOps.cjs` (GitHub API)
- [ ] `agents/release/includes/tests/` (unit + integration tests)
- [ ] `agents/changelog/README.md` (comprehensive documentation)
- [ ] `agents/changelog/package.json` (dependencies)
- [ ] `agents/changelog/changelog.agent.js` (main agent)
- [ ] `agents/changelog/includes/changelogValidator.cjs` (validation)
- [ ] `agents/changelog/includes/changelogFormatter.cjs` (formatting)
- [ ] `agents/changelog/includes/keepAChangelogParser.cjs` (parsing)
- [ ] `agents/changelog/includes/tests/` (unit + integration tests)
- [ ] All tests passing (unit + integration + E2E)
- [ ] Coverage reports (80%+ target)

---

## References

- **Specification:** [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md) (F2, F5, F7)
- **Architecture:** [MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md)
- **Phase 4 Context:** [PHASE_4_IMPLEMENTATION_PLAN.md](./PHASE_4_IMPLEMENTATION_PLAN.md)
- **Keep a Changelog Format:** <https://keepachangelog.com/en/1.1.0/>

---

*Phase 5 Implementation Plan — Created 2026-08-09*  
*Status: READY FOR EXECUTION*  
*Estimated Timeline: 3-4 days (2026-08-10 through 2026-08-13)*
