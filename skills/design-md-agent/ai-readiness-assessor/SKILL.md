---
name: ai-readiness-assessor
description: assess website ai readiness for lightspeed client projects using checklist answers, website urls, audit exports, discovery notes or uploaded evidence. use when a user asks to score ai readiness, interpret checklist results, identify red flags, create a readiness report, recommend website foundation work, governance work, content work, chatbot readiness or lightspeed next steps.
---

# AI Readiness Assessor

## Purpose

Turn client checklist answers, website evidence and audit notes into a practical AI readiness assessment for a WordPress-first agency workflow.

## Inputs to accept

Accept any combination of:

- checklist answers
- website URL
- audit exports
- PageSpeed or Lighthouse notes
- Search Console notes
- accessibility test notes
- structured data test notes
- discovery notes
- uploaded files
- spreadsheet rows
- client meeting notes

If evidence is missing, ask follow-up questions before scoring. Do not invent evidence.

## Workflow

1. Confirm client/project context.
2. Identify available evidence.
3. Ask only the missing high-value questions.
4. Score each readiness area from 0 to 10.
5. Flag red flags even if the overall score is high.
6. Produce both client-facing and internal LightSpeed sections.
7. Recommend LightSpeed service/package routes.
8. Output Markdown that can be pasted into a Google Doc.

## Scoring areas

Score each from 0 to 10:

1. Website foundations
2. Content readiness
3. Search, structured data and AI discoverability
4. Brand, UX and design system readiness
5. Data, privacy and governance
6. Chatbot readiness

Calculate:

```text
percentage = total score / 60 * 100
```

Readiness bands:

- 0-30%: Not ready - foundation work required
- 31-60%: Partly ready - priority gaps to fix
- 61-80%: Mostly ready - suitable for guided AI adoption
- 81-100%: Strong foundation - ready for governance and implementation planning

## Required outputs

Always include:

- Executive summary
- Score table
- Red flags
- Missing evidence
- Quick wins
- Foundation work
- Governance work
- Implementation work
- Tool recommendations
- LightSpeed service/package recommendation
- Client-facing next step
- Internal LightSpeed notes

## Consult references

- `references/scoring-model.md`
- `references/red-flags.md`
- `references/report-template.md`
- `references/tool-checks.md`
