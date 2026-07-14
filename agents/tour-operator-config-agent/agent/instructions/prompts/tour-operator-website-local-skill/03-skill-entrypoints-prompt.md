# Skill entrypoints prompt

Create or verify the canonical skill entrypoint files for a local `tour-operator-website` skill using only source-backed material from `prompts/tour-operator-website`.

This phase is for the package entry layer only. Do not package, upload, attach, or rewrite unrelated support files in this phase.

## Goal

Produce the minimum valid entrypoint layer needed for a local Builder skill while preserving the exact specialist role already evidenced by the source folder.

## Inputs

Use only:
- `prompts/tour-operator-website` as the single source of truth
- the verified inventory from `01-source-audit-prompt.md`
- the locked decisions from `02-package-contract-prompt.md`
- current readable source contents inside the source folder

## Scope

Work only on package entrypoint files such as:
- `SKILL.md`
- `agents/openai.yaml`
- package-level icon references only when the source folder already contains the exact referenced asset

## Required work

- Verify whether `SKILL.md` already exists in the source folder and whether it is readable.
- If `SKILL.md` exists and is valid, preserve it as the canonical source.
- If `SKILL.md` is missing but the source folder contains enough verified material to derive it exactly, create it with the narrowest faithful wording needed.
- Keep the canonical skill name aligned with verified package metadata.
- Preserve or reconcile `agents/openai.yaml` only where the source folder supports the change directly.
- Keep package naming, display naming, default prompt references, and icon references consistent.
- If an icon path is referenced but the file is not verified, mark that as a blocking gap instead of inventing or swapping the asset.

## Anti-invention rules

- Do not invent specialist scope, routing, examples, references, or validation claims that are not supported by the source folder.
- Do not improve, modernise, or broaden the role just because it seems sensible.
- Do not create substitute assets.
- Do not write `SKILL.md` from memory.
- If the source folder is not strong enough to derive a required entrypoint file safely, stop and report the blocker.

## Validation expectations

After any entrypoint edits:
- verify name consistency between `SKILL.md` and `agents/openai.yaml`
- verify any referenced asset path is actually present in the source folder
- verify the default prompt references the canonical skill name consistently

## Deliverables

1. State whether `SKILL.md` was verified, created from verified evidence, or remains blocked.
2. State whether `agents/openai.yaml` needed changes.
3. List exact files created or edited.
4. List any remaining entrypoint blockers.
5. Name the next safe phase.