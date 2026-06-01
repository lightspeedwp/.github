---
name: design-md-format-enforcer
description: Use when the task requires enforcing or restoring consistent output structure, section order, heading conventions, evidence labeling, and file-to-file formatting consistency across DESIGN.md, design-md-source-map.md, and design-md-validation-report.md.
---

# DESIGN.md Format Enforcer

Use this skill when the agent is drafting, updating, normalizing, or cleaning the structure of `DESIGN.md`, `design-md-source-map.md`, or `design-md-validation-report.md`.

This skill is for formatting discipline and document-shape consistency. It does not decide whether the underlying evidence is sufficient. When the task depends on reconciling evidence first, use the existing evidence-gathering workflow before applying this skill.

## When to Use

Use this skill when the user asks to:

- create or update one of the design-system documents in a consistent format
- normalize an inconsistent or partially structured document
- make outputs easier for coding agents or reviewers to parse
- keep `DESIGN.md`, `design-md-source-map.md`, and `design-md-validation-report.md` aligned in terminology and section structure

Skip this skill when the request is only about evidence gathering or when the user wants raw notes rather than standardized project artifacts.

## Core Responsibilities

1. Enforce stable section order and heading hierarchy.
2. Keep naming and labels consistent across all three documents.
3. Distinguish verified, inferred, missing, and conflicted information using clear repeated conventions.
4. Preserve project-specific sections while bringing the overall document back into a standard shape.

## Global Formatting Rules

Apply these rules across all three files unless the user explicitly overrides them:

- Use Markdown headings with a clear hierarchy and no skipped heading levels.
- Prefer short descriptive headings over decorative prose.
- Keep terminology stable across files for the same token groups, components, and evidence buckets.
- Use bullet lists or tables only when they improve scanability; do not mix several shapes for the same kind of data in the same document.
- Use fenced code blocks only for structured snippets, schema-like examples, or implementation mappings that benefit from fixed formatting.
- Keep each section focused on one job: system definition, evidence traceability, or validation results.
- Preserve existing project-specific notes, governance sections, and explicit approvals unless removal is requested.

## File-Specific Structure

### 1. `DESIGN.md`

Default target shape:

1. title and project identity
2. summary or description
3. version or status when available
4. visual-system and token sections
5. component guidance
6. WordPress or implementation mapping guidance when relevant
7. accessibility or usage constraints
8. open questions, gaps, or follow-up items when needed

Formatting expectations:

- Keep token sections grouped consistently, such as color, typography, spacing, radius, effects, and components.
- Separate design rules from rationale.
- Keep implementation mappings distinct from source evidence notes.
- Mark inferred values explicitly instead of blending them into verified definitions.

### 2. `design-md-source-map.md`

Default target shape:

1. evidence summary
2. source coverage by system
3. normalized token and component mappings
4. conflicts and resolutions
5. missing evidence or weak coverage
6. drafting readiness or next-step notes

Formatting expectations:

- Group mappings by domain rather than by discovery order.
- Keep each mapping traceable back to Figma, GitHub, or Google Drive evidence.
- Use a repeatable pattern for each mapped item, such as source, normalized label, implementation counterpart, and notes.
- Keep conflict documentation visually separate from confirmed mappings.

### 3. `design-md-validation-report.md`

Default target shape:

1. validation summary
2. pass/fail or severity overview
3. findings by standards area
4. unsupported assumptions and evidence gaps
5. risks and follow-up actions
6. release readiness or confidence statement

Formatting expectations:

- Keep findings concise and scannable.
- Use consistent severity labels for critical, major, minor, or informational issues.
- Separate formatting issues from standards or evidence issues.
- Make remediation guidance easy to lift into follow-up work.

## Cross-File Consistency Rules

When multiple files are produced together:

- Keep section names aligned where the underlying concept is the same.
- Keep normalized token labels and component names identical across files.
- Ensure conflicts listed in the source map are reflected consistently in the validation report when they create risk.
- Ensure `DESIGN.md` does not claim certainty where the source map or validation report documents uncertainty.
- If one file uses a defined evidence-status vocabulary, reuse it in the others.

## Repair Rules

When fixing a messy or inconsistent draft:

1. preserve meaning before improving presentation
2. restore heading hierarchy
3. normalize repeated section labels
4. merge duplicate sections only when their content is genuinely redundant
5. isolate mixed content so evidence, design rules, and validation results are not blended together
6. keep project-specific content, but move it into the most appropriate standardized section

## Output Contract

When this skill is active, prefer outputs that are:

- structurally predictable
- easy to diff over time
- explicit about evidence status
- consistent across the three companion files

If the source material is too incomplete to fully populate a section, keep the section and label the gap clearly rather than deleting the structure entirely.

## Example Triggers

- "Standardize the formatting of the current DESIGN.md and make the validation report match it."
- "Rewrite this source map into the expected structure without changing the underlying findings."
- "Create all three design-system docs in a consistent format for agent and human review."
