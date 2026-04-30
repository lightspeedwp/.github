---
name: theme-json-to-preset-folders
description: >
  Extract a monolithic WordPress theme.json into modular preset files under
  styles/presets/. Use when migrating to modular theme.json architecture,
  reducing merge conflicts in design tokens, aligning with reference theme
  structure (e.g., Die Papier Tema), improving maintainability of theme settings,
  splitting theme.json into focused single-concern files, organizing large or
  huge theme.json files, or improving team collaboration on theme settings—even
  when they mention theme.json being unwieldy or causing conflicts.
license: MIT
compatibility: Requires understanding of theme.json structure and wp_theme_json_data_theme filter
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# Theme JSON To Preset Folders

## Purpose

Extract a WordPress theme `theme.json` into modular preset files under `styles/presets/`, keep `theme.json` minimal (theme recognition + colour tokens), and ensure the preset loader merges files safely.

## Goal

Produce a clean modular setup where:
- `theme.json` keeps only essentials for WordPress recognition and colour system
- non-colour settings/styles live in focused preset JSON files
- block-specific styles are in `styles/presets/blocks/`
- all JSON is valid and merge-ready for `wp_theme_json_data_theme`

## Expected Inputs

- target theme path (for example: `/path/to/theme`)
- target `theme.json`
- optional reference theme for naming and structure conventions
- preset loader file (typically `inc/presets.php`)

## Output Structure

Typical output under `styles/presets/`:
- `layout.json`
- `spacing.json`
- `typography.json`
- `shadows.json`
- `radii.json`
- `buttons.json`
- `links.json`
- `blocks/core-button.json`

Adjust file names only if the repository has an existing convention.

## Workflow

1. Audit Existing Structure
- inspect reference presets and naming conventions
- inspect target `theme.json` for candidate nodes to extract
- inspect preset loader behaviour (recursive loading, sort order)

2. Define Split Plan
- keep in `theme.json`:
  - `$schema`
  - `version`
  - `settings.color` (palette/gradients and defaults)
  - minimal `styles.color` defaults if used
  - `templateParts` and `customTemplates` if required
- extract into presets:
  - `settings.layout`, `settings.spacing`, `settings.typography`
  - `settings.shadow`, `settings.border`/radius
  - `settings.custom` tokens not required in root file
  - `styles.typography`, `styles.spacing`, `styles.elements.*`
  - `styles.blocks.*` into `styles/presets/blocks/*.json`

3. Create Preset Files
- create focused files with valid theme.json fragments
- include `$schema` and `version` in each preset file
- keep one concern per file to reduce churn

4. Trim Root Theme JSON
- remove extracted nodes from `theme.json`
- keep only recognition and colour essentials
- preserve existing `templateParts` and `customTemplates` unless explicitly requested otherwise

5. Validate
- syntax check every preset JSON file and root `theme.json`
- confirm preset folder is discovered by preset loader
- verify no duplicate or conflicting keys caused by extraction

6. Prepare PR Notes
- summarise what moved and why
- list added preset files
- include validation command(s)
- explicitly note if images were excluded

## Naming Conventions

- use kebab-case file names
- use `blocks/` subfolder for block-level files
- prefer descriptive file names by concern (`typography`, `spacing`, `buttons`)
- keep token names/slugs stable unless migration explicitly requires changes

## Validation Command Example

```bash
find styles/presets -name '*.json' -print | sort | while read -r f; do
  php -r '$s=file_get_contents($argv[1]); json_decode($s,true); if (json_last_error()) { fwrite(STDERR,$argv[1].": ".json_last_error_msg().PHP_EOL); exit(1);} ' "$f" || exit 1
done
php -r '$s=file_get_contents("theme.json"); json_decode($s,true); if (json_last_error()) { fwrite(STDERR,"theme.json: ".json_last_error_msg().PHP_EOL); exit(1);} echo "JSON OK".PHP_EOL;'
```

## Guardrails

- do not alter colour tokens unless requested
- do not rename existing slugs unless requested
- avoid moving template metadata unless requested
- keep diffs tight and focused on modularisation
- preserve WordPress coding and data safety practices
