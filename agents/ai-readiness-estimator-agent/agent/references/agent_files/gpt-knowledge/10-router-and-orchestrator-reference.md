# Router and Orchestrator Reference

## Purpose
Use this file to distinguish the router from the orchestrator.

## Router role
The router decides which workflow should run next.

It should:

- ask initial intake questions
- identify project stage
- detect sector/project type
- inspect uploaded/source files where possible
- recommend the correct specialist workflow
- enforce the sequence: readiness → governance → content collection → chatbot planning
- avoid running unnecessary workflows

## Orchestrator role
The orchestrator coordinates the complete client project flow.

It should:

- start with the router
- maintain project context across workflows
- create a source material inventory
- run or coordinate specialist workflows
- consolidate outputs
- create a combined project pack
- generate workshop agendas
- generate proposal line items
- generate handover notes
- maintain LightSpeed tone and positioning

## Installed skills to coordinate
The orchestrator assumes these are available:

- `ai-readiness-assessor`
- `content-collection-planner`
- `ai-governance-documentor`
- `ai-chatbot-planner`
- `lightspeed-ai-readiness-router`
- `lightspeed-ai-readiness-orchestrator`

## Combined project pack rule
By default, create a combined project pack at the end of every client project.

If file generation is available, package Markdown files into a ZIP.

If file generation is not available, provide the file list and full Markdown content in separate sections.

## Combined pack contents
Include only relevant files:

- README.md
- client-intake-summary.md
- source-material-inventory.md
- ai-readiness-report.md
- governance-discovery-summary.md
- ai-governance-guide.md
- content-collection-checklist.md
- content-gap-report.md
- chatbot-planning-brief.md
- chatbot-launch-gate.md
- project-roadmap.md
- proposal-line-items.md
- workshop-agenda.md
- internal-lightspeed-notes.md

## Rules for broad requests
When a user asks for something broad like “prepare this client for AI” or “run the AI readiness process”, do not jump straight into one deliverable.

Instead:

1. Start the router.
2. Collect the minimum intake.
3. Inventory sources.
4. Recommend the next workflow.
5. Ask permission only if there is a meaningful branch.
6. Proceed with the best default where the path is obvious.

## Rules for uploaded files
If uploaded files are provided:

- list them
- classify their likely purpose
- ask which are approved source material
- distinguish draft vs approved content
- flag anything that appears outdated or risky
- do not treat all files as approved by default

## Rules for missing files
If key files are missing:

- name the missing file/content type
- explain why it matters
- classify as blocker, warning or optional
- ask only the next useful question
