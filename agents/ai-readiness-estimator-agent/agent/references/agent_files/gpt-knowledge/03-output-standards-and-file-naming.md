# Output Standards and File Naming

## Default format

Use Markdown by default.

The output should be easy to paste into Google Docs, GitHub, Notion or future PDF/DOCX conversion.

## Standard output structure

For every substantial output, use:

1. 3-bullet summary
   - Value
   - Risk
   - Next step
2. Project context
   - Client
   - Website
   - Sector
   - Stage
   - Desired output
   - Source materials used
3. Findings or discovery summary
4. Risks and red flags
5. Recommendations
6. Numbered actions
7. Deliverables
8. Open questions
9. Internal LightSpeed notes
10. Suggested next meeting agenda
11. Suggested filenames

## Client-facing output rules

Client-facing outputs should be:

- polished
- practical
- less technical
- clear about why recommendations matter
- careful around legal/privacy language
- non-alarmist
- suitable for Google Docs or PDF conversion

## Internal LightSpeed notes

Internal notes should include:

- sales positioning
- delivery risk
- service/package fit
- dependencies
- suggested next action
- handover notes for developers and designers where relevant

## Filename convention

Use lowercase kebab-case.

Pattern:

```text
client-slug-yyyy-mm-dd-deliverable-name.md
```

Examples:

```text
acme-2026-04-26-ai-readiness-report.md
acme-2026-04-26-governance-discovery-summary.md
acme-2026-04-26-ai-governance-guide.md
acme-2026-04-26-content-collection-checklist.md
acme-2026-04-26-content-gap-report.md
acme-2026-04-26-chatbot-planning-brief.md
acme-2026-04-26-chatbot-launch-gate.md
acme-2026-04-26-project-roadmap.md
acme-2026-04-26-workshop-agenda.md
acme-2026-04-26-proposal-line-items.md
acme-2026-04-26-internal-notes.md
```

## Combined project pack structure

When creating a combined pack, include only relevant documents.

Default pack:

```text
client-slug-ai-readiness-pack/
├── README.md
├── client-intake-summary.md
├── source-material-inventory.md
├── ai-readiness-report.md
├── governance-discovery-summary.md
├── ai-governance-guide.md
├── content-collection-checklist.md
├── content-gap-report.md
├── chatbot-planning-brief.md
├── chatbot-launch-gate.md
├── project-roadmap.md
├── proposal-line-items.md
├── workshop-agenda.md
└── internal-lightspeed-notes.md
```

## Workshop-ready outputs

When creating workshop outputs, include:

- workshop purpose
- attendees
- pre-reading
- agenda
- discovery questions
- decisions needed
- exercises
- risks to discuss
- outputs expected
- follow-up actions

## Developer/designer handover notes

When creating handover notes, include:

- project context
- relevant source materials
- design system links
- Figma URL
- GitHub repositories
- WordPress assumptions
- content model notes
- template, block and pattern implications
- accessibility risks
- performance risks
- chatbot implementation notes if relevant
- open questions
- next technical action

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
