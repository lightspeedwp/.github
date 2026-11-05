# Figma access

All Figma reads and writes go through the official Figma skills. This file covers only what to read for a block theme and how to hand it to the mapper.

## Before any Figma call

1. Load `figma-use` before `use_figma`, and `figma-design-to-code` before `get_design_context`. Follow their session, page and error-recovery rules.
2. Get the file key and node ID from the URL: `figma.com/design/:fileKey/...?node-id=1-2` becomes node `1:2`. For a branch URL, use the branch key.
3. If a call fails because of seat limits or rate limits, follow the official skill's guidance. Do not loop on a failing call, and do not switch to unofficial tools.

## Variables export (preferred)

Run this script through `use_figma` in the file that **defines** the variables, usually the design system library. It returns every local collection with its modes and values, the library variables that local aliases point to, and the local effect styles (for shadows).

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const seen = new Set();
const serialise = ( v ) => ( {
  id: v.id,
  name: v.name,
  type: v.resolvedType,
  codeSyntax: v.codeSyntax,
  valuesByMode: v.valuesByMode,
} );

const out = { collections: [], effectStyles: [] };
for ( const collection of collections ) {
  const variables = (
    await Promise.all(
      collection.variableIds.map( ( id ) => figma.variables.getVariableByIdAsync( id ) )
    )
  ).filter( Boolean );
  variables.forEach( ( v ) => seen.add( v.id ) );
  out.collections.push( {
    name: collection.name,
    modes: collection.modes.map( ( m ) => ( { id: m.modeId, name: m.name } ) ),
    variables: variables.map( serialise ),
  } );
}

// Library variables reached through aliases, kept so the mapper can resolve them.
const queue = out.collections
  .flatMap( ( c ) => c.variables.flatMap( ( v ) => Object.values( v.valuesByMode ) ) )
  .filter( ( value ) => value && value.type === 'VARIABLE_ALIAS' )
  .map( ( value ) => value.id );
const library = [];
while ( queue.length ) {
  const id = queue.pop();
  if ( seen.has( id ) ) continue;
  seen.add( id );
  const v = await figma.variables.getVariableByIdAsync( id );
  if ( ! v ) continue;
  library.push( serialise( v ) );
  for ( const value of Object.values( v.valuesByMode ) ) {
    if ( value && value.type === 'VARIABLE_ALIAS' ) queue.push( value.id );
  }
}
if ( library.length ) {
  out.collections.push( { name: 'Library (aliases only)', modes: [], variables: library } );
}

out.effectStyles = ( await figma.getLocalEffectStylesAsync() ).map( ( s ) => ( {
  name: s.name,
  description: s.description,
  effects: s.effects.map( ( e ) => ( {
    type: e.type,
    visible: e.visible,
    color: e.color,
    offset: e.offset,
    radius: e.radius,
    spread: e.spread,
  } ) ),
} ) );

return out;
```

Save the returned JSON to a scratch file, outside the theme and the repository, then run the mapper:

```bash
npx tsx ${CLAUDE_SKILL_DIR}/scripts/figma-variables-to-theme-json.ts export.json --out mapped.json
```

The mapper prints a `report` with a count per family and a list of warnings. A warning that `Library (aliases only)` has no modes is expected: that collection exists only to resolve aliases.

### What the mapper needs from the Figma file

- **WEB code syntax on every variable** that should become a preset, for example `var(--wp--preset--color--brand-500)` or `var(--wp--custom--color--text--default)`. Variables without it are skipped and reported. Ask the designer to add it; do not guess. `figma-use` covers how to set code syntax if you are asked to fix the file.
- **Mode names** that say what they are:
  - Colour and font collections: the first mode (or `--base-mode`) goes into `theme.json`, and every other mode becomes a style variation named after the mode (`Dark` becomes `styles/dark.json`).
  - Size collections with `Mobile` and `Desktop` modes (or `--min-mode` and `--max-mode`) produce fluid sizes: a spacing `clamp()` and font size `fluid` values.
- **Shadow slugs** in each effect style's description, as `--wp--preset--shadow--100`. Otherwise the slug comes from the style name and a warning is raised.

## Documentation table fallback

Some files document tokens as a table frame instead of defining variables. Use this only when the export returns no collections.

1. Read the node through `figma-design-to-code` (context and screenshot).
2. For each row, take the slug from the **Code Syntax** column and the value from the row. Ignore group prefixes such as "Global".
3. Compare the row count with the frame's "Total variables" note, if there is one, and re-read the table if they differ.
4. Write the rows in the export shape above (one mode per value column), then run the mapper as normal, so both routes share the same rules and warnings.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
