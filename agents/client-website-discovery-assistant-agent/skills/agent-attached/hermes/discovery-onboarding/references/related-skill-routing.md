# Related LightSpeed Discovery Skill Routing

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this routing map when a request overlaps with website discovery but may belong to a neighbouring LightSpeed workflow.

## Core discovery flow

| User intent | Preferred skill | Onboarding role |
|---|---|---|
| Start a new website discovery and reusable basics are missing | `discovery-onboarding` | Collect minimum durable defaults, then continue. |
| Gather and normalise current notes, emails, docs, transcripts, links, files, issues, or feedback | `discovery-source-intake` | Save only durable defaults already present; do not store run-specific evidence. |
| Review an existing discovery pack, client summary, follow-up list, or section | `discovery-pack-review` | Use only if standing context is missing and material. |
| Decide which discovery/audit workflow should handle a mixed request | `handoff-router` or `lightspeed-project-intake-router` | Avoid asking onboarding questions unless a concrete website discovery task is starting. |

## Specialist discovery reviewers

| User intent | Preferred skill | Onboarding role |
|---|---|---|
| Assess website content quality, duplication, gaps, decay, or content strategy | `content-audit-strategist` | Ensure client/site/goal is clear if missing. |
| Assess hosting, environments, reliability, maintenance burden, or migration fit | `website-hosting-reviewer` | Ensure client/site/goal is clear if missing. |
| Assess speed, page weight, Core Web Vitals, loading behaviour, or optimisation risks | `website-performance-assessor` | Ensure client/site/goal is clear if missing. |
| Assess security exposure, risk areas, validation needs, or launch security concerns | `website-security-discovery-reviewer` | Ensure client/site/goal is clear if missing. |
| Assess consent posture, segmentation, duplication, inactivity, ownership, or deliverability risk | `email-list-reviewer` | Ensure client/project/goal is clear if missing. |
| Review crawlability, canonicals, metadata, sitemap, robots, indexation, or migration SEO risk | `technical-seo-audit` | Use only for missing basics; specialist skill owns the audit. |

## Downstream LightSpeed delivery routing

| User intent | Preferred skill | Onboarding role |
|---|---|---|
| Turn discovery into a PRD, goals, scope, personas, stories, acceptance criteria, or success metrics | `lightspeed-prd-generator` | Do not run unless website discovery defaults are genuinely missing. |
| Break a PRD or brief into tasks, delivery waves, estimates, or issue drafts | `lightspeed-task-breakdown-planner` | Do not run; this is beyond onboarding. |
| Draft GitHub-ready issues from a PRD, task plan, QA finding, or acceptance criteria | `lightspeed-github-issue-drafter` | Do not run; issue drafting owns the output. |
| Plan launch QA, page/template checks, accessibility checks, redirects, analytics, or go/no-go coverage | `lightspeed-launch-qa-planner` or `lightspeed-launch-readiness-auditor` | Do not run unless project basics are missing and needed. |
| Create release notes, support transition notes, client handover, or post-launch monitoring | `lightspeed-release-handoff-generator` | Do not run; release handoff owns the workflow. |

## Routing principles

1. Prefer the most specific skill that matches the user's requested output.
2. Use onboarding only to collect reusable defaults that unblock the selected workflow.
3. Do not treat every discovery-adjacent request as onboarding.
4. Do not save one-off evidence to Memory.
5. Continue the user's original task as soon as the minimum useful context is available.
6. Keep internal LightSpeed notes separate from client-facing outputs.

## Common examples

- "Start a discovery pack for Client X, their site is example.com, goal is lead generation" → save the supplied basics, skip questions, continue to the discovery output or source intake if evidence is messy.
- "Use these call notes and emails to build a project summary" → `discovery-source-intake`, not onboarding except for explicit reusable defaults.
- "Review this client-facing discovery summary before I send it" → `discovery-pack-review`, not onboarding.
- "Audit the current hosting risks before migration" → `website-hosting-reviewer`, not onboarding unless client/site/goal is missing.
- "Create GitHub issues from this discovery pack" → downstream delivery skill, not onboarding.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
