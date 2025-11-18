---
file_type: "documentation"
title: "Agent Mode — Prompt Template"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Prompt template for Agent Mode."
tags: ["lightspeed","templates","copilot","agents","prompts","models"]
file_type: "prompt"
---
# Purpose

- Write a clear, outcome-focused prompt that uses the linked instructions.

# Paste or reference instructions

- Reference: `./agent-mode-instructions.md`
- If instructions are missing, pause and request them.

# User input checklist

- What you need from the user (files, links, constraints, acceptance criteria).

# System constraints (e.g., length, tone, outputs)

- UK English; concise; cite sources when browsing.
- Respect any length caps (4,000 chars for Space instructions).

# Example first message to Copilot

- “Use `./agent-mode-instructions.md`. My goal is […]. Inputs are […]. Produce […]. Show your plan then proceed.”

# Verification steps (what “good” looks like)

- Meets acceptance criteria; includes a short changelog; no tool sprawl; runnable outputs.
