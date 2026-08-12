---
title: TourOperator.solutions Repeatable Test Context
project_name: TourOperator.solutions
document_type: preview_validation_example
version: v0.2
last_updated: 2026-05-18
status: reusable_test_reference
---

# TourOperator.solutions Repeatable Test Context

---

## Purpose

Use this file as a stable reference context for future previews, validation checks, and repeatable test prompts for the TourOperator.solutions project.

This file can support two test modes:

- **context-only QA** when the run should stay inside this attached file
- **multi-source validation** when the run may verify or enrich against the live, demo, dev, repo, Drive, and Figma references named here

---

## Core References

### Project name

TourOperator.solutions

### Live product site

<https://touroperator.solutions/>

### Demo site

<https://tourpress.pro/>

### Dev site

<https://touroperator-solutions.lightspeedwp.dev/>

### GitHub repo

<https://github.com/lightspeedwp/touroperator-solutions-2025>

### Drive folder for specs, content, and project documentation

<https://drive.google.com/drive/folders/1rygt8TXj0-26u9yi3j_suf5PdsC37XPH?usp=drive_link>

### Tour Operator Figma design system

<https://www.figma.com/design/1wiwltz5a0og0YIoKsuPmn/-Library--TO-DS?node-id=0-1&t=H5LKavfymr9XzKa8-1>

---

## Suggested Uses

- Repeatable preview tests for discovery-pack generation
- Validation of grounded references across live, demo, dev, repo, Drive, and Figma sources
- Example context for testing source-intake, evidence gathering, and follow-up-question outputs
- Stable seed context for formatting and delivery checks in preview runs

---

## Recommended Test Modes

### Context-only QA

Use this mode when you want strict repeatability.

In this mode:

- stay inside this attached file
- treat the listed URLs and systems as named references only
- keep unsupported fields unresolved
- do not broaden into external verification

### Multi-source validation

Use this mode when you want richer discovery grounded in accessible external evidence.

In this mode:

- use this file as the starting context
- verify or enrich against the live site, demo site, dev site, repo, Drive folder, and Figma design system where accessible
- keep confirmed facts, assumptions, and inferred observations clearly separated

---

## Source Priority Notes

1. Use the Drive folder for project documentation, specs, and content source material.
2. Use the live site, demo site, and dev site as separate references rather than assuming they match.
3. Use the GitHub repository when technical implementation evidence is needed.
4. Use the Figma design system when design-system or interface evidence is needed.
5. Keep confirmed facts separate from assumptions when different sources diverge.

---

## Known Boundaries

- This file is a reusable reference context, not a complete discovery brief.
- The file identifies likely evidence locations, but it does not confirm what those sources currently contain.
- In context-only QA runs, the linked systems should be treated as references rather than inspected evidence.
- In multi-source runs, any blocked or inaccessible source should remain explicitly unresolved rather than guessed.

---

## Example Prompt Seeds

### Context-only QA seed

Use `docs/preview-validation/touroperator-solutions-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

### Multi-source validation seed

Use `docs/preview-validation/touroperator-solutions-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, demo site, dev site, GitHub repository, Drive folder, and Figma design system named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
