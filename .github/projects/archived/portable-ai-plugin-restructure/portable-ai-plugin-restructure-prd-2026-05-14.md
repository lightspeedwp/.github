---
title: "Portable LightSpeed AI Operations Plugin Restructure PRD"
description: "Product requirements document for restructuring the LightSpeed .github repo into a portable AI operations plugin while keeping .github scoped to repo governance."
version: "v0.1.0"
last_updated: "2026-05-14"
file_type: "project-prd"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team", "Codex"]
license: "GPL-3.0"
tags:
  - "prd"
  - "ai-ops"
  - "plugin"
  - "repo-restructure"
  - "awesome-copilot"
  - "governance"
domain: "governance"
stability: "draft"
references:
  - path: "../../../instructions/file-organisation.instructions.md"
    description: "Current file placement rules used for this PRD."
  - path: "../../../custom-instructions.md"
    description: "Current repo-level Copilot and agent instructions."
  - path: "../../../agents/agent.md"
    description: "Current agent index and implementation map."
  - path: "../../../../package.json"
    description: "Current validation, linting, and test command surface."
---

# Portable LightSpeed AI Operations Plugin Restructure PRD

## 1. Executive Summary

LightSpeed has already proven the value of a central `.github` repository as an
organisation control plane: community health files, templates, labels,
instructions, agents, automations, and release practices can be versioned once
and reused across many repositories.

The next step is to split two concerns that currently live in the same place:

1. The `.github` repository's own GitHub governance, CI, templates, and
   repo-specific Copilot instructions.
2. Portable LightSpeed AI operations assets that should be installable into
   many tools and project types.

This PRD proposes a radical but phased restructure into an
awesome-copilot-inspired layout:

```text
/.github
/.schemas
/.vscode
/agents
/cookbook
/docs
/hooks
/instructions
/plugins
/skills
/workflows
```

The end state is a portable AI operations repository that can publish one or
more installable plugins, while the root `.github` folder remains the canonical
home for this repository's own GitHub configuration and community-health
responsibilities.

The JavaScript and schema layer should restart smaller after the restructure.
Existing tests and validators are useful as evidence, but the new system should
avoid porting the current complexity wholesale. Validation must be
non-mutating by default, dependency-light, and focused on structure, plugin
manifests, frontmatter, links, and JSON/YAML syntax.

## 2. Background And Motivation

LightSpeed has been using this repository to centralise:

- organisation-wide community health files;
- GitHub issue, pull request, and saved reply templates;
- labels and governance conventions;
- Copilot instructions, prompts, agents, and AI operations documents;
- workflow and release automation;
- schema/frontmatter conventions for discoverable documentation.

The previous workaround made the central AI assets available locally by
checking out `lightspeedwp/.github` into the staging environment and adding the
folder to the VS Code workspace. That approach worked, but it is not a clean
distribution model. It depends on local workspace configuration, exposes too
much repository implementation detail, and does not segment domain-specific
skills cleanly.

The current `github/awesome-copilot` project now provides a better reference
model. It has evolved from a collection of agents, instructions, prompts, and
skills into a marketplace and plugin-oriented repository with MCP-aware tooling,
Copilot CLI installation, VS Code discovery, skills, hooks, workflows, and
plugin manifests.

LightSpeed should use that pattern, but with a narrower first implementation:

- keep `.github` important and focused;
- make portable assets first-class top-level content;
- ship one small installable plugin first;
- collect favourite skills in a clear backlog;
- reintroduce scripts and schemas only after the new layout proves itself.

## 3. Evidence Reviewed

### 3.1 Google Drive Blog And Talk Folder

The Drive folder contains the blog and talk source material for the current
`.github` work. The folder inventory reviewed for this PRD included the
following files:

| File | Evidence Status | Planning Relevance |
| --- | --- | --- |
| `.GitHub Community Health Repo` | Listed and included in prior audit synthesis | Establishes the central repo as the organisation-wide control plane. |
| `Part 1 - Unified .GitHub Community Health Repo` | Text reviewed directly | Defines the defaults-first `.github` strategy and `develop` to `main` rollout model. |
| `Part 2 - Community Health & Governance Docs` | Listed and included in prior audit synthesis | Supports the need to keep `.github` as the governance source of truth. |
| `Part 3 - Tools and CI` | Text reviewed directly | Supports local/CI parity, lint/test gates, and one-command validation. |
| `Part 4 - Templates & Saved Replies` | Listed and included in prior audit synthesis | Supports centralising issue, PR, discussion, and saved reply templates. |
| `Part 5 - AI Ops Files` | Text reviewed directly | Treats AI files as versioned operational assets, not editor-only preferences. |
| `Part 6 - Frontmatter & Schema` | Text reviewed directly | Identifies frontmatter as the API contract and warns about schema drift. |
| `Part 7 - Labeling Agent` | Text reviewed directly | Supports dry-run-first automation, canonical labels, and safe agent behaviour. |
| `Part 8 - Projects Agent` | Listed and included in prior audit synthesis | Supports project metadata, field sync, and issue/project governance automation. |
| `Part 9 - Branding Agent` | Listed and included in prior audit synthesis | Supports portable brand and documentation quality checks. |
| `Part 10 - Release Agent` | Text reviewed directly | Supports release gates, changelog/version checks, and hard aborts on unsafe state. |
| `Part 11 - Self-Maintaining GitHub Repo` | Text reviewed directly | Frames the long-term goal of a repo that maintains its own standards with human oversight. |
| `LightSpeed_GitHub` | Slide structure reviewed; image-only slides | Useful for WordCamp narrative framing, but not primary text evidence. |
| `The_GitHub_Control_Plane` | Listed | Supports the control-plane framing for the talk. |
| `The_Universal_GitHub_Node` | Listed | Supports the portable node/plugin framing for the talk. |

