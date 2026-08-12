## Shapes API

### Overview

`slide.shapes` manages drawable shapes on a slide. The API is optimized for **JSON-ish inputs**:

- `geometry` is a string (for example `"rect"`, `"roundRect"`, `"ellipse"`)
- `fill` accepts a `FillConfig` (for example `"accent1"` or a gradient object)
- `position` is in **pixels** and supports partial updates

NOTE: All dimensions must be specified in terms of pixels.

---

### Quick start

```python
rect = slide.shapes.add({
  "geometry": "rect",
  "position": { "left": 40, "top": 60, "width": 320, "height": 180 },
  "fill": "accent1",
  "line": { "style": "solid", "fill": "accent5" },
})

rect.line.width = 0.5  # px
rect.rotation = 15     # degrees
rect.position = { "left": 60, "top": 80 }  # partial update
rect.text = "Quarterly Results"
```

---

### ShapeCollection (`slide.shapes`)

#### `slide.shapes.add(config)`

Create a new shape element.

```python
slide.shapes.add({
  "geometry": "rect" | "ellipse" | "triangle" | "line" | "star5" | "cloud" | ...,
  "position": { "left": ..., "top": ..., "width": ..., "height": ..., "rotation": ..., "horizontal_flip": ..., "vertical_flip": ... },
  "fill": "<FillConfig>",
  "line": { "style": "solid" | "dashed" | "dotted" | "dash-dot" | "dash-dot-dot", "fill": "<FillConfig>", "width": ... },
})
```

Common geometry names (non-exhaustive): `"rect"`, `"roundRect"`, `"ellipse"`, `"triangle"`, `"rightArrow"`, `"flowChartDecision"`, `line`, `"moon"`.

For example, to create an add a white rectangle shape:
`slide.shapes.add(PresetShapeGeometryConfig(geometry="rect", fill="#eeeeee", ...))`

To add a line shape that is red:
`slide.shapes.add(PresetShapeGeometryConfig(geometry="line", fill="#ff0000", ...))`

The full union is `PresetShapeGeometryConfig#geometry` in `@oai/granola/models` (it mirrors the PowerPoint preset shape catalog).

#### Lookup / enumeration

```python
by_name = slide.shapes.get_item("Badge")      # Shape | None
by_id = slide.shapes.get_item({ "id": "..." })  # Shape | None

slide.shapes.items      # list[Shape]
slide.shapes.get_by_id("...")  # Shape | None
```

#### Placeholders

For layouts and placeholder-driven slides, you typically use `layout.shapes.addPlaceholder(...)`, but the collection also exposes:

```python
ph = slide.shapes.add_placeholder("Title")
ph.placeholder.type = "title"
ph.text = "Kickoff"
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
