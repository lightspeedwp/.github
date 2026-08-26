---
title: "Preview Validation File Inventory Summary"
description: "Preview Validation File Inventory Summary"
document_type: preview_validation_inventory
version: v0.2
last_updated: '2026-08-21'
status: reusable_test_reference
---

# Preview Validation File Inventory Summary

---

## Purpose

Use this one-page summary as the fastest overview of the preview-validation file set attached to the agent.

It shows:

- the three example context files
- the shared index
- the repeatable prompt library
- the master QA checklist
- the run comparison guide
- the older related checklist reference

---

## Example Context Files

### `docs/preview-validation/lightspeedwp-agency-example.md`

**Project:** LightSpeedWP.Agency  
**Use for:** rich cross-source agency discovery testing  
**Includes:** live site, Figma prototype site, dev site, GitHub repos, Drive folder, Figma design system, Figma Make prototype  
**Best for:** context-only QA or multi-source validation on the broadest example set

### `docs/preview-validation/touroperator-solutions-example.md`

**Project:** TourOperator.solutions  
**Use for:** tourism and product-oriented discovery testing  
**Includes:** live site, demo site, dev site, GitHub repo, Drive folder, Figma design system  
**Best for:** context-only QA or multi-source validation on a second, narrower project example

### `docs/preview-validation/lsx-design-system-example.md`

**Project:** LSX Design System  
**Use for:** design-system-led discovery and governance testing  
**Includes:** live site, demo site, GitHub repo, Drive folder, Figma design system  
**Best for:** context-only QA or multi-source validation centered on design-system evidence

---

## Shared Navigation And Prompt Files

### `docs/preview-validation/example-contexts-index.md`

**Purpose:** main index of all three example contexts  
**Includes:**

- mode-selection guidance
- context-only QA versus multi-source validation guidance
- file-by-file usage notes
- prompt-seed examples

### `docs/preview-validation/repeatable-preview-test-prompts.md`

**Purpose:** reusable prompt library for preview runs  
**Includes:**

- Mode A: context-only QA prompts
- Mode B: multi-source validation prompts
- context-specific prompt seeds for all three example files

---

## QA And Review Files

### `docs/preview-validation/master-preview-qa-checklist.md`

**Purpose:** main QA checklist for repeatable preview testing  
**Includes:**

- setup checklist
- context selection guide
- prompt selection guide
- output validation checklist
- failure conditions
- review workflow

### `docs/preview-validation/run-comparison-guide.md`

**Purpose:** side-by-side comparison guide for context-only QA and multi-source validation runs  
**Includes:**

- what should stay the same across both modes
- what should change between modes
- comparison checklist
- pass criteria and failure signs

### `docs/preview-validation-checklist.md`

**Purpose:** older related validation checklist already attached to the agent  
**Use for:** supporting reference alongside the newer master QA checklist

---

## Recommended Reading Order

1. Start with `docs/preview-validation/example-contexts-index.md`
2. Choose one example context file
3. Use `docs/preview-validation/repeatable-preview-test-prompts.md` to pick the right test mode and kickoff prompt
4. Review the output against `docs/preview-validation/master-preview-qa-checklist.md`
5. Use `docs/preview-validation/run-comparison-guide.md` when comparing context-only and multi-source runs side by side
6. Use `docs/preview-validation-checklist.md` only as a secondary or legacy companion reference

---

## Quick Summary

Current preview-validation package:

- 3 example context files
- 1 shared example-context index
- 1 repeatable preview prompt library
- 1 master QA checklist
- 1 run comparison guide
- 1 older related checklist reference

This gives the agent a complete reusable test set for:

- strict context-only QA runs
- broader multi-source validation runs
- formatting and delivery checks
- evidence-discipline checks
- repeatable preview review workflows
- side-by-side mode comparison

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
