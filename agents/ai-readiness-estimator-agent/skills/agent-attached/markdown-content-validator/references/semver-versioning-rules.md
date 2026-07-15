# SemVer Versioning Rules For Documentation Content

Use `MAJOR.MINOR.PATCH`.

## Major

Increment **MAJOR** for incompatible or breaking structural changes.

For documentation and template files, typical examples include:

- removed sections that downstream users rely on
- renamed required fields
- incompatible template changes
- changed expected usage patterns
- schema changes that break consumers

## Minor

Increment **MINOR** for backward-compatible additions.

Typical examples include:

- new sections
- new optional fields
- new examples
- new supported use cases
- backward-compatible template additions

## Patch

Increment **PATCH** for backward-compatible fixes and maintenance changes.

Typical examples include:

- typo fixes
- wording improvements
- formatting fixes
- metadata corrections
- small clarifications
- non-breaking maintenance edits

## When the correct bump is unclear

Do not guess. Ask the user to confirm whether the change should be treated as `major`, `minor`, or `patch`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
