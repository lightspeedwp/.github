---
title: "Git Metadata Extractor"
description: "Extract git metadata (commits, branch, issues) for handoff context"
name: git-metadata-extractor
version: 1.0.1
created_date: 2026-08-12T00:00:00.000Z
last_updated: '2026-08-21'
authors:
  - Ash Shaw
maintainer: Ash Shaw
tags:
  - git
  - metadata
  - extraction
  - handoff
---

# Git Metadata Extractor Skill

## Overview

Extracts commit history, branch information, and related issue numbers from a git repository. This skill provides structured metadata for building handoff prompts, tracking work completed in a session, and generating project context for AI systems.

## When to Use

- Generating handoff/continuation prompts for ongoing work
- Tracking work completed in a session
- Building project context for AI systems
- Analyzing repository state changes
- Discovering related GitHub issues from commit messages

## Input Parameters

### Required

- **repoPath** — Path to git repository (default: `"."`)

### Optional

- **commitCount** — Number of recent commits to analyze (default: `20`)

## Output Format

```javascript
{
  branch: "feat/chat-closure-agent-impl",
  parsedBranch: {
    type: "feat",
    scope: "chat-closure",
    title: "agent-impl"
  },
  repoType: "control-plane",
  commits: [
    {
      hash: "abc123",
      message: "feat: Add feature (#1234)",
      author: "John Doe",
      date: "2026-08-12T10:00:00Z"
    }
  ],
  issueNumbers: ["#1234"],
  gitState: {
    isClean: true,
    staged: [],
    uncommitted: [],
    hasChanges: false
  },
  memoryState: {
    exists: true,
    indexExists: true,
    files: ["session-1234.md"],
    lastUpdated: "2026-08-12T09:00:00Z"
  },
  timestamp: "2026-08-12T11:00:00Z"
}
```

## Usage Examples

### Basic Usage

```javascript
const { analyzeRepository } = require('./shared/core-analysis')

const metadata = analyzeRepository('.')
console.log(`Branch: ${metadata.branch}`)
console.log(`Repo type: ${metadata.repoType}`)
console.log(`Related issues: ${metadata.issueNumbers.join(', ')}`)
```

### Extract Branch Information

```javascript
const { parseBranchName, getCurrentBranch } = require('./shared/core-analysis')

const branch = getCurrentBranch('.')
const parsed = parseBranchName(branch)
console.log(`Feature: ${parsed.scope}`)
```

### Get Commit History

```javascript
const { getRecentCommits } = require('./shared/core-analysis')

const commits = getRecentCommits('.', 10)
commits.forEach(c => {
  console.log(`${c.hash} — ${c.message} (${c.author})`)
})
```

### Find Related Issues

```javascript
const { getRecentCommits, extractIssueNumbers } = require('./shared/core-analysis')

const commits = getRecentCommits('.')
const issues = extractIssueNumbers(commits)
console.log(`Found issues: ${issues.join(', ')}`)
```

### Detect Repository Type

```javascript
const { detectRepoType } = require('./shared/core-analysis')

try {
  const type = detectRepoType('.')
  console.log(`This is a ${type} repository`)
  // Output: "This is a control-plane repository"
} catch (error) {
  console.error(`Repository type could not be determined: ${error.message}`)
}
```

### Check Git State

```javascript
const { analyzeGitState } = require('./shared/core-analysis')

const state = analyzeGitState('.')
if (state.isClean) {
  console.log('Working directory is clean')
} else {
  console.log(`Staged: ${state.staged.length} files`)
  console.log(`Modified: ${state.uncommitted.length} files`)
}
```

### Check Memory System

```javascript
const { readMemoryState } = require('./shared/core-analysis')

const memory = readMemoryState('.')
if (memory.exists) {
  console.log(`Found ${memory.files.length} memory entries`)
  console.log(`Last updated: ${memory.lastUpdated}`)
}
```

## Supported Repository Types

| Type | Indicators | Use Case |
|------|-----------|----------|
| **control-plane** | `.github/projects/active/` + `.github/labels.yml` | LightSpeed `.github` repository |
| **wordpress-plugin** | `plugin.php` + `composer.json` | WordPress plugin repository |
| **wordpress-theme** | `style.css` + `theme.json` | WordPress theme repository |

## Branch Name Format

Expected format: `{type}/{scope}-{title}`

**Examples:**

- `feat/chat-closure-agent-impl` → { type: "feat", scope: "chat-closure", title: "agent-impl" }
- `fix/memory-yaml-parsing` → { type: "fix", scope: "memory", title: "yaml-parsing" }
- `docs/testing-guide-updates` → { type: "docs", scope: "testing", title: "guide-updates" }

**Valid prefixes:** feat, fix, hotfix, chore, docs, ci, test, refactor, security, perf, build, deps, design, a11y, ux, ops, etc.

## Error Handling

This skill throws errors in these scenarios:

- **Invalid branch name format** — Branch doesn't match `{type}/{scope}-{title}` pattern
- **Unknown repository type** — No marker files detected for any supported type
- **Git command failures** — Repository is not a valid git repository
- **File system errors** — Memory directory cannot be read

### Example Error Handling

```javascript
const coreAnalysis = require('./shared/core-analysis')

try {
  const metadata = coreAnalysis.analyzeRepository('.')
} catch (error) {
  if (error.message.includes('Invalid branch name')) {
    console.error('Branch must follow convention: feat/{scope}-{title}')
  } else if (error.message.includes('Unknown repository type')) {
    console.error('Repository type not supported')
  } else {
    console.error(`Analysis failed: ${error.message}`)
  }
}
```

## Integration with Memory System

The skill checks for existing memory system state:

```javascript
const { readMemoryState } = require('./shared/core-analysis')

const metadata = coreAnalysis.analyzeRepository('.')
if (metadata.memoryState.exists) {
  // Memory system is active
  const memoryEntries = metadata.memoryState.files
  console.log(`Previous entries: ${memoryEntries.length}`)
}
```

## Testing

This skill includes Jest unit tests with 90%+ coverage:

```bash
npm test -- core-analysis.test.js
```

Test fixtures are available in `tests/fixtures/`:

- `sample-branches.json` — Valid/invalid branch examples
- `sample-commits.json` — Sample commit messages
- `mock-repos/` — Mock control-plane, plugin, and theme repos

## Related Skills

- **project-linker** — Find active projects and issues for a repository
- **continuation-prompt-builder** — Generate handoff prompts from metadata
- **memory-updater** — Update memory system with session context

## Version History

### v1.0.0 (2026-08-12)

- Initial release
- Support for control-plane, WordPress plugins, WordPress themes
- Branch parsing, repo detection, commit history extraction
- Memory system integration

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
