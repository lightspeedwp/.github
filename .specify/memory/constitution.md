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

The branch naming pattern `{type}/{scope}-{title}` with one of 38 authorised types (feat, fix, hotfix, release, refactor, chore, task, doc, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, aiops, automation, epic) is authoritative and MUST be enforced. FORBIDDEN prefixes (`claude/`, `copilot/`, `openai/`) are absolute. Branch name determines PR template assignment, GitHub Actions routing, labeling, and metrics. Invalid branches break downstream automation.

**Rationale**: Branch naming is the foundation for PR template routing, GitHub Actions workflows, and validation checks. A single incorrect branch name cascades as template failures, workflow skips, and manual rework. Enforcement prevents this waste.

### VI. UK English, Accessibility, Security Standards (Non-Negotiable)

All documentation, code comments, configuration, and guidance MUST use:

- UK English spelling (optimise, colour, organisation, behaviour)
- WCAG 2.2 AA accessibility standards (semantic HTML, keyboard support, contrast, alt text)
- WordPress Coding Standards (for PHP)
- Security-first mindset (validate input, escape output, no hardcoded secrets)

**Rationale**: The organisation operates globally with accessibility-conscious users. Standards must be consistent and auditable.

### VII. Specification Quality Standards (Non-Negotiable)

All project specifications MUST be validated against 8 quality dimensions before implementation begins: Completeness (all requirements present), Clarity (specific, unambiguous, vague terms quantified), Consistency (requirements aligned, no conflicts), Measurability (objective acceptance criteria), Scenario Coverage (all user flows addressed), Edge Cases (boundary conditions defined), Dependencies (assumptions documented), and Ambiguities (unclear areas surfaced for resolution). Specifications using the Requirements Quality Checklist framework MUST pass all quality dimensions before receiving stakeholder approval. No implementation work begins on specifications with unresolved gaps or ambiguities.

**Rationale**: Specifications with gaps, ambiguities, or inconsistencies cascade as rework, misalignment, and failed implementations. Validating requirements quality upfront prevents waste and ensures team alignment. The Requirements Quality Checklist framework provides objective, repeatable validation.

### VIII. Branch Strategy Compliance & Automated Enforcement (Non-Negotiable)
All branches MUST follow pattern `{type}/{scope}-{title}` with one of 38 authorized types (feat, fix, hotfix, release, refactor, chore, task, docs, test, perf, ci, build, deps, security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, revert, research, automation, epic, aiops, a11y, build). FORBIDDEN prefixes (`claude/`, `copilot/`, `openai/`) are absolute and non-negotiable. PR template routing MUST be automatic by branch prefix according to the canonical routing map in `.github/PULL_REQUEST_TEMPLATE/config.yml`. Auto-labeling MUST apply consistent, prefixed labels from canonical label set. CI validation gates MUST block non-compliant branches before merge. Compliance tracking MUST show ≥95% adherence across all active branches.

**Rationale**: Branch naming is the foundation for PR template routing, GitHub Actions workflows, labeling, and metrics. Standardized naming enables automation, prevents template misrouting, and provides traceability. Enforcement prevents manual workarounds and ensures 100% consistency.

### IX. Requirements-Driven Quality & Changelog Compliance (Non-Negotiable)

Changelog entries and project requirements MUST meet defined quality standards before release: entries ≤250 characters (user-focused, no implementation details), 100% linked to PRs/issues, entries pass automated compliance gates. Requirements MUST be audited for length, clarity, and completeness before merge. Automated enforcement gates in CI MUST validate all submissions; violations MUST block PRs with clear, actionable feedback. Compliance metrics MUST be tracked continuously and maintained ≥95% post-implementation.

**Rationale**: Long, verbose entries obscure user-facing value; implementation details clutter documentation. Automated enforcement prevents degradation and ensures maintainability at scale.

### X. Automated Validation & Metrics-Driven Governance (Non-Negotiable)

All governance decisions MUST be supported by continuous metrics: specification quality scores, branch naming compliance %, changelog entry compliance %, requirement validation gate pass rates. Metrics dashboards MUST update at minimum daily. Automated validation workflows MUST run on every PR and track violations. Compliance trends over 30+ days MUST inform process improvements. No governance decision MUST rely on manual audits when automated monitoring is feasible; manual audits are used only to verify automated systems' accuracy.

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