Key synthesis from the Drive material:

- The central `.github` repo is a strategic default layer, not a dumping
  ground.
- Governance files, templates, saved replies, labels, workflows, and standards
  should remain centralised.
- AI instructions, agents, prompts, and reusable skills should be indexed,
  versioned, validated, and discoverable.
- Frontmatter is the contract that makes AI files portable and auditable.
- Automation must default to dry-run, fail safely, and expose a short rationale.
- The current repo has grown enough that a smaller second generation is safer
  than extending the current JavaScript/schema stack indefinitely.

### 3.2 Awesome Copilot Reference Audit

The current `github/awesome-copilot` repository was reviewed at commit
`97cc3f24602b6431b82dbce2afec7a1f3611664f`, dated 2026-05-14.

The top-level structure closely matches the requested LightSpeed target:

```text
.github/
.schemas/
.vscode/
agents/
cookbook/
docs/
eng/
hooks/
instructions/
plugins/
skills/
workflows/
```

Important observed patterns:

- The repository separates source collections from installable plugin bundles.
- Plugins live under `plugins/<plugin-id>/`.
- Each plugin uses `.github/plugin/plugin.json` inside the plugin folder.
- The root marketplace metadata lives at `.github/plugin/marketplace.json`.
- Skill folders are self-contained and use `SKILL.md` as the entrypoint.
- Contribution docs define naming, frontmatter, validation, and plugin rules.
- Plugin installation is framed around `copilot plugin install` and marketplace
  registration.
- VS Code plugin discovery is integrated through Copilot plugin concepts.
- A `.vscode/mcp.json` file configures an MCP server command for agentic
  workflows.
- The staged branch model publishes materialised plugin content to stable
  distribution branches.

Observed plugin manifest pattern:

```json
{
  "name": "awesome-copilot",
  "description": "Meta prompts that help you discover and generate curated GitHub Copilot agents, instructions, prompts, and skills.",
  "version": "1.1.0",
  "author": {
    "name": "Awesome Copilot Community"
  },
  "repository": "https://github.com/github/awesome-copilot",
  "license": "MIT",
  "keywords": [
    "github-copilot",
    "discovery",
    "meta",
    "prompt-engineering",
    "agents"
  ],
  "agents": [
    "./agents"
  ],
  "skills": [
    "./skills/suggest-awesome-github-copilot-agents",
    "./skills/suggest-awesome-github-copilot-instructions",
    "./skills/suggest-awesome-github-copilot-skills"
  ]
}
```

Implication for LightSpeed:

- Use the same folder vocabulary where it fits.
- Keep the first LightSpeed plugin smaller than awesome-copilot.
- Prefer top-level source collections plus one pilot plugin before adding a
  full materialisation pipeline.
- Treat `.github/plugin/marketplace.json` as repo packaging metadata, not as
  WordPress project content.
- Do not assume all Copilot concepts map perfectly to Codex, Claude Code, or
  ChatGPT. Keep assets tool-agnostic first, then add adapters.

### 3.3 Current LightSpeed Repo Audit

The current repository is powerful but overloaded. The repo already has strong
foundations:

- `validate:agents`;
- `validate:workflows`;
- `validate:json:schemas`;
- `validate:json:all`;
- `lint:all`;
- `test`;
- lint-staged and Husky pre-commit integration;
- comprehensive templates and saved replies;
- agent specs and JavaScript runner scripts;
- instruction, prompt, report, metric, and project folders.

Current inventory highlights:

| Area | Current State | PRD Interpretation |
| --- | --- | --- |
| `.github/agents` | 19 agent spec files | Migrate reusable specs to `/agents`; keep repo-specific specs in `.github`. |
| `.github/prompts` | 71 prompt files | Convert durable workflows into `/skills`; move examples to `/cookbook`; retire one-off prompts. |
| `.github/instructions` | 32 instruction files | Split portable instructions to `/instructions`; keep repo-local instructions in `.github`. |
| `scripts/agents` | 21 JavaScript agent runners | Treat as legacy runtime; rewrite only the useful runners into smaller hooks/workflows. |
| `.github/ISSUE_TEMPLATE` | 25 numbered templates plus config | Keep central community-health templates under `.github`. |
| `.github/PULL_REQUEST_TEMPLATE` | Default plus branch templates | Keep under `.github`; update references after restructure. |
| `.github/SAVED_REPLIES` | Saved reply collections | Keep under `.github` as organisation governance content. |
| `.github/schemas` | Schema files under `.github` | Move portable schemas to `/.schemas` after simplification. |
| `.github/workflows` | GitHub Actions workflows | Keep under `.github/workflows`; use top-level `/workflows` for portable agentic workflows. |

