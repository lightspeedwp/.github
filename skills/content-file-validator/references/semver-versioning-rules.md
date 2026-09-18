# SemVer Versioning Rules

Every validated document must contain:

```yaml
version: "1.0.0"
```

The value must be a string and must match:

`MAJOR.MINOR.PATCH`

## Interpretation

- `major` — incompatible or breaking structural changes, renamed required fields, removed required sections, or changes that break downstream expectations
- `minor` — backward-compatible additions such as new sections, new optional fields, new examples, or added supported use cases
- `patch` — typo fixes, wording clarifications, metadata corrections, formatting fixes, and small non-breaking improvements

## Version-Increment Enforcement

When a base revision is available:

- compare the current file with the previous file state
- if the file changed and the version did not increase, fail validation
- if the previous file cannot be loaded, warn instead of guessing

Use this warning when no previous revision is available:

`Version increment could not be verified because no previous version was available.`

## Ambiguity Rule

If the correct increment type cannot be inferred safely, do not guess. Warn and ask the user to confirm whether the change is `major`, `minor`, or `patch`.
