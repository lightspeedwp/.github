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
```

## Workflow Section Template

```markdown
## Workflow

1. Inspect inputs and source material.
2. Identify the task type.
3. Choose the correct output format.
4. Apply domain rules.
5. Produce the deliverable.
6. Validate against the checklist.
7. State assumptions, risks and next steps.
```

## GitHub Issue Draft Template

```markdown
# [Issue title]

## Context
[Why this is needed]

## Scope
- [Included work]
- [Excluded work]

## Implementation notes
- [File, hook, block, theme.json or pattern notes]

## Acceptance criteria
- [ ] [Concrete pass/fail criterion]
- [ ] [Concrete pass/fail criterion]

## QA notes
- [Testing steps]
```

## QA Matrix Template

```markdown
| Area | Check | Expected result | Status | Notes |
|---|---|---|---|---|
| Design parity |  |  |  |  |
| Mobile |  |  |  |  |
| Accessibility |  |  |  |  |
| Editor UX |  |  |  |  |
| Performance |  |  |  |  |
```

## Test Prompt Template

```markdown
### Test prompt: [name]

Prompt:
> [Realistic user prompt]

Expected behaviour:
- [What the skill should do]
- [What it should avoid]

Pass criteria:
- [ ] [Criterion]
- [ ] [Criterion]
```