Validation findings:

- `npm run validate:agents` passes after dependencies are installed.
- `npm run validate:workflows` passes but emits 34 warnings around workflow
  permissions, concurrency, caching, checkout depth, and unnamed run steps.
- `npm run validate:json:schemas` currently fails because
  `.github/schemas/project-fields.schema.json` contains a JavaScript-style
  comment in JSON at line 15.
- `npm run validate:json:schemas` also formats files as it runs, which makes a
  command named `validate` unexpectedly mutating.
- `npm test` passes 41 suites and 181 tests, but coverage reports 0 percent and
  some tests log side effects during import.
- `npm ci` reports 36 dependency vulnerabilities.

Reference and drift findings:

- Several docs still point to `.github/instructions/_index.instructions.md`,
  which is missing.
- Some docs refer to `.github/automation/labels.yml`, but the current labels
  file is `.github/labels.yml`.
- Some links use `docs/HUSKY-PRECOMMITS.md`, while the actual file uses an
  underscore.
- Some docs refer to removed or stale `GEMINI.md`, `CLAUDE.md`, `chatmodes`,
  and `collections` concepts.
- Several zero-byte macOS `Icon` metadata files exist in template and saved
  reply folders.
- `.github/custom-instructions.md` still treats `.github` as the home for
  reusable WordPress project AI files, which conflicts with the desired new
  boundary.

The core conclusion is that the current repo should not be reorganised by
moving everything at once. It needs an explicit migration map, a pilot plugin,
and a simplified validation layer that proves the new layout before the legacy
JavaScript stack is rewritten.

## 4. Problem Statement

The repository currently mixes four product surfaces:

1. GitHub's special `.github` community-health and workflow behaviour.
2. LightSpeed organisation governance and template defaults.
3. Portable AI operations assets that should install into editors and agents.
4. WordPress product-specific instructions, agents, and workflows.

This creates several problems:

- Portable assets are trapped under `.github`, which makes them harder to
  package and install.
- Repo-specific instructions are mixed with WordPress project instructions.
- Prompts, agents, instructions, and JavaScript runners have grown unevenly.
- Schema and frontmatter validation is valuable but currently brittle.
- Some validation commands mutate files or pass despite noisy side effects.
- Docs contain stale paths and legacy concepts.
- A local workspace checkout is a workaround, not a scalable distribution
  model.

## 5. Product Goals

### 5.1 Primary Goals

1. Create a portable repository structure that mirrors the proven
   awesome-copilot vocabulary where appropriate.
2. Preserve `.github` as the canonical home for repo governance, community
   health files, GitHub Actions, and repo-specific Copilot instructions.
3. Move reusable AI operations assets to top-level folders that can be packaged
   into plugins.
4. Build a small first installable plugin before attempting a broad migration.
5. Separate general LightSpeed governance skills from WordPress block theme and
   block plugin skills.
6. Replace the current JavaScript/schema complexity with smaller validation
   scripts after the restructure.
7. Keep the repo useful for the WordCamp Europe talk and blog series by making
   the architecture easy to explain.

### 5.2 Secondary Goals

1. Support VS Code and GitHub Copilot first.
2. Keep the asset model adaptable to Codex, Claude Code, ChatGPT, and future
   MCP/plugin surfaces.
3. Keep all AI assets discoverable through indexes, frontmatter, and plugin
   manifests.
4. Make it easy to collect favourite skills without forcing every idea into
   production immediately.
5. Document every migration decision so the restructure can be reviewed in
   phases.

## 6. Non-Goals

This project will not:

- rewrite every JavaScript agent runner in the first phase;
- preserve every existing prompt as a top-level file;
- publish a public marketplace entry before private installation works;
- move WordPress product-specific guidance into the repo-level `.github`
  folder;
- keep deprecated chatmode or collection concepts as first-class v1 surfaces;
- add a heavy build system before the first plugin proves the target model;
- claim full cross-tool compatibility before each tool adapter is tested.

## 7. Target Users

| User | Need | Success Signal |
| --- | --- | --- |
| LightSpeed engineers | Install shared AI operations assets into daily tools | One command or documented flow installs a focused plugin. |
| Repo maintainers | Keep organisation standards central and reviewable | `.github` remains clear, stable, and auditable. |
| WordPress theme developers | Access block theme skills without unrelated plugin guidance | Theme-specific skills live in a dedicated plugin bundle. |
| WordPress plugin developers | Access block plugin skills without theme assumptions | Plugin-specific skills live in a dedicated plugin bundle. |
| Release maintainers | Run safer release checks and changelog routines | Release skills and workflows are dry-run capable and documented. |
| Talk/blog audience | Understand the architecture and migration story | The repo demonstrates a practical control-plane-to-plugin evolution. |

## 8. Target Folder Structure And Ownership

### 8.1 Root Structure

