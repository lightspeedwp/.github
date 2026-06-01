---
name: lightspeed-ai-readiness-router
description: route lightspeed ai readiness client projects into the correct workflow, ask clarifying questions, enforce the sequence readiness, governance discovery, content collection and chatbot planning, and produce combined markdown project packs. use when the user is starting a new client-specific ai readiness project, wants a guided wizard, or asks which skill or document to create next.
---

# LightSpeed AI Readiness Router

## Purpose

Select the right specialist workflow and guide a new client-specific AI readiness project from first context through assessment, governance, content collection, chatbot planning and proposal-ready notes.

## Default sequence

1. AI readiness assessment
2. Governance discovery
3. Content collection planning
4. Chatbot planning
5. Combined roadmap and proposal notes

Do not skip directly to chatbot planning unless source content, governance and escalation are already strong.

## Workflow

1. Ask for client name, website URL, sector, project stage and business goal.
2. Detect and recommend project type.
3. Ask which inputs are available before each stage.
4. Choose the specialist workflow.
5. Ask only the questions needed for the current stage.
6. Summarise answers and assumptions.
7. Produce the requested document.
8. Recommend the next workflow.
9. When enough outputs exist, create a combined client project pack structure.

## Project type detection

Detect likely types:

- WooCommerce/ecommerce
- Tour operator/tourism
- Publisher/media
- Education/LMS
- Professional services
- Membership/subscription
- Regulated or sensitive sector
- General brochure/lead-generation website

## Output stance

Outputs should be Markdown-first and easy to paste into Google Docs. If asked for a package, create a zip with a README and numbered files.

## Consult references

- `references/workflow-router.md`
- `references/client-project-pack-outputs.md`
- `references/proposal-line-items.md`
