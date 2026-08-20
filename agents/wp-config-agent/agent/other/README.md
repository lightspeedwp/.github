# WordPress Configuration Agent File Map

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

This file explains the current attached file structure for the WordPress Configuration Agent and how each folder fits into the broader maintenance, reporting, and validation workflow.

## Structure overview

### Root files

- `README.md` — top-level map of the attached file structure
- `business-context.md` — agent-wide business context and standing scope guidance

### Main folders

- `memory/` — durable working state used across future runs
- `templates/` — reusable output structures for recurring deliverables
- `examples/` — worked examples that show how template-based outputs should look
- `references/` — standing guidance, standards, conventions, and maintenance documentation
- `schemas/` — structured validation assets and schema rules
- `scripts/` — validation runners and helper scripts for file, wording, and maintenance checks
- `profiles/` — reusable operating profiles for recurring WordPress work
- `fixtures/` — compact synthetic validation and regression inputs
- `prompts/` — reusable maintenance and cleanup prompts

## How the folders fit together

### `memory/`

Use `memory/` for durable working continuity.

It holds files such as:

- `user-preferences.md`
- `todos.md`
- `project-history.md`
- `session-handoff.md`

This folder stores live continuity, approved defaults, short milestone history, and handoff state. It is not the place for reusable templates, worked examples, standing reference guidance, or schema assets.

### `templates/`

Use `templates/` for reusable structures for recurring outputs.

Current templates include:

- `pre-launch-summary-template.md`
- `site-discovery-template.md`
- `gravity-forms-plan-template.md`

Templates define output structure and repeatable section order. They should stay reusable and should not contain filled-in sample content.

### `examples/`

Use `examples/` for worked sample outputs.

Current examples include:

- `example-pre-launch-summary.md`
- `example-site-discovery.md`

This folder demonstrates how outputs from `templates/` should look in practice. It is for illustrative samples, not canonical templates or durable project memory.

### `references/`

Use `references/` for stable guidance the agent should rely on across runs.

Current references include:

- `gravity-forms-standard.md`
- `file-naming-conventions.md`
- `audit-docs-validation-workflow.md`
- `CONNECTORS.md`

This folder holds standing rules, conventions, and maintenance guidance rather than active project state, sample outputs, or validation scripts.

### `schemas/`

Use `schemas/` for JSON schemas and validation-rule assets.

Current schema coverage includes:

- workflow schemas such as `site-discovery-schema.json` and `enquiry-form-schema.json`
- file-validation schemas for `templates/`, `examples/`, `schemas/`, and `memory/`
- memory consistency assets such as `memory-entry-schema.json`

This folder defines the structured rules used by the validation layer. `scripts/` runs checks against these assets and against the folders they describe.

### `scripts/`

Use `scripts/` for deterministic validation runners and helper scripts.

Current scripts include:

- `validate-agent-structure.py`
- `validate-memory-contents.py`
- `validate-markdown-structure.py`
- `validate-template-schema-alignment.py`
- `validate-memory-hygiene.py`
- `validate-source-priority-consistency.py`
- `validate-business-context.py`
- `validate-short-description-consistency.py`
- `validate-inventory-consistency.py`

These scripts validate file structure, documentation consistency, Markdown hygiene, inventory drift, template-to-schema alignment, memory quality, and other maintenance rules across `memory/`, `templates/`, `examples/`, `references/`, `schemas/`, `prompts/`, and related agent files.

### `profiles/`

Use `profiles/` for reusable operating profiles that can shape recurring WordPress work.

This folder is for reusable patterns and defaults that may guide recurring audits, planning, or configuration work. It is not for live project continuity or standing cross-project reference documentation.

### `fixtures/`

Use `fixtures/` for compact synthetic inputs that support validation and regression checks.

This folder complements `scripts/` and `schemas/` by providing small safe test inputs when needed. It is for validation support, not for worked examples or active project memory.

### `prompts/`

Use `prompts/` for recurring maintenance and cleanup prompts.

The current prompt library covers:

- routing audits
- README refreshes
- validation-pack tightening
- skills routing and directory validation
- local-skills inventory refresh
- file and reference alignment
- workflow asset consistency
- library hygiene

Current prompt files include:

- `README.md`
- `accessibility-checker-assets-alignment-prompt.md`
- `app-and-connectors-consistency-prompt.md`
- `attached-skills-reference-alignment-prompt.md`
- `business-context-tightening-prompt.md`
- `entity-tags-and-file-reference-audit-prompt.md`
- `gravity-forms-assets-consistency-prompt.md`
- `instructions-and-file-references-alignment-prompt.md`
- `launch-readiness-assets-alignment-prompt.md`
- `local-skills-inventory-refresh-prompt.md`
- `memory-layer-consistency-prompt.md`
- `prompt-library-deduplication-prompt.md`
- `prompt-library-inventory-refresh-prompt.md`
- `readme-recurring-cleanup-prompt.md`
- `reference-guides-consistency-prompt.md`
- `reporting-rules-and-template-consistency-prompt.md`
- `root-readme-refresh-prompt.md`
- `routing-language-cleanup-prompt.md`
- `skills-routing-and-directory-validation-prompt.md`
- `starter-prompts-alignment-prompt.md`
- `template-and-example-alignment-prompt.md`
- `validation-pack-tightening-prompt.md`
- `validator-coverage-gap-review-prompt.md`
- `yoast-assets-consistency-prompt.md`

These prompts support repeatable documentation and consistency work without changing the main agent role. They complement the deterministic checks in `scripts/` by providing reusable prompt-based maintenance instructions.

## Recommended maintenance flow

For maintenance work, use this structure in order:

1. read the relevant folder `README.md`
2. review the files in that folder
3. use `references/` for standing rules and conventions
4. use `schemas/` and `scripts/` to validate structural consistency
5. use `examples/` to confirm outputs still match `templates/`
6. update this root `README.md` when the top-level structure changes materially

## Documentation rules

- Keep folder-level `README.md` files aligned with the current file tree.
- Update inventories when files are added, renamed, or removed.
- Keep responsibilities separated: memory is for continuity, templates are for structure, examples are for samples, references are for standing guidance, schemas are for rules, scripts are for validation, fixtures are for compact test inputs, profiles are for reusable operating patterns, and prompts are for recurring maintenance instructions.
- Do not invent folders or responsibilities that are not present in the current attached file tree.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
