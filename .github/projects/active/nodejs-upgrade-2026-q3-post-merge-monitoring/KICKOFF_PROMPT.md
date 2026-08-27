---
title: Node.js 22 Post-Merge Monitoring — Kickoff Prompt
description: Self-contained prompt for initiating 3-day monitoring workflow
created_date: 2026-07-30
---

# Node.js 22 Post-Merge Monitoring — Kickoff Prompt

Use this prompt to begin the 3-day post-merge monitoring workflow. Each day's work is independent but sequential.

## Context

**Project:** Node.js 22 Upgrade Post-Merge Monitoring  
**Parent PR:** [#1420](https://github.com/lightspeedwp/.github/pull/1420) (merged to develop 2026-07-30)  
**Epic:** [#1432](https://github.com/lightspeedwp/.github/issues/1432)  
**Baseline:** 822 tests passing, 0 breaking changes, 1,013 packages updated  
**Monitoring Branch:** [PR #XXXX](https://github.com/lightspeedwp/.github/pull/XXXX)

## Your Mission

Execute 3-day post-merge monitoring to confirm Node.js 22 upgrade stability, detect edge cases, and verify no regressions.

**Total Time:** ~55 minutes (20 min Day 1 + 20 min Day 2 + 15 min Day 3)  
**Success:** All checklists pass → sign-off comment posted on PR #1420

---

## How to Use This Prompt

### For Agents (Recommended)

This workflow is designed for agent execution. Assign via:

```
Agent: Execute Node.js 22 post-merge monitoring

Read the CONTINUATION_PROMPT.md in the active project folder.
Execute the assigned day (1, 2, or 3).
Update the corresponding GitHub issue with completion status.
```

### For Manual Execution

1. **Day 1** — Open [DAY_1_MONITORING.md](./DAY_1_MONITORING.md)
   - Execute all 9 checks
   - Document results
   - Update [Issue #1433](https://github.com/lightspeedwp/.github/issues/1433) with status

2. **Day 2** — Open [DAY_2_MONITORING.md](./DAY_2_MONITORING.md)
   - Sample 2 recent workflow runs
   - Verify performance baselines
   - Update [Issue #1434](https://github.com/lightspeedwp/.github/issues/1434) with status

3. **Day 3** — Open [DAY_3_MONITORING.md](./DAY_3_MONITORING.md)
   - Confirm no regressions
   - Post sign-off comment on PR #1420
   - Update [Issue #1435](https://github.com/lightspeedwp/.github/issues/1435) with status & mark epic complete

---

## Key Resources

**Documentation:**

- [README.md](./README.md) — Project overview
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) — 3-day checklist
- [CONTINUATION_PROMPT.md](./CONTINUATION_PROMPT.md) — Agent execution guide
- [DAY_1_MONITORING.md](./DAY_1_MONITORING.md) — Detailed Day 1 instructions
- [DAY_2_MONITORING.md](./DAY_2_MONITORING.md) — Detailed Day 2 instructions
- [DAY_3_MONITORING.md](./DAY_3_MONITORING.md) — Detailed Day 3 instructions

**GitHub Links:**

- Epic: [#1432](https://github.com/lightspeedwp/.github/issues/1432)
- Day 1 Task: [#1433](https://github.com/lightspeedwp/.github/issues/1433)
- Day 2 Task: [#1434](https://github.com/lightspeedwp/.github/issues/1434)
- Day 3 Task: [#1435](https://github.com/lightspeedwp/.github/issues/1435)
- Monitoring PR: [#XXXX](https://github.com/lightspeedwp/.github/pull/XXXX)
- Parent PR: [#1420](https://github.com/lightspeedwp/.github/pull/1420)

---

## Success Criteria

**Daily:**

- [ ] Day 1: All 9 workflow checks pass
- [ ] Day 2: 2 sample runs verified, performance within baseline
- [ ] Day 3: No regressions, sign-off posted

**Final:**

- [ ] PR #1420 receives monitoring completion comment
- [ ] All 3 task issues closed
- [ ] Epic #1432 marked complete
- [ ] Project ready for post-deployment monitoring

---

## Troubleshooting

**If a check fails:**

- Document the failure in the issue
- Create a separate investigation issue if needed
- Escalate via the issue comments

**If Day 2 finds performance regression:**

- Check if it's consistent across both samples
- If >15% variance, escalate to DevOps
- Do NOT skip Day 3 — continue monitoring

**If Day 3 finds regressions:**

- Do NOT close the epic
- Create issue: `type:investigation` with details
- Link to workflow runs as evidence
- Request rollback OR fix recommendation

---

## Next Steps

1. ✅ Confirm this branch is active
2. ✅ Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for 3-day overview
3. ✅ Begin Day 1 monitoring per [DAY_1_MONITORING.md](./DAY_1_MONITORING.md)
4. ✅ Update [Issue #1433](https://github.com/lightspeedwp/.github/issues/1433) with Day 1 status

---

**Kickoff Date:** 2026-07-30  
**Monitoring Window:** 2026-07-30 to 2026-08-02  
**Owner:** DevOps / Infrastructure Team

Ready to begin! 🚀
