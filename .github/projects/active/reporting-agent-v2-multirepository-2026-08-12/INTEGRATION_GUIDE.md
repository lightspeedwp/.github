---
file_type: documentation
title: "Reporting Agent v2 Integration Guide"
description: "Comprehensive integration handbook for embedding Reporting Agent v2 in other agents and automations."
version: "v1.0"
last_updated: "2026-08-29"
owners: ["LightSpeed Team"]
tags: ["reporting", "integration", "agent", "javascript", "async-await", "troubleshooting"]
status: "active"
stability: "stable"
domain: "governance"
---


# Reporting Agent v2 Integration Guide

This guide explains how to integrate Reporting Agent v2 into other LightSpeed agents, scripts, and
GitHub automation flows. It is written for engineers who need deterministic outputs, predictable
report locations, and safe operational behaviour in a multi-repository environment. The objective is
to
make integration straightforward while still giving enough depth for production hardening.

The guide covers quick start setup, configuration strategy, API reference details, async JavaScript
patterns, best practices, troubleshooting, performance tuning, quality gates, and migration advice
from
v1-style usage. All examples assume Node.js 24+ and the tooling already used in this repository.

Where examples show wrappers around synchronous APIs, the wrapper exists to give a consistent async
interface for orchestrator code. This allows integrators to compose Reporting Agent v2 with
networked
steps, retries, and concurrency control using the same async/await style used elsewhere in
automation
pipelines.

## Table of Contents

