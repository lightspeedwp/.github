# Copilot Instructions (Repo-Aware)

You are assisting with a **WordPress block theme** driven by **theme.json** and LSX tokens.

Rules:

- Prefer theme.json presets & CSS variables over literals.
- Use numeric slugs (`font-size-200`, `spacing-40`) and semantic colours (`base`, `contrast`, `primary`).
- Assume **fluid typography** is enabled.
- Recommend tokens for spacing/colour before custom CSS.
- Keep slugs stable; suggest value changes when iterating.

Reference:

- `/theme.json`
- `/tokens/figma-variables.json`
- `/tokens/css-tokens.css`
- `/docs/*`
