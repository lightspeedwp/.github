---
name: lightspeed-claim-register-auditor
description: validate proof, statistics, outcomes and marketing claims before publication for lightspeed wordpress, woocommerce, ai-readiness, publishing, tourism and professional-services website projects. use when the user asks to audit claims, classify stats, create a claim register, approve wording, reject risky wording, identify evidence needed, map claims to page locations, assign review owners, set review dates, or decide whether claims are chatbot-safe.
---

# LightSpeed Claim Register Auditor

## Purpose

Validate proof, stats, performance claims, AI claims, service claims and policy-adjacent wording before publication.

Use this skill when website copy, sales pages, FAQs, case studies, policy pages, chatbot sources or proposal content contain claims that need approval, softer wording, evidence or removal.

## Core rule

Do not treat a claim as publish-ready unless it has clear source evidence and safe wording.

If evidence is missing or the claim could create legal, privacy, compliance, accessibility, SEO, AI, performance or commercial risk, classify it conservatively and explain what evidence or review is needed.

## Classification labels

Use exactly these labels:

- `Publish-ready`
- `Publish with careful wording`
- `Evidence required`
- `Remove`
- `Legal/privacy review`

## Inputs to accept

Accept any combination of:

- website content drafts
- stats files
- service pages
- solution pages
- case-study drafts
- FAQ sets
- AI governance notes
- policy drafts
- analytics reports
- Lighthouse or PageSpeed results
- Search Console or GA4 exports
- client approval notes
- source-of-truth registers

## Workflow

1. Identify each explicit or implied claim.
2. Classify the claim type.
3. Check available evidence.
4. Assess publication risk.
5. Assign a classification label.
6. Rewrite wording where safer wording is possible.
7. Record evidence needed where proof is missing.
8. Map the claim to page location or intended use.
9. Assign review owner and review date if supplied or infer a sensible owner label.
10. Mark chatbot suitability.
11. Produce the required outputs.

## Required outputs

Always produce:

- claim register
- approved wording list
- rejected wording list
- evidence needed list
- page location map
- review owner table
- review date table
- chatbot-safe status notes
- publication summary

For larger projects, create numbered Markdown files and a README index.

## Claim type guidance

Consult:

- `references/claim-types.md` for common claim categories.
- `references/classification-rules.md` for label rules.
- `references/evidence-standards.md` for acceptable evidence.
- `references/approved-wording-rules.md` for safer rewrites.
- `references/chatbot-claim-rules.md` for chatbot suitability.
- `references/report-template.md` for output structure.

## Output standard

Use UK English. Keep outputs practical, direct and non-alarmist. Separate public-facing wording from internal notes. Avoid hype, guarantees and unsupported certainty.

## Legal/privacy note

For legal, privacy, accessibility, compliance, data protection, regulated-sector, chatbot logging or policy-adjacent claims, include this note:

> This output supports operational review and publication planning. It is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser before publication.
