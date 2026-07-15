# Proposal Output Format Guide

## Purpose

This file defines the default formatting standard for substantial Markdown outputs produced by Proposal Desk.

Use it when drafting proposal packs, intake briefs, executive summaries, review packs, gap trackers, internal follow-ups, and other document-style deliverables that should be ready to copy into a formal internal or client-facing document.

## Agent-Specific Intent

Proposal Desk should produce polished, document-ready Markdown that is:

- **consistent**
- **highly structured**
- **easy to scan**
- **easy to copy into a formal document with minimal cleanup**
- **suitable for internal working documents and client-ready first-pass deliverables**

The agent is responsible for both the content and the presentation quality.

## Output Goal

Create a clean, professional, multi-stage brief or proposal-style document in Markdown.

The output should feel deliberate, publication-ready, and structured tightly enough that a human reviewer can:

- scan it quickly
- understand the progression of the work
- identify gaps and next actions
- reuse it directly in a working document or proposal draft

## When This Guide Applies

Apply this guide by default when the output is a substantial Markdown deliverable, including:

- intake summaries
- multi-stage briefs
- executive summaries
- full response packs
- draft proposal sections
- gap and blocker trackers
- review notes packs
- internal follow-up packs
- other structured discovery or proposal artefacts

If the user explicitly asks for a different format, follow the user’s requested format instead.

## Mandatory Document Structure

For substantial Markdown deliverables, always use this order:

1. YAML frontmatter at the very top
2. one main H1 heading immediately below the frontmatter
3. body content organised into major sections using H2 headings
4. one horizontal divider line between every major H2 section
5. one final horizontal divider line at the very end of the document

Do not place any text above the YAML frontmatter.

## Frontmatter Placement Rule

The frontmatter is **mandatory** for substantial document-style Markdown outputs.

Use it above the main H1 every time.

Never start a substantial document with the H1 first.

Correct order:

```md
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---

# Document Title
```

Incorrect order:

```md
# Document Title
---
version: 1.0.0
...
```

## YAML Frontmatter Rules

Always include valid YAML frontmatter enclosed by triple dashes.

Required fields:

- `version`
- `title`
- `date`
- `timezone`
- `status`

Use this structure:

```yaml
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---
```

### Frontmatter Notes

- Use a real version value, never a placeholder.
- The title should match the document’s purpose closely.
- Use the current date in `YYYY-MM-DD` format.
- Default timezone is `Africa/Johannesburg`.
- Default status is `draft` unless the user clearly requests another status.

## Versioning Rules

Every time a document is created or regenerated, update the version.

- If no earlier version exists, start at `1.0.0`.
- If an earlier version exists, increment the version.
- Use semantic versioning judgment:
  - **major**: major changes
  - **minor**: moderate structural or content revisions
  - **patch**: minor edits or formatting refreshes
- Never omit the version field.
- Never leave the version as a placeholder.

## Heading Rules

### Main Heading

- Place exactly one H1 immediately below the YAML frontmatter.
- The H1 should closely match the document title.
- Do not use more than one H1 in the full document.

### Section Headings

- Use H2 headings for all major sections.
- Use H3 headings only for subsections inside a major section.
- Keep heading levels consistent.
- Use headings to improve scanability, not decoration.
- Treat each H2 as a true document section, not as a casual label.

## Divider Rules

Use a horizontal divider line written exactly as:

```md
---
```

Rules:

- place one divider line between every major H2 section
- place one divider line immediately before each new H2 section after the first
- place one final divider line at the very end of the document
- do not omit the final divider

## Markdown Formatting Rules

Use Markdown deliberately and consistently.

### Lists

- Use bullet lists for grouped items that are not sequential.
- Use numbered lists only when order matters.
- Keep list style consistent within a section.
- Prefer bullets over dense prose when naming risks, owners, assumptions, actions, or review points.

### Emphasis

- Use **bold** for key labels, major decisions, important takeaways, status words, owner labels, and critical terms.
- Use *italics* sparingly for nuance, commentary, light caution, or short framing emphasis.
- Prefer **bold lead-in labels** when several short points appear in sequence.
- Do not overuse bold or italics.

### Blockquotes

Use blockquotes only for:

- quoted instructions
- source statements
- notable framing lines

### Code Blocks

Use code blocks only when showing:

- literal text to reuse
- templates
- commands
- structured examples

### Tables

Use tables only when they genuinely improve clarity.

Good uses include:

- comparing options
- summarising responsibilities
- showing status by section
- grouping gaps, owners, and priorities

## Spacing and Readability Rules

Keep spacing clean and deliberate.

- Leave one blank line after headings.
- Leave one blank line before and after divider lines.
- Leave one blank line between paragraphs and lists where needed.
- Leave one blank line between the closing frontmatter marker and the H1.
- Avoid dense walls of text.
- Prefer paragraphs of roughly 4 to 6 lines or fewer when practical.
- Break large sections into subsections, bullets, or tables when that improves clarity.

## Style and Presentation Rules

Every substantial deliverable should feel polished and finished.

- Make the layout easy to scan quickly.
- Give each section a clear purpose.
- Use structure to create emphasis instead of excessive bolding.
- Remove filler language.
- Convert rough ideas into polished working-document language.
- Do not produce raw notes unless the user explicitly asks for them.
- Keep formatting consistent across the entire document.

## Multi-Stage Brief Rules

When the task naturally involves multiple stages, show the progression clearly.

Reflect the evolution of the work when:

- the user previously asked for additional information
- clarification changed the direction of the brief
- the deliverable moved from intake to revision to final structure

Useful section patterns may include:

- `## Initial Brief`
- `## Clarifications Requested`
- `## Revised Brief`
- `## Final Structured Brief`
- `## Open Questions`
- `## Recommendations`

If different stage names fit the task better, keep the sequencing intentional and easy to follow.

## Proposal Desk Default Section Pattern

When the user asks for a full proposal pack and no stronger structure is required by the source artefact, default to:

- `## Intake Summary`
- `## Executive Summary`
- `## Recommended Response Structure`
- `## Draft Response`
- `## Gaps and Open Questions`
- `## Internal Follow-Ups`
- `## Review Notes`
- `## Relevant References Collected During Onboarding`

If the client or source artefact provides a required structure, preserve that structure instead.

## Quality Control Checklist

Before finalising any substantial Markdown deliverable, silently check that:

1. YAML frontmatter is present and valid.
2. The frontmatter appears above the main H1.
3. The version has been updated.
4. There is exactly one H1 under the frontmatter.
5. Every major section is separated by a divider line.
6. There is a divider line at the end of the document.
7. Heading levels are consistent.
8. Bullets and numbering are used correctly.
9. Bold and italics are used intentionally and not excessively.
10. The document is easy to copy and paste into another document.
11. The output looks like a finished deliverable, not a rough draft.

## Failure Conditions To Avoid

Do not:

- omit the YAML frontmatter
- place the H1 above the frontmatter
- forget to update the version
- place any text above the frontmatter
- skip the main H1 heading
- skip divider lines between major sections
- skip the final divider at the bottom
- use inconsistent Markdown
- output unstructured text dumps
- produce formatting that looks casual, incomplete, or improvised

## Default Expectation

When in doubt, choose the more structured, more readable, and more polished presentation.

The final output should look like a carefully formatted document, not a casual chat reply.
