---
file_type: documentation
title: LightSpeed Community Health and Automation Repository
description: Central control-plane repository for LightSpeed community health files, governance, automation, and portable AI operations assets.
version: "4.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
tags:
  - community-health
  - automation
  - governance
  - ai-operations
status: active
stability: stable
domain: governance
language: en
---

# LightSpeed Community Health and Automation Repository

This repository is the LightSpeed `.github` control plane and canonical source for shared governance, templates, labels, workflows, and reusable AI operations assets.

## Current Status

- Phase 1 instruction, schema, and agent audits are complete.
- Two-tier agent model is active:
  - Portable multi-file agents in `agents/`.
  - Spec-based GitHub-native agents in `.github/agents/`.
- Canonical schema path is `schemas/`.
- Release process is v4.0 with two-phase agentic gates. See `docs/RELEASE_PROCESS.md`.

## Canonical Paths

- `instructions/` — Portable instruction standards.
- `.github/instructions/` — Repo-local control-plane instructions.
- `agents/` — Portable multi-file agents.
- `.github/agents/` — Spec-based control-plane agents.
- `schemas/` — Canonical JSON schema definitions.
- `.github/reports/` — Audit and analysis reporting.

## Top-Level Documentation

- `AGENTS.md` — Global AI governance rules.
- `CLAUDE.md` — Repo-specific operating rules and release governance.
- `docs/README.md` — Documentation index.
- `instructions/README.md` — Portable instruction index.
- `schemas/README.md` — Schema inventory and validation guidance.

## Repository Structure

```text
.github/                       # GitHub-native control-plane assets
agents/                        # Portable multi-file agents
ai/                            # Canonical AI references
cookbook/                      # Implementation playbooks
docs/                          # Human-facing governance and process docs
hooks/                         # Portable guardrail hooks
instructions/                  # Portable standards
plugins/                       # Installable plugin bundles
prompts/                       # Reusable prompt templates
schemas/                       # Canonical JSON schemas
scripts/                       # Automation scripts
skills/                        # Reusable skills
tests/                         # Test suites
website/                       # Public site source
workflows/                     # Portable workflow playbooks
```

## Governance Flow

```mermaid
graph TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: Repository architecture overview
accDescr: High-level view of the .github repository structure, showing community health files, automation workflows, canonical labels, AI/collaboration resources, supporting documentation, and testing artefacts.
    A[🏠 LightSpeed .github Repository] --> B[📁 Community Health Files]
    A --> C[🤖 Automation & Workflows]
    A --> D[🏷️ Labels & Issue Types]
    A --> E[🧠 AI & Copilot Resources]
    A --> F[📚 Documentation]
    A --> G[🧪 Testing & Quality]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#000
    style E fill:#00695c,color:#fff

    C --> C1[GitHub Actions]
    C --> C2[Labeler Configuration]
    C --> C3[Project Automation]
    C --> C4[Quality Gates]

    D --> D1[labels.yml]
    D --> D2[issue-types.yml]
    D --> D3[Label Documentation]

    E --> E1[Custom Instructions]
    E --> E2[Agent Specifications]
    E --> E3[Prompt Library]

    F --> H[LINTING.md]
    F --> I[HUSKY_PRECOMMITS.md]
    F --> J[docs/config/]
    F --> K[AUTOMATION.md]
    F --> L[LABEL_STRATEGY.md]
    F --> M[LABELING.md]
    F --> N[README Sections]

    G --> O[Unit Tests]
    G --> P[Integration Tests]
    G --> Q[E2E Tests]
    G --> R[Coverage Reports]

    classDef core fill:#f1f5f9,stroke:#334155,color:#0f172a
    classDef docs fill:#dcfce7,stroke:#14532d,color:#14532d
    classDef automation fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
    classDef automation-sub fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
    classDef label fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
    classDef label-sub fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
    classDef ai fill:#f3e8ff,stroke:#7e22ce,color:#3b0764
    classDef ai-sub fill:#fef3c7,stroke:#b45309,color:#4a2c00
    classDef docs-sub fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
    classDef testing fill:#dcfce7,stroke:#14532d,color:#14532d
    classDef testing-sub fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f

    class A core
    class B core
    class B1 docs-sub
    class B2 docs-sub
    class B3 docs-sub
    class B4 docs-sub
    class B5 docs-sub
    class C automation
    class C1 automation-sub
    class C2 automation-sub
    class C3 automation-sub
    class C4 automation-sub
    class D label
    class D1 label-sub
    class D2 label-sub
    class D3 label-sub
    class E ai
    class E1 ai-sub
    class E2 ai-sub
    class E3 ai-sub
    class F docs
    class H docs-sub
    class I docs-sub
    class J docs-sub
    class K docs-sub
    class L docs-sub
    class M docs-sub
    class N docs-sub
    class G testing
    class O testing-sub
    class P testing-sub
    class Q testing-sub
    class R testing-sub

    linkStyle default stroke:#0f172a,stroke-width:1.4px
```

