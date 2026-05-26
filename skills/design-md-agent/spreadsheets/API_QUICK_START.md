# Using artifact_tool APIs

## Build Rules

- Prefer block writes (`range.values`, `range.formulas`) over per-cell loops. When setting, ensure matrix size matches, for example: `.get_range("D4:M4").values =` should be set to a 1x10 matrix (row x column)
- Seed formula once, then `fill_down` / `fill_right`.
- Key casing:
  - methods are snake_case, dict payload keys often camelCase; use keys shown by `workbook.help(...)` examples
  - keep key style consistent inside each payload object
- Date handling:
  - prefer real dates for sortable/charted/formula date columns, with date formats applied (e.g. `yyyy-mm-dd`)
- Keep scripts modular; avoid huge monolithic calls.
- Use JSON-serializable values only: `str | int | float | bool | None | datetime`.
- Verify with `workbook.inspect(...)`; discover with `workbook.help(...)`.
- When adding or moving charts, do not cover existing data. Just set position via `chart.set_position(target, end)`

## Conventions

- Cell/range addressing: A1 notation (`sheet.get_range("A1:C10")`).
- Drawing anchors (`sheet.charts`, `sheet.shapes`): 0-based `{row, col}`.
- Drawing offsets/extents use pixels (`row_offset_px`, `col_offset_px`, `width_px`, `height_px`).

## Discovery Policy (Strict)

- Use this prompt's quick API + examples first.
- Use `help()` only when blocked by uncertainty.
- For help, start with exact feature/path queries (`chart`, `worksheet.freeze_panes`, `range.data_validation`, `chart.series.add`). If exact path fails, one broader wildcard search is allowed.
- Do not repeat semantically similar help queries.
- If one help query returns 0 matches, reformulate once, then proceed best-effort.
- Only render when needed for visual verification.

Useful help calls:

```python
print(wb.help("shape.add", {"include": "examples,notes"}).ndjson)
print(wb.help("*", {"search": "fill|borders|autofit", "include": "index,examples,notes", "max_chars": 6000}).ndjson)
```

## Known Gotchas (Do Not Repeat)

- Do not set undocumented attributes on remote objects.
- `Workbook.create()` may have no active sheet; add one first.
- Do not call `wb.worksheets.get_active_worksheet()` on brand-new workbook before a sheet exists.
- If multiple tables are added, always set explicit unique names (`TasksTable`, `SummaryTable`).
- If a formula appears unsupported (e.g. `AVERAGEIFS`), use `SUMIFS/COUNTIFS` equivalent.

## Quick API Surface (High-Value + Common)

### Core workbook/file APIs

- `from artifact_tool import Blob, Workbook, SpreadsheetFile`
- `wb = Workbook.create()` + `sheet = wb.worksheets.add("Sheet1")`
- `wb = SpreadsheetFile.import_xlsx(Blob.load("/mnt/data/input.xlsx"))`
- `SpreadsheetFile.export_xlsx(wb).save("/mnt/data/output.xlsx")`
- `wb.inspect({...})` where inspect options, `sheet_id` + `range` are the canonical scoped fields in the generated inspect options.
- `wb.help(query, {...})` (for obscure/unclear features)
- Preferred: `wb.render({...})` which just returns the image bytes directly
- `wb.render({...}).save("/mnt/data/preview.png")` only if you want to save it to a file
- `wb.from_csv(csv_text, {...})` (good for large tabular imports)

### Worksheet selection/creation

- `wb.worksheets.add(name)`
- `wb.worksheets.get_item(name)`
- `wb.worksheets.get_or_add(name, {"renameFirstIfOnlyNewSpreadsheet": True})`
- `wb.worksheets.get_item_at(index)`
- `wb.worksheets.get_active_worksheet()` (only after a sheet exists)

### Worksheet operations

- `sheet.get_range("A1:C10")`, `sheet.get_range_by_indexes(start_row, start_col, row_count, col_count)`, `sheet.get_cell(r, c)`
- `sheet.merge_cells("A1:C1")`, `sheet.unmerge_cells("A1:C1")`
- `sheet.freeze_panes.freeze_rows(1)`, `freeze_columns(2)`, `unfreeze()`
- `sheet.tables`, `sheet.charts`, `sheet.sparklines`, `sheet.shapes`, `sheet.images`

### Range values/formulas

- `rng = sheet.get_range("A1:C10")`
- `rng.values = [[...], ...]` 2D matrix of values
- `rng.formulas = [["=..."], ...]` 2D matrix of formulas
- `rng.formulas_r1_c1 = [["=RC[-1]*2"]]`
- `rng.write(matrix_or_rows)` (auto-sizes write region)
- `rng.write_values(matrix_or_rows)` (explicit values write)
- `rng.fill_down()`, `rng.fill_right()` Use fill to apply a formula across a range
  - `sheet.get_range("D2:D2").formulas = [["=..."]]` + `sheet.get_range("D2:D200").fill_down()`
