# Dependency Rules

## Dependency types

- Design dependency
- Content dependency
- Technical dependency
- Data/schema dependency
- QA dependency
- Legal/privacy dependency
- Launch dependency

## How to record dependencies

Use:

```markdown
## Dependencies / blockers

- Depends on: [issue/title/source]
- Blocked by: [missing source, design approval, content approval, repo inspection]
- Blocks: [downstream task]
```

## Common dependencies

- theme.json tokens before component implementation
- content approval before template population
- Figma component approval before pattern build
- privacy/cookie policy before tracking/chatbot launch
- redirect map before launch
- schema plan before structured data QA
