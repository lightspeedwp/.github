---
file_type: instructions
title: Specification-Driven Development Workflow
description: Guidelines for defining specifications before implementation, using specs to drive design decisions, and maintaining living specs as requirements evolve.
scope: organization-wide
applyTo: '**'
version: v1.1
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
tags:
  - workflow
  - specification
  - design
  - governance
status: active
---

# Specification-Driven Development Workflow

You are a LightSpeedWP specification steward. Follow our spec-driven workflow to define clear, testable specifications before writing code. Use specifications to align stakeholders, drive design decisions, and reduce ambiguity. Maintain specs as living documents that evolve with requirements.

## Overview

Defines a specification-driven development workflow where requirements are captured in clear, structured specifications before implementation begins. Ensures that designs, implementations, and tests are all anchored to a shared specification. Applies to all features, API changes, and significant refactors.

**What this covers:**

- Specification document structure and format
- When specifications are required
- Using specs to drive design and implementation decisions
- Maintaining specs through feature evolution
- Using specs in code review and testing

**What this does not cover:**

- Code implementation practices (see language-specific standards)
- Test writing standards (see quality-assurance.instructions.md)

## General Rules

- **Specs precede code:** Write or update specifications before implementation begins; specs guide design, not vice versa
- **Specifications are contracts:** A spec defines what "done" means; implementation must satisfy the spec; tests verify spec compliance
- **Shared vocabulary:** Specs use consistent terminology understood by all stakeholders (developers, product, design)
- **Specs are living documents:** Update specs when requirements change; don't rewrite code to match outdated specs
- **Specs drive decisions:** When faced with multiple design options, the spec clarifies which path is correct
- **Testable specs:** Every spec requirement must be verifiable through automated tests or manual acceptance criteria

## Detailed Guidance

### Specification Document Structure

Every significant feature or change should have a specification following this structure:

```markdown
# Feature Name Specification

## 1. Overview
Brief summary of what this feature is, why it's needed, and the problem it solves.

## 2. Requirements
- Functional requirements: What the system must do
- Non-functional requirements: Performance, scalability, security, accessibility
- Out-of-scope: Explicitly list what's NOT included

## 3. Design
- API/interface design (endpoints, function signatures, parameters)
- Data models and schemas
- Architecture decisions and trade-offs
- Backwards compatibility considerations

## 4. User Stories / Acceptance Criteria
Concrete scenarios and verification steps:
- Given [context] When [action] Then [outcome]
- Including edge cases and error handling

## 5. Implementation Notes
- Key dependencies or blockers
- Platform-specific considerations
- Performance implications

## 6. Testing Strategy
- Unit test coverage areas
- Integration test scenarios
- Manual acceptance test cases
```

### When Specifications Are Required

Require a specification for:

- **New features or APIs:** Any public interface or significant user-facing change
- **Database schema changes:** Document the migration strategy, impact on existing data
- **Breaking changes:** Explicitly document what's changing and migration path (migration maps and notes must be documented in the central `/docs/MIGRATION.md` file)
- **Performance optimisations:** Specify the performance targets, current vs target metrics
- **Security changes:** Document threats, mitigations, and validation approach

Do NOT require specifications for:

- Bug fixes (document in issue/PR instead)
- Trivial refactors (no behaviour change)
- Documentation updates
- Dependency upgrades with no API changes

### Using Specs to Drive Implementation

1. **Design review against spec:** Before coding, review spec with team; clarify ambiguities
2. **Create test cases from spec:** Write tests that verify each spec requirement
3. **Implement to spec:** Code to satisfy spec requirements; don't add features outside spec
4. **Link tests to spec requirements:** Each test references which spec requirement it validates
5. **Code review against spec:** Review asks "Does this satisfy the spec?" not "Is this the code I would write?"

### Spec-Driven Design Decisions

When faced with implementation decisions:

1. **Check the spec first:** What does the spec require or constrain?
2. **Document trade-offs:** If the spec allows multiple approaches, document why you chose this one
3. **Update the spec if needed:** If implementation reveals missing requirements, update the spec
4. **Design review, not code review:** Catch design issues early by reviewing against spec before coding

### Maintaining Living Specs

As requirements evolve:

- **Update specs first:** When requirements change, update the spec before changing code
- **Version specs:** Use version numbers or dates to track spec evolution
- **Document changes:** Note what changed and why (use markdown comments or changelog sections)
- **Communicate changes:** When specs change, notify teams relying on the spec
- **Don't let specs rot:** Outdated specs are worse than no spec; either maintain them or deprecate them

## Examples

**Good:** Spec-driven feature development:

1. Product writes feature spec: "Users can export reports as PDF with custom header/footer"
2. Team reviews spec, clarifies requirements (page size, fonts, permissions)
3. Tests written against spec: test export creates valid PDF, test custom fields render correctly
4. Implementation satisfies spec: code only implements what spec requires
5. Code review verifies spec compliance: "Does this satisfy all spec requirements?"
6. When PDF library upgrade changes footer handling, spec is updated, tests updated, implementation adjusted

**Bad:** Code-first approach that bypasses specs:

1. Developer starts coding PDF export without spec
2. Implements what seems reasonable (A4 size, no custom fields)
3. Code review catches missing requirements (custom headers, A3 support)
4. Code rewritten multiple times as requirements emerge
5. No clear definition of "done"; constant scope creep

## Validation

- ✅ Specifications exist for all significant features before implementation begins
- ✅ Specs include clear requirements, design decisions, and acceptance criteria
- ✅ All implementation code traces back to spec requirements
- ✅ Tests verify spec compliance; test names reference spec sections
- ✅ Specs are updated when requirements change; code follows spec updates
- ✅ Code review gates check spec compliance, not just code quality

## References

- [Coding Standards](./coding-standards.instructions.md)
- [Quality Assurance](./quality-assurance.instructions.md)
- [Task Implementation](./task-implementation.instructions.md)
- [Issues Standards](./issues.instructions.md)

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
