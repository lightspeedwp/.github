# Task: Create a PDF (choose the best pipeline)

PDF creation is easiest when you pick the right authoring tool. You do not have to create a PDF "directly".

## Decision guide

### Use ReportLab when

- You need **fully programmatic layout** (invoices, certificates, labels, generated reports).
- You need precise control over coordinates, page templates, headers/footers.
- You are generating from data (tables, charts, repeating blocks) and can tolerate manual styling work.

### Use LaTeX when

- You need **typesetting quality**, equations, references, long-form documents, or beautiful tables/figures.
- You want predictable pagination and consistency with minimal hand-tuning.

### Use HTML+CSS when

- You want modern layout using **CSS** (grids, flexible spacing) and fast iteration on design.
- You want to reuse an existing HTML template or export a web report.

### Use DOCX or PPTX as an intermediate when

- The output is more "Word-like" (rich text, complex tables, bullets, tracked content) -> DOCX -> PDF.
- The output is slide-like (speaker notes, consistent layouts, charts) -> PPTX -> PDF.

---

## 1) ReportLab (programmatic)

Start from a clean Python script and re-render often.

### Minimal multi-page template

- Use `reportlab.platypus` (`SimpleDocTemplate`, `Paragraph`, `Table`) for flow-based layout.
- Only drop to canvas coordinates for special elements.

After generating:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py report.pdf --out_dir /mnt/data/_renders/report
```

---

## 2) LaTeX -> PDF

This environment has `pdflatex` and `latexmk`.

```bash
python /home/oai/skills/pdfs/scripts/latex_to_pdf.py input.tex -o output.pdf
```

Tips

- Prefer `latexmk -pdf` for multi-pass compilation (references, TOC).
- Keep assets (images) in the same folder or use relative paths.

---

## 3) Markdown -> PDF (Pandoc)

Pandoc is installed.

```bash
python /home/oai/skills/pdfs/scripts/md_to_pdf.py input.md -o output.pdf
```

Tips

- Use `--pdf_engine xelatex` if you need better font/unicode coverage.
- For consistent styling, use a LaTeX template or a reference doc.

---

## 4) HTML -> PDF (Playwright/Chromium)

Chromium and Playwright are installed.

```bash
python /home/oai/skills/pdfs/scripts/html_to_pdf.py input.html -o output.pdf
```

Tips

- Prefer print CSS (`@page`, `break-before`, `break-inside: avoid`, etc.).
- Always render and inspect; HTML-to-PDF can clip or break pagination.

---

## 5) DOCX/PPTX -> PDF (LibreOffice)

LibreOffice (`soffice`) is installed.

```bash
python /home/oai/skills/pdfs/scripts/lo_convert_to_pdf.py input.docx --out_dir /mnt/data/_tmp
```

This can be a better choice for:

- Rich text and nested lists
- Complex tables
- "Business document" styling that is annoying in ReportLab

Related: use the dedicated skills when creating the source file:

- `/home/oai/skills/docs` for DOCX
- `/home/oai/skills/slides` for PPTX

---

## Quality loop

No matter the pipeline:

1) generate PDF
2) render to PNGs
3) inspect for clipping/overlaps/fonts
4) iterate

Finally, delete intermediate artifacts under `/mnt/data/_tmp` and `/mnt/data/_renders`.
