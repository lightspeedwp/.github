# Accessibility

## Baseline stance

Gravity Forms provides tools and ongoing improvements for accessible forms, but the final accessibility of a form depends on configuration, content, theme CSS, embed context, and testing. Treat accessibility findings as blockers unless explicitly accepted and documented.

## WCAG-oriented defaults

- Use visible labels for every input.
- Do not use placeholders as the only instructions.
- Use concise descriptions connected to fields.
- Mark required fields clearly and consistently.
- Keep error messages specific and actionable.
- Preserve semantic fieldsets/legends for grouped inputs.
- Keep keyboard navigation intact.
- Confirm colour contrast and focus states in the active theme.
- Use accessible confirmation messages and avoid disappearing-only feedback.

## Gravity Forms 3.0 caveat

Gravity Forms 3.0 documentation describes accessibility-by-default improvements and International Phone work, but this skill treats 3.0 behaviour as beta/version-specific. Verify version and project risk before relying on it.

## Field-specific notes

- **Datepicker**: provide manual date format guidance and test keyboard/screen-reader behaviour.
- **International Phone**: verify version/add-on availability; test labels, sub-labels, validation, and country selector usability.
- **File Upload**: include allowed type/size instructions and accessible error handling.
- **Choice fields**: keep labels clear; do not rely on colour or image alone.
- **Multi-page forms**: use meaningful page names, progress indicators where helpful, and clear Back/Next labels.
- **HTML fields**: ensure custom markup is semantic and not focus-trapping.
- **Consent fields**: consent text must be clear, specific, and linked to relevant policy pages if available.

## Content provider checklist

- Field labels are plain language.
- Required fields are genuinely required.
- Help text is short and useful.
- Consent wording is approved.
- Confirmation copy explains next steps.
- Error messages do not blame the user.

## Designer checklist

- Adequate contrast for labels, inputs, borders, hints, errors, and buttons.
- Visible focus states.
- Touch targets are comfortable.
- Multi-column layouts collapse sensibly.
- Error and success states are designed.

## Developer/configuration checklist

- No placeholder-only fields.
- No custom CSS hiding labels or focus outlines.
- Scripts are not deferred/broken by optimisation plugins.
- Conditional fields are reachable and announced appropriately.
- Test with keyboard and at least one automated checker; use manual assistive testing for high-risk forms.

## Test recommendations

Run a keyboard-only submission, forced validation error, mobile viewport test, contrast/focus check, screen-reader spot check for complex forms, and branch tests for conditional/multi-page forms.

## Version-specific accessibility caveat

Gravity Forms documentation currently groups 3.0 under a beta category and describes accessibility-by-default and International Phone improvements there. Treat those improvements as version-specific. For existing 2.x sites, continue to verify form settings, theme output, labels, descriptions, error states, focus styles, and contrast rather than assuming 3.0 defaults exist.
