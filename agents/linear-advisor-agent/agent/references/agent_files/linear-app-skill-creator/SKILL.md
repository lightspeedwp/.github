---
name: linear-app-skill-creator
description: create, update, validate and improve chatgpt skills for linear workflows such as issue triage, project planning, customer-request analysis, status updates, documentation, and workflow governance. use when the user asks to write a new skill, revise an existing skill, package a skill, compare skill creator approaches, create skill instructions for linear work, or convert repeatable linear processes into reusable chatgpt skills.
---

# Linear App Skill Creator

## Purpose

Create production-ready ChatGPT skills for Linear-centred work.

This skill is for writing other skills, especially skills that help with:

- issue triage, backlog hygiene, and ticket enrichment;
- project, initiative, and cycle planning;
- customer-request analysis and signal extraction;
- status updates, roadmap communication, and planning reviews;
- documentation, comments, hand-offs, and workflow governance;
- conversion of older document-style or script-style workflows into modern reusable skill packages.

## Operating Principles

1. Build skills as reusable delivery systems, not long advice documents.
2. Keep `SKILL.md` compact and use references for detail.
3. Put trigger conditions in the frontmatter description, because that is what determines whether the skill is discovered.
4. Use scripts only for deterministic or fragile work. Do not script tasks ChatGPT can reliably do from instructions.
5. Include realistic test prompts before packaging when the skill affects planning quality, workflow routing, customer interpretation, prioritisation, or status communication.
6. Package complete updated skills as `skill.zip`, not partial patches.
7. Preserve user-provided skill structure when updating an existing skill unless it is invalid or unsafe.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
