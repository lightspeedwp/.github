# Starter Prompts Alignment Prompt

## Purpose

Use this recurring prompt to audit and tighten the agent's starter prompts so they match the current instructions, tools, skills, and supported workflows.

## Prompt

Audit this agent's starter prompts and refresh any prompt whose wording no longer matches the current instructions, attached tools, attached skills, or review workflow.

Primary goal:

- keep starter prompts accurate, grounded, and aligned to the current supported routes
- remove overpromising wording, stale file references, or outdated tool assumptions
- keep the starter-prompt layer clean and non-blocking

Scope priorities:

1. starter prompts themselves
2. instructions and attached capabilities they depend on
3. validation-facing docs only where they materially affect starter-prompt truthfulness

Validation expectation:

- Re-run validation after starter-prompt changes.