- `rng.clear({...})`
- `rng.copy_from(source_rng, "values" | "formulas" | "all")`
- `rng.copy_to(dest_rng, "values" | "formulas" | "all")`
- `rng.offset(...)`, `rng.resize(...)`, `rng.get_current_region()`, `rng.get_row(i)`, `rng.get_column(j)`

### Formatting

- `rng.format` supports `fill`, `font`, `number_format`, `borders`, alignments, `wrap_text`
- `rng.format.autofit_columns()`, `rng.format.autofit_rows()`
- `rng.format.column_width = 18`, `rng.format.row_height = 24`
- `rng.format.column_width_px = 120`, `rng.format.row_height_px = 24`
- `rng.set_number_format("yyyy-mm-dd")`
- `rng.format.number_format = [["0"], ["0.00"], ["@"]]`

### Validation + conditional formatting

- `rng.data_validation = {"rule": {"type": "list", "formula1": <formula pointing to categories list>}}`
- `rng.data_validation = {"rule": {"type": "list", "values": ["Not Started", "In progress"]}}`
- `rng.conditional_formats.add(type, config)`
- `rng.conditional_formats.add_custom(formula, format)`
- `rng.conditional_formats.add_cell_is({...})`
- `rng.conditional_formats.add_data_bar({...})`
- `rng.conditional_formats.add_color_scale({...})`
- `rng.conditional_formats.delete_all()`

```python
r = sheet.get_range("B2:B20")
r.conditional_formats.add_cell_is({"operator": "lessThan", "formula": 0, "format": {"font": {"color": "#DC2626"}}})
r.conditional_formats.add_custom("=B2<0", {"fill": "#FECACA"})
r.conditional_formats.add_color_scale({"minColor": "#FEE2E2","midColor": "#FEF3C7","maxColor": "#DCFCE7"})
r.conditional_formats.add_data_bar({"color": "accent5", "gradient": True})
```

### Tables/charts/sparklines

- `table = sheet.tables.add("A1:H200", True, "TasksTable")`
- `table.append_rows([[...], ...])`, `table.get_data_rows()`
- [Preferred/Fastest Chart Path] Creating chart off a range: `chart = sheet.charts.add("line", source_range)`. This auto-creates chart series off the ranges.
- `chart.title_text = "Title"`, `chart.has_legend = True`, `chart.legend.position = "bottom"`
- If you want to set specific chart props: `chart = sheet.charts.add("ColumnClustered", chart_props)`
- Set data source `chart.set_data(source_range)`
- For manually adding a series and formulas: `series = chart.series.add(...)` + `series.category_formula=` + `series.formula=`
- Always set position of chart for all charts: `chart.set_position("F2", "M20")`
- `sheet.charts.get_item_or_null_object("Chart 1")`, `sheet.charts.delete_all()`
- `sheet.sparklines.add({...})`, `sheet.sparklines.clear()`, `sheet.sparklines.delete_all()`
- To update x/y-axis: `chart.x_axis.number_format_code = ""` + `chart2.x_axis.tick_label_interval = 7` + `chart2.x_axis.text_style.rotation = -45` . These help legibility and visibility.

### Help / Grep

Use `workbook.help(...)` primarily for obscure/advanced surfaces (for example deep chart axis settings, unusual drawing configs, pivot APIs, or uncommon option schemas).

- For understanding specific enums: `workbook.help("enum.ShapeGeometry", {"include": "index,notes"}).ndjson`
- For grepping across enums: `workbook.help("enum.*", {"search": "ShapeGeometry|LineStyle", "include": "index"}).ndjson`
- For understanding an interface: `workbook.help("shape.add", {"include": "examples,notes"}).ndjson`
- For grepping features: `print(workbook.help("*", {"search": "fill|borders|autofit", "include": "index,examples,notes", "max_chars": 6000}).ndjson`

### Inspect for workbook understanding

- `wb.inspect({"kind": "sheet", "include": "id,name"})` to list sheets
- Common `kind` tokens: `workbook`, `sheet`, `table`, `region`, `match`, `formula`, `thread`, `computedStyle`, `definedName`, `drawing`
- Use scoped `table`/`region` queries instead of broad whole-workbook dumps

### Python example snippet (runnable)

