# Skill Package Template

## Purpose

Clarify when Agent Creator is creating a skill-adjacent package versus an installable ChatGPT skill.

## Required sections

- `SKILL.md` plan.
- Agent metadata notes.
- References.
- Templates.
- Optional scripts.
- Packaging notes.
- Validation notes.

## Rule

If the user expects an installable ChatGPT skill, route to `skill-creator` unless a narrower LightSpeed skill creator applies. If the user wants a workflow wrapper or skill-adjacent agent pack, Agent Creator may continue.

## Validator

Checked by `scripts/validate-links-and-references.py`.
