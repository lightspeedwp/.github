# Helper Scripts

Run scripts from the pack root, for example:

```bash
python scripts/validate-all.py .
```

## Validator specification

| Script | Purpose | Files checked | Inputs | Outputs | Failure conditions | Required? | Example command | Test coverage |
|---|---|---|---|---|---|---|---|---|
| `validate-memory-hygiene.py` | Catch bad memory, sensitive storage, one-off notes, stale decision gaps | `memory/`, `memory/schemas/` | Pack root | PASS/FAIL list | Missing memory files, missing do-not-store rules, invalid memory schemas | Yes | `python scripts/validate-memory-hygiene.py .` | `tests/test-memory-updates.md`, `tests/test-decision-tracing.md` |
| `validate-source-priority-consistency.py` | Keep source precedence consistent | `AGENT_BUILDER_SPEC.md`, `references/source-priority-guide.md`, `memory/source-priorities.md`, `schemas/source-priority.schema.json` | Pack root | PASS/FAIL list | Missing or mismatched source priority order | Yes | `python scripts/validate-source-priority-consistency.py .` | `tests/test-file-first-research.md` |
| `validate-template-schema-alignment.py` | Ensure outputs can satisfy templates and schemas | `OUTPUT_TEMPLATES.md`, `templates/`, `schemas/` | Pack root | PASS/FAIL list | Invalid JSON schemas or missing template sections | Yes | `python scripts/validate-template-schema-alignment.py .` | `tests/test-digest-generation.md`, `tests/test-validation-drift.md` |
| `validate-markdown-structure.py` | Check required files, folders, and headings | Top-level markdown and required folders | Pack root | PASS/FAIL list | Missing required file, folder, or heading | Yes | `python scripts/validate-markdown-structure.py .` | `tests/test-agent-pack-from-rough-notes.md` |
| `validate-business-context.py` | Ensure stable LightSpeed context exists | `business-context.md` | Pack root | PASS/FAIL list | Missing organisation, style, role, boundaries, or memory interaction | Yes | `python scripts/validate-business-context.py .` | `tests/test-agent-pack-review-from-existing-draft.md` |
| `validate-starter-prompts.py` | Ensure Builder prompt is short, phased, and safe | `BUILDER_IMPORT_PROMPT.md`, `references/starter-prompt-guide.md` | Pack root | PASS/FAIL list | Missing zip reference, phase instruction, or human-review gate | Yes | `python scripts/validate-starter-prompts.py .` | `tests/test-agent-pack-from-rough-notes.md` |
| `validate-links-and-references.py` | Catch missing references and broken local links | `references/`, all markdown links | Pack root | PASS/FAIL list | Missing required references or broken local markdown links | Yes | `python scripts/validate-links-and-references.py .` | `tests/test-specialist-routing.md`, `tests/test-validation-drift.md` |
| `validate-all.py` | Run all validators in priority order | All validator targets | Pack root | Aggregated PASS/FAIL | Any validator fails | Yes | `python scripts/validate-all.py .` | All tests |

## Priority

Run memory hygiene, source-priority consistency, and template-schema alignment first. They reduce the highest-risk drift: bad memory, inconsistent source precedence, and outputs that cannot satisfy their schema.
