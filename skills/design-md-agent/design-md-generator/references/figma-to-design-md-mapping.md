# Figma to DESIGN.md Mapping

Use this reference when turning Figma evidence into `DESIGN.md`.

## Mapping Principles

- Prefer Figma variables over screenshot sampling.
- Preserve semantic intent before literal values when the system already has meaningful token names.
- Keep modes, states and variants explicit.
- Do not flatten everything into one generic token list.

## Common Mappings

| Figma source | DESIGN.md target | Notes |
|---|---|---|
| Colour variables | `colors` tokens | Keep semantic names where possible. |
| Typography variables or text styles | `typography` tokens | Capture size, line height, weight and family where evidenced. |
| Corner radius variables | `rounded` tokens | Note when radius is component-specific rather than global. |
| Spacing variables | `spacing` tokens | Prefer scale values over one-off dimensions. |
| Components | `components` entries | Keep component purpose and usage notes in the Markdown body. |
| Variants | separate component entries or structured variant naming | Keep naming predictable and traceable. |
| Modes | token variants or contextual notes | Relate to light, dark, brand or campaign modes. |
| Interaction states | component notes and state tokens | Include focus, hover, active, disabled and selected when evidenced. |

## Figma Evidence to Capture

When the design file supports it, capture:

- variables and modes;
- component names and variant structure;
- layout intent from auto layout or grid usage;
- responsive notes;
- accessibility cues such as focus states and contrast decisions;
- component descriptions or Dev Mode annotations.

## Confidence Rules

- `confirmed`: taken directly from variables, named styles, components or explicit design notes.
- `inferred`: estimated from screenshots, rendered frames or live-site behaviour without direct token evidence.
- `mixed`: confirmed at a category level but with one or two inferred details.

Use those labels in the source map and validation report when needed.
