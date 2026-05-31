---
title: "Phase 2 NotebookLM Prompts & Templates"
description: "Pre-formatted prompts and output organization templates for Phase 2 content generation"
created_date: "2026-05-30"
file_type: documentation
---

# Phase 2 NotebookLM Prompts & Templates

**Use this file during your NotebookLM session to quickly execute all generation steps.**

---

## Setup Checklist

Before you start, verify:

- [ ] NotebookLM session open: <https://www.notebooklm.google.com>
- [ ] Title set: "WCEU 2026 Slide Briefs"
- [ ] All ~60 URLs added from `wceu-2026/notebooklm/sources-index.md` (lines 21–129)
- [ ] `wceu-2026/SLIDES_GENERATION_PROMPT.md` pasted as main brief
- [ ] NotebookLM processing complete (checkmarks on all sources)

---

## Prompt 1: Speaker Notes & Talking Points

**Copy & paste this exactly into NotebookLM chat:**

```
Generate detailed speaker notes and talking points for each of the 24 slides outlined in the main brief. For each slide, provide:

(1) Key message (1–2 sentences, the core idea for that slide)
(2) 3–5 talking points (specific examples, data, or transitions)
(3) Timing estimate (how long to spend on this slide, e.g., "1 min 30 sec")
(4) Suggested transition to next slide (how to bridge to the following slide)

Format as:

---
## Slide 1: [Slide Title]
**Key Message**: [1–2 sentences]
**Talking Points**:
- [Point 1]
- [Point 2]
- [Point 3]
**Timing**: [e.g., 1 min]
**Transition**: [Bridge to next slide]
```

**Expected output**: 24 structured slide briefs with messages, points, timing, and transitions.

**Time**: ~5–10 minutes for NotebookLM to generate.

---

## Prompt 2: Visual Elements & Diagrams

**Copy & paste this exactly:**

```
For each slide, suggest visual elements: diagrams, flowcharts, before/after comparisons, timelines, or architecture visualizations. Include specifics on what each diagram should show.

For each slide, provide:
(1) Visual type (diagram, flowchart, comparison, timeline, etc.)
(2) What the visual should illustrate (be specific)
(3) Key elements or labels to include
(4) Why this visual supports the slide's message

Format as:

---
## Slide [#]: Visual Suggestions
**Visual Type**: [e.g., "Architecture Diagram"]
**Illustrates**: [What concept or flow]
**Key Elements**: [Labels, components, connections]
**Why**: [How it supports the message]
```

**Expected output**: 24 visual design suggestions keyed to each slide.

**Time**: ~5–10 minutes for generation.

---

## Prompt 3: Metrics, Statistics & Examples

**Copy & paste this exactly:**

```
Identify key metrics, statistics, and real-world examples from the LightSpeed repository that support each slide's narrative. Include GitHub links where relevant.

For each slide, provide:
(1) Key stat or metric (e.g., "80% reduction in labeling time")
(2) Real-world example (e.g., "Release agent reduces deployment from hours to minutes")
(3) GitHub link or reference (e.g., link to specific workflow, issue, or agent file)
(4) Why this evidence is compelling for this slide

Format as:

---
## Slide [#]: Supporting Evidence
**Stat/Metric**: [e.g., "50+ repositories on unified governance"]
**Example**: [Real use case or outcome]
**GitHub Link**: [URL or file reference]
**Why Compelling**: [Brief explanation of relevance]
```

**Expected output**: 24 evidence-backed slides with metrics, examples, and links.

**Time**: ~5–10 minutes for generation.

---

## Prompt 4: Transitions & Narrative Flow

**Copy & paste this exactly:**

```
Review the talk structure and suggest any missing transitions or narrative gaps between slides. Ensure the flow from problem → solution → adoption is coherent and compelling.

Identify:
(1) Any narrative gaps (e.g., "After Slide 6, we jump from 'the problem' to 'the solution' without bridging")
(2) Suggested transitions (how to strengthen the connection between consecutive slides)
(3) Pacing feedback (e.g., "Slides 3–6 problem section might feel too long; consider consolidating")
(4) Overall flow assessment (Is the 25-min talk paced well? Are the key messages repeated appropriately?)

Format as:

---
## Narrative Assessment
**Gaps Identified**: [e.g., "Gap between Slide 6 and Slide 7; need stronger pivot language"]
**Suggested Transitions**: 
- Slide 6→7: [Bridge text]
- [Other transitions as needed]
**Pacing Feedback**: [Overall timing and flow observations]
**Overall Flow**: [Strengths and recommendations for 25-min delivery]
```

**Expected output**: 1 comprehensive narrative review with gap-filling suggestions.

**Time**: ~3–5 minutes for generation.

---

## Output Organization Template

**After all 4 prompts, organize NotebookLM output into this structure:**

Create a file: `wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md`

```markdown
---
title: "Phase 2 NotebookLM Output"
description: "Generated speaker notes, visuals, metrics, and narrative flow review"
created_date: "2026-05-30"
file_type: documentation
---

# Phase 2 NotebookLM Output

Generated: [DATE & TIME]
Session: WCEU 2026 Slide Briefs (NotebookLM)

---

## Part 1: Speaker Notes & Talking Points

[Paste Prompt 1 output here, organized by slide]

---

## Part 2: Visual Elements & Diagrams

[Paste Prompt 2 output here, organized by slide]

---

## Part 3: Metrics, Statistics & Examples

[Paste Prompt 3 output here, organized by slide]

---

## Part 4: Transitions & Narrative Flow

[Paste Prompt 4 output here]

---

## Next Steps (Phase 3)

- Transfer speaker notes to Google Slides speaker notes section
- Create visual elements in design software or draw.io
- Insert metrics/examples into slide content
- Implement transition suggestions during rehearsal
```

---

## Timing Summary

| Step | Duration | What You Do |
|------|----------|------------|
| Setup | 5 min | Load sources, paste brief, verify processing |
| Prompt 1 | 10 min | Generate speaker notes + talking points |
| Prompt 2 | 10 min | Generate visual suggestions |
| Prompt 3 | 10 min | Generate metrics + examples + links |
| Prompt 4 | 5 min | Get narrative flow assessment |
| Export & Organize | 15 min | Copy to `PHASE2_NOTEBOOKLM_OUTPUT.md`, review |
| **Total NotebookLM** | **~55 minutes** | End of Part A (NotebookLM) |
| Foundation Slides | 60–90 min | Create Slides 1, 2, 23, 24 in Google Slides |
| Design System Prep | 30 min | Document colors, typography (optional) |
| **Total Phase 2** | **~2.5–3 hours** | Ready for Phase 3 on May 31 |

---

## Troubleshooting

**NotebookLM is slow to load sources:**

- Try refreshing the page
- Add sources in smaller batches (15–20 at a time)
- Wait 2–3 minutes between batches

**NotebookLM output is too brief:**

- Ask follow-up questions in the chat (e.g., "Expand Slide 5 talking points with more specific examples")
- Reframe the prompt with more detail

**Can't copy output cleanly:**

- Select all text in NotebookLM (Ctrl+A), copy, paste into a text editor first
- Then format into `PHASE2_NOTEBOOKLM_OUTPUT.md`

**Google Slides link not saving:**

- Share the link by email to yourself
- Add to bookmarks
- Save the URL in `PHASE2_EXECUTION_CHECKLIST.md` under "Deliverables"

---

## Questions?

Refer back to `PHASE2_EXECUTION.md` for step-by-step guidance on foundation slides and design system preparation.

Ready to start? Begin with the **Setup Checklist** above, then execute Prompts 1–4 in order.
