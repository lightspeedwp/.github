# Acceptance Criteria Rules

## Checklist format

Use for implementation tasks:

```markdown
- [ ] Requirement is implemented.
- [ ] Editor behaviour has been tested.
- [ ] Frontend behaviour matches expected output.
- [ ] Responsive behaviour has been checked.
- [ ] Accessibility checks pass.
```

## Given / When / Then

Use for user flows or behaviour:

```markdown
Given a visitor is on the service page
When they select the consultation CTA
Then they are taken to the correct consultation flow
```

## QA test steps

Use for bugs and launch findings:

```markdown
1. Visit [URL].
2. Reproduce the issue.
3. Apply fix.
4. Retest desktop, tablet and mobile.
5. Confirm no regression.
```

## Technical checks

Use for dev tasks:

- PHPCS passes where applicable.
- ESLint/build passes where applicable.
- Block assets are enqueued only when needed.
- theme.json tokens are used instead of hard-coded values where possible.
