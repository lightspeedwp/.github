## Rich Text API

### Overview

Shapes (and table cells) expose a unified `Text` surface:

- Assign text via strings, arrays, `Text.create(...)`, or structured “runs”
- Select ranges by **literal text** with `text.get("phrase")`
- Apply formatting on a `TextRange` (`bold`, `color`, `font_size`, `style`, `typeface`, …)
- Use **style presets** (`"title"`, `"heading1"`, `"list"`, `"numberedList"`) for block-level intent

NOTE: Font sizes must be specified in terms of pixels.
NOTE: The typeface (eg. "Aptos", "Arial", "Calibri", Courier New", "Times New Roman") can be set with the `typeface` attribute - see below for examples. (This is often confused with other terms like font family or font face which have slightly different meanings.)

---

### Assigning text

```python
shape.text = "Welcome"                 # single paragraph
shape.text = ["Line 1", "Line 2"]      # paragraphs
```

Structured input (paragraphs → runs) is also supported:

```python
shape.text = [
  [{ "run": "Q1 Highlights" }],
  [{ "run": "Revenue up 21% year over year" }],
  [{ "run": "Customer NPS at 72" }],
]

# Runs can be primitive strings/numbers too:
shape.text = [
  ["Primitive run ", 2025],
  [123, " units shipped"],
]

# Runs can carry inline style:
shape.text = [
  [{ "run": "Bold segment", "text_style": { "bold": True, "typeface": "Aptos" } }, " tail"],
  ["Follow up line"],
]
```

Notes:

- In structured input, `textStyle.fontSize` accepts either a number (px) or a unit string like `"18pt"`.

---

### Selecting ranges by literal text

```python
title = shape.text.get("Q1 Highlights")
title.bold = True
title.font_size = 32      # px
title.color = "accent1"   # theme name or hex
title.typeface = "Aptos"
```

Multi-line selections are allowed by joining with `\n`:

```python
bullets = shape.text.get(
  "\n".join(["Revenue up 21% year over year", "Customer NPS at 72"])
)
bullets.style = "list"
```

---

### Lists and presets (block-level intent)

Use `style` to express list intent without micromanaging bullets:

```python
all_items = shape.text.get(shape.text.to_string())
all_items.style = "numberedList"
```

---

### Links

```python
dashboard = shape.text.get("incident dashboard")
dashboard.link = { "uri": "https://example.internal/incidents", "is_external": True }
dashboard.underline = "single"
```

---

### Append / replace

Append paragraphs:

```python
shape.text.add("Key initiatives")
shape.text.add(["Launch AI assistant", "Expand EAP customers"])
```

Replace by literal text:

```python
shape.text.replace("Old bullet 1", "New bullet 1")
```

Range-level replace / insertion:

```python
plan = shape.text.get("Plan")
plan.replace("Execution Plan")

heading = shape.text.get("Q2 Execution Plan")
heading.insert_after(" – draft").italic = True
```

---

### Shape-level defaults + layout controls

`shape.text` is also the “frame” for paragraph defaults and layout controls:

```python
shape.text.font_size = 28
shape.text.bold = True
shape.text.alignment = "center"
shape.text.color = "accent1"
shape.text.style = "title"

shape.text.auto_fit = "shrinkText"
shape.text.vertical_alignment = "middle"
```

---

### Text.create (off-canvas authoring)

```python
from presentation_artifact_tool import Text

block = Text.create(["Quarterly Business Review", "Q2 Execution Plan"])
block.get("Quarterly Business Review").style = "title"
block.get("Quarterly Business Review").bold = True

shape.text = block
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
