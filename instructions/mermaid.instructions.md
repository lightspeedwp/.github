---
file_type: "instructions"
title: "Mermaid Diagram Instructions"
description: "How to design, create, style, and validate Mermaid diagrams for documentation and architecture visualization"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["mermaid", "diagrams", "documentation", "a11y", "visuals", "architecture"]
applyTo: ["**/*.md"]
status: "active"
---

# Mermaid Diagram Instructions

Use Mermaid diagrams to visualize processes, architectures, and workflows. Create clear, accessible diagrams that enhance documentation.

## Diagram Types

### Flowchart

- Show decision trees and process flows
- Use for workflows and conditionals
- Example: Issue triage process, PR workflow

### Sequence Diagram

- Show interactions between systems
- Use for API calls, message flows
- Example: Authentication flow, deployment sequence

### State Diagram

- Show state transitions
- Use for status workflows, lifecycle
- Example: Issue status flow, deployment states

### Gantt Chart

- Show timelines and dependencies
- Use for release schedules, project planning
- Example: Sprint timeline, milestone calendar

### Entity Relationship Diagram

- Show data relationships
- Use for schema documentation
- Example: Database schema, data structures

## Design Guidelines

### Simplicity

- One concept per diagram
- Limit to 5-7 nodes/boxes when possible
- Avoid unnecessary complexity
- Group related elements

### Clarity

- Use descriptive labels
- Avoid abbreviations unless standard
- Consistent node naming
- Clear arrow direction

### Accessibility

- Text-based, not image-only
- Descriptive alt text below diagram
- High contrast between elements
- Avoid color-only information

## Styling

Use Mermaid theme variables for consistency:

```
%%{init: {'theme': 'default'}}%%
```

Standard colors:

- Primary actions: Blue
- Warnings: Orange
- Errors: Red
- Success: Green

## Testing and Validation

- Test in GitHub markdown preview
- Verify on GitHub Pages (if deployed)
- Check mobile rendering
- Provide text alternative for complex diagrams

## Best Practices

- Place caption below diagram with description
- Link to detailed documentation from diagram
- Update diagrams when processes change
- Use consistent naming across diagrams

---

## Related Files

- [documentation-formats.instructions.md](./documentation-formats.instructions.md) — Markdown and diagram standards
- [readme.instructions.md](./readme.instructions.md) — README structure and diagram placement

---
