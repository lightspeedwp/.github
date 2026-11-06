# The hand-off manifest

`write-manifest.ts` joins the approved `inventory.json` with the node IDs recorded during the build.

## figma-nodes.json

Assemble it from the IDs each `use_figma` build call returns:

```json
{
  "fileKey": "dsDojfcCaLQSwLZaYqM0qu",
  "nodes": {
    "component:button": { "nodeId": "14100:200", "page": "> Components" },
    "part:header": { "nodeId": "14100:310", "mobileNodeId": "14100:340" },
    "template:front-page": {
      "nodeId": "14101:12",
      "mobileNodeId": "14101:900",
      "composition": [
        "part:header",
        "pattern:hero",
        { "id": "pattern:card-grid", "overrides": { "heading": "Our Safari Styles" } },
        { "id": "pattern:card-grid", "overrides": { "heading": "Featured Tours" } },
        "part:footer"
      ]
    }
  }
}
```

Use the component set's ID for components, and the 1440px frame (`nodeId`) and 390px frame (`mobileNodeId`) for parts, patterns and templates.

For each template, record `composition`: the built frame's sections in order, read from Figma with the snippet in [figma-build.md](figma-build.md#record-node-ids). The manifest follows it rather than the crawl, because the reviewer may have dropped or added sections. An entry is an inventory ID, or `{ id, overrides }` when the instance's text properties differ from the pattern's defaults. `overrides` holds every changed `TEXT` property, keyed by its full Figma property name. The writer refuses any ID that isn't in the inventory, including `unknown:` and `local:` entries, so resolve them first.

## manifest.json

```json
{
  "manifestVersion": 1,
  "site": "https://www.example.com",
  "theme": "tsp-theme",
  "figmaFileKey": "dsDojfcCaLQSwLZaYqM0qu",
  "inventoryApprovedAt": "2026-11-06T09:00:00.000Z",
  "generatedAt": "2026-11-07T09:00:00.000Z",
  "entries": [
    {
      "id": "pattern:hero",
      "kind": "pattern",
      "name": "Hero",
      "figma": { "fileKey": "…", "nodeId": "14100:500", "name": "Patterns/Hero", "url": "https://www.figma.com/design/…?node-id=14100-500" },
      "wordpress": { "type": "pattern", "block": "core/cover", "slug": "tsp-theme/hero", "file": "patterns/hero.php" },
      "sourcePages": ["https://www.example.com/"]
    },
    {
      "id": "template:single-tour",
      "kind": "template",
      "wordpress": { "type": "template", "slug": "single-tour", "file": "templates/single-tour.html" },
      "composition": [
        { "id": "part:header", "target": "template-part", "slug": "header", "file": "parts/header.html" },
        { "id": "pattern:hero", "target": "pattern", "slug": "tsp-theme/hero", "file": "patterns/hero.php" },
        { "id": "pattern:card-grid", "target": "pattern", "slug": "tsp-theme/card-grid", "file": "patterns/card-grid.php", "instance": 1, "overrides": { "heading": "Our Safari Styles" } },
        { "id": "pattern:map", "target": "local" }
      ]
    }
  ],
  "skipped": [],
  "warnings": []
}
```

Entries are ordered components, template parts, patterns, then templates, so styles exist before the patterns that use them. `variantProperties` is included for items with variants. A composition entry marked `local` is a section the reviewer cut: build it inline in the template. `instance` numbers a pattern that appears more than once, and `overrides` holds that instance's own text. `wordpress.existsInTheme` is set when `--theme-dir` finds the target file already in the theme.

The writer refuses an unapproved inventory, a node ID not in the form `123:456`, and (without `--partial`) any item with no node. It warns about:

- nodes for cut or unknown items
- templates that change at 390px but have no mobile frame
- templates with no recorded `composition` (the crawled order is used instead)
- a built composition that differs from the live page, item by item or in section order (list each for the reviewer)
- targets that already exist in the theme (with `--theme-dir`)

## How Pattern mode uses it

`figma-to-block-theme` Pattern mode reads `manifest.json` in entry order. For each entry it reads the node with `figma-design-to-code`, writes the file named in `wordpress.file`, and uses `wordpress.slug`, `block` and `styles` as given. Templates are written last, from their `composition`: `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->` for parts, with each part's own landmark tag and `<!-- wp:pattern {"slug":"tsp-theme/hero"} /-->` for patterns. An instance with `overrides` is written inline, because a theme pattern reference can't change its text. A target that `existsInTheme` is replaced or renamed after review, never reused as it is.
