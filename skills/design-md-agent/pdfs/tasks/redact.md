# Redaction

Real redaction means the underlying text/objects are removed, not just covered by a rectangle.

## Golden path: redact by text

1) (Optional) Inspect first to learn if the PDF is scanned / encrypted:

```bash
python pdf_preflight.py input.pdf
```

1) Redact:

```bash
python pdf_redact.py text input.pdf redacted.pdf --text "TOP SECRET" \
  --ignore_case --whole_word --pages "1-" --fill black
```

1) Verify (required)

- Render and visually inspect:

```bash
python render_pdf.py redacted.pdf --out_dir /mnt/data/_redacted_render --dpi 200
```

- Confirm the sensitive text is gone from extraction:

```bash
pdftotext redacted.pdf - | grep -i "secret" && echo "STILL PRESENT" || echo "OK: not found"
```

## Redact by rectangles (boxes JSON)

If you already have rectangles in PDF coordinates (points), you can redact them directly:

```bash
python pdf_redact.py boxes input.pdf redacted.pdf --boxes_json boxes.json
```

Tip: If the PDF has no form fields and you need precise placement (or redaction boxes),
use the box picker workflow:

- `python box_picker_html.py input.pdf --page 1 --dpi 200 --out_html picker.html`
- open `picker.html`, draw boxes, export JSON

## Notes

- Redaction on scanned/image-only PDFs will not remove the pixels unless you use `--image_mode remove|pixels`.
- Always re-render with at least one engine (`pdftoppm` is the default) and spot check.
