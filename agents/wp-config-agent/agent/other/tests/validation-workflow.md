# Validation Workflow

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

Use this guide to understand what each validator checks, when to run it, which files it covers, and how the full validation pack fits together for the current WordPress agent structure.

## Recommended run order

Run the validation pack in this order unless you are working on one narrow area only:

1. `python3 scripts/validate-memory-hygiene.py`
2. `python3 scripts/validate-source-priority-consistency.py`
3. `python3 scripts/validate-template-schema-alignment.py`
4. `python3 scripts/validate-reference-links.py`
5. `python3 scripts/validate-markdown-structure.py`
6. `python3 scripts/validate-business-context.py`
7. `python3 scripts/validate-starter-prompts.py`
8. `python3 scripts/validate-memory-contents.py`
9. `python3 scripts/validate-instruction-file-consistency.py`
10. `python3 scripts/validate-app-usage-consistency.py`
11. `python3 scripts/validate-short-description-consistency.py`
12. `python3 scripts/validate-agent-structure.py`
13. `bash scripts/validate-folder-schemas.sh`

Use `bash scripts/run-master-validation.sh` when you want the full pack executed in a single pass.

## What each validator checks

### `validate-memory-hygiene.py`

Checks:

- one-off or temporary language in `memory/user-preferences.md`
- completed-work language left in active todo sections
- empty or vague `Current` / `Current focus` lines in `memory/session-handoff.md`
- empty `Done` section handling in `memory/todos.md`

Covers:

- `memory/user-preferences.md`
- `memory/todos.md`
- `memory/session-handoff.md`

Run it when:

- memory files were edited
- project continuity rules changed
- onboarding or maintenance work touched memory guidance

Common failure cases:

- temporary notes saved in durable preferences
- completed work left under `Active`
- handoff lines that are blank or too vague

### `validate-source-priority-consistency.py`

Checks:

- source-priority language across maintenance docs
- consistency between Memory guidance, business context, the audit workflow, the connector guide, and the scripts guide
- outdated structure references such as `memory/defaults/`, `memory/schemas/`, or `intake/`
- consistency in how the docs distinguish development or staging evidence from live-site evidence

Covers:

- `business-context.md`
- `memory/user-preferences.md`
- `references/audit-docs-validation-workflow.md`
- `references/CONNECTORS.md`
- `scripts/README.md`

Run it when:

- folder structure assumptions change
- connector guidance changes
- environment-selection rules change for `LS Agency Dev Site` or `LS Agency LIVE MCP`
- maintenance rules or validation guidance are updated

Common failure cases:

- old folder assumptions left in docs
- source-of-truth language drifting between files
- Memory or connector guidance becoming contradictory
- dev-versus-live environment wording becoming inconsistent across maintenance docs

### `validate-template-schema-alignment.py`

Checks:

- required section coverage across templates and examples
- schema field coverage in the corresponding template or example
- paired alignment for site discovery, pre-launch summaries, and Gravity Forms planning

Covers:

- `templates/site-discovery-template.md`
- `examples/example-site-discovery.md`
- `schemas/site-discovery-schema.json`
- `templates/pre-launch-summary-template.md`
- `examples/example-pre-launch-summary.md`
- `templates/gravity-forms-plan-template.md`
- `schemas/enquiry-form-schema.json`

Run it when:

- templates change
- examples change
- schemas change
- reporting formats are tightened

Common failure cases:

- a template heading is removed without updating the example
- a schema field no longer maps cleanly to the output structure
- a new output requirement is added to one layer only

### `validate-reference-links.py`

Checks:

- missing file-path references in docs
- file entity-tag labels that no longer match current files
- outdated structure-path references in current maintenance docs
- connector-guide references that no longer match the attached WordPress apps

Covers:

- `business-context.md`
- files in `memory/`, `references/`, `templates/`, `examples/`, and `tests/`
- `schemas/README.md`
- `scripts/README.md`

Run it when:

- files are renamed, added, or removed
- instructions or maintenance docs gain new file references
- folder documentation is rewritten
- the WordPress app names or environment-routing guidance changes

Common failure cases:

- a README mentions a file that no longer exists
- entity-tag labels drift after a rename
- a doc still points to an old folder model
- the connector guide mentions the wrong WordPress app label or environment

### `validate-markdown-structure.py`

Checks:

- required top-level section order
- duplicate top-level headings
- empty required sections
- placeholder text left behind in key maintenance docs

Covers:

