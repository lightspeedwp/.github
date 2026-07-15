# active-projects.yaml schema

Use this schema for current project state that should persist across future runs while the engagement is active.

## Purpose

Store the latest working state so the agent can resume estimating or handoff work without rebuilding context from scratch.

## Root shape

```yaml
active_projects:
  - project_key: string
    current_workstream: string
    current_status: string
    latest_recommended_base_package: string
    latest_next_step: string
    blockers:
      - string
    last_meaningful_update: YYYY-MM-DD
    owner_team: string
    confidence: confirmed | provisional
```

## Required fields

- `project_key`
- `current_workstream`
- `current_status`
- `last_meaningful_update`
- `confidence`

## Field guidance

- `current_workstream`: short label for the active phase of work.
- `current_status`: clear current-state label, such as `awaiting_source_review` or `estimate_in_progress`.
- `latest_recommended_base_package`: include only when relevant.
- `latest_next_step`: the next best action based on current evidence.
- `blockers`: only active blockers that still matter.

## Do store

- current workstream
- latest status
- next step
- blockers that still affect progress

## Do not store

- long historical logs
- resolved blockers
- speculative package choices presented as confirmed
