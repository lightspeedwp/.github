# Task: Extract from a PDF (text, layout, tables, images, attachments)

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

## Forms

List fields:

```bash
python /home/oai/skills/pdfs/scripts/pdf_extract.py forms input.pdf
python /home/oai/skills/pdfs/scripts/pdf_extract.py forms input.pdf --include_widgets --out /mnt/data/fields.json
```

Fill fields:

- robust fill + flatten: `tasks/forms_annotations.md` (pdf-lib)
- debugging/introspection: `tasks/forms_debugging.md`
