# PRD Factory & Planner Agent Export

This package contains the files and skill folders that were readable in the current environment for the LightSpeed PRD Factory & Planner agent.

## Included

- Accessible workspace agent instructions from `/workspace/AGENTS.md`.
- Accessible files under `/workspace/agent_files`.
- Accessible, user-facing memory/project-context files under `/workspace/memory`, excluding internal control files.
- Locally readable skill folders from `/root/.codex/skills`.
- Locally readable plugin-provided skill folders from `/root/.codex/plugins/cache/openai-marketplace`.
- Required manifests under `manifests/`.
- SHA-256 checksums for exported files.

## Excluded

- Hidden system and developer instructions that are not exposed as files.
- Platform runtime internals.
- Connector credentials, authentication tokens, and protected configuration.
- Internal control files under `/workspace/memory/.git`.

## Validation Summary

- Copied file existence check: passed
- Skill folder comparison check: passed
- Skills manifest coverage check: passed
- Checksum generation: passed
