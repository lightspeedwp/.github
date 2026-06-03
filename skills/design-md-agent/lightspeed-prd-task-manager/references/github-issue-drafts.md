# GitHub Issue Draft Format

Generate Markdown issue drafts for manual review before creating issues.

## Issue template

```markdown
# [Issue title]

## Summary

## Context

## Scope

## Out of scope

## Implementation notes

## Acceptance criteria

- [ ]

## QA notes

## Dependencies

## Suggested labels

## Suggested milestone

## Internal LightSpeed notes
```

## Label suggestions

- type:feature
- type:bug
- type:test
- type:content
- type:design-system
- type:block-theme
- type:block-plugin
- area:theme-json
- area:patterns
- area:accessibility
- area:performance
- priority:high
- priority:medium
- priority:low

Branch mapping note: QA and test branches both map to type:test in .github/labeler.yml via head-branch ["^test/.*", "^qa/.*"].
