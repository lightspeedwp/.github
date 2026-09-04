---
file_type: "prompt"
title: "Agent Setup Prompt Template"
description: "Initial agent context, instructions, and operational guidelines"
version: "1.0.0"
last_updated: "2026-05-31"
owners: ["ashley@lightspeedwp.agency"]
tags: ["agents", "setup", "prompts"]
status: "active"
stability: "stable"
domain: "tooling"
---

# Agent Setup Prompt Template

Use this prompt to configure a new agent or AI system with necessary context, constraints, and operational guidelines.

## Context

**Project:** [Project Name]
**Repository:** [Repository URL]
**Domain:** [Primary domain/area: e.g., automation, documentation, code review]
**Scope:** [What systems/processes does this agent manage?]

### Background

[Provide 2-3 sentences describing the problem this agent solves and why it matters.]

### Key Stakeholders

- [Role/Team]: [Responsibilities in this workflow]
- [Role/Team]: [Responsibilities in this workflow]

### Reference Materials

- [Link to relevant documentation]
- [Link to codebase or configuration files]
- [Link to example workflows or processes]

---

## Task

**Primary Objective:**
[Clear statement of what the agent should do]

**Secondary Objectives:**

1. [Sub-objective or supporting task]
2. [Sub-objective or supporting task]
3. [Sub-objective or supporting task]

---

## Constraints & Standards

### Operational Constraints

- [Must/must not do something specific]
- [Performance or resource limits]
- [Availability or timing requirements]

### Code & Quality Standards

- Follow [Coding Standards Reference]
- Use [Language/Framework standards]
- Maintain [Test coverage or documentation requirements]

### Communication Standards

- Use [UK English / project language]
- Follow [naming conventions: camelCase, snake_case, etc.]
- Document via [format: JSDoc, comments, etc.]

### Security & Compliance

- [Validate all input from external sources]
- [Never commit secrets or credentials]
- [Follow [security policy or checklist]]

---

## Acceptance Criteria

The agent is ready for deployment when:

- [ ] Core functionality implemented and tested
- [ ] All required documentation created
- [ ] Passes linting and test suite (minimum [X]% coverage)
- [ ] Approved by [designated reviewer(s)]
- [ ] Deployed to [staging/production environment]

---

## References

- **Configuration Files:** [Path to config files the agent uses]
- **Related Agents:** [Links to complementary agents or systems]
- **Workflow Definition:** [Link to .github/workflows/ file if applicable]
- **Instructions:** [Link to portable instructions file]
- **Specification:** [Link to agent spec document if exists]

---

## Additional Notes

[Any project-specific context, exceptions, or important information for this agent]
