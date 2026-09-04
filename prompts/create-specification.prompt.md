---
file_type: "prompt"
title: "Create Specification"
description: "Refactored organisation-wide prompt migrated from .github/prompts/create-specification.prompt.md"
version: "1.0.0"
last_updated: "2026-06-01"
owners: ["LightSpeed Team"]
tags: ["prompts", "migration", "organisation-wide"]
status: "active"
stability: "stable"
domain: "generic"
migration_source: ".github/prompts/create-specification.prompt.md"
---

# Create Specification

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
description: "Create a new specification file for the solution, optimized for Generative AI consumption."
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

# Create Specification

Your goal is to create a new specification file for `${input:SpecPurpose}`.

The specification file must define the requirements, constraints, and interfaces for the solution components in a manner that is clear, unambiguous, and structured for effective use by Generative AIs. Follow established documentation standards and ensure the content is machine-readable and self-contained.

## Best Practices for AI-Ready Specifications

- Use precise, explicit, and unambiguous language.
- Clearly distinguish between requirements, constraints, and recommendations.
- Use structured formatting (headings, lists, tables) for easy parsing.
- Avoid idioms, metaphors, or context-dependent references.
- Define all acronyms and domain-specific terms.
- Include examples and edge cases where applicable.
- Ensure the document is self-contained and does not rely on external context.

The specification should be saved in the [/spec/](/spec/) directory and named according to the following convention: `spec-[a-z0-9-]+.md`, where the name should be descriptive of the specification's content and starting with the highlevel purpose, which is one of [schema, tool, data, infrastructure, process, architecture, or design].

The specification file must be formatted in well formed Markdown.

Specification files must follow the template below, ensuring that all sections are filled out appropriately. The front matter for the markdown should be structured correctly as per the example following:

````md
---
title: [Concise Title Describing the Specification's Focus]
version: [Optional: e.g., 1.0, Date]
date_created: [YYYY-MM-DD]
last_updated: [Optional: YYYY-MM-DD]
owner: [Optional: Team/Individual responsible for this spec]
tags: [Optional: List of relevant tags or categories, e.g., `infrastructure`, `process`, `design`, `app` etc]
---
```
