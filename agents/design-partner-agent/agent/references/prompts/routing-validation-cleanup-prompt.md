# Routing and validation cleanup prompt library

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

Use this prompt as the entry point for routing and validation cleanup work in this agent package.

## Goal

Choose the narrowest useful cleanup prompt for the task in front of you so the package can be tightened without over-editing unrelated files.

## Prompt library

Use the specialized prompt that best matches the requested cleanup:

- `prompts/routing-audit-pass.md` — use for workflow naming, routing language, artifact-boundary, and escalation cleanup.
- `prompts/skills-routing-and-directory-validation.md` — use for attached-skill routing, visible skill-reference accuracy, and skill-surface consistency checks.
- `prompts/instruction-reference-audit-pass.md` — use for broken or stale instruction references to visible files, apps, skills, or memory lanes.
- `prompts/connector-guide-consistency-pass.md` — use for visible connector guidance that may no longer match the attached apps or instruction references.
- `prompts/memory-lane-consistency-pass.md` — use for broader durable-memory lane drift across visible memory files, guidance, and schema support.
- `prompts/review-history-lane-pass.md` — use for review-history-specific drift across the memory file, entry template, schema, and nearby guidance.
- `prompts/example-family-drift-pass.md` — use for visible example files that may no longer match their current visible family structure.
- `prompts/template-schema-alignment-pass.md` — use for template and schema family alignment issues.
- `prompts/file-family-gap-audit-pass.md` — use when visible workflow families are incomplete or described too confidently for the files that are actually present.
- `prompts/starter-prompt-alignment-pass.md` — use when the tagline or starter prompts may no longer match the configured workflows.
- `prompts/update-all-readmes-to-current-structure.md` — use for README refreshes tied to the current visible file and folder structure.
- `prompts/validation-pack-tightening.md` — use for schema, template, example, validator, and quality-check consistency work.
- `prompts/recommended-cleanup-pass.md` — use for a broader non-blocking cleanup pass across prompts, READMEs, templates, examples, schemas, and validation notes.
- `prompts/prompt-library-consistency-pass.md` — use when the prompt library itself needs index, router, or coverage cleanup.

## Selection rules

- Choose the routing audit prompt when the main issue is workflow names, routing guidance, artifact choice, or specialist escalation language.
- Choose the skills-routing validation prompt when the main issue is whether the current attached skills, visible skill references, and skill-routing notes still line up cleanly.
- Choose the instruction-reference audit prompt when the main issue is stale or broken instruction references to visible files, apps, skills, or memory lanes.
- Choose the connector-guide consistency prompt when app-usage guidance may no longer match the attached apps or the instruction references.
- Choose the memory-lane consistency or review-history-lane prompt when the main issue is durable-memory drift.
- Choose the example-family, template-schema, or file-family-gap prompts when the main issue is workflow-family structure drift.
- Choose the starter-prompt alignment prompt when the main issue is public-facing presentation drift in the tagline or starter prompts.
- Choose the README refresh prompt when the main issue is stale folder descriptions, file lists, or package structure references.
- Choose the validation tightening prompt when the main issue is .schemas/template/example/validator drift or overclaimed validation coverage.
- Choose the recommended cleanup pass when the main issue is broader non-blocking package consistency rather than one narrow cleanup surface.
- Choose the prompt-library consistency prompt when the main issue is that the prompt system itself is no longer indexed or routed cleanly.
- If the request clearly spans more than one of those areas, you may use the specialized prompts in sequence, starting with the narrowest high-impact pass first.

## Guardrails

- Ground all edits in the current visible package.
- Do not invent hidden files, tests, validators, prompt files, or skill-package files.
- Keep fixes conservative and focused on the requested cleanup surface.

## Deliverable

Use this library entry point to choose the right specialized cleanup prompt, then apply the smallest useful set of updates for that cleanup pass.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