- [1. Audience and Scope](#1-audience-and-scope)
- [2. Architecture Overview](#2-architecture-overview)
- [3. Quick Start](#3-quick-start)
- [4. Configuration Guide](#4-configuration-guide)
- [5. API Reference](#5-api-reference)
- [6. Integration Patterns](#6-integration-patterns)
- [7. Async JavaScript Examples](#7-async-javascript-examples)
- [8. Best Practices](#8-best-practices)
- [9. Troubleshooting](#9-troubleshooting)
- [10. Validation and Quality Gates](#10-validation-and-quality-gates)
- [11. Security and Data Handling](#11-security-and-data-handling)
- [12. Migration from v1](#12-migration-from-v1)
- [13. Operational Runbook](#13-operational-runbook)
- [14. Extended Integration Recipes](#14-extended-integration-recipes)
- [15. FAQ](#15-faq)
- [16. Glossary](#16-glossary)
- [17. Cross-References](#17-cross-references)
- [18. Integration Case Studies](#18-integration-case-studies)

## 1. Audience and Scope

This document is for maintainers of automation agents, workflow authors, and engineers responsible
for
report governance in the LightSpeed control-plane repository. It assumes familiarity with
JavaScript,
Node.js, and repository structure conventions under `.github/`.

In scope:
- Integrating the reporting agent implementation in `scripts/agents/reporting.agent.js`.
- Integrating metrics formatting helpers in `scripts/metrics/integrations/reporting-agent-input.js`.
- Producing compliant report artefacts with frontmatter and predictable naming.
- Running markdown and frontmatter validation checks before merge.

Out of scope:
- Re-architecting the reporting system.
- Introducing new toolchains.
- Cross-repo deployment automation changes not directly needed for integration.

## 2. Architecture Overview

Reporting Agent v2 integration is split into two complementary parts. The first part is report
generation
and file lifecycle management, implemented by the reporting agent module. The second part is metrics
normalisation, implemented by the metrics report formatter.

The reporting agent module is responsible for building frontmatter, generating report templates,
validating report shape, writing files to category-specific paths, and handling archival operations.
Its design is deterministic: given the same inputs, it produces stable output and predictable
category
placement.

The metrics formatter transforms raw metrics payloads into a structured object that reporting
consumers can
render safely. It standardises periods, trends, anomalies, recommendations, and health component
status
labels so downstream agents can avoid re-implementing this logic.

### 2.1 Data Flow

```text
Raw Metrics / Inputs
        |
        v
MetricsReportFormatter (optional pre-processing)
        |
        v
Reporting Agent generate/spec/save/validate/archive
        |
        v
.github/reports/<category>/<file>.md or .spec.md
        |
        v
Validation Gates (lint:md, validate:frontmatter)
```

### 2.2 Module Map

- `scripts/agents/reporting.agent.js`
  - `generateFrontmatter(options)`
  - `generateReport(options)`
  - `generateSpecFile(options)`
  - `determineCategory(content)`
  - `getReportPath(category, filename)`
  - `sanitiseFilename(filename)`
  - `saveReport(content, filename, category)`
  - `validateReport(content)`
  - `archiveReport(reportPath)`
  - `runAgent(context)`
- `scripts/metrics/integrations/reporting-agent-input.js`
  - `formatForReportingAgent(rawMetrics, reportType)`
  - `generateWeeklyReport(rawMetrics)`
  - `generateMonthlyReport(rawMetrics)`
  - `generateQuarterlyReport(rawMetrics)`
  - `generateContextReport(rawMetrics, context)`


## 3. Quick Start

Use this quick start when you need working integration in minutes. It creates a report from
structured
inputs, saves it to the correct category, and validates output before committing changes.

### 3.1 Minimal Setup

```javascript
import {
  generateReport,
  saveReport,
  validateReport,
} from "../../scripts/agents/reporting.agent.js";

const report = generateReport({
  title: "weekly-quality-summary",
  description: "Weekly quality and automation summary.",
  category: "metrics",
  summary: "All core validation workflows completed successfully.",
  metrics: [
    { metric: "Lint jobs", value: "12", status: "pass" },
    { metric: "Docs checks", value: "18", status: "pass" },
  ],
  details: "No blocking failures. Two warnings require follow-up triage.",
  recommendations: ["Prioritise warning triage by Friday"],
  author: "automation",
  tags: ["metrics", "weekly"],
});

const validation = validateReport(report);
if (!validation.valid) {
  throw new Error(`Report invalid: ${validation.errors.join(", ")}`);
}

const result = saveReport(report, "weekly-summary-2026-w35.md", "metrics");
if (!result.success) {
  throw new Error(result.error);
}

console.log(`Report saved to: ${result.path}`);
```

### 3.2 Async Wrapper Quick Start

```javascript
import {
  generateReport,
  saveReport,
  validateReport,
} from "../../scripts/agents/reporting.agent.js";

async function generateAndPersistReport(input) {
  const report = generateReport(input);
  const validation = validateReport(report);

  if (!validation.valid) {
    throw new Error(`Invalid report: ${validation.errors.join(" | ")}`);
  }

  const saveResult = await Promise.resolve(
    saveReport(report, input.filename, input.category),
  );

  if (!saveResult.success) {
    throw new Error(saveResult.error);
  }

  return saveResult.path;
}

await generateAndPersistReport({
  title: "integration-ready-report",
  description: "Example async wrapper",
  category: "agents",
  summary: "Generated through async orchestration wrapper.",
  details: "Wrapper allows consistent error propagation in async pipelines.",
  filename: "integration-ready-report-2026-08-29.md",
});
```

## 4. Configuration Guide

Configuration in Reporting Agent v2 is largely input-driven rather than global-state driven. This is
intentional: configuration is explicit at call sites, which reduces hidden coupling between
independent
agents. A stable integration should therefore define a lightweight configuration object and map it
to the
module functions at the orchestration boundary.

### 4.1 Category strategy

Choose categories that match repository governance semantics. Use `agents` for agent execution logs,
`metrics` for periodic health summaries, and `validation` for schema or compliance checks. Avoid
free-form category names because they break deterministic storage and downstream discoverability.

### 4.2 Filename policy

Always precompute filenames using kebab-case plus date or period. The module sanitiser is defensive,
not a naming policy substitute. If your orchestrator owns naming, output paths remain easier to
query and audit.

### 4.3 Frontmatter ownership

Pass explicit title, description, author, and tags when generating reports. Relying on defaults may
be acceptable for experimentation but is weak for production metadata governance.

### 4.4 Validation mode

Call `validateReport` before `saveReport`, and treat validation errors as hard failures. Warnings
can be logged but should not be ignored repeatedly because they accumulate technical debt.

### 4.5 Archive policy

Use `archiveReport` only after replacement artefacts are successfully generated and linked. Archival
should be a conscious lifecycle action, not part of baseline report creation.

### 4.6 Metrics formatting

When consuming raw metrics payloads, use `MetricsReportFormatter` first so reports and dashboards
share one normalisation path. This prevents category-level divergence in labels and status
semantics.

### 4.7 Example Integration Config Object

```javascript
export const reportingIntegrationConfig = {
  defaultCategory: "agents",
  strictValidation: true,
  failOnWarnings: false,
  filenamePattern: "{slug}-{date}.md",
  dateFormat: "YYYY-MM-DD",
  allowedCategories: [
    "agents",
    "analysis",
    "audits",
    "implementation",
    "migration",
    "validation",
    "coverage",
    "frontmatter",
    "issue-metrics",
    "labeling",
    "linting",
    "mermaid",
    "meta",
    "metrics",
    "optimisation",
    "progress",
    "tech-debt",
  ],
};
```

## 5. API Reference

This section documents function signatures, responsibilities, key input fields, output shapes, and
error
behaviour for the current integration surface. The reference is written against the implementation
used in
this repository.

### 5.1 `generateFrontmatter(options)`

- Purpose: Build YAML frontmatter for report artefacts.
- Required inputs: title, description, category.
- Optional inputs: author (defaults to automation), tags (defaults to empty array).
- Returns: string containing YAML frontmatter block.
- Integration note: Use when you need frontmatter without full report body generation.

### 5.2 `generateReport(options)`

- Purpose: Assemble full Markdown report using standard sections.
- Inputs: title, description, category, summary, metrics, details, recommendations, references, author, tags.
- Returns: complete Markdown document string.
- Metrics are rendered as a table when provided.
- Integration note: Main path for human-readable report generation.

### 5.3 `generateSpecFile(options)`

- Purpose: Generate a `.spec.md` style document for JSON outputs.
- Inputs: jsonFile, purpose, generation, schema, usage, example, category, relatedFiles.
- Returns: complete Markdown specification string.
- Integration note: Use whenever your integration emits JSON artefacts that require documentation.

### 5.4 `determineCategory(content)`

- Purpose: Infer category from free text content.
- Input: content string.
- Returns: category string from known mapping; defaults to `agents`.
- Integration note: Best used for fallback classification, not primary governance control.

### 5.5 `getReportPath(category, filename)`

- Purpose: Resolve absolute report path based on category mapping.
- Input: category and filename.
- Returns: joined path rooted at process working directory.
- Integration note: Useful for dry-run previews and path assertions in tests.

### 5.6 `sanitiseFilename(filename)`

- Purpose: Convert names to lowercase hyphen-safe filenames.
- Input: raw filename string.
- Returns: sanitised filename.
- Integration note: Apply once near save boundary to avoid double transformation surprises.

### 5.7 `saveReport(content, filename, category)`

- Purpose: Persist generated report to category path.
- Creates target directory recursively if missing.
- Returns: `{ success: true, path }` or `{ success: false, error }`.
- Integration note: Wrap in central error handler so file-system failures are visible in CI logs.

### 5.8 `validateReport(content)`

- Purpose: Validate presence of frontmatter and required keys.
- Returns: `{ valid, errors, warnings }`.
- Checks mandatory keys including file_type, title, description, category, created_date.
- Integration note: Treat invalid output as blocking and warnings as follow-up actions.

### 5.9 `archiveReport(reportPath)`

- Purpose: Move report to local archive folder and mark as archived in frontmatter.
- Returns: success/newPath or error object.
- Integration note: Avoid archiving while consumers still reference original path.

### 5.10 `runAgent(context)`

- Purpose: Unified action dispatcher for generate/spec/validate/archive/save.
- Input: `{ action, options }`.
- Returns action-specific object with `ok` and payload fields.
- Integration note: Preferred when orchestrator wants one entry point over direct function calls.

### 5.11 `MetricsReportFormatter` Reference

`MetricsReportFormatter` converts raw metrics datasets into structured report-ready objects. Key
methods
include `formatForReportingAgent`, `generateWeeklyReport`, `generateMonthlyReport`,
`generateQuarterlyReport`, and helper methods for trends, anomalies, and recommendation projections.
For
integrations that consume analytics payloads, this formatter should run before report rendering so
all
consumers share consistent field naming and status semantics.

## 6. Integration Patterns

### 6.1 Single-step generation

The single-step generation pattern is useful when integrating Reporting Agent v2 with heterogeneous
automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.2 Two-step generate then save

The two-step generate then save pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.3 Strict validate before save

The strict validate before save pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.4 Fallback category classification

The fallback category classification pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.5 Metrics-first formatting pipeline

The metrics-first formatting pipeline pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.6 JSON spec sidecar generation

The json spec sidecar generation pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.7 Archive-and-replace lifecycle

The archive-and-replace lifecycle pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.8 Batch report processing

The batch report processing pattern is useful when integrating Reporting Agent v2 with heterogeneous
automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.9 Per-category orchestrator routing

The per-category orchestrator routing pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.10 Dry-run path preview

The dry-run path preview pattern is useful when integrating Reporting Agent v2 with heterogeneous
automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.11 Idempotent regeneration by date

The idempotent regeneration by date pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

### 6.12 Failure-aware retry envelope

The failure-aware retry envelope pattern is useful when integrating Reporting Agent v2 with
heterogeneous automation
surfaces. Implement it by keeping the reporting boundary narrow: collect inputs, generate output,
validate, then persist. If your pipeline contains network calls, isolate those steps before the
report
module so file generation remains deterministic and easy to test.

Operationally, emit structured logs around each boundary. Include action type, category, filename,
validation outcome, and elapsed time. These fields give enough context for runbook diagnosis without
logging sensitive payload details. For production, treat missing mandatory metadata as configuration
defects, not runtime surprises, and fail fast with actionable error text.

## 7. Async JavaScript Examples

Although parts of the current implementation are synchronous, most orchestrators in this repository
are
async. The following examples show safe wrappers and integration patterns using async/await so
calling
code can remain consistent and composable.

### 7.1 Promise-wrapped generate/validate/save

```javascript
import {
  generateReport,
  validateReport,
  saveReport,
} from "../../scripts/agents/reporting.agent.js";

export async function createReportAsync(options) {
  const report = await Promise.resolve(generateReport(options));
  const validation = await Promise.resolve(validateReport(report));

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join("; ")}`);
  }

  const saved = await Promise.resolve(
    saveReport(report, options.filename, options.category),
  );

  if (!saved.success) {
    throw new Error(`Save failed: ${saved.error}`);
  }

  return { path: saved.path, warnings: validation.warnings };
}
```

### 7.2 Concurrent report generation with bounded fan-out

```javascript
import pLimit from "p-limit";
import { createReportAsync } from "./create-report-async.js";

const limit = pLimit(3);

export async function createReportsInParallel(reportJobs) {
  const tasks = reportJobs.map((job) =>
    limit(async () => {
      const result = await createReportAsync(job);
      return { id: job.id, ...result };
    }),
  );

  return Promise.all(tasks);
}
```

### 7.3 Async metrics normalisation before rendering

```javascript
const MetricsReportFormatter = require(
  "../../scripts/metrics/integrations/reporting-agent-input"
);
import { createReportAsync } from "./create-report-async.js";

export async function createWeeklyMetricsReport(rawMetrics) {
  const formatter = new MetricsReportFormatter();
  const formatted = await Promise.resolve(
    formatter.formatForReportingAgent(rawMetrics, "weekly"),
  );

  return createReportAsync({
    title: "weekly-metrics-summary",
    description: "Weekly metrics summary derived from raw telemetry.",
    category: "metrics",
    filename: "weekly-summary-2026-w35.md",
    summary: `Health score: ${formatted.executive_summary.healthScore}`,
    details: JSON.stringify(formatted, null, 2),
    tags: ["metrics", "weekly", "automation"],
  });
}
```

### 7.4 Resilient async orchestration with retries

```javascript
import { createReportAsync } from "./create-report-async.js";

async function withRetries(fn, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
  throw lastError;
}

export async function createReportWithRetry(options) {
  return withRetries(() => createReportAsync(options), 3);
}
```

### 7.5 Async validation gate in CI script

```javascript
import fs from "node:fs/promises";
import { validateReport } from "../../scripts/agents/reporting.agent.js";

export async function validateGeneratedFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const result = validateReport(content);

  if (!result.valid) {
    throw new Error(
      `Invalid report ${filePath}: ${result.errors.join(" | ")}`,
    );
  }

  return result;
}
```

## 8. Best Practices

### 8.1 Keep report payloads explicit and small

Keep report payloads explicit and small helps teams maintain reliability as integrations scale. In
practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.2 Prefer stable category mappings over inferred categories

Prefer stable category mappings over inferred categories helps teams maintain reliability as
integrations scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.3 Validate before save, and lint after save

Validate before save, and lint after save helps teams maintain reliability as integrations scale. In
practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.4 Separate generation from publication steps

Separate generation from publication steps helps teams maintain reliability as integrations scale.
In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.5 Use deterministic filenames with dates or run IDs

Use deterministic filenames with dates or run IDs helps teams maintain reliability as integrations
scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.6 Centralise error handling in orchestrators

Centralise error handling in orchestrators helps teams maintain reliability as integrations scale.
In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.7 Avoid embedding secrets in report content

Avoid embedding secrets in report content helps teams maintain reliability as integrations scale. In
practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.8 Keep markdown sections predictable for downstream parsing

Keep markdown sections predictable for downstream parsing helps teams maintain reliability as
integrations scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.9 Document JSON artefacts with specification files

Document JSON artefacts with specification files helps teams maintain reliability as integrations
scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.10 Treat warnings as debt and schedule follow-up

Treat warnings as debt and schedule follow-up helps teams maintain reliability as integrations
scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.11 Use async wrappers for orchestration consistency

Use async wrappers for orchestration consistency helps teams maintain reliability as integrations
scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

### 8.12 Include actionable recommendations in every report

Include actionable recommendations in every report helps teams maintain reliability as integrations
scale. In practice, this means enforcing clear
contracts at module boundaries and avoiding implicit behaviour that changes across environments.

For reviewability, keep implementation details out of frontmatter and place operational context in
structured sections. This keeps reports readable for humans while preserving machine-friendly
metadata for
validation, search, and downstream automation consumers.

## 9. Troubleshooting

### 9.1 Unsupported report type

`MetricsReportFormatter.formatForReportingAgent` throws when reportType does not map to a known
generator. Ensure values are one of weekly, monthly, quarterly, or call context-specific helpers
directly.

### 9.2 Report saved in wrong category

Use explicit category in save path and avoid over-reliance on `determineCategory`. Inferred
categorisation is a fallback and may not match governance expectations for edge wording.

### 9.3 Validation fails with missing frontmatter fields

Confirm generated output starts with `---` and includes file_type, title, description, category, and
created_date. If composing custom templates, inject frontmatter from `generateFrontmatter`.

### 9.4 Filename sanitisation surprises

The sanitiser removes unsupported characters and lowercases names. Precompute filename slugs in
orchestrator code so resulting names are expected by dashboards and links.

### 9.5 Archive operation cannot find file

Verify absolute path resolution and current working directory assumptions. Call `getReportPath` to
compute target path before archival and check existence before moving.

### 9.6 Markdown lint failures after generation

Generated tables and long lines can fail lint. Wrap long prose naturally, ensure fenced code blocks
have language tags, and maintain heading order with one H1 per file.

### 9.7 Frontmatter validation fails in CI but not locally

Check Node.js version and repository scripts parity. Run `npm run validate:frontmatter` and `npm run
lint:md` in the same environment as CI where possible.

### 9.8 Inconsistent trend values in metrics reports

Normalise all raw payloads through one formatter version. Mixed formatter versions or partial object
shapes can produce mismatched trend fields.

### 9.9 Slow batch runs

Bound concurrency and avoid writing extremely large details blocks per report. Emit summary reports
with linked deep artefacts instead of embedding full payload dumps.

### 9.10 Unexpected default author value

If author is omitted, frontmatter defaults to automation. Set author explicitly where ownership
traceability is required by governance checks.

## 10. Validation and Quality Gates

After integrating Reporting Agent v2, run repository-native checks rather than introducing new
tooling.
For documentation-heavy changes, the minimum gates are markdown linting and frontmatter validation.

```bash
npm run lint:md
npm run validate:frontmatter
```

If your integration also changes JavaScript code, run focused tests nearest the updated module
before
running broad suites. Keep test scope targeted to reduce feedback time while preserving confidence.

## 11. Security and Data Handling

Treat all inbound metrics and content as untrusted. Validate structure at ingestion boundaries, and
escape
or sanitise output where report content may later be rendered in web contexts. Do not include
secrets,
access tokens, personal data, or customer-sensitive information in generated artefacts.

For operational logs, record identifiers and status values rather than full payloads. This supports
diagnosis without leaking sensitive details. Apply least privilege for any credentials used upstream
in
metrics collection, and ensure reporting steps only receive the fields needed for summarisation.

## 12. Migration from v1

### 12.1 Migration Step 1

Move from implicit report placement to explicit category-based save calls. During migration, keep
behaviour toggles small and reversible so rollback remains simple.

### 12.2 Migration Step 2

Replace ad hoc markdown templates with `generateReport` for consistent sections. During migration,
keep behaviour toggles small and reversible so rollback remains simple.

### 12.3 Migration Step 3

Introduce pre-save validation with `validateReport` and fail-fast handling. During migration, keep
behaviour toggles small and reversible so rollback remains simple.

### 12.4 Migration Step 4

Adopt filename sanitisation as a defensive layer, not a naming policy. During migration, keep
behaviour toggles small and reversible so rollback remains simple.

### 12.5 Migration Step 5

Normalise metrics payloads with `MetricsReportFormatter` before rendering. During migration, keep
behaviour toggles small and reversible so rollback remains simple.

### 12.6 Migration Step 6

Use async wrappers in orchestration code for uniform pipeline composition. During migration, keep
behaviour toggles small and reversible so rollback remains simple.

### 12.7 Migration Step 7

Document JSON outputs using `generateSpecFile` to satisfy governance expectations. During migration,
keep behaviour toggles small and reversible so rollback remains simple.

## 13. Operational Runbook

### 13.1 Runbook Action 1

Confirm integration config and allowed categories before deployment.

### 13.2 Runbook Action 2

Run dry-run generation and inspect computed output paths.

### 13.3 Runbook Action 3

Enable strict validation and treat invalid output as blocking.

### 13.4 Runbook Action 4

Run markdown and frontmatter checks in CI and locally.

### 13.5 Runbook Action 5

Monitor file creation volume and archive growth by category.

### 13.6 Runbook Action 6

Record recurring warnings and assign owners for remediation.

### 13.7 Runbook Action 7

Review report examples quarterly to keep templates relevant.

### 13.8 Runbook Action 8

Pin formatter and agent module versions for reproducibility.

## 14. Extended Integration Recipes

### 14.1 Daily progress report pipeline

Use the daily progress report pipeline recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.2 Weekly quality scorecard pipeline

Use the weekly quality scorecard pipeline recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.3 Multi-category compliance digest

Use the multi-category compliance digest recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.4 PR-centric validation digest

Use the pr-centric validation digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.5 Issue triage trend brief

Use the issue triage trend brief recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.6 Release readiness board report

Use the release readiness board report recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.7 Documentation quality pulse

Use the documentation quality pulse recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.8 Labeling governance snapshot

Use the labeling governance snapshot recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.9 Frontmatter conformance tracker

Use the frontmatter conformance tracker recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.10 Mermaid accessibility watch

Use the mermaid accessibility watch recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.11 Cross-project implementation summary

Use the cross-project implementation summary recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.12 Agent execution health digest

Use the agent execution health digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.13 Automation incident timeline report

Use the automation incident timeline report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.14 Stale report archival cycle

Use the stale report archival cycle recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.15 Monthly engineering narrative

Use the monthly engineering narrative recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.16 Quarterly leadership digest

Use the quarterly leadership digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.17 Repository onboarding report

Use the repository onboarding report recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.18 Contributor activity digest

Use the contributor activity digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.19 CI drift early warning

Use the ci drift early warning recipe when you need a repeatable reporting flow with minimal custom
code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.20 Schema validation roll-up

Use the schema validation roll-up recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.21 Backlog pressure summary

Use the backlog pressure summary recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.22 Code quality trendline brief

Use the code quality trendline brief recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.23 Escalation-oriented blocker report

Use the escalation-oriented blocker report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.24 Performance regression tracker

Use the performance regression tracker recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.25 Operational hygiene checklist report

Use the operational hygiene checklist report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.26 Multi-repository metadata roll-up

Use the multi-repository metadata roll-up recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.27 Post-incident retrospective report

Use the post-incident retrospective report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.28 Task completion reliability report

Use the task completion reliability report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.29 Workflow adoption tracker

Use the workflow adoption tracker recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.30 Dependency risk overview

Use the dependency risk overview recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.31 Release note seed report

Use the release note seed report recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.32 Audit preparation report

Use the audit preparation report recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.33 Cross-team handover summary

Use the cross-team handover summary recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.34 KPI change explanation brief

Use the kpi change explanation brief recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.35 Action owner accountability report

Use the action owner accountability report recipe when you need a repeatable reporting flow with
minimal custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.36 Control-plane status digest

Use the control-plane status digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.37 Repo health launch packet

Use the repo health launch packet recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.38 Experiment outcome digest

Use the experiment outcome digest recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.39 Playbook adherence report

Use the playbook adherence report recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

### 14.40 Continuous improvement ledger

Use the continuous improvement ledger recipe when you need a repeatable reporting flow with minimal
custom code. Start by
mapping raw inputs to a stable internal shape, then call the formatter only if metric normalisation
is
needed. Next, generate a report with explicit metadata, validate, and save to the correct category.

For operational resilience, add clear ownership fields, deterministic naming, and retry logic around
file
writes if your environment has intermittent IO pressure. Keep each recipe implementation small and
testable
so future maintainers can modify scope without touching unrelated integration paths.

Recommended checklist:
- Define source inputs and schema assumptions.
- Decide category and filename convention.
- Generate report content through reporting module.
- Validate output and fail fast on errors.
- Publish links to downstream consumers.
- Track warnings and follow-up actions.

This recipe scales well because it keeps policy and mechanics separated. Governance rules stay in
configuration and validation, while report content stays in explicit generation calls. That
separation
reduces review overhead, shortens troubleshooting time, and allows multiple teams to use the same
integration contract without conflicting local conventions.

## 15. FAQ

### 15.1 Can I use Reporting Agent v2 without metrics formatter?

Yes. The reporting module can generate and save reports directly from already-curated inputs. Use
the formatter only when normalising raw metrics data.

### 15.2 Should I rely on category inference?

Prefer explicit categories. Inference is suitable as a convenience fallback, not as a governance
mechanism.

### 15.3 Do I need async wrappers if functions are synchronous?

For standalone scripts, no. For orchestrators that already use async workflows, wrappers improve
consistency, error propagation, and composability.

### 15.4 Can I save outside `.github/reports`?

Not for repository-governed report artefacts. Keep outputs in canonical report directories for
discoverability and compliance.

### 15.5 What if warnings are present but validation is technically valid?

Treat warnings as actionable debt. You may continue, but log and schedule remediation to avoid
quality drift.

### 15.6 How large should report details sections be?

Keep details focused. For large payloads, include summaries and link to dedicated artefacts instead
of dumping full data in one file.

## 16. Glossary

- **Category**: The report classification determining storage path under `.github/reports/<category>/`.

- **Frontmatter**: YAML metadata block at file start used by governance and validation tooling.

- **Deterministic output**: Stable report structure and location produced from the same input set.

- **Formatter**: The metrics integration class that reshapes raw analytics into reporting-friendly objects.

- **Orchestrator**: Calling code that sequences input collection, report generation, validation, and publication.

- **Spec file**: Documentation sidecar describing JSON artefact schema, generation, and usage.

## 17. Cross-References

- [`/home/runner/work/.github/.github/scripts/agents/reporting.agent.js`](../../../scripts/agents/reporting.agent.js)
- [`/home/runner/work/.github/.github/scripts/metrics/integrations/reporting-agent-input.js`](../../../scripts/metrics/integrations/reporting-agent-input.js)
- [`/home/runner/work/.github/.github/scripts/agents/__tests__/reporting.agent.test.js`](../../../scripts/agents/__tests__/reporting.agent.test.js)
- [`/home/runner/work/.github/.github/scripts/metrics/integrations/__tests__/reporting-agent-input.test.js`](../../../scripts/metrics/integrations/__tests__/reporting-agent-input.test.js)
- [`/home/runner/work/.github/.github/.github/instructions/markdown.instructions.md`](../../../.github/instructions/markdown.instructions.md)
- [`/home/runner/work/.github/.github/.github/instructions/reporting.instructions.md`](../../../.github/instructions/reporting.instructions.md)


## 18. Integration Case Studies

### 18.1 Embedding in issue maintenance agent

Case study 1 focuses on embedding in issue maintenance agent. The recommended approach is to define
a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.2 Embedding in PR review summariser

Case study 2 focuses on embedding in pr review summariser. The recommended approach is to define a
narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.3 Embedding in release preparation workflows

Case study 3 focuses on embedding in release preparation workflows. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.4 Embedding in project metadata sync agent

Case study 4 focuses on embedding in project metadata sync agent. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.5 Embedding in nightly repository health checks

Case study 5 focuses on embedding in nightly repository health checks. The recommended approach is
to define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.6 Embedding in manual CLI maintenance scripts

Case study 6 focuses on embedding in manual cli maintenance scripts. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.7 Embedding in migration audit pipelines

Case study 7 focuses on embedding in migration audit pipelines. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.8 Embedding in docs governance quality checks

Case study 8 focuses on embedding in docs governance quality checks. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.9 Embedding in security posture reporting

Case study 9 focuses on embedding in security posture reporting. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.10 Embedding in onboarding and enablement workflows

Case study 10 focuses on embedding in onboarding and enablement workflows. The recommended approach
is to define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.11 Embedding in quarterly planning cycles

Case study 11 focuses on embedding in quarterly planning cycles. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.12 Embedding in continuous improvement retrospectives

Case study 12 focuses on embedding in continuous improvement retrospectives. The recommended
approach is to define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.13 Embedding in cross-repository portfolio digests

Case study 13 focuses on embedding in cross-repository portfolio digests. The recommended approach
is to define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.14 Embedding in incident response postmortems

Case study 14 focuses on embedding in incident response postmortems. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

### 18.15 Embedding in leadership status briefings

Case study 15 focuses on embedding in leadership status briefings. The recommended approach is to
define a narrow interface between
the host automation and Reporting Agent v2. The host should own input collection and decision logic,
while
the reporting boundary should only transform curated inputs into stable Markdown artefacts. This
clear
separation keeps integration readable, testable, and easier to audit over time.

In practice, teams often improve reliability by adding pre-flight checks before generation starts.
Typical
checks include verifying required fields, ensuring category names are approved, and confirming
filenames
follow deterministic conventions. When these checks happen early, failures are easier to diagnose
and
rarely require deep investigation. The reporting step then becomes a predictable, low-risk
operation.

A second recurring lesson is to keep report narratives concise while preserving actionability.
Integrations
that dump full payloads into a single report become difficult to review, slow to lint, and harder to
consume by other automations. Better integrations summarise key outcomes and then link to deeper
artefacts
when detail is required. This preserves performance and keeps reviewer attention on decisions and
next
steps.

From an operational perspective, add structured logging for each boundary: input prepared, report
generated, validation passed, and file persisted. Include elapsed time and identifiers, but avoid
logging
sensitive payloads. These logs accelerate incident diagnosis and let maintainers spot regressions in
integration behaviour over time. Combined with deterministic naming, they also support quick
historical
queries.

Finally, the most maintainable deployments treat governance checks as part of normal delivery rather
than a
final obstacle. Teams that run markdown and frontmatter validation in every integration path find
defects
early, reduce rework, and keep documentation trustworthy. This case study pattern is portable across
control-plane and product repositories and should be used as a default integration blueprint unless
a
specific workflow needs tighter constraints.

---

*Maintained by the LightSpeed Team.*
