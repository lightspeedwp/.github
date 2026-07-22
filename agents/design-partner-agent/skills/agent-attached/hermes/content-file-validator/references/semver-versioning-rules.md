# SemVer versioning rules

Every validated document must include:

```yaml
version: "1.0.0"
```

## Interpretation

Use semantic versioning as follows:

- **MAJOR** for incompatible or breaking structural changes
- **MINOR** for backward-compatible additions
- **PATCH** for backward-compatible fixes, typo fixes, clarifications, or small corrections

## Validation behavior

- If a file changed and the version did not increase, fail validation.
- If a specific change level is supplied and the new version does not match that bump, fail validation.
- If a file changed and the correct bump level cannot be inferred safely, warn and ask for the intended change type instead of guessing.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
