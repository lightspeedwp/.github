---
file_type: documentation
title: Playwright Testing Agent — Security Policy
description: Security policy and data-handling boundaries for the Playwright Testing Agent.
last_updated: '2026-07-22'
domain: security
tags:
  - security
  - playwright
  - testing
---

# Security Policy — Playwright Testing Agent

## Data Handling

- No production data in test environments.
- No credentials or secrets in test files, logs, or tool arguments.
- Base URLs and credentials come from environment variables or repo/environment
  secrets — never literals.
- Secrets scanning runs on all commits (`secrets-scanner`, `agent-security-auditor`).

## Access Controls

- Read-only analysis by default.
- Sandboxed browser environments; staging/preview preferred over production.
- GitHub and BugHerd writes are approval-gated; write via branch + PR, never
  directly to `main`.
- No direct database access.

## Compliance

- Respect privacy, payment, and customer-data boundaries.
- WCAG 2.2 AA checks where UI behaviour is in scope.
- Avoid brittle production-dependent tests unless explicitly requested.

## Incident Reporting

Report security issues to [security@lightspeedwp.agency](mailto:security@lightspeedwp.agency).
See the org [SECURITY.md](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md).

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
