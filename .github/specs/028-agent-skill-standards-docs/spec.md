---
file_type: "documentation"
title: "Feature Specification: Agent and Skill Standards Documentation"
description: "Defines the rewrite of the nine agent and skill standards documents so that they state one verified file and folder structure."
version: "v1.0"
last_updated: "2026-11-25"
owners: ["LightSpeed Team"]
tags: ["agents", "skills", "standards", "documentation", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Feature Specification: Agent and Skill Standards Documentation

**Feature Branch**: `docs/agent-standards-specs`

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "Define our standards for agents and skills, which should include file and folder structure" ([GIT-2302](https://linear.app/lightspeedwp/issue/GIT-2302), which supersedes GIT-2788)

## Context

The epic [GIT-2302](https://linear.app/lightspeedwp/issue/GIT-2302) records the adopted standards, verified against the official sources on 23 September 2026:

- Organisation-wide agents are `agents/*.agent.md` files at the root of the organisation `.github` repository.
- An agent file has frontmatter with `name` and `description`, and optional `tools` and `model`.
- Agent working instructions live in `AGENTS.md`, not in a bespoke `AGENT.md`.
- A skill is a `SKILL.md` that follows the Agent Skills specification, with frontmatter limited to the specification's fields.
- Skills reach other repositories through a root `.claude-plugin/marketplace.json`.
- Tests may live in `tests/` or `__tests__/`.

Three points were checked separately on 25 November 2026 and are not GIT-2302 decisions. GitHub's documentation also allows `.github-private` for organisation agents, and describes custom agents as public preview and subject to change. The repository's validators add governance fields to the platform fields (described below). The documents state the decision and note each of these.

The nine standards documents in `docs/` were written in July and September 2026. Most were last changed after the decisions were verified, yet at least the agent document does not follow them, so each document is checked rather than assumed. Measured on `develop` at `cec2b90daf` on 25 November 2026:

| Document | Lines | Last changed |
| -- | -- | -- |
| `AGENT_STANDARDS.md` | 467 | 28 September 2026 |
| `AI_REFERENCES_STANDARDS.md` | 534 | 14 September 2026 |
| `COOKBOOKS_STANDARDS.md` | 476 | 28 September 2026 |
| `HOOKS_STANDARDS.md` | 501 | 28 September 2026 |
| `INSTRUCTIONS_STANDARDS.md` | 459 | 28 September 2026 |
| `PLUGINS_STANDARDS.md` | 515 | 28 September 2026 |
| `PROMPTS_STANDARDS.md` | 533 | 28 September 2026 |
| `SKILLS_STANDARDS.md` | 563 | 6 October 2026 |
| `WORKFLOWS_STANDARDS.md` | 414 | 28 September 2026 |

`AGENT_STANDARDS.md` still describes a folder-based agent whose entry file is `agent.md`, requires the frontmatter fields `version` and `providers`, and lists agent skills as `.js` files. None of that matches the decisions above. The 18 November review found the other documents also do not follow the decisions; this specification starts by checking each one rather than assuming it.

The repository's own validation adds fields on top of the platform ones. Checked on 25 November 2026: `validate-skills.js` rejected a sample agent that had only `name`, `description`, `tools` and `model`, because `schemas/agent-config.schema.json` requires `file_type`, `title` and `last_updated` in an agent's frontmatter, and `validate-agent-frontmatter.js` skips an agent that does not declare `file_type: "agent"`. The same sample skill with `name` and `description` passed. The documents therefore state two layers for an agent: the platform fields, and the repository governance fields, and say which validator requires which.

Findings from running the platform validator on 25 November 2026, with Claude Code 2.1.317 (a snapshot, not requirements):

- `claude plugin validate` validates plugin and marketplace manifests and the skills, agents and commands in a directory. It accepts `--strict` and `--json` and exits 0, 1 or 2.
- All eight plugins that have a `.claude-plugin/plugin.json` fail it. The `skills` and `agents` paths must start with `./`, `skills` entries must be directories, and one `agents` value has the wrong shape.
- By file scan, three of the 32 `SKILL.md` files under the eight plugins have no frontmatter. They are the three skills that the `plugins/lightspeed-github-ops` manifest lists, out of six skill folders there, and `claude plugin validate` reported them. `validate-skills.js` also reports them, but they are recorded as known findings in `scripts/validation/skills-baseline.json`, so the baseline hides them.
- No repository check reported the manifest path errors. `validate-plugins.js` checks only `plugins/lightspeed-github-ops`. No workflow runs `validate-agent-frontmatter.js` or `validate-agents.js`, and `validate-plugins.js` runs only inside `validate:all`, which no workflow runs. `validate-skills.js` holds its specification rules as constants, so it does not follow the platform automatically.
- On a directory with a `.claude-plugin/plugin.json` and a skill that carried an unknown frontmatter field (`bogus-field`), `claude plugin validate --strict` printed the same output with and without the field. It failed for the missing author, README and LICENSE only. It did not flag the field, which is why it complements `validate-skills.js`.

The GIT-2302 decision says skill frontmatter is limited to the specification's fields. That holds for a skill that is uploaded outside Claude Code, and FR-003 records the Claude Code layer as a difference from the decision. The validator already separates the two with its per-directory `claude-code-skill` class. T007 reports the difference on GIT-2302.

Specification 014 (`014-agents-restructure-consolidate`) is still a Draft and its FR-002 requires an `AGENT.md` for every agent, which these decisions replace. [GIT-2626](https://linear.app/lightspeedwp/issue/GIT-2626) revises it. Until then the catalogue holds two conflicting Drafts, and the documents follow the GIT-2302 decisions and say so.

This specification covers the documents only. Changing the files, folders, validators and distribution they describe is separate work.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One structure for agents (Priority: P1)

A contributor who needs a new agent opens one document and learns where the files go, what the frontmatter must contain and how the agent is checked.

**Why this priority**: The agent structure is the part of Ash's request that is currently contradicted by the repository's own documents.

**Independent Test**: Follow `AGENT_STANDARDS.md` to create a sample agent, then run the repository's agent validation on it.

**Acceptance Scenarios**:

1. **Given** the rewritten document, **When** a contributor creates the layout it shows, **Then** the files and platform fields are the ones in the decisions above, with the repository governance fields added and labelled as such, and nothing in the document names `agent.md` or `AGENT.md` as the standard.
2. **Given** the rewritten document, **When** its example frontmatter is validated, **Then** it uses only platform fields and repository governance fields (no `version`, `providers` or `implementation`), it passes `validate-skills.js` and `validate-agents.js` and is not skipped by `validate-agent-frontmatter.js`, or the failure is recorded as a gap.
3. **Given** a rule in the document, **When** a reader looks for its source, **Then** the document links to the official page and states the date it was checked.

---

### User Story 2 - One structure for skills (Priority: P1)

A contributor who writes a skill learns the folder layout, the two layers of frontmatter (the portable specification fields and the Claude Code extension fields), the size limits and how a skill reaches other repositories.

**Why this priority**: Skills are the largest group of files in the repository, and `SKILLS_STANDARDS.md` is the only document that already describes the specification.

**Independent Test**: Create a skill from `SKILLS_STANDARDS.md` and check it with the specification rules.

**Acceptance Scenarios**:

1. **Given** the document, **When** a skill is created from it, **Then** the folder name matches `name`, `name` is lower-case kebab-case of at most 64 characters, and the document recommends keeping `SKILL.md` under 500 lines, marked as guidance because the specification does not set it as a limit.
2. **Given** the document, **When** a reader asks how a skill is shared, **Then** it points to the marketplace file and says that plugins cannot reference files outside their root.

---

### User Story 3 - The other seven documents agree (Priority: P2)

A reader who moves from the agent document to instructions, prompts, plugins, hooks, workflows, cookbooks and AI references finds the same terms and the same structure.

**Why this priority**: Seven documents cross-refer to the agent and skill layout, and one stale document would undo the other two.

**Independent Test**: Search the nine documents for the superseded terms.

**Acceptance Scenarios**:

1. **Given** the nine rewritten documents, **When** they are searched with the case-sensitive patterns `AGENT\.md` and `(^|[^.\w])agent\.md` (which do not match `AGENTS.md` or `*.agent.md`) and for `providers` as a required field, **Then** none remains except in a clearly marked history note.
2. **Given** `INSTRUCTIONS_STANDARDS.md` and `PROMPTS_STANDARDS.md`, **When** they name a file format, **Then** they say whether Claude Code loads it, and name the format that it does load.

---

### User Story 4 - Rules the repository can check (Priority: P2)

A maintainer can tell which rules in the documents are enforced by a validator and which are guidance.

**Why this priority**: A rule with no check drifts, which is how the documents became stale.

**Independent Test**: Read the enforcement table in each document.

**Acceptance Scenarios**:

1. **Given** each document, **When** it states a rule, **Then** the rule is marked as checked by a named validator or as guidance only.
2. **Given** a rule that is checked by nothing, **When** the specification is reviewed, **Then** it is recorded as a gap for the later validation work instead of being described as enforced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each of the nine documents MUST describe the file and folder structure for its subject, using only layouts the adopted decisions allow.
- **FR-002**: `AGENT_STANDARDS.md` MUST describe `agents/*.agent.md` with the platform fields `name` and `description` (optional `tools` and `model`), the repository governance fields that the validators require (`file_type`, `title`, and `last_updated` written as an ISO date `YYYY-MM-DD`), and `AGENTS.md` for working instructions. It MUST write `tools` as a YAML list, which both Claude Code and `.schemas/frontmatter.schema.json` accept, and note that Claude Code and GitHub Copilot also accept a comma-separated string that both repository frontmatter validators reject. It MUST also note the GitHub differences: `name` is optional and only `description` is required, `target`, `disable-model-invocation`, `user-invocable`, `mcp-servers` and `metadata` exist, `infer` is retired, the prompt is limited to 30,000 characters, and an agent of the same name at a lower level (repository) overrides the organisation agent. It MUST state which fields come from the platform and which from the repository.
- **FR-003**: `SKILLS_STANDARDS.md` MUST describe two layers of skill frontmatter and say why. The portable layer is the six Agent Skills specification fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`), with only `name` and `description` required; a skill uploaded to claude.ai or the API fails with a hard error on any other field. The Claude Code layer is the further fields in the Claude Code skills frontmatter table (`CLAUDE_CODE_SKILL_FIELDS` in `scripts/validation/lib/skills-spec.js` lists them today); Claude Code accepts and acts on them, and in Claude Code `name` is optional and `description` is recommended. The document MUST state which layer each skill in this repository targets, and MUST keep the per-platform adapter files (`metadata.yml` and `agents/*.yaml`) outside `SKILL.md`.
- **FR-004**: Every rule MUST link to an official source and carry the date it was checked.
- **FR-005**: Every rule MUST be marked as enforced by a named validator or as guidance only.
- **FR-006**: `INSTRUCTIONS_STANDARDS.md` and `PROMPTS_STANDARDS.md` MUST state which formats Claude Code loads and which it does not, without recommending the removal of any file.
- **FR-007**: The documents MUST NOT describe `AGENT.md`, `agent.md` entry files, `version` or `providers` as required agent fields, or `.js` skill files as the skill format.
- **FR-008**: Each example MUST be a real file in the repository that passes its validator, or MUST be validated when the documents are written.
- **FR-009**: `.github/specs/CATALOG.md` and `docs/index.md` MUST link to the rewritten documents. `docs/index.md` does not list them today, so this adds a section; `docs/README.md` and `docs/AGENT-INDEX.md` are checked and updated only if they list documentation.
- **FR-010**: The documents MUST say how each rule is checked against the current platform rules and not only against rules copied into the repository, naming `claude plugin validate --strict` where it applies. `claude plugin validate` complements `validate-skills.js` and does not replace it. The documents do not list failing plugins or skills; those failures are recorded as gaps in the validation work (T020 and T025), where they can be refreshed.

### Non-Functional Requirements

- **NFR-001**: Every change MUST pass `markdownlint`, link checking and frontmatter validation.
- **NFR-002**: The change MUST NOT touch files the constitution locks.
- **NFR-003**: The change MUST be Markdown only, so CI runs the scoped checks.

### Key Entities

- **Standards document**: One of the nine `docs/*_STANDARDS.md` files.
- **Verified rule**: A rule with an official source link, a check date and an enforcement mark.
- **Superseded term**: A name or field that the adopted decisions replace.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Searching the nine documents with the exact patterns in User Story 3 returns no standard-setting use.
- **SC-002**: 100% of rules carry a source link, a check date and an enforcement mark.
- **SC-003**: A sample agent and a sample skill built from the documents are run through the repository validators. Each either passes, or the validator's failure is recorded as a gap for the validation work, because `validate-agent-frontmatter.js` and `validate-agents.js` were written for the earlier formats, and a file the frontmatter validator skips has not passed. This specification does not change any validator.
- **SC-004**: `markdownlint`, link checking and frontmatter validation pass on all nine files.

## Assumptions

- The decisions in GIT-2302 stand. If a decision changes, this specification is revised, not worked around.
- Fixing the repository files so they conform is later work. The documents describe the target and say where the repository does not yet match it.
- The 18 November counts of non-conforming files are re-measured for the later specifications. This one does not rely on them.

## Out of Scope

- Moving, renaming or deleting agents, skills, instructions or prompts.
- Changing validators, CI or hooks. A CI check that runs `claude plugin validate` is recorded as a requirement for the validation work (GIT-2309) and the marketplace work, because it would fail today on all eight plugins and needs a baseline of known findings first.
- Creating the plugin marketplace file. The documents describe it (T013, T016); the marketplace work builds it.
- Revising specification 014 (GIT-2626 does that).
- Amending the constitution.
