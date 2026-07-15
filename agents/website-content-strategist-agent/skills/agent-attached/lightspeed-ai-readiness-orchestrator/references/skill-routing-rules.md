# Skill Routing Rules

## Core rule

Always start with the router logic. Route into a specialist workflow only after identifying the client context, project stage, available source material and desired output.

## Workflow sequence

1. AI Readiness Assessor
2. AI Governance Documentor
3. Content Collection Planner
4. AI Chatbot Planner
5. Roadmap or proposal pack

## Routing matrix

| User need | Route to | Notes |
|---|---|---|
| "Is this website ready for AI?" | ai-readiness-assessor | Score readiness, red flags and next steps. |
| "Create a readiness report" | ai-readiness-assessor | Use 0-10 scoring and Markdown report output. |
| "We need an AI policy" | ai-governance-documentor | Create lightweight policy and operational playbook. |
| "Define governance rules" | ai-governance-documentor | Include owners, approvals, source-of-truth, matrix and disclaimer. |
| "What content do we need from the client?" | content-collection-planner | Generate checklist, folder structure and request email. |
| "What content is missing?" | content-collection-planner | Produce content gap report from supplied files or notes. |
| "Plan a chatbot" | ai-chatbot-planner | Require content quality and governance context first. |
| "Use AI Engine" | ai-chatbot-planner | Include AI Engine implementation notes after source/gov checks. |
| "Start a new project" | lightspeed-ai-readiness-router | Run the full wizard and route progressively. |

## When to ask more questions

Ask follow-up questions when:

- source files are missing
- the website URL is missing
- project stage is unclear
- desired output is unclear
- the sector may be high-risk
- client wants chatbot implementation but FAQs or policies are weak
- there is no content owner or approval path
- legal/privacy content is missing or outdated

## When to stop or warn

Do not continue directly into chatbot implementation if:

- approved sources do not exist
- the source list is mostly draft or outdated
- no escalation route exists
- privacy/cookie/terms content is missing in a data-collection flow
- the client operates in a strict-mode sector and governance has not been completed

Provide a warning and recommend governance/content foundation work first.
