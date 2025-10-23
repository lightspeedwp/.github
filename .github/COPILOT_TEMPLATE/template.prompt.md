---
file_type: "prompt"
title: "Template: Prompt"
description: "Generic prompt template referencing instructions for Copilot or ChatGPT."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["template", "prompt", "copilot", "instructions"]
status: "draft"
apply_to: ["**/*.prompt.md"]
references:
  - "CONTRIBUTING.md"
  - "README.md"
examples:
  - ".github/prompts/generate-model.prompt.md"
---

# Purpose
- Write a clear, outcome-focused prompt that uses the linked instructions.

# Paste or reference instructions
- Reference: `../instructions/template.instructions.md`
- If instructions are missing, pause and request them.

# User input checklist
- What you need from the user (files, links, constraints, acceptance criteria).

# System constraints (e.g., length, tone, outputs)
- UK English; concise; cite sources when browsing.
- Respect any length caps (4,000 chars for Space instructions).

# Example first message to Copilot
- “Use `../instructions/template.instructions.md`. My goal is […]. Inputs are […]. Produce […]. Show your plan then proceed.”

# Verification steps (what “good” looks like)
- Meets acceptance criteria; includes a short changelog; no tool sprawl; runnable outputs.

# Style (required)
- Guidance: Replace with concrete, scoped bullets tailored to this prompt.
- Checklist: List explicit items that must be provided or validated.

# Outputs (required)
- Guidance: What output is expected from Copilot/ChatGPT.
- Checklist: List expected deliverables, e.g., code block, changelog, etc.