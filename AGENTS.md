---
title: "LightSpeed Global AI Rules"
description: "Organisation-wide AI agent rules, coding standards, and contribution guidelines for all LightSpeed WordPress projects."
version: 'v2.0'
last_updated: '2026-08-05'
file_type: "agents-index"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["agents", "ai", "coding-standards", "governance", "wordpress", "phase-1-restructuring"]
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
- **Instruction reference policy (Phase 1A):** Use `.github/instructions/` for repo-local guidance only; use `instructions/` (root) for portable standards shared across LightSpeedWP projects. See [file-organisation.instructions.md](instructions/file-organisation.instructions.md) for placement rules.
- **Agent tier structure (Phase 1C):** Portable agents (multi-file implementations) live in `agents/` (root); spec-based agents (simple YAML/JSON definitions) live in `.github/agents/` (GitHub-native, control-plane only). See [Agent Directory](#agent-directory) for specs and examples.
- **Schemas location (Phase 1B):** JSON validation schemas live in `schemas/` (hidden folder at repo root, following awesome-copilot pattern). Reference validation is performed against `schemas/{type}.schema.json` files. See [Issue #1292](https://github.com/lightspeedwp/.github/issues/1292) for consolidation details.

## Agent Directory

### Two-Tier Agent Structure (Phase 1C)

The repository implements a two-tier agent architecture established during Phase 1 restructuring (2026-08-02):

#### 1. Portable Agents — `agents/` (Root)

- **Purpose:** Reusable, multi-file agent implementations shared across LightSpeedWP projects
- **Structure:** `agents/{name}-agent/` directory with:
  - `AGENT.md` — main agent definition
  - `claude/` — Claude implementation (provider-specific)
  - `copilot/` — Copilot implementation (provider-specific)
  - `openai/` — OpenAI implementation (provider-specific)
  - Supporting documentation and configuration files
- **Use When:** Building reusable, installable agents for external use or multi-project deployment
- **Examples:** `prd-agent/`, `playwright-testing-agent/`, `linear-advisor-agent/`
- **Standards:** Follow [AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) and [file-organisation.instructions.md](instructions/file-organisation.instructions.md#file-placement-rules)

#### 2. Spec-Based Agents — `.github/agents/` (GitHub-Native Only)

- **Purpose:** Simple, single-file agent definitions for control-plane automation; GitHub-specific
- **Structure:** Single `.agent.md` file per agent with YAML frontmatter and agent definition
- **Use When:** Creating GitHub Actions automation, labeling rules, release automation, or control-plane workflows
- **Scope:** Repository-specific; not intended for external distribution or reuse
- **Examples:** `labeling.agent.md`, `release.agent.md`, `metrics.agent.md`
- **Standards:** Follow [AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) spec-based section

### Discovery & Implementation

- **Canonical AI source map:** [ai/agents.md](ai/agents.md) — curated reference of all agent implementations
- **Portable agent index:** [agents/](agents/) directory — browse multi-file agent implementations
- **Spec-based agent index:** [.github/agents/](.github/agents/) — browse single-file GitHub automation agents
- **Each agent must:** Follow the template in [AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) for its respective tier
- **All contributors must:** Follow [Coding Standards](instructions/coding-standards.instructions.md) organisation-wide

### Related Documentation

**Phase 1 Audit Reports (Completed 2026-08-05):**

- **Agent Audit (Phase 1C):** [AGENT-AUDIT-COMPREHENSIVE.md](./.github/projects/active/repo-restructuring-2026-07-25/AGENT-AUDIT-COMPREHENSIVE.md) — 35 agents catalogued (19 spec-based, 16 multi-file), 788+ references mapped, two-tier structure validated
- **Instruction Audit (Phase 1A):** [INSTRUCTION_FILES_AUDIT_2026-08-05.md](./.github/projects/active/repo-restructuring-2026-07-25/INSTRUCTION_FILES_AUDIT_2026-08-05.md) — 58 instruction files audited, 502+ references, portable/local classification complete
- **Schema Audit (Phase 1B):** [SCHEMA_AUDIT_REPORT.md](./.github/projects/active/repo-restructuring-2026-07-25/SCHEMA_AUDIT_REPORT.md) — 25 core schemas across 3 locations, consolidation plan documented

**Phase Implementation Issues:**

- **Phase 1C Migration:** [Issue #1293](https://github.com/lightspeedwp/.github/issues/1293) — Two-tier agent structure implementation
- **Phase 1A Migration:** [Issue #1299](https://github.com/lightspeedwp/.github/issues/1299) — Instruction files audit & reorganization (Restructured)
- **Phase 1B Migration:** [Issue #1300](https://github.com/lightspeedwp/.github/issues/1300) — Schema consolidation audit (Restructured)
- **File Organization Audit:** [Issue #653](https://github.com/lightspeedwp/.github/issues/653) — Agent standardization history

**Other References:**

- **Memory Profile System:** Memory profiles expect root-level agent paths (`agents/` only; spec-based agents in `.github/` are control-plane specific)
- **Phase 2 Governance Updates:** [Issue #1295](https://github.com/lightspeedwp/.github/issues/1295) — Update CLAUDE.md, AGENTS.md documentation

## Agent Test Status

| Agent | Tests | Notes                        |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Canonical Paths (Phase 1 Consolidation)

The following canonical paths document the Phase 1 restructuring (2026-08-02). All asset creation and referencing must use these paths.

### Instructions

| Asset Type | Phase 1 Path | Use Case | Scope |
| --- | --- | --- | --- |
| **Portable Instructions** | `instructions/{name}.instructions.md` | Reusable standards across all LightSpeedWP projects | Org-wide |
| **Repo-Local Instructions** | `.github/instructions/{name}.instructions.md` | Control-plane specific guidance | This repo only |
| **Instruction Index** | `instructions/instructions.instructions.md` | Guide for authoring instruction files | Reference |

**Key Examples:**

- Portable: `instructions/coding-standards.instructions.md`, `instructions/file-organisation.instructions.md`
- Repo-local: `.github/instructions/` (control-plane customizations)

### Schemas

| Asset Type | Phase 1 Path | Purpose | Reference |
| --- | --- | --- | --- |
| **Validation Schemas** | `schemas/{type}.schema.json` | JSON schema definitions (hidden folder) | All validation |
| **Frontmatter Schema** | `schemas/frontmatter.schema.json` | Metadata validation for all structured files | YAML frontmatter |
| **Issue Types Schema** | `schemas/issue-types.schema.json` | Issue type definitions | GitHub automation |

**Note:** `schemas/` is a hidden folder at repo root following the awesome-copilot pattern. All JSON schema validation references this location.

### Agents

| Tier | Phase 1 Path | Structure | Distribution |
| --- | --- | --- | --- |
| **Portable Agents** | `agents/{name}-agent/` | Multi-file with AGENT.md + provider subdirs | Reusable, installable |
| **Spec-Based Agents** | `.github/agents/{name}.agent.md` | Single-file YAML/JSON definitions | Control-plane only |
| **Agent Standards** | `docs/AGENT_STANDARDS.md` | Normative standard for all agents | Reference |

### Reports & Projects

| Asset Type | Phase 1 Path | Use Case |
| --- | --- | --- |
| **Active Projects** | `.github/projects/active/{slug}/` | In-progress work, epic tracking, milestone deliverables |
| **Reports** | `.github/reports/{category}/` | Metrics, audits, status updates, structured data |
| **Temporary Files** | `.github/tmp/` | Scratch space (clean up before PR) |

### Other Key Locations

| Asset Type | Phase 1 Path | Purpose |
| --- | --- | --- |
| **Skills** | `skills/{name}/` | Self-contained reusable skills with SKILL.md |
| **Workflows** | `workflows/{name}/` | Portable agentic workflow patterns |
| **Hooks** | `hooks/` | Event-driven automation hooks |
| **Cookbooks** | `cookbook/` | Implementation guides and recipes |
| **Plugins** | `plugins/` | Installable plugin bundles |
| **AI References** | `ai/` | Canonical AI model references (Claude, Gemini, RUNNERS) |
| **Portable Scripts** | `scripts/` | Reusable scripts shared across projects |
| **Documentation** | `docs/` | Permanent human documentation and standards |

---

## Branch Governance

All AI agents **must** follow these branching rules before editing files:

1. **Validate the branch name** — run `npm run validate:branch-name -- --branch <name>` before the first edit. The branch must match `{type}/{scope}-{short-title}` format.
2. **Check for branch reuse** — the validation script automatically detects branches that have already been merged. If flagged, create a new branch with a distinct name.
3. **Verify the merge target** — feature/fix/chore branches target `develop`. Only `release/*` and `hotfix/*` may target `main`.
4. **Never use `claude/` as a branch prefix** — this prefix is explicitly forbidden.
5. **Delete branches after merge** — remote and local branches must be cleaned up immediately after a successful squash merge.

See [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) and [CLAUDE.md](CLAUDE.md) for the full policy.

---

## GitHub Template Governance

All AI agents **must** enforce template compliance when creating pull requests and issues. This section provides programmatic guidance.

### Pull Request Templates (Preventative Enforcement)

PR template enforcement is **preventative**—the workflow blocks merges that don't include required sections:

**When creating PRs via `gh pr create`:**

1. Determine the PR type from the branch prefix (`fix/`, `feat/`, `docs/`, etc.)
2. Read the corresponding template from `.github/PULL_REQUEST_TEMPLATE/pr_*.md`
3. Include required sections in the PR body:
   - **Linked issues** — use `Fixes #123` or `Relates to #456`
   - **Changelog** — add entries under `### Fixed`, `### Added`, `### Changed`, `### Removed`
   - **Checklist** — mark items as `[x]` (completed) or `[ ]` (incomplete)
4. The workflow `validate-pr-template.yml` will validate and block merge if sections are missing

**Template locations:**

```
.github/PULL_REQUEST_TEMPLATE/
├── pr_feature.md      ← feat/, design/, a11y/, ux/, i18n/, perf/, research/
├── pr_bug.md          ← fix/, security/
├── pr_hotfix.md       ← hotfix/
├── pr_refactor.md     ← refactor/
├── pr_chore.md        ← chore/, test/, ops/, config/, migrate/, qa/, uat/
├── pr_ci.md           ← ci/, build/
├── pr_dep_update.md   ← deps/
├── pr_docs.md         ← docs/, content/, seo/
├── pr_release.md      ← release/
└── config.yml         ← routing rules
```

### Issue Templates (Reactive Enforcement)

Issue template enforcement is **reactive**—the workflow validates after creation and flags non-compliant issues with `status:needs-more-info`.

**When creating issues via `gh issue create`:**

1. **Determine the issue type** based on the problem:
   - `bug.md` — reproducible defects, errors, crashes
   - `code-refactor.md` — code cleanup, simplification (not user-facing)
   - `feature.md` — new capabilities or user-visible enhancements
   - `design.md` — UI/UX, token, or accessibility design
   - `epic.md` — large, multi-part initiatives
   - `story.md` — user-centric narratives with acceptance criteria
   - `improvement.md` — enhancements to existing functionality
   - `task.md` — scoped work, config updates, small delivery items
   - `chore.md` — small housekeeping (label hygiene, repo tweaks)
   - `testing-coverage.md` — new or refactored automated tests
   - `performance.md` — speed, resource, or latency work
   - `a11y.md` — accessibility compliance (WCAG 2.2 AA)
   - `security.md` — vulnerabilities or hardening
   - `compatibility.md` — cross-version, browser, or platform issues
   - Other types: `build-ci.md`, `automation.md`, `integration-issue.md`, `release.md`, `maintenance.md`, `documentation.md`, `research.md`, `audit.md`, `code-review.md`, `ai-ops.md`, `content-modelling.md`

2. **Read the template file** from `.github/ISSUE_TEMPLATE/{NN}-{type}.md`

3. **Extract required sections** from the template:
   - All issue templates require:
     - `## Definition of Ready (DoR)` — pre-work checklist
     - `## Definition of Done (DoD)` — completion checklist
   - Template-specific sections (e.g., "Describe the bug", "Reproduction", "Expected behavior")

4. **Build the issue body** by:
   - Including all template sections
   - Marking appropriate checklist items as `[x]` (completed)
   - Filling in content for each section
   - Removing placeholder text

5. **Validate before posting:**

   ```javascript
   function validateIssueBody(body) {
     const required = [
       'Definition of Ready (DoR)',
       'Definition of Done (DoD)'
     ];
     return required.every(section => 
       body.includes(`## ${section}`)
     );
   }
   
   if (!validateIssueBody(body)) {
     throw new Error('Missing required template sections: DoR and/or DoD');
   }
   ```

6. **Create the issue** with the validated body:

   ```bash
   gh issue create --title "Title" --body "$body"
   ```

7. **The workflow `template-enforcement.yml` will validate:**
   - If compliant: Issue progresses normally
   - If non-compliant: Gets flagged with `status:needs-more-info` label
   - AI-created issues: Specific automation feedback is added

**Template directory structure:**

```
.github/ISSUE_TEMPLATE/
├── 01-bug.md
├── 02-code-refactor.md
├── 03-feature.md
├── 04-design.md
├── 05-epic.md
├── 06-story.md
├── 07-improvement.md
├── 08-task.md
├── 09-chore.md
├── 10-testing-coverage.md
├── 11-performance.md
├── 12-a11y.md
├── 13-security.md
├── 14-compatibility.md
├── 15-build-ci.md
├── 16-automation.md
├── 17-integration-issue.md
├── 18-release.md
├── 19-maintenance.md
├── 20-documentation.md
├── 21-research.md
├── 22-audit.md
├── 23-code-review.md
├── 24-ai-ops.md
├── 25-content-modelling.md
└── config.yml
```

**Key Enforcement Rules:**

- ✅ Both DoR and DoD sections **must** be present in the body
- ✅ Sections must be visible text (not in HTML comments)
- ✅ Follow the template structure from the issue template file
- ✅ Validate before creation to avoid reactive flagging
- ✅ If flagged with `status:needs-more-info`, update the issue with proper sections

**Example: Creating a bug issue programmatically**

```bash
#!/bin/bash

# Read template
TEMPLATE=$(cat .github/ISSUE_TEMPLATE/01-bug.md)

# Extract DoR and DoD sections
DOR=$(echo "$TEMPLATE" | sed -n '/## Definition of Ready/,/## Definition of Done/p' | head -n -1)
DOD=$(echo "$TEMPLATE" | sed -n '/## Definition of Done/,$p')

# Build issue body with content
BODY="## Describe the bug
The bug description here.

## To Reproduce
1. Step one
2. Step two
3. See error

## Expected behavior
What should happen instead.

## Additional Context
Any other info.

---

$DOR

$DOD"

# Validate
if ! echo "$BODY" | grep -q "Definition of Ready\|Definition of Done"; then
  echo "ERROR: Missing required template sections"
  exit 1
fi

# Create issue
gh issue create --title "Bug title" --body "$BODY"
```

---

## Label Creation for Programmatic Issue Creation

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **All labels MUST include family prefix**:
   - `type:*` for issue classification (bug, feature, documentation, task, design, etc.)
   - `status:*` for workflow state (needs-triage, ready, in-progress, blocked, done, etc.)
   - `priority:*` for urgency (critical, important, normal, minor)
   - `area:*` for domain/component (ci, docs, security, labels, tests, scripts, etc.)
   - `meta:*` for automation markers (needs-changelog, has-pr, duplicate, etc.)

**Example: Creating an issue with correct labels**

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

**Validation Checklist**

Before creating any issue programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
- [ ] No bare labels (labels without colons are invalid)
- [ ] Root cause analysis: [Label Prefix Enforcement Project](./.github/projects/active/label-prefix-enforcement-2026-08-05/)

---

## Contribution Guidelines & Indexes (Phase 1A Consolidated)

| Area                      | File Reference (Phase 1A) | Scope | Type |
| --- | --- | --- | --- |
| **Documentation Standards** | [docs/AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) + 8 more | Normative standards for agents, skills, workflows, plugins (SEE SECTION BELOW) | Portable |
| **Coding Standards** | [instructions/coding-standards.instructions.md](instructions/coding-standards.instructions.md) | Unified standards for PHP, JS/TS, CSS, HTML across all code | Portable |
| **File Organisation** | [instructions/file-organisation.instructions.md](instructions/file-organisation.instructions.md) | Where to create reports, tasks, agents, scripts, and project files (CRITICAL) | Portable |
| **Quality Assurance** | [instructions/quality-assurance.instructions.md](instructions/quality-assurance.instructions.md) | Testing pyramid, Jest, coverage targets, CI/CD practices (3 files consolidated) | Portable |
| **Languages & Linting** | [instructions/languages.instructions.md](instructions/languages.instructions.md) | JS/TS, JSON, YAML, JSDoc, linting rules (4 files consolidated) | Portable |
| **Documentation Formats** | [instructions/documentation-formats.instructions.md](instructions/documentation-formats.instructions.md) | Markdown, YAML frontmatter, Mermaid diagram standards (3 files consolidated) | Portable |
| **Automation** | [.github/instructions/automation.instructions.md](.github/instructions/automation.instructions.md) | GitHub automation, release automation, labeling rules, metrics (control-plane-specific) | Repo-local |
| **Community Standards** | [instructions/community-standards.instructions.md](instructions/community-standards.instructions.md) | Files, naming conventions, README patterns, saved replies (4 files consolidated) | Portable |
| **Custom Instructions** | [.github/custom-instructions.md](.github/custom-instructions.md) | Repo-local Copilot and control-plane agent guidance | Repo-local |

**Consolidated Instructions (5 Files):**

- **languages.instructions.md** - JS/TS, JSON, YAML, JSDoc, linting (consolidated 4 files)
- **documentation-formats.instructions.md** - Markdown, frontmatter, Mermaid, A11y (consolidated 3 files)
- **quality-assurance.instructions.md** - Testing, Jest, coverage, CI/CD (consolidated 3 files)
- **automation.instructions.md** - Agents, labeling, release, metrics (consolidated 8 files)
- **community-standards.instructions.md** - Files, naming, README, saved replies (consolidated 4 files)

---

## Documentation Standards

All agents, skills, instructions, and related AI infrastructure must follow the 9 comprehensive standards documented below. These standards ensure consistency, maintainability, and professional quality across all AI-driven components.

### Quick Reference Guide

| Standard | Primary Use | Key Sections | Reference |
| --- | --- | --- | --- |
| **Agent Standards** | Single-file & folder-based agent design | Architecture, structure, configuration, patterns | [docs/AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) |
| **Skills Standards** | Shared and dedicated skill creation | Skill lifecycle, structure, templates, quality gates | [docs/SKILLS_STANDARDS.md](docs/SKILLS_STANDARDS.md) |
| **Instructions Standards** | Portable instruction files for agents | File structure, frontmatter, role declarations, validation | [docs/INSTRUCTIONS_STANDARDS.md](docs/INSTRUCTIONS_STANDARDS.md) |
| **Workflows Standards** | Reusable agentic workflow patterns | Execution patterns, composition, error handling, examples | [docs/WORKFLOWS_STANDARDS.md](docs/WORKFLOWS_STANDARDS.md) |
| **Cookbooks Standards** | Implementation guides and recipes | Cookbook lifecycle, structure, audience targeting, testing | [docs/COOKBOOKS_STANDARDS.md](docs/COOKBOOKS_STANDARDS.md) |
| **Prompts Standards** | Reusable prompt templates & patterns | Prompt lifecycle, taxonomy, composition rules, validation | [docs/PROMPTS_STANDARDS.md](docs/PROMPTS_STANDARDS.md) |
| **Plugins Standards** | Claude Code plugin architecture | Plugin lifecycle, structure, manifest, validation | [docs/PLUGINS_STANDARDS.md](docs/PLUGINS_STANDARDS.md) |
| **Hooks Standards** | Event-driven hooks for automation | Hook execution, structure, validation, patterns | [docs/HOOKS_STANDARDS.md](docs/HOOKS_STANDARDS.md) |
| **AI References Standards** | Canonical AI model & runner references | Reference lifecycle, maintenance, scope, tools | [docs/AI_REFERENCES_STANDARDS.md](docs/AI_REFERENCES_STANDARDS.md) |

### When to Use Each Standard

- **Creating a new agent?** → Read [AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md)
- **Building a reusable skill?** → Read [SKILLS_STANDARDS.md](docs/SKILLS_STANDARDS.md)
- **Writing instruction files?** → Read [INSTRUCTIONS_STANDARDS.md](docs/INSTRUCTIONS_STANDARDS.md)
- **Designing an agentic workflow?** → Read [WORKFLOWS_STANDARDS.md](docs/WORKFLOWS_STANDARDS.md)
- **Creating a how-to guide?** → Read [COOKBOOKS_STANDARDS.md](docs/COOKBOOKS_STANDARDS.md)
- **Building prompt templates?** → Read [PROMPTS_STANDARDS.md](docs/PROMPTS_STANDARDS.md)
- **Developing a plugin?** → Read [PLUGINS_STANDARDS.md](docs/PLUGINS_STANDARDS.md)
- **Creating event hooks?** → Read [HOOKS_STANDARDS.md](docs/HOOKS_STANDARDS.md)
- **Maintaining AI references?** → Read [AI_REFERENCES_STANDARDS.md](docs/AI_REFERENCES_STANDARDS.md)

### Standards Highlights

Each standard document includes:

- **Overview** — Purpose, scope, and use cases
- **Lifecycle** — Phases from creation through maintenance
- **Structure** — File organisation and mandatory sections
- **Quality Gates** — Validation rules and compliance checklist
- **Examples** — Real-world implementations and templates
- **References** — Related standards and cross-links

### Compliance & Validation (Phase 1B Schemas)

All standards include:

- **Frontmatter schema validation** — All YAML frontmatter validated against `schemas/frontmatter.schema.json` (Phase 1B canonical location)
- **Linting enforcement** — Markdown and content validation via `npm run lint:md`
- **Schema type checking** — Schema compliance via `npm run validate:frontmatter` and type-specific validators
- **CI enforcement** — Automated validation via `.github/workflows/` (prevents non-compliant files from merging)
- **Schema reference** — All validation schemas consolidated to `schemas/{type}.schema.json` (hidden root folder)

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
| `schemas/` | `pr_feature.md` |
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
- `epic` for large, multi-part initiatives grouping stories, features, and tasks.
- `story` for user-centric narratives with acceptance criteria and business value.
- `improvement` for suggested enhancements to existing functionality.
- `chore` for small housekeeping tasks: label hygiene, repo tweaks, file moves.
- `code-refactor` for structured code cleanup without changing external behaviour.
- `build-ci` for build system, CI/CD, and pipeline changes.
- `automation` for workflow automation and tooling.
- `testing-coverage` for new or refactored automated tests.
- `performance` for speed, resource, or latency work.
- `a11y` for accessibility compliance and WCAG 2.2 AA improvements.
- `security` for vulnerabilities or security hardening.
- `compatibility` for cross-version, browser, or platform compatibility issues.
- `integration-issue` for third-party system integration problems.
- `release` for release planning, coordination, and delivery.
- `maintenance` for system maintenance, dependency updates, and housekeeping.
- `documentation` for docs and content updates.
- `research` and `audit` for exploratory or assessment work.
- `code-review` for code quality discussions and review standards.
- `ai-ops` and `content-modelling` for specialist AI and content workflows.

### Saved Replies

Canonical saved replies for common issue/PR/discussion responses live in `.github/SAVED_REPLIES/`. When drafting a comment or response, check whether a saved reply applies before writing from scratch. Replies are organised by context:

- `issues/` — triage, labels, stale, duplicate, escalation responses
- `pull-requests/` — review guidance, blocking, merge readiness
- `technical/` — environment, reproduction, dependency responses
- `workflow/` — branch, release, CI/CD status updates

Use the saved reply content directly or adapt it to the specific context. Do not acknowledge to the user that you are using a saved reply unless asked.

---

## Core Index Instructions

Start here for all key standards:

- [Coding Standards Index](instructions/coding-standards.instructions.md): Unified standards, best practices, and documentation for all LightSpeed projects.
- [Linting Instructions Index](instructions/linting.instructions.md): Primary index and guidance for all linting rules, tools, and file-type-specific standards.

---

## Cross-References & Discoverability

| Resource Name             | Reference | Phase | Purpose / Notes |
| --- | --- | --- | --- |
| **Documentation Standards** | [docs/AGENT_STANDARDS.md](docs/AGENT_STANDARDS.md) (+ 8 more) | Core | 9 comprehensive standards for all AI infrastructure (see "Documentation Standards" section) |
| **Instructions Guide** | [instructions/instructions.instructions.md](instructions/instructions.instructions.md) | Phase 1A | Guide for authoring portable instruction files (consolidated, root-level) |
| **File Organisation** | [instructions/file-organisation.instructions.md](instructions/file-organisation.instructions.md) | Phase 1A | Canonical placement rules for agents, scripts, reports, and all assets |
| **Custom Instructions** | [.github/custom-instructions.md](.github/custom-instructions.md) | Repo-local | Control-plane Copilot instructions and `.github` boundary definitions |
| **Claude Instructions** | [CLAUDE.md](CLAUDE.md) | Repo-local | Claude-specific guidance including Phase 1 Path Reference section |
| **Portable Agent Index** | [agents/](agents/) directory | Phase 1C | Directory listing all multi-file portable agents at root |
| **Spec-Based Agent Index** | [.github/agents/](.github/agents/) directory | Phase 1C | Directory listing all single-file GitHub automation agents |
| **Prompts Index** | [.github/prompts/prompts.md](.github/prompts/prompts.md) | Legacy | Legacy prompt index (pending migration to skills/cookbook) |
| **Instruction Migration** | [docs/MIGRATION.md](docs/MIGRATION.md) | Phase 1A | Mapping from legacy files to 5 consolidated instruction guides |
| **Repository Restructuring** | [Issue #1438](https://github.com/lightspeedwp/.github/issues/1438) | Phase 1 | Epic tracking Phase 1A (instructions), 1B (schemas), 1C (agents) implementation |
| **Schema Consolidation** | [Issue #1292](https://github.com/lightspeedwp/.github/issues/1292) | Phase 1B | Schema migration from `schema/` → `schemas/` (hidden root folder) |
| **Agent Two-Tier Structure** | [Issue #1293](https://github.com/lightspeedwp/.github/issues/1293) | Phase 1C | Agent architecture migration: portable (`agents/`) + spec-based (`.github/agents/`) |

---

## References

**Foundational Documentation:**

- [Contributing Guidelines](CONTRIBUTING.md) — For human contributor guidelines
- [Main Documentation](README.md) — Project overview and core documentation
- [CLAUDE.md](CLAUDE.md) — Claude-specific instructions and Phase 1 Path Reference

**Phase 1 Structure (2026-08-02):**

- [Phase 1A: Instruction Consolidation](docs/MIGRATION.md) — Portable instructions consolidated to root `instructions/`
- [Phase 1B: Schema Consolidation](https://github.com/lightspeedwp/.github/issues/1292) — Schemas moved to `schemas/` (hidden root folder)
- [Phase 1C: Agent Two-Tier Structure](https://github.com/lightspeedwp/.github/issues/1293) — Portable agents in `agents/` + spec-based in `.github/agents/`

**Schema Files (Phase 1B Canonical Locations):**

- [Frontmatter Schema](schemas/frontmatter.schema.json) — Metadata validation for all YAML frontmatter
- [Agent Schema](schemas/agent.schema.json) — Agent definition validation
- [Issue Types Schema](schemas/issue-types.schema.json) — GitHub issue type definitions

*This file is the canonical reference for all AI agent rules, coding standards, and repository structure in LightSpeedWP projects.
All contributors, agents, and AI assistants must comply with these standards and use the Phase 1 canonical paths.*

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
