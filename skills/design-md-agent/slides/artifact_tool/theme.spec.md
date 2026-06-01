## Theme API

### Overview

`presentation.theme` owns the deck’s **theme color scheme** (OpenXML-style scheme names). Most authoring APIs reference theme colors by name (`"accent1"`, `"bg1"`, `"tx1"`, …) or via friendly aliases (`"background1"`, `"text1"`).

---

### Setting a color scheme

```python
from presentation_artifact_tool import Presentation

presentation = Presentation.create()

presentation.theme.color_scheme = {
  "name": "ChatGPT",
  "themeColors": {
    "accent1": "#156082",
    "accent2": "#E97132",
    "accent3": "#196B24",
    "accent4": "#0F9ED5",
    "accent5": "#A02B93",
    "accent6": "#4EA72E",
    "bg1": "#FFFFFF",
    "bg2": "#000000",
    "tx1": "#1F1F1F",
    "tx2": "#FFFFFF",
    "dk1": "#000000",
    "lt1": "#FFFFFF",
    "dk2": "#0E2841",
    "lt2": "#E8E8E8",
    "hlink": "#467886",
    "folHlink": "#96607D",
  },
}
```

### Reading the resolved hex map

```python
color_map = presentation.theme.hex_color_map
# { accent1: "#156082", ..., folHlink: "#96607D" }
```

---

### Using theme colors in authoring

Once a theme is set, you can style content via theme color names:

```python
slide = presentation.slides.add()
shape = slide.shapes.add({
  "geometry": "rect",
  "position": { "left": 80, "top": 80, "width": 420, "height": 200 },
})

shape.fill = "accent2"
shape.line.style = "solid"
shape.line.width = 1
shape.line.fill = "tx1"
```
