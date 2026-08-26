---
title: "Master Preview QA Checklist"
description: "Master Preview QA Checklist"
document_type: preview_validation_master_checklist
version: v0.1
last_updated: '2026-08-21'
status: reusable_test_reference
---

# Master Preview QA Checklist

---

## Purpose

Use this file as the main QA reference for repeatable preview testing. It brings together:

- example context selection
- prompt selection
- output validation criteria
- failure checks
- review workflow guidance

---

## Core Reference Files

### Example contexts index

`docs/preview-validation/example-contexts-index.md`

### Prompt library

`docs/preview-validation/repeatable-preview-test-prompts.md`

### Existing validation checklist

`docs/preview-validation-checklist.md`

---

## Test Setup Checklist

Before running a preview:

- choose the correct example context
- confirm the context matches the type of test you want to run
- choose a matching prompt from the prompt library or write a narrowly scoped equivalent
- verify whether the test is checking discovery quality, formatting, delivery behavior, or safety behavior
- note any explicit wording requirements that should control delivery behavior, such as whether the word `download` is used

---

## Context Selection Guide

### Use LightSpeedWP.Agency when

- you want the richest cross-source test case
- you need live, prototype, dev, GitHub, Drive, and Figma references together
- you want a broad discovery-pack or source-intake test

### Use TourOperator.solutions when

- you want a product and tourism-oriented example
- you want live, demo, and dev comparisons
- you want a project with a single main repo and design-system reference

### Use LSX Design System when

- you want a design-system-led example
- you want live/demo/repo/Drive/Figma comparison without a dev-site dependency
- you want to test design-system discovery and governance outputs

---

## Prompt Selection Guide

Use the prompt library for repeatable tests.

Choose:

- **General Discovery Pack Prompt** for baseline structured discovery output
- **Internal Discovery Pack With Formatting Check** for Markdown framing and formatting validation
- **Follow-Up Questions Prompt** for gap and blocker extraction
- **Source Intake And Evidence Mapping Prompt** for source normalization checks
- **AI Readiness Prompt** for readiness-focused outputs
- **Technical Discovery Prompt** for implementation and technical-risk checks
- **Design-System Discovery Prompt** for Figma and system-governance checks
- **Delivery Safety Prompt** for file, link, and output-safety validation

---

## Output Validation Checklist

### Evidence quality

- Are confirmed facts clearly separated from assumptions?
- Are inferred observations clearly labeled?
- Are open questions present where key information is missing?
- Are internal notes clearly separated from shareable content?
- Did the output avoid inventing missing facts?

### Structure quality

- Did the output choose the right type of deliverable for the request?
- If a fenced Markdown block was used, was there a proper Markdown heading before it?
- Was there a short intro before the fenced block?
- Did the intro explain that the fenced block is the copyable Markdown artifact?
- Did the response include a `## Next steps` section immediately after the fenced block?
- Did `## Next steps` contain 2 to 3 concise bullets?

### Formatting quality

- Did the Markdown content begin with YAML frontmatter?
- Was there exactly one empty line after frontmatter before the document title?
- Were divider lines used between main sections?
- Was there a divider line after the final paragraph?
- Was spacing clear and easy to scan?
- Were unresolved fields left visibly unresolved instead of guessed?

### Delivery behavior

- Did the output use Markdown only rather than DOCX?
- Did it default to an inline Markdown copy block unless the user explicitly asked for a download?
- If the user explicitly used the word `download`, did the response switch to download-style behavior only when a real user-usable control was available?
- If no real download control was available, did the response avoid pretending there was one?

### Link and file safety

- Were local workspace paths fully hidden?
- Were sandbox or runtime paths fully hidden?
- Were there no fake file links?
- Were internal artifacts not presented as user-openable files?
- If no real user-usable file or URL existed, was the content presented directly instead?

---

## Failure Conditions

Treat these as preview failures:

- invented facts presented as confirmed
- mixed evidence categories without labels
- missing title or intro before a fenced Markdown block
- missing `## Next steps` after a fenced Markdown block
- `## Next steps` with fewer than 2 or more than 3 bullets
- bold text used where a real Markdown heading is required before the block
- local workspace paths shown anywhere in user-visible output
- fake file links or unusable local-path links
- download-style wording when the user did not explicitly ask for a download
- copy-block fallback omitted when no real download control exists
- DOCX or other non-Markdown delivery offered for the main deliverable

---

## Review Workflow

1. Select the example context.
2. Select the prompt.
3. Run the preview.
4. Inspect the output against this checklist.
5. Record failures as either:
   - evidence failure
   - structure failure
   - formatting failure
   - delivery failure
   - safety failure
6. Update instructions only for the specific failure class observed.
7. Re-run the same preview to verify the fix.

---

## Example Review Prompt Seed

Inspect the latest preview run output and validate it against `docs/preview-validation/master-preview-qa-checklist.md`. Identify any evidence, structure, formatting, delivery, or safety failures. Then fix only the instruction gaps needed to correct the observed failures.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
