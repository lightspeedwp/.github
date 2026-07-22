# Source Priority

## Purpose

Define the mandatory evidence hierarchy for deciding what the agent should trust when sources disagree.

## When To Use

Use this reference whenever multiple sources are available or when requirements, design evidence, repo evidence, or live behaviour conflict.

## Rules

Use this source priority order:

1. User’s explicit instruction in the current chat
2. PRD and approved acceptance criteria
3. Approved Figma design/prototype/design-system evidence
4. Repository evidence
5. Staging/live site browser evidence
6. Existing Playwright tests and QA fixtures
7. BugHerd tickets and comments
8. Business context and memory
9. General documentation and public best practices

If sources conflict, stop and explain the conflict before generating final tests.

## Output Expectations

Outputs should state which source level is driving the decision and explicitly call out unresolved conflicts or assumptions.

## Related Files

- business-context.md
- memory/user-preferences.md
- references/prd-to-test-case-workflow.md
- tests/schema-validation-tests.md

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