```text
/.github
/.schemas
/.vscode
/agents
/cookbook
/docs
/hooks
/instructions
/plugins
/skills
/workflows
```

### 8.2 Folder Responsibilities

| Folder | Responsibility | Notes |
| --- | --- | --- |
| `/.github` | GitHub-native repo configuration, community health, workflow automation, repo-specific Copilot files, marketplace metadata | This remains important, but it stops being the default home for portable WordPress AI assets. |
| `/.schemas` | Portable JSON/YAML/frontmatter schemas for AI assets and plugin metadata | Start small; move only schemas that are actively validated. |
| `/.vscode` | Workspace-local VS Code and MCP configuration for contributors | May include MCP server config, tasks, and recommendations. |
| `/agents` | Portable agent specs | Specs only in v1. Runtime code is migrated separately. |
| `/cookbook` | Recipes, examples, playbooks, and implementation guides | Durable prompt-like content that is better as a recipe than a skill. |
| `/docs` | Permanent documentation for humans | Includes architecture, install docs, migration reports, and talk/blog support material. |
| `/hooks` | Portable hooks and guardrails | Tool-neutral where possible; tool adapters can live below subfolders. |
| `/instructions` | Portable instruction files | Split by domain and avoid `.github`-specific assumptions. |
| `/plugins` | Installable plugin bundles | Each plugin has its own README and `.github/plugin/plugin.json`. |
| `/skills` | Self-contained skill folders | Each skill uses `SKILL.md` and can include assets, scripts, templates, and examples. |
| `/workflows` | Portable agentic workflows | GitHub Actions stay in `.github/workflows`. |

### 8.3 `.github` Boundary

The `.github` folder should contain:

- GitHub Actions workflows for this repo;
- issue templates, pull request templates, saved replies, and discussion
  templates;
- labels, funding, contributing, security, code of conduct, and support files;
- repo-specific Copilot instructions for maintaining this repo;
- marketplace metadata required by plugin distribution;
- active project planning and reports that belong to the `.github` repo itself.

The `.github` folder should not contain:

- general WordPress project instructions;
- block theme skills;
- block plugin skills;
- portable AI skill collections;
- generic reusable agents that are intended to install into other repos;
- legacy prompts that have no repo-specific purpose.

## 9. Proposed Plugin Product Model

### 9.1 Plugin Family

The repository should eventually publish a small family of plugins:

| Plugin ID | Purpose | First Candidate Assets |
| --- | --- | --- |
| `lightspeed-github-ops` | Community health, templates, labels, project/release governance | PR review, label governance, release prep, frontmatter audit. |
| `lightspeed-ai-ops-core` | General LightSpeed AI operations skills and agents | Instruction authoring, skill discovery, docs index checks. |
| `lightspeed-wordpress-block-theme` | Block theme development guidance | `theme.json`, block patterns, performance, accessibility. |
| `lightspeed-wordpress-block-plugin` | Block plugin development guidance | block registration, PHP/JS boundaries, tests, security. |
| `lightspeed-talk-blog-kit` | Talk and blog production workflows | Source synthesis, outline building, evidence mapping. |

Only `lightspeed-github-ops` should be implemented first. The others are
backlog groups until the structure and validation model are stable.

### 9.2 First Plugin Scope

The first plugin should be small enough to ship and test quickly:

```text
/plugins/lightspeed-github-ops/
  /.github/plugin/plugin.json
  /README.md
  /agents/
  /skills/
```

Recommended v1 contents:

- one repo governance agent;
- one frontmatter/schema audit skill;
- one PR/review preparation skill;
- one label/template governance skill.

This avoids creating a large marketplace package before the migration rules are
known.

### 9.3 Plugin Manifest Defaults

Each plugin manifest should use a conservative subset of the awesome-copilot
pattern:

```json
{
  "name": "lightspeed-github-ops",
  "description": "LightSpeed GitHub governance, review, release, and AI operations skills.",
  "version": "0.1.0",
  "author": {
    "name": "LightSpeed Team"
  },
  "repository": "https://github.com/lightspeedwp/.github",
  "license": "GPL-3.0",
  "keywords": [
    "github",
    "governance",
    "ai-ops",
    "wordpress"
  ],
  "agents": [
    "./agents"
  ],
  "skills": [
    "./skills/lightspeed-frontmatter-audit",
    "./skills/lightspeed-pr-review",
    "./skills/lightspeed-label-governance"
  ]
}
```

Instruction files should remain top-level source files in v1. Where an
installable plugin needs instruction behaviour, create a skill that applies or
generates the relevant instructions for the target tool. This avoids inventing
a plugin `instructions` field before the target toolchain supports it
consistently.

## 10. Content Migration Strategy

### 10.1 Migration Rules

Each current asset should be routed by intent:

