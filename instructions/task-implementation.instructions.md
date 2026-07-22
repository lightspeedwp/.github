---
file_type: instructions
title: Task Implementation Standards
description: Standards for breaking down tasks, implementing changes, committing work, and delivering complete, tested implementations.
scope: organization-wide
applyTo: '**'
version: v1.0
last_updated: '2026-05-29'
owners:
- LightSpeedWP Team
tags:
- workflow
- implementation
- standards
- governance
status: active
---

# Task Implementation Standards

You are a LightSpeedWP implementation steward. Follow our task implementation standards to break down work into focused, testable units, implement changes that satisfy requirements, and commit work with clear, auditable messages. Deliver complete implementations that are production-ready.

## Overview

Defines standards for implementing tasks from conception through delivery. Covers task decomposition, implementation focus, testing requirements, commit practices, and delivery readiness. Ensures all work is measurable, traceable, and production-ready.

**What this covers:**

- Task breakdown and acceptance criteria
- Implementation scope and focus
- Testing and quality gates
- Commit message standards
- Delivery and code review processes

**What this does not cover:**

- Code style or language-specific patterns (see coding standards)
- Specification creation (see specification-driven-workflow.instructions.md)

## General Rules

- **One task, one focus:** Each task should have a single, clear objective; avoid scope creep
- **Acceptance criteria first:** Define what "done" means before starting implementation
- **Implement minimally:** Do only what the task requires; avoid unnecessary refactors, features, or abstractions
- **Test as you go:** Implement and test the same concern together; don't batch testing
- **Commit incrementally:** Break work into logical commits that each pass tests independently
- **No half-finished work:** All commits must be production-ready; no "TODO: finish this" commits
- **Clear traceability:** Every commit links back to the task/issue that motivated it

## Detailed Guidance

### Task Decomposition

Break work into tasks that meet these criteria:

- **Single responsibility:** One task = one concern (fix one bug, add one API endpoint, refactor one module)
- **Testable:** Clear acceptance criteria that can be verified automatically or through manual steps
- **Estimable:** Should be completable in a single development session (a few hours to a day)
- **Independent:** Should not block other work or depend on multiple other tasks to be usable
- **Valuable:** Should deliver user value or enable follow-up work; avoid intermediate infrastructure tasks

### Acceptance Criteria

Define acceptance criteria that are:

- **Specific:** What exactly must work? Not "improve performance" but "load time < 2s on 3G"
- **Testable:** Must be verifiable through tests or manual steps
- **Measurable:** Must have objective pass/fail criteria, not subjective judgments
- **Complete:** Cover both happy path and edge cases

Example acceptance criteria for a login feature:

- Valid email + correct password → user logged in, redirected to dashboard
- Valid email + incorrect password → "Invalid password" message, user not logged in
- Unregistered email → "Account not found" message
- Locked account → "Account temporarily locked" message with unlock time
- Session persists across page refresh for 24 hours
- Session cleared on logout
- Password reset email sent within 1 minute

### Implementation Scope

Implement only what the task requires:

- **Don't add features:** If the task is "add email validation", don't add password strength checking
- **Don't refactor beyond the task:** Only refactor code you're changing for the task
- **Don't introduce abstractions:** Write concrete code; wait for 3 similar cases before abstracting
- **Don't add error handling for impossible cases:** Only validate at system boundaries (user input, external APIs)
- **Don't add configuration:** Only add settings if the task explicitly requires configurability

### Testing Requirements

All implementations must be tested:

- **Unit tests:** Test individual functions/methods in isolation; aim for high coverage of business logic
- **Integration tests:** Test how components interact; verify APIs work end-to-end
- **Manual testing:** For UI, test in actual browser; verify accessibility and responsiveness
- **Edge cases:** Test boundary conditions, error states, empty inputs, large inputs
- **Performance:** If task includes performance requirements, verify with measurements

### Commit Standards

Each commit should:

- **Be atomic:** Each commit is a complete, working unit that passes tests independently
- **Have a clear message:** First line summarises the change; body explains WHY if non-obvious
- **Reference the task:** Include issue number or task ID in the commit message
- **Include session link:** Add session ID line for traceability: `https://claude.ai/code/session_[ID]`
- **Pass all checks:** Linting, testing, security scanning all pass before committing

Commit message format:

```
Brief summary of change (imperative mood)

Longer explanation if needed, explaining why this change
was made and any non-obvious decisions.

Fixes #123
https://claude.ai/code/session_[SESSION_ID]
```

### Code Review Against Acceptance Criteria

Code review should verify:

- **Acceptance criteria met:** Does the implementation satisfy all acceptance criteria?
- **No scope creep:** Does the code do more than the task required? If so, remove it
- **Tests adequate:** Do tests verify all acceptance criteria?
- **Quality standards:** Does code follow project standards (style, naming, structure)?
- **No breaking changes:** Does this change break existing functionality?

## Examples

**Good:** Focused task implementation:

Task: "Allow users to upload profile pictures up to 5MB"

Implementation:

1. Add file input to profile form
2. Validate file size (max 5MB) on client
3. Validate file type (JPG, PNG only) on client
4. Upload to S3 with server validation
5. Store S3 URL in user profile
6. Tests: file too large rejected, invalid type rejected, valid upload succeeds, image displays on profile

Commits:

- "Add profile picture upload UI"
- "Add client-side file validation"
- "Add server-side file upload and storage"
- "Display uploaded profile picture on profile page"

**Bad:** Scope creep during task:

Task: "Allow users to upload profile pictures"

Implementation:

- Added profile picture upload (required)
- Added image cropping tool (not required)
- Refactored entire profile form (not required)
- Added profile picture gallery showing all previous uploads (not required)
- Changed profile form styling (not required)

Result: Task becomes three-week project; original feature delivery delayed

## Validation

- ✅ Task has clear, testable acceptance criteria before implementation begins
- ✅ Implementation satisfies all acceptance criteria and nothing more
- ✅ All automated tests pass; manual testing completed
- ✅ Commits are atomic and each passes tests independently
- ✅ Commit messages are clear and reference the task/issue
- ✅ Code review verifies acceptance criteria compliance
- ✅ No half-finished work or TODO comments in production code

## References

- [Specification-Driven Workflow](./spec-driven-workflow.instructions.md)
- [Coding Standards](./coding-standards.instructions.md)
- [Quality Assurance](./quality-assurance.instructions.md)
- [Pull Request Standards](./pull-requests.instructions.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
