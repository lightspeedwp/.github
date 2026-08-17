---
title: "Chat Closure Agent Design"
description: "Design specification for chat session closure and handoff workflow agent"
file_type: "design"
status: "active"
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
authors: ["Ash Shaw"]
tags: ["agents", "chat-closure", "architecture", "components"]
related_issues: ["#1809"]
---

# Chat Closure Agent — Design Specification

## Architecture Overview

```
User invokes /chat-closure
        ↓
[Core Analysis] — Extract git metadata, detect repo type
        ↓
[Project Linker] — Find active projects and related issues/PRs
        ↓
[Memory Updater] — Create memory entry (10-family YAML structure)
        ↓
[Handoff Builder] — Generate professional Markdown continuation prompt
        ↓
[Workspace Cleaner] — Safe worktree cleanup (with confirmation)
        ↓
Output: Continuation prompt + memory entry + cleanup status
```

## Component Design

### 1. Core Analysis (`core-analysis.js`)

**Responsibility:** Extract git metadata and detect repository type

**Inputs:**

- Current git branch
- Git worktree state (clean/dirty)
- Recent commits (last 20)
- Memory file state (`.remember/`)

**Outputs:**

```javascript
{
  branch: "feat/chat-closure-agent-implementation",
  isClean: false,
  stagedChanges: [...],
  uncommittedChanges: [...],
  recentCommits: [{hash, message, date, author}],
  relatedIssues: ["#1809", "#1810"],
  repoType: "control-plane" | "wordpress-plugin" | "wordpress-theme",
  memoryState: {...}
}
```

**Key Functions:**

- `parseBranchName()` → Extract type, scope, title
- `detectRepoType()` → Identify repo context
- `getRecentCommits()` → Parse git history
- `extractIssueNumbers()` → Find issue references
- `analyzeGitState()` → Clean vs dirty detection

### 2. Project Linker (`project-linker` skill)

**Responsibility:** Discover active projects and related issues/PRs

**Repo-Type Adaptation:**

| Repo Type | Discovery Method |
|-----------|------------------|
| Control-plane | Scan `.github/projects/active/{slug}/README.md` |
| WordPress plugin | Parse plugin metadata comments |
| WordPress theme | Parse theme.json metadata |

**Outputs:**

```javascript
{
  projects: [{name, path, relatedIssues}],
  issues: [{number, title, status}],
  prs: [{number, title, status}]
}
```

### 3. Memory Updater (`memory-updater.js`)

**Responsibility:** Create memory entries with proper structure

**Memory Structure (10 families):**

1. `user_defaults` — User conventions
2. `project_context` — Project scope & status
3. `decision_log` — Implementation decisions
4. `risks_blockers` — Blockers & uncertainties
5. `execution_state` — Progress & pending tasks
6. `qa_gates` — Test results & validation
7. `tool_runtime_constraints` — Tool limits
8. `compliance_privacy` — Data handling
9. `output_preferences` — Format expectations
10. `handoff` — Continuation context

**Memory Entry Format:**

```yaml
---
name: session-closure-2026-08-12
description: "Chat closure for chat-closure-agent Phase 1"
metadata:
  type: project
  session_id: chat-cont-abc123
  related_issues: ["#1809", "#1810"]
  created_date: 2026-08-12
---

## project_context
[project scope & status]

## decision_log
[key decisions made]

## execution_state
[completion status, pending tasks]

## handoff
[continuation context]
```

**Outputs:**

- New memory file (`.remember/{id}-closure-{date}.md`)
- Updated `MEMORY.md` index
- Links: memory→GitHub issues (one-way)

### 4. Continuation Prompt Builder (`continuation-prompt-builder.js`)

**Responsibility:** Generate professional handoff markdown

**Output Format:**

```markdown
# Continuation Prompt — [Chat Title]

## Context Summary
[1-2 sentence summary of work & focus]

## Active Projects
- [Project](link): Brief scope

## Related Issues
| Issue | Type | Status |
|-------|------|--------|
| #1809 | Epic | 🟢 Open |

## Related PRs
| PR | Title | Status |
|----|-------|--------|
| #1801 | feat: Planning & Setup | 🟡 Review |

## Current Branch Status
- Commits ahead: N
- Staged changes: [list]
- Uncommitted: [list]

## Key Memory Updates
- ✅ Decision 1 summary
- ⏳ Pending task 1

## Continuation Tasks
1. Next task
2. Following task

## Reference Materials
- [Project README](link)
- [Related Issue](link)
```

**Test Coverage:** 85%+ (Markdown generation, link formatting, table rendering)

### 5. Workspace Cleaner (`workspace-cleaner.js`)

**Responsibility:** Safe worktree cleanup with user confirmation

**Workflow:**

1. Detect git state (clean/dirty)
2. If dirty: offer stash or commit
3. Generate cleanup checklist
4. **Ask user before deleting** ← Safety confirmation
5. Delete worktree (if confirmed)
6. Document cleanup path

**Outputs:**

- Cleanup status (stashed/committed/preserved)
- Worktree path (for manual cleanup if needed)
- Manual cleanup command: `git worktree remove <path>`

## Repo-Type Detection & Adaptation

```
Detect repo type
        ↓
Control-plane?
├─ YES → Look for .github/projects/active/, labels.yml
└─ NO  → WordPress plugin?
         ├─ YES → Look for plugin.php, composer.json
         └─ NO  → WordPress theme?
                  └─ YES → Look for style.css, theme.json
```

**Shared Logic:** Core components (git analysis, memory, handoff) work identically across all repo types.

## Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Tier 1 portable agent | Reusable across repos |
| **Testing** | Jest 30.4+ | 85%+ coverage target |
| **Documentation** | Markdown + Mermaid | Accessibility + diagrams |
| **Memory** | 10-family YAML | Structured, extensible |
| **Skills** | Provider-agnostic | Claude/Copilot/OpenAI support |

## Integration Points

### Existing Systems

- **Memory system** (`.remember/`, `MEMORY.md`) — Existing manual handoff
- **Memory schemas** (`/.schemas/memory/`) — 10-family structure
- **GitHub API** — Issue/PR discovery via commits
- **Git worktree** — Session branch state

### Standards Alignment

- `AGENT_STANDARDS.md` — Tier 1 multi-file agent pattern
- `SKILLS_STANDARDS.md` — Reusable skill structure
- `TESTING.md` — Jest framework & coverage targets
- `CLAUDE.md` — Repository governance & branching rules

## Success Metrics

✅ **Code Quality:** ≥85% test coverage (Jest)  
✅ **Functionality:** Works on all 3 repo types  
✅ **Usability:** Clear, actionable output; safe prompts  
✅ **Documentation:** 3+ Mermaid diagrams, complete guides  

## Related Documents

- **Proposal:** [proposal.md](./proposal.md)
- **Implementation Spec:** [spec.md](./specs/chat-closure-agent/spec.md)
- **GitHub Issue:** [#1809 Epic](https://github.com/lightspeedwp/.github/issues/1809)
- **Project:** [chat-closure-agent-2026-08-12](../)

---

**OpenSpec Coordination:** This design is tracked in `openspec/changes/chat-closure-agent/` with GitHub issue #1809.
