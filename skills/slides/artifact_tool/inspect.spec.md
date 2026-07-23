## Inspect (Slides)

Use `presentation.inspect()` to generate a **grep-first JSONL snapshot** of a deck.
It’s the fastest way for an agent to understand a user-uploaded PPTX, find the right edit target, and then do precise edits via `presentation.resolve("<id>")`.

The loop is:

- Run `inspect` (small output, anchored IDs)
- `rg`/`grep` locally to find text / placeholders / notes / comments
- Copy an anchor id (`sl/...`, `sh/...`, `tb/...`, `ch/...`, `im/...`, `nt/...`, `th/...`, `tr/...`)
- Edit via the normal JS APIs
- Re-run `inspect` (usually targeted to one slide) to verify

---

### Quick Start

```python
from presentation_artifact_tool import Blob, PresentationFile


presentation = PresentationFile.import_pptx(Blob.load("existing_presentation.pptx"))
result = presentation.inspect({
    "kind": "deck,slide,textbox,shape,table,chart,image,notes,thread",
    "max_chars": 1200,
})
print(result)
```

### Return shape

`inspect` returns an object with both the JSONL and parsing metadata:

```python
result = presentation.inspect({ "kind": "slide,textbox" })

result.ndjson; # string (JSONL)
result.truncated; # boolean
result.metadata.notices
```

`metadata.notices` includes unknown tokens, empty search matches, and truncation.

### Typical JSONL shape

---

## Inspect output: what to grep for

### Anchors you can copy/paste

`inspect` emits IDs you can feed back into `presentation.resolve(id)`:

- **`pr/...`**: deck root
- **`sl/...`**: slide
- **`sh/...`**: shape (collision-proof across slides)
- **`tb/...`**: table
- **`ch/...`**: chart
- **`im/...`**: image
- **`nt/...`**: speaker notes for a slide
- **`th/...`**: comment thread
- **`tr/...`**: text range (when `kind` contains `textrange`)

### Typical JSONL shape

```json
{"kind":"deck","id":"pr/...","name":"Deck"}
{"kind":"slide","id":"sl/...","slide":3,"title":"...","textShapes":4}
{"kind":"textbox","id":"sh/...","slide":3,"name":"Title","placeholder":"title","text":"Market Overview","textPreview":"Market Overview","textChars":15,"textLines":1,"bbox":[80,60,640,90]}
{"kind":"table","id":"tb/...","slide":3,"rows":3,"cols":2,"preview":"Metric | Value","bbox":[80,180,640,200]}
{"kind":"notes","id":"nt/...","slide":3,"text":"Call out APAC growth."}
{"kind":"thread","id":"th/...","slide":3,"target":"sh/...","status":"active","comments":[{"text":"Please update the title."}]}
{"kind":"layout","layoutId":"...","name":"Title Slide","placeholders":[{"name":"title","type":"title","textPreview":"Click to add title"}]}
```

When `text` properties are selected (default for `textbox`), text-bearing records add compact metadata for quick indexing:

- `textPreview: "..."`: one-line snippet with `|` between original lines
- `textChars`: total character count
- `textLines`: total line count

---

## Options and kinds

### `presentation.inspect({ ... })`

- **`kind`**: record-kind selector string; use commas or whitespace (`slide,textbox`, `slide textbox`). Unknown tokens are ignored but reported in `metadata.notices`.
- **`include`**: property selector string; adds properties beyond the kind defaults.
- **`exclude`**: property selector string; removes properties from the output.
- **`search`**: regex filter applied to each JSONL line (case-insensitive).
- **`target`**: `{ id, before_lines?, after_lines? }` to zoom in on a slide/element/thread/notes.
  - `before_lines/after_lines` keep the deck + slide records plus a small window around the first record containing the `id`.
- **`max_chars`**: hard cap; if truncated, the JSONL ends with a notice record: `{"kind":"notice","message":"Truncated: omitted <N> lines. Increase maxChars or narrow target."}`

### Kinds (slides)

- **`textbox`**: shapes with text
- **`shape`**: shapes without text
- **`table`**: table records (rows/cols + preview)
- **`chart`**: chart records
- **`image`**: image records (alt text if present)
- **`notes`**: speaker notes (`kind: "notes"`, `id: "nt/..."`)
- **`thread`**: comment threads (`kind: "thread"`, `id: "th/..."`)
- **`textrange`**: emits `tr/...` anchors for text-bearing elements
- **`layoutList`**: layout records with `layoutId` + placeholder summaries (not resolvable)
- **`deck`**, **`slide`**: root + slide records

### Property selectors (slides)