```python
from artifact_tool import RangeFormatConfig, SpreadsheetFile, Workbook

# Creating a workbook and adding sheets with data and basic formatting
workbook = Workbook.create()
sheet = workbook.worksheets.add("ExampleSheet")

sheet = workbook.worksheets.get_item("ExampleSheet")
sheet.get_range("A1:D4").values = [
    ["Name", "Personality Type", "Age", "Birthday"],
    ["John Doe", "Introvert", 30, datetime(1990, 1, 1)],
    ["Jane Smith", "Extrovert", 25, datetime(1995, 2, 15)],
    ["Jim Very Long Name", "Ambivert", 40, datetime(1980, 3, 20)],
]
sheet.get_range("E1").values = [["Score"]]
sheet.get_range("E2").formulas = [["=C2*10"]]  # score is 10 * age
sheet.get_range("E2:E10").fill_down()
header_range = sheet.get_range("A1:E1")

header_format_defaults: RangeFormatConfig = {
    "fill": "#0F766E",
    "font": {"bold": True, "color": "#FFFFFF"},
    "horizontal_alignment": "center",
    "vertical_alignment": "center",
    "row_height": 16,
}

# Styling
header_range.format = header_format_defaults
header_range.format.autofit_columns()
data_range = sheet.get_range("A2:D10")
data_range.format.wrap_text = True

# Format dates properly.
sheet.get_range("D2:D10").format.number_format = "MM/DD/YYYY"

# Conditional formatting
sheet.get_range("C2:C10").conditional_formats.add_data_bar(
    {"color": "#704023", "gradient": True}
)
sheet.get_range("E2:E10").conditional_formats.add_cell_is(
    {"operator": "greaterThan", "formula": 300, "format": {"font": {"color": "#B91C1C"}}}
)
sheet.conditional_formattings.add(
    {
        "range": "B2:B10",
        "rule": {"type": "expression", "formula": '=B2="Introvert"', "format": {"fill": "#FCA5A5"}},
    }
)

# Data validation: Since Personality Type is a dropdown category, let's add data validation
categories_sheet = workbook.worksheets.get_or_add("CategoriesSheet")
categories_sheet.get_range("A1:A4").values = [
    ["Personality Type"], ["Introvert"], ["Extrovert"], ["Ambivert"]
]
sheet.get_range("B2:B10").data_validation = {
    "rule": {"type": "list", "formula1": "CategoriesSheet!$A$2:$A$4"}
}

# Tables: Turn it into a table. If second param has_headers=True, the range must include headers
table = sheet.tables.add(sheet.get_range("A1:E10"), True, "PeopleTable")
# table = sheet.tables.add("A1:E10", True, "PeopleTable")  # also valid
table.get_header_row_range()

# First column still wide since we only auto-fit the first row. Let's expand it
# to a reasonable width.
sheet.get_range("A1:A10").format.column_width = 20

# Going to create charts to the right of the table
sheet.get_range("H1:O1").merge()
sheet.get_range("H1").values = [["Charts"]]
sheet.get_range("H1").format = header_format_defaults

# Adding charts!
chart_props: ChartPropsInput = {
    "title": "Person by Scores",
    "has_legend": True,
    "display_blanks_as": "zero",
}
chart = sheet.charts.add("bar", chart_props)
chart.width = 620
chart.height = 320
chart.bar_options.direction = "column"
chart.bar_options.grouping = "clustered"
sheet_ref = sheet.name.replace("'", "''")
data_end_row = 4  # Keep chart refs to rows with data only.

score_series = chart.series.add("Scores by Person")
score_series.category_formula = f"'{sheet_ref}'!$A$2:$A${data_end_row}"
score_series.formula = f"'{sheet_ref}'!$E$2:$E${data_end_row}"
score_series.values_format_code = "0"
chart.set_position("H2", "O16")

x_axis_config = {
    "axis_type": "textAxis",  # or "dateAxis"
    "title": {"text": "Person", "text_style": {"font_size": 13, "bold": True}},
    "position": "bottom",  # left|top|right|bottom
    "text_style": {"font_size": 10},
    "line": {"fill": "background2", "style": "solid", "width": 1},
}

y_axis_config = {
    "axis_type": "textAxis",
    "title": {"text": "Scores", "text_style": {"font_size": 13, "bold": True}},
    "number_format_code": "0,000",
    "number_format_source_linked": False,
}
chart.x_axis = x_axis_config
chart.y_axis = y_axis_config

# Chart 2 - Preferred/Fastest path
chart2 = sheet.charts.add("line", sheet.get_range("B2:C4"))
chart2.title_text = "Scores by Personality"
chart2.set_position("H20", "O35")

# Sparklines: Add to right of table
sparklines_header = sheet.get_range("F1")
sparklines_header.values = [["Sparklines"]]
sparklines_header.format = header_format_defaults
sparklines_header.format.autofit_columns()
sheet.sparklines.add(  # Potential options are in SparklineConfig
    {
        "type": "column",  # or "line" or "stacked"
        "source_data": sheet.get_range("E2:E10"),
        "target_range": sheet.get_range("F2:F10"),  # Put sparkline in column E
        "series_color": "#AAAAAA",
    }
)
```

Render:

```python
img = workbook.render({"sheet_name": "ExampleSheet", "auto_crop": "all", "scale": 1})
```

Export:

```python
SpreadsheetFile.export_xlsx(workbook).save("/mnt/data/spreadsheet.xlsx")
```
