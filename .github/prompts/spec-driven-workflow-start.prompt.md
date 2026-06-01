---
mode: "agent"
description: "Kick off Spec-Driven Workflow v1: collect inputs, choose a project slug, and scaffold requirements/design/tasks in the correct location."
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
  ]
---

# Spec-Driven Workflow Kickoff

Your goal is to start a new Spec-Driven Workflow project for `${input:ProjectName}` and scaffold the core artefacts in the correct location.

## Placement & Naming (must follow)

- Location: `.github/projects/active/{project-slug}/`
- Project slug: short, kebab-case, descriptive (e.g. `checkout-refactor`)
- Filenames: `requirements.md`, `design.md`, `tasks.md` (no dates in these filenames)
- Additional artefacts: add kebab-case names beside the core files (e.g. `decision-records.md`, `sequence-diagram.md`)

## Steps

1. Confirm the project purpose, scope, stakeholders, and constraints.
2. Propose a project slug; use it to create `.github/projects/active/{slug}/`.
3. Create empty (or prefilled skeleton) files: `requirements.md`, `design.md`, `tasks.md`.
4. Record open questions and assumptions in `requirements.md` under an “Open Questions” section.
5. Summarise next actions and any required inputs to proceed.

## Notes

- Use UK English and keep language explicit and unambiguous.
- Reference `.github/instructions/spec-driven-workflow.instructions.md` and `.github/instructions/file-organisation.instructions.md` for compliance.
