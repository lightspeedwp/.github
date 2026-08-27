---
title: "Chat Closure Agent — Implementation Phases"
description: "Detailed breakdown of 4-week implementation plan with milestones and deliverables"
version: "1.0.0"
created_date: "2026-08-12"
last_updated: "2026-08-12"
file_type: documentation
authors: ["Ash Shaw"]
maintainer: "Ash Shaw"
tags: ["implementation-plan", "phases", "timeline"]
---

# Chat Closure Agent — Implementation Phases

## Overview Timeline

```
Week 1         Week 2         Week 3         Week 4
[Phase 1]      [Phase 2]      [Phase 3]      [Phase 4]
Core Comp.     Memory+        Cleanup+       Docs+
               Handoff        Agent Shell    Testing
```

---

## Phase 1: Core Components (Week 1)

**Goal:** Implement and test core git analysis and metadata extraction

### Deliverables

| Deliverable | File(s) | Status |
|-------------|---------|--------|
| Agent directory structure | `agents/chat-closure-agent/` | ⏳ In Progress |
| Core analysis logic | `shared/core-analysis.js` | ⏳ To Do |
| Unit tests (90%+ coverage) | `tests/core-analysis.test.js` | ⏳ To Do |
| Git metadata skill | `skills/git-metadata-extractor.md` | ⏳ To Do |
| Test fixtures | `tests/fixtures/mock-repos/` | ⏳ To Do |

### Tasks

#### Task 1.1: Create Directory Structure

**Responsibility:** Setup  
**Duration:** 30 min  
**Checklist:**

- [ ] Create `agents/chat-closure-agent/` directory
- [ ] Create subdirectories: `claude/`, `shared/`, `skills/`, `tests/`, `tests/fixtures/`, `examples/`, `docs/`
- [ ] Create placeholder files (README.md, AGENT.md)

#### Task 1.2: Implement Core Analysis

**Responsibility:** Implementation  
**Duration:** 4-5 hours  
**Checklist:**

- [ ] Parse git branch (extract type, scope, title)
- [ ] Detect repo type (control-plane, plugin, theme)
- [ ] Extract recent commits (last 20, with messages)
- [ ] Find related issues (grep for #XXXX in commits)
- [ ] Read memory files (.remember/MEMORY.md, existing entries)
- [ ] Output structured metadata object

**Key Functions:**

```javascript
parseBranchName(branchName) → {type, scope, title}
detectRepoType(repoPath) → "control-plane" | "wordpress-plugin" | "wordpress-theme"
getRecentCommits(repoPath, count) → [{hash, message, date, author}]
extractIssueNumbers(commits) → ["#1731", "#1733", ...]
readMemoryState(repoPath) → {files, index, lastUpdated}
analyzeGitState(repoPath) → {branch, isClean, staged, uncommitted}
```

#### Task 1.3: Create Test Fixtures

**Responsibility:** Testing  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] Create mock control-plane git repo
- [ ] Create mock WordPress plugin repo
- [ ] Create mock WordPress theme repo
- [ ] Add sample branches, commits, memory files
- [ ] Document fixture usage in testing guide

**Fixture Structure:**

```
tests/fixtures/
├── mock-repos/
│   ├── control-plane/          # Mock .github repo
│   │   ├── .git/
│   │   ├── .github/
│   │   │   └── projects/active/
│   │   └── .remember/
│   ├── wordpress-plugin/       # Mock plugin repo
│   │   ├── .git/
│   │   ├── plugin.php
│   │   └── composer.json
│   └── wordpress-theme/        # Mock theme repo
│       ├── .git/
│       ├── style.css
│       └── theme.json
├── sample-branches.json        # Branch names and metadata
├── sample-commits.json         # Commit messages, authors, dates
└── sample-memory/              # Memory entry examples
```

#### Task 1.4: Write Unit Tests

**Responsibility:** Testing  
**Duration:** 3-4 hours  
**Checklist:**

- [ ] Test branch name parsing (valid/invalid formats)
- [ ] Test repo type detection (all 3 types)
- [ ] Test issue extraction from commits
- [ ] Test memory file reading
- [ ] Test git state detection (clean/dirty)
- [ ] Test error handling (missing files, invalid git state)
- [ ] Achieve 90%+ coverage

**Test Coverage:**

