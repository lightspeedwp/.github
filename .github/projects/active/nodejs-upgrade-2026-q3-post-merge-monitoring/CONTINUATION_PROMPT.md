---
title: Continuation Prompt for Agent Execution
description: Self-contained prompt for agents to execute monitoring
created_date: 2026-07-30
---

# Post-Merge Monitoring — Agent Continuation Prompt

Use this prompt to assign monitoring work to an agent.

## Context

- **Project:** Node.js 22 Upgrade Post-Merge Monitoring
- **Parent PR:** #1420 (merged to develop on 2026-07-30)
- **Baseline:** 822 tests passing, 0 breaking changes
- **Owner:** DevOps / Infrastructure

## Instructions

Execute the monitoring based on which day it is:

**Day 1 (Today):** Follow [DAY_1_MONITORING.md](./DAY_1_MONITORING.md)

- Check critical workflows (checks, release, meta, changelog)
- Verify Node version in all logs (v22.x expected)
- Detect edge cases (release.yml using lts/*)
- Sign off when complete

**Day 2 (Tomorrow):** Follow [DAY_2_MONITORING.md](./DAY_2_MONITORING.md)

- Sample 2 recent checks.yml runs
- Verify performance ±15% baseline
- Confirm 822/822 tests in both
- Sign off when complete

**Day 3 (Day After):** Follow [DAY_3_MONITORING.md](./DAY_3_MONITORING.md)

- Search for 0 new Node version issues
- Run `npm test` locally (must pass)
- Check edge cases (release, metrics)
- Post final sign-off comment on PR #1420

## Sign-Off Criteria

**Daily:** Complete all checklist items for that day  
**Final:** All 3 days complete = post sign-off comment on PR #1420

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for 3-day checklist.
