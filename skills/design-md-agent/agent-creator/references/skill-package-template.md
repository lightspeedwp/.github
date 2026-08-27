# ChatGPT Skill Package Template

Use this when the requested output is a reusable ChatGPT skill rather than a prompt only.

## Recommended file structure

```text
agent-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── agent-requirements-template.md
│   ├── agent-system-prompt-template.md
│   ├── output-template-library.md
│   └── quality-checklist.md
├── scripts/
│   └── optional-repeatable-script.py
└── assets/
    └── optional-output-template-files
```

## SKILL.md frontmatter

```markdown
---
name: agent-name
description: create [specific output] from [specific input]. use when the user asks to [trigger scenarios].
---
```

## SKILL.md body structure

```markdown
# [Skill Display Name]

## Purpose
[What this skill enables]

## Workflow
1. [Step]
2. [Step]
3. [Step]

## Output rules
[Formatting and quality rules]

## References
- `references/file.md` - when to load it.

## Escalation rules
[When to ask for human review]
```

## Packaging checks

- The skill folder includes `SKILL.md`.
- The frontmatter has only `name` and `description`.
- The name is lowercase and hyphenated.
- The description clearly says when to use the skill.
- Unused example files are removed.
- Scripts are tested if included.
- The package is below the upload size limit.
