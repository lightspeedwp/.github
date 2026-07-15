# profiles

## Purpose
This folder contains reusable testing profiles that capture recurring QA posture, scope, or environment assumptions.

## Naming conventions
- Use descriptive kebab-case names.
- Use the `-profile.md` suffix for profile files.
- Keep profile names tied to the testing context they govern.

## Current file inventory
- `default-wordpress-profile.md`
- `woocommerce-profile.md`
- `lsxd-profile.md`
- `accessibility-smoke-profile.md`
- `visual-regression-profile.md`

## Maintenance rules
- Use profiles to standardise recurring testing defaults.
- Keep profile guidance reusable and stable across runs.
- Do not overload profiles with one-off project notes that belong in the current run instead.
