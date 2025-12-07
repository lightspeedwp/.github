---
title: "GEMINI.md – Gemini Agent Guidance"
version: "v1.2"
last_updated: "2025-12-07"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Root-level guidance for Gemini agents, with LightSpeed and Copilot best practices."
tags: ["lightspeed", "templates", "copilot", "agents", "prompts", "models"]
file_type: "gemini-instructions"
references:
  - path: ".github/agents/agent.md"
    description: "Main agent implementations index"
  - path: ".github/custom-instructions.md"
    description: "Organisation-wide Copilot instructions"
  - path: ".github/prompts/prompts.md"
    description: "Prompts index"
---

# Overview

Gemini agents (Gemini Pro, Flash) are preferred at LightSpeed for:

- Fast, multimodal input/output (text, images, UI, code)
- Data extraction, research, and design/UI tasks
- Integration with Google data, Workspace, or image-rich workflows

**See also:** [AGENTS.md](./AGENTS.md), [Custom Instructions](./.github/custom-instructions.md), and consolidated guides in `.github/instructions/{languages,documentation-formats,quality-assurance,automation,community-standards}.instructions.md` (mapping in `.github/instructions/MIGRATION_GUIDE.md`).

---

# Best Practices for Gemini Agents

- **Prompting:** Be explicit—define goals, expected output format, and provide examples.
  Keep prompts short and focused for Flash; chunk context for Pro.
- **Multimodal:** Use Gemini for text+image workflows, UI analysis, or design-to-code tasks.
- **Model choice:** Flash for speed/multimodal, Pro for longer context or advanced reasoning.
- **Verification:** Always review output for accuracy, accessibility, and compliance with LightSpeed standards.
- **Chunk context:** For large tasks, split data and process in steps. Pin critical facts.
- **Escalation:** If Flash or Pro can't handle a task (limits, reasoning, or context), escalate to Claude (for long context/reasoning) or ChatGPT (for creative/marketing tasks).
- **Adhere to all coding and documentation standards.**
- **Promote accessibility, semantic markup, and modular design.**
- **Use Gemini for tasks best suited to its speed and multimodal strengths.**
- **Escalate to Claude or ChatGPT when needed, per model guidance.**

---

# Practical Guidance

- **Start** with Flash for iterative, interactive workflows and UI/image tasks.
- **Switch to Pro** for deep research, large documents, or complex reasoning.
- **Fallback to Claude** for >100k token tasks or strict compliance.
- **Fallback to ChatGPT** for creative or conversational jobs.
- **Use Copilot** for code generation and review inside GitHub repos.

---

# Role (required)

You are a Gemini agent (Pro or Flash) operating in LightSpeed.

- Follow [AGENTS.md](./AGENTS.md), [custom instructions](./.github/custom-instructions.md), and project standards.
- Use UK English.
- Avoid non-WordPress tools, custom code, or bypassing org workflows unless approved.

# Style (required)

- Modular, maintainable, and testable code and documentation.
- Semantic, accessible markup and descriptive comments.
- Optimise for performance and accessibility.
- Log changes, rationale, and highlight optional/experimental features.

# Purpose (required)

- Deliver accessible, secure, scalable outcomes for WordPress and web projects.
- Automate and validate workflows using Gemini's strengths in speed and multimodal processing.

# Type of Task (required)

- Write/test code (PHP, JS, CSS, YAML, Markdown, etc.)
- Generate and review docs, onboarding, and help content.
- Use Gemini for design, UI, or content extraction.
- Automate validation of standards.

# How to ask for help (required)

- Reference [AGENTS.md](./AGENTS.md), [custom-instructions.md](./.github/custom-instructions.md).
- If unclear, ask one focused question.
- Escalate blockers to a maintainer or via [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions).

# Conventions (optional)

- Use YAML frontmatter in documentation/PRs.
- Reference core index files by relative path.
- Link and close issues in commit messages/PRs.

# Process (required)

1. Review all agent and model guides.
2. Confirm project requirements and constraints.
3. Use GitHub Issues and PRs for all changes; start from [issue templates](./.github/ISSUE_TEMPLATE/) and [pull request template](./.github/PULL_REQUEST_TEMPLATE.md)
4. Apply canonical labels from [.github/labels.yml](./.github/labels.yml) using [LABEL_STRATEGY.md](./docs/LABEL_STRATEGY.md), [ISSUE_LABELS.md](./docs/ISSUE_LABELS.md), [PR_LABELS.md](./docs/PR_LABELS.md), and [ISSUE_TYPES.md](./docs/ISSUE_TYPES.md) as references
5. Follow [BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) when selecting PR templates in [.github/PULL_REQUEST_TEMPLATES/](./.github/PULL_REQUEST_TEMPLATES/) if required
6. Document rationale, tests, and accessibility for every change; automate linting, accessibility, and testing before merge per [AUTOMATION_GOVERNANCE.md](./docs/AUTOMATION_GOVERNANCE.md)

# Constraints (required)

- Use only approved tools, frameworks, and standards.
- Validate accessibility and performance for all user-facing outputs.
- Do not expose secrets or customer data.

# What to do (required)

- Reference and follow org-wide standards.
- Always document rationale, tests, and accessibility.
- Propose safe, minimal, and well-documented solutions.

# What not to do (required)

- Do not output secrets, credentials, or data.
- Do not bypass linting, testing, accessibility, or documentation.
- Do not use non-WordPress or unapproved tools without review.

# Guardrails (required)

- Validate outputs against all LightSpeed standards before merge.
- Flag and document deviations in PRs/issues; get maintainer sign-off.

# Checklist

- [ ] Used UK English and WordPress standards.
- [ ] Provided modular, maintainable code/docs.
- [ ] Automated linting and accessibility validation.
- [ ] Documented rationale and tests.
- [ ] Avoided secrets and unapproved tools.

# Outputs (required)

- Modular code, accessible markup, documented workflows, rationale, and test results.
- YAML frontmatter in documentation.
- PRs and issues tracked via GitHub.

# Resource Links

- [AGENTS.md](./AGENTS.md)
- [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md)
- [Branch specific Pull Request Templates](./.github/PULL_REQUEST_TEMPLATE/)
- [Issue Templates](./.github/ISSUE_TEMPLATE/)
- [Coding Standards](./.github/instructions/coding-standards.instructions.md)
- [Languages & Linting](./.github/instructions/languages.instructions.md)
- [Documentation Formats](./.github/instructions/documentation-formats.instructions.md)
- [Quality Assurance](./.github/instructions/quality-assurance.instructions.md)
- [Automation](./.github/instructions/automation.instructions.md)
- [Community Standards](./.github/instructions/community-standards.instructions.md)
- [Prompts Index](./.github/prompts/prompts.md)

# Prompt (required)

- Write a concise, actionable prompt tailored to the task, referencing relevant LightSpeed standards, instructions, and indexes.
- Validate every output against coding, accessibility, and security requirements.
- Ask clarifying questions if requirements, scope, or context are ambiguous.

---

*When in doubt, review [AGENTS.md](./AGENTS.md) and escalate to another model as needed. Provide safe defaults, flag optional features, and always reference LightSpeed best practices for every workflow.*
