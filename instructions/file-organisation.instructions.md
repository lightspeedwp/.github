---
file_type: instructions
title: File Organisation
description: File placement rules and directory structure conventions for organizing code, documentation, tests, and automation across LightSpeedWP repositories. Updated with Phase 1 restructuring including portable vs. repo-local instructions, two-tier agents (spec-based and multi-file), .schemas/ folder, and .github/reports/ structure.
scope: organization-wide
applyTo: '**'
version: v1.2
last_updated: '2026-08-04'
owners:
- LightSpeedWP Team
tags:
- file-organisation
- repository-structure
- governance
- phase-1-restructuring
status: active
---

# LightSpeedWP File Organisation Standards

You are a LightSpeedWP repository architect. Follow our file organisation conventions to maintain consistent, navigable, and maintainable repository structure across all projects. Avoid placing files in ad-hoc locations or creating new directory hierarchies without approval.

## Overview

Defines consistent directory structure and file placement conventions for all LightSpeedWP repositories. Ensures developers and automation tools can reliably locate files, understand boundaries, and discover related resources. Applies to all code, documentation, tests, configuration, and automation artefacts.

**What this covers:**

- Standard directory structure for all repository types
- File placement rules for code, docs, tests, automation
- Naming conventions for directories and files
- Special directories (tmp, build, dist, etc.)
- Boundary markers (`.github/`, top-level source folders)

**What this does not cover:**

- Language-specific code organisation (class hierarchies, module structure)
- Project-specific subdirectories (those belong in project README)

## General Rules

- **Predictable placement:** Every file type has a standard home; developers should be able to locate or place files without guessing
- **Shallow hierarchies:** Avoid deeply nested directories; prefer 2-3 levels maximum for source code
- **Clear boundaries:** Use `.github/` for repo metadata and workflows; use project-specific folders (agents/, cookbook/, plugins/, etc.) for portable assets
- **Consistent naming:** Use lowercase, hyphens for multi-word names (never spaces or underscores in directory names)
- **No ad-hoc directories:** Do not create new root-level directories without documenting in CLAUDE.md or README

## Detailed Guidance

### Portable vs. Repo-Local Instructions

This repository implements a two-tier instruction structure to maintain clear boundaries between reusable, organisation-wide standards and control-plane-specific guidance.

#### Portable Instructions (root `instructions/`)

**Purpose:** Organisation-wide standards reusable across all LightSpeedWP repositories.

**Scope:** Governance, coding standards, documentation formats, automation patterns, quality assurance, community standards.

**How to categorise:** If an instruction applies to multiple projects or the broader organisation, it belongs in `instructions/` at the root.

**Current portable instructions (42 files):**

**Category: Foundation & Standards**

- a11y.instructions.md — WCAG 2.2 AA accessibility standards
- coding-standards.instructions.md — Unified coding standards (PHP, JS, CSS)
- community-standards.instructions.md — Community health and conduct standards
- documentation-formats.instructions.md — Markdown, YAML, Mermaid standards
- languages.instructions.md — Language-specific standards (UK English, etc.)
- linting.instructions.md — Linting configuration and standards
- quality-assurance.instructions.md — Testing, QA, and validation standards

**Category: Instructions & Automation**

- agent-creation-workflow.instructions.md — Agent specification and creation workflow
- agent-spec.instructions.md — Multi-provider agent specification format
- automation.instructions.md — Automation architecture and CI/CD patterns
- ai-operations-unified.instructions.md — Provider-neutral AI operations framework
- copilot-operations.instructions.md — Copilot-specific operations guidance
- hooks.instructions.md — Pre-commit and pre-push hook standards
- instructions.instructions.md — How to write instruction files (meta)

**Category: Governance & Workflows**

- issue-templates.instructions.md — Issue template creation standards
- issues.instructions.md — Issue lifecycle and labeling standards
- pr-automation-review.instructions.md — PR automation and review standards
- pr-templates.instructions.md — PR template creation standards
- pull-requests.instructions.md — PR creation and lifecycle standards
- release.instructions.md — Release management and versioning
- workflows.instructions.md — Workflow architecture and patterns

**Category: Project-Specific Patterns**

- file-organisation.instructions.md — This file; file placement conventions
- multi-platform-skill-manifests.instructions.md — Skill manifest patterns
- multi-provider-compatibility.instructions.md — Multi-provider agent patterns
- plugin-architecture.instructions.md — Plugin design and architecture
- plugin-structure.instructions.md — WordPress block plugin structure
- wordpress-project-planning.instructions.md — WordPress project planning