Common properties: `text`, `textPreview`, `textChars`, `textLines`, `bbox`, `bboxUnit`, `placeholder`, `chartType`, `alt`, `comments`, `rows`, `cols`, `preview`, `layoutId`, `placeholders`, `type`.

Recommended presets:

- **Cheap deck index**: `kind: "deck,slide,textbox,notes,thread"`, `max_chars: 6000`
- **Find placeholders + frames**: `kind: "slide,textbox,shape"`, `max_chars: 12000`
- **Find charts/images**: `kind: "slide,chart,image"`, `max_chars: 12000`
- **Find tables**: `kind: "slide,table"`, `max_chars: 12000`
- **List layouts**: `kind: "layoutList"`, `max_chars: 6000`
- **Surgical edit**: `target: { id: "sl/..." }`, `kind: "slide,textbox,shape,notes,thread"`

---

## Grep recipes (copy/paste)

Write the JSONL snapshot to a file, then use `rg` locally:

```python
snap = presentation.inspect({
    "kind": "deck,slide,textbox,notes,thread",
    "max_chars": 12000,
})
with open("deck.inspect.ndjson", "w") as f:
    f.write(snap.ndjson)
```

```bash
# List slide records (fast deck index)
rg '"kind":"slide"' deck.inspect.ndjson

# Find all placeholder-backed shapes (layout/template placeholders)
rg '"placeholder":' deck.inspect.ndjson

# Common placeholder kinds
rg '"placeholder":"title"' deck.inspect.ndjson
rg '"placeholder":"subtitle"' deck.inspect.ndjson
rg '"placeholder":"body"|"placeholder":"content"' deck.inspect.ndjson
rg '"placeholder":"picture"' deck.inspect.ndjson

# Notes + comments
rg '"kind":"notes"|"id":"nt/' deck.inspect.ndjson
rg '"kind":"thread"|"id":"th/' deck.inspect.ndjson

# Tables + layouts
rg '"kind":"table"' deck.inspect.ndjson
rg '"kind":"layout"' deck.inspect.ndjson

# Find a phrase with local context
rg -n -C 3 "Market Overview|APAC|Roadmap" deck.inspect.ndjson
```

## Cookbook: inspect-first edits by anchor

### A) Inspect + narrow (JS API)

```python
# Print a full-ish snapshot.
presentation.inspect({
    "kind": "deck,slide,textbox,shape,table,notes,thread",
    "max_chars": 12000,
})

# Narrow by search (regex, case-insensitive).
presentation.inspect({
  "kind": "slide,textbox,shape,table,notes,thread",
  "search": "market overview",
  "max_chars": 12000,
})

# Zoom in once you’ve found an anchor.
presentation.inspect({
  "target": {"id": "sl/..."},
  "kind": "slide,textbox,shape,table,notes,thread",
  "max_chars": 12000,
})

# Grab a small window around a specific element.
presentation.inspect({
  "target": {"id": "sh/...", "before_lines": 2, "after_lines": 20},
  "kind": "slide,textbox,shape",
})
```

### B) Make targeted edits by `id`

You can edit by copying an `id` you saw in the inspect output and resolving it.

#### Load a deck and run an initial inspect

Load in the powerpoint file:

```python
from artifact_tool import Blob, PresentationFile

presentation = PresentationFile.import_pptx(Blob.load("filename.pptx"))
snap = presentation.inspect({
    "kind": "deck,slide,textbox,shape,table,notes,thread",
})
print(snap.ndjson)
```

#### Edit shape text (found via `id: "sh/..."`)

```python
# Copy the shape id out of the inspect JSONL.
shape_id = "sh/..."
presentation.resolve(shape_id).text = "New headline"

# Verify by inspecting just the slide.
slide_id = "sl/..."
presentation.inspect({
    "target": {"id": slide_id},
    "kind": "slide,textbox,shape",
})
```

#### Edit chart title (found via `id: "ch/..."`)

```python
slide_id = "sl/..."
chart_id = "ch/..."
presentation.resolve(chart_id).title = "Revenue by Segment (Q1)"

presentation.inspect({
    "target": {"id": slide_id},
    "kind": "slide,chart",
    "search": "Q1",
})
```

#### Edit image alt text (found via `id: "im/..."`)

```python
slide_id = "sl/..."
image_id = "im/..."
presentation.resolve(image_id).alt = "Updated logo"
presentation.inspect({
    "target": {"id": slide_id},
    "kind": "slide,image",
})
```

#### Edit table cells (found via `id: "tb/..."`)

