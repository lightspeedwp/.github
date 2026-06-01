## Fill API

### Overview

Most styling surfaces accept a **`FillConfig`**. It’s designed to be easy to generate from JSON:

- Use a **string** for the common case (`"accent1"`, `"background1"`, `"#FF6600"`, `"#11223380"`).
- Use a small **object** for gradients, patterns, or image fills.

You’ll see `FillConfig` in places like:

- `slide.background.fill`
- `shape.fill`
- `shape.line.fill`
- chart styling (`series.fill`, `series.stroke.fill`, `chart.chartFill`, `chart.legend.fill`, …)

---

### FillConfig: string shorthand (solid fill)

Strings create a solid fill:

```python
shape.fill = "accent1"        # theme color
shape.fill = "background2"    # theme alias (bg2)
shape.fill = "#FF6600"        # hex RGB
shape.fill = "#11223380"      # hex RGBA (alpha in last 2 bytes)
shape.fill = "rgba(255,0,0,0.5)"
```

Theme names:

- **Direct scheme names**: `accent1..accent6`, `bg1`, `bg2`, `tx1`, `tx2`, `dk1`, `dk2`, `lt1`, `lt2`, `hlink`, `folHlink`
- **Convenience aliases**: `background1` → `bg1`, `background2` → `bg2`, `text1` → `tx1`, `text2` → `tx2`, `dark1` → `dk1`, `light1` → `lt1`, etc.

---

### FillConfig: solid fill object (optional pattern metadata)

```python
shape.fill = {
  "type": "solid",
  "color": "accent5",
  "pattern": {
    "type": "lightHorizontal",
    "color": "#FFEEAA",
  },
}
```

---

### FillConfig: gradient object

```python
shape.fill = {
  "type": "gradient",
  "gradient_kind": "linear",  # "linear" | "path"
  "angle_deg": 45,
  "stops": [
    { "offset": 0, "color": "accent1" },
    { "offset": 100000, "color": "#336699" },
  ],
}
```

Notes:

- `offset` is forwarded to the underlying proto “position”. Tests commonly use `0` and `100000`.

---

### FillConfig: picture fill object (advanced)

Used mainly when you already have an image asset id and want to reference it as a fill:

```python
shape.fill = {
  "type": "image",
  "image_reference": { "id": "image-42" },
  "alpha_mod_fix": 36000,
}
```

---

### FillConfig: proto hydration

```python
shape.fill = { "type": "proto", "proto": existing_fill_proto }
```

---

## Stroke / line styling

Shapes and many chart parts expose a `line`/`stroke` object:

```python
shape.line.width = 1.5      # px
shape.line.style = "dashed" # "solid" | "dashed" | "dotted" | "dash-dot" | "dash-dot-dot"
shape.line.fill = "accent3"
```

When creating a shape, you can pass a `line` config:

```python
rect = slide.shapes.add({
  "geometry": "rect",
  "position": { "left": 40, "top": 60, "width": 320, "height": 180 },
  "fill": "accent1",
  "line": { "style": "solid", "fill": "accent5" },
})
rect.line.width = 0.5
```
