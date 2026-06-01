---
title: "Phase 2 Execution Guide — NotebookLM + Glossary"
description: "Step-by-step walkthrough for May 30 content generation"
created_date: "2026-05-30"
file_type: documentation
---

# Phase 2 Execution Guide

**Timeline**: May 30 (ASAP)  
**Deliverables**: NotebookLM briefs + Glossary ✅ + Foundation slides (4)  
**Owner**: Ash Shaw (content transfer to Slides)  
**Effort**: 4–6 hours total

---

## ✅ Completed

- [x] Glossary document created (`wceu-2026/references/glossary.md`)
- [x] NotebookLM sources index ready (`wceu-2026/notebooklm/sources-index.md`, ~60 URLs)
- [x] SLIDES_GENERATION_PROMPT.md available for brief injection

---

## Step 1: Run NotebookLM Session (You)

**Time**: 30 mins setup + 30–60 mins content generation  
**Tool**: <https://www.notebooklm.google.com>

### Prepare

1. Open <https://www.notebooklm.google.com> in a new browser tab
2. Create a new session (give it a title like "WCEU 2026 Slide Briefs")
3. Keep this window open for the next hour

### Load Sources

1. Copy all URLs from `wceu-2026/notebooklm/sources-index.md` (lines 21–129)
2. Paste into NotebookLM's "Add sources" field, one per line
3. Wait for NotebookLM to process (~2–3 minutes)
4. Verify all sources loaded (look for checkmarks/green indicators)

### Add Main Brief

1. Open `wceu-2026/SLIDES_GENERATION_PROMPT.md` in this repository
2. Copy entire contents (all ~2000 words)
3. In NotebookLM, paste as the "Document" or "Main brief" (click "+ Add document")
4. Wait for processing (~1–2 minutes)

### Request Content Generation

Use these prompts in sequence (NotebookLM chat):

**Prompt 1**: "Generate detailed speaker notes and talking points for each of the 24 slides outlined in the main brief. For each slide, provide: (1) key message, (2) 3–5 talking points, (3) timing estimate, (4) suggested transition to next slide."

**Prompt 2**: "For each slide, suggest visual elements: diagrams, flowcharts, before/after comparisons, timelines, or architecture visualizations. Include specifics on what each diagram should show."

**Prompt 3**: "Identify key metrics, statistics, and real-world examples from the LightSpeed repository that support each slide's narrative. Include GitHub links where relevant."

**Prompt 4**: "Review the talk structure and suggest any missing transitions or narrative gaps between slides."

### Export & Organise

1. Copy NotebookLM output to a text editor or Google Doc
2. Organise by slide (Slide 1, Slide 2, etc.)
3. Separate into sections: **Message**, **Talking Points**, **Visuals**, **Metrics**, **Timing**
4. Save locally — you'll reference this while building slides

**Output**: Detailed briefs for slides 3–22 (slides 1, 2, 23, 24 are covered separately below)

---

## Step 2: Create 4 Foundation Slides in Google Slides (You)

**Time**: 1–2 hours  
**Tool**: Google Slides (or your preferred presentation tool)

### Create New Presentation

1. Go to <https://docs.google.com/presentation/>
2. Create new presentation (name: "WCEU 2026 — One .github repo to rule them all")
3. Delete the default title slide (you'll build custom ones)
4. Set up 24 blank slides (Insert > Slide × 24)

### Slide 1: Cover

- **Title**: "One .github repo to rule them all"
- **Subtitle**: "From central governance to installable AI-Ops plugins"
- **Attribution**: "By Ash Shaw"
- **Design**: Dark background, large readable text, center-aligned
- **No footer on cover**

### Slide 2: Speaker Introduction

- **Photo**: Left side (400×500px), your profile photo
- **Bio** (right side):
  - Name: Ash Shaw
  - Role: Founder, LightSpeed
  - Credentials: WordPress contributor, speaker, designer, traveller
  - Add 1–2 personality notes
- **Design**: Photo on dark background, text off-white, clean layout
- **Footer**: Add footer (slide number + "WordCamp Europe 2026")

### Slide 23: Contact Details

- **Title**: "Get in touch"
- **Details** (formatted cleanly):
  - Email: <ashley@lightspeedwp.agency>
  - Website: lightspeedwp.agency
  - GitHub: github.com/lightspeedwp
  - LinkedIn: [your URL]
- **Design**: Dark background, easy-to-read layout
- **Footer**: Slide number + "WordCamp Europe 2026"

### Slide 24: Thank You

- **Title**: "Thank you"
- **Subtitle**: "WordCamp Europe 2026"
- **Optional**: Add a visual element (logo, simple graphic)
- **Design**: Dark background, minimal, elegant
- **Footer**: None needed (closing slide)

### Save

- Name: "WCEU 2026 — One .github repo to rule them all"
- Share link: Save the link for Phase 3

---

## Step 3: Optional — Prepare Design System Template (You)

Before moving to Phase 3 (which has a tight deadline), establish your dark-mode design standards:

### Colour Palette

- **Background**: #1a1a1a (dark charcoal) or #0a0a0a (near-black)
- **Text (primary)**: #f5f5f5 (off-white) or #ffffff
- **Accent 1** (emphasis): #00d4ff (electric blue)
- **Accent 2** (secondary): #00bfa5 (teal)
- **Accent 3** (highlights): #00ff88 (vibrant green)
- **Accent 4** (callouts): #ffb700 (soft gold)

### Typography

- **Headings**: Bold, 44–54pt, off-white
- **Body text**: Regular, 28–32pt, off-white
- **Captions**: Regular, 20–24pt, soft gold or teal

### Layout

- **Margins**: 1 inch on all sides
- **Line spacing**: 1.5× for readability on dark background
- **Alignment**: Left-aligned body text, centre-aligned titles
- **Bullets**: Use 3–5 max per slide (visual breathing room)

### Accessibility Check

- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify all text meets WCAG AA (4.5:1) — most dark/light pairs will pass
- Test with colorblind-friendly palette

---

## Next: Phase 3 Prep (May 31)

Once NotebookLM briefs are ready and foundation slides are in place:

1. **Content transfer**: Add slides 3–22 using NotebookLM briefs
2. **Design pass**: Apply dark-mode template to all slides
3. **Speaker notes**: Add timing, talking points, transitions to each slide
4. **WordPress reference**: Add to roadmap slide
5. **Accessibility audit**: Verify contrast, readability, navigation
6. **Final review**: Check consistency, polish, and readiness for rehearsal

---

**Phase 2 Checkpoint**: By end of May 30, you should have:

- ✅ NotebookLM briefs for slides 3–22 (exported and organised)
- ✅ Glossary document (created in repo)
- ✅ 4 foundation slides in Google Slides (cover, intro, contact, thank you)
- ✅ Dark-mode design system sketched out
- ✅ Google Slides link ready for Phase 3

Once these are complete, Phase 3 (final polish + speaker notes) can begin immediately on May 31.
