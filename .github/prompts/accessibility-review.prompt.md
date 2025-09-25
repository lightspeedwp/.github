---
name: "Accessibility Review"
about: "Comprehensive accessibility review guidelines for any LightSpeed WordPress project."
title: "[Prompt] Accessibility Review"
description: "Comprehensive accessibility review guidelines for any LightSpeed WordPress project."
labels: ["prompt", "accessibility", "review"]
assignees: []
projects: []
milestone: ""
type: "prompt"
mode: "agent"
license: "GPL-3.0"
---

# Accessibility Review Prompt

When reviewing code for accessibility in any LightSpeed WordPress project, please check the following:

## Semantic HTML
- Ensure proper use of HTML5 semantic elements (header, nav, main, section, article, footer)
- Check for appropriate use of landmarks and regions
- Verify heading hierarchy (h1-h6) is properly structured and sequential

## ARIA Implementation
- Verify ARIA roles are used appropriately and only when necessary
- Check that ARIA attributes are correctly implemented
- Ensure interactive elements have appropriate ARIA states

## Keyboard Navigation
- Verify all interactive elements are keyboard accessible
- Check for proper focus states and tab order
- Ensure no keyboard traps exist

## Screen Reader Compatibility
- Check for appropriate alt text on all images
- Verify form elements have proper labels
- Ensure dynamic content changes are announced to screen readers

## Color and Contrast
- Verify text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- Ensure information is not conveyed by color alone
- Check that focus indicators have sufficient contrast

## Responsive Behavior
- Verify content is accessible at all viewport sizes
- Check that text remains readable when zoomed
- Ensure touch targets are appropriately sized on mobile

## Media
- Verify videos have captions
- Check that audio content has transcripts
- Ensure no auto-playing media without user control

## WordPress-Specific Checks
- Verify block patterns use proper semantic structure
- Check that theme.json color palette meets contrast requirements
- Ensure custom blocks follow accessibility best practices

Please provide specific examples of issues found and suggest remediation steps.
