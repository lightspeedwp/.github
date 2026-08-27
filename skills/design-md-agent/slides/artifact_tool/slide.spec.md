## Slide API

### Overview

`Slide` represents a single page in the deck. It exposes:

- `background` (a `FillConfig` surface)
- `speaker_notes`
- `frame` (pixel dimensions)
- `placeholders` (resolved from the applied layout)
- element collections: `shapes`, `images`, `tables`, `charts`
- structural commands: `duplicate()`, `move_to(index)`, `delete()`
- rendering: `export(...)`

### Quick start

```python
from presentation_artifact_tool import (
    Presentation,
    PresentationExportOptions,
    PresentationFile,
    PresetShapeGeometryConfig,
    ShapePositionConfig,
)

deck = Presentation.create()
slide = deck.slides.add()

# Background
slide.background.fill = "accent4"

# Duplicate
slide2 = slide.duplicate()

# Add shapes
title = slide.shapes.add(
    PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=400))
)
title.text = "Slide 1:Vision & Strategy"

title2 = slide2.shapes.add(
    PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=400))
)
title2.text = "Slide 2: Financial Overview"

# Save PPTX
PresentationFile.export_pptx(deck).save("presentation.pptx")

```

(working example in [./examples/slide_quick_start.py](./examples/slide_quick_start.py))

---

### duplicate

Create a deep façade-level copy of the slide and append it to the end.

```python
slide.duplicate(): Slide
```

Returns: `Slide` — the new slide instance, appended at the end by default.

Notes:

- Duplicates element content and background styling.
- Does not set the active slide automatically.

---

### move_to

Move the slide to a specific index in the deck.

```python
slide.move_to(index: number): void
```

Errors:

- Throws if `index < 0` or `index >= presentation.slides.count`.

Example:

```python
from presentation_artifact_tool import Presentation, SlideAddOptions

deck = Presentation.create()
first = deck.slides.add()
second = deck.slides.add()
second.move_to(0)  # move to the first position
```

(working example in [./examples/slide_move_to.py](./examples/slide_move_to.py))

---

### delete

```python
slide.delete()
```

---

### background

Access and mutate the slide background.

```python
slide.background.fill: Fill
```

Examples:

```python
slide.background.fill = "accent1"
# OR
slide.background.fill = FillConfig(type="solid", color="background1")
# OR
slide.background.fill = FillConfig(
  type="gradient",
  gradient_kind="linear",
  angle_deg=45,
  stops=[
    {"offset": 0, "color": "accent1"},
    {"offset": 100000, "color": "accent3"},
  ],
)
```

---

### Element sub-collections

`Slide` re-exports element collections for ergonomics:

```python
# Shapes
slide.shapes.add(
    PresetShapeGeometryConfig(
        geometry="rect",
        position=ShapePositionConfig(left=50, top=50, width=300, height=120),
        fill: "accent1",
    )
)

# Images
slide.images.add({"uri": "https://example.com/banner.png", "alt": "Banner"});

# Tables
slide.tables.add([
    ["Product", "North", "EMEA"],
    ["ChatGPT", 120, 94],
])

# Charts
slide.charts.add({"type": "line", "data": { "series": [...], "categories": [...]}});
```

Notes:

- These are façades over the underlying `elements` list and maintain a clean boundary.

### exports a slide preview

**Summary**
Exports a slide preview.

**Key APIs**

- `Presentation.create()` — Instantiates a new presentation artifact facade.
- `presentation.slides.add()` — Appends a slide to the deck and returns a mutable `Slide` facade.

**How to use it**

- Start by calling `Presentation.create()` to obtain an authoring surface detached from any proto instance.
- Use `presentation.slides.add()` to materialize a slide facade where you can place content.

```python
presentation = Presentation.create()
slide = presentation.slides.add()
```

## Examples

### Duplicates and reorders slides

**Summary**
Duplicates and reorders slides.

**Key APIs**

- `Presentation.create()` — Instantiates a new presentation artifact facade.
- `presentation.slides.add()` — Appends a slide to the deck and returns a mutable `Slide` facade.

**How to use it**

- Start by calling `Presentation.create()` to obtain an authoring surface detached from any proto instance.
- Use `presentation.slides.add()` to materialize a slide facade where you can place content.

```python
presentation = Presentation.create()
original = presentation.slides.add()
duplicate = original.duplicate()
duplicate.move_to(1)
```
