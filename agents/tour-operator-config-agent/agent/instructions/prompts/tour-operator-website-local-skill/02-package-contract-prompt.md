# Package contract prompt

Define the exact package contract for a local `tour-operator-website` skill using only verified evidence from `prompts/tour-operator-website`.

This phase converts the audited source tree into a build contract. Do not draft missing content that the source folder does not support.

## Goal

Lock the package shape before assembly so later phases can build safely without inventing structure or behaviour.

## Inputs

Use:

- the verified inventory from `01-source-audit-prompt.md`
- the readable contents of `prompts/tour-operator-website`
- any already verified package metadata inside the source folder

## Required contract decisions

Define, only when supported by source evidence:

- canonical skill name
- package root
- required entry files
- required metadata files
- required reference folders
- optional but supported folders
- files that must be copied exactly
- files that should stay out of the packaged skill because they are not part of the skill package
- validation requirements before upload
- attach-time instruction alignment needs

## Anti-invention rules

- If the source folder does not explicitly support a contract decision, mark it `unverified` instead of deciding it.
- Do not invent assets, icons, scripts, examples, schemas, or support folders to make the contract look cleaner.
- Do not treat agent maintenance docs outside the source folder as stronger evidence than the source folder itself.

## Output format

Report the contract under these headings:

1. `Verified package identity`
2. `Required files and folders`
3. `Optional but supported files and folders`
4. `Excluded or non-package material`
5. `Open gaps that block safe packaging`
6. `Ready next phase`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
