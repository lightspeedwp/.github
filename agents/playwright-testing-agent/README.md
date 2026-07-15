# Playwright Testing Agent Export

This portable export contains the readable files, safe configuration metadata, and installed-skill inventory visible to the Playwright Testing Agent in this environment.

## Contents

- `agent/`: exported workspace instructions, builder-attached agent files, and safe configuration/plugin metadata.
- `skills/`: readable local, agent-attached, platform-managed, and plugin-provided skill folders, preserving relative file structure.
- `manifests/`: file and skill inventories, inaccessible-resource notes, and redaction log.
- `checksums.sha256`: SHA-256 checksums for exported files.

## Boundaries

Protected runtime instructions, hidden platform internals, authentication credentials, connector secrets, and memory repository internals are not included. The export includes only files that were visible and readable through the current filesystem or explicit registry calls.

## Summary

- Agent/configuration files exported: 95
- Skills discovered: 21
- Skill folders fully exported: 21
- Partially exported skills: 0
- Metadata-only external skills: 0
- Redactions made: 1

See `manifests/skills.md` and `manifests/skills.csv` for the complete skill inventory.
