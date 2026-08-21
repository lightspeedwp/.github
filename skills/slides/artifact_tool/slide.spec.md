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

*Maintained by the 🤖 LightSpeedWP Automation Team*
