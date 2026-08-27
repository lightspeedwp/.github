# Acceptance Criteria Patterns

## Checklist format

Use for implementation tasks.

```markdown
- [ ] The block is registered and appears in the editor.
- [ ] The frontend output matches the approved pattern.
- [ ] The block supports responsive behaviour at agreed breakpoints.
- [ ] The feature passes keyboard and focus-state checks.
```

## Given / When / Then

Use for user-facing behaviour.

```markdown
Given I am editing a page in WordPress
When I insert the CTA pattern
Then the content, spacing and responsive behaviour match the approved design system.
```

## Technical checks

Use for developer tasks.

```markdown
- [ ] Code follows WordPress Coding Standards.
- [ ] Inputs are sanitised and outputs are escaped.
- [ ] Build assets are generated and committed only where the project convention requires it.
- [ ] No unnecessary plugin dependencies are introduced.
```

## QA test steps

Use for launch or validation tasks.

```markdown
1. Open the page on desktop, tablet and mobile.
2. Compare against the Figma reference.
3. Test keyboard navigation.
4. Confirm no console errors.
5. Record pass/fail and screenshots where needed.
```
