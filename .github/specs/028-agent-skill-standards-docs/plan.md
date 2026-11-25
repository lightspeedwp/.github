---
file_type: "documentation"
title: "Implementation Plan: Agent and Skill Standards Documentation"
description: "Plans the rewrite of the nine agent and skill standards documents."
version: "v1.0"
last_updated: "2026-11-25"
owners: ["LightSpeed Team"]
tags: ["agents", "skills", "standards", "documentation", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Implementation Plan: Agent and Skill Standards Documentation

**Branch**: `docs/agent-standards-specs` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

## Summary

Rewrite the nine `docs/*_STANDARDS.md` files so each states one verified structure, links each rule to its official source with a check date, and marks each rule as enforced or guidance. Start with the agent and skill documents, then bring the other seven into line.

## Technical Context

**Language/Version**: Markdown with YAML frontmatter

**Primary Dependencies**: `markdownlint-cli2`, the repository link checker, the frontmatter validator, `scripts/validation/` agent and skill checks

**Testing**: Build a sample agent and a sample skill from the documents and run the validators on them

**Constraints**: Markdown only. No locked file changes. No file moves. No validator changes.

## Constitution Check

The constitution is read as written and not amended. This change touches documentation under `docs/` and specifications under `.github/specs/` only.

## Approach

1. **Verify the sources.** For each rule, read the current official page (Agent Skills specification, Claude Code subagents, skills and plugins documentation, GitHub custom agents, `agents.md`) and record the URL and the date.
2. **Rewrite in dependency order.** `AGENT_STANDARDS.md` and `SKILLS_STANDARDS.md` first, because the others refer to them. Then `INSTRUCTIONS_STANDARDS.md`, `PROMPTS_STANDARDS.md` and `PLUGINS_STANDARDS.md`, which need the Claude Code loading rules. Then `HOOKS_STANDARDS.md`, `WORKFLOWS_STANDARDS.md`, `COOKBOOKS_STANDARDS.md` and `AI_REFERENCES_STANDARDS.md`.
3. **Mark enforcement.** Compare each rule with the validators in `scripts/validation/`. Rules with no check are listed as gaps for the validation work.
4. **Prove the examples.** Create a sample agent and skill from the documents in a temporary tree and run them through the repository validators, which behave differently:
   - `scripts/validation/validate-skills.js` walks the working directory and checks skills, subagent definitions and `AGENTS.md` against the Agent Skills specification and the Claude Code subagent table. Run it with the temporary tree as the working directory.
   - `scripts/validation/validate-agent-frontmatter.js` takes no path argument and checks only files that declare `file_type: "agent"`. Each example agent therefore declares `file_type: "agent"` together with `title` and `last_updated`, which `schemas/agent-config.schema.json` requires, and a `Skipped` result is recorded as a gap, never as a pass.
   - `scripts/validation/validate-agents.js` validates `*.agent.md` files in the agent directories.
   Keep only examples that pass, and record each failure or skip as a gap.
5. **Link.** Update the catalogue, the documentation index and each document's own cross-references.

## Project Structure

```text
.github/specs/028-agent-skill-standards-docs/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/requirements.md

docs/
├── AGENT_STANDARDS.md
├── SKILLS_STANDARDS.md
├── INSTRUCTIONS_STANDARDS.md
├── PROMPTS_STANDARDS.md
├── PLUGINS_STANDARDS.md
├── HOOKS_STANDARDS.md
├── WORKFLOWS_STANDARDS.md
├── COOKBOOKS_STANDARDS.md
└── AI_REFERENCES_STANDARDS.md
```

## Risks

- **A decision is wrong or out of date.** Each rule is re-read against its source before it is written. A source that has changed is reported on GIT-2302, not silently followed.
- **GitHub custom agents are in public preview.** The Copilot documentation says they are subject to change, and allows `.github-private` as well as `.github`. The agent document states the date it was checked and the preview status.
- **The documents describe a target the repository does not meet.** Each document says where the repository differs, so a reader is not told the repository already conforms.
- **Linked documents drift.** The link check runs on every change.

## Complexity Tracking

No constitution violations.
