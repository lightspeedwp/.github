# Output Template Library

Use these reusable templates when building agent outputs.

## Agent requirements doc

```markdown
# Workspace Agent Requirements Doc: [Agent Name]

## Agent mission
[Mission]

## Scope and boundaries
[Ordered workflow]

**Out of scope**
[Boundaries]

## Inputs and trusted context
[Inputs and trusted sources]

## Tools and permissions
[Permission matrix]

## Output requirements
[Deliverables]

## Quality checklist
[Checklist]

## Human-in-the-loop and escalations
[Escalation rules]
```

## Agent prompt handoff

```markdown
# [Agent Name] Prompt Handoff

## Copy-ready system prompt
[Prompt]

## Required setup
- [Tool/source]
- [Template/file]
- [Permission]

## Test scenarios
1. [Happy path]
2. [Missing context]
3. [Contradictory sources]
4. [Write action requiring approval]

## Review notes
- [Assumption]
- [Risk]
- [Next improvement]
```

## Agent file manifest

```markdown
# File Manifest

| File | Required? | Purpose | Used by |
|---|---:|---|---|
| AGENT_REQUIREMENTS.md | Yes | Agent requirements and scope | Human reviewer |
| AGENT_SYSTEM_PROMPT.md | Yes | Copy-ready prompt | Agent builder |
| TOOL_AND_PERMISSION_MATRIX.md | Yes | Tool access and approval gates | Human reviewer |
| OUTPUT_TEMPLATES.md | Yes | Reusable output structures | Agent |
| QUALITY_CHECKLIST.md | Yes | Acceptance checks | Human reviewer |
| README.md | Yes | Usage and iteration guide | Team |
```
