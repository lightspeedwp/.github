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

This guide explains how to integrate Reporting Agent v2 into other LightSpeed agents, scripts, and GitHub
automation flows. It is written for engineers who need deterministic outputs, predictable report locations,
and safe operational behaviour in a multi-repository environment. The objective is to make integration
straightforward while still giving enough depth for production hardening.

The guide covers quick start setup, configuration strategy, API reference details, async JavaScript
patterns, best practices, troubleshooting, performance tuning, quality gates, and migration advice from
v1-style usage. All examples assume Node.js 24+ and the tooling already used in this repository.

Where examples show wrappers around synchronous APIs, the wrapper exists to provide a consistent async
interface for orchestrator code. This allows integrators to compose Reporting Agent v2 with networked
steps, retries, and concurrency control using the same async/await style used elsewhere in automation
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
- [19. Anti-Patterns and Recovery Playbooks](#19-anti-patterns-and-recovery-playbooks)
- [20. Implementation Playbooks](#20-implementation-playbooks)
- [21. Deep-Dive Integration Questions](#21-deep-dive-integration-questions)
- [22. Integration Validation Matrices](#22-integration-validation-matrices)
- [23. Adoption Roadmap](#23-adoption-roadmap)

## 1. Audience and Scope

This document is for maintainers of automation agents, workflow authors, and engineers responsible for
report governance in the LightSpeed control-plane repository. It assumes familiarity with JavaScript,
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

Purpose: Create and save low-risk reports in one short code path.

Use this when input data is already trusted and pre-shaped by the caller. Keep payload preparation
upstream, then call report generation and save once. This pattern minimises orchestration overhead
and is ideal for cron jobs that write one artefact per run.

Guardrails: validate category membership before save, and emit one structured log event with
filename, category, and elapsed milliseconds.

### 6.2 Two-step generate then save

Purpose: Separate content rendering from persistence.

Use this pattern when reviewers or additional policy checks need to inspect report text before
writing to disk. The first step generates a draft string; the second step performs save after
approval gates pass.

Guardrails: include immutable draft hashes in logs so teams can compare reviewed and persisted
content.

### 6.3 Strict validate before save

Purpose: Fail fast if required metadata is missing.

Use this for compliance-sensitive categories such as validation, audits, and release reporting.
Validation runs immediately after generation, and any missing required field blocks persistence.

Guardrails: treat validation errors as hard failures and warnings as backlog items with named
owners.

### 6.4 Fallback category classification

Purpose: Infer category only when callers omit explicit routing.

Use inference for ad hoc manual invocations where convenience matters more than strict taxonomy
control. In managed automation, always prefer explicit categories to keep reporting analytics
stable.

Guardrails: log both inferred category and source phrase to make misclassification easy to diagnose.

### 6.5 Metrics-first formatting pipeline

Purpose: Normalise raw telemetry before narrative generation.

Run `MetricsReportFormatter` before report assembly when metrics originate from mixed collectors.
This centralises health score, trend, and anomaly shaping so downstream reports remain consistent.

Guardrails: version the formatter and include formatter version in report details for traceability.

### 6.6 JSON spec sidecar generation

Purpose: Publish schema docs next to generated JSON outputs.

Use this whenever integrations emit JSON snapshots consumed by teams or automation. Generate a
`.spec.md` companion explaining fields, generation method, and sample payload.

Guardrails: release JSON and spec updates in the same commit to avoid drift.

### 6.7 Archive-and-replace lifecycle

Purpose: Move superseded artefacts into archive folders with provenance.

Adopt this pattern for periodic reports where only recent summaries should stay in active folders.
Archive older files after replacement reports are confirmed valid.

Guardrails: never archive files still referenced by dashboards; update links first.

### 6.8 Batch report processing

Purpose: Process many report jobs with deterministic sequencing.

Use batch mode for weekly rollups spanning multiple categories. Prepare a queue of report jobs, then
execute generation with bounded concurrency to avoid file-system contention.

Guardrails: include per-job success/failure counts and return non-zero status when any blocking job
fails.

### 6.9 Per-category orchestrator routing

Purpose: Route source events to category-specific templates.

Use a router map keyed by event type or producer. Each route maps to category, filename strategy,
and template defaults, reducing conditional complexity in orchestration code.

Guardrails: maintain route definitions in one module and test for unknown route behaviour.

### 6.10 Dry-run path preview

Purpose: Expose computed paths and metadata without writing files.

Use dry-run mode in pull requests and migration rehearsals to verify naming, routing, and section
coverage. Dry-run output should mirror real output except persistence side effects.

Guardrails: mark dry-run results clearly so they cannot be mistaken for published artefacts.

### 6.11 Idempotent regeneration by date

Purpose: Allow safe re-runs for the same reporting period.

When reruns are expected, generate filenames from deterministic period keys such as ISO week.
Existing files are replaced intentionally, preventing duplicate artefacts.

Guardrails: include regenerated timestamp in details so consumers can track rerun timing.

### 6.12 Failure-aware retry envelope

Purpose: Retry transient write failures with bounded backoff.

Wrap save operations in a retry helper for temporary IO or lock contention issues. Keep attempts
bounded and preserve the first validation failure as non-retryable.

Guardrails: classify errors into retryable and terminal buckets; avoid infinite loops.

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
import MetricsReportFormatter from "../../scripts/metrics/integrations/reporting-agent-input.js";
import { createReportAsync } from "./create-report-async.js";

export async function createWeeklyMetricsReport(rawMetrics) {
  const now = new Date();
  const isoWeek = Math.ceil(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), 0, 1)) /
      604800000,
  );
  const filename = `weekly-summary-${now.getUTCFullYear()}-w${String(isoWeek).padStart(2, "0")}.md`;

  const formatter = new MetricsReportFormatter();
  const formatted = await Promise.resolve(
    formatter.formatForReportingAgent(rawMetrics, "weekly"),
  );

  return createReportAsync({
    title: "weekly-metrics-summary",
    description: "Weekly metrics summary derived from raw telemetry.",
    category: "metrics",
    filename,
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

Define only the fields needed for the current audience and decision. Smaller payloads reduce
rendering noise, shorten reviews, and make schema drift obvious.

If additional detail is required, attach separate artefacts and link them from the report instead of
embedding large raw objects.

### 8.2 Prefer stable category mappings over inferred categories

Maintain an explicit route table for producer-to-category mapping. This keeps folder-level analytics
and governance audits dependable.

Use inference only as a fallback for interactive sessions where strict routing is less critical.

### 8.3 Validate before save, and lint after save

Validation catches metadata contract failures before files are written; linting ensures readability
and formatting consistency after persistence.

Treat these gates as baseline quality checks in every integration path.

### 8.4 Separate generation from publication steps

Generate report content independently from any notification, dashboard update, or commit action.
This separation enables safer dry-runs and easier rollback.

Publication should depend on successful validation, not vice versa.

### 8.5 Use deterministic filenames with dates or run IDs

Deterministic naming prevents duplicate output and simplifies historical lookups.

Adopt one naming convention per category and document it in orchestrator code.

### 8.6 Centralise error handling in orchestrators

Collect module errors in one place to produce concise, actionable logs.

Distinguish between validation, persistence, and upstream data errors so responders know where to
intervene.

### 8.7 Avoid embedding secrets in report content

Report artefacts are often widely visible. Never include tokens, credentials, private endpoints, or
customer-sensitive records.

Prefer redaction and aggregate metrics when dealing with sensitive sources.

### 8.8 Keep markdown sections predictable for downstream parsing

Use consistent headings so readers and scripts can extract sections reliably.

Avoid ad hoc heading variants for core blocks like Summary, Metrics, Details, and Recommendations.

### 8.9 Document JSON artefacts with specification files

Whenever JSON outputs are generated, publish schema documentation nearby.

This lowers onboarding friction and reduces misinterpretation by new contributors.

### 8.10 Treat warnings as debt and schedule follow-up

Warnings indicate quality risks that can accumulate silently.

Track warning remediation in issues or backlog tasks with due dates and owners.

### 8.11 Use async wrappers for orchestration consistency

Async wrappers make it easier to compose report generation with API calls, queue systems, and retry
middleware.

Even for sync internals, a consistent async boundary improves maintainability.

### 8.12 Include actionable recommendations in every report

A report without next actions is descriptive but not operationally useful.

Ensure recommendations include owner, timeframe, and expected outcome when possible.

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

### 12.0 Migration principle

During migration, keep behaviour toggles small and reversible so rollback remains simple.

### 12.1 Migration Step 1

Move from implicit report placement to explicit category-based save calls.

### 12.2 Migration Step 2

Replace ad hoc markdown templates with `generateReport` for consistent sections.

### 12.3 Migration Step 3

Introduce pre-save validation with `validateReport` and fail-fast handling.

### 12.4 Migration Step 4

Adopt filename sanitisation as a defensive layer, not a naming policy.

### 12.5 Migration Step 5

Normalise metrics payloads with `MetricsReportFormatter` before rendering.

### 12.6 Migration Step 6

Use async wrappers in orchestration code for uniform pipeline composition.

### 12.7 Migration Step 7

Document JSON outputs using `generateSpecFile` to satisfy governance expectations.

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

This recipe is designed for teams working with daily task logs and progress checkpoints. The primary
objective is to summarise completed tasks, blockers, and tomorrow priorities.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `progress` category using a deterministic
filename such as `daily-update-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.2 Weekly quality scorecard pipeline

This recipe is designed for teams working with lint, test, and workflow pass-rate metrics. The
primary objective is to highlight trend direction and top quality risks.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `metrics` category using a deterministic
filename such as `weekly-quality-scorecard-YYYY-wNN.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.3 Multi-category compliance digest

This recipe is designed for teams working with outputs from validation, frontmatter, and linting
categories. The primary objective is to merge category highlights into one executive digest.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `validation` category using a deterministic
filename such as `compliance-digest-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.4 PR-centric validation digest

This recipe is designed for teams working with PR check results and review findings. The primary
objective is to present pass/fail outcomes and unresolved blockers.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `validation` category using a deterministic
filename such as `pr-validation-digest-pr-<number>.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.5 Issue triage trend brief

This recipe is designed for teams working with issue state transitions and backlog age
distributions. The primary objective is to surface queue pressure and escalation candidates.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `issue-metrics` category using a deterministic
filename such as `issue-triage-trends-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.6 Release readiness board report

This recipe is designed for teams working with release gates, outstanding defects, and risk flags.
The primary objective is to produce go/no-go narrative with explicit owners.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `implementation` category using a deterministic
filename such as `release-readiness-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.7 Documentation quality pulse

This recipe is designed for teams working with markdown lint outcomes and docs validation signals.
The primary objective is to show docs health and target remediation scope.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `linting` category using a deterministic
filename such as `documentation-quality-pulse-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.8 Labeling governance snapshot

This recipe is designed for teams working with label audit outputs and taxonomy drift findings. The
primary objective is to identify inconsistent labels and corrective steps.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `labeling` category using a deterministic
filename such as `labeling-governance-snapshot-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.9 Frontmatter conformance tracker

This recipe is designed for teams working with frontmatter validation summaries. The primary
objective is to track recurring metadata violations by folder.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `frontmatter` category using a deterministic
filename such as `frontmatter-conformance-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.10 Mermaid accessibility watch

This recipe is designed for teams working with diagram syntax and accessibility validation outputs.
The primary objective is to focus on missing accTitle/accDescr and contrast checks.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `mermaid` category using a deterministic
filename such as `mermaid-accessibility-watch-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.11 Cross-project implementation summary

This recipe is designed for teams working with multiple active project status updates. The primary
objective is to align milestones, dependencies, and cross-team blockers.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `implementation` category using a deterministic
filename such as `cross-project-summary-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.12 Agent execution health digest

This recipe is designed for teams working with agent run logs and success/error distributions. The
primary objective is to report reliability, latency, and recurring failure types.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `agents` category using a deterministic
filename such as `agent-execution-health-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.13 Automation incident timeline report

This recipe is designed for teams working with workflow failures, incident timestamps, and
mitigations. The primary objective is to create factual post-incident chronology for handover.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `audits` category using a deterministic
filename such as `automation-incident-timeline-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.14 Stale report archival cycle

This recipe is designed for teams working with report modification timestamps and retention policy.
The primary objective is to archive outdated artefacts with replacement links.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `meta` category using a deterministic filename
such as `stale-report-archival-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.15 Monthly engineering narrative

This recipe is designed for teams working with month-level delivery, quality, and operational
metrics. The primary objective is to produce leadership-friendly narrative with supporting data.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `metrics` category using a deterministic
filename such as `engineering-narrative-YYYY-MM.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.16 Quarterly leadership digest

This recipe is designed for teams working with quarterly KPI movement and strategic themes. The
primary objective is to summarise outcomes, risks, and next-quarter focus.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `metrics` category using a deterministic
filename such as `leadership-digest-qN-YYYY.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.17 Repository onboarding report

This recipe is designed for teams working with new contributor setup friction points. The primary
objective is to document onboarding blockers and fixes.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `analysis` category using a deterministic
filename such as `onboarding-report-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.18 Contributor activity digest

This recipe is designed for teams working with commit volume, review participation, and response
times. The primary objective is to show collaboration patterns and capacity hotspots.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `issue-metrics` category using a deterministic
filename such as `contributor-activity-digest-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.19 CI drift early warning

This recipe is designed for teams working with changes in workflow runtimes and failure rates. The
primary objective is to flag regression signals before they become outages.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `optimisation` category using a deterministic
filename such as `ci-drift-warning-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.20 Schema validation roll-up

This recipe is designed for teams working with JSON/YAML/schema validation outputs. The primary
objective is to aggregate errors by schema and ownership.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `validation` category using a deterministic
filename such as `schema-rollup-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.21 Backlog pressure summary

This recipe is designed for teams working with open issue volume and aging cohorts. The primary
objective is to identify where backlog exceeds team capacity.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `issue-metrics` category using a deterministic
filename such as `backlog-pressure-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.22 Code quality trendline brief

This recipe is designed for teams working with eslint warnings, test coverage, and flaky-test
signals. The primary objective is to explain trend movement and immediate corrective actions.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `linting` category using a deterministic
filename such as `code-quality-trendline-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.23 Escalation-oriented blocker report

This recipe is designed for teams working with blocked tasks, dependency constraints, and SLA
breaches. The primary objective is to prioritise escalations with impact statements.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `progress` category using a deterministic
filename such as `blocker-escalation-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.24 Performance regression tracker

This recipe is designed for teams working with runtime and throughput deviations from baseline. The
primary objective is to record regressions with suspected causes and next tests.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `optimisation` category using a deterministic
filename such as `performance-regressions-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.25 Operational hygiene checklist report

This recipe is designed for teams working with routine maintenance actions and missed controls. The
primary objective is to confirm hygiene tasks and assign overdue remediation.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `meta` category using a deterministic filename
such as `operational-hygiene-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.26 Multi-repository metadata roll-up

This recipe is designed for teams working with metadata collected from several repositories. The
primary objective is to normalise and compare cross-repository health indicators.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `metrics` category using a deterministic
filename such as `multi-repo-rollup-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.27 Post-incident retrospective report

This recipe is designed for teams working with incident evidence, decisions, and corrective actions.
The primary objective is to capture lessons learned and prevention work.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `audits` category using a deterministic
filename such as `incident-retrospective-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.28 Task completion reliability report

This recipe is designed for teams working with planned vs completed work across cycles. The primary
objective is to quantify delivery reliability and root causes of slippage.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `progress` category using a deterministic
filename such as `task-reliability-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.29 Workflow adoption tracker

This recipe is designed for teams working with workflow usage metrics and opt-out rates. The primary
objective is to assess adoption and identify enablement gaps.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `analysis` category using a deterministic
filename such as `workflow-adoption-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.30 Dependency risk overview

This recipe is designed for teams working with dependency age, vulnerability advisories, and upgrade
status. The primary objective is to prioritise upgrade actions by exposure and effort.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `audits` category using a deterministic
filename such as `dependency-risk-overview-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.31 Release note seed report

This recipe is designed for teams working with merged PR summaries and change classifications. The
primary objective is to prepare structured release note inputs for maintainers.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `implementation` category using a deterministic
filename such as `release-note-seed-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.32 Audit preparation report

This recipe is designed for teams working with evidence links and policy conformance checkpoints.
The primary objective is to organise materials for external or internal audits.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `audits` category using a deterministic
filename such as `audit-preparation-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.33 Cross-team handover summary

This recipe is designed for teams working with handover decisions, assumptions, and outstanding
work. The primary objective is to reduce transition risk between teams or maintainers.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `progress` category using a deterministic
filename such as `cross-team-handover-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.34 KPI change explanation brief

This recipe is designed for teams working with notable KPI deltas and contextual events. The primary
objective is to explain why metrics shifted and what to do next.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `metrics` category using a deterministic
filename such as `kpi-change-explanation-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.35 Action owner accountability report

This recipe is designed for teams working with open recommendations and owner progress. The primary
objective is to track completion accountability with due dates.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `progress` category using a deterministic
filename such as `owner-accountability-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.36 Control-plane status digest

This recipe is designed for teams working with control-plane workflows, docs checks, and governance
signals. The primary objective is to deliver concise operational status for maintainers.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `agents` category using a deterministic
filename such as `control-plane-status-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.37 Repo health launch packet

This recipe is designed for teams working with new initiative baseline metrics and quality checks.
The primary objective is to provide launch-ready snapshot before wider rollout.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `analysis` category using a deterministic
filename such as `repo-health-launch-packet-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.38 Experiment outcome digest

This recipe is designed for teams working with experiment hypotheses, outcomes, and confidence
levels. The primary objective is to turn trial data into practical implementation guidance.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `analysis` category using a deterministic
filename such as `experiment-outcomes-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.39 Playbook adherence report

This recipe is designed for teams working with observed workflow behaviour against published
playbooks. The primary objective is to show adherence gaps and training requirements.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `validation` category using a deterministic
filename such as `playbook-adherence-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

### 14.40 Continuous improvement ledger

This recipe is designed for teams working with completed improvements, pending actions, and impact
estimates. The primary objective is to maintain a living record of optimisation progress.

Implementation pattern: collect source data, map it into a narrow integration object, and call
`generateReport` with explicit metadata. Save to the `optimisation` category using a deterministic
filename such as `continuous-improvement-ledger-YYYY-MM-DD.md`.

Validation checklist:
- Confirm required frontmatter fields are present.
- Verify heading structure and code fences.
- Ensure recommendations include clear owners or follow-up actions.
- Run markdown and frontmatter checks before publishing.

Operational notes: keep report details concise, link to deeper artefacts where needed, and emit
structured logs containing category, filename, and outcome. If this recipe is scheduled, enforce
idempotent naming so reruns replace the expected file rather than creating duplicates.

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

- [`scripts/agents/reporting.agent.js`](../../../scripts/agents/reporting.agent.js)
- [`scripts/metrics/integrations/reporting-agent-input.js`](../../../scripts/metrics/integrations/reporting-agent-input.js)
- [`scripts/agents/__tests__/reporting.agent.test.js`](../../../scripts/agents/__tests__/reporting.agent.test.js)
- [`scripts/metrics/integrations/__tests__/reporting-agent-input.test.js`](../../../scripts/metrics/integrations/__tests__/reporting-agent-input.test.js)
- [`.github/instructions/markdown.instructions.md`](../../../.github/instructions/markdown.instructions.md)
- [`.github/instructions/reporting.instructions.md`](../../../.github/instructions/reporting.instructions.md)

## 18. Integration Case Studies

### 18.1 Embedding in issue maintenance agent

Input profile: issue lifecycle events, stale-age calculations, and blocker labels.

Objective: Generate a daily progress-category report that lists net open/closed movement, stale
cohorts, and overdue blockers.

Implementation notes: Keep category explicit as `progress`, and include links to issue queries so
maintainers can verify counts quickly.

Operational considerations: Latency target is moderate; correctness and triage action clarity are
the priorities.

### 18.2 Embedding in PR review summariser

Input profile: review outcomes, unresolved threads, and failing checks.

Objective: Publish a validation report per PR capturing review status, unresolved concerns, and CI
conclusions.

Implementation notes: Use deterministic filenames keyed by PR number and update in place on reruns.

Operational considerations: Latency target is high because reviewers act quickly; keep details
concise and link to full logs.

### 18.3 Embedding in release preparation workflows

Input profile: release checklist status, changelog readiness, and blocking defects.

Objective: Build an implementation report that supports go/no-go decisions with explicit owner
assignments.

Implementation notes: Ensure each recommendation includes due date and rollback consideration.

Operational considerations: Latency is moderate; decision confidence matters more than report
volume.

### 18.4 Embedding in project metadata sync agent

Input profile: field sync outcomes, label compliance deltas, and missing metadata.

Objective: Write a meta-category digest with pass/fail summaries and remediation owners.

Implementation notes: Include before/after counts so teams can see whether drift is improving.

Operational considerations: Prefer idempotent output so daily sync runs replace prior artefacts
cleanly.

### 18.5 Embedding in nightly repository health checks

Input profile: nightly workflow statuses and trend snapshots.

Objective: Create a metrics-category health report every night with baseline comparisons.

Implementation notes: Flag regressions only when thresholds are exceeded to reduce alert fatigue.

Operational considerations: Latency is low priority; consistency and trend reliability are critical.

### 18.6 Embedding in manual CLI maintenance scripts

Input profile: operator-provided arguments and ad hoc maintenance findings.

Objective: Support on-demand report generation for maintenance windows and incident handling.

Implementation notes: Validate user input early and reject unknown categories before processing.

Operational considerations: The CLI path should prioritise clear error messages and dry-run
previews.

### 18.7 Embedding in migration audit pipelines

Input profile: source/target parity checks and schema migration anomalies.

Objective: Generate migration-category reports with explicit pass/fail evidence blocks.

Implementation notes: Pair each finding with the exact migration step identifier.

Operational considerations: Use strict validation and never archive migration evidence until sign-
off is complete.

### 18.8 Embedding in docs governance quality checks

Input profile: markdown lint trends, link check results, and frontmatter conformance.

Objective: Publish linting or frontmatter summaries with actionable remediation ordering.

Implementation notes: Highlight recurring files to guide long-term clean-up planning.

Operational considerations: Treat warnings as tracked debt and include links to follow-up issues.

### 18.9 Embedding in security posture reporting

Input profile: sanitised vulnerability metrics and remediation status.

Objective: Generate audit reports that describe exposure trends without leaking sensitive details.

Implementation notes: Aggregate by severity band and owner team.

Operational considerations: Never include secrets, exploit details, or raw credential-like strings
in report bodies.

### 18.10 Embedding in onboarding and enablement workflows

Input profile: new contributor pain points and setup success rates.

Objective: Create analysis reports that turn onboarding friction into concrete backlog tasks.

Implementation notes: Use short narratives and explicit owner handoff notes.

Operational considerations: This pattern works best when paired with monthly review cadence.

### 18.11 Embedding in quarterly planning cycles

Input profile: quarterly KPI deltas and strategic objectives.

Objective: Build leadership-ready metrics digests with sectioned outcomes, risks, and next bets.

Implementation notes: Separate evidence links from executive summary to keep narrative readable.

Operational considerations: Ensure terminology remains stable across quarters for comparability.

### 18.12 Embedding in continuous improvement retrospectives

Input profile: completed improvements, unresolved debt, and experiment results.

Objective: Publish optimisation-category retrospectives with measurable impact statements.

Implementation notes: Include what changed, what did not, and what will be attempted next.

Operational considerations: Avoid inflated claims; tie outcomes to observable metrics.

### 18.13 Embedding in cross-repository portfolio digests

Input profile: repository-level health snapshots from multiple sources.

Objective: Normalise inputs through the formatter before composing a shared portfolio narrative.

Implementation notes: Preserve per-repository identifiers and avoid mixing units.

Operational considerations: Use bounded concurrency for collection and deterministic ordering for
output.

### 18.14 Embedding in incident response postmortems

Input profile: incident chronology, mitigation actions, and residual risk.

Objective: Create audits with factual timelines and verified action ownership.

Implementation notes: Differentiate confirmed causes from open hypotheses.

Operational considerations: Postmortem reports should be immutable once approved; publish amendments
separately.

### 18.15 Embedding in leadership status briefings

Input profile: weekly decision points, risk posture, and delivery confidence.

Objective: Produce concise metrics digests that support quick decision-making.

Implementation notes: Prioritise recommendations with clear business impact language.

Operational considerations: Keep to one page of core narrative with links for deeper technical
evidence.

## 19. Anti-Patterns and Recovery Playbooks

### 19.1 Overloaded report bodies

Detection signals:
- Markdown files exceed practical review size.
- Reviewers ask for payload reduction repeatedly.
- Lint time grows noticeably for one category.

Recovery steps:
- Move raw payloads to side artefacts.
- Keep report body to summary + decisions + links.
- Set maximum detail length in orchestrator config.

### 19.2 Implicit category decisions

Detection signals:
- Same producer appears in different category folders.
- Dashboards show sudden category drift.
- Maintainers cannot explain routing path.

Recovery steps:
- Create explicit route map by producer/event.
- Log selected category for every run.
- Use inference only when no explicit mapping exists.

### 19.3 Missing validation gates

Detection signals:
- Invalid frontmatter reaches pull requests.
- Reports fail downstream parsing jobs.
- Manual edits are needed before merge.

Recovery steps:
- Enforce validate-before-save flow.
- Fail pipeline on `valid: false`.
- Add regression test using invalid fixture input.

### 19.4 Undocumented JSON outputs

Detection signals:
- Consumers ask what fields mean.
- JSON schema assumptions differ across teams.
- Breaking changes occur silently.

Recovery steps:
- Generate `.spec.md` alongside each JSON output.
- Document generation command and sample payload.
- Review spec updates in same PR as JSON change.

### 19.5 Unbounded concurrency

Detection signals:
- Intermittent write failures increase under load.
- Batch runs finish with partial output sets.
- Runtime variance becomes unpredictable.

Recovery steps:
- Apply concurrency limiter in batch orchestrator.
- Retry only transient IO failures.
- Emit per-job success/failure totals in summary log.

### 19.6 Unowned recommendations

Detection signals:
- Actions remain open across several reporting cycles.
- Teams dispute responsibility for follow-ups.
- Reports are read but not acted on.

Recovery steps:
- Require owner and due window fields.
- Sort recommendations by priority and urgency.
- Track completion in subsequent reports.

### 19.7 Weak lifecycle control

Detection signals:
- Archived files are still linked by dashboards.
- Historical comparisons lose continuity.
- Consumers cannot find current active report.

Recovery steps:
- Verify replacement report exists before archival.
- Update links, then archive old file.
- Mark archived files with archived_date metadata.

### 19.8 Inconsistent naming conventions

Detection signals:
- Filenames vary for identical report types.
- Automation queries miss expected files.
- Humans cannot predict location by period.

Recovery steps:
- Adopt one filename template per report type.
- Centralise slug/date builder helper.
- Validate naming pattern in pre-flight checks.

### 19.9 Silent warning accumulation

Detection signals:
- Warning count trends upward week over week.
- Known warnings are repeatedly ignored.
- No owner is attached to warning cleanup.

Recovery steps:
- Log warning totals per run.
- Create backlog items for recurring warnings.
- Review warning burndown monthly.

### 19.10 Mixed module syntax in examples

Detection signals:
- Users copy snippets and hit runtime import errors.
- Examples mix `require` and `import` in one block.
- Support requests cite syntax confusion.

Recovery steps:
- Standardise examples to repository module style.
- Add snippet checks in docs review.
- Link to one canonical invocation pattern.

### 19.11 Drift between templates and implementation

Detection signals:
- Generated headings differ from documented examples.
- Teams manually patch generated reports.
- Parser rules break after undocumented template tweaks.

Recovery steps:
- Version template contracts and defaults.
- Run parity check on fixture outputs.
- Update docs and implementation together.

### 19.12 Recovery governance cadence

Detection signals:
- Fixes are reactive and repeated.
- No routine quality review exists.
- Integration debt grows between releases.

Recovery steps:
- Schedule monthly integration governance review.
- Audit warning trends and repeated fixes.
- Refresh playbooks and examples from real incidents.

## 20. Implementation Playbooks

### 20.1 Issue hygiene daily pass
Input scope: issue ingestion, stale detection, and label conformance.

Category target: `progress`.

Build a daily summary that compares yesterday's and today's open issue totals, stale counts, and
newly blocked items. Keep the report outcome-focused by listing top three actionable changes and
which maintainer group should address each.

Start by collecting a small, deterministic input object from issue APIs and local governance
scripts. Normalise labels and blocker states first, then map them into report metrics and
recommendations. Use strict validation before save and fail if required metadata is missing.

Publish to `.github/reports/progress/` using `daily-issue-hygiene-YYYY-MM-DD.md`. Keep links to
issue searches for quick verification.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.2 PR readiness checkpoint
Input scope: review status, check runs, and merge blockers.

Category target: `validation`.

Generate a per-PR readiness digest that highlights unresolved review threads, failing checks, and
mergeability state. This helps reviewers decide whether a PR is ready for final review or needs
another implementation cycle.

Fetch check run summaries and review comments once, then create a compact object with severity tags.
Render key blockers first, followed by supporting detail links. Use deterministic naming by PR
number so reruns update the same artefact.

Store as `pr-readiness-pr-<number>.md` in the validation category and include next-step ownership.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.3 Release cut rehearsal
Input scope: release checklist signals and risk controls.

Category target: `implementation`.

Create a release rehearsal report before each planned tag. The report should show what is complete,
what is blocked, and what has unknown status. Include explicit recommendations with owners and due
windows for unresolved release gates.

Model checklist items as structured data instead of free text so trends can be tracked across
rehearsals. Keep evidence links near each gate. If a gate depends on external approval, mark
confidence clearly and avoid implied certainty.

Persist as `release-rehearsal-YYYY-MM-DD.md` for traceable decision history.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.4 Workflow reliability pulse
Input scope: workflow run outcomes, duration drift, and retry rates.

Category target: `metrics`.

Use this playbook to monitor workflow reliability at a glance. Report pass rate, median runtime, and
failure concentration by workflow to help maintainers prioritise optimisation work.

Collect run summaries over a fixed time window and normalise into comparable units. Flag only
meaningful deviations to avoid alert fatigue. Include one recommendation per high-impact deviation
with owner and expected outcome.

Use a weekly cadence and deterministic ISO week filenames.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.5 Frontmatter quality watch
Input scope: frontmatter errors, warning trends, and owner attribution.

Category target: `frontmatter`.

Produce a frontmatter quality watch report that tracks validation errors by folder and file type.
The goal is to make metadata debt visible and assign clear remediation ownership.

Parse validator output into grouped counts, then generate concise findings with trend direction.
Recommendations should target root causes, such as missing required fields or outdated templates,
not just symptom files.

Save under `.github/reports/frontmatter/` and keep historical files for trend analysis.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.6 Docs readability and accessibility scan
Input scope: heading structure, link clarity, and markdown conventions.

Category target: `linting`.

Generate a docs readability report that translates lint findings into practical editorial actions.
Prioritise issues that reduce usability, such as heading jumps, ambiguous links, and malformed code
fences.

Aggregate lint findings by rule, then annotate with impact level and suggested fixes. Include a
small sample of representative files to make remediation concrete for contributors.

Publish as a weekly linting artefact and link follow-up issues for persistent problems.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.7 Schema conformance bulletin
Input scope: JSON/YAML validation output grouped by schema.

Category target: `validation`.

Use this bulletin to keep schema drift under control. The report should identify failing schemas,
affected files, and likely remediation paths.

Run schema validators on changed or scheduled scope, then map errors to schema owners. Distinguish
new failures from known debt so teams can focus on regressions first.

Store in validation category with date-based filenames for auditability.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.8 Dependency governance digest
Input scope: dependency age, known vulnerabilities, and upgrade status.

Category target: `audits`.

Prepare a dependency governance digest to support safe maintenance planning. Summarise vulnerable
packages, upgrade blockers, and expected risk reduction from proposed updates.

Pull dependency metadata from lock files and advisory sources. Keep vulnerability detail aggregated
unless deeper technical artefacts are required for engineering action.

Publish monthly and include action prioritisation by severity and effort.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.9 Incident chronology report
Input scope: event timeline, detection lag, and remediation actions.

Category target: `audits`.

Create a factual incident chronology that records what happened, when it was detected, and how
response unfolded. The aim is operational learning, not blame.

Use timestamped event blocks with source evidence links. Separate confirmed observations from
hypotheses. Close with concrete prevention actions linked to owners.

Publish once incident is stabilised and keep amendments versioned.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.10 Contributor throughput snapshot
Input scope: commits, review participation, and queue response.

Category target: `issue-metrics`.

This snapshot helps maintainers understand contributor bandwidth and review load. Focus on trends
and bottlenecks rather than individual scoring.

Collect activity metrics over a fixed period, then present aggregate values and directional change.
Recommendations should emphasise queue balancing, mentoring, or workflow tuning.

Use monthly filenames and preserve historical snapshots for planning.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.11 Cross-repo portfolio health
Input scope: multi-repository metrics and governance signals.

Category target: `metrics`.

When supporting multiple repositories, generate a portfolio health digest that compares common
indicators across projects. This enables leadership-level prioritisation without losing technical
grounding.

Normalise all sources before comparison. Keep per-repository context rows so anomalies are
traceable. Avoid mixing inconsistent metric definitions in one chart or table.

Publish under metrics with explicit period labels and repository set identifiers.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.12 Label drift correction guide
Input scope: label taxonomy audits and mismatch incidents.

Category target: `labeling`.

Produce a label drift report whenever taxonomy changes or large backfills occur. It should show
drift sources, corrective actions, and residual uncertainty.

Map mismatches by label family and repository area. Use recommendation blocks for automation
updates, manual cleanup, and governance updates.

Persist in labeling category and cross-link automation workflow runs.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.13 Automation rollback readiness
Input scope: rollback trigger criteria and fallback paths.

Category target: `implementation`.

This playbook documents rollback readiness before high-impact automation releases. It should clarify
trigger thresholds, communication steps, and recovery ownership.

Represent each rollback trigger as measurable criteria. Validate that fallback artefacts and scripts
are current. Include rehearsal evidence where available.

Publish before deployment windows and archive superseded versions.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.14 Quarterly KPI interpretation pack
Input scope: KPI deltas, strategic context, and delivery constraints.

Category target: `metrics`.

Create a quarterly interpretation pack that explains not just what changed, but why. Pair KPI deltas
with contextual events to avoid misleading conclusions.

Use sectioned narratives for outcomes, risk, and next actions. Avoid speculative claims; mark
assumptions explicitly and reference supporting evidence.

Store as quarter-keyed metrics report and keep structure stable each quarter.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.15 Experiment evaluation digest
Input scope: test hypotheses, measured outcomes, and confidence.

Category target: `analysis`.

Use this digest for experiments in tooling, workflow, or governance. It should decide whether to
adopt, iterate, or stop the experiment.

Capture baseline, intervention, and observed outcomes in a repeatable structure. Include confidence
level and known confounders so decisions are transparent.

Publish in analysis category and link follow-on work items.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.16 Onboarding friction report
Input scope: new contributor setup issues and time-to-first-contribution.

Category target: `analysis`.

Generate onboarding friction reports to improve contributor experience and reduce setup churn. Focus
on recurring blockers and the highest-impact quick wins.

Collect input from setup logs, contributor notes, and support interactions. Group findings by
tooling, documentation, and access management.

Use monthly cadence and track whether previous fixes reduced friction.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.17 Backlog pressure monitor
Input scope: issue age distribution and blocked-work accumulation.

Category target: `issue-metrics`.

This monitor highlights where backlog pressure is building. It supports prioritisation by showing
both volume and ageing trends.

Measure open issues by age buckets and blocker state. Add recommendations that balance short-term
throughput and long-term debt control.

Publish weekly with comparable bucket definitions.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.18 Code quality risk digest
Input scope: lint debt, flaky tests, and coverage movement.

Category target: `linting`.

Generate a risk digest when quality signals diverge or regress. The digest should identify hotspots
and practical recovery actions.

Aggregate trends for lint errors, flaky tests, and coverage movement. Tag findings by severity and
confidence. Keep recommendations implementation-ready.

Store in linting category with date and scope labels.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.19 Control-plane governance summary
Input scope: workflow controls, template compliance, and standards adherence.

Category target: `agents`.

Produce a governance summary for the control plane to confirm policy adherence and operational
stability.

Combine checks from workflows, templates, and metadata validators into one coherent narrative.
Prioritise blockers that affect contributor trust.

Use fortnightly cadence and link to underlying reports.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.20 Continuous improvement ledger
Input scope: completed improvements, pending optimisations, and measured impact.

Category target: `optimisation`.

Maintain a living ledger of incremental improvements and their outcomes. This creates continuity
between retrospectives and execution.

Record each change with objective, owner, completion date, and observed impact. Distinguish
confirmed improvements from still-evaluating changes.

Publish on a regular cadence and keep change identifiers stable.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.21 Handover confidence report
Input scope: transition decisions, unresolved assumptions, and next-owner readiness.

Category target: `progress`.

Use this report before ownership transitions between engineers or teams. It should reduce ambiguity
and protect delivery continuity.

Summarise what is done, what is uncertain, and what must happen next. Include links to key artefacts
and explicit acceptance boundaries.

Publish in progress category at handover milestones.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.22 Post-merge observation bulletin
Input scope: post-merge errors, warning drift, and user-impact signals.

Category target: `validation`.

After major merges, generate a short observation bulletin to catch early regressions. Keep it
actionable and time-bounded.

Track error and warning deltas against pre-merge baseline. Flag only material shifts and propose
immediate follow-up checks.

Publish daily for the first week after major changes.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.23 Security hygiene trend report
Input scope: sanitised security check outcomes and remediation cadence.

Category target: `audits`.

Create a security hygiene trend report that surfaces remediation velocity and recurring control
failures.

Use aggregated severity counts and closure timelines. Keep details high level unless a secure
internal artefact is referenced.

Publish monthly and track whether critical findings age is decreasing.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

### 20.24 Planning alignment digest
Input scope: planned milestones versus delivered outcomes.

Category target: `implementation`.

This digest helps leadership and engineers align planning assumptions with observed delivery.

Compare planned milestones to completed outputs, identify slippage causes, and document corrective
actions for the next planning cycle.

Publish at sprint or phase boundaries with explicit scope labels.

Quality checks: validate metadata before save, keep headings predictable, and run markdown and
frontmatter validation before publication. Operational checks: log filename, category, outcome, and
elapsed duration so maintainers can triage failures quickly.

## 21. Deep-Dive Integration Questions

### 21.1 How do we keep report structures stable across teams?
Create one canonical template per report type and treat it as a contract. Store defaults in
orchestration code, and only change structure through reviewed updates. Add a lightweight fixture
test that checks heading presence and frontmatter keys so accidental drift is detected early.

### 21.2 What is the safest way to onboard a new integration consumer?
Start with a read-only dry run that generates content without persistence. Let the consuming team
review output shape, naming, and recommendation style before enabling writes. Once approved, enable
persistence and validation gates together.

### 21.3 How should we choose between metrics and progress categories?
Use metrics when the report emphasises quantitative trends, and progress when it emphasises delivery
actions, blockers, and ownership. If both are needed, keep one primary category and link to
supporting artefacts to avoid taxonomy drift.

### 21.4 When should we archive versus overwrite?
Overwrite when the file represents a living period key such as the current week. Archive when
historical point-in-time snapshots must be retained for audit or comparison. Keep archive policy
explicit and consistent per category.

### 21.5 How can we prevent recommendation fatigue?
Cap recommendations to the highest-impact actions and ensure each action has owner, timeframe, and
expected outcome. Remove stale recommendations when resolved, and avoid repeating unchanged low-
priority items without context.

### 21.6 What level of detail belongs in executive summaries?
Executive summaries should answer status, trend, and risk in a few concise lines. Keep evidence-
heavy detail in later sections or linked artefacts. The summary should support quick decisions
without sacrificing traceability.

### 21.7 How do we support both humans and automation consumers?
Use predictable headings and concise prose for humans, while keeping metadata and section names
stable for scripts. Avoid decorative structure changes that make parsing fragile. Structured
consistency is more valuable than stylistic novelty.

### 21.8 How should we handle missing upstream data?
Fail gracefully with explicit placeholders and confidence notes rather than fabricating values.
Record which sources were unavailable and what fallback logic was applied. This preserves trust and
simplifies follow-up debugging.

### 21.9 What are practical latency targets for report generation?
Latency expectations depend on context. PR-focused summaries should be near-real-time, while nightly
or weekly digests can trade speed for richer analysis. Set per-context targets and track them in
operational logs.

### 21.10 How do we design retries without hiding defects?
Retry only clearly transient failures such as temporary IO contention. Validation errors and
malformed inputs should fail immediately because retries will not fix them. Always surface root
cause in error logs.

### 21.11 How can we keep filenames deterministic but readable?
Use kebab-case slugs plus period keys such as date or ISO week. Avoid embedding volatile data like
random IDs unless absolutely required. Deterministic names improve discoverability and reduce
duplicate artefacts.

### 21.12 What should a report include to support handover?
Include current status, unresolved blockers, owner mapping, and clear next steps. Link to source
evidence and related artefacts so the new owner can continue without rebuilding context from
scratch.

### 21.13 How do we avoid overfitting templates to one workflow?
Keep core sections universal and add optional context blocks via configuration. This keeps templates
reusable while allowing workflow-specific emphasis where needed.

### 21.14 Which quality checks are mandatory for docs-heavy report updates?
At minimum, run markdown linting and frontmatter validation. If JavaScript integration code changes,
run targeted tests closest to modified modules as well.

### 21.15 How often should we review integration health?
Run monthly governance reviews for recurring integrations and ad hoc reviews after major incidents
or structural changes. Use warning trends and consumer feedback as core inputs.

### 21.16 How do we make troubleshooting faster during incidents?
Emit structured logs at each step: input prepared, report generated, validation result, and file
persistence outcome. Include identifiers and timestamps, not sensitive payload content.

### 21.17 What is the right way to document JSON companion files?
Use a `.spec.md` sidecar that states purpose, generation method, schema fields, and a safe example.
Keep spec updates coupled to JSON changes in the same pull request.

### 21.18 How do we keep cross-repository comparisons fair?
Normalise metric definitions before aggregation and keep repository-level context visible in
outputs. Never compare values derived from different formulas without explicit caveats.

### 21.19 How should leadership-facing reports differ from engineering-facing reports?
Leadership reports should emphasise decisions, risk, and expected outcomes, while engineering
reports can include richer implementation detail. Both should link to shared evidence to avoid
narrative mismatch.

### 21.20 What signals indicate an integration contract needs redesign?
Recurring manual fixes, repeated reviewer confusion, and frequent parser breakage are strong
redesign signals. If these persist despite fixes, simplify the contract and reduce optional
behaviour.


## 22. Integration Validation Matrices

### 22.1 Input contract matrix
Verify required fields, data types, and nullability before report generation starts. Reject
incomplete inputs with explicit messages to prevent downstream confusion and repeated manual fixes.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.2 Category routing matrix
For each producer, define approved category, filename pattern, and fallback behaviour. Validate that
routing remains stable after template or workflow changes.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.3 Frontmatter compliance matrix
Check every generated file for required keys and date formatting. Include owner and tag policies
where repository standards recommend them.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.4 Heading structure matrix
Ensure one H1 per file and predictable section order. This supports both human readability and
parser reliability for downstream consumers.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.5 Code example matrix
Validate all JavaScript snippets for consistent module syntax and executable structure. Avoid mixed
CommonJS/ESM examples unless explicitly explained.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.6 Recommendation quality matrix
Confirm that each recommendation includes owner intent, timeframe, and expected outcome. Reports
should drive action, not just observation.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.7 Link integrity matrix
Review in-repo links for portability and prefer repository-relative references. Remove environment-
specific labels or temporary paths.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.8 Security hygiene matrix
Scan generated content for accidental secrets and sensitive records. Keep reporting payloads
sanitised and aggregate where needed.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.9 Performance behaviour matrix
Measure generation time and file write reliability under expected load. Apply bounded concurrency
and retries where transient failures occur.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.10 Archive lifecycle matrix
Verify archive operations preserve provenance and do not break active links. Ensure replacement
artefacts exist before archival moves.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.11 Consumer compatibility matrix
Test representative downstream consumers against generated report structure. Capture parser
assumptions and update documentation when contracts change.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.12 Operational logging matrix
Standardise log events and required fields for diagnostics. Include action name, category, filename,
and outcome in every run.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.13 Governance review matrix
Run recurring review of warning trends, repeated defects, and template drift. Feed outcomes into
backlog and ownership assignments.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.14 Release readiness matrix
Before release windows, verify report generation paths, validation gates, and rollback
documentation. Treat unresolved blockers as explicit risk items.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.

### 22.15 Post-change observation matrix
After major updates, monitor for regressions in output quality and routing stability. Use short
observation windows to catch early defects.
Checklist:
- Define owner for this matrix.
- Capture evidence artefact or command output.
- Record pass/fail and follow-up actions.


## 23. Adoption Roadmap

Adopt Reporting Agent v2 in staged increments to reduce rollout risk and speed up feedback cycles.

### 23.1 Phase A — Baseline integration

Start with one low-risk report flow, such as a weekly metrics digest. Implement explicit category
routing,
validation-before-save, and deterministic filenames. Run this in parallel with the existing process
for one
or two cycles and compare outputs. Confirm structure consistency and reviewer usability before
replacing the
legacy path.

### 23.2 Phase B — Controlled expansion

Add additional flows for progress, validation, and implementation categories. Reuse shared wrappers,
logging contracts, and naming helpers to avoid duplicate logic. Establish a small set of fixture
inputs and
verify that each flow produces stable output across reruns. Capture lessons from each addition and
update
team guidance.

### 23.3 Phase C — Governance hardening

Once core flows are stable, introduce routine governance checks: warning trend review, contract
parity
checks, and archive lifecycle audits. Use these checks to prevent drift and identify where
templates,
examples, or orchestrator defaults need refinement. Keep remediation ownership explicit and time-
bounded.

### 23.4 Phase D — Portfolio rollout

Extend adoption to cross-repository contexts only after local stability is proven. Normalise metric
definitions before aggregation and preserve per-repository provenance in all reports. Continue using
bounded concurrency and deterministic ordering to keep multi-repository outputs reproducible and
easy to
debug.

### 23.5 Success indicators

A mature adoption state is visible when reports are predictable, warnings trend downward, and
downstream
consumers no longer request manual clarification for structure or field meaning. Integration quality
should
be measurable through reduced review churn, faster incident diagnosis, and consistent governance
pass rates
across reporting categories.

As an additional checkpoint, sample reports from at least three categories each month and verify that
an unfamiliar maintainer can understand status, risks, and next actions without additional context
from the original author. If this is consistently true, the integration contract is clear and ready
for broader multi-repository use.

Track this checkpoint as a recurring governance item so readability regressions are identified early
and corrected before they become systemic documentation debt.


---

*Maintained by the LightSpeed Team.*
