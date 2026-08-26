---
title: "Preview Run Comparison Guide"
description: "Preview Run Comparison Guide"
document_type: preview_validation_comparison_guide
version: v0.3
last_updated: '2026-08-21'
status: reusable_test_reference
---

# Preview Run Comparison Guide

---

## Purpose

Use this guide to compare two preview runs side by side, especially when testing the difference between:

- **context-only QA** runs
- **multi-source validation** runs

This file helps reviewers confirm whether the prompt mode is controlling evidence scope, output behavior, and repeatability as intended.

---

## Validated Examples

The prompt split has already been validated on these example contexts:

- **LightSpeedWP.Agency**
  - context-only QA run stayed inside the attached example file and preserved unresolved fields conservatively
  - multi-source validation run broadened into accessible live, Drive, GitHub, and Figma evidence
- **TourOperator.solutions**
  - context-only QA run stayed inside the attached example file and treated named URLs and assets as references rather than inspected evidence
- **LSX Design System**
  - context-only QA run stayed inside the attached example file and treated the live site, demo site, GitHub repo, Drive folder, and Figma file as named references rather than inspected evidence

Use these as known-good reference cases when checking whether future prompt-split tests are behaving correctly.

---

## Recommended Comparison Pair

The most useful comparison pattern is:

1. Run a **context-only QA** preview using one example-context file.
2. Run a **multi-source validation** preview using the same example-context file.
3. Compare the outputs against this guide.

This creates a clean before-and-after pair using the same project context but different evidence-scope rules.

---

## What Should Stay The Same

Across both runs, these things should usually stay consistent:

- the same core project context
- the same requested output type
- the same evidence-labeling discipline
- the same formatting rules
- the same delivery style
- the same safety rules about fake links, local paths, and unsupported claims

If these change, the difference may reflect a formatting or instruction issue rather than the intended prompt-mode split.

---

## What Should Change Between Modes

### Context-only QA run

This run should:

- stay inside the attached example-context file
- avoid connected-app lookups unless explicitly allowed
- avoid live verification unless explicitly allowed
- preserve unresolved fields as unresolved
- behave conservatively and maximize repeatability

Expected signals:

- explicit wording that the run is grounded in the attached file only
- explicit wording that no broader lookups or verification were added
- fewer confirmed details beyond what is named in the example-context file
- more clearly unresolved sections and open questions

### Multi-source validation run

This run may:

- verify or enrich against accessible live pages
- use connected evidence such as Drive, GitHub, or Figma when relevant
- compare sources against each other
- produce richer findings where evidence is accessible

Expected signals:

- explicit mention of reviewed or verified external sources
- more specific confirmed facts
- more detailed findings in areas like content, technical implementation, design, or source-of-truth conflicts
- a visible `Evidence lookups used` section when broader lookups were performed

---

## Side-By-Side Review Checklist

### 1. Evidence scope

Check:

- Did the context-only run stay inside the attached example file?
- Did the multi-source run broaden only when the prompt allowed it?
- Did each run behave according to its intended scope?

### 2. Evidence labeling

Check:

- Are confirmed facts clearly separated from assumptions?
- Are inferred observations clearly labeled?
- Are open questions present where evidence is thin?
- Are internal notes clearly separated?

### 3. Formatting consistency

Check:

- Do both runs use a real Markdown heading before any fenced block?
- Do both runs explain that the fenced block is the copyable Markdown artifact?
- Do both runs include `## Next steps` after the fenced block?
- Do both runs preserve YAML frontmatter and clean Markdown structure?

### 4. Delivery behavior

Check:

- Are both runs delivered as Markdown rather than DOCX?
- Are both runs presented inline unless a real download was explicitly requested?
- Are fake file links, local paths, and sandbox paths fully absent?

### 5. Repeatability control

Check:

- Would the context-only run remain stable if repeated later?
- Is the multi-source run reasonably allowed to vary over time because its external evidence can change?
- Is that difference visible and understandable rather than accidental?

---

## Comparison Notes Template

Use this short structure when recording a comparison:

### Compared context

- Example file used:
- Context-only run date:
- Multi-source run date:

### Same across both runs

-
-
-

### Context-only QA behavior observed

-
-
-

### Multi-source validation behavior observed

-
-
-

### Key difference that proves the prompt split worked

-

### Problems or drift still observed

-

### Recommended next action

-

---

## Pass Criteria For Prompt-Split Testing

Treat the prompt split as working when:

- the **context-only** run stays inside the file-bounded evidence scope
- the **multi-source** run clearly broadens only when allowed
- both runs still follow the same formatting and safety rules
- the difference between the two runs is meaningful, visible, and attributable to prompt mode rather than random behavior

---

## Failure Signs

Treat these as prompt-split failures or drift signals:

- the context-only run performs broader evidence lookups without permission
- the multi-source run stays artificially shallow when broader evidence is accessible and clearly requested
- one mode changes formatting behavior unexpectedly
- one mode weakens evidence labeling discipline
- the two runs are effectively identical when they should differ in evidence scope
- the two runs differ in unrelated ways that obscure whether the prompt split is actually working

---

## Recommended Related Files

Use this guide together with:

- `docs/preview-validation/example-contexts-index.md`
- `docs/preview-validation/repeatable-preview-test-prompts.md`
- `docs/preview-validation/master-preview-qa-checklist.md`
- `docs/preview-validation/file-inventory-summary.md`

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
