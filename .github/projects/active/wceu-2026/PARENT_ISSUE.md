---
title: "WCEU 2026 Talk Preparation"
description: "Parent issue tracking WCEU 2026 talk preparation work"
created_date: "2026-05-29"
file_type: documentation
---

# WCEU 2026 Talk Preparation — Parent Issue

**Title**: WCEU 2026 Talk Preparation — Finalize 25-Minute Presentation  
**Type**: Epic/Parent Issue  
**Priority**: Critical  
**Status**: Closed (issue [#564](https://github.com/lightspeedwp/.github/issues/564) closed; doc retained for historical trace)  
**Due Date**: May 31, 2026 (48 hours)  
**Talk Date**: June 5–6, 2026  
**Assignee**: Ash Shaw  
**Labels**: `wceu-2026`, `talk-preparation`, `critical-path`

---

## Overview

Centralized tracking for finalizing the WordCamp Europe 2026 presentation on "One .github repo to rule them all: From central governance to installable AI-Ops plugins".

**Talk Format**:

- Duration: 25 minutes
- Audience: 200–500 people (WordPress agencies, product teams, engineers)
- Slides: 24 (dark mode, Google Slides, static)
- Delivery: Theater-style with Q&A + Happiness Bar follow-up
- Recording: VideoPress (available within weeks post-WCEU)

**Current State**:

- ✅ Foundational assets exist (SLIDES_GENERATION_PROMPT, talk outline, 20 slide files)
- ⚠️ Missing: Final slide content (all 24 slides), NotebookLM sources index, profile photo
- ⏰ **Critical constraint**: 48 hours to finalize

---

## Acceptance Criteria

All items must be complete by **May 31, 2026 EOD** for the talk to proceed successfully.

### Slide Deck

- [ ] 24-slide deck finalized in Google Slides (dark mode)
- [ ] All slides follow WCAG AA/AAA contrast requirements
- [ ] Cover slide (slide 1): Title, subtitle, speaker attribution
- [ ] Speaker intro slide (slide 2): Photo + bio (founder, WordPress contributor, speaker, designer, traveller)
- [ ] Content slides (slides 3–22): All finalized with speaker notes
- [ ] Contact slide (slide 23): Name, email, website, GitHub, LinkedIn
- [ ] Thank you slide (slide 24): Simple closing
- [ ] All slides include footer (slide number + "WordCamp Europe 2026")

### Content & Messaging

- [ ] All 24 slides have speaker notes (timing, key points, transitions)
- [ ] Glossary document created (`references/glossary.md`) covering:
  - LightSpeed-specific terms (plugins, manifest, hooks layer, etc.)
  - GitHub basics (Actions, workflows, branches, fork, etc.)
  - AI-ops concepts (agent, skill, automation, etc.)
- [ ] WordPress agent-skills reference in roadmap slide (as Year 1 Vision)
- [ ] Metrics included (80% labeling time savings, 100% consistency across 2 pilot repos)
- [ ] GitHub Actions overview included (no assumption of prior knowledge)
- [ ] Call-to-action clear (read repo → fork → join community → share)

### Assets & Metadata

- [ ] Profile photo committed to `wceu-2026/assets/ash-shaw-profile.jpg`
- [ ] NotebookLM sources index created (`notebooklm/sources-index.md`)
- [ ] WordPress Integration Roadmap created (`WORDPRESS_INTEGRATION_ROADMAP.md`)
- [ ] All source files reference correct GitHub develop-branch URLs

### Design & Accessibility

- [ ] Dark mode applied consistently
- [ ] LightSpeed branding colors used appropriately
- [ ] All text meets WCAG AA contrast ratio (4.5:1 minimum)
- [ ] Visuals: Flowcharts, architecture diagrams, before/after comparisons, timelines
- [ ] No code snippets (conceptual diagrams instead)
- [ ] Static slides only (no animations)

### Documentation

- [ ] `PLANNING.md` finalized (streamlined 48-hour plan)
- [ ] `WORDPRESS_INTEGRATION_ROADMAP.md` finalized (post-WCEU roadmap)
- [ ] All GitHub issues created and linked
- [ ] README.md updated with current status

---

## Detailed Deliverables

| Deliverable | Owner | Status | Notes |
|---|---|---|---|
| Profile photo asset | Ash Shaw | ⏳ Pending | To be committed to `assets/ash-shaw-profile.jpg` |
| NotebookLM sources index | Claude | ⏳ To create | `notebooklm/sources-index.md` |
| Slide content generation | Claude (via NotebookLM) | ⏳ To start | Briefs for all 24 slides |
| Google Slides deck | Ash Shaw | ⏳ In progress | Transfer content + design + speaker notes |
| Glossary document | Claude | ⏳ To create | `references/glossary.md` |
| WordPress roadmap | Claude | ✅ Done | `WORDPRESS_INTEGRATION_ROADMAP.md` |
| Planning document | Claude | ✅ Done | `PLANNING.md` |
| GitHub issues | Claude | ⏳ This issue + children | Parent + child issues |

---

## Child Issues

**NOW (Next 6 hours)**:

- [ ] [WCEU-01] Create NotebookLM sources index
- [ ] [WCEU-02] Commit profile photo to assets

**ASAP (Next 24 hours)**:

- [ ] [WCEU-03] Run NotebookLM session — Generate slide briefs for all 24 slides
- [ ] [WCEU-04] Create glossary document
- [ ] [WCEU-05] Create cover slide (slide 1)
- [ ] [WCEU-06] Create speaker intro slide (slide 2)
- [ ] [WCEU-07] Create contact details slide (slide 23)
- [ ] [WCEU-08] Create thank-you slide (slide 24)

**URGENT (24–48 hours)**:

- [ ] [WCEU-09] Finalize all content slides (slides 3–22)
- [ ] [WCEU-10] Add speaker notes to all 24 slides
- [ ] [WCEU-11] Apply dark-mode design system + verify contrast
- [ ] [WCEU-12] Add WordPress integration reference to roadmap slide
- [ ] [WCEU-13] Final review & polish

---

## Resource Plan

| Role | Owner | Effort | Time Window |
|---|---|---|---|
| **Planning & coordination** | Ash Shaw | 2–3 hours | Ongoing |
| **Content generation** | Claude (NotebookLM) | 4–6 hours | May 29–30 |
| **Design & layout** | Ash Shaw | 4–6 hours | May 30–31 |
| **Speaker notes** | Ash Shaw | 2–3 hours | May 30–31 |
| **Final review** | Ash Shaw | 1–2 hours | May 31 |
| **Total** | — | ~13–20 hours | 48 hours |

---

## Key Design Decisions

From the Q&A with Ash Shaw (May 29):

| Decision | Rationale |
|---|---|
| **Format**: Google Slides | User preference; integrates with team workflow |
| **Mode**: Dark mode | Visually appealing, reduces eye strain in conference room |
| **Tone**: Informative + inspiring + approachable + fun | Engage audience while maintaining credibility |
| **Diagrams**: Flowcharts, architecture, before/after, timelines | Visual storytelling without code examples |
| **Metrics**: 80% time savings, 100% consistency (2 pilot repos) | Concrete evidence of impact |
| **Animations**: None (static slides) | Time constraints, clarity prioritized |
| **Footer**: Slide number + "WordCamp Europe 2026" | Conference branding |
| **WordPress reference**: 1 roadmap slide, Year 1 Vision | Acknowledge WordPress foundation, future direction |

---

## What's NOT Blocking This Issue

**Post-WCEU deliverables** (don't block the talk):

- ❌ 7 agent slide decks (separate resource)
- ❌ Website (awesome-copilot style, ongoing resource)
- ❌ Detailed WordPress integration work (roadmap created now, work begins later)
- ❌ Video editing / distribution plan (VideoPress handles this)
- ❌ Community engagement campaign (post-talk follow-up)

---

## Timeline

```
May 29 (Today)
├─ Create planning documents ✅
├─ Create GitHub issues
├─ Create NotebookLM sources index
└─ Commit profile photo

May 30
├─ Run NotebookLM session
├─ Generate slide briefs
├─ Start Google Slides deck design
└─ Create glossary & 4 new slides

May 31
├─ Finalize all 24 slides
├─ Add speaker notes
├─ Apply design system + verify contrast
├─ Final review & polish
└─ ✅ Deck finalized

Jun 1–4: Rehearsal & adjustments
Jun 5–6: WCEU presentation
```

---

## Success Metrics

By **May 31, 2026 EOD**:

✅ **Deliverable**: Google Slides deck with 24 slides (dark mode, speaker notes)
✅ **Quality**: All slides follow WCAG AA/AAA contrast, use consistent design
✅ **Completeness**: All speaker notes, timing, talking points included
✅ **Readiness**: Deck ready for rehearsal (June 1–4)
✅ **Documentation**: Planning, roadmap, glossary, and issues all complete

---

## Collaboration Model

| Phase | Owner | Tool | Output |
|---|---|---|---|
| Planning | Ash Shaw + Claude | This issue | Approved plan |
| Content Generation | Claude | NotebookLM | Slide briefs |
| Design & Layout | Ash Shaw | Google Slides | Visual deck |
| Review | Ash Shaw | GitHub | Approval |

---

## Related Documents

- **PLANNING.md** — Streamlined 48-hour action plan
- **WORDPRESS_INTEGRATION_ROADMAP.md** — Post-WCEU WordPress integration roadmap
- **SLIDES_GENERATION_PROMPT.md** — Comprehensive slide design guide
- **talk-outline-25min.md** — Talk outline (reference)
- **claudeqanda.md** — Responses to all 32 planning questions

---

## Communication Plan

- **Daily standup**: May 29–31 (Ash Shaw + Claude)
- **Blockers**: Escalate immediately
- **Decisions**: Record in GitHub issues or planning docs
- **Final sign-off**: May 31 EOD (Ash Shaw)

---

## Questions & Support

- **Slide content unclear?** → Reference SLIDES_GENERATION_PROMPT.md
- **Design questions?** → Refer to style-guide.md or PPTX reference
- **WordPress roadmap questions?** → See WORDPRESS_INTEGRATION_ROADMAP.md
- **NotebookLM workflow?** → Use sources-index.md + SLIDES_GENERATION_PROMPT.md

---

## Acceptance Sign-Off

- **Author**: Claude
- **Approved by**: [Pending Ash Shaw approval]
- **Date**: 2026-05-29
- **Status**: Ready for action

---

**Next Action**: Review and approve this plan. Once approved, Claude will create child issues and begin Phase 1 (NOW tasks).

---

## Labels

`wceu-2026` `talk-preparation` `critical-path` `epic` `presentation` `25min-talk`

## Linked Issues

- [WCEU-01] Create NotebookLM sources index
- [WCEU-02] Commit profile photo to assets
- [WCEU-03] Run NotebookLM session
- [WCEU-04] Create glossary document
- [WCEU-05] Create cover slide
- [WCEU-06] Create speaker intro slide
- [WCEU-07] Create contact slide
- [WCEU-08] Create thank you slide
- [WCEU-09] Finalize content slides
- [WCEU-10] Add speaker notes
- [WCEU-11] Apply design system
- [WCEU-12] Add WordPress reference
- [WCEU-13] Final review

---

**Created**: 2026-05-29
**Updated**: 2026-05-29
**Sprint**: WCEU 2026 Critical Path
**Epic**: WordCamp Europe 2026 Talk
