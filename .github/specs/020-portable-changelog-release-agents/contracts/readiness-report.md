# Contract: Release Readiness Report

**Producer**: release agent (readiness operation) | **Consumers**: maintainer, changelog agent (via handoff)

The readiness operation is read-only. Producing this report must not write files, stage, stash, tag, push or contact a remote.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| `repoRoot` | Yes | Explicit path. Applied to every filesystem and git operation. |
| `mode` | No | Defaults to `readiness`. Any other mode is a separate, approved operation. |

## Output fields

| Field | Description |
|-------|-------------|
| `status` | `ready` or `not-ready`. |
| `repoRoot` | Echo of the root actually used. |
| `componentType` | `plugin`, `theme`, `enhancement` or `unknown`. |
| `versionSources[]` | Each source: kind, repository-relative path, value, authoritative flag. |
| `findings[]` | Each finding: `code`, `severity` (`blocker` or `note`), `message`, affected paths. |
| `writes` | Always `0` for readiness. Non-zero is a defect. |

## Required blocker codes

| Code | Raised when |
|------|-------------|
| `dirty-tree` | Uncommitted changes exist. |
| `version-drift` | Detected versions differ. Findings name each source and file. |
| `version-ambiguous` | Authoritative field cannot be determined from the target's instructions. |
| `unsafe-path` | A path escapes `repoRoot` or is absolute where relative is required. |
| `missing-check` | A required check named in the target's own instructions or CI configuration could not run, or none are named so nothing can be verified. It is never skipped silently. |
| `tag-conflict` | Local and remote tag evidence disagree, or the target tag exists. |
| `component-unknown` | No plugin, theme or enhancement could be identified. |
| `changelog-unverified` | Handoff verification is missing, failed or not received. |

`status` is `ready` only when no `blocker` finding exists.
