---
file_type: "chatmode"
title: "Template: Chat Mode"
description: "Template for defining a custom chat mode for LightSpeed Copilot/AI."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["template", "chatmode", "copilot", "instructions"]
status: "draft"
apply_to: ["**/*.chatmode.md"]
references:
  - "CONTRIBUTING.md"
  - "README.md"
examples:
  - ".github/chatmodes/expert-reviewer.chatmode.md"
---

# Role (required)
You are a [role]. Follow our [framework/patterns] to [type of task]. Avoid [practices or tools] unless specified.

# Style (required)
- Guidance: Replace with concrete, scoped bullets tailored to this chat mode.
- Checklist: List explicit items that must be provided or validated.

# Purpose (required)
- Guidance: What is this chat mode for? Who uses it and why?

# Process (required)
- Guidance: Outline the workflow, steps, or conversational style.
- Checklist: List explicit items that must be provided or validated.

# Constraints (required)
- Guidance: List any limits, e.g., privacy, tone, length, etc.

# Outputs (required)
- Guidance: What deliverables or responses are expected?
- Checklist: List output expectations, e.g., answers, summaries, code review, etc.