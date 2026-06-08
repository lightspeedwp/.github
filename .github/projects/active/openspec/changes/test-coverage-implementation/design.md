## Context

The project README already defines a 62-task coverage programme split into six phases:

1. Baseline measurement.
2. Metrics agent tests.
3. Linting agent tests.
4. Release agent enhancement.
5. Utility edge cases.
6. Validation and reporting.

The issue structure needs to preserve that whole scope while keeping the live GitHub work manageable and auditable.

## Goals / Non-Goals

**Goals:**

- Convert the entire task list into one parent epic plus six phase issues.
- Keep the issue templates aligned to the type of work in each phase.
- Make the issue register and run log the source of truth for live issue URLs and status.

**Non-Goals:**

- Splitting the programme into 62 top-level GitHub issues.
- Changing the underlying test strategy or release strategy before the coverage work is complete.
- Removing any phase from the task list.

## Decisions

1. Issue granularity

- Decision: use one parent epic plus six phase issues.
- Rationale: this preserves all 62 tasks while keeping the issue chain maintainable.

1. Issue-file workflow

- Decision: keep strict issue files under `openspec-strict/` and mirror them in the GitHub issue register.
- Rationale: it gives the repo a stable file-based source of truth before the live issues are created.

1. Closeout discipline

- Decision: keep the PR body and the issue bodies aligned until all checkboxes are complete.
- Rationale: avoids the stale checklist problem that triggered the current request.

## Risks / Trade-offs

- [Risk] A phase issue may understate the detail in the 62-task README. -> Mitigation: each phase issue body lists the tasks it covers.
- [Risk] The parent issue may become too generic. -> Mitigation: the parent issue links every phase and restates the release gate.
- [Risk] PR closeout may happen before issue bodies are updated. -> Mitigation: treat the run log and register as merge gates.

## Migration Plan

1. Finalise the strict issue files.
2. Create the GitHub issues from those files.
3. Link the phase issues back to the parent.
4. Update the run log and issue register with the live issue URLs.
5. Land the documentation and keep the issue/PR checklists in sync through merge.

Rollback:

- If the phase mapping proves too coarse, add child issues under the affected phase rather than reopening the whole programme.