| Current Asset Type | New Home | Rule |
| --- | --- | --- |
| Repo GitHub workflow | `.github/workflows` | Keep in place. |
| Repo community health file | `.github` | Keep in place. |
| Issue, PR, discussion template | `.github` | Keep in place. |
| Saved reply | `.github/SAVED_REPLIES` | Keep in place unless converted into a cookbook example. |
| Portable agent spec | `/agents` | Move after frontmatter and references are updated. |
| Repo-only agent spec | `.github/agents` | Keep only if it maintains this repo. |
| Agent JavaScript runner | Legacy `scripts/agents` until rewritten | Do not move blindly. Rewrite as `/hooks`, `/workflows`, or small scripts inside skills only when needed. |
| Portable instruction | `/instructions` | Split by domain and remove `.github` assumptions. |
| Repo-specific instruction | `.github/instructions` or `.github/copilot-instructions.md` | Keep scoped to maintaining this repo. |
| Durable prompt workflow | `/skills` | Convert into a self-contained skill when it has repeatable steps. |
| Example prompt or recipe | `/cookbook` | Move when it teaches a pattern but is not an installable skill. |
| Obsolete prompt | Archive or delete after review | Do not migrate by default. |
| Portable schema | `/.schemas` | Keep only schemas used by new validators. |
| Repo audit/report | `.github/reports` or `.github/projects` | Keep under repo governance. |

### 10.2 Prompt Migration Decision

The requested target structure does not include `/prompts`.

Therefore:

- prompt files that encode repeatable work should become skills;
- prompt files that teach a reusable example should become cookbook recipes;
- prompt files that are only historical should be archived or deleted;
- the new plugin system should not recreate the old prompt folder by default.

This is a deliberate simplification, not a loss of capability.

### 10.3 Legacy JavaScript Decision

The existing JavaScript automation is useful evidence, but it should be treated
as a legacy runtime until each script has a new purpose.

Decision:

- keep `scripts/` temporarily during migration;
- do not add `scripts/` to the desired permanent structure;
- rewrite only the highest-value agents into small skills, hooks, or workflows;
- separate validation commands from fix/format commands;
- remove large dependencies that are no longer needed after the reset.

## 11. Functional Requirements

### 11.1 Repository Structure

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | Create the requested top-level folder structure. | All target folders exist with README or index files explaining ownership. |
| FR-002 | Keep `.github` focused on repo governance. | `.github/custom-instructions.md` no longer claims to be the home for reusable WordPress project AI assets. |
| FR-003 | Add a migration map. | Every existing agent, instruction, prompt, schema, and runner has a target state: keep, move, convert, archive, or delete. |
| FR-004 | Preserve community-health behaviour. | Issue templates, PR templates, saved replies, labels, and GitHub Actions still work after the restructure. |
| FR-005 | Create a portable source model. | `/agents`, `/instructions`, `/skills`, `/hooks`, `/workflows`, and `/cookbook` contain portable assets only. |

### 11.2 Plugin Distribution

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-101 | Create the `lightspeed-github-ops` pilot plugin. | Plugin folder includes README, plugin manifest, at least one agent, and at least two skills. |
| FR-102 | Add root marketplace metadata if required by the installer. | `.github/plugin/marketplace.json` exists and points to the pilot plugin. |
| FR-103 | Document local installation. | `/docs/plugin-installation.md` explains install and update flows for VS Code and Copilot CLI. |
| FR-104 | Keep plugin content scoped. | Pilot plugin contains GitHub governance assets, not block theme or block plugin guidance. |
| FR-105 | Define future plugin groups. | Backlog docs describe WordPress theme, WordPress plugin, release, and talk/blog plugins. |

### 11.3 Skills And Agents

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-201 | Convert selected durable prompts into skills. | Each selected skill has `/skills/<skill-id>/SKILL.md`. |
| FR-202 | Keep skill folders self-contained. | Skill assets, templates, examples, and scripts live inside that skill folder. |
| FR-203 | Use consistent skill frontmatter. | Skill name matches folder, description is clear, and metadata validates. |
| FR-204 | Move reusable agent specs to `/agents`. | Agent specs no longer depend on `.github`-relative paths unless they are repo-only. |
| FR-205 | Keep repo maintenance agents repo-scoped. | Repo-only agents stay under `.github` until rewritten for portability. |

### 11.4 Validation And Quality Gates

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-301 | Split validation from fixing. | Any `validate:*` command exits without changing files. |
| FR-302 | Add `validate:structure`. | Fails when target folders, README/index files, or required plugin metadata are missing. |
| FR-303 | Add `validate:plugins`. | Validates plugin manifests and referenced agents/skills. |
| FR-304 | Add `validate:skills`. | Validates skill folder shape, `SKILL.md`, frontmatter, and asset references. |
| FR-305 | Add `validate:frontmatter`. | Validates only active source folders and reports stale fields. |
| FR-306 | Add `validate:links`. | Detects broken local links and stale paths after migration. |
| FR-307 | Fix JSON schema syntax. | `.github/schemas/project-fields.schema.json` no longer contains JSON comments or other invalid syntax. |
| FR-308 | Keep tests meaningful. | Coverage either reports meaningful values or is deliberately disabled with a documented rationale. |

