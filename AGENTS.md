---
title: "LightSpeed Global AI Rules"
description: "Organisation-wide AI agent rules, coding standards, and contribution guidelines for all LightSpeed WordPress projects."
version: "v1.1"
last_updated: "2025-12-07"
file_type: "agents-index"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["agents", "ai", "coding-standards", "governance", "wordpress"]
domain: "governance"
stability: "stable"
references:
  - path: "agents/agent.md"
    description: "Main agent implementations index"
  - path: ".github/custom-instructions.md"
    description: "Repo-local Copilot and agent instructions"
  - path: ".github/prompts/prompts.md"
    description: "Prompts index"
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
- Core instructions consolidated: see `instructions/{languages,documentation-formats,quality-assurance,automation,community-standards}.instructions.md` (mapping in `MIGRATION_GUIDE.md`).

## Agent Directory

- See [Main Agent Index](agents/agent.md) for all agent implementations and specs.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- All contributors must follow the org [Coding Standards](instructions/coding-standards.instructions.md).

## Agent Test Status

| Agent | Tests | Notes                        |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Branch Naming Governance (CRITICAL)

**All branches MUST follow this pattern:** `{type}/{scope}-{title}`

This is enforced globally across all LightSpeed projects. See [CLAUDE.md — Branch Naming](CLAUDE.md#-branch-naming--critical-read-first) for complete details, 34 allowed type values, examples, and why this matters.

### Quick Reference

✅ **Correct:**

- `feat/governance-audit-implementation`
- `fix/pr-template-routing-bug`
- `docs/branching-strategy-guide`

❌ **Forbidden (never use):**

- `claude/something` — Reserved for Claude Code internal sessions
- `copilot/something` — Reserved for GitHub Copilot integration
- `openai/something` — Reserved for OpenAI integration

### Why This Matters

Incorrect branch names cause:

1. PR template assignment failures
2. GitHub Actions workflow failures
3. Validation check failures
4. Downstream automation breaks

### Before You Push

```bash
npm run validate:branch-name -- --branch <your-branch>
```

### Full Reference

- **Complete guidance:** [CLAUDE.md — Branch Naming](CLAUDE.md#-branch-naming--critical-read-first) (34 types, examples, consequences)
- **Detailed rules:** [.github/instructions/branch-naming.instructions.md](.github/instructions/branch-naming.instructions.md)
- **Strategy doc:** [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md)
- **Copilot-specific:** [.github/custom-instructions.md](.github/custom-instructions.md)

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

## Label Creation Governance (CRITICAL)

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **All labels MUST include family prefix**:
   - `type:*` for issue classification (bug, feature, documentation, task, design, etc.)
   - `status:*` for workflow state (needs-triage, ready, in-progress, blocked, done, etc.)
   - `priority:*` for urgency (critical, important, normal, minor)
   - `area:*` for domain/component (ci, docs, security, labels, tests, scripts, etc.)
   - `meta:*` for automation markers (needs-changelog, has-pr, duplicate, etc.)

### Example: Creating an issue with correct labels

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:block-editor" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "block-editor" \
  --label "normal" \
  --label "needs-triage"
```

### Validation Checklist

Before creating any issue programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
- [ ] No bare labels (labels without colons are invalid)

**Reference**: `.github/scripts/validation/validate-labels-before-creation.cjs`

---

## PR Templates

- Use the default PR template: [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
- Additional PR templates are available in: [.github/PULL_REQUEST_TEMPLATE/](.github/PULL_REQUEST_TEMPLATE/)
  - Use the template most relevant to your change (e.g. feature, fix, documentation, etc.)

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
| **Instruction Migration** | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)                         | Mapping from legacy instruction files to the 5 consolidated guides |

---

## Label Creation Governance (CRITICAL)

### For Programmatic Issue and PR Creation

When your code creates issues or PRs via `gh issue create`, `gh pr create`, or GitHub API:

1. **Always validate labels against the canonical set** (`.github/labels.yml`)
2. **ALL labels MUST include family prefix** — never apply bare labels
3. **Prefix families and examples**:
   - `type:*` — bug, feature, documentation, task, design, security, performance, a11y
   - `status:*` — needs-triage, ready, in-progress, blocked, review, done
   - `priority:*` — critical, high, normal, low
   - `area:*` — ci, docs, security, labels, tests, scripts, automation, etc.
   - `meta:*` — needs-changelog, has-pr, duplicate, needs-audit

### Example: Creating an Issue with Correct Labels

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:core" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes (DO NOT USE)
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "core" \
  --label "normal" \
  --label "needs-triage"
```

### Pre-Creation Validation Checklist

Before creating any issue or PR programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, `priority:`, `meta:`)
- [ ] No bare labels without colons
- [ ] Canonical case (lowercase, hyphens for spaces)

### References

- **Canonical labels**: `.github/labels.yml` (158 prefixed labels)
- **Label taxonomy**: `docs/LABEL_STRATEGY.md`
- **Labeling guide**: `docs/LABELING.md`
- **Governance audit**: [Issue #1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Enforcement

---

## References

- [Contributing Guidelines](CONTRIBUTING.md) - For human contributors
- [Main Documentation](README.md) - Project overview
- [Frontmatter Schema](.schemas/frontmatter.schema.json) - Schema validation

*This file is the canonical reference for all AI agent rules and coding standards in LightSpeedWP projects.
All contributors, agents, and AI assistants must comply with these standards.*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
