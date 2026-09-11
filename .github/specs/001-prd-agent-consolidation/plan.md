# Implementation Plan: PRD Agent Consolidation (Phases 4-7)

**Spec Reference**: `spec.md`  
**Created**: 2026-09-10  
**Status**: Ready for task breakdown  
**Phase 3 Status**: ✅ COMPLETE (PR #2865, merged 2026-09-10)  
**Phases 4-7 Timeline**: Estimated 8-12 weeks

---

## Executive Summary

This plan outlines the delivery of Phases 4-7 of the PRD Agent Consolidation project, building on the completed structural foundation (Phase 3). All four remaining phases will be delivered using **stacked PRs** to enable parallel review, early feedback loops, and phase-isolated rollback capability.

**Key Milestones**:

- **Phase 4** (Weeks 1-2): Prompt enhancement and memory registry updates
- **Phase 5** (Weeks 3-5): Comprehensive testing across all providers
- **Phase 6** (Weeks 6-8): Organization-wide rollout and adoption tracking
- **Phase 7** (Weeks 9-12, conditional): Archive or sync spec-based agent (decision-based)

**Delivery Strategy**: Stacked PRs per phase, with phase-blocking dependencies to prevent out-of-order merges.

---

## Milestones & Timeline

### Phase 4: Prompt Enhancement & Memory Registry

**Duration**: Weeks 1-2 (10 business days)  
**Owner**: Ash Shaw (AI Agent Architecture)  
**Blocked By**: Phase 3 ✅ Complete  
**Deliverables**: Enhanced prompt, updated memory registry, benchmark metrics

**Stacked PR Stack**:

- `feat/prd-agent-phase4-prompt-enhancement` (prompt + tests)
- `feat/prd-agent-phase4-memory-registry` (registry updates)
- `feat/prd-agent-phase4-validation` (benchmarks, changelog, final validation)

**Success Criteria** (SC-401 to SC-404):

- [ ] Prompt enhancement documented in CHANGELOG.md with version bump
- [ ] Memory registry entries updated and validated (zero 404 errors)
- [ ] Test case success rate documented (baseline vs. improved delta ≥15%)
- [ ] All prompt files validated with zero syntax/loading errors

---

### Phase 5: Testing & Validation

**Duration**: Weeks 3-5 (15 business days)  
**Owner**: Ash Shaw (QA & Testing)  
**Blocked By**: Phase 4 merge complete  
**Deliverables**: Comprehensive test suite, provider validation reports, bug triage

**Stacked PR Stack**:

- `feat/prd-agent-phase5-test-suite` (test framework + suite)
- `feat/prd-agent-phase5-provider-testing` (execution harness + provider tests)
- `feat/prd-agent-phase5-quality-metrics` (results analysis, bug triage, documentation)

**Success Criteria** (SC-501 to SC-504):

- [ ] Test suite exists with ≥90% skill capability coverage
- [ ] Test pass rate ≥95% across all three providers (Claude, Copilot, OpenAI)
- [ ] All known bugs documented and triaged (none critical to release)
- [ ] Test results and metrics published in project documentation

---

### Phase 6: Rollout & Adoption

**Duration**: Weeks 6-12 (20 business days for rollout + 30 days adoption observation)  
**Owner**: Ash Shaw (Product & Adoption)  
**Blocked By**: Phase 5 testing complete + ≥95% pass rate  
**Deliverables**: Rollout comms, adoption tracking dashboard, feedback collection, 30-day adoption metrics

**Stacked PR Stack**:

- `feat/prd-agent-phase6-rollout-comms` (docs, guides, FAQ)
- `feat/prd-agent-phase6-adoption-tracking` (metrics setup, dashboards)
- `feat/prd-agent-phase6-feedback-collection` (survey, analysis, iteration backlog)

**Success Criteria** (SC-601 to SC-604):

- [ ] Rollout communication delivered to all teams
- [ ] At least 5 teams actively using consolidated agent after 30 days
- [ ] User satisfaction score ≥4.0/5.0 (surveyed sample)
- [ ] No critical blockers or regressions vs. Phase 3 baseline

---

### Phase 7: Optional Spec-Based Agent Sync/Archive (CONDITIONAL)

**Duration**: Weeks 9-12 (TBD; depends on Phase 6 decision)  
**Owner**: TBD (depends on decision outcome)  
**Blocked By**: Phase 6 adoption metrics and decision  
**Deliverables**: Archive or sync spec-based agent decision

**Stacked PR Stack** (conditional):

- `feat/prd-agent-phase7-archive-decision` (if archiving) OR
- `feat/prd-agent-phase7-sync-decision` (if syncing)

**Success Criteria** (SC-701 to SC-704):

- ✅ Decision documented and ratified by stakeholders
- ✅ All affected workflows and references updated
- ✅ `agents/mode-prd.agent.md` fate resolved (archived or synced)
- ✅ Decision rationale documented for future maintainers

---

## Stacked PR Working Strategy

### Branch Naming Convention

```
Phase 4 Stack (base: feat/prd-agent — Phase 3 merge commit)
├── feat/prd-agent-phase4-prompt-enhancement  [Stack Level 1]
├── feat/prd-agent-phase4-memory-registry     [Stack Level 2]
└── feat/prd-agent-phase4-validation          [Stack Level 3]
    ↓ Merge all 3 → main branch
    
Phase 5 Stack (base: Phase 4 merge commit)
├── feat/prd-agent-phase5-test-suite          [Stack Level 1]
├── feat/prd-agent-phase5-provider-testing    [Stack Level 2]
└── feat/prd-agent-phase5-quality-metrics     [Stack Level 3]
    ↓ Merge all 3 → main branch
    
Phase 6 Stack (base: Phase 5 merge commit)
├── feat/prd-agent-phase6-rollout-comms       [Stack Level 1]
├── feat/prd-agent-phase6-adoption-tracking   [Stack Level 2]
└── feat/prd-agent-phase6-feedback-collection [Stack Level 3]
    ↓ Merge all 3 → main branch
    
Phase 7 Stack (base: Phase 6 merge commit; CONDITIONAL)
└── feat/prd-agent-phase7-{archive|sync}-decision [Single PR or small stack]
    ↓ Merge → main branch (if Phase 6 decision calls for Phase 7)
```

### PR Sequencing & Review Process

1. **Phase Stack Creation** — All PRs in phase opened with explicit stack ordering
2. **Review & Merge Gates** — All PRs approved before any merge; merge all together
3. **CI/CD Integration** — Full stack tested together; fail-fast if any PR fails
4. **Parallel Work** — Next phase prep can start while current phase is in review

### Risk Mitigation

- **Branch naming makes phase order explicit** — Prevents accidental out-of-order merges
- **Stacked testing** — Conflicts discovered early; full chain validated
- **Phase isolation** — Each phase can be reverted independently
- **Merge gates** — All-or-nothing merge policy prevents partial phase rollouts

---

## Resource Allocation

| Role | Phase 4 | Phase 5 | Phase 6 | Phase 7 |
|------|---------|---------|---------|---------|
| **Project Owner** | Ash Shaw | Ash Shaw | Ash Shaw | Ash Shaw |
| **AI/Prompt Engineer** | Ash Shaw (10 days) | — | — | — |
| **QA/Test Engineer** | Support | Ash Shaw (15 days) | Support | Support |
| **Product/Communications** | Support | Support | Ash Shaw (15 days) | Support |

---

## Dependencies & Critical Path

```
Phase 3 ✅ (Complete)
    ↓ (BLOCKER: Phase 4 PRs must merge)
Phase 4 (Weeks 1-2, 10 days)
    ↓ (BLOCKER: Phase 5 requires ≥95% pass rate)
Phase 5 (Weeks 3-5, 15 days)
    ↓ (BLOCKER: Phase 6 adoption decision gates Phase 7)
Phase 6 (Weeks 6-8, 15 days)
    ↓ (CONDITIONAL: Phase 7 executes only if needed)
Phase 7 (Weeks 9-12, CONDITIONAL; 5-15 days)

Critical Path Duration: 8-12 weeks
```

---

## Success Validation Checkpoints

### Phase 4 Gate (End of Week 2)

- ✅ Enhanced prompt loads in Claude Code and Copilot
- ✅ Benchmark metrics documented (baseline vs. improved)
- ✅ Memory registry entries resolve without errors
- ✅ All Phase 4 PRs merged

### Phase 5 Gate (End of Week 5)

- ✅ Test suite covers ≥90% of skill capabilities
- ✅ Test pass rate ≥95% across all three providers
- ✅ No critical bugs blocking release
- ✅ All Phase 5 PRs merged

### Phase 6 Gate (End of Week 8)

- ✅ Rollout communication delivered to all teams
- ✅ ≥5 teams actively using consolidated agent
- ✅ User satisfaction score ≥4.0/5.0
- ✅ Phase 7 decision made (archive or sync)
- ✅ All Phase 6 PRs merged

### Phase 7 Gate (End of Week 12, conditional)

- ✅ Spec-based agent archived or synced as decided
- ✅ All references updated
- ✅ Decision documented for maintainers

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Prompt enhancement regresses quality | High | Benchmark all changes; revert if needed |
| Test suite finds critical bugs late | High | Test early (Week 3-4); triage immediately |
| Team adoption slow (<5 teams) | Medium | Plan briefings early; offer live support |
| Stacked PR merge conflict | Low | Test full stack; merge all together |
| Resource constraint | Medium | Cross-train backup; document procedures |
| Spec-based agent sync drift | Low | Monthly sync review; drift detection tool |

---

## Timeline Summary

```
Week 1-2:   Phase 4 (Prompt Enhancement) ............................ 10 days
Week 3-5:   Phase 5 (Testing & Validation) .......................... 15 days
Week 6-8:   Phase 6 (Rollout & Adoption) ............................ 15 days
Week 9-12:  Phase 7 (Conditional Sync/Archive) ...................... 5-15 days

Total Duration: 8-12 weeks (fixed timeline for Phases 4-6; Phase 7 conditional)
```

---

## Delivery Assumptions

- Phase 3 structural consolidation remains stable
- Team capacity: 1 full-time owner + supporting resources
- CI/CD infrastructure ready for stacked PR testing
- Stakeholder review available on 2-3 day turnaround
- Phase 7 deferred to Phase 6 feedback; no execution until adoption metrics clear

---

## Next Steps

1. **Task Breakdown** → Run `/speckit-tasks` to create detailed task lists
2. **Phase 4 Kickoff** → Set up PR infrastructure; begin work
3. **Weekly Check-ins** → Track against timeline; escalate blockers
4. **Phase Gate Reviews** → Formal sign-offs at end of each phase
