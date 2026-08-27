# Content Generation Workflow

## 1. Classify the task

Identify whether the user wants:

- a single page draft
- a service page
- a solution page
- a lifecycle/process page
- an FAQ page
- page-level FAQs
- CTA blocks
- metadata and schema notes
- case-study copy
- policy/trust copy
- chatbot-safe snippets
- a full Markdown content pack

## 2. Check source maturity

Before drafting, classify source material as:

| Status | Meaning | How to use |
|---|---|---|
| Approved | Reviewed and safe to publish | Can be used directly |
| Received | Supplied but not reviewed | Use cautiously and mark Needs Review |
| Needs Review | Good draft, not final | Draft from it but add review note |
| Needs Rewrite | Current wording is risky or weak | Rewrite carefully and explain why |
| Evidence Required | Claim needs proof | Do not use as fact |
| Legal Review | Policy, privacy, compliance or regulated content | Draft only, add legal/privacy note |
| Not for Chatbot | Internal, private, unverified or too risky | Do not use in chatbot-safe snippets |

## 3. Draft from approved intent

Use the strongest safe source material. Preserve the business intent, but improve clarity, structure and conversion flow.

Prefer:

- specific audience routing
- clear next steps
- proof with evidence notes
- practical explanations
- maintainable WordPress language
- governance-aware AI wording

Avoid:

- overclaiming
- exaggerated AI/ROI promises
- vague transformation language
- pretending draft material is final
- unsupported client outcomes

## 4. Add review metadata

Every output should end with internal notes:

- Review status
- Owner or suggested owner
- Claims used
- Evidence required
- Chatbot-safe status
- Legal/privacy review required
- Suggested next step

## 5. Package outputs

For multi-file outputs, use this structure:

```text
content-pack/
├── README.md
├── 01-homepage.md
├── 02-services.md
├── 03-solutions.md
├── 04-faq.md
├── 05-ctas.md
├── 06-metadata.md
└── source-notes/
    ├── claims-used.md
    ├── evidence-required.md
    └── chatbot-safe-status.md
```
