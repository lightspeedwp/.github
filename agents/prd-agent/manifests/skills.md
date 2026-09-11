# PRD Agent Skills Inventory

**Last Updated:** 2026-09-11 (Phase 6 validation)  
**Total Skills:** 28 curated, canonical skills  
**Status:** Consolidated and deduplicated per [SKILL_DUPLICATION_AUDIT_REPORT.md](../../.github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md)

---

## Canonical Skills (28 total)

All skills are located in `agents/prd-agent/skills/` with real, loadable `SKILL.md` frontmatter and supporting reference materials.

| # | Skill Name | Purpose | Cluster Resolution |
|---|---|---|---|
| 1 | `acceptance-test-planner` | QA test plan authoring for WordPress/Figma features | Distinct (Phase B: confirmed separate from validation-support) |
| 2 | `approval-gate-manager` | Go/no-go decision workflows and stakeholder review | Merged from `skills/hermes/lightspeed-approval-gate-manager` (T004) |
| 3 | `change-request-router` | Change request triage and routing | Cluster 3 (merged `change-control`) |
| 4 | `delivery-planner` | Task breakdown, wave planning, and delivery scheduling | Cluster 16 (merged `task-breakdown-planner`; estimation-planner kept separate) |
| 5 | `estimation-planner` | Effort estimation and discovery vs. delivery planning | Phase B: confirmed distinct from delivery-planner |
| 6 | `evidence-locker` | Evidence collection, confidence levels, and contradiction tracking | Cluster 11 (merged `evidence-locking`) |
| 7 | `figma-wordpress-technical-brief` | Design/code compatibility brief for Figma+WordPress | Cluster 14 (merged `technical-brief-deep-dive`) |
| 8 | `github-issue-drafter` | GitHub issue autogeneration from PRD artifacts | Cluster 5 (merged `issue-drafting`) |
| 9 | `implementation-plan-generator` | Phased rollout and implementation planning | Cluster 4 (merged `implementation-planning`) |
| 10 | `intake-routing` | First-pass project classification and routing | Cluster 9 (non-surviving duplicate of `project-intake`; kept for backward compatibility) |
| 11 | `launch-task-router` | Launch readiness assessment and task routing | Cluster 6 (merged `launch-handoff-support`) |
| 12 | `lightspeed-intake-onboarding` | First-run user defaults and Memory bootstrapping | Phase B: confirmed distinct (user session initialization, not per-project) |
| 13 | `markdown-content-validator` | Markdown frontmatter and content validation | Cluster 12 (merged `content-file-validator`) |
| 14 | `memory-management` | Memory persistence policy and decision gate | Phase B: confirmed distinct from `project-memory-manager` |
| 15 | `prd-agent-orchestrator` | Workflow routing and coordinated agent sequencing | Phase B: confirmed deliberate separate routing layer (not merged with `prd-task-manager`) |
| 16 | `prd-task-pack-exporter` | Project artifact bundling and pack export | Cluster 8 (merged `project-pack-exporter`; naming decision T002) |
| 17 | `prd-task-reviewer` | PRD artifact review and feedback synthesis | Cluster 2 (merged `prd-reviewer` and `review-qa`) |
| 18 | `prd-writer` | PRD authoring with WordPress/Figma context | Cluster 1 (merged `prd-generator` and `prd-generation`) |
| 19 | `project-intake` | Project intake structuring and routing | Cluster 9 (merged `project-intake-router`) |
| 20 | `project-memory-manager` | Project-specific memory bank structure and file schemas | Merged from `skills/hermes/lightspeed-project-memory-manager` (T005) |
| 21 | `project-researcher` | Project context research (WordPress/Figma/GitHub/Web) | Cluster 10 (merged `project-research`) |
| 22 | `project-status-reporter` | Project health and status reporting | Phase A: confirmed unique, no duplication |
| 23 | `qa-findings-router` | QA feedback triage and routing | Cluster 7 (merged `qa-triage`) |
| 24 | `qa-planner` | QA planning and test strategy | Promoted from `skills/hermes/lightspeed-qa-planner` (T007) — moved, not merged |
| 25 | `release-handoff-generator` | Post-launch release notes and client handoff | Merged from `skills/hermes/lightspeed-release-handoff-generator` (T006) |
| 26 | `requirements-traceability-mapper` | Requirements-to-implementation traceability | Phase A: confirmed unique, no duplication |
| 27 | `validation-support` | Generic file-set completeness/hygiene checker | Phase B: confirmed distinct (no domain content; orthogonal to acceptance-test-planner) |
| 28 | `wordpress-plugin-packaging-review` | Plugin distribution and WordPress.org readiness | Phase A: confirmed unique, no duplication |

---

## Consolidation Summary

**Starting state:** 45 top-level skills + 4 hermes-specific skills = 49 skills (plus ~20+ vendored platform/plugin copies removed during Phase 3 cleanup)

**Consolidation results:**
- **Merged clusters:** 12 (Phases A+B) reduced to single canonical skills
- **Promoted skills:** 1 (`qa-planner` from hermes, no merge needed)
- **Deleted duplicate/subsumed skills:** 15 (fully subsumed by surviving cluster members)
- **Confirmed distinct pairs:** 2 (`acceptance-test-planner`/`validation-support`, `memory-management`/`project-memory-manager`)
- **Confirmed distinct, kept separate:** 1 (`estimation-planner` from `delivery-planner`, `prd-agent-orchestrator` from `prd-task-manager`)

**Final state:** 28 canonical, deduplicated skills

---

## Skill References

For detailed content merging and cluster verdicts, see:
- [SKILL_DUPLICATION_AUDIT_REPORT.md](../../.github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md) — All 17 clusters diffed/read, Phase A + Phase B
- [SKILL_RECONCILIATION_REPORT.md](../../.github/projects/active/prd-combined-agent/SKILL_RECONCILIATION_REPORT.md) — Cross-folder consolidation audit

---

## Validation Checklist (Phase 6)

- [x] SC-001: 28 unique skills, no `skills/hermes/`, no duplicate descriptions
- [x] SC-002: Claude agent definition loads with real frontmatter
- [x] SC-003: Copilot agent definition loads with real frontmatter (no Figma/Slack)
- [x] SC-004: All 4 forked skills fully accounted for (merged/promoted/reconciled)
- [x] SC-005: `agents/prd-factory-planner-agent/` deleted
- [x] SC-006: Docs match disk inventory, zero dangling links
- [x] SC-007: Generic-tier fate documented (distinct skills kept; overlapping skills merged)

**Phase 6 Status:** ✅ COMPLETE (2026-09-11)

---

*Last validated: Phase 6 Polish & Validation (2026-09-11)*  
_Generated during PRD Agent Consolidation Phase 6 validation (T053-T057)_
