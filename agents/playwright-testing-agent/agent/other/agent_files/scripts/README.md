# scripts

## Purpose
This folder contains validation and maintenance scripts for the Playwright Testing Agent asset pack.

## Current file inventory
- `validate-folder-schemas.sh`
- `validate-agent-pack.py`
- `validate-markdown-structure.py`
- `validate-template-schema-alignment.py`
- `validate-memory-hygiene.py`
- `validate-source-priority-consistency.py`
- `validate-business-context.py`
- `validate-starter-prompts.py`
- `validate-links-and-references.py`
- `validate-skills-routing.py`

## Recommended usage
- Start with `bash scripts/validate-folder-schemas.sh` for the main validation pass.
- Treat `memory/` and `business-context.md` as optional: the relevant validators should skip cleanly when those files are not present.
- Re-run the relevant validator after changing README files, examples, schemas, fixtures, profiles, prompts, scripts, or tests.

## Validator notes
- `validate-agent-pack.py` checks the current required folder tree, required files, naming rules, JSON schema shape, prompt-library inventory, and the maintained starter-prompt pack.
- `validate-markdown-structure.py` checks root and folder README files, prompt docs, and other markdown assets for required section order, duplicate headings, placeholders, and empty sections.
- `validate-template-schema-alignment.py` checks current example-to-schema pairings, schema-only exemptions, and stale template references when `templates/` is absent.
- `validate-links-and-references.py` checks file references, relative links, and entity-tag file targets across the documented markdown layer.
- `validate-starter-prompts.py` checks starter prompt quality, duplication, and unsafe write language.
- `validate-skills-routing.py` checks that the skills-routing prompt files and validation docs stay aligned with the current attached-skill route and do not assume a dedicated skills directory when none exists.
- `validate-memory-hygiene.py` checks memory-related hygiene rules only when `memory/` is present.
- `validate-source-priority-consistency.py` checks source-priority consistency only when a current file-based source-priority reference is present.
- `validate-business-context.py` checks business-context completeness only when `business-context.md` is present.
