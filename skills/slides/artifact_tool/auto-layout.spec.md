## Auto Layout API

### Overview

Auto layout arranges existing shapes within a frame using simple constraints (direction, alignment, gaps, padding). It is designed to:

- keep spacing consistent as content changes
- preserve each shape’s existing `width`/`height` (it only mutates `left`/`top`)

NOTE: All dimensions must be specified in terms of pixels.

### Entry points

```python
from presentation_artifact_tool import AutoLayout, AutoLayoutOptions

slide.auto_layout(items: list[Shape], options: AutoLayoutOptions): None
AutoLayout.apply(slide, items, options): None
```

### Options

```python
from presentation_artifact_tool import AutoLayoutAlign, AutoLayoutDirection, AutoLayoutOptions

slide.auto_layout(
    [shape_a, shape_b, shape_c],
    AutoLayoutOptions(
        direction=AutoLayoutDirection.horizontal, # or .vertical
        frame="slide",                            # "slide" | Shape | { left, top, width, height }
        align=AutoLayoutAlign.topCenter,          # see enum values below
        horizontalGap=24,                         # int | float | "auto"
        verticalGap=16,                           # int | float | "auto"
        horizontalPadding=40,
        verticalPadding=32,
    )
)
```

`AutoLayoutAlign` supports:

- `topLeft`, `topCenter`, `topRight`
- `left`, `center`, `right`
- `bottomLeft`, `bottomCenter`, `bottomRight`

Notes:

- When `frame: "slide"`, the slide bounds are used as the layout frame.
- For a single item with `align: "center"`, direction and gaps are ignored.

Errors:

- Throws if `items` contains shapes from a different slide.
- Throws if `frame` is invalid or has non-positive dimensions.

### See also

- Shapes API — author shapes prior to layout.
- Slide API — slide frame, background, and export.

## Examples

The snippets below assume an existing `Slide` facade (`slide`) with access to helpers such as `ShapeGeometry`, `Fill`, and `Color`. Only the statements relevant to auto layout are shown.

### Horizontal layout inside a container frame

Use a rectangle as the frame and distribute three metrics horizontally.

```python
panel = slide.shapes.add(
    PresetShapeGeometryConfig(
        geometry="rect",
        position=PositionConfig(left=80, top=120, width=640, height=200),
    )
)
panel.fill = "accent2"

labels = ["MRR", "Active Users", "NPS Score"]
metrics = []
for idx, label in enumerate(labels):
  metric = slide.shapes.add({ "geometry": "rect" })
  metric.text = label
  metric.position = { "width": 160, "height": 80 }
  metrics.append(metric)

slide.auto_layout(metrics, AutoLayoutOptions(
  direction=AutoLayoutDirection.horizontal,
  frame=panel,
  align=AutoLayoutAlign.center,
  horizontal_gap=24,
  horizontal_padding=32,
  vertical_padding=24,
))
```

(working example in [./examples/auto_layout_horizontal_layout.py](./examples/auto_layout_horizontal_layout.py))

### Bottom-right alignment in a custom frame

Lay out two CTA callouts inside explicit frame bounds.

```python
frame = AutoLayoutFrame(left=100, top=100, width=400, height=300)

callouts = [
    slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect")),
    slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect")),
]

callouts[0].text = "Primary CTA"
callouts[1].text = "Secondary CTA"
callouts[0].fill = "accent4"
callouts[1].fill = "accent5"

for callout in callouts:
    callout.position = {"width": 240, "height": 60}

slide.auto_layout(
    callouts,
    AutoLayoutOptions(
        direction=AutoLayoutDirection.vertical,
        frame=frame,
        align=AutoLayoutAlign.bottomRight,
        vertical_gap=12,
        horizontal_padding=24,
        vertical_padding=24,
    ),
)
```

(working example in [./examples/auto_layout_bottom_right_alignment.py](./examples/auto_layout_bottom_right_alignment.py))

### Static engine API on the slide frame

Invoke the static helper to distribute shapes across the top row.

```python
labels = ["A", "B", "C"]
shapes = []
for idx, label in enumerate(labels):
    shape = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
    shape.position = {"width": 40, "height": 40}
    shape.text = label
    shape.fill = FillConfig(
        type="solid", color=ColorConfig(type="theme", value=f"accent{idx + 1}")
    )
    shapes.append(shape)

AutoLayout.apply(
    slide,
    shapes,
    AutoLayoutOptions(
        direction=AutoLayoutDirection.horizontal,
        frame="slide",
        align=AutoLayoutAlign.topCenter,
        horizontal_gap=32,
        vertical_padding=48,
    ),
)
```

(working example in [./examples/auto_layout_static_engine_api.py](./examples/auto_layout_static_engine_api.py))

### Center a single shape on the slide

Center a card without supplying gaps or direction.

```python
card = slide.shapes.add(
    PresetShapeGeometryConfig(
        geometry="rect", position=ShapePositionConfig(left=0, top=0, width=400, height=200)
    )
)
card.text = "Executive Summary"
card.fill = "accent1"

slide.auto_layout(
    [card],
    AutoLayoutOptions(frame="slide", align=AutoLayoutAlign.center),
)
```

(working example in [./examples/auto_layout_center_card.py](./examples/auto_layout_center_card.py))

### Justified column layout: header and footer

Pin a title block to the top-left and a footer to the bottom-left.

```python
title = slide.shapes.add(
    PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=600, height=60))
)
subtitle = slide.shapes.add(
    PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=600, height=40))
)
footer = slide.shapes.add(
    PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=600, height=32))
)

title.text = "Weekly Business Review"
subtitle.text = "Key initiatives and scorecard"
footer.text = "Confidential • Internal Use Only"

padding_x = 40
padding_y = 32
gap_between_title_and_subtitle = 8

slide.auto_layout(
    [title, subtitle],
    AutoLayoutOptions(
        direction=AutoLayoutDirection.vertical,
        frame="slide",
        align=AutoLayoutAlign.topLeft,
        horizontal_padding=padding_x,
        vertical_padding=padding_y,
        vertical_gap=gap_between_title_and_subtitle,
    ),
)

slide.auto_layout(
    [footer],
    AutoLayoutOptions(
        frame="slide",
        align=AutoLayoutAlign.bottomLeft,
        horizontal_padding=padding_x,
        vertical_padding=padding_y,
    ),
)
```

(working example in [./examples/auto_layout_header_footer_layout.py](./examples/auto_layout_header_footer_layout.py))

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
