# LightSpeed .github Control Plane Constitution

## Core Principles

### I. Organisation-Wide Governance Authority
The `.github` repository is the **authoritative source** for LightSpeed's GitHub community standards, automation, and governance across all repositories. CLAUDE.md, AGENTS.md, and configuration files define non-negotiable standards that supersede local repository practices. All repositories consuming central configuration (CodeRabbit, labels, templates, workflows) MUST comply with decisions made in this repository.

**Rationale**: Consistency across 50+ repositories requires a single source of truth. Decentralized governance leads to audit gaps, inconsistent security practices, and unreliable automation. This repository's decisions impact all downstream repositories.

### II. Curated Assets with Locked Governance
LOCKED files (`.github/labels.yml`, `.github/issue-types.yml`, templates, issue/PR routing) are final and require explicit approval (@ashley) for changes. Change requests MUST be submitted as issues with specific tags (`[LABEL-UPDATE-REQUEST]`, `[TEMPLATE-UPDATE-REQUEST]`, `[ISSUE-TYPE-UPDATE-REQUEST]`) and justified with impact analysis on dependent systems.

**Rationale**: Labels, templates, and issue types drive PR routing, GitHub Actions workflows, and AI agent decision trees. Uncontrolled changes cascade as failures across all consuming repositories. Manual curation prevents silent breakage.

### III. Clear Asset Boundaries (No Duplication)
Portable reusable assets MUST NOT live under `.github/`. They belong in top-level source folders (`agents/`, `skills/`, `workflows/`, `hooks/`, `instructions/`, `plugins/`, `cookbook/`). Repository-local governance lives in `.github/`. Centralised guidance in AGENTS.md and CLAUDE.md is never duplicated in feature-specific files.

**Rationale**: Reusable assets need to be discoverable and portable. `.github/` is GitHub-centric; portable assets must stand alone. Duplication causes maintenance debt and inconsistency. Single source of truth per concept.

### IV. Technology-Agnostic Guidance (Universal Principles)
All instruction files, review guidance, and standards MUST apply universally across the organisation's diverse tech stacks (WordPress plugins, Node.js/TypeScript systems, infrastructure-as-code, MCP servers). NO framework-specific, language-specific, or project-type-specific implementation details in central guidance.

**Example of violation**: "Use WordPress hooks for..." in central CodeRabbit config.
**Example of compliance**: "Ensure state management is clean and testable" — applies equally to all projects.

**Rationale**: The organisation spans PHP (WordPress), JavaScript/TypeScript (ls-flow, MCPs), Terraform/Kubernetes (infrastructure), and AI/automation systems. Central standards must translate across all.

### V. Branch Naming Strategy is Non-Negotiable (CRITICAL)
The branch naming pattern `{type}/{scope}-{title}` with the 30+ defined types (feat/, fix/, security/, perf/, a11y/, docs/, etc.) is authoritative and MUST be enforced. FORBIDDEN prefixes (`claude/`, `copilot/`, `openai/`) are absolute. Branch name determines PR template assignment, GitHub Actions routing, labeling, and metrics. Invalid branches break downstream automation.

**Rationale**: Branch naming is the foundation for PR template routing, GitHub Actions workflows, and validation checks. A single incorrect branch name cascades as template failures, workflow skips, and manual rework. Enforcement prevents this waste.

### VI. UK English, Accessibility, Security Standards (Non-Negotiable)
All documentation, code comments, configuration, and guidance MUST use:
- UK English spelling (optimise, colour, organisation, behaviour)
- WCAG 2.2 AA accessibility standards (semantic HTML, keyboard support, contrast, alt text)
- WordPress Coding Standards (for PHP)
- Security-first mindset (validate input, escape output, no hardcoded secrets)

**Rationale**: The organisation operates globally with accessibility-conscious users. Standards must be consistent and auditable.

## Configuration Governance

### LOCKED Files (Manual Curation Required)

