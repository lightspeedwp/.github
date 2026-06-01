## Masters API

### Overview

`presentation.masters` is a convenience wrapper over `presentation.layouts`:

- A “master” is a `Layout` with `type === "master"`.
- Masters live inside the same layout registry, so they have stable `id`s and can be resolved via `presentation.layouts.getById(...)`.
- Regular slide layouts can link to a master via `layout.parentLayoutId`.

NOTE: All dimensions must be specified in terms of pixels.

---

### Create and resolve a master

```python
from presentation_artifact_tool import Presentation

presentation = Presentation.create()

master = presentation.masters.add("Master")
master.type  # "master"

# Masters are stored in presentation.layouts too:
resolved = presentation.layouts.get_by_id(master.id)
```

### Link a layout to a master

```python
master = presentation.masters.add("Master")
layout = presentation.layouts.add("Title Slide")

layout.set_parent_layout_id(master.id)
layout.parent_layout_id  # master.id
```

---

### Master background + color map (advanced)

Masters (layouts) expose:

- `master.background.ref` — background reference (Walnut/OpenXML background refs)
- `master.setColorMap(colorMap)` — color map / remap table used when resolving theme colors

Example pattern used in tests:

```python
from presentation_artifact_tool import Presentation, PresentationOptions

presentation = Presentation.create(
    PresentationOptions(
        slide_size={"width": 128, "height": 96},
    )
)

master = presentation.masters.add("Master")
master.set_color_map(color_map)
master.background.ref = background_ref

layout = presentation.layouts.add("Title Slide")
layout.set_parent_layout_id(master.id)

slide = presentation.slides.add()
slide.set_layout(layout)
```
