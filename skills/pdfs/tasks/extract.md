# Task: Extract from a PDF (text, layout, tables, images, attachments)

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

## Choose the right tool

**Fast, good defaults**

- **pdfplumber**: text with layout, word/char boxes, basic table extraction.
- **PyMuPDF (fitz)**: very fast text + word boxes + image extraction + rendering.
- **pypdf**: metadata, outlines, page boxes, merge/split/rotate/encrypt, basic form fields.
- **Poppler utils**: rock-solid CLI tools (`pdfinfo`, `pdftotext`, `pdfimages`, `pdfdetach`, `pdffonts`, etc.).
- **pypdfium2**: fast render + text extraction (PDFium).

If the PDF is scanned: OCR first (`tasks/ocr.md`).

---

## Metadata / structure

```bash
python /home/oai/skills/pdfs/scripts/pdf_inspect.py input.pdf --json > /mnt/data/_tmp/info.json
```

For poppler metadata:

```bash
pdfinfo input.pdf
```

---

## Plain text extraction

For quick, lossy text:

```bash
pdftotext input.pdf - > /mnt/data/_tmp/text.txt
```

For configurable extraction:

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py text input.pdf --method pdfplumber --out /mnt/data/_tmp/text.txt
python /home/oai/skills/pdfs/scripts/pdf_extract.py text input.pdf --method pymupdf   --out /mnt/data/_tmp/text_pymupdf.txt
```

Tip: when order matters (multi-column), prefer `pymupdf` blocks/words or `pdfplumber` word boxes over plain text.

---

## Text with coordinates

### Words

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py words input.pdf --method pdfplumber --out /mnt/data/_tmp/words.csv
python /home/oai/skills/pdfs/scripts/pdf_extract.py words input.pdf --method pymupdf   --out /mnt/data/_tmp/words_pymupdf.csv
```

CSV includes: `page, text, x0, top, x1, bottom`.

Coordinate notes:

- `pdfplumber`: origin is **top-left**; `top/bottom` increase downward.
- `PyMuPDF`: origin is **top-left**; `y` increases downward.

### Characters (fine-grained)

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py chars input.pdf --out /mnt/data/_tmp/chars.csv
```

Use chars when you need tight alignment, kerning, or to rebuild table structure.

---

## Tables

### Basic table extraction (pdfplumber)

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py tables input.pdf --out_dir /mnt/data/_tmp/tables
```

This creates per-table CSVs and (optionally) a single XLSX workbook:

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py tables input.pdf --xlsx /mnt/data/_tmp/tables.xlsx
```

Table extraction is heuristic. If results are wrong:

- render the page and visually inspect grid lines
- try a tighter page crop / different page range
- consider OCR for scanned tables

---

## Images

### Extract embedded images (PyMuPDF)

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py images input.pdf --out_dir /mnt/data/_tmp/images
```

### Extract images via Poppler (sometimes better for certain PDFs)

```bash
pdfimages -all input.pdf /mnt/data/_tmp/pdfimages/out
```

---

## Embedded files (attachments)

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py attachments input.pdf --out_dir /mnt/data/_tmp/attachments
```

Poppler alternative:

```bash
pdfdetach -list input.pdf
pdfdetach -saveall -o /mnt/data/_tmp/attachments input.pdf
```

---

## Annotations

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py annotations input.pdf --out /mnt/data/_tmp/annots.json
```

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
