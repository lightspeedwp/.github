---
title: Repeatable Preview Test Prompts
document_type: preview_validation_prompt_library
version: v0.3
last_updated: 2026-05-18
status: reusable_test_reference
---

# Repeatable Preview Test Prompts

---

## Purpose

Use this file as a reusable prompt library for preview runs. These prompts are designed to work with the indexed example contexts in `docs/preview-validation/example-contexts-index.md` and the individual example files in the same folder.

This library is split into two test modes:

- **context-only QA tests** for controlled, repeatable runs grounded primarily in the attached example-context files
- **broader multi-source validation tests** for runs that are allowed to verify, enrich, or compare against live and connected sources

The example files themselves now also include context-specific seeds and boundaries. Use this library for reusable kickoff wording, and use the selected example file when you need the project-specific version.

---

## How To Use

1. Pick one example context from `docs/preview-validation/example-contexts-index.md`.
2. Read that example file first if you need its project-specific boundaries, known limits, or built-in prompt seeds.
3. Decide whether the run should be a **context-only QA test** or a **broader multi-source validation test**.
4. Use the matching prompt below as the preview kickoff message.
5. Check the output for structure, evidence handling, formatting, delivery behavior, and source discipline.
6. Compare the result against the master QA checklist.

---

## Mode A: Context-Only QA Tests

Use these prompts when the goal is strict repeatability, controlled scope, and reliable QA comparison across reruns.

In this mode, the agent should treat the named preview-validation file as the primary evidence source and should not expand into connected apps or broader live-source verification unless the prompt explicitly says to do so.

---

## Context-Only General Discovery Pack Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Treat the file as the primary evidence source for this run. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope unless the prompt explicitly asks for live or connected-source validation.

---

## Context-Only Formatting Check Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Present the main deliverable as Markdown only. Use a proper Markdown heading before any fenced Markdown block, include a short intro before the block, explicitly say that the fenced block is the copyable Markdown artifact, and add a `## Next steps` section with 2 to 3 concise bullets after the block. Do not invent missing facts. Do not expand into external evidence.

---

## Context-Only Follow-Up Questions Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Review the available references in that file only and produce a focused follow-up questions document that highlights the most important unresolved gaps, missing owners, missing technical context, and decisions still needed before planning can continue. Do not expand into connected apps or live verification.

---

## Context-Only Source Intake And Evidence Mapping Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Normalize the sources named in that file into a structured intake summary. Identify which sources are listed, what each source appears to represent, and where the strongest source of truth is likely to live for each major discovery area. Do not verify the sources externally in this run.

---

## Context-Only AI Readiness Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Produce an internal AI-readiness-oriented discovery summary from that file only. Identify what appears usable for future AI features, what looks risky or under-governed, what evidence is still missing, and what should be validated before any chatbot or AI-assisted feature planning moves forward. Do not expand into external evidence.

---

## Context-Only Technical Discovery Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Focus on the technical discovery side only using that file as the primary evidence source. Summarize likely implementation evidence, environment differences, repository relevance, unknown technical ownership, deployment or hosting unknowns, and the highest-priority technical follow-up questions. Do not perform broader technical verification in this run.

---

## Context-Only Design-System Discovery Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Focus on design-system and interface-governance discovery using that file only. Summarize the likely relationship between live experience, demo or prototype references, repository implementation, Drive documentation, and Figma design-system assets as described in the file. Separate confirmed evidence from assumptions and identify the most important system-governance questions. Do not verify external sources directly in this run.

---

## Context-Only Delivery Safety Prompt

Use `docs/preview-validation/<chosen-example>.md` as the grounded source for this preview. Build the smallest useful internal discovery output from that file only. Present it in the safest user-usable format for this interface. Never show local workspace paths, sandbox paths, runtime paths, or fake file links. If a real user-usable file control is not available, present the content directly.

---

## Mode B: Broader Multi-Source Validation Tests

Use these prompts when the goal is to let the agent verify, enrich, compare, or challenge the attached example context using broader accessible evidence such as live pages, repositories, connected documents, and design tools.

In this mode, broader evidence gathering is allowed when it materially improves the result. The output should still keep confirmed facts, assumptions, and inferred observations clearly separated.

---

## Multi-Source General Discovery Pack Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Build a structured internal discovery pack using the sources named in that file. Where accessible, verify or enrich the output against live pages, repository evidence, connected documents, and design references. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

---

## Multi-Source Validation And Comparison Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Compare the attached example context against any accessible live, repo, document, and design evidence named in that file. Highlight where the sources align, where they differ, what could not be verified, and which source currently looks strongest for each major discovery area.

---

## Multi-Source Source Intake And Evidence Mapping Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Gather the likely evidence sources across live site, demo or prototype, development site when present, repository references, Drive documentation, and Figma references. Normalize the evidence into a structured intake summary and identify where the strongest source of truth appears to live for each major discovery area.

---

## Multi-Source AI Readiness Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Produce an internal AI-readiness-oriented discovery summary that uses the named sources in that file and any accessible supporting evidence from those sources. Identify what looks usable for future AI features, what appears risky or under-governed, what evidence is still missing, and what should be validated before any chatbot or AI-assisted feature planning moves forward.

---

## Multi-Source Technical Discovery Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Focus on the technical discovery side. Use the named repositories, environment references, and any accessible supporting technical evidence to summarize implementation signals, environment differences, repository relevance, unknown technical ownership, deployment or hosting unknowns, and the highest-priority technical follow-up questions.

---

## Multi-Source Design-System Discovery Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Focus on design-system and interface-governance discovery. Use the named design-system, prototype, live, and repository references where accessible to summarize the relationship between design intent and implementation evidence. Separate confirmed evidence from assumptions and identify the most important system-governance questions.

---

## Multi-Source Delivery Safety Prompt

Use `docs/preview-validation/<chosen-example>.md` as the starting context for this preview. Build the smallest useful internal discovery output from the named sources while still validating against accessible external evidence when useful. Present it in the safest user-usable format for this interface. Never show local workspace paths, sandbox paths, runtime paths, or fake file links. If a real user-usable file control is not available, present the content directly.

---

## Context-Specific Prompt Seeds

These are quick-copy project-specific seeds. The example files also contain the same seeds, along with project-specific boundaries and known limits.

### LightSpeedWP.Agency

#### Context-only

Use `docs/preview-validation/lightspeedwp-agency-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal LightSpeed notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

#### Multi-source

Use `docs/preview-validation/lightspeedwp-agency-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, Figma prototype site, dev site, GitHub repositories, Drive folder, and Figma references named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal LightSpeed notes. Do not invent missing facts.

### TourOperator.solutions

#### Context-only

Use `docs/preview-validation/touroperator-solutions-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

#### Multi-source

Use `docs/preview-validation/touroperator-solutions-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, demo site, dev site, GitHub repository, Drive folder, and Figma design system named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

### LSX Design System

#### Context-only

Use `docs/preview-validation/lsx-design-system-example.md` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

#### Multi-source

Use `docs/preview-validation/lsx-design-system-example.md` as the starting context for this preview. Build a structured internal discovery pack from the live site, demo site, GitHub repository, Drive folder, and Figma design system named in that file. Verify or enrich with accessible evidence where possible. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
