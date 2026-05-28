---
mode: "agent"
description: "Create GitHub Issues from implementation plan phases using feature_request.yml or chore_request.yml templates."
tools:
  [
    "search/codebase",
    "search",
    "github",
    "issue_write",
    "search_issues",
  ]
---

# Create GitHub Issue from Implementation Plan

Create GitHub Issues for the implementation plan at `${file}`.

## Process

1. Analyse plan file to identify phases
2. Check existing issues using `search_issues`
3. Create or update one issue per phase using `issue_write`
4. Use `feature_request.yml` or `chore_request.yml` templates (fallback to default)

## Requirements

- One issue per implementation phase
- Clear, structured titles and descriptions
- Include only changes required by the plan
- Verify against existing issues before creation

## Issue Content

- Title: Phase name from implementation plan
- Description: Phase details, requirements, and context
- Labels: Appropriate for issue type (feature/chore)