## 🔄 Comprehensive Workflow Overview

### Repository Inheritance & Automation Flow

The next diagram tracks how repository inheritance feeds automation and AI integration phases to uphold consistent governance across LightSpeed repositories.

```mermaid
flowchart LR
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: Inheritance and automation flow
accDescr: Shows how canonical community health files propagate through automation workflows and AI integration to enforce labels, standards, and governance.
  subgraph "Repository Inheritance"
    A[LightSpeed Repo] --> B[Inherits Health Files]
    B --> C[Applies Labels & Types]
    C --> D[Uses Workflows]
    D --> E[Follows Standards]
  end

  subgraph "Automation Flow"
    F[Issue/PR Created] --> G[Auto-Label Applied]
    G --> H[Project Sync]
    H --> I[Quality Checks]
    I --> J[Governance Review]
  end

  subgraph "AI Integration"
    K[Copilot Instructions] --> L[Agent Processing]
    L --> M[Automated Tasks]
    M --> N[Quality Assurance]
  end

  classDef repo fill:#f1f5f9,stroke:#334155,color:#0f172a
  classDef automation fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
  classDef ai fill:#f3e8ff,stroke:#7e22ce,color:#3b0764
  classDef development fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
  classDef review fill:#fef3c7,stroke:#b45309,color:#4a2c00

  class A repo
  class B repo
  class C repo
  class D repo
  class E repo
  class F automation
  class G automation
  class H development
  class I development
  class J review
  class K ai
  class L ai
  class M development
  class N review

  linkStyle default stroke:#0f172a,stroke-width:1.4px
```

## Quick Start

1. Read `CONTRIBUTING.md` for contribution workflow.
2. Read `docs/BRANCHING_STRATEGY.md` for branch and PR policy.
3. Use `npm run lint-all` and `npm test` before opening a PR.
4. Follow `docs/RELEASE_PROCESS.md` for releases.

```mermaid
flowchart TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: Development workflow process
accDescr: The diagram shows code changes entering pre-commit hooks, passing lint/test stages, generating coverage, and finally pushing through CI/CD and deployment.
    A[📝 Code Change] --> B[🔍 Pre-commit Hooks]
    B --> C{🎯 Linting Pass?}
    C -->|❌ No| D[🛠️ Fix Issues]
    D --> B
    C -->|✅ Yes| E[🧪 Run Tests]
    E --> F{✅ Tests Pass?}
    F -->|❌ No| G[🐛 Debug & Fix]
    G --> E
    F -->|✅ Yes| H[📊 Generate Coverage]
    H --> I[📋 Update Reports]
    I --> J[💾 Commit & Push]
    J --> K[🚀 CI/CD Pipeline]
    K --> L[🌐 Deploy/Merge]

    classDef change fill:#f1f5f9,stroke:#334155,color:#0f172a
    classDef hook fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
    classDef test fill:#dcfce7,stroke:#14532d,color:#14532d
    classDef check fill:#dbeafe,stroke:#1e3a5f,color:#1e3a5f
    classDef deployment fill:#f3e8ff,stroke:#7e22ce,color:#3b0764

### 🏷️ Label Rules

**ALL labels MUST have family prefix from `.github/labels.yml`:**

- ✅ `type:bug`, `type:feature`, `type:task`
- ✅ `status:in-progress`, `status:needs-review`
- ✅ `priority:critical`, `priority:normal`
- ✅ `area:ci`, `area:docs`, `area:security`
- ✅ `meta:needs-changelog`, `meta:has-pr`

The sequence diagram below traces how a developer push triggers AI agents, workflows, and validation gates that close the loop with repository feedback.

```mermaid
sequenceDiagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: AI and automation integration pipeline
accDescr: Visualizes how developer pushes trigger AI automation, workflow execution, validation checks, and status updates back to the repository.
    participant Dev as 👨‍💻 Developer
    participant Repo as 📁 Repository
    participant AI as 🤖 AI Agent
    participant Workflow as ⚙️ Workflow
    participant QA as ✅ Quality Gate

    Dev->>Repo: Push changes
    Repo->>AI: Trigger automation
    AI->>AI: Process instructions
    AI->>Workflow: Execute tasks
    Workflow->>QA: Run checks
    QA-->>Workflow: Validation results
    Workflow-->>AI: Report status
    AI-->>Repo: Update labels/status
    Repo-->>Dev: Notify completion
