# QA Checklist: File Schema Validation

Use this checklist as the standard validation flow for reusable files in `templates/`, `examples/`, `schemas/`, and `memory/`.

## When to run

- Before treating a new reusable file as a standard project artifact
- After editing file structure in `templates/`, `examples/`, `schemas/`, or `memory/`
- Before launch-readiness reviews that depend on these files being consistent
- Before handing the agent to another collaborator or using the files as repeatable references

## Standard validation flow

### 1. Run the automated validator

Run:

`python3 scripts/file-schema-validator.py`

Pass condition:

- The script finishes with a success result and no validation errors.

### 2. Confirm folder coverage

Check that the intended files are in the correct folders:

- reusable structures in `templates/`
- worked examples in `examples/`
- structured JSON schemas in `schemas/`
- durable continuity files in `memory/`

Pass condition:

- No file belongs in a different folder based on its purpose.

### 3. Review template files

Confirm each relevant template file:

- uses the expected filename pattern
- starts with a clear level-1 title
- keeps reusable blank placeholders instead of worked example content
- includes all required section headings

Pass condition:

- Templates are reusable and structurally complete.

### 4. Review example files

Confirm each relevant example file:

- uses the expected example naming pattern
- starts with an example title
- includes concrete filled content
- matches the expected section structure for its template family where applicable

Pass condition:

- Examples are realistic, filled, and easy to copy from.

### 5. Review schema files

Confirm each relevant schema file:

- is valid JSON
- has a non-empty title
- uses an object root when expected
- defines non-empty properties
- uses required fields where the structure depends on them

Pass condition:

- Schemas are structurally usable for validation and planning.

### 6. Review memory files

Confirm each relevant memory file:

- has a stable, descriptive filename
- starts with a clear level-1 title
- includes the required sections for its role
- keeps stable preferences separate from active work and short-term follow-ups

Pass condition:

- Memory stays organized and useful across future sessions.

### 7. Resolve failures

If the validator fails or the manual review finds drift:

- move misplaced content into the correct folder
- restore missing headings
- split templates and examples if one file is doing both jobs
- fix invalid or incomplete schema files
- separate durable preferences from active task tracking in memory files

Pass condition:

- Re-run `python3 scripts/file-schema-validator.py` and confirm it passes after fixes.

## Sign-off

- [ ] Automated validator passed
- [ ] Folder placement is correct
- [ ] Template files are reusable
- [ ] Example files contain real sample content
- [ ] Schema files are structurally valid
- [ ] Memory files keep durable and active context separate
- [ ] Issues found during review were corrected and rechecked

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
