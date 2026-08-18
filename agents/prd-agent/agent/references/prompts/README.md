# prompts/

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

## Purpose

Store reusable recurring prompts that help maintain, audit, verify, repair, or extend the agent scaffold over time.

## Current files in this folder

### Core cleanup and audit prompts

- `recommended-cleanup-prompt.md` — broad high-signal cleanup pass for scaffold consistency, rebuild trustworthiness, and validation-aware maintenance.
- `routing-validation-cleanup-prompt.md` — focused cleanup pass for routing language, validation alignment, fixtures, README inventories, and parity-related documentation.
- `routing-audit-prompt.md` — focused audit pass for routing-model accuracy, attached-skill reality, and parity-aware routing docs.
- `readme-refresh-prompt.md` — recurring prompt to audit and refresh folder README files so they match the latest file and folder structures.
- `validation-pack-tightening-prompt.md` — focused prompt for tightening validation docs, fixtures, scripts, and validation assumptions around the current scaffold.

### Skills routing and directory maintenance

- `skills-routing-and-directory-validation-prompt.md` — comprehensive validation pass for attached-skill routing, skills-directory drift, naming consistency, and inventory accuracy.
- `skills-routing-and-directory-repair-prompt.md` — focused follow-up repair pass for concrete skills-routing and directory issues found by validation.
- `skills-attachment-sync-prompt.md` — audit prompt for checking whether local drafts, uploaded skills, and attached skills are in sync.
- `skills-boundary-and-overlap-audit-prompt.md` — audit pass for specialist-skill overlap, weak boundaries, and confusing routing handoffs.

### Alignment and parity prompts

- `template-example-fixture-parity-prompt.md` — check parity between canonical templates, worked examples, fixtures, and validation-oriented materials.
- `connector-and-source-alignment-prompt.md` — audit connector, source, and evidence-language alignment with the current configured tool layer.
- `starter-prompts-and-tagline-alignment-prompt.md` — review whether starter prompts and the short description still match the current agent role and routing model.
- `business-context-and-reference-alignment-prompt.md` — verify that business context and reference docs still support the current routing and output model.

### Support-layer promotion prompts

- `support-layer-promotion-sequencer-prompt.md` — main prompt for detaching overlap-heavy helpers, retrying the five support-skill attachments, and then updating instructions.
- `detach-overlap-heavy-helpers-and-attach-support-skills-prompt.md` — focused execution prompt for detaching overlap-heavy helpers and retrying the five support-skill attachments.
- `support-layer-instructions-alignment-prompt.md` — follow-up prompt for updating instructions only after the five support-layer skills are actually attached.

### LightSpeed local skill authoring prompt pack

- `lightspeed-local-skill-update-prompt-pack.md` — batched local skill-authoring and update prompt pack for the LightSpeed lifecycle suite and related support skills.

## Naming conventions

- Use lowercase kebab-case.
- Name each file after the maintenance action it is meant to trigger.
- Keep prompts self-contained so another user can run them without extra context.

## Prompt-library structure

- Broad prompts cover overall scaffold consistency.
- Focused prompts cover a specific maintenance slice such as routing audits, README refreshes, validation-pack tightening, or skill-directory repair.
- Validation prompts should identify issues clearly without repairing them.
- Matching repair prompts should make the smallest safe high-signal fixes tied to the validation findings.
- Sequencer prompts may chain narrower prompts when a multi-step attach-or-cleanup flow depends on verified preconditions.
- Keep prompts distinct enough that a handoff user can choose the smallest useful maintenance pass instead of running a broader audit than necessary.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
