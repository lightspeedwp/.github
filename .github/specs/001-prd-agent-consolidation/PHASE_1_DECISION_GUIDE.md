---
description: "Phase 1 Decision Guide for PRD Agent Folder Consolidation"
---

# Phase 1 Decision Guide: Setup & Decisions

**Purpose**: Step-by-step guide for resolving the 3 mandatory Phase 1 decisions that block downstream work.

**Decisions to Make**: T002, T003, T004 (recorded in `DECISIONS_LOG.md`)

**Timeline**: 1-2 hours total

**Maintainer**: @ashley

---

## Overview: Why Phase 1?

Phase 1 is the setup phase that unblocks all downstream work. Three decisions must be made upfront:

| Task | Decision | Impact | Downstream |
|------|----------|--------|-----------|
| **T002** | Which name survives for Cluster 8 export skill? | +1 delete task (T023) | Cluster 8 merge (T022-T023) |
| **T003** | Should frontend-skill be removed? | ±1 final skill count | Final count validation (T057) |
| **T004** | What's the fate of the generic tier? | 0-10 skill deletions | Phase 3-6 scope |

**Without these decisions**: Phase 3 (60+ merge tasks) and Phase 6 (validation) cannot proceed with certainty.

---

## T001: Confirm Starting State (5 min) — UPDATED

