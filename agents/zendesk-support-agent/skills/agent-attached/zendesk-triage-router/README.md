# Zendesk Triage Router

<!-- BADGES-START -->
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

Shared-agent-ready Zendesk-first support router for LightSpeed support workflows.

## Purpose

This skill replaces deprecated `ticket-triage` routing and embeds first-pass ticket triage inside the canonical `zendesk-triage-router` workflow. It should be attached to shared LightSpeed support agents that need to route Zendesk tickets, customer threads, repeated support patterns, escalation questions, reply requests, knowledge candidates, and backlog/reporting asks to the correct next workflow.

## Shared-agent setup

Attach this skill alongside the Zendesk-prefixed support workflow skills when available:

- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-customer-escalation`
- `zendesk-handoff-prep`
- `zendesk-duplicate-pattern-review`
- `zendesk-knowledge-candidate-review`
- `zendesk-create-knowledge`
- `zendesk-backlog-trend-analysis`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

The router is designed to degrade safely. If a recommended workflow is not attached to the parent agent, the model should describe the required support action in plain language rather than inventing an unavailable skill. Use `references/access-and-permissions.md` when connector permissions vary by teammate or Zendesk is unavailable. Use `references/parent-agent-routing.md` when a canonical Zendesk-prefixed route is unavailable and the router needs a plain-language fallback. Use `references/zendesk-field-map.md` when Zendesk fields, tags, queues, SLA state, or custom fields materially affect triage.

For installation or review, use `references/parent-agent-installation-checklist.md`. It contains the recommended baseline, companion skills, connector assumptions, smoke-test prompts, and maintenance checks for shared agents.

## Boundary with zendesk-router-skill

`zendesk-router-skill` owns the full Zendesk skill network. This skill should not become a second router. It owns embedded first-pass triage and only the common handoffs that naturally follow triage. Use `references/routing-boundaries.md` when reviewing whether a new route belongs here or should return to the central Zendesk router.

## Migration note

Do not keep `ticket-triage` as an independent routing skill or active route target. If an archived package must remain during transition, mark it as deprecated and configure it only as a thin alias that redirects requests to `zendesk-triage-router` without duplicating routing rules.

## Data safety

This package intentionally contains no real tickets, customer data, private account examples, credentials, or user-specific Memory defaults. Synthetic scenarios are included only for behaviour testing.

## Maintenance checks

Before sharing an updated package, run these checks from the skill folder:

```bash
python3 scripts/validate_router_package.py .
python3 scripts/run_router_regression_tests.py .
python3 scripts/lint_router_output.py path/to/saved-router-output.md
```

The regression harness validates the synthetic route coverage in `references/router-regression-cases.json`, including canonical routes, field-map reference coverage, and plain-language fallback behaviour. It is designed for package maintenance only; it does not call Zendesk, read real customer data, or simulate model reasoning.

For manual output QA, use `references/routing-output-quality-checklist.md` and `scripts/lint_router_output.py`. See `references/router-output-lint-examples.md` for valid and invalid synthetic outputs. After packaging, use the smoke-test prompts in `references/parent-agent-installation-checklist.md` inside the actual shared agent to confirm that attached skills and connector boundaries behave as expected

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
