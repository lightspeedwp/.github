---
title: Chat Closure Agent
description: Automate chat session closure and handoff workflows
status: proposal
created_date: 2026-08-12
---

## Why

Chat sessions in Claude Code hit context window limits and require manual closure. Developers must gather scattered context (projects, issues, PRs, git state, memory) and create continuation prompts from scratch. This is repetitive, error-prone, and blocks seamless session handoffs.

The Chat Closure Agent automates this entire workflow in a single invocation, enabling rapid session transitions across control-plane and WordPress repositories.

## What Changes

- **New**: `chat-closure-agent` — Tier 1 portable agent handling session closure automation
- **New**: Session metadata extraction from git state (branch, commits, issues, PRs)
- **New**: Memory system integration with 10-family YAML structure
- **New**: Continuation prompt generation with project/issue/PR context
- **New**: Safe workspace cleanup with user confirmation
- **New**: Multi-repo support (control-plane, WordPress plugins, WordPress themes)
- **Enhanced**: Memory system now has automated handoff capability (previously manual)

## Capabilities

### New Capabilities

- `core-analysis`: Extract git metadata, detect repository type, identify related issues/PRs
- `memory-updater`: Create structured memory entries with bidirectional issue linking
- `continuation-prompt-builder`: Generate professional handoff Markdown with context summary
- `project-linker`: Discover active projects and related work from repository state
- `workspace-cleaner`: Safe git worktree cleanup with user prompts and stash/commit handling

### Modified Capabilities

- `memory-system`: Adding automated session closure entries (10-family YAML structure unchanged)

## Impact

**Affected Systems:**

- Memory system (`.remember/`, `MEMORY.md` index) — adds automated handoff entries
- Git worktree state (session branches) — optional cleanup after closure
- GitHub issues/PRs — one-way memory linking (no issue comments)
- CI/CD — new portable agent in `agents/` tier (no build changes)

**Repos Affected:**

- LightSpeed `.github` control-plane (primary)
- WordPress block plugins (via agent context detection)
- WordPress block themes (via agent context detection)

**No Breaking Changes:** Memory structure unchanged, existing manual handoffs continue to work.

## Implementation Timeline

**Phase 1 (Week 1):** Core Analysis + git metadata (90%+ test coverage)
**Phase 2 (Week 2):** Memory & Handoff + prompt builder (85%+ test coverage)
**Phase 3 (Week 3):** Workspace cleaner + orchestration (integration tests)
**Phase 4 (Week 4):** Documentation + testing audit (≥85% overall coverage)

**Total: 40-50 hours, 2,000-2,500 LOC, 1,500-2,000 LOC tests**
