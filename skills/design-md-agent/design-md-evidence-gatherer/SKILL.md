---
name: design-evidence-harvester
description: Use when the user asks to create, update, audit, or validate a DESIGN.md file and the agent should first gather and normalize evidence from configured design and implementation sources.
---

# Design Evidence Harvester

Use this skill before drafting conclusions for `DESIGN.md`, `design-md-source-map.md`, or `design-md-validation-report.md`.

This skill is for evidence collection and normalization, not for making repository changes.

## When to use this skill

Use `$design-evidence-harvester` when the request involves any of these:

- creating a new `DESIGN.md`
- updating an existing `DESIGN.md`
- auditing design-token alignment between design and implementation
- validating whether a `DESIGN.md` is complete, current, or safe for agent use
- mapping Figma design-system evidence into WordPress implementation structures

Do not use this skill for general writing help, project management, or repository mutations.

## Available sources

When collecting evidence, prefer these configured sources when they are available:

- {{label:Figma,id:connector_68df038e0ba48191908c8434991bbac2,type:app}} for variables, components, variants, frames, patterns, and design intent
- {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}} for implementation evidence such as `theme.json`, `styles/*.json`, `block.json`, CSS variables, patterns, templates, and existing docs
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} for briefs, brand guides, PRDs, governance notes, and design-system documentation

Prefer direct evidence over inference. If sources disagree, call out the conflict and say which source appears authoritative for that specific decision.

## Core workflow

1. Classify the task as one of: new project, existing project without `DESIGN.md`, existing project with `DESIGN.md`, audit-only, or validation-only.
2. Identify which sources are actually needed for the current request. Do not fetch broadly if one source is enough.
3. Collect concrete evidence before drafting conclusions.
4. Normalize findings into these buckets when supported by the evidence:
   - primitive tokens
   - semantic tokens
   - typography
   - spacing
   - radius or rounded values
   - component patterns
   - brand and state tokens
5. Build an evidence table with these columns:
   - subject
   - value or finding
   - source
   - confidence: verified or inferred
   - notes or conflicts
6. Use that table to drive the final output.
7. End with gaps, contradictions, missing inputs, and recommended next steps.

## Source-specific guidance

### Figma

Use Figma as the primary source for:

- variables and collections
- component variants and naming systems
- layout patterns and spacing scales
- typography styles
- color roles and state usage

When Figma evidence is thin, say exactly what is missing instead of implying the design system is complete.

### GitHub

Use GitHub as the primary source for implementation evidence:

- `theme.json`
- `styles/*.json`
- `block.json`
- CSS custom properties
- block styles and patterns
- template parts
- implementation docs

Flag hardcoded values, undocumented tokens, and mismatches between design evidence and implementation files.

### Google Drive

Use Drive to gather contextual documents that explain intent, governance, or brand constraints.

Treat Drive documents as supporting evidence unless they clearly define the canonical rule for a decision.

## WordPress mapping rules

For WordPress projects:

- map colors, typography, spacing, and radius values to `theme.json` presets or documented CSS custom properties when possible
- distinguish WordPress-native tokens from one-off hardcoded values
- note where implementation diverges from the design source
- explain mapping choices clearly enough that another agent could implement them safely

## Output requirements

When the request is generation or update work, aim to produce:

- `DESIGN.md`
- `design-md-source-map.md`
- `design-md-validation-report.md`

If the evidence is too limited for all three, say which outputs are reliable now and which should be provisional.

For audit or validation work, always separate:

- verified findings
- inferred findings
- missing evidence
- conflicts that need human review

## Response shape

Use this structure unless the user explicitly asks for another format:

1. Task classification
2. Sources checked
3. Evidence summary
4. Normalized token and component findings
5. Output files produced or recommended
6. Gaps, conflicts, and follow-up actions

## Guardrails

- Do not invent authoritative design rules from weak evidence.
- Do not treat screenshots or live-site inspection alone as full source of truth.
- Do not overwrite governance or approval notes unless the user explicitly asks.
- Do not create issues, pull requests, commits, or other repository changes unless the user explicitly requests them.
- Be conservative about accessibility claims; flag possible contrast or interaction-state risks when the evidence is incomplete.

## Example request shapes

- "Create a repo-ready DESIGN.md from this project's Figma file, GitHub repo, and brand docs."
- "Audit our current DESIGN.md against Figma variables and theme.json, then show me what is outdated or unsafe for AI agents."
- "Map the Figma token system into WordPress theme.json presets and CSS variables, and list any implementation gaps."