## Issue Type and Template Routing

### Issue Type to Template Mapping

GitHub issue creation is routed by issue type. Each canonical issue type in `.github/issue-types.yml` corresponds to exactly one issue template in `.github/ISSUE_TEMPLATE/`. Creators MUST select the appropriate issue type, which automatically loads the corresponding template. Manual template selection is NOT supported.

| Issue Type | Template File | Label | Purpose |
|------------|---------------|-------|---------|
| Task | 01-task.md | type:task | Scoped work units, no execution impediment |
| Bug | 02-bug.md | type:bug | Defect reports; expected vs. actual behaviour |
| Feature | 03-feature.md | type:feature | New capability, user-facing enhancement |
| Design | 04-design.md | type:design | Design system, UI/UX, visual assets |
| Epic | 05-epic.md | type:epic | Large initiative spanning multiple features |
| Question | 06-question.md | type:question | Support inquiry, clarification needed |
| Improvement | 07-improvement.md | type:improve | Enhancement to existing feature |
| Chore | 08-chore.md | type:chore | Maintenance, no user-facing changes |
| CI | 09-ci.md | type:ci | CI/CD pipeline, automation, GitHub Actions |
| Automation | 10-automation.md | type:automation | Workflow automation, task scheduling |
| Test Coverage | 11-test.md | type:test | Testing, test infrastructure, coverage |
| Performance | 12-performance.md | type:performance | Speed, efficiency, resource optimization |
| Accessibility | 13-a11y.md | type:a11y | WCAG compliance, semantic HTML, keyboard support |
| Security | 14-security.md | type:security | Vulnerability, secure coding, threat response |
| Compatibility | 15-compatibility.md | type:compat | Version compatibility, deprecation, migration |
| Refactor | 16-refactor.md | type:refactor | Code structure, maintainability, debt reduction |
| Release | 17-release.md | type:release | Release planning, versioning, changelog |
| Dependency Update | 18-dep-update.md | type:dependency | Dependency upgrade, version bump |
| Documentation | 19-docs.md | type:docs | User documentation, guides, examples |
| Research | 20-research.md | type:research | Investigation, proof-of-concept, exploration |
| Audit | 21-audit.md | type:audit | Code audit, compliance review, quality check |
| Review | 22-review.md | type:review | Process review, retrospective, feedback |
| AI Ops | 23-aiops.md | type:aiops | AI-assisted operations, automation agents |
| Content Modelling | 24-content-modelling.md | (no standard label) | Content structure, schema design |
| Build | 25-build.md | (no standard label) | Build tooling, compilation, bundling |

**Enforcement**: All public issues MUST use exactly one type from the canonical set. Issues without a valid type MUST be closed or reassigned with a supportive comment. Issue creation forms enforce type selection; `type:*` labels are applied automatically by issue routing workflows.

### Branch Type to PR Template Routing

Pull request templates are automatically routed by branch prefix according to the canonical mapping in `.github/PULL_REQUEST_TEMPLATE/config.yml`. The map below defines the binding between branch type and PR template. No manual template selection is permitted; the GitHub Action `pr-template-resolver.yml` enforces routing.

#### Allowed Branch Types (38 Types)

