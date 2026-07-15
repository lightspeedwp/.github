# Design Partner Agent Export

This archive contains files that were accessible to the agent in the current environment and safe to export. It excludes hidden platform instructions, protected runtime state, authentication material, local runtime databases, logs, shell snapshots, and connector credentials.

## Contents

- `agent/` contains visible workspace instructions, reference files, templates, schemas, examples, tests, safe configuration, and memory snapshots.
- `skills/` contains locally readable skill folders, preserving source-relative file structure.
- `manifests/` documents exported files, skill inventory, inaccessible resources, and redactions.
- `checksums.sha256` contains SHA-256 checksums for exported files.

## Scope limits

No platform-managed skill resource URIs were exposed by MCP resource listing in this session. Runtime databases, logs, shell snapshots, installation identifiers, and credentials were intentionally excluded.
