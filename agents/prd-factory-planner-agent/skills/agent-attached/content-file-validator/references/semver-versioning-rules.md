# SemVer Versioning Rules

Every validated document must include a `version` field in `MAJOR.MINOR.PATCH` form.

## Increment rules

- increment **MAJOR** for incompatible or breaking structural changes
- increment **MINOR** for backward-compatible additions
- increment **PATCH** for backward-compatible fixes, typo fixes, clarifications, or small corrections

## Validator behaviour

The validator can reliably detect when:

- a file changed and its version did not change
- a version field is missing
- a version value is not valid SemVer

The validator cannot safely infer the exact intended increment type from every diff.

When the file changed and the version changed, but the increment type cannot be confirmed from the available evidence alone, treat that as a warning for human confirmation rather than an automatic failure.

## Review guidance

When the increment type is ambiguous, ask the user whether the change should be treated as:

- breaking or structurally incompatible
- additive but backward-compatible
- a small correction or clarification

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
