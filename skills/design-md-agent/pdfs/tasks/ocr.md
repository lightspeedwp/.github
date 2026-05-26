# OCR scanned PDFs (make them searchable)

Use this when the PDF is image-only (scan), and text extraction returns little or nothing.

---

## Golden path (ocrmypdf)

```bash
python -m pip install ocrmypdf
python /home/oai/skills/pdfs/scripts/ocr_pdf.py scanned.pdf -o searchable.pdf --lang eng
```

Defaults (safe in this runtime):

- `--skip-text` (won't re-OCR PDFs that already contain text)
- `--deskew` (on)
- `--optimize 1` (higher levels depend on extra system binaries that are not available here)

If you *must* run without `ocrmypdf`, use the explicit fallback pipeline:

```bash
python /home/oai/skills/pdfs/scripts/ocr_pdf.py scanned.pdf -o searchable.pdf --lang eng --fallback
```

Verify:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py searchable.pdf --out_dir /mnt/data/_renders/ocr --pages 1
python /home/oai/skills/pdfs/scripts/pdf_extract.py text searchable.pdf --method pdfplumber --out /mnt/data/_tmp/text.txt
```

If it still doesn't extract well:

- try `--force` to OCR anyway
- increase DPI by pre-rendering and using different OCR pipeline (rare)
