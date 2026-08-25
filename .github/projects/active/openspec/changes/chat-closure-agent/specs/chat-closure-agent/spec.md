# Chat Closure Agent — Implementation Specification

## Overview

This specification details the complete implementation of the Chat Closure Agent across 4 phases (40-50 hours) with ≥85% test coverage.

**GitHub Issue Tracking:**

- Epic: [#1809](https://github.com/lightspeedwp/.github/issues/1809) — Chat Closure Agent Implementation
- Phase 1: [#1810](https://github.com/lightspeedwp/.github/issues/1810) — Core Analysis
- Phase 2: [#1811](https://github.com/lightspeedwp/.github/issues/1811) — Memory & Handoff
- Phase 3: [#1812](https://github.com/lightspeedwp/.github/issues/1812) — Cleanup & Agent Shell
- Phase 4: [#1813](https://github.com/lightspeedwp/.github/issues/1813) — Documentation & Testing

## Phase 1: Core Analysis (Week 1) — Issue #1810

### Deliverables

**Implementation:**

- `agents/chat-closure-agent/shared/core-analysis.js` (300-400 lines)
- `agents/chat-closure-agent/skills/git-metadata-extractor.md`

**Testing:**

- `agents/chat-closure-agent/tests/core-analysis.test.js` (400+ lines, 90%+ coverage)
- Test fixtures: control-plane, plugin, theme mock repos

**Coverage Targets:**

- Branch parsing: 90%+ (valid/invalid formats)
- Repo detection: 90%+ (all 3 types)
- Issue extraction: 90%+ (git log parsing)
- Git state detection: 90%+ (clean/dirty)
- Error handling: 85%+

### Key Functions

```javascript
parseBranchName(name) → {type, scope, title}
detectRepoType(path) → "control-plane"|"plugin"|"theme"
getRecentCommits(path, count) → [{hash, msg, date}]
extractIssueNumbers(commits) → ["#1809", ...]
analyzeGitState(path) → {isClean, staged, uncommitted}
readMemoryState(path) → {files, index, lastUpdated}
```

### Success Criteria

✅ 90%+ unit test coverage  
✅ All 3 repo types detected correctly  
✅ Issue extraction from commits working  
✅ Memory files read without errors  

## Phase 2: Memory & Handoff (Week 2) — Issues #1811

### Deliverables

**Implementation:**

- `agents/chat-closure-agent/shared/memory-updater.js` (300-400 lines)
- `agents/chat-closure-agent/shared/continuation-prompt-builder.js` (250-350 lines)
- `agents/chat-closure-agent/skills/project-linker.md`
- `agents/chat-closure-agent/skills/handoff-documenter.md`

**Testing:**

- `agents/chat-closure-agent/tests/memory-updater.test.js` (400+ lines, 90%+ coverage)
- `agents/chat-closure-agent/tests/continuation-prompt.test.js` (300+ lines, 85%+ coverage)
- Test fixtures: sample memory entries, projects, commit histories

**Coverage Targets:**

- Memory creation: 90%+
- YAML structure: 90%+ (all 10 families)
- Index updates: 90%+
- Markdown generation: 85%+
- Link formatting: 85%+

### Key Functions

```javascript
// Memory Updater
createMemoryEntry(metadata) → {id, frontmatter, families}
updateMemoryIndex(path, entry) → success
validateMemoryEntry(entry) → boolean
formatMemoryLinks(issues, prs) → {text, frontmatter}

// Prompt Builder
buildContinuationPrompt(metadata) → markdown
extractSummary(metadata) → string (1-2 sentences)
formatProjectsList(projects) → markdown table
formatIssuesTable(issues) → markdown table
formatBranchStatus(metadata) → markdown
```

### Success Criteria

✅ 90%+ memory updater coverage  
✅ 85%+ prompt builder coverage  
✅ All memory families populated correctly  
✅ Markdown tables render correctly  
✅ Links format with relative paths  

## Phase 3: Cleanup & Agent Shell (Week 3) — Issue #1812

### Deliverables

**Implementation:**

- `agents/chat-closure-agent/shared/workspace-cleaner.js` (200-300 lines)
- `agents/chat-closure-agent/AGENT.md` (spec + capabilities)
- `agents/chat-closure-agent/claude/prompt.md` (agent instructions)
- `agents/chat-closure-agent/claude/config.json` (provider config)

**Testing:**

- `agents/chat-closure-agent/tests/workspace-cleaner.test.js` (300+ lines, 85%+ coverage)
- `agents/chat-closure-agent/tests/integration.test.js` (500+ lines)
- Integration tests: all 3 repo types, dirty worktree scenarios

**Coverage Targets:**

- Git state detection: 85%+
- Cleanup workflow: 85%+
- User prompts: 85%+
- Integration (full workflow): 80%+

### Key Functions

```javascript
detectGitState(path) → {isClean, changes}
generateCommitMessage(metadata) → string
promptUserForDeletion(path) → boolean
generateCleanupChecklist(state) → string[]
executeCleanup(path, confirmed) → result
```

### Integration Test Scenarios

1. **Control-plane repo:**
   - Create branch → Make changes → Run closure
   - Verify: prompt, memory, cleanup status

2. **WordPress plugin repo:**
   - Similar, but verify plugin-specific project detection

3. **Dirty worktree:**
   - Uncommitted changes → Closure → Verify stash/commit

4. **Memory integration:**
   - Update memory → Closure → Verify index updated

### Success Criteria

✅ 85%+ workspace cleaner coverage  
✅ Full workflow works (all 3 repo types)  
✅ User confirmation prompts working  
✅ Integration tests passing  

## Phase 4: Documentation & Testing (Week 4) — Issue #1813

### Deliverables

**Documentation:**

- `agents/chat-closure-agent/docs/ARCHITECTURE.md` (3+ Mermaid diagrams)
- `agents/chat-closure-agent/docs/USAGE_GUIDE.md` (invocation, examples)
- `agents/chat-closure-agent/docs/TESTING_GUIDE.md` (test patterns, fixtures)
- `agents/chat-closure-agent/examples/sample-closure-workflow.md` (real-world demo)

**Testing:**

- Full coverage audit: ≥85% overall
- Coverage report generation
- All pre-existing tests passing

**Mermaid Diagrams (Accessibility Required):**

1. High-level workflow (5-6 steps)
2. Component interaction (tree structure)
3. Repo-type detection & adaptation (decision tree)

### Success Criteria

✅ ARCHITECTURE.md with 3+ Mermaid diagrams  
✅ USAGE_GUIDE.md with real examples  
✅ TESTING_GUIDE.md with test patterns  
✅ Overall coverage ≥85%  
✅ All documentation passes linting  

## Test Strategy

### Unit Tests (Jest)

- **core-analysis.js:** 90%+ coverage
- **memory-updater.js:** 90%+ coverage
- **continuation-prompt-builder.js:** 85%+ coverage
- **workspace-cleaner.js:** 85%+ coverage

### Integration Tests

- Full workflow (all 3 repo types)
- Dirty worktree scenarios
- Memory update verification
- Branch status detection

### Fixtures

- Mock git repos (control-plane, plugin, theme)
- Mock projects (`.github/projects/active/*/README.md`)
- Mock memory entries (`.remember/*.md`)
- Sample branches, commits, commit histories

### Test Commands

```bash
npm test                          # Run all tests
npm run test:watch              # Watch mode
npm run test:coverage           # Coverage report
npm run test:integration        # Integration tests only
```

## Quality Standards

| Metric | Target | Method |
|--------|--------|--------|
| Line coverage | ≥85% | Jest --coverage |
| Branch coverage | ≥85% | Jest --coverage |
| Unit test coverage | 90%+ per component | Jest --coverage |
| Integration tests | All 3 repo types | Jest integration suite |
| Code quality | Pass linting | npm run lint |
| Documentation | Complete | ARCHITECTURE, USAGE, TESTING guides |

## GitHub Issue Coordination

**Epic:** [#1809](https://github.com/lightspeedwp/.github/issues/1809)  
**Phase 1:** [#1810](https://github.com/lightspeedwp/.github/issues/1810)  
**Phase 2:** [#1811](https://github.com/lightspeedwp/.github/issues/1811)  
**Phase 3:** [#1812](https://github.com/lightspeedwp/.github/issues/1812)  
**Phase 4:** [#1813](https://github.com/lightspeedwp/.github/issues/1813)  

Each phase issue includes:

- Detailed acceptance criteria
- Estimated effort (hours)
- Related PRs and deliverables
- Completion checklist

## Files to Create

### Phase 1

- `agents/chat-closure-agent/AGENT.md`
- `agents/chat-closure-agent/shared/core-analysis.js`
- `agents/chat-closure-agent/tests/core-analysis.test.js`
- `agents/chat-closure-agent/skills/git-metadata-extractor.md`
- `agents/chat-closure-agent/tests/fixtures/` (mock repos)

### Phase 2

- `agents/chat-closure-agent/shared/memory-updater.js`
- `agents/chat-closure-agent/shared/continuation-prompt-builder.js`
- `agents/chat-closure-agent/tests/memory-updater.test.js`
- `agents/chat-closure-agent/tests/continuation-prompt.test.js`
- `agents/chat-closure-agent/skills/project-linker.md`
- `agents/chat-closure-agent/skills/handoff-documenter.md`

### Phase 3

- `agents/chat-closure-agent/shared/workspace-cleaner.js`
- `agents/chat-closure-agent/claude/prompt.md`
- `agents/chat-closure-agent/claude/config.json`
- `agents/chat-closure-agent/tests/workspace-cleaner.test.js`
- `agents/chat-closure-agent/tests/integration.test.js`

### Phase 4

- `agents/chat-closure-agent/docs/ARCHITECTURE.md`
- `agents/chat-closure-agent/docs/USAGE_GUIDE.md`
- `agents/chat-closure-agent/docs/TESTING_GUIDE.md`
- `agents/chat-closure-agent/examples/sample-closure-workflow.md`

---

**Total Estimated Effort:** 40-50 hours  
**Total Files:** 30-35  
**Total Lines of Code:** 2,000-2,500  
**Total Lines of Tests:** 1,500-2,000  
**Total Documentation:** 1,500+ lines  

**Related OpenSpec Documents:**

- [Proposal](../proposal.md)
- [Design](../design.md)
