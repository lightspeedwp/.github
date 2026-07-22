---
name: markdown-format-validator
description: Use when the task is to validate, repair, or quality-check substantial Markdown outputs, wrapper text around Markdown deliverables, or file-link presentation against the agent's formatting standard before finalizing.
---

# Markdown Format Validator

## When to use this skill

Use this skill when:

- the agent is about to return a substantial Markdown deliverable
- the agent is presenting a downloadable `.md` or `.docx` deliverable with wrapper text before or after the file link
- the user asks to review, improve, standardize, or validate Markdown formatting
- the output must comply with {{label:proposal-output-format-guide.md,id:6a05d41ba5608191812c94f38d226317,type:file}}

Do not use this skill for short ordinary chat replies that are not acting like document deliverables.

## Core standard

Read {{label:proposal-output-format-guide.md,id:6a05d41ba5608191812c94f38d226317,type:file}} first.

Treat that file as the canonical formatting standard for substantial Markdown outputs.

Validate both of these layers separately:

1. the main Markdown deliverable
2. any surrounding wrapper text shown before or after the deliverable, Markdown block, or downloadable file link

A response is only complete when both layers are presentation-ready.

## Validation workflow

1. Classify the output as one of these shapes:
   - inline substantial Markdown document
   - downloadable Markdown file with wrapper text
   - downloadable `.docx` or mixed-file handoff with wrapper text
   - document plus follow-up summary or review guidance
2. Read `references/validation-checklist.md`.
3. Check the main document against the mandatory document rules.
4. Check the wrapper text against the wrapper rules.
5. If any required element is missing or weak, revise the output before returning it.
6. Re-run the checklist mentally after revision.
7. Return only the repaired final output, not the internal checklist.

## Main document checks

For any substantial Markdown document, verify:

- valid YAML frontmatter is present at the top
- frontmatter includes `version`, `title`, `date`, `timezone`, and `status`
- there is exactly one H1 immediately below the frontmatter
- major sections use H2 headings
- divider lines `---` appear between major H2 sections
- there is a final divider line at the end of the document
- heading levels are consistent
- spacing is clean and readable
- bullets, numbered lists, tables, code blocks, and blockquotes are used intentionally
- the result looks like a finished deliverable rather than rough notes

## Wrapper text checks

When the response includes text before or after a document, Markdown block, or file link, verify:

- the wrapper is not just a loose conversational paragraph
- if the wrapper has multiple purposes, it uses clear H2 sections such as `## Deliverables`, `## What Changed`, `## Key Review Points`, or `## Next Step`
- divider lines `---` appear between major wrapper sections when more than one major section is used
- file links are presented cleanly under a clear heading
- commentary after the file link is concise, structured, and scannable
- the wrapper looks visually consistent with the quality of the main deliverable

## Repair rules

When repairing output:

- fix structural failures first
- then fix readability, spacing, and consistency issues
- prefer the simplest compliant structure over decorative formatting
- keep the user's requested content intact unless the formatting problem requires restructuring for clarity
- if the wrapper is short, keep it elegant rather than overbuilding it
- if the wrapper serves several purposes, turn it into a small polished Markdown handoff rather than casual chat text

## Output

Do not describe the validation process unless the user asked for an audit.

Normally return only the corrected deliverable or corrected handoff.

If the user explicitly asked for a review, provide:

- a short verdict
- the most important formatting failures or fixes
- the corrected output or the concrete changes needed

## Supporting Files

- `references/validation-checklist.md`: Use this checklist to validate both the main Markdown document and any surrounding wrapper text before finalizing.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
