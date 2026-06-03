---
title: "Slide 16 - Workflow Layer"
description: "Explain orchestration through GitHub workflows for daily operations."
last_updated: "2026-06-02"
owners: ["Ash Shaw"]
---

# Slide 16 - Workflow Layer

## Slide goal

Show how GitHub workflows operationalise governance and quality continuously.

## Key points

- Dedicated workflows for labeling, linting, testing, release, reporting, and metrics.
- Workflows provide consistent execution triggers and auditability.
- This layer connects repository events to governance actions.

## Speaker expansion notes

- Use a concrete event path (PR opened -> labeling + linting + review automation).
- Reinforce that workflows are transparent and inspectable.

## Evidence anchors

- `.github/workflows/labeling.yml`
- `.github/workflows/linting.yml`
- `.github/workflows/release.yml`
- `.github/workflows/reviewer.yml`
- `docs/WORKFLOWS.md`

## Slide content brief

- Use one clear headline that states the slide message.
- Keep body content to 3 bullets maximum based on the `Key points` section.
- Include one proof item from `Evidence anchors` (quote, file path, or short data point).
- Add one speaker cue line in small text if needed; avoid paragraph-heavy copy.

## Slide style brief (NotebookLM-safe)

- Keep layout simple: title + 3 bullets + one visual zone.
- Use minimal visuals (one icon, one screenshot, or one simple diagram only).
- Avoid dense process diagrams, nested callouts, and complex animation.
- Keep on-slide text short (roughly 25-40 words total where possible).
- Use high contrast and consistent spacing; prioritise readability over decoration.
