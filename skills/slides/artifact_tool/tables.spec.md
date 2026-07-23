## Tables API

### Overview

`slide.tables` creates and edits tabular content. Tables are designed to be easy to author from primitive arrays, but also support rich text values (the same structured run format as `shape.text`).

---

### Create a table from a primitive matrix

```python
table = slide.tables.add([
  ["Product", "North", "EMEA"],
  ["ChatGPT", 120, 94],
  ["Whisper", 54, 31],
])

table.get_cell(0, 0).value  # "Product"
table.get_cell(1, 1).value  # "120" (numbers stringify)
```

### Edit cells

```python
table.get_cell(1, 1).value = "APAC"

# Equivalent access via the cells helper:
cell = table.cells.get(1, 1)
cell.value = "APAC"
```

---

### Rich text values in cells

You can assign structured values and then style ranges via `cell.text`.

```python
table = slide.tables.add({ "rows": 2, "columns": 2 })

table.set_values([
  [
    [{ "run": "Inline ", "text_style": { "bold": True } }, "formatting"],
    ["Second column"],
  ],
  [
    ["Numeric ", 2025],
    [[{ "run": "Line 1", "text_style": { "italic": True } }], [{ "run": "Line 2" }]],
  ],
])

bold_range = table.get_cell(0, 0).text.get("Inline ")
bold_range.bold = True
```

You can also set a cell from a detached `Text` block:

```python
from presentation_artifact_tool import Text

table.cells.set(0, 1, Text.create("Detached"))
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
