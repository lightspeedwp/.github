# LightSpeed AI Readiness Agent Knowledge Upload Guide

## Purpose

This folder contains the clean Markdown knowledge files for the **LightSpeed AI Readiness Orchestrator** Custom GPT-style agent.

The agent is designed to coordinate these installed skills:

- `ai-readiness-assessor`
- `content-collection-planner`
- `ai-governance-documentor`
- `ai-chatbot-planner`
- `lightspeed-ai-readiness-router`
- `lightspeed-ai-readiness-orchestrator`

## Recommended upload approach

Upload the Markdown files in this folder individually to the Custom GPT Knowledge area.

Do not rely on the ZIP file itself as the knowledge source. Use the ZIP for transport and storage, then unzip it and upload the individual `.md` files.

## Recommended Custom GPT configuration

### Name

LightSpeed AI Readiness Orchestrator

### Description

Routes LightSpeed client AI readiness projects through readiness assessment, governance documentation, content collection and chatbot planning workflows. Produces practical Markdown reports, checklists, governance guides, workshop agendas, proposal-ready roadmaps and project packs.

### Capabilities to enable

- File uploads / document analysis
- Code Interpreter & Data Analysis, if available, for generating downloadable Markdown/ZIP project packs
- Web browsing only when current public information is required

### Core instruction placement

Put behaviour rules in the Custom GPT **Instructions** field, not only in Knowledge.

Use these Knowledge files as reference material for routing logic, workflow detail, output formats and templates.

## Recommended upload order

1. `01-custom-gpt-instructions.md`
2. `02-workflow-map-and-routing.md`
3. `03-output-standards-and-file-naming.md`
4. `04-ri[REDACTED OPENAI API KEY].md`
5. `05-service-positioning-and-proposal-line-items.md`
6. `06-ai-readiness-assessor-reference.md`
7. `07-ai-governance-documentor-reference.md`
8. `08-content-collection-planner-reference.md`
9. `09-ai-chatbot-planner-reference.md`
10. `10-router-and-orchestrator-reference.md`
11. `11-wizard-prompts.md`
12. `12-output-templates.md`
13. `13-platform-adapters.md`
14. `14-source-frameworks.md`

## First test prompt

```markdown
Start a new AI readiness project for a test client.

Client: Example Safari Co
Website: https://example.com
Sector: Tourism / tour operator
Project stage: New lead
Available materials: website URL only
Desired output: readiness assessment followed by content collection plan
Budget/timeline: unknown
Figma design system: not yet available
GitHub repository: not yet available

Use the LightSpeed AI Readiness Router first, then tell me which specialist skill workflow should run next.
```

## Maintenance guidance

Update this knowledge pack whenever:

- The LightSpeed AI Readiness process changes
- A new specialist skill is added
- Service/package names change
- Chatbot platform preference changes
- Governance or legal risk wording changes
- Output formats need refinement

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