**Category: Reporting & Metrics**

- metrics.instructions.md — Metrics collection and reporting standards
- reporting.instructions.md — Report structure and formatting
- task-implementation.instructions.md — Task implementation tracking

**Category: Supporting Patterns**

- docs.instructions.md — Documentation structure
- mermaid.instructions.md — Mermaid diagram standards
- meta.instructions.md — Meta-documentation patterns
- planner.instructions.md — Planning and project management
- project-meta-sync.instructions.md — Project metadata synchronisation
- prompt.instructions.md — Prompt engineering standards
- readme.instructions.md — README file standards
- self-explanatory-code-commenting.instructions.md — Code comment standards
- spec-driven-workflow.instructions.md — Specification-driven development
- tasksync.instructions.md — Task synchronisation patterns
- template.instructions.md — Template creation and standards
- tools.instructions.md — Tool integration and standards

#### Repo-Local Instructions (.github/instructions/)

**Purpose:** Control-plane-specific guidance for this `.github` repository only.

**Scope:** Copilot instructions, control-plane automation, GitHub-native governance, local workflow customisations.

**How to categorise:** If an instruction is specific to the `.github` control plane and not reusable across projects, it belongs in `.github/instructions/`.

**Current repo-local instructions (1 file):**

- markdown.instructions.md — Control-plane-specific Markdown and formatting for `.github` assets

**Note:** The primary repo-local guidance is in [.github/custom-instructions.md](./.github/custom-instructions.md), which contains Copilot-specific instructions for this repository.

#### Adding New Instructions

**To add a portable instruction:**

1. Create `instructions/{topic}.instructions.md` at the root
2. Follow the template in `instructions/instructions.instructions.md`
3. Use frontmatter with `scope: organization-wide`
4. Document in this section with category and purpose

**To add a repo-local instruction:**

1. Create `.github/instructions/{topic}.instructions.md`
2. Use frontmatter with `scope: repo-local`
3. Note: Prefer `.github/custom-instructions.md` for single-topic local guidance
4. Document in this section with purpose

**Example categorisation:**

- ✅ **Portable:** "How to structure a WordPress plugin" → `instructions/plugin-structure.instructions.md`
- ✅ **Portable:** "WCAG 2.2 AA standards for all projects" → `instructions/a11y.instructions.md`
- ✅ **Repo-local:** "How Copilot is configured for this `.github` repo" → `.github/custom-instructions.md`
- ✅ **Repo-local:** "Markdown conventions for control-plane documentation" → `.github/instructions/markdown.instructions.md`

### Agents: Two-Tier Structure

This repository implements a two-tier agent architecture to separate portable, reusable agents from GitHub-native spec-based agents.

#### Spec-Based Agents (.github/agents/)

**Purpose:** Simple, single-file agent specifications for control-plane automation (GitHub-native only).

**Use When:** The agent is a simple, YAML/JSON-based spec intended only for this repository's automation workflows.

**Structure:** Single `.agent.md` file with YAML frontmatter and instructions.

**Examples:**

- `labeling.agent.md` — Issues/PR labeling automation
- `release.agent.md` — Release management automation
- `metrics.agent.md` — Metrics collection automation

**Location:** `.github/agents/{name}.agent.md`

**Format:**

```markdown
---
name: labeling
title: Issue Labeling Agent
description: Automated labeling of issues and pull requests
provider: copilot
scope: github-native
---

# Issue Labeling Agent

[Agent instructions and rules...]
```

#### Portable Multi-File Agents (agents/ root)

**Purpose:** Complex, multi-provider agents installable by the LightSpeedWP team for external use.

**Use When:** The agent supports multiple providers (Claude, Copilot, OpenAI) and has provider-specific implementations.

**Structure:** Directory with `AGENT.md` metadata, provider-specific subdirectories, and supporting skills/manifests.

**Examples:**

- `agents/playwright-testing-agent/` — Browser automation testing
- `agents/linear-advisor-agent/` — Linear issue management
- `agents/harvest-analytical-agent/` — Time tracking analytics

**Location:** `agents/{name}-agent/` with subdirectories:

