# Workflow

## Purpose

This reference expands the compact `SKILL.md` workflow for parameter preparation work.

## Standard Sequence

1. Identify the asset type.
2. Pull out only confirmed source facts.
3. Normalize names, slugs, and titles.
4. Apply WordPress-specific required fields.
5. Fill optional fields with either:
   - a confirmed value
   - a safe default
   - an explicit blank where the working convention requires full-key output
6. Return a compact structured result.
7. Mark anything that must be validated downstream.

## Safe Defaults

- Pattern `Inserter`: `true`
- Custom template `postTypes`: `["page"]` if the prompt provides no better signal
- Template part slugs: prefer standard shared slugs before inventing new names
- Pattern categories: prefer WordPress core categories before custom categories

## Output Priority

Prefer these outputs in order:

1. parameter object
2. starter metadata/header block
3. `theme.json` fragment
4. missing-input checklist

## Things To Avoid

- inventing unsupported template hierarchy names
- inventing repository-only conventions without evidence
- treating this skill as the final code generator
- filling business-content fields with fake specifics
