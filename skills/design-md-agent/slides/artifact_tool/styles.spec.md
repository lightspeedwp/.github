## Styles API

### Overview

`presentation.styles` is a catalog of **named text styles**. Styles are designed for reuse and LLM discovery:

- Built-ins like `title`, `heading1`, `heading2`, `body`, `list`, `numberedList`
- Custom styles via `styles.add("myStyle")`
- Introspection via `styles.describe()` / `styles.describe("title")`

Styles are **block-level**: applying a `style` to any range upgrades the *entire containing paragraph* to that style.

NOTE: All dimensions must be specified in terms of pixels.

---

### Quick start

```python
from presentation_artifact_tool import Presentation

presentation = Presentation.create()

# Create a custom style
accent = presentation.styles.add("accentStyle")
accent.description = "Accent text for highlights and callouts"
accent.color = "accent1"  # also supports passing a Color instance
accent.bold = True
accent.italic = True
accent.font_size = 18
accent.alignment = "center"
accent.typeface = "Aptos"

slide = presentation.slides.add()
shape = slide.shapes.add({ "geometry": "rect" })
shape.position = { "left": 40, "top": 40, "width": 640, "height": 120 }

shape.text = "Revenue up 21%"
shape.text.style = "accentStyle"
```

---

### `presentation.styles.get(name)`

Returns the named style (throws if missing):

```python
title = presentation.styles.get("title")
```

### `presentation.styles.add(name)`

Creates a style if it doesn’t exist, otherwise returns the existing style:

```python
metric = presentation.styles.add("metricLabel")
metric.description = "Metric labels in dashboards"
metric.font_size = 14
metric.bold = False
metric.color = "#444444"
metric.typeface = "Aptos"
```

### `presentation.styles.describe(...)`

Discovery surface for UIs/LLMs:

```python
all_styles = presentation.styles.describe()        # list of descriptors
title_desc = presentation.styles.describe("title") # single descriptor
```

Descriptors include fields like: `{ name, kind, description, usageHint, isBuiltIn }`.

---

### Applying styles to text

Apply a style to a whole paragraph:

```python
shape.text = "Quarterly Business Review"
shape.text.style = "title"
```

Apply a style to a selected range:

```python
subtitle = shape.text.get("Execution Plan")
subtitle.style = "heading2"
```

---

### Style semantics (important)

- **Paragraph scope**: assigning `range.style = "heading1"` applies to the whole paragraph containing that range.
- **Resetting**: setting a style clears existing inline overrides inside that paragraph (bold/color/etc).
- **Overrides after style**: inline formatting applied *after* the style assignment overrides the style defaults locally.

Example from tests:

```python
shape.text = "Quarterly Business Review"

# Apply heading style to a sub-range (paragraph becomes heading1).
shape.text.get("Business").style = "heading1"

# Inline override after the style:
review = shape.text.get("Review")
review.bold = True
review.color = "accent2"
```
