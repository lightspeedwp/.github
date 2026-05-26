## Speaker Notes API

### Overview

Each slide has a `speaker_notes` surface for presenter notes. Notes support the same `Text` model used by shapes:

- simple assignment (`notes.text = "..."`)
- structured runs (`notes.text = [[{ run: "..." }], ...]`)
- paragraph-level editing via `notes.textFrame.paragraphs`

Notes can also be toggled visible/invisible at export time.

---

### Quick start

```python
notes = slide.speaker_notes

notes.text_frame.set_text("Welcome everyone to the roadmap review.")
paragraph = notes.text_frame.paragraphs.add()
paragraph.add_run("Highlight key wins and upcoming launches.")
```

### Convenience helpers

```python
notes.set_text("One line")
notes.append(["Next point", "Final point"])
notes.clear()
```

### Visibility

```python
notes.set_visible(False)
notes.is_visible()  # boolean
```
