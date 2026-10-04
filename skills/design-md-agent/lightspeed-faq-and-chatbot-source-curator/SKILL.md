---
name: lightspeed-faq-and-chatbot-source-curator
description: curate page-level faqs into a company faq page, schema-ready faq sets and chatbot-safe source registers for lightspeed wordpress website projects. use when the user asks to consolidate faqs, deduplicate faq content, map faqs to pages, create chatbot-safe faq registers, identify unsupported questions, define escalation questions, prepare faqpage schema notes or turn approved website content into safe chatbot grounding material.
---

# LightSpeed FAQ and Chatbot Source Curator

## Purpose

Turn page-level FAQs, approved website pages, content collection outputs and governance notes into a company FAQ page and chatbot-safe source set.

Use this skill after content collection, website content generation, AI readiness or chatbot planning has produced page drafts, FAQs, source notes, claim registers or chatbot launch gates.

## Core rule

Do not make draft, private, unverified or unsupported material chatbot-safe.

A FAQ or source is chatbot-safe only when it is:

- public or intended for public use
- approved for public use by a named reviewer or role
- current
- owned by a named reviewer or role
- free from unsupported claims
- not legal, privacy, compliance or security advice unless approved policy wording exists
- suitable for reuse by a public website assistant

Two status fields are in play, and they use different vocabularies. Keep them separate:

- **Review status** (the curation state of the source) is `Approved`, `Needs Review`, `Evidence Required` or `Legal Review`. See `references/faq-taxonomy.md`.
- **Chatbot-safe status** (whether a chatbot may quote it) is `Chatbot Safe`, `Chatbot Safe After Review`, `Not for Chatbot`, `Legal Review Required`, `Evidence Required` or `Escalate to Human`. See `references/chatbot-safe-source-rules.md`.

If evidence is missing, the item is never `Chatbot Safe`: record the review status that applies and the chatbot-safe status that follows from it. Never promote an item to `Chatbot Safe After Review` on your own — that status asserts a review has happened, and only the named owner can confirm it.

## Inputs to accept

Accept any combination of:

- page-level FAQs
- company FAQ drafts
- content collection checklists
- page briefs
- source-of-truth registers
- claim registers
- approved website copy
- AI governance notes
- privacy/cookie/accessibility policy drafts
- chatbot planning briefs
- support or sales question lists
- analytics/search query exports

## Outputs to generate

Generate:

- company FAQ page
- page-level FAQ map
- duplicate FAQ report
- chatbot-safe FAQ register
- chatbot-safe source register
- unsupported questions list
- escalation question list
- schema-ready FAQ answers
- FAQ schema map
- source approval notes
- launch readiness notes for chatbot grounding

## Workflow

1. Identify all supplied FAQ and source material.
2. Group questions by theme, audience and page type.
3. Deduplicate overlapping questions.
4. Rewrite repeated or weak questions into clearer company-level FAQs.
5. Map each FAQ to a source page, owner, review status and schema suitability.
6. Mark chatbot-safe status using the rules in `references/chatbot-safe-source-rules.md`.
7. Create unsupported and escalation question lists.
8. Create schema-ready FAQ answers only for visible public FAQs.
9. Separate public-facing FAQ copy from internal governance notes.
10. Recommend next actions before launch or chatbot pilot.

## Required output sections

For full FAQ/source packs, include:

- company FAQ page
- page-level FAQ map
- duplicate FAQ report
- chatbot-safe FAQ register
- unsupported questions list
- escalation question list
- FAQ schema map
- source-of-truth notes
- launch readiness notes
- internal LightSpeed notes

For single-page FAQ work, include:

- approved/recommended FAQs
- questions to remove or merge
- schema suitability
- chatbot-safe status
- internal review notes

## Reference loading

Use these references as needed:

- `references/faq-curation-workflow.md` for the full process.
- `references/chatbot-safe-source-rules.md` for chatbot-safety decisions.
- `references/faq-taxonomy.md` for grouping and page mapping.
- `references/schema-ready-faq-rules.md` for FAQPage schema guidance.
- `references/escalation-and-unsupported-rules.md` for restricted topics and fallback logic.
- `references/report-templates.md` for output structures.

## Quality standard

Use UK English. Keep answers clear, practical and concise. Avoid hype, unsupported guarantees, invented claims and legal/privacy advice. Prefer answer-first wording that can work for users, search engines and AI systems.

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
