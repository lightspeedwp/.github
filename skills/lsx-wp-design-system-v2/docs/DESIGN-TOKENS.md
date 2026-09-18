# Design Tokens (Figma ↔ WordPress)

**Colour:** semantic (`base`, `contrast`, `primary`), **neutral** (`neutral-0…900`), **accent** (`accent-100…900`).  
**Typography:** numeric `font-size-100…900` with labels (Tiny → Colossal).  
**Spacing:** numeric `spacing-10…100` (10px steps; larger tokens for layout).

## Fluid Strategy

- Enable `typography.fluid: true` in theme.json for automatic fluid type.
- Use `clamp()` only on larger spacings (e.g. `spacing-90`, `spacing-100`).

## Naming

- **Stable slugs**; adjust values, not names.
- **Numeric scales** for predictable progression & editor sort.
- **Semantic colours** for future-proofing.
