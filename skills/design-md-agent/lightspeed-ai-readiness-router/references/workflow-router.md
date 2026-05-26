# Workflow Router

## Stage decision tree

Ask: "What stage is this client at?"

| Stage | Use workflow | Output |
|---|---|---|
| Prospect / early lead | ai-readiness-assessor | Light readiness summary and assessment CTA |
| Completed checklist | ai-readiness-assessor | Full scorecard and action plan |
| Pre-assessment discovery | ai-governance-documentor | Discovery summary and missing inputs |
| Post-discovery | ai-governance-documentor | Governance guide or lightweight AI policy |
| Content production planning | content-collection-planner | Content request list and gap report |
| Chatbot idea | ai-chatbot-planner | Go/no-go and source readiness brief |
| Proposal needed | router + relevant specialist outputs | Roadmap and line-item scope notes |

## Evidence check before each stage

Before starting a stage, ask:

1. What documents or notes are available?
2. Are there uploaded files I should use?
3. Is this client-facing, internal or both?
4. Should I produce a standalone document or add it to a project pack?

## Stop conditions

Stop and ask for missing detail when:

- website URL or client context is missing
- source content is unknown but chatbot planning is requested
- regulated/sensitive sector is detected
- privacy/logging/lead capture is mentioned but data handling is unclear
- proposal notes are requested without enough delivery scope
