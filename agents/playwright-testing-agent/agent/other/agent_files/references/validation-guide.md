# Validation Guide

## Purpose
Explain when the agent pack validators should be run and what they are expected to protect.

## When To Use
Use this reference after editing templates, examples, schemas, memory, references, business context, or starter prompts.

## Rules
Run validators:
- After creating or editing templates
- After creating or editing examples
- After creating or editing schemas
- After changing memory files
- Before packaging or handing off the agent
- Before committing agent changes to GitHub

## Output Expectations
Outputs should name the relevant validation commands, report failures clearly, and recommend fixes before the agent pack is treated as ready.

## Related Files
- tests/schema-validation-tests.md
- scripts/validate-folder-schemas.sh
- scripts/validate-agent-pack.py
- scripts/validate-markdown-structure.py
