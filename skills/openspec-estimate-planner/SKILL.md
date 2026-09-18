---
name: openspec-estimate-planner
description: generate openspec-aligned estimate planning artifacts from a prd, rough estimate, project brief, scope notes, or discovery pack. use when the user asks to turn requirements into openspec tasks, proposal.md, tasks.md, tasks-checklist.md, tasks-details.md, optional design.md, phased implementation plans, or estimate-ready task lists. always check openspec.dev or the fission-ai/openspec docs for current methodology before producing artifacts, then fall back to the bundled methodology summary if live docs are unavailable.
---

# OpenSpec Estimate Planner

## Overview

Create estimate-ready planning artifacts from a PRD, rough estimate, project brief, or mixed scope notes using OpenSpec's lightweight spec-driven methodology. This skill works even when the OpenSpec repository cannot be downloaded: use the live docs when available, then use the bundled summary and templates as the fallback.

## Required Workflow

1. **Check OpenSpec first**
   - Before generating artifacts, check the current OpenSpec website or Fission-AI/OpenSpec docs for updates.
   - Prefer current live guidance over the bundled summary.
   - If live checking is unavailable, blocked, or explicitly forbidden by the user, say that the output is based on the bundled summary and continue.
   - Use `references/openspec-methodology-summary.md` as the fallback baseline.

2. **Normalize the source input**
   - Accept pasted PRDs, rough estimates, discovery notes, markdown, docs, PDFs, repo notes, or mixed project materials.
   - Extract: goal, change name, business intent, scope, non-goals, requirements, assumptions, risks, open questions, supplied phases, dependencies, and any design/technical mentions.
   - Ask a follow-up only if there is no usable source content. Otherwise make careful assumptions and label them.

3. **Decide the artifact set**
   - Always generate `proposal.md`.
   - Always generate `tasks.md`.
   - Always generate `tasks-checklist.md`.
   - Always generate `tasks-details.md`.
   - Generate `design.md` when the resources contain any mention of design or design-adjacent work, including Figma, prototype, wireframe, UI, UX, layout, component, pattern, template, theme, visual direction, design system, brand, style, architecture, integration, migration, data model, or implementation approach.
   - Do not generate OpenSpec `specs/` delta files unless the user specifically asks for a full OpenSpec change folder or strict spec deltas.

4. **Apply OpenSpec artifact logic**
   - Treat `proposal.md` as the why, what, scope, and high-level approach.
   - Treat `design.md` as the how: technical approach, design/architecture decisions, data flow, file/template/component notes, and implementation constraints.
   - Treat `tasks.md` as the standard OpenSpec-compatible implementation checklist with checkboxes.
   - Treat `tasks-checklist.md` as the clean estimate/task checklist for quick review.
   - Treat `tasks-details.md` as the detailed estimating and implementation breakdown.
   - Keep requirements behavior-first. Put implementation detail in `design.md`, `tasks.md`, and `tasks-details.md`.

5. **Group by supplied phases**
   - Preserve supplied phase names and order exactly where possible.
   - Map every task to one of the supplied phases.
   - Add a short `Cross-phase / dependencies` section only when tasks truly span multiple phases.
   - If no phases are supplied, infer practical phases from the PRD, such as discovery, planning, foundation, design, build, content/data, integrations, qa, launch, and handover.

6. **Generate the files**
   - When file creation is available, create the markdown files and return links or a zipped folder.
   - When file creation is not available, output separate fenced markdown blocks labelled with the exact filename.
   - Use `references/output-templates.md` for the required structures.

## Task Quality Rules

- Make tasks small enough for one developer or implementer to understand and complete without re-reading the whole PRD.
- Use hierarchical numbering in checklist files, e.g. `1.1`, `1.2`, `2.1`.
- Start every incomplete task with `- [ ]`.
- Include QA, review, acceptance, and handover tasks where relevant.
- Map requirements to tasks. If a requirement has no clear task, add a task or flag it under open questions.
- Separate confirmed scope from assumptions.
- Do not invent exact estimates, budgets, or delivery dates unless the user asks. If effort is needed, use labelled ranges or placeholders and explain that they need team validation.
- Do not overstate certainty where the PRD is rough or incomplete.

## Output Expectations

For a normal run, provide:

1. A brief note saying which OpenSpec source was checked, or that the bundled fallback was used.
2. A list of files generated.
3. The files themselves as links, a zip, or clearly labelled markdown blocks.
4. A short assumptions/open questions note if source material was incomplete.

Keep the final answer practical and ready for LightSpeed project planning workflows.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
