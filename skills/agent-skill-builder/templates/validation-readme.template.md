# Validation README

Run validators before packaging or handing off this skill.

## Commands

```bash
python scripts/validate-all.py .
python scripts/validate-links.py .
python scripts/validate-markdown-structure.py .
python scripts/validate-memory-hygiene.py .
python scripts/validate-source-priority-consistency.py .
python scripts/validate-template-schema-alignment.py .
```

## Blocking failures

Do not package while any validator returns an `error` status.

## Manual review

Also review trigger description, source priority, examples, and output quality manually.