| Branch Type | PR Template | Linked Principle | Notes |
|-------------|-------------|-----------------|-------|
| `feat/` | pr_feature.md | VIII | New feature or user-facing capability |
| `fix/` | pr_bug.md | VIII | Bug fix or defect resolution |
| `hotfix/` | pr_hotfix.md | VIII | Urgent production fix; requires fast-track review |
| `refactor/` | pr_refactor.md | VIII | Code structure, maintainability |
| `chore/` | pr_chore.md | VIII | Maintenance, build tooling, no user impact |
| `docs/` | pr_docs.md | VIII | Documentation, guides, comments |
| `task/` | pr_task.md | VIII | Scoped unit of work (often issue-bound) |
| `test/` | pr_chore.md | VIII | Test infrastructure, coverage improvements |
| `perf/` | pr_feature.md | VIII | Performance optimisation; user-facing benefit |
| `ci/` | pr_ci.md | VIII | GitHub Actions, CI/CD pipelines |
| `build/` | pr_ci.md | VIII | Build system, compilation, bundling |
| `automation/` | pr_ci.md | VIII | Workflow automation, task scheduling |
| `deps/` | pr_dep_update.md | VIII | Dependency updates, version bumps |
| `security/` | pr_bug.md | VIII | Vulnerability fix; treated as urgent bug |
| `design/` | pr_feature.md | VIII | Design system, UI, visual assets |
| `a11y/` | pr_feature.md | VIII | Accessibility (WCAG 2.2 AA compliance) |
| `ux/` | pr_feature.md | VIII | User experience improvements |
| `i18n/` | pr_feature.md | VIII | Internationalization, translation, locales |
| `ops/` | pr_chore.md | VIII | Operations, deployment, infrastructure |
| `proto/` | pr_feature.md | VIII | Prototype, experimental, proof-of-concept |
| `ds/` | pr_feature.md | VIII | Design system component library |
| `api/` | pr_feature.md | VIII | API changes, endpoint versioning |
| `schema/` | pr_feature.md | VIII | Data schema, model changes |
| `telemetry/` | pr_feature.md | VIII | Analytics, monitoring, event tracking |
| `content/` | pr_docs.md | VIII | Content changes, blog, copy |
| `seo/` | pr_docs.md | VIII | SEO optimisation, meta tags |
| `config/` | pr_chore.md | VIII | Configuration files, environment setup |
| `migrate/` | pr_chore.md | VIII | Data/schema migration scripts |
| `qa/` | pr_chore.md | VIII | QA processes, test automation |
| `uat/` | pr_chore.md | VIII | User acceptance testing, staging validation |
| `audit/` | pr_feature.md | VIII | Audit, compliance review, code review |
| `codex/` | pr_docs.md | VIII | Code generation, AI-assisted development |
| `revert/` | pr_chore.md | VIII | Revert previous commit/PR |
| `research/` | pr_feature.md | VIII | Research, investigation, exploration |
| `release/` | pr_release.md | VIII | Release branch, version tag, changelog |
| `epic/` | pr_epic.md | VIII | Epic-level work spanning multiple features |
| `aiops/` | pr_aiops.md | VIII | AI-assisted operations, agent automation |

#### FORBIDDEN Branch Prefixes (Non-Negotiable)

These prefixes are NEVER allowed and trigger validation failures:

| Prefix | Reason | Fallback |
|--------|--------|----------|
| `claude/` | Reserved for Claude Code internal sessions | Resolved via linked issue type |
| `copilot/` | Reserved for GitHub Copilot integration | Resolved via linked issue type |
| `openai/` | Reserved for OpenAI integration | Resolved via linked issue type |

When a PR uses a forbidden prefix (e.g., `claude/my-feature`), the `pr-template-resolver.yml` workflow applies fallback routing: it queries the linked issue, extracts the issue type (from issue type field, `type:*` label, or PR description), and maps the type to the correct template. **This fallback routing is a temporary measure only; the branch MUST be corrected to the proper prefix before merge.**

**Compliance gates**: Pre-commit hooks validate branch names before push. CI gates validate on PR creation. Invalid branches cannot merge until renamed and PR recreated with correct prefix.

**Metric tracking**: Compliance dashboards MUST report:
- % of branches using correct prefix (goal: ≥95%)
- % of PRs using correct template (goal: 100%)
- Fallback routing usage (goal: 0%; indicates branch naming violations)
- Template mismatch incidents (goal: 0%)

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
- **Branch naming validation**: Pre-commit hook enforces `{type}/{scope}-{title}` pattern against 38 authorized types; FORBIDDEN prefixes (`claude/`, `copilot/`, `openai/`) are rejected immediately
- **PR template routing**: Automatic template selection by branch prefix according to canonical mapping in `.github/PULL_REQUEST_TEMPLATE/config.yml` (see Branch Type to PR Template Routing section); fallback routing via linked issue for invalid prefixes
- **Issue type routing**: Automatic template selection by issue type; all issues MUST use canonical type from `.github/issue-types.yml` (see Issue Type to Template Mapping section)
- **CodeRabbit review**: Central configuration applies organisation-wide; repo-specific overrides allowed
- **Label consistency**: Only prefixed labels from `.github/labels.yml` allowed; labels MUST match branch type and issue type
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

