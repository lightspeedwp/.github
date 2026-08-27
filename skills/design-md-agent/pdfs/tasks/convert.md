# Task: Convert into/out of PDF (DOCX/PPTX/HTML/Markdown)

This is the "escape hatch" when PDF libraries are the wrong abstraction.

## DOCX/PPTX/ODT -> PDF (LibreOffice)

```bash
python /home/oai/skills/pdfs/scripts/lo_convert_to_pdf.py input.docx --out_dir /mnt/data/out
```

Success criteria:

- Output PDF exists and is non-empty
- `pdf_inspect.py ...` can read it and reports a non-zero page count
- Renders look correct (no missing fonts, cut-off tables)

Tips:

- LibreOffice conversion is generally best for Office-native layouts (tables, rich text, headers/footers).
- Headless conversion can occasionally emit noisy stderr or return non-zero while still producing output; the helper script treats "output exists + readable" as success.
- Always render the resulting PDF to PNGs to check for subtle layout differences.

## HTML -> PDF (Playwright + Chromium)

```bash
python /home/oai/skills/pdfs/scripts/html_to_pdf.py input.html -o /mnt/data/out.pdf --format letter
```

Useful when:

- You want a modern template-driven report with CSS.
- You have HTML already (scraped pages, generated HTML).

## Markdown -> PDF (Pandoc)

```bash
python /home/oai/skills/pdfs/scripts/md_to_pdf.py input.md -o /mnt/data/out.pdf --pdf_engine xelatex
```

## LaTeX -> PDF

```bash
python /home/oai/skills/pdfs/scripts/latex_to_pdf.py input.tex -o /mnt/data/out.pdf
```

If you are generating a complex report, LaTeX is often the most predictable way to get a professional PDF.
