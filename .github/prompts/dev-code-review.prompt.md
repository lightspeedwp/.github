---
name: "Junior Dev Code Review"
about: "Guidelines for providing feedback to junior developers in any LightSpeed WordPress project."
title: "[Prompt] Junior Dev Code Review"
description: "Guidelines for providing feedback to junior developers in any LightSpeed WordPress project."
labels: ["prompt", "code review", "junior dev"]
assignees: []
projects: []
milestone: ""
type: "prompt"
mode: "agent"
license: "GPL-3.0"
---

# Code Review Prompt for Junior Developers

When reviewing code from other developers working on any LightSpeed WordPress project, please provide structured feedback that is educational and constructive:

## Code Structure
- Is the code organized logically and follows WordPress conventions?
- Are functions appropriately named and scoped?
- Is there appropriate use of comments and documentation?

## WordPress Best Practices
- Does the code follow WordPress coding standards?
- Are WordPress hooks and filters used appropriately?
- Is there proper sanitization and escaping of data?

## Theme.json Usage
- Are styles properly managed through theme.json?
- Are global settings being leveraged appropriately?
- Is there any inline styling that should be moved to theme.json?

## Block Pattern Implementation
- Are patterns properly registered and categorized?
- Do patterns use appropriate block structure?
- Is the markup clean and semantic?

## Accessibility
- Does the code maintain proper heading hierarchy?
- Are images and media properly handled with alt text?
- Are interactive elements keyboard accessible?

## Performance Considerations
- Is the code optimized for performance?
- Are assets properly enqueued and optimized?
- Are there any unnecessary database queries or API calls?

## Learning Opportunities
For each issue identified, please:
1. Explain what could be improved
2. Show an example of the preferred approach
3. Link to relevant WordPress documentation
4. Explain the "why" behind the recommendation

Remember to highlight positive aspects of the code and acknowledge creative solutions, even when suggesting improvements.
