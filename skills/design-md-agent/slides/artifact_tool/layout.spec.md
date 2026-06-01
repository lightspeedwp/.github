## Layouts API

### Overview

Layouts define reusable arrangements of placeholders (title/subtitle/body/etc). A slide can apply a `Layout` to materialize placeholder shapes, which you then edit per-slide.

Main surfaces:

- `presentation.layouts` — create and lookup layouts
- `layout.placeholders` / `layout.shapes.addPlaceholder(...)` — define placeholders inside the layout
- `slide.setLayout(layout)` — apply layout to a slide
- `slide.placeholders` — access resolved placeholder shapes

NOTE: All dimensions must be specified in terms of pixels.

---

### Quick start

```python
from presentation_artifact_tool import Presentation

presentation = Presentation.create()

# Create a layout and define placeholders.
layout = presentation.layouts.add("Title Slide")
layout.placeholders.add({ "name": "Title", "type": "title", "index": 1, "text": "Title" })
layout.placeholders.add({ "name": "Subtitle", "type": "subtitle", "index": 2, "text": "Subtitle" })

# Apply it to a slide.
slide = presentation.slides.add()
slide.set_layout(layout)

slide.placeholders.get_item("title").text = "Kickoff"
slide.placeholders.get_item("subtitle").text = "Enterprise Vision"
```

---

### LayoutCollection (`presentation.layouts`)

#### `presentation.layouts.add(name)`

```python
layout = presentation.layouts.add("Agenda")
layout.id  # stable id
```

#### Lookup

```python
presentation.layouts.get_by_id(layout.id)    # Layout | None
presentation.layouts.get_by_name("Agenda")   # Layout | None
presentation.layouts.get_item("Agenda")      # Layout (throws if missing)
presentation.layouts.items                   # list[Layout]
```

---

### Defining placeholders

You can define placeholders via the placeholder facade:

```python
layout.placeholders.add({
  "name": "Title",
  "type": "title",
  "index": 1,
  "text": "Title",
  "geometry": "textbox",  # convenience; maps to a rect text box
})

layout.placeholders.summary()
# [{ "name": "title", "type": "title", "text": "Title" }, ...]
```

Or create placeholder shapes directly and set their placeholder metadata:

```python
title = layout.shapes.add_placeholder("Title")
title.placeholder.type = "title"
title.text = "Kickoff"
```

---

### Applying a layout to a slide

```python
slide.set_layout(layout)
slide.use_layout_id  # layout id applied to this slide
```

Then access resolved placeholders:

```python
slide.placeholders.summary()
slide.placeholders.get_item("subtitle").text = "Enterprise Vision"
```
