# Changelog

## 1.1.0 - 2026-07-03

### Changed

- Added quick improvement audit mode for lightweight skill review requests.
- Added explicit trigger and routing examples for common skill-evolution requests.
- Added reusable evaluation examples for trigger accuracy, approved application, routing, safety gates, and archive quality.
- Added evidence quality labels for confirmed, inferred, unverified, and blocked observations.
- Added approval-level distinctions for proposal, local package, connected edit, publication, and permission changes.

### Verified

- Confirmed `scripts/evolution_log.py` writes JSONL records correctly in a local smoke test.

### Safety and rollback

- Risk level: Low to Medium.
- Rollback: restore the previous `SKILL.md`, `references/evolution-protocol.md`, `references/output-templates.md`, and `references/safety-and-governance.md` from the archived baseline.
