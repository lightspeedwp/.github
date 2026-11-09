# Radius and shadow tokens

## Border radius

Variables whose code syntax is `--wp--preset--border-radius--<slug>` become `settings.border.radiusSizes` entries `{ slug, name, size }`:

- `slug` comes from the code syntax (`--border-radius--300` becomes `300`).
- `name` is the bare size (`Small`, `Base`). An older `Radius Small` name loses its `Radius` prefix, because the variable already lives in the Radius collection.
- `size` is `0` for zero, otherwise the value in px (`8` becomes `8px`).

The mapper also sets `settings.border.radius: true`. Keep the other `settings.border` keys (`color`, `style`, `width`).

`radiusSizes` needs a WordPress version that supports radius presets. If the theme's `$schema` is older, say so in the plan rather than raising the schema version silently.

Authored patterns and styles reference radius presets (`var:preset|border-radius|<slug>`) and never a pixel value.

## Shadows

Shadows come from Figma **effect styles**, not variables. The export includes the local effect styles, and the mapper turns each visible drop or inner shadow into a `settings.shadow.presets` entry `{ slug, name, shadow }`:

- `slug` comes from `--wp--preset--shadow--<slug>` in the style's description. Without one, the slug is made from the style name and a warning is raised, so ask for the description to be added.
- `name` is the last segment of the style name, unchanged (`Elevation/Small` becomes "Small").
- `shadow` is `x y blur spread rgba()`, with `inset` for inner shadows. Several shadows in one style are joined with commas.

The mapper sets `defaultPresets: false`, so the core shadow presets don't appear next to the theme's. Keep `true` only if the user asks.

A shadow colour taken from a variable resolves to its value at export time. If the dark mode needs different shadows, add them to `styles/dark.json` only where the dark surface needs a different treatment.
