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
3. **Mark enforcement.** Compare each rule with the validators in `scripts/validation/` and with `claude plugin validate --strict`, which tracks the current platform rules. Rules with no check, and plugins that fail the platform validator, are listed as gaps for the validation work. This specification adds no workflow: the platform check would fail today on all eight plugins and first needs a baseline, so its design is recorded in T026 for the validation specification (GIT-2309) and the marketplace work.
4. **Prove the examples.** Build the samples in a throwaway directory outside the repository, never in the real `agents/` or `skills/`. The throwaway tree has `agents/<name>.agent.md` and `skills/<name>/SKILL.md`, and a `node_modules` link to the repository's dependencies, which all three validators need. A missing `scripts/validation/skills-baseline.json` means no known findings. The validators find their files differently, so each is run as follows:
   - `scripts/validation/validate-skills.js` walks the working directory, classifies each file by its path, and checks skills, subagent definitions and `AGENTS.md` against the Agent Skills specification and the Claude Code subagent table. Run it with the throwaway tree as the working directory. For an agent it checks that `file_type`, `title` and `last_updated` are present, taken from `schemas/agent-config.schema.json`, and it does not check the `last_updated` format. It also rejects a skill whose body is empty, and a body that holds only a heading counts as empty, so each sample skill has a line of instructions. It needs the repository's dependencies installed with `npm ci`, or `NODE_PATH` pointing at them; a worktree with no `node_modules` needs one or the other.
   - `scripts/validation/validate-agent-frontmatter.js` reads `<repository>/agents` and `<repository>/.github/agents`, resolved from its own location. It accepts no path, validates against `.schemas/frontmatter.schema.json`, and skips any file that does not declare `file_type: "agent"`. Copy the script to `<tree>/scripts/validation/` and `.schemas/` to `<tree>/.schemas/`, because it resolves both with `../../` from its own location, and run the copy from the tree root. A `Skipped` result is recorded as a gap, never as a pass.
   - `scripts/validation/validate-agents.js` resolves its directories and its `.schemas/` folder the same way and accepts an agent name. It is an ES module. Place the copy and `.schemas/` as above, add a copy of the repository's `package.json`, which sets `"type": "module"`, and run the copy from the tree root with the sample's name. The copy cannot see the repository's own agents, and the in-repo script cannot see the sample. It does not require `file_type`, so it also passes a sample that lacks the governance fields; on its own it proves nothing about them.

   The repository's two schemas disagree about the agent frontmatter. On 25 November 2026 a sample with `tools` as a YAML list and `last_updated: "2026-11-25"` passed all three validators. The same sample with `tools: Read, Grep` failed both `validate-agent-frontmatter.js` and `validate-agents.js`, although Claude Code accepts that string form as well as a list. `.schemas/frontmatter.schema.json` requires `last_updated` to be a date and `tools` to be a list, while `schemas/agent-config.schema.json` describes `last_updated` as a date-time. The examples use the ISO date `YYYY-MM-DD` and a YAML list, which satisfy both the platform and the validators, and each disagreement is recorded as a gap for the validation work.

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
