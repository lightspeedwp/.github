---
name: chat-closure-agent
title: Chat Closure Agent
description: Automate session handoff workflows across control-plane and WordPress repositories
version: 1.0.1
type: agent
tier: 1
status: production
providers:
  - claude
  - copilot
  - openai
created_date: 2026-08-12T00:00:00.000Z
last_updated: '2026-08-21'
authors:
  - Ash Shaw
maintainer: Ash Shaw
tags:
  - automation
  - session-closure
  - handoff
  - memory
  - git
  - portable
capabilities:
  - git-analysis
  - memory-integration
  - continuation-prompts
  - workspace-cleanup
  - project-discovery
  - issue-linking
supported_repos:
  - control-plane
  - wordpress-plugin
  - wordpress-theme
dependencies:
  - git (command-line)
  - nodejs (>=14.0.0)
  - jest (for testing)
external_apis:
  - GitHub API (optional, for issue enrichment)
repository: https://github.com/lightspeedwp/.github/tree/main/agents/chat-closure-agent
documentation: https://github.com/lightspeedwp/.github/tree/main/agents/chat-closure-agent#readme
---

# Chat Closure Agent

**Automate session handoff workflows with automatic memory updates, continuation prompts, and safe workspace cleanup.**

## Overview

The Chat Closure Agent streamlines the process of closing long-running chat sessions by automating:

1. **Git Analysis** — Extract branch info, commits, issues from current worktree
2. **Memory Updates** — Create structured 10-family YAML memory entries
3. **Continuation Prompts** — Generate professional handoff documentation
4. **Workspace Cleanup** — Safely clean up or delete worktrees with confirmation

## Features

### ✅ Multi-Repository Support

- **Control-Plane** (`.github` repos) — Project discovery, workflow analysis
- **WordPress Plugins** — Plugin metadata parsing, composer.json analysis
- **WordPress Themes** — Theme metadata parsing, theme.json analysis

### ✅ Comprehensive Session Context

- Git branch info (type, scope, commits ahead)
- Issue/PR discovery from commits
- Active project linking
- Memory system integration (10-family YAML structure)
- Professional continuation prompts

### ✅ Safe Workspace Cleanup

- Validation before cleanup
- Configurable stash/commit options
- User confirmation callbacks
- Detailed status reporting
- Non-destructive operations

### ✅ Portable & Reusable

- Tier 1 multi-file agent structure
- Provider-agnostic core logic
- Provider-specific implementations (Claude/Copilot/OpenAI)
- Installable in other LightSpeedWP repos

## Component Architecture

### Core Modules

| Module | Purpose | LOC |
|--------|---------|-----|
| `shared/core-analysis.js` | Git metadata extraction | 285 |
| `shared/memory-updater.js` | Memory system integration | 336 |
| `shared/continuation-prompt-builder.js` | Handoff prompt generation | 278 |
| `shared/workspace-cleaner.js` | Safe workspace cleanup | 360 |

### Skills

| Skill | Purpose |
|-------|---------|
| `skills/git-metadata-extractor.md` | Git analysis patterns |
| `skills/project-linker.md` | Project & issue discovery |

### Provider Implementations

| File | Provider | Purpose |
|------|----------|---------|
| `claude/prompt.md` | Claude | Agent implementation |
| `copilot/prompt.md` | Copilot | Agent implementation |
| `openai/prompt.md` | OpenAI | Agent implementation |

## Usage

### Quick Start (Claude)

```javascript
const coreAnalysis = require('./shared/core-analysis');
const memoryUpdater = require('./shared/memory-updater');
const promptBuilder = require('./shared/continuation-prompt-builder');
const workspaceCleaner = require('./shared/workspace-cleaner');

// 1. Analyze current repository
const analysis = coreAnalysis.analyzeRepository('.');

// 2. Update memory with closure info
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  decisions: { 'memory-depth': { choice: 'Moderate', rationale: '...' } },
  nextSteps: ['Phase 3 implementation', 'Final documentation'],
});

// 3. Build continuation prompt
const prompt = promptBuilder.buildContinuationPrompt(analysis, {
  memory: memory.entry.families,
});

// 4. Clean up worktree (optional)
const cleanup = workspaceCleaner.cleanupWorktree('.', process.env.PWD, {
  autoStash: true,
  deleteAfterCleanup: false,
  confirmationCallback: (details) => {
    console.log(`Cleanup required:`, details);
    return true; // Confirm cleanup
  },
});
```

### Input Parameters

**Core Analysis Options**

```javascript
analyzeRepository(repoPath, options = {})
// Returns: {
//   branch, parsedBranch, repoType,
//   issueNumbers, commits, gitState
// }
```

**Memory Updater Options**

```javascript
updateMemoryForSessionClosure(repoPath, coreAnalysisData, {
  sessionId: 'session-123',
  decisions: { 'key': { choice: '...', rationale: '...' } },
  blockers: ['...'],
  nextSteps: ['...'],
  projectNames: ['...']
})
```

**Continuation Prompt Options**

```javascript
buildContinuationPrompt(coreAnalysisData, {
  sessionId: 'session-123',
  projects: [],
  issues: [],
  prs: [],
  memory: {}
})
```

**Workspace Cleaner Options**

```javascript
cleanupWorktree(repoPath, worktreePath, {
  autoStash: false,
  autoCommit: false,
  deleteAfterCleanup: false,
  confirmationCallback: (details) => boolean
})
```

### Output Formats

**Memory Entry (YAML)**

