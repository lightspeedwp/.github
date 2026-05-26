# Technical Brief Workflow

## 1. Intake

Capture:

- project name
- client or internal project
- live URL
- dev/staging URL
- Figma design system URL
- Figma prototype or Make URL
- theme repo
- plugin repo
- build type
- key stakeholders
- target launch phase

## 2. Evidence classification

Classify each source as:

| Source type | Use |
|---|---|
| Figma design system | variables, components, variants, modes |
| Figma prototype | page flow, layout intent, responsive assumptions |
| Screenshots | visual references when Figma access is limited |
| Existing site | content, IA, redirects, legacy patterns |
| Repo | current architecture and constraints |
| PRD/client brief | goals, scope and acceptance criteria |

## 3. Mapping pass

Create four core maps:

1. Figma variables to `theme.json` tokens.
2. Figma components to WordPress blocks or block variations.
3. Figma sections to WordPress patterns and template parts.
4. Figma pages to WordPress templates.

## 4. Architecture pass

Decide:

- block theme responsibilities
- custom block plugin responsibilities
- custom post type or taxonomy needs
- custom fields or SCF/ACF-style field needs
- WooCommerce template needs
- editor restrictions or governance

## 5. Handoff pass

Output:

- developer-ready technical brief
- implementation risks
- open questions
- GitHub issue seeds
- QA routing notes
