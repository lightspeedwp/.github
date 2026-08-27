# Batch processing

If you need to run the same operation on many PDFs, prefer a batch pattern with a clean output root.

## Golden paths

### Render a corpus

```bash
python batch_pdf.py render \
  --in_glob "/mnt/data/in/**/*.pdf" \
  --out_root /mnt/data/_renders \
  --dpi 200 --engine pdftoppm
```

### Inspect a corpus (JSON per file)

```bash
python batch_pdf.py inspect \
  --in_glob "/mnt/data/in/**/*.pdf" \
  --out_root /mnt/data/_inspect
```

### Normalize/repair a corpus

```bash
python batch_pdf.py normalize \
  --in_glob "/mnt/data/in/**/*.pdf" \
  --out_root /mnt/data/_normalized
```

## Notes

- Keep outputs separate by operation; avoid overwriting the input corpus.
- After batch edits, spot-check a few files via render + montage:
  - `python render_pdf.py one.pdf --out_dir /mnt/data/_one --dpi 200`
  - `python create_montage.py /mnt/data/_one --out /mnt/data/_one_montage.png`
