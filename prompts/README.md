---
file_type: "prompt"
title: "Standardised Prompts Directory"
description: "Reusable prompt library with 113 organization-wide prompts for AI-assisted development workflows"
version: "2.0.0"
last_updated: "2026-09-04"
owners: ["ashley@lightspeedwp.agency"]
tags: ["prompts", "ai", "templates", "agents", "reusable", "workflows"]
status: "active"
stability: "stable"
domain: generic
---

# 🎯 Reusable Prompts Library

A comprehensive, organization-wide library of **113 production-ready reusable prompts** for AI-assisted development tasks. Use these prompts as starting points for common tasks—customise as needed for your specific context.

**Latest Update:** Phase 1 complete with 9 new comprehensive prompts + 71 migrated existing prompts + 33 legacy prompts = **113 total prompts**  
**Active Project:** [.github/projects/active/reusable-prompts/](../.github/projects/active/reusable-prompts/)  
**Related PR:** [#2778](https://github.com/lightspeedwp/.github/pull/2778)

---

## Quick Start

### Using Prompts in Copilot Chat

```bash
# In Copilot Chat, reference a prompt directly:
/prompt-builder.prompt.md
/code-generation.prompt.md
/testing.prompt.md
```

### Copying Prompts Locally

```bash
# Copy a prompt template
cp prompts/code-generation.prompt.md my-task.prompt.md

# Edit for your context
vim my-task.prompt.md

# Use with Claude or your AI tool
cat my-task.prompt.md | claude
```

### Dynamic File Reference Pattern

All prompt files follow the standardized naming pattern:

```
*.prompt.md
```

This allows dynamic referencing and automatic discovery across tools and workflows.

---

## 🆕 Phase 1: New Comprehensive Reusable Prompts

Nine new production-ready prompts created for common AI-assisted development workflows. Each includes comprehensive documentation, workflow examples, and integration guidance.

| # | Prompt | Purpose | Effort | Workflows | Documentation |
|---|--------|---------|--------|-----------|----------------|
| 1 | **[prompt-builder.prompt.md](./prompt-builder.prompt.md)** | Build, test, and iterate on custom prompts | 45 min | Copilot Chat, IDE | Complete with examples |
| 2 | **[code-generation.prompt.md](./code-generation.prompt.md)** | Generate code stubs and implementations | 30 min | GitHub Actions, Copilot | Scaffolding templates |
| 3 | **[documentation-writer.prompt.md](./documentation-writer.prompt.md)** | Auto-generate user-facing documentation | 40 min | CI/CD pipeline, Manual | API docs, guides, tutorials |
| 4 | **[refactoring.prompt.md](./refactoring.prompt.md)** | Analyze and refactor code for consistency | 35 min | Pre-commit, CI pipeline | Quality metrics included |
| 5 | **[testing.prompt.md](./testing.prompt.md)** | Generate unit and integration tests | 45 min | GitHub Actions, IDE | Test patterns, frameworks |
| 6 | **[conventional-commit.prompt.md](./conventional-commit.prompt.md)** | Format commits following Conventional Commits | 20 min | Git hooks, CLI | Standards reference |
| 7 | **[create-specification.prompt.md](./create-specification.prompt.md)** | Create detailed technical specifications | 50 min | Manual, Copilot Chat | Requirements templates |
| 8 | **[debugging.prompt.md](./debugging.prompt.md)** | Troubleshoot and analyze runtime errors | 35 min | IDE, Copilot Chat | Error catalogs |
| 9 | **[create-implementation-plan.prompt.md](./create-implementation-plan.prompt.md)** | Break features into actionable tasks | 40 min | Planning workflow, Manual | Task breakdown templates |

**Total:** 9 prompts, 340 minutes effort, comprehensive documentation and workflow integrations

**See Also:** [PROMPTS-V1-INDEX.md](./PROMPTS-V1-INDEX.md) for detailed workflows and implementation guides

---

## 📚 Canonical Boundary

**Organization-wide Prompts:**
- **Location:** `prompts/` (root folder) — canonical for organisation-wide reusable prompts
- **Naming:** All files follow `*.prompt.md` convention
- **Total:** 113 prompts (9 new + 71 migrated + 33 legacy)

**.github Repository Governance Prompts:**
- **Location:** `.github/prompts/` — reserved for `.github` control-plane and repository-governance specific prompts
- **Purpose:** Repository-specific governance, PR templates, issue automation
- **Status:** Maintained separately, with redirects to canonical root location

**Migration Authority:**
- Active Project: [.github/projects/active/reusable-prompts/](../.github/projects/active/reusable-prompts/)
- Migration Report: [.github/reports/prompt-migration-2026-09-04.md](../.github/reports/prompt-migration-2026-09-04.md)
- Phase 1 Complete: 2026-09-04

---

## 📋 Complete Prompt Index

The library contains **113 prompts** organized in the following categories:

### Category: Core Development Workflows (9 prompts)
- **[prompt-builder.prompt.md](./prompt-builder.prompt.md)** ⭐ NEW — Build and iterate on custom prompts
- **[code-generation.prompt.md](./code-generation.prompt.md)** ⭐ NEW — Code implementation and scaffolding
- **[documentation-writer.prompt.md](./documentation-writer.prompt.md)** ⭐ NEW — Auto-generate documentation
- **[refactoring.prompt.md](./refactoring.prompt.md)** ⭐ NEW — Code refactoring and optimisation
- **[testing.prompt.md](./testing.prompt.md)** ⭐ NEW — Test generation and coverage
- **[conventional-commit.prompt.md](./conventional-commit.prompt.md)** ⭐ NEW — Commit message formatting
- **[create-specification.prompt.md](./create-specification.prompt.md)** ⭐ NEW — Technical specification creation
- **[debugging.prompt.md](./debugging.prompt.md)** ⭐ NEW — Error diagnosis and resolution
- **[create-implementation-plan.prompt.md](./create-implementation-plan.prompt.md)** ⭐ NEW — Feature breakdown and planning

### Category: Code Analysis & Review (12 prompts)
- [code-review.prompt.md](./code-review.prompt.md) — Comprehensive code review
- [accessibility-review.prompt.md](./accessibility-review.prompt.md) — WCAG compliance audit
- [security-review.prompt.md](./security-review.prompt.md) — Security vulnerability analysis
- [performance-review.prompt.md](./performance-review.prompt.md) — Performance optimization review
- [architecture-review.prompt.md](./architecture-review.prompt.md) — Architecture and design review
- [linting-review.prompt.md](./linting-review.prompt.md) — Code style and linting issues
- [test-coverage-analysis.prompt.md](./test-coverage-analysis.prompt.md) — Test coverage assessment
- [dependency-audit.prompt.md](./dependency-audit.prompt.md) — Dependency security audit
- [api-review.prompt.md](./api-review.prompt.md) — API design and consistency
- [documentation-review.prompt.md](./documentation-review.prompt.md) — Documentation quality review
- [type-safety-review.prompt.md](./type-safety-review.prompt.md) — Type system compliance
- [browser-compatibility-review.prompt.md](./browser-compatibility-review.prompt.md) — Cross-browser testing

### Category: Documentation & Specifications (15 prompts)
- [documentation.prompt.md](./documentation.prompt.md) — User documentation creation
- [api-documentation.prompt.md](./api-documentation.prompt.md) — API documentation generation
- [changelog.prompt.md](./changelog.prompt.md) — Changelog creation and updates
- [readme-blueprint.prompt.md](./readme-blueprint.prompt.md) — README template and generation
- [inline-documentation.prompt.md](./inline-documentation.prompt.md) — JSDoc/PHPDoc inline docs
- [update-frontmatter.prompt.md](./update-frontmatter.prompt.md) — Front matter migration and validation
- [architecture-documentation.prompt.md](./architecture-documentation.prompt.md) — Architecture decision records
- [user-guide-creation.prompt.md](./user-guide-creation.prompt.md) — End-user guides
- [troubleshooting-guide.prompt.md](./troubleshooting-guide.prompt.md) — Troubleshooting documentation
- [migration-guide.prompt.md](./migration-guide.prompt.md) — Migration and upgrade guides
- [schema-documentation.prompt.md](./schema-documentation.prompt.md) — Data schema documentation
- [api-spec-creation.prompt.md](./api-spec-creation.prompt.md) — OpenAPI/REST specifications
- [code-walkthrough.prompt.md](./code-walkthrough.prompt.md) — Code explanation and walkthroughs
- [training-material.prompt.md](./training-material.prompt.md) — Training and onboarding materials
- [release-notes.prompt.md](./release-notes.prompt.md) — Release notes and announcements

### Category: Testing & Quality Assurance (18 prompts)
- [unit-test-generation.prompt.md](./unit-test-generation.prompt.md) — Unit test creation
- [integration-test-generation.prompt.md](./integration-test-generation.prompt.md) — Integration test creation
- [e2e-test-generation.prompt.md](./e2e-test-generation.prompt.md) — End-to-end test creation
- [test-plan-creation.prompt.md](./test-plan-creation.prompt.md) — Test plan development
- [qa-checklist-creation.prompt.md](./qa-checklist-creation.prompt.md) — QA checklist generation
- [regression-test-analysis.prompt.md](./regression-test-analysis.prompt.md) — Regression test identification
- [performance-testing.prompt.md](./performance-testing.prompt.md) — Performance test design
- [load-testing.prompt.md](./load-testing.prompt.md) — Load and stress testing
- [security-testing.prompt.md](./security-testing.prompt.md) — Security test scenarios
- [test-case-generation.prompt.md](./test-case-generation.prompt.md) — Test case creation
- [mock-data-generation.prompt.md](./mock-data-generation.prompt.md) — Mock data creation
- [fixture-generation.prompt.md](./fixture-generation.prompt.md) — Test fixture generation
- [test-debugging.prompt.md](./test-debugging.prompt.md) — Test failure analysis
- [coverage-improvement.prompt.md](./coverage-improvement.prompt.md) — Test coverage enhancement
- [acceptance-criteria-validation.prompt.md](./acceptance-criteria-validation.prompt.md) — AC verification
- [bug-reproduction.prompt.md](./bug-reproduction.prompt.md) — Bug reproduction steps
- [compatibility-testing.prompt.md](./compatibility-testing.prompt.md) — Cross-platform testing
- [test-automation-setup.prompt.md](./test-automation-setup.prompt.md) — Automation framework setup

### Category: Architecture & Design (16 prompts)
- [architecture-blueprint.prompt.md](./architecture-blueprint.prompt.md) — System architecture design
- [design-pattern-selection.prompt.md](./design-pattern-selection.prompt.md) — Design pattern recommendation
- [data-model-design.prompt.md](./data-model-design.prompt.md) — Data model creation
- [database-schema-design.prompt.md](./database-schema-design.prompt.md) — Database schema design
- [api-design.prompt.md](./api-design.prompt.md) — RESTful API design
- [microservices-design.prompt.md](./microservices-design.prompt.md) — Microservices architecture
- [component-architecture.prompt.md](./component-architecture.prompt.md) — Component hierarchy design
- [folder-structure-blueprint.prompt.md](./folder-structure-blueprint.prompt.md) — Project structure design
- [error-handling-design.prompt.md](./error-handling-design.prompt.md) — Error handling architecture
- [security-architecture.prompt.md](./security-architecture.prompt.md) — Security design patterns
- [scalability-design.prompt.md](./scalability-design.prompt.md) — Scalability architecture
- [dependency-injection-design.prompt.md](./dependency-injection-design.prompt.md) — DI pattern design
- [caching-strategy.prompt.md](./caching-strategy.prompt.md) — Caching architecture
- [event-driven-architecture.prompt.md](./event-driven-architecture.prompt.md) — Event-driven design
- [workflow-design.prompt.md](./workflow-design.prompt.md) — Workflow orchestration design
- [integration-design.prompt.md](./integration-design.prompt.md) — System integration patterns

### Category: AI & Automation Workflows (11 prompts)
- [agent-setup.prompt.md](./agent-setup.prompt.md) — Agent context and configuration
- [agentic-workflow-design.prompt.md](./agentic-workflow-design.prompt.md) — Agent workflow creation
- [prompt-engineering.prompt.md](./prompt-engineering.prompt.md) — Prompt optimization
- [model-selection.prompt.md](./model-selection.prompt.md) — LLM model selection
- [automation-workflow.prompt.md](./automation-workflow.prompt.md) — Automation pipeline design
- [github-actions-workflow.prompt.md](./github-actions-workflow.prompt.md) — GitHub Actions creation
- [ci-cd-pipeline.prompt.md](./ci-cd-pipeline.prompt.md) — CI/CD pipeline design
- [webhook-integration.prompt.md](./webhook-integration.prompt.md) — Webhook setup and integration
- [api-client-generation.prompt.md](./api-client-generation.prompt.md) — SDK/client generation
- [data-pipeline-design.prompt.md](./data-pipeline-design.prompt.md) — Data processing pipeline
- [monitoring-observability.prompt.md](./monitoring-observability.prompt.md) — Monitoring and observability

### Category: Project Planning & Organization (13 prompts)
- [project-planning.prompt.md](./project-planning.prompt.md) — Project planning
- [roadmap-creation.prompt.md](./roadmap-creation.prompt.md) — Product roadmap
- [sprint-planning.prompt.md](./sprint-planning.prompt.md) — Sprint planning
- [requirements-gathering.prompt.md](./requirements-gathering.prompt.md) — Requirements analysis
- [user-story-creation.prompt.md](./user-story-creation.prompt.md) — User story writing
- [epic-breakdown.prompt.md](./epic-breakdown.prompt.md) — Epic decomposition
- [task-estimation.prompt.md](./task-estimation.prompt.md) — Effort estimation
- [dependency-mapping.prompt.md](./dependency-mapping.prompt.md) — Dependency analysis
- [risk-analysis.prompt.md](./risk-analysis.prompt.md) — Risk identification
- [retrospective-analysis.prompt.md](./retrospective-analysis.prompt.md) — Retrospective analysis
- [meeting-notes-summary.prompt.md](./meeting-notes-summary.prompt.md) — Meeting summarization
- [stakeholder-communication.prompt.md](./stakeholder-communication.prompt.md) — Stakeholder updates
- [decision-documentation.prompt.md](./decision-documentation.prompt.md) — Decision logging

### Category: WordPress-Specific Development (11 prompts)
- [wordpress-plugin-development.prompt.md](./wordpress-plugin-development.prompt.md) — Plugin development
- [wordpress-block-development.prompt.md](./wordpress-block-development.prompt.md) — Block development
- [wordpress-theme-development.prompt.md](./wordpress-theme-development.prompt.md) — Theme development
- [wordpress-custom-post-type.prompt.md](./wordpress-custom-post-type.prompt.md) — CPT creation
- [wordpress-hooks-filters.prompt.md](./wordpress-hooks-filters.prompt.md) — Hooks/Filters guide
- [wordpress-security-hardening.prompt.md](./wordpress-security-hardening.prompt.md) — Security best practices
- [wordpress-performance-optimization.prompt.md](./wordpress-performance-optimization.prompt.md) — Performance tuning
- [wordpress-multisite-setup.prompt.md](./wordpress-multisite-setup.prompt.md) — Multisite configuration
- [wordpress-admin-customization.prompt.md](./wordpress-admin-customization.prompt.md) — Admin interface
- [wordpress-rest-api.prompt.md](./wordpress-rest-api.prompt.md) — REST API development
- [wordpress-woocommerce-integration.prompt.md](./wordpress-woocommerce-integration.prompt.md) — WooCommerce setup

**[→ See complete categorized list in PROMPTS-V1-INDEX.md](./PROMPTS-V1-INDEX.md)**

---

## 🎯 Important Prompts for `.github` Repository

For governance, automation, and repository management, these prompts are critical:

| Prompt | Purpose | Priority | Use Case |
|--------|---------|----------|----------|
| [code-review.prompt.md](./code-review.prompt.md) | PR review standards enforcement | HIGH | Automated PR reviews |
| [conventional-commit.prompt.md](./conventional-commit.prompt.md) | Commit message validation | HIGH | CI/CD commit verification |
| [github-actions-workflow.prompt.md](./github-actions-workflow.prompt.md) | Workflow creation | HIGH | New workflow automation |
| [create-specification.prompt.md](./create-specification.prompt.md) | Issue specification | HIGH | GitHub issue creation |
| [accessibility-review.prompt.md](./accessibility-review.prompt.md) | A11Y audit | MEDIUM | Component review |
| [security-review.prompt.md](./security-review.prompt.md) | Security audit | HIGH | Dependency/code audit |
| [documentation-writer.prompt.md](./documentation-writer.prompt.md) | README/docs generation | MEDIUM | Repository documentation |
| [changelog.prompt.md](./changelog.prompt.md) | Release notes | MEDIUM | Release automation |
| [test-case-generation.prompt.md](./test-case-generation.prompt.md) | Workflow testing | MEDIUM | CI/CD test creation |
| [agentic-workflow-design.prompt.md](./agentic-workflow-design.prompt.md) | Agent design | MEDIUM | New agent creation |

---

## 📦 Prompt Templates Subfolder

Common prompt templates for quick-start projects are available in `prompts/templates/`:

```
prompts/templates/
├── README.md              # Templates documentation
├── agent-template.prompt.md
├── workflow-template.prompt.md
├── automation-template.prompt.md
└── ...
```

Use templates to bootstrap new prompts quickly while maintaining consistency.

---

## Usage Guide

Each prompt is designed to be:

- **Customisable:** Adapt sections to your project context
- **Focused:** Addresses a specific task or workflow stage
- **Documented:** Includes structure, examples, and acceptance criteria

### Example: Code Generation

```bash
# Copy the template
cp prompts/code-generation.prompt.md my-task.prompt.md

# Edit for your context
# Add project-specific details, file paths, acceptance criteria
vim my-task.prompt.md

# Use with Claude or your AI tool
cat my-task.prompt.md | claude --load-prompt -
```

### Example: Using in GitHub Actions

```yaml
- name: Generate Tests with Prompt
  env:
    PROMPT_FILE: prompts/testing.prompt.md
  run: |
    cat $PROMPT_FILE | claude --load-prompt - > tests/generated.test.js
```

---

## Prompt Structure

All prompts follow a consistent structure:

1. **Frontmatter** — Metadata (title, description, tags, etc.)
2. **Context** — Project, scope, and relevant background
3. **Task** — Clear, specific objective
4. **Constraints** — Limitations, standards, or requirements
5. **Acceptance Criteria** — Definition of done
6. **Examples** — Real examples and use cases
7. **References** — Links to relevant docs, files, or standards

---

## Contributing

To add or improve prompts:

1. Follow the standard structure above
2. Use UK English and clear, concise language
3. Include real examples where helpful
4. Document any dependencies or prerequisites
5. Add metadata: title, description, tags, owners
6. Create a PR with rationale for the new prompt

**See Also:** [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines

---

## Migration & Deprecation

**Phase 1 Migration Complete (2026-09-04):**
- 71 prompts migrated from `.github/prompts/` to root `prompts/`
- All files follow `*.prompt.md` naming convention
- Git history preserved (using `git mv`)
- Redirect notices in `.github/prompts/` point to canonical location

**Legacy Prompts:**
- 33 legacy prompts available for backwards compatibility
- All legacy files include deprecation notices with successor guidance
- New work should use canonical root `prompts/` location

**Migration Report:** [.github/reports/prompt-migration-2026-09-04.md](../.github/reports/prompt-migration-2026-09-04.md)

---

## Next Steps: Phase 2 (Sep 4-11)

- ⬜ Prompt enhancements & specializations (security, performance, linting)
- ⬜ Automation workflows (GitHub Actions, CI/CD integration)
- ⬜ Versioning & compatibility framework
- ⬜ Usage analytics & tracking
- ⬜ Prompt discovery & search interface

**See:** [.github/projects/active/reusable-prompts/](../.github/projects/active/reusable-prompts/) for detailed Phase 2 planning

---

*🎼 Orchestrated automation — where intelligence meets operations*

**Related:**
- [Reusable Prompts Active Project](./.github/projects/active/reusable-prompts/)
- [Comprehensive Prompt Index](./PROMPTS-V1-INDEX.md)
- [Migration Report](./.github/reports/prompt-migration-2026-09-04.md)
- [PR #2778](https://github.com/lightspeedwp/.github/pull/2778)
