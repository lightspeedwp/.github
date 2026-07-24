Grounded note from the current file set:

- `memory/defaults/` currently contains **Markdown starter files only**
- there are **no `memory/defaults/*.yaml` files** right now
- the likely validation expansion should treat `memory/defaults/*.md` as canonical starters and `memory/schemas/*.schema.yaml` as the structured validation layer

## Prompt 1 — Audit, compare, and document the file structure

```text
Review this agent’s file structure and produce a concrete implementation plan, then apply the file-audit work.

Scope:
1. Review `memory/` and all subfolders.
2. Confirm whether `memory/defaults/*.yaml` files are expected. Use the current structure as source of truth.
3. Verify the role of every `memory/defaults/*.md` file for this agent.
4. Compare same-named files across `memory/`, `memory/defaults/`, and other relevant folders.
5. Remove only files that are exact duplicates.
6. Do not remove files that have different roles, even if names are similar.
7. Review all files in `intake/` and extract the logical purpose of each file.
8. Review every existing `README.md` in the project and identify where explanations, naming rules, or file inventories are incomplete.

Deliverables:
- A short audit summary of:
  - which files are canonical
  - whether `memory/defaults/*.yaml` should exist
  - which same-named files are exact duplicates
  - which files should be kept
- A concrete implementation plan for the documentation and validation updates
- A deletion plan that lists only exact duplicate files
- A proposed folder-by-folder README update plan

Constraints:
- Treat `memory/defaults/` as the canonical home for reusable memory starter files unless evidence in the repo proves otherwise.
- Treat `memory/schemas/*.schema.yaml` as validation/schema assets, not starter memory files.
- Be conservative with deletions.
- If a duplicate was already removed earlier, note that instead of recreating it.

Acceptance criteria:
- No speculative file deletions
- Clear distinction between starter files, schemas, references, and intake scaffolds
- Explicit statement on whether `memory/defaults/*.yaml` are supposed to exist
```

## Prompt 2 — Update instructions and all README files

```text
Using the completed audit, update the agent instructions and README files so the file structure is documented accurately and consistently.

Scope:
1. Update the main agent instructions so they accurately reference:
   - `memory/README.md`
   - `memory/defaults/`
   - `memory/schemas/`
   - `intake/`
   - `references/CONNECTORS.md`
2. Ensure the instructions clearly reflect that:
   - `memory/defaults/*.md` are reusable memory starter files
   - `memory/schemas/*.schema.yaml` are .schemas/validation files
   - `intake/` contains intake scaffolds, registers, checklists, and memory-promotion helpers
3. Update `memory/README.md` with:
   - folder purpose
   - naming conventions
   - file inventory
   - canonical location rules
   - duplicate-handling rule
4. Update `intake/README.md` with:
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
- Figma
- Linear
- Asana
- Gmail
- Web search

Constraints:
- Keep wording practical and maintenance-friendly
- Do not invent files that are not present unless you are explicitly adding new README files
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
2. Reduce drift across instructions, memory, business context, and references
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
- Ensure every example matches its paired template and schema
- Flag drift when templates evolve but examples lag

4. Memory hygiene validator
- Flag one-off or temporary items saved in `memory/defaults/user-preferences.md`
- Flag stale or completed items lingering in `memory/defaults/todos.md`
- Flag empty “Current” sections that should be intentionally empty or filled

5. Source-priority consistency validator
- Ensure source priority is consistent across:
  - agent instructions
  - `business-context.md`
  - `memory/defaults/user-preferences.md`
  - relevant reference guides

6. Schema-to-template coverage validator
- Verify each schema field has a place in the relevant template or starter file

7. Business context completeness validator
- Detect placeholders or missing maturity sections in `business-context.md`

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
- update `scripts/validate_all.py` to run the full pack

Implementation requirements:
- Reuse existing script patterns where possible
- Keep failures actionable with file paths and rule names
- Prefer deterministic checks over fuzzy heuristics
- Add validation coverage for the newly documented `memory/`, `intake/`, and `references/` structure where relevant

Acceptance criteria:
- All validators can be run independently
- `validate_all.py` runs the complete set
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
   - `memory/defaults/` starter files
   - `memory/schemas/` schemas
   - `intake/` scaffolds and registers
   - `references/` reference guides
   - `references/CONNECTORS.md`
5. Make sure the validation workflow explains the recommended run order and how `validate_all.py` fits in.

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
