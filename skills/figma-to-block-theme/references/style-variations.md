# Style variations

Each extra mode of a semantic colour or font collection becomes a theme style variation in `styles/<mode-slug>.json`. Use `wp-block-themes` (its `style-variations.md`) for how WordPress loads and merges them.

## From the mapper

The mapper's `variations` object has one key per mode, for example `dark` or `safari-night`, each with:

- `title`: the Figma mode name
- `settings.color.palette`: for a colour mode, the same palette as `theme.json`, unchanged
- `settings.custom.color`: for a colour mode, every semantic token with its value in that mode
- `settings.typography.fontFamilies`: the families for that mode, when the font collection has the mode too

## Writing a variation

1. **Titles.** Show the detected mode names and ask the user to confirm or change each title. Don't assume a mode name is the display title.
2. **Slug parity.** Every palette slug in a variation must exist in `theme.json`. A variation adds no new slugs.
3. **File shape.** Use the theme's own `$schema` and `version`:

   ```json
   {
     "$schema": "<same as theme.json>",
     "version": 3,
     "title": "<confirmed title>",
     "slug": "<mode-slug>",
     "settings": {
       "color": { "palette": [] },
       "typography": { "fontFamilies": [] }
     },
     "styles": {
       "typography": { "fontFamily": "var:preset|font-family|body" },
       "elements": {
         "heading": { "typography": { "fontFamily": "var:preset|font-family|heading" } }
       }
     }
   }
   ```

   Leave out `typography` when the variation only changes colours. Include the `styles` wiring only when the variation changes fonts.

4. **Fonts.** Each variation family needs `fontFace` files. Download them with `scripts/google-fonts.ts`, as in [tokens-typography.md](tokens-typography.md).
5. **Colour modes (dark and any other).** A colour mode holds the **same palette** as `theme.json` and **only** the palette, plus a replacement for **every** semantic token in `settings.custom.color`. The primitives never change between modes; the semantic tokens point at different primitives, so each mode can show different colours. For example, `text/default` is `contrast` in the base mode and `base` in Dark.

   ```json
   {
     "$schema": "<same as theme.json>",
     "version": 3,
     "title": "Dark",
     "slug": "dark",
     "settings": {
       "color": { "palette": [ "<same entries as theme.json>" ] },
       "custom": {
         "color": {
           "text": { "default": "var(--wp--preset--color--base)" },
           "surface": { "default": "var(--wp--preset--color--contrast)" }
         }
       }
     }
   }
   ```

   In Figma, the modes live on the semantic collection (`Theme - Semantic`), not the primitives. If a primitive changes value in a mode, the mapper warns and keeps the base value.
6. **Existing files.** If `styles/<slug>.json` exists, update the palette, the font arrays and, for a colour mode, the `settings.custom.color` token paths. When the fonts change, keep `styles.typography.fontFamily` and `styles.elements.heading.typography.fontFamily` pointing at the updated families. Keep its other settings and styles.

## Review

- One file per mode, each with a confirmed title.
- All palette slugs match `theme.json`. A colour mode's palette is identical to it.
- A colour mode replaces every `settings.custom.color` token path, and nothing else.
- Each variation that changes fonts has `heading` and `body` families, and their `fontFace` files exist.
