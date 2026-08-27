# QA Coverage Rules

Every P0/P1 requirement should have at least one QA check.

## Acceptance criteria formats

Use the format that best fits the task:

- checklist criteria for implementation tasks
- Given/When/Then for behavioural flows
- QA test steps for page, form and launch checks
- technical checks for WordPress code, blocks, theme.json and templates

## QA checks by type

| Requirement type | QA expectation |
|---|---|
| Figma parity | visual comparison, token mapping, responsive states |
| Block theme | frontend and editor checks |
| Block plugin | editor controls, frontend output, render behaviour |
| Accessibility | keyboard, focus, contrast, semantic structure |
| Performance | Lighthouse/PageSpeed or defined budget |
| Forms | submission, validation, routing, spam, thank-you |
| Analytics | event fires with correct parameters |
| Redirects | old URL returns correct 301 and new URL works |
| Schema | structured data validates and content is visible |