```yaml
---
name: chat-closure-session-123
description: Chat closure for session ending on 2026-08-12
metadata:
  type: handoff
  session_id: session-123
  branch: feat/implementation
  repo_type: control-plane
  related_issues: ['#1850', '#1851']
  timestamp: 2026-08-12T18:00:00Z
---

## User Defaults
- Prefers moderate-depth handoffs...
```

**Continuation Prompt (Markdown)**

```markdown
# Continuation Prompt — Chat Session Handoff

**Session ID:** session-123
**Created:** 2026-08-12T18:00:00Z
**Branch:** feat/implementation

## Context Summary
Working on implementing chat closure agent...

## Active Projects
- [Chat Closure Agent](../../issues/1850) — Automate session handoffs
```

**Cleanup Report**

```
# Workspace Cleanup Report

**Status:** ✅ Success
**Time:** 2026-08-12T18:00:00Z → 2026-08-12T18:00:10Z

## Steps Executed

✅ **validate_safety** — Valid
✅ **stash_changes** — Changes stashed successfully
✅ **user_confirmation** — User confirmed cleanup
✅ **delete_worktree** — Worktree deleted successfully
```

## Testing

### Unit Tests (95+ tests)

```bash
# Run all tests
npm test -- agents/chat-closure-agent/tests/

# Run specific module
npm test -- agents/chat-closure-agent/tests/workspace-cleaner.test.js

# Run with coverage
npm test -- agents/chat-closure-agent/tests/ --coverage
```

### Test Coverage Targets

| Module | Target | Status |
|--------|--------|--------|
| core-analysis.js | 90%+ | ✅ |
| memory-updater.js | 90%+ | ✅ |
| continuation-prompt-builder.js | 85%+ | ✅ |
| workspace-cleaner.js | 85%+ | ✅ |

## Integration with Memory System

The agent integrates with the 10-family YAML memory structure:

```yaml
metadata:         # Agent tracking
user_defaults:    # User preferences
project_context:  # Work scope
decision_log:     # Decisions made
execution_state:  # Work progress
handoff:          # Continuation info
```

Memory entries are indexed in `.remember/MEMORY.md`:

```markdown
- [chat-closure-session-123](./chat-closure-session-123.md) — Session 123 handoff
```

## Provider Implementations

### Claude (`claude/prompt.md`)

- Full agent implementation with multi-turn conversation
- Orchestrates all core modules
- Handles errors and edge cases
- Provides user feedback and confirmations

### Copilot (`copilot/prompt.md`)

- OpenAI API compatible implementation
- Function calling interface
- Streaming support
- Error recovery

### OpenAI (`openai/prompt.md`)

- Native OpenAI Chat API implementation
- Tool use integration
- Structured output parsing
- Rate limiting handling

## File Structure

```
agents/chat-closure-agent/
├── AGENT.md                           # This file
├── README.md                          # Quick reference
├── shared/
│   ├── core-analysis.js               # ✅ Phase 1
│   ├── memory-updater.js              # ✅ Phase 2
│   ├── continuation-prompt-builder.js # ✅ Phase 2
│   └── workspace-cleaner.js           # ✅ Phase 3
├── claude/
│   ├── prompt.md                      # ⏳ Phase 3
│   └── config.json
├── copilot/
│   ├── prompt.md
│   └── config.json
├── openai/
│   ├── prompt.md
│   └── config.json
├── skills/
│   ├── git-metadata-extractor.md      # ✅ Phase 1
│   └── project-linker.md              # ✅ Phase 2
├── tests/
│   ├── core-analysis.test.js          # ✅ Phase 1
│   ├── memory-updater.test.js         # ✅ Phase 2
│   ├── continuation-prompt.test.js    # ✅ Phase 2
│   ├── phase-2-integration.test.js    # ✅ Phase 2
│   ├── workspace-cleaner.test.js      # ✅ Phase 3
│   ├── integration.test.js            # ⏳ Phase 3
│   └── fixtures/
├── docs/
│   ├── ARCHITECTURE.md                # ⏳ Phase 4
│   ├── USAGE_GUIDE.md                 # ⏳ Phase 4
│   └── TESTING_GUIDE.md               # ⏳ Phase 4
└── examples/
    └── sample-closure-workflow.md     # ⏳ Phase 4
```

## Development Status

| Phase | Component | Status | Tests |
|-------|-----------|--------|-------|
| 1 | Core Analysis | ✅ Complete | 29/29 |
| 2 | Memory & Handoff | ✅ Complete | 58/58 |
| 3 | Workspace Cleaner | ✅ Complete | 14/14 |
| 3 | AGENT.md | ⏳ In Progress | — |
| 3 | claude/prompt.md | ⏳ In Progress | — |
| 3 | Integration Tests | ⏳ Planned | — |
| 4 | Documentation | ⏳ Planned | — |

## Related Resources

- [Chat Closure Agent Project](../.github/projects/active/chat-closure-agent-2026-08-12/README.md)
- [Memory System Documentation](./.remember/)
- [AGENTS.md](../../AGENTS.md) — Global AI governance
- [AGENT_STANDARDS.md](../../docs/AGENT_STANDARDS.md) — Agent creation standards

## License

Part of the LightSpeedWP `.github` repository. See LICENSE for details.

## Support

For issues, questions, or contributions:

1. Check [existing GitHub issues](https://github.com/lightspeedwp/.github/issues)
2. Create a new issue with the `agent:chat-closure` label
3. Reference this agent by name in discussions

---

**Last Updated:** 2026-08-12  
**Maintainer:** Ash Shaw  
**Status:** Production Ready (Core Modules)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
