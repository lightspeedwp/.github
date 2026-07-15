# tests

## Purpose
This folder contains validation checklist material and test guidance for maintaining the agent asset pack.

## Naming conventions
- Use descriptive kebab-case names.
- Prefer names that describe the validation scope or scenario being tested.
- Keep checklist-style guidance in markdown unless executable tests are intentionally added later.

## Current file inventory
- `schema-validation-tests.md`

## Maintenance rules
- Use `schema-validation-tests.md` as the maintainer checklist when validating file-quality changes.
- Start with `bash scripts/validate-folder-schemas.sh` for the main validation pass.
- Treat `memory/` and `business-context.md` as optional validation targets that should skip cleanly when absent.
- Keep routing checks aligned with the mandatory PRD-to-test-pack path in the agent instructions, including review-before-code expectations for requirement-extraction work.
- Include a small skills-routing check so validation-facing docs continue to match the attached skill route and do not assume a skills directory that is not present.
- Include a lightweight MCP check so validation-facing docs continue to match the attached LightSpeed Playwright MCP app and do not overstate its role.
- Keep this folder focused on test guidance and validation coverage notes.
- If executable test fixtures or scenario packs are added later, document their run method here.
