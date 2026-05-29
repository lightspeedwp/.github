---
title: "Glossary — WCEU 2026 Talk"
description: "Key terminology for 'One .github repo to rule them all' presentation"
created_date: "2026-05-30"
last_updated: "2026-05-30"
---

# Glossary — WCEU 2026 Talk

**Purpose**: Definitions for audience unfamiliar with LightSpeed terminology, GitHub Actions, or AI-ops concepts. Reference for speaker notes.

---

## LightSpeed-Specific Terms

### Plugin Pack
A curated bundle of WordPress plugins distributed as a reusable, versioned collection. The LightSpeed plugin pack includes governance, automation, and AI-ops capabilities designed for agencies and product teams.

### Manifest
A structured file (JSON or YAML) that declares the contents, dependencies, and configuration of a plugin pack. Enables automated discovery and validation.

### Hooks Layer
A semantic abstraction over GitHub Actions workflows. Hooks define *what* automation happens (e.g., "label issues") without assuming *where* it runs. Part of the portable plugin pack system.

### Workflow Layer
The GitHub Actions implementation of hooks. Converts hook declarations into executable CI/CD jobs. Decouples hook definitions from workflow mechanics.

### Control Plane
A centralised repository (in this case, `.github`) that governs configuration, automation, and standards across an organization or multiple repositories. Acts as the single source of truth for governance policies.

### Canonical Assets
Source-of-truth files (instructions, schemas, workflows) maintained in one place and inherited or distributed to other repositories. Ensures consistency and reduces duplication.

### Template System
A framework for generating consistent files (GitHub issue templates, PR templates, documentation) across repositories. Uses frontmatter and placeholders to enable reuse.

### Frontmatter
YAML metadata block at the top of a Markdown file, enclosed in `---`. Used to declare properties, schemas, and automation rules (e.g., issue type, priority, assignee).

### Plugin Distribution
The process of packaging and delivering reusable plugins from the `.github` control plane to consuming repositories. Enables adoption without forking or manual copying.

### Portable Assets
Reusable resources (agents, instructions, hooks, workflows) designed to work outside their origin repository. Contrasts with repo-specific assets that assume a particular context.

### Repository Inheritance
The ability for a repository to automatically inherit configuration, workflows, and templates from a parent `.github` repository. Reduces duplication and enforces consistency.

---

## GitHub Basics

### GitHub Actions
GitHub's built-in CI/CD automation platform. Enables running scripts, tests, and deployments triggered by repository events (push, PR, issue, schedule, etc.).

### Workflow
A YAML-defined automation file (stored in `.github/workflows/`) that describes a series of jobs triggered by GitHub events. Workflows are the backbone of GitHub Actions.

### Issue Template
A pre-formatted Markdown file that populates the "New Issue" form, guiding users to provide structured information. Improves issue quality and consistency.

### Pull Request Template
Similar to issue templates, a pre-formatted Markdown file that guides contributors through the PR process. Often includes checklists (testing, documentation, accessibility).

### Label
A tag applied to issues and PRs to categorise, prioritise, and filter work. Labels enable cross-cutting concerns (e.g., "accessibility", "documentation", "bug") without duplicating issues.

### Automation Rule
A condition-and-action specification that automatically applies labels, assigns reviewers, or closes issues based on metadata or content. Powers autonomous governance.

### Semantic Versioning
A versioning scheme (MAJOR.MINOR.PATCH) that communicates the nature of changes. Used for releases, plugins, and schemas to enable predictable dependency management.

### Secret Management
Secure storage and injection of sensitive values (API keys, tokens, passwords) into workflows without exposing them in logs or code. GitHub provides built-in secrets storage.

---

## AI-Ops Concepts

### Agent
An AI-powered system that autonomously performs tasks (e.g., labeling issues, generating release notes, reviewing code). Agents receive instructions and context, then act on behalf of users.

### Skill
A self-contained, reusable automation capability. Skills bundle logic, documentation, and examples so they can be applied across projects and teams.

