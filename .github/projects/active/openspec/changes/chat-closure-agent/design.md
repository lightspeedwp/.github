---
title: Chat Closure Agent Design
description: Technical design for chat session closure agent
created_date: "2026-08-12"
last_updated: "2026-08-12"
file_type: documentation
authors: ["Ash Shaw"]
maintainer: "Ash Shaw"
tags: [openspec, design, agent-design, architecture]
---

## Context

Chat developers in Claude Code sessions hit context windows and need to close sessions gracefully. Currently, closure is manual: gather projects/issues/PRs, create a continuation prompt, update memory, clean worktrees.

The agent must work across three repository types (control-plane, WordPress plugins, themes) with identical core logic but context-specific project discovery. It must integrate with the existing 10-family YAML memory system while adding automated handoff capability.

## Goals / Non-Goals

**Goals:**

- Automate 100% of chat session closure workflow
- Support control-plane, WordPress plugins, and WordPress themes equally
- Achieve ≥85% test coverage with Jest
- Generate professional continuation prompts with full context
- Integrate with existing memory system (no schema changes)
- Safe cleanup with user confirmation prompts
- Enable Phase 1-4 implementation (40-50 hours)

**Non-Goals:**

- Automatic chat archival (manual UI step)
- ChatGPT/OpenAI/Gemini integration (Claude + Copilot only)
- Conversation summarization
- Automatic PR creation or merging

## Key Design Decisions

1. **Tier 1 Portable Multi-File Agent** — `agents/chat-closure-agent/` (root, reusable)
2. **One-Way Memory→Issue Linking** — Stable links, no issue comment clutter
3. **Repo-Type Detection via Filesystem** — Fast, reliable (plugin.php, theme.json, labels.yml)
4. **Moderate Memory Handoff Depth** — Summary + links (users drill into entries for detail)
5. **User Confirmation for Cleanup** — Safety gate before worktree deletion
6. **10-Family Memory Structure** — No breaking changes, existing schema

## Risks & Mitigation

- **Memory duplication** → Merge logic in updater
- **Repo detection fails** → Fallback to control-plane
- **Worktree cleanup data loss** → User confirmation required
- **GitHub API rate limits** → Batch queries, graceful degradation
- **Memory→issue link rot** → Links informational only (acceptable risk)
