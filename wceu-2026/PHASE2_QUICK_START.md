---
title: "Phase 2 Quick Start"
description: "One-page reference for Phase 2 execution with links to all tools and templates"
created_date: "2026-05-30"
file_type: documentation
---

# Phase 2 Quick Start — May 30, 2026

**Goal**: Generate NotebookLM speaker briefs + create 4 Google Slides foundation slides
**Duration**: 2.5–3 hours
**Status**: Ready to start

---

## 📋 What You Need

| Resource | Location | Purpose |
|----------|----------|---------|
| **NotebookLM Prompts** | `PHASE2_NOTEBOOKLM_PROMPTS.md` | Pre-formatted prompts (copy-paste ready) |
| **Execution Checklist** | `PHASE2_EXECUTION_CHECKLIST.md` | Step-by-step tracking (check off as you go) |
| **Source URLs** | `notebooklm/sources-index.md` | ~60 GitHub URLs to load into NotebookLM |
| **Slides Brief** | `SLIDES_GENERATION_PROMPT.md` | Main generation brief for NotebookLM |
| **Original Guide** | `PHASE2_EXECUTION.md` | Full reference guide (if you get stuck) |

---

## 🚀 Quick Start (3 Steps)

### Step 1: NotebookLM Session (55 min)

**Open**: <https://www.notebooklm.google.com>

**Do**:

1. Create session "WCEU 2026 Slide Briefs"
2. Load sources from `notebooklm/sources-index.md` (lines 21–129)
3. Add main brief: `SLIDES_GENERATION_PROMPT.md`
4. Run 4 prompts (copy from `PHASE2_NOTEBOOKLM_PROMPTS.md`):
   - Prompt 1: Speaker notes + talking points
   - Prompt 2: Visual suggestions
   - Prompt 3: Metrics + examples + links
   - Prompt 4: Narrative flow assessment
5. Organize output into `PHASE2_NOTEBOOKLM_OUTPUT.md`

**Expected**: Detailed speaker briefs for 24 slides + narrative review

---

### Step 2: Foundation Slides (60–90 min)

**Open**: <https://docs.google.com/presentation/>

**Create**:

- Slide 1: Cover/title (title, subtitle, speaker name, dark design)
- Slide 2: Speaker intro (photo, bio, credentials)
- Slide 23: Contact details (email, website, GitHub, LinkedIn)
- Slide 24: Thank you (minimal closing)
- Plus 20 blank slides (3–22) for Phase 3 content

**Save & Share**: Copy Google Slides URL for Phase 3

**Expected**: 24-slide skeleton with design foundation

---

### Step 3: Design System (30 min optional)

**Create**: `wceu-2026/DESIGN_SYSTEM.md`

**Document**:

- Colour palette (#1a1a1a bg, #00d4ff accents, etc.)
- Typography (44–54pt headings, 28–32pt body)
- Layout standards (1" margins, 1.5× line spacing)
- Accessibility (WCAG AA+ contrast verified)

**Expected**: Design system reference for Phase 3

---

## ✅ Validation

After Phase 2, run:

```bash
bash scripts/validate-phase2-completion.sh
```

This checks:

- NotebookLM output complete (all 4 parts)
- Foundation slides created
- Google Slides accessible
- Markdown formatting valid
- Frontmatter correct

---

## 📁 Deliverables by EOD May 30

| Item | File | Status |
|------|------|--------|
| NotebookLM briefs | `PHASE2_NOTEBOOKLM_OUTPUT.md` | ✓ Required |
| Foundation slides | Google Slides (link) | ✓ Required |
| Design system | `DESIGN_SYSTEM.md` | ☐ Optional |

---

## 🔗 Key Links

- **NotebookLM**: <https://www.notebooklm.google.com>
- **Google Slides**: <https://docs.google.com/presentation/>
- **This repo**: <https://github.com/lightspeedwp/.github/tree/develop/wceu-2026>

---

## ❓ If You Get Stuck

| Problem | Solution |
|---------|----------|
| NotebookLM slow | Refresh page, add sources in batches, wait 2–3 min |
| Output too brief | Ask follow-up questions in NotebookLM chat |
| Can't copy text cleanly | Select all, paste into text editor first, then format |
| Slides not saving | Check File > Versions in Google Slides |

**More help**: See troubleshooting in `PHASE2_NOTEBOOKLM_PROMPTS.md` or full guide in `PHASE2_EXECUTION.md`

---

## ⏱ Timing Breakdown

| Task | Duration |
|------|----------|
| NotebookLM setup | 5 min |
| Load sources | 5–10 min |
| Prompt 1 (notes) | 10 min |
| Prompt 2 (visuals) | 10 min |
| Prompt 3 (metrics) | 10 min |
| Prompt 4 (flow) | 5 min |
| Organize output | 15 min |
| **NotebookLM Total** | **~55 min** |
| Foundation slides | 60–90 min |
| Design system (opt) | 30 min |
| **TOTAL PHASE 2** | **~2.5–3 hours** |

---

## 🎯 Success Criteria

Phase 2 is complete when:

- ✓ `PHASE2_NOTEBOOKLM_OUTPUT.md` created with all 4 prompt outputs
- ✓ 4 foundation slides (1, 2, 23, 24) created in Google Slides
- ✓ Google Slides accessible and saved (link recorded)
- ✓ (Optional) Design system documented
- ✓ No blocking issues for Phase 3 start (May 31)

---

## 📅 What's Next

- **Tonight (May 30)**: Rest, prepare for Phase 3
- **May 31 Morning**: Start Phase 3 (6–8 hours)
  - Transfer NotebookLM briefs to slides
  - Design all 24 slides
  - Final accessibility audit
  - Speaker notes + rehearsal

---

**Phase 2 Start Time**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Ready?** ✓ Let's go!
