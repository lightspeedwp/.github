# App usage consistency tests

Use this guide to validate that instruction app references still match the currently attached app set.

## Goal

Catch instruction drift when attached apps change, especially when:

- an app was removed but is still mentioned in instructions
- a required attached app is missing from instructions
- an app tag label no longer matches the attached app label

## Snapshot workflow

### 1. Export or save an instructions snapshot

Create a markdown snapshot of the current instructions as one of:

- `instructions.snapshot.md`
- `references/instructions.snapshot.md`

Or pass a custom file path to the validator with `--instructions-file`.

### 2. Run the validator

Default snapshot locations:

```bash
python scripts/validate_app_usage_consistency.py
```

Custom snapshot path:

```bash
python scripts/validate_app_usage_consistency.py --instructions-file path/to/instructions.snapshot.md
```

## Expected checks

- every app tag in the instructions is still attached
- every required attached app is still referenced in the instructions
- app labels match the attached app labels
- optional or removed apps are not still referenced as active workflow apps

## Current expected attached apps

- `LightSpeed Zendesk`
- `Google Drive`

## Failure patterns to flag

- instructions still reference Slack after the Slack app was removed
- instructions omit Zendesk or Google Drive when the workflow still depends on them
- instructions use the wrong app label for an attached app
- instructions reference an unattached app id

## Pass criteria

- no stale app tags
- no missing required app references
- no app label mismatches

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
