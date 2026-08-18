---
title: LightSpeedWP.Agency Repeatable Test Context
project_name: LightSpeedWP.Agency
document_type: preview_validation_example
version: v0.2
last_updated: 2026-05-18
status: reusable_test_reference
---

# LightSpeedWP.Agency Repeatable Test Context

---

## Purpose

Use this file as a stable reference context for future previews, validation checks, and repeatable test prompts for the LightSpeedWP.Agency project.

This file can support two test modes:

- **context-only QA** when the run should stay inside this attached file
- **multi-source validation** when the run may verify or enrich against the live, repo, Drive, and Figma references named here

---

## Core References

### Project name

LightSpeedWP.Agency

### Live agency site

<https://lightspeedwp.agency

### Figma prototype site

<https://lightspeedwp.figma.site

### Dev site

<https://ls-agency.lightspeedwp.dev/

### GitHub theme repo

<https://github.com/lightspeedwp/ls-theme

### GitHub plugin repo

<https://github.com/lightspeedwp/ls-plugin

### Drive folder for specs, content, and project documentation

<https://drive.google.com/drive/folders/1GqKn_lys_AfPnwI-m3k00C5j0Um6TKAz?usp=drive_link

### Figma design system

<https://www.figma.com/design/OTqchq3sRBzUy6TICruzc3/LightSpeedWP-Design-System?m=auto&t=CTYQGLlYaOao2LYR-6

### Figma Make prototype

<https://www.figma.com/make/xAYHN3wsPM4TR2JppUr8sp/LightSpeedWP.Agency?t=CTYQGLlYaOao2LYR-6

---

## Suggested Uses

- Repeatable preview tests for discovery-pack generation
- Validation of grounded references across live, prototype, dev, GitHub, Drive, and Figma sources
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
- verify or enrich against the live site, prototype site, dev site, GitHub repos, Drive folder, and Figma references where accessible
- keep confirmed facts, assumptions, and inferred observations clearly separated

---

## Source Priority Notes

1. Use the Drive folder for project documentation, specs, and content source material.
2. Use the live site, prototype site, and dev site as separate references rather than assuming they match.
3. Use the GitHub repositories when technical implementation evidence is needed.
4. Use the Figma design system and Figma Make prototype when design or prototype evidence is needed.
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

Use `docs/preview-validation/lightspeedwp-agency-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal LightSpeed notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

### Multi-source validation seed

Use `docs/preview-validation/lightspeedwp-agency-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, Figma prototype site, dev site, GitHub repositories, Drive folder, and Figma references named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal LightSpeed notes. Do not invent missing facts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
