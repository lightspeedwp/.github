# Shared-Agent Installation Note

Use this note when adding the Zendesk Backlog Trend Analysis skill to a shared workspace agent.

## Installation summary

- Skill installed in:
- Installed by:
- Installation date:
- Intended users:
- Primary Zendesk environment:

## Required capability check

Before team rollout, confirm that the active shared agent can use read-only Zendesk actions for:

- ticket counts
- ticket metadata search
- ticket detail reads
- conversation reads when required for key claims
- Help Centre search or article reads, if repeated-question analysis is expected
- SLA visibility, if SLA-risk reporting is expected
- CSAT visibility, if satisfaction reporting is expected

## Capability profile

- Profile file used:
- Last reviewed:
- Validated with `scripts/validate_capability_profile.py`: yes / no
- Known limitations:

## Safe defaults

- Write actions are not allowed by default.
- Missing SLA, CSAT, Help Centre, custom-field, or conversation access must be reported as unavailable.
- The skill must not invent backlog counts, trend deltas, ticket examples, owners, causes, SLA status, or customer impact.
- The skill must not assume a specific teammate, private view, Zendesk group, brand, organisation, or custom-field ID unless provided in the active request or confirmed in the active shared-agent environment.

## Smoke-test sign-off

- Permission-limited response tested:
- Missing-SLA fallback tested:
- Missing-CSAT fallback tested:
- Multi-brand or multi-group scope tested:
- Non-owner teammate tested:

## Rollout decision

Status: go / partial / no-go

Required fixes before broader use:

- 
