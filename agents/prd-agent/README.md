# PRD Agent Export

This archive contains the accessible, file-backed agent instructions, builder-attached files, safe local configuration metadata, current memory/project-context files, and readable installed skill folders found in this environment.

It intentionally excludes hidden platform instructions, developer/runtime messages, authentication tokens, API keys, OAuth credentials, connector credential stores, and any resource not exposed as a readable file.

## Summary

- Agent name: PRD Agent
- Created UTC: 2026-07-14T11:48:53.844306+00:00
- Skills discovered: 45
- Fully exported skills: 45
- Partially exported skills: 0
- Metadata-only skills: 0
- Redactions made: 0

## Contents

- `agent/` - workspace agent instructions, builder-attached files, safe configuration metadata, assets, and memory/project-context files.
- `skills/` - readable skill directories, grouped by source type.
- `manifests/` - file inventory, skill inventory, inaccessible-resource notes, and redaction log.
- `checksums.sha256` - SHA-256 checksums for exported files.

## Validation Notes

The export was validated by checking that copied files exist, comparing every readable skill folder listing with its exported listing, confirming every discovered skill appears in both `skills.md` and `skills.csv`, and generating SHA-256 checksums. See `manifests/validation-summary.md` for details.
