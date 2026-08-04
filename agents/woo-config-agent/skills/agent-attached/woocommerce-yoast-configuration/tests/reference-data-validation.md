# Reference data validation tests

Run these checks before packaging or after any reference-data update.

## Required checks

1. `python3 scripts/validate_source_register.py references/source-register.md`
2. `python3 scripts/validate_reference_data.py .`
3. Confirm `SKILL.md` frontmatter contains only `name` and `description`.
4. Confirm `SKILL.md` links to the required progressively loaded files.
5. Confirm no reference file claims a source was scanned unless the source register includes an accessed date and key facts.
6. Confirm duplicate URLs remain in `references/source-register.md` and are marked as duplicates.
7. Confirm templates still match the expected output types.
8. Confirm changelog notes the package change.

## Pass criteria

- Both scripts pass.
- No unresolved placeholder markers.
- Source-register posture remains honest.
- Package validates with the Skill Creator packaging script.

## Added package hygiene checks

Run after adding files or changing routing:

```bash
python3 scripts/validate_skill_structure.py .
```

Expected result: the script reports file count and byte size, with no missing core files, unrouted paths, unexpected file types or oversized text/unknown files.

## Added research-pack schema check

Confirm `schemas/research-pack.schema.json` parses as JSON and includes the required top-level research-pack sections. This schema is structural only; it does not prove source freshness or Yoast behaviour.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
