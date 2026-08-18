# Prepackage checklist

Use this checklist before returning an updated `skill.zip`.

## Structure

- [ ] There is exactly one `SKILL.md`.
- [ ] `SKILL.md` frontmatter contains only `name` and `description`.
- [ ] The skill name is lowercase and hyphenated.
- [ ] `agents/openai.yaml` exists.
- [ ] No example placeholder files from scaffolding remain.
- [ ] No bulky temporary files, raw archives, cache folders or generated dumps are included.

## References

- [ ] Files referenced by `SKILL.md` exist.
- [ ] Files referenced by `references/README.md` exist.
- [ ] Core content model files remain under `references/content-model/core/`.
- [ ] Extension content model files remain under `references/content-model/extensions/`.
- [ ] Wetu remains under `references/content-model/integrations/` unless ownership evidence proves otherwise.
- [ ] Content model JSON files are not flattened directly under `references/`.

## Evidence safety

- [ ] Core post type claims are source-backed.
- [ ] Relationship/facet sources are not treated as proof of core ownership.
- [ ] Extension models keep `unknown` where source evidence is missing.
- [ ] JSON-LD is described as readiness/planning unless implementation evidence exists.
- [ ] Memory files contain templates or durable facts only, not secrets or raw tool dumps.

## Validation

- [ ] All JSON files parse successfully.
- [ ] `scripts/validate_payload.py` passes when file access is available.
- [ ] `scripts/validate_content_model.py` passes when file access is available.
- [ ] `scripts/validate_output_contracts.py` passes when file access is available.
- [ ] Skill validator or packaging script passes.
- [ ] Anti-drift prompts have been reviewed after major logic changes.

## Return rule

Return the complete updated package as `skill.zip`, not a partial patch.


## Additional model-boundary check

Before packaging, run:

```bash
python3 scripts/validate_content_model.py .
```

Confirm the output says core, extension and schema assumptions remain constrained.

## Additional output-template check

Before packaging, run:

```bash
python3 scripts/validate_output_contracts.py .
```

Confirm the output says markdown/output contracts passed.
