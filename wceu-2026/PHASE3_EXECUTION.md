---
title: "Phase 3 Execution Guide — Content Transfer + Design Polish"
description: "May 31 final push: slides 3–22, speaker notes, design system, accessibility"
created_date: "2026-05-30"
last_updated: "2026-05-30"
file_type: documentation
---

# Phase 3 Execution Guide

**Timeline**: May 31 (URGENT — entire day)
**Deliverable**: 24-slide Google Slides deck with speaker notes, dark-mode design, accessibility verified
**Owner**: Ash Shaw (design + content transfer) + Claude (automation + checklists)
**Effort**: 6–8 hours

---

## Overview

Phase 3 is the final push. You have NotebookLM briefs (from Phase 2) and foundation slides (1, 2, 23, 24). Now you:

1. **Transfer content** from NotebookLM briefs → Google Slides (slides 3–22)
2. **Apply design system** (dark mode, colours, typography)
3. **Add speaker notes** (timing, talking points, transitions)
4. **Verify accessibility** (WCAG AA contrast, readability)
5. **Polish & review** (consistency, visual hierarchy, flow)

---

## Part 1: Content Transfer (Slides 3–22)

### Slide Structure Template

Use this structure for **every content slide**:

```
SLIDE LAYOUT:
┌─────────────────────────────────────────┐
│ SLIDE TITLE (44–54pt, bold, off-white)  │
├─────────────────────────────────────────┤
│ • Key point 1 (28–32pt, off-white)      │
│                                         │
│ • Key point 2                           │
│                                         │
│ • Key point 3 (max 5 bullets)           │
│                                         │
│ [OPTIONAL VISUAL: diagram, flowchart,   │
│  before/after, timeline, architecture]  │
│                                         │
├─────────────────────────────────────────┤
│ Slide 3 | WordCamp Europe 2026          │  (footer)
└─────────────────────────────────────────┘

TEXT COLOURS:
- Title: #f5f5f5 (off-white)
- Body: #f5f5f5 (off-white)
- Callouts/emphasis: #00d4ff (electric blue) or #ffb700 (gold)
- Accent highlights: #00bfa5 (teal) or #00ff88 (green)

BACKGROUND:
- #1a1a1a (dark charcoal) primary
- #0a0a0a (near-black) for variety on longer decks
```

### Content Transfer Workflow

For each of slides 3–22:

1. **Reference NotebookLM brief** for that slide
2. **Extract key message** (primary talking point)
3. **List 3–5 bullet points** (from talking points)
4. **Add visual suggestion** (from NotebookLM visual recommendations)
5. **Add speaker notes** (covered in Part 2)
6. **Set timing** (from NotebookLM timing estimates)

### Slide 3–5: Problem Section (3 slides)

**Slide 3: The Challenge**

- Message: Current state is fragmented, inconsistent, manual
- Visual: Before diagram (scattered repos, no alignment)
- Bullets: Inconsistency, manual burden, scalability limits

**Slide 4: Pain Points**

- Message: Agencies & teams struggle with governance at scale
- Visual: Timeline or flowchart showing bottlenecks
- Bullets: Labeling delays, inconsistent processes, reviewer overhead

**Slide 5: Why It Matters**

- Message: Inconsistency costs time and trust
- Visual: Metric infographic (80% labeling time savings, 100% consistency)
- Bullets: Productivity, quality, team morale

### Slide 6–12: Solution Section (7 slides)

**Slide 6: The Solution — One .github Repo**

- Message: Centralised governance = consistency at scale
- Visual: Hub-and-spoke diagram (.github as hub, repos as spokes)
- Bullets: Single source of truth, inheritance, consistency

**Slide 7: The Plugin Pack System**

- Message: Portable, installable governance plugins
- Visual: Diagram showing plugin → hook → workflow flow
- Bullets: Modularity, reusability, adoption flexibility

**Slide 8: Hooks Layer**

- Message: Semantic abstraction over GitHub Actions
- Visual: Layer diagram (hooks → workflows)
- Bullets: What (hook) vs. how (workflow), decoupling, flexibility

**Slide 9: Workflow Layer**

- Message: Where the magic happens (CI/CD automation)
- Visual: Sample workflow diagram (trigger → jobs → completion)
- Bullets: Actions, labeling, release notes, validation

**Slide 10: Template System**

- Message: Consistent templates reduce friction
- Visual: Template evolution (blank → template → populated)
- Bullets: Issue templates, PR templates, documentation

**Slide 11: Automation Examples**

- Message: Real examples from LightSpeed
- Visual: 3-panel comparison (old vs. new)
- Bullets: Labeling, release notes, accessibility checks

**Slide 12: The Agent Layer**

- Message: AI agents amplify human decisions
- Visual: Agent feedback loop (human → agent → automation)
- Bullets: Labeling agents, release agents, consistency

