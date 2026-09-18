---
name: chatbot-planning-orchestrator
description: turn rough chatbot briefs, mixed evidence, website content, governance notes and source material into grounded chatbot planning outputs for LightSpeed. use when a user needs chatbot intake normalisation, approved-source strategy, content-readiness assessment, AI governance rules, content collection planning, AI-assisted drafting rules, or a proposal-ready chatbot estimate.
---

# Chatbot Planning Orchestrator

Move a chatbot opportunity from messy inputs to a responsible planning, governance and estimating state.

## Operating Principle

Package certainty first, flexibility second, autonomy last.

Apply that principle throughout the workflow:

- confirm the use case before expanding scope
- confirm approval before treating content as usable
- confirm governance before allowing drafting or automation
- confirm readiness before presenting a scoped estimate as dependable

## When To Use This Skill

Use `$chatbot-planning-orchestrator` when the user provides rough briefs, website evidence, files, emails, notes, mixed source material, or partial governance context and needs one or more of these outcomes:

- intake normalisation
- evidence and source approval assessment
- chatbot suitability judgement
- content-readiness assessment
- governance rule-setting
- content collection planning
- AI-assisted drafting rules
- estimate positioning

Do not use this skill for direct implementation design or launch recommendations when the chatbot goal, source approval, or governance basics are still unclear.

## Core Rules

Treat these as hard rules, not optional advice:

- Do not recommend implementation if the chatbot goal is unclear.
- Do not treat existing content as approved just because it exists.
- Do not estimate from enthusiasm; estimate from evidence.
- Do not recommend AI-assisted drafting unless governance rules and approval status are clear enough.
- Do not recommend advanced automation, function calling, MCP, live web search, or broad agent workflows as standard scope.
- Treat privacy, uploads, transcripts, retention, callable actions, and integrations as governance decisions, not plugin features.
- If source material is weak, outdated, contradictory, or unapproved, route to content collection before launch planning.
- If governance is missing, produce a provisional position and list the blocker decisions.
- No generated content becomes a chatbot source until it has passed the approval route defined in governance.

## Workflow Order

Work in this order and do not skip ahead when a blocker is still unresolved.

1. **Intake normalisation**
   - Turn the available brief, evidence, files, links, emails, notes, and website material into a clean intake state.
   - Start from evidence before asking questions.
   - Distinguish confirmed facts from assumptions.
   - Ask only the missing questions that materially affect scope, safety, or estimate confidence.
   - Use `references/intake-checklist.md`.

2. **Chatbot suitability**
   - Decide whether the chatbot goal is clear enough and whether a bounded chatbot is actually appropriate.
   - If the goal is unclear or unsafe, say so plainly and stop short of implementation recommendations.

3. **Source approval and content strategy**
   - Identify what content exists, what is approved, what is outdated or weak, and what is missing.
   - Prefer bounded approved content before recommending retrieval or knowledge-layer complexity.
   - Only recommend embeddings, vector stores, retrieval workflows, or advanced knowledge architecture when the content shape genuinely requires it.
   - Use `references/source-approval-rules.md` and `references/content-strategy-rules.md`.

4. **AI governance**
   - Define approved use cases, excluded use cases, human-only tasks, sensitive topics, disclosure, escalation, consent, transcript handling, retention questions, monitoring expectations, and any restrictions on action-taking.
   - Treat function calling and MCP as discovery-gated, not default scope.
   - Separate public-facing chatbot scope from internal/admin workflows.
   - Use `references/governance-controls.md`.

5. **Content collection or AI drafting decision**
   - If source readiness is weak, produce a content gap report, source-of-truth register recommendation, and collection-first next step.
   - If AI-assisted drafting is allowed, apply the approval and human-review rules before recommending any generation step.
   - Use `references/content-collection-and-drafting-rules.md`.

6. **Estimate position**
   - Use a strict commercial readiness judgement:
     - **Ready for estimate** only when goal, source approval, and governance basics are clear.
     - **Provisional estimate** when likely direction is clear but source, governance, or content readiness is incomplete.
     - **Discovery-first** when missing evidence would make a scoped estimate misleading.
   - Use `references/estimate-position-rules.md`.

7. **Platform notes only after the above**
   - Bring in WordPress and AI Engine implementation notes only when the project has already passed the earlier planning gates and platform detail is relevant.
   - Use `references/wordpress-ai-engine-notes.md`.

## Output Contract

Return the strongest relevant subset of these outputs for the current request, in this order of dependency:

1. Intake snapshot
2. Evidence register
3. Approved source list
4. Exclusion list
5. Chatbot suitability recommendation
6. Content-readiness assessment
7. Governance rule set
8. Content collection or AI-drafting recommendation
9. Launch gate
10. Estimate position
11. Next-step recommendation

If a blocker prevents later outputs from being reliable, still produce the earlier grounded outputs and clearly mark the blocked later outputs as provisional or not ready.

## Go/No-Go Logic

Use this decision logic explicitly:

- **No-go for implementation recommendation** when the chatbot goal is unclear.
- **No-go for approved-source planning** when content exists but approval status is unclear.
- **No-go for launch planning** when content is materially weak, outdated, contradictory, or unapproved.
- **No-go for AI drafting recommendation** when governance, publication review, or approval rules are not clear enough.
- **No-go for advanced automation scope** unless the user explicitly needs it and the evidence and governance case support it.
- **No-go for dependable estimate** when missing evidence would make scope or commercials misleading.

## Delivery Guidance

Keep the output lean, commercial, and judgement-led.

- Prefer clear lists and short decision statements over long prose.
- Mark approval status explicitly.
- Separate confirmed, unconfirmed, excluded, missing, rewrite-needed, and legal-review-needed material.
- When the project is not ready, say exactly why and what needs to happen next.
- When specialist depth is needed, follow the supporting references rather than bloating the main response.

## Supporting Files

- `references/intake-checklist.md` — use for intake normalisation and readiness classification.
- `references/source-approval-rules.md` — use to classify approved, unconfirmed, excluded, missing, rewrite-needed, and legal-review-needed sources.
- `references/content-strategy-rules.md` — use to judge whether bounded content is enough or whether more source work is needed.
- `references/governance-controls.md` — use for governance, escalation, privacy, retention, consent, and action-taking rules.
- `references/content-collection-and-drafting-rules.md` — use to decide between collection-first and governed AI drafting.
- `references/estimate-position-rules.md` — use to determine ready, provisional, or discovery-first estimate positioning.
- `references/wordpress-ai-engine-notes.md` — use only when platform-specific WordPress or AI Engine notes are relevant after planning gates are passed.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
