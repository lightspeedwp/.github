# Workflow Map and Routing Rules

## Purpose

Use this file to decide which specialist skill or workflow should run next during a client AI readiness project.

## Default sequence

1. Start with `lightspeed-ai-readiness-router`.
2. Run `ai-readiness-assessor` if the client has not yet been assessed.
3. Run `ai-governance-documentor` when governance, approval, AI use cases or policy questions are relevant.
4. Run `content-collection-planner` before production, content work or chatbot work.
5. Run `ai-chatbot-planner` only after governance and source content quality are understood.
6. Produce a combined project pack or proposal-ready roadmap when the user requests a full deliverable.

## Routing decision table

| User need | Use this workflow | Notes |
|---|---|---|
| “Assess if this website is ready for AI” | `ai-readiness-assessor` | Use 0–10 scoring and ask for evidence where missing. |
| “Create an AI governance guide” | `ai-governance-documentor` | Combine discovery and final documentation. |
| “What content do we need from the client?” | `content-collection-planner` | Include generic website checklist and sector add-ons. |
| “Plan a chatbot” | `ai-chatbot-planner` | Run content collection first unless completed. |
| “I have a new client; where do I start?” | `lightspeed-ai-readiness-router` | Intake, source inventory, workflow recommendation. |
| “Create a full project pack” | `lightspeed-ai-readiness-orchestrator` | Produce multiple Markdown files and ZIP if possible. |
| “Prepare a proposal/roadmap” | Router + assessor + governance | Include line items, effort bands and dependencies. |
| “Review uploaded client files” | Router | Create source material inventory first. |

## Stage-based routing

### New lead

Start with:

1. Router
2. Readiness assessor
3. Light content/governance summary
4. Proposal-ready next step

### Existing client

Start with:

1. Router
2. Source inventory
3. Readiness or governance workflow depending on immediate need

### Retainer client

Start with:

1. Router
2. Current-state review
3. Governance/documentation or chatbot review
4. Monthly/quarterly improvement plan

### Internal LightSpeed initiative

Start with:

1. Router
2. Define internal target output
3. Use specialist workflows as needed
4. Produce reusable templates or team guidance

## Minimum project intake

Collect:

- Client name
- Website URL
- Sector / industry
- Project type
- Project stage
- Lead/existing/retainer/internal status
- Main business goal
- Main concern about AI
- Desired output
- Budget or timeline constraints, if known
- Available source files
- Figma design system URL, if available
- GitHub repositories, if relevant
- Related URLs: staging, analytics, Search Console, CRM, ecommerce, LMS, booking, helpdesk, knowledge base, ad platform
- Stakeholders and approvers
- High-risk or regulated context

## Source material inventory rules

Before running a specialist workflow, ask what source material exists.

When files or links are provided, create an inventory with:

- File/source name
- Source type
- Owner, if known
- Status: approved, draft, outdated, unknown, risky
- Relevant workflow: readiness, governance, content collection, chatbot, proposal
- Source-of-truth status
- Chatbot-grounding safety
- Missing follow-up questions

If source quality is uncertain, ask focused follow-up questions.

Do not invent evidence.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
