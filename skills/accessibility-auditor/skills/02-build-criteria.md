---
version: 1.2.0
last_updated: 2026-06-08
---

# Skill 02 — Build criteria set

## Purpose

Build a tailored, WCAG-mapped criteria set for the specific artefact being audited.
Never use a generic fixed checklist — the criteria must reflect what is actually present.

## Category selection rules

ALWAYS include:

- **C** — Color contrast (applies to everything with visual output)
- **L** — Links & interactive elements (applies to anything with clickable/focusable elements)

Include if relevant to this artefact:

- **H** — Heading structure & semantics (full pages, documents, multi-section components)
- **I** — Images & media (if images, icons, charts, or video are present)
- **FM** — Forms & inputs (if any form elements, inputs, or CTAs are present; FM-08/09 additionally require an authentication or login form to be present)
- **D** — Dynamic components (if accordion, modal, tab, carousel, tooltip, or dropdown present)
- **DV** — Data visualisation (if charts, graphs, or data tables are present)
- **M** — Motion & animation (if animated elements are described or visible; M-04 additionally when time limits or auto-advancing content present)
- **MB** — Mobile accessibility (if artefact is a responsive layout, mobile view, or touch-first component)
- **CO** — Cognitive accessibility (for full pages, multi-step flows, or artefacts with substantial content or error states; CO-04/05/06 specifically when form inputs or error states present)
- **AR** — ARIA & landmark structure (whenever interactive elements or landmark structure is present — typically alongside L and H)
- **E** — Email-specific (only for email template audits)
- **P** — PDF-specific (only for PDF document audits)

Note: The **L** category includes WCAG 2.2 focus and pointer criteria (L-09 through L-13). Focus criteria (L-09, L-10, L-11) apply whenever interactive elements are present. Pointer/target criteria (L-12, L-13) apply when drag interactions or touch targets are present.

## Criteria bank

### C — Color contrast

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| C-01 | Body/paragraph text ≥ 4.5:1 contrast against background | 1.4.3 | AA |
| C-02 | Large text (≥18pt or ≥14pt bold) ≥ 3:1 contrast | 1.4.3 | AA |
| C-03 | Interactive element text (buttons, links) ≥ 4.5:1 | 1.4.3 | AA |
| C-04 | UI component boundaries (borders, outlines) ≥ 3:1 | 1.4.11 | AA |
| C-05 | Secondary/muted text (captions, eyebrows, labels) ≥ 4.5:1 | 1.4.3 | AA |
| C-06 | Placeholder text in inputs ≥ 4.5:1 | 1.4.3 | AA |
| C-07 | Disabled states distinguishable without colour alone | 1.4.1 | A |
| C-08 | Focus indicator contrast ≥ 3:1 against adjacent colours | 1.4.11 | AA |
| C-09 | Text on images/gradients meets contrast at all points | 1.4.3 | AA |
| C-10 | Status colours not sole indicator of meaning | 1.4.1 | A |

### L — Links & interactive elements

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| L-01 | Links visually distinct from body text — not colour alone | 1.4.1 | A |
| L-02 | Link text descriptive — no "click here", "read more", "send us a note" without context | 2.4.4 | A |
| L-03 | Buttons have accessible names (visible label or aria-label) | 4.1.2 | A |
| L-04 | Focus indicators visible on all interactive elements | 2.4.7 | AA |
| L-05 | Touch/click targets ≥ 44×44px | 2.5.5 | AAA/BP |
| L-06 | Links opening new tab warn users | 3.2.2 | A |
| L-07 | Skip-to-main-content mechanism present | 2.4.1 | A |
| L-08 | Interactive elements have distinct hover and active states | 1.4.11 | AA |
| L-09 | Focused component not fully hidden by author-created content (sticky headers, etc.) | 2.4.11 | AA |
| L-10 | Focused component not hidden by author-created content — enhanced (no partial obscuring) | 2.4.12 | AAA |
| L-11 | Focus indicator meets minimum area and contrast requirements | 2.4.13 | AAA/BP |
| L-12 | All drag-based functionality has a single-pointer alternative (no dragging required) | 2.5.7 | AA |
| L-13 | Touch/click targets ≥ 24×24px with adequate spacing, or target ≥ 44×44px | 2.5.8 | AA |

