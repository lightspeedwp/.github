---
title: LSX Design System Repeatable Test Context
project_name: LSX Design System
document_type: preview_validation_example
version: v0.2
last_updated: 2026-05-18
status: reusable_test_reference
---

# LSX Design System Repeatable Test Context

---

## Purpose

Use this file as a stable reference context for future previews, validation checks, and repeatable test prompts for the LSX Design System project.

This file can support two test modes:

- **context-only QA** when the run should stay inside this attached file
- **multi-source validation** when the run may verify or enrich against the live, demo, repo, Drive, and Figma references named here

---

## Core References

### Project name

LSX Design System

### Live product site

<https://lsx.design/>

### Demo site

<https://demo.lsx.design/>

### GitHub repo

<https://github.com/lightspeedwp/lsx-design-2025>

### Drive folder for specs, content, and project documentation

<https://drive.google.com/drive/folders/1UTTSaKxs8qc0mgrNyq2_Wt2c18pqSIA_?usp=drive_link>

### LSX Figma design system

<https://www.figma.com/design/U3MB5DRLxHpQDoDs2Pi2jG/-Library--LSX-DS?m=auto&node-id=0-1&t=zNuowvH4BvNuGS3i-1>

---

## Suggested Uses

- Repeatable preview tests for discovery-pack generation
- Validation of grounded references across live, demo, repo, Drive, and Figma sources
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
- verify or enrich against the live site, demo site, repo, Drive folder, and Figma design system where accessible
- keep confirmed facts, assumptions, and inferred observations clearly separated

---

## Source Priority Notes

1. Use the Drive folder for project documentation, specs, and content source material.
2. Use the live site and demo site as separate references rather than assuming they match.
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

Use `docs/preview-validation/lsx-design-system-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

### Multi-source validation seed

Use `docs/preview-validation/lsx-design-system-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, demo site, GitHub repository, Drive folder, and Figma design system named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
