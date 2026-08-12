# Example: Styled Newsletter Embed

## Scenario

A marketing page needs a compact newsletter form styled through the Gravity Forms block, without changing the site's global Gravity Forms theme.

## Correct behaviour

- Inspect the current page embed method before changing anything.
- Prefer per-block Form Styles over global form theme changes.
- Keep visible labels unless the project has a documented accessible alternative.
- Avoid deprecated Ready Classes for new layouts.
- Validate desktop, tablet, mobile, required-field errors, confirmation state, and focus visibility.
- If the form is embedded by shortcode, validate `theme` and `styles` parameters before recommending a conversion.

## Safe output

Use `templates/frontend-style-audit.md` first if the page already exists. Use `templates/layout-regression-check.md` after a style change or planned deployment.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
