# Phase 0 Research: PRD Agent Folder Consolidation

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature's Technical Context has no `NEEDS CLARIFICATION` markers (it's a content/file reorganisation, not new software), so Phase 0 research here targets the two decision-tasks the spec defers to execution: FR-010 (`mode-prd.agent.md` fate) and FR-003 (generic/thin-tier skill fate). Both were investigated directly against the live repository rather than assumed.

## D1: `agents/mode-prd.agent.md` fate (FR-010)

**Decision**: Retire in favour of `agents/prd-agent/copilot/agent.md`, as FR-010 already states — **but this is not a simple delete**. It is a registered, tracked asset, not a standalone file.

**Rationale — evidence found**:

- `workflows/memory/registry/memory-registry.yaml` contains a live entry: `asset_id: agent:mode-prd`, `source_path: agents/mode-prd.agent.md`, plus `profile_path`/`example_path` pointing at two dedicated YAML files (`workflows/memory/profiles/agents/mode-prd.memory-profile.yaml`, `workflows/memory/examples/agents/mode-prd.memory.example.yaml`).
- `workflows/memory/registry/inventory-lock.json` lists `agents/mode-prd.agent.md` explicitly alongside other tracked agent files.
- `docs/AGENT-INDEX.md` references it **five separate times**, under two different paths: `../agents/mode-prd.agent.md` (real, confirmed on disk) and `../.github/agents/mode-prd.agent.md` (confirmed **does not exist** — `.github/agents/` currently has no PRD-related file; this is already a dead link today, independent of this feature).
- Only one live copy exists on disk: `agents/mode-prd.agent.md`. No copy exists under `.github/agents/`.

**Implication for execution** (to hand to `/speckit-tasks`): retiring this file requires, at minimum: (1) confirming no workflow *reads* `memory-registry.yaml` at runtime to locate/load the agent (vs. just cataloguing it — needs a check of `workflows/` consumers), (2) removing or repointing its `memory-registry.yaml` entry and `inventory-lock.json` line, (3) deciding whether the profile/example YAML files retire with it or get repointed at the new `copilot/agent.md`, and (4) fixing the already-broken `.github/agents/mode-prd.agent.md` links in `docs/AGENT-INDEX.md` regardless of this feature's outcome.

**Alternatives considered**: Keep both files in sync (Option B in `PLANNING.md` Phase 7) — rejected per the project's own stated preference, dual-maintenance cost, and doesn't remove the registry dependency problem either way.

## D2: Generic/thin-tier skill fate (FR-003)

**Decision**: FR-003's scope as written (10 named skills) is **narrower than what's actually on disk**. Recommend a dedicated intra-folder duplication audit — same method as the existing three reconciliation reports — before `/speckit-tasks` turns FR-003 into concrete work, rather than resolving it ad hoc during implementation.

**Rationale — evidence found**: `SKILL_RECONCILIATION_REPORT.md` §2.1 only diffed `prd-agent` against `prd-factory-planner-agent`; it never compared `prd-agent`'s skills against each other. Doing that comparison now shows the same capability implemented under **up to three parallel naming generations** in the same folder:

| Capability | Generic tier (`Use when...`, 2-file) | Router/generator tier (imperative, `lightspeed figma → wordpress` framing) | `lightspeed-*` specialist tier |
|---|---|---|---|
| PRD drafting | `prd-generation` | `prd-generator` | `lightspeed-prd-writer` (`prd-writer/`) |
| QA triage | `qa-triage` | `qa-findings-router` | — |
| Quality/readiness review | `review-qa` | — | `lightspeed-prd-reviewer`, `lightspeed-prd-task-reviewer` |
| Implementation planning | `implementation-planning` | `implementation-plan-generator` | — |
| Issue drafting | `issue-drafting` | `github-issue-drafter` | — |
| Launch/handoff | `launch-handoff-support` | `launch-task-router` | — |
| Project pack export | (n/a) | `prd-task-pack-exporter` | `project-pack-exporter` |
| Change management | `change-control` | `change-request-router` | — |
| Intake | `project-intake` | `project-intake-router`, `lightspeed-intake-onboarding` | — |
| Research | `project-research` | `project-researcher` | — |
| Evidence discipline | `evidence-locking` | — | `evidence-locker` (near-identical purpose, different name — not part of any tier pattern above) |

Sample evidence (`SKILL.md` descriptions, verbatim): `review-qa` — *"Use when an existing planning artefact needs a quality review for evidence strength, structural quality, contradictions, missing detail, readiness..."* vs. `lightspeed-prd-reviewer` — *"Use when a LightSpeed PRD... needs a readiness review for completeness, evidence quality, unsupported claims, gaps..."* vs. `lightspeed-prd-task-reviewer` — near-identical scope with WordPress-specific framing added. Three skills, one job. `evidence-locker` and `evidence-locking` are similarly near-identical in stated purpose under different names.

**Implication for execution**: the spec's SC-001 skill-count estimate (~44-46, carried over from `SKILL_RECONCILIATION_REPORT.md`'s cross-folder-only audit) is very likely an overcount of the *curated* target — the true number after resolving this intra-folder overlap is probably well under that once one naming generation per capability is picked. FR-003 should be re-scoped from "10 named skills" to "all capability areas with 2-3 parallel implementations" before task breakdown, and `SC-001`'s number should be treated as provisional pending that audit.

**Update 2026-09-10**: scoped as its own audit — [INTRA_FOLDER_SKILL_AUDIT_SCOPE.md](../../projects/active/prd-combined-agent/INTRA_FOLDER_SKILL_AUDIT_SCOPE.md) (17 clusters, confidence-tiered) — then fully executed: [SKILL_DUPLICATION_AUDIT_REPORT.md](../../projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md) diffed/read all 17 clusters. Finding: mostly an abandoned rename campaign (most clusters have a rollout note declaring the *thinner* skill as the intended replacement), but not universally — 3 clusters (acceptance-test-planner/validation-support, memory-management/project-memory-manager, and the orchestrator pairing) turned out genuinely distinct, not duplicates. Final curated count: 46 → 28 skills (27 once `frontend-skill` is removed).

**Alternatives considered**: Resolving FR-003 skill-by-skill during implementation without a dedicated audit — rejected; the existing reconciliation reports exist precisely because ad hoc merge decisions during execution produced this three-generation duplication in the first place (per `FOLDER_STRUCTURE_PLAN.md` §1.1, this folder is a raw, unmerged environment export).

## Summary

Both open execution decisions (FR-003, FR-010) have enough evidence now to scope real tasks, but **neither is a simple "pick an option and go"**:

- FR-010 needs a small registry-update task, not just a file deletion.
- FR-003 needs its own short reconciliation report (mirroring the existing three) before task breakdown, because the live folder has drifted further from the audited baseline than the current spec assumes.

No items remain in a "researched but still blocked" state — Phase 1 design can proceed.
