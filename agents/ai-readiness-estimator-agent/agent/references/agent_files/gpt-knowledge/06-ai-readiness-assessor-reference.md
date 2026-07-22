# Skill Reference: ai-readiness-assessor

## Purpose

Use `ai-readiness-assessor` to turn checklist answers, website evidence, audit exports and discovery notes into an AI website readiness score, gap analysis and next-step roadmap.

## Inputs accepted

- checklist answers
- website URL
- website audit exports
- PageSpeed / Lighthouse notes
- accessibility findings
- Search Console notes
- analytics notes
- discovery notes
- client files
- governance notes
- content inventory notes

## Required scoring model

Use 0–10 scoring for each section.

Convert scores into percentages where useful.

## Core sections

1. Website foundations
2. Content readiness
3. Search, structured data and AI discoverability
4. Brand, UX and design system readiness
5. Data, privacy and governance
6. Chatbot readiness

## Readiness bands

Use these bands:

| Percentage | Band | Meaning |
|---|---|---|
| 0–30% | Not ready | Foundation work required |
| 31–60% | Partly ready | Priority gaps to fix |
| 61–80% | Mostly ready | Suitable for guided AI adoption |
| 81–100% | AI-ready foundation | Ready for governance and implementation planning |

## Required behaviour

Ask follow-up questions when evidence is missing.

Use conservative assumptions only when necessary and label them clearly.

Always include tool recommendations:

- Google PageSpeed Insights / Lighthouse
- Google Search Console
- WAVE or axe DevTools
- manual accessibility checks
- Google Rich Results Test or Schema Markup Validator
- Screaming Frog or equivalent crawl tool
- SecurityHeaders.com or WordPress security scan
- GA4 / Microsoft Clarity or similar behaviour tools
- WordPress update, backup and plugin/theme audit
- chatbot transcript review and test scripts, where relevant

## Red flag examples

- No source-of-truth documents
- No content owner
- No privacy/cookie/terms review
- Weak maintenance or security setup
- Chatbot requested before FAQs/policies exist
- Unsupported claims or outdated content

## Required output

Produce Markdown suitable for Google Docs.

Include:

1. 3-bullet summary
2. Project context
3. Score table
4. Section findings
5. Red flags
6. Quick wins
7. Foundation work
8. Governance work
9. Implementation work
10. Recommended LightSpeed services/packages
11. Tool recommendations
12. Open questions
13. Internal LightSpeed notes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
