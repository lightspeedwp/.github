# Agent Creator SKILL.md Update Notes

## Purpose

Provide review-ready changes to apply to the live `agent-creator` skill entrypoint.

## Required sections

- Deliverable classification update.
- Agent Builder trigger conditions.
- Prompt-size rule.
- Required pack structure.
- Phased build plan.
- Memory pack expectations.
- Validation pack expectations.
- Updated full-agent-pack artefact list.
- Routing boundaries.
- Safety rules.

## Suggested changes

1. Add `Agent Builder spec pack` to the deliverable classifier.
2. Trigger it when users mention Agent Builder, Builder import, Builder-ready agents, prompt-size limits, zip handoffs, or splitting large prompts into phases.
3. Add a rule: large Builder prompts must become a zip pack plus short import prompt.
4. Add `AGENT_BUILDER_SPEC.md`, `PHASED_BUILD_PLAN.md`, `BUILDER_IMPORT_PROMPT.md`, `memory/`, `schemas/`, `validation/`, `scripts/`, `tests/`, and `rollout/` to Builder-ready pack artefacts.
5. Keep existing full agent pack artefacts intact.
6. Add explicit safety gates for writes, external messaging, publishing, deletion, pricing, legal, security, and customer-sensitive claims.

## Validator

Checked by `scripts/validate-links-and-references.py`.