### H — Heading structure & semantics

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| H-01 | Single H1 describing page purpose | 1.3.1 | A |
| H-02 | Heading hierarchy logical — no skipped levels | 1.3.1 | A |
| H-03 | All major sections have semantic heading elements | 1.3.1 | A |
| H-04 | Landmark regions correct: header, nav, main, footer | 1.3.6 | AA |
| H-05 | Eyebrow/label text above headings is NOT a heading element | 1.3.1 | A |
| H-06 | Page title (browser tab) descriptive and unique | 2.4.2 | A |
| H-07 | Help mechanisms (contact, chat, FAQ) appear in consistent location across pages | 3.2.6 | A |

### I — Images & media

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| I-01 | Informative images have descriptive alt text | 1.1.1 | A |
| I-02 | Decorative images have empty alt="" | 1.1.1 | A |
| I-03 | Icon-only interactive elements have accessible labels | 4.1.2 | A |
| I-04 | Complex images (infographics, diagrams) have extended descriptions | 1.1.1 | A |
| I-05 | Images of text avoided; text alternatives provided where used | 1.4.5 | AA |
| I-06 | Video content has captions | 1.2.2 | A |
| I-07 | Autoplay audio/video can be paused, stopped, or muted | 1.4.2 | A |

### FM — Forms & inputs

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| FM-01 | All inputs have programmatically associated visible labels | 1.3.1 | A |
| FM-02 | Required fields indicated by more than colour alone | 1.3.1 | A |
| FM-03 | Error messages identify the field and describe the problem | 3.3.1 | A |
| FM-04 | CTA buttons have distinct, action-oriented text | 2.4.6 | AA |
| FM-05 | Placeholder text is NOT the only label for a field | 1.3.1 | A |
| FM-06 | Submit buttons clearly indicate what will happen | 2.4.6 | AA |
| FM-07 | Previously entered information is pre-populated or available for selection (no redundant re-entry) | 3.3.7 | A |
| FM-08 | Authentication does not rely solely on a cognitive function test (puzzle, memorised password without alternative) | 3.3.8 | AA |
| FM-09 | Authentication does not rely on a cognitive function test — enhanced (no exceptions) | 3.3.9 | AAA |

### D — Dynamic components

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| D-01 | Accordion triggers are semantic button elements | 4.1.2 | A |
| D-02 | aria-expanded reflects open/closed state on triggers | 4.1.2 | A |
| D-03 | Panels associated with trigger via aria-controls/aria-labelledby | 1.3.1 | A |
| D-04 | Modal dialogs trap focus while open | 2.1.2 | A |
| D-05 | Modals have accessible name (aria-labelledby on dialog title) | 4.1.2 | A |
| D-06 | Modals dismissible with Escape key | 2.1.1 | A |
| D-07 | Tabs use role="tablist", role="tab", role="tabpanel" correctly | 4.1.2 | A |
| D-08 | Active tab indicated with aria-selected="true" | 4.1.2 | A |
| D-09 | Carousel auto-play can be paused | 2.2.2 | A |
| D-10 | Dropdown menus keyboard-navigable, close on Escape | 2.1.1 | A |

### DV — Data visualisation

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| DV-01 | Charts do not rely on colour alone to differentiate data | 1.4.1 | A |
| DV-02 | Charts have accessible text alternatives | 1.1.1 | A |
| DV-03 | Data tables have th elements and scope attributes | 1.3.1 | A |
| DV-04 | Axis/data labels meet 4.5:1 contrast | 1.4.3 | AA |

### M — Motion & animation

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| M-01 | Animated content can be paused, stopped, or hidden | 2.2.2 | A |
| M-02 | No content flashes more than 3 times per second | 2.3.1 | A |
| M-03 | Motion effects respect prefers-reduced-motion | 2.3.3 | AAA/BP |
| M-04 | Time limits are adjustable, extendable, or can be turned off (session timeouts, auto-advancing content) | 2.2.1 | AA |

