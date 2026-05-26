---
name: design-md-intake-triage
description: Use when the user asks to create, update, audit, or validate DESIGN.md deliverables and the agent should first classify the request, assess evidence sufficiency, and route to the correct DESIGN.md workflow before using other skills.
---

# DESIGN.md Intake Triage

Use this skill at the start of any DESIGN.md task before deep evidence gathering, drafting, formatting, or standards validation.

## What This Skill Decides

Determine all of the following before continuing:

1. the request type
2. the minimum evidence needed for that request type
3. whether the currently available evidence is sufficient, partial, or insufficient
4. which downstream workflow should run next
5. whether the agent should proceed, proceed provisionally, or stop and ask for the smallest missing input

## Request Shapes

Use this skill for request shapes like:

- "Create a new DESIGN.md from the connected Figma file and repo."
- "Update the existing DESIGN.md to match the latest Figma variables and theme.json changes."
- "Audit this DESIGN.md and tell me what is outdated or unsafe for AI agents."
- "Validate the current DESIGN.md package against the LightSpeed standard."
- "Map the design tokens from Figma into WordPress-native implementation guidance."

## Classification

Classify the request into exactly one primary mode:

- **create-new**: produce a new DESIGN.md package for a project that does not yet have one
- **create-from-partial-project**: create a first DESIGN.md package for an existing project with partial evidence
- **update-existing**: revise an existing DESIGN.md package using newer evidence
- **audit-only**: inspect an existing DESIGN.md package and report quality, gaps, drift, duplication, or safety issues without rewriting by default
- **validation-only**: validate an existing DESIGN.md package against standards without doing broader discovery unless validation requires it
- **source-map-only**: produce or refresh evidence mapping between sources and the DESIGN.md package

If the user asks for multiple outcomes, choose the dominant primary mode and list the secondary outcomes in the triage summary so the later workflow can cover them deliberately.

## Evidence Sufficiency Rules

Assess the currently available evidence against the chosen mode.

### Baseline evidence categories

- **design evidence**: Figma variables, styles, components, variants, frames, screenshots, or design-system context
- **implementation evidence**: repository files such as `theme.json`, `styles/*.json`, `block.json`, CSS variables, component code, patterns, templates, or existing documentation in the repo
- **reference evidence**: briefs, brand guides, governance notes, PRDs, legacy DESIGN.md files, or supporting docs

### Minimum evidence by mode

#### create-new

Prefer at least one design-evidence source and one implementation or reference source.

Proceed as:

- **sufficient** when the agent has enough evidence to derive token structure and project rationale with limited inference
- **partial** when only one major source exists but it still supports a clearly labeled provisional draft
- **insufficient** when the available evidence is too thin to create a reliable DESIGN.md package

#### create-from-partial-project

Proceed provisionally when at least one authoritative source exists and the missing areas can be labeled as inferred or unresolved.

#### update-existing

Require both:

- the existing DESIGN.md package or clear prior output to update
- at least one newer or authoritative source that justifies the update

If the update target is missing, stop and ask for the existing package or switch to create mode only when the user's request clearly allows that change.

#### audit-only

Require the current DESIGN.md package or its equivalent output artifact.

If source evidence is also available, use it to strengthen the audit. If not, still proceed with a document-only audit and label the scope clearly.

#### validation-only

Require the current DESIGN.md package or the specific file the user wants validated.

Do not broaden into full discovery unless validation fails because source verification is impossible without checking evidence.

#### source-map-only

Require at least one authoritative source plus a clear target package or target file set to map against. If the target package does not exist yet, state that the source map will be provisional.

## Routing Rules

After classifying and assessing sufficiency, route to the next workflow.

- If the task depends on source evidence from configured apps and evidence collection is still needed, use {{label:design-evidence-harvester,id:hsk_69f9620aa21c8191a8e8424624aaf39d,type:skill}} next.
- If evidence is already sufficiently present in the conversation or attached files, skip duplicate harvesting and continue directly.
- If the task is primarily about document structure or cross-file consistency after evidence is ready, use {{label:design-md-format-enforcer,id:hsk_69f966819ed48191ae4128ad836e182d,type:skill}}.
- If the task is primarily about standards, compliance, evidence quality, accessibility coverage, or WordPress mapping safety, use {{label:design-md-standards-validator,id:hsk_69f966862c8c8191941a7ba5651f4157,type:skill}}.
- If the task is audit-only or validation-only and enough input is already present, do not force a full create workflow.
- If evidence is insufficient, ask for the smallest missing authoritative source instead of guessing.

## Connected Sources To Check

When the task mentions or likely depends on configured sources, treat these as the primary evidence locations:

- {{label:Figma,id:connector_68df038e0ba48191908c8434991bbac2,type:app}} for variables, components, layout patterns, design-system intent, and screenshots
- {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}} for `theme.json`, style variations, block files, CSS variables, templates, patterns, and implementation docs
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} for briefs, brand guides, PRDs, governance notes, and other reference docs

Use only the sources needed for the chosen mode. Do not expand the search scope unnecessarily.

## Triage Output Contract

Before moving to the next workflow, produce a concise triage summary with these sections:

### 1. Request Mode

State the primary mode and any secondary requested outcomes.

### 2. Evidence Snapshot

List which evidence categories are currently available, including named connected sources when known.

### 3. Sufficiency Decision

State one of:

- `sufficient`
- `partial but usable`
- `insufficient`

Explain the decision in 2-4 bullets.

### 4. Next Workflow

Name the exact next step, including whether to:

- gather evidence
- draft or update the package
- audit the current package
- validate the current package
- ask the user for one missing input

### 5. Guardrails

List any important constraints such as:

- preserve governance notes
- label inferred values
- avoid rewriting during audit-only work
- do not broaden validation into a rewrite
- stop if the update target is missing

## Decision Checklist

Use this compact checklist every time:

1. What is the user actually asking for: create, update, audit, validate, or map?
2. Is there an existing DESIGN.md package that should be preserved or inspected?
3. Which evidence sources are already available?
4. Which missing source is truly blocking the requested outcome?
5. Should the agent proceed fully, proceed provisionally, or stop and ask for one thing?
6. Which existing downstream skill is the best next fit?

## Behavior Rules

- Prefer the narrowest correct workflow over the broadest possible one.
- Do not trigger fresh evidence harvesting when the current task can be completed from already available material.
- Do not rewrite an existing DESIGN.md package during audit-only or validation-only work unless the user explicitly asks for revision.
- Distinguish missing evidence from missing permission. If a source exists but has not been consulted yet, route to evidence gathering instead of treating it as absent.
- Distinguish verified findings from provisional assumptions.
- When proceeding with partial evidence, explicitly say what is inferred, unresolved, or recommended for follow-up.
- When the user asks for a complete output from thin evidence, downgrade to a provisional deliverable instead of presenting low-confidence material as authoritative.

## Example

**Input**

"Update the DESIGN.md for this project to reflect the newest Figma variables and theme.json changes."

**Expected triage shape**

- Request Mode: `update-existing`
- Evidence Snapshot: existing DESIGN.md package needed; Figma and GitHub are relevant authoritative sources
- Sufficiency Decision: `partial but usable` or `sufficient`, depending on whether the current package is available
- Next Workflow: gather missing evidence with {{label:design-evidence-harvester,id:hsk_69f9620aa21c8191a8e8424624aaf39d,type:skill}} if the latest Figma or repo evidence has not been checked yet, then update the package
- Guardrails: preserve project-specific sections and governance notes; label any inferred values
