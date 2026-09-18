# Folder Structure Guide

Use this guide when deciding which folders a generated local skill should include.

## Principle

A skill should be as small as possible while still being reliable. Add folders for reuse, validation, or handoff, not because a master structure exists.

## Required files

| Path | Required | Purpose |
| --- | --- | --- |
| `SKILL.md` | Always | Entrypoint, trigger description, compact workflow |
| `agents/openai.yaml` | Always | Agent UI metadata |

## Recommended folders

| Folder | Include when | Avoid when |
| --- | --- | --- |
| `references/` | Rules, source order, policy, domain context, workflow variants need progressive loading | All guidance fits cleanly in `SKILL.md` |
| `templates/` | Outputs need reusable formats | The skill only gives advice or routing |
| `examples/` | Concrete examples reduce ambiguity or support testing | Examples would be decorative only |
| `schemas/` | Outputs, memory, or templates need machine-readable checks | The task is pure prose and low-risk |
| `scripts/` | Repeatable checks, packaging, conversion, or deterministic processing matter | ChatGPT can safely reason through the task |
| `tests/` | Validators or scenarios need proof | The skill is simple and low-change |
| `memory/` | Durable context improves future runs | The context is temporary, sensitive, or project-specific to one conversation |
| `rollout/` | Shared skills need release checks, changelog, or migration notes | Personal one-off skills |

## Usually omit

- `assets/`: Include only for output assets, not reasoning references.
- `docs/`: Use only for human documentation distinct from agent references.
- top-level `fixtures/`: Prefer `tests/fixtures/`.
- `profiles/`: Include only for named operating modes.
- deep `examples/templates/` or `examples/memory/`: Prefer shallow folders.
- root `business-context.md`: Put business context under `references/`.

## Tier examples

Use these examples as starting points, then remove folders that do not support the workflow.

### Minimal

```text
skill-name/
├── SKILL.md
└── agents/
    └── openai.yaml
```

### Standard

```text
skill-name/
├── SKILL.md
├── agents/openai.yaml
├── references/
├── templates/
└── examples/
```

### Advanced

```text
skill-name/
├── SKILL.md
├── agents/openai.yaml
├── references/
├── templates/
├── examples/
├── memory/
├── schemas/
├── scripts/
├── tests/
└── rollout/
```

## Decision checklist

- Does this folder reduce repeated work?
- Does it reduce drift or QA risk?
- Will another agent know when to load it?
- Can it be validated?
- Is it likely to stay useful after the current conversation?