```javascript
describe("core-analysis.js", () => {
  // Branch parsing
  test("parseBranchName with valid feat branch", ...)
  test("parseBranchName with invalid format throws", ...)
  
  // Repo detection
  test("detectRepoType recognizes control-plane", ...)
  test("detectRepoType recognizes wordpress-plugin", ...)
  test("detectRepoType recognizes wordpress-theme", ...)
  test("detectRepoType throws on unknown type", ...)
  
  // Issue extraction
  test("extractIssueNumbers finds all issue references", ...)
  test("extractIssueNumbers returns empty array when none found", ...)
  
  // Git state
  test("analyzeGitState detects clean repo", ...)
  test("analyzeGitState detects dirty repo", ...)
  test("analyzeGitState lists staged and uncommitted changes", ...)
  
  // Memory
  test("readMemoryState reads existing memory files", ...)
  test("readMemoryState handles missing memory directory", ...)
  
  // Integration
  test("full analysis produces correct metadata object", ...)
})
```

#### Task 1.5: Implement Git Metadata Skill

**Responsibility:** Implementation  
**Duration:** 2 hours  
**Checklist:**

- [ ] Create `skills/git-metadata-extractor.md`
- [ ] Document purpose, inputs, outputs
- [ ] Document when to use (other agents needing git context)
- [ ] Provide reusable examples

**SKILL.md Template:**

```yaml
---
name: git-metadata-extractor
description: "Extract git metadata (commits, branch, issues) for handoff context"
version: 1.0.0
---

# Git Metadata Extractor Skill

## Overview
Extracts commit history, branch information, and related issue numbers from a git repository.

## When to Use
- Generating handoff/continuation prompts
- Tracking work completed in a session
- Building project context for AI systems

## Inputs
- `repoPath` — Path to git repository
- `commitCount` — Number of recent commits to analyze (default: 20)

## Outputs
- `metadata` object with: branch, commits, issueNumbers, repoType, gitState

## Usage Examples
[Examples with real code...]
```

### Milestone Checklist

- [ ] Phase 1 directory structure created
- [ ] Core analysis implemented and tested
- [ ] 90%+ unit test coverage achieved
- [ ] Fixtures for all repo types working
- [ ] Git metadata skill documented
- [ ] All tests passing: `npm test -- core-analysis`

### Success Criteria

✅ `npm test` shows ≥90% coverage for core-analysis.js  
✅ All 3 repo types correctly detected  
✅ Issue extraction works from commit messages  
✅ Memory files read without errors  

---

## Phase 2: Memory & Handoff (Week 2)

**Goal:** Implement memory system integration and continuation prompt generation

### Deliverables

| Deliverable | File(s) | Status |
|-------------|---------|--------|
| Memory updater | `shared/memory-updater.js` | ⏳ To Do |
| Continuation prompt builder | `shared/continuation-prompt-builder.js` | ⏳ To Do |
| Project linker skill | `skills/project-linker.md` | ⏳ To Do |
| Unit tests | `tests/memory-updater.test.js`, `tests/continuation-prompt.test.js` | ⏳ To Do |
| Test fixtures | `tests/fixtures/sample-projects/`, `tests/fixtures/sample-memory/` | ⏳ To Do |

### Tasks

#### Task 2.1: Implement Memory Updater

**Responsibility:** Implementation  
**Duration:** 3-4 hours  
**Checklist:**

- [ ] Read existing memory index (MEMORY.md)
- [ ] Extract session metadata (branch, commits, decisions)
- [ ] Create new memory entry with 10-family YAML structure
- [ ] Populate: project_context, decision_log, execution_state, handoff families
- [ ] Format links: memory→issues (one-way)
- [ ] Validate against memory schema if available
- [ ] Update MEMORY.md index with new entry
- [ ] Handle conflicts (duplicate entries, existing data)

**Key Functions:**

```javascript
readMemoryIndex(repoPath) → {files: [], entries: []}
createMemoryEntry(metadata) → {id, frontmatter, families}
validateMemoryEntry(entry) → boolean
formatMemoryLinks(issues, prs) → {text, frontmatter}
updateMemoryIndex(repoPath, newEntry) → success
```

**Memory Structure:**

