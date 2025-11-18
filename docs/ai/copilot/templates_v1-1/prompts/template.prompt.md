---
file_type: "documentation"
title: "Template: Prompt (single)"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Generic prompt template referencing instructions."
tags: ["lightspeed","templates","copilot","agents","prompts","models"]
file_type: "prompt"
---
# Purpose

- Write a clear, outcome-focused prompt that uses the linked instructions.

# Paste or reference instructions

- Reference: `../templates/template.instructions.md`
- If instructions are missing, pause and request them.

# User input checklist

- What you need from the user (files, links, constraints, acceptance criteria).

# System constraints (e.g., length, tone, outputs)

- UK English; concise; cite sources when browsing.
- Respect any length caps (4,000 chars for Space instructions).

# Example first message to Copilot

- “Use `../templates/template.instructions.md`. My goal is […]. Inputs are […]. Produce […]. Show your plan then proceed.”

# Verification steps (what “good” looks like)

- Meets acceptance criteria; includes a short changelog; no tool sprawl; runnable outputs.
