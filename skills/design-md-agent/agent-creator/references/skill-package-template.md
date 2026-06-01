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