```yaml
---
name: session-closure-2026-08-12
description: "Chat closure for chat-closure-agent Phase 1"
metadata:
  type: project
  session_id: chat-cont-abc123
  related_issues: ["#1851", "#1852"]
  related_prs: ["#1774"]
  created_date: 2026-08-12
  branch: feat/chat-closure-agent-implementation
---

# Session Closure — Chat Closure Agent Phase 1

## user_defaults
(What user preferences do we know?)
- Prefers moderate-depth handoffs (summary + links, not full recap)
- Likes clear Mermaid diagrams with accessibility
- Uses GitHub issue #-references extensively

## project_context
- **Project**: Chat Closure Agent (Tier 1 portable agent)
- **Scope**: Control-plane + WordPress (plugins + themes)
- **Phase**: 1 (Core Components)
- **Status**: Completed core analysis & tests

## decision_log
- ✅ Chose Tier 1 portable agent (reusable across repos)
- ✅ Chose moderate memory depth (summary + links)
- ✅ Chose one-way memory→issue linking (no issue clutter)
- ✅ Chose ask-before-delete for worktree cleanup

## execution_state
- ✅ Phase 1 completed (core-analysis.js + tests)
- ⏳ Phase 2 in progress (memory + handoff)
- ⏳ Phase 3 waiting (cleanup + agent shell)
- ⏳ Phase 4 waiting (docs + testing)

## handoff
**Summary**: Chat Closure Agent project implementing automated session handoff workflows. Completed core git analysis phase with 90%+ test coverage. Proceeding with memory system integration and handoff prompt generation.

**Next steps**:
1. Implement memory-updater.js (10-family YAML structure)
2. Implement continuation-prompt-builder.js (Markdown generation)
3. Complete Phase 2 integration tests
4. Begin Phase 3 (workspace cleanup)
```

#### Task 2.2: Implement Continuation Prompt Builder

**Responsibility:** Implementation  
**Duration:** 3-4 hours  
**Checklist:**

- [ ] Accept metadata object (from core-analysis)
- [ ] Extract context summary (1-2 sentences from branch name + commits)
- [ ] Format active projects as bulleted list with links
- [ ] Format issues/PRs as Markdown tables
- [ ] Add branch status section (commits ahead, staged/uncommitted)
- [ ] Summarize key memory updates (decisions, blockers, next steps)
- [ ] Generate Markdown continuation prompt
- [ ] Test Markdown formatting (tables, links, headers)

**Key Functions:**

```javascript
buildContinuationPrompt(metadata) → {title, sections, markdown}
extractSummary(metadata) → string (1-2 sentences)
formatProjectsList(projects) → markdown
formatIssuesTable(issues) → markdown
formatPRsTable(prs) → markdown
formatBranchStatus(metadata) → markdown
summarizeMemoryUpdates(memoryEntry) → [string, string, ...]
```

**Output Format:**

```markdown
# Continuation Prompt — Chat Closure Agent Implementation

**Session:** {session_id}
**Branch:** feat/chat-closure-agent-implementation
**Date:** 2026-08-12

## Context Summary
Implementing Tier 1 portable agent for automated chat session closure. Completed core git analysis and metadata extraction with 90%+ test coverage. Next: memory system integration and handoff prompt generation.

## Active Projects
- [Chat Closure Agent](../) — Phase 1 (Core Components) complete, Phase 2 in progress

## Related Issues
| Issue | Type | Status |
|-------|------|--------|
| #1850 | Epic | 🟢 Open |
| #1851 | Task | 🟡 In Progress |

## Related PRs
| PR | Title | Status |
|----|-------|--------|
| (None submitted yet) | | |

## Current Branch Status
- **Branch:** feat/chat-closure-agent-implementation
- **Commits ahead:** 2
- **Staged changes:** agent/, tests/, docs/
- **Uncommitted changes:** None

## Key Memory Updates
- ✅ Core analysis implemented with 90%+ test coverage
- ✅ All 3 repo types (control-plane, plugin, theme) detected correctly
- ⏳ Memory updater implementation in progress

## Continuation Tasks
1. Implement memory-updater.js (3-4 hours)
2. Implement continuation-prompt-builder.js (3-4 hours)
3. Complete Phase 2 integration tests (2-3 hours)
4. Begin Phase 3 workspace cleanup implementation

## Reference Materials
- [Project README](./)
- [Decision Log](./DECISIONS.md)
- [Implementation Phases](./PHASES.md)
- [Active Issue #1850](../../issues/1850)
```

#### Task 2.3: Implement Project Linker Skill

**Responsibility:** Implementation  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] Create `skills/project-linker.md`
- [ ] Document project discovery logic per repo type
- [ ] Control-plane: scan `.github/projects/active/*/README.md`
- [ ] WordPress: parse plugin/theme metadata
- [ ] Validate projects exist before including
- [ ] Provide reusable examples

#### Task 2.4: Write Memory & Handoff Tests

**Responsibility:** Testing  
**Duration:** 3-4 hours  
**Checklist:**

- [ ] Test memory entry creation with valid frontmatter
- [ ] Test 10-family YAML structure population
- [ ] Test memory index updates
- [ ] Test issue/PR link formatting
- [ ] Test conflict detection (duplicate entries)
- [ ] Test Markdown table generation
- [ ] Test continuation prompt completeness
- [ ] Achieve 90%+ coverage for memory-updater, 85%+ for prompt-builder

