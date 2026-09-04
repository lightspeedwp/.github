---
file_type: "documentation"
title: "Reporting Agent v2 Integration Examples"
description: "Integration examples and usage guide for PRD Agent, Testing Agent, and Metrics Agent."
version: "v1.0"
last_updated: "2026-08-29"
owners: ["LightSpeed Team"]
tags: ["reporting-agent", "metrics", "integration", "prd-agent", "testing-agent"]
status: "active"
stability: "stable"
domain: "governance"
---

# Reporting Agent v2 Integration Examples

This guide demonstrates how other agents can consume Reporting Agent v2 formatted output.

## Overview

The helper module at `scripts/metrics/integrations/agent-integration-examples.js` provides three
deterministic payload builders:

1. `buildPrdAgentExample(rawMetrics, options)`
2. `buildTestingAgentExample(rawMetrics, options)`
3. `buildMetricsAgentExample(rawMetrics, options)`

## PRD Agent Example

Use this when you need a PRD-ready package containing executive summary, success metrics, risks, and recommended actions.

```javascript
// From the repository root:
const {
  buildPrdAgentExample,
} = require("./scripts/metrics/integrations/agent-integration-examples");

const prdInput = buildPrdAgentExample(rawMetrics, { reportType: "weekly" });
```

### Usage Guide

- Feed `prdInput.prdSections.executiveSummary` into your PRD summary section.
- Feed `prdInput.prdSections.successMetrics` into measurable outcomes.
- Feed `prdInput.prdSections.risks` into risks and mitigations.

## Testing Agent Example

Use this when you need scenario suggestions derived from anomalies in the reporting output.

```javascript
const {
  buildTestingAgentExample,
} = require("./scripts/metrics/integrations/agent-integration-examples");

const testingInput = buildTestingAgentExample(rawMetrics, { maxScenarios: 3 });
```

### Usage Guide

- Use `testingInput.qualityGate` to set urgency.
- Convert `testingInput.scenarios` into regression and remediation test tasks.
- Use `testingInput.nextSteps` to prioritise execution order.

## Metrics Agent Example

Use this when Metrics Agent needs a standard handoff payload for report publishing.

```javascript
const {
  buildMetricsAgentExample,
} = require("./scripts/metrics/integrations/agent-integration-examples");

const metricsHandoff = buildMetricsAgentExample(rawMetrics, {
  reportType: "monthly",
});
```

### Usage Guide

- Send `metricsHandoff.handoff.report` to report storage/publishing workflows.
- Persist `sourceType`, `context`, and `timestamp` alongside artefacts for traceability.
- Keep `reportType` aligned with workflow schedule (weekly, monthly, quarterly).

## Validation

Run integration validation tests:

```bash
npm test -- scripts/metrics/integrations/__tests__/agent-integration-examples.test.js
```

This suite includes 46 tests for payload shape, defaults, option handling, and downstream mapping.
