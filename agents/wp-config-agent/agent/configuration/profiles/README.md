# Profiles

Use this folder for reusable WordPress operating profiles that shape how the agent audits, configures, and reports on recurring project types or priority modes.

## Folder purpose

This folder is the canonical reusable profile layer.

Use it for:
- repeatable operating profiles
- WordPress project-type defaults
- priority-area guidance that should not live in project memory

## How this folder relates to the rest of the structure

- `profiles/` stores reusable operating patterns that can inform recurring WordPress work.
- `memory/` stores live continuity and project-specific state, not reusable profiles.
- `references/` stores standing guidance and conventions rather than profile-style operating defaults.
- `templates/` and `examples/` define and demonstrate output structures, not reusable operating profiles.

## Current file inventory

- `README.md` — local guidance for how reusable profiles should be structured and maintained

## Naming conventions

Recommended patterns:
- `<wordpress-scope>-profile.md`
- `<priority-area>-profile.md`

## Maintenance notes

- Keep profiles reusable and WordPress-specific.
- Do not store project-private continuity or one-off notes here.
- When new profile files are added, update this inventory and ensure the profile scope is clearly separated from `memory/` and `references/`.
