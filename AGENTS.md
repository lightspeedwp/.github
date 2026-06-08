---
title: "LightSpeed Global AI Rules"
description: "Organisation-wide AI agent rules, coding standards, and contribution guidelines for all LightSpeed WordPress projects."
version: 'v1.6'
last_updated: '2026-06-08'
file_type: "agents-index"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["agents", "ai", "coding-standards", "governance", "wordpress"]
domain: "governance"
stability: "stable"
---

# LightSpeed – Global AI Rules (AGENTS.md)

- Use UK English; optimise for clarity, scalability, maintainability and profitable outcomes.
- Prefer minimal, modular solutions; justify heavier tools with return on investment and maintenance cost.
- Follow WordPress Coding Standards (CSS, HTML, JavaScript, PHP) and inline‑documentation standards at all times.
- All code changes must include lint fixes, relevant tests and a short rationale summarising the change.
- Never output secrets. Treat production and customer data as sensitive. Follow the OWASP top 10 for web security.
- Accessibility and performance are non‑negotiable; highlight potential issues during reviews.
- Prefer `theme.json` and block components over bespoke code when feasible to avoid vendor lock‑in.
- When unsure, propose safe defaults and ask **one** focused question to clarify requirements.
- Core instructions consolidated: see `instructions/{languages,documentation-formats,quality-assurance,automation,community-standards}.instructions.md` (mapping in `docs/MIGRATION.md`).
- Canonical instruction reference policy: use `.github/instructions/` for
  repo-local maintenance guidance and `instructions/` for portable standards;
  see `instructions/file-organisation.instructions.md#canonical-instruction-reference-policy`.

## Agent Directory

- Canonical AI source map: [ai/agents.md](ai/agents.md)
- See [Main Agent Index](agents/agent.md) for all agent implementations and specs.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- All contributors must follow the org [Coding Standards](instructions/coding-standards.instructions.md).

## Agent Test Status

| Agent | Tests | Notes                        |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Contribution Guidelines & Indexes

| Area                      | File Reference                                                                                                                 | Notes / Usage                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Coding Standards**      | [instructions/coding-standards.instructions.md](instructions/coding-standards.instructions.md)                 | Unified standards for all code                                |
| **File Organisation**     | [instructions/file-organisation.instructions.md](instructions/file-organisation.instructions.md) | Where to create reports, tasks, and project files (CRITICAL)  |
| **Quality Assurance**     | [instructions/quality-assurance.instructions.md](instructions/quality-assurance.instructions.md)               | Testing pyramid, Jest, coverage, CI/CD (3 files consolidated) |
| **Languages & Linting**   | [instructions/languages.instructions.md](instructions/languages.instructions.md)                               | JS/TS, JSON, YAML, JSDoc, linting (4 files consolidated)      |
| **Documentation Formats** | [instructions/documentation-formats.instructions.md](instructions/documentation-formats.instructions.md)       | Markdown, YAML frontmatter, Mermaid (3 files consolidated)    |
| **Automation**            | [instructions/automation.instructions.md](instructions/automation.instructions.md)                             | Agents, labeling, release, metrics (8 files consolidated)     |
| **Community Standards**   | [instructions/community-standards.instructions.md](instructions/community-standards.instructions.md)           | Files, naming, README, replies (4 files consolidated)         |

**Consolidated Instructions (5 Files):**

- **languages.instructions.md** - JS/TS, JSON, YAML, JSDoc, linting (consolidated 4 files)
- **documentation-formats.instructions.md** - Markdown, frontmatter, Mermaid, A11y (consolidated 3 files)
- **quality-assurance.instructions.md** - Testing, Jest, coverage, CI/CD (consolidated 3 files)
- **automation.instructions.md** - Agents, labeling, release, metrics (consolidated 8 files)
- **community-standards.instructions.md** - Files, naming, README, saved replies (consolidated 4 files)

---

## PR Templates

