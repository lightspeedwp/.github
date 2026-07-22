# Test Plan: File Schema Validation

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

Use this test plan to validate file structure across `templates/`, `examples/`, `schemas/`, and `memory/`.

## Goal

Confirm that reusable files in these folders follow a predictable structure so the agent can create, review, and extend them consistently.

## Validation scope

- `templates/`
- `examples/`
- `schemas/`
- `memory/`

## Schemas to use

- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`

## Test cases

### 1. Template files

Validate each template file against the template validation schema using file metadata extracted from the markdown file.

Required checks:

- filename ends with `-template.md`
- file starts with a level-1 title
- file contains the expected reusable section headings
- placeholders are left as blanks or reusable prompts, not filled example content

Current coverage:

- `templates/pre-launch-summary-template.md`
  - required sections: `## Completed`, `## Missing`, `## Risks`, `## Recommended next actions`
- `templates/site-discovery-template.md`
  - required sections: `## Business basics`, `## Site structure`, `## Content model`, `## Forms and SEO`
- `templates/gravity-forms-plan-template.md`
  - validate against its current section structure before accepting edits

### 2. Example files

Validate each example file against the example validation schema using file metadata extracted from the markdown file.

Required checks:

- filename starts with `example-`
- file starts with a level-1 title beginning with `# Example`
- file matches a known template family or output type
- file contains filled example content, not blank placeholders
- section headings match the related template where applicable

Current coverage:

- `examples/example-pre-launch-summary.md`
  - required sections: `## Completed`, `## Missing`, `## Risks`, `## Next actions`
- `examples/example-site-discovery.md`
  - required sections: `## Business basics`, `## Site structure`, `## Content model`, `## Forms and SEO`

### 3. Schema files

Validate each schema file against the schema-file validation schema.

Required checks:

- filename ends with `-schema.json`
- schema has a non-empty `title`
- root `type` is `object`
- `properties` exists and is not empty
- use `required` when a field must always be present

Current coverage:

- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`

### 4. Memory files

Validate memory files against the memory validation schema using file metadata extracted from the markdown file.

Required checks:

- markdown filename is stable and descriptive
- file starts with a level-1 title
- file contains the required operational sections for its memory role
- file purpose matches its role: stable defaults, active work, handoff, or history

Current coverage:

- `memory/user-preferences.md`
  - memory role: `stable-preferences`
  - required sections: `## Client overview`, `## Site defaults`, `## Form standards`, `## SEO priorities`, `## QA and compliance`, `## Notes`
- `memory/todos.md`
  - memory role: `active-work`
  - required sections: `## Active`, `## Blocked`, `## Follow-ups`, `## Pending decisions`, `## Done`, `## Notes`
- `memory/project-history.md`
  - memory role: `history`
- `memory/session-handoff.md`
  - memory role: `session-handoff`

## Pass criteria

- Every in-scope file matches its filename convention.
- Every in-scope file includes its required top-level headings.
- Example files contain concrete sample content.
- Template files remain reusable and do not drift into filled examples.
- Schema files keep a valid object-based shape with explicit properties.
- Memory files preserve clear separation between stable preferences and active work.

## Failure guidance

- If a template contains filled example content, move that content into `examples/`.
- If an example is missing a section expected by its template family, update the example or clarify the family mapping.
- If a schema file lacks `properties` or a valid object root, fix the schema before relying on it.
- If a memory file mixes durable defaults with active tasks, split the content between `memory/user-preferences.md` and `memory/todos.md`.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
