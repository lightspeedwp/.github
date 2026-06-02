---
file_type: documentation
title: WCEU 2026 Main Talk — Visual Design Specifications
date: 2026-05-31
description: Complete visual design guide for 24-slide presentation, including design system, layout specifications, accessibility compliance, and implementation notes
version: "1.0.1"
last_updated: "2026-06-01"
owners: ["Ashley Shaw"]
tags: ["wceu-2026", "design", "visual-system", "accessibility"]
status: active
stability: "stable"
domain: generic
language: "en"
---

# Visual Design Specifications — WCEU 2026 WordCamp Talk

## Design System

### Dark Mode Colour Palette

| Colour | Hex | Purpose | WCAG Contrast (on #1a1a1a) |
|--------|-----|---------|---------------------------|
| Background | `#1a1a1a` | Primary slide background | — |
| Primary Text | `#f5f5f5` | Body text, standard content | 5.4:1 ✓ AA+ |
| Electric Blue | `#00d4ff` | Primary accent, headlines, emphasis | 5.8:1 ✓ AA+ |
| Teal | `#00bfa5` | Secondary accent, connections, spokes | 4.9:1 ✓ AA |
| Green | `#00ff88` | Success, positive outcomes, completion | 6.4:1 ✓ AA+ |
| Gold | `#ffb700` | Highlight, important metrics, calls-to-action | 5.2:1 ✓ AA+ |
| Red | `#ff6b6b` | Warning, problems, pre-state | 3.2:1 (icons only) |
| Grey | `#949494` | Secondary text, timestamps, captions | 4.2:1 ✓ AA |

**Contrast Validation:** All text meets WCAG AA minimum (≥4.5:1 for most text; grey secondary text at 4.2:1 meets AA for large text). This ensures secondary text remains readable on projectors and in various lighting conditions.

### Typography

| Element | Font | Size | Weight | Line Height | Notes |
|---------|------|------|--------|------------|-------|
| Slide Title | Inter | 44–56pt | Semi Bold | 1.2x | Main headline per slide |
| Section Headline | Inter | 28–40pt | Semi Bold | 1.3x | Subsections, key concepts |
| Body Text | Inter | 18–24pt | Regular | 1.5x | Primary content, talking points |
| Supporting Text | Inter | 14–20pt | Regular | 1.5x | Context, descriptions, details |
| Footer | Inter | 28pt | Regular | 1.2x | "Slide X \| WordCamp Europe 2026 \| Topic" |
| Captions | Inter | 16–20pt | Regular | 1.5x | Image captions, annotations |

**Line Height Standard:** 1.5x minimum for all body text (readability on-screen and in print).

### Spacing & Layout

- **Margins:** 1-inch (72px) on all sides
- **Column Gap:** 10% of slide width (for two-column layouts)
- **Element Spacing:** 15–20px between stacked elements
- **Grid:** 40px base grid for alignment
- **Max Width:** 1280px (assuming 16:9 aspect ratio)

### Accessibility Standards (WCAG 2.2 AA)

✓ **Contrast:** All text ≥4.5:1 on primary backgrounds
✓ **Font Size:** Body text 18–24pt (4.5:1 contrast validated), titles ≥44pt
✓ **Line Height:** 1.5x minimum
✓ **Colour Alone:** Never use colour as sole identifier (always pair with text/icon)
✓ **Motion:** No auto-playing animations; animations <3 seconds if present
✓ **Keyboard Navigation:** All interactive elements keyboard-accessible
✓ **Alt Text:** All images have descriptive alt text
✓ **Captions:** Video/audio content captioned (if used)

---

## Slide-by-Slide Specifications

### Slide 1: Title Slide

**Layout:** Minimalist, centred, full-bleed dark background

**Content:**

- Title (56pt): ".github Repository Automation"
- Subtitle (32pt): "Scaling Governance Across 50+ WordPress Repositories"
- Speaker name + conference (18pt): "Ash Shaw | WordCamp Europe 2026"
- No footer on title slide

**Visual Notes:**

- Background: Full #1a1a1a, no decorative elements
- Text: Centre-aligned vertically and horizontally
- Spacing: 40–60px between title and subtitle, subtitle and speaker info
- Colour: Title + subtitle in #f5f5f5, speaker name in #00d4ff

**Speaker Notes:** Welcome + 30-second overview of topic

---

### Slide 2: Speaker Intro

**Layout:** Two-column (40% photo, 60% bio text)

**Left Column:**

- Profile photo placeholder (400×500px)
- Positioned top-left with 1-inch margin
- Border: 2px #00d4ff

**Right Column:**

- Title: "Ash Shaw" (28pt, #00d4ff)
- Role: "LightSpeed WordPress" (20pt, #f5f5f5)
- Bio (18pt, #f5f5f5, 1.5x line height):
  - Credentials: founding member, 10+ years WordPress, governance architect
  - Teams led: 50+ repositories, 25+ plugins
  - Focus: automation, standardisation, scaling
- Social/links (14pt, #00d4ff): <ashley@lightspeedwp.agency>

**Footer:** "Slide 2 | WordCamp Europe 2026"

---

### Slide 3: The Problem — Governance Boundaries

**Layout:** 40% illustration (left), 60% text (right)

**Left Side:**

- Visual: 5–7 overlapping boxes (repositories) in grey, with dashed red lines showing broken connections
- Central warning icon (#ff6b6b)
- No text labels on illustration

**Right Side:**

- Headline (32pt, #ff6b6b): "Multiple Governance Sources"
- Subheading (28pt, #f5f5f5): "One repo, infinite rule sets"
- Bullet list (20pt, #f5f5f5, max 4 bullets):
  - Each repo owns its labels, workflows, templates
  - Rules drift across 50+ repos in months
  - New contributors see 50+ different implementations
  - Cross-repo automation fails without unified source
- Impact box: "80% dev time wasted on governance inconsistency" (#ff6b6b border, 24pt italic)

**Footer:** "Slide 3 | WordCamp Europe 2026 | The Problem"

---

### Slide 4: The Solution — Hub-and-Spoke Architecture

**Layout:** Centre-aligned diagram (hub + spokes) with principle box (top-right)

**Diagram:**

- Hub (centre circle): #00d4ff border (3px), labelled ".github"
- Spokes (8–10 radiating lines): #00bfa5 teal
- Spoke circles (smaller): labelled "WordPress Plugin A", "WordPress Plugin B", etc.
- Green checkmarks (#00ff88) on each spoke showing synchronised state
- Bi-directional arrows showing rule distribution

**Top-Right Box:**

- Background: rgba(0, 212, 255, 0.1)
- Border: 1px #00d4ff
- Text (20pt, #00d4ff): "One source of truth. Infinite spokes."

**Bottom Section:**

- 3 boxes in a row: Labels, Workflows, Templates
- Green arrows showing flow from hub → spokes

**Footer:** "Slide 4 | WordCamp Europe 2026 | The Solution"

---

### Slide 5: Hub Architecture — Layers

**Layout:** 40% layer diagram (left), 60% descriptions (right)

**Left Side (Stacked Layers):**

- 4 horizontal boxes, each 100px tall, 200px wide:
  1. Governance Rules (#00d4ff, 0.15 opacity)
  2. Portable Agentic Workflows (#ffb700, 0.15 opacity)
  3. Plugin Infrastructure (#00ff88, 0.15 opacity)
  4. GitHub Integration (#00bfa5, 0.15 opacity)
- Connecting arrows (2px teal) between layers
- Icons for each layer

**Right Side (Text):**

- Headline (44pt, #00d4ff): "Hub Architecture: 4 Layers"
- 4 sections (one per layer, 20pt #f5f5f5):
  - Layer name (accent colour)
  - 2–3 description points
- Colour-coded by layer

**Footer:** "Slide 5 | WordCamp Europe 2026 | Hub Architecture"

---

### Slides 6–24

*Apply consistent pattern for each:*

1. **Headline:** 40–44pt, Inter Semi Bold, accent colour (varies per slide theme)
2. **Subheading:** 24–28pt, #f5f5f5
3. **Body Text:** 18–20pt, #f5f5f5, 1.5x line height, max 5 bullets
4. **Accent Elements:** Colour-coded boxes, borders, icons (see design system)
5. **Footer:** Standardised format: "Slide X | WordCamp Europe 2026 | Topic"
6. **Spacing:** 1-inch margins, 40px grid alignment, 15–20px element spacing

---

## Colour Accent Assignment by Section

**Hook (Slides 1–6):**

- Primary: #00d4ff (electric blue)
- Secondary: #00bfa5 (teal)
- Success: #00ff88 (green)

**Architecture (Slides 7–12):**

- Primary: #00d4ff (electric blue)
- Emphasis: #ffb700 (gold)
- Success: #00ff88 (green)

**Implementation (Slides 13–18):**

- Primary: #00d4ff (electric blue)
- Challenge: #ff6b6b (red)
- Success: #00ff88 (green)
- Support: #ffb700 (gold)

**Adoption & Impact (Slides 19–24):**

- Primary: #00d4ff (electric blue)
- Growth: #ffb700 (gold)
- Vision: #00ff88 (green)

---

## Key Visual Elements

### Icons (24×24px Standard)

Use simple, consistent icons for:

- Repositories, forks, merging
- Security, locks, validation
- People, teams, community
- Data, metrics, analytics
- Workflows, automation, gears
- Communication, arrows, connections

**Style:** Monoline, 2px stroke weight, colour-coded by accent

### Diagrams

- **Hub-and-Spoke:** Central circle + radiating spokes, bi-directional arrows
- **Flowcharts:** Boxes with connecting arrows, decision diamonds
- **Timelines:** Horizontal or vertical sequences with milestone markers
- **Comparisons:** Two-column before/after with central arrow or connector

**Diagram Principles:**

- Max 5–7 elements per diagram (avoid clutter)
- Use consistent arrow styles (3px stroke minimum)
- Label all key components
- Maintain visual hierarchy through size and colour

### Data Visualisation

- **Metrics:** Large numbers (40–48pt bold), label below, optional trend indicator
- **Grids:** 2×2 or 3-column layouts for related metrics
- **Percentages:** Use pie/bar charts only if essential; prefer large numbers + context
- **Before/After:** Symmetrical two-column layout with clear labelling

---

## Accessibility Checklist per Slide

- [ ] **Headline readable** at 44pt+ on dark background
- [ ] **Body text readable** at 18pt+ with 1.5x line height
- [ ] **Colour contrast validated** for all text (use WebAIM contrast checker)
- [ ] **No colour-only information** (always pair with text/icon)
- [ ] **Max 5 bullets** per slide (cognitive load)
- [ ] **Icons have alt text** or accompanying labels
- [ ] **Links underlined or clear** (if any interactive elements)
- [ ] **Footer timestamp readable** (28pt minimum)
- [ ] **Animations <3 seconds** or user-triggered
- [ ] **Motion sickness:** No rapid flashing or strobing

---

## Build Notes for Google Slides

1. **Set up master slide:** Dark background (#1a1a1a), footer format, standard margins
2. **Create colour swatches:** Define design system colours in Slides colour palette
3. **Typography:**
   - Inter (or substitute: Roboto, Open Sans)
   - Create text styles for H1/H2/Body/Footer
   - Lock spacing (1.5x line height) in style definitions
4. **Layouts:**
   - Title slide (centred text only)
   - Two-column (45/55 split)
   - Diagram layout (illustration + text)
   - List layout (bullet points)
   - Metrics grid (2×2 or 3-column)
5. **Images:**
   - Profile photo: 400×500px, 2px border
   - Diagrams: 1280×720px SVG (scalable)
   - Icons: 24–48px PNG/SVG
6. **Footer:**
   - Insert as text box on master
   - Format: "Slide {number} | WordCamp Europe 2026 | {topic}"
   - Font: 28pt `#949494`

---

## Print Considerations

If printing to PDF or handouts:

- Dark background will print; confirm PDF settings preserve colour
- Ensure contrast ratios remain valid in greyscale (if printed B&W)
- Consider white background alternative for printed slides
- Slides look best at 1920×1080 (16:9) native resolution

---

## Presentation Tools

**Recommended:** Google Slides (native, collaborative, speaker view)

- Import these specs into Slides master template
- Use speaker notes panel for timing cues
- Enable presenter mode for local timing display

**Alternative:** Figma (for design, then export to Slides)

- Create high-fidelity mockups
- Export as static images or interactive prototype
- Share with stakeholders for review before building slides

---

## Final Quality Gate

Before delivery, validate:

1. **All 24 slides present** with correct numbering
2. **Footer formatting consistent** across all slides
3. **Colour contrast tested** with WebAIM tool
4. **Font sizes verified** (headlines ≥44pt, body ≥18pt)
5. **Speaker notes populated** for all slides
6. **Images/diagrams optimised** for 1920×1080 display
7. **Transitions smooth** (no distracting effects)
8. **Presenter view tested** (timer, notes, slide preview)
9. **PDF export validated** (if backup needed)
10. **Read-aloud test** for accessibility (if available)

---

## Next Steps

1. **Build in Google Slides** using this spec as reference
2. **Apply colour palette** to all elements
3. **Insert placeholder diagrams** and refine visuals
4. **Add speaker notes** (copy from SPEAKER_NOTES_FINAL.md)
5. **Validate accessibility** (colour contrast, font sizes, line height)
6. **Rehearse delivery** (multiple full run-throughs)
7. **Export PDF backup** for offline presentation
8. **Test on presentation computer** (projector, speaker view, timing)
