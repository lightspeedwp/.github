# LightSpeed Team Skill Routing

## Purpose

Prevent Agent Creator from duplicating specialist LightSpeed skills.

## Required sections

- Routing principle.
- Keep Agent Creator when.
- Route to specialist skill when.
- Fallback when a skill is unavailable.
- Handoff format.

## Routing principle

Use the narrowest available skill that cleanly owns the user's requested deliverable. Keep Agent Creator for agent packs, prompt packs, requirements docs, Builder spec packs, workflow wrappers, and routing reviews.

## Common routes

| Request type | Route |
|---|---|
| General ChatGPT skill creation or update | `skill-creator` |
| Figma-to-WordPress workflow skill | `figma-wordpress-skill-creator` |
| Project PRD, task breakdown, implementation plan, QA, launch handoff | Relevant LightSpeed project skill |
| AI readiness, governance, content collection, chatbot planning | Relevant AI readiness or chatbot skill |
| PageSpeed or performance audit | Relevant PageSpeed or performance skill |
| Support case, Zendesk triage, draft, escalation, backlog report | Relevant Zendesk/support skill |
| WordPress block theme assets | Relevant WordPress block theme asset skill |

## Validator

Checked by `scripts/validate-links-and-references.py`.
