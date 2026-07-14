# Retest Rules

Every actionable finding needs retest steps.

## Baseline retest checklist

- Re-test the original reproduction steps.
- Confirm the affected URL, template, pattern, block, form or flow.
- Test desktop, tablet and mobile where relevant.
- Test keyboard navigation and focus states where relevant.
- Test light and dark mode where relevant.
- Test editor and frontend where relevant.
- Re-run accessibility checks where relevant.
- Re-run Lighthouse/PageSpeed where relevant.
- Re-test GA4/GTM debug mode where relevant.
- Re-test redirects, schema or metadata validators where relevant.
- Capture updated screenshots or evidence after the fix.
- Update severity and launch status after retest.

## Retest outcomes

Use these outcomes:

| Outcome | Meaning |
|---|---|
| Pass | Fix is confirmed and no regression is visible. |
| Partial Pass | Main issue improved, but follow-up remains. |
| Fail | Original issue still reproduces. |
| Blocked | Retest cannot be completed due to missing access, environment or dependency. |
| Not Retested | Retest is still pending. |

## Regression notes

When a fix touches shared patterns, templates, theme.json, custom blocks or global scripts, include a regression note for related pages or components.
