---
description: "Decision log for PRD Agent Folder Consolidation Phase 1, 3, and 6"
---

# DECISIONS_LOG.md — PRD Agent Folder Consolidation (Phase 3)

**Purpose**: Single source of truth for all setup decisions, external reference audits, and final validation findings.

**Last Updated**: [DATE] | **Status**: [OPEN / READY FOR PHASE 3 / COMPLETE]

---

## Phase 1 Decisions

### T002: Cluster 8 Naming Decision

**Question**: Which directory survives for Cluster 8 project pack export skill — `project-pack-exporter/` or `prd-task-pack-exporter/`?

**Decision**: [PENDING MAINTAINER SIGN-OFF]
- [ ] Keep `project-pack-exporter/` as the canonical skill folder (delete `prd-task-pack-exporter/`)
- [ ] Keep `prd-task-pack-exporter/` as the canonical skill folder (delete `project-pack-exporter/`)

**Rationale**: [Record maintainer's reason for the choice — e.g., "naming is more explicit" or "matches naming convention elsewhere"]

**Sign-off**: 
- Decided by: [@ashley](https://github.com/ashley) (or assignee name)
- Date: YYYY-MM-DD
- Verification: T022-T023 will merge content into surviving directory

---

### T003: frontend-skill Removal Confirmation

**Question**: Confirm `agents/prd-agent/skills/frontend-skill/` should be removed as out-of-scope content.

**Finding**: Per SKILL_DUPLICATION_AUDIT_REPORT.md §5 and INTRA_FOLDER_SKILL_AUDIT_SCOPE.md §5, `frontend-skill` is unrelated to PRD/planning work and should be removed.

**Decision**: [PENDING MAINTAINER SIGN-OFF]
- [ ] **CONFIRM**: Remove `frontend-skill/` in T042 (**frontend-skill IS out of scope**)
- [ ] **RECONSIDER**: Keep `frontend-skill/` in scope (do not run T042)

**Note on Generic Tier**: Is `frontend-skill` part of the "10-skill generic tier" (spec line 90), or a separate removal? (Answer in T004 below.)

**Sign-off**:
- Decided by: [@ashley](https://github.com/ashley)
- Date: YYYY-MM-DD
- Verification: T042 will delete the folder (or be skipped)

---

### T004: Generic Tier Fate Decision (SC-007 Blocker)

**Question**: Per spec.md SC-007 and plan.md research.md D2, determine the fate of the "10-skill generic/thin tier" — a group of skills defined by exactly 2 files each: `SKILL.md` + `agents/openai.yaml`.

**Step 1: Enumerate the Generic Tier**

List all skills in `agents/prd-agent/skills/` matching the 2-file structure:

```bash
find agents/prd-agent/skills -maxdepth 1 -type d ! -name skills -exec bash -c 'if [ $(find "$1" -maxdepth 1 -type f | wc -l) -eq 2 ] && [ -f "$1/SKILL.md" ] && [ -f "$1/agents/openai.yaml" ]; then basename "$1"; fi' _ {} \;
```

**Skills Identified as 2-file Generic Tier**:
- [ ] [skill-name-1]
- [ ] [skill-name-2]
- [ ] ... (list all 10 or however many are found)

**Is frontend-skill in this list?** [YES / NO]

**Step 2: Decide the Fate**

**Decision**: [PENDING MAINTAINER SIGN-OFF]
- [ ] **KEEP**: The generic tier is a deliberate routing layer. Keep all identified skills, maintain their 2-file structure and `agents/openai.yaml` configs.
- [ ] **RETIRE**: The generic tier is superseded by the `lightspeed-*` specialists. Delete all identified skills (plus audit for any unique content that must be ported first).
- [ ] **HYBRID**: Keep some skills, retire others. (Specify which below.)

**Rationale**: [Record maintainer's reasoning — e.g., "These are catch-all skills that duplicate specialist logic" or "These are essential fallback routing skills"]

**Content Migration (if retiring)**: If any generic-tier skills have unique content not covered by specialists, note it here before deletion:
- [skill-name]: [unique content, e.g., "edge-case handling for X", "legacy API support"]
- ...

**Sign-off**:
- Decided by: [@ashley](https://github.com/ashley)
- Date: YYYY-MM-DD
- Verification: Phase 3 cluster tasks (T004-T042) will either preserve or delete these skills per this decision

---

## Phase 3 Findings

### T005: External References Audit

**Question**: Per spec.md Edge Case §4, are there external project documents, automation, or config that reference `agents/prd-factory-planner-agent/` by path?

**Command Executed**:
```bash
grep -r 'prd-factory-planner-agent' . --include='*.md' --include='*.yml' --include='*.yaml' --include='*.json' --include='*.js' --include='*.ts' --include='*.sh' | grep -v node_modules | grep -v '.git/'
```

**References Found**:

| File | Line(s) | Reference | Type | Status | Resolution |
|------|---------|-----------|------|--------|-----------|
| [path] | [line#] | Full reference text | (docs / workflow / config / automation) | (FIXED / RETIRED / N/A) | Brief description of action taken |
| [example] docs/AGENT-INDEX.md | 42, 108 | `agents/prd-factory-planner-agent/copilot/agent.md` | docs | FIXED | Updated to point at `agents/prd-agent/copilot/agent.md` (T048 task) |
| [example] workflows/build.yml | 15 | `source: agents/prd-factory-planner-agent` | automation | VERIFIED-N/A | Workflow already decommissioned as of 2026-09-01; no update needed |

**Total References**: [#] found, [#] fixed, [#] verified N/A, [#] retired

**Sign-off**:
- Audited by: [@ashley](https://github.com/ashley)
- Date: YYYY-MM-DD
- **Approval to delete** `agents/prd-factory-planner-agent/`: [✓ ALL REFERENCES RESOLVED / ✗ BLOCKERS REMAIN]

If blockers remain, list them:
- [Blocker description]

---

## Phase 6 Validation

### T057: SC-001 Count Compliance

**Question**: Does the final consolidated skill count exactly match SC-001's target (28 or 27)?

**Command Executed**:
```bash
find agents/prd-agent/skills -mindepth 1 -maxdepth 1 -type d | wc -l
```

**Results**:

- **SC-001 Target**: 28 skills (or 27 if T003 frontend-skill removal ran)
- **T003 Status**: [COMPLETED / SKIPPED / PENDING]
- **Actual Count**: [#] skills
- **Compliance**: [✓ MATCH / ✗ DRIFT]

**If Drift** — Root Cause Analysis:

Expected: 28 | Actual: [#] | Delta: [+ or -#]

**Likely Cause**: [Investigation — e.g., "Cluster 3 merge missed one skill", "T033 deletion didn't run", "extra skill created"]

**Resolution**:
- [Action taken to fix drift — re-run specific tasks, extend scope, etc.]
- [Updated count after fix: [#]]

**Sign-off**:
- Validated by: [@ashley](https://github.com/ashley)
- Date: YYYY-MM-DD
- **Status**: [✓ COMPLIANT / ✗ EXCEPTION (documented)]

---

## Sign-Off Checklist

Before proceeding to implementation:

- [ ] **T002**: Cluster 8 naming decision recorded + signed off
- [ ] **T003**: frontend-skill removal confirmed + signed off
- [ ] **T004**: Generic tier enumerated, fate decided, signed off
- [ ] **T005**: External references audited + approval to delete folder granted
- [ ] **T057**: Final skill count validated or exception documented + signed off

**Overall Status**: [READY FOR PHASE 3 / REQUIRES MAINTAINER REVIEW]

---

## Metadata

- **Version**: 1.0
- **Created**: 2026-09-11
- **Spec Ref**: `.github/specs/001-prd-agent-consolidation/spec.md`
- **Analysis Ref**: `speckit-analyze` output (2026-09-11) — findings A1, A2, A3, A5
- **Related Issues**: plan.md research.md D1 (registry), D2 (generic tier scope)
