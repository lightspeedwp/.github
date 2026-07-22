# Memory Routing Guide

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
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

Use this guide to route durable information into the right Memory file.

## File Selection Table

| File | Save here when the item is... | Typical examples | Do not save here when the item is... |
| --- | --- | --- | --- |
| `user-preferences.md` | a reusable user-specific preference | preferred answer shape, preferred detail level, favored naming style, source preference | a workspace-wide rule that should apply beyond one user |
| `todos.md` | ongoing work that should continue later | unfinished audit, pending follow-up, blocked next step, work to resume | a completed one-off task with no future continuation value |
| `workspace-personalization.yaml` | a stable workspace-level default | default triage behavior, preferred issue-shaping structure, duplicate-handling default | a personal preference or one isolated exception |
| `decisions-log.yaml` | an explicit durable decision with rationale | a naming rule, approval stance, routing policy, reuse convention | a raw preference without reasoning or scope |
| `skill-routing-notes.yaml` | a repeatable rule about when to use or avoid a skill | no-skill cases, onboarding triggers, creator-vs-specialist routing | a one-time skill choice for a single request |
| `source-of-truth-register.yaml` | a standing source precedence rule | Linear wins for taxonomy, GitHub only for implementation evidence | ad hoc source choice that only mattered once |
| `assumptions-open-questions.yaml` | a still-open assumption that may affect later work | uncertain owner, unclear label policy, unresolved taxonomy question | a confirmed fact or a trivial uncertainty |
| `canonical-taxonomy-cache.yaml` | a durable mapping or normalization pattern | raw-to-canonical label mapping, routing keyword pattern, naming pattern | a one-off label choice that should not generalize |

## Decision Checklist

Before saving anything, ask:

1. Will this still help on a future Linear-focused run?
2. Is it stable enough to be reused?
3. Is it confirmed by the user, durable evidence, or an explicit standing convention?
4. Does one Memory file clearly own this kind of information?
5. Would saving it reduce future rework more than it increases Memory noise?

If the answer to most of these is no, skip the save.

## Priority Rules

When an item could fit more than one file, use this priority order:

1. `todos.md` for unfinished work that must be resumed
2. `decisions-log.yaml` for explicit durable decisions with rationale
3. `workspace-personalization.yaml` for workspace defaults
4. `user-preferences.md` for personal defaults
5. `canonical-taxonomy-cache.yaml` for recurring mappings
6. `source-of-truth-register.yaml` for source precedence
7. `skill-routing-notes.yaml` for skill choice rules
8. `assumptions-open-questions.yaml` for unresolved items

## Example Routing

### Example 1

Candidate item: "Use Engineering Enablement as the default routing team for CI workflow requests unless the request is clearly product-facing."

Route to: `workspace-personalization.yaml`

Why: this is a durable workspace triage default.

### Example 2

Candidate item: "Ash prefers concise bullet summaries with one recommended next step."

Route to: `user-preferences.md`

Why: this is a user-specific output preference.

### Example 3

Candidate item: "Pending follow-up: revisit duplicate-label cleanup after the next intake audit."

Route to: `todos.md`

Why: this is ongoing work to resume later.

### Example 4

Candidate item: "Treat Linear as the primary source for labels and issue taxonomy; only use Slack as supporting evidence."

Route to: `source-of-truth-register.yaml`

Why: this is a stable source precedence rule.

### Example 5

Candidate item: "If the request is mixed skill authoring plus packaging, prefer the creator skill instead of chaining specialists."

Route to: `skill-routing-notes.yaml`

Why: this is a repeatable skill-routing rule.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
