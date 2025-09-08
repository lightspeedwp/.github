---
name: '🛠️ Code Refactoring / Review'
about: Request or propose a code refactoring or review task to improve code quality, maintainability, and consistency in this WordPress project
title: '[Refactor] '
labels: [refactor, code quality, needs review]
assignees: []
projects: []
milestone: ''
type: 'refactor'
---

## Code Area(s) Impacted

-   [ ] Frontend
-   [ ] Backend
-   [ ] REST API
-   [ ] Admin interface
-   [ ] Integrations
-   [ ] Other:

## Is your code refactoring request related to a problem?

Describe the current pain points or risks (e.g., technical debt, code smells, inconsistent patterns, lack of clarity or documentation):

## Describe the Refactoring / Review Task

Provide a clear outline of the refactoring or code review objectives. Consider including:

-   Scope of the refactor (e.g., files, modules, components)
-   Goals (e.g., improve readability, modularize logic, remove dead code)
-   Guidance for using automated tools such as linters, Copilot, or code-review bots
-   Areas to focus on (naming, structure, code style, documentation, etc.)
-   Modularization, component separation, and performance considerations

## Use Case

Who will benefit from the refactor? How will it improve ongoing development, maintenance, or onboarding?

## Alternatives Considered

Please describe alternative approaches or tools you have considered.

## Additional Context

Include links, references, or rationale for the refactoring. Mention any best practices, standards, or tools to use (e.g., Copilot, linters, review bots):

## Example Code Snippets

```php
// Before:
function process_booking($data) {
  // ... long function ...
}
// After:
function validate_booking($data) { ... }
function calculate_total($data) { ... }
function save_booking($data) { ... }
```

## Refactoring / Review Checklist

-   [ ] Code is modular, readable, and follows naming conventions
-   [ ] Dead code, duplication, and code smells are addressed
-   [ ] Comments and documentation are clear and up-to-date (phpdoc, jsdoc, etc.)
-   [ ] No regressions or breaking changes introduced
-   [ ] Automated tools (linters, Copilot, review bots) have been run and feedback addressed
-   [ ] Performance is not negatively impacted
-   [ ] Code is peer-reviewed and follows project standards
-   [ ] Tests are added or updated as needed
-   [ ] Changelog.md is updated if applicable
