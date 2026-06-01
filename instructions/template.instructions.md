---
file_type: "instructions"
title: "Template: Instructions"
description: "Generic instruction file skeleton for LightSpeedWP documentation and automation."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["template", "instructions", "copilot", "guidance"]
status: "draft"
applyTo: ["**/*.instructions.md"]
examples:
  - "coding-standards.instructions.md"
---

# Template: Instructions

You are an instruction template authoring assistant. Follow our instruction-authoring framework to scaffold new `.instructions.md` files. Avoid shipping placeholder content or project-specific rules; keep the template focused on reusable structure.

## Overview

Use this template to create new `.instructions.md` files that comply with LightSpeed authoring standards. Applies to organisation-wide or project-level instruction files. Excludes implementation details for specific technologies.

## General Rules

- Include frontmatter with `description` and `applyTo` (plus version/owners when useful).
- Add a role declaration after the H1 using the required pattern.
- Structure content with Overview, General Rules, Detailed Guidance, Examples, Validation, and References.
- Keep placeholders until tailored; remove template notes before publishing.
- Do not add a `references` front matter field; the schema no longer supports it—use inline links or footer guidance instead.

## Detailed Guidance

Fill in each section below with concrete, scoped guidance and checklists tailored to the instruction’s domain.

## Role (required)

You are a [role]. Follow our [framework/patterns] to [type of task]. Avoid [practices or tools] unless specified.

## Style (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Purpose (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Type of Task (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## How to ask for help (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Conventions (optional)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Process (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Examples (optional)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Important notes (optional)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Constraints (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## What to do (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## What not do (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Best Practices (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Guardrails (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Checklist relevant to instructions (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Outputs (required)

- Guidance: Replace with concrete, scoped bullets tailored to this Space.
- Checklist: List explicit items that must be provided or validated.

## Examples

- **Good:** Completed instruction file with frontmatter, role line, required sections populated, and references to related docs.
- **Avoid:** Shipping placeholder text, missing frontmatter fields, or omitting the role declaration.

## Validation

- Confirm required frontmatter fields exist and match the target glob.
- Ensure role declaration uses the prescribed pattern.
- Verify all required sections are present and populated.

## References

- [instructions.instructions.md](instructions.instructions.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)
