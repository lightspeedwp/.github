# Validation-Pack Tightening Prompt

## Purpose

Use this recurring prompt to tighten the validation layer across validation docs, scripts, tests, and related consistency guidance.

## Prompt

Audit and tighten the validation pack so the current validation layer is accurate, deterministic, and aligned to the real asset-pack structure.

Primary goal:

- make validation docs, scripts, tests, and related references agree with each other and with the actual file tree
- tighten outdated, vague, or inconsistent validation expectations
- leave the validation layer actionable and non-blocking for current maintenance work

Scope priorities:

1. validation entry points and validator scripts
2. validation checklists, tests, and validation-focused documentation
3. README and reference wording that materially affects validation accuracy
4. only then nearby examples or notes that should match the same validation rules

Required working rules:

- Treat the real file tree and current validator entry points as source of truth.
- Prefer deterministic checks and actionable wording.
- Keep rule names, file paths, and folder references exact.
- Do not invent validators, schemas, files, or coverage claims that are not grounded.
- Preserve conservative duplicate handling and current optional-versus-required distinctions.

During the pass:

- compare validation docs against current scripts, folders, and files
- tighten wording where checks refer to stale paths, stale rules, or outdated assumptions
- review linked tests and reference notes that materially affect validator accuracy
- improve consistency around optional coverage, skip behaviour, and pass criteria
- keep edits focused on validation quality rather than broader documentation cleanup

Output requirements:

1. short validation-pack audit summary
2. exact files updated
3. any remaining non-blocking tightening opportunities
4. explicit confirmation that nothing in the validation layer remains blocking for the current structure

Validation expectation:

- Run the documented validation entry point when validation-sensitive files change.
- Prefer actionable validator language with concrete file paths and rule names where possible.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
