---
name: website-evidence-pass
description: Use when the user provides a live website, notes, docs, screenshots, or Figma references and you need a structured evidence pass before package routing, add-on review, or estimate drafting. This skill gathers trustworthy website evidence, separates confirmed facts from assumptions and missing values, and produces a clean pre-estimate evidence summary with only the missing values that still matter.
---

# Website Evidence Pass

## Purpose

Use this skill before final package routing or estimate drafting when project evidence is scattered, partial, or mixed across several sources.

Your job is to turn raw website evidence into a structured, decision-ready evidence pass that the estimator can rely on for later routing and pricing.

## When to Use

Use this skill when the request matches patterns like:

- "Audit this site and tell me what matters for the estimate."
- "Review this live website, these notes, and this Figma file before you price it."
- "Turn this messy project material into a clean scope evidence summary."
- "What do we already know, what is assumed, and what still needs confirmation?"

Do not use this skill when the user only wants a final polished proposal with already confirmed scope and pricing.

## Inputs You May Use

Prefer grounded sources only. Use what is actually available:

- the live website
- user-provided notes, screenshots, and links
- installed agent files, especially `/packages/assessment-values.md`
- `templates/evidence-library-template.md` when it helps structure the output
- {{label:Figma,id:connector_68df038e0ba48191908c8434991bbac2,type:app}} when a Figma file is provided
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} when source docs exist there
- {{label:website-intake-workflow,id:hsk_6a01d1651f188191ab01ee862697a139,type:skill}} when discovery questions or a reusable project brief are needed
- {{label:Memory,id:file_persistence,type:file_persistence}} for lightweight durable project context across future runs for the same user

If a source is unavailable, say so implicitly by not claiming it was reviewed.

## Core Workflow

Follow this sequence:

1. Identify the evidence sources actually available for this request.
2. Inspect the live site and supplied references before asking questions.
3. Pull out only the highest-value assessment facts first, especially values that affect package fit, scope confidence, fixed-fee eligibility, thresholds, or custom-scope escalation.
4. Separate findings into three groups:
   - confirmed from evidence
   - assumptions
   - still missing
5. Normalize the findings into a compact, decision-ready evidence pass.
6. Ask only for the missing or unconfirmed values that materially change routing or pricing.
7. End with a routing handoff that matches the phase just completed.
8. If durable facts were clarified, save a concise project brief update in {{label:Memory,id:file_persistence,type:file_persistence}}.

## Evidence Priorities

Prioritize extracting these kinds of facts when possible:

- website type and business model
- current platform or CMS
- ecommerce, booking, membership, portal, or multilingual signals
- likely page types and reusable sections
- content migration complexity
- integration signals
- design-system or bespoke design evidence
- editorial workflows or dynamic content signals
- anything that could trigger `Custom Website Solution`

Use `/packages/assessment-values.md` as the canonical checklist for what matters.

## Output Contract

When using this skill, produce a **Website Evidence Pass** with this exact section order:

1. **Sources Reviewed**
2. **Confirmed Facts**
3. **Assumptions**
4. **Current Phase**
5. **Route Decision**
6. **Missing Material Inputs**
7. **Next Handoff**

### Section rules

#### Sources Reviewed

List only the sources actually reviewed.

#### Confirmed Facts

Use concise bullets. Include only facts that are supported by the available evidence.

#### Assumptions

Include reasonable inferences, but label them clearly as assumptions rather than confirmed facts.

#### Current Phase

State `Audit` unless the user explicitly asked for a different phase outcome.

#### Route Decision

State the strongest supported routing posture after the audit:

- no final package decision yet
- provisional lean toward a specific base package
- enough evidence to proceed to routing
- early custom-scope risk

Keep this short and evidence-tied. Do not perform full package routing inside the audit unless the user explicitly asked for a combined audit-and-routing result.

#### Missing Material Inputs

Repeat only the values that still materially affect package routing, pricing, thresholds, approvals, or estimate confidence. Keep this list tight and non-duplicative.

#### Next Handoff

State the next step that logically follows the audit that was just completed:

- move to intake when material routing inputs are still missing
- move to routing when the evidence is already sufficient

Do not send the workflow backward, and do not duplicate this section with a separate “recommended next step” block.

## Operating Rules

- Do not jump straight to a package recommendation unless the evidence is already strong enough.
- Do not invent hidden pages, integrations, workflows, or scope items.
- Do not ask broad intake questions if the answer can be pulled from the site or supplied references.
- Prefer a short, high-signal evidence pass over a long descriptive audit.
- If the evidence is weak, make that clear and narrow the follow-up questions to only what matters.
- Keep internal reasoning internal; present only the evidence summary, assumptions, and next-step guidance.
- Keep audit output light. Do not add extra sections beyond the output contract unless the user explicitly asks for deeper analysis.
- Avoid redundancy between `Missing Material Inputs` and `Next Handoff`.
- If custom-scope risk exists, mention it in `Route Decision` or `Missing Material Inputs` rather than adding a separate risk section by default.

## Memory Rules

When durable project facts become clear, store a concise update that may include:

- confirmed source links or source types
- confirmed assessment values
- strong routing signals
- provisional package direction if one exists
- open questions still blocking confident routing

Do not store full transcripts or one-off chatter.

## Example

### Example request

Review this live website and the attached project notes, then tell me what we already know before estimating the rebuild.

### Example response shape

**Website Evidence Pass**

**Sources Reviewed**

- Live website homepage and core navigation
- Attached project notes
- Figma homepage concept

**Confirmed Facts**

- Current site is a WordPress marketing website
- Navigation suggests 14 primary content pages
- Site includes a blog and lead-generation forms
- Figma evidence shows a bespoke homepage redesign direction

**Assumptions**

- Existing content migration appears moderate rather than light
- Some reusable marketing sections are likely shared across service pages

**Current Phase**

- Audit

**Route Decision**

- No final package decision yet. The evidence supports continuing toward routing, with a provisional lean toward WordPress Foundations if the missing scope details stay within standard package bounds.

**Missing Material Inputs**

- Confirm page count in scope
- Confirm whether legacy blog content must be migrated
- Confirm CRM / form integrations

**Next Handoff**

- Intake for the missing routing values above, then package routing once they are confirmed.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
