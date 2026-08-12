---
name: lightspeed-ai-readiness-router
description: route lightspeed ai readiness client projects, proposals and messy briefs into the right specialist workflow. use when the lightspeed team asks where an ai readiness, ai governance, content collection, chatbot, faq/source, .schemas/ai-discoverability, policy, claim, estimate or combined project-pack request should go; when a client-specific ai readiness project needs a guided sequence; when inputs are incomplete or scattered across notes, urls, docs, email, tickets or discovery calls; or when the team needs a proposal-ready next-step recommendation without skipping readiness, governance, source quality, escalation or launch gates.
---

# LightSpeed AI Readiness Router

## Purpose

Route LightSpeed AI readiness work into the correct specialist workflow, keep the delivery sequence safe, and make rough client inputs usable without forcing the team through a long questionnaire.

Use this skill as the intake and traffic-control layer. Do not try to perform every specialist task inside this skill when another LightSpeed skill is a better fit.

## Operating stance

- Optimise for a practical LightSpeed handoff: clear scope, current stage, source status, risks, recommended workflow and next artefact.
- Accept imperfect inputs. Turn rough notes, links, pasted emails, meeting summaries, screenshots, website URLs or partial discovery answers into a structured intake before routing.
- Ask only one focused follow-up question when a blocker prevents safe routing. Otherwise use cautious assumptions and label them.
- Separate confirmed evidence from assumptions, recommendations and missing inputs.
- Do not skip directly to chatbot planning unless content sources, governance, escalation and privacy posture are already adequate.
- Keep outputs Markdown-first, Google-Docs-friendly and suitable for LightSpeed team handoff.

## Default delivery sequence

1. AI readiness assessment
2. Governance discovery
3. Content and source collection planning
4. FAQ / source curation where chatbot or answer-engine work is likely
5. Chatbot planning or go/no-go review
6. Proposal / estimate calibration
7. Combined roadmap, project pack or launch-readiness handoff

If the user starts in the middle, route them to the right stage but call out any upstream gaps that could affect accuracy, scope or risk.

## Input handling

### Minimum useful intake

Extract or infer these fields from the user's message and any supplied sources:

- Client / project name
- Website URL or digital property, if available
- Sector and likely project type
- Current stage: prospect, discovery, assessment, governance, content collection, chatbot planning, proposal, implementation, launch or optimisation
- User's immediate ask
- Available evidence: website, docs, notes, recordings, tickets, emails, Figma, GitHub, analytics, Search Console, chatbot transcripts or policy material
- Intended audience: internal LightSpeed, client-facing or both
- Desired output: route recommendation, questions, report, checklist, estimate notes, policy draft, chatbot brief or combined pack

### Handling messy or incomplete inputs

- If the website URL is missing but routing is still possible, continue with a provisional route and list the URL as a missing input.
- If the client name is missing, use a temporary slug such as `client-ai-readiness` and flag it.
- If the sector is unclear, infer from the website, notes or brief only when evidence supports it. Otherwise use `general lead-generation website` as the safe default.
- If the user asks for a deliverable but evidence is thin, produce a lightweight version and include a short evidence request list.
- If the user asks for a chatbot before sources are approved, route to source/governance readiness first and provide a chatbot go/no-go note rather than a full implementation plan.
- If regulated, sensitive, health, finance, legal, children, hiring, political or high-risk advice use cases are detected, route governance and policy work before chatbot or automation planning.

### Source handling for LightSpeed team use

- Use connected internal sources when the request depends on current LightSpeed project context, existing docs, previous outputs, tickets, Google Drive materials, GitHub issues or uploaded files.
- Treat uploaded files and user-provided links as stronger evidence than memory.
- Preserve source quality labels: approved, client-provided, internal draft, inferred, stale, missing or unverified.
- Never present legal, privacy or regulatory wording as legal advice. Mark it for qualified review where appropriate.

## Routing map

Use this map to choose the next specialist skill. When routing, name the recommended skill, explain why, list required inputs and provide a starter prompt the LightSpeed team can reuse.

