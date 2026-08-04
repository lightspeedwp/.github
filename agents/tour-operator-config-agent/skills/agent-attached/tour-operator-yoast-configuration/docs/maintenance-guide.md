# Maintenance Guide

Use this guide when updating the skill package.

## Before packaging

1. Keep `SKILL.md` compact.
2. Move detailed rules into references.
3. Remove stale examples.
4. Run scripts in `scripts/`.
5. Run a full-text removed-scope check.
6. Package as `skill.zip`.

## Validation commands

```bash
python scripts/validate_skill_structure.py .
python scripts/validate_reference_data.py .
python scripts/generate_qa_checklist.py --profile tour-operator
```

---

*🧭 Your compass through the documentation landscape*
