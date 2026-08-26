# Edit PDFs (merge/split/select/extract/rotate/crop/watermark/paginate/encrypt/repair)

Principle: **every edit must be visually verified**.

After any operation below:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py out.pdf --out_dir /mnt/data/_renders/out --pages 1
open /mnt/data/_renders/out/page-1.png
```

---

## Merge

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py merge a.pdf b.pdf -o merged.pdf
```

Success criteria:

- `merged.pdf` exists and `pdf_inspect.py merged.pdf` shows expected page count
- Render a couple pages; no missing/blank pages

---

## Split to single-page PDFs

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py split input.pdf --out_dir /mnt/data/_tmp/split
```

---

## Select pages into a new PDF

Pages spec supports: `1`, `1-3`, `1,3,5-7`.

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py select input.pdf --pages "1-3,7" -o subset.pdf
```

---

## Extract multiple ranges into separate PDFs

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py extract input.pdf --ranges "1-2,5-7" --out_dir /mnt/data/_tmp/ranges
```

---

## Rotate pages

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py rotate input.pdf --angle 90 --pages all -o rotated.pdf
```

Notes:

- Rotation is visual; also re-check extracted text if downstream consumers care.

---

## Crop pages

Two common modes:

1) Inset the current box (trim margins):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py crop input.pdf --pages 1-5 --inset "0.25in" -o cropped.pdf
```

1) Set an explicit crop box (points, origin bottom-left):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py crop input.pdf --pages 1 --box "36,36,576,756" -o cropped.pdf
```

---

## Watermark / stamp

Create a simple watermark PDF:

```bash
python /home/oai/skills/pdfs/scripts/make_watermark_pdf.py --text "CONFIDENTIAL" --out /mnt/data/_tmp/watermark.pdf
```

Apply it to every page:

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py watermark input.pdf --watermark /mnt/data/_tmp/watermark.pdf -o watermarked.pdf
```

---

## Page numbering (paginate)

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py paginate input.pdf -o numbered.pdf --start 1 --position br --font_size 10
```

Positions: `br`, `bc`, `bl`, `tr`, `tc`, `tl`.

---

## Encrypt / decrypt

Encrypt (user password required to open):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py encrypt input.pdf -o encrypted.pdf --user-pass "open" --owner-pass "owner"
```

Decrypt (remove password):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py decrypt encrypted.pdf -o decrypted.pdf --password "open"
```

---

## Repair / optimize

Repair corrupted/odd PDFs (round-trip rewrite via PyMuPDF):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py repair input.pdf -o repaired.pdf
```

Optimize to reduce size / clean structure (best-effort):

```bash
python /home/oai/skills/pdfs/scripts/pdf_edit.py optimize input.pdf -o optimized.pdf
```

---

## Form filling

If you *must* fill AcroForm fields and have them look correct across viewers:

- Prefer **pdf-lib fill + flatten** (see `tasks/forms_annotations.md`).
- `pdf_edit.py fill-form` exists for quick debugging, but is not as reliable.
