## Images API

### Overview

`slide.images` manages bitmap images placed on a slide. An `ImageElement` combines:

- an **asset reference** (image data stored in `presentation.images`)
- a **frame/position** on the slide
- optional **fit** semantics (`contain` / `cover`)
- optional **crop**
- accessibility metadata (`alt`)
- optional **prompt** placeholders for LLM-driven generation

---

### Quick start

```python
import pathlib

from presentation_artifact_tool import Blob, Presentation, PresentationExportOptions, PresentationFile

CURRENT_DIR = pathlib.Path(__file__).parent
GIRAFFE_IMAGE = CURRENT_DIR / "giraffe.png"


deck = Presentation.create()
slide = deck.slides.add()

# Add image and position it
image = slide.images.add({"blob": Blob.load(GIRAFFE_IMAGE)})
image.position = {"left": 600, "top": 150, "width": 256, "height": 384}

PresentationFile.export_pptx(deck).save("slide.pptx")
```

(working example in [./examples/images_quick_start_local_path.py](./examples/images_quick_start_local_path.py))

### Add images from different sources

```python
from_path = slide.images.add({ "path": Blob.load("./assets/checkerboard.png"), "alt": "Marketing hero" })
from_blob = slide.images.add({ "blob": bytearray(16), "alt": "Logo from blob" })
from_data_url = slide.images.add({ "data_url": "data:image/png;base64,AAA", "alt": "Inline data URL image" })

from_path.position = { "left": 120, "top": 80, "width": 640, "height": 360 }
```

### Replace image content (keep geometry)

```python
hero = slide.images.add({ "blob": hero_blob, "alt": "Original hero" })
hero.position = { "left": 100, "top": 60, "width": 800, "height": 400 }

# Swaps the underlying image but preserves the frame
hero.replace({ "blob": replacement_blob, "alt": "Updated hero" })
```

### Crop + resize with aspect ratio lock

`lockAspectRatio` defaults to `false` for regular images; set it to preserve ratio while resizing.

```python
logo = slide.images.add({ "blob": logo_blob, "alt": "Company logo" })
logo.position = { "left": 40, "top": 40, "width": 200, "height": 200 }

logo.lock_aspect_ratio = True
logo.crop({ "left": 10, "top": 10, "width": 180, "height": 180 })

logo.width = 100  # height recomputes when lock_aspect_ratio is true
logo.lock_aspect_ratio = False
logo.width = 160  # height stays fixed once unlocked
```

### Rotation + flips

```python
picture = slide.images.add({ "blob": photo_blob, "alt": "Team offsite photo" })
picture.position = { "left": 200, "top": 120, "width": 640, "height": 360 }

picture.rotation = 15
picture.flip_horizontal = True
picture.flip_vertical = False
```

---

### Frame-based fit semantics (`contain` / `cover`)

Use `fit` at creation time, then set `frame` to define the container rectangle.

```python
frame = { "left": 40, "top": 40, "width": 400, "height": 300 }

# "contain": fit inside the frame while preserving aspect ratio.
contained = slide.images.add({ "blob": logo_blob, "fit": "contain", "alt": "Contained logo" })
contained.frame = frame

# "cover": fill the frame while preserving aspect ratio.
covered = slide.images.add({ "blob": photo_blob, "fit": "cover", "alt": "Background cover" })
covered.frame = frame

# Fit semantics make aspect-ratio safety the default.
covered.lock_aspect_ratio  # true

# Explicit stretch requires opting out.
covered.lock_aspect_ratio = False
covered.width = frame["width"] * 2
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
