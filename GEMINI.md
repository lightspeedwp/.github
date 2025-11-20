---
title: "GEMINI.md – Gemini Agent Guidance"
version: "v1.1"
last_updated: "2025-10-23"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Root-level guidance for Gemini agents, with LightSpeed and Copilot best practices."
tags: ["lightspeed", "templates", "copilot", "agents", "prompts", "models"]
file_type: "gemini-instructions"
references:
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/coding-standards.instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/gemini-guide.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/gemini-2.5-pro.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/gemini-flash-2.0.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/ai-model-comparison.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/model-guide.md"
---

# Overview

Gemini agents (Gemini Pro, Flash) are preferred at LightSpeed for:

- Fast, multimodal input/output (text, images, UI, code)
- Data extraction, research, and design/UI tasks
- Integration with Google data, Workspace, or image-rich workflows

**See also:** [Gemini 2.5 Pro explainer](./gemini-2.5-pro.md), [Gemini Flash 2.0 explainer](./gemini-flash-2.0.md), [AI Model Comparison Guide](./ai-model-comparison.md)

---

# Model Selection: When to Use Gemini vs Other Models

**Use Gemini (Pro/Flash) when:**

- You need to process or generate text, images, and code in the same task
- Tasks require fast response or are UI/data heavy (Flash excels at speed/multimodal)
- Integrating with Google tools or handling Google Workspace content
- Working with large context or complex data (Pro for longer context/reasoning, Flash for quick tasks)
- Automating content extraction from screenshots, PDFs, or design files

**Use ChatGPT (OpenAI) when:**

- You need creative writing, brainstorming, or marketing copy
- General conversational interactions
- You want the broadest API/connector ecosystem

**Use Claude (Anthropic) when:**

- You need very long context windows (e.g., large documents)
- Tasks require deep reasoning, analysis, or strict adherence to guidelines/safety

**Use Copilot when:**

- You want best-in-class code completion, IDE integration, or GitHub-native code review

*See the [AI Model Comparison Guide](./ai-model-comparison.md) for details and a feature matrix.*

---

# Best Practices for Gemini Agents

- **Prompting:** Be explicit—define goals, expected output format, and provide examples.  
  Keep prompts short and focused for Flash; chunk context for Pro.
- **Multimodal:** Use Gemini for text+image workflows, UI analysis, or design-to-code tasks.
- **Model choice:** Flash for speed/multimodal, Pro for longer context or advanced reasoning.
- **Verification:** Always review output for accuracy, accessibility, and compliance with LightSpeed standards.
- **Chunk context:** For large tasks, split data and process in steps. Pin critical facts.
- **Escalation:** If Flash or Pro can't handle a task (limits, reasoning, or context), escalate to Claude (for long context/reasoning) or ChatGPT (for creative/marketing tasks).

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

- Reference [AGENTS.md](./AGENTS.md), [custom-instructions.md](./.github/custom-instructions.md), [gemini-guide.md](./gemini-guide.md).
- If unclear, ask one focused question.
- Escalate blockers to a maintainer or via [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions).

# Conventions (optional)

- Use YAML frontmatter in documentation/PRs.
- Reference core index files by relative path.
- Link and close issues in commit messages/PRs.

# Process (required)

1. Review all agent and model guides.
2. Confirm project requirements and constraints.
3. Use Issues and PRs for all changes; follow the [PR template](./.github/PULL_REQUEST_TEMPLATE.md).
4. Document rationale, tests, and accessibility for every change.
5. Automate linting, accessibility, and testing before merge.

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

# Best Practices (required)

- Adhere to all coding and documentation standards.
- Promote accessibility, semantic markup, and modular design.
- Use Gemini for tasks best suited to its speed and multimodal strengths.
- Escalate to Claude or ChatGPT when needed, per model guidance.

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

- [Gemini Guide](./gemini-guide.md)
- [Gemini 2.5 Pro explainer](./gemini-2.5-pro.md)
- [Gemini Flash 2.0 explainer](./gemini-flash-2.0.md)
- [AI Model Comparison Guide](./ai-model-comparison.md)
- [Model Guide](./model-guide.md)
- [AGENTS.md](./AGENTS.md)
- [Coding Standards](./.github/instructions/coding-standards.instructions.md)
- [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md)
- [Prompts Index](./.github/prompts/prompts.md)

# Prompt (required)

- Write a concise, actionable prompt tailored to the task, referencing relevant LightSpeed standards, instructions, and indexes.
- Validate every output against coding, accessibility, and security requirements.
- Ask clarifying questions if requirements, scope, or context are ambiguous.

---

*When in doubt, review the [AI Model Comparison Guide](./ai-model-comparison.md) and escalate to another model as needed. Provide safe defaults, flag optional features, and always reference LightSpeed best practices for every workflow.*
