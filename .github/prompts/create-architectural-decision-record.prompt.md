---
mode: "agent"
description: "Create an Architectural Decision Record (ADR) document for AI-optimized decision documentation."
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

## Deprecation Notice

- Status: Deprecated in `.github/prompts/` and migrated to ``prompts/create-adr.prompt``.
- Action: Use ``prompts/create-adr.prompt`` as the canonical organisation-wide prompt path.
- Effective date: 2026-06-01.
- Migration reference: `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`.

# Create Architectural Decision Record

Create an ADR document for `${input:DecisionTitle}` using structured formatting optimized for AI consumption and human readability.

## Inputs

- **Context**: `${input:Context}`
- **Decision**: `${input:Decision}`
- **Alternatives**: `${input:Alternatives}`
- **Stakeholders**: `${input:Stakeholders}`

## Input Validation

If any of the required inputs are not provided or cannot be determined from the conversation history, ask the user to provide the missing information before proceeding with ADR generation.

## Requirements

- Use precise, unambiguous language
- Follow standardized ADR format with front matter
- Include both positive and negative consequences
- Document alternatives with rejection rationale
- Structure for machine parsing and human reference
- Use coded bullet points (3-4 letter codes + 3-digit numbers) for multi-item sections

The ADR must be saved in the `/docs/adr/` directory using the naming convention: `adr-NNNN-[title-slug].md`, where NNNN is the next sequential 4-digit number (e.g., `adr-0001-database-selection.md`).

## Required Documentation Structure

The documentation file must follow the template below, ensuring that all sections are filled out appropriately. The front matter for the markdown should be structured correctly as per the example following:

```md
---
title: "ADR-NNNN: [Decision Title]"
status: "draft"
date: "YYYY-MM-DD"
authors: "[Stakeholder Names/Roles]"
tags: ["architecture", "decision"]
supersedes: ""
superseded_by: ""
---