## Specification Project Governance

Three foundational specification projects anchor LightSpeed's governance framework. Their maintenance, updates, and evolution are governed by the following procedures:

### Active Specification Projects

| Project | Location | Governance Authority | Amendment Process |
|---------|----------|----------------------|-------------------|
| **Changelog Quality Audit (Phase 5)** | `specs/003-changelog-quality-audit/` | Maintainer review, stakeholder approval | Quality checklist MUST pass before changes; changes MUST go through `/speckit-specify`, `/speckit-clarify`, `/speckit-plan` workflow |
| **Branch Naming & PR Strategy** | `specs/004-branch-naming-strategy/` | Team lead + GitHub admin review | Type additions/removals MUST have impact analysis on 38-type system; changes require cross-repo validation |
| **Requirements Quality Checklist Framework** | `specs/005-requirements-quality-checklist/` | Specification authors + peer reviewers | Framework enhancements MUST maintain 8-dimension structure; domain-specific customizations follow template pattern |

### Specification Amendment Procedures

**When specifications require updates:**

1. **Initiate via issue**: Open issue tagged `[SPEC-UPDATE-REQUEST]` with:
   - Which specification is affected (003/004/005)
   - What change is proposed and why
   - Impact analysis (affected projects, teams, automation)
   - Proposed update plan (new sections, principle changes, additions)

2. **Specification-first workflow**: Use SpecKit commands:
   - `/speckit-clarify` — Resolve ambiguities in proposed changes
   - `/speckit-specify` — Formalize updated specification
   - `/speckit-checklist` — Validate quality dimensions unchanged/improved
   - `/speckit-plan` — Plan implementation of specification changes

3. **Quality validation**: Updated specification MUST pass requirements quality checklist (all 8 dimensions) before approval

4. **Approval gates**:
   - **Changelog Audit changes** → Changelog maintainers + @ashley
   - **Branch Strategy changes** → GitHub admins + team leads + @ashley
   - **Quality Checklist changes** → Specification authors + @ashley

5. **Rollout plan**: All specification changes MUST include:
   - Backward compatibility assessment (old practices coexist or migrate?)
   - Team communication plan (docs, training, Q&A)
   - Compliance tracking (metrics updated to reflect new requirements)
   - Migration deadline (if old practices retire)

### Specification Review Cadence

- **Monthly**: Review compliance metrics for all three specifications (adherence %, violations, trends)
- **Quarterly**: Assess specification effectiveness (are success criteria still being met?)
- **Annually**: Full specification audit (still relevant? Tech changes? Process improvements?)
- **Ad-hoc**: Critical changes (security, breaking changes, severe compliance failures)

### Specification Compliance Tracking

Each specification project includes a `checklists/` directory with:

- `requirements.md` — Quality validation checklist (Completeness, Clarity, Consistency, etc.)
- Compliance dashboard (updated daily) showing:
  - Specification adoption rate
  - Violations detected by CI
  - Trend data (improving/declining compliance)
  - Team adherence by individual/repo

<!-- SYNC IMPACT REPORT
Version: 1.1.0 → 1.2.0 (MINOR bump)
Changes:
  - Added: "Issue Type and Template Routing" section with issue-type-to-template mapping (24 types)
  - Added: "Branch Type to PR Template Routing" section with branch-prefix-to-template mapping (38 allowed types, 3 forbidden)
  - Updated: Principle VIII branch type count from 34 to 38 (added automation, epic, aiops)
  - Updated: Code Review & Quality Gates section with references to new routing sections
  - Enhanced: Branch naming enforcement documentation with fallback routing explanation
  - Clarified: Forbidden prefix handling and fallback behavior

Rationale: MINOR bump (new governance sections) for explicit governance documentation of issue and branch routing mappings.
-->

---

**Version**: 1.2.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-14
