## Context

A repo-wide audit identified significant drift between agent specifications and the release-agent contract for tools and permissions. The drift includes zero-tool declarations, zero-permission declarations, partial permission sets, and ad hoc extra permissions. This creates inconsistent runtime behaviour and governance risk for MCP-mediated operations.

## Goals / Non-Goals

**Goals:**

- Establish one canonical, machine-checkable contract for `tools` and `permissions` in all agent specs.
- Support controlled specialisation through named profiles (baseline plus variants), not ad hoc per-file drift.
- Enforce compliance in CI and local workflows with actionable remediation output.

**Non-Goals:**

- Redesigning each agent's business logic or role definitions.
- Migrating unrelated metadata fields in agent frontmatter.
- Introducing a new external policy engine.

## Decisions

1. Contract source of truth

- Decision: Use `agents/release.agent.md` as baseline and introduce a small profile registry for allowed variants.
- Rationale: Existing organisational intent already uses release agent as model; this minimises policy ambiguity.
- Alternative considered: infer profile from majority vote across all agents. Rejected due to existing drift and circularity.

1. Validation mechanism

- Decision: Implement validation as repository script plus CI gate.
- Rationale: Deterministic checks, easy local reproduction, and immediate PR feedback.
- Alternative considered: manual checklist-only enforcement. Rejected due to low reliability and review overhead.

1. Policy expression model

- Decision: Profile-based policy where each agent either matches baseline or an approved variant with explicit deltas.
- Rationale: Allows legitimate specialisation while preventing undocumented divergence.
- Alternative considered: hard force every agent to exact baseline. Rejected because some reviewers/planners need constrained scopes.

1. Rollout strategy

- Decision: Two-wave rollout: define validator and profiles first, then remediate agent files in batches by severity.
- Rationale: Reduces blast radius and keeps CI failures actionable.
- Alternative considered: one-shot remediation of all files. Rejected due to coordination risk.

## Risks / Trade-offs

- [Risk] Over-constraining specialised agents may block valid workflows. -> Mitigation: profile variants with explicit approved deltas.
- [Risk] CI disruption during rollout if validator goes hard-fail too early. -> Mitigation: temporary warning mode for one cycle, then enforce.
- [Risk] Profile drift returns over time. -> Mitigation: contract test in CI and documented update workflow for profile changes.
- [Risk] Plugin-pack agents lag behind root agents. -> Mitigation: include plugin paths in the same validator target set and remediation report.

## Migration Plan

1. Create policy registry and validator script.
2. Add local command and CI job (initial warning mode if needed).
3. Apply fixes to critical agents first (zero tools/permissions), then high, then medium.
4. Switch CI to hard-fail mode.
5. Publish final compliance report and governance update notes.

Rollback:

- Revert validator workflow/job and policy files as one commit if widespread false positives occur.
- Keep previously generated audit report to guide corrected reintroduction.

## Open Questions

- Should mode agents use constrained profiles by default, or baseline with explicit deny-list?
- Should plugin-pack agent profiles be centrally inherited or locally overridden under strict constraints?
- Should `github:issues` and `github:checks` be promoted to approved baseline extensions for specific agent classes?