```

## 🎯 Repository Overview

This comprehensive workflow diagram illustrates the complete ecosystem of the LightSpeed .github repository, showing how community health files, automation systems, AI integration, and quality gates work together to maintain consistent standards across all organization repositories.

### Complete Repository Ecosystem Flow

```mermaid
flowchart TB
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: "Repository ecosystem overview"
accDescr: "Comprehensive view of the .github repository ecosystem, showing core structure, automation pipelines, quality gates, and organization-wide impact across all component areas."
    subgraph "📁 Core Repository Structure"
        A[🏠 .github Repository]
        B[📋 Community Health Files]
        C[🤖 Automation & Workflows]
        D[🏷️ Labels & Issue Types]
        E[🧠 AI & Copilot Resources]
        F[📚 Documentation]
        G[🧪 Testing & Quality]
    end

    subgraph "🔄 Automation Pipeline"
        H[Issue/PR Created]
        I[Auto-Label Applied]
        J[Quality Checks Run]
        K[AI Processing]
        L[Governance Review]
        M[Project Sync]
    end

    subgraph "🎯 Quality Gates"
        N[Linting]
        O[Testing]
        P[Coverage]
        Q[Security]
        R[Accessibility]
    end

    subgraph "🌐 Organization Impact"
        S[Member Repositories]
        T[Consistent Standards]
        U[Automated Workflows]
        V[Quality Assurance]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G

    H --> I
    I --> J
    J --> K
    K --> L
    L --> M

    C --> N
    C --> O
    C --> P
    C --> Q
    C --> R

    B --> S
    C --> T
    D --> U
    G --> V

    style A fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
    style C fill:#dcfce7,color:#14532d,stroke:#14532d
    style E fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c
    style S fill:#fef3c7,color:#4a2c00,stroke:#b45309
```

### Repository Maintenance & Update Cycle

```mermaid
stateDiagram-v2
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: "Repository maintenance and update state machine"
accDescr: "State diagram showing the content update lifecycle from initial content updates through validation, testing, quality checks, review, approval, and deployment with org-wide synchronization."
    [*] --> ContentUpdate
    ContentUpdate --> ValidationPending
    ValidationPending --> TestsRunning
    TestsRunning --> QualityCheck
    QualityCheck --> ReviewRequired
    ReviewRequired --> Approved
    ReviewRequired --> ChangesRequested
    ChangesRequested --> ContentUpdate
    Approved --> DeploymentReady
    DeploymentReady --> OrgWideSync
    OrgWideSync --> [*]

    ContentUpdate : 📝 Content Updated
    ValidationPending : ⏳ Validation Pending
    TestsRunning : 🧪 Tests Running
    QualityCheck : ✅ Quality Check
    ReviewRequired : 👀 Review Required
    ChangesRequested : 🔄 Changes Requested
    Approved : ✅ Approved
    DeploymentReady : 🚀 Deployment Ready
    OrgWideSync : 🌐 Org-wide Sync