| File | Purpose | Amendment Process |
|------|---------|------------------|
| `.github/labels.yml` | Canonical 158 labels | Issue: `[LABEL-UPDATE-REQUEST]` + approval |
| `.github/issue-types.yml` | 24 issue types | Issue: `[ISSUE-TYPE-UPDATE-REQUEST]` + approval |
| `.github/ISSUE_TEMPLATE/*.md` | 26 issue templates | Issue: `[TEMPLATE-UPDATE-REQUEST]` + approval |
| `.github/PULL_REQUEST_TEMPLATE/*.md` | 19 PR templates | Issue: `[TEMPLATE-UPDATE-REQUEST]` + approval |

**Approval Authority**: @ashley (organisation owner). All changes require impact analysis covering:
- Dependent systems affected (workflows, agents, downstream repos)
- Breaking changes identified
- Migration plan for existing usage
- Testing plan

### Changeable Configuration (Standard PR Review)

- `.coderabbit.yml` — Code review configuration (review via standard PR process)
- `.github/workflows/*.yml` — GitHub Actions workflows (review via standard PR process)
- `.github/instructions/*.md` — Guidance files (review via standard PR process, no duplication with AGENTS.md)

## Asset Organization

### Portable Reusable Assets (Top-Level Folders)
- **`agents/`** — AI agent specifications (standalone, discoverable)
- **`skills/`** — Reusable skills with `SKILL.md` entrypoints
- **`workflows/`** — Agentic workflow documentation and specifications
- **`hooks/`** — Portable Git hooks and guardrails
- **`instructions/`** — Instruction files (no `.github/` assumptions)
- **`plugins/`** — Installable plugin bundles
- **`cookbook/`** — Recipes, playbooks, implementation guides

### Repository-Local Governance (`.github/` Only)
- GitHub community templates (issue, PR, discussion, security policy)
- Repository-local Copilot/agent custom instructions
- Organisation-wide labels, labeler rules, issue types
- GitHub Actions workflows for this repository
- Reports, audits, active project artifacts

## Development Workflow

### Specification-First Process (SpecKit)
All significant features follow the SpecKit workflow:
1. **Specification**: User stories, functional requirements, success criteria (no implementation details)
2. **Clarification**: Interactive resolution of ambiguities (<5 questions, max 3 NEEDS CLARIFICATION markers)
3. **Planning**: Technical design, data models, contracts, validation scenarios
4. **Task Decomposition**: 96-task breakdown with clear acceptance criteria and file paths
5. **Implementation**: Phase-by-phase execution with independent testing per user story

**Rationale**: Specification-first prevents rework, enables parallel task execution, and ensures traceability from requirements to code.

### Code Review & Quality Gates
- **Branch naming validation**: Pre-commit hook enforces `{type}/{scope}-{title}` pattern
- **PR template routing**: Automatic template selection by branch prefix
- **CodeRabbit review**: Central configuration applies organisation-wide; repo-specific overrides allowed
- **Label consistency**: Only prefixed labels from `.github/labels.yml` allowed
- **Changelog required**: Keep a Changelog format for user-facing changes

## Governance & Amendment

**Constitution Authority**: This document supersedes all other practices. Amendments require:
1. Clear rationale for change
2. Identification of principles affected
3. Impact analysis on downstream repos
4. Compliance validation plan
5. Documented approval (issue + @ashley sign-off)

**Version Bumping**:
- **MAJOR**: Principle removal or backward-incompatible redefinition
- **MINOR**: New principle added or existing principle significantly expanded
- **PATCH**: Clarifications, wording, typos, non-semantic refinements

**Runtime Guidance Separation**:
- **Constitution** (this document): Non-negotiable governance principles and scope boundaries
- **CLAUDE.md**: Project-specific implementation rules and conventions (can evolve faster)
- **AGENTS.md**: Global AI operations rules (cross-project standards)
- **Instruction files**: Portable, reusable guidance (no `.github/` assumptions)

All PRs and reviews MUST verify constitution compliance. Complexity must be justified against these principles.

---

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
