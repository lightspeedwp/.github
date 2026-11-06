# Building in Figma

Load `figma-use` before every `use_figma` call, `figma-generate-library` for components, and `figma-generate-design` for parts, patterns and templates. Follow their rules on sessions, one page per call, returned IDs and fonts. This file covers only what is specific to rebuilding a live site.

## Before the first write

1. **Agree the build scope.** The reviewer chooses which templates (and any extra items) to build, as `"build"` in `decisions.json`. Templates bring their parts and patterns. Build nothing outside `buildScope`.
2. **Confirm the file and pages.** Match the file's page structure. A test or pilot run goes on one page with a section per kind (Components, Template Parts, Patterns, Templates, Assets). A full build follows the file's groups (`> Components`, `> Template Parts`, `> Patterns`, `> Templates`).
3. **Add the approved variables first.** Apply the reviewer's answers to the report's proposals (see [classification.md](classification.md)): new font family, colours fitted into the ramps, new ramp steps, `custom/*` variables. If `setValueForMode` fails with "unloaded font", load the fonts the error names and retry; text bound to the variable must re-render.
4. **Inspect the file once** (read-only): local variables with their IDs, text and effect styles, existing icon components, and the fonts available (`listAvailableFontsAsync`). Keep a state ledger of every ID you create in a scratch file.

## Images

- Download images from the live site: `content.images` in the inventory, plus computed `background-image` on parts and sections. A video background has no image; extract a frame from the video file (`ffmpeg -ss 4 -i video.mp4 -frames:v 1 hero.jpg`) and crop any letterbox.
- Upload with `upload_assets` (`currentPageId` set), POSTing each file as multipart. Rasters arrive as image frames with an `imageHash`; SVGs arrive as editable vectors.
- `use_figma` can't fetch images (`createImageAsync` is unsupported). Apply uploaded images by copying `imageHash` into a fill: `{ type: 'IMAGE', imageHash, scaleMode: 'FILL' }`, on main components and as instance overrides.
- Turn SVG icons into components and bind their fills to the nearest semantic colour. Clear the hidden placeholder fill `createNodeFromSvg` adds. A brand logo keeps its own artwork colours.
- If the Figma MCP offers `generate_figma_design`, a capture of the live page may be used as a visual reference only, then removed. Never place a screenshot of the page in the deliverable.

## Order and structure

1. **Components** with `figma-generate-library`: one component set per inventory component, named from `figmaName` (`Components/Buttons/Button`), with the inventory's variant properties (`Style`, `Size`, `State`, `Breakpoint` …). Keep matrices at 30 variants or fewer. Expose text as `TEXT` properties and optional icons as `BOOLEAN` properties. After `combineAsVariants`, lay variants out in a grid and set the set's corner radius to 0.
2. **Template parts and patterns** with `figma-generate-design`: components themselves (sets with `Breakpoint=Desktop|Mobile` where the 390px layout changes), built only from component instances, text and image frames. Expose headings and links as properties so templates can override them.
3. **Templates**: an Auto Layout frame per page type and width (`Templates/<Name>/1440`, `/390`), whose direct children are only part and pattern instances, in the inventory's composition order. Override content with properties; swap nested card instances where a section uses a different card.

Use real site content throughout: headings, labels, excerpts, meta and images from the crawl.

## Binding rules

- **Every** fill, stroke, padding, gap, radius, width bound to a token, font size and font family binds to a variable; semantic colour tokens for colours (`action/*` for buttons; `text/*`, `surface/*` and `border/*` elsewhere).
- Text uses text styles. Don't change case, weight or decoration on a styled node: that detaches the style. Create a text style for the role instead (for example `Primary/Button Text/Small Strong`, uppercase, bound to the font family and size variables).
- Each component and component set gets a `description` naming its source on the live site, its WordPress target and its inventory id.
- A width or size with no token (such as a 1120px column) uses the nearest layout token and goes on the verification differences list.

## Record node IDs

After each call, add the IDs to `figma-nodes.json`: the component set for components; the set and its `Breakpoint=Mobile` variant (`mobileNodeId`) for parts and patterns; the 1440 frame and the 390 frame for templates. See [manifest.md](manifest.md).

When a template is final, record its `composition` with one read-only call. Each built component's description names its inventory ID (`Inventory id pattern:card-grid`), so the sections map back without guessing:

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:de735dea8937060a53411a8f34e8a1a13daf1a1e87bd348df9324ad59c622b22 -->

```js
const frame = await figma.getNodeByIdAsync('TEMPLATE_FRAME_ID');
const out = [];
for (const child of frame.children) {
  if (child.type !== 'INSTANCE') { out.push({ id: `local:${child.name}` }); continue; }
  const main = await child.getMainComponentAsync();
  if (!main) { out.push({ id: `unknown:${child.id}` }); continue; }
  const owner = main.parent?.type === 'COMPONENT_SET' ? main.parent : main;
  const id = /Inventory id ([\w:-]+)/.exec(owner.description)?.[1] ?? `unknown:${owner.name}`;
  const overrides = {};
  const definitions = owner.componentPropertyDefinitions;
  for (const [name, property] of Object.entries(child.componentProperties)) {
    if (property.type === 'TEXT' && property.value !== definitions[name]?.defaultValue) {
      overrides[name] = property.value;
    }
  }
  out.push(Object.keys(overrides).length ? { id, overrides } : id);
}
return out;
```

Expose every overridable text node as a `TEXT` component property, including nested text needed by templates. Compare all exposed text properties with their source defaults and keep the full property names (including Figma's ID suffix) as override keys, so repeated labels stay distinct. Pattern mode must apply every recorded value to its matching property when writing inline blocks.

Resolve any `unknown:` or `local:` entry before writing the manifest. An instance whose main component is unavailable is recorded as `unknown:<instance ID>` for review; the scan continues. Resolve local sections to identified inventory items (cut items remain local in the manifest).

<!-- /coderabbit-ai-generated:v1 -->

## Archive, never delete

`node.remove()` is blocked. Move superseded items to an archive page, grouped in sections, and check the destinations of prototype links before moving anything.
