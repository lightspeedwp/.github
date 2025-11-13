# Metrics & Telemetry

- **What we track:** CI failure mix, PR time-to-merge, non-semantic diff ratio, docs↔scripts parity errors, schema test coverage, lint rule churn.
- **How:** Weekly workflow `ci-metrics.yml` → `scripts/gather-metrics.js`.
- **Telemetry:** No local collection by default; any local telemetry is opt-in and documented.
