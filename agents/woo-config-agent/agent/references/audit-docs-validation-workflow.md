# Audit / Docs / Validation Workflow for the WooCommerce Configuration Agent

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

Grounded note from the current file set:

- the current attached file tree is canonical for maintenance work unless newer attached file evidence is added
- local `memory/` guidance may or may not be attached in the current asset set
- the current structured validation layer is centered in `schemas/*.json`
- the current validation and maintenance scripts live in `scripts/`
- the current recurring maintainer prompt library lives in `prompts/`
- the current supporting documentation and reference layer is spread across `references/`, `tests/`, `schemas/`, `scripts/`, and `prompts/`

## Prompt 1 — Audit, compare, and document the file structure

```text
Review this agent’s file structure and produce a concrete implementation plan, then apply the file-audit work.

Scope:
1. Review `references/`, `schemas/`, `scripts/`, `tests/`, and `prompts/` and all relevant files inside them.
2. Confirm whether local memory guidance or memory starter files are actually attached. Use the current attached file set as source of truth.
3. Verify the role of any local memory guidance and any memory-related validation assets for this agent.
4. Compare same-named or same-purpose files across `tests/`, `references/`, `schemas/`, `scripts/`, and `prompts/` when relevant.
5. Remove only files that are exact duplicates.
6. Do not remove files that have different roles, even if names are similar.
7. Review all files in `tests/` and extract the logical purpose of each file.
8. Review every existing `README.md` and prompt-library inventory guide in the attached file tree and identify where explanations, naming rules, file inventories, or validator usage notes are incomplete.

Deliverables:
- A short audit summary of:
  - which files are canonical
  - whether local memory guidance or starter files are actually attached
  - which same-named or same-purpose files are exact duplicates
  - which files should be kept
- A concrete implementation plan for the documentation and validation updates
- A deletion plan that lists only exact duplicate files
- A proposed folder-by-folder README and prompt-library update plan

Constraints:
- Treat the current attached file tree as canonical unless newer attached file evidence proves otherwise.
- Treat `schemas/*.json` as structured validation assets, not memory starter files.
- Treat `tests/` as validation, QA, and scenario guidance unless file content proves a different role.
- Treat `prompts/` as recurring maintainer prompts, not as end-user delivery workflows.
- Be conservative with deletions.
- If a duplicate was already removed earlier, note that instead of recreating it.

Acceptance criteria:
- No speculative file deletions
- Clear distinction between memory notes, schemas, references, tests, scripts, and prompt-library files
- Explicit statement on whether local memory guidance or starter files are actually attached for this WooCommerce agent
```

## Prompt 2 — Update instructions and all README files

```text
Using the completed audit, update the agent instructions and README files so the file structure is documented accurately and consistently.

Scope:
1. Update the main agent instructions so they accurately reference:
   - `references/`
   - `schemas/`
   - `scripts/`
   - `tests/`
   - `prompts/` when the recurring prompt library is attached
   - `references/audit-docs-validation-workflow.md`
   - `references/CONNECTORS.md`
2. Ensure the instructions clearly reflect that:
   - any local memory guidance governs memory structure and durable memory usage notes when present
   - `schemas/*.json` are .schemas/validation files
   - `tests/` contains QA sources, scenario checks, and validation-supporting materials
   - `references/` contains durable guidance and standards
   - `scripts/` contains maintenance and validation helpers
   - `prompts/` contains recurring maintainer prompts when attached
3. Update local memory guidance when present with:
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
6. Add missing folder README files where useful, but only for folders that are actually attached or intentionally added during this maintenance pass.

Also create or maintain:
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
- Bugherd
- Linear
- KWV-Dev-Site
- Web search

Constraints:
- Keep wording practical and maintenance-friendly
- Do not invent files or folders that are not attached unless you are explicitly adding a new README for a currently attached folder
- README inventories should match the actual attached file tree

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
2. Reduce drift across instructions, memory, references, tests, schemas, and prompt-library guidance
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
- Catch unfinished marker text left behind

3. Schema alignment validator
- Ensure validation guidance matches the currently attached schemas
- Flag drift when schemas or validation docs evolve out of sync

4. Memory hygiene validator
- Flag temporary or one-off material saved in memory files
- Flag stale completed items that should not persist
- Flag empty sections that should be intentionally empty or filled

5. Source-priority consistency validator
- Ensure source priority is consistent across:
  - agent instructions
  - relevant reference guides
  - validation source files in `tests/` where applicable

6. Schema-to-output coverage validator
- Verify each schema field has a place in the relevant output pattern where applicable

7. Reference completeness validator
- Detect unfinished maintenance guidance in core reference files

8. Starter-prompt quality validator
- Detect vague prompts
- Detect duplicated starter intent
- Detect starter prompts that no longer match the instructions

Target scripts:
- `scripts/validate-reference-links.py`
- `scripts/validate-instruction-file-consistency.py`
- `scripts/validate-memory-files.py`
- `scripts/validate-file-naming.py`
- `scripts/validate-starter-prompts.py`
- `scripts/file-schema-validator.py`
- update `scripts/run-master-validation.sh` to run the full pack or add a clearer master runner if needed

Implementation requirements:
- Reuse existing script patterns where possible
- Keep failures actionable with file paths and rule names
- Prefer deterministic checks over fuzzy heuristics
- Add validation coverage for the documented `references/`, `schemas/`, `scripts/`, `tests/`, and `prompts/` structure, plus `memory/` when local memory files are attached

Acceptance criteria:
- All validators can be run independently
- The master validation runner runs the complete set
- Error messages are specific enough for a maintainer to fix quickly
- Validation rules reflect the actual attached file layout, not an outdated one
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
2. Update folder READMEs if validator coverage changes what maintainers need to know, including `prompts/README.md` when prompt-library guidance changes.
3. Add or expand scenario-based tests for:
   - site discovery
   - store audit and classification
   - implementation summary generation
   - launch-readiness summary generation
   - memory updates
   - follow-up/open-loop handling
4. Ensure the validation docs reflect the current structure:
   - `schemas/` validation assets
   - `tests/` QA and scenario sources
   - `references/` reference guides
   - `references/CONNECTORS.md`
   - `scripts/` validation helpers
   - `prompts/` recurring maintainer prompts when attached
   - `memory/` when local memory files are present
5. Make sure the validation workflow explains the recommended run order and how the master validation runner fits in.

Priority order:
1. `validate-memory-files.py`
2. `validate-source-priority-consistency.py`
3. `validate-template-schema-alignment.py`
4. `validate-markdown-structure.py`
5. `validate-reference-links.py`
6. `validate-instruction-file-consistency.py`
7. `validate-app-usage-consistency.py`
8. `validate-starter-prompts.py`
9. `validate-short-description-consistency.py`

Acceptance criteria:
- validator and prompt-library documentation matches the actual current validation pack
- scenario tests reflect the current agent role and structure
- run order is explicit and practical for maintainers
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
