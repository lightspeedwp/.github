# Test Plan: File Schema Validation

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
