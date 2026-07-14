# memory/schemas/

## Purpose
Store the schema files that validate durable planning memory.

## Current files in this folder
- `active-projects.schema.yaml` — validates active project records and their minimum fields.
- `approved-decisions.schema.yaml` — validates approved decision records.
- `assumptions-and-open-questions.schema.yaml` — validates combined assumption and open-question records.
- `decisions.schema.yaml` — validates general decision records.
- `open-questions.schema.yaml` — validates open-question tracking records.
- `skill-routing-notes.schema.yaml` — validates durable routing-note records.
- `source-of-truth.schema.yaml` — validates source-of-truth reference records.

## Naming conventions
- Use lowercase kebab-case for schema filenames.
- End schema filenames with `.schema.yaml`.
- Name each schema after the durable concept it validates.
- Keep each schema focused on one durable record family.

## Important distinction
These files are not the canonical memory layer. They exist to validate the durable records defined by `memory/defaults/` and any aligned memory examples. If the memory model changes, update the starter layer first, then update the schemas to match.
