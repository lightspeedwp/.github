# Section catalog

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

The ~10 candidate sections the skill proposes in Step 2. Each entry defines: what the section is for, when to suggest it, default block shape, default section palette color, default table header color (if it has a table), and gap questions for Step 3.

Use these as **defaults** — the user can pick alternative shapes during Step 4.

---

## `motivation` — Motivation

**Title:** Motivation
**When to suggest:** PRD has a non-trivial problem statement or background narrative (>= 3 sentences, or a named recent incident / stakeholder ask).
**Default shape:** [intro-callout.md](blocks/intro-callout.md) + [table.md](blocks/table.md) for "Resources".
**Palette:** `lightViolet` section bg; `violet` table header.
**Contents (default):**

- Intro callout — one-sentence "why this exists" pulled from the PRD.
- H3 "Resources" subheader.
- Table of external resources: columns `Type | Link | Description`.
**Gap questions:**
- Any resources beyond the PRD to list (design doc, Coda doc, Slack thread)?

---

## `context` — Context & Background

**Title:** Context & Background
**When to suggest:** PRD has a clear "background" or "current situation" paragraph not suitable as an intro callout.
**Default shape:** body paragraph only ([text-primitives.md](blocks/text-primitives.md)). Optional H3 + bulleted list for related resources.
**Palette:** `lightGray` section bg.
**Contents (default):**

- Body text — 3–6 sentence paragraph synthesizing problem + motivation.
- (Optional) H3 "Related Resources" + bulleted list of links.
**Gap questions:**
- Is there a recent incident or stakeholder ask behind this project? (free text)

---

## `goals` — Goals, Non-Goals & Success Metrics

**Title:** Goals, Non-Goals & Success Metrics
**When to suggest:** Always. Even a PRD without explicit metrics can list goals + non-goals.
**Default shape:** 3-column [multi-column-text.md](blocks/multi-column-text.md): Goals / Non-Goals / Success Metrics. Optionally: a [table.md](blocks/table.md) with columns `Goal | Description` instead of the bulleted list, if user prefers structured.
**Palette:** `lightGreen` section bg; `green` table header.
**Contents (default):**

- Col 1 (Goals): H3 "Goals" + bulleted list from PRD.
- Col 2 (Non-Goals): H3 "Non-Goals" + bulleted list ("none" allowed).
- Col 3 (Success Metrics): H3 "Success Metrics" + [sticky-column.md](blocks/sticky-column.md) of yellow stickies, one metric per sticky.
**Gap questions:**
- Any non-goals (things explicitly *not* shipping in v1)? (free text)
- Success metrics, each as "metric: target" (e.g. "p95 < 200ms"). (free text)

---

## `approach` — Proposed Approach

**Title:** Proposed Approach
**When to suggest:** PRD has a chosen approach or solution outline.
**Default shape:** body paragraph + optional H3 "Key Design Decisions" + bulleted list.
**Palette:** `lightGreen` section bg.
**Gap questions:**

- One-sentence summary of chosen approach. (free text)
- 2–4 key design decisions to highlight. (free text)

---

## `designDecisions` — Design Decisions (with alternatives)

**Title:** Design Decisions: 1, 2, … N
**When to suggest:** The user identified >= 2 design decisions in the Proposed Approach, **each with alternatives or tradeoffs**. This section uses nested sections + multi-column text.
**Default shape:** [nested-section.md](blocks/nested-section.md) parent → one child per decision. Each child: H3 + body + [table.md](blocks/table.md) for Tradeoffs + [multi-column-text.md](blocks/multi-column-text.md) for N options.
**Palette:** `lightBlue` parent section; `lightBlue` child sections (matching); `blue` table header.
**Gap questions:**

- For each design decision: name + 2–4 alternatives + tradeoff axes (e.g. "Latency", "Complexity", "Cost"). (free text per decision)

---

## `alternatives` — Alternatives Considered

**Title:** Alternatives Considered
**When to suggest:** The PRD + interview mention >= 1 serious alternative that was rejected, AND `designDecisions` is not selected (they overlap). Skip if the alternatives live inside `designDecisions`.
**Default shape:** H3 per alternative + body paragraph of one-line rejection reason.
**Palette:** `lightYellow` section bg.
**Gap questions:**

