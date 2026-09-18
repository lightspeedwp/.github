# Validation Rules

## Memory hygiene

Fail if memory files are missing, encourage sensitive storage, omit stale-decision handling, or mix one-off task notes into durable defaults.

## Source-priority consistency

Fail if `AGENT_BUILDER_SPEC.md`, `references/source-priority-guide.md`, `memory/source-priorities.md`, and `schemas/source-priority.schema.json` disagree.

## Schema-template alignment

Fail if templates lack required fields or matching schemas are missing.

## Markdown structure

Fail if required files, folders, or headings are missing.

## Business context

Fail if `business-context.md` lacks organisation, working style, role, boundaries, or memory interaction sections.

## Starter prompts

Fail if `BUILDER_IMPORT_PROMPT.md` is missing, too broad, lacks phase instructions, or omits human-review gates.

## Links and references

Fail if required references are missing or markdown links point to missing local files.
