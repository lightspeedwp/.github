# Prompts

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

This folder stores reusable maintenance and cleanup prompts for Design Partner.

## Folder purpose

- keep recurring package-maintenance tasks easy to rerun
- separate focused cleanup passes by scope
- provide a clear entry point for routing, skill-routing, validation, README upkeep, instruction-reference checks, memory-lane checks, example-family checks, template-schema checks, connector-guide audits, review-history consistency, starter-prompt alignment, file-family gap audits, and prompt-library upkeep

## Files

- `routing-validation-cleanup-prompt.md` — top-level entry point for choosing the right cleanup pass
- `routing-audit-pass.md` — focused prompt for routing language, workflow boundaries, and artifact-boundary cleanup
- `skills-routing-and-directory-validation.md` — focused prompt for checking attached-skill routing, visible skill references, and grounded skill-surface accuracy
- `validation-pack-tightening.md` — focused prompt for schema, template, example, validator, and quality-check consistency work
- `update-all-readmes-to-current-structure.md` — focused prompt for refreshing README files against the visible file tree
- `recommended-cleanup-pass.md` — broader non-blocking cleanup pass across prompts, READMEs, templates, examples, schemas, and validation notes
- `instruction-reference-audit-pass.md` — focused prompt for checking whether the instructions still reference visible files, apps, skills, and memory lanes accurately
- `memory-lane-consistency-pass.md` — focused prompt for checking whether visible memory files, guidance, and schema support still describe distinct memory roles cleanly
- `example-family-drift-pass.md` — focused prompt for checking whether visible example files still match their visible template and schema families
- `template-schema-alignment-pass.md` — focused prompt for checking whether visible template and schema families still use the same field and section model
- `connector-guide-consistency-pass.md` — focused prompt for auditing visible connector guidance against the current attached apps and instruction references
- `file-family-gap-audit-pass.md` — focused prompt for finding visible workflow families that are incomplete or described too confidently for the files that are actually present
- `starter-prompt-alignment-pass.md` — focused prompt for checking whether the tagline and starter prompts still match the current instructions and configured capabilities
- `review-history-lane-pass.md` — focused prompt for keeping the review-history memory lane aligned across memory guidance, the live memory file, the entry template, and the schema
- `prompt-library-consistency-pass.md` — focused prompt for keeping the prompt index, router files, and specialized prompts aligned as the prompt library grows

## How to use this folder

- start with `routing-validation-cleanup-prompt.md` when the right cleanup pass is not obvious
- use a specialized prompt directly when the cleanup surface is already clear
- use `recommended-cleanup-pass.md` when the package needs broader non-blocking consistency cleanup rather than one narrow fix
- use `skills-routing-and-directory-validation.md` when the main question is whether the agent’s skill routes and visible skill notes still match the currently attached skills
- use `instruction-reference-audit-pass.md` when the question is whether the instructions still point to the right visible files, apps, skills, or memory lanes
- use `memory-lane-consistency-pass.md` or `review-history-lane-pass.md` when the main drift is in durable memory guidance
- use `example-family-drift-pass.md`, `template-schema-alignment-pass.md`, or `file-family-gap-audit-pass.md` when the main drift is in workflow-family structure
- use `starter-prompt-alignment-pass.md` when the agent’s public-facing tagline or starter prompts may no longer match the configured workflows
- use `connector-guide-consistency-pass.md` when app-usage guidance may no longer match the attached app inventory or instruction references
- use `prompt-library-consistency-pass.md` when the prompt library itself needs index or router cleanup
- keep edits grounded in the visible package structure
- do not assume hidden files, tests, validators, prompt files, or skill-package files exist unless they are visible or staged

## Relationship to the rest of the package

- `templates/`, `examples/`, `schemas/`, and `scripts/` are the main package surfaces these prompts help maintain
- attached skills are part of the agent surface even when their package files are not visible in agent files
- `memory/` stores durable working context, not maintenance prompts
- README refresh prompts should keep folder notes aligned with the visible package structure

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