```python
slide_id = "sl/..."
table_id = "tb/..."
table = presentation.resolve(table_id)
table.cells.set(0, 0, "Metric")
table.cells.set(0, 1, "Value")

presentation.inspect({
    "target": {"id": slide_id},
    "kind": "slide,table",
    "search": "Metric",
})
```

---

## Cookbook: speaker notes + comments (threads)

### Find notes + threads in the snapshot

- Notes show up as `kind: "notes"` with an `id: "nt/..."`.
- Threads show up as `kind: "thread"` with `id: "th/..."`.

Run:

```python
presentation.inspect({
    "kind": "notes,thread,textbox",
    "search": "call out|review|TODO",
})
```

### Apply updates by anchor

```python
slide_id = "sl/..."
presentation.comments.set_self({ "display_name": "Deck Bot", "initials": "DB" })

presentation.resolve("nt/...").text = "Updated talk track for this slide."
presentation.resolve("th/...").add_reply("Updated as requested.")

presentation.inspect({
    "target": { "id": slide_id },
    "kind": "notes,thread,textbox",
})
```

---

## Cookbook: layouts, templates, and placeholders

### 1) Fill placeholders on an existing template slide (inspect-first)

Use `inspect` to find placeholder-backed shapes:

- `placeholder: "title"`
- `placeholder: "subtitle"`
- `placeholder: "body"` / `placeholder: "content"`
- `placeholder: "picture"` (often a “drop an image here” frame)

Then edit the specific placeholder shape by `id`:

```python
title_id = "sh/..."
body_id = "sh/..."
presentation.resolve(title_id).text = "Q2 Roadmap"
presentation.resolve(body_id).text = (
    "- Ship feature A\n- Launch feature B\n- Reduce latency by 30%"
)
```

For picture placeholders, use `bbox` from inspect (or `pic.position` after resolve) to grab the frame, then place an image on top:

```python
slide_id = "sl/..."
picture_id = "sh/..."
pic = presentation.resolve(picture_id)
position = pic.position  # from `bbox` / `bbox_unit`
presentation.resolve(slide_id).images.add({
    "blob": Blob.load(image_path),
    "alt": "Banner",
    "position": position,
})
```

### 2) Create new slides from a layout and fill placeholders

If the deck already contains layouts (common in imported PPTX templates), pick one by name:

```python
presentation.inspect({ "kind": "layout_list" })
# Layout records include layout_id if you want slides.add({ "layout_id": "..." }).

layout_names = [layout.name for layout in presentation.layouts.items]
# Choose a layout name from `layout_names`.

slide = presentation.slides.add({ "layout": "Title Slide" })

# If you don't know the placeholder keys, start with:
# slide.placeholders.summary()
slide.placeholders.get_item("title").text = "Executive Summary"
slide.placeholders.get_item("subtitle").text = "Q1 2026 update"

presentation.inspect({
    "target": { "id": "sl/..." },
    "kind": "slide,textbox,shape",
})
```

### 3) Make more slides that match the template (duplicate-first)

When you want the new slide to match a specific existing slide’s design, duplicate it:

```python
template_slide = presentation.resolve("sl/...")
new_slide = template_slide.duplicate()

# Fill placeholders / shapes on the duplicated slide using inspect anchors.
presentation.inspect({
    "target": { "id": "sl/..." },
    "kind": "slide,textbox,shape",
})
```

This approach is often simpler than picking layouts, because it preserves all the original formatting and positioning.

### 4) Use a template deck the user provides (template PPTX → filled output PPTX)

If the user uploads a **separate template PPTX**, treat that deck as your starting point:

- Import the template PPTX
- Run `inspect` to find the slide(s) / placeholders you want to reuse
- Duplicate those slides to create as many as needed
- Fill placeholders and update charts/images/text by `id`

Inspect the template deck and grep for placeholder keys:

```python
from artifact_tool import Presentation

template = Presentation.load(template_proto)

snap = template.inspect({
    "kind": "slide,textbox,shape",
    "max_chars": 12000,
})

with open("template.inspect.ndjson", "w", encoding="utf-8") as f:
    f.write(snap.ndjson)
```

```bash
rg '"placeholder":"title"|"placeholder":"body"|"placeholder":"picture"' template.inspect.ndjson
```

Then duplicate and fill via the normal APIs:

```python
# Pick a template slide by reading its `sl/...` id in the inspect output.
base = template.resolve("sl/...")
slide = base.duplicate()

# Fill via placeholders or by resolving `sh/...` ids from inspect.
slide.placeholders.get_item("title").text = "Customer stories"
slide.placeholders.get_item("body").text = "- Story A\n- Story B\n- Story C"
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
