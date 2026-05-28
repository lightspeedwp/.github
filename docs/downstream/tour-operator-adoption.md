---
file_type: "documentation"
title: "Tour Operator Pilot Telemetry And Opt-Out Adoption Guide"
description: "Baseline checklist, telemetry metrics, opt-out points, and dashboard stub for Tour Operator pilot adoption."
version: "v0.1.1"
last_updated: "2026-05-28"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
tags: ["tour-operator", "telemetry", "adoption", "workflows", "metrics"]
status: "active"
stability: "incubating"
domain: "governance"
---

# Tour Operator Pilot Telemetry And Opt-Out Adoption Guide

This guide defines the pilot telemetry workflow for Tour Operator adoption,
including baseline setup, emitted metrics, and explicit opt-out controls.

## Baseline Checklist

- [ ] Confirm workflow is enabled only for pilot repositories/environments.
- [ ] Confirm repository-level telemetry policy alignment in [METRICS.md](../METRICS.md).
- [ ] Confirm no personal telemetry is captured (users, keystrokes, editor events).
- [ ] Confirm metrics schema and event names are documented before rollout.
- [ ] Confirm opt-out toggles are available and tested (global, repo, workflow step).
- [ ] Confirm dry-run mode is available for validation without emitting events.
- [ ] Confirm changelog and release notes include telemetry-impact summary.

## Target Metrics For Pilot

| Metric | Type | Source | Purpose |
| --- | --- | --- | --- |
| `tour_operator_runs_total` | Counter | Workflow run completion | Track adoption volume over time |
| `tour_operator_runs_success_total` | Counter | Workflow success outcome | Track successful execution ratio |
| `tour_operator_runs_failure_total` | Counter | Workflow failure outcome | Identify reliability issues |
| `tour_operator_opt_out_total` | Counter | Opt-out path execution | Measure explicit opt-out usage |
| `tour_operator_duration_ms` | Histogram | Workflow timing capture | Monitor execution performance |
| `tour_operator_docs_ref_total` | Counter | Docs-linked run metadata | Validate documentation-guided use |

## Opt-Out Points (Documented)

### 1. Global Opt-Out

Set environment variable `LS_TELEMETRY_DISABLED=true` to disable emission for all
Tour Operator telemetry events.

### 2. Repository Opt-Out

Set repository variable `LS_TOUR_OPERATOR_TELEMETRY=off` to disable emission for
that repository while preserving workflow functionality.

### 3. Per-Run Opt-Out

Set workflow input `telemetry_enabled: false` for a single manual run.

### 4. Step-Level Opt-Out

Wrap telemetry steps in workflow conditions, for example:

```yaml
if: ${{ env.LS_TELEMETRY_DISABLED != 'true' && vars.LS_TOUR_OPERATOR_TELEMETRY != 'off' && inputs.telemetry_enabled != false }}
```

## Metrics Emission Example

Use a structured JSON payload per event for downstream parsing:

```json
{
  "event": "tour_operator.run.completed",
  "timestamp": "2026-05-28T00:00:00Z",
  "repo": "lightspeedwp/.github",
  "workflow": "tour-operator",
  "run_id": "1234567890",
  "status": "success",
  "duration_ms": 18420,
  "telemetry_enabled": true,
  "opt_out_reason": null
}
```

## Dashboard Consumption Stub

The dashboard consumer can read line-delimited JSON metrics and aggregate by
date, repository, and status.

```js
// docs/downstream/stubs/tour-operator-dashboard-consumer.js (stub)
export function aggregateTourOperatorMetrics(events) {
  return events.reduce(
    (acc, event) => {
      acc.total += 1;
      if (event.status === "success") acc.success += 1;
      if (event.status === "failure") acc.failure += 1;
      if (event.telemetry_enabled === false) acc.optOut += 1;
      return acc;
    },
    { total: 0, success: 0, failure: 0, optOut: 0 },
  );
}
```

## Accessibility And Discoverability

- Keep this guide linked from execution plans and telemetry governance docs.
- Use plain, direct wording for opt-out behaviour and defaults.
- Document any telemetry changes in `CHANGELOG.md` before release.

## Related References

- [Metrics Policy](../METRICS.md)
- [Release Process](../RELEASE_PROCESS.md)
- [Automation Governance](../AUTOMATION_GOVERNANCE.md)

## Pilot Closeout Status

- Issue tracking: [#60](https://github.com/lightspeedwp/.github/issues/60)
- Initial implementation merged into `develop` via commit `1c63a26`.
- This document is the canonical pilot reference for telemetry and opt-outs.
