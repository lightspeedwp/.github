---
name: project-intake-evidence-normaliser
description: Use when the user wants to turn a rough chatbot brief, website, document
  set, email thread, or mixed evidence into a clean project intake record with confirmed
  approved sources, explicit exclusions, structured evidence notes, and only carefully
  saved reusable defaults.
---

# Project Intake & Evidence Normaliser

Use this skill when the request is mainly about getting a chatbot project into a reliable intake state before deeper planning, estimation, source curation, or governance work.

## What this skill is for

Use this skill to:

- collect only the minimum scoping details that are genuinely required to proceed responsibly
- turn messy evidence into a structured intake record
- separate confirmed evidence from assumptions and gaps
- confirm approved sources and explicit exclusions
- avoid unnecessary onboarding questions by using safe defaults and evidence gathered during discovery
- save nothing for future reuse unless the user explicitly confirms that it should be reused

Do not use this skill as a substitute for full chatbot planning, governance drafting, or detailed estimation. Its job is to prepare the project cleanly so later work starts from grounded inputs.

## Request shapes

This skill should trigger for requests like:

- "Turn this rough chatbot brief into a clean intake and tell me what is still missing."
- "Review these docs, emails and site links, then confirm what should count as approved chatbot sources."
- "Normalise the project evidence before you estimate the chatbot scope."

Success looks like:

- a concise intake record with only the must-have scoping fields filled or marked missing
- a structured evidence register that distinguishes confirmed, unconfirmed, excluded, and missing items
- an explicit approved-source list and exclusion list with a high approval bar
- a short list of only the blocker questions that absolutely must be answered before proceeding
- no reusable defaults saved unless the user explicitly confirms reuse
- a polished document with versioned metadata and a references section near the end when relevant references were collected during discovery or onboarding

## Core operating rule

Prefer discovery over onboarding.

Before asking questions, extract as much as you safely can from the evidence already available. Treat onboarding as a gap-filling step, not a default script. If a missing detail can be safely defaulted without creating scope, safety, approval, or estimate risk, use the safe default and continue.

## Workflow

### 1. Start from evidence, not questions

Check the strongest available evidence first before asking for more detail. Prefer, in this order when available and relevant:

- user-provided project brief or notes
- uploaded files and attached evidence
- live website pages or public documentation
- connected email threads for approvals or project context
- connected drive documents, sheets, or slides
- connected repository or design context when implementation or journey evidence matters

Do not ask the user to restate information that is already clearly available in the current evidence.

### 2. Build the minimum intake record

Create or update a compact intake record with these fields:

- project name or working identifier
- website or product surface in scope
- intended audience or user groups, if clearly evidenced
- primary chatbot goal
- top 1-3 priority user tasks or questions, if they can be inferred safely
- current evidence available
- approved source candidates
- exclusions already stated or strongly implied
- key constraints, risks, or blockers
- readiness to proceed: ready, provisional, or blocked

Only treat these as absolute blockers when missing:

- what surface or project the chatbot relates to
- the core chatbot goal or job to be done
- whether there is at least one potentially usable source of truth
- whether any source is approved, or approval is still unresolved when approval is necessary for safe planning

Everything else should either be inferred from evidence, marked as unconfirmed, or given a clearly safe default.

If a field is not confirmed, mark it as missing or unconfirmed. Do not fill gaps with plausible sounding assumptions.

### 3. Use safe defaults where risk is low

When the evidence does not confirm a detail, use safe defaults only if doing so does not meaningfully change scope, source safety, behaviour safety, or estimate confidence.

Good safe defaults include:

- treating live public website pages as stronger evidence than draft internal notes
- assuming draft or internal material is unapproved until explicitly confirmed
- treating unclear nice-to-have behaviours as out of scope for the intake stage
- defaulting delivery preferences or formatting choices only when they do not affect the planning outcome

Do not use defaults for:

- source approval
- legal, privacy, or policy-sensitive scope
- chatbot behaviour boundaries that affect safety
- assumptions that would materially change the estimate or recommendation

### 4. Normalise the evidence

Convert the raw evidence into a small evidence register. For each evidence item, capture:

- item name
- type, such as page, brief, FAQ, policy, email thread, sheet, design, repository, or note
- current status: confirmed, unconfirmed, excluded, or missing
- approval status: approved, not approved, or approval unclear
- why it matters to chatbot scope or behaviour
- any caution, such as outdated, partial, conflicting, or approval not yet explicit

When multiple sources overlap, deduplicate them and point to the best available source of truth.

### 5. Require a high bar for approved sources

Separate evidence into three buckets:

1. Approved sources

- use only when approval is explicit in the evidence or explicitly confirmed by the user
- if there is no explicit approval signal, do not place the source here

1. Excluded or unsafe sources

- include evidence the chatbot should not rely on, such as unsupported claims, outdated notes, private material without approval, or content outside project scope

1. Unconfirmed candidates

- include evidence that might be useful but still needs explicit approval or verification

Do not treat a source as approved just because it exists, seems authoritative, is internal, or was mentioned in discovery. If approval is unclear, mark it as unconfirmed.

