# Plugin Audit Checklist

Use this checklist for a compact plugin-extension audit when the user wants findings and next actions quickly.

## 1. Scope

- What plugin or plugin feature is being reviewed?
- Which surfaces are in scope: frontend, editor, settings UI, dynamic render output, shared blocks, emails, or all?

## 2. Evidence

- Which files or sources were actually inspected?
- Which sources are still missing?
- Which findings are verified versus inferred?

## 3. Token and System Reuse

- Does the plugin reuse canonical color tokens or introduce raw colors?
- Does it preserve the shared spacing ladder and typography scale?
- Does it duplicate radius, shadow, border, or component conventions?
- Does it rely on CSS variables and aliases already used elsewhere?

## 4. WordPress Integration

- Does the plugin integrate cleanly with `theme.json`?
- Does it bypass block supports or style variation mechanisms unnecessarily?
- Does it hardcode values that should inherit from the theme or package contract?
- Does it create parent/child theme inheritance hazards?

## 5. Parity and Accessibility

- Are editor and frontend behaviors visually aligned?
- Are hover, focus, active, disabled, and error states covered?
- Are there contrast, keyboard, or semantic-control concerns?
- Is dark-mode or alternate-theme parity missing where the broader system expects it?

## 6. Recommendation Scope

- Can the issue be fixed entirely in the plugin?
- Does the plugin expose a real gap in `DESIGN.md`, `AGENTS.md`, `SKILL.md`, or adapter guidance?
- Is a `plugin-styling-map.md` justified, or would that be unnecessary overhead?

## 7. Final Output Check

Make sure the final response separates:

- Verified Findings
- Inferred or Provisional Findings
- Drift and Risks
- Recommendations
- Next Step
