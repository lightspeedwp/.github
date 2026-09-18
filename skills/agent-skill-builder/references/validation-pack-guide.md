# Validation Pack Guide

Use this guide when a generated skill needs deterministic quality checks.

## When validation is worth it

Add validators when a skill is shared, connector-aware, business-critical, template-heavy, memory-enabled, or likely to change often.

Avoid validators for small personal skills where manual review is cheaper than maintaining scripts.

## Severity levels

| Severity | Meaning | Packaging impact |
| --- | --- | --- |
| error | Blocking defect | Do not package or hand off |
| warning | Risk or drift concern | Review before release |
| info | Useful note | No blocker |

## Recommended validators

1. Link/reference validator.
2. Markdown structure validator.
3. Example/template alignment validator.
4. Memory hygiene validator.
5. Source-priority consistency validator.
6. Schema-to-template coverage validator.
7. Business context completeness validator.
8. Starter-prompt quality validator.

## Standard report shape

```json
{
  "validator": "validate-links",
  "status": "pass",
  "errors": [],
  "warnings": [],
  "info": [],
  "checked_files": [],
  "skipped_files": [],
  "summary": "no broken links found"
}
```

## Run order

1. `scripts/validate-memory-hygiene.py`
2. `scripts/validate-source-priority-consistency.py`
3. `scripts/validate-template-schema-alignment.py`
4. `scripts/validate-links.py`
5. `scripts/validate-markdown-structure.py`
6. `scripts/validate-business-context.py`
7. `scripts/validate-starter-prompts.py`
8. `scripts/validate-all.py`

## Manual review remains required

Validators catch structural drift. They do not prove the skill is useful, safe, or commercially sound. Always review trigger description, workflow clarity, source priority, and output quality manually.
