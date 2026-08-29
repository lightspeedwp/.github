---
file_type: planning
title: "Reporting Agent v2 Phase 6.2 — Staged Rollout & Canary Deployment"
description: "Three-phase rollout plan for Reporting Agent v2 with staged deployment, canary validation, monitoring, and rollback criteria."
created_date: "2026-08-29"
last_updated: "2026-08-29"
status: active
version: "v1.0"
owners:
  - LightSpeedWP Engineering
tags:
  - reporting-agent
  - rollout
  - canary
  - monitoring
stability: stable
domain: governance
---

# Reporting Agent v2 Phase 6.2 — Staged Rollout & Canary Deployment

## Objective

Deliver a low-risk, three-day rollout for Reporting Agent v2 using staged deployment, canary validation, and explicit rollback gates.

## Scope

- Internal staging validation with team testers
- Canary deployment to 1-2 production agents
- Full rollout to all reporting-dependent agents
- Monitoring and metrics capture at each phase
- Defined rollback triggers and execution path

## Rollout Timeline (3 Days, Concurrent)

| Day | Phase | Owner Group | Exit Gate |
| --- | --- | --- | --- |
| Day 1 | Phase 1: Internal staging | Reporting + QA maintainers | Staging checklist complete, no Sev1/Sev2 defects |
| Day 2 | Phase 2: Canary (1-2 agents) | Reporting + platform maintainers | Canary metrics pass for full observation window |
| Day 3 | Phase 3: Full rollout | Reporting + automation maintainers | Global metrics stable, no rollback triggers |

## Phase Plan

### Phase 1: Internal Staging (Team Testing)

**Deployment target:** Internal staging environment only.

**Required checks:**

- [ ] Run representative report generation workflows across supported repositories
- [ ] Validate output schema compatibility with downstream consumers
- [ ] Confirm rate limiting, retries, and cache behaviour under staged load
- [ ] Capture baseline latency, failure rate, and token/compute consumption

**Promotion criteria:**

- [ ] Zero Sev1/Sev2 issues
- [ ] Success rate >= 99%
- [ ] P95 execution time within agreed baseline tolerance

### Phase 2: Canary (1-2 Agents Using v2)

**Deployment target:** 1-2 selected production agents with controlled traffic.

**Required checks:**

- [ ] Restrict v2 to selected canary agents only
- [ ] Compare v2 outputs against v1 parity expectations
- [ ] Monitor canary error budgets, retries, and queue depth
- [ ] Verify no downstream workflow failures caused by v2 output

**Promotion criteria:**

- [ ] No sustained regression vs v1 on success rate or latency
- [ ] Error rate <= 1% over observation window
- [ ] No Sev1 incidents and no unresolved Sev2 incidents

### Phase 3: Full Rollout (All Agents)

**Deployment target:** All reporting-dependent agents.

**Required checks:**

- [ ] Gradually switch remaining agents to v2
- [ ] Continue live monitoring during and after cutover window
- [ ] Confirm all scheduled and on-demand report paths remain healthy
- [ ] Publish rollout completion summary with final metrics

**Completion criteria:**

- [ ] 100% target agent adoption
- [ ] No critical incident during 24-hour post-cutover period
- [ ] Rollback not triggered

## Monitoring & Metrics by Phase

| Metric | Phase 1 Target | Phase 2 Target | Phase 3 Target |
| --- | --- | --- | --- |
| Success rate | >= 99% | >= 99% | >= 99% |
| Error rate | <= 1% | <= 1% | <= 1% |
| P95 runtime | Within baseline tolerance | Within baseline tolerance | Within baseline tolerance |
| Retry volume | No abnormal spike | No abnormal spike | No abnormal spike |
| Downstream failures | 0 | 0 | 0 |

## Rollback Criteria

Trigger immediate rollback to v1 if any of the following occur:

- Sev1 incident at any point during canary or full rollout
- Error rate > 2% sustained for 15 minutes
- P95 runtime degradation > 30% sustained for 30 minutes
- Repeated downstream workflow breakage attributable to v2 output

## Rollback Procedure

1. Disable v2 for active rollout targets.
2. Restore v1 routing for impacted agents.
3. Announce rollback event and impact scope in engineering channels.
4. Preserve logs/metrics and open follow-up issue for root-cause analysis.
5. Resume rollout only after fix verification in staging and canary re-approval.

## Issue Tracking

- Parent issue: [#2044](https://github.com/lightspeedwp/.github/issues/2044)
- Closure: This plan addresses the staged rollout deliverables for Phase 6.2.