```

## 🔧 Linting, Formatting, and Testing Workflow

All code quality, formatting, and automation standards are documented and enforced across the repository. See:

- [LINTING.md](./docs/LINTING.md) — Main linting strategy, tool configuration, and automation
- [HUSKY_PRECOMMITS.md](./docs/HUSKY_PRECOMMITS.md) — Pre-commit hook and automation details
- [docs/CONFIGS.md](./docs/CONFIGS.md) — Configuration file documentation (ESLint, Prettier, Stylelint, Playwright, Jest, npm scripts, etc.)

### Local Linting & Formatting

- `npm run lint` — Run all core linters (JS, CSS, YAML, package.json)
- `npm run lint:all` — Run all linters, including workflows and markdown
- `npm run lint:js` — Lint JavaScript/TypeScript
- `npm run lint:css` — Lint CSS/SCSS
- `npm run lint:yaml` — Lint YAML files
- `npm run lint:md` — Lint Markdown files
- `npm run lint:pkg-json` — Lint package.json
- `npm run format` — Format all supported files (Prettier, Stylelint, etc.)

### Testing Architecture & Flow

```mermaid
flowchart LR
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
accTitle: "Testing architecture and quality gates"
accDescr: "Testing architecture showing test types, tools, and quality gates with relationships between unit tests, integration tests, end-to-end tests, and coverage reporting through Jest, Playwright, Bats, and coverage tools."
    subgraph "🧪 Test Types"
        A[Unit Tests]
        B[Integration Tests]
        C[E2E Tests]
        D[Coverage Reports]
    end

    subgraph "🔧 Test Tools"
        E[Jest]
        F[Playwright]
        G[Bats]
        H[Coverage Tools]
    end

    subgraph "📊 Quality Gates"
        I[Code Coverage]
        J[Performance]
        K[Accessibility]
        L[Security]
    end

    A --> E
    B --> E
    C --> F
    D --> H

    E --> I
    F --> J
    F --> K
    G --> L

    style A fill:#dcfce7,color:#14532d,stroke:#14532d
    style C fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style I fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