### 11.5 Documentation

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-401 | Create an architecture document. | `/docs/architecture.md` explains repo governance, portable source folders, plugin bundles, and installers. |
| FR-402 | Create a migration guide. | `/docs/migration-guide.md` maps old paths to new paths. |
| FR-403 | Create a plugin authoring guide. | `/docs/plugin-authoring.md` explains adding agents, skills, hooks, and plugin manifests. |
| FR-404 | Create a skills backlog. | `/skills/README.md` or `/docs/skills-backlog.md` lists favourite skills and their status. |
| FR-405 | Support the talk/blog narrative. | `/docs/talk-notes/` or `/cookbook/` includes a concise story arc from `.github` control plane to installable plugin. |

## 12. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Language | Use UK English across docs and AI-facing instructions. |
| Security | Never include secrets, customer data, or production-only assumptions in portable assets. |
| Privacy | Treat plugin content as redistributable by default unless marked internal. |
| Maintainability | Prefer small, modular files and simple schemas over broad meta-frameworks. |
| Performance | Avoid heavy dependency installs for simple validation. |
| Accessibility | Preserve accessibility guidance in WordPress and review skills. |
| Portability | Keep core skill and instruction content tool-neutral; isolate tool adapters. |
| Auditability | Every moved or converted file should have a migration decision recorded. |
| Safety | Automation must support dry-run mode before write mode. |

## 13. Architecture Decisions

### AD-001: Keep `.github` As Governance, Not Product Skill Storage

Decision:

`.github` remains central, but its scope narrows to GitHub-native repo
configuration and this repository's own AI maintenance instructions.

Rationale:

This preserves GitHub's special inheritance model while removing ambiguity
about where portable AI assets belong.

### AD-002: Use Top-Level Portable Source Folders

Decision:

Use `/agents`, `/instructions`, `/skills`, `/hooks`, `/workflows`, and
`/cookbook` as source folders.

Rationale:

The structure matches current awesome-copilot conventions and makes the repo
legible to humans and installers.

### AD-003: Pilot One Plugin Before Building A Materialisation Pipeline

Decision:

Implement `lightspeed-github-ops` first. Do not build a large publishing system
until local install and review are proven.

Rationale:

The current repo is already complex. A pilot plugin creates feedback without
locking the team into a premature build architecture.

### AD-004: Convert Prompts Into Skills Or Cookbook Recipes

Decision:

Do not create a new top-level `/prompts` folder in v1.

Rationale:

The requested target structure excludes prompts, and skills are a better unit
for repeatable workflows with instructions, assets, scripts, and examples.

### AD-005: Restart Validation Smaller

Decision:

Build a minimal validation suite after the restructure instead of porting the
current JavaScript/schema layer wholesale.

Rationale:

The current validators are valuable, but they have drift, side effects, and a
large dependency surface. The second generation should be smaller and easier to
trust.

### AD-006: Keep GitHub Actions Separate From Agentic Workflows

Decision:

`.github/workflows` remains GitHub Actions. Top-level `/workflows` stores
portable agentic workflows and reusable AI runbooks.

Rationale:

This prevents naming confusion while preserving the requested folder structure.

## 14. Proposed Phased Delivery Plan

### Phase 0: Freeze, Baseline, And Inventory

Purpose:

Capture the current state before moving files.

Tasks:

- Record current branch, commit, and validation results.
- Generate an inventory of agents, instructions, prompts, schemas, workflows,
  templates, saved replies, and scripts.
- Record all known stale links and broken references.
- Document dependency audit results.
- Create a migration decision table for every current AI asset.

Exit criteria:

- The team can answer where every current asset will go before files move.

### Phase 1: Create Target Skeleton

Purpose:

Introduce the new architecture without breaking existing behaviour.

Tasks:

- Create the requested top-level folders.
- Add README/index files that define each folder's ownership.
- Add `/docs/architecture.md`.
- Add `/docs/migration-guide.md`.
- Add `/skills/README.md` with a favourite skills backlog.
- Add `/plugins/README.md` with plugin family definitions.
- Update `.github/custom-instructions.md` to explain the new boundary.

Exit criteria:

- The repo has the target shape, but existing production behaviour remains
  intact.

### Phase 2: Migrate Portable Instructions And Agent Specs

Purpose:

Move low-risk text assets into the portable layout.

Tasks:

- Move generic instructions to `/instructions`.
- Keep repo-only instructions inside `.github`.
- Move reusable agent specs to `/agents`.
- Keep repo maintenance agents under `.github/agents` until rewritten.
- Update all indexes and local links.
- Run a link audit.

Exit criteria:

- The new source folders contain meaningful portable assets.
- `.github` no longer presents WordPress project AI guidance as repo-level
  instruction.

### Phase 3: Convert Prompts Into Skills And Cookbook Recipes

Purpose:

Simplify the prompt surface and create installable skills.

Tasks:

- Classify every `.github/prompts/*.prompt.md` file.
- Convert repeatable workflows into `/skills/<skill-id>/SKILL.md`.
- Move examples and teaching material to `/cookbook`.
- Archive or delete obsolete prompts after review.
- Create the first `lightspeed-frontmatter-audit` skill.
- Create the first `lightspeed-pr-review` skill.
- Create the first `lightspeed-label-governance` skill.

Exit criteria:

- The pilot plugin has at least two working skills.
- The old prompt folder has a documented migration status.

### Phase 4: Build The Pilot Plugin

