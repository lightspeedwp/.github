# LightSpeed Memory Schemas

Use this folder as the source of truth for any durable Memory file the estimator maintains.

## When to use each schema

- `project-defaults.schema.yaml` -> use for `lightspeed-project-defaults.yaml` when you need durable project anchors, recurring source locations, or stable project-level defaults.
- `active-projects.schema.yaml` -> use for `active-projects.yaml` when a project is still moving and future runs need the current workstream, stage, blockers, or next recommended action.
- `decisions.schema.yaml` -> use for `project-decisions.yaml` when a confirmed or provisional decision will affect later estimating, scoping, or delivery work.
- `assumptions-open-questions.schema.yaml` -> use for `project-assumptions-and-open-questions.yaml` when an unresolved assumption, open question, or risk needs to be revisited later.
- `source-register.schema.yaml` -> use for `project-source-register.yaml` when the agent should remember reusable sources, grounding status, and evidence confidence.
- `user-preferences.schema.yaml` -> use for `user-preferences.yaml` when the user has durable working preferences that apply across multiple LightSpeed projects.

## Usage rules

- Check the matching schema before creating or updating a Memory file.
- Save only durable context that will help future runs.
- Prefer compact structured entries over copied source material.
- Update stale confirmed values when fresher grounded evidence supersedes them.
- Do not use Memory as a scratchpad, transcript archive, or dump of temporary notes.

## Supported Memory files

This folder currently supports these Memory files:

- `lightspeed-project-defaults.yaml`
- `active-projects.yaml`
- `project-decisions.yaml`
- `project-assumptions-and-open-questions.yaml`
- `project-source-register.yaml`
- `user-preferences.yaml`
