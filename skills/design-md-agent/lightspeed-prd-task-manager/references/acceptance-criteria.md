# Acceptance Criteria Styles

Use a mix depending on task type.

## Checklist

Best for build tasks.

- [ ] Feature is implemented.
- [ ] Editor and frontend behaviour match.
- [ ] Responsive states are tested.
- [ ] Accessibility checks pass.

## Given / When / Then

Best for behaviour.

```text
Given [context]
When [action]
Then [expected outcome]
```

## QA test steps

Best for verification.

1. Open page/template.
2. Perform action.
3. Confirm expected result.
4. Test mobile and keyboard behaviour.

## Developer checks

Best for technical tasks.

- WPCS passes.
- ESLint passes where relevant.
- Build output is generated.
- No unnecessary dependencies are added.
- Code is escaped, sanitised and permission-checked where needed.
