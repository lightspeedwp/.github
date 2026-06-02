# Output Templates

Use these templates when creating Figma and WordPress skills.

## Skill Summary Template

```markdown
## Skill summary
- Purpose:
- Main triggers:
- Inputs:
- Outputs:
- Sources/tools:
- Domain boundaries:
- Risks:
- Safe defaults:
```

## File Tree Template

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── workflow.md
│   └── output-templates.md
└── scripts/
    └── optional-helper.sh
```

## Skill Frontmatter Template

```markdown
---
name: skill-name
description: create [specific outputs] for [specific domain]. use when the user asks for [trigger examples], [file/task examples], or [workflow examples].
---
