# Task: Read / review a PDF

## Goal

Read a PDF accurately (including figures/tables/layout), and produce a correct summary or answer questions about it.

## Workflow

### 1) Render to images (always)

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py input.pdf --out_dir /mnt/data/_renders/input
```

- Open the exported PNGs and visually scan every page.
- If the document is long, render a page range first:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py input.pdf --out_dir /mnt/data/_renders/input --pages 1-5
```

### 2) Get a quick structural overview

```bash
python /home/oai/skills/pdfs/scripts/pdf_inspect.py input.pdf
```

Use this to confirm page count, encryption, metadata, and whether the file contains forms/attachments.

### 3) Use text extraction only as a helper

Text extraction is useful for search and quoting, but it is not authoritative.

Quick grep-able text:

```bash
pdftotext input.pdf - | rg -n "keyword" -n
```

Or extract per page with layout awareness:

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py text input.pdf --method pdfplumber --pages 3-4 --out /mnt/data/_tmp/extracted.txt
```

### 4) If the PDF is scanned/image-only, OCR first

Signs:

- `pdftotext` returns nothing useful
- the rendered page looks like a photograph/scan

Then:

```bash
python /home/oai/skills/pdfs/scripts/ocr_pdf.py input.pdf -o /mnt/data/_tmp/input_ocr.pdf
```

Re-render and re-extract after OCR.

## Common review gotchas

- **Tables/figures:** text extractors often drop them or scramble cell order. Use the PNGs.
- **Footnotes / superscripts:** can move around or disappear in plain text.
- **Two-column layouts:** plain text order can interleave columns incorrectly.

If anything feels off, switch to `tasks/extract.md` for more precise extraction options.