**Status**: Phase 3 consolidation already complete (PR #2865 merged 2026-09-10)

**Current State (Verified 2026-09-11)**:
- Skill count: 28 consolidated skills (down from 46-skill baseline)
- hermes/ folder: Already removed (T004-T007 complete)
- prd-factory-planner-agent: Already deleted (T042 complete)
- mode-prd.agent.md: Still exists (T045-T047 pending)

**Implication**: The Phase 3 implementation work (60+ cluster merge tasks) has already been executed in PR #2865. Phase 1 decisions (T002-T004) need to be validated retroactively based on current state.

### Current 28-Skill Inventory

acceptance-test-planner, approval-gate-manager, change-request-router, delivery-planner, estimation-planner, evidence-locker, figma-wordpress-technical-brief, github-issue-drafter, implementation-plan-generator, intake-routing, launch-task-router, lightspeed-intake-onboarding, markdown-content-validator, memory-management, prd-agent-orchestrator, prd-task-pack-exporter, prd-task-reviewer, prd-writer, project-intake, project-memory-manager, project-researcher, project-status-reporter, qa-findings-router, qa-planner, release-handoff-generator, requirements-traceability-mapper, validation-support, wordpress-plugin-packaging-review

### Step 1: Verify current state

```bash
# Confirm current skill count
find agents/prd-agent/skills -maxdepth 1 -type d ! -name skills | wc -l  # Should return 28

# Confirm consolidation is complete
test -d agents/prd-agent/skills/hermes && echo "✗ hermes/ still exists" || echo "✓ hermes/ removed"
test -d agents/prd-factory-planner-agent && echo "✗ prd-factory still exists" || echo "✓ prd-factory deleted"
test -f agents/mode-prd.agent.md && echo "✓ mode-prd.agent.md exists (pending retirement)" || echo "✗ missing"
```

### Step 2: Record in DECISIONS_LOG.md

```markdown
### T001: Current State Verification (Phase 3 Post-Completion)

**Verified**: 2026-09-11 — Consolidation already complete via PR #2865

**Results**:
- Current skill count: 28 (consolidated from 46)
- hermes/ status: REMOVED (T004-T007 complete)
- prd-factory-planner-agent: DELETED (T042 complete)
- mode-prd.agent.md: EXISTS (retirement pending in T045-T047)
- Baseline matches: YES — consolidation successful

**Implication**: T002-T004 decisions need retroactive validation against achieved state.

**Sign-off**: @ashley, Date: 2026-09-11
**Status**: PROCEED — Update T002-T004 decision records
```

### Step 4: Decision

- ✅ **PROCEED** if state matches (46 skills, all 3 folders/files present)
- ❌ **HOLD** if state doesn't match (investigate what changed; update baseline if drift is intentional)

---

## T002: Cluster 8 Naming Decision (20 min)

**Goal**: Choose which folder name survives for the Cluster 8 export skill (`project-pack-exporter` or `prd-task-pack-exporter`).

**Why**: Both folders have identical content (per audit). Keeping both violates SC-001 (single source of truth). One must be deleted after content is merged.

### Step 1: Understand the choice

**Option A: Keep `project-pack-exporter/`**
- **Rationale**: Name is shorter, matches naming convention in other clusters (e.g., `prd-writer`, not `prd-content-writer`)
- **Delete**: `prd-task-pack-exporter/`

**Option B: Keep `prd-task-pack-exporter/`**
- **Rationale**: Name is more explicit (exports task packs, not generic project packs); aligns with "prd-" prefix used elsewhere
- **Delete**: `project-pack-exporter/`

### Step 2: Review audit evidence

Read the audit findings for Cluster 8:

```bash
grep -A 20 "Cluster 8" .github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md
```

Expected findings:
- Both folders have identical content (byte-for-byte matching after footer lines)
- No unique content in either folder
- 9-directory default pack structure is identical in both

### Step 3: Research existing naming patterns

```bash
# Check naming patterns in skills/ folder
ls -1 agents/prd-agent/skills/ | grep "^prd-" | head -20
ls -1 agents/prd-agent/skills/ | grep -v "^prd-" | head -10
```

**Expected pattern**: Most skills start with `prd-` prefix (e.g., `prd-writer`, `prd-task-reviewer`).

### Step 4: Make the decision

**Recommendation**: Option B (`prd-task-pack-exporter`) to maintain naming consistency with the `prd-` prefix used throughout the skill folder.

**Your decision**: Choose A or B:

```markdown
### T002: Cluster 8 Naming Decision

**Question**: Which folder survives — `project-pack-exporter/` or `prd-task-pack-exporter/`?

**Audit Evidence**: Both folders have identical content (9-directory default pack, pack-workflow.md, 5 asset templates)

**Naming Patterns**: [Count of prd- vs non-prd- skills]

**Decision**: 
- [ ] Option A: Keep `project-pack-exporter/` (delete `prd-task-pack-exporter/`)
- [ ] Option B: Keep `prd-task-pack-exporter/` (delete `project-pack-exporter/`)

**Rationale**: [Explain your choice — consistency, naming convention, or other reason]

**Sign-off**: @ashley, Date: YYYY-MM-DD

**Impact**: Task T022-T023 will merge into the chosen folder and delete the other.
```

### Step 5: Record decision

Once decided, update `DECISIONS_LOG.md`:

```markdown
## Phase 1 Decisions

### T002: Cluster 8 Naming Decision

**Decision**: Keep [Option A / Option B]

**Rationale**: [Your reasoning — e.g., "Naming consistency with prd- prefix"]

**Sign-off**: 
- Decided by: @ashley
- Date: YYYY-MM-DD
- Verification: T022-T023 will merge content into surviving directory; other deleted
```

---

## T003: frontend-skill Removal Confirmation (10 min)

**Goal**: Confirm that `agents/prd-agent/skills/frontend-skill/` is out of scope and should be deleted.

**Why**: The audit identified this skill as unrelated to PRD/planning work. Spec.md SC-001 expects 28 skills (27 if frontend-skill removed). Need explicit confirmation before deletion.

### Step 1: Examine the skill

```bash
# Read the skill definition
cat agents/prd-agent/skills/frontend-skill/SKILL.md | head -50

# Check its content
ls -la agents/prd-agent/skills/frontend-skill/
```

### Step 2: Review audit findings

Read the intra-folder audit to understand why it's marked out-of-scope:

```bash
grep -B 5 -A 10 "frontend-skill" \
  .github/projects/active/prd-combined-agent/INTRA_FOLDER_SKILL_AUDIT_SCOPE.md
```

**Expected findings**: Skill is unrelated to PRD/planning/QA work; belongs to frontend/UI development.

### Step 3: Cross-check for dependencies

```bash
# Search for any references to frontend-skill in the repo
grep -r "frontend-skill" . --include="*.md" --include="*.yml" --include="*.yaml" \
  | grep -v node_modules | grep -v ".git/"
```

Expected: No references (isolated skill).

### Step 4: Make the decision

**Recommendation**: CONFIRM removal. The skill is unrelated to the PRD agent's scope (product requirements, planning, QA — not UI/frontend).

**Your decision**:

```markdown
### T003: frontend-skill Removal Confirmation

**Question**: Should `agents/prd-agent/skills/frontend-skill/` be removed?

**Audit Finding**: [Summary from INTRA_FOLDER_SKILL_AUDIT_SCOPE.md — why it's out of scope]

**Dependency Check**: [No references found / References found: describe]

**Decision**:
- [ ] **CONFIRM**: Remove `frontend-skill/` in T042 (IS out of scope)
- [ ] **RECONSIDER**: Keep `frontend-skill/` in scope (skip T042)

**Rationale**: [Your reasoning]

**Sign-off**: 
- Decided by: @ashley
- Date: YYYY-MM-DD
- Verification: T042 will delete the folder (or be skipped)

**Impact on SC-001**: If removed, final count = 27 skills (not 28)
```

### Step 5: Important clarification

**Question for yourself**: Is `frontend-skill` part of the "10-skill generic tier" (spec line 90), or a separate removal?

- **If part of generic tier**: Its fate is decided by T004 (generic tier fate decision)
- **If separate removal**: It's out-of-scope regardless of what T004 decides

Record your answer in DECISIONS_LOG.md:

```markdown
**Is frontend-skill part of the generic tier?** [YES / NO]

[If YES: Its removal depends on T004 decision]
[If NO: It's a separate removal, independent of T004]
```

---

## T004: Generic Tier Fate Decision (30 min)

**Goal**: Enumerate the "10-skill generic tier" (skills with exactly 2 files: `SKILL.md` + `agents/openai.yaml`), and decide whether to keep or retire it.

**Why**: The spec says "generic tier fate is explicitly documented as decision" (SC-007). The generic tier is a deliberate routing layer OR a superseded fallback layer — that distinction must be decided upfront.

### Step 1: Enumerate the generic tier

**Command**: Find all skills with exactly 2 files (SKILL.md + agents/openai.yaml)

```bash
find agents/prd-agent/skills -maxdepth 1 -type d ! -name skills -exec bash -c '\
  if [ $(find "$1" -maxdepth 1 -type f | wc -l) -eq 2 ] && \
     [ -f "$1/SKILL.md" ] && \
     [ -f "$1/agents/openai.yaml" ]; then \
    basename "$1"; \
  fi' _ {} \;
```

### Step 2: Expected output

```
[List of 10 (or however many) skill names matching 2-file structure]
lightspeed-approval-gate-manager
lightspeed-project-memory-manager
... (continue for all 10)
```

### Step 3: Cross-check: Is frontend-skill in this list?

```bash
# Verify if frontend-skill has exactly 2 files
ls -la agents/prd-agent/skills/frontend-skill/
# Count: [2 / more than 2]
```

**Record**: In DECISIONS_LOG.md, note whether frontend-skill is part of the generic tier or separate.

### Step 4: Understand the choice

**Option A: KEEP the generic tier**
- **Rationale**: "The generic tier is a deliberate routing layer. Users can request generic work (no specific skill), and the generic skill routes to specialists."
- **Action**: Keep all 10 skills, maintain their 2-file structure and agents/openai.yaml configs
- **Impact on SC-001**: Final count = 28 skills (27 if T003 frontend-skill removal)

**Option B: RETIRE the generic tier**
- **Rationale**: "The generic tier is superseded by specialist skills. Generic skills duplicate logic and add confusion. All work should explicitly request a specialist skill."
- **Action**: Delete all 10 generic-tier skills; audit for any unique content that must be ported first
- **Impact on SC-001**: Final count = 18-19 skills (not 28 — BREAKS SC-001 target)
- **Warning**: This would require spec.md SC-001 to be updated from 28 to a new target

**Option C: HYBRID**
- **Action**: Keep some specialist generic skills (e.g., generic approval-gate), retire others
- **Impact**: Requires explicit list of which to keep and which to retire

### Step 5: Make the decision

```markdown
### T004: Generic Tier Fate Decision (SC-007 blocker)

**Question**: What's the fate of the 10-skill generic/thin tier?

**Step 1: Skills Identified as 2-file Generic Tier**:
- [skill-name-1]
- [skill-name-2]
... (list all 10)

**Is frontend-skill in this list?** [YES / NO]

**Step 2: Decide the Fate**

**Decision**:
- [ ] **KEEP**: Generic tier is a deliberate routing layer. Keep all identified skills.
- [ ] **RETIRE**: Generic tier is superseded by specialists. Delete all identified skills.
- [ ] **HYBRID**: Keep some, retire others. (Specify which below)

**Rationale**: [Explain your reasoning]

[If HYBRID]:
**Skills to Keep**: [list]
**Skills to Retire**: [list]
**Reasoning for each**: [describe unique content or justify removal]

**Content Migration (if retiring)**: 
[Any unique content in generic-tier skills that must be ported?]
- [skill-name]: [unique content, e.g., "routing decision tree", "fallback API support"]
- ...

**Impact Analysis**:
- If KEEP: Final count = 28 skills ✓ matches SC-001
- If RETIRE: Final count = 18-19 skills ✗ BREAKS SC-001 (requires spec update)
- If HYBRID: Final count = [estimated based on keep/retire split]

**Sign-off**: 
- Decided by: @ashley
- Date: YYYY-MM-DD
- Verification: Phase 3 cluster tasks (T004-T042) will either preserve or delete these skills per this decision
```

### Step 6: Coordinate with T003 decision

If `frontend-skill` is part of the generic tier:
- **If T003 = CONFIRM removal AND T004 = RETIRE**: frontend-skill is deleted once
- **If T003 = CONFIRM removal AND T004 = KEEP**: frontend-skill is handled separately (removed as out-of-scope)
- **If T003 = RECONSIDER AND T004 = RETIRE**: frontend-skill stays (RECONSIDER overrides)

Record this coordination in DECISIONS_LOG.md T003 and T004 sections.

---

## Phase 1 Completion Checklist

Once all 3 decisions are made and signed off, Phase 1 is complete:

```markdown
## Sign-Off Checklist

Before proceeding to Phase 2 (Foundational):

- [ ] **T001**: Starting state verified (46 skills, hermes/ exists, audit baseline matches)
- [ ] **T002**: Cluster 8 naming decision signed off (A or B chosen, recorded in DECISIONS_LOG.md)
- [ ] **T003**: frontend-skill removal confirmed (CONFIRM or RECONSIDER chosen, recorded)
- [ ] **T004**: Generic tier fate decided (KEEP / RETIRE / HYBRID, recorded with rationale)
- [ ] **Coordination**: T003 and T004 decisions coordinated (if frontend-skill is part of generic tier)
- [ ] **DECISIONS_LOG.md**: All decisions recorded with sign-off dates
- [ ] **Ready for Phase 3**: No blockers remain; Phase 3 cluster work can begin

**Overall Status**: ✓ READY FOR PHASE 3 (all decisions made and signed)
```

---

## Recording Decisions: DECISIONS_LOG.md

After making each decision, update `DECISIONS_LOG.md` with:

1. **Decision section** (T002, T003, or T004)
2. **Enumerated findings** (e.g., skills in generic tier)
3. **Decision choice** (A/B, CONFIRM/RECONSIDER, KEEP/RETIRE)
4. **Rationale** (your reasoning)
5. **Sign-off** (your name, date)
6. **Verification plan** (how the decision will be validated)

**Example**:

```markdown
### T002: Cluster 8 Naming Decision

**Question**: Which directory survives for Cluster 8 project pack export skill?

**Decision**: Keep `prd-task-pack-exporter/` as the canonical skill folder

**Rationale**: Naming consistency with `prd-` prefix used throughout skills/ folder. Option B (prd-task-pack-exporter) aligns with naming patterns in prd-writer, prd-task-reviewer, etc.

**Sign-off**: 
- Decided by: @ashley
- Date: 2026-09-11
- Verification: T022-T023 will merge content into prd-task-pack-exporter/ and delete project-pack-exporter/
```

---

## Timeline & Next Steps

| Step | Time | Owner | Deadline |
|------|------|-------|----------|
| **T001** | 30 min | @ashley | Day 1 |
| **T002** | 20 min | @ashley | Day 1 |
| **T003** | 10 min | @ashley | Day 1 |
| **T004** | 30 min | @ashley | Day 1-2 |
| **Record in DECISIONS_LOG.md** | 15 min | @ashley | Day 2 |
| **Phase 1 sign-off** | — | @ashley | Day 2 |
| **Start Phase 3** | — | Phase 3 executor | Day 3+ |

**Total**: ~2 hours (mostly decision-making, not technical work)

---

## Questions & Help

**Q: What if I can't decide on T004 (generic tier fate)?**
A: Default to **KEEP** (least risky). The generic tier can be deprecated later if specialists prove sufficient.

**Q: What if T001 shows drift (more/fewer than 46 skills)?**
A: Investigate what changed. Update the baseline in the audit report if drift is intentional, or restore the expected state before proceeding.

**Q: Does T003 decision affect SC-001 target count?**
A: Yes. If CONFIRM removal, final target = 27 skills. If RECONSIDER, final target = 28 skills. Record this in DECISIONS_LOG.md and update T057 (SC-001 validation) accordingly.

**Q: Can T004 decision change during Phase 3-6?**
A: No. All 60+ cluster tasks depend on T004. Changing it mid-stream requires restarting Phase 3. Make the decision carefully upfront.

---

## Resources

- **Audit Report**: `.github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md`
- **Intra-folder Audit**: `.github/projects/active/prd-combined-agent/INTRA_FOLDER_SKILL_AUDIT_SCOPE.md`
- **Decisions Log Template**: `DECISIONS_LOG.md`
- **Phase 1 Tasks**: `tasks.md` (T001-T004 detailed descriptions)
- **Spec Reference**: `spec.md` (SC-001, SC-007 success criteria)

---

**Document Version**: 1.0  
**Created**: 2026-09-11  
**Maintainer**: @ashley
