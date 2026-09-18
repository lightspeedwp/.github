# Validation Pack

## Purpose

Give Agent Builder and human reviewers a repeatable way to catch drift before adoption.

## Required validator order

1. `scripts/validate-memory-hygiene.py`
2. `scripts/validate-source-priority-consistency.py`
3. `scripts/validate-template-schema-alignment.py`
4. Other validators.

The first three validators come first because they reduce the highest-risk drift: bad memory, inconsistent source precedence, and outputs that cannot satisfy their schema.

## Run all checks

```bash
python scripts/validate-all.py .
```
