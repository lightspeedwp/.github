---
file_type: pr-template
name: "Accessibility"
about: "Implement accessibility improvements or fix accessibility issues (WCAG compliance)"
title: "a11y: {scope}"
labels: ["type:a11y", "status:needs-review", "priority:high"]
---

# Accessibility Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the accessibility issue(s) it addresses:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger accessibility initiative

Closes #

## Accessibility Issues Addressed

What WCAG violations or accessibility problems are being fixed?

- **Issue Type:** (Semantic HTML / Keyboard Navigation / Colour Contrast / Screen Reader / Focus Management / etc.)
- **WCAG Level:** (A / AA / AAA)
- **Components affected:**

## Testing

How was accessibility verified?

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible

### Screen Reader Testing

- [ ] Content is announced correctly
- [ ] Form labels associated properly
- [ ] Skip links work
- [ ] Tested with: (NVDA / JAWS / VoiceOver / etc.)

### Colour & Contrast

- [ ] Colour contrast: 4.5:1 (normal text) / 3:1 (large text)
- [ ] Colour is not the only means of conveying information
- [ ] Tested with: (WebAIM / Color Contrast Analyzer / etc.)

### Semantic HTML

- [ ] Proper heading hierarchy (h1, h2, h3, etc.)
- [ ] Buttons and links correctly marked up
- [ ] Lists properly structured
- [ ] ARIA roles and attributes used correctly

## Browser & AT Testing

- [ ] Chrome + NVDA
- [ ] Firefox + NVDA
- [ ] Safari + VoiceOver (macOS)
- [ ] Edge + Narrator

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Fixed

- Accessibility: {description}

## Checklist

- [ ] WCAG 2.2 AA standards met
- [ ] Accessibility testing completed
- [ ] No new accessibility regressions introduced
- [ ] Documentation updated (if needed)
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
