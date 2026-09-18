---
name: chatbot-discovery-question-prioritiser
description: Use when the user provides a weak, partial, or messy website-chatbot brief and needs the smallest high-value set of discovery questions, evidence requests, and estimate-readiness guidance before planning or estimating.
---

# Chatbot Discovery Question Prioritiser

## Purpose

Use this skill to convert incomplete chatbot briefs into a tight discovery response that helps LightSpeed move forward faster without asking unnecessary questions.

This skill is for situations where the evidence is too thin for a responsible plan or estimate, but strong enough to identify the most important gaps.

## Use This Skill When

Use `$chatbot-discovery-question-prioritiser` when the user:

- shares a rough chatbot enquiry, scattered notes, or a vague website brief and needs help deciding what to ask next
- wants the minimum viable discovery question set before planning or estimating
- needs a concise evidence-gap summary and a practical request list for the client or internal team
- wants to reduce a long brainstorm into the few questions that most affect suitability, scope, source safety, or estimate confidence

Do not use this skill when:

- the brief is already strong enough for a grounded plan or estimate
- the user is asking for a full chatbot plan, source strategy, or estimate and the required evidence is already available
- the user needs broad AI-governance documentation rather than discovery prioritisation

## Request Shapes

### 1. Rough brief triage

Example request shape:

- "We may need a chatbot for this site. What do we need to ask before estimating?"

Success criteria:

- identify whether the current brief is estimate-ready, provisional-only, or discovery-first
- produce only the highest-value follow-up questions
- explain why each question matters

### 2. Client question pack

Example request shape:

- "Turn this messy brief into a clean list of questions for the client."

Success criteria:

- group questions into a small number of practical themes
- keep wording client-friendly and specific
- include a short evidence request list alongside the questions

### 3. Internal discovery prep

Example request shape:

- "What are the biggest scope and source gaps in this chatbot opportunity?"

Success criteria:

- identify the top blockers to safe planning or estimation
- separate confirmed facts from assumptions
- recommend the next best discovery step

## Workflow

1. Read the brief and separate:
   - confirmed facts
   - implied but unconfirmed assumptions
   - missing information that genuinely affects suitability, safety, scope, source quality, or estimate confidence

2. Decide the current readiness state:
   - **Estimate-ready** when only minor clarification is missing
   - **Provisional-only** when a useful early estimate is possible but key assumptions remain open
   - **Discovery-first** when missing information is too material for a responsible estimate

3. Prioritise missing information by impact. Focus on the smallest set of questions that most strongly affect:
   - whether a chatbot is appropriate at all
   - who it is for and what it should help with
   - which sources are approved and trustworthy
   - what the chatbot must not do
   - what could materially change delivery effort or risk

4. Remove low-value questions.
   - Do not ask for preferences that can be defaulted safely.
   - Do not ask duplicate questions in different wording.
   - Do not turn discovery into a long intake form.

5. Convert the gaps into a concise response with four sections in this order:
   - `## Discovery Status`
   - `## Highest-Value Questions`
   - `## Evidence To Request`
   - `## Recommended Next Step`

## Output Rules

### Discovery Status

- State the readiness level as **Estimate-ready**, **Provisional-only**, or **Discovery-first**.
- Explain the judgement in 2-4 short bullets.

### Highest-Value Questions

- Include 3-7 questions only.
- For each question, include:
  - the question itself
  - a brief note on why it matters
- Prefer grouped bullets under short theme labels when that improves scanning.

### Evidence To Request

- List the concrete materials that would reduce uncertainty fastest, such as:
  - website pages
  - FAQs
  - policies
  - approved source documents
  - example customer queries
  - escalation or handoff rules
  - existing support email or ticket themes
- Mark each item as `approved source needed`, `helpful but optional`, or `needs confirmation` when that distinction is useful.

### Recommended Next Step

- End with one clear recommendation only.
- Recommend either:
  - proceed to a provisional plan/estimate
  - run a focused discovery pass
  - request a tighter source pack first

## Decision Heuristics

Prioritise questions in roughly this order:

1. suitability and user goal
2. approved sources and exclusions
3. unsupported topics and escalation needs
4. evidence quality and source gaps
5. estimate-shaping assumptions and delivery constraints

Treat these as high-impact gaps:

- no clear user problem or audience
- no approved source-of-truth content
- unclear exclusion boundaries
- unclear escalation path for unsupported questions
- legal, privacy, or governance uncertainty that could change the delivery shape
- no reliable examples of the information the chatbot should answer from

Treat these as lower priority unless the brief specifically depends on them:

- detailed tone preferences
- exact formatting preferences
- minor UI or wording preferences
- speculative future integrations

## Quality Bar

- Keep the discovery response sharp and selective.
- Prefer six excellent questions over fifteen average ones.
- Do not overstate confidence.
- Do not let the question list drift into implementation design unless that detail changes scoping now.
- If the brief is clearly too weak, say so plainly and recommend discovery-first handling.

## Example Output Shape

## Discovery Status

- **Status:** Provisional-only
- The website goal is broadly clear, but the intended user tasks are still too vague.
- No approved source set is confirmed yet.
- Escalation and exclusion boundaries are not defined.

## Highest-Value Questions

- **User goal**
  - What are the top three things the chatbot should help website visitors do?
  - Why it matters: this determines whether the chatbot should be narrow support, guided navigation, lead capture, or something else.
- **Approved sources**
  - Which pages, FAQs, policies, or internal documents are approved for the chatbot to answer from?
  - Why it matters: estimate confidence depends on source quality and content preparation effort.
- **Escalation**
  - When the chatbot cannot answer confidently, where should it send the user next?
  - Why it matters: fallback and handoff rules shape both scope and risk.

## Evidence To Request

- Approved website pages or source register — approved source needed
- Existing FAQs or support themes — approved source needed
- Any exclusion list for sensitive or unsupported topics — needs confirmation
- Example customer questions from email or support logs — helpful but optional

## Recommended Next Step

Run a focused discovery pass to confirm the user goals, approved sources, and escalation rules before producing anything firmer than a provisional estimate.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
