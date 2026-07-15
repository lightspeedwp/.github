# Routing and validation cleanup prompt library

Use this prompt as the entry point for routing and validation cleanup work in this agent package.

## Goal

Choose the narrowest useful cleanup prompt for the task in front of you so the package can be tightened without over-editing unrelated files.

## Prompt library

Use the specialized prompt that best matches the requested cleanup:

- `prompts/routing-audit-pass.md` — use for workflow naming, routing language, artifact-boundary, and escalation cleanup.
- `prompts/skills-routing-and-directory-validation.md` — use for attached-skill routing, visible skill-reference accuracy, and skill-surface consistency checks.
- `prompts/instruction-reference-audit-pass.md` — use for broken or stale instruction references to visible files, apps, skills, or memory lanes.
- `prompts/connector-guide-consistency-pass.md` — use for visible connector guidance that may no longer match the attached apps or instruction references.
- `prompts/memory-lane-consistency-pass.md` — use for broader durable-memory lane drift across visible memory files, guidance, and schema support.
- `prompts/review-history-lane-pass.md` — use for review-history-specific drift across the memory file, entry template, schema, and nearby guidance.
- `prompts/example-family-drift-pass.md` — use for visible example files that may no longer match their current visible family structure.
- `prompts/template-schema-alignment-pass.md` — use for template and schema family alignment issues.
- `prompts/file-family-gap-audit-pass.md` — use when visible workflow families are incomplete or described too confidently for the files that are actually present.
- `prompts/starter-prompt-alignment-pass.md` — use when the tagline or starter prompts may no longer match the configured workflows.
- `prompts/update-all-readmes-to-current-structure.md` — use for README refreshes tied to the current visible file and folder structure.
- `prompts/validation-pack-tightening.md` — use for schema, template, example, validator, and quality-check consistency work.
- `prompts/recommended-cleanup-pass.md` — use for a broader non-blocking cleanup pass across prompts, READMEs, templates, examples, schemas, and validation notes.
- `prompts/prompt-library-consistency-pass.md` — use when the prompt library itself needs index, router, or coverage cleanup.

## Selection rules

- Choose the routing audit prompt when the main issue is workflow names, routing guidance, artifact choice, or specialist escalation language.
- Choose the skills-routing validation prompt when the main issue is whether the current attached skills, visible skill references, and skill-routing notes still line up cleanly.
- Choose the instruction-reference audit prompt when the main issue is stale or broken instruction references to visible files, apps, skills, or memory lanes.
- Choose the connector-guide consistency prompt when app-usage guidance may no longer match the attached apps or the instruction references.
- Choose the memory-lane consistency or review-history-lane prompt when the main issue is durable-memory drift.
- Choose the example-family, template-schema, or file-family-gap prompts when the main issue is workflow-family structure drift.
- Choose the starter-prompt alignment prompt when the main issue is public-facing presentation drift in the tagline or starter prompts.
- Choose the README refresh prompt when the main issue is stale folder descriptions, file lists, or package structure references.
- Choose the validation tightening prompt when the main issue is schema/template/example/validator drift or overclaimed validation coverage.
- Choose the recommended cleanup pass when the main issue is broader non-blocking package consistency rather than one narrow cleanup surface.
- Choose the prompt-library consistency prompt when the main issue is that the prompt system itself is no longer indexed or routed cleanly.
- If the request clearly spans more than one of those areas, you may use the specialized prompts in sequence, starting with the narrowest high-impact pass first.

## Guardrails

- Ground all edits in the current visible package.
- Do not invent hidden files, tests, validators, prompt files, or skill-package files.
- Keep fixes conservative and focused on the requested cleanup surface.

## Deliverable

Use this library entry point to choose the right specialized cleanup prompt, then apply the smallest useful set of updates for that cleanup pass.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