```
agents/playwright-testing-agent/
├── AGENT.md                    # Agent metadata (version, status, providers)
├── README.md                   # Public documentation
├── claude/                     # Claude provider implementation
│   ├── agent.md               # Claude-specific instructions
│   └── tools.json             # Claude tools definition
├── copilot/                    # Copilot provider implementation
│   ├── agent.md               # Copilot-specific instructions
│   └── skills.json            # Copilot skills reference
├── openai/                     # OpenAI provider implementation
│   ├── agent.md               # OpenAI-specific instructions
│   └── functions.json         # OpenAI functions definition
├── skills/                     # Shared skills used by providers
│   ├── playwright-selectors.md
│   ├── browser-automation.md
│   └── test-reporting.md
└── manifests/                  # Configuration and manifests
    ├── plugin.json             # Plugin manifest
    └── capability-manifest.json # Capability definitions
```

**AGENT.md Format:**

```markdown
---
name: playwright-testing
title: Playwright Testing Agent
description: Cross-browser automation and end-to-end testing
version: 2.0.0
status: active
providers:
  - claude
  - copilot
  - openai
capabilities:
  - browser-automation
  - visual-regression-testing
  - accessibility-testing
security:
  rules:
    - No production databases
    - Sandboxed environment only
---

# Playwright Testing Agent

## Overview
[Agent overview and capabilities...]

## Providers
- **Claude**: v2.0.0 (supports claude-opus-4-8+)
- **Copilot**: v2.0.0 (supports GitHub Copilot 1.0+)
- **OpenAI**: v2.0.0 (supports GPT-4+)

## Provider-Specific Notes
[Notes on provider variations, differences, and constraints...]
```

**Validation:**

- Each multi-file agent must have an `AGENT.md` with required frontmatter
- Provider subdirectories (claude/, copilot/, openai/) must exist for listed providers
- Skills referenced in agents must have corresponding SKILL.md files
- Schema validation: Must conform to `multi-provider-agent.schema.json` and `provider-config.schema.json`

### Schemas: JSON Validation Definitions

This repository uses `.schemas/` (a hidden folder at root, following the awesome-copilot pattern) for all JSON validation schemas.

**Purpose:** Centralised, portable schema definitions for validating frontmatter, agent specifications, plugin manifests, and other structured content.

**Location:** `.schemas/` (hidden folder with dot prefix)

**Why hidden?** Hidden folders follow the awesome-copilot convention: schemas are system artefacts, not primary documentation.

**Current schemas:**

**Foundation Schemas**

- `frontmatter.schema.json` — YAML frontmatter validation (used in all .md files)
- `version.schema.json` — Semantic versioning (X.Y.Z format)
- `changelog.schema.json` — Changelog format validation

**AI & Agent Schemas**

- `multi-provider-agent.schema.json` — Validates agent structure across Claude, Copilot, OpenAI, Gemini
- `agent-plugin-binding.schema.json` — Agent-plugin relationships and wiring
- `provider-config.schema.json` — Per-provider agent configuration
- `agent-capability-manifest.schema.json` — Agent capabilities and prerequisites
- `skill-metadata.schema.json` — Skill metadata structure
- `skill-agent-config.schema.json` — Skill agent configuration

**Plugin & Config Schemas**

- `plugin-manifest.schema.json` — Plugin manifest format
- `project-fields.schema.json` — GitHub Project field mappings
- `branding-schema.json` — Branding and style configuration
- `footer-config.schema.json` — Footer template configuration
- `coderabbit-overrides.v2.json` — CodeRabbit configuration overrides

**Schema Registry:** `.schemas/schema-registry.json` lists all active schemas with metadata and status.

**Adding a New Schema:**

1. Create `{type}.schema.json` in `.schemas/`
2. Include `$schema` declaration and `title`/`description`
3. Add registry entry to `.schemas/schema-registry.json`
4. Document in `.schemas/README.md`
5. Create example file: `{type}.example.json` for reference

