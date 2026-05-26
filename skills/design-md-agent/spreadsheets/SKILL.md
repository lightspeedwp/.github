---
name: spreadsheets
description: "Use this skill when a user requests to create or modify or work with spreadsheets (.xlsx, .xls) to do any of the following:
- Create a new workbook/sheet with proper formulas, cell/number formatting, and structured layout
- Read or analyze tabular data (filter, aggregate, pivot, compute metrics) directly in a sheet
- Modify an existing workbook without breaking existing formulas or references
- Visualize data with in-sheet charts/tables and sensible formatting
- Recalculate/evaluate formulas to update results after changes"

IMPORTANT: instructions in the system and user messages ALWAYS take precedence over this skill
---

# Primary Goal

- Produce a correct, polished spreadsheet artifact quickly that completes the user's request.
- You are judged on layout, readability, style, and correctness.

# Tools + Contract

- Use python library `artifact_tool` workbook APIs only for workbook edits only with PYTHON TOOL.
- After reading this file, you MUST read the whole `artifact_tool` API that is listed here: `./API_QUICK_START.md`
- Do not use `openpyxl`, `pandas`, or alternate spreadsheet libraries.
- Read inputs from `/mnt/data`; write outputs to `/mnt/data`.
- Export final workbook as `.xlsx` unless user asks otherwise.

## Required Imports + Startup

Assume `artifact_tool` exists and is installed. Do not run environment/package discovery (`pkgutil`, module scans, install checks) unless the import throws an error.

Import existing workbook only when needed (user-uploaded/edit-in-place or intentional reload):

```python
from artifact_tool import Blob, SpreadsheetFile
wb = SpreadsheetFile.import_xlsx(Blob.load("/mnt/data/input.xlsx"))
```

Create new workbook:

```python
from artifact_tool import Workbook, SpreadsheetFile
wb = Workbook.create()
sheet = wb.worksheets.add("Inputs")
```

## Continuous Notebook Strategy

- Use one continuous notebook state.
- Reuse in-memory `wb` across Python calls.
- Keep calls focused; split into small coherent steps.
- Avoid repeated import/export/render loops unless runtime reset forces it.
- Do not re-import from disk between every patch step.

# Latency Guardrails (High Priority)

- Start meaningful edits quickly; avoid long upfront API exploration.
- Core APIs are listed in `./API_QUICK_START.md`. You must use that.
- Keep tool-call count low while preserving quality.
- Use `workbook.help(...)` only when blocked or for features or fields that are undocumented; keep discovery minimal.
- Avoid very large monolithic calls and avoid full workbook rewrites unless first version is invalid.
- Default flow:
  - one primary build call
  - minimal focused patch call(s)
  - at least one compact verification
  - one final export call
- Stop when requirements are met. Do not create alternate variants after valid final output.
- Keep verification targeted and efficient (max 3 iterations).

## Fast Path (Default)

1. Setup: import artifact_tool, create workbook/sheets for new files.
2. Build quickly: bulk-write headers/data/formulas; then formatting/validation/conditional formatting; add charts/tables only when needed.
3. Use additional focused calls if helpful for streamed progress.
4. Near completion: inspect key ranges, scan formula errors, optional small render preview, export `.xlsx`.

# Error Recovery

On first error:

1. Read error text.
2. Run one targeted `workbook.help("<exact_api>")` query only if needed.
3. Retry with minimal patch (not full rewrite).
4. Continue from existing workbook state.

Do not loop indefinitely on similar failures.

# Quality Floor (Do Not Skip)

Speed matters, but output quality must meet baseline.

- Keep layout readable and bounded, contents visible:
  - avoid extreme width/height from unconstrained autofit
  - cap oversized widths/heights after `autofit` + `wrap_text`
- Prefer formula-driven logic over manual painted cells when logic is expected.
- Derived values must be formulas (not hardcoded) and legible.
- Use absolute/relative references correctly for fill/copy behavior.
- Do not use magic numbers in formulas; reference cells (e.g. `=H6*(1+$B$3)`).
- Include at least one visual summary for tracker/planning requests when appropriate (KPI block, chart, dashboard area).
- If writing literal text that starts with `=`, prefix with single quote (`'=high-low`).
- Keep workbook structurally valid (e.g., unique table names).

## Formatting Baseline

- If editing an uploaded/template workbook: render first, preserve and match existing style unless user asks to restyle.
- Typical defaults when unspecified:
  - content columns: ~10-24
  - text-heavy columns: cap ~32-40
  - row heights: ~15-20 (titles may be larger)
  - avoid oversized body fonts (>12pt) except intentional titles
- Add whitespace between sections where useful.
- Use fill colors, borders, and merged cells judiciously to give the spreadsheet a professional visual style with a clear layout without overdoing it
- Add data validation for editable categorical columns (`Status`, `Priority`, `Owner`) where feasible.
- Use conditional formatting when useful.
- Unless conflicting style guidelines are provided: style headers, correct number/date formats, sensible column widths, and row heights, light borders.

# Citation Requirements

## Cite sources inside the spreadsheet

- Use plain-text URLs in spreadsheet cells.
- For financial models, cite model-input sources in cell comments.
- For researched row-wise data tables, include source URLs in a dedicated source column.

# Completion Criteria

Complete only when:

- Workbook content is populated and formulas compute.
- No obvious formula errors in key scanned ranges (no bad refs/off-by-one/circular errors).
- `.xlsx` saved to `/mnt/data`.
- Layout is organized, legible, and aligned to request style (or default formatting baseline).
- Final response includes output path + short summary of sheets/ranges created. Do not include rendered preview unless requested.

# Verification Rules

Before final response, verify values/formulas and visual quality.

1. Inspect key ranges:

```python
check = wb.inspect({
  "kind": "table",
  "range": "Dashboard!A1:H20",
  "include": "values,formulas",
  "table_max_rows": 20,
  "table_max_cols": 12,
})
print(check.ndjson)
```

Inspect targeting:

- Prefer sheet-qualified ranges (`"Sheet!A1:H20"`) or `sheet_id`.

1. Scan formula errors:

```python
errors = wb.inspect({
  "kind": "match",
  "search_term": "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  "options": {"use_regex": True, "max_results": 300},
  "summary": "final formula error scan",
})
print(errors.ndjson)
```

1. Render sheets/ranges to verify visual output (skip if already verified and no style changes):

```python
blob = wb.render({"sheet_name": "Sheet1", "range": "A1:H20", "scale": 2})
```

If render is last line in Python call, image can be shown directly.

1. Keep verification compact:

- Inspect only key ranges.
- Avoid huge NDJSON dumps.

1. Export:

```python
SpreadsheetFile.export_xlsx(wb).save("/mnt/data/output.xlsx")
```

1. Finalize immediately after successful export + compact verification.

- Do not export extra `.xlsx` variants.
- Do not keep iterating on alternate designs once requirements are met.

# Additional Instructions

Only when a request relates to any of the following, read the following templates instructions as well:

- Financial modeling or investment banking: `templates/financial_models.md`
