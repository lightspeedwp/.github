# Tests

Use this folder for validation documentation support, scenario-based checks, and test assets that help maintain the WordPress agent over time.

## Folder purpose

This folder holds the maintainer-facing validation documentation and scenario-based coverage for the current WordPress agent structure.

Use it for:
- validator usage guidance
- scenario-based maintenance checks
- regression coverage for templates, examples, memory, and reporting flows
- starter-prompt expectation snapshots

## Current file inventory

- `README.md` — local guidance for test and validation assets
- `validation-workflow.md` — validator-by-validator documentation, coverage, common failures, and recommended run order
- `scenario-file-first-research.md` — file-first research and source-priority test scenario
- `scenario-decision-tracing.md` — decision-tracing and evidence-separation test scenario
- `scenario-digest-generation.md` — maintenance digest and summary test scenario
- `scenario-memory-updates.md` — memory-role and continuity test scenario
- `scenario-follow-up-open-loops.md` — incomplete-pass and next-step test scenario
- `starter-prompt-consistency-source.md` — starter-prompt validation source snapshot

## Naming conventions

Recommended patterns:
- `<workflow>-test.md`
- `<validator>-test.md`
- `scenario-<topic>.md`
- `<scenario>-fixture.json`
- `<scenario>-checklist.md`

## Maintenance notes

- Keep tests practical and tied to realistic WordPress agent workflows.
- Separate validation docs from reusable templates, references, and fixtures.
- When validators change, update `validation-workflow.md` and any affected scenario files.
- Keep scenario files focused on expected behaviour, pass criteria, and common failure modes.