- key files in `memory/`
- `business-context.md`
- folder README files
- `references/CONNECTORS.md`
- `references/audit-docs-validation-workflow.md`

Run it when:

- README files are updated
- maintenance docs are restructured
- output structure rules change

Common failure cases:

- headings moved into the wrong order
- a section left blank during editing
- placeholder copy not removed before saving

### `validate-business-context.py`

Checks:

- required headings in `business-context.md`
- placeholder drift
- core domain coverage for WordPress, Gravity Forms, and Yoast SEO
- minimum maturity in outcomes and standards sections

Covers:

- `business-context.md`

Run it when:

- business context changes
- the agent scope changes
- validation rules start depending on new business context language

Common failure cases:

- placeholder note text left in place
- overly thin outcomes or standards sections
- missing core domain framing

### `validate-starter-prompts.py`

Checks:

- missing starter prompt titles or themes from the test snapshot
- vague prompts
- duplicated workflow intent
- missing WordPress context in prompts

Covers:

- `tests/starter-prompt-consistency-source.md`
- current starter-prompt snapshot expectations

Run it when:

- starter prompts change
- the core request routes change
- the agent’s user-facing focus shifts

Common failure cases:

- two prompts effectively doing the same job
- prompts becoming too generic
- prompt wording drifting away from WordPress use cases

### `validate-memory-contents.py`

Checks:

- deeper memory-content consistency beyond the higher-level hygiene rules
- role separation inside the memory files

Covers:

- memory files in `memory/`

Run it when:

- memory patterns are changing
- continuity handling is being refined

### `validate-instruction-file-consistency.py`

Checks:

- whether the instructions still align with the attached file set and documented structures
- whether environment-selection guidance for `LS Agency Dev Site` and `LS Agency LIVE MCP` still matches the attached docs

Covers:

- main instructions against referenced files and structure-sensitive docs

Run it when:

- instructions change
- maintenance files are added or removed
- request-route logic changes
- environment-routing rules for the attached WordPress apps change

### `validate-app-usage-consistency.py`

Checks:

- whether app and tool guidance still matches the current attached app usage rules
- whether development or staging guidance still points to `LS Agency Dev Site`
- whether live-site guidance still points to `LS Agency LIVE MCP`

Covers:

- app-facing instruction and reference guidance, including connector usage expectations
- attached WordPress app guidance for both development and live environments

Run it when:

- app guidance changes
- attached app usage rules are revised
- connector guidance is updated
- the development-versus-live environment logic changes

Common failure cases:

- dev or staging tasks pointing at the live app
- live-site checks pointing at the dev app
- app-usage wording drifting between the instructions and `references/CONNECTORS.md`

### `validate-short-description-consistency.py`

Checks:

- whether the short description still matches the current role and user-facing scope

Run it when:

- the agent positioning changes
- the role expands or narrows materially

### `validate-agent-structure.py`

Checks:

- whether the overall file structure still conforms to the current documented maintenance model

Run it when:

- folders are added or removed
- file-organisation rules change

### `validate-folder-schemas.sh`

Checks:

- schema-backed validation across folder-based file types

Covers:

- `templates/`
- `examples/`
- `schemas/`
- `memory/`

Run it when:

- schema-backed file formats change
- validation schemas change
- template or example structure changes

## Current structure this workflow assumes

The validation pack is grounded to the current structure:

- `memory/` for durable working-memory files
- `schemas/` for schemas and validation assets
- `templates/` for reusable output templates
- `examples/` for worked examples
- `references/` for reference guides
- `references/CONNECTORS.md` for app and runtime-tool usage guidance
- `profiles/` for reusable operating profiles
- `fixtures/` for validation fixtures
- `tests/` for validation docs and scenario-based coverage

The current app-routing model also assumes:

- `LS Agency Dev Site` is the development, staging, sandbox, and pre-release WordPress app
- `LS Agency LIVE MCP` is the live-site and published-state WordPress app

## Practical usage guidance

Use targeted validators when you are changing one layer only.

Examples:

- after editing memory rules, run memory hygiene and memory-content validation first
- after changing templates or examples, run template/schema alignment and markdown structure
- after changing README files or maintenance docs, run reference-link, markdown-structure, and source-priority validation
- after changing prompts or ChatGPT presentation, run starter-prompt and short-description validation
- after changing environment-selection guidance for the attached WordPress apps, run app-usage consistency, instruction-file consistency, source-priority consistency, and reference-link validation

Use the full master runner before treating a maintenance pass as complete.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
