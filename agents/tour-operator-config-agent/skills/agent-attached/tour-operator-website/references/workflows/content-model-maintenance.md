# Content-model maintenance workflow

Use this when updating the bundled source-backed model files from new uploaded source files, repository evidence, or live inspection.

## Update sequence

1. Identify the source package, date, branch/version if known, and files reviewed.
2. Separate post type JSON, taxonomy config PHP, relationship/facet code, extension code and integration code.
3. Update core files only from core evidence:
   - `references/content-model/core/post-types.json`
   - `references/content-model/core/taxonomies.json`
   - `references/content-model/core/relationships.json`
   - `references/content-model/core/source-map.md`
4. Update extension files only from extension-owned source evidence:
   - `references/content-model/extensions/to-reviews.json`
   - `references/content-model/extensions/to-team.json`
   - `references/content-model/extensions/to-specials.json`
5. Keep Wetu under `references/content-model/integrations/wetu-importer.json` unless code proves it owns stable content structures.
6. Update `field-usage-rules.md` and `facetwp-indexing-notes.md` when source behaviour affects template, filter or schema interpretation.
7. Validate every JSON file.
8. Run `references/validation/anti-drift-tests.md` before packaging.

## Source-confidence rules

- Use `confirmed uploaded source evidence` for fields, labels, settings and behaviour directly present in uploaded files.
- Use `confirmed repository evidence` only after current repository/code inspection.
- Use `unknown` for missing extension internals.
- Use `inferred` only where the inference is mechanically tied to a source, such as a taxonomy slug inferred from a config filename, and label it clearly.

## Do not do

- Do not copy relationship/facet references into core post type ownership.
- Do not turn WordPress.org marketing copy into field-level proof.
- Do not replace conservative extension placeholders with guesses.
- Do not claim JSON-LD support exists because schema mappings exist.
- Do not silently remove old source links; move deprecated links into a labelled section if needed.

## Maintenance output

```markdown
# Content-model update summary

## Sources reviewed
## Files changed
## Confirmed additions
## Changed or removed evidence
## Unknowns preserved
## Extension boundaries protected
## Validation results
## Anti-drift test notes
```
