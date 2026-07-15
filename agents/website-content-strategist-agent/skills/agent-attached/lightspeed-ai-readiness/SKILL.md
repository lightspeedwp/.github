---
name: lightspeed-ai-readiness
description: run lightspeed ai readiness workflows for wordpress website projects, including readiness scoring, governance discovery, content collection planning, ai governance guides, chatbot planning and proposal-ready roadmaps. use when a user asks to assess a client website for ai readiness, create governance documents, collect content, plan an ai chatbot, generate client-specific project packs, or start a guided wizard.
---

# LightSpeed AI Readiness

## Purpose

Run a guided LightSpeed AI readiness process for WordPress website, content governance and chatbot planning projects.

## Core sequence

1. Readiness assessment
2. Governance discovery
3. Content collection planning
4. Governance guide creation
5. Chatbot planning
6. Roadmap and proposal notes

Do not jump straight to chatbot implementation unless approved source content, governance controls, privacy/logging rules, escalation routes and test scripts exist.

## Workflow router

When a user starts a client project, ask:

1. Client name
2. Website URL
3. Sector/project type
4. Project stage
5. Main business goal
6. Main concern about AI
7. Available files, notes, spreadsheets, checklists or audit exports
8. Whether output is client-facing, internal or both

Then choose the right workflow:

| Need | Use reference |
|---|---|
| Score readiness or interpret checklist answers | `references/ai-readiness-assessor.md` |
| Run governance discovery or create governance guide | `references/ai-governance-documentor.md` |
| Create content request lists, source registers or gap reports | `references/content-collection-planner.md` |
| Plan or reject a chatbot | `references/ai-chatbot-planner.md` |
| Create a combined project pack | `references/router-and-project-pack.md` |

## Output rules

Use UK English. Keep the tone practical, professional and non-alarmist. Prioritise WordPress maintainability, accessibility, performance, structured content, governance, privacy-aware AI use and measurable business outcomes.

Separate:

- client-facing output
- internal LightSpeed notes
- risks and assumptions
- missing information
- recommended next step

Include this disclaimer whenever legal, privacy, compliance, regulated sectors, personal data or chatbot logging are mentioned:

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.
