---
title: "Phase 2 Execution Checklist"
description: "Step-by-step checklist for Phase 2 completion with deliverable tracking"
created_date: "2026-05-30"
file_type: documentation
---

# Phase 2 Execution Checklist — May 30, 2026

**Objective**: Generate speaker notes (NotebookLM) + create 4 foundation slides (Google Slides)
**Duration**: 2.5–3 hours total
**Owner**: Ash Shaw

---

## Pre-Phase 2 Verification

- [ ] Time blocked: 2.5–3 hours clear (no interruptions)
- [ ] `wceu-2026/PHASE2_NOTEBOOKLM_PROMPTS.md` read and understood
- [ ] `wceu-2026/PHASE2_EXECUTION.md` available for reference
- [ ] Internet connection stable (NotebookLM + Google Sheets require stable connection)
- [ ] GitHub repo cloned/pulled to latest (`develop` branch)

---

## Part A: NotebookLM Content Generation (~55 minutes)

### Setup (5 min)

- [ ] Open <https://www.notebooklm.google.com> in new browser tab
- [ ] Create new session (title: "WCEU 2026 Slide Briefs")
- [ ] Keep NotebookLM tab open (don't close during generation)

### Load Sources (5–10 min)

- [ ] Open `wceu-2026/notebooklm/sources-index.md` in this repo
- [ ] Copy all URLs from **lines 21–129** (approximately 60 URLs)
- [ ] Paste into NotebookLM "Add sources" field (one per line or paste block)
- [ ] Wait for NotebookLM to process all sources (~2–3 minutes)
- [ ] Verify all sources loaded (green checkmarks visible)

### Add Main Brief (5 min)

- [ ] Open `wceu-2026/SLIDES_GENERATION_PROMPT.md`
- [ ] Copy entire file contents
- [ ] In NotebookLM, click "+ Add document" (or "Add custom file")
- [ ] Paste SLIDES_GENERATION_PROMPT.md as "Main brief"
- [ ] Wait for processing (~1–2 minutes)

### Generate Content (35 min total)

**Timer**: Start clock now

#### Prompt 1: Speaker Notes & Talking Points (10 min)

- [ ] Copy Prompt 1 from `PHASE2_NOTEBOOKLM_PROMPTS.md` (line ~45–65)
- [ ] Paste into NotebookLM chat
- [ ] Wait for generation (NotebookLM usually takes 3–5 minutes)
- [ ] Review output: Should have 24 slide briefs with key messages, talking points, timing, transitions
- [ ] Copy output to text editor (or leave in chat for now)

#### Prompt 2: Visual Elements (10 min)

- [ ] Copy Prompt 2 from `PHASE2_NOTEBOOKLM_PROMPTS.md` (line ~90–115)
- [ ] Paste into NotebookLM chat
- [ ] Wait for generation (3–5 minutes)
- [ ] Review output: Should have visual suggestions for each slide (diagrams, flowcharts, etc.)
- [ ] Copy output to text editor

#### Prompt 3: Metrics & Examples (10 min)

- [ ] Copy Prompt 3 from `PHASE2_NOTEBOOKLM_PROMPTS.md` (line ~145–175)
- [ ] Paste into NotebookLM chat
- [ ] Wait for generation (3–5 minutes)
- [ ] Review output: Should have stats, real-world examples, GitHub links for each slide
- [ ] Copy output to text editor

#### Prompt 4: Narrative Flow (5 min)

- [ ] Copy Prompt 4 from `PHASE2_NOTEBOOKLM_PROMPTS.md` (line ~205–235)
- [ ] Paste into NotebookLM chat
- [ ] Wait for generation (2–3 minutes)
- [ ] Review output: Should identify narrative gaps and suggest transitions
- [ ] Copy output to text editor

### Export & Organize (15 min)

- [ ] Create file: `wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md` (or use template from `PHASE2_NOTEBOOKLM_PROMPTS.md`)
- [ ] Paste all 4 prompt outputs into this file, organized by section
- [ ] Add metadata: generation date, session notes, any observations
- [ ] Save to git (do NOT commit yet—wait until Phase 2 fully complete)
- [ ] Verify file is readable and well-formatted

**End of Part A checkpoint**: All NotebookLM outputs organized in `PHASE2_NOTEBOOKLM_OUTPUT.md` ✓

---

## Part B: Create 4 Foundation Slides in Google Slides (~60–90 minutes)

### Setup Google Slides (2 min)

- [ ] Open <https://docs.google.com/presentation/>
- [ ] Create new presentation (name: "WCEU 2026 — One .github repo to rule them all")
- [ ] Delete default title slide
- [ ] Insert 24 blank slides (Insert > Slide × 24)
- [ ] Save: Google Slides auto-saves, but verify in "File > Versions" that it exists

### Slide 1: Cover/Title (10 min)

- [ ] Title: "One .github repo to rule them all"
- [ ] Subtitle: "From central governance to installable AI-Ops plugins"
- [ ] Attribution: "By Ash Shaw"
- [ ] Design: Dark background (#1a1a1a or similar), white/light text, large readable font (44pt+)
- [ ] Alignment: Center-aligned
- [ ] No footer on cover slide
- [ ] Status: ✓ Complete

### Slide 2: Speaker Introduction (10 min)

- [ ] Left side: Your profile photo (400×500px)
- [ ] Right side:
  - [ ] Name: Ash Shaw
  - [ ] Role: Founder, LightSpeed
  - [ ] Credentials: WordPress contributor, speaker, designer, traveller
  - [ ] 1–2 personality notes (e.g., "Based in [location]", "Passionate about [topic]")
- [ ] Design: Photo on dark background, text off-white, clean layout
- [ ] Footer: "WordCamp Europe 2026" + slide number
- [ ] Status: ✓ Complete

### Slide 23: Contact Details (10 min)

- [ ] Title: "Get in touch"
- [ ] Contact details (formatted cleanly):
  - [ ] Email: <ashley@lightspeedwp.agency>
  - [ ] Website: lightspeedwp.agency
  - [ ] GitHub: github.com/lightspeedwp
  - [ ] LinkedIn: [Your LinkedIn URL]
- [ ] Design: Dark background, easy-to-read layout, consistent typography
- [ ] Footer: "WordCamp Europe 2026" + slide number
- [ ] Status: ✓ Complete

### Slide 24: Thank You/Closing (5 min)

- [ ] Title: "Thank you"
- [ ] Subtitle: "WordCamp Europe 2026"
- [ ] Optional: Add a visual element (LightSpeed logo, simple graphic, or leave minimal)
- [ ] Design: Dark background, minimal, elegant
- [ ] Footer: None (closing slide)
- [ ] Status: ✓ Complete

### Save & Share (5 min)

- [ ] Save document (Ctrl+S or Cmd+S, though Google auto-saves)
- [ ] Copy presentation link: Share button > Copy link
- [ ] Paste link here: **Google Slides URL: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**
- [ ] Share access: Set to "Editor" for self (or "Viewer" for archive)
- [ ] Status: ✓ Complete

**End of Part B checkpoint**: 4 foundation slides created in Google Slides ✓

---

## Part C: Design System Preparation (Optional, ~30 min)

If time permits, establish design standards for Phase 3:

- [ ] **Colour Palette** documented:
  - [ ] Background: #1a1a1a or #0a0a0a
  - [ ] Text (primary): #f5f5f5 or #ffffff
  - [ ] Accent 1: #00d4ff (electric blue)
  - [ ] Accent 2: #00bfa5 (teal)
  - [ ] Accent 3: #00ff88 (vibrant green)
  - [ ] Accent 4: #ffb700 (soft gold)

- [ ] **Typography** documented:
  - [ ] Headings: Bold, 44–54pt, off-white
  - [ ] Body text: Regular, 28–32pt, off-white
  - [ ] Captions: Regular, 20–24pt, soft gold or teal

- [ ] **Layout Standards** documented:
  - [ ] Margins: 1 inch on all sides
  - [ ] Line spacing: 1.5× for readability
  - [ ] Alignment: Left-aligned body, centre-aligned titles
  - [ ] Max bullets: 3–5 per slide

- [ ] **Accessibility Checked**:
  - [ ] Contrast verified with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
  - [ ] All text meets WCAG AA (4.5:1 minimum)
  - [ ] Colour-blind friendly palette checked

**Design system saved to**: `wceu-2026/DESIGN_SYSTEM.md` (optional, but helpful for Phase 3)

---

## Deliverables Summary

By end of Phase 2 (May 30, EOD), you should have:

| Deliverable | File/Location | Status |
|---|---|---|
| NotebookLM briefs (Prompts 1–4) | `wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md` | ✓ |
| Glossary (from Phase 1) | `wceu-2026/references/glossary.md` | ✓ (already exists) |
| 4 foundation slides | Google Slides (link below) | ✓ |
| Dark-mode design system | `wceu-2026/DESIGN_SYSTEM.md` (optional) | ☐ |

**Google Slides Link**: [Paste link here after saving]

---

## Quality Check Before Committing

Before you commit/push, verify:

- [ ] `PHASE2_NOTEBOOKLM_OUTPUT.md` is well-formatted and complete
- [ ] All 4 prompts' outputs are included (speaker notes, visuals, metrics, narrative flow)
- [ ] Google Slides link works and is editable
- [ ] 4 foundation slides (1, 2, 23, 24) have content and are accessible
- [ ] Design system (if created) documents colour, typography, and layout standards
- [ ] No sensitive information in files (credentials, private links, etc.)

---

## Next: Phase 3 Preparation (May 31)

Once Phase 2 is complete:

1. **Phase 3 execution begins May 31 morning**
2. **Duration**: 6–8 hours (content transfer, design, accessibility audit, speaker notes)
3. **Inputs**: NotebookLM briefs + foundation slides + design system
4. **Outputs**: 24 complete, designed slides + speaker notes + final accessibility audit

See `PHASE3_EXECUTION.md` for full Phase 3 guide.

---

## Need Help?

- **NotebookLM troubleshooting**: See "Troubleshooting" section in `PHASE2_NOTEBOOKLM_PROMPTS.md`
- **Google Slides issues**: Refer to `PHASE2_EXECUTION.md` Step 2
- **Design questions**: Check `PHASE2_EXECUTION.md` Step 3
- **Blocked or stuck?**: Reach out before proceeding to Phase 3

---

**Phase 2 Start Time**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Phase 2 End Time**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Total Duration**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Status**: ☐ In Progress / ☐ Complete
