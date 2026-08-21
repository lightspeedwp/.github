# Audit / Docs / Validation Workflow

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
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
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
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

Use this workflow when the request is to audit, document, refine, or validate this agent’s own files, references, templates, examples, tests, schemas, Memory files, or validation scripts.

Use UK English only in all outputs, audit notes, implementation plans, validation reports, and final summaries produced while following this workflow.

Grounded note from the current file set:

- `memory/` currently contains root-level Markdown files such as `README.md`, `user-preferences.md`, `todos.md`, `project-history.md`, and `session-handoff.md`
- there is **no `memory/defaults/` folder** in the current attached file set
- there is **no `memory/schemas/` folder** in the current attached file set
- the current validation layer is centred on `schemas/*.json`, reusable files under `templates/` and `examples/`, validation sources under `tests/`, and validation scripts under `scripts/`

## Prompt 1 — Audit, compare, and document the file structure

```text
Review this agent’s file structure and produce a concrete implementation plan, then apply the file-audit work.

Scope:
1. Review `memory/` and all subfolders.
2. Confirm whether a split `memory/defaults/` layer is actually expected, or whether the current root-level `memory/*.md` files are canonical. Use the current attached structure as source of truth.
3. Verify the role of every current `memory/*.md` file for this agent.
4. Compare same-named or closely related files across `memory/`, `references/`, `templates/`, `examples/`, `tests/`, and other relevant folders.
5. Remove only files that are exact duplicates.
6. Do not remove files that have different roles, even if names are similar.
7. Review all files in `tests/` and extract the logical purpose of each file.
8. Review every existing `README.md` in the project and identify where explanations, naming rules, file inventories, or validation guidance are incomplete.

Deliverables:
- A short audit summary of:
  - which files are canonical
  - whether a `memory/defaults/` layer should exist
  - which same-named files are exact duplicates
  - which files should be kept
- A concrete implementation plan for the documentation and validation updates
- A deletion plan that lists only exact duplicate files
- A proposed folder-by-folder README update plan

Constraints:
- Treat the current root-level `memory/` files as canonical unless evidence in the repo proves a different structure is required.
- Treat `schemas/*.json` as validation/schema assets, not starter memory files.
- Be conservative with deletions.
- If a duplicate was already removed earlier, note that instead of recreating it.

Acceptance criteria:
- No speculative file deletions
- Clear distinction between durable memory files, schemas, references, templates, examples, tests, and validation helpers
- Explicit statement on whether a split `memory/defaults/` layer is supposed to exist for this agent
```

## Prompt 2 — Update instructions and all README files

```text
Using the completed audit, update the agent instructions and README files so the file structure is documented accurately and consistently.

Scope:
1. Update the main agent instructions so they accurately reference:
   - `memory/README.md`
   - `memory/`
   - `schemas/`
   - `templates/`
   - `examples/`
   - `tests/`
   - `references/CONNECTORS.md`
2. Ensure the instructions clearly reflect that:
   - root-level `memory/*.md` files are the current durable memory files
   - `schemas/*.json` are .schemas/validation files
   - `templates/` contains reusable output templates
   - `examples/` contains maintained example outputs
   - `tests/` contains validation sources, checklists, and consistency fixtures
3. Update `memory/README.md` with:
   - folder purpose
   - naming conventions
   - file inventory
   - canonical location rules
   - duplicate-handling rule
4. Update `tests/README.md` with:
   - folder purpose
   - naming conventions
   - file inventory
   - recommended usage order
5. Update every other existing `README.md` so each includes:
   - purpose of the folder
   - naming conventions for the folder
   - outline of files in the folder
6. Add missing folder README files where useful, especially if a folder currently has no local explanation.

Also create:
- `references/CONNECTORS.md`

`references/CONNECTORS.md` must include:
- each attached app used by the agent
- what each app is used for
- what kind of evidence it provides
- any practical usage boundaries
- when to prefer files or Memory over app calls

Current app map to document:
- Google Drive
- GitHub
- LS Agency Dev Site
- Linear
- Web search

Constraints:
- Keep wording practical and maintenance-friendly
- Do not invent files that are not present unless you are explicitly adding new README files or the requested `references/CONNECTORS.md`
- README inventories should match the actual file tree

Acceptance criteria:
- Instructions reference the current folder structure correctly
- README files are consistent in format and useful for maintenance
- `references/CONNECTORS.md` is clear enough to guide future app usage and validation
```

## Prompt 3 — Expand the validation pack

```text
Expand the validation pack for this agent by adding and tightening validators for the current file structure.

Goals:
1. Strengthen validation coverage
2. Reduce drift across instructions, Memory, references, templates, examples, tests, and validation scripts
3. Improve memory quality
4. Tighten output reliability
5. Improve maintainability

Add or expand these validators:

1. Link/reference validator
- Check that referenced files in instructions still exist
- Catch broken entity-tag targets
- Catch renamed or missing referenced files

2. Markdown structure validator
- Verify required section order, not just presence
- Catch duplicate headings
- Catch empty sections
- Catch placeholder text left behind

3. Example/template alignment validator
- Ensure every example matches its paired template and relevant schema
- Flag drift when templates evolve but examples lag

4. Memory hygiene validator
- Flag one-off or temporary items saved in `memory/user-preferences.md`
- Flag stale or completed items lingering in `memory/todos.md`
- Flag empty current-state sections that should be intentionally empty or filled

5. Source-priority consistency validator
- Ensure source priority is consistent across:
  - agent instructions
  - `memory/user-preferences.md`
  - relevant reference guides
  - validation-oriented README files where relevant

6. Schema-to-template coverage validator
- Verify each schema field has a place in the relevant template or starter file

7. Business context / reference completeness validator
- Detect placeholders or missing maturity notes in reference or maintenance docs where those sections are expected

8. Starter-prompt quality validator
- Detect vague prompts
- Detect duplicated starter intent
- Detect starter prompts that no longer match the instructions

Target scripts:
- `scripts/validate-markdown-structure.py`
- `scripts/validate-template-schema-alignment.py`
- `scripts/validate-memory-hygiene.py`
- `scripts/validate-source-priority-consistency.py`
- `scripts/validate-business-context.py`
- `scripts/validate-starter-prompts.py`
- update `scripts/run-master-validation.sh` to run the full pack

Implementation requirements:
- Reuse existing script patterns where possible
- Keep failures actionable with file paths and rule names
- Prefer deterministic checks over fuzzy heuristics
- Add validation coverage for the current `memory/`, `references/`, `templates/`, `examples/`, `tests/`, and `schemas/` structure where relevant

Acceptance criteria:
- All validators can be run independently
- `run-master-validation.sh` runs the complete set
- Error messages are specific enough for a maintainer to fix quickly
- Validation rules reflect the actual file layout, not an outdated one
```

## Prompt 4 — Add validation documentation and test scenarios

```text
Finish the validation-pack expansion by documenting how to use the validators and by adding practical test coverage.

Scope:
1. Update validation documentation so it explains:
   - what each validator checks
   - when to run it
   - which folders/files it covers
   - common failure cases
2. Update folder READMEs if validator coverage changes what maintainers need to know.
3. Add or expand scenario-based tests for:
   - file-first research
   - decision tracing
   - digest generation
   - memory updates
   - follow-up/open-loop handling
4. Ensure the validation docs reflect the current structure:
   - root-level `memory/` files
   - `schemas/` validation schemas
   - `templates/` reusable templates
   - `examples/` maintained examples
   - `tests/` validation sources and checklists
   - `references/` reference guides
   - `references/CONNECTORS.md`
5. Make sure the validation workflow explains the recommended run order and how `run-master-validation.sh` fits in.

Priority order:
1. `validate-memory-hygiene.py`
2. `validate-source-priority-consistency.py`
3. `validate-template-schema-alignment.py`
4. remaining validators

Deliverables:
- updated validation documentation
- updated script usage guidance
- scenario-based tests or fixtures
- final implementation summary with:
  - files added
  - files changed
  - validators added or expanded
  - remaining future improvements

Acceptance criteria:
- A maintainer can understand the validation pack without reverse-engineering scripts
- The highest-value validators are documented first
- Test scenarios cover realistic agent workflows, not just isolated file checks
```

## Recommended order

1. **Prompt 1** — audit and deletion decisions  
2. **Prompt 2** — instructions, README files, `CONNECTORS.md`  
3. **Prompt 3** — validator implementation  
4. **Prompt 4** — validation docs and test coverage

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
