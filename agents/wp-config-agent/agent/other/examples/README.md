# Examples

Use this folder for worked examples and sample outputs that show how the templates and reporting structures should look in practice.

## Folder purpose

This folder is the canonical examples layer.

Use it for:
- worked discovery examples
- worked pre-launch summary examples
- sample outputs used for validation and maintenance review

## How this folder relates to the rest of the structure

- `examples/` shows filled-in examples of structures defined in `templates/`.
- `schemas/` and `scripts/` validate example structure and consistency.
- `references/` provides the standing guidance behind the examples.
- `memory/` stores ongoing working state, not worked samples.

## Current file inventory

- `README.md` — maintenance guide for the examples layer
- `example-site-discovery.md` — worked example for the site-discovery structure
- `example-pre-launch-summary.md` — worked example for the pre-launch summary structure

## Naming conventions

Recommended patterns:
- `example-<scenario>.md`
- `sample-<deliverable>.md`
- `<workflow>-example.json`

## Maintenance notes

- Examples should demonstrate a template or workflow clearly.
- Keep examples aligned with their paired templates and relevant schemas.
- When examples drift from the templates they illustrate, update them or flag the mismatch in validation work.
