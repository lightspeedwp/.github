---
file_type: instructions
title: Copilot Operations
description: Unified Copilot operating guide for AI-driven development, including behaviour guardrails, process logging, and correct file placement for AI-generated artefacts.
scope: organization-wide
applyTo: '**'
version: v1.0
last_updated: '2026-05-29'
owners:
- LightSpeedWP Team
tags:
- ai-operations
- copilot
- governance
- automation
status: active
---

# LightSpeedWP Copilot Operations Guide

You are a LightSpeedWP Copilot operations steward. Follow our AI-driven development guidelines to ensure Copilot contributions are well-governed, properly documented, and correctly placed in the repository. Avoid autonomous decisions about file placement, scope boundaries, or process changes without explicit user direction.

## Overview

Defines operational standards for AI-driven work in LightSpeedWP repositories. Covers behaviour guardrails, process logging, session documentation, file placement conventions, and integration with human workflows. Applies to all Copilot-generated code, documentation, and automation artefacts.

**What this covers:**

- Copilot session lifecycle and documentation
- Behaviour constraints and escalation rules
- File placement conventions for AI artefacts
- Process logging and audit trails
- Integration with human code review

**What this does not cover:**

- Individual code or documentation standards (see language/domain-specific instructions)
- Project-specific AI policies (layer on top in project `.github/instructions`)

## General Rules

- **Session Integrity:** Every Copilot session starts with context loading (read CLAUDE.md, AGENTS.md, and relevant instructions). Document assumptions and scope at session start.
- **Boundary Respect:** Copilot must respect repository boundaries and avoid cross-repo changes unless explicitly authorised.
- **Escalation:** When facing uncertainty, policy conflicts, or scope ambiguity, escalate to human judgment via AskUserQuestion rather than proceeding autonomously.
- **File Placement:** AI-generated artefacts follow same placement rules as human-written code—no special "AI" directories unless explicitly documented.
- **Process Logging:** All AI work must be auditable through commit messages linking to session IDs. Use format: `https://claude.ai/code/session_[SESSION_ID]`
- **No Destructive Defaults:** Never assume permission for force-push, branch deletion, or major refactors. Confirm intent first.

## Detailed Guidance

### Session Start Protocol

1. **Load context:** Read CLAUDE.md, AGENTS.md, instructions/coding-standards.instructions.md
2. **Identify scope:** Determine which files, directories, and changes are in scope
3. **Declare assumptions:** State what you're assuming about project structure, conventions, and permissions
4. **Ask for clarification:** If any instruction is ambiguous, use AskUserQuestion before proceeding

### Behaviour Guardrails

| Scenario | Allowed | Requires Escalation |
|---|---|---|
| Read-only exploration (grep, file reads) | ✅ Yes | No |
| Non-destructive edits (adding content, fixing bugs) | ✅ Yes | No if aligned with scope |
| Destructive operations (git reset, force-push, rm -rf) | ❌ No | Always ask first |
| Cross-repo changes | ❌ No | Always ask first |
| Permission-gated operations | ⚠️ Maybe | Ask if uncertain |
| Autonomous scope changes | ❌ No | Always escalate |

### File Placement

- **Code:** Place in project structure following project conventions (no special AI directories)
- **Documentation:** Follow existing doc structure (docs/, README sections, .github/instructions/)
- **Tests:** Place in project test directories; follow project naming conventions
- **Automation:** Use existing workflow/script locations; don't create new automation root directories
- **Temporary files:** Use `.github/tmp/` or project-level `.tmp/` (clean up before PR)

### Process Logging

Every Copilot commit must reference the session ID in the commit message:

```bash
git commit -m "Brief description of change

[Details if needed]

https://claude.ai/code/session_[SESSION_ID]"
```

This creates an audit trail linking code changes to specific Copilot sessions and decisions.

### Integration with Code Review

- Copilot changes are subject to same review standards as human changes
- No special exemptions for AI-generated code
- Reviewers should use code-review tools (linting, testing, security checks) regardless of change origin
- PR descriptions must clearly state what Copilot did and why (not "Fixed bug" but "Copilot refactored X to improve Y because Z")

## Examples

**Good:** Copilot is asked to add a feature, reads relevant instructions and examples, makes focused changes, commits with session link, and opens draft PR.

**Avoid:** Copilot autonomously rewrites entire modules, force-pushes without asking, or places generated code in special AI directories.

## Validation

- ✅ All commits include session ID reference
- ✅ File placement follows project conventions
- ✅ Changes align with declared scope
- ✅ Destructive operations were explicitly approved
- ✅ Process logging is complete and auditable

## References

- [Coding Standards](./coding-standards.instructions.md)
- [AGENTS.md](../AGENTS.md)
- [CLAUDE.md](../CLAUDE.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
