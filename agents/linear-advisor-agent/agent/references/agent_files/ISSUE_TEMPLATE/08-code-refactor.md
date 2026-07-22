---
name: "♻️ Code Refactor"
about: "Request or propose a code refactoring or review to improve code quality, maintainability, and consistency."
title: "[Refactor] <Short summary>"
labels: [status:needs-review, priority:normal, area:core]
---

<!--
Thank you for proposing a code refactoring or review task!
Please fill in as much of the template below as you can.
-->

## Is your code refactoring request related to a problem?

<!--
Describe the current pain points or risks (e.g., technical debt, code smells, inconsistent patterns, lack of clarity or documentation).
What symptoms or developer friction are you experiencing?
-->

## Describe the Refactoring / Review Task

<!--
Provide a clear outline of the refactoring or code review objectives.
Be specific about:
- Scope of the refactor (e.g., files, modules, components, line numbers)
- Goals (e.g., improve readability, modularize logic, remove dead code)
- Guidance for using automated tools such as linters, Copilot, or code-review bots
- Areas to focus on (naming, structure, code style, documentation)
- Modularization, component separation, and performance considerations
-->

## Use Case

<!--
Who will benefit from the refactor?
How will it improve ongoing development, maintenance, or onboarding?
What workflow(s) or processes are affected?
-->

## Alternatives Considered

<!--
Describe any alternative approaches or tools you have considered (e.g., rewriting, ignoring, different refactor strategy, external tools).
Explain why you chose this approach.
-->

## Additional Context

<!--
Include links, references, or rationale for the refactoring.
Mention any best practices, standards, or tools to use (e.g., Copilot, linters, review bots).
Add any other context, screenshots, diagrams, or related issues/PRs here.
Use correct branch prefix (refactor/) for any related PR.
-->

## Example Code Snippets

<!--
Paste code snippets that show the current state ("Before") and the desired state ("After").
If helpful, add comments explaining the changes.
-->

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

<!--
Mark each item as completed when done.
-->

- [ ] Code is modular, readable, and follows naming conventions
- [ ] Dead code, duplication, and code smells are addressed
- [ ] Comments and documentation are clear and up-to-date (phpdoc, jsdoc, etc.)
- [ ] No regressions or breaking changes introduced
- [ ] Automated tools (linters, Copilot, review bots) have been run and feedback addressed
- [ ] Performance is not negatively impacted
- [ ] Code is peer-reviewed and follows project standards
- [ ] Tests are added or updated as needed
- [ ] Changelog.md is updated if applicable

## Code Area(s) Impacted

<!--
Tick all that apply and/or describe in detail.
-->

- [ ] Frontend
- [ ] Backend
- [ ] REST API
- [ ] Admin interface
- [ ] Integrations
- [ ] Other: <!-- Please specify -->

---

## Definition of Ready (DoR)

<!--
Checklist items to ensure the issue is ready for work.
-->

- [ ] Refactoring goals and scope defined
- [ ] Code area(s) and impact listed
- [ ] Estimate added
- [ ] Dependencies mapped

## Definition of Done (DoD)

<!--
Checklist items to ensure the refactoring/review is complete.
-->

- [ ] Code meets org coding standards
- [ ] Documentation updated (if needed)
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Tests added/updated
- [ ] PR uses correct branch prefix

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
