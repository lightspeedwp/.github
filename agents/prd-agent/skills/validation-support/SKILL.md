---
name: validation-support
description: Use when planning files, templates, validation packs, or workflow coverage need a structured validation pass for completeness, consistency, naming, and readiness.
---

# Validation Support

## Overview

Use this skill to validate planning-related files and quality scaffolding.

## Request Shapes

- Use `$validation-support` when the user asks whether a planning pack or file set is complete.
- Use `$validation-support` when validation scaffolding, template consistency, or workflow coverage needs to be checked.
- Use `$validation-support` when the agent should verify readiness of files, naming, or coverage before relying on them.

## Workflow

1. Check the relevant files, templates, or validation materials.
2. Validate presence, consistency, naming, structure, and coverage.
3. Identify missing files, weak alignment, or untested workflow areas.
4. Report what passes, what fails, and what still needs implementation.
5. Recommend the next validation or scaffolding step.

## Output Contract

Default sections:

- Validation scope
- Passed checks
- Missing or failing areas
- Coverage gaps
- Recommended next fixes

## Quality Bar

- Be explicit about what was actually validated.
- Do not claim automated coverage that does not exist.
- Separate placeholders from implemented checks.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