Purpose:

Ship the smallest useful installable bundle.

Tasks:

- Create `/plugins/lightspeed-github-ops`.
- Add `.github/plugin/plugin.json`.
- Add plugin README.
- Include selected agent and skill content.
- Add or update root `.github/plugin/marketplace.json` if required by the
  installer.
- Test local install in VS Code and Copilot CLI.
- Document installation and update steps.

Exit criteria:

- A contributor can install the pilot plugin and see the expected assets.

### Phase 5: Restart Validation And Schemas

Purpose:

Replace brittle legacy validation with a smaller trusted set.

Tasks:

- Fix invalid JSON schema syntax.
- Create non-mutating validation commands.
- Add separate `fix:*` or `format:*` commands for auto-formatting.
- Validate plugin manifests.
- Validate skill folders.
- Validate frontmatter for active source folders.
- Validate local links and path references.
- Reduce unused dependencies.
- Decide whether coverage should be fixed or intentionally disabled.

Exit criteria:

- `npm run validate:all` is non-mutating and reliable.
- Dependency count is materially lower or explicitly justified.

### Phase 6: Expand Plugin Family

Purpose:

Add domain-specific bundles only after the pilot is stable.

Tasks:

- Create the WordPress block theme plugin backlog.
- Create the WordPress block plugin plugin backlog.
- Extract release operations skills.
- Extract talk/blog synthesis workflows if useful.
- Add compatibility notes for Codex, Claude Code, ChatGPT, and other agent
  tools.

Exit criteria:

- New plugins follow the same tested authoring and validation model.

## 15. Favourite Skills Backlog

| Skill ID | Plugin Candidate | Priority | Description |
| --- | --- | --- | --- |
| `lightspeed-frontmatter-audit` | `lightspeed-github-ops` | P0 | Audit AI files for frontmatter, schema drift, stale references, and missing indexes. |
| `lightspeed-pr-review` | `lightspeed-github-ops` | P0 | Prepare or review PRs against LightSpeed standards, with security, accessibility, and performance checks. |
| `lightspeed-label-governance` | `lightspeed-github-ops` | P0 | Review labels, issue templates, saved replies, and triage conventions. |
| `lightspeed-release-prep` | `lightspeed-github-ops` | P1 | Check changelog, version sync, tests, and release readiness. |
| `lightspeed-docs-indexer` | `lightspeed-ai-ops-core` | P1 | Keep README, docs indexes, and instruction indexes current. |
| `lightspeed-skill-author` | `lightspeed-ai-ops-core` | P1 | Create new skills using LightSpeed naming, metadata, and evidence conventions. |
| `lightspeed-block-theme-review` | `lightspeed-wordpress-block-theme` | P1 | Review `theme.json`, patterns, templates, accessibility, and performance. |
| `lightspeed-block-plugin-review` | `lightspeed-wordpress-block-plugin` | P1 | Review block plugin structure, PHP/JS boundaries, build assets, tests, and security. |
| `lightspeed-ai-asset-migration` | `lightspeed-ai-ops-core` | P2 | Classify legacy prompts, agents, and instructions into the new layout. |
| `lightspeed-talk-blog-synthesis` | `lightspeed-talk-blog-kit` | P2 | Turn repo evidence and Drive notes into talk outlines and blog drafts. |

## 16. Validation And Test Plan

### 16.1 Current Baseline

| Command | Current Result | PRD Action |
| --- | --- | --- |
| `npm run validate:agents` | Passes after `npm ci`; 13 valid agent files and 6 skipped | Preserve value, then retarget to `/agents` plus repo-scoped `.github/agents`. |
| `npm run validate:workflows` | Passes with 34 warnings | Keep, but address workflow permission/concurrency/cache warnings. |
| `npm run validate:json:schemas` | Fails on invalid JSON and mutates files | Split validate from formatting and fix invalid schema syntax. |
| `npm test` | Passes 41 suites and 181 tests | Fix zero coverage reporting and noisy side effects. |
| `npm ci` | Installs dependencies but reports 36 vulnerabilities | Reduce dependency footprint during JS reset. |

### 16.2 Required New Commands

| Command | Purpose |
| --- | --- |
| `npm run validate:structure` | Confirm required folders, indexes, plugin metadata, and ownership docs exist. |
| `npm run validate:plugins` | Validate plugin manifests and referenced files. |
| `npm run validate:skills` | Validate skill folder shape, `SKILL.md`, metadata, and asset references. |
| `npm run validate:frontmatter` | Validate active AI files against the simplified schema set. |
| `npm run validate:links` | Check local links and stale path references. |
| `npm run format:docs` | Apply formatting explicitly, separate from validation. |
| `npm run fix:schemas` | Apply safe schema or JSON formatting explicitly, separate from validation. |

### 16.3 Quality Gate Rules

- Every validation command must be non-mutating.
- Every fixer command must advertise that it writes files.
- CI must fail on invalid plugin manifests.
- CI must fail on broken local links in active source folders.
- CI must warn, but not immediately fail, on archived legacy folders during the
  migration window.
- Release checks must fail if plugin manifests reference missing agents or
  skills.