**Example schema entry:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Multi-Provider Agent Schema",
  "description": "Validates agent structure across Claude, Copilot, and OpenAI",
  "type": "object",
  "required": ["name", "title", "providers"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    }
  }
}
```

### Reports: Audit, Analysis, and Metrics

This repository maintains structured reports in `.github/reports/` to track audits, analysis, and metrics.

**Location:** `.github/reports/{category}/`

**Report Categories:**

**Audits (.github/reports/audits/)**

- Purpose: Audit findings, compliance checks, standards reviews
- Naming: `YYYY-MM-DD-{descriptor}.md`
- Frequency: Ad-hoc, as needed for investigation
- Example: `2026-07-22-phase-1-instructions-audit.md`

**Analysis (.github/reports/analysis/)**

- Purpose: Data analysis, trend reports, exploratory findings
- Naming: `{topic}.md` or `YYYY-MM-DD-{descriptor}.md`
- Frequency: Regular intervals or as needed
- Example: `issue-creation-docs-audit-report.md`

**Agent Reports (.github/reports/agents/)**

- Purpose: Agent-specific analysis and test results
- Structure: One folder per agent
- Example: `.github/reports/agents/linear-advisor-agent/` containing test results, metrics, status

**Archived (.github/reports/archived/)**

- Purpose: Old reports moved out of active use
- Note: Keep for reference and historical tracking

**Report Format:**

Reports must include:

1. **Frontmatter:**

   ```yaml
   ---
   file_type: audit
   category: instructions
   created_date: 2026-07-22
   scope: phase-1-agent-standardization
   ---
   ```

2. **Standard Sections:**
   - Objective
   - Scope / Findings
   - Recommendations or Analysis
   - Success Criteria or Metrics

3. **Metadata:**
   - Date created (ISO format: YYYY-MM-DD)
   - Scope/category (phase, area, issue number)
   - Status (draft, active, completed, archived)

**Cleanup:** Regularly move completed or superseded reports to `.github/reports/archived/`.

### Standard Repository Structure

```
project-root/
├── .github/                          # GitHub-native files (workflows, templates, actions)
│   ├── workflows/                    # CI/CD and automation workflows
│   ├── agents/                       # Spec-based agents (simple YAML/JSON definitions only)
│   ├── instructions/                 # Repo-local instructions (control-plane-specific)
│   ├── reports/                      # Audit, analysis, and metrics reports
│   │   ├── audits/                   # Audit reports (YYYY-MM-DD-{descriptor}.md)
│   │   ├── analysis/                 # Analysis reports
│   │   └── archived/                 # Archived reports
│   ├── custom-instructions.md        # Copilot instructions for this repo
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   ├── CODE_OF_CONDUCT.md           # Community standards
│   ├── SECURITY.md                   # Security policy
│   └── [other community health files]
│
├── .schemas/                         # JSON schemas (hidden folder, validation definitions)
├── agents/                           # Portable agent specifications (multi-file implementations)
│   └── {name}-agent/                 # Multi-provider agent with provider subdirectories
│       ├── AGENT.md                  # Agent metadata and spec
│       ├── README.md                 # Agent documentation
│       ├── claude/                   # Claude provider implementation
│       ├── copilot/                  # Copilot provider implementation
│       ├── openai/                   # OpenAI provider implementation
│       ├── skills/                   # Supporting skills
│       └── manifests/                # Configuration manifests
├── cookbook/                         # Recipes, playbooks, implementation guides
├── hooks/                           # Portable hooks and guardrails
├── instructions/                    # Portable instruction files (no .github assumptions)
├── plugins/                         # Installable plugin bundles
├── skills/                          # Self-contained skills with SKILL.md entrypoints
├── workflows/                       # Portable agentic workflows
│
├── docs/                            # Human-facing documentation (e.g., MIGRATION.md)
├── src/                             # Source code (language-specific structure)
├── tests/                           # Test files (mirror src/ structure)
├── scripts/                         # Utility and automation scripts
│
├── .gitignore
├── CLAUDE.md                        # Project instructions and context
├── AGENTS.md                        # AI agent guidelines (org-wide or project-local)
├── README.md                        # Project overview
├── CHANGELOG.md                     # Release history
└── package.json / composer.json     # Project metadata
```

### File Placement Rules

| Content Type | Location | Convention |
|---|---|---|
| CI/CD workflows | `.github/workflows/` | `{purpose}.yml` |
| GitHub templates | `.github/{issue,pull_request,discussion}_template/` | Standard GitHub structure |
| **Spec-based agents** | `.github/agents/` | `{name}.agent.md` (simple YAML/JSON definitions, GitHub-native only) |
| **Portable multi-file agents** | `agents/{name}-agent/` | Folder with `AGENT.md` + provider subdirs (claude/, copilot/, openai/) |
| **Repo-local instructions** | `.github/instructions/` | `{topic}.instructions.md` (control-plane-specific) |
| **Portable instructions** | `instructions/` | `{topic}.instructions.md` |
| **JSON schemas** | `.schemas/` (root, hidden) | `{type}.schema.json` (follows awesome-copilot pattern) |
| **Audit reports** | `.github/reports/audits/` | `YYYY-MM-DD-{descriptor}.md` |
| **Analysis reports** | `.github/reports/analysis/` | `{topic}.md` or `YYYY-MM-DD-{descriptor}.md` |
| **Agent reports** | `.github/reports/agents/` | `{agent-name}/` with analysis files |
| Portable workflows | `workflows/` | `{name}.md` |
| Recipes/playbooks | `cookbook/` | `{topic}.md` |
| Plugins | `plugins/` | One folder per plugin |
| Skills | `skills/{skill-name}/` | `SKILL.md` at root + implementation |
| Source code | `src/` (or language-specific like `lib/`, `app/`) | Follow language conventions |
| Tests | `tests/` | Mirror `src/` structure |
| Documentation | `docs/` | Hierarchical by topic (e.g., /docs/MIGRATION.md for migration maps) |
| Automation scripts | `scripts/` | Group by purpose (`/maintenance`, `/validation`, etc.) |

### Naming Conventions

- **Directories:** Lowercase, hyphens for separation (`my-feature`, not `MyFeature` or `my_feature`)
- **Markdown files:** Lowercase with hyphens (`coding-standards.md`, not `CodingStandards.md`), except for documentation and governance files in the `docs/` directory, which must use UPPERCASE naming with underscores (e.g., `MIGRATION.md`, `GOVERNANCE_REVISION_LOG.md`)
- **Scripts:** Lowercase with hyphens, explicit extensions (`validate-config.sh`, `build-artifacts.js`)
- **No spaces:** Never use spaces in filenames or directory names

### Special Directories

- **`.github/tmp/`** – Temporary files created during CI/CD; clean up before committing
- **`build/`, `dist/`, `out/`** – Generated artefacts; add to `.gitignore`
- **`node_modules/`, `vendor/`, `.venv/`** – Dependencies; add to `.gitignore`
- **`.github/projects/`** – Active and archived project artefacts; documented in project README

## Examples

### Agent Examples

**Good — Multi-file portable agent:**

```
agents/linear-advisor-agent/
├── AGENT.md                    # Multi-provider spec with Claude, Copilot, OpenAI support
├── claude/
│   ├── agent.md               # Claude-specific instructions
│   └── tools.json             # Claude tools definition
├── copilot/
│   ├── agent.md               # Copilot-specific instructions
│   └── skills.json            # Copilot skills
├── openai/
│   ├── agent.md               # OpenAI-specific instructions
│   └── functions.json         # OpenAI functions
└── skills/
    ├── issue-analysis.md
    └── team-metrics.md
