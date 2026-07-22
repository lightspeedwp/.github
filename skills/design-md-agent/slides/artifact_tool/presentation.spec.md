## Presentation API

### Overview

The `Presentation` façade is the entry point for building and editing slide decks. It owns:

- `slides` (create/reorder/delete slides)
- `layouts` and `masters` (placeholder-driven templates)
- `theme` and `styles` (color + named text styles)
- `scripts` (LLM-friendly command surface)
- asset catalogs (`charts`, `images`, `citations`) used by slide elements

### Object model

- `Presentation`
  - `slides: SlideCollection`
    - `Slide`
      - `elements` (and typed sub-collections): `shapes`, `images`, `tables`, `charts`
      - `background`, `notes`
  - `masters`, `layouts`, `theme` (document-level structure and styles)

### Quick start

```python
from presentation_artifact_tool import (
    Presentation,
    PresentationExportOptions,
    PresentationFile,
)

# Create a new deck
deck = Presentation.create()

cover = deck.slides.add()
agenda = deck.slides.add()

cover.background.fill = "accent1"
agenda.background.fill = "accent2"

PresentationFile.export_pptx(deck).save("quarterly-update.pptx")
```

(working example in [./examples/presentation_quick_start.py](./examples/presentation_quick_start.py))

### API matrix

| Area            | Members                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Presentation    | `create()`, `save(options)`, `slides`                                                            |
| SlideCollection | `add(init)`, `insert(index, init)`, `get_item(index_or_name)`, `get_by_name(name)`, `remove(index_or_name_or_slide)`, `count` |
| Slide           | `background`, `notes`, `elements`, `shapes`, `images`, `tables`, `charts`                                                                     |

---

### Presentation

#### create

Factory to create a new, empty `Presentation`.

```python
static Presentation.create(): Presentation
```

- Returns: `Presentation` — a new façade detached from any proto instance.
- Notes: The instance stores primitives and façade collections only.

### save file

Persist the presentation as a Powerpoint.

Example:

```python
PresentationFile.export_pptx(deck).save("presentation.pptx")
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
