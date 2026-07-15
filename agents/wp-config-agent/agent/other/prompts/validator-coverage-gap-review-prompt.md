# Validator Coverage Gap Review Prompt

Review the current validation pack and identify the highest-value lightweight gaps that still remain across scripts, schemas, prompts, README files, and maintenance references.

Scope and intent:

- This is a validation-gap review task, not a full validator implementation pass unless a small deterministic addition is clearly warranted.
- Treat the current scripts, schemas, READMEs, prompts, and validation documentation as the source of truth.
- Focus on practical deterministic checks that would catch real future drift.

Primary goal:

- Find the smallest useful additions or tightenings that materially improve validation coverage without overbuilding the pack.

What to review:

1. `scripts/`
2. `schemas/`
3. Folder README files
4. `prompts/`
5. Validation workflow references in `references/`
6. Root `README.md`

What to check for:

- important maintenance drift that is not currently caught by any validator
- README inventory assumptions that have no matching deterministic check
- prompt-library or root README drift not yet covered cleanly
- documentation sections whose required structure is not reflected in validation rules
- validators that still assume files or folders that are not attached

Editing rules:

- Prefer recommendations first.
- Only add or tighten a validator when the check is lightweight, deterministic, and clearly useful.
- Do not introduce speculative or fuzzy validation rules.
- Preserve still-correct validator scope.

Output:

1. Files reviewed
2. Validator gaps found
3. Any new checks recommended
4. Any new checks added
5. Any remaining future improvements

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