```

**Good — Spec-based agent:**

```
.github/agents/labeling.agent.md  # Simple single-file spec for control-plane automation
```

**Avoid:**

- Creating agents in arbitrary locations like `ai-agents/` or `.ai/`
- Mixing multi-file and single-file agents in the same directory
- Placing control-plane automation agents in `agents/` (should be `.github/agents/`)
- Using unclear naming like `agent-v1.md` or `my-new-agent-copilot.md`

### Schema Examples

**Good — Schema placement and naming:**

```
.schemas/multi-provider-agent.schema.json       # Validates multi-provider agents
.schemas/agent-plugin-binding.schema.json       # Validates agent-plugin relationships
.schemas/provider-config.schema.json            # Validates per-provider config
```

**Good — Schema registry entry:**

```json
{
  "id": "multi-provider-agent",
  "path": ".schemas/multi-provider-agent.schema.json",
  "status": "active",
  "category": "agent-validation"
}
```

**Avoid:**

- Placing schemas in `schema/` instead of `.schemas/`
- Creating unregistered schema files without updating registry
- Using CamelCase naming (`MultiProviderAgent.schema.json`)
- Placing schemas in `.github/.schemas/` instead of root `.schemas/`

### Report Examples

**Good — Audit report naming:**

```
.github/reports/audits/2026-07-22-phase-1-instructions-audit.md
.github/reports/audits/2026-07-29-changelog-keepachangelog-audit.md
.github/reports/audits/2026-08-01-schema-migration-audit.md
```

**Good — Analysis report:**

```
.github/reports/analysis/issue-creation-docs-audit-report.md
.github/reports/analysis/readme-audit-extended-2026-05-31.md
```

**Good — Agent report structure:**

```
.github/reports/agents/linear-advisor-agent/
├── test-results-2026-07-15.md
├── provider-compatibility-matrix.md
└── performance-metrics.md
```

**Avoid:**

- Placing reports in root without `.github/reports/` structure
- Using unclear naming like `audit1.md` or `report-final-v2.md`
- Mixing active and archived reports in same folder
- Using inconsistent date formats (use ISO: YYYY-MM-DD)

### Instruction Examples

**Good — Portable instruction:**

```
instructions/coding-standards.instructions.md
instructions/a11y.instructions.md
instructions/documentation-formats.instructions.md
```

**Good — Repo-local instruction:**

```
.github/instructions/markdown.instructions.md  # Control-plane-specific Markdown standards
.github/custom-instructions.md                 # Copilot guidance for this repo
```

**Avoid:**

- Placing portable instructions in `.github/instructions/`
- Creating control-plane-specific guidance in root `instructions/`
- Using unclear titles like `standards.md` instead of descriptive names
- Forgetting `scope: organization-wide` or `scope: repo-local` in frontmatter

## Validation

**File Placement Checks:**

- ✅ All files are in their standard locations (can be found by pattern and convention)
- ✅ Directory names are lowercase with hyphens
- ✅ No ad-hoc root-level directories without documentation
- ✅ No spaces or special characters in filenames
- ✅ Temporary files are cleaned up before commit

**Instruction-Specific Checks:**

- ✅ Portable instructions in `instructions/` have `scope: organization-wide`
- ✅ Repo-local instructions in `.github/instructions/` have `scope: repo-local`
- ✅ No portable instructions in `.github/instructions/`
- ✅ No repo-local instructions in root `instructions/`

**Agent-Specific Checks:**

- ✅ Multi-file agents in `agents/{name}-agent/` with `AGENT.md` metadata
- ✅ Spec-based agents in `.github/agents/` as single `.agent.md` files
- ✅ Provider subdirectories (claude/, copilot/, openai/) exist for listed providers
- ✅ Multi-file agents conform to `multi-provider-agent.schema.json`
- ✅ All agents have required frontmatter with `name`, `title`, `providers`

**Schema-Specific Checks:**

- ✅ All schemas in `.schemas/` (hidden folder at root, not `.github/.schemas/`)
- ✅ Schema files named `{type}.schema.json` (lowercase, kebab-case)
- ✅ All active schemas registered in `.schemas/schema-registry.json`
- ✅ Example JSON files provided for complex schemas

**Report-Specific Checks:**

- ✅ Audit reports in `.github/reports/audits/` with `YYYY-MM-DD-{descriptor}.md` naming
- ✅ Analysis reports in `.github/reports/analysis/`
- ✅ Agent reports in `.github/reports/agents/{agent-name}/`
- ✅ All reports include frontmatter with `file_type`, `category`, `created_date`
- ✅ Archived reports moved to `.github/reports/archived/` with timestamp

## Cross-References

- [CLAUDE.md](../CLAUDE.md) — Project-specific instructions and file boundaries
- [AGENTS.md](../AGENTS.md) — AI agent rules and two-tier agent structure (spec-based vs. multi-file)
- [Coding Standards](./coding-standards.instructions.md) — Unified coding standards
- [Documentation Formats](./documentation-formats.instructions.md) — Markdown and YAML standards
- [Agent Creation Workflow](./agent-creation-workflow.instructions.md) — How to create new agents
- [Plugin Architecture](./plugin-architecture.instructions.md) — Plugin design patterns

**Phase 1 Restructuring Audits:**

- [Phase 1A: Instructions Audit](../.github/reports/audits/phase-1-instructions-audit-2026-07-22.md) — Portable vs. repo-local instructions review
- [Phase 1B: Schemas Audit](../.github/reports/audits/phase-1-schemas-audit-2026-07-22.md) — JSON schema consolidation and new schema definitions
- [Phase 1C: AI Config Audit](../.github/reports/audits/phase-1-ai-config-audit-2026-07-22.md) — Multi-provider agent configuration
- [File Organisation Migration Plan](../.github/reports/audits/2026-06-03-file-organisation-migration-plan-673.md) — Phase 1 migration timeline and validation
- [Issue #1501](https://github.com/lightspeedwp/.github/issues/1501) — Phase 2C: Update file-organisation instructions

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