### 6. Ask only the blocker questions

Ask follow-up questions only for missing details that materially affect one of these:

- whether a chatbot is appropriate
- what the chatbot should actually do
- which sources are safe and approved to rely on
- what must be excluded
- whether a later plan or estimate would be misleading without clarification

Prefer one short grouped follow-up over many small questions.

If the remaining uncertainty does not block responsible next-step planning, proceed and mark the gaps clearly instead of asking another question.

### 7. Save reusable defaults only with explicit confirmation

Use {{label:Memory,id:file_persistence,type:file_persistence}} only when both conditions are true:

- the information is clearly a stable reusable default
- the user explicitly confirms it should be saved for reuse on future runs

Never save reusable defaults silently.

Good candidates, but only after explicit user confirmation:

- a preferred project naming format
- recurring source locations the user repeatedly approves
- stable exclusion rules the user explicitly wants reused
- standing delivery preferences the user explicitly wants reused

Do not save:

- speculative conclusions
- one-off project assumptions
- unresolved source approvals
- temporary blockers or missing details
- sensitive details that are not clearly needed as a reusable default
- anything the user has not explicitly confirmed for reuse

If the user does not explicitly confirm reuse, say that nothing was saved.

## Output contract

When this skill runs, return the result in this structure unless the user asks for another format:

# Project Intake Record

---

- **Version:** 1.0
- **Date:** use the current run date when helpful
- **Prepared by:** include only when known or appropriate
- **Project:** include the best confirmed project name or working identifier
- **Status:** ready, provisional, or blocked
- **Source status:** summarise the current approval state briefly

---

## 1. Intake Snapshot

A concise summary of the project, goal, audience if known, and current readiness.

---

## 2. Normalised Evidence Register

Use bullets or a compact table-like list. For each item, include name, type, evidence status, approval status, and why it matters.

---

## 3. Approved Sources

List only clearly approved sources.

---

## 4. Exclusions And Unsafe Sources

List what should be excluded or handled cautiously.

---

## 5. Missing Confirmations

List only the details that still block responsible planning or estimation.

---

## 6. Reusable Defaults

State what was saved for future runs, or say that nothing was saved because reuse was not explicitly confirmed.

---

## 7. Recommended Next Step

State the next best action, such as proceed to planning, gather missing evidence, confirm approvals, or hold estimation until gaps are resolved.

---

## 8. Relevant References Collected During Onboarding

List the most relevant references, links, files, threads, pages, or source locations gathered or confirmed during discovery or onboarding.

For each reference, include:

- a short label
- the reference type when useful
- a link or clear reference when available
- whether it is approved, unconfirmed, or excluded

If no relevant references were collected or confirmed during discovery or onboarding, say that none are currently confirmed.

---

Use exactly one final divider line at the end of the document. Do not add duplicate closing dividers.

## Decision rules

- If the evidence is strong enough, move the project into a ready-for-planning state.
- If source approval is unclear, treat that as an approval gap, not as an approved source.
- If the brief is vague but the evidence is rich, infer structure from the evidence and ask only the truly blocking questions.
- If the brief is rich but the sources are weak, say that planning may proceed only provisionally.
- If the evidence is contradictory, surface the conflict plainly instead of collapsing it into one answer.
- If a missing detail can be safely defaulted, default it and continue rather than expanding onboarding.
- If a question is not necessary to proceed responsibly, do not ask it.

## Quality bar

- Be practical and concise.
- Prefer clean status labels over long explanation.
- Keep approved sources, exclusions, missing confirmations, and references easy to scan.
- Make the handoff to planning or estimation obvious.
- Never present assumptions as confirmed project facts.
- Keep onboarding friction low by limiting questions to true blockers.
- Always include versioned metadata for substantial intake outputs.
- Bold metadata labels consistently.
- Keep only one divider at the end of the document.

## Example

### Example request

"Use these website links, a discovery email thread and a draft FAQ doc to prepare a chatbot intake record before estimating scope."

### Example response shape

- metadata block includes **Version**, **Date**, **Project**, **Status**, and **Source status**
- Intake Snapshot: identifies the website, likely audience when evidenced, chatbot goal, and whether the project is ready for planning
- Normalised Evidence Register: lists the website FAQ page as confirmed, the draft FAQ doc as unconfirmed and not approved pending explicit approval, and the email thread as confirmed for context but not an approved grounding source unless explicit approval is stated
- Approved Sources: only the live FAQ page and policy pages that are explicitly approved or clearly approved by the user
- Exclusions And Unsafe Sources: internal brainstorming notes and outdated PDFs
- Missing Confirmations: whether the draft FAQ doc is approved and whether any internal material may be used as grounding
- Reusable Defaults: nothing saved unless the user explicitly confirms a reusable preference or rule
- Recommended Next Step: either proceed to chatbot planning or pause for source approval
- Relevant References Collected During Onboarding: the live FAQ page, policy pages, discovery email thread, and any uploaded draft FAQ document, each labelled with approval state

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
