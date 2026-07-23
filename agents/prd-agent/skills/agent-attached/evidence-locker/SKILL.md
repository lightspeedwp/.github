---
name: evidence-locker
description: Use when the user wants stronger fact discipline, assumption tracking, source-backed decisions, or consistency across PRDs, technical briefs, task plans, GitHub issue drafts, discovery notes, and related planning outputs.
---

# Evidence Locker

## Overview

Use this skill whenever the task depends on separating confirmed facts from assumptions and keeping that distinction stable across multiple planning artefacts.

This skill helps you do four things reliably:

1. identify what is actually evidenced in the provided sources
2. separate assumptions, inferences, and working hypotheses from confirmed facts
3. record important decisions with the source or rationale that supports them
4. keep later outputs aligned with the locked evidence record unless new evidence clearly supersedes it

Use this skill before or during work on PRDs, technical briefs, task plans, implementation plans, discovery summaries, and GitHub issue drafts when evidence quality matters.

## When To Use This Skill

Use `$evidence-locker` when the user asks for any of the following, or when the request clearly implies them:

- turn mixed source material into a planning document without inventing facts
- separate confirmed facts from assumptions
- preserve decisions and rationale across multiple outputs
- keep a PRD, technical brief, task plan, and issue drafts consistent with each other
- review an existing draft for unsupported claims, contradictions, or drift from source material
- update an earlier planning pack after new source material arrives

Do not use this skill for purely creative drafting where factual grounding is intentionally loose.

## Inputs You Should Look For

Prefer the strongest available evidence first.

Possible evidence sources include:

- user-provided notes, briefs, and discovery summaries
- attached files and templates
- outputs retrieved from connected apps such as Google Drive, GitHub, and Figma
- repository evidence such as README files, issues, pull requests, and code structure
- design evidence such as Figma metadata, screenshots, variables, components, and library notes
- website or public reference material when explicitly needed

If evidence is thin or conflicting, still do useful work, but label uncertainty clearly instead of smoothing it over.

## Core Workflow

### 1. Build the evidence base

Collect the relevant source inputs for the current request.

For each important claim, ask:

- what source supports this?
- is the source explicit, implied, or absent?
- does the source reflect current state, proposed state, or an open question?

Prefer source-backed specificity over broad paraphrase.

### 2. Classify each important point

Sort meaningful project information into these buckets:

- **Confirmed facts**: explicitly supported by the provided evidence
- **Assumptions**: plausible working statements not fully confirmed by evidence
- **Open questions**: missing facts that materially affect planning quality or delivery direction
- **Source-backed decisions**: recommended or adopted planning choices tied to evidence or explicit reasoning

Be strict about the difference between a fact and an inference.

A statement counts as a confirmed fact only when the evidence directly supports it.

### 3. Lock the record before drafting

Before producing a substantial output, create a compact internal evidence record that includes:

- the key confirmed facts that must remain stable
- the assumptions that must stay labelled as assumptions
- any open questions that must not be silently resolved
- the major source-backed decisions already made or newly recommended

Use that locked record as the reference point for the rest of the task.

### 4. Draft from the locked record

When producing PRDs, technical briefs, task plans, implementation plans, or GitHub issue drafts:

- carry confirmed facts forward consistently
- keep assumptions explicitly labelled
- avoid upgrading assumptions into facts later in the document
- ensure downstream tasks and issue drafts do not contradict upstream planning decisions
- preserve naming, scope boundaries, constraints, and dependency statements unless new evidence justifies a change

### 5. Reconcile cross-document drift

When working across multiple artefacts, compare them actively for drift.

Check for:

- features present in one output but unsupported in the source evidence
- changed terminology for the same thing
- acceptance criteria that do not match the stated scope
- technical decisions that conflict with the PRD or design evidence
- task breakdown items that assume work not approved or not evidenced
- GitHub issue drafts that overstate certainty or omit key constraints

If you find drift, correct it directly when safe to do so. If the right answer is uncertain, flag it as an open question or needs-review item.

## Output Rules

When this skill is materially shaping the response, include the following sections where they fit the requested format:

- **Confirmed facts**
- **Assumptions**
- **Open questions** or **Missing information that materially affects the output**
- **Source-backed decisions** when decisions are being made or preserved

You do not need to force those headings into every tiny response, but the distinctions must remain explicit.

For substantial planning outputs:

- keep facts, assumptions, and decisions consistent throughout the document
- do not bury critical uncertainty in passing prose
- call out when a requirement, dependency, or delivery choice is evidence-backed versus inferred
- keep the confidence level of each claim proportional to the available evidence

## Decision Logging Rules

When making or preserving a decision, record:

- the decision itself
- the evidence or rationale behind it
- whether it is confirmed, recommended, pending approval, or needs review
- the downstream implication if it affects scope, implementation, QA, or issue drafting

Examples of decisions worth tracking:

- project classification
- chosen implementation approach
- design-system-to-WordPress mapping choices
- plugin-versus-theme responsibility splits
- integration assumptions
- launch or QA gates
- sequencing and dependency decisions

## Consistency Rules Across Artefacts

When generating downstream artefacts from upstream planning:

- PRD to technical brief: preserve goals, scope, constraints, integrations, and non-goals
- PRD or technical brief to task plan: preserve scope boundaries, dependencies, and sequencing logic
- task plan to GitHub issue drafts: preserve acceptance criteria intent, technical constraints, and out-of-scope boundaries
- any document to later revisions: preserve confirmed facts and explicitly note what changed, why, and on what evidence

If a later artefact must diverge from an earlier one, say so explicitly and explain the evidence-backed reason.

## Review Mode

If the user asks you to review an existing draft or planning pack, audit it against this checklist:

1. Which statements are confirmed by evidence?
2. Which statements are assumptions presented too confidently?
3. Which important decisions are present but unsupported?
4. Where do documents contradict each other?
5. What should be downgraded to assumption, flagged as an open question, or rewritten?

Prioritise corrections that change delivery scope, architecture, acceptance criteria, sequencing, or stakeholder expectations.

## Example Request Shapes

### Example 1

User request: "Create a PRD from this mixed brief, Figma link, and repo context. Separate confirmed facts from assumptions."

Success criteria:

- the PRD clearly distinguishes facts from assumptions
- no unsupported repository or design claims are invented
- important gaps are listed as open questions
- the recommended next action reflects actual evidence gaps

### Example 2

User request: "Turn this approved PRD into a technical brief and task plan without drifting from the original scope."

Success criteria:

- the brief and task plan preserve the approved scope
- downstream outputs inherit the same key constraints and decisions
- any newly introduced implementation assumption is labelled
- acceptance and dependency logic remain aligned with the PRD

### Example 3

User request: "Review these GitHub issue drafts against the PRD and point out anything unsupported or inconsistent."

Success criteria:

- unsupported claims are identified clearly
- issue drafts are checked against source-backed scope and acceptance intent
- contradictory or overconfident wording is corrected or flagged
- the response tells the user what should be rewritten before implementation starts

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
