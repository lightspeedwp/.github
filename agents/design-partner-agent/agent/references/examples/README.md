# Examples

This folder stores example inputs, outputs, and reference artifacts for recurring Design Partner workflows.

## Folder purpose
- show what good outputs look like for key workflows
- support package consistency work across templates, schemas, and examples
- provide grounded precedent without turning examples into hard requirements

## Naming conventions
- use `*-example.md` for example outputs
- keep names aligned with the workflow vocabulary used in templates, schemas, and validators when a visible template or schema family exists
- use more specific prefixes only when a workflow has multiple examples

## Files
- `design-critique-example.md`
- `woo-product-page-critique-example.md`
- `tour-booking-audit-example.md`
- `publishing-homepage-audit-example.md`
- `research-synthesis-example.md`
- `design-brief-example.md`
- `ux-writing-example.md`
- `implementation-handoff-example.md`
- `reference-site-analysis-example.md`
- `execution-packet-example.md` — composite example for a multi-artifact execution packet; no matching visible template or schema family is currently present in this package slice

## Relationship to the rest of the package
- `templates/` provides reusable scaffolds; examples show what a completed artifact can look like.
- `schemas/` defines structured expectations for selected workflows that examples may reflect.
- `scripts/` contains selected checks and alignment validators; not every example family is enforced equally.
- `memory/` is for durable continuity, not example outputs.

## Usage note
Examples are precedent, not automatic truth. They should be updated when the package evolves so they remain consistent with the current templates, schemas, instructions, and visible validation rules.