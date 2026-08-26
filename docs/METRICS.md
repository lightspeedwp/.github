---
file_type: documentation
title: Metrics & Telemetry
description: Defining key quality metrics and our telemetry policy
version: '1.0'
last_updated: '2026-08-21'
owners:
  - LightSpeed Engineering Ops
tags:
  - metrics
  - telemetry
  - CI
  - analytics
---

# Metrics & Telemetry

**`docs/METRICS.md`** – *Metrics & Telemetry Definition*

To continuously improve our processes, we track certain **development metrics**. These help us quantitatively verify that our community health files and automations are delivering value:contentReference[oaicite:21]{index=21}. Below we define what we measure (and what we **don’t** measure):

## Key Metrics Tracked

- **CI Failure Breakdown:** We categorize CI failures by type. For example, how many pipeline failures are due to formatting/lint issues vs. test failures vs. other causes. This helps identify if our pre-commit checks are effective (in an ideal state, CI failures from linting should approach zero).
- **Pre-commit vs CI Catch Rate:** We monitor how often our Husky pre-commit hook prevents an issue *before* CI. If something slips to CI that Husky should catch (e.g. a lint error), that indicates a gap. Our goal is a high pre-commit “pass rate” – meaning most commits meet quality standards, and CI failures are rare and usually for more complex issues.
- **PR Cycle Time:** The average time from PR open to merge. Since our automation (like issue templates, labeling, and pre-commit checks) aims to reduce friction, a decreasing PR cycle time (or time-to-merge) is a positive signal. We’ll track median and 90th percentile times.
- **Non-Functional Churn (Formatting Noise):** We measure what percentage of lines changed in a PR are purely formatting/styling (non-functional changes). A low percentage means developers have fewer “noise” changes – indicating that auto-formatting is being applied consistently. High values might mean folks need to run `npm run format` more often.
- **Lint Rule “Churn”:** Each quarter, we’ll review how many lint rules were added, removed, or disabled. Frequent rule changes may indicate instability in standards; our goal is a fairly stable lint baseline (with planned updates, not constant toggling).

Each metric is collected via scripts or the GitHub API and aggregated in a periodic report.

## Collection Method

A GitHub Action workflow (see **ci-metrics.yml** in workflows) runs on a schedule (weekly). It uses a custom Node script to gather data:

- For CI failures: It pulls recent workflow runs and tallies failure reasons (by parsing logs or using GitHub’s run conclusion and job names).
- For PR cycle time: It queries recent closed PRs’ open-to-merge intervals.
- For formatting churn: It scans merged PR diffs to calculate the ratio of whitespace/style-only changes (this requires parsing diffs; we approximate via known patterns).
- For lint rule churn: It looks at our ESLint/Stylelint config changes or count of `eslint-disable` comments added in the codebase over time.

The results are output as a Markdown summary (and in the future, maybe as an issue or dashboard). **Owner: Engineering Ops** will review this report quarterly:contentReference[oaicite:22]{index=22} and identify any action items (e.g. an uptick in formatting noise might prompt a reminder to developers to run Prettier, or an adjustment in our tools).

## Sample Metrics Report (illustrative)

- **This Week’s CI Failures:** 10 total – *6 from unit tests, 4 from linting.* (👍 lint issues down from 10 last week, indicating Husky is working.)
- **Pre-commit Hook Effectiveness:** 95% of pushes had no CI lint errors (i.e. Husky caught issues locally). 5% of pushes had lint problems in CI *(likely Husky was skipped or a new rule was added)*.
- **Median PR Cycle Time:** 2.1 days (from open to merge). *Down from ~3 days last quarter – possibly due to better issue templates and automated labeling.*
- **Formatting Churn:** 8% of lines changed in PRs were non-functional (formatting or comments). *This is relatively low, suggesting developers are using the auto-formatting tools.*
- **Lint Rule Churn:** 2 ESLint rules tweaked this quarter, 1 new Markdownlint rule added. *All were part of planned updates (see Changelog). No excessive rule thrash.*

