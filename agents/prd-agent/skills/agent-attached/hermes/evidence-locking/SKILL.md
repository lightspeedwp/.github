---
name: evidence-locking
description: Use when the output is fact-sensitive and the agent must separate confirmed evidence from assumptions, contradictions, stale inputs, and open questions before drafting or reviewing planning work.
---

# Evidence Locking

## Overview

Use this skill when output quality depends on disciplined handling of evidence.

## Request Shapes

- Use `$evidence-locking` before drafting a fact-sensitive planning artefact.
- Use `$evidence-locking` when multiple sources disagree or vary in quality.
- Use `$evidence-locking` when the user asks what is known, missing, risky, or trustworthy.

## Workflow

1. Review the available evidence sources.
2. Mark each material claim as one of:
   - confirmed fact
   - assumption
   - contradiction
   - open question
   - weak or stale evidence
3. Prefer grounded evidence over inference.
4. Surface conflicts explicitly instead of silently reconciling them.
5. State the confidence level and what would improve confidence.

## Output Contract

Default output sections:

- Confirmed facts
- Assumptions
- Contradictions or ambiguities
- Missing evidence
- Confidence level
- Recommended next evidence step

## Quality Bar

- Never present assumptions as facts.
- Never hide conflicts.
- Reward traceability over fluency.
- If evidence is weak, say so plainly.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
