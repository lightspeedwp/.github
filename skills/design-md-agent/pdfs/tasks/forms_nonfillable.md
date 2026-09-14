# Non-fillable forms (stamp text/marks precisely)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this when:

- `python pdf_extract.py forms input.pdf ...` returns `{}` (no AcroForm fields)
- the PDF is a scan / flattened form
- you need pixel-perfect placement

Core idea: **render -> define boxes -> preview overlay -> verify -> apply -> re-render verify**.

---

## Golden path

### 1) Render the target page

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py input.pdf --out_dir /mnt/data/_renders/in --pages 1 --dpi 200
open /mnt/data/_renders/in/page-1.png
```

### 2) Pick rectangles (boxes)

Generate a self-contained HTML you can open in a browser:

```bash
python /home/oai/skills/pdfs/scripts/box_picker_html.py input.pdf --page 1 --dpi 200 --out /mnt/data/box_picker.html
```

Open `box_picker.html`, drag rectangles, then **Export JSON**. Save it as `spec.json`.

The exported `rect` is in **PDF points**, origin **bottom-left**:

```json
{
  "dpi": 200,
  "page": 1,
  "items": [
    {"name": "name", "kind": "text", "rect": [72, 500, 300, 520]},
    {"name": "agree", "kind": "check", "rect": [72, 450, 84, 462]}
  ]
}
```

### 3) Provide values

Create a `values.json` mapping item name -> value:

```json
{
  "name": "Ada Lovelace",
  "agree": true
}
```

### 4) Generate a preview overlay (guides) and inspect

```bash
python /home/oai/skills/pdfs/scripts/place_text_by_boxes.py input.pdf spec.json values.json \
  --out /mnt/data/_tmp/stamped.pdf \
  --preview_pdf /mnt/data/_tmp/preview.pdf

python /home/oai/skills/pdfs/scripts/render_pdf.py /mnt/data/_tmp/preview.pdf --out_dir /mnt/data/_renders/preview --pages 1
open /mnt/data/_renders/preview/page-1.png
```

The preview should show red rectangles/labels (guides) and the stamped content.

### 5) Apply and re-verify

Re-render the final output and confirm:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py /mnt/data/_tmp/stamped.pdf --out_dir /mnt/data/_renders/out --pages 1
open /mnt/data/_renders/out/page-1.png
```

---

## Coordinate conversions

If you ever need to convert image pixel coordinates (top-left origin) to PDF pt (bottom-left):

- `scale = 72 / dpi`
- `x_pt = x_px * scale`
- `y_pt = (img_h_px - y_px) * scale`

`box_picker_html.py` performs this conversion automatically.

---

## Correctness checklist

- [ ] Preview overlay aligns with the intended boxes
- [ ] Text is not clipped (try slightly smaller font or `fit: "shrink_to_fit"`)
- [ ] Checkmarks align with squares
- [ ] Re-rendered final output matches the preview
- [ ] If the PDF uses CropBox trim, confirm you're targeting the correct box (see `tasks/coords.md`)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
