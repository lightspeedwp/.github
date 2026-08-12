# Accessibility audit

## Criteria

- Visible labels: every input must have a visible, meaningful label unless an approved accessible pattern is verified.
- Placeholder misuse: placeholders must not be the only instruction or label.
- Required indicators: required status must be clear and not colour-only.
- Descriptions and instructions: field descriptions must explain expected format and constraints.
- Error messages: validation errors must identify the failed field and explain how to fix it.
- Keyboard navigation: fields, choices, buttons, pagination, file uploads, CAPTCHA, and confirmations must be keyboard reachable.
- Focus states: focus visibility must be theme-compatible and not removed by CSS.
- Colour contrast notes: flag low-contrast labels, descriptions, error states, buttons, focus outlines, and CAPTCHA widgets when page evidence is available.
- Multi-page forms: progress indicators and previous/next buttons must be understandable and keyboard usable.
- Date/time fields: format expectations and keyboard alternatives must be clear.
- Phone fields: format and country/region assumptions must be explicit; 3.0 International Phone behaviour is version-specific.
- Choice fields: radio, checkbox, multiple choice, and image choice fields need accessible labels and clear grouping.
- Consent fields: consent copy must be visible, specific, and not hidden behind placeholder-only language.
- File upload fields: allowed types, file size, and privacy/storage expectations must be clear.
- Accessibility warnings: record warnings as findings; do not silently waive them.

## Evidence notes

Mark visual/keyboard/contrast conclusions as `Not assessed` or `Low confidence` unless the audit reviewed rendered page evidence, screenshots, or a reliable front-end test export.

## Retest steps

- Reinspect form schema for labels/descriptions/required states.
- Review rendered page at desktop and mobile widths where possible.
- Confirm keyboard tab order and visible focus.
- Trigger validation errors safely, only when test submission is approved.
- Confirm screen-reader-friendly field grouping where evidence is available.
