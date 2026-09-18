# Agent Folder Structure Guide

## Purpose

Keep Agent Builder spec packs consistent and lean.

## Required sections

- Required top-level files.
- Required folders.
- Recommended folders.
- Optional folders.
- Folder mappings.

## Rules

Required: top-level entry files, `references/`, `templates/`, `schemas/`, `memory/`, and `validation/`.

Recommended: `business-context.md`, `examples/`, `fixtures/`, `scripts/`, `tests/`, and `rollout/`.

Optional: `assets/`, only when real reusable assets exist or a README explains why the folder is intentionally unused.

Avoid top-level `docs/`, `profiles/`, and `intake/`. Put documentation in `references/`, operating profiles in `AGENT_REQUIREMENTS.md` or `business-context.md`, and intake material in `AGENT_BUILDER_SPEC.md`, `templates/`, or `examples/`.

## Validator

Checked by `scripts/validate-markdown-structure.py`.
