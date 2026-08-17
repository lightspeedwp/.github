---
title: "Chat Closure Agent Proposal"
description: "Proposal for automated chat session closure and handoff workflow agent"
file_type: "proposal"
status: "active"
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
authors: ["Ash Shaw"]
tags: ["agents", "chat-closure", "session-handoff", "automation"]
related_issues: ["#1809"]
---

# Chat Closure Agent — Proposal

## Executive Summary

Build a **Tier 1 portable agent** that automates chat session closure workflows across control-plane and WordPress repositories, eliminating manual context gathering, handoff prompt creation, memory updates, and worktree cleanup.

## Problem Statement

Long-running Claude Code chat sessions hit context window limits, requiring manual:

1. Gathering scattered context (projects, issues, PRs, branches, memory)
2. Creating continuation prompts from scratch
3. Updating memory and cleaning up worktrees
4. Chat archival

This is time-consuming, error-prone, and blocks development flow.

## Proposed Solution

A reusable **Chat Closure Agent** that automates all steps in a single invocation:

- ✅ Analyze git state (branch, commits, issues, projects)
- ✅ Extract metadata (repo type, scope, decisions)
- ✅ Update memory (10-family YAML structure)
- ✅ Generate handoff prompt (professional Markdown)
- ✅ Clean worktree (safe, with user confirmation)

## Scope

### Supported Environments

- Control-plane (`.github` repo)
- WordPress plugins
- WordPress themes

### Agent Framework

- **Tier:** Tier 1 (Portable, multi-file, reusable)
- **Providers:** Claude (Phase 1), Copilot/OpenAI (Phase 2)
- **Testing:** ≥85% coverage (Jest)

### Implementation Approach

- 4-week timeline (40-50 hours)
- 4 phases: Analysis → Memory/Handoff → Cleanup/Shell → Docs/Testing
- Comprehensive documentation with Mermaid diagrams

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Memory handoff depth | Moderate (summary + links) | Balance brevity & actionability |
| Worktree deletion | Ask before deleting | Safety confirmation required |
| Memory-issue linking | One-way (memory→issue) | Stable links, no issue clutter |
| WordPress support | Both equally | Maximize org-wide reusability |
| Chat archival | Manual (documented) | Future API integration ready |

## Benefits

**Productivity:**

- Eliminates manual context gathering (10-15 min saved per session)
- Automates handoff creation with consistent format
- Reduces context-switching friction

**Quality:**

- Structured memory updates (10-family YAML)
- Consistent handoff format across all sessions
- Traceable issue linking (memory→GitHub)

**Reusability:**

- Works across all repo types (control-plane, plugins, themes)
- Portable agent (installable in other projects)
- Foundation for future automation (chat archival API, etc.)

## Related Resources

- **Project:** [chat-closure-agent-2026-08-12](../)
- **GitHub Issue:** [#1809](https://github.com/lightspeedwp/.github/issues/1809) — Epic
- **Implementation PR:** [#1801](https://github.com/lightspeedwp/.github/pull/1801) — Planning & Setup
- **Planning Document:** [Plan](rosy-cooking-parrot.md)

## Next Steps

1. ✅ Proposal (this document)
2. ⏳ Design specification
3. ⏳ Implementation specification
4. ⏳ Phase 1-4 execution
5. ⏳ Review & merge

---

**OpenSpec Coordination:** See [COORDINATION_PLAN.md](../../COORDINATION_PLAN.md) for GitHub issue linking strategy.