```

**Test Commands:**

- `npm test` — Run all JavaScript/TypeScript tests (Jest)
- `npm run test:js` — Run JS/TS tests with coverage
- `npm run test:e2e` — Run Playwright E2E tests

### VS Code Integration

- See `.vscode/settings.json`, `.vscode/tasks.json`, `.vscode/launch.json`, and `.vscode/extensions.json` for editor integration, tasks, debugging, and recommended extensions.
- All major linting, formatting, and test commands are available as VS Code tasks.

### Automation & Pre-commit

- Husky and lint-staged enforce linting and formatting before every commit. See [HUSKY_PRECOMMITS.md](./docs/HUSKY_PRECOMMITS.md).

### Troubleshooting & Updates

- For troubleshooting, see [docs/LINTING.md](./docs/LINTING.md) and [docs/CONFIGS.md](./docs/CONFIGS.md).
- To update rules, edit the relevant configuration file and update npm scripts as needed.

---

## Documentation Index

### Essential Reading

| Document | Purpose | Audience |
|----------|---------|----------|
| [AGENTS.md](./AGENTS.md) | Global AI governance and standards | All AI operators |
| [CLAUDE.md](./CLAUDE.md) | Repository operating rules and release governance | All contributors |
| [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) | Git discipline and branch naming | All developers |
| [docs/RELEASE_PROCESS.md](./docs/RELEASE_PROCESS.md) | Release workflow with agentic gates | Release managers |

### Process & Workflow

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — System design overview
- [docs/AUTOMATION.md](./docs/AUTOMATION.md) — Workflow automation patterns
- [docs/PR_CREATION_PROCESS.md](./docs/PR_CREATION_PROCESS.md) — PR guidelines
- [docs/BRANCH_CLEANUP.md](./docs/BRANCH_CLEANUP.md) — Branch deletion protocol
- [docs/CHANGELOG_AUTOMATION.md](./docs/CHANGELOG_AUTOMATION.md) — Changelog standards

### Governance & Standards

- [docs/LABELING.md](./docs/LABELING.md) — Labeling standards and conventions
- [docs/LABEL_STRATEGY.md](./docs/LABEL_STRATEGY.md) — Label taxonomy and family prefixes
- [docs/LABEL_MANAGEMENT_CLI.md](./docs/LABEL_MANAGEMENT_CLI.md) — Label orchestrator CLI reference
- [docs/ISSUE_MAINTENANCE_SCRIPTS.md](./docs/ISSUE_MAINTENANCE_SCRIPTS.md) — Issue automation
- [instructions/README.md](./instructions/README.md) — Portable standards index

### AI Operations

- [docs/AGENT_CREATION.md](./docs/AGENT_CREATION.md) — Creating new agents
- [docs/AGENT_STANDARDS.md](./docs/AGENT_STANDARDS.md) — Agent specification standards
- [docs/AI_FEEDBACK_SYSTEM_SUMMARY.md](./docs/AI_FEEDBACK_SYSTEM_SUMMARY.md) — AI feedback tracking
- [ai/Claude.md](./ai/Claude.md) — Claude usage standards

### Advanced Topics

- [docs/AGENTIC_RELEASE_ADMIN_GUIDE.md](./docs/AGENTIC_RELEASE_ADMIN_GUIDE.md) — Release infrastructure
- [docs/AWESOME_GITHUB_MAPPING_STRATEGY.md](./docs/AWESOME_GITHUB_MAPPING_STRATEGY.md) — Schema alignment
- [.github/projects/active/repo-restructuring-2026-07-25/](./.github/projects/active/repo-restructuring-2026-07-25/) — Phase 1 audit reports

---

## What's Inside

### Workflows & Automation (14+ active)

- **labeler.yml** — Auto-apply labels to PRs and issues
- **validation.yml** — Lint, test, security scan, changelog validation
- **release.yml** — Automated release with version bumping and tagging
- **main-branch-guard.yml** — Enforce release-only branch policy on main
- **changelog-sync.yml** — Keep changelog in sync with merges
- **ai-feedback-validation.yml** — Track AI feedback in PR comments
- **template-enforcement.yml** — Validate issue DoR/DoD sections
- **metrics.yml** — Daily organization-wide activity collection
- **dependency-updates.yml** — Automated dependency management
- Plus 5+ utility and housekeeping workflows

### Agents & Automation (30+ GitHub-native)

All in `.github/agents/`:

- Release agent — Version bumping and changelog generation
- Labeling agents — Content-based label application (10+ variants)
- Validation agents — Linting, testing, security scanning
- Metrics agent — Organization health collection
- Review agents — Code quality and standards checking
- Plus 10+ utility and specialized agents

### Skills Library (96 total)

Includes:

- **WordPress-specific** — Template generators, block validators, theme auditors
- **AI & LLM** — PRD generator, requirements traceability, AI readiness assessor
- **Project management** — Task breakdown, scope change control, launch readiness
- **Design & UX** — Design system application, Figma sync, token generation
- **DevOps & Infrastructure** — CI/CD pipelines, deployment automation
- And 76+ more specialized and general-purpose skills

---

## Project Organization

### Active Projects

Active initiative tracking and deliverables at [`.github/projects/active/`](./.github/projects/active/):

| Project | Purpose | Status |
|---------|---------|--------|
| [repo-restructuring-2026-07-25](./.github/projects/active/repo-restructuring-2026-07-25/) | Phase 1 audit & consolidation | ✅ Complete (Phase 1) |
| [issue-maintenance-scripts-2026-08-10](./.github/projects/active/issue-maintenance-scripts-2026-08-10/) | Automation and triage workflows | 🔄 Phase 5 (integration) |
| [label-prefix-enforcement-2026-08-05](./.github/projects/active/label-prefix-enforcement-2026-08-05/) | Family-prefix governance | ✅ Complete |

### Archived Projects

Completed initiatives at [`.github/projects/archived/`](./.github/projects/archived/) — see `.archive-status.md` in each project for completion summary.

---

## Contributing

1. **Clone and set up:**

   ```bash
   git clone https://github.com/lightspeedwp/.github.git
   cd .github
   npm ci
   ```

2. **Create a branch** following the naming convention:

   ```bash
   git checkout -b {type}/{scope}-{short-title}
   ```

3. **Make changes** and run validation:

   ```bash
   npm run lint:md
   npm run lint:js
   npm test
   ```

4. **Commit with clear messages:**

   ```bash
   git commit -m "type(scope): Short description of change"
   ```

5. **Push and create PR:**

   ```bash
   git push -u origin {branch-name}
   ```

6. **Follow PR guidelines** — Link to issues, use correct template, address review feedback

---

## Support & Resources

- **Issues** — [GitHub Issues](https://github.com/lightspeedwp/.github/issues)
- **Discussions** — [GitHub Discussions](https://github.com/lightspeedwp/.github/discussions)
- **Security** — [Security Policy](./SECURITY.md)
- **Code of Conduct** — [Community Guidelines](./CODE_OF_CONDUCT.md)
- **Sponsorship** — [Support LightSpeedWP](https://github.com/sponsors/lightspeedwp/)

---

## Repository Metadata

| Property | Value |
|----------|-------|
| **Organization** | LightSpeedWP |
| **Repository** | `.github` (organization control plane) |
| **Accessibility** | WCAG 2.2 AA compliant |
| **License** | GPL-3.0-or-later |
| **NPM Package** | [@lightspeedwp/github-community-health](https://www.npmjs.com/package/@lightspeedwp/github-community-health) |
| **Version** | 0.2.0 |
| **Status** | ✅ Production active |
| **Last Updated** | 2026-08-20 |

---

**Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!**
