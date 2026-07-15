# Combined Client Project Pack Outputs

Use this structure when enough specialist outputs exist to assemble a LightSpeed AI readiness project pack.

```text
[client-slug]-ai-readiness-pack/
├── README.md
├── 00-source-register.md
├── 01-ai-readiness-assessment.md
├── 02-governance-discovery-summary.md
├── 03-content-collection-checklist.md
├── 04-ai-governance-guide.md
├── 05-faq-and-source-curation.md
├── 06-chatbot-planning-brief.md
├── 07-roadmap-and-proposal-notes.md
└── source-notes/
    ├── evidence-reviewed.md
    ├── missing-information.md
    ├── assumptions-and-risks.md
    └── approval-gates.md
```

## README template

```markdown
# [Client Name] - AI Readiness Project Pack

## Purpose

This pack summarises the current AI readiness position, governance requirements, content and source readiness, chatbot planning recommendations, and proposal-ready next steps.

## Audience

- Internal LightSpeed delivery team
- Client stakeholders, where marked client-facing

## Files

1. Source register
2. AI readiness assessment
3. Governance discovery summary
4. Content collection checklist
5. AI governance guide
6. FAQ and source curation notes
7. Chatbot planning brief
8. Roadmap and proposal notes

## Evidence status

- Approved sources: [list]
- Client-provided but unverified: [list]
- Internal drafts: [list]
- Missing / requested: [list]

## Recommended next step

[Insert recommended LightSpeed next step and responsible role.]

## Review notes

This pack supports operational planning and proposal preparation. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.
```

## Source register fields

Use these fields when creating or requesting a source register:

| Field | Purpose |
|---|---|
| Source name | Human-readable source title. |
| Source type | Website page, Google Doc, spreadsheet, transcript, email, ticket, Figma, GitHub issue, analytics export or other. |
| Owner | Client, LightSpeed, third party or unknown. |
| Status | Approved, client-provided, internal draft, stale, inferred, missing or unverified. |
| Last reviewed | Date or `unknown`. |
| Used for | Readiness, governance, content, FAQ, chatbot, schema, claims, proposal or launch QA. |
| Risk notes | Any accuracy, freshness, privacy, claims or approval concerns. |

## Pack assembly rules

- Keep internal-only caveats out of client-facing sections unless they are appropriate to share.
- Do not hide missing evidence. Put it in `missing-information.md` and summarise the impact.
- Include assumptions and exclusions in proposal notes, not only in internal source notes.
- Link each recommended next action to a responsible role or team where possible.