| Situation | Route to | Use when |
|---|---|---|
| Early AI readiness lead, checklist answers, readiness score, website foundation assessment | `ai-readiness-assessor` | The main need is to assess readiness and recommend foundation work. |
| Guided multi-step AI readiness programme or full client pack across readiness, governance, content and chatbot | `lightspeed-ai-readiness` or `lightspeed-ai-readiness-orchestrator` | The user wants the full sequence managed rather than a single artefact. |
| Proposal-ready AI readiness recommendation, base package fit, governance/content/chatbot scope or commercial estimate position | `lightspeed-ai-readiness-estimator` | The ask is commercial scoping, proposal positioning or estimate calibration. |
| AI use cases, human review, approvals, roles, exclusions, policy matrix or operational rules | `ai-governance-documentor` | Governance is missing, risky or requested as the primary deliverable. |
| Website content requests, source-of-truth planning, content gaps, page briefs or client content collection | `content-collection-planner` | The next blocker is missing content, source material or approvals. |
| Chatbot purpose, scope, behaviour rules, fallback, escalation, privacy notes, prompt draft or launch tests | `ai-chatbot-planner` | Chatbot planning is appropriate and upstream readiness is acceptable. |
| Rough chatbot brief, evidence normalisation, approved-source strategy, governance rules and proposal-ready chatbot estimate | `chatbot-planning-orchestrator` | The chatbot request is messy, mixed with website evidence or needs planning plus estimate direction. |
| Chatbot estimate tightening, assumptions, exclusions and commercial recommendation | `chatbot-estimate-calibrator` | A chatbot plan exists but needs firmer proposal language or scope boundaries. |
| Weak chatbot brief needing the smallest discovery question set | `chatbot-discovery-question-prioritiser` | The team needs only high-value follow-up questions before planning. |
| FAQ consolidation, chatbot-safe FAQ register, schema-ready FAQs or approved answer sources | `lightspeed-faq-and-chatbot-source-curator` | Source content must be made safe and reusable for FAQs or chatbot grounding. |
| Page-level schema, answer-engine discoverability, internal linking, AI-search wording | `lightspeed-schema-and-ai-discoverability-planner` | The output is discoverability planning rather than chatbot behaviour. |
| Privacy/cookie/accessibility/AI governance/trust page wording | `lightspeed-policy-page-generator` | Public-facing policy or trust content is requested and needs review-safe wording. |
| Marketing claims, proof register, statistics, outcomes or chatbot-safe claim checks | `lightspeed-claim-register-auditor` | Claims need evidence classification before publication or chatbot use. |
| Launch checklist, form tracking, accessibility, analytics, redirects, SEO or go/no-go launch QA | `lightspeed-launch-readiness-auditor` | The project is approaching launch and needs final validation. |
| Post-launch chatbot/content optimisation, analytics-led backlog or monthly improvement plan | `post-launch-optimisation` | The project is live and needs ongoing improvement priorities. |

## Routing workflow

1. Restate the user's immediate ask in one sentence.
2. Identify the current project stage and likely project type.
3. Check whether upstream readiness, governance, source quality and escalation are sufficient for the requested output.
4. Choose the best specialist skill or a short sequence of skills.
5. Provide a team-usable routing note:
   - recommended skill
   - why that route fits
   - inputs to provide
   - expected output
   - blockers / risks
   - next prompt to run
6. If asked to produce the artefact now and the chosen specialist skill is clearly triggered, route into that specialist workflow rather than staying in this router.
7. When multiple outputs already exist, recommend or produce a combined project pack structure using `references/client-project-pack-outputs.md`.

## Stop and escalation rules

Pause for one focused clarification or route to governance before proceeding when:

- The user wants chatbot implementation but approved source content is missing.
- Data collection, lead capture, logging, personal data or CRM integration is mentioned but privacy handling is unclear.
- The sector appears regulated or sensitive.
- The requested output would make legal, financial, health or professional advice claims.
- A client-facing proposal is requested but scope, assumptions or exclusions are materially unclear.
- The user asks for factual claims, statistics or outcomes without evidence.

## Output requirements

For a routing answer, include:

```markdown
## Recommended route
- Skill: [skill name]
- Stage: [stage]
- Why: [short reason]
- Inputs needed: [bullets]
- Output to request: [deliverable]

## Gaps / risks
- [confirmed gap or assumption]

## Reusable next prompt
[copy-paste prompt for the LightSpeed team]
```

For a combined project pack, use the structure in `references/client-project-pack-outputs.md`.
For proposal or estimate notes, use `references/proposal-line-items.md`.
For detailed stage routing, use `references/workflow-router.md`.

## Consult references

- `references/workflow-router.md` for the stage decision tree and team-ready routing examples.
- `references/client-project-pack-outputs.md` for combined pack structure and README conventions.
- `references/proposal-line-items.md` for proposal and estimate line item framing.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
