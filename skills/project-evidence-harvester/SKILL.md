---
name: project-evidence-harvester
description: Gather and normalise website-chatbot project evidence before planning or estimating. Use when the user provides a rough brief, website, mixed documents, email threads, design links, repo references, or partial source notes and needs a clean evidence base with confirmed inputs, explicit gaps, and approved-vs-unconfirmed source status.
---

# Project Evidence Harvester

## Overview

Use this skill when the agent needs to turn messy project inputs into a reliable evidence base before producing chatbot planning, suitability, governance, or estimate outputs.

Prefer this skill before making strong planning or estimating claims when the available evidence is incomplete, scattered, duplicated, or mixed between approved and unconfirmed sources.

## When To Use This Skill

Use `$project-evidence-harvester` when the user asks for things like:

- "turn this rough chatbot brief into something usable"
- "review the available evidence before you estimate"
- "gather what matters from this website, docs, emails, drive, github, or figma"
- "normalise the current project evidence and tell me what is still missing"
- "build a clean intake record from these mixed sources"

Do not use this skill when the user already has a clean approved-source register and is asking directly for a final plan or estimate with minimal discovery.

## Core Goal

Produce a grounded evidence record that separates:

- confirmed project facts
- approved sources
- unconfirmed or provisional references
- exclusions and unsupported sources
- material gaps that block reliable planning or estimation

## Workflow

1. **Identify the project anchor**
   - Determine the project name, client, website, or other primary identifier from the user's message and available sources.
   - If multiple projects may be involved, separate them clearly instead of merging evidence.

2. **Collect the strongest available evidence first**
   - Prefer the most direct sources available in the current run, such as:
     - uploaded files and agent files
     - live website pages or structured public content
     - connected Google Drive documents
     - connected Gmail threads
     - connected GitHub repositories
     - connected Figma files
   - Prefer first-party project material over summaries or second-hand notes.

3. **Normalise what each source actually tells you**
   - Extract only evidence that materially affects chatbot suitability, scope, safety, source strategy, or estimate confidence.
   - Convert vague statements into explicit notes such as:
     - confirmed fact
     - likely but unconfirmed
     - requested by stakeholder
     - excluded from scope
     - missing evidence

4. **Assign source status**
   - Mark each source or reference as one of:
     - **Approved**: clearly suitable to ground planning or chatbot answers
     - **Unconfirmed**: potentially useful but not yet approved or verified
     - **Excluded**: should not be used for grounding or is out of scope
   - If approval status is unclear, default to **Unconfirmed** rather than assuming approval.

5. **Surface conflicts and gaps**
   - Call out contradictions, duplication, stale material, unclear ownership, missing policy pages, weak FAQs, absent escalation rules, or source gaps that would reduce confidence.
   - Distinguish blockers from nice-to-have improvements.

6. **Produce a clean evidence record**
   - Return a structured intake-style output using the template in `references/evidence-record-template.md`.
   - Keep the record concise but decision-useful.

7. **Recommend the next planning move**
   - End with the single most useful next action, such as:
     - proceed to chatbot planning
     - proceed only with a provisional estimate
     - collect missing approved sources first
     - run governance discovery before estimating

## Output Rules

- Do not jump straight to a full chatbot plan or estimate unless the user asked for that and the evidence is strong enough.
- When evidence is weak, say so plainly.
- Do not present scraped, inferred, or stakeholder-claimed details as confirmed if they were not verified.
- Keep references concrete. Prefer named pages, files, threads, repos, or designs over generic phrases like "website content".
- When useful, group evidence by source type or confidence level rather than by discovery order.

## Source Handling Rules

- Treat website content as potentially useful evidence, not automatically as approved chatbot grounding.
- Treat uploaded documents and connected files as evidence sources whose approval status must still be stated when that matters.
- If email or chat evidence conflicts with the website or project documents, call out the conflict instead of silently reconciling it.
- If a source appears outdated, partial, or marketing-led rather than operationally reliable, note that risk explicitly.
- If a user names sources that should be excluded, preserve those exclusions in the record.

## Success Criteria

A strong result should let the agent or user answer all of these clearly:

- What is this project actually about?
- What evidence is currently available?
- Which sources are safe or approved to rely on?
- What important information is still missing?
- Is the project ready for planning, only for provisional estimating, or not ready yet?

## Supporting Files

- `references/evidence-record-template.md` — use this as the default output structure for evidence-normalisation and intake-style outputs.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