### MB — Mobile accessibility

| ID    | Criterion | WCAG | Level |
|-------|-----------|------|-------|
| MB-01 | Content reflows to single column at 400% zoom without horizontal scrolling | 1.4.10 | AA |
| MB-02 | Content and functionality available in both portrait and landscape orientations | 1.3.4 | AA |
| MB-03 | All functionality operable with single pointer — no complex gestures required | 2.5.1 | A |

### CO — Cognitive accessibility

| ID    | Criterion | WCAG | Level |
|-------|-----------|------|-------|
| CO-01 | Reading level does not exceed lower secondary education level where possible | 3.1.5 | AAA/BP |
| CO-02 | Navigation order and labelling consistent across pages in the same set | 3.2.3 | AA |
| CO-03 | UI components with the same function identified consistently across the interface | 3.2.4 | AA |
| CO-04 | Inputs have labels or instructions sufficient to understand required format or constraints | 3.3.2 | A |
| CO-05 | Error messages include suggestions for correction where the fix is known and not a security risk | 3.3.3 | AA |
| CO-06 | Submissions with legal, financial, or data consequences are reversible, verifiable, or confirmable | 3.3.4 | AA |

### AR — ARIA & landmark structure

| ID    | Criterion | WCAG | Level |
|-------|-----------|------|-------|
| AR-01 | ARIA roles, states, and properties are valid and match the element's context and function | 4.1.2 | A |
| AR-02 | ARIA is not used to override correct semantic HTML unnecessarily (avoid role="button" on `<button>`, etc.) | 4.1.2 | A |
| AR-03 | aria-hidden is not applied to focusable elements | 4.1.2 | A |
| AR-04 | Multiple instances of the same landmark type are differentiated with aria-label or aria-labelledby | 1.3.6 | AA |

### E — Email-specific

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| E-01 | Email renders acceptably without images (alt text covers all informative images) | 1.1.1 | A |
| E-02 | Reading order is logical when CSS is disabled | 1.3.2 | A |
| E-03 | All links have descriptive text — no "click here" or bare URLs as link text | 2.4.4 | A |
| E-04 | Text is not images of text — live text used throughout | 1.4.5 | AA |
| E-05 | Font size is not smaller than 14px for body text | 1.4.4 | AA |
| E-06 | Sufficient contrast maintained in both light and dark rendering environments | 1.4.3 | AA |
| E-07 | CTA buttons have descriptive accessible names (not "Submit" or "Click") | 4.1.2 | A |
| E-08 | Table-based layouts use role="presentation" to suppress structural semantics | 1.3.1 | A |
| E-09 | Language attribute set on the root element | 3.1.1 | A |
| E-10 | No reliance on colour alone to convey status or meaning | 1.4.1 | A |

### P — PDF-specific

| ID   | Criterion | WCAG | Level |
|------|-----------|------|-------|
| P-01 | PDF is tagged — all content has structural tags (headings, paragraphs, lists, tables) | 1.3.1 | A |
| P-02 | Reading order in the tag tree matches visual order | 1.3.2 | A |
| P-03 | Document title set in document properties | 2.4.2 | A |
| P-04 | Document language set in document properties | 3.1.1 | A |
| P-05 | All images have alt text in their tag properties; decorative images marked as Artifact | 1.1.1 | A |
| P-06 | Tables have header cells tagged as TH with appropriate scope | 1.3.1 | A |
| P-07 | Links have descriptive text — not bare URLs or "click here" | 2.4.4 | A |
| P-08 | Form fields (if present) have visible labels and accessible name attributes | 1.3.1 | A |
| P-09 | Colour is not the sole means of conveying information | 1.4.1 | A |
| P-10 | Text contrast meets 4.5:1 (body) and 3:1 (large text) against background | 1.4.3 | AA |

## Output format

Present the selected criteria set to the user as a table grouped by category:

```
## Criteria set — [Artefact name]
[N] checks across [M] categories

| ID | Criterion | WCAG | Level |
|----|-----------|------|-------|
...
```

State the total check count. Then proceed immediately to Skill 03.