- Use the default PR template: [.github/pull_request_template.md](.github/pull_request_template.md)
- Additional PR templates are available in: [.github/PULL_REQUEST_TEMPLATE/](.github/PULL_REQUEST_TEMPLATE/)
  - Use the template most relevant to your change (e.g. feature, fix, documentation, etc.)

## Template Routing

Use [.github/PULL_REQUEST_TEMPLATE/config.yml](.github/PULL_REQUEST_TEMPLATE/config.yml) as the canonical PR routing map, and keep it aligned with [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) and [docs/PR_CREATION_PROCESS.md](docs/PR_CREATION_PROCESS.md).

### PR Template Selection

| Branch prefix | PR template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `test/` | `pr_chore.md` |
| `perf/` | `pr_feature.md` |
| `ci/` | `pr_ci.md` |
| `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_bug.md` |
| `design/` | `pr_feature.md` |
| `a11y/` | `pr_feature.md` |
| `ux/` | `pr_feature.md` |
| `release/` | `pr_release.md` |
| `research/` | `pr_feature.md` |
| `revert/` | `pr_chore.md` |
| `i18n/` | `pr_feature.md` |
| `ops/` | `pr_chore.md` |
| `proto/` | `pr_feature.md` |
| `ds/` | `pr_feature.md` |
| `api/` | `pr_feature.md` |
| `schema/` | `pr_feature.md` |
| `telemetry/` | `pr_feature.md` |
| `content/` | `pr_docs.md` |
| `seo/` | `pr_docs.md` |
| `config/` | `pr_chore.md` |
| `migrate/` | `pr_chore.md` |
| `qa/` | `pr_chore.md` |
| `uat/` | `pr_chore.md` |

### Issue Template Selection

Use [.github/ISSUE_TEMPLATE/config.yml](.github/ISSUE_TEMPLATE/config.yml) and [.github/issue-types.yml](.github/issue-types.yml) as the canonical issue intake source.

- `task` for scoped work, config updates, and small delivery items.
- `bug` for reproducible defects with environment and reproduction details.
- `feature` for new capabilities or user-visible enhancements.
- `design` for UI/UX, token, or accessibility design work.
- `testing-coverage` for new or refactored automated tests.
- `performance` for speed, resource, or latency work.
- `security` for vulnerabilities or security hardening.
- `documentation` for docs and content updates.
- `research` and `audit` for exploratory or assessment work.
- `automation`, `build-ci`, `ai-ops`, and `content-modelling` for their specialist workflows.

---

## Core Index Instructions

Start here for all key standards:

- [Coding Standards Index](instructions/coding-standards.instructions.md): Unified standards, best practices, and documentation for all LightSpeed projects.
- [Linting Instructions Index](instructions/linting.instructions.md): Primary index and guidance for all linting rules, tools, and file-type-specific standards.

---

## Cross-References & Discoverability

| Resource Name             | Reference                                                        | Purpose / Notes                                                    |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Instructions Guide**    | [instructions/instructions.instructions.md](instructions/instructions.instructions.md) | Guide for authoring and maintaining instruction files              |
| **Custom Instructions**   | [.github/custom-instructions.md](.github/custom-instructions.md) | Repo-local Copilot instructions and `.github` boundary rules       |
| **Claude Instructions**   | [CLAUDE.md](CLAUDE.md)                                           | Claude-specific project instructions; companion to this file       |
| **Main Agent Index**      | [agents/agent.md](agents/agent.md)                               | Directory of agent specs, stubs, usage, implementation             |
| **Prompts Index**         | [.github/prompts/prompts.md](.github/prompts/prompts.md)         | Legacy prompt index pending skills/cookbook migration              |
| **Instruction Migration** | [docs/MIGRATION.md](docs/MIGRATION.md)                         | Mapping from legacy instruction files to the 5 consolidated guides |

---

## References

- [Contributing Guidelines](CONTRIBUTING.md) - For human contributors
- [Main Documentation](README.md) - Project overview
- [Frontmatter Schema](schema/frontmatter.schema.json) - Schema validation

*This file is the canonical reference for all AI agent rules and coding standards in LightSpeedWP projects.
All contributors, agents, and AI assistants must comply with these standards.*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
