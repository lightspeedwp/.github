---
version: 1.1.0
last_updated: 2026-06-08
---

# Skill 04 — Build recommendations

## Purpose

For every Fail, and any Warn worth escalating, produce a concrete,
design-system-aligned fix recommendation.

## Design system mode

Read the DS mode recorded by Skill 01. Apply the matching recommendation strategy:

---

### Mode: `lightspeed`

**Triggered when:** User confirmed LightSpeed DS at the Skill 01 prompt.

Reference specific token names, component classes, and colour values from:
  `agents/accessibility-auditor/references/ls-ds-tokens.md`

NEVER suggest hex values or CSS values that are not in the LightSpeed DS token reference.

**LightSpeed DS quick reference:**

**Contrast failures on dark surfaces:**

- CTA buttons: use `--wp--preset--color--cta-500` (#00FCFC) bg + `--wp--preset--color--surface-600` text
- Eyebrow labels: use `--wp--custom--color--text--muted` minimum; prefer `--wp--custom--color--text--default`
- Card borders: use `--wp--custom--color--border--card` at full opacity; step up to `--wp--preset--color--neutral-300` if still failing

**Focus rings:**

- Use `--wp--custom--shadow--interactive--accent` on `:focus-visible`
- Never suppress `outline` without providing an equivalent visual indicator

**Accordion ARIA:**

- Trigger: `<button aria-expanded="false" aria-controls="panel-id">`
- Panel: `<div id="panel-id" role="region" aria-labelledby="trigger-id" hidden>`

**Ambiguous links:**

- Use `aria-label="[Full descriptive label]"` or `<span class="screen-reader-text">[context]</span>`

**Icon-only buttons:**

- `ls-btn--arrow` already scaffolds `aria-label=""` — populate it with destination context

State at the top of the recommendations section:
> "Recommendations based on: LightSpeed Design System v0.1.0"

---

### Mode: `user-provided`

**Triggered when:** User provided a DS reference (token list, style guide, or component library) at the Skill 01 prompt.

Use the tokens and values from the reference content provided by the user. For each fix:

- Reference the specific token or component name from the user's DS
- If the user's DS does not have a token covering the required fix, note the gap explicitly:
  > "No token found for [X] in the provided DS — use [WCAG-compliant fallback value] until a token is defined."

ARIA patterns and structural fixes (landmark regions, form labels, focus management) apply regardless of DS — include them as-is.

State at the top of the recommendations section:
> "Recommendations based on: [user-provided DS name or description]"

---

### Mode: `generic`

**Triggered when:** User provided no DS reference, said "none", or skipped the Skill 01 prompt.

Produce framework-agnostic fix recommendations using:

- CSS custom property patterns (e.g. `--color-text-primary`, `--color-surface`)
- WCAG-compliant hex values (ensure all suggested values meet the relevant contrast threshold: 4.5:1 for normal text, 3:1 for large text/UI components)
- Standards-based HTML and ARIA patterns

Do not reference any specific design system tokens. All suggested values must be WCAG-safe and self-contained.

State at the top of the recommendations section:
> "Recommendations based on: Generic WCAG-compliant patterns (no design system provided)"

---

## Priority levels

| Priority | Criteria |
|----------|---------|
| Critical | Level A failures OR failures that block entire user groups (keyboard users, screen readers) |
| Medium | Level AA failures, contrast issues, ambiguous labels |
| Low | Best practice, AAA considerations, minor improvements |

## Fix structure

For each recommendation:

1. State the check ID(s) it resolves
2. State the priority
3. Describe the problem in one sentence
4. Give the fix — specific token name, code snippet, or markup pattern
5. If multiple checks share one fix, group them into a single recommendation row

## Output

Pass the full recommendations list (including the DS mode statement) to Skill 05.
Do not present them separately — they will appear in the generated report.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
