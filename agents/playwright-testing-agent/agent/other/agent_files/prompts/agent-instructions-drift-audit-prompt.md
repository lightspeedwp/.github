# Agent Instructions Drift Audit Prompt

## Purpose

Use this recurring prompt to audit the live instruction system for drift against the current tools, skills, files, and validation workflow.

## Prompt

Audit this agent's instructions for drift so the live behaviour guidance still matches the real current setup, attached capabilities, and file pack.

Primary goal:

- identify stale or conflicting instruction wording
- verify that required routes, tools, and files are still described accurately
- leave no blocking instruction drift that would mislead future maintenance or runs

Scope priorities:

1. system instructions
2. attached tools, skills, and starter prompts they depend on
3. validation-facing docs only where they materially affect instruction truthfulness

Validation expectation:

- Run the documented validation entry point when instruction-linked docs or file-quality assets change.
