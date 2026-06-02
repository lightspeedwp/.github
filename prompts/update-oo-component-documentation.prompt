---
file_type: "prompt"
title: "Update Oo Component Documentation"
description: "Refactored organisation-wide prompt migrated from .github/prompts/update-oo-component-documentation.prompt.md"
version: "1.0.0"
last_updated: "2026-06-01"
owners: ["LightSpeed Team"]
tags: ["prompts", "migration", "organisation-wide"]
status: "active"
stability: "stable"
domain: "generic"
migration_source: ".github/prompts/update-oo-component-documentation.prompt.md"
---

# Update Oo Component Documentation

## Context

Define the repository context, objective, and constraints relevant to this task.

## Task

Describe exactly what needs to be produced and where outputs should be stored.

## Constraints

- Use UK English.
- Keep outputs practical, reproducible, and maintainable.
- Prefer minimal, modular solutions.
- Include validation steps for quality, performance, and accessibility where applicable.

## Acceptance Criteria

- Deliverable is complete and aligned to LightSpeed standards.
- Any generated code/documentation includes clear rationale.
- Validation checks are listed and, where possible, executed.

## References

- Source prompt: `.github/prompts` migration origin
## Legacy Source (For Transition)

```markdown
---
mode: "agent"
description: "Update existing object-oriented component documentation following industry best practices and architectural documentation standards."
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "extensions",
    "fetch",
    "githubRepo",
    "openSimpleBrowser",
    "problems",
    "runTasks",
    "search",
    "search/searchResults",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
    "testFailure",
    "usages",
    "vscodeAPI",
  ]
---

# Update Standard OO Component Documentation

Update the existing documentation file at: `${file}` by analyzing the corresponding component code.

Extract the component path from the existing documentation's front matter (`component_path` field) or infer it from the documentation content. Analyze the current component implementation and update the documentation accordingly.

**Documentation Standards:**

- DOC-001: Follow C4 Model documentation levels (Context, Containers, Components, Code)
- DOC-002: Align with Arc42 software architecture documentation template
- DOC-003: Comply with IEEE 1016 Software Design Description standard
- DOC-004: Use Agile Documentation principles (just enough documentation that adds value)
- DOC-005: Target developers and maintainers as primary audience

**Analysis Instructions:**

- ANA-001: Read existing documentation to understand component context and structure
- ANA-002: Identify component path from front matter or content analysis
- ANA-003: Examine current source code files for class structures and inheritance
- ANA-004: Compare existing documentation with current implementation
- ANA-005: Identify design patterns and architectural changes
- ANA-006: Update public APIs, interfaces, and dependencies
- ANA-007: Recognize new/changed creational/structural/behavioral patterns
- ANA-008: Update method parameters, return values, exceptions
- ANA-009: Reassess performance, security, reliability, maintainability
- ANA-010: Update integration patterns and data flow

**Language-Specific Optimizations:**

- LNG-001: **C#/.NET** - async/await, dependency injection, configuration, disposal
- LNG-002: **Java** - Spring framework, annotations, exception handling, packaging
- LNG-003: **TypeScript/JavaScript** - modules, async patterns, types, npm
- LNG-004: **Python** - packages, virtual environments, type hints, testing

**Update Strategy:**

- UPD-001: Preserve existing documentation structure and format
- UPD-002: Update `last_updated` field to current date
- UPD-003: Maintain version history in front matter if present
- UPD-004: Add new sections if component has significantly expanded
- UPD-005: Mark deprecated features or breaking changes
- UPD-006: Update examples to reflect current API
- UPD-007: Refresh dependency lists and versions
- UPD-008: Update mermaid diagrams to reflect current architecture

**Error Handling:**

- ERR-001: Documentation file doesn't exist - provide guidance on file location
- ERR-002: Component path not found in documentation - request clarification
- ERR-003: Source code has moved - suggest updated paths
- ERR-004: Major architectural changes - highlight breaking changes
- ERR-005: Insufficient access to source - document limitations

**Output Format:**

Update the existing Markdown file maintaining its structure while refreshing content to match current implementation. Preserve formatting, heading hierarchy, and existing organizational decisions.

**Required Documentation Structure:**

Update the existing documentation following the same template structure, ensuring all sections reflect current implementation:

````md
---
title: [Component Name] - Technical Documentation
component_path: [Current component path]
version: [Updated version if applicable]
date_created: [Original creation date - preserve]
last_updated: [YYYY-MM-DD - update to current date]
owner: [Preserve existing or update if changed]
tags: [Update tags as needed based on current functionality]
---
```
