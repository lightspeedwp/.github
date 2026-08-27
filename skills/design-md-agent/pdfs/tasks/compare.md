# Visual regression: compare two PDFs

Use this when:

- you edited a PDF (crop/rotate/watermark/paginate/fill) and need confidence nothing broke
- you suspect a "looks fine in viewer" vs "broken render" issue

---

## Golden path

```bash
python /home/oai/skills/pdfs/scripts/compare_renders.py before.pdf after.pdf \
  --out_dir /mnt/data/_diff \
  --dpi 200 --engine pdfium
```

Outputs:

- `/mnt/data/_diff/summary.json`
- `/mnt/data/_diff/diff/page-<N>.png` for changed pages

Success criteria:

- if you expect a small change (e.g., watermark), only those pages should diff
- if you expect *no* visual change (e.g., metadata-only), there should be 0 changed pages

Tip: if you want a human skim, generate montages:

```bash
python /home/oai/skills/pdfs/scripts/create_montage.py /mnt/data/_diff/render_a --out /mnt/data/_diff/a_montage.png
python /home/oai/skills/pdfs/scripts/create_montage.py /mnt/data/_diff/render_b --out /mnt/data/_diff/b_montage.png
```
