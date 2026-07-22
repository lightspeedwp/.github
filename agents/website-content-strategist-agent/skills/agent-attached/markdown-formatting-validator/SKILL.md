---
name: markdown-formatting-validator
description: Apply and validate required Markdown formatting rules for website-content outputs. Use when a user needs a document, review, brief, page draft, newsletter, claim register, form spec, or responder email output to follow defined heading, divider, metadata, and section-structure requirements.
---

# Markdown Formatting Validator

## When to use this skill

Use this skill when the output must be clean, consistent, copy-ready Markdown and the structure matters.

## Workflow

1. Identify the output type.
2. Match it to the closest template or formatting pattern.
3. If the output is an intake-style review, review, source-review, readiness-review, planning-review, or "what should happen next" response, enforce the exact required wrapper instead of keeping the raw specialist layout.
4. For intake-style review outputs, normalize any custom readiness wording into the closest allowed `Current state:` value and move all nuance to the `Limit:` line.
5. Treat the output as intake-style review automatically when the request or draft includes intake behavior such as questionnaire selection, intake-field statuses, prefilled values, blocking-gap identification, source-pack requests, routing to the next workflow, or review of what should happen next before drafting.
6. Normalize heading depth, divider usage, metadata placement, section names, list style, and table style.
7. Check for missing required sections.
8. Remove rough notes, duplicate headings, mixed spelling variants, internal-path wording, and inconsistent labels.
9. Return only the polished Markdown output. Add a short validation note only if something material remains non-compliant and cannot be fixed safely.

## Validation rules

- Use `##` for main sections and `###` only for real subsections.
- Keep heading names practical and consistent.
- Use horizontal divider lines only where the pattern requires them.
- Keep list punctuation and label style consistent.
- Do not mix review notes into final publishable copy.
- Keep metadata compact and near the top when used.
- Preserve required content fields for the matched template.
- For intake-style review outputs, the exact required wrapper wins over a specialist workflow's preferred structure.
- For intake-style review outputs, never leave raw headings such as `Intake Snapshot`, `Status Buckets`, `Blocking Questions`, or similar specialist-only section names in the final delivery when the required wrapper says otherwise.
- For intake-style review outputs, never leave custom readiness wording on the `Current state:` line. Convert it to one allowed value and move the rest to `Limit:`.
- For intake-style review outputs, if a divider before a required `##` section or the final ending divider is missing, insert it during validation instead of leaving the wrapper incomplete.

## Supporting Files

- `references/formatting-rules.md` — required formatting rules by output type.
- `references/validation-checklist.md` — final validation pass checklist.
- `assets/output-type-template-map.md` — quick map from output type to preferred template shape.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