### Milestone Checklist

- [ ] Memory updater implemented and tested (90%+ coverage)
- [ ] Continuation prompt builder implemented and tested (85%+ coverage)
- [ ] Project linker skill documented
- [ ] Sample memory fixtures created
- [ ] Integration tests for memory→prompt workflow
- [ ] All tests passing: `npm test -- memory updater continuation`

### Success Criteria

✅ Memory entries created with valid 10-family YAML structure  
✅ Markdown tables render correctly in generated prompts  
✅ Links format correctly (relative repo paths)  
✅ Coverage ≥85% for memory and prompt builder  

---

## Phase 3: Cleanup & Agent Shell (Week 3)

**Goal:** Implement workspace cleanup and finalize agent orchestration

### Deliverables

| Deliverable | File(s) | Status |
|-------------|---------|--------|
| Workspace cleaner | `shared/workspace-cleaner.js` | ⏳ To Do |
| AGENT.md spec | `AGENT.md` | ⏳ To Do |
| Claude implementation | `claude/prompt.md`, `claude/config.json` | ⏳ To Do |
| Integration tests | `tests/integration.test.js` | ⏳ To Do |

### Tasks

#### Task 3.1: Implement Workspace Cleaner

**Responsibility:** Implementation  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] Detect git state (clean vs dirty)
- [ ] If uncommitted: offer stash or commit
- [ ] Generate cleanup checklist
- [ ] Prompt user before deleting worktree
- [ ] Provide manual cleanup command if user declines
- [ ] Document worktree path prominently

#### Task 3.2: Create AGENT.md Specification

**Responsibility:** Implementation  
**Duration:** 1-2 hours  
**Checklist:**

- [ ] YAML frontmatter (name, version, providers, capabilities)
- [ ] Purpose section
- [ ] Capabilities & limitations
- [ ] Input/output format
- [ ] Supported repo types
- [ ] Workflow diagram (high-level)

#### Task 3.3: Implement Claude Prompt & Config

**Responsibility:** Implementation  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] Write Claude-specific agent prompt
- [ ] Define available tools/skills
- [ ] Set model/temperature parameters
- [ ] Define input/output format for Claude
- [ ] Create config.json with provider settings

#### Task 3.4: Write Integration Tests

**Responsibility:** Testing  
**Duration:** 3-4 hours  
**Checklist:**

- [ ] Full workflow test (control-plane repo)
- [ ] Full workflow test (WordPress plugin)
- [ ] Full workflow test (WordPress theme)
- [ ] Dirty worktree test (uncommitted → stash/commit)
- [ ] Memory index update test
- [ ] Continuation prompt generation test
- [ ] All tests passing

### Milestone Checklist

- [ ] Workspace cleaner implemented (85%+ coverage)
- [ ] AGENT.md specification complete
- [ ] Claude implementation working
- [ ] Integration tests for all 3 repo types
- [ ] Full workflow validated end-to-end
- [ ] All tests passing: `npm test -- integration`

### Success Criteria

✅ Full workflow executes without errors (all 3 repo types)  
✅ Worktree deletion prompts user for confirmation  
✅ Memory entry created and indexed correctly  
✅ Continuation prompt generated and formatted correctly  
✅ ≥85% coverage for all components  

---

## Phase 4: Documentation & Testing (Week 4)

**Goal:** Complete comprehensive documentation with Mermaid diagrams and achieve full test coverage

### Deliverables

| Deliverable | File(s) | Status |
|-------------|---------|--------|
| ARCHITECTURE.md | `docs/ARCHITECTURE.md` | ⏳ To Do |
| USAGE_GUIDE.md | `docs/USAGE_GUIDE.md` | ⏳ To Do |
| TESTING_GUIDE.md | `docs/TESTING_GUIDE.md` | ⏳ To Do |
| Example workflow | `examples/sample-closure-workflow.md` | ⏳ To Do |
| Coverage audit | Test output report | ⏳ To Do |
| PR submission | GitHub PR with full test output | ⏳ To Do |

### Tasks

#### Task 4.1: Write ARCHITECTURE.md

**Responsibility:** Documentation  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] High-level workflow diagram (Mermaid)
- [ ] Component interaction diagram (Mermaid)
- [ ] Repo-type detection & adaptation diagram (Mermaid)
- [ ] Component descriptions and responsibilities
- [ ] Tech stack rationale
- [ ] Integration points with existing systems
- [ ] Accessibility descriptions on all diagrams

#### Task 4.2: Write USAGE_GUIDE.md

**Responsibility:** Documentation  
**Duration:** 1-2 hours  
**Checklist:**