- For each alternative: name + one-line rejection reason. (free text)

---

## `dependencies` — Dependencies

**Title:** Dependencies
**When to suggest:** The PRD or codebase grounding identified cross-team services, external vendors, or blockers.
**Default shape:** [table.md](blocks/table.md) with columns `Type | Dependency | Notes`. Alternative shape: [sticky-column.md](blocks/sticky-column.md) (orange stickies), single column.
**Palette:** `lightOrange` section bg; `orange` table header.
**Gap questions:**

- External vendors the project depends on? (free text)
- Cross-team services? (free text; pre-filled from tech-context if available)
- Known blockers? (free text)

---

## `implementation` — Implementation Plan

**Title:** Implementation Plan
**When to suggest:** Always (even a rough phasing is useful).
**Default shape:** [table.md](blocks/table.md) or H3-per-phase + bulleted list. Columns for the table: `# | Phase | Timeline | Sub-tasks`.
**Palette:** `lightViolet` section bg; `violet` table header.
**Gap questions:**

- Phases (name + timeline + sub-tasks)? (free text; suggest 3–5 phases with 3–8 sub-tasks each)

---

## `milestones` — Milestones

**Title:** Milestones
**When to suggest:** The user has explicit dates or week-numbered deliverables, OR the implementation phases have clear dates attached.
**Default shape:** [table.md](blocks/table.md) with columns `# | Phase | Timeline | Description`. Numbered first column.
**Palette:** `lightBlue` section bg; `blue` table header.
**Gap questions:**

- List milestones with # / name / week or date / one-line description.

---

## `rollout` — Rollout & Validation

**Title:** Rollout & Validation
**When to suggest:** The PRD or interview mentions a rollout strategy (feature flag / canary / big-bang).
**Default shape:** body paragraph (rollout strategy summary) + [table.md](blocks/table.md) with columns `Stage | Activities | Metric to Watch | Gate`.
**Palette:** `lightOrange` section bg; `orange` table header.
**Gap questions:**

- Rollout strategy (feature flag / canary / blue-green / big-bang / custom).
- Stages — each with activity, metric, gate.
- Test strategy (unit / integration / load / manual QA).

---

## `risks` — Risks & Open Questions

**Title:** Risks & Open Questions
**When to suggest:** Always (every real project has at least one of each).
**Default shape:** 2-column [multi-column-text.md](blocks/multi-column-text.md) with H3 "Risks" (one column) and H3 "Open Questions" (other column), each as a [sticky-column.md](blocks/sticky-column.md). Alternative: bulleted list if user prefers plain text.
**Palette:** `lightPink` section bg.
**Stickies:** Risks → pink or red; Open questions → blue.
**Gap questions:**

- Top risks (things that could block or break this). (free text)
- Open questions (decisions still pending). (free text)

---

## `currentState` — Current State Architecture (diagram, right column)

**Title:** Current State Architecture
**When to suggest:** The project touches existing services (tech-context has >= 1 service) and isn't greenfield.
**Default shape:** [diagram-section.md](blocks/diagram-section.md).
**Palette:** `white` section bg.
**Gap questions:** none — composed from tech-context by `generate_diagram`.

---

## `targetState` — Target State Architecture (diagram, right column)

**Title:** Target State Architecture
**When to suggest:** Always (project's endpoint, even greenfield has a target state).
**Default shape:** [diagram-section.md](blocks/diagram-section.md).
**Palette:** `white` section bg.
**Gap questions:** what's new vs. current state (fed into Mermaid composition).

---

## `keyFlow` — Key Flow N (diagram, right column; 0–N instances)

**Title:** Key Flow: `<flow name>`
**When to suggest:** The user explicitly names user journeys or system flows worth diagramming (e.g. "Sync trigger flow").
**Default shape:** [diagram-section.md](blocks/diagram-section.md).
**Palette:** `white` section bg.
**Gap questions:** for each flow — name + short description + trigger + actors.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
