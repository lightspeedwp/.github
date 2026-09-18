# Starter Prompt Quality Guide

Use this guide when creating starter prompts for a generated skill.

## Strong starter prompts

A strong prompt:

- Names a concrete task.
- Implies the correct skill trigger.
- Provides enough context for a first useful response.
- Does not require unavailable tools.
- Covers a distinct workflow.

## Weak starter prompts

A weak prompt is vague, duplicated, too broad, or disconnected from the skill description.

## Examples

Good:

```text
Create a standard local skill for turning launch QA notes into GitHub issue drafts.
```

Bad:

```text
Help me with stuff.
```

## Checklist

- Does each prompt map to one core workflow?
- Are duplicate intents removed?
- Are connector assumptions explicit?
- Does the prompt match the frontmatter description?
- Are minimal, standard, and advanced use cases represented where relevant?
