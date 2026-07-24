# Audit, Docs, and Validation Workflow

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

- `memory/` currently contains the agent’s active Markdown memory files directly
- there is **no `memory/defaults/` folder** in the current file set
- schema and validation assets currently live under `schemas/` and `scripts/`
- there is **no `intake/` folder** in the current file set right now
- there is **no attached `tests/` folder** in the current file set right now
- the current prompt library for recurring maintenance work lives under `prompts/`
- the likely validation expansion should treat `memory/*.md` as the canonical durable working-memory files, `schemas/*.json` as the structured validation layer, `templates/` as reusable output structures, and `examples/`, `profiles/`, `fixtures/`, and `prompts/` as supporting validation and maintenance assets

## Prompt 1 — Audit, compare, and document the file structure

```text
Review this agent’s file structure and produce a concrete implementation plan, then apply the file-audit work.

Scope:
1. Review `memory/` and all current memory files.
2. Confirm whether a `memory/defaults/` layer or structured default files are actually expected for this agent. Use the current structure as source of truth.
3. Verify the role of every current `memory/*.md` file for this agent.
4. Compare same-named or overlapping-purpose files across `memory/`, `templates/`, `examples/`, `references/`, `profiles/`, `fixtures/`, `prompts/`, and other relevant folders.
5. Remove only files that are exact duplicates.
6. Do not remove files that have different roles, even if names are similar.
7. Review all files in `profiles/`, `fixtures/`, `templates/`, `examples/`, `references/`, `schemas/`, `scripts/`, and `prompts/` and extract the logical purpose of each file or folder where relevant.
8. Review every existing `README.md` in the project and identify where explanations, naming rules, validation notes, or file inventories are incomplete.

Deliverables:
- A short audit summary of:
  - which files are canonical
  - whether `memory/defaults/` or structured default files should exist
  - which same-named files are exact duplicates
  - which files should be kept
- A concrete implementation plan for the documentation and validation updates
- A deletion plan that lists only exact duplicate files
- A proposed folder-by-folder README update plan

Constraints:
- Treat the current `memory/*.md` files as the canonical home for active durable memory unless evidence in the repo proves a new defaults layer is needed.
- Treat `schemas/*.json` and validation scripts in `scripts/` as validation/schema assets, not starter memory files.
- Be conservative with deletions.
- If a duplicate was already removed earlier, note that instead of recreating it.
- Do not assume `intake/` exists unless the file tree is changed intentionally.

Acceptance criteria:
- No speculative file deletions
- Clear distinction between memory files, schemas, templates, examples, references, profiles, fixtures, prompts, and validation assets
- Explicit statement on whether `memory/defaults/` is supposed to exist for this agent
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
   - `references/`
   - `profiles/`
   - `fixtures/`
   - `scripts/README.md`
   - `prompts/README.md`
   - `references/audit-docs-validation-workflow.md`
2. Ensure the instructions clearly reflect that:
   - `memory/*.md` are durable working-memory files
   - `schemas/*.json` are .schemas/validation files
   - `templates/` contains reusable output templates and checklists
   - `examples/` contains worked examples and sample outputs
   - `profiles/` contains reusable WordPress operating profiles
   - `fixtures/` contains validation and regression fixtures
   - `scripts/` contains validation and maintenance helpers
   - `prompts/` contains recurring maintenance and cleanup prompts
3. Update `memory/README.md` with:
   - folder purpose
   - naming conventions
   - file inventory
   - canonical location rules
   - duplicate-handling rule
4. Update `scripts/README.md` with:
   - folder purpose
   - naming conventions
   - validator inventory
   - recommended usage order
5. Update every other existing `README.md` so each includes:
   - purpose of the folder
   - naming conventions for the folder
   - outline of files in the folder
6. Add missing folder README files where useful, especially if a folder currently has no local explanation.

Also create or update:
- `references/CONNECTORS.md`

`references/CONNECTORS.md` must include:
- each attached app or runtime tool used by the agent
- what each app or runtime tool is used for
- what kind of evidence it provides
- any practical usage boundaries
- when to prefer files or Memory over app calls

Current app and runtime-tool map to document:
- WordPress website connection
- Google Drive
- GitHub
- Linear
- Bugherd
- Web search

Constraints:
- Keep wording practical and maintenance-friendly
- Do not invent files that are not present unless you are explicitly adding new README files or updating `references/CONNECTORS.md`
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
2. Reduce drift across instructions, memory, business context, references, templates, examples, prompts, and README files
3. Improve memory quality
4. Tighten output reliability
5. Improve maintainability

Add or expand these validators:

1. Link/reference validator
- Check that referenced files in instructions and documentation still exist
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
- Flag empty “Current” sections that should be intentionally empty or filled

5. Source-priority consistency validator
- Ensure source priority is consistent across:
  - agent instructions
  - `business-context.md`
  - `memory/user-preferences.md`
  - relevant reference guides such as `references/audit-docs-validation-workflow.md` and `references/CONNECTORS.md`

6. Schema-to-template coverage validator
- Verify each schema field has a place in the relevant template, example, or starter file

7. Business context completeness validator
- Detect placeholders or missing maturity sections in `business-context.md`

8. Prompt and README inventory consistency validator
- Detect prompt-library inventory drift against the attached `prompts/` files
- Detect stale README inventories against the attached file tree where lightweight deterministic checks are practical

Target scripts:
- `scripts/validate-agent-structure.py`
- `scripts/validate-memory-contents.py`
- `scripts/validate-markdown-structure.py`
- `scripts/validate-template-schema-alignment.py`
- `scripts/validate-memory-hygiene.py`
- `scripts/validate-source-priority-consistency.py`
- `scripts/validate-business-context.py`
- `scripts/validate-short-description-consistency.py`
- `scripts/validate-inventory-consistency.py`

Implementation requirements:
- Reuse existing script patterns where possible
- Keep failures actionable with file paths and rule names
- Prefer deterministic checks over fuzzy heuristics
- Add validation coverage for the documented `memory/`, `schemas/`, `templates/`, `examples/`, `references/`, `profiles/`, `fixtures/`, `prompts/`, and `scripts/` structure where relevant
- Do not assume a master validation runner exists unless it has actually been added to the file tree

Acceptance criteria:
- All validators can be run independently
- Error messages are specific enough for a maintainer to fix quickly
- Validation rules reflect the actual file layout, not an outdated one
```

## Prompt 4 — Add validation documentation and coverage scenarios

```text
Finish the validation-pack expansion by documenting how to use the validators and by adding practical coverage scenarios.

Scope:
1. Update validation documentation so it explains:
   - what each validator checks
   - when to run it
   - which folders/files it covers
   - common failure cases
2. Update folder READMEs if validator coverage changes what maintainers need to know.
3. Add or expand scenario-based coverage for:
   - file-first WordPress discovery or audit work
   - decision tracing
   - summary or digest generation
   - memory updates
   - follow-up/open-loop handling
4. Ensure the validation docs reflect the current structure:
   - `memory/` durable working-memory files
   - `schemas/` schemas
   - `templates/` reusable templates
   - `examples/` worked examples
   - `references/` reference guides
   - `references/audit-docs-validation-workflow.md`
   - `references/CONNECTORS.md`
   - `profiles/` reusable operating profiles
   - `fixtures/` validation fixtures
   - `prompts/` recurring maintenance prompts
5. Make sure the validation workflow explains the recommended run order for the currently attached validators and how any future master runner should fit in if one is added later.

Priority order:
1. `validate-memory-hygiene.py`
2. `validate-source-priority-consistency.py`
3. `validate-template-schema-alignment.py`
4. `validate-inventory-consistency.py`
5. remaining validators

Deliverables:
- updated validation documentation
- updated script usage guidance
- scenario-based fixtures or other lightweight coverage assets
- final implementation summary with:
  - files added
  - files changed
  - validators added or expanded
  - remaining future improvements

Acceptance criteria:
- A maintainer can understand the validation pack without reverse-engineering scripts
- The highest-value validators are documented first
- Coverage scenarios reflect realistic WordPress agent workflows, not just isolated file checks
- Documentation does not assume a `tests/` folder unless one has actually been added
```

## Recommended order

1. **Prompt 1** — audit and deletion decisions
2. **Prompt 2** — instructions, README files, `CONNECTORS.md`
3. **Prompt 3** — validator implementation
4. **Prompt 4** — validation docs and coverage scenarios

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
