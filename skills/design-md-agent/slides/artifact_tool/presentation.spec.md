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

### SlideCollection

Manage the ordered list of slides in a presentation.

#### add

Append a slide to the end of the deck.

```python
slides.add(init?: SlideAddOptions): Slide
```

Parameters:

| name   | type     | required | description                                                                 |
| ------ | -------- | -------- | --------------------------------------------------------------------------- |
| layout | `string` | no       | Name of the layout to apply (e.g., `"Title Slide"`, `"Title and Content"`). |
| notes  | `string` | no       | Optional speaker notes to initialize the slide.                             |

Returns: `Slide`

Examples:

```python
slide = presentation.slides.add()
```

#### insert

Insert a slide at a specific index.

```python
slides.insert(options?: SlideInsertOptions): Slide
```

Example:

```python
from presentation_artifact_tool import SlideInsertOptions

slide1 = presentation.slides.add()
ret = presentation.slides.insert(SlideInsertOptions(after=slide1))
slide2 = ret.slide
```

#### get_item

Lookup slides by index or id.

```python
slides.get_item(0): Slide
```

#### Deletion

Prefer `slide.delete()` when you already have a slide reference:

```python
slide = presentation.slides.getItem(0)
slide.delete()
```

You can also remove by index:

```python
presentation.slides.remove(0)
```

#### items and count

Return the number of slides.

```python
all_slides = presentation.slides.items
count = presentation.slides.count
```

## Key APIs

- `Presentation.create()` — Instantiates a new presentation artifact facade.
- `presentation.slides.add()` — Appends a slide to the deck and returns a mutable `Slide` facade.

**How to use it**

- Start by calling `Presentation.create()` to obtain an authoring surface detached from any proto instance.
- Use `presentation.slides.add()` to materialize a slide facade where you can place content.

```python
from presentation_artifact_tool import Presentation

presentation = Presentation.create()
intro = presentation.slides.add()
summary = presentation.slides.add()
```

## Examples

### Edit an existing presentation

```python
from pathlib import Path

from presentation_artifact_tool import Blob, Presentation, PresentationFile

CURRENT_DIR = Path(__file__).parent
PRESENTATION_FILE = CURRENT_DIR / "starter_presentation.pptx"

presentation = PresentationFile.import_pptx(Blob.load(PRESENTATION_FILE))

slide1 = presentation.slides.items[0]
slide1.background.fill = "accent1"

title = next(
    shape for shape in slide1.shapes.items if shape.text.to_string() == "Simple Presentation"
)
title.text = "Better Presentation"
title.text.font_size = 48
```

(working example in [./examples/presentation_edit.py](./examples/presentation_edit.py))
