## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1738](../../../../issues/1738) | epic | Agent-Tool Permission Contract — Master epic | 🟢 Open |
| [#1739](../../../../issues/1739) | task | Phase 1: Audit existing agent specs | 🟢 Open |
| [#1740](../../../../issues/1740) | task | Phase 2: Design contract & tiers | ⏳ Planned |
| [#1741](../../../../issues/1741) | task | Phase 3: Implement validation & CI | ⏳ Planned |
| [#1742](../../../../issues/1742) | task | Phase 4: Review & approve all specs | ⏳ Planned |

## Why

Agent specifications in this repository are inconsistent in tool declarations and permissions, which causes unpredictable execution behaviour and weakens MCP security posture. We need a single enforceable contract based on the release agent model so all agents can execute safely and consistently.

## What Changes

- Define a canonical tool and permission contract for agent frontmatter, using `agents/release.agent.md` as the baseline profile.
- Introduce profile tiers for specialised agents (for example reviewer-only, planning-only) while preserving required MCP and GitHub scopes for each tier.
- Add automated validation that checks every `**/*.agent.md` file for required keys, allowed values, and profile compliance.
- Add remediation guidance and migration rules for legacy mode and plugin agent files with zero or partial declarations.
- Add CI enforcement so non-compliant agent specs fail validation before merge.

## Capabilities

### New Capabilities

- `agent-tool-permission-contract`: Define and enforce a repo-wide contract for agent `tools` and `permissions`, including baseline profile, tiered variants, and automated validation rules.

### Modified Capabilities

- None.

## Impact

- Affected files: `agents/*.agent.md`, `plugins/**/agents/*.agent.md`, validation scripts under `.github/scripts` or `scripts`, and workflow validation jobs.
- Affected systems: MCP tool access governance, GitHub workflow gates, and repository contribution rules.
- Dependencies: existing lint/validation workflows and report generation conventions.
