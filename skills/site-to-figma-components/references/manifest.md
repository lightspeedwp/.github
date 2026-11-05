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
    "template:single-tour": { "nodeId": "14101:12", "mobileNodeId": "14101:900" }
  }
}
```

Use the component set's ID for components, and the 1440px frame (`nodeId`) and 390px frame (`mobileNodeId`) for parts, patterns and templates.

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
        { "id": "pattern:map", "target": "local" }
      ]
    }
  ],
  "skipped": [],
  "warnings": []
}
```

Entries are ordered components, template parts, patterns, then templates, so styles exist before the patterns that use them. `variantProperties` is included for items with variants. A composition entry marked `local` is a section the reviewer cut: build it inline in the template.

The writer refuses an unapproved inventory, a node ID not in the form `123:456`, and (without `--partial`) any item with no node. It warns about nodes for cut or unknown items, and about templates that change at 390px but have no mobile frame.

## How Pattern mode uses it

`figma-to-block-theme` Pattern mode reads `manifest.json` in entry order. For each entry it reads the node with `figma-design-to-code`, writes the file named in `wordpress.file`, and uses `wordpress.slug`, `block` and `styles` as given. Templates are written last, from their `composition`: `<!-- wp:template-part {"slug":"header"} /-->` for parts and `<!-- wp:pattern {"slug":"tsp-theme/hero"} /-->` for patterns.