These numbers will be tracked over time to spot trends.

## Telemetry Policy

**No personal telemetry is collected.** We do **not** track individual usage of editors or any keystroke data. Our focus is on repository-level metrics (as described above) and outcomes like CI results or PR durations.

- **Editor/IDE Telemetry:** We do not gather any data from user editors (e.g. we do *not* use VS Code or Copilot telemetry for this). While VS Code’s MCP extension can provide some insights, we have chosen not to enable any tracking there by default:contentReference[oaicite:23]{index=23}.
- **Optional Future Telemetry:** If we introduce a local tool to measure, for example, how often certain AI **instructions** are triggered or used, it will be strictly opt-in. We would clearly document how to enable it and what is collected, and it would never include sensitive or personally identifiable information.
- **Data Handling:** Metrics collected by our scripts (as outlined in the **Collection Method** section) are aggregated and used internally to improve our tooling. They do not include contributor identities (we anonymize or focus on aggregates).
- **Retention:** Metrics reports will be kept for trend analysis (likely in a `metrics/` directory or as issues). Raw data (e.g. API query results) is not stored long-term.

In summary, our approach to telemetry is *conservative*: we measure what we need to improve dev workflows and nothing more. We respect developer privacy and adhere to GitHub’s policies (no tracking beyond our repo boundaries without consent).

## Outcome Tracking

Over time, these metrics will tell us if our efforts are paying off. For example, if we see PR times dropping and fewer CI fails, that validates the efficiency gains we expected:contentReference[oaicite:24]{index=24}. Conversely, any negative trends will prompt investigation (perhaps via a retro or by adding an agent to assist). Metrics give us a feedback loop to continuously adjust our automation and documentation:contentReference[oaicite:25]{index=25}.

*(The Metrics Action is set up but initial data will be sparse. The first full report is expected next quarter as we accumulate data.)*

## Telemetry Policy

**No personal telemetry is collected.** We do **not** track individual usage of editors or any keystroke data. Our focus is on repository-level metrics (as described above) and outcomes like CI results or PR durations.

- **Editor/IDE Telemetry:** We do not gather any data from user editors (e.g. we do *not* use VS Code or Copilot telemetry for this). While VS Code's MCP extension can provide some insights, we have chosen not to enable any tracking there by default.
- **Optional Future Telemetry:** If we introduce a local tool to measure, for example, how often certain AI **instructions** are triggered or used, it will be strictly opt-in. We would clearly document how to enable it and what is collected, and it would never include sensitive or personally identifiable information.
- **Data Handling:** Metrics collected by our scripts (as outlined in the **Collection Method** section) are aggregated and used internally to improve our tooling. They do not include contributor identities (we anonymize or focus on aggregates).
- **Retention:** Metrics reports will be kept for trend analysis (likely in a `metrics/` directory or as issues). Raw data (e.g. API query results) is not stored long-term.

In summary, our approach to telemetry is *conservative*: we measure what we need to improve dev workflows and nothing more. We respect developer privacy and adhere to GitHub's policies (no tracking beyond our repo boundaries without consent).

## Outcome Tracking

Over time, these metrics will tell us if our efforts are paying off. For example, if we see PR times dropping and fewer CI fails, that validates the efficiency gains we expected. Conversely, any negative trends will prompt investigation (perhaps via a retro or by adding an agent to assist). Metrics give us a feedback loop to continuously adjust our automation and documentation.

*(The Metrics Action is set up but initial data will be sparse. The first full report is expected next quarter as we accumulate data.)*

## Related Files & Further Reading

- [docs/HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md) — Pre-commit hooks setup
- [docs/LINTING.md](./LINTING.md) — Linting strategy and tools
- [.github/workflows/ci-metrics.yml](../.github/workflows/ci-metrics.yml) — Metrics collection workflow
- [scripts/gather-metrics.js](../scripts/gather-metrics.js) — Metrics gathering script

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