### Slide 13–18: Implementation Section (6 slides)

**Slide 13: Plugin Manifest**

- Message: Declarative plugin definition
- Visual: Sample manifest structure (simplified JSON/YAML)
- Bullets: Version, dependencies, hooks, metadata

**Slide 14: Repository Inheritance**

- Message: Child repos inherit from .github automatically
- Visual: Inheritance diagram (parent → child repos)
- Bullets: Consistency enforcement, optional overrides

**Slide 15: Distribution & Installation**

- Message: Plugins are versioned, installable, updatable
- Visual: Installation flow (discover → fork → enable → use)
- Bullets: Git-based delivery, semantic versioning, rollback

**Slide 16: Adoption Path**

- Message: Start small, scale gradually
- Visual: Adoption curve (phase 1 → 2 → 3)
- Bullets: Pilot repos, feedback loop, org-wide rollout

**Slide 17: Governance at Scale**

- Message: Enforce standards without micromanagement
- Visual: Governance model (policy → automation → consistency)
- Bullets: Standards enforcement, audit trails, transparency

**Slide 18: Real-World Impact**

- Message: Proof from LightSpeed deployments
- Visual: Metrics dashboard (time saved, consistency %, adoption %)
- Bullets: 80% labeling time savings, 100% consistency, 2 pilot repos

### Slide 19–22: Adoption & Future Section (4 slides)

**Slide 19: Getting Started**

- Message: Fork, read, participate
- Visual: Step-by-step diagram (fork → read → join → share)
- Bullets: Fork the repo, explore examples, join community

**Slide 20: The Roadmap Ahead**

- Message: WordPress integration + ecosystem expansion
- Visual: Timeline (Year 1: audit & mapping, Year 2: distribution, Year 3+: automation)
- Bullets: WordPress agent-skills integration, open-source licensing, broader adoption

**Slide 21: Call to Action**

- Message: Join the community, share your innovations
- Visual: Community engagement diagram or social proof quotes
- Bullets: Contribute, share use cases, collaborate

**Slide 22: Closing Thought**

- Message: One .github repo is the foundation for scalable governance
- Visual: Final visual (optional, can be logo or simple graphic)
- Bullets: Consistency, scalability, community

---

## Part 2: Speaker Notes (All 24 Slides)

### Speaker Notes Template

For each slide, add notes in Google Slides (Notes section):

```
SPEAKER NOTES TEMPLATE:

**Timing**: [X minutes / Y total minutes]

**Key Message**:
[One sentence summary]

**Talking Points**:
1. [Point 1 — expand on what the slide says]
2. [Point 2]
3. [Point 3]

**Transitions**:
- From previous: [How this slide connects to the last]
- To next: [How to move to the next slide]

**Q&A Anticipation**:
- Likely question: [Q]
- Answer: [A]

**Emphasis**:
- Pause here for effect
- Repeat this metric
- Use story/example if time allows
```

### Timing Breakdown (25 minutes total)

Allocate approximately:

- **Slides 1–2** (intro): 1 minute
- **Slides 3–5** (problem): 3 minutes
- **Slides 6–12** (solution): 8 minutes ← longest section
- **Slides 13–18** (implementation): 7 minutes
- **Slides 19–22** (adoption): 4 minutes
- **Slides 23–24** (contact + closing): 2 minutes

Adjust based on your delivery style (some content takes longer to explain).

---

## Part 3: Design System Application

### Colour Application Rules

| Element | Colour | Usage |
|---------|--------|-------|
| Background | #1a1a1a | All slides |
| Primary text | #f5f5f5 | Titles, body, bullets |
| Emphasis | #00d4ff | Key terms, important metrics |
| Secondary | #00bfa5 | Subheadings, callouts |
| Highlights | #00ff88 | Data points, examples |
| Gold accents | #ffb700 | Footer text, special notes |

### Typography Rules

| Element | Font | Size | Weight | Colour |
|---------|------|------|--------|--------|
| Slide title | System (or serif) | 44–54pt | Bold | #f5f5f5 |
| Bullet point | System | 28–32pt | Regular | #f5f5f5 |
| Caption | System | 20–24pt | Regular | #ffb700 |
| Footer | System | 16–18pt | Regular | #ffb700 |

### Layout Rules

- **Margins**: 1 inch top/bottom, 1.25 inches left/right
- **Line height**: 1.5× for readability
- **Bullets**: 3–5 maximum per slide
- **Visuals**: 40–50% of slide area (leave breathing room)
- **Alignment**: Left-aligned body, centre-aligned titles

### Dark Mode Consistency

- No light backgrounds (except intentional contrast areas)
- All text must be off-white or yellow/gold
- Diagrams: use accent colours on dark background
- Images: add dark overlay if they're light-heavy
- Avoid pure white (#ffffff) except for extreme emphasis

---

## Part 4: Accessibility Audit

### WCAG AA Checklist

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/):

