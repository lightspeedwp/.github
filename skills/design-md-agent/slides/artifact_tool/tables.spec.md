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

### Position, merges, and styles

```python
table = slide.tables.add({
  "rows": 3,
  "columns": 3,
  "left": 80,
  "top": 140,
  "width": 520,
  "height": 200,
  "values": [
    ["Metric", "North", "EMEA"],
    ["Bookings", 125, 98],
  ],
})

table.merge({ "start_row": 0, "end_row": 0, "start_column": 0, "end_column": 2 })
table.style = "TableStyleMedium9"

table.frame  # { left, top, width, height } | None
```

### Setting table styles like text alignment, borders, column/row widths, cell styles, and more

Setting column widths: `summary_table.set_column_widths([172, 135, 110])`
Setting cell text styling like color, alignment or fill:

```
header_cell = summary_table.cells.get(0, column)
header_cell.fill = "#1f4e79"
header_cell.text.bold = True
header_cell.text.color = "#ffffff"
header_cell.text.alignment = "center"
```

Setting the position of the table in the slide: `rtl_table.position = BoundingBoxRect(left=56, top=392, width=392, height=188)`
Setting preset styles to the table: `table.style = "TableStyleMedium9"`
Setting table borders:

```
rtl_table.borders = {
  "outside": {"width": 1, "fill": "#5e35b1"},
  "inside": {"width": 0.75, "fill": "#8d6e63"},
}
```

Getting header rows:
`header_row = detail_table.cells.block({"row": 1, "column": 0, "row_count": 1, "column_count": 3})`
