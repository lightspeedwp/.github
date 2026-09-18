# Quality Gates

Use this reference before packaging an updated skill, agent instruction bundle, or reusable workflow.

## Gate order

1. **Scope gate**: confirm the update is within the approved local package scope.
2. **Structure gate**: check required files, linked references, scripts, and metadata.
3. **Instruction gate**: check trigger clarity, routing boundaries, approval rules, and output contract.
4. **Safety gate**: check tool, connector, memory, publication, and external-action boundaries.
5. **Evaluation gate**: run scenario checks, script smoke tests, and archive validation where relevant.
6. **Packaging gate**: validate and package the complete skill, then inspect the archive for accidental files.

## Pre-package checklist

| Check | Pass condition |
|---|---|
| `SKILL.md` exists | Required entrypoint is present. |
| Frontmatter is minimal | Only `name` and `description`; both are useful for triggering. |
| `SKILL.md` remains compact | Prefer under 500 lines; move detail into references. |
| References are directly linked | Every required reference is reachable from `SKILL.md`. |
| Scripts are documented | Every script has usage guidance and has been smoke-tested. |
| Proposal records are valid | Machine-readable proposals pass `scripts/validate_mutation_proposals.py` when used. |
| No accidental files | No `__pycache__`, `.pyc`, `.DS_Store`, temp files, or raw scratch data inside the package. |
| Approval levels remain clear | Proposal, local package, connected edit, publication, and permission changes are distinct. |
| Changelog is updated | Include value, evaluation, risk, approval level, and rollback. |
| Size is safe | Final ZIP is below 25 MB. |

## Suggested local commands

Run the quality script before the packaging validator:

```bash
python scripts/check_skill_quality.py --skill-dir . --strict
```

Then run the standard skill packager from outside the skill folder:

```bash
python /home/oai/skills/skill-creator/scripts/package_skill.py self-evolving-agent dist
```

## Report format

```markdown
## Quality gate report

- Structure: passed / partial / failed
- Instruction quality: passed / partial / failed
- Safety boundaries: passed / partial / failed
- Script checks: passed / partial / failed
- Packaging: passed / partial / failed

Not tested:
- [item and reason]

Rollback:
- [restore package/version/path]
```
