# References folder

## Purpose
This folder stores the agent's durable operating references: routing rules, naming conventions, validation standards, connector usage guidance, ChatGPT presentation guidance, maintenance workflow guidance, and other lightweight canonical reference files.

## Naming conventions
- Use lowercase kebab-case for normal reference files.
- Use uppercase names only for standout operating references when intentional, such as `CONNECTORS.md`.
- Keep one canonical reference file per purpose.
- Update the existing reference file instead of creating a parallel version with overlapping purpose.

## File outline
- `file-usage-and-routing-guide.md` — canonical folder roles, routing rules, app-usage boundaries, and duplicate-file rules.
- `naming-conventions.md` — naming patterns and canonical file-placement rules.
- `validation-standards.md` — validation philosophy and quality boundaries.
- `chatgpt-presentation-spec.md` — short-description and starter-prompt guidance.
- `CONNECTORS.md` — attached app usage map, runtime-capability notes, and write boundaries.
- `audit-docs-validation-workflow.md` — execution checklist for file audits, documentation updates, validator changes, and validation/test maintenance work.
- `skill-routing-guide.md` — canonical reference for choosing the right attached specialist workflow and checking the intended routing order.

## Skill-routing guide usage
- Use `skill-routing-guide.md` as the primary reference when reviewing or updating how the agent should choose between attached specialist skills.
- Treat it as the canonical routing reference rather than duplicating routing logic across multiple overlapping reference files.
- Update the guide when the intended routing model changes in a grounded way.

## Relationship to prompts
- Use `prompts/validate-skills-routing-and-directory-prompt.md` when you want to audit whether the current instructions, attached skills, prompt files, and reference files still align with `skill-routing-guide.md` and the actual attached skill set.
- Use `prompts/repair-skills-routing-and-directory-prompt.md` after that validation pass when there are grounded issues to fix.
- In that sequence, `skill-routing-guide.md` is the canonical routing reference, the validation prompt checks for drift against grounded files and attached skills, and the repair prompt helps apply conservative fixes.
- If the validation pass shows that the routing guide itself is stale, update `skill-routing-guide.md` first or alongside any dependent prompt or instruction cleanup.

## Maintenance note
Keep this outline aligned to the files actually attached in the current draft. If a reference file is removed, added, or renamed, update this README instead of creating a second inventory file.
