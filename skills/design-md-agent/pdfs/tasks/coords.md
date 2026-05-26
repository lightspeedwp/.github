# Coordinates and boxes (PDF vs rendered images)

When placing stamps/annotations or interpreting extraction coordinates, keep these straight.

---

## Coordinate systems

| Space | Origin | Units | Notes |
|---|---|---|---|
| PDF user space | bottom-left | points (pt) | 72 pt = 1 inch |
| Rendered image space | top-left | pixels (px) | depends on DPI |

### Pixel -> PDF points

If you rendered at `dpi` (dots/inch):

- `scale = 72 / dpi`
- `x_pt = x_px * scale`
- `y_pt = (img_h_px - y_px) * scale`

### PDF points -> pixel

- `x_px = x_pt * dpi / 72`
- `y_px = img_h_px - (y_pt * dpi / 72)`

---

## Boxes that affect what you see

PDF pages can have multiple rectangles:

- **MediaBox**: the physical page size
- **CropBox**: what most viewers display (trim)

If a PDF has a CropBox, stamping relative to MediaBox can look "shifted".

Rule of thumb:

- For *visual placement* (stamps/boxes), treat **CropBox** as the visible region.
- For *document size* (page numbering/overlays), MediaBox is fine.

---

## Recommended practice

1) Render the page you care about.
2) Use `box_picker_html.py` to define rects.
3) Use `place_text_by_boxes.py --preview_pdf ...` to validate.
4) Re-render final output.

This keeps the coordinate systems aligned with what a human sees.
