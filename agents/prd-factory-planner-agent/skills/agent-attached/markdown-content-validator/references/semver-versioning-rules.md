# SemVer Versioning Rules

## Required format

Every validated file must contain:

```yaml
version: "MAJOR.MINOR.PATCH"
```

## Documentation interpretation

Use these defaults for documentation and template files:

- **MAJOR**: removed sections, renamed required fields, incompatible template changes, changed expected usage, or any structural change that would break downstream consumers.
- **MINOR**: new sections, new optional fields, new supported use cases, backward-compatible additions, or expanded examples that do not break existing usage.
- **PATCH**: typo fixes, formatting fixes, clarifications, metadata corrections, small wording changes, or other non-breaking maintenance edits.

## Version increment checking

When Git history or a base reference is available:

1. detect whether the file changed against the base reference
2. compare the previous and current `version` values
3. warn if the content changed without a version increment

If no previous version is available, warn with:

`Version increment could not be verified because no previous version was available.`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
