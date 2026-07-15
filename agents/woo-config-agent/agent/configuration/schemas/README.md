# Schemas

## Purpose

Use this folder for structured validation contracts, output schemas, and reusable file-structure schemas that support WooCommerce-first delivery work and maintenance of this agent's attached assets.

For this agent, schemas define or validate expected structure for site-discovery outputs, Gravity Forms planning outputs, Yoast audit outputs, and the reusable file families maintained across `schemas/`, `tests/`, and related validation workflows.

## Current folder position in the agent structure

Treat the current attached maintenance structure as:

- `references/` — durable standards, conventions, and maintenance workflows
- `schemas/` — structured validation and output contracts
- `scripts/` — runnable validators, validation runners, and helper scripts
- `tests/` — QA sources, scenario coverage, regression checklists, and validator support material

Do not infer unattached folders or missing assets from this README. If local memory guidance is attached elsewhere, that guidance owns memory structure; this folder only documents the grounded `schemas/` contents.

## Naming conventions

Use explicit schema names:

- `<workflow>-schema.json` for workflow outputs
- `<folder>-file-validation-schema.json` for file-family validation
- `<deliverable>-output-schema.json` for output contracts
- `<subject>-schema.json` for structured data definitions

## File inventory

This inventory covers the currently grounded schema files attached to the agent.

### Workflow and output schemas
- `site-discovery-schema.json` — site-discovery output structure
- `enquiry-form-schema.json` — enquiry-form structure
- `gravity-forms-plan-schema.json` — Gravity Forms planning output structure
- `yoast-audit-output-schema.json` — Yoast audit output structure

### File-structure validation schemas
- `template-file-validation-schema.json` — validation schema for reusable structural patterns
- `example-file-validation-schema.json` — validation schema used by the current validator pack for example-pattern checks when those assets are in validation scope
- `schema-file-validation-schema.json` — validation schema for schema files
- `memory-file-validation-schema.json` — validation schema for memory files when memory files are attached

## Route-to-schema coverage notes

Current dedicated route-to-schema coverage is:

- `woocommerce-site-discovery` → `site-discovery-schema.json`
- `gravity-forms-configuration` → `gravity-forms-plan-schema.json`
- `yoast-auditor` → `yoast-audit-output-schema.json`

Other routed local skills may still be validated through instructions, prompts, tests, references, and scenario coverage even when they do not currently have a dedicated attached schema file.

Do not treat the absence of a dedicated schema for a routed local skill as drift unless attached documentation wrongly claims that schema already exists or a new schema file is explicitly added later.

## Canonical role rules

- Treat `*.json` files here as structured validation or output assets, not memory starter files.
- Keep schema expectations aligned with the attached tests, validators, and any current validation targets that depend on them.
- When validation scripts or maintained output structures change, review whether the paired schemas need updating too.
- Do not assume an `examples/` or `memory/` folder is attached just because some schemas can validate those file families when present.
