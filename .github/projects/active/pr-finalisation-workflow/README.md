---
file_type: "documentation"
type: "project-documentation"
status: "active"
owner: "ashley@lightspeedwp.agency"
created: "2026-09-04"
updated: "2026-09-04"
---

# PR Finalisation Workflow Modernization — Project Control Panel

> **Epic:** [#2681](https://github.com/lightspeedwp/.github/issues/2681) (to be created) | **Status:** Phase 1 — Planning & Testing | **Owner:** Ashley Shaw & Automation Team

## 📋 Quick Links

### Strategic & Planning
- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** — 4-phase implementation roadmap
- **[OPENSPEC.md](./OPENSPEC.md)** — Technical specification & implementation status
- **[WORKFLOW-PROMPT.md](./WORKFLOW-PROMPT.md)** — The 12-step integrated prompt (copy/paste ready)

### Audit & Findings
- **[AUDIT-FINDINGS.md](./AUDIT-FINDINGS.md)** — Comprehensive audit with 6 findings & recommendations
- **[MIGRATION-CHECKLIST.md](./MIGRATION-CHECKLIST.md)** — Detailed checklist for agent reorganization
- **[RISK-ASSESSMENT.md](./RISK-ASSESSMENT.md)** — Risk analysis & mitigation strategies

### Tracking
- **[Active Issues](#-active-issues)** — All project work items (to be created)
- **[Phase Progress](#-phase-progress)** — Current phase status

---

## 🎯 What This Project Does

Modernize the PR finalization workflow by integrating 6 existing agents and skills to improve automation coverage from ~30% to ~70%, preventing 5+ common workflow errors.

### Key Improvements

| Aspect | Before | After | Benefit |
|--------|--------|-------|---------|
| Automation Coverage | ~30% | ~70% | +40% automated |
| Changelog Validation | ❌ None | ✅ Automated | Prevents invalid entries |
| Label Audit | ❌ Manual | ✅ Skill-driven | Coverage metrics + suggestions |
| Issue Type | ❌ Vague | ✅ Decision tree | 35 supported types |
| Issue Lifecycle | ❌ Manual | ✅ Automated | Status sync + closure |
| CI Error Handling | ❌ Brief | ✅ Structured | Better documentation |
| **Steps** | **10** | **12** | +2 new steps |

---

## 📊 Phase Progress

### Phase 1: Planning & Testing (Week 1) ⏳ CURRENT
- [ ] Review audit findings with team
- [ ] Validate all agent/skill integrations work
- [ ] Test changelog validation on real PRs
- [ ] Test label audit on sample issues
- [ ] Confirm Issue Agent Phase 2 roadmap

**Deliverable:** Approved migration plan

### Phase 2: Agent Reorganization (Week 2) ⏳ QUEUED
- [ ] Rename `agents/pr-creation-agent/` → `agents/pr-agent/`
  - Update ~50+ files (workflows, docs, instructions)
  - Test CI before/after rename
  - Create PR #XXXX
- [ ] Move `scripts/automation/issue-agent/` → `agents/issue-agent/`
  - Update ~30+ files (workflows, docs, imports)
  - Test CI before/after move
  - Create PR #XXXX

**Deliverable:** Both agents reorganized, CI passing

### Phase 3: Workflow Integration (Week 3) ⏳ QUEUED
- [ ] Add Changelog Agent to PR validation workflow
- [ ] Add Changelog Agent to release workflow
- [ ] Add Label Audit to PR finalization prompt
- [ ] Add Issue Agent integration to STEP 7 & STEP 12
- [ ] Document in workflows and prompts
- [ ] Test end-to-end on real PR
- [ ] Create PR #XXXX

**Deliverable:** Complete v2.0 workflow tested and documented

### Phase 4: Future Enhancements (Ongoing) ⏳ FUTURE
- [ ] Build remaining Issue Agent skills (2-7)
- [ ] Create CI Error Diagnosis Skill
- [ ] Add scheduled label coverage audit
- [ ] Enhance changelog agent with more validation rules
- [ ] Add Slack notifications for audit results

**Deliverable:** Enhanced automation capabilities

---

## 🔧 Key Components

### Agents (Existing, to be Integrated)

| Agent | Location | Role | Status |
|-------|----------|------|--------|
| **Changelog Agent** | `agents/changelog/` | Validate Keep a Changelog 1.1.0 format | ✅ Complete, needs workflow integration |
| **PR Agent** | `agents/pr-creation-agent/` | PR creation & merge coordination | ✅ Complete, needs rename to `pr-agent` |
| **Issue Agent** | `scripts/automation/issue-agent/` | Issue lifecycle management | 🔄 Phase 2 skills in development, needs move to `agents/` |

### Skills (Existing, to be Integrated)

| Skill | Location | Role | Status |
|-------|----------|------|--------|
| **audit-label-coverage** | `skills/audit-label-coverage/` | Audit labels, recommend missing | ✅ Complete, 100% test coverage |
| **issue-type-allocator** | `skills/issue-type-allocator/` | Allocate issue types (35 types) | ✅ Complete, decision tree + examples |

### Instructions (Existing, to be Referenced)

| Instruction | Location | Role |
|-------------|----------|------|
| **pull-requests.instructions.md** | `instructions/` | PR creation, templates, branching |
| **labeling.instructions.md** | `instructions/` | Label strategy, enforcement |
| **issues.instructions.md** | `instructions/` | Issue creation, types, templates |

---

## 📝 Workflow Overview

### Old Workflow (v1.0) — 10 Steps
1. Fetch PR details
2. Apply review recommendations
3. Update PR template
4. Apply labels (manual)
5. Verify linked issue (manual)
6. Update issue status (manual)
7. Rebase if necessary
8. Final merge checks
9. Merge to develop
10. Post-merge cleanup

### New Workflow (v2.0) — 12 Steps with Agents/Skills
1. Fetch PR details
2. **Validate changelog** (Changelog Agent)
3. Apply review recommendations + fix CI
4. Update PR template
5. **Apply labels with audit recommendations** (Label Audit Skill)
6. **Allocate issue type** (Issue-Type Allocator Skill)
7. **Update linked issue** (Issue Agent)
8. Rebase if necessary
9. Final merge checks
10. **Merge with PR Agent coordination** (PR Agent)
11. **Document pre-existing CI failures** (Structured process)
12. **Post-merge cleanup** (Issue Agent)

---

## 🚀 Implementation Approach

### Step 1: Validate Integrations (Phase 1)
- Run agents on sample PRs
- Verify all skill recommendations work
- Document any issues or gaps
- Get team approval to proceed

### Step 2: Reorganize Agents (Phase 2)
**Rename: pr-creation-agent → pr-agent**
- Rationale: Agent handles both creation AND merging (full lifecycle)
- Files affected: ~50 (workflows, docs, instructions)
- Risk: LOW (straightforward rename with tests)

**Move: issue-agent to agents/ root**
- Rationale: Portable agents belong in `agents/`, not `scripts/`
- Files affected: ~30 (workflows, docs, imports)
- Risk: LOW (straightforward move with tests)

### Step 3: Integrate into Workflows (Phase 3)
- Add Changelog Agent to PR validation workflow
- Add Changelog Agent to release workflow
- Update PR finalization prompt to reference agents
- Test end-to-end on real PRs

### Step 4: Launch & Monitor (Phase 4+)
- Complete Issue Agent Phase 2 skills
- Create CI Error Diagnosis Skill
- Add scheduled audit workflows
- Monitor adoption and refine

---

## 📚 Related Documentation

### Key Files in This Project
- **AUDIT-FINDINGS.md** — Complete audit with 6 findings, risks, migration timeline
- **WORKFLOW-PROMPT.md** — The 12-step prompt (ready to use)
- **OPENSPEC.md** — Technical specification (to be created)
- **MIGRATION-CHECKLIST.md** — Detailed checklists (to be created)
- **RISK-ASSESSMENT.md** — Risk & mitigation (to be created)

### Repository References
- **Changelog Agent:** `agents/changelog/README.md`
- **PR Agent:** `agents/pr-creation-agent/` (rename to `pr-agent`)
- **Issue Agent:** `scripts/automation/issue-agent/README.md`
- **Label Audit Skill:** `skills/audit-label-coverage/SKILL.md`
- **Issue Type Skill:** `skills/issue-type-allocator/SKILL.md`
- **PR Instructions:** `instructions/pull-requests.instructions.md`
- **Label Instructions:** `instructions/labeling.instructions.md`

### Strategic Links
- **Keep a Changelog Standard:** https://keepachangelog.com/en/1.1.0/
- **GitHub Project:** (to be linked)
- **Epic Issue:** #2681 (to be created)

---

## 🎯 Success Criteria

Phase 1 succeeds when:
- ✅ Team reviews and approves audit findings
- ✅ All agents/skills tested on sample PRs
- ✅ No blocking issues discovered
- ✅ Migration timeline agreed upon

Phase 2 succeeds when:
- ✅ pr-creation-agent renamed to pr-agent (PR merged)
- ✅ issue-agent moved to agents/ (PR merged)
- ✅ All references updated and tested
- ✅ CI passing on both PRs

Phase 3 succeeds when:
- ✅ Changelog Agent integrated into workflows
- ✅ Label Audit used in PR finalization
- ✅ Issue Agent lifecycle automation working
- ✅ End-to-end test passes on real PR
- ✅ Prompt updated in production

---

## 📋 Active Issues

(To be created — see AUDIT-FINDINGS.md for issue descriptions)

### Phase 1 Planning Issues
- [ ] #2681 — **[EPIC]** PR Finalisation Workflow Modernization
- [ ] #2682 — **[PHASE 1]** Planning & Testing
  - Review audit findings
  - Validate agent/skill integrations
  - Test on sample PRs

### Phase 2 Agent Reorganization Issues
- [ ] #2683 — **[PHASE 2]** Rename pr-creation-agent → pr-agent
  - Update ~50 files
  - Test CI
  - Update references
- [ ] #2684 — **[PHASE 2]** Move issue-agent to agents/ root
  - Update ~30 files
  - Test CI
  - Update references

### Phase 3 Workflow Integration Issues
- [ ] #2685 — **[PHASE 3]** Integrate Changelog Agent into workflows
  - PR validation workflow
  - Release workflow
- [ ] #2686 — **[PHASE 3]** Integrate Label Audit into PR finalization
  - Update prompt
  - Test recommendations
- [ ] #2687 — **[PHASE 3]** Integrate Issue Agent into lifecycle
  - STEP 7 implementation
  - STEP 12 implementation
- [ ] #2688 — **[PHASE 3]** End-to-end testing on real PRs

### Phase 4 Future Enhancement Issues
- [ ] #2689 — **[PHASE 4]** Build Issue Agent Phase 2 skills (2-7)
- [ ] #2690 — **[PHASE 4]** Create CI Error Diagnosis Skill
- [ ] #2691 — **[PHASE 4]** Add scheduled label coverage audit

---

## 🔗 Two-Way Linking

Each GitHub issue will reference this project:
```markdown
**Related Project:** [PR Finalisation Workflow Modernization](.github/projects/active/pr-finalisation-workflow/)
**Phase:** [Phase N](.github/projects/active/pr-finalisation-workflow/README.md#-phase-progress)
```

This README will link to all issues:
- Phase 1 issues → #2682
- Phase 2 issues → #2683, #2684
- Phase 3 issues → #2685, #2686, #2687, #2688
- Phase 4 issues → #2689, #2690, #2691

---

## 📞 Support & Questions

- **Project Owner:** Ashley Shaw (@ashley@lightspeedwp.agency)
- **Epic Issue:** #2681
- **Project Folder:** `.github/projects/active/pr-finalisation-workflow/`
- **Slack Channel:** (to be determined)

---

**Last Updated:** 2026-09-04  
**Status:** Phase 1 — Planning & Testing  
**Next Milestone:** Complete Phase 1 validation (target: 2026-09-11)
