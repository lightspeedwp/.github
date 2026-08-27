# QA Rubric

Score each output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Correct skill used | The request is about preparing or normalizing asset parameters |
| Naming | Slugs and titles are normalized | Slugs are lowercase hyphen-case and titles are human-readable |
| WordPress alignment | Required fields are present | The asset type includes the right path, metadata, and structure hints |
| Safe defaults | Missing values are handled carefully | Defaults are reasonable and assumptions are stated |
| Boundaries | Skill does not overreach | Final generation work is routed onward when appropriate |
| Validation handoff | Risks are surfaced | The output clearly marks what should be checked by the validator |

## Minimum Acceptance Standard

- no invented unsupported WordPress fields
- no un-namespaced pattern slug
- no non-standard template part area without an explicit note
- no custom template without both file path and `theme.json` registration guidance
