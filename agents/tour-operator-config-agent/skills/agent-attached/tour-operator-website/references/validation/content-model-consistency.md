# Content-model consistency checks

Use this file before repackaging the skill or after updating source-backed content-model files.

## Required checks

1. `references/content-model/core/post-types.json` must include only confirmed core post types unless new source evidence is bundled.
2. Confirmed core post types must include `tour`, `destination` and `accommodation`.
3. Extension model files must keep `slug: "unknown"` when extension registration evidence is not bundled.
4. Relationship/facet sources that reference `review`, `special`, `vehicle` or `activity` must not be promoted to core post types.
5. Taxonomy `objectTypes` may mention extension-facing object types, but that does not prove those object types are core-owned.
6. String pricing fields must not be described as structured price or availability data without an explicit field/source update.
7. JSON-LD mappings must remain `needs-validation` unless implementation evidence is bundled.
8. Any new source-backed field, taxonomy or relationship must include a source file and confidence label.

## Failure examples

- Adding `special` to core post types because `destination_to_special` exists.
- Treating `price` as numeric structured price data when the source field type is `string`.
- Claiming `Review` schema is implemented because a schema planning map exists.
- Documenting Wetu-owned content structures without importer source evidence.

## Recommended local command

Run both scripts from the skill root when file access is available:

```bash
python3 scripts/validate_payload.py .
python3 scripts/validate_content_model.py .
```