### AI-Driven Governance
Using AI agents to enforce standards, policies, and conventions across repositories. Reduces manual review burden and improves consistency.

### Copilot
GitHub Copilot is an AI assistant that generates code suggestions, documentation, and automation rules. Can be integrated into workflows and tasked with specific goals.

### Prompt Engineering
The practice of crafting instructions and context to guide an AI agent or LLM towards desired behaviour. Critical for achieving consistent, high-quality automation.

### Schema Validation
Automated checking that data (frontmatter, issue metadata, workflow configuration) conforms to a declared structure. Prevents invalid configurations and enforces standards.

### Task Delegation
Assigning a task to an AI agent via GitHub issues or API, allowing the agent to autonomously plan and execute work. Scales human decision-making across teams.

### LLM (Large Language Model)
A neural network trained on vast amounts of text to predict and generate human-like language. Foundation for modern AI assistants like Claude and ChatGPT.

---

## Architecture Concepts

### Inheritance Boundaries
Clear definitions of what configuration, templates, and workflows flow from a parent repository (like `.github`) to child repositories. Ensures predictability and prevents unintended side effects.

### Hub-and-Spoke Model
A network topology where a central repository (the hub, in this case `.github`) distributes standards, plugins, and governance to multiple repositories (the spokes). Enables consistency while preserving repository autonomy.

### Modular Architecture
A design approach where systems are built from independent, interchangeable components. Each module has clear responsibilities and minimal coupling to others.

### Decoupling
Separating concerns so that changes in one part don't cascade to others. E.g., separating hook definitions from workflow implementations enables both to evolve independently.

### Portability
The ability to use an asset (instruction, workflow, hook) in multiple repositories without modification. Requires clear assumptions and minimal hard-coded paths.

### Scalability
The ability to handle growing complexity and numbers of repositories without proportional increases in overhead or maintenance. Achieved through automation and reusable standards.

### Single Source of Truth
A single, authoritative location for each piece of information or configuration. Prevents drift and conflicting versions across repositories.

---

## WordPress-Specific Terms (Context for Integration)

### WordPress Agent-Skills
A repository maintained by the WordPress Foundation that provides reusable AI agent skills for WordPress project governance and automation. Future integration target for LightSpeed.

### GPL 3.0
GNU General Public Licence v3, an open-source licence that requires derivative works to also be open-source. WordPress is GPL 3.0, aligning with WordPress agent-skills licensing.

### WordPress Plugin
A package of code that extends WordPress functionality without modifying core files. Follows WordPress Coding Standards and hooks system.

### Block Editor (Gutenberg)
Modern WordPress content editor using block-based composition. Supports custom blocks, patterns, and variations.

---

## Presentation Context

### WordCamp
Community-driven WordPress conference. Typically one-day event with talks, workshops, and networking. WordCamp Europe (WCEU) is the largest annual WordPress conference.

### Speaker Notes
Detailed talking points, timing, and transition guidance for each slide. Supports speaker during delivery and ensures consistent messaging.

### Dark Mode
A presentation design using dark backgrounds (charcoal, near-black) with light text (off-white). Reduces eye strain and creates visual impact in conference settings.

### WCAG AA/AAA
Web Content Accessibility Guidelines. AA = baseline accessibility (4.5:1 contrast ratio), AAA = enhanced accessibility (7:1 contrast ratio).

---

## Related Files

- [WORDPRESS_INTEGRATION_ROADMAP.md](../WORDPRESS_INTEGRATION_ROADMAP.md) — WordPress integration planning
- [SLIDES_GENERATION_PROMPT.md](../SLIDES_GENERATION_PROMPT.md) — Slide design and content guidelines
- [talk-outline-25min.md](../talk-outline-25min.md) — Talk structure and narrative flow
- [notebooklm/sources-index.md](../notebooklm/sources-index.md) — URLs for NotebookLM content synthesis

---

**Created**: 2026-05-30  
**Total entries**: 45+  
**Purpose**: Speaker reference for WCEU 2026 talk

