# WordPress and theme.json Mapping

Use this reference when aligning `DESIGN.md` with WordPress implementation evidence.

## Core Principle

`DESIGN.md` documents design intent for agents. `theme.json`, style variations, block styles and CSS variables document implementation reality. Keep the mapping explicit in both directions.

## Common Mappings

| WordPress source | DESIGN.md target | Notes |
|---|---|---|
| `settings.color.palette` | `colors` tokens | Preserve slug-to-token traceability. |
| `settings.typography.fontSizes` | `typography` size tokens | Note fluid settings when present. |
| `settings.spacing.spacingSizes` | `spacing` tokens | Prefer named scale entries over raw pixel values. |
| `settings.custom` token groups | custom token notes | Record project-specific extensions clearly. |
| `styles.*` defaults | global rationale sections | Use for body, headings, links and block defaults. |
| `styles/variation.json` files | mode or variant notes | Map to brand, campaign or light/dark modes where applicable. |
| block styles and pattern files | `components` guidance | Explain how reusable WordPress UI matches design-system components. |
| CSS custom properties | supporting evidence | Use to confirm implementation, especially for legacy themes. |

## What to Check

- whether WordPress presets reflect the intended semantic naming;
- whether hardcoded CSS values bypass token systems;
- whether block patterns rely on one-off spacing or colours;
- whether style variations mirror design modes consistently;
- whether editor-customisable areas are documented safely;
- whether theme responsibilities are being confused with plugin logic.

## Theme and Plugin Boundary

Keep these boundaries clear in follow-up notes:

- Theme: presentation, templates, patterns, global styles, template parts and editor appearance.
- Plugin: content models, taxonomies, fields, integrations, business logic and portable features.

If a token or rule requires application logic rather than presentation alone, mark it as a follow-up outside `DESIGN.md`.