- [ ] Installation steps
- [ ] Basic invocation (invoke `/chat-closure` skill)
- [ ] Options & customization
- [ ] Output interpretation guide
- [ ] Example workflows (control-plane, plugin, theme)
- [ ] Troubleshooting section

#### Task 4.3: Write TESTING_GUIDE.md

**Responsibility:** Documentation  
**Duration:** 1-2 hours  
**Checklist:**

- [ ] How to run tests locally
- [ ] Test file organization and structure
- [ ] How to add new test fixtures
- [ ] Coverage report interpretation
- [ ] CI/CD integration notes
- [ ] Common test scenarios and patterns

#### Task 4.4: Create Example Workflow

**Responsibility:** Documentation  
**Duration:** 1-2 hours  
**Checklist:**

- [ ] Before state (git, memory, projects)
- [ ] Running `/chat-closure` invocation
- [ ] After state (generated prompt, memory, cleanup)
- [ ] Real-world narrative showing full workflow
- [ ] Multiple examples (control-plane, plugin, theme)

#### Task 4.5: Coverage Audit & Final Testing

**Responsibility:** Testing  
**Duration:** 2-3 hours  
**Checklist:**

- [ ] Run full test suite: `npm test`
- [ ] Generate coverage report: `npm run test:coverage`
- [ ] Verify ≥85% overall coverage
- [ ] Document coverage by component
- [ ] Fix any failing tests
- [ ] Run linting: `npm run lint`

#### Task 4.6: Create PR & Submit

**Responsibility:** Integration  
**Duration:** 1 hour  
**Checklist:**

- [ ] Ensure branch is up to date: `git rebase develop`
- [ ] All tests passing locally: `npm test`
- [ ] Coverage ≥85%: `npm run test:coverage`
- [ ] Linting passed: `npm run lint`
- [ ] Commit all changes (including test output)
- [ ] Create PR with summary:

  ```
  ## Summary
  - Chat Closure Agent implementation (Tier 1 portable agent)
  - Supports control-plane, WordPress plugins, WordPress themes
  - 4 core components: analysis, memory, handoff, cleanup
  - Full test coverage (85%+) with Jest
  - Comprehensive documentation with Mermaid diagrams
  
  ## Test Plan
  - ✅ Unit tests: core-analysis, memory-updater, prompt-builder, cleaner
  - ✅ Integration tests: full workflow (all 3 repo types)
  - ✅ Fixtures: control-plane, plugin, theme repos
  - ✅ Coverage: 85%+ overall
  ```

- [ ] Link to issue #1850 (epic)

### Milestone Checklist

- [ ] ARCHITECTURE.md complete with 3+ Mermaid diagrams
- [ ] USAGE_GUIDE.md complete with examples
- [ ] TESTING_GUIDE.md complete with instructions
- [ ] Example workflow shows end-to-end closure
- [ ] Coverage audit shows ≥85% coverage
- [ ] All linting passed
- [ ] PR submitted and ready for review

### Success Criteria

✅ ARCHITECTURE.md has 3+ Mermaid diagrams with accessibility  
✅ Documentation covers all repo types and workflows  
✅ Test coverage report shows ≥85% line coverage  
✅ Example workflow demonstrates real-world usage  
✅ PR passes all CI checks  

---

## Overall Timeline & Milestones

| Week | Phase | Key Milestone | Status |
|------|-------|--------------|--------|
| 1 | Core Analysis | Core-analysis.js 90%+ tested, fixtures ready | ⏳ In Progress |
| 2 | Memory & Handoff | Memory updater + prompt builder 85%+ tested | ⏳ To Do |
| 3 | Cleanup & Agent | Full integration tests passing all repo types | ⏳ To Do |
| 4 | Docs & Testing | Coverage 85%+, PR submitted | ⏳ To Do |

---

## Resource Allocation

| Component | Estimated Hours | Person | Status |
|-----------|-----------------|--------|--------|
| Phase 1: Core Analysis | 12-15 | Ash | ⏳ In Progress |
| Phase 2: Memory & Handoff | 12-15 | Ash | ⏳ To Do |
| Phase 3: Cleanup & Agent | 8-10 | Ash | ⏳ To Do |
| Phase 4: Docs & Testing | 8-10 | Ash | ⏳ To Do |
| **Total** | **40-50 hours** | — | — |

---

## Success Metrics

- ✅ **Code quality**: ≥85% test coverage
- ✅ **Documentation**: 3+ Mermaid diagrams, all sections complete
- ✅ **Functionality**: Full workflow works on all 3 repo types
- ✅ **Usability**: Clear, actionable output; safe cleanup prompts
- ✅ **Maintainability**: Modular components, reusable skills
