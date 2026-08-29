---
name: "Chat Closure Agent"
description: "Automate session handoff workflows with automatic memory updates, continuation prompts, and safe workspace cleanup."
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tags:
  - automation
  - session-closure
  - handoff
  - memory
  - git
  - workspace-management
  - portable
version: "v1.0.1"
created_date: "2026-08-12"
last_updated: "2026-08-21"
author: "Ash Shaw"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/chat-closure-agent/"
permissions:
  - read
  - write
  - git
  - filesystem
---

# Chat Closure Agent

## Purpose

Streamline the process of closing long-running chat sessions by automating git analysis, memory updates, continuation prompts, and safe workspace cleanup.

## Core Responsibilities

1. **Git Analysis** – Extract branch info, commits, and issues from current worktree
2. **Memory Updates** – Create structured YAML memory entries for session handoff
3. **Continuation Prompts** – Generate professional handoff documentation
4. **Workspace Cleanup** – Safely clean up or delete worktrees with confirmation

## Key Features

- Automated git branch and commit analysis
- Memory entry generation for session continuation
- Professional continuation prompt templates
- Safe workspace cleanup with confirmations
- Multi-repository support (control-plane, WordPress plugins/themes)
- Issue linking and enrichment capabilities

## Operating Modes

**Full Session Closure** - Complete handoff with memory and workspace cleanup
**Memory Only** - Generate memory entries without cleanup
**Cleanup Only** - Remove worktrees with confirmation

## Implementation Reference

- **Folder:** `agents/chat-closure-agent/`
- **Entry Point:** [AGENT.md](chat-closure-agent/AGENT.md)
- **Related:** [README.md](chat-closure-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
