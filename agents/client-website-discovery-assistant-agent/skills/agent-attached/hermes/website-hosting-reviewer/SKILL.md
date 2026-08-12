---
name: website-hosting-reviewer
description: Run website hosting discovery reviews for LightSpeed website projects. Use when the user wants to assess current hosting arrangements, operational constraints, reliability risks, performance implications, maintenance burdens, environment fit, or what should change before launch, migration, or optimization planning.
---

# Website Hosting Reviewer

## Overview

Use this skill when the work is primarily about understanding whether the current hosting arrangement is fit for the website's needs and what risks, limitations, or follow-up questions should be documented.

## Request Shapes

Use `$website-hosting-reviewer` for requests like:

- "Review this website's hosting setup and risks."
- "Turn these hosting notes into a structured assessment."
- "What hosting concerns should we flag before migration, launch, or performance planning?"

## Workflow

1. Identify the hosting evidence available such as provider details, plan notes, architecture notes, migration context, environment information, uptime complaints, performance concerns, backup notes, or support constraints.
2. Establish the evidence boundary and separate:
   - confirmed hosting facts
   - likely operational constraints
   - inferred risks
   - unanswered hosting questions
3. Review the hosting setup through practical lenses such as:
   - reliability and uptime
   - performance fit
   - scalability and traffic tolerance
   - backup and recovery posture
   - environment separation and deployment workflow
   - support model and operational ownership
   - security and maintenance implications
4. Distinguish current-state observations from migration or improvement recommendations.
5. Produce a structured internal hosting review with risks, assumptions, open questions, and next-step follow-up.

## Output Contract

The default output should include:

- current hosting arrangement summary
- key strengths and constraints
- operational or technical risks
- missing facts that affect confidence
- follow-up questions or next actions

## Quality Bar

- Do not assume enterprise-grade capability from thin hosting descriptions.
- Do not confuse performance symptoms with hosting certainty unless the evidence supports that link.
- Keep provider facts, inferred risks, and recommendations clearly separated.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