- [ ] Primary text (#f5f5f5) on background (#1a1a1a): **Check contrast ratio ≥ 4.5:1**
- [ ] Emphasis text (#00d4ff) on background: **Check contrast ratio ≥ 4.5:1**
- [ ] All accent colours pass minimum ratio
- [ ] No reliance on colour alone (use text labels + colour)
- [ ] Text size ≥ 28pt for body content (verified)
- [ ] Footer readable (≥ 16pt)

### Keyboard Navigation

- All content navigable via arrow keys
- No interactive elements requiring mouse
- Slide transitions clear and consistent

### Visual Hierarchy

- Titles noticeably larger than body (44pt vs. 28–32pt)
- Emphasis colours distinct from background
- Whitespace separates concepts
- Bullets align and space consistently

### Readability Check

- [ ] Squint test: Can you read slides from 10 feet away?
- [ ] Colour test: Are colours distinguishable (not just different shades)?
- [ ] Motion test: No flashing, strobing, or auto-animation
- [ ] Consistency test: Do all slides follow same design rules?

---

## Part 5: WordPress Integration Reference

### Slide 20 — Roadmap Callout

Add visible reference on roadmap/architecture slide:

```
YEAR 1 VISION: WordPress Agent-Skills Integration

[Box with accent colour]
├─ Audit WordPress agent-skills repo
├─ Map LightSpeed patterns to WP ecosystem
├─ GPL 3.0 licensing alignment
├─ Community feedback loop
└─ Post-WCEU roadmap: /wceu-2026/WORDPRESS_INTEGRATION_ROADMAP.md
```

Link directly to: `wceu-2026/WORDPRESS_INTEGRATION_ROADMAP.md`

---

## Part 6: Final Review Checklist

### Content Completeness

- [ ] All 24 slides present
- [ ] Slides 3–22 have NotebookLM-based content
- [ ] No placeholder text remaining
- [ ] Metrics and examples included
- [ ] WordPress integration visible on roadmap slide

### Design & Accessibility

- [ ] Dark mode applied to all slides
- [ ] Colour scheme consistent
- [ ] Contrast verified (WCAG AA minimum)
- [ ] Typography consistent (sizes, weights, families)
- [ ] Whitespace balanced
- [ ] Visuals aligned and scaled
- [ ] Footer present on all slides except cover and closing

### Speaker Notes

- [ ] All 24 slides have speaker notes
- [ ] Timing estimates on each slide
- [ ] Key talking points documented
- [ ] Transitions explicit
- [ ] Q&A anticipations included
- [ ] Total timing ≈ 25 minutes

### Polish

- [ ] No typos or grammatical errors
- [ ] Consistent abbreviations (e.g., "AI-ops" vs. "AI Ops")
- [ ] Links correct and functional (if embedded)
- [ ] Images optimised (no pixelation, proper aspect ratio)
- [ ] Slide numbers in footer correct

### Delivery Readiness

- [ ] Deck opens without errors
- [ ] Slides transition smoothly
- [ ] Speaker notes visible in presenter view
- [ ] Timing rehearsed (optional but recommended)
- [ ] Backup PDF exported

---

## Deferred: Post-WCEU Tasks

These do **not** block the talk, but should be noted for June:

- 7 agent slide decks (separate resource)
- Website (awesome-copilot style, ongoing)
- Detailed WordPress integration work (roadmap done, work begins later)
- Video editing / distribution plan (VideoPress handles)
- Community engagement campaign (post-talk follow-up)

---

## Success Criteria (May 31 EOD)

✅ **Complete**: 24-slide Google Slides deck
✅ **Content**: All speaker notes (timing, talking points, transitions)
✅ **Design**: Dark mode, consistent colours, typography
✅ **Accessibility**: WCAG AA verified
✅ **Polish**: Ready for rehearsal (June 1–4)
✅ **Delivery**: Presenter notes visible, timing ≈ 25 minutes

---

## Timeline for May 31

```
Morning (9am–12pm)
├─ Transfer NotebookLM content to slides 3–22
├─ Add visuals and diagrams
└─ Apply dark-mode template

Afternoon (12pm–5pm)
├─ Add speaker notes to all slides
├─ Verify timing (total ≈ 25 minutes)
└─ Run accessibility audit

Late Afternoon (5pm–7pm)
├─ Polish and review
├─ Fix any contrast issues
├─ Verify footer, consistency
└─ Export PDF backup

Evening (7pm–9pm)
├─ Final rehearsal (optional)
├─ Capture speaker notes
└─ ✅ Deck finalized

Post-May 31 (Weekend)
├─ Rehearse (June 1–4)
├─ Refine based on timing feedback
└─ Confirm accessibility with screen reader
```

---

**Ready**: By end of Phase 3, deck is presentation-ready for rehearsal.
