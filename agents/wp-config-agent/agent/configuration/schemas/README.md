# Schemas

Use this folder for structured data models, schema assets, and validation rules that support the agent’s WordPress outputs and maintenance workflow.

## Folder purpose

This folder is the canonical schema and validation layer for the current file structure.

Use it for:
- WordPress workflow schemas
- file-structure validation schemas
- memory validation schemas
- schema assets used by templates, examples, and instructions

## How this folder relates to the rest of the structure

- `schemas/` defines the structured rules used to validate files and outputs.
- `scripts/` runs validation against the files in this folder and the folders it governs.
- `templates/` and `examples/` depend on schema coverage where structured validation is needed.
- `memory/` is validated against the memory-related schemas here.
- `references/` provides the standing guidance that these schemas help enforce.

## Current file inventory

- `README.md` — maintenance guide for the schema layer
- `enquiry-form-schema.json` — schema for enquiry-form planning and validation
- `site-discovery-schema.json` — schema for site-discovery outputs
- `template-file-validation-schema.json` — validation schema for files in `templates/`
- `example-file-validation-schema.json` — validation schema for files in `examples/`
- `schema-file-validation-schema.json` — validation schema for JSON schema files in `schemas/`
- `memory-file-validation-schema.json` — validation schema for durable working-memory files in `memory/`
- `memory-entry-schema.json` — schema for structured memory-entry validation and consistency checks

## Naming conventions

Recommended patterns:
- `<workflow>-schema.json`
- `<folder>-file-validation-schema.json`
- `<entity>-schema.json`

Keep names explicit about whether the schema validates a workflow payload, a file type, or a folder convention.

## Validation notes

Use these schemas together with the validation scripts in `scripts/`.

In practice:
- `template-file-validation-schema.json` supports template validation
- `example-file-validation-schema.json` supports example validation
- `schema-file-validation-schema.json` supports schema self-validation
- `memory-file-validation-schema.json` and `memory-entry-schema.json` support memory consistency and hygiene work

## Maintenance notes

- Update schema inventories when new schema files are added.
- Keep schema names aligned with the files or workflows they validate.
- When templates, examples, or memory rules evolve, review the corresponding schema coverage.