## 17. Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Big-bang moves break references | High | Use migration table and link validation before deleting old paths. |
| `.github` loses community-health behaviour | High | Keep GitHub-native files in place and test inheritance assumptions. |
| Plugin duplication creates drift | Medium | Start with one pilot; add materialisation only after source model stabilises. |
| Schema complexity returns | Medium | Keep v1 schemas small and delete unused fields. |
| Tool ecosystem changes again | Medium | Follow awesome-copilot patterns but keep LightSpeed assets tool-neutral. |
| Legacy JavaScript side effects persist | Medium | Quarantine old runners and rewrite only high-value logic. |
| WordPress guidance leaks into repo-level instructions | Medium | Enforce `.github` boundary and split domain plugins. |
| Dependency vulnerabilities remain hidden | Medium | Track `npm audit` baseline and prune dependencies during JS reset. |
| Talk/blog material diverges from implementation | Low | Keep `/docs` and `/cookbook` tied to actual repo evidence. |

## 18. Open Implementation Decisions

These decisions should be resolved before Phase 4 starts:

| Decision | Recommended Default |
| --- | --- |
| Public vs private first marketplace | Private first, public later. |
| Manual plugin materialisation vs build script | Manual for pilot, small build script only after repeated duplication appears. |
| Keep or remove legacy prompts after conversion | Archive first, delete after one release cycle. |
| Coverage target for the simplified JS layer | Start with meaningful coverage for validators only. |
| Codex and Claude Code adapter format | Document compatibility notes after Copilot pilot works. |
| Root package name | Rename only after the new structure is merged and install flow is tested. |

## 19. Acceptance Criteria For The Overall Restructure

The restructure is complete when:

1. The requested top-level folders exist and have clear ownership docs.
2. `.github` is limited to repo governance, GitHub-native files, and
   repo-specific AI maintenance instructions.
3. Portable AI assets live in top-level source folders.
4. The first plugin installs locally and exposes the expected agent and skills.
5. WordPress block theme and block plugin assets are segmented into their own
   planned plugin groups.
6. Every migrated file has a recorded source and target.
7. Stale links to old `.github` paths are fixed or intentionally archived.
8. `validate:*` commands are non-mutating.
9. JSON/YAML/frontmatter validation passes on active source folders.
10. Tests pass without misleading coverage or import-time side effects.
11. The documentation explains the architecture well enough to support the
    WordCamp Europe talk and blog series.

## 20. Immediate Next Actions

Recommended next implementation sequence:

1. Add the target folder skeleton and folder READMEs.
2. Add `/docs/architecture.md` and `/docs/migration-guide.md`.
3. Rewrite `.github/custom-instructions.md` around the new `.github` boundary.
4. Generate the full migration table for agents, instructions, prompts,
   schemas, and runner scripts.
5. Create `/plugins/lightspeed-github-ops` as the pilot plugin.
6. Convert three small pilot skills:
   `lightspeed-frontmatter-audit`, `lightspeed-pr-review`, and
   `lightspeed-label-governance`.
7. Fix `.github/schemas/project-fields.schema.json`.
8. Split validation commands from formatting commands.
9. Run local install tests for the pilot plugin.
10. Use the pilot results to decide whether to build materialisation tooling.

## 21. Appendix: Stale Path Cleanup Candidates

Known cleanup candidates from the audit:

| Stale Or Risky Reference | Current Issue | Recommended Fix |
| --- | --- | --- |
| `.github/instructions/_index.instructions.md` | Referenced but missing | Create a new index or update links to the actual index. |
| `.github/automation/labels.yml` | Folder not present | Update to `.github/labels.yml` or recreate automation path intentionally. |
| `docs/HUSKY-PRECOMMITS.md` | Path spelling mismatch | Update references to `docs/HUSKY_PRECOMMITS.md` or rename consistently. |
| `GEMINI.md` and `CLAUDE.md` | Referenced as existing files but absent | Remove, recreate, or replace with tool adapter docs. |
| `chatmodes` and `collections` | Referenced as current concepts but absent | Archive references or map to skills/cookbook. |
| `.github/prompts` as permanent source | Not in requested target structure | Convert prompts to skills/cookbook/archive. |
| `validate:json:schemas` | Mutates files and fails invalid JSON | Split validate and format; fix schema syntax. |
| Zero-byte `Icon` files | macOS metadata in tracked folders | Remove unless intentionally required. |

## 22. Appendix: Talk And Blog Narrative

This restructure gives the WordCamp Europe talk a clear story arc:

1. Start with `.github` as the organisation control plane.
2. Show how community health, templates, labels, and workflows become shared
   defaults.
3. Explain how AI operations files joined that control plane.
4. Acknowledge the scaling problem: useful assets became trapped in repo
   internals.
5. Introduce awesome-copilot as the reference pattern for plugins, skills,
   hooks, workflows, and MCP-aware discovery.
6. Show the LightSpeed split: `.github` for governance, top-level folders for
   portable AI assets.
7. Demonstrate the pilot plugin as the practical next step.
8. End with the larger vision: composable organisation skills that can travel
   across editors, agents, and project types.
