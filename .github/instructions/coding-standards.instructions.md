---
applyTo: '**/*'
description: 'Coding standards for automation, shell scripts, WordPress, and test code'
version: '1.2'
author: 'LightSpeed WP Team'
audience: ['contributor', 'maintainer', 'reviewer', 'automation']
status: 'approved'
changelog: [
  '2025-10-15: Initial version',
  '2025-10-15: Added extended fields for governance',
  '2025-10-22: Added agent/testing standards and references'
]
tags: ['standards', 'shell', 'wordpress', 'coding', 'automation', 'testing', 'naming']
feedback: 'Submit suggestions or issues via repository discussions or PR comments.'
deprecated: false
related: [
  'custom-instructions.md',
  'AGENTS.md',
  'prompts.md',
  'chatmodes.md',
  'automation-testing.instructions.md',
  'tests.instructions.md',
  'naming-conventions.instructions.md'
]
updated: '2025-10-22'
created: '2025-10-15'
---

# Coding Standards Instructions

You are a shell script, JavaScript, or WordPress developer.  
Follow our org-wide coding standards, documentation patterns, and testing conventions to create and maintain automation, scripts, and application code.  
**All code must be clear, secure, maintainable, and tested.**

## Overview

This document establishes comprehensive coding standards for the LightSpeedWP automation ecosystem, covering all programming languages, frameworks, and toolchains used for development and operations at LightSpeedWP.

---

## Purpose and Scope

- Covers shell script, JavaScript/Node.js, WordPress, and automation agent coding standards.
- Defines error handling, documentation, linting, naming, and test conventions.
- Intended for all contributors, maintainers, and reviewers.

---

## Core Principles

- Clarity, maintainability, and security
- Actionable, testable code (see [tests.instructions.md](./tests.instructions.md))
- Consistent structure, naming, and documentation (see [naming-conventions.instructions.md](./naming-conventions.instructions.md))
- Integration with org-wide standards and agent-driven automation

---

## Required Sections

- Role definition and context
- Framework and standards to follow
- Task types and scenarios
- Anti-patterns and explicit exclusions
- Examples and references

---

## Formatting & Documentation Guidelines

- Use markdown headings and bullet lists in docs
- Include code blocks for templates and examples
- Reference related files using relative links
- **All source files require comprehensive header comments**
- **Public functions and complex private functions must be documented**
- **Every directory with scripts/code must have a README.md**
- **All automation/testing code must have matching tests in `.github/agents/tests/`**

---

## Integration References

- See `.github/custom-instructions.md`, [naming-conventions.instructions.md](./naming-conventions.instructions.md), related agent, prompt, and chatmode files
- See [automation-testing.instructions.md](./automation-testing.instructions.md) and [tests.instructions.md](./tests.instructions.md) for test structure and coverage requirements

---

## Review and Enforcement

- Use the checklist in `create-or-update-copilot.instructions.md` to validate clarity, completeness, and compliance
- **All PRs must have passing lint and test checks per [tests.instructions.md](./tests.instructions.md)**
- Reviewers should verify adherence to coding, naming, and test standards before approving

---

## Testing Standards (Automation Agents & Includes)

- **All agent and utility tests must be in `.github/agents/tests/`**
- **Test file naming:** `{module}.test.js` (e.g. `readmeUtils.test.js`)
- **Use Jest for JavaScript/Node.js agent testing**
- **Mock all file/network/system side effects**
- **Coverage:** 85% branch coverage minimum for agents/utilities
- **See [automation-testing.instructions.md](./automation-testing.instructions.md) and [tests.instructions.md](./tests.instructions.md) for details**

---

## Naming Conventions

- Reference [naming-conventions.instructions.md](./naming-conventions.instructions.md) for rules on file, folder, function, class, variable, and config naming

---

## Language-Specific Standards

### Shell Script, WordPress, JavaScript/Node.js, and Python standards  
*(see previous detailed sections for each language — link to details as needed)*

---

## Continuous Improvement

- **Quarterly Review:** Review and update standards based on team feedback
- **Tool Updates:** Keep linting tools and configurations current
- **Best Practice Sharing:** Regular team discussions on code quality
- **Training:** Ongoing education on new languages and frameworks
- **Metrics:** Track code quality metrics and improvement trends

---

This comprehensive approach to coding standards ensures that LightSpeedWP automation code remains secure, maintainable, and consistent across all projects and team members.

---

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)