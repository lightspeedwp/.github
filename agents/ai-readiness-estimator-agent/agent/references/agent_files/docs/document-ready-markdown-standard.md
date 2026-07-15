# Document-Ready Markdown Standard for AI Readiness Outputs

## Purpose

Use this file as the formatting standard for polished outputs created by the **AI Readiness Estimator**.

Apply these rules whenever the user wants a document-ready result, including:
- AI readiness estimates
- proposal-ready briefs
- structured audit outputs
- internal working documents
- client-ready summaries
- standard cover emails when the user asks for a formal document format

The goal is to produce Markdown that is clean, consistent, easy to scan, and ready to copy into a formal internal or client-facing document with minimal cleanup.

## Core Output Goal

Create a professional, highly structured Markdown document that:
- reads like a finished deliverable rather than a chat reply
- uses consistent formatting from top to bottom
- makes key information easy to find quickly
- reflects the progression of the work when the brief evolved across stages
- stays polished enough for proposal, audit, or client-ready use

## When To Use This Standard

Use this standard when the user asks for output such as:
- a polished brief
- a structured working document
- a client-ready Markdown document
- a formal internal document
- a multi-stage brief
- a revised brief that should show how the work evolved

If the user asks for a lightweight conversational answer instead, do not force this full document structure.

## Mandatory Document Order

Every qualifying document must use this order:

1. YAML frontmatter at the very top
2. one standalone `---` divider immediately below the frontmatter
3. one H1 immediately below that divider
4. body content organised into major H2 sections
5. a `---` divider between every major H2 section
6. a final `---` divider at the very end of the document

Do not place any text above the YAML frontmatter.

Do not include more than one H1.

## YAML Frontmatter Rules

Always place valid YAML frontmatter at the top of the document using triple-dashed lines.

Required fields:
- `version`
- `title`
- `date`
- `timezone`
- `status`

Default structure:

```yaml
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---
```

### Frontmatter Defaults

Unless the user specifies otherwise:
- use timezone `Africa/Johannesburg`
- use status `draft`
- use a title that matches the actual document purpose closely
- use the correct current date for the document date field

## Versioning Rules

Apply versioning deliberately.

- If no previous version exists, start at `1.0.0`.
- If the document is regenerated or revised, increment the version.
- Use this default logic:
  - **major changes** -> increment the first number
  - **moderate structural or content revisions** -> increment the second number
  - **minor wording or formatting refreshes** -> increment the third number
- Never omit the version field.
- Never leave the version as a placeholder.

## Heading Rules

Use heading levels consistently.

- Use exactly one H1 in the document.
- Make the H1 closely match the frontmatter title.
- Use H2 headings for all major sections.
- Use H3 headings only for subsections inside a major section.
- Do not skip heading levels.

## Divider Rules

Use `---` as the section divider.

Requirements:
- place one standalone divider immediately after the closing frontmatter fence and before the H1
- place one divider between every major H2 section
- place one final divider at the very bottom of the document
- keep one blank line before and after each divider

## Markdown Formatting Rules

Use Markdown deliberately and only where it improves readability.

### Use headings and lists well

- Use bullet lists for grouped items that are not sequential.
- Use numbered lists only when order matters.
- Break content into readable sections rather than dense text blocks.

### Use emphasis carefully

Use **bold** for:
- key labels
- key decisions
- important takeaways
- section-critical terms

Use *italics* sparingly for nuance or light emphasis.

### Use special formatting only when justified

Use blockquotes only for:
- quoted instructions
- source statements
- notable framing lines

Use code blocks only for:
- literal text to reuse
- templates
- commands
- structured examples

Use tables only when they genuinely make the document clearer.

## Spacing And Readability Rules

Keep the layout easy to scan.

- Leave one blank line after headings.
- Leave one blank line before and after divider lines.
- Leave one blank line between paragraphs and lists where readability benefits.
- Avoid dense paragraphs longer than roughly 4 to 6 lines when possible.
- Avoid inconsistent bullet styles, uneven spacing, or sloppy heading structure.

## Style And Presentation Rules

Every document should feel deliberate and publication-ready.

- Keep formatting consistent from section to section.
- Let structure carry emphasis rather than excessive bolding.
- Avoid filler and casual chat phrasing.
- Convert rough notes into polished document language.
- Do not output raw notes unless the user explicitly asks for them.
- Ensure the final result feels ready for internal review or client sharing.

## Multi-Stage Brief Rules

When the work happened across multiple stages, make that progression visible in the document.

For example, use sections such as:
- **Initial Brief**
- **Clarifications Requested**
- **Revised Brief**
- **Final Structured Brief**
- **Open Questions**
- **Recommendations**

If different stage names are more appropriate, keep the progression explicit, logical, and easy to follow.

Reflect the evolution of the brief when:
- additional information was requested
- earlier assumptions were corrected
- the recommendation changed after review
- the final document consolidates prior stages into a cleaner version

## Tailoring For This Agent

Because this agent produces AI readiness estimates, package recommendations, audit outputs, and standard client communications, apply these additional preferences when relevant.

### For estimates and proposal-ready documents

Prioritise clear separation between:
- **Assessment Summary**
- **Recommended Base Package**
- **Included Scope**
- **Excluded Scope**
- **Recommended Add-ons**
- **Values Still Needed**
- **Scope Risks / Custom-Scope Triggers**
- **Next Step**

### For multi-stage estimate or audit work

If the estimate or brief evolved over several interactions, make that progression visible instead of collapsing everything into a single flat response.

### For client-ready outputs

Use polished, practical language that reads well in a formal LightSpeed working document.

Keep the output structured and clean enough to paste into:
- a proposal draft
- an internal scoping document
- an audit summary
- a client-ready working file

## Quality Control Checklist

Before finalising a document, silently confirm that:

1. valid YAML frontmatter is present
2. the version is concrete and updated appropriately
3. there is a standalone `---` divider immediately after the frontmatter
4. there is exactly one H1 directly below that divider
5. each major H2 section is separated by `---`
6. a final `---` appears at the end of the document
7. heading levels are consistent
8. bullets and numbering are used correctly
9. bold and italics are used intentionally and not excessively
10. the document is easy to copy into another document
11. the output looks like a finished deliverable rather than rough notes

## Failure Conditions To Avoid

Do not:
- omit the YAML frontmatter
- forget to update the version
- place text above the frontmatter
- skip the required divider between the frontmatter and the H1
- skip the main H1
- skip divider lines between major sections
- skip the final divider at the bottom
- use inconsistent Markdown structure
- output a wall of unstructured text
- produce formatting that feels casual, incomplete, or improvised

## Default Decision Rule

When in doubt, choose the more structured, more readable, and more polished presentation.

The final output should look like a carefully formatted document, not a chat response.