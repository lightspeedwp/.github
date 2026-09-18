# QA Scorecard

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this scorecard for every full skill QA review.

## Scoring Scale

| Score | Meaning |
|---:|---|
| 1 | Fails or is missing. Unsafe to rely on. |
| 2 | Weak. Some useful behaviour, but major gaps or ambiguity. |
| 3 | Adequate. Usable with human review and known limitations. |
| 4 | Strong. Reliable for normal use, with minor improvements possible. |
| 5 | Excellent. Clear, robust, reusable and safe for production workflows. |

## Mandatory Areas

| Area | What to Check |
|---|---|
| Skill directory | `SKILL.md`, `agents/openai.yaml`, useful references, removed examples, sensible file names, package-size risk. |
| Trigger clarity | Frontmatter description explains what the skill does, when to use it and key trigger contexts. |
| Routing accuracy | Upstream, downstream, overlapping and route-away skills are clear. |
| Skill memory behaviour | Durable defaults are separated from run-specific evidence. The skill does not invent memory or misuse user preferences. |
| Input handling | Handles complete, weak, missing, conflicting and unsupported inputs safely. |
| Output quality | Produces structured, reusable, practical LightSpeed-ready outputs. |
| Evidence discipline | Separates confirmed facts, assumptions, gaps, blockers and recommendations. |
| Boundary control | Stays within scope and avoids replacing neighbouring specialist skills. |
| Tool behaviour | Tool prerequisites, connector needs and safe-action rules are explicit. |
| Regression safety | Includes stable test prompts or retest criteria after updates. |

## Verdict Rules

| Total Score | Default Verdict |
|---:|---|
| 45-50 | Ready |
| 38-44 | Conditional Pass |
| 30-37 | Needs Revision |
| Below 30 | Not Ready |

## Approval Blockers

Any of these blocks a pass regardless of total score:

- Routing accuracy below 3.
- Input handling below 3.
- Output quality below 3.
- No clear trigger description.
- No safe failure path for unsupported work.
- Unsupported tool actions without prerequisite checks.
- Skill claims it completed actions it cannot verify.
- Skill duplicates multiple neighbouring skills without a clear boundary.

## Recommendation Labels

| Label | Use When |
|---|---|
| Approve | Skill is ready for regular use. |
| Improve | Skill is useful but needs targeted edits. |
| Retest | Skill has changed or evidence is insufficient. |
| Split | Skill owns too many distinct workflows. |
| Merge | Skill duplicates another skill and lacks a distinct trigger. |
| Retire | Skill is obsolete, unsafe, or superseded. |

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
