---
name: "Block Pattern Development"
about: "Guidelines for creating and modifying block patterns in any LightSpeed WordPress project."
title: "[Instructions] Block Pattern Development"
description: "Guidelines for creating and modifying block patterns in any LightSpeed WordPress project."
labels: ["instructions", "pattern", "development"]
assignees: []
projects: []
milestone: ""
type: "instructions"
mode: "agent"
applyTo: "**/patterns/*.php"
---

# Block Pattern Development Instructions

## Pattern Structure

- Use descriptive comments to document each section of the pattern.
- Follow a logical structure with clear parent-child relationships.
- Group related blocks using the Group block where appropriate.
- Use appropriate block variations based on content needs.
- Test pattern across different viewport sizes.

## Registration

- Register patterns using the `register_block_pattern()` function.
- Use consistent naming with the format: `lsx/[category]-[name]`.
- Provide meaningful category and keywords for pattern discovery.
- Set appropriate viewportWidth based on the pattern's design.
- Include a descriptive title and description for the pattern library.

## Content Strategy

- Create patterns with placeholder content that makes sense.
- Use realistic example text rather than lorem ipsum where possible.
- Provide guidance for customization in pattern comments.
- Consider different use cases and content variations.
- Ensure patterns maintain their design integrity when content changes.

## Styling

- Use theme.json variables exclusively for colors, typography, and spacing.
- Avoid inline styles or custom CSS within patterns.
- Apply consistent spacing throughout the pattern.
- Use predefined block styles rather than custom styles when available.
- Test patterns with different color schemes (light/dark).

## Accessibility

- Maintain proper heading hierarchy within patterns.
- Provide alt text placeholders for all images.
- Ensure sufficient color contrast for text elements.
- Make interactive elements keyboard accessible.
- Test patterns with screen readers.

## Performance

- Optimize image usage within patterns.
- Avoid unnecessary nesting of blocks.
- Keep markup clean and minimal.
- Consider the performance impact of complex patterns.
- Test rendering performance on various devices.

## Reusability

- Design patterns to be reusable across different contexts.
- Create variations of patterns for different use cases when appropriate.
- Document pattern dependencies or requirements.
- Consider how patterns will work with different themes.
- Test patterns in various page templates and contexts.
