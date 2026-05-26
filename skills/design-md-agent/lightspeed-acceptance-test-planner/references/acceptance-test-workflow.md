# Acceptance Test Workflow

1. Confirm project type and test scope.
2. Extract requirements from PRD, technical brief, issues and launch gates.
3. Assign each requirement a requirement ID.
4. Create at least one acceptance test per requirement.
5. Map each GitHub issue to test cases.
6. Add test preconditions and expected results.
7. Flag unclear or untestable requirements.
8. Group tests by workstream and priority.
9. Create a go/no-go summary.

## Rules

- Every critical requirement must have a test.
- Every launch blocker must have an owner and resolution path.
- Every test should be observable by a human or measurable by a tool.
- Do not treat vague wording as testable. Rewrite into testable checks or flag it.
