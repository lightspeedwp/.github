---
title: "Copilot Space Guide"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "How to create, title, describe, instruct, and attach context."
tags: ["lightspeed","templates","copilot","agents","prompts","models"]
type: "copilot"
---
# Overview
- Spaces collect Title (5–8 words), Description (≤350 chars with example ask), and Instructions (≤4,000 chars).

# Attached Files, Issues & PRs
- Include repo docs (README, CONTRIBUTING, architecture), relevant PRs/issues, and small, high-signal datasets.
- Prefer links to living docs over large dumps. Avoid secrets and large binaries.
- Do: attach specs, API schemas, test fixtures, example inputs/outputs.
- Don’t: attach entire node_modules, huge archives, or unrelated repos.

# Do's and Don'ts
- Do map each Space to one clear job; don’t mix concerns.
- Do enforce length caps; include Character Count line.
- Do cite sources when browsing; don’t hallucinate unknown project facts.
