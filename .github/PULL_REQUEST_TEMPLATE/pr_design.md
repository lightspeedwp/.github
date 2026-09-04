---
file_type: pr-template
name: "Design"
about: "Design system updates, component improvements, or visual changes"
title: "design: {scope}"
labels: ["type:design", "status:needs-review"]
---

# Design Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the design issue(s) it addresses:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger design initiative

Closes #

## Design Overview

What design changes are included? Provide context on:

- Component(s) affected
- Visual or interaction changes
- Design rationale

## Design Files / References

Link to design specs, Figma files, design tokens, or other design documentation:

## Changes

Describe the implementation of the design:

- CSS/style changes
- Component modifications
- New components added
- Backwards compatibility considerations

## Accessibility

How do the design changes maintain or improve accessibility?

- [ ] WCAG 2.2 AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Colour contrast sufficient (4.5:1 minimum)
- [ ] Semantic HTML used appropriately
- [ ] Screen reader tested (if applicable)

## Testing

How was this design verified?

- [ ] Visual testing completed (desktop/tablet/mobile)
- [ ] Component variations tested
- [ ] Browser compatibility verified
- [ ] No regressions in existing design

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Changed

- Design: {description}

## Checklist

- [ ] Design files linked and up-to-date
- [ ] Changes match approved design specs
- [ ] Visual testing completed across all browsers
- [ ] Accessibility standards met
- [ ] No breaking changes to existing components
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
