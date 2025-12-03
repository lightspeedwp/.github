---
title: "Main Agent Index"
version: "v2.0"
last_updated: "2025-12-02"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Directory index referencing all agents, instructions, PR templates, and cross-references."
tags: ["lightspeed", "templates", "copilot", "agents", "prompts", "models"]
file_type: "agent-index"
---

# LightSpeed Agent Index

This document serves as the master index for all agent specifications, templates, and usage guides for LightSpeed projects.

> **Label Reference:**
> Agents, agent specs, and agent-related issues should use or reference the label:
>
> - `ai-ops:agents` (for agent definitions and specs)
> - `ai-ops:prompts` (for prompt agents or reusable prompt logic)
> - `ai-ops:instructions` (for instructions or cross-references)
>
> See [frontmatter schema](../../schemas/frontmatter.schema.json) for canonical frontmatter requirements.

## Purpose

- Link all agent specs and stubs.
- Reference key instruction indexes for Copilot and workflow guidance.
- Ensure agents follow org-wide standards for clarity, security, and maintainability.

---

## Agent File Index

All agent specs, templates, and stubs are in the `.github/agents/` directory.

### Templates & Infrastructure

| Agent File | Purpose / Notes |
| --- | --- |
| [agent.md](./agent.md) | Main index and directory for all agents |
| [template.agent.md](./template.agent.md) | Markdown template for new agents |
| [template.agent.js](./template.agent.js) | JS template for new agent implementations |
| [template.agent.py](./template.agent.py) | Python template for new agent implementations |
| [template.agent.sh](./template.agent.sh) | Shell script template for agent integrations |

### Automation & CI/CD

| Agent File | Purpose / Notes |
| --- | --- |
| [branding.agent.md](./branding.agent.md) | Unified branding: header, footer, badges |
| [devops-helper.agent.md](./devops-helper.agent.md) | CI/CD, release tagging, workflow hardening |
| [labeling.agent.md](./labeling.agent.md) | Unified issue/PR labeling and standardization |
| [issue-type.agent.md](./issue-type.agent.md) | Issue type classification and management |
| [project-meta-sync.agent.md](./project-meta-sync.agent.md) | GitHub Projects field synchronization |
| [release.agent.md](./release.agent.md) | Release automation, changelog, versioning |
| [metrics.agent.md](./metrics.agent.md) | Metrics collection and reporting |
| [reporting.agent.md](./reporting.agent.md) | Report generation and automation |

### Code Quality & Standards

| Agent File | Purpose / Notes |
| --- | --- |
| [linting.agent.md](./linting.agent.md) | Code linting and style enforcement |
| [code-quality-guru.agent.md](./code-quality-guru.agent.md) | Code quality analysis and recommendations |
| [jsdoc-review.agent.md](./jsdoc-review.agent.md) | JavaScript/TypeScript documentation audit |
| [phpdoc-enforcer.agent.md](./phpdoc-enforcer.agent.md) | PHP documentation coverage and quality |
| [accessibility-auditor.agent.md](./accessibility-auditor.agent.md) | WCAG compliance and accessibility review |
| [i18n-l10n-reviewer.agent.md](./i18n-l10n-reviewer.agent.md) | Internationalization and localization review |
| [security-hardening-reviewer.agent.md](./security-hardening-reviewer.agent.md) | Security best practices and hardening |
| [performance-profiler.agent.md](./performance-profiler.agent.md) | Performance analysis and optimization |

### Review & Testing

| Agent File | Purpose / Notes |
| --- | --- |
| [pr-copilot.agent.md](./pr-copilot.agent.md) | Pull request assistance and automation |
| [pr-reviewer.agent.md](./pr-reviewer.agent.md) | Code review guidance and checklists |
| [test-coach.agent.md](./test-coach.agent.md) | Testing guidance and coverage improvement |
| [qa-test-architect.agent.md](./qa-test-architect.agent.md) | Test strategy and architecture design |

### Documentation

| Agent File | Purpose / Notes |
| --- | --- |
| [manage-readmes.agent.md](./manage-readmes.agent.md) | README management and automation |

### WordPress Development

| Agent File | Purpose / Notes |
| --- | --- |
| [block-theme-development.agent.md](./block-theme-development.agent.md) | WordPress block theme development |
| [block-plugin-development.agent.md](./block-plugin-development.agent.md) | WordPress block plugin development |
| [woocommerce-specialist.agent.md](./woocommerce-specialist.agent.md) | WooCommerce development and integration |

> To add new agents, create a file in `.github/agents/` and update this index.

---

## Key Indexes & Contribution Guidelines

| Area | Reference | Notes / Usage |
| --- | --- | --- |
| **Custom Instructions** | [../custom-instructions.md](../custom-instructions.md) | Central Copilot/org standards |
| **Global AI Rules** | [../../AGENTS.md](../../AGENTS.md) | Org-wide AI and coding rules (references custom-instructions.md) |
| **Coding Standards** | [../instructions/coding-standards.instructions.md](../instructions/coding-standards.instructions.md) | Unified standards for all code |
| **Linting Standards** | [../instructions/linting.instructions.md](../instructions/linting.instructions.md) | Main index for all linting rules |
| **PR Templates** | [../PULL_REQUEST_TEMPLATE.md](../PULL_REQUEST_TEMPLATE.md) | Default PR template |
| **All PR Templates** | [../PULL_REQUEST_TEMPLATES/](../PULL_REQUEST_TEMPLATES/) | Directory containing additional PR templates |

---

## Discoverability & Workflow Integration

| Resource Name | Reference | Purpose / Notes |
| --- | --- | --- |
| **Main Agent Index** | [agent.md](./agent.md) | Directory of agent specs and usage |
| **Prompts Index** | [../prompts/prompts.md](../prompts/prompts.md) | Master prompt index and conventions |

---

## Usage

- Keep agent specs and templates close to code for maintainability.
- Reference all relevant standards and workflow documents above.
- Update this index whenever new agent files or templates are added.

---

> For up-to-date standards, always start with the main indexes above.
> For new agent work, fork an existing template and document its purpose in this directory.
