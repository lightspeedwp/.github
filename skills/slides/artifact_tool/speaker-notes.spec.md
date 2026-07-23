## Speaker Notes API

### Overview

Each slide has a `speaker_notes` surface for presenter notes. Notes support the same `Text` model used by shapes:

- simple assignment (`notes.text = "..."`)
- structured runs (`notes.text = [[{ run: "..." }], ...]`)
- paragraph-level editing via `notes.textFrame.paragraphs`

Notes can also be toggled visible/invisible at export time.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
