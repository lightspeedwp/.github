# Zendesk Support Agent Export

Generated: 2026-07-14T11:45:10.993110+00:00

This portable export contains files that were readable from the current agent workspace and local skill directories. It intentionally excludes hidden platform prompts, protected runtime configuration, credentials, connector authentication, and inaccessible platform internals.

## Contents

- `agent/`: visible workspace instructions and Builder-attached agent files from `/workspace/AGENTS.md` and `/workspace/agent_files/`.
- `skills/agent-attached/`: readable LightSpeed Zendesk skill folders.
- `skills/local/`: readable system, built-in, frontend, and plugin-provided skill folders exposed on disk.
- `manifests/`: file inventory, skill inventory, inaccessible/protected-resource notes, and redaction log.
- `checksums.sha256`: SHA-256 checksums for exported files.

## Limits

This export is complete only for files successfully read and copied from the accessible filesystem. Platform-managed connector implementations, hidden system/developer messages, credentials, and protected runtime configuration were not exported.
